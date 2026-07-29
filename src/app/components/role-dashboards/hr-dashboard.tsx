import { useState } from "react";
import { Users, UserPlus, Clock, Calendar, FileText, TrendingUp, DollarSign } from "lucide-react";
import { StatCard } from "@/app/components/stat-card";
import { HREmployeeList } from "@/app/components/hr/hr-employee-list";
import { HREmployeeProfile } from "@/app/components/hr/hr-employee-profile";
import { AttendanceTracking } from "@/app/components/hr/attendance-tracking";
import { LeaveManagement } from "@/app/components/hr/leave-management";
import { AttendanceReports } from "@/app/components/hr/attendance-reports";
import { PayrollOverview } from "@/app/components/hr/payroll-overview";
import { PayslipViewer } from "@/app/components/hr/payslip-viewer";
import { SalaryRegister } from "@/app/components/hr/salary-register";
import { CTCCalculator } from "@/app/components/hr/ctc-calculator";
import { HRAIAssistant } from "@/app/components/hr/hr-ai-assistant";
import { mockHREmployee, mockHREmployeeList } from "@/app/data/mock-hr-employee-data";
import { mockAttendanceRecords, mockLeaveApplications } from "@/app/data/mock-attendance-data";

type ActiveTab = "overview" | "employees" | "attendance" | "leave" | "payroll" | "reports";
type PayrollSubTab = "overview" | "payslips" | "register" | "ctc-calculator";

export function HRDashboard() {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [payrollSubTab, setPayrollSubTab] = useState<PayrollSubTab>("overview");

  // Calculate statistics
  const totalEmployees = mockHREmployeeList.length;
  const activeEmployees = mockHREmployeeList.filter((e) => e.status === "active").length;
  const onLeave = mockHREmployeeList.filter((e) => e.status === "on-leave").length;
  const presentToday = activeEmployees; // Simplified for demo
  const presentPercentage = totalEmployees > 0 ? ((presentToday / totalEmployees) * 100).toFixed(1) : "0";

  // Calculate attendance statistics for today
  const todayStr = new Date().toISOString().split("T")[0];
  const todayAttendance = mockAttendanceRecords.filter((r) => r.date === todayStr);
  const presentCount = todayAttendance.filter((r) => r.status === "present" || r.status === "half-day").length;
  const lateCount = todayAttendance.filter((r) => r.isLate).length;

  // Calculate pending leave requests
  const pendingLeaves = mockLeaveApplications.filter((l) => l.status === "pending").length;

  // Handle employee selection
  const handleSelectEmployee = (employeeId: string) => {
    setSelectedEmployeeId(employeeId);
  };

  const handleBackToList = () => {
    setSelectedEmployeeId(null);
  };

  // If an employee is selected, show their profile
  if (selectedEmployeeId) {
    return (
      <HREmployeeProfile
        employee={mockHREmployee}
        onBack={handleBackToList}
        onUpdate={(updatedEmployee) => {
          console.log("Employee updated:", updatedEmployee);
          // In a real app, this would update the backend
        }}
      />
    );
  }

  // Otherwise, show the tabbed interface
  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "overview"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </div>
        </button>
        <button
          onClick={() => setActiveTab("employees")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "employees"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Employees
          </div>
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "attendance"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Attendance
          </div>
        </button>
        <button
          onClick={() => setActiveTab("leave")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap relative ${
            activeTab === "leave"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Leave Management
            {pendingLeaves > 0 && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingLeaves}
              </span>
            )}
          </div>
        </button>
        <button
          onClick={() => setActiveTab("payroll")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "payroll"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Payroll
          </div>
        </button>
        <button
          onClick={() => setActiveTab("reports")}
          className={`px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
            activeTab === "reports"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Reports
          </div>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard
              title="Total Employees"
              value={totalEmployees.toString()}
              icon={Users}
              trend={{ value: "All staff", isPositive: true }}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
            <StatCard
              title="Present Today"
              value={presentCount.toString()}
              icon={Clock}
              trend={{ value: `${presentPercentage}%`, isPositive: true }}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
            />
            <StatCard
              title="On Leave"
              value={onLeave.toString()}
              icon={Calendar}
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
            <StatCard
              title="Pending Requests"
              value={pendingLeaves.toString()}
              icon={FileText}
              trend={{ value: "Leave approvals", isPositive: false }}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
            />
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setActiveTab("attendance")}
              className="p-6 border-2 border-indigo-200 rounded-lg hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Attendance Tracking</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View and manage daily attendance records
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-green-700 font-semibold">{presentCount}</span>
                      <span className="text-muted-foreground"> Present</span>
                    </div>
                    <div>
                      <span className="text-orange-700 font-semibold">{lateCount}</span>
                      <span className="text-muted-foreground"> Late</span>
                    </div>
                  </div>
                </div>
                <Clock className="h-10 w-10 text-indigo-600" />
              </div>
            </button>

            <button
              onClick={() => setActiveTab("leave")}
              className="p-6 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Leave Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Approve leave requests and view balances
                  </p>
                  <div className="flex items-center gap-2">
                    {pendingLeaves > 0 && (
                      <span className="bg-yellow-100 text-yellow-800 text-sm font-semibold px-3 py-1 rounded-full">
                        {pendingLeaves} Pending
                      </span>
                    )}
                  </div>
                </div>
                <Calendar className="h-10 w-10 text-purple-600" />
              </div>
            </button>

            <button
              onClick={() => setActiveTab("payroll")}
              className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-all text-left"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Payroll Management</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Process payroll and generate payslips
                  </p>
                  <div className="text-sm">
                    <span className="font-semibold">{totalEmployees}</span>
                    <span className="text-muted-foreground"> Employees</span>
                  </div>
                </div>
                <DollarSign className="h-10 w-10 text-green-600" />
              </div>
            </button>
          </div>
        </div>
      )}

      {activeTab === "employees" && (
        <HREmployeeList
          employees={mockHREmployeeList}
          onSelectEmployee={handleSelectEmployee}
        />
      )}

      {activeTab === "attendance" && <AttendanceTracking />}

      {activeTab === "leave" && <LeaveManagement />}

      {activeTab === "payroll" && (
        <div className="space-y-6">
          {/* Payroll Sub-tabs */}
          <div className="flex gap-2 border-b overflow-x-auto">
            <button
              onClick={() => setPayrollSubTab("overview")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                payrollSubTab === "overview"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setPayrollSubTab("payslips")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                payrollSubTab === "payslips"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Payslips
            </button>
            <button
              onClick={() => setPayrollSubTab("register")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                payrollSubTab === "register"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Salary Register
            </button>
            <button
              onClick={() => setPayrollSubTab("ctc-calculator")}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                payrollSubTab === "ctc-calculator"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              CTC Calculator
            </button>
          </div>

          {/* Payroll Sub-tab Content */}
          {payrollSubTab === "overview" && <PayrollOverview />}
          {payrollSubTab === "payslips" && <PayslipViewer />}
          {payrollSubTab === "register" && <SalaryRegister />}
          {payrollSubTab === "ctc-calculator" && <CTCCalculator />}
        </div>
      )}

      {activeTab === "reports" && <AttendanceReports />}

      {/* AI Assistant - Always Available */}
      <HRAIAssistant />
    </div>
  );
}