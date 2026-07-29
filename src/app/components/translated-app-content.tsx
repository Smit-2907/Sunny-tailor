import { useState } from "react";
import { useLanguage } from "@/app/contexts/language-context";
import { TranslatedLoginPage } from "@/app/components/translated-login-page";
import { EnhancedLayout } from "@/app/components/enhanced-layout";
import { TranslatedMasterAdminDashboard } from "@/app/components/translated-master-admin-dashboard";
import { TranslatedRoleDashboards } from "@/app/components/translated-role-dashboards";
import { Card } from "@/app/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Info } from "lucide-react";

export function TranslatedAppContent() {
  const { t } = useLanguage();
  
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
    return <TranslatedLoginPage onLogin={handleLogin} />;
  }

  const isMasterManager = loggedInRole === "master-manager";

  const renderDashboard = () => {
    switch (currentView) {
      case "master-dashboard":
        return <TranslatedMasterAdminDashboard onNavigate={handleNavigate} />;
      case "hr":
      case "measurement-expert":
      case "production":
      case "fabric-store":
      case "fabric-store-add":
      case "raw-material":
      case "dispatch":
      case "accountant":
        return <TranslatedRoleDashboards role={loggedInRole} onNavigate={handleNavigate} currentView={currentView} />;
      case "settings":
        return <TranslatedRoleDashboards role={loggedInRole} onNavigate={handleNavigate} currentView={currentView} />;
      case "location-tracking":
        return <TranslatedRoleDashboards role={loggedInRole} onNavigate={handleNavigate} currentView={currentView} />;
      case "tryon-beta":
        return <TranslatedRoleDashboards role={loggedInRole} onNavigate={handleNavigate} currentView={currentView} />;
      case "financial-management":
      case "company-management":
      case "quick-actions":
      case "user-management":
      case "billing-invoices":
      case "create-po":
        return <TranslatedRoleDashboards role={loggedInRole} onNavigate={handleNavigate} currentView={currentView} />;
      default:
        return (
          <Card className="p-12 text-center">
            <h3 className="text-lg font-semibold mb-2">{t('common.welcomeMessage')}</h3>
            <p className="text-muted-foreground">
              {t('common.selectModule')}
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
      <Alert className={`mb-4 py-3 ${ 
        isMasterManager 
          ? "border-purple-200 bg-purple-50/50" 
          : "border-green-200 bg-green-50/50"
      }`}>
        <Info className={`h-4 w-4 ${isMasterManager ? "text-purple-600" : "text-green-600"}`} />
        <AlertTitle className={`${isMasterManager ? "text-purple-900" : "text-green-900"} text-sm`}>
          {t('dashboard.welcomeBack')}, {loggedInUser}!
        </AlertTitle>
        {!isMasterManager && (
          <AlertDescription className="text-green-700 text-xs">
            {t('dashboard.loggedInAs')} <strong>{t(`roles.${loggedInRole}`)}</strong>.
          </AlertDescription>
        )}
      </Alert>

      {renderDashboard()}
    </EnhancedLayout>
  );
}