import { useState } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Eye,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  Users,
  Calendar,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { PageHeader } from "@/app/components/page-header";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface EmployeeListItem {
  id: string;
  employeeId: string;
  fullName: string;
  department: string;
  designation: string;
  status: "active" | "on-leave" | "inactive";
  joiningDate: string;
}

interface HREmployeeListProps {
  employees: EmployeeListItem[];
  onSelectEmployee: (employeeId: string) => void;
}

export function HREmployeeList({ employees, onSelectEmployee }: HREmployeeListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Get unique departments
  const uniqueDepartments = Array.from(new Set(employees.map((e) => e.department)));

  // Filter employees
  const filteredEmployees = employees.filter((emp) => {
    // Status filter
    if (statusFilter !== "all" && emp.status !== statusFilter) {
      return false;
    }

    // Department filter
    if (departmentFilter !== "all" && emp.department !== departmentFilter) {
      return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        emp.employeeId.toLowerCase().includes(query) ||
        emp.fullName.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query) ||
        emp.designation.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Calculate statistics
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status === "active").length;
  const onLeave = employees.filter((e) => e.status === "on-leave").length;
  const inactive = employees.filter((e) => e.status === "inactive").length;

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setDepartmentFilter("all");
  };

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Management"
        description="Manage employee records, documents, and information"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-2 border-indigo-200 bg-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Employees</p>
              <p className="text-2xl font-bold text-indigo-900">{totalEmployees}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-900">{activeEmployees}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2 border-yellow-200 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">On Leave</p>
              <p className="text-2xl font-bold text-yellow-900">{onLeave}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-yellow-200 flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Inactive</p>
              <p className="text-2xl font-bold text-red-900">{inactive}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-3">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Employee
          </Button>
        </div>
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
                  placeholder="Employee ID, Name, Department..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Department Filter */}
            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All departments" />
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
            </div>
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
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold">Employee ID</th>
                  <th className="text-left p-3 text-sm font-semibold">Name</th>
                  <th className="text-left p-3 text-sm font-semibold">Department</th>
                  <th className="text-left p-3 text-sm font-semibold">Designation</th>
                  <th className="text-left p-3 text-sm font-semibold">Joining Date</th>
                  <th className="text-left p-3 text-sm font-semibold">Status</th>
                  <th className="text-left p-3 text-sm font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      No employees found. Try adjusting your filters.
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="border-t hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-3">
                        <span className="font-mono font-semibold text-indigo-600">
                          {employee.employeeId}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                            {employee.fullName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{employee.fullName}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{employee.department}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {employee.designation}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {employee.joiningDate}
                        </div>
                      </td>
                      <td className="p-3">{getStatusBadge(employee.status)}</td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onSelectEmployee(employee.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Profile
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}