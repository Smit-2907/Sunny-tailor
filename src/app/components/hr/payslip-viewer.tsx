import { useState } from "react";
import {
  Download,
  Eye,
  Search,
  FileText,
  Calendar,
  User,
  Building2,
  CreditCard,
  X,
  Printer,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { mockPayslipRecords, PayslipRecord, SalaryStructure } from "@/app/data/mock-payroll-data";

export function PayslipViewer() {
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("January");

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filter payslips
  const filteredPayslips = mockPayslipRecords.filter((payslip) => {
    const matchesSearch =
      payslip.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payslip.salaryStructure.employeeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMonth = selectedMonth === "all" || payslip.month === selectedMonth;

    return matchesSearch && matchesMonth;
  });

  // Calculate final amounts for payslip
  const calculatePayslipAmounts = (payslip: PayslipRecord) => {
    const salary = payslip.salaryStructure;
    const salaryFactor = payslip.paidDays / payslip.workingDays;

    // Pro-rated earnings
    const proRatedBasic = Math.round(salary.basic * salaryFactor);
    const proRatedHRA = Math.round(salary.hra * salaryFactor);
    const proRatedConveyance = Math.round(salary.conveyance * salaryFactor);
    const proRatedMedical = Math.round(salary.medical * salaryFactor);
    const proRatedSpecial = Math.round(salary.specialAllowance * salaryFactor);

    const totalEarnings =
      proRatedBasic +
      proRatedHRA +
      proRatedConveyance +
      proRatedMedical +
      proRatedSpecial +
      payslip.overtimeAmount +
      payslip.bonus;

    // Pro-rated deductions
    const proRatedPF = Math.round(salary.pf * salaryFactor);
    const proRatedESI = Math.round(salary.esi * salaryFactor);
    const proRatedPT = payslip.paidDays >= 15 ? salary.professionalTax : 0;
    const proRatedTDS = Math.round(salary.tds * salaryFactor);

    const totalDeductions = proRatedPF + proRatedESI + proRatedPT + proRatedTDS;
    const netPay = totalEarnings - totalDeductions;

    return {
      proRatedBasic,
      proRatedHRA,
      proRatedConveyance,
      proRatedMedical,
      proRatedSpecial,
      totalEarnings,
      proRatedPF,
      proRatedESI,
      proRatedPT,
      proRatedTDS,
      totalDeductions,
      netPay,
    };
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="space-y-2">
            <Label>Search Employee</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Employee ID or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Month Filter */}
          <div className="space-y-2">
            <Label>Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
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

          {/* Bulk Actions */}
          <div className="space-y-2">
            <Label>Bulk Actions</Label>
            <Button variant="outline" className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>
        </div>
      </Card>

      {/* Payslip List */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">
          Payslips ({filteredPayslips.length})
        </h3>
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3 text-sm font-semibold">Employee ID</th>
                <th className="text-left p-3 text-sm font-semibold">Name</th>
                <th className="text-left p-3 text-sm font-semibold">Department</th>
                <th className="text-left p-3 text-sm font-semibold">Month</th>
                <th className="text-center p-3 text-sm font-semibold">Paid Days</th>
                <th className="text-right p-3 text-sm font-semibold">Net Salary</th>
                <th className="text-left p-3 text-sm font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayslips.map((payslip) => {
                const amounts = calculatePayslipAmounts(payslip);
                return (
                  <tr
                    key={payslip.id}
                    className="border-t hover:bg-muted/50 transition-colors"
                  >
                    <td className="p-3">
                      <span className="font-mono font-semibold text-indigo-600">
                        {payslip.employeeId}
                      </span>
                    </td>
                    <td className="p-3 font-medium">
                      {payslip.salaryStructure.employeeName}
                    </td>
                    <td className="p-3 text-sm text-muted-foreground">
                      {payslip.salaryStructure.department}
                    </td>
                    <td className="p-3 text-sm">
                      {payslip.month} {payslip.year}
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-semibold">
                        {payslip.paidDays}/{payslip.workingDays}
                      </span>
                      {payslip.lopDays > 0 && (
                        <span className="text-xs text-red-600 block">
                          {payslip.lopDays} LOP
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right font-bold text-green-700">
                      {formatCurrency(amounts.netPay)}
                    </td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedPayslip(payslip)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Payslip Detail Modal */}
      {selectedPayslip && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="max-w-4xl w-full p-8 my-8">
            <div className="space-y-6">
              {/* Header with Actions */}
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Payslip</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedPayslip.month} {selectedPayslip.year}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPayslip(null)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Company & Employee Info */}
              <div className="grid grid-cols-2 gap-6 p-4 bg-muted rounded-lg">
                <div>
                  <h3 className="font-bold mb-2">Sunny Tailor Corporate Garment</h3>
                  <p className="text-sm text-muted-foreground">
                    Manufacturing & Clothing ERP System
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Payslip ID</p>
                  <p className="font-mono font-semibold">{selectedPayslip.id}</p>
                </div>
              </div>

              {/* Employee Details */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Employee Name</p>
                      <p className="font-semibold">
                        {selectedPayslip.salaryStructure.employeeName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Employee ID</p>
                      <p className="font-mono font-semibold">
                        {selectedPayslip.employeeId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Department</p>
                      <p className="font-semibold">
                        {selectedPayslip.salaryStructure.department}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Designation</p>
                      <p className="font-semibold">
                        {selectedPayslip.salaryStructure.designation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Bank Account</p>
                      <p className="font-mono font-semibold">
                        {selectedPayslip.salaryStructure.bankAccount}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Joining</p>
                      <p className="font-semibold">
                        {selectedPayslip.salaryStructure.dateOfJoining}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attendance Summary */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold mb-2">Attendance Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Working Days</p>
                    <p className="font-bold text-lg">{selectedPayslip.workingDays}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Present Days</p>
                    <p className="font-bold text-lg text-green-700">
                      {selectedPayslip.presentDays}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LOP Days</p>
                    <p className="font-bold text-lg text-red-700">
                      {selectedPayslip.lopDays}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Paid Days</p>
                    <p className="font-bold text-lg text-indigo-700">
                      {selectedPayslip.paidDays}
                    </p>
                  </div>
                </div>
              </div>

              {/* Earnings and Deductions */}
              {(() => {
                const amounts = calculatePayslipAmounts(selectedPayslip);
                return (
                  <div className="grid grid-cols-2 gap-6">
                    {/* Earnings */}
                    <div>
                      <h3 className="font-semibold mb-3 text-green-700">Earnings</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Basic Salary</span>
                          <span className="font-semibold">
                            {formatCurrency(amounts.proRatedBasic)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>House Rent Allowance (HRA)</span>
                          <span className="font-semibold">
                            {formatCurrency(amounts.proRatedHRA)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Conveyance Allowance</span>
                          <span className="font-semibold">
                            {formatCurrency(amounts.proRatedConveyance)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Medical Allowance</span>
                          <span className="font-semibold">
                            {formatCurrency(amounts.proRatedMedical)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Special Allowance</span>
                          <span className="font-semibold">
                            {formatCurrency(amounts.proRatedSpecial)}
                          </span>
                        </div>
                        {selectedPayslip.overtimeAmount > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>
                              Overtime ({selectedPayslip.overtimeHours} hrs)
                            </span>
                            <span className="font-semibold">
                              {formatCurrency(selectedPayslip.overtimeAmount)}
                            </span>
                          </div>
                        )}
                        {selectedPayslip.bonus > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Bonus</span>
                            <span className="font-semibold">
                              {formatCurrency(selectedPayslip.bonus)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t-2 border-green-200 font-bold text-green-700">
                          <span>Total Earnings</span>
                          <span>{formatCurrency(amounts.totalEarnings)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div>
                      <h3 className="font-semibold mb-3 text-red-700">Deductions</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Provident Fund (PF)</span>
                          <span className="font-semibold">
                            {formatCurrency(amounts.proRatedPF)}
                          </span>
                        </div>
                        {amounts.proRatedESI > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>ESI</span>
                            <span className="font-semibold">
                              {formatCurrency(amounts.proRatedESI)}
                            </span>
                          </div>
                        )}
                        {amounts.proRatedPT > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>Professional Tax</span>
                            <span className="font-semibold">
                              {formatCurrency(amounts.proRatedPT)}
                            </span>
                          </div>
                        )}
                        {amounts.proRatedTDS > 0 && (
                          <div className="flex justify-between text-sm">
                            <span>TDS (Income Tax)</span>
                            <span className="font-semibold">
                              {formatCurrency(amounts.proRatedTDS)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t-2 border-red-200 font-bold text-red-700">
                          <span>Total Deductions</span>
                          <span>{formatCurrency(amounts.totalDeductions)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Net Pay */}
              {(() => {
                const amounts = calculatePayslipAmounts(selectedPayslip);
                return (
                  <div className="p-6 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-indigo-900">Net Pay</h3>
                      <p className="text-3xl font-bold text-indigo-900">
                        {formatCurrency(amounts.netPay)}
                      </p>
                    </div>
                    <p className="text-sm text-indigo-700 mt-2">
                      Amount payable for {selectedPayslip.month} {selectedPayslip.year}
                    </p>
                  </div>
                );
              })()}

              {/* Remarks */}
              {selectedPayslip.remarks && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Remarks</p>
                  <p className="text-sm font-medium">{selectedPayslip.remarks}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
