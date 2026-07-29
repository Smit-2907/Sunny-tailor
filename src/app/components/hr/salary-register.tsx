import { useState } from "react";
import { Download, Printer, FileText, TrendingUp } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { mockSalaryStructures } from "@/app/data/mock-payroll-data";

export function SalaryRegister() {
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get unique departments
  const uniqueDepartments = Array.from(
    new Set(mockSalaryStructures.map((s) => s.department))
  );

  // Filter salary data
  const filteredSalaries = mockSalaryStructures.filter((salary) => {
    if (departmentFilter === "all") return true;
    return salary.department === departmentFilter;
  });

  // Calculate totals
  const totals = {
    basic: filteredSalaries.reduce((sum, s) => sum + s.basic, 0),
    hra: filteredSalaries.reduce((sum, s) => sum + s.hra, 0),
    conveyance: filteredSalaries.reduce((sum, s) => sum + s.conveyance, 0),
    medical: filteredSalaries.reduce((sum, s) => sum + s.medical, 0),
    specialAllowance: filteredSalaries.reduce((sum, s) => sum + s.specialAllowance, 0),
    grossSalary: filteredSalaries.reduce((sum, s) => sum + s.grossSalary, 0),
    pf: filteredSalaries.reduce((sum, s) => sum + s.pf, 0),
    esi: filteredSalaries.reduce((sum, s) => sum + s.esi, 0),
    professionalTax: filteredSalaries.reduce((sum, s) => sum + s.professionalTax, 0),
    tds: filteredSalaries.reduce((sum, s) => sum + s.tds, 0),
    totalDeductions: filteredSalaries.reduce(
      (sum, s) => sum + s.pf + s.esi + s.professionalTax + s.tds,
      0
    ),
    netSalary: filteredSalaries.reduce((sum, s) => sum + s.netSalary, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Month Selection */}
          <div className="space-y-2">
            <Label>Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
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

          {/* Year Selection */}
          <div className="space-y-2">
            <Label>Year</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
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

          {/* Export Actions */}
          <div className="space-y-2">
            <Label>Export</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-2 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Gross Salary</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(totals.grossSalary)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4 border-2 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Deductions</p>
              <p className="text-2xl font-bold text-red-900">
                {formatCurrency(totals.totalDeductions)}
              </p>
            </div>
            <FileText className="h-8 w-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-4 border-2 border-indigo-200 bg-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Net Salary</p>
              <p className="text-2xl font-bold text-indigo-900">
                {formatCurrency(totals.netSalary)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-indigo-600" />
          </div>
        </Card>
      </div>

      {/* Salary Register Table */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">
              Salary Register - {selectedMonth} {selectedYear}
            </h3>
            <p className="text-sm text-muted-foreground">
              {filteredSalaries.length} employees
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-2 font-semibold sticky left-0 bg-muted z-10">
                  Emp ID
                </th>
                <th className="text-left p-2 font-semibold">Name</th>
                <th className="text-left p-2 font-semibold">Department</th>
                <th className="text-right p-2 font-semibold">Basic</th>
                <th className="text-right p-2 font-semibold">HRA</th>
                <th className="text-right p-2 font-semibold">Conv.</th>
                <th className="text-right p-2 font-semibold">Medical</th>
                <th className="text-right p-2 font-semibold">Special</th>
                <th className="text-right p-2 font-semibold bg-green-50">
                  Gross
                </th>
                <th className="text-right p-2 font-semibold">PF</th>
                <th className="text-right p-2 font-semibold">ESI</th>
                <th className="text-right p-2 font-semibold">PT</th>
                <th className="text-right p-2 font-semibold">TDS</th>
                <th className="text-right p-2 font-semibold bg-red-50">
                  Tot. Ded.
                </th>
                <th className="text-right p-2 font-semibold bg-indigo-50">
                  Net Pay
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.map((salary) => {
                const totalDeductions =
                  salary.pf + salary.esi + salary.professionalTax + salary.tds;
                return (
                  <tr
                    key={salary.employeeId}
                    className="border-t hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-2 sticky left-0 bg-white font-mono font-semibold text-indigo-600">
                      {salary.employeeId}
                    </td>
                    <td className="p-2 font-medium whitespace-nowrap">
                      {salary.employeeName}
                    </td>
                    <td className="p-2 text-muted-foreground whitespace-nowrap">
                      {salary.department}
                    </td>
                    <td className="p-2 text-right">{formatCurrency(salary.basic)}</td>
                    <td className="p-2 text-right">{formatCurrency(salary.hra)}</td>
                    <td className="p-2 text-right">
                      {formatCurrency(salary.conveyance)}
                    </td>
                    <td className="p-2 text-right">{formatCurrency(salary.medical)}</td>
                    <td className="p-2 text-right">
                      {formatCurrency(salary.specialAllowance)}
                    </td>
                    <td className="p-2 text-right font-semibold text-green-700 bg-green-50">
                      {formatCurrency(salary.grossSalary)}
                    </td>
                    <td className="p-2 text-right">{formatCurrency(salary.pf)}</td>
                    <td className="p-2 text-right">
                      {salary.esi > 0 ? formatCurrency(salary.esi) : "-"}
                    </td>
                    <td className="p-2 text-right">
                      {formatCurrency(salary.professionalTax)}
                    </td>
                    <td className="p-2 text-right">
                      {salary.tds > 0 ? formatCurrency(salary.tds) : "-"}
                    </td>
                    <td className="p-2 text-right font-semibold text-red-700 bg-red-50">
                      {formatCurrency(totalDeductions)}
                    </td>
                    <td className="p-2 text-right font-semibold text-indigo-700 bg-indigo-50">
                      {formatCurrency(salary.netSalary)}
                    </td>
                  </tr>
                );
              })}

              {/* Totals Row */}
              <tr className="border-t-2 border-indigo-600 font-bold bg-muted">
                <td colSpan={3} className="p-2 text-right">
                  TOTAL ({filteredSalaries.length} employees)
                </td>
                <td className="p-2 text-right">{formatCurrency(totals.basic)}</td>
                <td className="p-2 text-right">{formatCurrency(totals.hra)}</td>
                <td className="p-2 text-right">{formatCurrency(totals.conveyance)}</td>
                <td className="p-2 text-right">{formatCurrency(totals.medical)}</td>
                <td className="p-2 text-right">
                  {formatCurrency(totals.specialAllowance)}
                </td>
                <td className="p-2 text-right text-green-700 bg-green-100">
                  {formatCurrency(totals.grossSalary)}
                </td>
                <td className="p-2 text-right">{formatCurrency(totals.pf)}</td>
                <td className="p-2 text-right">{formatCurrency(totals.esi)}</td>
                <td className="p-2 text-right">
                  {formatCurrency(totals.professionalTax)}
                </td>
                <td className="p-2 text-right">{formatCurrency(totals.tds)}</td>
                <td className="p-2 text-right text-red-700 bg-red-100">
                  {formatCurrency(totals.totalDeductions)}
                </td>
                <td className="p-2 text-right text-indigo-700 bg-indigo-100">
                  {formatCurrency(totals.netSalary)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4 bg-muted">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">Abbreviations:</p>
            <p className="text-xs text-muted-foreground">Conv. - Conveyance</p>
            <p className="text-xs text-muted-foreground">Ded. - Deductions</p>
          </div>
          <div>
            <p className="font-semibold mb-1">PF:</p>
            <p className="text-xs text-muted-foreground">
              Provident Fund (12% of Basic)
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">ESI:</p>
            <p className="text-xs text-muted-foreground">
              Employee State Insurance (0.75%)
            </p>
          </div>
          <div>
            <p className="font-semibold mb-1">PT & TDS:</p>
            <p className="text-xs text-muted-foreground">Professional Tax & Income Tax</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
