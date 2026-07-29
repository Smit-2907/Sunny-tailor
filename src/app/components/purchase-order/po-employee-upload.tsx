import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Download,
  ArrowLeft,
  Users,
  FileText,
  Eye,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Separator } from "@/app/components/ui/separator";
import { Badge } from "@/app/components/ui/badge";
import { PurchaseOrder } from "./purchase-order-types";
import { EmployeeData } from "../measurement-system/employee-excel-upload";

interface POEmployeeUploadProps {
  purchaseOrder: PurchaseOrder;
  onBack: () => void;
  onEmployeesUploaded: (employees: EmployeeData[]) => void;
}

export function POEmployeeUpload({
  purchaseOrder,
  onBack,
  onEmployeesUploaded,
}: POEmployeeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "parsing" | "preview" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [parsedEmployees, setParsedEmployees] = useState<EmployeeData[]>([]);

  const defaultPrefix = purchaseOrder.clientCompanyName
    ? purchaseOrder.clientCompanyName.replace(/\s+/g, "").substring(0, 3).toUpperCase()
    : "EMP";
  const [serialPrefix, setSerialPrefix] = useState(defaultPrefix);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStatus("idle");
      setErrorMessage("");
      setParsedEmployees([]);
    }
  };

  const parseFile = () => {
    if (!file) return;

    setStatus("parsing");
    setErrorMessage("");

    const reader = new FileReader();
    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith(".csv");

    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        let workbook: XLSX.WorkBook;

        if (isCSV) {
          workbook = XLSX.read(data, { type: "string", raw: false, codepage: 65001 });
        } else {
          workbook = XLSX.read(data, { type: "binary" });
        }

        console.log("📚 Workbook sheets:", workbook.SheetNames);

        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          setStatus("error");
          setErrorMessage("File has no sheets. It may be empty or corrupted.");
          return;
        }

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        if (!worksheet) {
          setStatus("error");
          setErrorMessage("Could not read the first sheet.");
          return;
        }

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
          raw: false,
          blankrows: false,
        }) as any[][];

        console.log("📊 Rows found:", jsonData.length);
        if (jsonData.length > 0) console.log("🔤 Headers:", jsonData[0]);

        if (!jsonData || jsonData.length < 2) {
          setStatus("error");
          setErrorMessage(
            "File has no data rows. Make sure row 1 has headers and row 2+ has employee data."
          );
          return;
        }

        // Normalize headers
        const headers = jsonData[0].map((h: any) => String(h).trim().toUpperCase());

        // Flexible column finder
        const findCol = (name: string): number => {
          const normalized = name.replace(/\s+/g, "").toUpperCase();
          return headers.findIndex((h) => {
            const nh = h.replace(/\s+/g, "").toUpperCase();
            return nh === normalized || nh.includes(normalized) || normalized.includes(nh);
          });
        };

        const srNoIdx = findCol("SRNO") !== -1 ? findCol("SRNO") : findCol("SR NO");
        const empIdIdx = findCol("EMPLOYEEID") !== -1 ? findCol("EMPLOYEEID") : findCol("EMPLOYEE ID");
        const nameIdx = findCol("NAME");
        const deptIdx = findCol("DEPT") !== -1 ? findCol("DEPT") : findCol("DEPARTMENT");

        const missing: string[] = [];
        if (srNoIdx === -1) missing.push("SR NO");
        if (empIdIdx === -1) missing.push("Employee ID");
        if (nameIdx === -1) missing.push("NAME");
        if (deptIdx === -1) missing.push("DEPT");

        if (missing.length > 0) {
          setStatus("error");
          setErrorMessage(
            `Missing columns: ${missing.join(", ")}\n\nYour columns: ${headers.join(", ")}\n\nRequired: SR NO, Employee ID, NAME, DEPT\n\nPlease download the sample template and use the correct format.`
          );
          return;
        }

        // Parse rows
        const dataRows = jsonData.slice(1);
        const employees: EmployeeData[] = dataRows
          .filter((row) => row && row.length > 0 && (row[srNoIdx] || row[nameIdx]))
          .map((row, index) => {
            const srNo = parseInt(String(row[srNoIdx] || index + 1)) || index + 1;
            const employeeId = String(row[empIdIdx] || "").trim();
            const employeeName = String(row[nameIdx] || "").trim();
            const department = String(row[deptIdx] || "").trim();
            const prefix = serialPrefix.trim().toUpperCase() || defaultPrefix;
            const uniqueSerialNumber = `${prefix}${String(srNo).padStart(3, "0")}`;

            return {
              srNo,
              employeeId,
              employeeName,
              department,
              branch: department,
              uniqueSerialNumber,
              poId: purchaseOrder.id,
              poNumber: purchaseOrder.poNumber,
              measurementStatus: "not-measured" as const,
              measurements: {
                shirt: { length: "", shoulder: "", chest: "", waist: "", sleeve: "", neck: "", front: "", collar: "", cuff: "" },
                pant: { length: "", waist: "", hip: "", thigh: "", inseam: "", round: "", bottom: "" },
              },
              shirtSizingMode: "measurement" as const,
              pantSizingMode: "measurement" as const,
            };
          });

        console.log("✅ Parsed employees:", employees.length);

        if (employees.length === 0) {
          setStatus("error");
          setErrorMessage("No valid employee rows found. Check that your data starts from row 2.");
          return;
        }

        setParsedEmployees(employees);
        setStatus("preview");
      } catch (error) {
        console.error("❌ Parse error:", error);
        setStatus("error");
        setErrorMessage(
          `Failed to parse file: ${error instanceof Error ? error.message : "Unknown error"}\n\nMake sure the file is a valid .xlsx or .csv file.`
        );
      }
    };

    reader.onerror = () => {
      setStatus("error");
      setErrorMessage("Failed to read file. Please try again.");
    };

    if (isCSV) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  const handleConfirm = () => {
    onEmployeesUploaded(parsedEmployees);
  };

  const downloadSampleXLSX = () => {
    const headers = ["SR NO", "Employee ID", "NAME", "DEPT"];
    const rows = [
      [1, "EMP001", "Rajesh Kumar", "Production"],
      [2, "EMP002", "Priya Sharma", "Quality Control"],
      [3, "EMP003", "Amit Singh", "Cutting"],
      [4, "EMP004", "Sneha Patel", "Stitching"],
      [5, "EMP005", "Vikram Rao", "Finishing"],
      [6, "EMP006", "Anita Desai", "Packing"],
      [7, "EMP007", "Sanjay Mehta", "Production"],
      [8, "EMP008", "Kavita Joshi", "Quality Control"],
      [9, "EMP009", "Rahul Gupta", "Cutting"],
      [10, "EMP010", "Pooja Reddy", "Stitching"],
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws["!cols"] = [{ wch: 8 }, { wch: 14 }, { wch: 22 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws, "Employees");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Sample_Employees_10_${purchaseOrder.poNumber || "Template"}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadSampleCSV = () => {
    const csv = [
      "SR NO,Employee ID,NAME,DEPT",
      '1,EMP001,Rajesh Kumar,Production',
      '2,EMP002,Priya Sharma,Quality Control',
      '3,EMP003,Amit Singh,Cutting',
      '4,EMP004,Sneha Patel,Stitching',
      '5,EMP005,Vikram Rao,Finishing',
      '6,EMP006,Anita Desai,Packing',
      '7,EMP007,Sanjay Mehta,Production',
      '8,EMP008,Kavita Joshi,Quality Control',
      '9,EMP009,Rahul Gupta,Cutting',
      '10,EMP010,Pooja Reddy,Stitching',
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Sample_Employees_10_${purchaseOrder.poNumber || "Template"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Upload Employee List</h1>
          <p className="text-muted-foreground mt-1">
            Upload Excel/CSV file for <strong>{purchaseOrder.poNumber}</strong>
          </p>
        </div>
      </div>

      {/* PO Summary */}
      <Card className="p-5 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-lg shadow-sm">
            <FileText className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-2">{purchaseOrder.poNumber}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Client</p>
                <p className="font-semibold">{purchaseOrder.clientCompanyName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Quantity</p>
                <p className="font-semibold">{purchaseOrder.totalQuantity} employees</p>
              </div>
              <div>
                <p className="text-muted-foreground">Uniform</p>
                <p className="font-semibold capitalize">{purchaseOrder.uniformType.replace("-", " ")}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Serial Prefix</p>
                <p className="font-semibold text-indigo-600">{(serialPrefix.trim().toUpperCase() || defaultPrefix)}XXX</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Error Alert */}
      {status === "error" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-900">Error</AlertTitle>
          <AlertDescription className="text-red-700 whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Step 1: Download Sample */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-sm">1</span>
          </div>
          <h3 className="font-semibold text-lg">Download Sample File (10 employees)</h3>
        </div>
        <Separator className="mb-4" />
        <p className="text-sm text-muted-foreground mb-4">
          Download a sample file with 10 test employees. Fill it with your data or upload as-is to test the flow.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={downloadSampleXLSX} variant="default" className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Download Sample (.xlsx)
          </Button>
          <Button onClick={downloadSampleCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Sample (.csv)
          </Button>
        </div>

        {/* Preview of what's inside */}
        <div className="mt-4 overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2.5 font-semibold text-xs text-gray-600">SR NO</th>
                <th className="text-left p-2.5 font-semibold text-xs text-gray-600">Employee ID</th>
                <th className="text-left p-2.5 font-semibold text-xs text-gray-600">NAME</th>
                <th className="text-left p-2.5 font-semibold text-xs text-gray-600">DEPT</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[
                [1, "EMP001", "Rajesh Kumar", "Production"],
                [2, "EMP002", "Priya Sharma", "Quality Control"],
                [3, "EMP003", "Amit Singh", "Cutting"],
              ].map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2.5 font-mono text-xs">{row[0]}</td>
                  <td className="p-2.5 font-mono text-xs">{row[1]}</td>
                  <td className="p-2.5">{row[2]}</td>
                  <td className="p-2.5">{row[3]}</td>
                </tr>
              ))}
              <tr className="border-t text-gray-400">
                <td className="p-2.5 text-center" colSpan={4}>... 7 more rows in the file</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Step 2: Upload File */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-sm">2</span>
          </div>
          <h3 className="font-semibold text-lg">Upload Employee File</h3>
        </div>
        <Separator className="mb-4" />

        <div className="space-y-4">
          {/* Serial Prefix Input */}
          <div className="space-y-2">
            <Label className="font-semibold">
              Unique Serial Prefix *
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                Serials will be generated as: {(serialPrefix.trim().toUpperCase() || defaultPrefix)}001, {(serialPrefix.trim().toUpperCase() || defaultPrefix)}002, ...
              </span>
            </Label>
            <div className="flex items-center gap-3">
              <Input
                value={serialPrefix}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                  setSerialPrefix(val);
                  // Re-apply prefix to already-parsed employees
                  if (parsedEmployees.length > 0) {
                    const prefix = val.trim() || defaultPrefix;
                    setParsedEmployees(prev => prev.map(emp => ({
                      ...emp,
                      uniqueSerialNumber: `${prefix}${String(emp.srNo).padStart(3, "0")}`,
                    })));
                  }
                }}
                placeholder={defaultPrefix}
                maxLength={10}
                className="w-40 font-mono font-semibold uppercase tracking-widest"
              />
              <span className="text-sm text-muted-foreground bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-md font-mono font-semibold text-indigo-700">
                {(serialPrefix.trim().toUpperCase() || defaultPrefix)}001 → {(serialPrefix.trim().toUpperCase() || defaultPrefix)}00N
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select File (.xlsx, .xls, or .csv)</Label>
            <Input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileSelect}
              disabled={status === "parsing"}
            />
          </div>

          {file && status === "idle" && (
            <Alert className="border-blue-200 bg-blue-50">
              <FileSpreadsheet className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900">File Selected</AlertTitle>
              <AlertDescription className="text-blue-700">
                {file.name} ({(file.size / 1024).toFixed(1)} KB) - Click "Parse & Preview" to process
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              onClick={parseFile}
              disabled={!file || status === "parsing" || status === "preview"}
              className="min-w-[180px]"
            >
              {status === "parsing" ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Parsing...
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Parse & Preview
                </>
              )}
            </Button>
            {status === "error" && (
              <Button
                variant="outline"
                onClick={() => {
                  setStatus("idle");
                  setErrorMessage("");
                }}
              >
                Try Again
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Step 3: Preview & Confirm */}
      {status === "preview" && parsedEmployees.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">
                Parsed Successfully - {parsedEmployees.length} Employees
              </h3>
              <p className="text-sm text-muted-foreground">
                Review the data below and confirm to create the master sheet
              </p>
            </div>
          </div>
          <Separator className="mb-4" />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-indigo-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-indigo-600">{parsedEmployees.length}</p>
              <p className="text-xs text-muted-foreground">Total Employees</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{(serialPrefix.trim().toUpperCase() || defaultPrefix)}XXX</p>
              <p className="text-xs text-muted-foreground">Serial Format</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">16</p>
              <p className="text-xs text-muted-foreground">Measurement Fields</p>
            </div>
          </div>

          {/* Employee Table */}
          <div className="overflow-x-auto border rounded-lg max-h-[400px] overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left p-3 font-semibold text-xs text-gray-600">SR NO</th>
                  <th className="text-left p-3 font-semibold text-xs text-gray-600">Employee ID</th>
                  <th className="text-left p-3 font-semibold text-xs text-gray-600">Name</th>
                  <th className="text-left p-3 font-semibold text-xs text-gray-600">Department</th>
                  <th className="text-left p-3 font-semibold text-xs text-gray-600">Unique Serial</th>
                  <th className="text-left p-3 font-semibold text-xs text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {parsedEmployees.map((emp) => (
                  <tr key={emp.uniqueSerialNumber} className="border-t hover:bg-gray-50">
                    <td className="p-3">{emp.srNo}</td>
                    <td className="p-3 font-mono text-xs">{emp.employeeId}</td>
                    <td className="p-3 font-medium">{emp.employeeName}</td>
                    <td className="p-3">{emp.department}</td>
                    <td className="p-3">
                      <span className="font-mono font-semibold text-indigo-600">
                        {emp.uniqueSerialNumber}
                      </span>
                    </td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 text-xs">
                        Not Measured
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Confirm Button */}
          <div className="flex justify-between items-center pt-4 mt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setStatus("idle");
                setParsedEmployees([]);
                setFile(null);
              }}
            >
              Upload Different File
            </Button>
            <Button onClick={handleConfirm} size="lg" className="min-w-[280px] bg-indigo-600 hover:bg-indigo-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              Confirm & Create Master Sheet ({parsedEmployees.length} employees)
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
