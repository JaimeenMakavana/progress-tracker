import { Transaction, TransactionStats } from "../types";

export function calculateTransactionStats(
  transactions: Transaction[]
): TransactionStats {
  const stats: TransactionStats = {
    totalIncome: 0,
    totalExpense: 0,
    netAmount: 0,
    transactionCount: transactions.length,
    platformBreakdown: {},
    categoryBreakdown: {},
  };

  transactions.forEach((transaction) => {
    // Calculate income and expense
    if (transaction.type === "credit") {
      stats.totalIncome += transaction.amount;
    } else {
      stats.totalExpense += transaction.amount;
    }

    // Platform breakdown
    if (!stats.platformBreakdown[transaction.platform]) {
      stats.platformBreakdown[transaction.platform] = 0;
    }
    stats.platformBreakdown[transaction.platform] += transaction.amount;

    // Category breakdown
    const category = transaction.category || "uncategorized";
    if (!stats.categoryBreakdown[category]) {
      stats.categoryBreakdown[category] = 0;
    }
    stats.categoryBreakdown[category] += transaction.amount;
  });

  stats.netAmount = stats.totalIncome - stats.totalExpense;

  return stats;
}

export function parseCsvToTransactions(csvData: string): Transaction[] {
  const lines = csvData.trim().split("\n");
  if (lines.length < 2) {
    throw new Error("CSV must have at least a header row and one data row");
  }

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

    try {
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
        description: row.description || row.narration || "Imported transaction",
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
    } catch (error) {
      console.warn(`Error parsing row ${i + 1}:`, error);
    }
  }

  return transactions;
}

function mapPlatform(platform: string): Transaction["platform"] {
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
}

function mapStatus(status: string): Transaction["status"] {
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
}

function parseDate(dateString: string): string {
  try {
    // Try to parse various date formats
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date");
    }
    return date.toISOString();
  } catch {
    // Fallback to current date
    return new Date().toISOString();
  }
}

export function exportTransactionsToCsv(transactions: Transaction[]): string {
  const headers = [
    "Date",
    "Amount",
    "Type",
    "Platform",
    "Description",
    "Merchant",
    "Category",
    "Reference ID",
    "Status",
    "Tags",
    "Notes",
  ];

  const rows = transactions.map((transaction) => [
    new Date(transaction.date).toLocaleDateString(),
    transaction.amount.toString(),
    transaction.type,
    transaction.platform,
    transaction.description,
    transaction.merchant || "",
    transaction.category || "",
    transaction.referenceId || "",
    transaction.status,
    transaction.tags?.join(",") || "",
    transaction.notes || "",
  ]);

  return [headers, ...rows].map((row) => row.join(",")).join("\n");
}

export function filterTransactions(
  transactions: Transaction[],
  filters: {
    platform?: string;
    type?: string;
    category?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
  }
): Transaction[] {
  return transactions.filter((transaction) => {
    if (
      filters.platform &&
      filters.platform !== "all" &&
      transaction.platform !== filters.platform
    ) {
      return false;
    }

    if (
      filters.type &&
      filters.type !== "all" &&
      transaction.type !== filters.type
    ) {
      return false;
    }

    if (
      filters.category &&
      filters.category !== "all" &&
      transaction.category !== filters.category
    ) {
      return false;
    }

    if (
      filters.dateFrom &&
      new Date(transaction.date) < new Date(filters.dateFrom)
    ) {
      return false;
    }

    if (
      filters.dateTo &&
      new Date(transaction.date) > new Date(filters.dateTo)
    ) {
      return false;
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesDescription = transaction.description
        .toLowerCase()
        .includes(searchLower);
      const matchesMerchant = transaction.merchant
        ?.toLowerCase()
        .includes(searchLower);
      const matchesCategory = transaction.category
        ?.toLowerCase()
        .includes(searchLower);

      if (!matchesDescription && !matchesMerchant && !matchesCategory) {
        return false;
      }
    }

    return true;
  });
}

export function sortTransactions(
  transactions: Transaction[],
  sortBy: keyof Transaction,
  sortOrder: "asc" | "desc"
): Transaction[] {
  return [...transactions].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });
}

export function getUniqueCategories(transactions: Transaction[]): string[] {
  const categories = new Set<string>();
  transactions.forEach((transaction) => {
    if (transaction.category) {
      categories.add(transaction.category);
    }
  });
  return Array.from(categories).sort();
}

export function getUniquePlatforms(transactions: Transaction[]): string[] {
  const platforms = new Set<string>();
  transactions.forEach((transaction) => {
    platforms.add(transaction.platform);
  });
  return Array.from(platforms).sort();
}
