import { useState } from "react";
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
  X,
  MessagesSquare,
  FileText,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Building2,
  Zap,
  Receipt
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
import { useLanguage } from "@/app/contexts/language-context";
import companyLogo from "figma:asset/9bcecdb98fc72c6ea6c43f2c7c27c72b54658c70.png";
import { ShoppingCart } from "lucide-react";

interface NavItem {
  labelKey: string;
  icon: React.ElementType;
  active?: boolean;
  badge?: string;
  allowedRoles: string[];
  sectionKey?: string;
  key: string;
  children?: NavItem[];
}

interface TranslatedSidebarNavProps {
  userRole: string;
  isOpen?: boolean;
  onClose?: () => void;
  onNavigate: (key: string) => void;
  currentView: string;
}

const navItems: NavItem[] = [
  { 
    labelKey: "sidebar.masterDashboard", 
    icon: LayoutDashboard, 
    allowedRoles: ["master-manager"],
    sectionKey: "sidebar.masterControl",
    key: "master-dashboard",
    children: [
      {
        labelKey: "sidebar.companyManagement",
        icon: Building2,
        allowedRoles: ["master-manager"],
        key: "company-management"
      },
      {
        labelKey: "sidebar.userManagement",
        icon: Users,
        allowedRoles: ["master-manager"],
        key: "user-management"
      },
      {
        labelKey: "sidebar.billingInvoices",
        icon: Receipt,
        allowedRoles: ["master-manager"],
        key: "billing-invoices"
      }
      // {
      //   labelKey: "sidebar.poManagement",
      //   icon: ShoppingCart,
      //   allowedRoles: ["master-manager"],
      //   key: "po-management"
      // }
    ]
  },
  { 
    labelKey: "sidebar.hr", 
    icon: Users,
    badge: "156",
    allowedRoles: ["master-manager", "hr"],
    sectionKey: "sidebar.departmentDashboards",
    key: "hr"
  },
  { 
    labelKey: "sidebar.measurementExpert", 
    icon: Ruler,
    badge: "24",
    allowedRoles: ["master-manager", "measurement-expert"],
    sectionKey: "sidebar.departmentDashboards",
    key: "measurement-expert"
  },
  { 
    labelKey: "sidebar.production", 
    icon: Factory,
    badge: "120",
    allowedRoles: ["master-manager", "production-manager"],
    sectionKey: "sidebar.departmentDashboards",
    key: "production"
  },
  { 
    labelKey: "sidebar.fabricStore", 
    icon: Package,
    allowedRoles: ["master-manager", "fabric-store"],
    sectionKey: "sidebar.departmentDashboards",
    key: "fabric-store"
  },
  { 
    labelKey: "sidebar.rawMaterial", 
    icon: Boxes,
    allowedRoles: ["master-manager", "raw-material-store"],
    sectionKey: "sidebar.departmentDashboards",
    key: "raw-material"
  },
  { 
    labelKey: "sidebar.dispatch", 
    icon: Truck,
    badge: "32",
    allowedRoles: ["master-manager", "dispatch"],
    sectionKey: "sidebar.departmentDashboards",
    key: "dispatch"
  },
  { 
    labelKey: "sidebar.accountant", 
    icon: DollarSign,
    allowedRoles: ["master-manager", "accountant"],
    sectionKey: "sidebar.departmentDashboards",
    key: "accountant"
  },
  {
    labelKey: "sidebar.settings", 
    icon: Settings,
    allowedRoles: ["master-manager"],
    sectionKey: "sidebar.system",
    key: "settings"
  },
];

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

export function TranslatedSidebarNav({ 
  userRole, 
  isOpen = false, 
  onClose, 
  onNavigate,
  currentView 
}: TranslatedSidebarNavProps) {
  const { t } = useLanguage();
  const isMasterManager = userRole === "master-manager";
  const [expandedItems, setExpandedItems] = useState<string[]>(["master-dashboard"]);
  
  // Show all items for master manager, only allowed items for others
  const visibleItems = isMasterManager ? navItems : navItems.filter(item => item.allowedRoles.includes(userRole));
  
  // Group items by section
  const sections = Array.from(new Set(navItems.map(item => item.sectionKey)));

  const canAccess = (item: NavItem) => {
    return item.allowedRoles.includes(userRole);
  };

  const toggleExpand = (key: string) => {
    setExpandedItems(prev => 
      prev.includes(key) 
        ? prev.filter(k => k !== key)
        : [...prev, key]
    );
  };

  const renderNavItem = (item: NavItem, isChild = false) => {
    const Icon = item.icon;
    const isActive = currentView === item.key;
    const hasAccess = canAccess(item);
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.key);
    
    const button = (
      <div key={item.key}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={`
            w-full justify-start gap-3 h-10 px-3 mb-1
            ${isChild ? 'pl-10 h-9' : ''}
            ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium hover:bg-indigo-100' : 'text-gray-700 hover:bg-gray-100'}
            ${!hasAccess ? 'opacity-40 cursor-not-allowed' : ''}
          `}
          onClick={() => {
            if (hasAccess) {
              if (hasChildren) {
                toggleExpand(item.key);
                onNavigate(item.key);
              } else {
                onNavigate(item.key);
              }
            }
          }}
          disabled={!hasAccess}
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left text-sm">{t(item.labelKey)}</span>
          {item.badge && (
            <Badge 
              variant="secondary" 
              className="ml-auto bg-indigo-100 text-indigo-700 hover:bg-indigo-200 text-xs px-2"
            >
              {item.badge}
            </Badge>
          )}
          {hasChildren && (
            isExpanded ? 
              <ChevronDown className="h-4 w-4 ml-auto" /> : 
              <ChevronRight className="h-4 w-4 ml-auto" />
          )}
        </Button>
        
        {hasChildren && isExpanded && (
          <div className="ml-0 mt-1 space-y-1">
            {item.children!.map(child => renderNavItem(child, true))}
          </div>
        )}
      </div>
    );

    if (!hasAccess && !isMasterManager) {
      return null;
    }

    if (!hasAccess) {
      return (
        <Tooltip key={item.key}>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Access restricted to this role</p>
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  };

  return (
    <TooltipProvider>
      <div className={`
        w-64 bg-white border-r border-border h-screen fixed left-0 top-0 z-40 flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        shadow-2xl lg:shadow-none
      `}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-border sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center w-full">
              <img 
                src={companyLogo} 
                alt="Sunny Tailor Corporate Garment" 
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden absolute top-3 right-3 h-8 w-8"
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
            {t(`roles.${userRole}`)}
          </Badge>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {sections.map((section) => {
            const sectionItems = visibleItems.filter(item => item.sectionKey === section);
            if (sectionItems.length === 0) return null;

            return (
              <div key={section}>
                {section && (
                  <>
                    <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-4">
                      {t(section || '')}
                    </div>
                  </>
                )}
                
                {sectionItems.map((item) => renderNavItem(item))}
              </div>
            );
          })}
        </nav>

        {/* Footer Info */}
        <div className="p-4 border-t border-border bg-white shrink-0">
          <div className="text-xs text-muted-foreground text-center">
            <p className="font-medium">ClothingERP v2.0</p>
            <p className="mt-1">© 2024 Sunny Tailor</p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}