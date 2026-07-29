import {
  Building2,
  Users,
  Ruler,
  Package,
  Factory,
  Truck,
  UserCircle,
  DollarSign,
  FileText,
  ArrowRight,
  X,
  Sparkles,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";

interface WorkflowGuidePopupProps {
  onClose: () => void;
  userRole: string;
}

export function WorkflowGuidePopup({ onClose, userRole }: WorkflowGuidePopupProps) {
  const workflowSteps = [
    {
      id: 1,
      title: "Company & Purchase Orders",
      icon: Building2,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      description: "Create company profiles and upload purchase orders with unique serial numbers.",
      role: "Master Manager",
    },
    {
      id: 2,
      title: "Employee Master Sheet",
      icon: Users,
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      description: "Create employee records and upload single garment design photo as reference.",
      role: "HR Manager",
    },
    {
      id: 3,
      title: "Measurement Entry",
      icon: Ruler,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      description: "Enter precise measurements for each employee using master sheet reference.",
      role: "Measurement Expert",
    },
    {
      id: 4,
      title: "Fabric & Raw Material",
      icon: Package,
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
      description: "Manage inventory, track stock levels and place orders for production.",
      role: "Store Managers",
    },
    {
      id: 5,
      title: "Production",
      icon: Factory,
      iconColor: "text-indigo-600",
      iconBg: "bg-indigo-50",
      description: "Manufacture garments based on measurements and track progress in real-time.",
      role: "Production Manager",
    },
    {
      id: 6,
      title: "Dispatch",
      icon: Truck,
      iconColor: "text-cyan-600",
      iconBg: "bg-cyan-50",
      description: "Package completed orders and track shipments and delivery status.",
      role: "Dispatch Manager",
    },
    {
      id: 7,
      title: "HR Management",
      icon: UserCircle,
      iconColor: "text-pink-600",
      iconBg: "bg-pink-50",
      description: "Manage employee documents, attendance, leave, and employment records.",
      role: "HR Manager",
    },
    {
      id: 8,
      title: "Accounts & Finance",
      icon: DollarSign,
      iconColor: "text-yellow-600",
      iconBg: "bg-yellow-50",
      description: "Upload bills, invoices, process salary and access financial records.",
      role: "Accountant",
    },
    {
      id: 9,
      title: "Reports & Analytics",
      icon: FileText,
      iconColor: "text-red-600",
      iconBg: "bg-red-50",
      description: "Generate reports with advanced filtering, charts, and exportable data.",
      role: "Master Manager / Accountant",
    },
  ];

  const roleDisplayNames: Record<string, string> = {
    "master-manager": "Master Manager",
    "hr": "HR Manager",
    "measurement-expert": "Measurement Expert",
    "production-manager": "Production Manager",
    "fabric-store": "Fabric Store Manager",
    "raw-material-store": "Raw Material Store Manager",
    "dispatch": "Dispatch Manager",
    "accountant": "Accountant",
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[85vh] bg-white shadow-2xl overflow-hidden flex flex-col">
        {/* Compact Header */}
        <div className="bg-indigo-600 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Manufacturing ERP Workflow</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-lg h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Current User Role - Compact */}
            <div className="mb-6 bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
                    <UserCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">You are logged in as</p>
                    <p className="text-base font-semibold text-indigo-900">
                      {roleDisplayNames[userRole] || userRole}
                    </p>
                  </div>
                </div>
                <Badge className="bg-indigo-600 text-white text-xs px-2 py-0.5">Active Role</Badge>
              </div>
            </div>

            {/* Workflow Steps - Compact Grid Layout */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-foreground mb-4">
                Complete Workflow Process (9 Steps)
              </h3>
              
              <div className="space-y-3">
                {workflowSteps.map((step, index) => {
                  const Icon = step.icon;
                  const isLast = index === workflowSteps.length - 1;
                  
                  return (
                    <div key={step.id} className="relative">
                      {/* Connector Line - Shorter */}
                      {!isLast && (
                        <div className="absolute left-[25px] top-[56px] w-0.5 h-6 bg-gray-200" />
                      )}
                      
                      {/* Step Card - Compact */}
                      <Card className="border border-gray-200 hover:border-indigo-200 hover:shadow-md transition-all duration-200 bg-white">
                        <div className="p-4">
                          <div className="flex gap-4">
                            {/* Icon - Smaller */}
                            <div className={`w-[50px] h-[50px] rounded-lg ${step.iconBg} flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`h-6 w-6 ${step.iconColor}`} />
                            </div>
                            
                            {/* Content - Compact */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-3 mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-medium text-muted-foreground">Step {step.id}</span>
                                  <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                    {step.role}
                                  </span>
                                </div>
                              </div>
                              <h4 className="font-semibold text-sm text-foreground mb-1">
                                {step.title}
                              </h4>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Compact Footer */}
        <div className="border-t border-gray-200 p-4 bg-white flex-shrink-0">
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Complete manufacturing process from order to delivery
            </p>
            <Button 
              onClick={onClose} 
              className="px-6 bg-indigo-600 hover:bg-indigo-700"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
