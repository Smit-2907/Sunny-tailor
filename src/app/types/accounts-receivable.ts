// Accounts Receivable Type Definitions

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  gstin?: string;
  creditLimit: number;
  currentBalance: number;
  overdueBalance: number;
  isActive: boolean;
  paymentTerms: number; // Days
  reminderEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: "draft" | "sent" | "partial" | "paid" | "overdue" | "cancelled";
  paymentTerms: number;
  items: InvoiceItem[];
  taxAmount: number;
  discountAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  customerId: string;
  customerName: string;
  invoiceId?: string;
  invoiceNumber?: string;
  paymentDate: string;
  amount: number;
  paymentMethod: "cash" | "bank" | "cheque" | "upi" | "card" | "other";
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgingBucket {
  range: string;
  days: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface CustomerStatement {
  customerId: string;
  customerName: string;
  fromDate: string;
  toDate: string;
  openingBalance: number;
  closingBalance: number;
  transactions: StatementTransaction[];
  totalInvoices: number;
  totalPayments: number;
}

export interface StatementTransaction {
  date: string;
  type: "invoice" | "payment" | "credit_note";
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface CollectionForecast {
  period: string;
  expectedCollection: number;
  overdueCollection: number;
  currentCollection: number;
  totalExpected: number;
}

export interface BadDebtProvision {
  id: string;
  customerId: string;
  customerName: string;
  invoiceId: string;
  invoiceNumber: string;
  invoiceAmount: number;
  overdueDays: number;
  provisionPercentage: number;
  provisionAmount: number;
  status: "pending" | "approved" | "written_off";
  createdAt: string;
  updatedAt: string;
}

// Helper functions
export function calculateAgingBuckets(invoices: Invoice[]): AgingBucket[] {
  const today = new Date();
  const buckets: AgingBucket[] = [
    { range: "0-30", days: "Current", count: 0, amount: 0, percentage: 0 },
    { range: "31-60", days: "31-60 Days", count: 0, amount: 0, percentage: 0 },
    { range: "61-90", days: "61-90 Days", count: 0, amount: 0, percentage: 0 },
    { range: "90+", days: "90+ Days", count: 0, amount: 0, percentage: 0 },
  ];

  let total = 0;

  invoices.forEach((invoice) => {
    if (invoice.balanceAmount <= 0) return;

    const dueDate = new Date(invoice.dueDate);
    const daysPastDue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

    let bucketIndex = 0;
    if (daysPastDue > 90) bucketIndex = 3;
    else if (daysPastDue > 60) bucketIndex = 2;
    else if (daysPastDue > 30) bucketIndex = 1;
    else bucketIndex = 0;

    buckets[bucketIndex].count++;
    buckets[bucketIndex].amount += invoice.balanceAmount;
    total += invoice.balanceAmount;
  });

  // Calculate percentages
  buckets.forEach((bucket) => {
    bucket.percentage = total > 0 ? (bucket.amount / total) * 100 : 0;
  });

  return buckets;
}

export function getInvoiceStatus(invoice: Invoice): Invoice["status"] {
  if (invoice.status === "cancelled" || invoice.status === "draft") {
    return invoice.status;
  }

  if (invoice.balanceAmount <= 0) {
    return "paid";
  }

  const today = new Date();
  const dueDate = new Date(invoice.dueDate);

  if (today > dueDate) {
    return "overdue";
  }

  if (invoice.paidAmount > 0) {
    return "partial";
  }

  return "sent";
}

export function calculateOverdueDays(dueDate: string): number {
  const today = new Date();
  const due = new Date(dueDate);
  const diff = today.getTime() - due.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}
