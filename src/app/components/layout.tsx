import { ReactNode, useState } from "react";
import { SidebarNav } from "@/app/components/sidebar-nav";
import { TopBar } from "@/app/components/top-bar";

interface LayoutProps {
  children: ReactNode;
  userRole?: "admin" | "manager" | "operator" | "viewer";
}

export function Layout({ children, userRole = "admin" }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SidebarNav 
        userRole={userRole} 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <main className="lg:ml-64 mt-16 p-4 sm:p-6 lg:p-8">
        {children}
      </main>
      
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
