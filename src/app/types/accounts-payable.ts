// Accounts Payable Type Definitions

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  gstin?: string;
  panNumber?: string;
  currentBalance: number;
  totalPaid: number;
  isActive: boolean;
  paymentTerms: number; // Days
  bankDetails?: {
    accountNumber: string;
    ifscCode: string;
    accountName: string;
    bankName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  billDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  status: "draft" | "pending" | "partial" | "paid" | "overdue" | "cancelled";
  paymentTerms: number;
  items: BillItem[];
  taxAmount: number;
  tdsAmount: number;
  discountAmount: number;
  earlyPaymentDiscount?: {
    percentage: number;
    validUntil: string;
    discountAmount: number;
  };
  priority: "low" | "medium" | "high" | "urgent";
  category: "fabric" | "raw-material" | "utilities" | "rent" | "salary" | "other";
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface BillItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface VendorPayment {
  id: string;
  paymentNumber: string;
  vendorId: string;
  vendorName: string;
  billId?: string;
  billNumber?: string;
  paymentDate: string;
  scheduledDate?: string;
  amount: number;
  tdsDeducted: number;
  netAmount: number;
  paymentMethod: "cash" | "bank" | "cheque" | "upi" | "neft" | "rtgs" | "other";
  referenceNumber?: string;
  status: "scheduled" | "processing" | "completed" | "failed" | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PayableAgingBucket {
  range: string;
  days: string;
  count: number;
  amount: number;
  percentage: number;
}

export interface VendorStatement {
  vendorId: string;
  vendorName: string;
  fromDate: string;
  toDate: string;
  openingBalance: number;
  closingBalance: number;
  transactions: VendorStatementTransaction[];
  totalBills: number;
  totalPayments: number;
  reconciled: boolean;
}

export interface VendorStatementTransaction {
  date: string;
  type: "bill" | "payment" | "debit_note";
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface PaymentSchedule {
  id: string;
  billId: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  scheduledDate: string;
  amount: number;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "approved" | "paid" | "cancelled";
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CashFlowForecast {
  period: string;
  date: string;
  expectedPayments: number;
  scheduledPayments: number;
  urgentPayments: number;
  totalOutflow: number;
  availableBalance?: number;
}

export interface EarlyPaymentOpportunity {
  billId: string;
  billNumber: string;
  vendorName: string;
  billAmount: number;
  dueDate: string;
  discountPercentage: number;
  discountAmount: number;
  discountValidUntil: string;
  payableAmount: number;
  savings: number;
  daysEarly: number;
}

// Helper functions
export function calculatePayableAgingBuckets(bills: Bill[]): PayableAgingBucket[] {
  const today = new Date();
  const buckets: PayableAgingBucket[] = [
    { range: "0-30", days: "Current", count: 0, amount: 0, percentage: 0 },
    { range: "31-60", days: "31-60 Days", count: 0, amount: 0, percentage: 0 },
    { range: "61-90", days: "61-90 Days", count: 0, amount: 0, percentage: 0 },
    { range: "90+", days: "90+ Days", count: 0, amount: 0, percentage: 0 },
  ];

  let total = 0;

  bills.forEach((bill) => {
    if (bill.balanceAmount <= 0) return;

    const dueDate = new Date(bill.dueDate);
    const daysPastDue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));

    let bucketIndex = 0;
    if (daysPastDue > 90) bucketIndex = 3;
    else if (daysPastDue > 60) bucketIndex = 2;
    else if (daysPastDue > 30) bucketIndex = 1;
    else bucketIndex = 0;

    buckets[bucketIndex].count++;
    buckets[bucketIndex].amount += bill.balanceAmount;
    total += bill.balanceAmount;
  });

  // Calculate percentages
  buckets.forEach((bucket) => {
    bucket.percentage = total > 0 ? (bucket.amount / total) * 100 : 0;
  });

  return buckets;
}

export function getBillStatus(bill: Bill): Bill["status"] {
  if (bill.status === "cancelled" || bill.status === "draft") {
    return bill.status;
  }

  if (bill.balanceAmount <= 0) {
    return "paid";
  }

  const today = new Date();
  const dueDate = new Date(bill.dueDate);

  if (today > dueDate) {
    return "overdue";
  }

  if (bill.paidAmount > 0) {
    return "partial";
  }

  return "pending";
}

export function calculateDaysUntilDue(dueDate: string): number {
  const today = new Date();
  const due = new Date(dueDate);
  const diff = due.getTime() - today.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days;
}

export function getEarlyPaymentSavings(bill: Bill): number {
  if (!bill.earlyPaymentDiscount) return 0;

  const today = new Date();
  const validUntil = new Date(bill.earlyPaymentDiscount.validUntil);

  if (today > validUntil) return 0;

  return bill.earlyPaymentDiscount.discountAmount;
}
