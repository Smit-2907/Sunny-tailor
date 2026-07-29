import { useState } from "react";
// Initialise i18next (English + Hindi + Gujarati) before any component mounts
import "../i18n";
import { ErrorBoundary } from "@/app/ErrorBoundary";
import { LanguageProvider } from "@/app/contexts/language-context";
import { TranslatedAppContent } from "@/app/components/translated-app-content";
import { PODataProvider } from "@/app/contexts/po-data-context";
import { LoginPage } from "@/app/components/login-page";
import { EnhancedLayout } from "@/app/components/enhanced-layout";
import { MasterAdminDashboard } from "@/app/components/master-admin-dashboard";
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
import { FinancialManagementPage } from "@/app/pages/financial-management-page";
import { CompanyManagementPage } from "@/app/pages/company-management-page";
import { QuickActionsPage } from "@/app/pages/quick-actions-page";
import { UserManagementPage } from "@/app/pages/user-management-page";
import { BillingInvoicesPage } from "@/app/pages/billing-invoices-page";
import { SimpleProfile } from "@/app/components/profile/simple-profile";
import { AdminProfile } from "@/app/components/profile/admin-profile";
import { Card } from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Info } from "lucide-react";
import { Toaster } from "sonner";
import { PaymentPage } from "@/app/components/payment/payment-page";
import { CreatePOPage } from "@/app/pages/create-po-page";

// B2B Clothing Manufacturing ERP System
function AppContent() {
  // Check if this is a payment page URL
  const currentPath = window.location.pathname;
  const isPaymentPage = currentPath.startsWith('/payment/');

  if (isPaymentPage) {
    // Extract payment ID from URL
    const paymentId = currentPath.split('/payment/')[1];
    return <PaymentPage />;
  }

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [loggedInUser, setLoggedInUser] = useState(() => {
    return localStorage.getItem('loggedInUser') || '';
  });
  const [loggedInRole, setLoggedInRole] = useState(() => {
    return localStorage.getItem('loggedInRole') || '';
  });
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('currentView') || '';
  });

  const handleLogin = (username: string, password: string, role: string) => {
    setLoggedInUser(username);
    setLoggedInRole(role);
    setIsLoggedIn(true);
    
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loggedInUser', username);
    localStorage.setItem('loggedInRole', role);
    
    // Check if profile is complete
    const savedProfile = localStorage.getItem(`profile:${username}`);
    const profile = savedProfile ? JSON.parse(savedProfile) : null;
    
    // If profile is not complete, redirect to profile page
    if (!profile || !profile.isProfileComplete) {
      setCurrentView('my-profile');
      localStorage.setItem('currentView', 'my-profile');
      return;
    }
    
    let initialView = '';
    if (role === "master-manager") {
      initialView = "master-dashboard";
    } else if (role === "measurement-expert") {
      initialView = "measurement-expert";
    } else if (role === "production-manager") {
      initialView = "production";
    } else if (role === "fabric-store") {
      initialView = "fabric-store";
    } else if (role === "raw-material-store") {
      initialView = "raw-material";
    } else if (role === "dispatch") {
      initialView = "dispatch";
    } else if (role === "accountant") {
      initialView = "accountant";
    } else {
      initialView = role;
    }
    
    setCurrentView(initialView);
    localStorage.setItem('currentView', initialView);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser('');
    setLoggedInRole('');
    setCurrentView('');
    
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInRole');
    localStorage.removeItem('currentView');
  };

  const handleNavigate = (key: string) => {
    setCurrentView(key);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const isMasterManager = loggedInRole === "master-manager";

  const roleDisplayNames: Record<string, string> = {
    "master-manager": "Master Manager",
    "hr": "HR",
    "measurement-expert": "Measurement Expert",
    "production-manager": "Production Manager",
    "fabric-store": "Fabric Store",
    "raw-material-store": "Raw Material Store",
    "dispatch": "Dispatch",
    "accountant": "Accountant"
  };

  const renderDashboard = () => {
    switch (currentView) {
      case "master-dashboard":
        return <MasterAdminDashboard />;
      case "hr":
        return <HRDashboard />;
      case "measurement-expert":
        return <MeasurementExpertDashboard />;
      case "production":
        return <ProductionDashboard />;
      case "fabric-store":
        return <FabricStoreDashboard />;
      case "raw-material":
        return <RawMaterialDashboard />;
      case "dispatch":
        return <DispatchDashboard />;
      case "accountant":
        return <AccountantDashboard />;
      case "my-profile":
        // Admin gets advanced profile, others get simple profile
        return isMasterManager ? (
          <AdminProfile 
            userEmail={loggedInUser} 
            userName={loggedInUser} 
            userRole={loggedInRole} 
          />
        ) : (
          <SimpleProfile 
            userEmail={loggedInUser} 
            userName={loggedInUser} 
            userRole={loggedInRole} 
          />
        );
      case "settings":
        return <AccountSettings userRole={loggedInRole} />;
      case "location-tracking":
        return <EmployeeLocationTracker />;
      case "tryon-beta":
        return <TryOnBetaPage onBack={() => setCurrentView("master-dashboard")} />;
      case "financial-management":
        return <FinancialManagementPage />;
      case "company-management":
        return <CompanyManagementPage />;
      case "quick-actions":
        return <QuickActionsPage onNavigate={handleNavigate} />;
      case "user-management":
        return <UserManagementPage />;
      case "billing-invoices":
        return <BillingInvoicesPage />;
      case "create-po":
        return <CreatePOPage onNavigate={handleNavigate} />;
      default:
        return (
          <Card className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">Welcome to ClothingERP</h3>
            <p className="text-muted-foreground">
              Select a module from the sidebar to get started
            </p>
          </Card>
        );
    }
  };

  return (
    <EnhancedLayout 
      userRole={loggedInRole} 
      onNavigate={handleNavigate}
      currentView={currentView}
      onLogout={handleLogout}
    >
      {currentView !== 'my-profile' && (
        <div className="flex items-center gap-2 mb-4 px-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <p className="text-xs text-gray-400">
            {loggedInUser}
            {!isMasterManager && <span className="ml-1.5 text-gray-300">· {roleDisplayNames[loggedInRole]}</span>}
          </p>
        </div>
      )}

      {renderDashboard()}
    </EnhancedLayout>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <PODataProvider>
          <TranslatedAppContent />
          <Toaster position="top-right" richColors closeButton />
        </PODataProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}