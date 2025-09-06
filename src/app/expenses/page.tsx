"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTransactions } from "../../context/TransactionsContext";
import { TransactionTable, TransactionImport } from "../../components";
import { Transaction } from "../../types";

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
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
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
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
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
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
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
                  <svg
                    className="w-8 h-8 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
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
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                  />
                </svg>
                <span className="hidden sm:inline">Import Transactions</span>
                <span className="sm:hidden">Import</span>
              </button>
              {state.transactions.length > 0 && (
                <button
                  onClick={handleExport}
                  className="px-4 sm:px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
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
                <svg
                  className="w-12 h-12 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
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
