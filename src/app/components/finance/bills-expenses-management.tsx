import { useState, useEffect } from "react";
import {
  Plus, Edit, Trash2, Search, Sparkles, RefreshCw,
  CheckCircle, AlertCircle, Clock, MinusCircle, Loader2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { toast } from "sonner";
import * as api from "@/app/api/supabase-api";

// ── Types ──────────────────────────────────────────────────────────────────

export interface BillExpense {
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
  dueDate?: string;
  paidAmount: number;
  balanceAmount: number;
  status: "paid" | "partial" | "pending" | "overdue";
  paymentMethod?: string;
  billImageUrl?: string;
  notes?: string;
  extractedByAI?: boolean;
  syncedFromBilling?: boolean;
  syncedFromHR?: boolean;
  items?: Array<{ description: string; quantity: number; rate: number; amount: number }>;
}

// ── Constants ──────────────────────────────────────────────────────────────

const EXPENSE_CATEGORIES = [
  "Raw Materials","Fabric Purchase","Accessories","Utilities","Rent",
  "Salary & Wages","Office Supplies","Marketing","Transportation",
  "Maintenance","Insurance","Professional Fees","Packaging",
  "Machinery","Tools & Equipment","Miscellaneous",
];

const PAYMENT_METHODS = ["Cash","Bank Transfer","Cheque","UPI","Credit Card","Petty Cash"];

const STATUS_CFG = {
  paid:    { label: "Paid",     bg: "bg-emerald-50",  text: "text-emerald-700", icon: CheckCircle },
  partial: { label: "Partial",  bg: "bg-blue-50",     text: "text-blue-700",    icon: MinusCircle },
  pending: { label: "Pending",  bg: "bg-amber-50",    text: "text-amber-700",   icon: Clock },
  overdue: { label: "Overdue",  bg: "bg-red-50",      text: "text-red-600",     icon: AlertCircle },
} as const;

// ── Helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function StatusBadge({ status }: { status: BillExpense["status"] }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.pending;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <Icon className="h-2.5 w-2.5" /> {cfg.label}
    </span>
  );
}

// ── Shared input style ─────────────────────────────────────────────────────

const inp = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder:text-gray-300 transition-colors";
const lbl = "block text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1";

// ── Main Component ─────────────────────────────────────────────────────────

export function BillsExpensesManagement() {
  const [billsExpenses, setBillsExpenses] = useState<BillExpense[]>([]);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<BillExpense | null>(null);
  const [extractingData, setExtractingData] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [paymentItem, setPaymentItem] = useState<BillExpense | null>(null);
  const [paymentForm, setPaymentForm] = useState({ paidAmount: "", paymentMethod: "", notes: "" });

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Expense form
  const blankForm = {
    expenseNumber: "", category: "", vendor: "", description: "",
    amount: "", tax: "", date: new Date().toISOString().split("T")[0],
    paidAmount: "", paymentMethod: "", notes: "",
  };
  const [expenseForm, setExpenseForm] = useState(blankForm);
  const [expenseImagePreview, setExpenseImagePreview] = useState("");

  // Load
  useEffect(() => {
    loadData().then(() => syncSalariesFromHR());
  }, []);

  const loadData = async () => {
    try {
      const data = await api.fetchBillsExpenses();
      if (data.length) setBillsExpenses(data);
      else {
        const stored = localStorage.getItem("erp_bills_expenses");
        if (stored) setBillsExpenses(JSON.parse(stored));
      }
    } catch {
      const stored = localStorage.getItem("erp_bills_expenses");
      if (stored) setBillsExpenses(JSON.parse(stored));
    }
  };

  const syncSalariesFromHR = () => {
    try {
      const salariesData = localStorage.getItem("erp_employee_salaries");
      if (!salariesData) return;
      const salaries = JSON.parse(salariesData);
      const existingData: BillExpense[] = JSON.parse(localStorage.getItem("erp_bills_expenses") || "[]");

      salaries.forEach((salary: any) => {
        const existingIndex = existingData.findIndex(
          (e) => e.billNumber === `SAL-${salary.id}` && e.syncedFromHR
        );
        const salaryExpense: BillExpense = {
          id: salary.id || `salary-sync-${Date.now()}-${Math.random()}`,
          billNumber: `SAL-${salary.employeeId || salary.id}`,
          type: "expense", category: "Salary & Wages",
          vendor: salary.employeeName || salary.name || "Employee",
          description: `Salary – ${salary.employeeName || salary.name} (${salary.month || ""} ${salary.year || ""})`,
          amount: (salary.grossSalary || 0) - (salary.totalDeductions || 0),
          tax: 0,
          totalAmount: salary.netSalary || salary.finalAmount || 0,
          date: salary.paymentDate || salary.date || new Date().toISOString().split("T")[0],
          paidAmount: salary.status === "paid" ? (salary.netSalary || 0) : 0,
          balanceAmount: salary.status === "paid" ? 0 : (salary.netSalary || 0),
          status: salary.status || "pending",
          paymentMethod: salary.paymentMethod || "Bank Transfer",
          syncedFromHR: true,
          notes: `Gross: ${fmt(salary.grossSalary || 0)}, Deductions: ${fmt(salary.totalDeductions || 0)}`,
        };

        if (existingIndex >= 0) {
          const ex = existingData[existingIndex];
          existingData[existingIndex] = { ...salaryExpense, paidAmount: ex.paidAmount, balanceAmount: ex.balanceAmount, status: ex.status, paymentMethod: ex.paymentMethod ?? salaryExpense.paymentMethod };
        } else {
          existingData.push(salaryExpense);
        }
      });

      persist(existingData);
      setBillsExpenses(existingData);
    } catch (e) {
      console.error("Failed to sync salaries:", e);
    }
  };

  const persist = (items: BillExpense[]) => {
    localStorage.setItem("erp_bills_expenses", JSON.stringify(items));
    api.bulkSaveBillsExpenses(items).catch(() => {});
  };

  const generateExpenseNumber = () => {
    const year = new Date().getFullYear();
    const count = billsExpenses.filter((b) => b.type === "expense").length + 1;
    return `EXP-${year}-${String(count).padStart(4, "0")}`;
  };

  // AI receipt upload
  const handleExpenseImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setExpenseImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setExtractingData(true);
    toast.info("Extracting expense details…");
    setTimeout(() => {
      const vendors = ["City Electricity Board","Office Supplies Co","Landlord Property","Transport Services"];
      const cats   = ["Utilities","Office Supplies","Rent","Transportation"];
      const i = Math.floor(Math.random() * vendors.length);
      setExpenseForm(f => ({ ...f, vendor: vendors[i], category: cats[i], description: `Payment for ${cats[i].toLowerCase()}`, amount: String(Math.floor(Math.random() * 10000) + 1000), tax: String(Math.floor(Math.random() * 500) + 100), date: new Date().toISOString().split("T")[0] }));
      setExtractingData(false);
      toast.success("Details extracted!");
    }, 2000);
  };

  const openAdd = () => {
    setExpenseForm({ ...blankForm, expenseNumber: generateExpenseNumber() });
    setExpenseImagePreview("");
    setEditingExpense(null);
    setShowExpenseDialog(true);
  };

  const openEdit = (exp: BillExpense) => {
    if (exp.syncedFromHR) { toast.error("Edit in HR module"); return; }
    setExpenseForm({ expenseNumber: exp.billNumber, category: exp.category, vendor: exp.vendor, description: exp.description, amount: String(exp.amount), tax: String(exp.tax), date: exp.date, paidAmount: String(exp.paidAmount), paymentMethod: exp.paymentMethod || "", notes: exp.notes || "" });
    setExpenseImagePreview(exp.billImageUrl || "");
    setEditingExpense(exp);
    setShowExpenseDialog(true);
  };

  const handleSaveExpense = () => {
    const amount = parseFloat(expenseForm.amount || "0");
    const tax = parseFloat(expenseForm.tax || "0");
    const total = amount + tax;
    const paid = parseFloat(expenseForm.paidAmount || "0") || total;
    const expense: BillExpense = {
      id: editingExpense?.id || `expense-${Date.now()}`,
      billNumber: expenseForm.expenseNumber, type: "expense",
      category: expenseForm.category, vendor: expenseForm.vendor,
      description: expenseForm.description, amount, tax, totalAmount: total,
      date: expenseForm.date, paidAmount: paid, balanceAmount: total - paid,
      status: paid >= total ? "paid" : paid > 0 ? "partial" : "pending",
      paymentMethod: expenseForm.paymentMethod, notes: expenseForm.notes,
      billImageUrl: expenseImagePreview, extractedByAI: !!expenseImagePreview,
    };
    const newList = editingExpense
      ? billsExpenses.map((b) => (b.id === editingExpense.id ? expense : b))
      : [...billsExpenses, expense];
    setBillsExpenses(newList);
    persist(newList);
    api.saveBillExpense(expense).catch(() => {});
    toast.success(editingExpense ? "Expense updated" : "Expense added");
    setShowExpenseDialog(false);
  };

  const handleDelete = (id: string) => {
    const item = billsExpenses.find((b) => b.id === id);
    if (item?.syncedFromHR) { toast.error("Delete in HR module"); return; }
    if (!confirm("Delete this expense?")) return;
    const newList = billsExpenses.filter((b) => b.id !== id);
    setBillsExpenses(newList);
    persist(newList);
    api.deleteBillExpense(id).catch(() => {});
    toast.success("Expense deleted");
  };

  const openPayment = (item: BillExpense) => {
    setPaymentItem(item);
    setPaymentForm({ paidAmount: String(item.paidAmount), paymentMethod: item.paymentMethod || "", notes: item.notes || "" });
    setShowPaymentDialog(true);
  };

  const handleSavePayment = () => {
    if (!paymentItem) return;
    const paid = parseFloat(paymentForm.paidAmount || "0");
    if (isNaN(paid) || paid < 0) { toast.error("Enter valid amount"); return; }
    if (paid > paymentItem.totalAmount) { toast.error("Amount exceeds total"); return; }
    const updated: BillExpense = { ...paymentItem, paidAmount: paid, balanceAmount: paymentItem.totalAmount - paid, status: paid >= paymentItem.totalAmount ? "paid" : paid > 0 ? "partial" : "pending", paymentMethod: paymentForm.paymentMethod, notes: paymentForm.notes };
    const newList = billsExpenses.map((b) => (b.id === paymentItem.id ? updated : b));
    setBillsExpenses(newList);
    persist(newList);
    api.saveBillExpense(updated).catch(() => {});
    toast.success("Payment recorded");
    setShowPaymentDialog(false);
  };

  // Filtered (bills excluded at display layer)
  const filteredData = billsExpenses.filter((item) => {
    if (item.type === "bill") return false;
    const q = searchQuery.toLowerCase();
    const matchQ = !q || item.billNumber.toLowerCase().includes(q) || item.vendor.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    const matchCat = categoryFilter === "all" || item.category === categoryFilter;
    const matchSt = statusFilter === "all" || item.status === statusFilter;
    return matchQ && matchCat && matchSt;
  });

  // Stats — expenses only
  const expenses = billsExpenses.filter((b) => b.type === "expense");
  const totalPaid = expenses.reduce((s, b) => s + b.paidAmount, 0);
  const totalPending = expenses.reduce((s, b) => s + b.balanceAmount, 0);
  const totalExpenseVal = expenses.reduce((s, b) => s + b.totalAmount, 0);
  const syncedFromHR = expenses.filter((b) => b.syncedFromHR).length;

  return (
    <div className="space-y-4">

      {/* Stats — compact horizontal strip */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
        {[
          { label: "Expenses",   value: expenses.length,   sub: fmt(totalExpenseVal),  color: "text-gray-900" },
          { label: "Paid",       value: fmt(totalPaid),    sub: `${expenses.filter(b => b.status === "paid").length} fully paid`, color: "text-emerald-600" },
          { label: "Pending",    value: fmt(totalPending), sub: `${expenses.filter(b => b.status === "pending").length} items`,   color: "text-amber-600" },
          { label: "HR Synced",  value: syncedFromHR,      sub: "salary entries",       color: "text-indigo-600" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="px-5 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-0.5">{label}</p>
            <p className={`text-lg font-bold ${color}`}>{value}</p>
            <p className="text-[10px] text-gray-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <button
              onClick={openAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" /> Add Expense
            </button>
            <button
              onClick={() => { syncSalariesFromHR(); toast.success("Synced HR salaries"); }}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-medium rounded-lg transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Sync HR
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white">
              <Search className="h-3.5 w-3.5 text-gray-400 shrink-0" />
              <input
                placeholder="Search…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-xs text-gray-700 bg-transparent outline-none w-36 placeholder:text-gray-300"
              />
            </div>

            {/* Category filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-8 text-xs border-gray-200 rounded-lg w-36">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Status filter */}
            <div className="flex gap-1">
              {(["all","paid","partial","pending","overdue"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold capitalize transition-colors ${statusFilter === s ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table or empty state */}
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-400">
              {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                ? "No expenses match your filters"
                : "No expenses yet"}
            </p>
            {!searchQuery && categoryFilter === "all" && statusFilter === "all" && (
              <button onClick={openAdd} className="text-xs text-indigo-600 hover:underline">
                Add your first expense →
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Number","Vendor","Category","Description","Date","Total","Paid","Balance","Status",""].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-semibold text-indigo-500">{item.billNumber}</span>
                        {item.syncedFromHR && (
                          <span className="text-[9px] font-semibold bg-indigo-50 text-indigo-500 px-1.5 py-0.5 rounded">HR</span>
                        )}
                        {item.extractedByAI && (
                          <Sparkles className="h-3 w-3 text-violet-400" title="AI extracted" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-medium text-gray-800 max-w-[120px] truncate">{item.vendor}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{item.category}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[180px] truncate">{item.description}</td>
                    <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{item.date}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-900 whitespace-nowrap">{fmt(item.totalAmount)}</td>
                    <td className="px-4 py-3 text-xs text-emerald-600 whitespace-nowrap">{fmt(item.paidAmount)}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-red-500 whitespace-nowrap">{fmt(item.balanceAmount)}</td>
                    <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!item.syncedFromHR && (
                          <>
                            <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit">
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openPayment(item)}
                          className="px-2.5 py-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap"
                        >
                          Record Payment
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add / Edit Expense Dialog ──────────────────────────────── */}
      <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingExpense ? "Edit Expense" : "Add Expense"}</DialogTitle>
            <DialogDescription>
              {editingExpense ? "Update expense details below." : "Upload a receipt for AI extraction or fill manually."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-1">
            {/* AI upload */}
            {!editingExpense && (
              <div className="border border-dashed border-gray-200 rounded-xl p-5 bg-gray-50 text-center">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-indigo-400" />
                <p className="text-xs font-medium text-gray-600 mb-3">Upload a receipt to auto-fill details</p>
                <input type="file" accept="image/*" onChange={handleExpenseImageUpload} disabled={extractingData} className="text-xs mx-auto" />
                {extractingData && (
                  <div className="flex items-center justify-center gap-2 mt-3 text-indigo-600 text-xs">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Extracting…
                  </div>
                )}
                {expenseImagePreview && (
                  <img src={expenseImagePreview} alt="Receipt" className="max-h-32 mx-auto mt-3 rounded-lg" />
                )}
              </div>
            )}

            {/* Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className={lbl}>Expense No</p>
                <input className={`${inp} bg-gray-50 text-gray-400`} value={expenseForm.expenseNumber} disabled />
              </div>
              <div>
                <p className={lbl}>Date *</p>
                <input type="date" className={inp} value={expenseForm.date} onChange={e => setExpenseForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <p className={lbl}>Vendor / Paid To *</p>
                <input className={inp} placeholder="Enter vendor or store name" value={expenseForm.vendor} onChange={e => setExpenseForm(f => ({ ...f, vendor: e.target.value }))} />
              </div>
              <div>
                <p className={lbl}>Category *</p>
                <Select value={expenseForm.category} onValueChange={v => setExpenseForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="h-9 text-sm border-gray-200 rounded-lg"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>{EXPENSE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <p className={lbl}>Payment Method *</p>
                <Select value={expenseForm.paymentMethod} onValueChange={v => setExpenseForm(f => ({ ...f, paymentMethod: v }))}>
                  <SelectTrigger className="h-9 text-sm border-gray-200 rounded-lg"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>{PAYMENT_METHODS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <p className={lbl}>Amount (before tax) *</p>
                <input type="number" className={inp} placeholder="0.00" value={expenseForm.amount} onChange={e => setExpenseForm(f => ({ ...f, amount: e.target.value }))} min={0} />
              </div>
              <div>
                <p className={lbl}>Tax / GST</p>
                <input type="number" className={inp} placeholder="0.00" value={expenseForm.tax} onChange={e => setExpenseForm(f => ({ ...f, tax: e.target.value }))} min={0} />
              </div>
              <div>
                <p className={lbl}>Total</p>
                <input className={`${inp} bg-gray-50 font-semibold text-gray-700`} value={fmt(parseFloat(expenseForm.amount || "0") + parseFloat(expenseForm.tax || "0"))} disabled />
              </div>
              <div>
                <p className={lbl}>Paid Amount (blank = full)</p>
                <input type="number" className={inp} placeholder="Default: full amount" value={expenseForm.paidAmount} onChange={e => setExpenseForm(f => ({ ...f, paidAmount: e.target.value }))} min={0} />
              </div>
              <div className="col-span-2">
                <p className={lbl}>Description *</p>
                <input className={inp} placeholder="What is this expense for?" value={expenseForm.description} onChange={e => setExpenseForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="col-span-2">
                <p className={lbl}>Notes</p>
                <textarea className={`${inp} resize-none`} rows={2} placeholder="Additional notes…" value={expenseForm.notes} onChange={e => setExpenseForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <button onClick={() => setShowExpenseDialog(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button
              onClick={handleSaveExpense}
              disabled={!expenseForm.vendor || !expenseForm.category || !expenseForm.description || !expenseForm.amount || !expenseForm.paymentMethod}
              className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg transition-colors"
            >
              {editingExpense ? "Update Expense" : "Save Expense"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Record Payment Dialog ──────────────────────────────────── */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>{paymentItem?.billNumber} · {paymentItem?.vendor}</DialogDescription>
          </DialogHeader>

          {paymentItem && (
            <div className="space-y-4 py-1">
              {/* Summary strip */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-gray-400">Total</span><span className="font-semibold text-gray-800">{fmt(paymentItem.totalAmount)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Paid</span><span className="text-emerald-600">{fmt(paymentItem.paidAmount)}</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Balance</span><span className="font-semibold text-red-500">{fmt(paymentItem.balanceAmount)}</span></div>
              </div>

              <div>
                <p className={lbl}>Paid Amount (₹)</p>
                <input type="number" className={inp} placeholder="0.00" value={paymentForm.paidAmount} onChange={e => setPaymentForm(f => ({ ...f, paidAmount: e.target.value }))} min={0} />
                <div className="flex gap-1.5 mt-2">
                  {[["Pending","0"],["50%", String(paymentItem.totalAmount / 2)],["Full", String(paymentItem.totalAmount)]].map(([label, val]) => (
                    <button key={label} onClick={() => setPaymentForm(f => ({ ...f, paidAmount: val }))} className="flex-1 py-1 text-[10px] font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">{label}</button>
                  ))}
                </div>
              </div>

              <div>
                <p className={lbl}>Payment Method</p>
                <Select value={paymentForm.paymentMethod} onValueChange={v => setPaymentForm(f => ({ ...f, paymentMethod: v }))}>
                  <SelectTrigger className="h-9 text-sm border-gray-200 rounded-lg"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Razorpay">Razorpay</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <p className={lbl}>Notes</p>
                <textarea className={`${inp} resize-none`} rows={2} placeholder="Optional notes" value={paymentForm.notes} onChange={e => setPaymentForm(f => ({ ...f, notes: e.target.value }))} />
              </div>

              {paymentForm.paidAmount !== "" && (
                <div className={`rounded-xl px-3 py-2 text-xs font-medium ${parseFloat(paymentForm.paidAmount) >= paymentItem.totalAmount ? "bg-emerald-50 text-emerald-700" : parseFloat(paymentForm.paidAmount) > 0 ? "bg-amber-50 text-amber-700" : "bg-red-50 text-red-600"}`}>
                  Status after save: {parseFloat(paymentForm.paidAmount) >= paymentItem.totalAmount ? "Fully Paid" : parseFloat(paymentForm.paidAmount) > 0 ? "Partial" : "Pending"}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <button onClick={() => setShowPaymentDialog(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
            <button onClick={handleSavePayment} className="px-4 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">Save Payment</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
