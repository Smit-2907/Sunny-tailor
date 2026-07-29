import { useState, useEffect } from "react";
import * as api from "@/app/api/supabase-api";
import {
  DollarSign,
  Users,
  Calendar,
  Send,
  Eye,
  Download,
  Filter,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  CreditCard,
  FileText,
  Plus,
  Edit,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { PageHeader } from "@/app/components/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { Separator } from "@/app/components/ui/separator";
import { Alert, AlertDescription } from "@/app/components/ui/alert";

interface EmployeeSalary {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
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
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  paymentStatus: "scheduled" | "processing" | "paid" | "on-hold";
  paymentDate?: string;
  paymentMethod?: string;
  bankAccount?: string;
}

interface SalarySchedule {
  id: string;
  month: string;
  year: number;
  scheduledDate: string;
  totalEmployees: number;
  totalAmount: number;
  status: "draft" | "scheduled" | "processing" | "completed" | "cancelled";
  processedCount: number;
  createdBy: string;
  createdAt: string;
}

// Data will be loaded from localStorage

export function SalaryManagement() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState("February");
  const [selectedYear, setSelectedYear] = useState("2024");
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [employeeSalaries, setEmployeeSalaries] = useState<EmployeeSalary[]>([]);
  const [salarySchedules, setSalarySchedules] = useState<SalarySchedule[]>([]);

  // Load data — Supabase first, localStorage fallback
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const salaries = await api.fetchSalaries();
      if (salaries.length) setEmployeeSalaries(salaries);
      else {
        const stored = localStorage.getItem("erp_employee_salaries");
        if (stored) setEmployeeSalaries(JSON.parse(stored));
      }
    } catch {
      const stored = localStorage.getItem("erp_employee_salaries");
      if (stored) setEmployeeSalaries(JSON.parse(stored));
    }

    // Salary schedules (localStorage only for now)
    try {
      const stored = localStorage.getItem("erp_salary_schedules");
      if (stored) setSalarySchedules(JSON.parse(stored));
    } catch { /* ignore */ }
  };

  const saveSalaries = (salaries: EmployeeSalary[]) => {
    localStorage.setItem("erp_employee_salaries", JSON.stringify(salaries));
    setEmployeeSalaries(salaries);
    api.bulkSaveSalaries(salaries).catch(() => {});
  };

  const saveSchedules = (schedules: SalarySchedule[]) => {
    localStorage.setItem("erp_salary_schedules", JSON.stringify(schedules));
    setSalarySchedules(schedules);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: any }> = {
      scheduled: {
        label: "Scheduled",
        className: "bg-blue-100 text-blue-800 border-blue-200",
        icon: Clock,
      },
      processing: {
        label: "Processing",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: Clock,
      },
      paid: {
        label: "Paid",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      "on-hold": {
        label: "On Hold",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: AlertCircle,
      },
      draft: {
        label: "Draft",
        className: "bg-gray-100 text-gray-800 border-gray-200",
        icon: FileText,
      },
      completed: {
        label: "Completed",
        className: "bg-green-100 text-green-800 border-green-200",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Cancelled",
        className: "bg-red-100 text-red-800 border-red-200",
        icon: AlertCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.draft;
    const Icon = config.icon;
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // Filter employees
  const filteredEmployees = employeeSalaries.filter((emp) => {
    const matchesSearch =
      searchQuery === "" ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter;
    const matchesStatus = statusFilter === "all" || emp.paymentStatus === statusFilter;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Calculate statistics
  const totalEmployees = employeeSalaries.length;
  const totalPayroll = employeeSalaries.reduce((sum, emp) => sum + emp.netSalary, 0);
  const scheduledPayments = employeeSalaries.filter(
    (emp) => emp.paymentStatus === "scheduled"
  ).length;
  const paidPayments = employeeSalaries.filter((emp) => emp.paymentStatus === "paid").length;
  const onHoldPayments = employeeSalaries.filter(
    (emp) => emp.paymentStatus === "on-hold"
  ).length;

  const uniqueDepartments = Array.from(new Set(employeeSalaries.map((e) => e.department)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Salary Management"
        description="Schedule and process employee salaries"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Employees</p>
            <Users className="h-5 w-5 text-indigo-600" />
          </div>
          <p className="text-2xl font-bold text-indigo-900">{totalEmployees}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Payroll</p>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{formatCurrency(totalPayroll)}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Scheduled</p>
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">{scheduledPayments}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-teal-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Paid</p>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{paidPayments}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">On Hold</p>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-900">{onHoldPayments}</p>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="schedule">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Salary
            </TabsTrigger>
            <TabsTrigger value="employees">
              <Users className="h-4 w-4 mr-2" />
              Employee Salaries
            </TabsTrigger>
            <TabsTrigger value="history">
              <FileText className="h-4 w-4 mr-2" />
              Salary History
            </TabsTrigger>
          </TabsList>

          {/* Schedule Salary Tab */}
          <TabsContent value="schedule" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Salary Schedule</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Create and manage monthly salary schedules
                </p>
              </div>
              <Button onClick={() => setShowScheduleForm(!showScheduleForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Schedule
              </Button>
            </div>

            {showScheduleForm && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h4 className="font-semibold mb-4">Create New Salary Schedule</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label>Month</Label>
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="January">January</SelectItem>
                        <SelectItem value="February">February</SelectItem>
                        <SelectItem value="March">March</SelectItem>
                        <SelectItem value="April">April</SelectItem>
                        <SelectItem value="May">May</SelectItem>
                        <SelectItem value="June">June</SelectItem>
                        <SelectItem value="July">July</SelectItem>
                        <SelectItem value="August">August</SelectItem>
                        <SelectItem value="September">September</SelectItem>
                        <SelectItem value="October">October</SelectItem>
                        <SelectItem value="November">November</SelectItem>
                        <SelectItem value="December">December</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Date</Label>
                    <Input type="date" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Salary
                  </Button>
                  <Button variant="outline" onClick={() => setShowScheduleForm(false)}>
                    Cancel
                  </Button>
                </div>
              </Card>
            )}

            {/* Salary Schedules List */}
            <div className="space-y-3">
              {salarySchedules.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground border-2 border-dashed border-gray-300 rounded-lg">
                  <Calendar className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-lg font-semibold mb-2">No Salary Schedules</h3>
                  <p className="text-sm mb-4">Create a schedule to manage employee salary payments</p>
                  <Button onClick={() => setShowScheduleForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Schedule
                  </Button>
                </div>
              ) : null}
              {salarySchedules.map((schedule) => (
                <Card key={schedule.id} className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">
                          {schedule.month} {schedule.year}
                        </h4>
                        {getStatusBadge(schedule.status)}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Scheduled Date</p>
                          <p className="font-semibold">{schedule.scheduledDate}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Employees</p>
                          <p className="font-semibold">{schedule.totalEmployees}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Amount</p>
                          <p className="font-semibold">{formatCurrency(schedule.totalAmount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Progress</p>
                          <p className="font-semibold">
                            {schedule.processedCount}/{schedule.totalEmployees}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {schedule.status === "scheduled" && (
                        <Button size="sm">
                          <Send className="h-4 w-4 mr-2" />
                          Process
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Employee Salaries Tab */}
          <TabsContent value="employees" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <h3 className="text-lg font-semibold">Employee Salary Details</h3>

              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none lg:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {uniqueDepartments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Employee Salary Table */}
            <div className="overflow-x-auto border rounded-lg">
              {filteredEmployees.length === 0 ? (
                <div className="p-12 text-center text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <h3 className="text-lg font-semibold mb-2">No Employee Salary Records</h3>
                  <p className="text-sm">
                    {employeeSalaries.length === 0
                      ? "Set up employee salary records to manage payroll"
                      : "No employees match the current filter criteria"}
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold">Employee ID</th>
                      <th className="text-left p-3 text-xs font-semibold">Name</th>
                      <th className="text-left p-3 text-xs font-semibold">Department</th>
                      <th className="text-left p-3 text-xs font-semibold">Gross Salary</th>
                      <th className="text-left p-3 text-xs font-semibold">Deductions</th>
                      <th className="text-left p-3 text-xs font-semibold">Net Salary</th>
                      <th className="text-left p-3 text-xs font-semibold">Status</th>
                      <th className="text-left p-3 text-xs font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp, index) => (
                      <tr
                        key={emp.id}
                        className={`border-t hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="p-3">
                          <span className="font-mono text-xs font-semibold text-indigo-600">
                            {emp.employeeId}
                          </span>
                        </td>
                        <td className="p-3 text-sm font-medium">{emp.employeeName}</td>
                        <td className="p-3 text-sm text-muted-foreground">{emp.department}</td>
                        <td className="p-3 text-sm font-semibold">
                          {formatCurrency(emp.grossSalary)}
                        </td>
                        <td className="p-3 text-sm text-red-600">
                          {formatCurrency(emp.totalDeductions)}
                        </td>
                        <td className="p-3 text-sm font-bold text-green-700">
                          {formatCurrency(emp.netSalary)}
                        </td>
                        <td className="p-3">{getStatusBadge(emp.paymentStatus)}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>

          {/* Salary History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Salary payment history for the last 6 months
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              {salarySchedules.map((schedule) => (
                <Card key={schedule.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">
                        {schedule.month} {schedule.year}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        Processed on {schedule.scheduledDate}
                      </p>
                    </div>
                    {getStatusBadge(schedule.status)}
                  </div>
                  <Separator className="mb-3" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Employees Paid</p>
                      <p className="font-semibold text-lg">{schedule.processedCount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Total Amount</p>
                      <p className="font-semibold text-lg">
                        {formatCurrency(schedule.totalAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Created By</p>
                      <p className="font-semibold">{schedule.createdBy}</p>
                    </div>
                    <div className="flex items-end">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}