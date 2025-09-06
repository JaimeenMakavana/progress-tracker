"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTransactions } from "../../context/TransactionsContext";
import { TransactionTable, TransactionImport } from "../../components";
import { Transaction } from "../../types";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  Upload,
  Receipt,
} from "lucide-react";

export default function ExpensesPage() {
  const { state, addTransactions, deleteTransaction, exportToCsv } =
    useTransactions();
  const [showImportModal, setShowImportModal] = useState(false);

  const handleImport = (transactions: Transaction[]) => {
    addTransactions(transactions);
    setShowImportModal(false);
  };

  const handleEdit = (transaction: Transaction) => {
    // TODO: Implement transaction editing functionality
    console.log("Edit transaction:", transaction);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
    }
  };

  const handleExport = () => {
    const csvData = exportToCsv();
    const blob = new Blob([csvData], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const { stats } = state;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {state.transactions.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="blue-card p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-4 bg-green-500 rounded-xl">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <div className="ml-3 sm:ml-4">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Income
                  </p>
                  <p className="text-xl sm:text-3xl font-bold text-green-600">
                    ₹{stats.totalIncome.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="blue-card p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-4 bg-red-500 rounded-xl">
                  <TrendingDown className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Expense
                  </p>
                  <p className="text-3xl font-bold text-red-600">
                    ₹{stats.totalExpense.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="blue-card p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-4 bg-primary rounded-xl">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Net Amount
                  </p>
                  <p
                    className={`text-3xl font-bold ${
                      stats.netAmount >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹{stats.netAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="blue-card p-4 sm:p-6">
              <div className="flex items-center">
                <div className="p-4 bg-gray-100 rounded-xl">
                  <Receipt className="w-8 h-8 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    Total Transactions
                  </p>
                  <p className="text-3xl font-bold text-black">
                    {stats.transactionCount}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                Transaction History
              </h2>
              <p className="text-gray-600">
                {state.transactions.length > 0
                  ? `Manage and analyze your ${state.transactions.length} transactions`
                  : "Import your transaction data to get started"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="btn-primary flex items-center justify-center gap-2 px-4 sm:px-6 py-3 whitespace-nowrap"
              >
                <Upload className="w-5 h-5" />
                <span className="hidden sm:inline">Import Transactions</span>
                <span className="sm:hidden">Import</span>
              </button>
              {state.transactions.length > 0 && (
                <button
                  onClick={handleExport}
                  className="px-4 sm:px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">Export</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Transaction Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {state.transactions.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-success/10 rounded-2xl flex items-center justify-center">
                <Receipt className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-3">
                No transactions yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Import your transaction data from PhonePe, Google Pay, Paytm, or
                bank statements to start tracking your expenses and income.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="btn-primary px-8 py-4 text-lg"
                >
                  Import Your First Transaction
                </button>
                <button className="px-8 py-4 text-lg font-semibold text-black border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all duration-300">
                  Learn How to Export
                </button>
              </div>
            </div>
          ) : (
            <TransactionTable
              transactions={state.transactions}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </motion.div>

        {/* Import Modal */}
        {showImportModal && (
          <TransactionImport
            onImport={handleImport}
            onClose={() => setShowImportModal(false)}
          />
        )}
      </div>
    </div>
  );
}
