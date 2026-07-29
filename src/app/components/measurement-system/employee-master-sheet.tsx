import { useState } from "react";
import { 
  Search, 
  Filter, 
  Ruler,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  FileSpreadsheet,
  Image,
  Upload,
  ArrowLeft,
  Download,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { PageHeader } from "@/app/components/page-header";
import { Badge } from "@/app/components/ui/badge";
import { POData } from "./po-upload-screen";
import { EmployeeData } from "./employee-excel-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

interface EmployeeMasterSheetProps {
  poData: POData;
  employees: EmployeeData[];
  onSelectEmployee: (employee: EmployeeData) => void;
  onUpdateEmployees: (employees: EmployeeData[]) => void;
  onBack?: () => void;
}

export function EmployeeMasterSheet({ 
  poData, 
  employees, 
  onSelectEmployee,
  onUpdateEmployees,
  onBack,
}: EmployeeMasterSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [garmentPhoto, setGarmentPhoto] = useState(poData.garmentDesignPhoto || "");
  const [garmentPhotoFile, setGarmentPhotoFile] = useState<File | null>(null);

  // Get unique branches
  const uniqueBranches = Array.from(new Set(employees.map(e => e.branch)));

  // Filter employees
  const filteredEmployees = employees.filter(emp => {
    // Status filter
    if (statusFilter !== "all" && emp.measurementStatus !== statusFilter) {
      return false;
    }

    // Branch filter
    if (branchFilter !== "all" && emp.branch !== branchFilter) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        emp.employeeId.toLowerCase().includes(query) ||
        emp.employeeName.toLowerCase().includes(query) ||
        emp.uniqueSerialNumber.toLowerCase().includes(query) ||
        emp.branch.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Calculate statistics
  const totalEmployees = employees.length;
  const notMeasured = employees.filter(e => e.measurementStatus === "not-measured").length;
  const inProgress = employees.filter(e => e.measurementStatus === "in-progress").length;
  const completed = employees.filter(e => e.measurementStatus === "completed").length;
  const completionRate = totalEmployees > 0 ? Math.round((completed / totalEmployees) * 100) : 0;

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setBranchFilter("all");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completed
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case "not-measured":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Not Measured
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleGarmentPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setGarmentPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setGarmentPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGarmentPhotoSave = () => {
    if (garmentPhotoFile) {
      // Here you would typically upload the file to a server and update the POData
      // For now, we'll just log the file name
      console.log("Garment photo uploaded:", garmentPhotoFile.name);
    }
  };

  const downloadFilteredSheet = (filter: "all" | "completed" | "in-progress" | "not-measured") => {
    // Filter employees based on selection
    let employeesToDownload = employees;
    if (filter !== "all") {
      employeesToDownload = employees.filter(e => e.measurementStatus === filter);
    }

    // Prepare CSV with merged header structure
    // Row 1: Basic info columns + Sizing Modes + Fit Type + SHIRT (merged) + PANT (merged) + Remarks + Status + Tracking
    const mainHeaderRow = [
      "Serial No",
      "Employee ID",
      "Employee Name",
      "Branch",
      "Department",
      "Designation",
      "SHIRT SIZING MODE",
      "PANT SIZING MODE",
      "FIT TYPE",
      "SHIRT", "", "", "", "", "", "", "", "", // SHIRT spans 9 columns
      "PANT", "", "", "", "", "", "", // PANT spans 7 columns
      "Remarks",
      "Status",
      "Measured By",
      "Measurement Date"
    ];

    // Row 2: Empty for basic info + shirt measurements + pant measurements
    const subHeaderRow = [
      "", // Serial No
      "", // Employee ID
      "", // Employee Name
      "", // Branch
      "", // Department
      "", // Designation
      "", // SHIRT SIZING MODE
      "", // PANT SIZING MODE
      "", // FIT TYPE
      "Length", "Shoulder", "Chest", "Waist", "Sleeve", "Neck", "Front", "Collar", "Cuff", // Shirt columns
      "Length", "Waist", "Hip", "Thigh", "Inseam", "Round", "Bottom", // Pant columns
      "", // Remarks
      "", // Status
      "", // Measured By
      "" // Measurement Date
    ];

    // Prepare data rows
    const dataRows = employeesToDownload.map((emp) => {
      const shirt = emp.measurements?.shirt || {};
      const pant = emp.measurements?.pant || {};
      
      // Handle shirt sizing mode
      let shirtSizingDisplay = "";
      if (emp.shirtSizingMode === "fixed" && emp.shirtFixedSize) {
        shirtSizingDisplay = `Fixed Size: ${emp.shirtFixedSize}`;
      } else {
        shirtSizingDisplay = "Custom Measurements";
      }
      
      // Handle pant sizing mode
      let pantSizingDisplay = "";
      if (emp.pantSizingMode === "fixed" && emp.pantFixedSize) {
        pantSizingDisplay = `Fixed Size: ${emp.pantFixedSize}`;
      } else {
        pantSizingDisplay = "Custom Measurements";
      }
      
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

      // Fit type display
      const fitTypeDisplay = emp.fitType 
        ? emp.fitType.charAt(0).toUpperCase() + emp.fitType.slice(1)
        : "";

      return [
        emp.uniqueSerialNumber,
        emp.employeeId,
        emp.employeeName,
        emp.branch,
        emp.department,
        emp.designation,
        shirtSizingDisplay,
        pantSizingDisplay,
        fitTypeDisplay,
        ...shirtValues,
        ...pantValues,
        emp.remarks || "",
        emp.measurementStatus,
        emp.measuredBy || "",
        emp.measurementDate || ""
      ];
    });

    const filterLabel = filter === "all" ? "All" : 
                        filter === "completed" ? "Completed" :
                        filter === "in-progress" ? "In Progress" : "Not Measured";

    // Create CSV content with proper formatting
    const csvContent = [
      // Title rows
      [`${poData.companyName.toUpperCase()} - MEASUREMENT SHEET`],
      [`PO Number: ${poData.poNumber} | Filter: ${filterLabel} | Total Employees: ${employeesToDownload.length}`],
      [`Order Date: ${poData.orderDate} | Generated: ${new Date().toLocaleString()}`],
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
    link.download = `Measurements_${poData.poNumber}_${filterLabel}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {onBack && (
        <Button
          variant="outline"
          onClick={onBack}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to PO Selection
        </Button>
      )}

      <PageHeader
        title="Employee Master Sheet"
        description={`${poData.companyName} - ${poData.poNumber}`}
      />

      {/* PO Summary Card */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">PO Number</p>
            <p className="font-semibold text-lg">{poData.poNumber}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Company</p>
            <p className="font-semibold text-lg">{poData.companyName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Order Date</p>
            <p className="font-semibold text-lg">{poData.orderDate}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Employees</p>
            <p className="font-semibold text-lg">{totalEmployees}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="font-semibold text-lg text-indigo-600">{completionRate}%</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Measurement Progress</span>
            <span>{completed}/{totalEmployees} completed</span>
          </div>
          <div className="w-full bg-white rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-3 transition-all duration-500 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-2 border-indigo-200 bg-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Employees</p>
              <p className="text-2xl font-bold text-indigo-900">{totalEmployees}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center">
              <FileSpreadsheet className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Not Measured</p>
              <p className="text-2xl font-bold text-red-900">{notMeasured}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2 border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold text-blue-900">{inProgress}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-green-900">{completed}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold">Filter Employees</h3>
            </div>
            <Button variant="outline" size="sm" onClick={handleResetFilters}>
              <X className="h-4 w-4 mr-2" />
              Reset Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Employee ID, Name, Serial No..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="not-measured">Not Measured</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Branch Filter */}
            <div className="space-y-2">
              <Label>Branch</Label>
              <Select value={branchFilter} onValueChange={setBranchFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {uniqueBranches.map(branch => (
                    <SelectItem key={branch} value={branch}>
                      {branch}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Card>

      {/* Download Sheet Section */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-300">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Download className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold text-indigo-900">Download Employee Sheet</h3>
          </div>

          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700 text-sm">
              <strong>Export Options:</strong> Download employee measurement data filtered by status. 
              The Excel file will include all employee details, measurement data, and PO information.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {/* Download Complete Sheet */}
            <Button
              onClick={() => downloadFilteredSheet("all")}
              className="h-auto py-4 flex-col items-start bg-white text-indigo-700 hover:bg-indigo-100 border-2 border-indigo-300"
              variant="outline"
            >
              <div className="flex items-center gap-2 mb-1 w-full">
                <FileSpreadsheet className="h-5 w-5" />
                <span className="font-semibold">Complete Sheet</span>
              </div>
              <span className="text-xs text-muted-foreground">
                All {totalEmployees} employees
              </span>
            </Button>

            {/* Download Completed Only */}
            <Button
              onClick={() => downloadFilteredSheet("completed")}
              className="h-auto py-4 flex-col items-start bg-white text-green-700 hover:bg-green-100 border-2 border-green-300"
              variant="outline"
            >
              <div className="flex items-center gap-2 mb-1 w-full">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">Completed Only</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {completed} employees
              </span>
            </Button>

            {/* Download In Progress */}
            <Button
              onClick={() => downloadFilteredSheet("in-progress")}
              className="h-auto py-4 flex-col items-start bg-white text-blue-700 hover:bg-blue-100 border-2 border-blue-300"
              variant="outline"
            >
              <div className="flex items-center gap-2 mb-1 w-full">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">In Progress</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {inProgress} employees
              </span>
            </Button>

            {/* Download Not Measured */}
            <Button
              onClick={() => downloadFilteredSheet("not-measured")}
              className="h-auto py-4 flex-col items-start bg-white text-red-700 hover:bg-red-100 border-2 border-red-300"
              variant="outline"
            >
              <div className="flex items-center gap-2 mb-1 w-full">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">Not Measured</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {notMeasured} employees
              </span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Employee Table */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">
              Employee List ({filteredEmployees.length})
            </h3>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th rowSpan={2} className="text-left p-3 text-sm font-semibold border border-gray-300 bg-gray-50">Sr. No</th>
                  <th rowSpan={2} className="text-left p-3 text-sm font-semibold border border-gray-300 bg-gray-50">Serial No</th>
                  <th rowSpan={2} className="text-left p-3 text-sm font-semibold border border-gray-300 bg-gray-50">Employee ID</th>
                  <th rowSpan={2} className="text-left p-3 text-sm font-semibold border border-gray-300 bg-gray-50">Name</th>
                  <th rowSpan={2} className="text-left p-3 text-sm font-semibold border border-gray-300 bg-gray-50">Department</th>
                  <th rowSpan={2} className="text-left p-3 text-sm font-semibold border border-gray-300 bg-gray-50">Designation</th>
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
                    <td colSpan={27} className="py-8 text-center text-muted-foreground">
                      No employees found. Try adjusting your filters.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => {
                    const shirtMeasurements = employee.measurements?.shirt || {};
                    const pantMeasurements = employee.measurements?.pant || {};
                    const showShirtFixed = employee.shirtSizingMode === "fixed" && employee.shirtFixedSize;
                    const showPantFixed = employee.pantSizingMode === "fixed" && employee.pantFixedSize;
                    
                    return (
                      <tr
                        key={employee.uniqueSerialNumber}
                        className="border-t hover:bg-muted/50 transition-colors"
                      >
                        <td className="p-3 text-sm border-r">{employee.srNo}</td>
                        <td className="p-3 text-sm border-r">
                          <span className="font-mono font-semibold text-indigo-600">
                            {employee.uniqueSerialNumber}
                          </span>
                        </td>
                        <td className="p-3 text-sm font-medium border-r">{employee.employeeId}</td>
                        <td className="p-3 text-sm border-r">{employee.employeeName}</td>
                        <td className="p-3 text-sm border-r">{employee.department}</td>
                        <td className="p-3 text-sm text-muted-foreground border-r">{employee.designation}</td>
                        <td className="p-3 text-sm text-muted-foreground border-r">{employee.branch}</td>
                        <td className="p-3 text-sm text-center font-semibold text-indigo-700 border-r bg-indigo-50/40">
                          {poData.shirtsPerPerson ?? "-"}
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
                          {poData.pantsPerPerson ?? "-"}
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
                        
                        <td className="p-3 border-l">{getStatusBadge(employee.measurementStatus)}</td>
                        <td className="p-3 border-l">
                          <Button
                            size="sm"
                            onClick={() => onSelectEmployee(employee)}
                            variant={
                              employee.measurementStatus === "not-measured" ? "default" : "outline"
                            }
                          >
                            <Ruler className="h-4 w-4 mr-2" />
                            {employee.measurementStatus === "not-measured"
                              ? "Add Measurements"
                              : "View/Edit"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Garment Design Photo Upload */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Image className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold text-lg">
              Garment Design Photo
            </h3>
          </div>
          
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>Design Reference:</strong> Upload a single garment design photo that will be used as a reference 
              for production. This photo indicates the style and design that should be manufactured for this entire order.
            </AlertDescription>
          </Alert>

          {garmentPhoto ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <img
                  src={garmentPhoto}
                  alt="Garment Design Reference"
                  className="w-64 h-64 object-cover rounded-lg border-2 border-indigo-200 shadow-lg"
                />
                <div className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-sm font-semibold">Design Reference Photo</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Label htmlFor="garment-photo-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Change Photo
                    </span>
                  </Button>
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleGarmentPhotoUpload}
                  className="hidden"
                  id="garment-photo-upload"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center">
                <Image className="h-16 w-16 text-indigo-400" />
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  No design photo uploaded yet
                </p>
                <Label htmlFor="garment-photo-upload">
                  <Button variant="default" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Design Photo
                    </span>
                  </Button>
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleGarmentPhotoUpload}
                  className="hidden"
                  id="garment-photo-upload"
                />
              </div>
            </div>
          )}

          {garmentPhotoFile && (
            <div className="flex items-center justify-center">
              <Alert className="border-green-200 bg-green-50 max-w-md">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  <strong>Photo Selected:</strong> {garmentPhotoFile.name}
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}