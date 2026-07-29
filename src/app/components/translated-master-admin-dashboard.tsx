import { useState, useEffect, useMemo } from "react";
import {
  Building2,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  DollarSign,
  BarChart3,
  Users,
  FileText,
  Receipt,
  ArrowRight,
  Inbox,
  CalendarDays,
  Ruler,
  TrendingUp,
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CompanyPerformanceBarChart } from "@/app/components/charts/company-performance-bar-chart";
import { useLanguage, LanguageProvider } from "@/app/contexts/language-context";
import { MasterManagerAIAssistant } from "@/app/components/master-manager/master-manager-ai-assistant";
import { usePOData, PODataProvider } from "@/app/contexts/po-data-context";
import * as api from "@/app/api/supabase-api";

function EmptyState({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-3">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
      <p className="text-xs text-gray-400 max-w-xs">{subtitle}</p>
    </div>
  );
}

export function TranslatedMasterAdminDashboard({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const { t } = useLanguage();
  const { purchaseOrders, employeesByPO, isLoading } = usePOData();
  const [bills, setBills] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Fetch bills and users
  useEffect(() => {
    api.fetchBills().then(b => setBills(b || [])).catch(() => {});
    api.fetchUsers().then(u => setUsers(u || [])).catch(() => {});
  }, []);

  const handleNavigate = (view: string) => {
    if (onNavigate) onNavigate(view);
  };

  // ── Derive all stats from real PO data ──
  const stats = useMemo(() => {
    const total = purchaseOrders.length;
    const confirmed = purchaseOrders.filter(p => p.status === "confirmed").length;
    const inMeasurement = purchaseOrders.filter(p => p.status === "in-measurement").length;
    const inProduction = purchaseOrders.filter(p => p.status === "in-production").length;
    const completed = purchaseOrders.filter(p => p.status === "completed").length;
    const cancelled = purchaseOrders.filter(p => p.status === "cancelled").length;
    const draft = purchaseOrders.filter(p => p.status === "draft").length;

    // Delayed = past deliveryDeadline and not completed/cancelled
    const now = new Date();
    const delayed = purchaseOrders.filter(p => {
      if (p.status === "completed" || p.status === "cancelled") return false;
      const deadline = new Date(p.deliveryDeadline);
      return deadline < now;
    }).length;

    const totalQuantity = purchaseOrders.reduce((s, p) => s + (p.totalQuantity || 0), 0);
    const totalValue = purchaseOrders.reduce((s, p) => s + (p.totalOrderValue || 0), 0);
    const totalMeasured = purchaseOrders.reduce((s, p) => s + (p.measurementsCompleted || 0), 0);
    const totalEmployees = purchaseOrders.reduce((s, p) => s + (p.employeesUploaded || 0), 0);

    const successRate = total > 0 ? ((completed / (total - draft)) * 100) : 0;
    const onTimeDelivery = total > 0 ? (((completed) / Math.max(completed + delayed, 1)) * 100) : 0;
    const active = total - completed - cancelled - draft;

    return {
      total, confirmed, inMeasurement, inProduction, completed, cancelled,
      draft, delayed, totalQuantity, totalValue, totalMeasured, totalEmployees,
      successRate: isNaN(successRate) || !isFinite(successRate) ? 0 : successRate,
      onTimeDelivery: isNaN(onTimeDelivery) || !isFinite(onTimeDelivery) ? 0 : onTimeDelivery,
      active,
    };
  }, [purchaseOrders]);

  // ── Income vs Expense: static sample data (last 7 months) ──
  const incomeExpenseData = useMemo(() => {
    const base = [
      { month: "Jul", income: 320000, expense: 210000 },
      { month: "Aug", income: 410000, expense: 260000 },
      { month: "Sep", income: 380000, expense: 290000 },
      { month: "Oct", income: 470000, expense: 310000 },
      { month: "Nov", income: 520000, expense: 340000 },
      { month: "Dec", income: 610000, expense: 390000 },
      { month: "Jan", income: 580000, expense: 360000 },
    ];
    return base;
  }, []);

  // ── (kept for other usages) Production Trend: group POs by month (last 7 months) ──
  const productionTrendData = useMemo(() => {
    const months: { key: string; label: string }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
        label: d.toLocaleString("default", { month: "short" }),
      });
    }

    return months.map((m, idx) => {
      const posInMonth = purchaseOrders.filter(po => {
        const d = new Date(po.createdDate || po.poDate);
        const poKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        return poKey === m.key;
      });

      const orders = posInMonth.length;
      const completed = posInMonth.filter(p => p.status === "completed").length;
      const nowDate = new Date();
      const delayed = posInMonth.filter(p => {
        if (p.status === "completed" || p.status === "cancelled") return false;
        return new Date(p.deliveryDeadline) < nowDate;
      }).length;

      return { id: `month-${idx}`, month: m.label, orders, completed, delayed };
    });
  }, [purchaseOrders]);

  // ── Company Performance: group POs by client company ──
  const companyPerformanceData = useMemo(() => {
    const map: Record<string, { orders: number; completed: number; pending: number }> = {};
    purchaseOrders.forEach(po => {
      const name = po.clientCompanyName || "Unknown";
      if (!map[name]) map[name] = { orders: 0, completed: 0, pending: 0 };
      map[name].orders++;
      if (po.status === "completed") map[name].completed++;
      else if (po.status !== "cancelled") map[name].pending++;
    });

    return Object.entries(map)
      .sort((a, b) => b[1].orders - a[1].orders)
      .slice(0, 6)
      .map(([company, d], idx) => ({
        id: `company-${idx}`,
        company: company.length > 18 ? company.slice(0, 16) + "…" : company,
        orders: d.orders,
        completed: d.completed,
        pending: d.pending,
      }));
  }, [purchaseOrders]);

  // ── Recent Activities: derive from real PO + bill data sorted by date ──
  const recentActivities = useMemo(() => {
    const activities: { id: string; type: string; message: string; time: string; status: string; date: Date }[] = [];

    // From POs
    purchaseOrders.forEach(po => {
      const date = new Date(po.updatedDate || po.createdDate);
      const poLabel = po.poNumber || po.id;

      if (po.status === "completed") {
        activities.push({ id: `po-done-${po.id}`, type: "production", message: `PO ${poLabel} completed for ${po.clientCompanyName}`, time: "", status: "completed", date });
      } else if (po.status === "in-production") {
        activities.push({ id: `po-prod-${po.id}`, type: "production", message: `Production started for ${poLabel} (${po.clientCompanyName})`, time: "", status: "in-progress", date });
      } else if (po.status === "in-measurement") {
        activities.push({ id: `po-meas-${po.id}`, type: "measurement", message: `Measurement in progress for ${poLabel}`, time: "", status: "in-progress", date });
      } else if (po.status === "confirmed") {
        activities.push({ id: `po-conf-${po.id}`, type: "order", message: `PO ${poLabel} confirmed from ${po.clientCompanyName}`, time: "", status: "new", date });
      } else if (po.status === "cancelled") {
        activities.push({ id: `po-can-${po.id}`, type: "alert", message: `PO ${poLabel} cancelled`, time: "", status: "alert", date });
      } else if (po.status === "draft") {
        activities.push({ id: `po-draft-${po.id}`, type: "order", message: `Draft PO ${poLabel} created`, time: "", status: "new", date });
      }
    });

    // From bills
    bills.forEach((bill: any) => {
      const date = new Date(bill.updatedAt || bill.createdAt || bill.date);
      activities.push({
        id: `bill-${bill.id}`,
        type: "dispatch",
        message: `Bill ${bill.billNumber || bill.id} – ₹${(bill.totalAmount || 0).toLocaleString("en-IN")}`,
        time: "",
        status: bill.status === "paid" ? "completed" : bill.status === "overdue" ? "alert" : "in-progress",
        date,
      });
    });

    // Format relative time and sort
    const now = new Date();
    activities.forEach(a => {
      const diff = now.getTime() - a.date.getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) a.time = "Just now";
      else if (mins < 60) a.time = `${mins} min ago`;
      else if (mins < 1440) a.time = `${Math.floor(mins / 60)} hr ago`;
      else a.time = `${Math.floor(mins / 1440)} days ago`;
    });

    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 8);
  }, [purchaseOrders, bills]);

  const hasPOs = purchaseOrders.length > 0;

  const activityDot: Record<string, string> = {
    new:           "bg-blue-400",
    completed:     "bg-emerald-400",
    "in-progress": "bg-amber-400",
    alert:         "bg-red-400",
  };

  const quickLinks = [
    { label: "Create New PO",                              sub: "Create a new purchase order",                icon: ShoppingCart, dot: "bg-indigo-400", view: "create-po"            },
    { label: t('masterDashboard.companyManagement'),       sub: t('masterDashboard.manageCompanyDetails'),    icon: Building2, dot: "bg-violet-400",  view: "company-management"    },
    { label: "Add Fabric",                                 sub: "Add a new fabric to the fabric store",       icon: Package,   dot: "bg-emerald-400", view: "fabric-store-add"      },
    { label: t('masterDashboard.userManagement'),          sub: t('masterDashboard.manageUserDetails'),       icon: Users,     dot: "bg-indigo-400",  view: "user-management"       },
    { label: t('masterDashboard.billingManagement'),       sub: t('masterDashboard.manageBilling'),           icon: Receipt,   dot: "bg-pink-400",    view: "billing-invoices"      },
  ];

  return (
    <div className="space-y-5 pb-8">

      {/* ── Header ── */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{t('masterDashboard.title')}</h1>
        <p className="text-xs text-gray-400 mt-0.5">{t('masterDashboard.description')}</p>
      </div>

      {/* ── Quick Access ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">Quick Access</p>
          <p className="text-xs text-gray-400 mt-0.5">Navigate to key modules</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 divide-x divide-y divide-gray-100">
          {quickLinks.map((ql, i) => {
            const Icon = ql.icon;
            return (
              <button
                key={i}
                onClick={() => handleNavigate(ql.view)}
                className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50/70 transition-colors text-left group"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                  <Icon className="h-4 w-4 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{ql.label}</p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">{ql.sub}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Income vs Expense ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Income vs Expense</p>
            <p className="text-xs text-gray-400 mt-0.5">Last 7 months financial overview</p>
          </div>
          <div className="flex items-center gap-4">
            {[
              { label: "Income",  dot: "bg-emerald-500" },
              { label: "Expense", dot: "bg-rose-500" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${l.dot}`} />
                <span className="text-xs text-gray-500">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-4 py-5">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={incomeExpenseData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#94A3B8" }}
                axisLine={false}
                tickLine={false}
                width={52}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  const income  = payload.find((p: any) => p.dataKey === "income")?.value  ?? 0;
                  const expense = payload.find((p: any) => p.dataKey === "expense")?.value ?? 0;
                  const net = income - expense;
                  return (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-xs">
                      <p className="font-semibold text-gray-700 mb-2">{label}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-gray-500">Income:</span>
                        <span className="font-semibold text-gray-800">₹{Number(income).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-gray-500">Expense:</span>
                        <span className="font-semibold text-gray-800">₹{Number(expense).toLocaleString("en-IN")}</span>
                      </div>
                      <div className="border-t border-gray-100 pt-2 flex justify-between">
                        <span className="text-gray-400">Net</span>
                        <span className={`font-semibold ${net >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          ₹{Math.abs(net).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              <Line type="monotone" dataKey="income"  stroke="#10B981" strokeWidth={2.5} dot={{ r: 3, fill: "#10B981", strokeWidth: 0 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3, fill: "#EF4444", strokeWidth: 0 }} activeDot={{ r: 5 }} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Summary strip */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
          {[
            { label: "Total Income",  value: `₹${(incomeExpenseData.reduce((s, d) => s + d.income,  0) / 100000).toFixed(1)}L`, color: "text-emerald-600" },
            { label: "Total Expense", value: `₹${(incomeExpenseData.reduce((s, d) => s + d.expense, 0) / 100000).toFixed(1)}L`, color: "text-rose-500"    },
            { label: "Net Profit",    value: `₹${(incomeExpenseData.reduce((s, d) => s + d.income - d.expense, 0) / 100000).toFixed(1)}L`, color: "text-indigo-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="px-6 py-3 text-center">
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className={`text-base font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Company Performance ── */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-900">{t('masterDashboard.topCompaniesPerformance')}</p>
          <p className="text-xs text-gray-400 mt-0.5">{t('masterDashboard.ordersByCompany')}</p>
        </div>
        <div className="px-6 py-5">
          {companyPerformanceData.length > 0 ? (
            <CompanyPerformanceBarChart data={companyPerformanceData} />
          ) : (
            <EmptyState icon={Building2} title="No company data yet" subtitle="Company performance will appear once you have Purchase Orders." />
          )}
        </div>
      </div>

      {/* ── AI Assistant ── */}
      <MasterManagerAIAssistant />
    </div>
  );
}

// ── Standalone version with providers for Figma preview mode ──
export function TranslatedMasterAdminDashboardStandalone() {
  return (
    <LanguageProvider>
      <PODataProvider>
        <TranslatedMasterAdminDashboard />
      </PODataProvider>
    </LanguageProvider>
  );
}