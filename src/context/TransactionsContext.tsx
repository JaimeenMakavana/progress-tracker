"use client";
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { Transaction, TransactionStats } from "../types";
import {
  calculateTransactionStats,
  parseCsvToTransactions,
  exportTransactionsToCsv,
} from "../utils/transactions";

interface TransactionsState {
  transactions: Transaction[];
  stats: TransactionStats;
  isLoading: boolean;
  error: string | null;
}

type TransactionsAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_TRANSACTIONS"; payload: Transaction[] }
  | { type: "ADD_TRANSACTIONS"; payload: Transaction[] }
  | { type: "UPDATE_TRANSACTION"; payload: Transaction }
  | { type: "DELETE_TRANSACTION"; payload: string }
  | { type: "CLEAR_TRANSACTIONS" };

interface TransactionsContextType {
  state: TransactionsState;
  addTransactions: (transactions: Transaction[]) => void;
  updateTransaction: (transaction: Transaction) => void;
  deleteTransaction: (id: string) => void;
  clearTransactions: () => void;
  importFromCsv: (csvData: string) => Promise<void>;
  exportToCsv: () => string;
  refreshStats: () => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

const initialState: TransactionsState = {
  transactions: [],
  stats: {
    totalIncome: 0,
    totalExpense: 0,
    netAmount: 0,
    transactionCount: 0,
    platformBreakdown: {},
    categoryBreakdown: {},
  },
  isLoading: false,
  error: null,
};

function transactionsReducer(
  state: TransactionsState,
  action: TransactionsAction
): TransactionsState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };

    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload,
        stats: calculateTransactionStats(action.payload),
        isLoading: false,
        error: null,
      };

    case "ADD_TRANSACTIONS":
      const newTransactions = [...state.transactions, ...action.payload];
      return {
        ...state,
        transactions: newTransactions,
        stats: calculateTransactionStats(newTransactions),
        isLoading: false,
        error: null,
      };

    case "UPDATE_TRANSACTION":
      const updatedTransactions = state.transactions.map((t) =>
        t.id === action.payload.id ? action.payload : t
      );
      return {
        ...state,
        transactions: updatedTransactions,
        stats: calculateTransactionStats(updatedTransactions),
        error: null,
      };

    case "DELETE_TRANSACTION":
      const filteredTransactions = state.transactions.filter(
        (t) => t.id !== action.payload
      );
      return {
        ...state,
        transactions: filteredTransactions,
        stats: calculateTransactionStats(filteredTransactions),
        error: null,
      };

    case "CLEAR_TRANSACTIONS":
      return {
        ...state,
        transactions: [],
        stats: {
          totalIncome: 0,
          totalExpense: 0,
          netAmount: 0,
          transactionCount: 0,
          platformBreakdown: {},
          categoryBreakdown: {},
        },
        error: null,
      };

    default:
      return state;
  }
}

export function TransactionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(transactionsReducer, initialState);

  // Load transactions from localStorage on mount
  useEffect(() => {
    const loadTransactions = () => {
      try {
        const saved = localStorage.getItem("transactions");
        if (saved) {
          const transactions = JSON.parse(saved);
          dispatch({ type: "SET_TRANSACTIONS", payload: transactions });
        }
      } catch (error) {
        console.error("Error loading transactions:", error);
        dispatch({ type: "SET_ERROR", payload: "Failed to load transactions" });
      }
    };

    loadTransactions();
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (state.transactions.length > 0) {
      try {
        localStorage.setItem(
          "transactions",
          JSON.stringify(state.transactions)
        );
      } catch (error) {
        console.error("Error saving transactions:", error);
      }
    }
  }, [state.transactions]);

  const addTransactions = (transactions: Transaction[]) => {
    dispatch({ type: "ADD_TRANSACTIONS", payload: transactions });
  };

  const updateTransaction = (transaction: Transaction) => {
    dispatch({ type: "UPDATE_TRANSACTION", payload: transaction });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  };

  const clearTransactions = () => {
    dispatch({ type: "CLEAR_TRANSACTIONS" });
    localStorage.removeItem("transactions");
  };

  const importFromCsv = async (csvData: string) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const transactions = parseCsvToTransactions(csvData);
      dispatch({ type: "ADD_TRANSACTIONS", payload: transactions });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to import CSV";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    }
  };

  const exportToCsv = () => {
    return exportTransactionsToCsv(state.transactions);
  };

  const refreshStats = () => {
    dispatch({ type: "SET_TRANSACTIONS", payload: state.transactions });
  };

  const value: TransactionsContextType = {
    state,
    addTransactions,
    updateTransaction,
    deleteTransaction,
    clearTransactions,
    importFromCsv,
    exportToCsv,
    refreshStats,
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider"
    );
  }
  return context;
}
