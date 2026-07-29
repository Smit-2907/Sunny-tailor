import { useState } from "react";
import {
  Download,
  FileText,
  Printer,
  Mail,
  Calendar as CalendarIcon,
  TrendingUp,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";
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
import { mockAttendanceRecords } from "@/app/data/mock-attendance-data";
import { mockLeaveBalances } from "@/app/data/mock-attendance-data";

export function AttendanceReports() {
  const [reportType, setReportType] = useState("monthly-summary");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  // Calculate monthly summary for all employees
  const calculateMonthlySummary = () => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);

    // Get unique employees
    const employees = Array.from(
      new Set(mockAttendanceRecords.map((r) => r.employeeId))
    ).map((id) => {
      const record = mockAttendanceRecords.find((r) => r.employeeId === id);
      return {
        id,
        name: record?.employeeName || "",
      };
    });

    return employees.map((emp) => {
      const records = mockAttendanceRecords.filter((r) => {
        const date = new Date(r.date);
        return (
          r.employeeId === emp.id &&
          date.getMonth() === month &&
          date.getFullYear() === year
        );
      });

      const present = records.filter(
        (r) => r.status === "present" || r.status === "half-day"
      ).length;
      const absent = records.filter((r) => r.status === "absent").length;
      const onLeave = records.filter((r) => r.status === "on-leave").length;
      const lateArrivals = records.filter((r) => r.isLate).length;
      const totalWorkHours = records.reduce(
        (sum, r) => sum + (r.workHours || 0),
        0
      );
      const totalOvertime = records.reduce(
        (sum, r) => sum + (r.overtime || 0),
        0
      );

      return {
        employeeId: emp.id,
        employeeName: emp.name,
        present,
        absent,
        onLeave,
        lateArrivals,
        totalWorkHours: totalWorkHours.toFixed(1),
        totalOvertime: totalOvertime.toFixed(1),
        attendancePercentage: records.length > 0
          ? ((present / records.length) * 100).toFixed(1)
          : "0",
      };
    });
  };

  // Calculate late arrival report
  const calculateLateArrivals = () => {
    const month = parseInt(selectedMonth);
    const year = parseInt(selectedYear);

    const lateRecords = mockAttendanceRecords.filter((r) => {
      const date = new Date(r.date);
      return (
        r.isLate &&
        date.getMonth() === month &&
        date.getFullYear() === year
      );
    });

    return lateRecords;
  };

  // Calculate leave utilization report
  const calculateLeaveUtilization = () => {
    return mockLeaveBalances.map((balance) => ({
      ...balance,
      casualUtilization: balance.casual.total > 0
        ? ((balance.casual.used / balance.casual.total) * 100).toFixed(1)
        : "0",
      sickUtilization: balance.sick.total > 0
        ? ((balance.sick.used / balance.sick.total) * 100).toFixed(1)
        : "0",
      earnedUtilization: balance.earned.total > 0
        ? ((balance.earned.used / balance.earned.total) * 100).toFixed(1)
        : "0",
    }));
  };

  const monthlySummary = calculateMonthlySummary();
  const lateArrivals = calculateLateArrivals();
  const leaveUtilization = calculateLeaveUtilization();

  // Calculate overall statistics
  const overallStats = {
    totalEmployees: monthlySummary.length,
    avgAttendance: monthlySummary.length > 0
      ? (
          monthlySummary.reduce(
            (sum, emp) => sum + parseFloat(emp.attendancePercentage),
            0
          ) / monthlySummary.length
        ).toFixed(1)
      : "0",
    totalLateArrivals: lateArrivals.length,
    totalOvertime: monthlySummary.reduce(
      (sum, emp) => sum + parseFloat(emp.totalOvertime),
      0
    ).toFixed(1),
  };

  // Get month name
  const getMonthName = (monthIndex: number) => {
    const date = new Date(2025, monthIndex, 1);
    return date.toLocaleDateString("en-IN", { month: "long" });
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Generate Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Report Type */}
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly-summary">Monthly Summary</SelectItem>
                <SelectItem value="late-arrivals">Late Arrivals</SelectItem>
                <SelectItem value="leave-utilization">Leave Utilization</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Month */}
          <div className="space-y-2">
            <Label>Month</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    {getMonthName(i)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
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

          {/* Export Actions */}
          <div className="space-y-2">
            <Label>Export</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Printer className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Overall Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 border-2 border-indigo-200 bg-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Employees</p>
              <p className="text-2xl font-bold text-indigo-900">
                {overallStats.totalEmployees}
              </p>
            </div>
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
        </Card>

        <Card className="p-4 border-2 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Attendance</p>
              <p className="text-2xl font-bold text-green-900">
                {overallStats.avgAttendance}%
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4 border-2 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Late Arrivals</p>
              <p className="text-2xl font-bold text-orange-900">
                {overallStats.totalLateArrivals}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </Card>

        <Card className="p-4 border-2 border-purple-200 bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Overtime</p>
              <p className="text-2xl font-bold text-purple-900">
                {overallStats.totalOvertime}h
              </p>
            </div>
            <Clock className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Monthly Summary Report */}
      {reportType === "monthly-summary" && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">
            Monthly Attendance Summary - {getMonthName(parseInt(selectedMonth))}{" "}
            {selectedYear}
          </h3>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold">Employee ID</th>
                  <th className="text-left p-3 text-sm font-semibold">Name</th>
                  <th className="text-center p-3 text-sm font-semibold">Present</th>
                  <th className="text-center p-3 text-sm font-semibold">Absent</th>
                  <th className="text-center p-3 text-sm font-semibold">On Leave</th>
                  <th className="text-center p-3 text-sm font-semibold">Late</th>
                  <th className="text-center p-3 text-sm font-semibold">Work Hours</th>
                  <th className="text-center p-3 text-sm font-semibold">Overtime</th>
                  <th className="text-center p-3 text-sm font-semibold">Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {monthlySummary.map((emp) => (
                  <tr key={emp.employeeId} className="border-t hover:bg-muted/50">
                    <td className="p-3">
                      <span className="font-mono font-semibold text-indigo-600">
                        {emp.employeeId}
                      </span>
                    </td>
                    <td className="p-3 font-medium">{emp.employeeName}</td>
                    <td className="p-3 text-center">
                      <span className="font-semibold text-green-700">
                        {emp.present}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-semibold text-red-700">{emp.absent}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-semibold text-blue-700">
                        {emp.onLeave}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-semibold text-orange-700">
                        {emp.lateArrivals}
                      </span>
                    </td>
                    <td className="p-3 text-center font-semibold">
                      {emp.totalWorkHours}h
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-semibold text-purple-700">
                        {emp.totalOvertime}h
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`font-bold ${
                          parseFloat(emp.attendancePercentage) >= 90
                            ? "text-green-700"
                            : parseFloat(emp.attendancePercentage) >= 75
                            ? "text-yellow-700"
                            : "text-red-700"
                        }`}
                      >
                        {emp.attendancePercentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Late Arrivals Report */}
      {reportType === "late-arrivals" && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">
            Late Arrivals Report - {getMonthName(parseInt(selectedMonth))}{" "}
            {selectedYear}
          </h3>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold">Date</th>
                  <th className="text-left p-3 text-sm font-semibold">Employee ID</th>
                  <th className="text-left p-3 text-sm font-semibold">Name</th>
                  <th className="text-left p-3 text-sm font-semibold">Clock In Time</th>
                  <th className="text-left p-3 text-sm font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {lateArrivals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No late arrivals recorded for this period.
                    </td>
                  </tr>
                ) : (
                  lateArrivals.map((record) => (
                    <tr key={record.id} className="border-t hover:bg-muted/50">
                      <td className="p-3">
                        {new Date(record.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-3">
                        <span className="font-mono font-semibold text-indigo-600">
                          {record.employeeId}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{record.employeeName}</td>
                      <td className="p-3">
                        <span className="font-semibold text-orange-700">
                          {record.clockIn}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {record.remarks || "No remarks"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Leave Utilization Report */}
      {reportType === "leave-utilization" && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4">
            Leave Utilization Report - Year {selectedYear}
          </h3>
          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold">Employee ID</th>
                  <th className="text-left p-3 text-sm font-semibold">Name</th>
                  <th className="text-center p-3 text-sm font-semibold">
                    Casual Leave Used
                  </th>
                  <th className="text-center p-3 text-sm font-semibold">
                    Sick Leave Used
                  </th>
                  <th className="text-center p-3 text-sm font-semibold">
                    Earned Leave Used
                  </th>
                  <th className="text-center p-3 text-sm font-semibold">
                    Total Available
                  </th>
                  <th className="text-center p-3 text-sm font-semibold">
                    Utilization %
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaveUtilization.map((emp) => {
                  const totalUsed =
                    emp.casual.used + emp.sick.used + emp.earned.used;
                  const totalAvailable =
                    emp.casual.total + emp.sick.total + emp.earned.total;
                  const totalUtilization = totalAvailable > 0
                    ? ((totalUsed / totalAvailable) * 100).toFixed(1)
                    : "0";

                  return (
                    <tr key={emp.employeeId} className="border-t hover:bg-muted/50">
                      <td className="p-3">
                        <span className="font-mono font-semibold text-indigo-600">
                          {emp.employeeId}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{emp.employeeName}</td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {emp.casual.used}/{emp.casual.total}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {emp.casualUtilization}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {emp.sick.used}/{emp.sick.total}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {emp.sickUtilization}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {emp.earned.used}/{emp.earned.total}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {emp.earnedUtilization}%
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="font-semibold">
                          {emp.casual.available +
                            emp.sick.available +
                            emp.earned.available}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`font-bold ${
                            parseFloat(totalUtilization) >= 70
                              ? "text-red-700"
                              : parseFloat(totalUtilization) >= 40
                              ? "text-yellow-700"
                              : "text-green-700"
                          }`}
                        >
                          {totalUtilization}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}