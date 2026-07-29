import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings,
  FileText,
  TrendingUp,
  Warehouse,
  ClipboardList,
  Truck,
  DollarSign,
  Shield,
  X
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { Badge } from "@/app/components/ui/badge";

interface NavItem {
  label: string;
  icon: React.ElementType;
  active?: boolean;
  badge?: string;
  roles: UserRole[];
  section?: string;
}

type UserRole = "admin" | "manager" | "operator" | "viewer";

interface SidebarNavProps {
  userRole: UserRole;
  isOpen?: boolean;
  onClose?: () => void;
}

const navItems: NavItem[] = [
  { 
    label: "Dashboard", 
    icon: LayoutDashboard, 
    active: true,
    roles: ["admin", "manager", "operator", "viewer"],
    section: "Overview"
  },
  { 
    label: "Production Orders", 
    icon: Package,
    badge: "24",
    roles: ["admin", "manager", "operator"],
    section: "Operations"
  },
  { 
    label: "Work Orders", 
    icon: ClipboardList,
    roles: ["admin", "manager", "operator"],
    section: "Operations"
  },
  { 
    label: "Inventory", 
    icon: Warehouse,
    badge: "12",
    roles: ["admin", "manager", "operator", "viewer"],
    section: "Operations"
  },
  { 
    label: "Sales Orders", 
    icon: ShoppingCart,
    roles: ["admin", "manager", "viewer"],
    section: "Sales"
  },
  { 
    label: "Customers", 
    icon: Users,
    roles: ["admin", "manager", "viewer"],
    section: "Sales"
  },
  { 
    label: "Suppliers", 
    icon: Truck,
    roles: ["admin", "manager"],
    section: "Supply Chain"
  },
  { 
    label: "Procurement", 
    icon: DollarSign,
    roles: ["admin", "manager"],
    section: "Supply Chain"
  },
  { 
    label: "Reports", 
    icon: FileText,
    roles: ["admin", "manager", "viewer"],
    section: "Analytics"
  },
  { 
    label: "Analytics", 
    icon: TrendingUp,
    roles: ["admin", "manager"],
    section: "Analytics"
  },
  { 
    label: "User Management", 
    icon: Shield,
    roles: ["admin"],
    section: "Administration"
  },
  { 
    label: "Settings", 
    icon: Settings,
    roles: ["admin", "manager"],
    section: "Administration"
  },
];

const roleLabels: Record<UserRole, string> = {
  admin: "Administrator",
  manager: "Manager",
  operator: "Operator",
  viewer: "Viewer"
};

const roleColors: Record<UserRole, string> = {
  admin: "bg-purple-100 text-purple-800 border-purple-200",
  manager: "bg-blue-100 text-blue-800 border-blue-200",
  operator: "bg-green-100 text-green-800 border-green-200",
  viewer: "bg-gray-100 text-gray-800 border-gray-200"
};

export function SidebarNav({ userRole, isOpen = false, onClose }: SidebarNavProps) {
  // Filter nav items based on user role
  const filteredItems = navItems.filter(item => item.roles.includes(userRole));
  
  // Group items by section
  const sections = Array.from(new Set(filteredItems.map(item => item.section)));

  return (
    <>
      <div className={`
        w-64 bg-white border-r border-border h-screen fixed left-0 top-0 z-40 overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-indigo-600">ClothingERP</h2>
              <p className="text-xs text-muted-foreground mt-1">Manufacturing Suite</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
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
        <nav className="p-4">
          {sections.map((section, sectionIndex) => {
            const sectionItems = filteredItems.filter(item => item.section === section);
            
            return (
              <div key={section}>
                {sectionIndex > 0 && <Separator className="my-4" />}
                
                <div className="mb-2 px-3">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {section}
                  </p>
                </div>
                
                <div className="space-y-1">
                  {sectionItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Button
                        key={item.label}
                        variant={item.active ? "default" : "ghost"}
                        className={`w-full justify-start ${
                          item.active 
                            ? "bg-indigo-600 text-white hover:bg-indigo-700" 
                            : "hover:bg-muted text-foreground"
                        }`}
                        onClick={onClose}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {item.badge && (
                          <Badge 
                            variant="secondary" 
                            className={`ml-auto ${
                              item.active 
                                ? "bg-white/20 text-white hover:bg-white/20" 
                                : "bg-indigo-100 text-indigo-700"
                            }`}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-white">
          <div className="text-xs text-muted-foreground text-center">
            <p>Version 2.4.1</p>
            <p className="mt-1">© 2026 ClothingERP</p>
          </div>
        </div>
      </div>
    </>
  );
}
