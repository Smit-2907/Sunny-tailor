import { useState } from "react";
import {
  Calendar as CalendarIcon,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Plus,
  FileText,
  TrendingDown,
  AlertCircle,
  Send,
  X as XIcon,
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
import {
  mockLeaveApplications,
  mockLeaveBalances,
  LeaveApplication,
  LeaveBalance,
} from "@/app/data/mock-attendance-data";

export function LeaveManagement() {
  const [activeTab, setActiveTab] = useState<"overview" | "applications" | "apply">("overview");
  const [selectedApplication, setSelectedApplication] = useState<LeaveApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  // Form state for leave application
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  // Calculate total days
  const calculateDays = (from: string, to: string): number => {
    if (!from || !to) return 0;
    const start = new Date(from);
    const end = new Date(to);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Get status badge for leave application
  const getStatusBadge = (status: LeaveApplication["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
    }
  };

  // Get leave type badge
  const getLeaveTypeBadge = (type: LeaveApplication["leaveType"]) => {
    const colors = {
      casual: "bg-blue-100 text-blue-800 border-blue-200",
      sick: "bg-orange-100 text-orange-800 border-orange-200",
      earned: "bg-purple-100 text-purple-800 border-purple-200",
      compensatory: "bg-green-100 text-green-800 border-green-200",
      maternity: "bg-pink-100 text-pink-800 border-pink-200",
      paternity: "bg-indigo-100 text-indigo-800 border-indigo-200",
    };

    const labels = {
      casual: "Casual Leave",
      sick: "Sick Leave",
      earned: "Earned Leave",
      compensatory: "Comp Off",
      maternity: "Maternity Leave",
      paternity: "Paternity Leave",
    };

    return (
      <Badge className={colors[type]}>
        {labels[type]}
      </Badge>
    );
  };

  // Filter leave applications
  const filteredApplications = mockLeaveApplications.filter((app) => {
    if (statusFilter === "all") return true;
    return app.status === statusFilter;
  });

  // Calculate leave statistics
  const leaveStats = {
    pending: mockLeaveApplications.filter((a) => a.status === "pending").length,
    approved: mockLeaveApplications.filter((a) => a.status === "approved").length,
    rejected: mockLeaveApplications.filter((a) => a.status === "rejected").length,
    total: mockLeaveApplications.length,
  };

  // Handle leave application submission
  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Leave application submitted:", leaveForm);
    // Reset form
    setLeaveForm({
      leaveType: "",
      fromDate: "",
      toDate: "",
      reason: "",
    });
    setActiveTab("applications");
  };

  // Handle approve/reject
  const handleApprove = (applicationId: string) => {
    console.log("Approved:", applicationId);
    setSelectedApplication(null);
  };

  const handleReject = (applicationId: string) => {
    console.log("Rejected:", applicationId);
    setSelectedApplication(null);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "overview"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Leave Balance Overview
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "applications"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Leave Applications
          {leaveStats.pending > 0 && (
            <Badge className="ml-2 bg-yellow-500 text-white">{leaveStats.pending}</Badge>
          )}
        </button>
        <button
          onClick={() => setActiveTab("apply")}
          className={`px-4 py-2 font-medium border-b-2 transition-colors ${
            activeTab === "apply"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Apply for Leave
        </button>
      </div>

      {/* Overview Tab - Leave Balance for All Employees */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Employee Leave Balance</h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold">Employee ID</th>
                    <th className="text-left p-3 text-sm font-semibold">Name</th>
                    <th className="text-center p-3 text-sm font-semibold">Casual Leave</th>
                    <th className="text-center p-3 text-sm font-semibold">Sick Leave</th>
                    <th className="text-center p-3 text-sm font-semibold">Earned Leave</th>
                    <th className="text-center p-3 text-sm font-semibold">Comp Off</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeaveBalances.map((balance) => (
                    <tr key={balance.employeeId} className="border-t hover:bg-muted/50">
                      <td className="p-3">
                        <span className="font-mono font-semibold text-indigo-600">
                          {balance.employeeId}
                        </span>
                      </td>
                      <td className="p-3 font-medium">{balance.employeeName}</td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-lg">
                            {balance.casual.available}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            of {balance.casual.total}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-lg">
                            {balance.sick.available}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            of {balance.sick.total}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-lg">
                            {balance.earned.available}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            of {balance.earned.total}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-semibold text-lg">
                            {balance.compensatory.available}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            of {balance.compensatory.total}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 border-2 border-indigo-200 bg-indigo-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Applications</p>
                  <p className="text-2xl font-bold text-indigo-900">{leaveStats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-indigo-600" />
              </div>
            </Card>

            <Card className="p-4 border-2 border-yellow-200 bg-yellow-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">{leaveStats.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </Card>

            <Card className="p-4 border-2 border-green-200 bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-900">{leaveStats.approved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-4 border-2 border-red-200 bg-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-900">{leaveStats.rejected}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </Card>
          </div>

          {/* Filter */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Label className="font-semibold">Filter by Status:</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          {/* Leave Applications Table */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">
              Leave Applications ({filteredApplications.length})
            </h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="text-left p-3 text-sm font-semibold">Employee</th>
                    <th className="text-left p-3 text-sm font-semibold">Leave Type</th>
                    <th className="text-left p-3 text-sm font-semibold">From Date</th>
                    <th className="text-left p-3 text-sm font-semibold">To Date</th>
                    <th className="text-center p-3 text-sm font-semibold">Days</th>
                    <th className="text-left p-3 text-sm font-semibold">Applied On</th>
                    <th className="text-left p-3 text-sm font-semibold">Status</th>
                    <th className="text-left p-3 text-sm font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((application) => (
                    <tr key={application.id} className="border-t hover:bg-muted/50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium">{application.employeeName}</p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {application.employeeId}
                          </p>
                        </div>
                      </td>
                      <td className="p-3">{getLeaveTypeBadge(application.leaveType)}</td>
                      <td className="p-3 text-sm">
                        {new Date(application.fromDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-3 text-sm">
                        {new Date(application.toDate).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="p-3 text-center">
                        <span className="font-semibold">{application.totalDays}</span>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">
                        {new Date(application.appliedOn).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </td>
                      <td className="p-3">{getStatusBadge(application.status)}</td>
                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedApplication(application)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Apply Leave Tab */}
      {activeTab === "apply" && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-6">Apply for Leave</h3>
          <form onSubmit={handleSubmitLeave} className="space-y-6 max-w-2xl">
            {/* Leave Type */}
            <div className="space-y-2">
              <Label htmlFor="leaveType">Leave Type *</Label>
              <Select
                value={leaveForm.leaveType}
                onValueChange={(value) =>
                  setLeaveForm({ ...leaveForm, leaveType: value })
                }
              >
                <SelectTrigger id="leaveType">
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="earned">Earned Leave</SelectItem>
                  <SelectItem value="compensatory">Compensatory Off</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate">From Date *</Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={leaveForm.fromDate}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, fromDate: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="toDate">To Date *</Label>
                <Input
                  id="toDate"
                  type="date"
                  value={leaveForm.toDate}
                  onChange={(e) =>
                    setLeaveForm({ ...leaveForm, toDate: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* Total Days Display */}
            {leaveForm.fromDate && leaveForm.toDate && (
              <Card className="p-4 bg-indigo-50 border-indigo-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Days:</span>
                  <span className="text-2xl font-bold text-indigo-900">
                    {calculateDays(leaveForm.fromDate, leaveForm.toDate)} days
                  </span>
                </div>
              </Card>
            )}

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason *</Label>
              <textarea
                id="reason"
                value={leaveForm.reason}
                onChange={(e) =>
                  setLeaveForm({ ...leaveForm, reason: e.target.value })
                }
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Please provide reason for leave..."
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Submit Leave Application
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setLeaveForm({
                    leaveType: "",
                    fromDate: "",
                    toDate: "",
                    reason: "",
                  })
                }
              >
                <XIcon className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Leave Application Details Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">Leave Application Details</h3>
                  <p className="text-sm text-muted-foreground">
                    Application ID: {selectedApplication.id}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedApplication(null)}
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>

              {/* Employee Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Employee Name</p>
                  <p className="font-semibold">{selectedApplication.employeeName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee ID</p>
                  <p className="font-mono font-semibold">
                    {selectedApplication.employeeId}
                  </p>
                </div>
              </div>

              {/* Leave Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Leave Type</p>
                    {getLeaveTypeBadge(selectedApplication.leaveType)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Status</p>
                    {getStatusBadge(selectedApplication.status)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">From Date</p>
                    <p className="font-semibold">
                      {new Date(selectedApplication.fromDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">To Date</p>
                    <p className="font-semibold">
                      {new Date(selectedApplication.toDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Total Days</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {selectedApplication.totalDays} days
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reason</p>
                  <p className="p-3 bg-muted rounded-lg">{selectedApplication.reason}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Applied On</p>
                  <p className="font-semibold">
                    {new Date(selectedApplication.appliedOn).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {selectedApplication.approvedBy && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Approved By</p>
                      <p className="font-semibold">{selectedApplication.approvedBy}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Approved On</p>
                      <p className="font-semibold">
                        {selectedApplication.approvedOn &&
                          new Date(selectedApplication.approvedOn).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }
                          )}
                      </p>
                    </div>
                  </div>
                )}

                {selectedApplication.rejectionReason && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Rejection Reason</p>
                    <p className="text-red-900">{selectedApplication.rejectionReason}</p>
                  </div>
                )}
              </div>

              {/* Actions - Only for pending applications */}
              {selectedApplication.status === "pending" && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => handleApprove(selectedApplication.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleReject(selectedApplication.id)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}