import { useState } from "react";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Download,
  Calendar,
  Building2,
  Hash,
  FileText,
  Search,
  Edit2,
  Eye,
  Filter,
  ArrowRight,
  Clock,
  Users,
} from "lucide-react";
import * as XLSX from "xlsx";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { PageHeader } from "@/app/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { EmployeeData } from "./employee-excel-upload";
import { mockEmployeeData } from "@/app/data/mock-employee-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";

interface POUploadScreenProps {
  onDataProcessed: (poData: POData, employees: EmployeeData[]) => void;
}

export interface POData {
  poNumber: string;
  companyName: string;
  companyPrefix: string;
  orderDate: string;
  poDocumentName?: string;
  employeeSheetName?: string;
  garmentDesignPhoto?: string;
  shirtsPerPerson?: number;
  pantsPerPerson?: number;
  tshirtsPerPerson?: number;
}

const companies = [
  { name: "ABC Garments", prefix: "ABC" },
  { name: "XYZ Fashion", prefix: "XYZ" },
  { name: "StyleCo", prefix: "STC" },
  { name: "TrendWear", prefix: "TRW" },
  { name: "Fashion Hub", prefix: "FHB" },
];

// Mock existing PO data
interface ExistingPO {
  id: string;
  poNumber: string;
  companyName: string;
  companyPrefix: string;
  orderDate: string;
  uploadDate: string;
  status: "Pending" | "In Progress" | "Completed";
  employeeCount: number;
  poDocumentName: string;
  employeeSheetName: string;
  employees: EmployeeData[];
}

// Empty existing POs - all data will come from Supabase
const mockExistingPOs: ExistingPO[] = [];

export function POUploadScreen({ onDataProcessed }: POUploadScreenProps) {
  // Mode toggle
  const [mode, setMode] = useState<"new" | "edit">("new");
  
  // Search filters
  const [searchPONumber, setSearchPONumber] = useState("");
  const [searchCompany, setSearchCompany] = useState("");
  
  // Selected PO for editing
  const [selectedPO, setSelectedPO] = useState<ExistingPO | null>(null);
  
  const [poNumber, setPONumber] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [poDocument, setPODocument] = useState<File | null>(null);
  const [employeeSheet, setEmployeeSheet] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(0);

  const selectedCompany = companies.find(c => c.name === companyName);

  const handlePODocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPODocument(file);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  };

  const handleEmployeeSheetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEmployeeSheet(file);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!poNumber || !companyName || !orderDate || !poDocument || !employeeSheet) {
      setUploadStatus("error");
      setErrorMessage("Please fill in all required fields and upload both documents");
      return;
    }

    setUploadStatus("processing");

    // Parse the employee sheet using XLSX
    const reader = new FileReader();
    const fileName = employeeSheet.name.toLowerCase();
    const isCSV = fileName.endsWith('.csv');

    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        let workbook;

        if (isCSV) {
          workbook = XLSX.read(data, { type: "string", raw: false, codepage: 65001 });
        } else {
          workbook = XLSX.read(data, { type: "binary" });
        }

        console.log("📚 PO Upload - Workbook:", workbook);
        console.log("📋 Sheet Names:", workbook.SheetNames);

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          setUploadStatus("error");
          setErrorMessage("No sheets found in the employee file. The file appears to be empty or corrupted.");
          return;
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
          setUploadStatus("error");
          setErrorMessage(`Cannot read worksheet "${sheetName}". The sheet appears to be empty.`);
          return;
        }

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
          raw: false,
          blankrows: false
        }) as any[][];

        console.log("📊 Parsed data:", jsonData);
        console.log("📈 Rows:", jsonData.length);

        if (!jsonData || jsonData.length < 2) {
          setUploadStatus("error");
          setErrorMessage("Employee sheet is empty or has no data rows. Please ensure the file has headers in row 1 and data starting from row 2.");
          return;
        }

        // Extract headers
        const headers = jsonData[0].map((h: any) => String(h).trim().toUpperCase());
        console.log("🔤 Headers:", headers);

        // Flexible column matching
        const getColumnIndex = (columnName: string) => {
          return headers.findIndex(header => {
            const nh = header.replace(/\s+/g, "").toUpperCase();
            const nc = columnName.replace(/\s+/g, "").toUpperCase();
            return nh === nc || nh.includes(nc) || nc.includes(nh);
          });
        };

        const srNoIndex = getColumnIndex("SR NO") !== -1 ? getColumnIndex("SR NO") : getColumnIndex("SRNO");
        const employeeIdIndex = getColumnIndex("EMPLOYEE ID") !== -1 ? getColumnIndex("EMPLOYEE ID") : getColumnIndex("EMPLOYEEID");
        const nameIndex = getColumnIndex("NAME");
        const deptIndex = getColumnIndex("DEPT") !== -1 ? getColumnIndex("DEPT") : getColumnIndex("DEPARTMENT");

        // Check required columns
        const missing: string[] = [];
        if (srNoIndex === -1) missing.push("SR NO");
        if (employeeIdIndex === -1) missing.push("Employee ID");
        if (nameIndex === -1) missing.push("NAME");
        if (deptIndex === -1) missing.push("DEPT");

        if (missing.length > 0) {
          setUploadStatus("error");
          setErrorMessage(
            `Missing required columns: ${missing.join(", ")}\n\n` +
            `Expected: SR NO, Employee ID, NAME, DEPT\n` +
            `Found: ${headers.join(", ")}\n\n` +
            `Please download the template for the correct format.`
          );
          return;
        }

        // Generate company prefix
        const companyPrefix = selectedCompany?.prefix ||
          companyName.substring(0, 2).toUpperCase();

        // Parse data rows
        const dataRows = jsonData.slice(1);
        const parsedEmployees: EmployeeData[] = dataRows
          .filter((row: any[]) => row && row.length > 0 && (row[srNoIndex] || row[nameIndex]))
          .map((row: any[], index: number) => {
            const srNo = parseInt(String(row[srNoIndex] || (index + 1)));
            const employeeId = String(row[employeeIdIndex] || "").trim();
            const employeeName = String(row[nameIndex] || "").trim();
            const department = String(row[deptIndex] || "").trim();
            const uniqueSerialNumber = `${companyPrefix}${String(srNo).padStart(3, "0")}`;

            return {
              srNo,
              employeeId,
              employeeName,
              department,
              branch: department,
              uniqueSerialNumber,
              poId: poNumber,
              poNumber: poNumber,
              measurementStatus: "not-measured" as const,
              measurements: {
                shirt: {
                  length: "", shoulder: "", chest: "", waist: "",
                  sleeve: "", neck: "", front: "", collar: "", cuff: "",
                },
                pant: {
                  length: "", waist: "", hip: "", thigh: "",
                  inseam: "", round: "", bottom: "",
                },
              },
              shirtSizingMode: "measurement" as const,
              pantSizingMode: "measurement" as const,
            };
          });

        console.log("✅ Parsed employees:", parsedEmployees.length);

        if (parsedEmployees.length === 0) {
          setUploadStatus("error");
          setErrorMessage("No valid employee data found. Please check the file has data rows below the header.");
          return;
        }

        setTotalQuantity(parsedEmployees.length);

        const poData: POData = {
          poNumber,
          companyName,
          companyPrefix: companyPrefix,
          orderDate,
          poDocumentName: poDocument.name,
          employeeSheetName: employeeSheet.name,
        };

        setUploadStatus("success");

        // Proceed to master sheet after 1 second
        setTimeout(() => {
          onDataProcessed(poData, parsedEmployees);
        }, 1000);
      } catch (error) {
        console.error("❌ Excel parsing error:", error);
        setUploadStatus("error");
        setErrorMessage(
          `Error processing employee sheet: ${error instanceof Error ? error.message : "Unknown error"}\n\n` +
          `Please ensure the file is a valid Excel (.xlsx) or CSV file.`
        );
      }
    };

    reader.onerror = () => {
      setUploadStatus("error");
      setErrorMessage("Failed to read the employee file. Please try again.");
    };

    if (isCSV) {
      reader.readAsText(employeeSheet);
    } else {
      reader.readAsBinaryString(employeeSheet);
    }
  };

  const downloadTemplate = () => {
    // Create XLSX with 10 sample employees for testing
    const headers = [
      "SR NO",
      "Employee ID",
      "NAME",
      "DEPT"
    ];

    const sampleRows = [
      [1, "EMP001", "Rajesh Kumar", "Production"],
      [2, "EMP002", "Priya Sharma", "Quality Control"],
      [3, "EMP003", "Amit Singh", "Cutting"],
      [4, "EMP004", "Sneha Patel", "Stitching"],
      [5, "EMP005", "Vikram Rao", "Finishing"],
      [6, "EMP006", "Anita Desai", "Packing"],
      [7, "EMP007", "Sanjay Mehta", "Production"],
      [8, "EMP008", "Kavita Joshi", "Quality Control"],
      [9, "EMP009", "Rahul Gupta", "Cutting"],
      [10, "EMP010", "Pooja Reddy", "Stitching"]
    ];

    const wb = XLSX.utils.book_new();
    const wsData = [headers, ...sampleRows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths for readability
    ws["!cols"] = [
      { wch: 8 },   // SR NO
      { wch: 14 },  // Employee ID
      { wch: 22 },  // NAME
      { wch: 18 },  // DEPT
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Employees");

    // Force proper .xlsx output using blob approach
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Sample_Employees_10_${poNumber || "Test"}_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter existing POs based on search criteria
  const filteredPOs = mockExistingPOs.filter((po) => {
    const matchesPONumber = !searchPONumber || po.poNumber.toLowerCase().includes(searchPONumber.toLowerCase());
    const matchesCompany = !searchCompany || po.companyName === searchCompany;
    
    return matchesPONumber && matchesCompany;
  });

  // Load selected PO data into form and proceed to edit employees
  const handleLoadPO = (po: ExistingPO) => {
    const poData: POData = {
      poNumber: po.poNumber,
      companyName: po.companyName,
      companyPrefix: po.companyPrefix,
      orderDate: po.orderDate,
      poDocumentName: po.poDocumentName,
      employeeSheetName: po.employeeSheetName,
    };
    
    // Proceed directly to employee editing screen
    onDataProcessed(poData, po.employees);
  };

  // Reset search filters
  const handleResetSearch = () => {
    setSearchPONumber("");
    setSearchCompany("");
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700 border-green-300";
      case "In Progress":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const isFormValid = poNumber && companyName && orderDate && poDocument && employeeSheet;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Purchase Order & Employee Data Upload"
        description="Upload PO document and company employee sheet to begin measurement process"
      />

      {/* Mode Toggle */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-lg">Select Mode</h3>
            <p className="text-sm text-muted-foreground">Choose whether to create a new PO or edit an existing one</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Button
            type="button"
            variant={mode === "new" ? "default" : "outline"}
            size="lg"
            onClick={() => setMode("new")}
            className={`h-24 flex flex-col items-center justify-center gap-2 ${
              mode === "new" ? "bg-indigo-600" : ""
            }`}
          >
            <Upload className="h-8 w-8" />
            <div>
              <div className="font-semibold">New Upload</div>
              <div className="text-xs opacity-80">Create new PO and upload data</div>
            </div>
          </Button>
          
          <Button
            type="button"
            variant={mode === "edit" ? "default" : "outline"}
            size="lg"
            onClick={() => setMode("edit")}
            className={`h-24 flex flex-col items-center justify-center gap-2 ${
              mode === "edit" ? "bg-indigo-600" : ""
            }`}
          >
            <Edit2 className="h-8 w-8" />
            <div>
              <div className="font-semibold">Edit Existing</div>
              <div className="text-xs opacity-80">Find and edit past uploads</div>
            </div>
          </Button>
        </div>
      </Card>

      {/* Edit Existing Mode */}
      {mode === "edit" && (
        <>
          {/* Search Filters */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-indigo-600" />
                <h3 className="font-semibold text-lg">Search Purchase Orders</h3>
              </div>
              <Button variant="outline" size="sm" onClick={handleResetSearch}>
                Reset Filters
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* PO Number Search */}
              <div className="space-y-2">
                <Label htmlFor="searchPONumber">
                  <Hash className="h-4 w-4 inline mr-1" />
                  PO Number
                </Label>
                <Input
                  id="searchPONumber"
                  placeholder="Search PO..."
                  value={searchPONumber}
                  onChange={(e) => setSearchPONumber(e.target.value)}
                />
              </div>

              {/* Company Search */}
              <div className="space-y-2">
                <Label htmlFor="searchCompany">
                  <Building2 className="h-4 w-4 inline mr-1" />
                  Company
                </Label>
                <Select value={searchCompany} onValueChange={setSearchCompany}>
                  <SelectTrigger id="searchCompany">
                    <SelectValue placeholder="All companies" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.name} value={company.name}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {searchCompany && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchCompany("")}
                    className="h-6 text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Results Table */}
          <Card>
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Search Results</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Found {filteredPOs.length} purchase order(s)
                  </p>
                </div>
              </div>
            </div>
            
            {filteredPOs.length === 0 ? (
              <div className="p-12 text-center">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">No Purchase Orders Found</h3>
                <p className="text-sm text-gray-600">
                  {mockExistingPOs.length === 0 
                    ? "No purchase orders have been uploaded yet. Use 'New Upload' to create your first PO."
                    : "Try adjusting your search filters"}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        PO Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Company Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Order Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Upload Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Employees
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPOs.map((po) => (
                      <tr key={po.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Hash className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-semibold text-gray-900">{po.poNumber}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-900">{po.companyName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">
                              {new Date(po.orderDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">
                              {new Date(po.uploadDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className={getStatusBadge(po.status)}>
                            {po.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-semibold text-indigo-600">{po.employeeCount}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <Button
                            size="sm"
                            onClick={() => handleLoadPO(po)}
                            className="bg-indigo-600"
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Edit Measurements
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {/* New Upload Mode */}
      {mode === "new" && (
        <>
          {/* Status Alerts */}
          {uploadStatus === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-900">Success!</AlertTitle>
              <AlertDescription className="text-green-700">
                PO and employee data processed successfully. Creating employee master sheet...
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertTitle className="text-red-900">Error</AlertTitle>
              <AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
            </Alert>
          )}

          {uploadStatus === "processing" && (
            <Alert className="border-blue-200 bg-blue-50">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                <AlertDescription className="text-blue-700">
                  <strong>Processing:</strong> Validating employee sheet and generating unique serial numbers...
                </AlertDescription>
              </div>
            </Alert>
          )}

          {/* PO Upload Form */}
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section 1: PO Details */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">1</span>
                  </div>
                  Purchase Order Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* PO Number */}
                  <div className="space-y-2">
                    <Label htmlFor="poNumber">
                      PO Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="poNumber"
                      placeholder="e.g., PO-2026-001"
                      value={poNumber}
                      onChange={(e) => setPONumber(e.target.value)}
                      required
                    />
                  </div>

                  {/* Company Name */}
                  <div className="space-y-2">
                    <Label htmlFor="company">
                      Company Name <span className="text-red-500">*</span>
                    </Label>
                    <Select value={companyName} onValueChange={setCompanyName} required>
                      <SelectTrigger id="company">
                        <SelectValue placeholder="Select company" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((company) => (
                          <SelectItem key={company.name} value={company.name}>
                            {company.name} ({company.prefix})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCompany && (
                      <p className="text-xs text-muted-foreground">
                        Serial Number Format: <span className="font-semibold text-indigo-600">{selectedCompany.prefix}XXX</span>
                      </p>
                    )}
                  </div>

                  {/* Order Date */}
                  <div className="space-y-2">
                    <Label htmlFor="orderDate">
                      Order Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="orderDate"
                      type="date"
                      value={orderDate}
                      onChange={(e) => setOrderDate(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                {/* Section 2: Document Uploads */}
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold text-sm">2</span>
                  </div>
                  Document Uploads
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PO Document Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="poDocument">
                      PO Document <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">PDF, DOC, or DOCX format</p>
                      </div>
                      <Input
                        id="poDocument"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handlePODocumentChange}
                        required
                      />
                      {poDocument && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {poDocument.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Company Employee Sheet Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="employeeSheet">
                      Company Employee Sheet <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Excel format (.xlsx, .xls)</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={downloadTemplate}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Template
                        </Button>
                      </div>
                      <Input
                        id="employeeSheet"
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleEmployeeSheetChange}
                        required
                      />
                      {employeeSheet && (
                        <p className="text-xs text-green-600 flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {employeeSheet.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <Alert className="border-blue-200 bg-blue-50">
                <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">Employee Sheet Requirements</AlertTitle>
                <AlertDescription className="text-blue-700">
                  <div className="mt-2 space-y-1 text-sm">
                    <p><strong>Required Columns:</strong></p>
                    <ul className="ml-4 space-y-1">
                      <li>• Sr. No - Sequential number (1, 2, 3...)</li>
                      <li>• Employee ID - Company's employee identifier</li>
                      <li>• Employee Name - Full name of employee</li>
                      <li>• Branch - Branch/location name</li>
                    </ul>
                    <p className="mt-2">
                      <strong>System will automatically generate:</strong> Unique Serial Number = {selectedCompany?.prefix || "Prefix"} + Sr. No
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={!isFormValid || uploadStatus === "processing" || uploadStatus === "success"}
                  className="min-w-[250px]"
                >
                  {uploadStatus === "processing" ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : uploadStatus === "success" ? (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Creating Master Sheet...
                    </>
                  ) : (
                    <>
                      <Upload className="h-5 w-5 mr-2" />
                      Process & Create Master Sheet
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* Instructions */}
          <Card className="p-6 bg-gray-50">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              Instructions
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">1.</span>
                <span>Enter the PO number exactly as received from the company</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">2.</span>
                <span>Select the company - this determines the prefix for unique serial numbers (e.g., ABC001, ABC002...)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">3.</span>
                <span>Upload the official PO document for record keeping</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">4.</span>
                <span>Upload the company employee sheet - system will extract all employee details and generate unique serial numbers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 font-bold">5.</span>
                <span>System creates employee master sheet with empty measurement fields, ready for measurement entry</span>
              </li>
            </ul>
          </Card>
        </>
      )}
    </div>
  );
}