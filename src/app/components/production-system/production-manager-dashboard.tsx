import { useState, useMemo } from "react";
import { 
  Factory, 
  TrendingUp,
  Package,
  Scissors,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Eye,
  ArrowRight,
  ArrowLeft,
  ClipboardList,
  Download,
  Search,
  Shirt,
  ChevronDown,
  ChevronUp,
  Ruler,
  X
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { PageHeader } from "@/app/components/page-header";
import { StatCard } from "@/app/components/stat-card";
import { SharedFilters } from "@/app/components/shared-filters";
import { ProductionAIAssistant } from "@/app/components/production/production-ai-assistant";
import { usePOData } from "@/app/contexts/po-data-context";
import { PurchaseOrder } from "@/app/components/purchase-order/purchase-order-types";
import { EmployeeData } from "@/app/components/measurement-system/employee-excel-upload";
import { SizeAnalysisModal } from "@/app/components/measurement-expert/size-analysis-modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

type ViewMode = "dashboard" | "po-detail" | "master-sheet";

export function ProductionManagerDashboard() {
  const { purchaseOrders, employeesByPO, getEmployeesForPO, isLoading } = usePOData();

  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showSizeAnalysis, setShowSizeAnalysis] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sheetSearch, setSheetSearch] = useState("");
  const [sheetStatusFilter, setSheetStatusFilter] = useState("all");
  const [expandedEmployee, setExpandedEmployee] = useState<string | null>(null);

  // Filter options
  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Draft", value: "draft" },
    { label: "Confirmed", value: "confirmed" },
    { label: "In Measurement", value: "in-measurement" },
    { label: "In Production", value: "in-production" },
    { label: "Completed", value: "completed" },
  ];

  const priorityOptions = [
    { label: "All Priority", value: "all" },
    { label: "Urgent", value: "urgent" },
    { label: "Rush", value: "rush" },
    { label: "Normal", value: "normal" },
  ];

  // Only show POs relevant to production (confirmed, in-measurement, in-production, completed)
  const productionPOs = useMemo(() => {
    return purchaseOrders.filter(po => 
      ["confirmed", "in-measurement", "in-production", "completed"].includes(po.status)
    );
  }, [purchaseOrders]);

  // POs available for size analysis (those with employees uploaded)
  const sizeAnalysisPOs = useMemo(() => {
    return purchaseOrders.filter(po => po.employeesUploaded > 0);
  }, [purchaseOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return productionPOs.filter((order) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          order.poNumber.toLowerCase().includes(query) ||
          order.clientCompanyName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (priorityFilter !== "all" && order.orderPriority !== priorityFilter) return false;
      return true;
    });
  }, [productionPOs, searchQuery, statusFilter, priorityFilter]);

  // Statistics from real data
  const stats = useMemo(() => {
    const totalPOs = productionPOs.length;
    const inProduction = productionPOs.filter(po => po.status === "in-production").length;
    const inMeasurement = productionPOs.filter(po => po.status === "in-measurement").length;
    const completed = productionPOs.filter(po => po.status === "completed").length;
    
    let totalEmployees = 0;
    let measuredEmployees = 0;
    let inProgressEmployees = 0;

    productionPOs.forEach(po => {
      const emps = getEmployeesForPO(po.id);
      totalEmployees += emps.length;
      measuredEmployees += emps.filter(e => e.measurementStatus === "completed").length;
      inProgressEmployees += emps.filter(e => e.measurementStatus === "in-progress").length;
    });

    const measurementProgress = totalEmployees > 0 
      ? Math.round((measuredEmployees / totalEmployees) * 100) 
      : 0;

    return {
      totalPOs,
      inProduction,
      inMeasurement,
      completed,
      totalEmployees,
      measuredEmployees,
      inProgressEmployees,
      measurementProgress,
    };
  }, [productionPOs, getEmployeesForPO]);

  const activeFilterCount = 
    (searchQuery ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (priorityFilter !== "all" ? 1 : 0);

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>;
      case "in-production":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Production</Badge>;
      case "in-measurement":
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">In Measurement</Badge>;
      case "confirmed":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Confirmed</Badge>;
      case "draft":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Draft</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Cancelled</Badge>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Urgent</Badge>;
      case "rush":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Rush</Badge>;
      case "normal":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Normal</Badge>;
      default:
        return null;
    }
  };

  const getMeasurementStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Measured</Badge>;
      case "in-progress":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>;
      case "not-measured":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Not Measured</Badge>;
      default:
        return null;
    }
  };

  const handleViewPODetail = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setViewMode("po-detail");
  };

  const handleViewMasterSheet = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setSheetSearch("");
    setSheetStatusFilter("all");
    setExpandedEmployee(null);
    setViewMode("master-sheet");
  };

  const handleBack = () => {
    setViewMode("dashboard");
    setSelectedPO(null);
  };

  // CSV Export for master sheet
  const exportMasterSheetCSV = (po: PurchaseOrder) => {
    const employees = getEmployeesForPO(po.id);
    const measuredEmps = employees.filter(e => e.measurementStatus === "completed");
    
    if (measuredEmps.length === 0) return;

    const showShirt = po.uniformType !== "pant-only";
    const showPant = po.uniformType !== "shirt-only";

    const headers = ["Sr No", "Employee ID", "Employee Name", "Department", "Status"];
    if (showShirt) {
      headers.push("Shirt Mode", "Shirt Size", "S-Length", "S-Shoulder", "S-Chest", "S-Waist", "S-Sleeve", "S-Neck", "S-Front", "S-Collar", "S-Cuff");
    }
    if (showPant) {
      headers.push("Pant Mode", "Pant Size", "P-Length", "P-Waist", "P-Hip", "P-Thigh", "P-Inseam", "P-Round", "P-Bottom");
    }
    headers.push("Fit Type", "Measured By", "Date");

    const rows = measuredEmps.map((emp, idx) => {
      const row: string[] = [
        String(idx + 1),
        emp.employeeId,
        emp.employeeName,
        emp.department || "",
        emp.measurementStatus,
      ];
      if (showShirt) {
        const sm = emp.measurements?.shirt;
        row.push(
          emp.shirtSizingMode || "measurement",
          emp.shirtFixedSize || "",
          sm?.length || "", sm?.shoulder || "", sm?.chest || "", sm?.waist || "",
          sm?.sleeve || "", sm?.neck || "", sm?.front || "", sm?.collar || "", sm?.cuff || ""
        );
      }
      if (showPant) {
        const pm = emp.measurements?.pant;
        row.push(
          emp.pantSizingMode || "measurement",
          emp.pantFixedSize || "",
          pm?.length || "", pm?.waist || "", pm?.hip || "", pm?.thigh || "",
          pm?.inseam || "", pm?.round || "", pm?.bottom || ""
        );
      }
      row.push(emp.fitType || "", emp.measuredBy || "", emp.measurementDate || "");
      return row;
    });

    const csvContent = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${po.poNumber}_master_sheet.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Master Sheet View
  if (viewMode === "master-sheet" && selectedPO) {
    const employees = getEmployeesForPO(selectedPO.id);
    const showShirt = selectedPO.uniformType !== "pant-only";
    const showPant = selectedPO.uniformType !== "shirt-only";

    const filteredEmployees = employees.filter(emp => {
      if (sheetSearch) {
        const q = sheetSearch.toLowerCase();
        if (!emp.employeeName.toLowerCase().includes(q) && 
            !emp.employeeId.toLowerCase().includes(q)) return false;
      }
      if (sheetStatusFilter !== "all" && emp.measurementStatus !== sheetStatusFilter) return false;
      return true;
    });

    const measuredCount = employees.filter(e => e.measurementStatus === "completed").length;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">Master Measurement Sheet</h2>
            <p className="text-sm text-muted-foreground">
              {selectedPO.poNumber} — {selectedPO.clientCompanyName} · {measuredCount}/{employees.length} measured
            </p>
          </div>
          <Button 
            size="sm" 
            onClick={() => exportMasterSheetCSV(selectedPO)}
            disabled={measuredCount === 0}
          >
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search employee name or ID..." 
                value={sheetSearch}
                onChange={e => setSheetSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select 
              className="border rounded-md px-3 py-2 text-sm bg-white"
              value={sheetStatusFilter}
              onChange={e => setSheetStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Measured</option>
              <option value="in-progress">In Progress</option>
              <option value="not-measured">Not Measured</option>
            </select>
          </div>
        </Card>

        {/* Summary badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
            Total: {employees.length}
          </Badge>
          <Badge className="bg-green-100 text-green-800 border-green-200">
            Measured: {employees.filter(e => e.measurementStatus === "completed").length}
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            In Progress: {employees.filter(e => e.measurementStatus === "in-progress").length}
          </Badge>
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Not Measured: {employees.filter(e => e.measurementStatus === "not-measured").length}
          </Badge>
          {showShirt && <Badge className="bg-purple-50 text-purple-700 border-purple-200"><Shirt className="h-3 w-3 mr-1 inline" />Shirt</Badge>}
          {showPant && <Badge className="bg-orange-50 text-orange-700 border-orange-200"><Ruler className="h-3 w-3 mr-1 inline" />Pant</Badge>}
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-3 py-3 text-left">#</th>
                  <th className="px-3 py-3 text-left">Employee ID</th>
                  <th className="px-3 py-3 text-left">Name</th>
                  <th className="px-3 py-3 text-left">Department</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  {showShirt && (
                    <>
                      <th className="px-2 py-3 text-center bg-purple-50" colSpan={showShirt ? 1 : 0}>Shirt Mode</th>
                      <th className="px-2 py-3 text-center bg-purple-50">Len</th>
                      <th className="px-2 py-3 text-center bg-purple-50">Shldr</th>
                      <th className="px-2 py-3 text-center bg-purple-50">Chst</th>
                      <th className="px-2 py-3 text-center bg-purple-50">Wst</th>
                      <th className="px-2 py-3 text-center bg-purple-50">Slv</th>
                      <th className="px-2 py-3 text-center bg-purple-50">Neck</th>
                    </>
                  )}
                  {showPant && (
                    <>
                      <th className="px-2 py-3 text-center bg-orange-50">Pant Mode</th>
                      <th className="px-2 py-3 text-center bg-orange-50">Len</th>
                      <th className="px-2 py-3 text-center bg-orange-50">Wst</th>
                      <th className="px-2 py-3 text-center bg-orange-50">Hip</th>
                      <th className="px-2 py-3 text-center bg-orange-50">Thgh</th>
                      <th className="px-2 py-3 text-center bg-orange-50">Insm</th>
                    </>
                  )}
                  <th className="px-3 py-3 text-left">Fit</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={20} className="text-center py-8 text-muted-foreground">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp, idx) => {
                    const sm = emp.measurements?.shirt;
                    const pm = emp.measurements?.pant;
                    const isMeasured = emp.measurementStatus === "completed";

                    return (
                      <tr key={emp.uniqueSerialNumber} className={`border-b hover:bg-gray-50 ${!isMeasured ? 'opacity-60' : ''}`}>
                        <td className="px-3 py-2">{idx + 1}</td>
                        <td className="px-3 py-2 font-mono text-xs">{emp.employeeId}</td>
                        <td className="px-3 py-2 font-medium">{emp.employeeName}</td>
                        <td className="px-3 py-2">{emp.department || "—"}</td>
                        <td className="px-3 py-2">{getMeasurementStatusBadge(emp.measurementStatus)}</td>
                        {showShirt && (
                          <>
                            <td className="px-2 py-2 text-center bg-purple-50/30 text-xs">
                              {emp.shirtSizingMode === "fixed" ? (
                                <Badge className="bg-purple-100 text-purple-700 text-xs">{emp.shirtFixedSize || "Fixed"}</Badge>
                              ) : "Custom"}
                            </td>
                            <td className="px-2 py-2 text-center bg-purple-50/30">{sm?.length || "—"}</td>
                            <td className="px-2 py-2 text-center bg-purple-50/30">{sm?.shoulder || "—"}</td>
                            <td className="px-2 py-2 text-center bg-purple-50/30">{sm?.chest || "—"}</td>
                            <td className="px-2 py-2 text-center bg-purple-50/30">{sm?.waist || "—"}</td>
                            <td className="px-2 py-2 text-center bg-purple-50/30">{sm?.sleeve || "—"}</td>
                            <td className="px-2 py-2 text-center bg-purple-50/30">{sm?.neck || "—"}</td>
                          </>
                        )}
                        {showPant && (
                          <>
                            <td className="px-2 py-2 text-center bg-orange-50/30 text-xs">
                              {emp.pantSizingMode === "fixed" ? (
                                <Badge className="bg-orange-100 text-orange-700 text-xs">{emp.pantFixedSize || "Fixed"}</Badge>
                              ) : "Custom"}
                            </td>
                            <td className="px-2 py-2 text-center bg-orange-50/30">{pm?.length || "—"}</td>
                            <td className="px-2 py-2 text-center bg-orange-50/30">{pm?.waist || "—"}</td>
                            <td className="px-2 py-2 text-center bg-orange-50/30">{pm?.hip || "—"}</td>
                            <td className="px-2 py-2 text-center bg-orange-50/30">{pm?.thigh || "—"}</td>
                            <td className="px-2 py-2 text-center bg-orange-50/30">{pm?.inseam || "—"}</td>
                          </>
                        )}
                        <td className="px-3 py-2 capitalize">{emp.fitType || "—"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  }

  // PO Detail View
  if (viewMode === "po-detail" && selectedPO) {
    const employees = getEmployeesForPO(selectedPO.id);
    const measured = employees.filter(e => e.measurementStatus === "completed").length;
    const inProgress = employees.filter(e => e.measurementStatus === "in-progress").length;
    const notMeasured = employees.filter(e => e.measurementStatus === "not-measured").length;
    const progress = employees.length > 0 ? Math.round((measured / employees.length) * 100) : 0;

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{selectedPO.poNumber}</h2>
            <p className="text-sm text-muted-foreground">{selectedPO.clientCompanyName}</p>
          </div>
          <div className="flex gap-2">
            {getStatusBadge(selectedPO.status)}
            {getPriorityBadge(selectedPO.orderPriority)}
          </div>
        </div>

        {/* PO Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Total Quantity</p>
            <p className="text-2xl font-bold text-indigo-600">{selectedPO.totalQuantity}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Uniform Type</p>
            <p className="text-lg font-semibold capitalize">{selectedPO.uniformType.replace(/-/g, " ")}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Delivery Deadline</p>
            <p className="text-lg font-semibold">{selectedPO.deliveryDeadline}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Order Value</p>
            <p className="text-lg font-semibold">₹{selectedPO.totalOrderValue?.toLocaleString() || "—"}</p>
          </Card>
        </div>

        {/* Measurement Progress */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Ruler className="h-5 w-5 text-indigo-600" />
            Measurement Progress
          </h3>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-2xl font-bold text-green-600">{measured}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-2xl font-bold text-blue-600">{inProgress}</p>
              <p className="text-xs text-muted-foreground">In Progress</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-2xl font-bold text-gray-600">{notMeasured}</p>
              <p className="text-xs text-muted-foreground">Not Measured</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Overall Progress</span>
              <span className="font-semibold text-indigo-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {employees.length > 0 && (
            <div className="mt-4">
              <Button onClick={() => handleViewMasterSheet(selectedPO)}>
                <ClipboardList className="h-4 w-4 mr-2" />
                View Master Measurement Sheet
              </Button>
            </div>
          )}
        </Card>

        {/* Additional PO Details */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">Order Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Contact Person</p>
              <p className="font-medium">{selectedPO.clientContactPerson || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{selectedPO.clientContactEmail || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p className="font-medium">{selectedPO.clientContactPhone || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Payment Terms</p>
              <p className="font-medium capitalize">{selectedPO.paymentTerms?.replace(/-/g, " ") || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Quality Standard</p>
              <p className="font-medium capitalize">{selectedPO.qualityStandard || "—"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Employees Uploaded</p>
              <p className="font-medium">{selectedPO.employeesUploaded}</p>
            </div>
          </div>
          {selectedPO.specialRequirements && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm font-medium text-yellow-800">Special Requirements:</p>
              <p className="text-sm text-yellow-700 mt-1">{selectedPO.specialRequirements}</p>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="space-y-6">
      <PageHeader
        title="Production Manager Dashboard"
        description="Monitor production orders, measurement progress, and master sheets from the measurement system"
      />

      {/* Size Analysis Button */}
      <div className="flex justify-end">
        <Button
          onClick={() => setShowSizeAnalysis(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          Size Analysis
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full" />
            <p className="text-sm text-blue-700">Syncing data from server...</p>
          </div>
        </Card>
      )}

      {/* Alert: No POs */}
      {!isLoading && productionPOs.length === 0 && (
        <Card className="p-6 border-yellow-200 bg-yellow-50 text-center">
          <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <h3 className="font-semibold text-yellow-900 mb-1">No Active Production Orders</h3>
          <p className="text-sm text-yellow-700">
            No confirmed or in-progress purchase orders found. POs need to be created and confirmed in the measurement workflow first.
          </p>
        </Card>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total POs"
          value={stats.totalPOs.toString()}
          icon={FileText}
          iconBgColor="bg-indigo-100"
          iconColor="text-indigo-600"
        />
        <StatCard
          title="In Production"
          value={stats.inProduction.toString()}
          icon={Factory}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="Measurement Progress"
          value={`${stats.measurementProgress}%`}
          icon={TrendingUp}
          trend={{ value: `${stats.measuredEmployees}/${stats.totalEmployees} measured`, isPositive: true }}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="In Measurement"
          value={stats.inMeasurement.toString()}
          icon={Ruler}
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Orders List */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Factory className="h-5 w-5 text-indigo-600" />
          <h3 className="font-semibold text-lg">Purchase Orders & Measurement Sheets</h3>
        </div>

        <SharedFilters
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by PO number or company..."
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          statusOptions={statusOptions}
          categoryFilter={priorityFilter}
          onCategoryFilterChange={setPriorityFilter}
          categoryOptions={priorityOptions}
          activeFilterCount={activeFilterCount}
          onClearAll={handleClearFilters}
        />

        <div className="space-y-4">
          {filteredOrders.length === 0 && !isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No orders match your filters</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const employees = getEmployeesForPO(order.id);
              const measured = employees.filter(e => e.measurementStatus === "completed").length;
              const inProg = employees.filter(e => e.measurementStatus === "in-progress").length;
              const notMeasured = employees.filter(e => e.measurementStatus === "not-measured").length;
              const progress = employees.length > 0 ? Math.round((measured / employees.length) * 100) : 0;

              return (
                <Card key={order.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="font-semibold text-lg">{order.poNumber}</h4>
                          {getStatusBadge(order.status)}
                          {getPriorityBadge(order.orderPriority)}
                          <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 capitalize">
                            {order.uniformType.replace(/-/g, " ")}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Company</p>
                            <p className="font-medium">{order.clientCompanyName}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-medium">{order.totalQuantity} units</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Employees</p>
                            <p className="font-medium">{order.employeesUploaded} uploaded</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Deadline</p>
                            <p className="font-medium">{order.deliveryDeadline}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleViewPODetail(order)}>
                          <Eye className="h-4 w-4 mr-1" /> Details
                        </Button>
                        {employees.length > 0 && (
                          <Button size="sm" variant="default" onClick={() => handleViewMasterSheet(order)}>
                            <ClipboardList className="h-4 w-4 mr-1" /> Sheet
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Measurement Progress */}
                    {employees.length > 0 && (
                      <>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="text-center p-2 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-lg font-bold text-green-600">{measured}</p>
                            <p className="text-xs text-muted-foreground">Measured</p>
                          </div>
                          <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-lg font-bold text-blue-600">{inProg}</p>
                            <p className="text-xs text-muted-foreground">In Progress</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-lg font-bold text-gray-600">{notMeasured}</p>
                            <p className="text-xs text-muted-foreground">Pending</p>
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Measurement Progress</span>
                            <span className="font-semibold text-indigo-600">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className={`h-2.5 rounded-full transition-all duration-500 ${
                                progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {employees.length === 0 && (
                      <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-700">
                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                        No employee data uploaded yet for this PO
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </Card>

      {/* AI Production Assistant */}
      <ProductionAIAssistant />

      {/* Size Analysis Modal */}
      <SizeAnalysisModal
        isOpen={showSizeAnalysis}
        onClose={() => setShowSizeAnalysis(false)}
        availablePOs={sizeAnalysisPOs}
      />
    </div>
  );
}