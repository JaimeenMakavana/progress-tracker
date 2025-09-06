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
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-4 lg:py-6">
        {/* Stats Cards */}
        {state.transactions.length > 0 && (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="blue-card p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="p-3 sm:p-4 bg-green-500 rounded-xl flex-shrink-0">
                  <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Total Income
                  </p>
                  <p className="text-lg sm:text-xl lg:text-3xl font-bold text-green-600">
                    ₹{stats.totalIncome.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="blue-card p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="p-3 sm:p-4 bg-red-500 rounded-xl flex-shrink-0">
                  <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Total Expense
                  </p>
                  <p className="text-lg sm:text-xl lg:text-3xl font-bold text-red-600">
                    ₹{stats.totalExpense.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="blue-card p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="p-3 sm:p-4 bg-[#2C3930] rounded-xl flex-shrink-0">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Net Amount
                  </p>
                  <p
                    className={`text-lg sm:text-xl lg:text-3xl font-bold ${
                      stats.netAmount >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ₹{stats.netAmount.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="blue-card p-3 sm:p-4 lg:p-6">
              <div className="flex items-center">
                <div className="p-3 sm:p-4 bg-gray-100 rounded-xl flex-shrink-0">
                  <Receipt className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                    Total Transactions
                  </p>
                  <p className="text-lg sm:text-xl lg:text-3xl font-bold text-black">
                    {stats.transactionCount}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions Bar */}
        <motion.div
          className="mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-center lg:text-left">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black mb-2">
                Transaction History
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {state.transactions.length > 0
                  ? `Manage and analyze your ${state.transactions.length} transactions`
                  : "Import your transaction data to get started"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full lg:w-auto">
              <button
                onClick={() => setShowImportModal(true)}
                className="btn-primary flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 whitespace-nowrap text-sm sm:text-base"
              >
                <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Import Transactions</span>
                <span className="sm:hidden">Import</span>
              </button>
              {state.transactions.length > 0 && (
                <button
                  onClick={handleExport}
                  className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
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
            <div className="text-center py-12 sm:py-16 lg:py-20">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-[#2C3930]/10 to-green-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <Receipt className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#2C3930]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-2 sm:mb-3">
                No transactions yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                Import your transaction data from PhonePe, Google Pay, Paytm, or
                bank statements to start tracking your expenses and income.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
                <button
                  onClick={() => setShowImportModal(true)}
                  className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg w-full sm:w-auto"
                >
                  Import Your First Transaction
                </button>
                <button className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-black border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all duration-300 w-full sm:w-auto">
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
