import { useState, useMemo } from "react";
import {
  FileText, Download, TrendingUp, TrendingDown, DollarSign,
  Receipt, CreditCard, AlertCircle, CheckCircle, Clock, Filter, Search, Calendar
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";

// ── Data loaders ───────────────────────────────────────────────────────────

function loadBillsExpenses() {
  try { return JSON.parse(localStorage.getItem("erp_bills_expenses") || "[]"); } catch { return []; }
}
function loadBills() {
  try { return JSON.parse(localStorage.getItem("erp_bills") || "[]"); } catch { return []; }
}
function loadPaymentLinks() {
  try { return JSON.parse(localStorage.getItem("erp_payment_links") || "[]"); } catch { return []; }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return "₹" + (n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function monthKey(dateStr: string) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
}

const STATUS_CFG: Record<string, { bg: string; text: string; icon: any }> = {
  paid:       { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
  pending:    { bg: "bg-amber-50",   text: "text-amber-700",   icon: Clock },
  overdue:    { bg: "bg-red-50",     text: "text-red-700",     icon: AlertCircle },
  draft:      { bg: "bg-gray-100",   text: "text-gray-600",    icon: FileText },
  completed:  { bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
  cancelled:  { bg: "bg-gray-100",   text: "text-gray-500",    icon: FileText },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CFG[status] ?? STATUS_CFG.draft;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold capitalize ${cfg.bg} ${cfg.text}`}>
      <Icon className="h-2.5 w-2.5" />
      {status}
    </span>
  );
}

type ReportTab = "overview" | "income" | "expenses" | "bills";

// ── Main Component ─────────────────────────────────────────────────────────

export function ReportsPage() {
  const [tab, setTab] = useState<ReportTab>("overview");
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const billsExpenses = useMemo(() => loadBillsExpenses(), []);
  const bills = useMemo(() => loadBills(), []);
  const paymentLinks = useMemo(() => loadPaymentLinks(), []);

  // ── Summary stats ──────────────────────────────────────────────────────

  const totalIncome = bills.reduce((a: number, b: any) =>
    a + (Number(b.totalAmount) || Number(b.subtotal) || 0), 0);

  const totalExpenses = billsExpenses
    .filter((b: any) => b.type === "expense" || b.type === "bill")
    .reduce((a: number, b: any) => a + (Number(b.totalAmount) || 0), 0);

  const totalPaid = billsExpenses
    .filter((b: any) => b.status === "paid")
    .reduce((a: number, b: any) => a + (Number(b.paidAmount) || Number(b.totalAmount) || 0), 0);

  const totalPending = billsExpenses
    .filter((b: any) => b.status === "pending" || b.status === "overdue")
    .reduce((a: number, b: any) => a + (Number(b.balanceAmount) || Number(b.totalAmount) || 0), 0);

  const netProfit = totalIncome - totalExpenses;

  // ── Monthly chart data ─────────────────────────────────────────────────

  const monthlyMap: Record<string, { income: number; expense: number }> = {};

  bills.forEach((b: any) => {
    const k = monthKey(b.invoiceDate || b.poDate || "");
    if (!monthlyMap[k]) monthlyMap[k] = { income: 0, expense: 0 };
    monthlyMap[k].income += Number(b.totalAmount) || Number(b.subtotal) || 0;
  });

  billsExpenses.forEach((b: any) => {
    const k = monthKey(b.date || "");
    if (!monthlyMap[k]) monthlyMap[k] = { income: 0, expense: 0 };
    monthlyMap[k].expense += Number(b.totalAmount) || 0;
  });

  const chartData = Object.entries(monthlyMap)
    .filter(([k]) => k !== "Unknown")
    .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
    .map(([month, vals]) => ({ month, ...vals }));

  // ── Expense by category ────────────────────────────────────────────────

  const categoryMap: Record<string, number> = {};
  billsExpenses.forEach((b: any) => {
    const cat = b.category || "Uncategorized";
    categoryMap[cat] = (categoryMap[cat] || 0) + (Number(b.totalAmount) || 0);
  });
  const categoryData = Object.entries(categoryMap)
    .sort(([, a], [, b]) => b - a)
    .map(([name, amount]) => ({ name, amount }));

  // ── Filtered table rows ────────────────────────────────────────────────

  function applyFilters(rows: any[]) {
    return rows.filter((r) => {
      const text = JSON.stringify(r).toLowerCase();
      if (search && !text.includes(search.toLowerCase())) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      const dateField = r.date || r.invoiceDate || r.createdAt || "";
      if (dateFrom && dateField && dateField < dateFrom) return false;
      if (dateTo && dateField && dateField > dateTo) return false;
      return true;
    });
  }

  const filteredBills = applyFilters(bills);
  const filteredExpenses = applyFilters(billsExpenses);

  // ── CSV export ─────────────────────────────────────────────────────────

  function exportCSV(rows: any[], filename: string, cols: { label: string; key: string }[]) {
    const header = cols.map(c => c.label).join(",");
    const data = rows.map(r =>
      cols.map(c => {
        const v = String(r[c.key] ?? "").replace(/,/g, " ");
        return v.includes('"') ? `"${v}"` : v;
      }).join(",")
    ).join("\n");
    const blob = new Blob([header + "\n" + data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }

  // ── Tabs config ────────────────────────────────────────────────────────

  const tabs: { id: ReportTab; label: string; icon: any }[] = [
    { id: "overview",  label: "Overview",  icon: TrendingUp },
    { id: "income",    label: "Income",    icon: DollarSign },
    { id: "expenses",  label: "Expenses",  icon: TrendingDown },
    { id: "bills",     label: "Bills",     icon: Receipt },
  ];

  return (
    <div className="space-y-5">

      {/* Page header */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-semibold text-gray-900">Reports</h1>
          <p className="text-xs text-gray-400 mt-0.5">Financial summary across all modules</p>
        </div>
        <button
          onClick={() => {
            if (tab === "income") exportCSV(filteredBills, "income-report.csv", [
              { label: "Bill No", key: "billNumber" },
              { label: "Client", key: "billedTo" },
              { label: "Date", key: "invoiceDate" },
              { label: "Amount", key: "totalAmount" },
              { label: "Status", key: "status" },
            ]);
            else exportCSV(filteredExpenses, "expense-report.csv", [
              { label: "Bill No", key: "billNumber" },
              { label: "Type", key: "type" },
              { label: "Category", key: "category" },
              { label: "Vendor", key: "vendor" },
              { label: "Date", key: "date" },
              { label: "Amount", key: "totalAmount" },
              { label: "Status", key: "status" },
            ]);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Income",    value: fmt(totalIncome),   color: "text-emerald-600", accent: "bg-emerald-50 border-emerald-100" },
          { label: "Total Expenses",  value: fmt(totalExpenses), color: "text-rose-600",    accent: "bg-rose-50 border-rose-100" },
          { label: "Net Profit",      value: fmt(netProfit),     color: netProfit >= 0 ? "text-indigo-600" : "text-red-600", accent: "bg-indigo-50 border-indigo-100" },
          { label: "Amount Paid",     value: fmt(totalPaid),     color: "text-emerald-600", accent: "bg-white border-gray-200" },
          { label: "Amount Pending",  value: fmt(totalPending),  color: "text-amber-600",   accent: "bg-white border-gray-200" },
        ].map(({ label, value, color, accent }) => (
          <div key={label} className={`border rounded-2xl px-5 py-4 shadow-sm ${accent}`}>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
            <p className={`text-lg font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors border-b-2 ${
                tab === id
                  ? "border-indigo-600 text-indigo-600 bg-indigo-50/40"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div className="space-y-6">
              {/* Income vs Expense chart */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Income vs Expense (Monthly)</p>
                {chartData.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-sm text-gray-300">No data available</div>
                ) : (
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} />
                      <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={(v) => "₹" + (v / 1000).toFixed(0) + "k"} />
                      <Tooltip formatter={(v: any) => fmt(v)} />
                      <Legend />
                      <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} dot={false} name="Income" />
                      <Line type="monotone" dataKey="expense" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 3" dot={false} name="Expense" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Expense by category */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-4">Expenses by Category</p>
                {categoryData.length === 0 ? (
                  <div className="flex items-center justify-center h-40 text-sm text-gray-300">No expense data</div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={categoryData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize: 11, fill: "#9ca3af" }} tickFormatter={(v) => "₹" + (v / 1000).toFixed(0) + "k"} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#6b7280" }} width={110} />
                      <Tooltip formatter={(v: any) => fmt(v)} />
                      <Bar dataKey="amount" fill="#6366f1" radius={[0, 4, 4, 0]} name="Amount" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Summary table */}
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Recent Transactions</p>
                <div className="border border-gray-100 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        {["#", "Type", "Description", "Date", "Amount", "Status"].map(h => (
                          <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[...billsExpenses].slice(0, 10).map((row: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50/60">
                          <td className="px-4 py-3 text-xs font-mono text-gray-400">{row.billNumber || `#${i + 1}`}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${row.type === "expense" ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"}`}>{row.type || "bill"}</span></td>
                          <td className="px-4 py-3 text-xs text-gray-700 truncate max-w-[200px]">{row.description || row.vendor || "—"}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">{row.date || "—"}</td>
                          <td className="px-4 py-3 text-xs font-semibold text-gray-900">{fmt(row.totalAmount)}</td>
                          <td className="px-4 py-3"><StatusBadge status={row.status || "draft"} /></td>
                        </tr>
                      ))}
                      {billsExpenses.length === 0 && (
                        <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-gray-300">No transactions yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── INCOME ── */}
          {tab === "income" && (
            <div className="space-y-4">
              <Filters search={search} setSearch={setSearch} dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                statuses={["all", "paid", "pending", "overdue", "draft"]} />
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Bill No", "Client", "PO Number", "Invoice Date", "Amount", "Status"].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredBills.map((b: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3 text-xs font-mono text-indigo-600">{b.billNumber || "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-800 font-medium">{b.billedTo?.name || b.billedTo || "—"}</td>
                        <td className="px-4 py-3 text-xs font-mono text-gray-400">{b.poNumber || "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-400">{b.invoiceDate || b.poDate || "—"}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-emerald-700">{fmt(b.totalAmount || b.subtotal)}</td>
                        <td className="px-4 py-3"><StatusBadge status={b.status || "draft"} /></td>
                      </tr>
                    ))}
                    {filteredBills.length === 0 && (
                      <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-300">No income records found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 text-right">{filteredBills.length} record{filteredBills.length !== 1 ? "s" : ""} · Total: <span className="font-semibold text-gray-700">{fmt(filteredBills.reduce((a: number, b: any) => a + (Number(b.totalAmount) || Number(b.subtotal) || 0), 0))}</span></p>
            </div>
          )}

          {/* ── EXPENSES ── */}
          {tab === "expenses" && (
            <div className="space-y-4">
              <Filters search={search} setSearch={setSearch} dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                statuses={["all", "paid", "pending", "overdue", "draft"]} />
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Bill No", "Type", "Category", "Vendor", "Date", "Due Date", "Total", "Paid", "Balance", "Status"].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredExpenses.map((b: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3 text-xs font-mono text-indigo-600">{b.billNumber || "—"}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${b.type === "expense" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}>{b.type || "—"}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-600">{b.category || "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-800 font-medium">{b.vendor || "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{b.date || "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{b.dueDate || "—"}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-gray-900">{fmt(b.totalAmount)}</td>
                        <td className="px-4 py-3 text-xs text-emerald-700">{fmt(b.paidAmount)}</td>
                        <td className="px-4 py-3 text-xs text-rose-600">{fmt(b.balanceAmount)}</td>
                        <td className="px-4 py-3"><StatusBadge status={b.status || "draft"} /></td>
                      </tr>
                    ))}
                    {filteredExpenses.length === 0 && (
                      <tr><td colSpan={10} className="px-4 py-12 text-center text-sm text-gray-300">No expense records found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 text-right">{filteredExpenses.length} record{filteredExpenses.length !== 1 ? "s" : ""} · Total: <span className="font-semibold text-gray-700">{fmt(filteredExpenses.reduce((a: number, b: any) => a + (Number(b.totalAmount) || 0), 0))}</span></p>
            </div>
          )}

          {/* ── BILLS ── */}
          {tab === "bills" && (
            <div className="space-y-4">
              <Filters search={search} setSearch={setSearch} dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo} statusFilter={statusFilter} setStatusFilter={setStatusFilter}
                statuses={["all", "paid", "pending", "overdue", "draft", "completed", "cancelled"]} />
              <div className="border border-gray-100 rounded-xl overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {["Bill No", "Type", "Category", "Vendor / Client", "Description", "Date", "Amount", "Status", "Payment Method"].map(h => (
                        <th key={h} className="text-left px-4 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[...bills, ...billsExpenses].filter((b: any) => {
                      const text = JSON.stringify(b).toLowerCase();
                      if (search && !text.includes(search.toLowerCase())) return false;
                      if (statusFilter !== "all" && b.status !== statusFilter) return false;
                      return true;
                    }).map((b: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/60">
                        <td className="px-4 py-3 text-xs font-mono text-indigo-600 whitespace-nowrap">{b.billNumber || "—"}</td>
                        <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${b.type === "expense" ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"}`}>{b.type || "invoice"}</span></td>
                        <td className="px-4 py-3 text-xs text-gray-500">{b.category || "—"}</td>
                        <td className="px-4 py-3 text-xs font-medium text-gray-800 whitespace-nowrap">{b.vendor || b.billedTo?.name || b.billedTo || "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px] truncate">{b.description || b.notes || "—"}</td>
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{b.date || b.invoiceDate || "—"}</td>
                        <td className="px-4 py-3 text-xs font-semibold text-gray-900">{fmt(b.totalAmount || b.subtotal)}</td>
                        <td className="px-4 py-3"><StatusBadge status={b.status || "draft"} /></td>
                        <td className="px-4 py-3 text-xs text-gray-400 capitalize">{b.paymentMethod || "—"}</td>
                      </tr>
                    ))}
                    {bills.length === 0 && billsExpenses.length === 0 && (
                      <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-gray-300">No records found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Filter bar ─────────────────────────────────────────────────────────────

function Filters({ search, setSearch, dateFrom, setDateFrom, dateTo, setDateTo, statusFilter, setStatusFilter, statuses }: {
  search: string; setSearch: (v: string) => void;
  dateFrom: string; setDateFrom: (v: string) => void;
  dateTo: string; setDateTo: (v: string) => void;
  statusFilter: string; setStatusFilter: (v: string) => void;
  statuses: string[];
}) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1.5 flex-1 min-w-[180px]">
        <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-300 w-full"
        />
      </div>
      <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5">
        <Calendar className="h-3.5 w-3.5 text-gray-400" />
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="text-xs text-gray-600 bg-transparent outline-none" />
        <span className="text-gray-300 text-xs">–</span>
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="text-xs text-gray-600 bg-transparent outline-none" />
      </div>
      <div className="flex items-center gap-1.5">
        <Filter className="h-3.5 w-3.5 text-gray-400" />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="text-xs text-gray-600 border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none capitalize"
        >
          {statuses.map(s => <option key={s} value={s} className="capitalize">{s === "all" ? "All Statuses" : s}</option>)}
        </select>
      </div>
    </div>
  );
}
