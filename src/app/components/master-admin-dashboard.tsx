import { useState } from "react";
import {
  Receipt,
  TrendingUp,
  TrendingDown,
  ChevronDown,
  ChevronUp,
  Package,
  Users,
  DollarSign,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Boxes,
  Truck,
  ShoppingBag,
  Zap,
  RefreshCw,
  Filter,
} from "lucide-react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FinancialDataManagement } from "@/app/components/finance/financial-data-management";
import { CompanyManagement } from "@/app/components/company/company-management";
import { QuickActionsPanel } from "@/app/components/quick-actions/quick-actions-panel";
import { UserManagement } from "@/app/components/user-management/user-management";
import { MasterManagerAIAssistant } from "@/app/components/master-manager/master-manager-ai-assistant";
import { BillingManagement } from "@/app/components/billing/billing-management";

// ─── Data ────────────────────────────────────────────────────────────────────

const orderStatusData = [
  { id: "s1", name: "Completed",   value: 230, color: "#10B981" },
  { id: "s2", name: "In Progress", value: 120, color: "#6366F1" },
  { id: "s3", name: "Pending",     value: 45,  color: "#F59E0B" },
  { id: "s4", name: "Delayed",     value: 18,  color: "#EF4444" },
  { id: "s5", name: "Cancelled",   value: 12,  color: "#94A3B8" },
];

const stockAlerts = [
  { id: "st1", material: "Cotton Fabric",    current: 500,  minimum: 1000, status: "critical" },
  { id: "st2", material: "Polyester Thread", current: 1800, minimum: 1500, status: "warning"  },
  { id: "st3", material: "Buttons",          current: 8000, minimum: 5000, status: "normal"   },
  { id: "st4", material: "Zippers",          current: 2200, minimum: 2000, status: "warning"  },
  { id: "st5", material: "Denim Fabric",     current: 300,  minimum: 800,  status: "critical" },
  { id: "st6", material: "Elastic Band",     current: 3500, minimum: 2500, status: "normal"   },
];

const incomeExpenseData = [
  { month: "Jul", income: 320000, expense: 210000 },
  { month: "Aug", income: 410000, expense: 260000 },
  { month: "Sep", income: 380000, expense: 290000 },
  { month: "Oct", income: 470000, expense: 310000 },
  { month: "Nov", income: 520000, expense: 340000 },
  { month: "Dec", income: 610000, expense: 390000 },
  { month: "Jan", income: 580000, expense: 360000 },
];

const companyPerf = [
  { company: "ABC Garments",    completed: 80,  pending: 5  },
  { company: "XYZ Fashion",     completed: 110, pending: 10 },
  { company: "StyleCo",         completed: 90,  pending: 5  },
  { company: "TrendWear",       completed: 60,  pending: 8  },
  { company: "Modern Textiles", completed: 70,  pending: 2  },
];

const recentActivities = [
  { id: 1, message: "New purchase order from ABC Garments",     time: "5 min ago",   type: "new"         },
  { id: 2, message: "Measurement completed for PO-2026-045",    time: "12 min ago",  type: "completed"   },
  { id: 3, message: "Production started for order PO-2026-042", time: "25 min ago",  type: "in-progress" },
  { id: 4, message: "Shipment dispatched for XYZ Fashion",      time: "1 hour ago",  type: "completed"   },
  { id: 5, message: "Cotton fabric stock below minimum level",  time: "2 hours ago", type: "alert"       },
  { id: 6, message: "Invoice generated for TrendWear ₹1.2L",   time: "3 hours ago", type: "new"         },
];

const topMetrics = [
  {
    id: "m1",
    label: "Total Revenue",
    value: "₹48.2L",
    change: "+12.5%",
    up: true,
    icon: DollarSign,
    bg: "from-indigo-500 to-indigo-600",
    iconBg: "bg-indigo-400/30",
    sub: "vs last month",
  },
  {
    id: "m2",
    label: "Total Orders",
    value: "425",
    change: "+8.3%",
    up: true,
    icon: ShoppingBag,
    bg: "from-emerald-500 to-emerald-600",
    iconBg: "bg-emerald-400/30",
    sub: "vs last month",
  },
  {
    id: "m3",
    label: "Active Workers",
    value: "184",
    change: "+3.1%",
    up: true,
    icon: Users,
    bg: "from-violet-500 to-violet-600",
    iconBg: "bg-violet-400/30",
    sub: "vs last month",
  },
  {
    id: "m4",
    label: "Delayed Orders",
    value: "18",
    change: "-4.2%",
    up: false,
    icon: AlertTriangle,
    bg: "from-rose-500 to-rose-600",
    iconBg: "bg-rose-400/30",
    sub: "vs last month",
  },
];

const secondaryKPIs = [
  { label: "Success Rate",     value: "94.5%", dot: "#6366F1" },
  { label: "On-Time Delivery", value: "95.2%", dot: "#10B981" },
  { label: "Capacity Used",    value: "87%",   dot: "#8B5CF6" },
  { label: "Avg Cycle Time",   value: "4.2d",  dot: "#F59E0B" },
  { label: "Dispatched",       value: "211",   dot: "#06B6D4" },
  { label: "Cancelled",        value: "12",    dot: "#EF4444" },
];

const stockCfg = {
  critical: { bar: "#EF4444", text: "text-rose-500",   badge: "bg-rose-50 text-rose-600 border-rose-100",   label: "Critical" },
  warning:  { bar: "#F59E0B", text: "text-amber-500",  badge: "bg-amber-50 text-amber-600 border-amber-100", label: "Warning"  },
  normal:   { bar: "#10B981", text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-100", label: "Normal" },
};

const activityCfg = {
  new:          { dot: "#6366F1", icon: ShoppingBag,  label: "New Order"    },
  completed:    { dot: "#10B981", icon: CheckCircle2,  label: "Completed"    },
  "in-progress":{ dot: "#F59E0B", icon: Clock,         label: "In Progress"  },
  alert:        { dot: "#EF4444", icon: AlertTriangle, label: "Alert"        },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function CollapsibleSection({ title, description, badge, children }: {
  title: string; description: string; badge?: React.ReactNode; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            <p className="text-xs text-gray-400 mt-0.5">{description}</p>
          </div>
          {badge}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 px-6 py-5">{children}</div>}
    </div>
  );
}

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function LiveBadge() {
  return (
    <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      Live
    </span>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-xs">
      <p className="font-semibold text-gray-700 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-gray-500 capitalize">{p.dataKey}:</span>
          <span className="font-semibold text-gray-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function MasterAdminDashboard() {
  const [showBilling, setShowBilling] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "production" | "finance">("overview");
  const totalOrders = orderStatusData.reduce((s, d) => s + d.value, 0);
  const criticalCount = stockAlerts.filter((s) => s.status === "critical").length;

  return (
    <div className="space-y-5 pb-10">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Master Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Comprehensive overview of all manufacturing operations</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
          <button
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
          <button
            onClick={() => setShowBilling((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Receipt className="h-3.5 w-3.5" />
            {showBilling ? "Close Billing" : "Create Bill"}
          </button>
          <button
            onClick={() => alert("Generating report...")}
            className="flex items-center gap-1.5 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            Generate Report
          </button>
        </div>
      </div>

      {/* ── Billing panel ── */}
      {showBilling && (
        <SectionCard>
          <CardHeader
            title="Billing & Invoice Management"
            sub="Create, manage, and track all tax invoices"
            right={
              <button
                onClick={() => setShowBilling(false)}
                className="text-xs text-gray-500 hover:text-gray-700 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                Close
              </button>
            }
          />
          <div className="px-6 py-5"><BillingManagement /></div>
        </SectionCard>
      )}

      {/* ── Top metric cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {topMetrics.map((m) => {
          const Icon = m.icon;
          const TrendIcon = m.up ? ArrowUpRight : ArrowDownRight;
          return (
            <div
              key={m.id}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${m.bg} p-5 text-white shadow-sm`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-2.5 rounded-xl ${m.iconBg}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  m.up ? "bg-white/20 text-white" : "bg-white/20 text-white"
                }`}>
                  <TrendIcon className="h-3 w-3" />
                  {m.change}
                </span>
              </div>
              <p className="text-2xl font-bold tracking-tight mb-0.5">{m.value}</p>
              <p className="text-sm text-white/80">{m.label}</p>
              <p className="text-[11px] text-white/60 mt-0.5">{m.sub}</p>
              {/* decorative circle */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
            </div>
          );
        })}
      </div>

      {/* ── Charts row: Order Status + Stock Alerts ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Order Status Donut */}
        <SectionCard>
          <CardHeader
            title="Order Status Distribution"
            sub={`${totalOrders} total orders`}
            right={<LiveBadge />}
          />
          <div className="px-6 py-5">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-48 h-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={3}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {orderStatusData.map((d) => (
                        <Cell key={d.id} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 grid grid-cols-1 gap-2 w-full">
                {orderStatusData.map((d) => {
                  const pct = Math.round((d.value / totalOrders) * 100);
                  return (
                    <div key={d.id} className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-sm text-gray-600 flex-1">{d.name}</span>
                      <span className="text-sm font-semibold text-gray-900">{d.value}</span>
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: d.color }} />
                      </div>
                      <span className="text-[11px] text-gray-400 w-8 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Stock Alerts */}
        <SectionCard>
          <CardHeader
            title="Stock Alerts"
            sub="Materials requiring attention"
            right={
              <span className="text-[11px] font-medium text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-full">
                {criticalCount} Critical
              </span>
            }
          />
          <div className="divide-y divide-gray-50">
            {stockAlerts.map((item) => {
              const pct = Math.min((item.current / item.minimum) * 100, 100);
              const cfg = stockCfg[item.status as keyof typeof stockCfg];
              return (
                <div key={item.id} className="flex items-center gap-4 px-6 py-3 hover:bg-gray-50/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-800 font-medium">{item.material}</span>
                      <span className={`text-xs font-semibold ${cfg.text}`}>{item.current.toLocaleString()} / {item.minimum.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cfg.bar }} />
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold border px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.badge}`}>{cfg.label}</span>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* ── Income vs Expense ── */}
      <SectionCard>
        <CardHeader
          title="Income vs Expense"
          sub="Last 7 months financial overview"
          right={
            <div className="flex items-center gap-4">
              {[
                { label: "Income",  color: "#10B981" },
                { label: "Expense", color: "#EF4444" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
                  <span className="text-xs text-gray-500">{l.label}</span>
                </div>
              ))}
            </div>
          }
        />
        <div className="px-4 py-5">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={incomeExpenseData} margin={{ top: 5, right: 16, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10B981" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.10} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-xs">
                      <p className="font-semibold text-gray-700 mb-2">{label}</p>
                      {payload.map((p: any) => (
                        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                          <span className="text-gray-500 capitalize">{p.dataKey}:</span>
                          <span className="font-semibold text-gray-800">
                            ₹{Number(p.value).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))}
                      <div className="border-t border-gray-100 mt-2 pt-2 flex justify-between">
                        <span className="text-gray-400">Net</span>
                        <span className={`font-semibold ${(payload[0]?.value ?? 0) >= (payload[1]?.value ?? 0) ? "text-emerald-600" : "text-rose-600"}`}>
                          ₹{Math.abs((payload[0]?.value ?? 0) - (payload[1]?.value ?? 0)).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  );
                }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#10B981", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#10B981" }}
              />
              <Line
                type="monotone"
                dataKey="expense"
                stroke="#EF4444"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#EF4444", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#EF4444" }}
                strokeDasharray="5 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Summary strip */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
          {[
            {
              label: "Total Income",
              value: `₹${(incomeExpenseData.reduce((s, d) => s + d.income, 0) / 100000).toFixed(1)}L`,
              color: "text-emerald-600",
            },
            {
              label: "Total Expense",
              value: `₹${(incomeExpenseData.reduce((s, d) => s + d.expense, 0) / 100000).toFixed(1)}L`,
              color: "text-rose-500",
            },
            {
              label: "Net Profit",
              value: `₹${((incomeExpenseData.reduce((s, d) => s + d.income - d.expense, 0)) / 100000).toFixed(1)}L`,
              color: "text-indigo-600",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="px-6 py-3 text-center">
              <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
              <p className={`text-base font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Company Performance + Recent Activity ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Company Performance */}
        <SectionCard>
          <CardHeader
            title="Top Companies Performance"
            sub="Orders by company — this month"
            right={
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-xs text-gray-500">Completed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="text-xs text-gray-500">Pending</span>
                </div>
              </div>
            }
          />
          <div className="px-4 py-5">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={companyPerf} margin={{ top: 0, right: 8, left: 0, bottom: 40 }} barSize={14} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="company"
                  tick={{ fontSize: 10, fill: "#94A3B8" }}
                  axisLine={false}
                  tickLine={false}
                  angle={-30}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={32} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="completed" fill="#6366F1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending"   fill="#FCD34D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Recent Activities */}
        <SectionCard>
          <CardHeader
            title="Recent Activities"
            sub="Latest system updates"
            right={<LiveBadge />}
          />
          <div className="divide-y divide-gray-50">
            {recentActivities.map((a) => {
              const cfg = activityCfg[a.type as keyof typeof activityCfg] ?? { dot: "#94A3B8", icon: Activity, label: "" };
              const Icon = cfg.icon;
              return (
                <div key={a.id} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${cfg.dot}18` }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: cfg.dot }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug">{a.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                  <span
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: `${cfg.dot}18`, color: cfg.dot }}
                  >
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="px-6 py-3 border-t border-gray-100">
            <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              View all activities →
            </button>
          </div>
        </SectionCard>
      </div>

      {/* ── Quick stats bar ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Dispatched Today", value: "24", icon: Truck,   color: "text-cyan-600",   bg: "bg-cyan-50",   border: "border-cyan-100" },
          { label: "POs in Queue",     value: "37", icon: Boxes,   color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
          { label: "Active Users",     value: "12", icon: Users,   color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
          { label: "System Events",    value: "98", icon: Zap,     color: "text-amber-600",  bg: "bg-amber-50",  border: "border-amber-100" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`flex items-center gap-3 p-4 rounded-2xl border ${s.bg} ${s.border}`}>
              <div className={`p-2 rounded-lg bg-white/70 shadow-sm`}>
                <Icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-[11px] text-gray-500">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Collapsible management sections ── */}
      <CollapsibleSection title="Financial Data Management" description="Manage and analyze financial data">
        <FinancialDataManagement />
      </CollapsibleSection>

<CollapsibleSection title="Company Management" description="Manage and view company details">
        <CompanyManagement />
      </CollapsibleSection>

      <CollapsibleSection title="Quick Actions" description="Perform quick actions">
        <QuickActionsPanel />
      </CollapsibleSection>

      <CollapsibleSection title="User Management" description="Manage and view user details">
        <UserManagement />
      </CollapsibleSection>

      {/* ── AI Assistant ── */}
      <MasterManagerAIAssistant />
    </div>
  );
}
