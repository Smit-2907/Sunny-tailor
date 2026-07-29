import {
  DollarSign,
  TrendingDown,
  Users,
  PieChart,
  Building2,
  Calculator,
  Wallet,
  Receipt,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import {
  calculateMonthlyPayrollSummary,
  calculateDepartmentWiseSalary,
} from "@/app/data/mock-payroll-data";

export function PayrollOverview() {
  const payrollSummary = calculateMonthlyPayrollSummary();
  const deptWiseSalary = calculateDepartmentWiseSalary();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get current month and year
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payroll Overview</h2>
          <p className="text-muted-foreground">
            {currentMonth} {currentYear} - Monthly Salary Summary
          </p>
        </div>
      </div>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-2 border-indigo-200 bg-indigo-50">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-full bg-indigo-200 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Gross Salary</p>
          <p className="text-2xl font-bold text-indigo-900">
            {formatCurrency(payrollSummary.totalGross)}
          </p>
        </Card>

        <Card className="p-6 border-2 border-red-200 bg-red-50">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Deductions</p>
          <p className="text-2xl font-bold text-red-900">
            {formatCurrency(payrollSummary.totalDeductions)}
          </p>
        </Card>

        <Card className="p-6 border-2 border-green-200 bg-green-50">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Net Salary</p>
          <p className="text-2xl font-bold text-green-900">
            {formatCurrency(payrollSummary.totalNet)}
          </p>
        </Card>

        <Card className="p-6 border-2 border-purple-200 bg-purple-50">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Avg Net Salary</p>
          <p className="text-2xl font-bold text-purple-900">
            {formatCurrency(payrollSummary.avgSalary)}
          </p>
        </Card>
      </div>

      {/* Deduction Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deduction Details */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-indigo-600" />
            Deduction Breakdown
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Provident Fund (PF)</p>
                  <p className="text-xs text-muted-foreground">Employee Contribution</p>
                </div>
              </div>
              <p className="font-bold text-blue-900">
                {formatCurrency(payrollSummary.totalPF)}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="font-medium">Employee State Insurance (ESI)</p>
                  <p className="text-xs text-muted-foreground">0.75% of Gross Salary</p>
                </div>
              </div>
              <p className="font-bold text-orange-900">
                {formatCurrency(payrollSummary.totalESI)}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium">Professional Tax (PT)</p>
                  <p className="text-xs text-muted-foreground">State Tax</p>
                </div>
              </div>
              <p className="font-bold text-purple-900">
                {formatCurrency(payrollSummary.totalPT)}
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">Tax Deducted at Source (TDS)</p>
                  <p className="text-xs text-muted-foreground">Income Tax</p>
                </div>
              </div>
              <p className="font-bold text-red-900">
                {formatCurrency(payrollSummary.totalTDS)}
              </p>
            </div>
          </div>
        </Card>

        {/* Department-wise Salary */}
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-indigo-600" />
            Department-wise Salary Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(deptWiseSalary)
              .sort((a, b) => b[1].total - a[1].total)
              .map(([dept, data]) => (
                <div
                  key={dept}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                      <p className="font-medium">{dept}</p>
                    </div>
                    <p className="font-bold text-indigo-900">
                      {formatCurrency(data.total)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{data.count} employees</span>
                    <span>Avg: {formatCurrency(data.avgSalary)}</span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600"
                      style={{
                        width: `${(data.total / payrollSummary.totalNet) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <button className="p-4 border-2 border-indigo-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left">
            <PieChart className="h-8 w-8 text-indigo-600 mb-2" />
            <p className="font-semibold">Process Payroll</p>
            <p className="text-xs text-muted-foreground">Generate monthly payroll</p>
          </button>

          <button className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-left">
            <Receipt className="h-8 w-8 text-green-600 mb-2" />
            <p className="font-semibold">View Payslips</p>
            <p className="text-xs text-muted-foreground">Download employee payslips</p>
          </button>

          <button className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-left">
            <Calculator className="h-8 w-8 text-purple-600 mb-2" />
            <p className="font-semibold">CTC Calculator</p>
            <p className="text-xs text-muted-foreground">Calculate cost to company</p>
          </button>

          <button className="p-4 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all text-left">
            <DollarSign className="h-8 w-8 text-orange-600 mb-2" />
            <p className="font-semibold">Salary Register</p>
            <p className="text-xs text-muted-foreground">View complete salary report</p>
          </button>
        </div>
      </Card>

      {/* Payroll Processing Status */}
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center flex-shrink-0">
            <Wallet className="h-6 w-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-green-900 mb-1">
              Payroll Status: Ready for Processing
            </h3>
            <p className="text-sm text-green-800 mb-3">
              All attendance records are finalized. Payroll for {currentMonth} {currentYear} is
              ready to be processed.
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                <span>Attendance verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                <span>Leave records updated</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-600"></div>
                <span>Deductions calculated</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}