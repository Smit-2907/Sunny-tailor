import { ReactNode, useState } from "react";
import { TranslatedSidebarNav } from "@/app/components/translated-sidebar-nav";
import { TopBar } from "@/app/components/top-bar";

interface EnhancedLayoutProps {
  children: ReactNode;
  userRole: string;
  onNavigate: (key: string) => void;
  currentView: string;
  onLogout?: () => void;
}

export function EnhancedLayout({ children, userRole, onNavigate, currentView, onLogout }: EnhancedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAccountSettingsClick = () => {
    onNavigate("settings");
    setSidebarOpen(false);
  };

  const handleLocationTrackingClick = () => {
    onNavigate("location-tracking");
    setSidebarOpen(false);
  };

  const handleTryOnClick = () => {
    onNavigate("tryon-beta");
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <TranslatedSidebarNav 
        userRole={userRole} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={onNavigate}
        currentView={currentView}
      />
      <TopBar 
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        onAccountSettingsClick={handleAccountSettingsClick}
        onLocationTrackingClick={handleLocationTrackingClick}
        onTryOnClick={handleTryOnClick}
        onLogout={onLogout}
        userRole={userRole}
        onNavigate={onNavigate}
      />
      
      {/* Responsive main content area with proper spacing */}
      <main className="md:ml-64 mt-16 px-4 py-5 sm:px-6 md:px-8 max-w-[1600px]">
        <div className="w-full mx-auto">
          {children}
        </div>
      </main>
      
      {/* Mobile overlay - Improved for better UX */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}