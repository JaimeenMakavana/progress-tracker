"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Transaction } from "../../types";

interface TransactionImportProps {
  onImport: (transactions: Transaction[]) => void;
  onClose: () => void;
}

export default function TransactionImport({
  onImport,
  onClose,
}: TransactionImportProps) {
  const [importType, setImportType] = useState<"csv" | "manual">("csv");
  const [csvData, setCsvData] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCsvImport = async () => {
    if (!csvData.trim()) {
      setError("Please enter CSV data");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Parse CSV data and convert to Transaction objects
      const lines = csvData.trim().split("\n");
      const headers = lines[0]
        .split(",")
        .map((h) => h.trim().toLowerCase().replace(/\s+/g, ""));

      const transactions: Transaction[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim());
        if (values.length !== headers.length) {
          console.warn(`Skipping row ${i + 1}: column count mismatch`);
          continue;
        }

        const row: Record<string, string> = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });

        const transaction: Transaction = {
          id: `imported-${Date.now()}-${i}`,
          amount: parseFloat(row.amount || "0"),
          currency: row.currency || "INR",
          type:
            row.type?.toLowerCase() === "credit" ||
            row.type?.toLowerCase() === "income"
              ? "credit"
              : "debit",
          platform: mapPlatform(row.platform || row.source || "other"),
          description:
            row.description || row.narration || "Imported transaction",
          merchant: row.merchant || row.recipient,
          category: row.category || "uncategorized",
          date: parseDate(
            row.date || row.transactiondate || new Date().toISOString()
          ),
          referenceId: row.referenceid || row.reference_id || row.transactionid,
          status: mapStatus(row.status || "completed"),
          tags: row.tags
            ? row.tags
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean)
            : [],
          notes: row.notes || row.remarks,
        };

        transactions.push(transaction);
      }

      if (transactions.length === 0) {
        throw new Error("No valid transactions found in CSV data");
      }

      onImport(transactions);
      onClose();
    } catch (error) {
      console.error("Error importing CSV:", error);
      setError(
        error instanceof Error ? error.message : "Error importing CSV data"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setCsvData(content);
    };
    reader.readAsText(file);
  };

  const mapPlatform = (platform: string): Transaction["platform"] => {
    const platformMap: Record<string, Transaction["platform"]> = {
      phonepe: "phonepe",
      googlepay: "googlepay",
      "google pay": "googlepay",
      gpay: "googlepay",
      paytm: "paytm",
      bank: "bank",
      upi: "other",
      cash: "other",
      card: "other",
    };
    return platformMap[platform.toLowerCase()] || "other";
  };

  const mapStatus = (status: string): Transaction["status"] => {
    const statusMap: Record<string, Transaction["status"]> = {
      completed: "completed",
      success: "completed",
      successful: "completed",
      pending: "pending",
      processing: "pending",
      failed: "failed",
      error: "failed",
      cancelled: "failed",
    };
    return statusMap[status.toLowerCase()] || "completed";
  };

  const parseDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      return date.toISOString();
    } catch {
      return new Date().toISOString();
    }
  };

  const csvTemplate = `date,amount,type,platform,description,merchant,category,reference_id,tags,notes
2024-01-15,500,debit,phonepe,Grocery Shopping,BigBasket,food,PP123456789,shopping,grocery
2024-01-14,1000,credit,googlepay,Salary Credit,Company,salary,GP987654321,income,salary
2024-01-13,200,debit,paytm,Movie Tickets,PVR Cinemas,entertainment,PT555666777,leisure,movie`;

  const downloadTemplate = () => {
    const blob = new Blob([csvTemplate], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transaction-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Import Transactions
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Import Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Import Method
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="csv"
                  checked={importType === "csv"}
                  onChange={(e) => setImportType(e.target.value as "csv")}
                  className="mr-2"
                />
                CSV Import
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="manual"
                  checked={importType === "manual"}
                  onChange={(e) => setImportType(e.target.value as "manual")}
                  className="mr-2"
                />
                Manual Entry
              </label>
            </div>
          </div>

          {importType === "csv" && (
            <div className="space-y-4">
              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV File
                </label>
                <div className="flex gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Choose File
                  </button>
                  <button
                    onClick={downloadTemplate}
                    className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors"
                  >
                    Download Template
                  </button>
                </div>
              </div>

              {/* CSV Data Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or Paste CSV Data
                </label>
                <textarea
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                  placeholder="Paste your CSV data here..."
                  className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                />
              </div>

              {/* CSV Format Help */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  CSV Format Requirements:
                </h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• First row must contain headers</p>
                  <p>
                    • Required columns:{" "}
                    <code className="bg-blue-100 px-1 rounded">date</code>,{" "}
                    <code className="bg-blue-100 px-1 rounded">amount</code>,{" "}
                    <code className="bg-blue-100 px-1 rounded">type</code>
                  </p>
                  <p>
                    • Optional columns:{" "}
                    <code className="bg-blue-100 px-1 rounded">platform</code>,{" "}
                    <code className="bg-blue-100 px-1 rounded">
                      description
                    </code>
                    , <code className="bg-blue-100 px-1 rounded">merchant</code>
                    , <code className="bg-blue-100 px-1 rounded">category</code>
                  </p>
                  <p>
                    • Type should be &quot;credit&quot; or &quot;debit&quot;
                  </p>
                  <p>• Platform: phonepe, googlepay, paytm, bank, or other</p>
                </div>
              </div>

              {/* Template Preview */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Example CSV Format:
                </h4>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-x-auto">
                  {csvTemplate}
                </pre>
              </div>
            </div>
          )}

          {importType === "manual" && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Manual Entry
              </h4>
              <p className="text-gray-600 mb-4">
                Manual transaction entry feature is coming soon. For now, please
                use CSV import.
              </p>
              <button
                onClick={() => setImportType("csv")}
                className="btn-primary"
              >
                Switch to CSV Import
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex">
                <svg
                  className="w-5 h-5 text-red-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h4 className="text-sm font-medium text-red-800">
                    Import Error
                  </h4>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={importType === "csv" ? handleCsvImport : undefined}
            disabled={isProcessing || (importType === "csv" && !csvData.trim())}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing && (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            )}
            {isProcessing ? "Importing..." : "Import Transactions"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
