import { useState } from "react";
import { 
  ArrowLeft, 
  Search, 
  Filter,
  FileText,
  Users,
  Calendar,
  Package,
  TrendingUp,
  Edit,
  Download,
  FileSpreadsheet,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { PurchaseOrder } from "./purchase-order-types";
import { EmployeeData } from "../measurement-system/employee-excel-upload";
import { MeasurementEntryForm } from "../measurement-system/measurement-entry-form";
import { WorkflowTracker } from "./workflow-tracker";

interface POMeasurementViewProps {
  purchaseOrder: PurchaseOrder;
  employees: EmployeeData[];
  onBack: () => void;
  onUpdateEmployee: (updatedEmployee: EmployeeData) => void;
}

export function POMeasurementView({ 
  purchaseOrder, 
  employees,
  onBack,
  onUpdateEmployee,
}: POMeasurementViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "not-measured" | "in-progress" | "completed">("all");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.uniqueSerialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || emp.measurementStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: employees.length,
    completed: employees.filter(e => e.measurementStatus === "completed").length,
    inProgress: employees.filter(e => e.measurementStatus === "in-progress").length,
    notMeasured: employees.filter(e => e.measurementStatus === "not-measured").length,
  };

  const progressPercent = Math.round((stats.completed / stats.total) * 100);

  const daysUntilDeadline = Math.ceil(
    (new Date(purchaseOrder.deliveryDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const getStatusBadge = (status: string) => {
    const config = {
      "not-measured": { bg: "bg-gray-100", text: "text-gray-700", label: "Not Measured" },
      "in-progress": { bg: "bg-yellow-100", text: "text-yellow-700", label: "In Progress" },
      "completed": { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
    };
    const c = config[status as keyof typeof config] || config["not-measured"];
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${c.bg} ${c.text}`}>
        {c.label}
      </span>
    );
  };

  const handleSaveMeasurement = (updatedEmployee: EmployeeData) => {
    onUpdateEmployee(updatedEmployee);
    setSelectedEmployee(null);
  };

  const downloadFilteredSheet = (filter: "all" | "completed" | "in-progress" | "not-measured") => {
    // Filter employees based on selection
    let employeesToDownload = employees;
    if (filter !== "all") {
      employeesToDownload = employees.filter(e => e.measurementStatus === filter);
    }

    // Prepare CSV with merged header structure
    // Row 1: Basic info columns + SHIRT (merged) + PANT (merged) + Status + Action
    const mainHeaderRow = [
      "Serial No",
      "Employee ID", 
      "Employee Name",
      "Branch",
      "SHIRT", "", "", "", "", "", "", "", "", // SHIRT spans 9 columns
      "PANT", "", "", "", "", "", "", // PANT spans 7 columns
      "Status"
    ];

    // Row 2: Empty for basic info + shirt measurements + pant measurements
    const subHeaderRow = [
      "", // Serial No
      "", // Employee ID
      "", // Employee Name
      "", // Branch
      "Length", "Shoulder", "Chest", "Waist", "Sleeve", "Neck", "Front", "Collar", "Cuff", // Shirt columns
      "Length", "Waist", "Hip", "Thigh", "Inseam", "Round", "Bottom", // Pant columns
      "" // Status
    ];

    // Prepare data rows
    const dataRows = employeesToDownload.map((emp) => {
      const shirt = emp.measurements?.shirt || {};
      const pant = emp.measurements?.pant || {};
      
      // Handle fixed sizes
      const shirtValues = emp.shirtSizingMode === "fixed" && emp.shirtFixedSize
        ? [emp.shirtFixedSize, "", "", "", "", "", "", "", ""]
        : [
            shirt.length || "",
            shirt.shoulder || "",
            shirt.chest || "",
            shirt.waist || "",
            shirt.sleeve || "",
            shirt.neck || "",
            shirt.front || "",
            shirt.collar || "",
            shirt.cuff || ""
          ];
      
      const pantValues = emp.pantSizingMode === "fixed" && emp.pantFixedSize
        ? [emp.pantFixedSize, "", "", "", "", "", ""]
        : [
            pant.length || "",
            pant.waist || "",
            pant.hip || "",
            pant.thigh || "",
            pant.inseam || "",
            pant.round || "",
            pant.bottom || ""
          ];

      return [
        emp.uniqueSerialNumber,
        emp.employeeId,
        emp.employeeName,
        emp.branch,
        ...shirtValues,
        ...pantValues,
        emp.measurementStatus
      ];
    });

    const filterLabel = filter === "all" ? "All" : 
                        filter === "completed" ? "Completed" :
                        filter === "in-progress" ? "In Progress" : "Not Measured";

    // Create CSV content with proper formatting
    const csvContent = [
      // Title rows
      [`${purchaseOrder.clientCompanyName.toUpperCase()} - MEASUREMENT SHEET`],
      [`PO Number: ${purchaseOrder.poNumber} | Filter: ${filterLabel} | Total Employees: ${employeesToDownload.length}`],
      [`Order Date: ${purchaseOrder.orderDate} | Generated: ${new Date().toLocaleString()}`],
      [], // Empty row
      mainHeaderRow,
      subHeaderRow,
      ...dataRows
    ].map(row => row.map(cell => {
      // Escape commas and quotes in cell values
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(",")).join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Measurements_${purchaseOrder.poNumber}_${filterLabel}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    // Close modal
    setShowDownloadOptions(false);
  };

  const downloadMeasurementSheet = () => {
    downloadFilteredSheet("all");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold font-mono text-indigo-600">
              {purchaseOrder.poNumber}
            </h1>
            <p className="text-muted-foreground mt-1">
              {purchaseOrder.clientCompanyName} - Measurement Entry
            </p>
          </div>
        </div>
      </div>

      {/* PO Summary Card */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">PO Number</p>
              <p className="font-bold text-lg">{purchaseOrder.poNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Uniform Type</p>
              <p className="font-semibold capitalize">{purchaseOrder.uniformType.replace("-", " ")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Deadline</p>
              <p className="font-semibold">
                {new Date(purchaseOrder.deliveryDeadline).toLocaleDateString()}
              </p>
              <p className={`text-xs ${daysUntilDeadline < 7 ? "text-red-600" : "text-muted-foreground"}`}>
                {daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : "Overdue"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Employees</p>
              <p className="font-bold text-lg">{stats.total}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Completed</p>
              <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{progressPercent}%</p>
              <p className="text-xs text-green-700">Progress</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <div>
            <p className="text-sm text-yellow-700">In Progress</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
          </div>
        </Card>
        <Card className="p-4 bg-gray-50 border-gray-200">
          <div>
            <p className="text-sm text-gray-700">Not Measured</p>
            <p className="text-3xl font-bold text-gray-600">{stats.notMeasured}</p>
          </div>
        </Card>
        <Card className="p-4 bg-indigo-50 border-indigo-200">
          <div className="flex flex-col justify-between h-full">
            <p className="text-sm text-indigo-700">Export Data</p>
            <Button
              onClick={() => setShowDownloadOptions(true)}
              className="bg-green-600 hover:bg-green-700 w-full mt-2"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Sheet
            </Button>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, employee ID, or serial number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                All ({stats.total})
              </Button>
              <Button
                variant={statusFilter === "not-measured" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("not-measured")}
              >
                Not Measured ({stats.notMeasured})
              </Button>
              <Button
                variant={statusFilter === "in-progress" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("in-progress")}
              >
                In Progress ({stats.inProgress})
              </Button>
              <Button
                variant={statusFilter === "completed" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("completed")}
              >
                Completed ({stats.completed})
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Employee List */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Employee List</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th rowSpan={2} className="text-left p-3 text-sm font-semibold border border-gray-300 bg-gray-50">Serial No</th>
                <th rowSpan={2} className="text-left p-3 text-sm font-semibold border border-gray-300 bg-gray-50">Employee ID</th>
                <th rowSpan={2} className="text-left p-3 text-sm font-semibold border border-gray-300 bg-gray-50">Employee Name</th>
                <th rowSpan={2} className="text-left p-3 text-sm font-semibold border border-gray-300 bg-gray-50">Branch</th>
                <th rowSpan={2} className="text-center p-3 text-sm font-semibold border border-gray-300 bg-indigo-100 text-indigo-800 min-w-[80px]">Shirt / Person</th>
                <th colSpan={9} className="text-center p-3 text-sm font-bold bg-indigo-200 border border-gray-300 text-indigo-900">SHIRT</th>
                <th rowSpan={2} className="text-center p-3 text-sm font-semibold border border-gray-300 bg-blue-100 text-blue-800 min-w-[80px]">Pant / Person</th>
                <th colSpan={7} className="text-center p-3 text-sm font-bold bg-blue-200 border border-gray-300 text-blue-900">PANT</th>
                <th rowSpan={2} className="text-left p-3 text-sm font-semibold border border-gray-300 bg-gray-50">Status</th>
                <th rowSpan={2} className="text-left p-3 text-sm font-semibold border border-gray-300 bg-gray-50">Action</th>
              </tr>
              <tr className="bg-gray-50">
                {/* Shirt sub-columns */}
                <th className="text-center p-2 text-xs font-medium bg-indigo-50 border border-gray-300 min-w-[60px]">Length</th>
                <th className="text-center p-2 text-xs font-medium bg-indigo-50 border border-gray-300 min-w-[70px]">Shoulder</th>
                <th className="text-center p-2 text-xs font-medium bg-indigo-50 border border-gray-300 min-w-[60px]">Chest</th>
                <th className="text-center p-2 text-xs font-medium bg-indigo-50 border border-gray-300 min-w-[60px]">Waist</th>
                <th className="text-center p-2 text-xs font-medium bg-indigo-50 border border-gray-300 min-w-[60px]">Sleeve</th>
                <th className="text-center p-2 text-xs font-medium bg-indigo-50 border border-gray-300 min-w-[60px]">Neck</th>
                <th className="text-center p-2 text-xs font-medium bg-indigo-50 border border-gray-300 min-w-[60px]">Front</th>
                <th className="text-center p-2 text-xs font-medium bg-indigo-50 border border-gray-300 min-w-[60px]">Collar</th>
                <th className="text-center p-2 text-xs font-medium bg-indigo-50 border border-gray-300 min-w-[60px]">Cuff</th>
                {/* Pant sub-columns */}
                <th className="text-center p-2 text-xs font-medium bg-blue-50 border border-gray-300 min-w-[60px]">Length</th>
                <th className="text-center p-2 text-xs font-medium bg-blue-50 border border-gray-300 min-w-[60px]">Waist</th>
                <th className="text-center p-2 text-xs font-medium bg-blue-50 border border-gray-300 min-w-[60px]">Hip</th>
                <th className="text-center p-2 text-xs font-medium bg-blue-50 border border-gray-300 min-w-[60px]">Thigh</th>
                <th className="text-center p-2 text-xs font-medium bg-blue-50 border border-gray-300 min-w-[60px]">Inseam</th>
                <th className="text-center p-2 text-xs font-medium bg-blue-50 border border-gray-300 min-w-[60px]">Round</th>
                <th className="text-center p-2 text-xs font-medium bg-blue-50 border border-gray-300 min-w-[60px]">Bottom</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={24} className="p-8 text-center text-muted-foreground">
                    No employees found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => {
                  const shirtMeasurements = employee.measurements?.shirt || {};
                  const pantMeasurements = employee.measurements?.pant || {};
                  const showShirtFixed = employee.shirtSizingMode === "fixed" && employee.shirtFixedSize;
                  const showPantFixed = employee.pantSizingMode === "fixed" && employee.pantFixedSize;
                  
                  return (
                    <tr key={employee.uniqueSerialNumber} className="border-t hover:bg-muted/50">
                      <td className="p-3 text-sm border-r">
                        <span className="font-mono font-semibold text-indigo-600">
                          {employee.uniqueSerialNumber}
                        </span>
                      </td>
                      <td 
                        className="p-3 text-sm font-medium cursor-pointer hover:bg-indigo-50 transition-colors border-r"
                        onClick={() => setSelectedEmployee(employee)}
                        title="Click to enter/edit measurements"
                      >
                        <span className="text-indigo-600 hover:underline">
                          {employee.employeeId}
                        </span>
                      </td>
                      <td 
                        className="p-3 text-sm cursor-pointer hover:bg-indigo-50 transition-colors border-r"
                        onClick={() => setSelectedEmployee(employee)}
                        title="Click to enter/edit measurements"
                      >
                        <span className="text-indigo-600 hover:underline">
                          {employee.employeeName}
                        </span>
                      </td>
                      <td className="p-3 text-sm border-r">{employee.branch}</td>
                      <td className="p-3 text-sm text-center font-semibold text-indigo-700 border-r bg-indigo-50/40">
                        {purchaseOrder.shirtsPerPerson ?? "-"}
                      </td>

                      {/* Shirt measurements */}
                      {showShirtFixed ? (
                        <td colSpan={9} className="p-3 text-sm text-center bg-green-50 border-r border-l">
                          <span className="font-semibold text-green-700">Fixed Size: {employee.shirtFixedSize}</span>
                        </td>
                      ) : (
                        <>
                          <td className="p-2 text-xs text-center bg-indigo-50/30 border-r border-l">{shirtMeasurements.length || "-"}</td>
                          <td className="p-2 text-xs text-center bg-indigo-50/30 border-r">{shirtMeasurements.shoulder || "-"}</td>
                          <td className="p-2 text-xs text-center bg-indigo-50/30 border-r">{shirtMeasurements.chest || "-"}</td>
                          <td className="p-2 text-xs text-center bg-indigo-50/30 border-r">{shirtMeasurements.waist || "-"}</td>
                          <td className="p-2 text-xs text-center bg-indigo-50/30 border-r">{shirtMeasurements.sleeve || "-"}</td>
                          <td className="p-2 text-xs text-center bg-indigo-50/30 border-r">{shirtMeasurements.neck || "-"}</td>
                          <td className="p-2 text-xs text-center bg-indigo-50/30 border-r">{shirtMeasurements.front || "-"}</td>
                          <td className="p-2 text-xs text-center bg-indigo-50/30 border-r">{shirtMeasurements.collar || "-"}</td>
                          <td className="p-2 text-xs text-center bg-indigo-50/30 border-r">{shirtMeasurements.cuff || "-"}</td>
                        </>
                      )}

                      <td className="p-3 text-sm text-center font-semibold text-blue-700 border-r bg-blue-50/40">
                        {purchaseOrder.pantsPerPerson ?? "-"}
                      </td>

                      {/* Pant measurements */}
                      {showPantFixed ? (
                        <td colSpan={7} className="p-3 text-sm text-center bg-green-50 border-r border-l">
                          <span className="font-semibold text-green-700">Fixed Size: {employee.pantFixedSize}</span>
                        </td>
                      ) : (
                        <>
                          <td className="p-2 text-xs text-center bg-blue-50/30 border-r border-l">{pantMeasurements.length || "-"}</td>
                          <td className="p-2 text-xs text-center bg-blue-50/30 border-r">{pantMeasurements.waist || "-"}</td>
                          <td className="p-2 text-xs text-center bg-blue-50/30 border-r">{pantMeasurements.hip || "-"}</td>
                          <td className="p-2 text-xs text-center bg-blue-50/30 border-r">{pantMeasurements.thigh || "-"}</td>
                          <td className="p-2 text-xs text-center bg-blue-50/30 border-r">{pantMeasurements.inseam || "-"}</td>
                          <td className="p-2 text-xs text-center bg-blue-50/30 border-r">{pantMeasurements.round || "-"}</td>
                          <td className="p-2 text-xs text-center bg-blue-50/30 border-r">{pantMeasurements.bottom || "-"}</td>
                        </>
                      )}
                      
                      <td className="p-3 text-sm border-l">{getStatusBadge(employee.measurementStatus)}</td>
                      <td className="p-3 text-sm border-l">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEmployee(employee)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          {employee.measurementStatus === "completed" ? "Edit" : "Enter"}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Measurement Entry Modal */}
      {selectedEmployee && (
        <MeasurementEntryForm
          employee={selectedEmployee}
          onSave={handleSaveMeasurement}
          onCancel={() => setSelectedEmployee(null)}
        />
      )}

      {/* Download Options Modal */}
      {showDownloadOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white shadow-2xl">
            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Download className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Download Measurement Sheet</h3>
                    <p className="text-sm text-muted-foreground">Select employees by status to download</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowDownloadOptions(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Download Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Download All */}
                <Button
                  onClick={() => downloadFilteredSheet("all")}
                  className="h-auto py-6 flex-col items-start bg-white hover:bg-indigo-50 border-2 border-indigo-300 text-indigo-700"
                  variant="outline"
                >
                  <div className="flex items-center gap-3 mb-2 w-full">
                    <FileSpreadsheet className="h-6 w-6" />
                    <span className="font-semibold text-lg">Complete Sheet</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    All {stats.total} employees with all measurements
                  </span>
                </Button>

                {/* Download Completed */}
                <Button
                  onClick={() => downloadFilteredSheet("completed")}
                  className="h-auto py-6 flex-col items-start bg-white hover:bg-green-50 border-2 border-green-300 text-green-700"
                  variant="outline"
                >
                  <div className="flex items-center gap-3 mb-2 w-full">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-semibold text-lg">Completed Only</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {stats.completed} employees - Ready for production
                  </span>
                </Button>

                {/* Download In Progress */}
                <Button
                  onClick={() => downloadFilteredSheet("in-progress")}
                  className="h-auto py-6 flex-col items-start bg-white hover:bg-yellow-50 border-2 border-yellow-300 text-yellow-700"
                  variant="outline"
                >
                  <div className="flex items-center gap-3 mb-2 w-full">
                    <Clock className="h-6 w-6" />
                    <span className="font-semibold text-lg">In Progress</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {stats.inProgress} employees - Ongoing measurements
                  </span>
                </Button>

                {/* Download Not Measured */}
                <Button
                  onClick={() => downloadFilteredSheet("not-measured")}
                  className="h-auto py-6 flex-col items-start bg-white hover:bg-gray-50 border-2 border-gray-300 text-gray-700"
                  variant="outline"
                >
                  <div className="flex items-center gap-3 mb-2 w-full">
                    <AlertCircle className="h-6 w-6" />
                    <span className="font-semibold text-lg">Not Measured</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {stats.notMeasured} employees - Pending entry
                  </span>
                </Button>
              </div>

              {/* Info Alert */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">Download Information</p>
                    <p>The CSV file will include employee details, all measurement fields, and PO information. Use filters to download specific employee groups for targeted workflows.</p>
                  </div>
                </div>
              </div>

              {/* Cancel Button */}
              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDownloadOptions(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}