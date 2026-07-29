import {
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Clock,
  Key,
  User as UserIcon,
  Briefcase,
  Heart,
  Users as UsersIcon,
  CheckCircle2,
  XCircle,
  Activity,
  Lock,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { type User } from "@/app/data/mock-users";
import { roles, allPermissions } from "@/app/data/mock-users";
import { useState } from "react";

interface UserDetailsModalProps {
  user: User;
  onClose: () => void;
  onEdit: () => void;
}

export function UserDetailsModal({ user, onClose, onEdit }: UserDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "permissions" | "activity" | "security">(
    "info"
  );

  const roleInfo = roles.find((r) => r.name === user.role);
  const userPermissions = allPermissions.filter((p) => user.permissions.includes(p.id));

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return "Never";
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Mock activity data
  const activityLog = [
    {
      id: 1,
      action: "Login",
      description: "Logged in from 192.168.1.100",
      timestamp: new Date("2026-01-26T08:30:00"),
      type: "success",
    },
    {
      id: 2,
      action: "Updated Profile",
      description: "Changed phone number",
      timestamp: new Date("2026-01-25T14:20:00"),
      type: "info",
    },
    {
      id: 3,
      action: "Password Changed",
      description: "Password updated successfully",
      timestamp: new Date("2026-01-20T10:15:00"),
      type: "success",
    },
    {
      id: 4,
      action: "Failed Login",
      description: "Failed login attempt from 192.168.1.200",
      timestamp: new Date("2026-01-18T22:45:00"),
      type: "warning",
    },
    {
      id: 5,
      action: "Logout",
      description: "Logged out",
      timestamp: new Date("2026-01-18T18:00:00"),
      type: "info",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {user.firstName[0]}
                {user.lastName[0]}
              </div>

              {/* Name and Role */}
              <div>
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-indigo-100 text-sm mt-1">
                  {user.employeeId} • {user.designation}
                </p>
                <div className="flex gap-2 mt-2">
                  {roleInfo && (
                    <Badge
                      variant="outline"
                      className="bg-white/20 text-white border-white/30"
                    >
                      <Shield className="h-3 w-3 mr-1" />
                      {roleInfo.displayName}
                    </Badge>
                  )}
                  <Badge
                    variant="outline"
                    className={
                      user.status === "active"
                        ? "bg-green-500/20 text-white border-green-300"
                        : "bg-gray-500/20 text-white border-gray-300"
                    }
                  >
                    {user.status === "active" ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "info"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserIcon className="h-4 w-4 inline-block mr-2" />
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab("permissions")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "permissions"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Shield className="h-4 w-4 inline-block mr-2" />
              Permissions ({userPermissions.length})
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "activity"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Activity className="h-4 w-4 inline-block mr-2" />
              Activity Log
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "security"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Lock className="h-4 w-4 inline-block mr-2" />
              Security
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Personal Info Tab */}
          {activeTab === "info" && (
            <div className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Contact Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Emergency Contact</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user.emergencyContact}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm font-medium text-gray-900">
                        {user.city}, {user.state}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-1">Full Address</p>
                  <p className="text-sm font-medium text-gray-900">
                    {user.address}, {user.city}, {user.state} - {user.pincode}
                  </p>
                </div>
              </div>

              {/* Professional Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Professional Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Employee ID</p>
                    <p className="text-sm font-medium text-gray-900">{user.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-medium text-gray-900">{user.department}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Designation</p>
                    <p className="text-sm font-medium text-gray-900">{user.designation}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reporting Manager</p>
                    <p className="text-sm font-medium text-gray-900">
                      {user.reportingManager || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date of Joining</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(user.dateOfJoining)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Login</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDateTime(user.lastLogin)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Personal Details
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(user.dateOfBirth)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Gender</p>
                    <p className="text-sm font-medium text-gray-900">{user.gender}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Blood Group</p>
                    <p className="text-sm font-medium text-gray-900">{user.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Marital Status</p>
                    <p className="text-sm font-medium text-gray-900">
                      {user.maritalStatus}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Permissions Tab */}
          {activeTab === "permissions" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Role-Based Permissions
                </h4>
                <p className="text-sm text-blue-700">
                  User has <strong>{userPermissions.length} permissions</strong> based on
                  the <strong>{roleInfo?.displayName}</strong> role.
                </p>
              </div>

              {/* Group permissions by module */}
              {Object.entries(
                userPermissions.reduce((acc, perm) => {
                  if (!acc[perm.module]) acc[perm.module] = [];
                  acc[perm.module].push(perm);
                  return acc;
                }, {} as Record<string, typeof userPermissions>)
              ).map(([module, perms]) => (
                <div key={module} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">{module}</h4>
                  <div className="space-y-2">
                    {perms.map((perm) => (
                      <div
                        key={perm.id}
                        className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {perm.feature}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{perm.description}</p>
                        </div>
                        <div className="flex gap-1 ml-4">
                          {perm.actions.map((action) => (
                            <Badge
                              key={action}
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 text-xs"
                            >
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Activity Log Tab */}
          {activeTab === "activity" && (
            <div className="space-y-3">
              {activityLog.map((activity) => {
                const typeConfig = {
                  success: {
                    bg: "bg-green-100",
                    icon: "text-green-600",
                    border: "border-green-200",
                  },
                  warning: {
                    bg: "bg-yellow-100",
                    icon: "text-yellow-600",
                    border: "border-yellow-200",
                  },
                  info: {
                    bg: "bg-blue-100",
                    icon: "text-blue-600",
                    border: "border-blue-200",
                  },
                };

                const config =
                  typeConfig[activity.type as keyof typeof typeConfig] || typeConfig.info;

                return (
                  <div
                    key={activity.id}
                    className={`p-4 rounded-lg border ${config.border} ${config.bg}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Activity className={`h-5 w-5 ${config.icon} mt-0.5`} />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatDateTime(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Security Status */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        user.twoFactorEnabled ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      <Shield
                        className={`h-5 w-5 ${
                          user.twoFactorEnabled ? "text-green-600" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Two-Factor Auth</p>
                      <p className="text-lg font-bold text-gray-900">
                        {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Session Timeout</p>
                      <p className="text-lg font-bold text-gray-900">
                        {user.sessionTimeout} min
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Key className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Password Change</p>
                      <p className="text-sm font-bold text-gray-900">
                        {formatDate(user.lastPasswordChange)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        user.failedLoginAttempts > 0 ? "bg-red-100" : "bg-green-100"
                      }`}
                    >
                      <XCircle
                        className={`h-5 w-5 ${
                          user.failedLoginAttempts > 0 ? "text-red-600" : "text-green-600"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Failed Logins</p>
                      <p className="text-lg font-bold text-gray-900">
                        {user.failedLoginAttempts}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Login Statistics */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Login Statistics
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Total Logins</p>
                    <p className="text-2xl font-bold text-gray-900">{user.loginCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Login</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDateTime(user.lastLogin)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3">
            <Button onClick={onEdit} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
              Edit User
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
