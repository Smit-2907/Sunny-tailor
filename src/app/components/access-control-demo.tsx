import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { 
  Shield, 
  CheckCircle,
  Lock,
  Users,
  Ruler,
  Factory,
  Package,
  Boxes,
  Truck,
  DollarSign,
  LayoutDashboard
} from "lucide-react";

interface AccessControlDemoProps {
  currentRole: string;
}

const roleFeatures = {
  "master-manager": {
    displayName: "Master Manager",
    color: "purple",
    features: [
      { name: "Master Dashboard", icon: LayoutDashboard, access: true },
      { name: "HR Management", icon: Users, access: true },
      { name: "Measurements", icon: Ruler, access: true },
      { name: "Production", icon: Factory, access: true },
      { name: "Fabric Store", icon: Package, access: true },
      { name: "Raw Materials", icon: Boxes, access: true },
      { name: "Dispatch", icon: Truck, access: true },
      { name: "Accounts", icon: DollarSign, access: true },
    ],
    description: "Access to employee management, attendance, and recruitment"
  },
  "hr": {
    displayName: "HR",
    color: "blue",
    features: [
      { name: "Master Dashboard", icon: LayoutDashboard, access: false },
      { name: "HR Management", icon: Users, access: true },
      { name: "Measurements", icon: Ruler, access: false },
      { name: "Production", icon: Factory, access: false },
      { name: "Fabric Store", icon: Package, access: false },
      { name: "Raw Materials", icon: Boxes, access: false },
      { name: "Dispatch", icon: Truck, access: false },
      { name: "Accounts", icon: DollarSign, access: false },
    ],
    description: "Access to employee management, attendance, and recruitment"
  },
  "measurement-expert": {
    displayName: "Measurement Expert",
    color: "cyan",
    features: [
      { name: "Master Dashboard", icon: LayoutDashboard, access: false },
      { name: "HR Management", icon: Users, access: false },
      { name: "Measurements", icon: Ruler, access: true },
      { name: "Production", icon: Factory, access: false },
      { name: "Fabric Store", icon: Package, access: false },
      { name: "Raw Materials", icon: Boxes, access: false },
      { name: "Dispatch", icon: Truck, access: false },
      { name: "Accounts", icon: DollarSign, access: false },
    ],
    description: "Access to measurement requests and quality control"
  },
  "production-manager": {
    displayName: "Production Manager",
    color: "indigo",
    features: [
      { name: "Master Dashboard", icon: LayoutDashboard, access: false },
      { name: "HR Management", icon: Users, access: false },
      { name: "Measurements", icon: Ruler, access: false },
      { name: "Production", icon: Factory, access: true },
      { name: "Fabric Store", icon: Package, access: false },
      { name: "Raw Materials", icon: Boxes, access: false },
      { name: "Dispatch", icon: Truck, access: false },
      { name: "Accounts", icon: DollarSign, access: false },
    ],
    description: "Access to production orders and manufacturing operations"
  },
  "fabric-store": {
    displayName: "Fabric Store",
    color: "green",
    features: [
      { name: "Master Dashboard", icon: LayoutDashboard, access: false },
      { name: "HR Management", icon: Users, access: false },
      { name: "Measurements", icon: Ruler, access: false },
      { name: "Production", icon: Factory, access: false },
      { name: "Fabric Store", icon: Package, access: true },
      { name: "Raw Materials", icon: Boxes, access: false },
      { name: "Dispatch", icon: Truck, access: false },
      { name: "Accounts", icon: DollarSign, access: false },
    ],
    description: "Access to fabric inventory and stock management"
  },
  "raw-material-store": {
    displayName: "Raw Material Store",
    color: "teal",
    features: [
      { name: "Master Dashboard", icon: LayoutDashboard, access: false },
      { name: "HR Management", icon: Users, access: false },
      { name: "Measurements", icon: Ruler, access: false },
      { name: "Production", icon: Factory, access: false },
      { name: "Fabric Store", icon: Package, access: false },
      { name: "Raw Materials", icon: Boxes, access: true },
      { name: "Dispatch", icon: Truck, access: false },
      { name: "Accounts", icon: DollarSign, access: false },
    ],
    description: "Access to raw materials and accessories inventory"
  },
  "dispatch": {
    displayName: "Dispatch",
    color: "orange",
    features: [
      { name: "Master Dashboard", icon: LayoutDashboard, access: false },
      { name: "HR Management", icon: Users, access: false },
      { name: "Measurements", icon: Ruler, access: false },
      { name: "Production", icon: Factory, access: false },
      { name: "Fabric Store", icon: Package, access: false },
      { name: "Raw Materials", icon: Boxes, access: false },
      { name: "Dispatch", icon: Truck, access: true },
      { name: "Accounts", icon: DollarSign, access: false },
    ],
    description: "Access to shipment and delivery management"
  },
  "accountant": {
    displayName: "Accountant",
    color: "emerald",
    features: [
      { name: "Master Dashboard", icon: LayoutDashboard, access: false },
      { name: "HR Management", icon: Users, access: false },
      { name: "Measurements", icon: Ruler, access: false },
      { name: "Production", icon: Factory, access: false },
      { name: "Fabric Store", icon: Package, access: false },
      { name: "Raw Materials", icon: Boxes, access: false },
      { name: "Dispatch", icon: Truck, access: false },
      { name: "Accounts", icon: DollarSign, access: true },
    ],
    description: "Access to financial data, invoices, and accounting"
  },
};

export function AccessControlDemo({ currentRole }: AccessControlDemoProps) {
  const roleData = roleFeatures[currentRole as keyof typeof roleFeatures];
  
  if (!roleData) return null;

  const isMasterManager = currentRole === "master-manager";
  const accessibleCount = roleData.features.filter(f => f.access).length;
  const totalCount = roleData.features.length;

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Shield className={`h-4 w-4 text-${roleData.color}-600`} />
          <div>
            <h3 className="font-semibold text-sm">Access Control Matrix</h3>
            <p className="text-xs text-muted-foreground">{roleData.description}</p>
          </div>
        </div>
        
        <Badge 
          variant="outline" 
          className={`text-xs ${
            isMasterManager 
              ? "bg-purple-100 text-purple-800 border-purple-200" 
              : "bg-blue-100 text-blue-800 border-blue-200"
          }`}
        >
          {accessibleCount}/{totalCount} Modules
        </Badge>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {roleData.features.map((feature) => {
          const Icon = feature.icon;
          
          return (
            <div
              key={feature.name}
              className={`p-2 rounded-lg border transition-all ${
                feature.access
                  ? "border-green-200 bg-green-50 hover:bg-green-100"
                  : "border-gray-200 bg-gray-50 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={`h-4 w-4 ${
                  feature.access ? "text-green-600" : "text-gray-400"
                }`} />
                {feature.access ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <Lock className="h-3 w-3 text-gray-400" />
                )}
              </div>
              <p className={`text-[10px] font-medium leading-tight ${
                feature.access ? "text-green-900" : "text-gray-500"
              }`}>
                {feature.name}
              </p>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
