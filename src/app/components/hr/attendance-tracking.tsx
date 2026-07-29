import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Filter,
  Search,
  TrendingUp,
  X,
  CheckCircle,
  XCircle,
  Minus,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { mockAttendanceRecords, AttendanceRecord } from "@/app/data/mock-attendance-data";

export function AttendanceTracking() {
  const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Get today's date string
  const todayStr = new Date().toISOString().split("T")[0];
  
  // Filter attendance records
  const getFilteredRecords = () => {
    let records = mockAttendanceRecords;

    if (viewMode === "daily") {
      const dateStr = selectedDate.toISOString().split("T")[0];
      records = records.filter((r) => r.date === dateStr);
    } else {
      // Monthly view - get current month
      const month = selectedDate.getMonth();
      const year = selectedDate.getFullYear();
      records = records.filter((r) => {
        const recordDate = new Date(r.date);
        return recordDate.getMonth() === month && recordDate.getFullYear() === year;
      });
    }

    // Status filter
    if (statusFilter !== "all") {
      records = records.filter((r) => r.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      records = records.filter(
        (r) =>
          r.employeeId.toLowerCase().includes(query) ||
          r.employeeName.toLowerCase().includes(query)
      );
    }

    return records;
  };

  const filteredRecords = getFilteredRecords();

  // Calculate statistics for daily view
  const getDailyStats = () => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    const dayRecords = mockAttendanceRecords.filter((r) => r.date === dateStr);
    
    return {
      total: dayRecords.length,
      present: dayRecords.filter((r) => r.status === "present" || r.status === "half-day").length,
      absent: dayRecords.filter((r) => r.status === "absent").length,
      onLeave: dayRecords.filter((r) => r.status === "on-leave").length,
      late: dayRecords.filter((r) => r.isLate).length,
    };
  };

  const stats = getDailyStats();

  // Navigate dates
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (viewMode === "daily") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  // Get status badge
  const getStatusBadge = (status: AttendanceRecord["status"]) => {
    switch (status) {
      case "present":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Present
          </Badge>
        );
      case "absent":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Absent
          </Badge>
        );
      case "half-day":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Minus className="h-3 w-3 mr-1" />
            Half Day
          </Badge>
        );
      case "on-leave":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <CalendarIcon className="h-3 w-3 mr-1" />
            On Leave
          </Badge>
        );
      case "week-off":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <Minus className="h-3 w-3 mr-1" />
            Week Off
          </Badge>
        );
      case "holiday":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            <CalendarIcon className="h-3 w-3 mr-1" />
            Holiday
          </Badge>
        );
      default:
        return null;
    }
  };

  // Format date display
  const formatDateDisplay = () => {
    if (viewMode === "daily") {
      return selectedDate.toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else {
      return selectedDate.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card className="p-6">
        <div className="space-y-4">
          {/* View Mode Toggle & Date Navigation */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "daily" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("daily")}
              >
                Daily View
              </Button>
              <Button
                variant={viewMode === "monthly" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("monthly")}
              >
                Monthly View
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigateDate("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-[280px] text-center">
                <p className="font-semibold">{formatDateDisplay()}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigateDate("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            </div>
          </div>

          {/* Statistics Cards - Daily View */}
          {viewMode === "daily" && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-indigo-900">{stats.total}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Present</p>
                <p className="text-2xl font-bold text-green-900">{stats.present}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Absent</p>
                <p className="text-2xl font-bold text-red-900">{stats.absent}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">On Leave</p>
                <p className="text-2xl font-bold text-blue-900">{stats.onLeave}</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Late Arrivals</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.late}</p>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Employee ID or Name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="half-day">Half Day</SelectItem>
                <SelectItem value="on-leave">On Leave</SelectItem>
                <SelectItem value="week-off">Week Off</SelectItem>
              </SelectContent>
            </Select>

            {/* Export Button */}
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Attendance Table */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">
              Attendance Records ({filteredRecords.length})
            </h3>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-sm font-semibold">Employee ID</th>
                  <th className="text-left p-3 text-sm font-semibold">Name</th>
                  {viewMode === "monthly" && (
                    <th className="text-left p-3 text-sm font-semibold">Date</th>
                  )}
                  <th className="text-left p-3 text-sm font-semibold">Status</th>
                  <th className="text-left p-3 text-sm font-semibold">Clock In</th>
                  <th className="text-left p-3 text-sm font-semibold">Clock Out</th>
                  <th className="text-left p-3 text-sm font-semibold">Work Hours</th>
                  <th className="text-left p-3 text-sm font-semibold">Overtime</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan={viewMode === "monthly" ? 8 : 7}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No attendance records found for this {viewMode === "daily" ? "day" : "month"}.
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-t hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-3">
                        <span className="font-mono font-semibold text-indigo-600">
                          {record.employeeId}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-semibold text-sm">
                            {record.employeeName.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{record.employeeName}</span>
                        </div>
                      </td>
                      {viewMode === "monthly" && (
                        <td className="p-3 text-sm">
                          {new Date(record.date).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </td>
                      )}
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getStatusBadge(record.status)}
                          {record.isLate && (
                            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Late
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        {record.clockIn ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {record.clockIn}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-3 text-sm">
                        {record.clockOut ? (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            {record.clockOut}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-3 text-sm font-semibold">
                        {record.workHours ? `${record.workHours}h` : "-"}
                      </td>
                      <td className="p-3 text-sm">
                        {record.overtime ? (
                          <span className="text-green-700 font-semibold">
                            +{record.overtime}h
                          </span>
                        ) : (
                          "-"
                        )}
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
