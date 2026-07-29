// Chart of Accounts Type Definitions

export type AccountType = "asset" | "liability" | "equity" | "income" | "expense";

export interface AccountSubType {
  value: string;
  label: string;
}

export const ACCOUNT_TYPES: Record<AccountType, { label: string; codeRange: string; subTypes: AccountSubType[] }> = {
  asset: {
    label: "Assets",
    codeRange: "1000-1999",
    subTypes: [
      { value: "current-assets", label: "Current Assets" },
      { value: "fixed-assets", label: "Fixed Assets" },
      { value: "investments", label: "Investments" },
      { value: "other-assets", label: "Other Assets" },
    ],
  },
  liability: {
    label: "Liabilities",
    codeRange: "2000-2999",
    subTypes: [
      { value: "current-liabilities", label: "Current Liabilities" },
      { value: "long-term-liabilities", label: "Long-term Liabilities" },
      { value: "other-liabilities", label: "Other Liabilities" },
    ],
  },
  equity: {
    label: "Equity",
    codeRange: "3000-3999",
    subTypes: [
      { value: "owners-equity", label: "Owner's Equity" },
      { value: "retained-earnings", label: "Retained Earnings" },
      { value: "current-year-earnings", label: "Current Year Earnings" },
    ],
  },
  income: {
    label: "Income",
    codeRange: "4000-4999",
    subTypes: [
      { value: "operating-revenue", label: "Operating Revenue" },
      { value: "sales-revenue", label: "Sales Revenue" },
      { value: "service-revenue", label: "Service Revenue" },
      { value: "other-income", label: "Other Income" },
    ],
  },
  expense: {
    label: "Expenses",
    codeRange: "5000-5999",
    subTypes: [
      { value: "cost-of-goods-sold", label: "Cost of Goods Sold" },
      { value: "operating-expenses", label: "Operating Expenses" },
      { value: "administrative-expenses", label: "Administrative Expenses" },
      { value: "selling-expenses", label: "Selling & Marketing Expenses" },
      { value: "financial-expenses", label: "Financial Expenses" },
      { value: "other-expenses", label: "Other Expenses" },
    ],
  },
};

export interface ChartOfAccount {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  accountSubType: string;
  parentAccountId?: string;
  description?: string;
  openingBalance: number;
  currentBalance: number;
  isActive: boolean;
  isSystemAccount: boolean; // Cannot be deleted
  createdAt: string;
  updatedAt: string;
}

// Standard account code ranges
export const ACCOUNT_CODE_RANGES = {
  asset: { min: 1000, max: 1999 },
  liability: { min: 2000, max: 2999 },
  equity: { min: 3000, max: 3999 },
  income: { min: 4000, max: 4999 },
  expense: { min: 5000, max: 5999 },
};

// Helper function to get the next available account code
export function getNextAccountCode(accounts: ChartOfAccount[], accountType: AccountType): string {
  const range = ACCOUNT_CODE_RANGES[accountType];
  const existingCodes = accounts
    .filter(acc => acc.accountType === accountType)
    .map(acc => parseInt(acc.accountCode))
    .filter(code => !isNaN(code));

  if (existingCodes.length === 0) {
    return range.min.toString();
  }

  const maxCode = Math.max(...existingCodes);
  const nextCode = maxCode + 1;

  if (nextCode > range.max) {
    // Find gaps in the sequence
    for (let i = range.min; i <= range.max; i++) {
      if (!existingCodes.includes(i)) {
        return i.toString();
      }
    }
    throw new Error(`No available account codes in ${accountType} range`);
  }

  return nextCode.toString();
}

// Default/System accounts that should be created on initialization
export const DEFAULT_ACCOUNTS: Omit<ChartOfAccount, "id" | "createdAt" | "updatedAt">[] = [
  // Assets
  {
    accountCode: "1000",
    accountName: "Cash",
    accountType: "asset",
    accountSubType: "current-assets",
    description: "Cash on hand and in bank",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },
  {
    accountCode: "1010",
    accountName: "Bank Account",
    accountType: "asset",
    accountSubType: "current-assets",
    description: "Primary bank account",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },
  {
    accountCode: "1020",
    accountName: "Accounts Receivable",
    accountType: "asset",
    accountSubType: "current-assets",
    description: "Money owed by customers",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },
  {
    accountCode: "1030",
    accountName: "Inventory",
    accountType: "asset",
    accountSubType: "current-assets",
    description: "Stock/Inventory on hand",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },
  {
    accountCode: "1100",
    accountName: "Machinery & Equipment",
    accountType: "asset",
    accountSubType: "fixed-assets",
    description: "Manufacturing machinery and equipment",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: false,
  },

  // Liabilities
  {
    accountCode: "2000",
    accountName: "Accounts Payable",
    accountType: "liability",
    accountSubType: "current-liabilities",
    description: "Money owed to suppliers",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },
  {
    accountCode: "2010",
    accountName: "GST Payable",
    accountType: "liability",
    accountSubType: "current-liabilities",
    description: "GST collected from customers",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },
  {
    accountCode: "2020",
    accountName: "TDS Payable",
    accountType: "liability",
    accountSubType: "current-liabilities",
    description: "TDS deducted to be paid to government",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },
  {
    accountCode: "2030",
    accountName: "Salary Payable",
    accountType: "liability",
    accountSubType: "current-liabilities",
    description: "Salaries due to employees",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },

  // Equity
  {
    accountCode: "3000",
    accountName: "Owner's Capital",
    accountType: "equity",
    accountSubType: "owners-equity",
    description: "Capital invested by owner",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },
  {
    accountCode: "3100",
    accountName: "Retained Earnings",
    accountType: "equity",
    accountSubType: "retained-earnings",
    description: "Accumulated profits",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },

  // Income
  {
    accountCode: "4000",
    accountName: "Sales Revenue",
    accountType: "income",
    accountSubType: "sales-revenue",
    description: "Revenue from garment sales",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },
  {
    accountCode: "4010",
    accountName: "Service Revenue",
    accountType: "income",
    accountSubType: "service-revenue",
    description: "Revenue from services",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: false,
  },

  // Expenses
  {
    accountCode: "5000",
    accountName: "Cost of Goods Sold",
    accountType: "expense",
    accountSubType: "cost-of-goods-sold",
    description: "Direct costs of production",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },
  {
    accountCode: "5010",
    accountName: "Fabric Purchase",
    accountType: "expense",
    accountSubType: "cost-of-goods-sold",
    description: "Cost of fabric materials",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },
  {
    accountCode: "5020",
    accountName: "Raw Material Purchase",
    accountType: "expense",
    accountSubType: "cost-of-goods-sold",
    description: "Cost of raw materials",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },
  {
    accountCode: "5100",
    accountName: "Salary Expense",
    accountType: "expense",
    accountSubType: "operating-expenses",
    description: "Employee salaries and wages",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: true,
  },
  {
    accountCode: "5110",
    accountName: "Rent Expense",
    accountType: "expense",
    accountSubType: "operating-expenses",
    description: "Office and factory rent",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: false,
  },
  {
    accountCode: "5120",
    accountName: "Utilities Expense",
    accountType: "expense",
    accountSubType: "operating-expenses",
    description: "Electricity, water, internet",
    openingBalance: 0,
    currentBalance: 0,
    isActive: true,
    isSystemAccount: false,
  },
];
