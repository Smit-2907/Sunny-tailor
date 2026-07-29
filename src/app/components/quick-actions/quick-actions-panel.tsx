import { useState } from "react";
import {
  Plus,
  X,
  ShoppingCart,
  Building2,
  Package,
  DollarSign,
  FileText,
  Upload,
  Download,
  Settings,
  Users,
  Truck,
  Ruler,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";

interface QuickAction {
  id: string;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  action: () => void;
  description: string;
}

export function QuickActionsPanel({ onNavigate }: { onNavigate?: (key: string) => void } = {}) {
  const [isOpen, setIsOpen] = useState(false);

  const nav = (key: string) => {
    if (onNavigate) {
      onNavigate(key);
    }
    setIsOpen(false);
  };

  const quickActions: QuickAction[] = [
    {
      id: "add-po",
      label: "New Purchase Order",
      icon: ShoppingCart,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 hover:bg-indigo-200",
      description: "Create a new purchase order",
      action: () => nav("create-po"),
    },
    {
      id: "add-company",
      label: "Add Company",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-100 hover:bg-purple-200",
      description: "Register a new company",
      action: () => nav("add-company"),
    },
    {
      id: "manage-users",
      label: "Manage Users",
      icon: Users,
      color: "text-pink-600",
      bgColor: "bg-pink-100 hover:bg-pink-200",
      description: "Create & manage user accounts",
      action: () => nav("user-management"),
    },
    {
      id: "update-stock",
      label: "Update Stock",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100 hover:bg-green-200",
      description: "Update inventory stock levels",
      action: () => nav("update-stock"),
    },
    {
      id: "record-payment",
      label: "Record Payment",
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100 hover:bg-blue-200",
      description: "Record a payment received",
      action: () => nav("record-payment"),
    },
    {
      id: "generate-report",
      label: "Generate Report",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100 hover:bg-orange-200",
      description: "Generate custom reports",
      action: () => nav("generate-report"),
    },
    {
      id: "upload-measurements",
      label: "Upload Measurements",
      icon: Upload,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100 hover:bg-cyan-200",
      description: "Bulk upload measurements",
      action: () => nav("upload-measurements"),
    },
    {
      id: "export-data",
      label: "Export Data",
      icon: Download,
      color: "text-teal-600",
      bgColor: "bg-teal-100 hover:bg-teal-200",
      description: "Export data to Excel/PDF",
      action: () => nav("export-data"),
    },
    {
      id: "dispatch-order",
      label: "Dispatch Order",
      icon: Truck,
      color: "text-red-600",
      bgColor: "bg-red-100 hover:bg-red-200",
      description: "Mark order for dispatch",
      action: () => nav("dispatch-order"),
    },
    {
      id: "measurement-entry",
      label: "Measurement Entry",
      icon: Ruler,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 hover:bg-yellow-200",
      description: "Enter employee measurements",
      action: () => nav("measurement-entry"),
    },
    {
      id: "system-settings",
      label: "System Settings",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-100 hover:bg-gray-200",
      description: "Configure system settings",
      action: () => nav("system-settings"),
    },
  ];

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <div className="fixed bottom-20 right-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="group relative w-14 h-14 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center"
          >
            <Plus className="h-6 w-6" />
            
            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Quick Actions
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
        </div>
      )}

      {/* Quick Actions Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40 animate-fadeIn"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed bottom-6 right-6 w-[420px] z-50 animate-slideInUp">
            <Card className="shadow-2xl border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Quick Actions</h3>
                      <p className="text-xs text-indigo-100">Fast access to common tasks</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-white/20 p-1 rounded transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Actions Grid */}
              <div className="p-4 max-h-[600px] overflow-y-auto bg-gray-50">
                <div className="grid grid-cols-2 gap-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className="group p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-indigo-300 transition-all duration-200 text-left"
                      >
                        <div
                          className={`w-10 h-10 ${action.bgColor} rounded-lg flex items-center justify-center mb-3 transition-colors`}
                        >
                          <Icon className={`h-5 w-5 ${action.color}`} />
                        </div>
                        <h4 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                          {action.label}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2">
                          {action.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 bg-white border-t border-gray-200">
                <p className="text-xs text-center text-gray-500">
                  Click on any action to get started
                </p>
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  );
}
