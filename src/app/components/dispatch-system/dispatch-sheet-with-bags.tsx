import { useState } from "react";
import {
  Package,
  Save,
  Download,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Edit,
  X,
  ArrowLeft,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { PageHeader } from "@/app/components/page-header";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { mockEmployeeData } from "@/app/data/mock-employee-data";

interface DispatchEmployee {
  srNo: number;
  employeeId: string;
  employeeName: string;
  branch: string;
  department: string;
  designation: string;
  mobile: string;
  email: string;
  uniqueSerialNumber: string;
  shirtMeasured: boolean;
  pantMeasured: boolean;
  bagNumber: string;
  dispatchStatus: "ready" | "packed" | "not-ready";
  qualityCheck: "passed" | "pending" | "failed";
  productionStatus: "completed" | "in-progress" | "not-started";
  measuredBy?: string;
  measurementDate?: string;
}

interface POData {
  poNumber: string;
  companyName: string;
  companyPrefix: string;
  orderDate: string;
}

const mockPOData: POData = {
  poNumber: "PO-2026-001",
  companyName: "ABC Garments",
  companyPrefix: "ABC",
  orderDate: "2026-01-20",
};

const mockEmployees: DispatchEmployee[] = [
  {
    srNo: 1,
    employeeId: "EMP001",
    employeeName: "John Smith",
    branch: "New York - Main Branch",
    department: "Production",
    designation: "Tailor",
    mobile: "123-456-7890",
    email: "john.smith@example.com",
    uniqueSerialNumber: "ABC001",
    shirtMeasured: true,
    pantMeasured: true,
    bagNumber: "BAG-001",
    dispatchStatus: "packed",
    qualityCheck: "passed",
    productionStatus: "completed",
    measuredBy: "Alice Johnson",
    measurementDate: "2026-01-15",
  },
  {
    srNo: 2,
    employeeId: "EMP002",
    employeeName: "Sarah Johnson",
    branch: "New York - Main Branch",
    department: "Production",
    designation: "Tailor",
    mobile: "123-456-7890",
    email: "sarah.johnson@example.com",
    uniqueSerialNumber: "ABC002",
    shirtMeasured: true,
    pantMeasured: true,
    bagNumber: "BAG-001",
    dispatchStatus: "packed",
    qualityCheck: "passed",
    productionStatus: "completed",
    measuredBy: "Alice Johnson",
    measurementDate: "2026-01-15",
  },
  {
    srNo: 3,
    employeeId: "EMP003",
    employeeName: "Mike Wilson",
    branch: "New York - Downtown Branch",
    department: "Production",
    designation: "Tailor",
    mobile: "123-456-7890",
    email: "mike.wilson@example.com",
    uniqueSerialNumber: "ABC003",
    shirtMeasured: true,
    pantMeasured: true,
    bagNumber: "BAG-002",
    dispatchStatus: "packed",
    qualityCheck: "passed",
    productionStatus: "completed",
    measuredBy: "Alice Johnson",
    measurementDate: "2026-01-15",
  },
  {
    srNo: 4,
    employeeId: "EMP004",
    employeeName: "Emily Brown",
    branch: "Los Angeles - West Branch",
    department: "Production",
    designation: "Tailor",
    mobile: "123-456-7890",
    email: "emily.brown@example.com",
    uniqueSerialNumber: "ABC004",
    shirtMeasured: true,
    pantMeasured: false,
    bagNumber: "",
    dispatchStatus: "ready",
    qualityCheck: "pending",
    productionStatus: "in-progress",
    measuredBy: "Alice Johnson",
    measurementDate: "2026-01-15",
  },
  {
    srNo: 5,
    employeeId: "EMP005",
    employeeName: "David Lee",
    branch: "Chicago - Central Branch",
    department: "Production",
    designation: "Tailor",
    mobile: "123-456-7890",
    email: "david.lee@example.com",
    uniqueSerialNumber: "ABC005",
    shirtMeasured: true,
    pantMeasured: true,
    bagNumber: "BAG-003",
    dispatchStatus: "packed",
    qualityCheck: "passed",
    productionStatus: "completed",
    measuredBy: "Alice Johnson",
    measurementDate: "2026-01-15",
  },
  {
    srNo: 6,
    employeeId: "EMP006",
    employeeName: "Lisa Chen",
    branch: "Chicago - Central Branch",
    department: "Production",
    designation: "Tailor",
    mobile: "123-456-7890",
    email: "lisa.chen@example.com",
    uniqueSerialNumber: "ABC006",
    shirtMeasured: false,
    pantMeasured: false,
    bagNumber: "",
    dispatchStatus: "not-ready",
    qualityCheck: "failed",
    productionStatus: "not-started",
    measuredBy: "Alice Johnson",
    measurementDate: "2026-01-15",
  },
  {
    srNo: 7,
    employeeId: "EMP007",
    employeeName: "Robert Martinez",
    branch: "Los Angeles - West Branch",
    department: "Production",
    designation: "Tailor",
    mobile: "123-456-7890",
    email: "robert.martinez@example.com",
    uniqueSerialNumber: "ABC007",
    shirtMeasured: true,
    pantMeasured: true,
    bagNumber: "",
    dispatchStatus: "ready",
    qualityCheck: "pending",
    productionStatus: "in-progress",
    measuredBy: "Alice Johnson",
    measurementDate: "2026-01-15",
  },
  {
    srNo: 8,
    employeeId: "EMP008",
    employeeName: "Jennifer Davis",
    branch: "New York - Downtown Branch",
    department: "Production",
    designation: "Tailor",
    mobile: "123-456-7890",
    email: "jennifer.davis@example.com",
    uniqueSerialNumber: "ABC008",
    shirtMeasured: true,
    pantMeasured: true,
    bagNumber: "BAG-002",
    dispatchStatus: "packed",
    qualityCheck: "passed",
    productionStatus: "completed",
    measuredBy: "Alice Johnson",
    measurementDate: "2026-01-15",
  },
];

export function DispatchSheetWithBags({ 
  poNumber,
  companyName,
  onBack
}: { 
  poNumber: string;
  companyName: string;
  onBack: () => void;
}) {
  const [employees, setEmployees] = useState<DispatchEmployee[]>(mockEmployees);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBagNumber, setEditingBagNumber] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Get unique branches for filter
  const branches = Array.from(new Set(employees.map((e) => e.branch)));

  // Calculate statistics
  const totalEmployees = employees.length;
  const readyForDispatch = employees.filter(
    (e) => e.shirtMeasured && e.pantMeasured
  ).length;
  const notReady = employees.filter(
    (e) => !e.shirtMeasured || !e.pantMeasured
  ).length;
  const packed = employees.filter((e) => e.bagNumber !== "").length;
  const uniqueBags = new Set(
    employees.filter((e) => e.bagNumber).map((e) => e.bagNumber)
  ).size;

  // Filter employees - only show those with measurements
  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.uniqueSerialNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || employee.dispatchStatus === statusFilter;

    const matchesBranch =
      branchFilter === "all" || employee.branch === branchFilter;

    return matchesSearch && matchesStatus && matchesBranch;
  });

  const getStatusBadge = (employee: DispatchEmployee) => {
    if (!employee.shirtMeasured || !employee.pantMeasured) {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <X className="h-3 w-3 mr-1" />
          No Measurement
        </Badge>
      );
    }

    if (employee.bagNumber) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="h-3 w-3 mr-1" />
          Packed
        </Badge>
      );
    }

    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        <Package className="h-3 w-3 mr-1" />
        Ready to Pack
      </Badge>
    );
  };

  const handleEditBagNumber = (employee: DispatchEmployee) => {
    setEditingId(employee.uniqueSerialNumber);
    setEditingBagNumber(employee.bagNumber);
  };

  const handleSaveBagNumber = (uniqueSerialNumber: string) => {
    setEmployees(
      employees.map((emp) =>
        emp.uniqueSerialNumber === uniqueSerialNumber
          ? {
              ...emp,
              bagNumber: editingBagNumber,
              dispatchStatus:
                editingBagNumber !== ""
                  ? "packed"
                  : emp.shirtMeasured && emp.pantMeasured
                  ? "ready"
                  : "not-ready",
            }
          : emp
      )
    );
    setEditingId(null);
    setEditingBagNumber("");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingBagNumber("");
  };

  const handleExport = () => {
    alert("Exporting dispatch sheet with bag numbers...");
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dispatch Overview
        </Button>
      </div>

      <PageHeader
        title="Dispatch Sheet - Bag Number Assignment"
        description={`${poNumber} - ${companyName}`}
      />

      {/* Success Alert */}
      {saveSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-900">Saved!</AlertTitle>
          <AlertDescription className="text-green-700">
            Bag number updated successfully
          </AlertDescription>
        </Alert>
      )}

      {/* Info Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertTitle className="text-blue-900">Instructions</AlertTitle>
        <AlertDescription className="text-blue-700">
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              • Only employees with complete measurements can be dispatched
            </li>
            <li>
              • Employees without measurements (marked with red badge) will NOT be
              dispatched
            </li>
            <li>
              • Assign bag numbers to pack multiple employees' clothes together
            </li>
            <li>
              • Click the bag number column to edit and assign bags
            </li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Employees</p>
          <p className="text-2xl font-bold text-indigo-600">{totalEmployees}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Ready for Dispatch</p>
          <p className="text-2xl font-bold text-blue-600">{readyForDispatch}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Not Ready</p>
          <p className="text-2xl font-bold text-red-600">{notReady}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Packed</p>
          <p className="text-2xl font-bold text-green-600">{packed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Bags</p>
          <p className="text-2xl font-bold text-purple-600">{uniqueBags}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, employee ID, or serial number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="packed">Packed</SelectItem>
              <SelectItem value="ready">Ready to Pack</SelectItem>
              <SelectItem value="not-ready">Not Ready</SelectItem>
            </SelectContent>
          </Select>

          <Select value={branchFilter} onValueChange={setBranchFilter}>
            <SelectTrigger className="w-full md:w-[220px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Branches</SelectItem>
              {branches.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Employee Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Sr. No
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Serial Number
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Employee ID
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Employee Name
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Branch
                </th>
                <th className="text-center py-3 px-4 font-semibold text-sm">
                  Shirt
                </th>
                <th className="text-center py-3 px-4 font-semibold text-sm">
                  Pant
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Bag Number
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => {
                const isEditing = editingId === employee.uniqueSerialNumber;
                const canDispatch =
                  employee.shirtMeasured && employee.pantMeasured;

                return (
                  <tr
                    key={employee.uniqueSerialNumber}
                    className={`border-b hover:bg-muted/50 ${
                      !canDispatch ? "bg-red-50/30" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span className="font-medium">{employee.srNo}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-indigo-600">
                        {employee.uniqueSerialNumber}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{employee.employeeId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium">{employee.employeeName}</span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {employee.branch}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {employee.shirtMeasured ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {employee.pantMeasured ? (
                        <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-600 mx-auto" />
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingBagNumber}
                            onChange={(e) =>
                              setEditingBagNumber(e.target.value.toUpperCase())
                            }
                            placeholder="e.g., BAG-001"
                            className="w-32"
                            disabled={!canDispatch}
                          />
                          <Button
                            size="sm"
                            onClick={() =>
                              handleSaveBagNumber(employee.uniqueSerialNumber)
                            }
                            disabled={!canDispatch}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancelEdit}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {employee.bagNumber ? (
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200 font-mono">
                              {employee.bagNumber}
                            </Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {canDispatch ? "Not assigned" : "N/A"}
                            </span>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditBagNumber(employee)}
                            disabled={!canDispatch}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(employee)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No employees found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Summary Card */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
        <h3 className="font-semibold text-lg mb-4">Dispatch Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 text-sm text-muted-foreground">
              Bag Distribution
            </h4>
            <div className="space-y-2">
              {Array.from(
                new Set(employees.filter((e) => e.bagNumber).map((e) => e.bagNumber))
              ).map((bagNumber) => {
                const count = employees.filter(
                  (e) => e.bagNumber === bagNumber
                ).length;
                return (
                  <div
                    key={bagNumber}
                    className="flex justify-between items-center p-2 bg-white rounded"
                  >
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200 font-mono">
                      {bagNumber}
                    </Badge>
                    <span className="text-sm font-semibold">
                      {count} {count === 1 ? "item" : "items"}
                    </span>
                  </div>
                );
              })}
              {uniqueBags === 0 && (
                <p className="text-sm text-muted-foreground">
                  No bags assigned yet
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2 text-sm text-muted-foreground">
              Employees Without Measurements
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {employees
                .filter((e) => !e.shirtMeasured || !e.pantMeasured)
                .map((employee) => (
                  <div
                    key={employee.uniqueSerialNumber}
                    className="p-2 bg-red-50 rounded border border-red-200"
                  >
                    <p className="text-sm font-medium">{employee.employeeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {employee.uniqueSerialNumber} - Missing:{" "}
                      {!employee.shirtMeasured && "Shirt"}{" "}
                      {!employee.shirtMeasured && !employee.pantMeasured && "&"}{" "}
                      {!employee.pantMeasured && "Pant"}
                    </p>
                  </div>
                ))}
              {notReady === 0 && (
                <p className="text-sm text-green-600">
                  ✓ All employees have measurements
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}