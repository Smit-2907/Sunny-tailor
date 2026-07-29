import { 
  LayoutDashboard, 
  Users, 
  Ruler,
  Factory,
  Package,
  Boxes,
  Truck,
  DollarSign,
  Settings,
  Shield,
  Lock,
  X,
  MessagesSquare,
  FileText
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { Badge } from "@/app/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import companyLogo from "figma:asset/9bcecdb98fc72c6ea6c43f2c7c27c72b54658c70.png";

interface NavItem {
  label: string;
  icon: React.ElementType;
  active?: boolean;
  badge?: string;
  allowedRoles: string[];
  section?: string;
  key: string;
}

interface EnhancedSidebarNavProps {
  userRole: string;
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate: (key: string) => void;
  currentView: string;
}

const navItems: NavItem[] = [
  { 
    label: "Master Dashboard", 
    icon: LayoutDashboard, 
    allowedRoles: ["master-manager"],
    section: "Master Control",
    key: "master-dashboard"
  },
  { 
    label: "HR Management", 
    icon: Users,
    badge: "156",
    allowedRoles: ["master-manager", "hr"],
    section: "Department Dashboards",
    key: "hr"
  },
  { 
    label: "Measurements", 
    icon: Ruler,
    badge: "24",
    allowedRoles: ["master-manager", "measurement-expert"],
    section: "Department Dashboards",
    key: "measurement-expert"
  },
  { 
    label: "Production", 
    icon: Factory,
    badge: "120",
    allowedRoles: ["master-manager", "production-manager"],
    section: "Department Dashboards",
    key: "production"
  },
  { 
    label: "Fabric Store", 
    icon: Package,
    allowedRoles: ["master-manager", "fabric-store"],
    section: "Department Dashboards",
    key: "fabric-store"
  },
  { 
    label: "Raw Materials", 
    icon: Boxes,
    allowedRoles: ["master-manager", "raw-material-store"],
    section: "Department Dashboards",
    key: "raw-material"
  },
  { 
    label: "Dispatch", 
    icon: Truck,
    badge: "32",
    allowedRoles: ["master-manager", "dispatch"],
    section: "Department Dashboards",
    key: "dispatch"
  },
  { 
    label: "Accounts", 
    icon: DollarSign,
    allowedRoles: ["master-manager", "accountant"],
    section: "Department Dashboards",
    key: "accountant"
  },
  { 
    label: "Billing & Invoices", 
    icon: FileText,
    badge: "2",
    allowedRoles: ["master-manager", "accountant"],
    section: "Finance",
    key: "billing-management"
  },
  {
    label: "Settings", 
    icon: Settings,
    allowedRoles: ["master-manager"],
    section: "System",
    key: "settings"
  },
];

const roleLabels: Record<string, string> = {
  "master-manager": "Master Manager",
  "hr": "HR",
  "measurement-expert": "Measurement Expert",
  "production-manager": "Production Manager",
  "fabric-store": "Fabric Store",
  "raw-material-store": "Raw Material Store",
  "dispatch": "Dispatch",
  "accountant": "Accountant"
};

const roleColors: Record<string, string> = {
  "master-manager": "bg-purple-100 text-purple-800 border-purple-200",
  "hr": "bg-blue-100 text-blue-800 border-blue-200",
  "measurement-expert": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "production-manager": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "fabric-store": "bg-green-100 text-green-800 border-green-200",
  "raw-material-store": "bg-teal-100 text-teal-800 border-teal-200",
  "dispatch": "bg-orange-100 text-orange-800 border-orange-200",
  "accountant": "bg-emerald-100 text-emerald-800 border-emerald-200"
};

export function EnhancedSidebarNav({ 
  userRole, 
  isOpen = false, 
  onClose, 
  onNavigate,
  currentView 
}: EnhancedSidebarNavProps) {
  const isMasterManager = userRole === "master-manager";
  
  // Show all items for master manager, only allowed items for others
  const visibleItems = isMasterManager ? navItems : navItems.filter(item => item.allowedRoles.includes(userRole));
  
  // Group items by section
  const sections = Array.from(new Set(navItems.map(item => item.section)));

  const canAccess = (item: NavItem) => {
    return item.allowedRoles.includes(userRole);
  };

  return (
    <TooltipProvider>
      <div className={`
        w-64 bg-white border-r border-border h-screen fixed left-0 top-0 z-40 overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        shadow-2xl lg:shadow-none
      `}>
        {/* Header */}
        <div className="p-6 border-b border-border sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col w-full">
              {/* Logo */}
              <div className="flex justify-center mb-3">
                <img 
                  src={companyLogo} 
                  alt="Sunny Tailor Corporate Garment" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              
              {/* App Title */}
              <div className="text-center">
                <h1 className="text-sm font-bold text-gray-900">ClothingERP v2.0</h1>
                <p className="text-[10px] text-muted-foreground mt-0.5">© 2024 Sunny Tailor</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden absolute top-3 right-3 h-8 w-8"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Role Badge */}
        <div className="px-4 py-3 bg-muted/30">
          <Badge 
            variant="outline" 
            className={`w-full justify-center ${roleColors[userRole]} font-medium`}
          >
            <Shield className="h-3 w-3 mr-1.5" />
            {roleLabels[userRole]}
          </Badge>
        </div>
        
        {/* Navigation */}
        <nav className="p-4 pb-24">
          {sections.map((section, sectionIndex) => {
            const sectionItems = isMasterManager 
              ? navItems.filter(item => item.section === section)
              : visibleItems.filter(item => item.section === section);
            
            if (sectionItems.length === 0) return null;

            return (
              <div key={section}>
                {sectionIndex > 0 && <div className="my-4 border-t border-gray-200" />}
                
                <div className="mb-3 px-2">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {section}
                  </p>
                </div>
                
                <div className="space-y-0.5">
                  {sectionItems.map((item) => {
                    const Icon = item.icon;
                    const isAccessible = canAccess(item);
                    const isActive = currentView === item.key;
                    
                    const button = (
                      <Button
                        key={item.label}
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start h-10 ${
                          isActive 
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm" 
                            : isAccessible
                            ? "hover:bg-gray-100 text-gray-700"
                            : "hover:bg-red-50 text-muted-foreground opacity-60"
                        }`}
                        onClick={() => {
                          if (isAccessible) {
                            onNavigate(item.key);
                            onClose?.();
                          } else {
                            alert(`Access Denied: Only ${item.allowedRoles.map(r => roleLabels[r]).join(", ")} can access this feature`);
                          }
                        }}
                        disabled={!isAccessible && !isMasterManager}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Icon className="h-4 w-4" />
                          <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                          {!isAccessible && !isMasterManager && (
                            <Lock className="h-3 w-3" />
                          )}
                        </div>
                        {item.badge && isAccessible && (
                          <Badge 
                            variant="secondary" 
                            className={`ml-auto text-[10px] h-5 px-2 ${
                              isActive 
                                ? "bg-indigo-500 text-white hover:bg-indigo-500" 
                                : "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    );

                    if (!isAccessible && isMasterManager) {
                      return (
                        <Tooltip key={item.label}>
                          <TooltipTrigger asChild>
                            {button}
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p className="text-xs">
                              Master access: View {item.label} (normally restricted to {item.allowedRoles.map(r => roleLabels[r]).join(", ")})
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return button;
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Access Info for Master Manager */}
        {isMasterManager && (
          <div className="mx-4 mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-purple-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-semibold text-purple-900">Master Access</p>
                <p className="text-xs text-purple-700 mt-1">
                  You have full access to all department features
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-white">
          <div className="text-xs text-muted-foreground text-center">
            <p>Version 2.4.1</p>
            <p className="mt-1">© 2026 Sunny Tailor</p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}