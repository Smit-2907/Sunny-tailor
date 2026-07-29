import { useState, useEffect } from "react";
import {
  Calendar,
  Download,
} from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import { fetchBills, fetchBillsExpenses } from "@/app/api/supabase-api";
import type { Bill } from "@/app/components/billing/bill-types";
import { ExcelDownloadDialog } from "@/app/components/finance/excel-download-dialog";

interface BillExpense {
  id: string;
  billNumber: string;
  type: "bill" | "expense";
  category: string;
  vendor: string;
  description: string;
  amount: number;
  tax: number;
  totalAmount: number;
  date: string;
  paidAmount: number;
  balanceAmount: number;
  status: "paid" | "partial" | "pending" | "overdue";
  syncedFromBilling?: boolean;
  syncedFromHR?: boolean;
}

// Helper function to convert Bill to Invoice format
function convertBillToInvoice(bill: Bill) {
  const invoiceDate = new Date(bill.invoiceDate);
  const today = new Date();
  const agingDays = Math.floor((today.getTime() - invoiceDate.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate received amount based on status
  let receivedAmount = 0;
  if (bill.status === "paid") {
    receivedAmount = bill.totalAmount;
  }

  const balance = bill.totalAmount - receivedAmount;

  // Determine status based on aging and payment
  let status = "pending";
  if (bill.status === "paid") {
    status = "paid";
  } else if (receivedAmount > 0 && receivedAmount < bill.totalAmount) {
    status = "partial";
  } else if (agingDays > 30) {
    status = "overdue";
  }

  return {
    invoiceNo: bill.billNumber,
    clientName: bill.billedTo.name,
    invoiceDate: bill.invoiceDate,
    invoiceAmount: bill.totalAmount,
    receivedAmount,
    balance,
    status,
    agingDays,
  };
}

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

export function AccountsDashboard() {
  const [viewMode, setViewMode] = useState("monthly");
  const [dateRange, setDateRange] = useState("this-month");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [billsExpenses, setBillsExpenses] = useState<BillExpense[]>([]);
  const [showBillsDownload, setShowBillsDownload] = useState(false);
  const [showExpensesDownload, setShowExpensesDownload] = useState(false);

  // Load all financial data
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadBills(), loadBillsExpenses()]);
    } finally {
      setLoading(false);
    }
  };

  const loadBills = async () => {
    try {
      // Try to fetch from Supabase
      const bills = await fetchBills();
      const convertedInvoices = bills.map((bill: Bill) => convertBillToInvoice(bill));
      setInvoices(convertedInvoices);
      console.log(`[Accounting] Loaded ${convertedInvoices.length} invoices from billing`);
    } catch (error) {
      console.warn("[Accounting] Failed to load bills, using localStorage fallback");
      // Fallback to localStorage
      try {
        const cachedBills = localStorage.getItem("erp_bills");
        if (cachedBills) {
          const bills = JSON.parse(cachedBills);
          const convertedInvoices = bills.map((bill: Bill) => convertBillToInvoice(bill));
          setInvoices(convertedInvoices);
          console.log(`[Accounting] Loaded ${convertedInvoices.length} invoices from localStorage`);
        } else {
          setInvoices([]);
        }
      } catch (e) {
        console.error("[Accounting] Failed to load from localStorage:", e);
        setInvoices([]);
      }
    }
  };

  const loadBillsExpenses = async () => {
    try {
      const data: BillExpense[] = await fetchBillsExpenses();
      setBillsExpenses(data);
    } catch (e) {
      // fallback to localStorage cache
      try {
        const stored = localStorage.getItem("erp_bills_expenses");
        setBillsExpenses(stored ? JSON.parse(stored) : []);
      } catch {
        setBillsExpenses([]);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      paid: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
      partial: { label: "Partial", className: "bg-blue-100 text-blue-800 border-blue-200" },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      overdue: { label: "Overdue", className: "bg-red-100 text-red-800 border-red-200" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // ── Source of truth: bills_expenses ─────────────────────────
  const bills = billsExpenses.filter(item => item.type === "bill");
  const expenses = billsExpenses.filter(item => item.type === "expense");

  // Revenue (bills = what customers owe us)
  const totalInvoiced    = bills.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalReceived    = bills.reduce((sum, b) => sum + b.paidAmount, 0);
  const totalReceivablesPending = bills.reduce((sum, b) => sum + b.balanceAmount, 0);

  const billsPaid        = bills.filter(b => b.status === "paid").length;
  const billsPartial     = bills.filter(b => b.status === "partial").length;
  const billsPending     = bills.filter(b => b.status === "pending" || b.status === "overdue").length;

  // Expenses (what we owe vendors)
  const totalExpensesIncurred = expenses.reduce((sum, e) => sum + e.totalAmount, 0);
  const totalExpensesPaid     = expenses.reduce((sum, e) => sum + e.paidAmount, 0);
  const totalPayablesPending  = expenses.reduce((sum, e) => sum + e.balanceAmount, 0);

  const expPaid    = expenses.filter(e => e.status === "paid").length;
  const expPartial = expenses.filter(e => e.status === "partial").length;
  const expPending = expenses.filter(e => e.status === "pending" || e.status === "overdue").length;

  // Net profit — cash basis (received vs paid out)
  const netProfitCash    = totalReceived - totalExpensesPaid;
  // Net profit — accrual (earned vs incurred)
  const netProfitAccrual = totalInvoiced - totalExpensesIncurred;

  // Enrich billing invoices with actual payment data from bills_expenses
  const enrichedInvoices = invoices.map(inv => {
    const be = bills.find(b => b.billNumber === inv.invoiceNo);
    return be
      ? { ...inv, receivedAmount: be.paidAmount, balance: be.balanceAmount, status: be.status }
      : inv;
  });

  const agingSummary = {
    "0-30":  enrichedInvoices.filter(i => i.agingDays >= 0  && i.agingDays <= 30  && i.balance > 0).reduce((s, i) => s + i.balance, 0),
    "31-60": enrichedInvoices.filter(i => i.agingDays >= 31 && i.agingDays <= 60  && i.balance > 0).reduce((s, i) => s + i.balance, 0),
    "61-90": enrichedInvoices.filter(i => i.agingDays >= 61 && i.agingDays <= 90  && i.balance > 0).reduce((s, i) => s + i.balance, 0),
    overdue: enrichedInvoices.filter(i => i.agingDays > 90  && i.balance > 0).reduce((s, i) => s + i.balance, 0),
  };

  // Category-wise expense distribution (by paidAmount = cash actually spent)
  const categoryExpenses = new Map<string, number>();
  expenses.forEach(exp => {
    const val = exp.paidAmount > 0 ? exp.paidAmount : exp.totalAmount;
    categoryExpenses.set(exp.category, (categoryExpenses.get(exp.category) || 0) + val);
  });
  const categoryExpenseData = Array.from(categoryExpenses.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Top customers by revenue received
  const customerRevenue = new Map<string, number>();
  bills.forEach(bill => {
    customerRevenue.set(bill.vendor, (customerRevenue.get(bill.vendor) || 0) + bill.paidAmount);
  });
  const vendorExpenseData = Array.from(customerRevenue.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div className="space-y-5 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Accounts & Finance</h1>
          <p className="text-xs text-gray-500 mt-0.5">Auto-synced from Billing, HR &amp; Procurement</p>
        </div>
        <div className="flex items-center gap-2">
          {loading && <span className="text-xs text-gray-400">Refreshing…</span>}
          <button
            onClick={loadAllData}
            disabled={loading}
            className="text-xs font-medium text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40"
          >
            Refresh
          </button>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="h-8 text-xs w-[150px] border-gray-200">
              <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">FY 2024-25</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Sync pill ── */}
      <div className="flex items-center gap-2.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg w-fit">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-xs text-gray-600">
          {bills.length} bills · {expenses.length} expenses · {formatCurrency(totalReceived)} received · {formatCurrency(totalExpensesPaid)} paid out
        </span>
        <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">Live</span>
      </div>

      {/* ── Overview card ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Bills & Expenses Overview</p>
            <p className="text-xs text-gray-400 mt-0.5">Synced from Billing, HR, and Accounting modules</p>
          </div>
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
          {[
            { label: "Bills Invoiced",    value: formatCurrency(totalInvoiced),        sub: `${billsPaid} paid · ${billsPartial} partial · ${billsPending} pending`, dot: "bg-violet-500", val: "text-gray-900" },
            { label: "Bills Received",    value: formatCurrency(totalReceived),         sub: `${formatCurrency(totalReceivablesPending)} still pending`,               dot: "bg-emerald-500", val: "text-emerald-700" },
            { label: "Expenses Incurred", value: formatCurrency(totalExpensesIncurred), sub: `${expPaid} paid · ${expPartial} partial · ${expPending} pending`,        dot: "bg-orange-400", val: "text-gray-900" },
            { label: "Expenses Paid Out", value: formatCurrency(totalExpensesPaid),     sub: `${formatCurrency(totalPayablesPending)} outstanding`,                    dot: "bg-red-400",    val: "text-red-600" },
          ].map((s, i) => (
            <div key={i} className="px-6 py-5">
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{s.label}</span>
              </div>
              <p className={`text-2xl font-semibold tracking-tight ${s.val}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-100 border-t border-gray-100">
          {/* Donut + legend */}
          <div className="px-6 py-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Expense by Category</p>
            {categoryExpenseData.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-sm text-gray-300 border border-dashed border-gray-200 rounded-lg">
                No expense data yet
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <PieChart width={160} height={160}>
                    <Pie data={categoryExpenseData} cx="50%" cy="50%" innerRadius={46} outerRadius={72} paddingAngle={2} dataKey="value" labelLine={false} label={false}>
                      {categoryExpenseData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />)}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                  </PieChart>
                </div>
                <div className="flex-1 space-y-2.5 min-w-0">
                  {categoryExpenseData.map((cat, i) => {
                    const total = categoryExpenseData.reduce((s, c) => s + c.value, 0);
                    const pct = total > 0 ? Math.round((cat.value / total) * 100) : 0;
                    return (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-xs text-gray-600 truncate">{cat.name}</span>
                          </div>
                          <span className="text-xs font-semibold text-gray-800 ml-2 flex-shrink-0">{pct}%</span>
                        </div>
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Top customers */}
          <div className="px-6 py-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Top Customers by Revenue</p>
            {vendorExpenseData.length === 0 ? (
              <div className="h-40 flex items-center justify-center text-sm text-gray-300 border border-dashed border-gray-200 rounded-lg">No customer data yet</div>
            ) : (
              <div className="space-y-0.5">
                {vendorExpenseData.map((vendor, i) => {
                  const pct = Math.round((vendor.value / (vendorExpenseData[0]?.value || 1)) * 100);
                  return (
                    <div key={i} className="flex items-center gap-3 px-2 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                      <span className="text-[11px] font-bold text-gray-300 w-3 text-center">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-800 truncate">{vendor.name}</span>
                          <span className="text-sm font-semibold text-gray-900 ml-3 flex-shrink-0">{formatCurrency(vendor.value)}</span>
                        </div>
                        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Company Invoices (Sales) ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Company Invoices</p>
            <p className="text-xs text-gray-400 mt-0.5">Customer invoices &amp; receivables from Billing module</p>
          </div>
          <button
            onClick={() => setShowBillsDownload(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export Excel
          </button>
        </div>

        {/* Revenue mini-strip */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
          {[
            { label: "Total Invoiced",      value: formatCurrency(totalInvoiced),             color: "text-gray-900" },
            { label: "Total Received",      value: formatCurrency(totalReceived),              color: "text-emerald-700" },
            { label: "Pending Collection",  value: formatCurrency(totalReceivablesPending),    color: "text-amber-600" },
          ].map((s, i) => (
            <div key={i} className="px-6 py-3">
              <p className="text-[11px] text-gray-400 mb-0.5">{s.label}</p>
              <p className={`text-base font-semibold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {/* Table */}
          <div className="lg:col-span-3 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Invoice</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Client</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Received</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Balance</th>
                  <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {enrichedInvoices.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-sm text-gray-300">{loading ? "Loading…" : "No invoices found."}</td></tr>
                )}
                {enrichedInvoices.map((inv, i) => (
                  <tr key={`inv-${i}`} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-3 font-mono text-xs font-semibold text-indigo-600">{inv.invoiceNo}</td>
                    <td className="px-4 py-3 text-gray-800">{inv.clientName}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{inv.invoiceDate}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(inv.invoiceAmount)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600">{formatCurrency(inv.receivedAmount)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-red-500">{formatCurrency(inv.balance)}</td>
                    <td className="px-4 py-3 text-center">{getStatusBadge(inv.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Aging panel */}
          <div className="border-l border-gray-100 px-5 py-5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Receivables Aging</p>
            <div className="space-y-2">
              {[
                { label: "0–30 days",    value: agingSummary["0-30"],  bar: "bg-emerald-400" },
                { label: "31–60 days",   value: agingSummary["31-60"], bar: "bg-blue-400" },
                { label: "61–90 days",   value: agingSummary["61-90"], bar: "bg-amber-400" },
                { label: "90+ overdue",  value: agingSummary.overdue,  bar: "bg-red-400" },
              ].map((row, i) => {
                const maxAging = Math.max(agingSummary["0-30"], agingSummary["31-60"], agingSummary["61-90"], agingSummary.overdue, 1);
                const pct = Math.round((row.value / maxAging) * 100);
                return (
                  <div key={i} className="py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-500">{row.label}</span>
                      <span className="text-xs font-semibold text-gray-800">{formatCurrency(row.value)}</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${row.bar}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Expenses ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Expenses</p>
            <p className="text-xs text-gray-400 mt-0.5">Synced from HR, Billing &amp; manual entries</p>
          </div>
          <button
            onClick={() => setShowExpensesDownload(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Export Excel
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Reference</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Vendor</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Total</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Paid</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Balance</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {expenses.length === 0 && (
                <tr><td colSpan={8} className="text-center py-12 text-sm text-gray-300">{loading ? "Loading…" : "No expenses found."}</td></tr>
              )}
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-3 font-mono text-xs font-semibold text-orange-500">{exp.billNumber}</td>
                  <td className="px-4 py-3 text-gray-800">{exp.vendor}</td>
                  <td className="px-4 py-3 text-gray-500">{exp.category}</td>
                  <td className="px-4 py-3 text-xs text-gray-400">{exp.date}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(exp.totalAmount)}</td>
                  <td className="px-4 py-3 text-right text-emerald-600">{formatCurrency(exp.paidAmount)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-red-500">{formatCurrency(exp.balanceAmount)}</td>
                  <td className="px-4 py-3 text-center">{getStatusBadge(exp.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Profit & Loss ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Profit &amp; Loss</p>
            <p className="text-xs text-gray-400 mt-0.5">Financial performance overview</p>
          </div>
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="h-8 text-xs w-[130px] border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* P&L stat strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100 border-b border-gray-100">
          {[
            { label: "Revenue Invoiced",   value: formatCurrency(totalInvoiced),        sub: "accrual basis",   color: "text-gray-900",   dot: "bg-indigo-400" },
            { label: "Revenue Received",   value: formatCurrency(totalReceived),         sub: "cash basis",      color: "text-emerald-700", dot: "bg-emerald-400" },
            { label: "Expenses Incurred",  value: formatCurrency(totalExpensesIncurred), sub: `${formatCurrency(totalExpensesPaid)} paid`, color: "text-gray-900", dot: "bg-orange-400" },
            {
              label: "Net Profit (Cash)",
              value: `${netProfitCash < 0 ? "−" : ""}${formatCurrency(Math.abs(netProfitCash))}`,
              sub: `accrual: ${netProfitAccrual < 0 ? "−" : ""}${formatCurrency(Math.abs(netProfitAccrual))}`,
              color: netProfitCash >= 0 ? "text-emerald-700" : "text-red-600",
              dot: netProfitCash >= 0 ? "bg-emerald-400" : "bg-red-400",
            },
          ].map((s, i) => (
            <div key={i} className="px-6 py-5">
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{s.label}</span>
              </div>
              <p className={`text-2xl font-semibold tracking-tight ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Ledger */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-gray-100">
          <div className="px-6 py-5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Revenue (Receivables)</p>
            <div className="space-y-1">
              {[
                { label: "Total Invoiced to Customers", value: formatCurrency(totalInvoiced),          color: "text-gray-800" },
                { label: "Cash Received",                value: formatCurrency(totalReceived),          color: "text-emerald-600" },
                { label: "Pending Collection",           value: formatCurrency(totalReceivablesPending), color: "text-amber-600" },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{row.label}</span>
                  <span className={`text-sm font-semibold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="px-6 py-5">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Expenses (Payables)</p>
            <div className="space-y-1">
              {[
                { label: "Total Expenses Incurred", value: formatCurrency(totalExpensesIncurred), color: "text-gray-800" },
                { label: "Cash Paid Out",            value: formatCurrency(totalExpensesPaid),    color: "text-red-500" },
                { label: "Still Outstanding",        value: formatCurrency(totalPayablesPending), color: "text-amber-600" },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{row.label}</span>
                  <span className={`text-sm font-semibold ${row.color}`}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Net bottom bar */}
        <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100 bg-gray-50/50">
          <div className="px-6 py-4">
            <p className="text-[11px] text-gray-400 mb-1">Net Profit — Cash Basis</p>
            <p className={`text-lg font-semibold ${netProfitCash >= 0 ? "text-emerald-700" : "text-red-600"}`}>
              {netProfitCash < 0 && "−"}{formatCurrency(Math.abs(netProfitCash))}
              <span className="text-xs ml-1.5 font-normal text-gray-400">received − paid</span>
            </p>
          </div>
          <div className="px-6 py-4">
            <p className="text-[11px] text-gray-400 mb-1">Net Profit — Accrual Basis</p>
            <p className={`text-lg font-semibold ${netProfitAccrual >= 0 ? "text-indigo-700" : "text-red-600"}`}>
              {netProfitAccrual < 0 && "−"}{formatCurrency(Math.abs(netProfitAccrual))}
              <span className="text-xs ml-1.5 font-normal text-gray-400">invoiced − incurred</span>
            </p>
          </div>
        </div>
      </div>

      {/* Excel Download Dialogs */}
      <ExcelDownloadDialog
        open={showBillsDownload}
        onClose={() => setShowBillsDownload(false)}
        type="bills"
        data={bills.map((b) => ({
          "Bill Number":    b.billNumber,
          "Customer":       b.vendor,
          "Category":       b.category,
          "Description":    b.description,
          "Date":           b.date,
          "Amount (₹)":     b.amount,
          "Tax (₹)":        b.tax,
          "Total (₹)":      b.totalAmount,
          "Paid (₹)":       b.paidAmount,
          "Balance (₹)":    b.balanceAmount,
          "Status":         b.status,
          date:             b.date,
          status:           b.status,
        }))}
      />
      <ExcelDownloadDialog
        open={showExpensesDownload}
        onClose={() => setShowExpensesDownload(false)}
        type="expenses"
        data={expenses.map((e) => ({
          "Expense Number": e.billNumber,
          "Vendor":         e.vendor,
          "Category":       e.category,
          "Description":    e.description,
          "Date":           e.date,
          "Amount (₹)":     e.amount,
          "Tax (₹)":        e.tax,
          "Total (₹)":      e.totalAmount,
          "Paid (₹)":       e.paidAmount,
          "Balance (₹)":    e.balanceAmount,
          "Status":         e.status,
          "Source":         e.syncedFromHR ? "HR" : e.syncedFromBilling ? "Billing" : "Manual",
          date:             e.date,
          status:           e.status,
        }))}
      />
    </div>
  );
}