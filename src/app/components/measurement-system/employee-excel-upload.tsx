import { useState } from "react";
import * as XLSX from "xlsx";
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  AlertCircle, 
  Download,
  ArrowRight,
  Eye
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { PageHeader } from "@/app/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { POData } from "./po-upload-screen";

interface EmployeeExcelUploadProps {
  poData: POData;
  onEmployeesUploaded: (employees: EmployeeData[]) => void;
  onBack: () => void;
}

export interface EmployeeData {
  srNo: number;
  employeeId: string;
  employeeName: string;
  department: string;
  remarks?: string;
  uniqueSerialNumber: string;
  
  // PO Linking
  poId?: string;
  poNumber?: string;
  
  // Measurement fields - added by system (empty initially)
  measurements?: {
    shirt: ShirtMeasurements;
    pant: PantMeasurements;
  };
  
  // Sizing modes
  shirtSizingMode?: "measurement" | "fixed";
  shirtFixedSize?: string;
  pantSizingMode?: "measurement" | "fixed";
  pantFixedSize?: string;
  
  // Fit type (added from measurement entry form)
  fitType?: "medium" | "loose" | "straight";
  
  // Status tracking
  measurementStatus: "not-measured" | "in-progress" | "completed";
  measuredBy?: string;
  measurementDate?: string;
  
  // Optional fields (for backward compatibility)
  branch?: string;
  designation?: string;
  mobile?: string;
  email?: string;
  gender?: "Male" | "Female";
  joiningDate?: string;
  photo?: string;
  qualityCheck?: "passed" | "pending" | "failed";
  productionStatus?: "completed" | "in-progress" | "not-started";
}

interface ShirtMeasurements {
  length: string;
  shoulder: string;
  chest: string;
  waist: string;
  sleeve: string;
  neck: string;
  front: string;
  collar: string;
  cuff: string;
}

interface PantMeasurements {
  length: string;
  waist: string;
  hip: string;
  thigh: string;
  inseam: string;
  round: string;
  bottom: string;
}

export function EmployeeExcelUpload({ poData, onEmployeesUploaded, onBack }: EmployeeExcelUploadProps) {
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "validating" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [previewData, setPreviewData] = useState<EmployeeData[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFile(file);
      setUploadStatus("idle");
      setErrorMessage("");
      setShowPreview(false);
    }
  };

  const validateAndProcessExcel = () => {
    if (!excelFile) {
      setUploadStatus("error");
      setErrorMessage("Please select an Excel file to upload");
      return;
    }

    setUploadStatus("validating");

    // Parse Excel file using xlsx library
    const reader = new FileReader();
    const fileName = excelFile.name.toLowerCase();
    const isCSV = fileName.endsWith('.csv');
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        
        // Determine file type and read accordingly
        let workbook;
        
        if (isCSV) {
          // For CSV files, read as text/string
          workbook = XLSX.read(data, { 
            type: "string",
            raw: false,
            codepage: 65001 // UTF-8 support
          });
        } else {
          // For Excel files (.xlsx, .xls), read as binary
          workbook = XLSX.read(data, { 
            type: "binary"
          });
        }
        
        // Debug workbook structure
        console.log("📚 Workbook:", workbook);
        console.log("📋 Sheet Names:", workbook.SheetNames);
        
        // Check if workbook has sheets
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          setUploadStatus("error");
          setErrorMessage(
            `❌ No sheets found in the file!\\n\\n` +
            `The file appears to be empty or corrupted.\\n\\n` +
            `Please try:\\n` +
            `1. Download the template again\\n` +
            `2. Make sure the file has data\\n` +
            `3. Try saving as .xlsx format if using CSV`
          );
          return;
        }
        
        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        console.log("📄 Worksheet:", worksheet);
        
        // Check if worksheet exists
        if (!worksheet) {
          setUploadStatus("error");
          setErrorMessage(
            `❌ Cannot read worksheet "${sheetName}"!\\n\\n` +
            `The sheet appears to be empty or corrupted.\\n\\n` +
            `Please download the template and try again.`
          );
          return;
        }
        
        // Convert to JSON with defval to handle empty cells
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          header: 1,
          defval: "",
          raw: false, // Convert all values to strings for consistency
          blankrows: false // Skip blank rows
        }) as any[][];
        
        // Debug log to see what we got
        console.log("📄 File name:", excelFile.name);
        console.log("📁 File type:", isCSV ? 'CSV' : 'Excel');
        console.log("📊 Parsed jsonData:", jsonData);
        console.log("📈 jsonData length:", jsonData.length);
        
        if (jsonData && jsonData.length > 0) {
          console.log("🔤 First row (headers):", jsonData[0]);
        }
        
        if (!jsonData || jsonData.length === 0) {
          setUploadStatus("error");
          setErrorMessage(
            "❌ File is empty or invalid format!\\n\\n" +
            `File: ${excelFile.name}\\n` +
            `Type: ${isCSV ? 'CSV' : 'Excel'}\\n\\n` +
            "Please ensure:\\n" +
            "• File has headers in first row\\n" +
            "• File has at least one data row\\n" +
            "• File is not corrupted\\n\\n" +
            "💡 Tip: Download the template button for a working example"
          );
          return;
        }

        // Extract headers (first row)
        const headers = jsonData[0].map((h: any) => String(h).trim().toUpperCase());
        
        // Expected headers (case-insensitive, flexible matching)
        const expectedHeaders = ["SR NO", "EMPLOYEE ID", "NAME", "DEPT"];
        const requiredHeaders = ["SR NO", "EMPLOYEE ID", "NAME", "DEPT"];
        
        // Check if all required columns are present
        const missingHeaders = requiredHeaders.filter(required => {
          return !headers.some(header => {
            // Flexible matching: remove spaces, convert to uppercase
            const normalizedHeader = header.replace(/\s+/g, "").toUpperCase();
            const normalizedRequired = required.replace(/\s+/g, "").toUpperCase();
            return normalizedHeader === normalizedRequired || 
                   normalizedHeader.includes(normalizedRequired) ||
                   normalizedRequired.includes(normalizedHeader);
          });
        });

        if (missingHeaders.length > 0) {
          setUploadStatus("error");
          setErrorMessage(
            `❌ Wrong Column Format! Missing required columns: ${missingHeaders.join(", ")}\n\n` +
            `✓ Expected Columns: SR NO, Employee ID, NAME, DEPT\n` +
            `✗ Your Columns: ${headers.join(", ")}\n\n` +
            `Please download the template and use the correct format.`
          );
          return;
        }

        // Check if there are exactly 4 columns
        if (headers.length !== 4) {
          setUploadStatus("error");
          setErrorMessage(
            `❌ Wrong Column Count! Expected 4 columns, but found ${headers.length}\n\n` +
            `✓ Expected Columns: SR NO, Employee ID, NAME, DEPT\n` +
            `✗ Your Columns: ${headers.join(", ")}\n\n` +
            `Please use ONLY the 4 required columns. Download the template for the correct format.`
          );
          return;
        }

        // Find column indices (flexible matching)
        const getColumnIndex = (columnName: string) => {
          return headers.findIndex(header => {
            const normalizedHeader = header.replace(/\s+/g, "").toUpperCase();
            const normalizedColumn = columnName.replace(/\s+/g, "").toUpperCase();
            return normalizedHeader === normalizedColumn || 
                   normalizedHeader.includes(normalizedColumn) ||
                   normalizedColumn.includes(normalizedHeader);
          });
        };

        const srNoIndex = getColumnIndex("SR NO");
        const employeeIdIndex = getColumnIndex("EMPLOYEE ID");
        const nameIndex = getColumnIndex("NAME");
        const deptIndex = getColumnIndex("DEPT");

        // Parse data rows (skip header)
        const dataRows = jsonData.slice(1);
        
        if (dataRows.length === 0) {
          setUploadStatus("error");
          setErrorMessage("Excel file has no data rows. Please add employee data.");
          return;
        }

        // Generate company prefix
        const companyPrefix = poData.companyName 
          ? poData.companyName.substring(0, 2).toUpperCase() 
          : "XX";

        // Parse employees
        const parsedEmployees: EmployeeData[] = dataRows
          .filter((row: any[]) => row && row.length > 0 && row[srNoIndex]) // Filter empty rows
          .map((row: any[], index: number) => {
            const srNo = parseInt(String(row[srNoIndex] || (index + 1)));
            const employeeId = String(row[employeeIdIndex] || "").trim();
            const employeeName = String(row[nameIndex] || "").trim();
            const department = String(row[deptIndex] || "").trim();

            // Generate unique serial number with padding
            const uniqueSerialNumber = `${companyPrefix}${String(srNo).padStart(3, "0")}`;

            return {
              srNo,
              employeeId,
              employeeName,
              department,
              branch: department, // Use department as branch for display
              uniqueSerialNumber,
              poId: poData.poNumber,
              poNumber: poData.poNumber,
              measurementStatus: "not-measured" as const,
              measurements: {
                shirt: {
                  length: "",
                  shoulder: "",
                  chest: "",
                  waist: "",
                  sleeve: "",
                  neck: "",
                  front: "",
                  collar: "",
                  cuff: "",
                },
                pant: {
                  length: "",
                  waist: "",
                  hip: "",
                  thigh: "",
                  inseam: "",
                  round: "",
                  bottom: "",
                },
              },
              shirtSizingMode: "measurement",
              pantSizingMode: "measurement",
            };
          });

        // Validate data
        if (parsedEmployees.length === 0) {
          setUploadStatus("error");
          setErrorMessage("No valid employee data found in Excel file.");
          return;
        }

        // Check if quantity matches
        if (parsedEmployees.length !== poData.totalQuantity) {
          setUploadStatus("error");
          setErrorMessage(
            `❌ Quantity Mismatch!\n\n` +
            `Expected: ${poData.totalQuantity} employees (as per PO)\n` +
            `Found: ${parsedEmployees.length} employees in Excel\n\n` +
            `Please ensure the number of employees matches the PO quantity.`
          );
          return;
        }

        // Success!
        setPreviewData(parsedEmployees);
        setUploadStatus("success");
        setShowPreview(true);

      } catch (error) {
        console.error("Excel parsing error:", error);
        setUploadStatus("error");
        setErrorMessage(
          `Failed to parse Excel file. Error: ${error instanceof Error ? error.message : "Unknown error"}\n\n` +
          `Please ensure the file is a valid Excel/CSV file and follows the template format.`
        );
      }
    };

    reader.onerror = () => {
      setUploadStatus("error");
      setErrorMessage("Failed to read file. Please try again.");
    };

    // Use appropriate reading method based on file type
    if (isCSV) {
      // For CSV files, read as text
      reader.readAsText(excelFile);
    } else {
      // For Excel files, read as binary string
      reader.readAsBinaryString(excelFile);
    }
  };

  const handleConfirmUpload = () => {
    onEmployeesUploaded(previewData);
  };

  const downloadTemplate = () => {
    // Create Excel template with ONLY the required 4 columns (REMARK removed - will be added in master sheet)
    const headers = [
      "SR NO",
      "Employee ID",
      "NAME",
      "DEPT"
    ];

    // Sample data rows - 4 columns only - 10 rows to match sample
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

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const wsData = [headers, ...sampleRows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Employees");

    // Generate Excel file and download using blob for proper .xlsx output
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Employee_Template_${poData.poNumber || "Template"}_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Data Upload"
        description="Step 2: Upload company employee Excel file"
      />

      {/* Process Flow Indicator */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 opacity-50">
            <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold text-green-900">Purchase Order Uploaded</p>
              <p className="text-sm text-green-700">{poData.poNumber}</p>
            </div>
          </div>
          <ArrowRight className="h-6 w-6 text-indigo-400" />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <p className="font-semibold text-indigo-900">Upload Employee Excel</p>
              <p className="text-sm text-indigo-700">Process and validate employee data</p>
            </div>
          </div>
        </div>
      </Card>

      {/* PO Summary */}
      <Card className="p-4 bg-muted">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">PO Number</p>
            <p className="font-semibold">{poData.poNumber}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Company</p>
            <p className="font-semibold">{poData.companyName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Prefix</p>
            <p className="font-semibold text-indigo-600">{poData.companyPrefix}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Expected Employees</p>
            <p className="font-semibold">{poData.totalQuantity}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Delivery Date</p>
            <p className="font-semibold">{poData.deliveryDate}</p>
          </div>
        </div>
      </Card>

      {/* Status Alerts */}
      {uploadStatus === "error" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-900">Validation Error</AlertTitle>
          <AlertDescription className="text-red-700 whitespace-pre-line">{errorMessage}</AlertDescription>
        </Alert>
      )}

      {uploadStatus === "success" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900">Validation Successful!</AlertTitle>
          <AlertDescription className="text-green-700">
            Excel file validated. {previewData.length} employees processed. Review and confirm below.
          </AlertDescription>
        </Alert>
      )}

      {/* Upload Section */}
      <Card className="p-6">
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Label htmlFor="excelFile">
                Employee Excel File <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-muted-foreground">
                Upload Excel file containing: Sr. No, Employee ID, Employee Name, Department
              </p>
              <Input
                id="excelFile"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                disabled={uploadStatus === "validating"}
              />
              {excelFile && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {excelFile.name}
                </p>
              )}
            </div>
            <div className="ml-4 space-y-2">
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template (.xlsx)
              </Button>
              <a
                href="/sample-employees-10.csv"
                download="sample-employees-10.csv"
                className="block"
              >
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Sample CSV
                </Button>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between gap-3">
            <Button variant="outline" onClick={onBack} disabled={uploadStatus === "validating"}>
              Back to PO Upload
            </Button>
            <Button
              onClick={validateAndProcessExcel}
              disabled={!excelFile || uploadStatus === "validating" || uploadStatus === "success"}
              className="min-w-[200px]"
            >
              {uploadStatus === "validating" ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Validating...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Validate & Preview
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Preview Section */}
      {showPreview && previewData.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Employee Data Preview</h3>
                <p className="text-sm text-muted-foreground">
                  {previewData.length} employees ready for processing
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Unique Serial Number Format</p>
                <p className="font-semibold text-indigo-600">{poData.companyPrefix}XXX</p>
              </div>
            </div>

            {/* Preview Table */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold">Sr. No</th>
                    <th className="text-left p-3 text-sm font-semibold">Employee ID</th>
                    <th className="text-left p-3 text-sm font-semibold">Employee Name</th>
                    <th className="text-left p-3 text-sm font-semibold">Branch</th>
                    <th className="text-left p-3 text-sm font-semibold">Unique Serial Number</th>
                    <th className="text-left p-3 text-sm font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((employee) => (
                    <tr key={employee.uniqueSerialNumber} className="border-t hover:bg-muted/50">
                      <td className="p-3 text-sm">{employee.srNo}</td>
                      <td className="p-3 text-sm font-medium">{employee.employeeId}</td>
                      <td className="p-3 text-sm">{employee.employeeName}</td>
                      <td className="p-3 text-sm">{employee.branch}</td>
                      <td className="p-3 text-sm">
                        <span className="font-mono font-semibold text-indigo-600">
                          {employee.uniqueSerialNumber}
                        </span>
                      </td>
                      <td className="p-3 text-sm">
                        <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                          Not Measured
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Confirm Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                onClick={handleConfirmUpload}
                size="lg"
                className="min-w-[250px]"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                Confirm & Create Master Sheet
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Instructions */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
          Excel File Requirements
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="p-3 bg-blue-50 rounded border border-blue-200">
            <p className="font-semibold text-blue-900 mb-2">📁 Supported File Formats:</p>
            <ul className="space-y-1 ml-4 text-blue-800">
              <li>✅ <strong>.xlsx</strong> - Excel 2007+ (Recommended)</li>
              <li>✅ <strong>.xls</strong> - Excel 97-2003</li>
              <li>✅ <strong>.csv</strong> - Comma Separated Values</li>
            </ul>
            <p className="mt-2 text-xs text-blue-700 italic">
              💡 Tip: Download the template button generates a ready-to-use .xlsx file
            </p>
          </div>
          <div className="p-3 bg-white rounded border">
            <p className="font-semibold text-foreground mb-2">Required Columns (ONLY 4):</p>
            <ul className="space-y-1 ml-4">
              <li>• <strong>SR NO</strong> - Sequential number (1, 2, 3...)</li>
              <li>• <strong>Employee ID</strong> - Company's employee identifier</li>
              <li>• <strong>NAME</strong> - Full name of employee</li>
              <li>• <strong>DEPT</strong> - Department name</li>
            </ul>
          </div>
          <div className="p-3 bg-white rounded border">
            <p className="font-semibold text-foreground mb-2">System Auto-Processing:</p>
            <ul className="space-y-1 ml-4">
              <li>• System validates all 4 columns are present</li>
              <li>• Converts SR NO to Unique Serial Number: <strong>First 2 letters of "{poData.companyName}" ({poData.companyName ? poData.companyName.substring(0, 2).toUpperCase() : "XX"}) + 3-digit padded number</strong></li>
              <li>• Example: SR NO 1 → <strong>{poData.companyName ? poData.companyName.substring(0, 2).toUpperCase() : "XX"}001</strong>, SR NO 25 → <strong>{poData.companyName ? poData.companyName.substring(0, 2).toUpperCase() : "XX"}025</strong></li>
              <li>• Adds 9 empty SHIRT measurement fields automatically</li>
              <li>• Adds 7 empty PANT measurement fields automatically</li>
              <li>• Sets all employees to "Not Measured" status</li>
              <li>• Total employees must match PO quantity ({poData.totalQuantity})</li>
            </ul>
          </div>
          <div className="p-3 bg-green-50 rounded border border-green-200">
            <p className="font-semibold text-green-900 mb-2">✓ What You Upload:</p>
            <p className="text-green-800">4 columns: SR NO, Employee ID, NAME, DEPT</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded border border-indigo-200">
            <p className="font-semibold text-indigo-900 mb-2">✓ What System Creates:</p>
            <p className="text-indigo-800">Master Sheet with Unique Serial Numbers + Empty SHIRT (9 fields) + Empty PANT (7 fields) + REMARKS (to be filled during measurement)</p>
          </div>
        </div>
      </Card>
    </div>
  );
}