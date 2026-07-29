import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { useState } from "react";
import {
  User,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  IdCard,
  CreditCard,
  FileText,
  Upload,
  Download,
  Trash2,
  Eye,
  Plus,
  X,
  CheckCircle,
  Clock,
  ArrowLeft,
  Edit,
  DollarSign,
  TrendingUp,
  Award,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { PageHeader } from "@/app/components/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

interface EmployeeDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  uploadedBy: string;
}

interface SalaryInfo {
  basicSalary: number;
  allowances: {
    hra: number;
    transport: number;
    medical: number;
    other: number;
  };
  deductions: {
    pf: number;
    tax: number;
    insurance: number;
  };
  netSalary: number;
  effectiveDate: string;
}

interface HistoryEvent {
  id: string;
  type: "joined" | "promotion" | "salary-change" | "department-change" | "achievement" | "other";
  title: string;
  description: string;
  date: string;
  performedBy?: string;
}

interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  joiningDate: string;
  department: string;
  designation: string;
  reportingTo: string;
  employmentType: string;
  status: "active" | "on-leave" | "inactive";
  profilePhoto?: string;
  documents: EmployeeDocument[];
  salaryInfo: SalaryInfo;
  history: HistoryEvent[];
}

interface HREmployeeProfileProps {
  employee: Employee;
  onBack: () => void;
  onUpdate?: (employee: Employee) => void;
}

export function HREmployeeProfile({ employee, onBack, onUpdate }: HREmployeeProfileProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [newDocument, setNewDocument] = useState({ name: "", type: "", file: null as File | null });

  // Calculate total compensation
  const totalAllowances = Object.values(employee.salaryInfo.allowances).reduce((a, b) => a + b, 0);
  const totalDeductions = Object.values(employee.salaryInfo.deductions).reduce((a, b) => a + b, 0);
  const grossSalary = employee.salaryInfo.basicSalary + totalAllowances;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "on-leave":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            On Leave
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        );
      default:
        return null;
    }
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case "joined":
        return <UserCheck className="h-5 w-5 text-blue-600" />;
      case "promotion":
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case "salary-change":
        return <DollarSign className="h-5 w-5 text-indigo-600" />;
      case "department-change":
        return <Building2 className="h-5 w-5 text-purple-600" />;
      case "achievement":
        return <Award className="h-5 w-5 text-yellow-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleDocumentUpload = () => {
    if (newDocument.name && newDocument.type && newDocument.file) {
      const doc: EmployeeDocument = {
        id: Date.now().toString(),
        name: newDocument.name,
        type: newDocument.type,
        uploadDate: new Date().toLocaleDateString(),
        size: (newDocument.file.size / 1024).toFixed(2) + " KB",
        uploadedBy: "Current User",
      };
      
      const updatedEmployee = {
        ...employee,
        documents: [...employee.documents, doc],
      };
      
      onUpdate?.(updatedEmployee);
      setNewDocument({ name: "", type: "", file: null });
      setShowDocumentUpload(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employees
        </Button>
      </div>

      {/* Profile Header */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 text-4xl font-bold overflow-hidden border-4 border-white shadow-lg">
              {employee.profilePhoto ? (
                <img src={employee.profilePhoto} alt={employee.fullName} className="w-full h-full object-cover" />
              ) : (
                employee.fullName.charAt(0).toUpperCase()
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{employee.fullName}</h1>
                <p className="text-lg text-muted-foreground mt-1">{employee.designation}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {getStatusBadge(employee.status)}
                  <Badge variant="outline" className="bg-white">
                    <IdCard className="h-3 w-3 mr-1" />
                    {employee.employeeId}
                  </Badge>
                  <Badge variant="outline" className="bg-white">
                    <Building2 className="h-3 w-3 mr-1" />
                    {employee.department}
                  </Badge>
                </div>
              </div>

              <Button onClick={() => setIsEditing(!isEditing)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span className="text-muted-foreground">Joined: {employee.joiningDate}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">
            <User className="h-4 w-4 mr-2" />
            Personal Details
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="salary">
            <CreditCard className="h-4 w-4 mr-2" />
            Salary Info
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Personal Details Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Personal Information
            </h3>
            <Separator className="mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={employee.fullName} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label>Employee ID</Label>
                <Input value={employee.employeeId} disabled />
              </div>
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input value={employee.dateOfBirth} type="date" disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={employee.gender} disabled={!isEditing}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-600" />
              Address Information
            </h3>
            <Separator className="mb-6" />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Address</Label>
                <Textarea value={employee.address} disabled={!isEditing} rows={2} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={employee.city} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={employee.state} disabled={!isEditing} />
                </div>
                <div className="space-y-2">
                  <Label>Pincode</Label>
                  <Input value={employee.pincode} disabled={!isEditing} />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-indigo-600" />
              Employment Information
            </h3>
            <Separator className="mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value={employee.department} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input value={employee.designation} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label>Reporting To</Label>
                <Input value={employee.reportingTo} disabled={!isEditing} />
              </div>
              <div className="space-y-2">
                <Label>Employment Type</Label>
                <Select value={employee.employmentType} disabled={!isEditing}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="intern">Intern</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Joining Date</Label>
                <Input value={employee.joiningDate} type="date" disabled />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={employee.status} disabled={!isEditing}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-6">
                <Button>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Employee Documents ({employee.documents.length})
              </h3>
              <Button onClick={() => setShowDocumentUpload(!showDocumentUpload)}>
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </div>

            {showDocumentUpload && (
              <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
                <h4 className="font-semibold mb-4">Upload New Document</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Document Name</Label>
                    <Input
                      placeholder="e.g., Aadhar Card"
                      value={newDocument.name}
                      onChange={(e) => setNewDocument({ ...newDocument, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Document Type</Label>
                    <Select
                      value={newDocument.type}
                      onValueChange={(value) => setNewDocument({ ...newDocument, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="identity">Identity Proof</SelectItem>
                        <SelectItem value="address">Address Proof</SelectItem>
                        <SelectItem value="education">Educational Certificate</SelectItem>
                        <SelectItem value="experience">Experience Letter</SelectItem>
                        <SelectItem value="contract">Employment Contract</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Choose File</Label>
                    <Input
                      type="file"
                      onChange={(e) =>
                        setNewDocument({ ...newDocument, file: e.target.files?.[0] || null })
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleDocumentUpload} size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDocumentUpload(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            )}

            {employee.documents.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-muted-foreground">No documents uploaded yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => setShowDocumentUpload(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Upload First Document
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {employee.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{doc.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {doc.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{doc.size}</span>
                          <span className="text-xs text-muted-foreground">
                            Uploaded: {doc.uploadDate}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            By: {doc.uploadedBy}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Document Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <IdCard className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Identity Proofs</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {employee.documents.filter((d) => d.type === "identity").length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Certificates</p>
                  <p className="text-2xl font-bold text-green-900">
                    {employee.documents.filter((d) => d.type === "education").length}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contracts</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {employee.documents.filter((d) => d.type === "contract").length}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Salary Info Tab */}
        <TabsContent value="salary" className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>Confidential Information:</strong> Salary details are confidential and should be handled with care.
            </AlertDescription>
          </Alert>

          {/* Salary Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Basic Salary</p>
                <DollarSign className="h-5 w-5 text-indigo-600" />
              </div>
              <p className="text-2xl font-bold text-indigo-900">
                ₹{employee.salaryInfo.basicSalary.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Allowances</p>
                <Plus className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-900">
                ₹{totalAllowances.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Deductions</p>
                <X className="h-5 w-5 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-900">
                ₹{totalDeductions.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Net Salary</p>
                <CreditCard className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-900">
                ₹{employee.salaryInfo.netSalary.toLocaleString()}
              </p>
            </Card>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Earnings */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-700">
                <Plus className="h-5 w-5" />
                Earnings Breakdown
              </h3>
              <Separator className="mb-4" />
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Basic Salary</span>
                  <span className="font-semibold">
                    ₹{employee.salaryInfo.basicSalary.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">HRA (House Rent Allowance)</span>
                  <span className="font-semibold">
                    ₹{employee.salaryInfo.allowances.hra.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Transport Allowance</span>
                  <span className="font-semibold">
                    ₹{employee.salaryInfo.allowances.transport.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Medical Allowance</span>
                  <span className="font-semibold">
                    ₹{employee.salaryInfo.allowances.medical.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Other Allowances</span>
                  <span className="font-semibold">
                    ₹{employee.salaryInfo.allowances.other.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg">
                  <span className="font-bold text-green-800">Gross Salary</span>
                  <span className="font-bold text-green-800 text-lg">
                    ₹{grossSalary.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>

            {/* Deductions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-700">
                <X className="h-5 w-5" />
                Deductions Breakdown
              </h3>
              <Separator className="mb-4" />
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Provident Fund (PF)</span>
                  <span className="font-semibold text-red-600">
                    -₹{employee.salaryInfo.deductions.pf.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Income Tax (TDS)</span>
                  <span className="font-semibold text-red-600">
                    -₹{employee.salaryInfo.deductions.tax.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm">Insurance</span>
                  <span className="font-semibold text-red-600">
                    -₹{employee.salaryInfo.deductions.insurance.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg">
                  <span className="font-bold text-red-800">Total Deductions</span>
                  <span className="font-bold text-red-800 text-lg">
                    -₹{totalDeductions.toLocaleString()}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center p-3 bg-indigo-100 rounded-lg mt-4">
                  <span className="font-bold text-indigo-800">Net Salary (Take Home)</span>
                  <span className="font-bold text-indigo-800 text-xl">
                    ₹{employee.salaryInfo.netSalary.toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Effective Date */}
          <Card className="p-4 bg-gray-50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Effective from: <strong>{employee.salaryInfo.effectiveDate}</strong></span>
            </div>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              Employment Timeline
            </h3>

            {employee.history.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-muted-foreground">No history events recorded yet</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />

                {/* Timeline Events */}
                <div className="space-y-6">
                  {employee.history.map((event, index) => (
                    <div key={event.id} className="relative pl-16">
                      {/* Timeline Icon */}
                      <div className="absolute left-4 w-8 h-8 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center">
                        {getHistoryIcon(event.type)}
                      </div>

                      {/* Event Card */}
                      <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-lg">{event.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {event.description}
                            </p>
                          </div>
                          <Badge variant="outline" className="shrink-0">
                            {event.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {event.date}
                          </div>
                          {event.performedBy && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {event.performedBy}
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}