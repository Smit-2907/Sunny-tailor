/**
 * Fabric Inventory Demo Component
 * 
 * This component demonstrates how the Fabric Inventory Screen
 * adapts to different user roles with proper access control.
 */

import { useState } from "react";
import { FabricInventoryScreen } from "@/app/components/inventory/fabric-inventory-screen";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Shield, Lock, Edit, Eye } from "lucide-react";

export function FabricInventoryDemo() {
  const [selectedRole, setSelectedRole] = useState("fabric-store");

  const roles = [
    {
      id: "master-manager",
      name: "Master Manager",
      color: "purple",
      icon: Shield,
      access: "Full Edit Access",
      canEdit: true,
    },
    {
      id: "fabric-store",
      name: "Fabric Store",
      color: "green",
      icon: Edit,
      access: "Full Edit Access",
      canEdit: true,
    },
    {
      id: "hr",
      name: "HR",
      color: "blue",
      icon: Eye,
      access: "View-Only Access",
      canEdit: false,
    },
    {
      id: "production",
      name: "Production Manager",
      color: "indigo",
      icon: Eye,
      access: "View-Only Access",
      canEdit: false,
    },
    {
      id: "measurement-expert",
      name: "Measurement Expert",
      color: "cyan",
      icon: Lock,
      access: "View-Only Access",
      canEdit: false,
    },
  ];

  const currentRoleData = roles.find((r) => r.id === selectedRole);

  return (
    <div className="space-y-6">
      {/* Role Selector Card */}
      <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">
              Role-Based Access Control Demo
            </h3>
            <p className="text-sm text-indigo-700">
              Switch between different user roles to see how the Fabric Inventory screen adapts
              based on permissions. Notice how editing capabilities are disabled for restricted
              users.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {roles.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole === role.id;

              return (
                <Button
                  key={role.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRole(role.id)}
                  className={
                    isSelected
                      ? `bg-${role.color}-600 hover:bg-${role.color}-700`
                      : `border-${role.color}-200 hover:bg-${role.color}-50`
                  }
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {role.name}
                  {role.canEdit && (
                    <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Can Edit</Badge>
                  )}
                  {!role.canEdit && (
                    <Badge className="ml-2 bg-gray-100 text-gray-800 text-xs">View Only</Badge>
                  )}
                </Button>
              );
            })}
          </div>

          {/* Current Role Info */}
          {currentRoleData && (
            <Card className="p-4 bg-white border-indigo-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-${currentRoleData.color}-100 flex items-center justify-center`}
                  >
                    <currentRoleData.icon className={`h-5 w-5 text-${currentRoleData.color}-600`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Currently Viewing As: {currentRoleData.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{currentRoleData.access}</p>
                  </div>
                </div>
                <Badge
                  className={
                    currentRoleData.canEdit
                      ? "bg-green-100 text-green-800 border-green-200"
                      : "bg-gray-100 text-gray-800 border-gray-200"
                  }
                >
                  {currentRoleData.canEdit ? (
                    <>
                      <Edit className="h-3 w-3 mr-1" />
                      Can Update Stock
                    </>
                  ) : (
                    <>
                      <Lock className="h-3 w-3 mr-1" />
                      Read-Only
                    </>
                  )}
                </Badge>
              </div>
            </Card>
          )}

          {/* Key Differences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-3 bg-green-50 border-green-200">
              <h4 className="font-semibold text-green-900 mb-2 text-sm">
                ✅ With Edit Access (Fabric Store + Master Admin)
              </h4>
              <ul className="text-xs text-green-700 space-y-1">
                <li>• "Update Stock" button available</li>
                <li>• Can add/remove stock quantities</li>
                <li>• Stock adjustment form enabled</li>
                <li>• Can add new fabric items</li>
                <li>• Save changes button active</li>
              </ul>
            </Card>

            <Card className="p-3 bg-gray-50 border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                🔒 View-Only Access (Other Roles)
              </h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• "View Details" button instead of update</li>
                <li>• Blue notice banner displayed</li>
                <li>• Input fields disabled/read-only</li>
                <li>• No add fabric button shown</li>
                <li>• Lock icon indicators visible</li>
              </ul>
            </Card>
          </div>
        </div>
      </Card>

      {/* Actual Fabric Inventory Screen */}
      <FabricInventoryScreen currentRole={selectedRole} />
    </div>
  );
}
