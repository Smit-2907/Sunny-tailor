import { useState } from "react";
import { BarChart3, Receipt, BookOpen, FileBarChart } from "lucide-react";
import { AccountsDashboard } from "@/app/components/finance/accounts-dashboard";
import { BillsExpensesManagement } from "@/app/components/finance/bills-expenses-management";
import { AccountantAIAssistant } from "@/app/components/accountant/accountant-ai-assistant";
import { ChartOfAccounts } from "@/app/components/accounting/chart-of-accounts";
import { ReportsPage } from "@/app/components/accounting/reports-page";

type ViewType = "dashboard" | "chart-of-accounts" | "bills-expenses" | "reports";

const TABS: { id: ViewType; label: string; icon: React.ElementType }[] = [
  { id: "dashboard",        label: "Dashboard",         icon: BarChart3 },
  { id: "chart-of-accounts",label: "Chart of Accounts", icon: BookOpen },
  { id: "bills-expenses",   label: "Bills & Expenses",  icon: Receipt },
  { id: "reports",          label: "Reports",           icon: FileBarChart },
];

export function AccountantDashboard() {
  const [activeView, setActiveView] = useState<ViewType>("dashboard");

  return (
    <>
      <div className="space-y-4">
        {/* Tab bar */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-2 py-2 flex gap-1 flex-wrap">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeView === id
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeView === "dashboard"          && <AccountsDashboard />}
        {activeView === "chart-of-accounts"  && <ChartOfAccounts />}
        {activeView === "bills-expenses"     && <BillsExpensesManagement />}
        {activeView === "reports"            && <ReportsPage />}
      </div>

      <AccountantAIAssistant />
    </>
  );
}
