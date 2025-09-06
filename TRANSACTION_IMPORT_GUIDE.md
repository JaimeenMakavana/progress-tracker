# Transaction Import Guide

This guide explains how to import transaction data from PhonePe, Google Pay, and Paytm into your Progress OS app.

## Supported Platforms

- **PhonePe** 📱
- **Google Pay** 💳
- **Paytm** 💰
- **Bank Statements** 🏦
- **Other UPI/Card transactions** 💸

## How to Export Data from Each Platform

### PhonePe

1. Open PhonePe app
2. Go to Profile → Transaction History
3. Select the date range you want to export
4. Look for "Export" or "Download" option
5. Save as CSV file

### Google Pay

1. Open Google Pay app
2. Go to Profile → Transaction History
3. Select the date range
4. Look for "Export" or "Download" option
5. Save as CSV file

### Paytm

1. Open Paytm app
2. Go to Profile → Transaction History
3. Select the date range
4. Look for "Export" or "Download" option
5. Save as CSV file

### Bank Statements

1. Log into your bank's internet banking
2. Go to Account Statement or Transaction History
3. Select date range and export as CSV
4. Filter for UPI transactions if needed

## CSV Format Requirements

Your CSV file should have the following columns (minimum required):

### Required Columns:

- `date` - Transaction date (YYYY-MM-DD format)
- `amount` - Transaction amount (numbers only)
- `type` - "credit" or "debit"

### Optional Columns:

- `platform` - "phonepe", "googlepay", "paytm", "bank", or "other"
- `description` - Transaction description
- `merchant` - Merchant name
- `category` - Transaction category (food, shopping, etc.)
- `reference_id` - Transaction reference number
- `status` - "completed", "pending", or "failed"
- `tags` - Comma-separated tags
- `notes` - Additional notes

## Example CSV Format

```csv
date,amount,type,platform,description,merchant,category,reference_id,tags,notes
2024-01-15,500,debit,phonepe,Grocery Shopping,BigBasket,food,PP123456789,shopping,grocery
2024-01-14,1000,credit,googlepay,Salary Credit,Company,salary,GP987654321,income,salary
2024-01-13,200,debit,paytm,Movie Tickets,PVR Cinemas,entertainment,PT555666777,leisure,movie
```

## How to Import

1. Go to the **Expenses** page in your app
2. Click **"Import Transactions"** button
3. Choose one of these methods:
   - **Upload CSV File**: Click "Choose File" and select your CSV
   - **Paste CSV Data**: Copy and paste your CSV data directly
4. Click **"Import Transactions"**
5. Your transactions will be processed and added to the dashboard

## Features After Import

Once imported, you can:

- **View all transactions** in a unified table
- **Filter by platform** (PhonePe, Google Pay, Paytm, etc.)
- **Filter by type** (Credit/Debit)
- **Filter by category** (Food, Shopping, etc.)
- **Search transactions** by description or merchant
- **Sort by date, amount, platform**, etc.
- **Export your data** back to CSV
- **View statistics** (Total Income, Total Expense, Net Amount)

## Tips for Better Results

1. **Clean your data** before importing - remove any extra columns or formatting
2. **Use consistent categories** - this helps with better insights
3. **Include merchant names** when available for better tracking
4. **Regular imports** - import data weekly or monthly for up-to-date insights
5. **Backup your data** - use the export feature to backup your transaction data

## Troubleshooting

### Common Issues:

**"No valid transactions found"**

- Check that your CSV has the required columns (date, amount, type)
- Ensure dates are in YYYY-MM-DD format
- Verify amounts are numbers only (no currency symbols)

**"Column count mismatch"**

- Make sure all rows have the same number of columns
- Check for commas within data fields (wrap in quotes if needed)

**"Invalid date format"**

- Use YYYY-MM-DD format for dates
- Example: 2024-01-15 (not 15/01/2024)

### Need Help?

If you're having trouble importing your data:

1. Check the CSV template provided in the import modal
2. Ensure your data matches the required format
3. Try importing a small sample first to test the format

## Privacy & Security

- All transaction data is stored locally in your browser
- No data is sent to external servers
- You can export and delete your data at any time
- Your financial information remains private and secure
