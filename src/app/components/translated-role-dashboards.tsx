import { useLanguage } from "@/app/contexts/language-context";
import { HRDashboard } from "@/app/components/role-dashboards/hr-dashboard";
import { MeasurementExpertDashboard } from "@/app/components/measurement-expert/measurement-expert-dashboard";
import { ProductionDashboard } from "@/app/components/role-dashboards/production-dashboard";
import { FabricStoreDashboard } from "@/app/components/role-dashboards/fabric-store-dashboard";
import { RawMaterialDashboard } from "@/app/components/role-dashboards/raw-material-dashboard";
import { DispatchDashboard } from "@/app/components/role-dashboards/dispatch-dashboard";
import { AccountantDashboard } from "@/app/components/role-dashboards/accountant-dashboard";
import { AccountSettings } from "@/app/components/account-settings/account-settings";
import { EmployeeLocationTracker } from "@/app/components/location-tracking/employee-location-tracker";
import { TryOnBetaPage } from "@/app/components/tryon-beta";
import { BillingManagement } from "@/app/components/billing/billing-management";
import { FinancialManagementPage } from "@/app/pages/financial-management-page";
import { CompanyManagementPage } from "@/app/pages/company-management-page";
import { QuickActionsPage } from "@/app/pages/quick-actions-page";
import { UserManagementPage } from "@/app/pages/user-management-page";
import { BillingInvoicesPage } from "@/app/pages/billing-invoices-page";
import { POManagementPage } from "@/app/pages/po-management-page";
import { CreatePOPage } from "@/app/pages/create-po-page";

interface TranslatedRoleDashboardsProps {
  currentView: string;
  role?: string;
  onNavigate: (view: string) => void;
}

export function TranslatedRoleDashboards({
  currentView,
  role,
  onNavigate,
}: TranslatedRoleDashboardsProps) {
  const { t } = useLanguage();

  const handleBackToDashboard = () => {
    onNavigate("master-dashboard");
  };

  switch (currentView) {
    case "hr":
      return <HRDashboard />;
    case "measurement-expert":
      return <MeasurementExpertDashboard />;
    case "production":
      return <ProductionDashboard />;
    case "fabric-store":
      return <FabricStoreDashboard />;
    case "fabric-store-add":
      return <FabricStoreDashboard openAddForm={true} />;
    case "raw-material":
      return <RawMaterialDashboard />;
    case "dispatch":
      return <DispatchDashboard />;
    case "accountant":
      return <AccountantDashboard />;
    case "settings":
      return <AccountSettings />;
    case "location-tracking":
      return <EmployeeLocationTracker />;
    case "tryon-beta":
      return <TryOnBetaPage onBack={() => onNavigate("master-dashboard")} />;
    case "financial-management":
      return <FinancialManagementPage onBack={handleBackToDashboard} />;
    case "company-management":
      return <CompanyManagementPage onBack={handleBackToDashboard} />;
    case "quick-actions":
      return <QuickActionsPage onBack={handleBackToDashboard} onNavigate={onNavigate} />;
    case "user-management":
      return <UserManagementPage onBack={handleBackToDashboard} />;
    case "billing-invoices":
      return <BillingInvoicesPage onBack={handleBackToDashboard} />;
    case "create-po":
      return <CreatePOPage onNavigate={onNavigate} />;
    default:
      return null;
  }
}