import {
  Download,
  Printer,
  Mail,
  Building2,
  User,
  Calendar,
  CreditCard,
  X,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { Badge } from "@/app/components/ui/badge";

interface SalarySlipProps {
  employeeId: string;
  employeeName: string;
  designation: string;
  department: string;
  month: string;
  year: number;
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
  paymentDate: string;
  paymentMethod: string;
  bankAccount: string;
  onClose?: () => void;
}

export function SalarySlipViewer(props: SalarySlipProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In real app, generate PDF
    alert("Downloading salary slip as PDF...");
  };

  const handleEmail = () => {
    // In real app, send email
    alert(`Sending salary slip to employee email...`);
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons */}
      <div className="flex justify-between items-center print:hidden">
        <h2 className="text-xl font-semibold">Salary Slip</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm" onClick={handleEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Email to Employee
          </Button>
          {props.onClose && (
            <Button variant="outline" size="sm" onClick={props.onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Salary Slip */}
      <Card className="p-8 max-w-4xl mx-auto bg-white">
        {/* Company Header */}
        <div className="text-center mb-6 pb-6 border-b-2 border-indigo-600">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-indigo-900">
              Manufacturing ERP Company
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            123 Industrial Area, Manufacturing Hub, Mumbai - 400001
          </p>
          <p className="text-sm text-muted-foreground">
            Email: hr@manufacturingerp.com | Phone: +91 22 1234 5678
          </p>
        </div>

        {/* Salary Slip Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">SALARY SLIP</h2>
          <p className="text-lg text-muted-foreground mt-1">
            {props.month} {props.year}
          </p>
        </div>

        {/* Employee Details */}
        <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-indigo-600 mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Employee Name</p>
                <p className="font-semibold">{props.employeeName}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 text-indigo-600 mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="font-semibold">{props.department}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CreditCard className="h-4 w-4 text-indigo-600 mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Bank Account</p>
                <p className="font-semibold">{props.bankAccount}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-indigo-600 mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Employee ID</p>
                <p className="font-semibold font-mono">{props.employeeId}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Building2 className="h-4 w-4 text-indigo-600 mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Designation</p>
                <p className="font-semibold">{props.designation}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-indigo-600 mt-1" />
              <div>
                <p className="text-xs text-muted-foreground">Payment Date</p>
                <p className="font-semibold">{props.paymentDate}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Salary Breakdown */}
        <div className="grid grid-cols-2 gap-8">
          {/* Earnings */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-green-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-green-600 rounded"></span>
              EARNINGS
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Basic Salary</span>
                <span className="font-semibold">{formatCurrency(props.basicSalary)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">
                  House Rent Allowance (HRA)
                </span>
                <span className="font-semibold">{formatCurrency(props.allowances.hra)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Transport Allowance</span>
                <span className="font-semibold">
                  {formatCurrency(props.allowances.transport)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Medical Allowance</span>
                <span className="font-semibold">{formatCurrency(props.allowances.medical)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Other Allowances</span>
                <span className="font-semibold">{formatCurrency(props.allowances.other)}</span>
              </div>
              <div className="flex justify-between py-3 bg-green-50 px-3 rounded-lg mt-4">
                <span className="font-bold text-green-900">GROSS EARNINGS</span>
                <span className="font-bold text-green-900 text-lg">
                  {formatCurrency(props.grossSalary)}
                </span>
              </div>
            </div>
          </div>

          {/* Deductions */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-red-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-red-600 rounded"></span>
              DEDUCTIONS
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Provident Fund (PF)</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(props.deductions.pf)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Income Tax (TDS)</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(props.deductions.tax)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Insurance Premium</span>
                <span className="font-semibold text-red-600">
                  {formatCurrency(props.deductions.insurance)}
                </span>
              </div>
              <div className="py-2 border-b opacity-0">
                <span className="text-sm">Placeholder</span>
              </div>
              <div className="py-2 border-b opacity-0">
                <span className="text-sm">Placeholder</span>
              </div>
              <div className="flex justify-between py-3 bg-red-50 px-3 rounded-lg mt-4">
                <span className="font-bold text-red-900">TOTAL DEDUCTIONS</span>
                <span className="font-bold text-red-900 text-lg">
                  {formatCurrency(props.totalDeductions)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Net Salary */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm opacity-90 mb-1">NET SALARY (Take Home)</p>
              <p className="text-4xl font-bold">{formatCurrency(props.netSalary)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90 mb-1">Payment Method</p>
              <Badge className="bg-white text-indigo-700 text-sm px-3 py-1">
                {props.paymentMethod}
              </Badge>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Amount in Words:</p>
          <p className="font-semibold text-indigo-900">
            {/* In real app, convert number to words */}
            Rupees {props.netSalary.toLocaleString("en-IN")} Only
          </p>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Generated on:</p>
              <p className="text-sm font-semibold">{new Date().toLocaleDateString("en-IN")}</p>
            </div>
            <div className="text-right">
              <div className="mb-8">
                <p className="text-xs text-muted-foreground">Authorized Signature</p>
              </div>
              <p className="text-sm font-semibold border-t-2 border-gray-800 pt-2 px-8">
                HR Department
              </p>
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-xs text-yellow-800">
            <strong>Note:</strong> This is a computer-generated salary slip and does not require
            a physical signature. For any queries, please contact the HR department.
          </p>
        </div>
      </Card>
    </div>
  );
}
