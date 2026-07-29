import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  FileText,
  Users,
  Calendar,
  Package,
  Eye,
  Upload,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { PageHeader } from "@/app/components/page-header";
import { usePOData } from "@/app/contexts/po-data-context";
import { PurchaseOrder } from "@/app/components/purchase-order/purchase-order-types";
import { POCreationForm } from "@/app/components/purchase-order/po-creation-form";
import { POEmployeeUpload } from "@/app/components/purchase-order/po-employee-upload";
import { POMeasurementView } from "@/app/components/purchase-order/po-measurement-view";
import { EmployeeData } from "@/app/components/measurement-system/employee-excel-upload";

interface POManagementPageProps {
  onBack: () => void;
}

type PageView = "list" | "create" | "upload-employees" | "view-details";

export function POManagementPage({ onBack }: POManagementPageProps) {
  const [currentView, setCurrentView] = useState<PageView>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);

  const {
    purchaseOrders,
    addPurchaseOrder,
    updatePurchaseOrder,
    deletePurchaseOrder,
    setEmployeesForPO,
    getEmployeesForPO,
    updateEmployee,
  } = usePOData();

  const userEmail = localStorage.getItem("loggedInUser") || "admin@theacsindia.com";

  // Filter POs
  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.clientCompanyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: purchaseOrders.length,
    draft: purchaseOrders.filter((po) => po.status === "draft").length,
    confirmed: purchaseOrders.filter((po) => po.status === "confirmed").length,
    inMeasurement: purchaseOrders.filter((po) => po.status === "in-measurement").length,
    inProduction: purchaseOrders.filter((po) => po.status === "in-production").length,
    completed: purchaseOrders.filter((po) => po.status === "completed").length,
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string; icon: typeof Clock }> = {
      draft: { bg: "bg-gray-100", text: "text-gray-700", label: "Draft", icon: Edit },
      confirmed: { bg: "bg-blue-100", text: "text-blue-700", label: "Confirmed", icon: CheckCircle },
      "in-measurement": { bg: "bg-yellow-100", text: "text-yellow-700", label: "In Measurement", icon: Clock },
      "in-production": { bg: "bg-purple-100", text: "text-purple-700", label: "In Production", icon: Package },
      completed: { bg: "bg-green-100", text: "text-green-700", label: "Completed", icon: CheckCircle },
      cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled", icon: AlertCircle },
    };
    return configs[status] || configs.draft;
  };

  const handleCreatePO = (newPO: PurchaseOrder) => {
    addPurchaseOrder(newPO);
    setCurrentView("list");
  };

  const handleUploadEmployees = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setCurrentView("upload-employees");
  };

  const handleEmployeesUploaded = (employees: EmployeeData[]) => {
    if (!selectedPO) return;
    setEmployeesForPO(selectedPO.id, employees);
    const updatedPO: PurchaseOrder = {
      ...selectedPO,
      status: "in-measurement",
      employeesUploaded: employees.length,
      updatedDate: new Date().toISOString(),
    };
    updatePurchaseOrder(updatedPO);
    setSelectedPO(updatedPO);
    setCurrentView("view-details");
  };

  const handleViewDetails = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setCurrentView("view-details");
  };

  const handleUpdateEmployee = (updatedEmp: EmployeeData) => {
    if (!selectedPO) return;
    updateEmployee(selectedPO.id, updatedEmp);

    const employees = getEmployeesForPO(selectedPO.id).map((emp) =>
      emp.uniqueSerialNumber === updatedEmp.uniqueSerialNumber ? updatedEmp : emp
    );
    const completed = employees.filter((e) => e.measurementStatus === "completed").length;
    const inProgress = employees.filter((e) => e.measurementStatus === "in-progress").length;

    const updatedPO: PurchaseOrder = {
      ...selectedPO,
      measurementsCompleted: completed,
      measurementsInProgress: inProgress,
    };
    setSelectedPO(updatedPO);
    updatePurchaseOrder(updatedPO);
  };

  const handleDeletePO = (poId: string) => {
    if (confirm("Are you sure you want to delete this Purchase Order? This action cannot be undone.")) {
      deletePurchaseOrder(poId);
    }
  };

  // ── Sub-views ──
  if (currentView === "create") {
    return (
      <POCreationForm
        onSave={handleCreatePO}
        onCancel={() => setCurrentView("list")}
        currentUserEmail={userEmail}
      />
    );
  }

  if (currentView === "upload-employees" && selectedPO) {
    return (
      <POEmployeeUpload
        purchaseOrder={selectedPO}
        onBack={() => setCurrentView("list")}
        onEmployeesUploaded={handleEmployeesUploaded}
      />
    );
  }

  if (currentView === "view-details" && selectedPO) {
    const employees = getEmployeesForPO(selectedPO.id);
    return (
      <POMeasurementView
        purchaseOrder={selectedPO}
        employees={employees}
        onBack={() => {
          setSelectedPO(null);
          setCurrentView("list");
        }}
        onUpdateEmployee={handleUpdateEmployee}
      />
    );
  }

  // ── Main list view ──
  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack} className="flex-shrink-0">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <PageHeader
            title="Purchase Order Management"
            description="Create, track, and manage all purchase orders — synced across all dashboards"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "Total POs", value: stats.total, icon: FileText, bg: "bg-indigo-50", border: "border-indigo-200", iconBg: "bg-indigo-100", iconColor: "text-indigo-600", valueColor: "text-indigo-700", labelColor: "text-indigo-600" },
          { label: "Draft", value: stats.draft, icon: Edit, bg: "bg-gray-50", border: "border-gray-200", iconBg: "bg-gray-100", iconColor: "text-gray-600", valueColor: "text-gray-700", labelColor: "text-gray-600" },
          { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, bg: "bg-blue-50", border: "border-blue-200", iconBg: "bg-blue-100", iconColor: "text-blue-600", valueColor: "text-blue-700", labelColor: "text-blue-600" },
          { label: "Measuring", value: stats.inMeasurement, icon: Clock, bg: "bg-yellow-50", border: "border-yellow-200", iconBg: "bg-yellow-100", iconColor: "text-yellow-600", valueColor: "text-yellow-700", labelColor: "text-yellow-600" },
          { label: "Production", value: stats.inProduction, icon: Package, bg: "bg-purple-50", border: "border-purple-200", iconBg: "bg-purple-100", iconColor: "text-purple-600", valueColor: "text-purple-700", labelColor: "text-purple-600" },
          { label: "Completed", value: stats.completed, icon: CheckCircle, bg: "bg-green-50", border: "border-green-200", iconBg: "bg-green-100", iconColor: "text-green-600", valueColor: "text-green-700", labelColor: "text-green-600" },
        ].map((stat) => (
          <Card key={stat.label} className={`p-4 ${stat.bg} ${stat.border}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</p>
                <p className={`text-xs ${stat.labelColor}`}>{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Search / Filter / Create bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 flex items-center gap-2 w-full md:w-auto">
            <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <Input
              placeholder="Search by PO number or company name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border rounded-lg px-3 py-1.5 bg-white"
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-measurement">In Measurement</option>
                <option value="in-production">In Production</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <Button onClick={() => setCurrentView("create")} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Create New PO
            </Button>
          </div>
        </div>
      </Card>

      {/* PO Cards List */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b bg-muted/30">
          <h3 className="font-semibold text-lg">Purchase Orders ({filteredPOs.length})</h3>
        </div>

        {filteredPOs.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Purchase Orders Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first purchase order"}
            </p>
            {!searchQuery && statusFilter === "all" && (
              <Button onClick={() => setCurrentView("create")}>
                <Plus className="h-4 w-4 mr-2" /> Create First PO
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y">
            {filteredPOs.map((po) => {
              const statusConfig = getStatusConfig(po.status);
              const employees = getEmployeesForPO(po.id);
              const hasEmployees = employees.length > 0;
              const progress =
                po.employeesUploaded > 0
                  ? Math.round((po.measurementsCompleted / po.employeesUploaded) * 100)
                  : 0;
              const daysLeft = Math.ceil(
                (new Date(po.deliveryDeadline).getTime() - Date.now()) / 86400000
              );

              return (
                <div key={po.id} className="p-5 hover:bg-muted/30 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-mono font-bold text-lg text-indigo-600">{po.poNumber}</h4>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900 mb-1">{po.clientCompanyName}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Package className="h-3.5 w-3.5" />
                          {po.uniformType.replace("-", " ")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {po.totalQuantity} qty
                        </span>
                        <span
                          className={`flex items-center gap-1 ${
                            daysLeft < 7 && daysLeft > 0 ? "text-red-600 font-medium" : ""
                          }`}
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          {new Date(po.deliveryDeadline).toLocaleDateString()}
                          {daysLeft > 0 ? ` (${daysLeft}d left)` : daysLeft === 0 ? " (Today)" : " (Overdue)"}
                        </span>
                      </div>

                      {/* Progress bar */}
                      {hasEmployees && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">
                              Measurement Progress: {po.measurementsCompleted}/{po.employeesUploaded}
                            </span>
                            <span className="font-semibold text-indigo-600">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 max-w-md">
                            <div
                              className="h-2 rounded-full bg-indigo-600 transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {hasEmployees ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(po)}
                          className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1.5" /> View Details
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUploadEmployees(po)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Employees
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePO(po.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
