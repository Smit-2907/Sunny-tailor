/**
 * Raw Material Inventory Demo Component
 * 
 * Demonstrates the enhanced UX features including:
 * - Role-based access control
 * - Lock icons with tooltips
 * - Contextual help system
 * - Permission explanations
 */

import { useState } from "react";
import { RawMaterialInventoryScreen } from "@/app/components/inventory/raw-material-inventory-screen";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Shield, Lock, Edit, Eye, Info, HelpCircle, Lightbulb } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

export function RawMaterialInventoryDemo() {
  const [selectedRole, setSelectedRole] = useState("raw-material");

  const roles = [
    {
      id: "master-manager",
      name: "Master Manager",
      color: "purple",
      icon: Shield,
      access: "Full Edit Access",
      canEdit: true,
      description: "Complete control over all inventory operations",
    },
    {
      id: "raw-material",
      name: "Raw Material Store",
      color: "green",
      icon: Edit,
      access: "Full Edit Access",
      canEdit: true,
      description: "Can manage and update raw material inventory",
    },
    {
      id: "production",
      name: "Production Manager",
      color: "blue",
      icon: Eye,
      access: "View-Only Access",
      canEdit: false,
      description: "Can view inventory but cannot make changes",
    },
    {
      id: "hr",
      name: "HR",
      color: "indigo",
      icon: Lock,
      access: "View-Only Access",
      canEdit: false,
      description: "Read-only access with lock icons and tooltips",
    },
    {
      id: "dispatch",
      name: "Dispatch",
      color: "cyan",
      icon: Lock,
      access: "View-Only Access",
      canEdit: false,
      description: "Can check stock levels but cannot edit",
    },
  ];

  const currentRoleData = roles.find((r) => r.id === selectedRole);

  const tooltipFeatures = [
    {
      icon: Lock,
      title: "Lock Icons",
      description: "Visual indicators on restricted features with explanatory tooltips",
      color: "red",
    },
    {
      icon: Info,
      title: "Info Tooltips",
      description: "Contextual help on reorder points, lead times, and stock levels",
      color: "blue",
    },
    {
      icon: HelpCircle,
      title: "Help Text",
      description: "Inline explanations for all actions and permissions",
      color: "green",
    },
    {
      icon: Lightbulb,
      title: "Smart Alerts",
      description: "Proactive notifications with actionable insights",
      color: "yellow",
    },
  ];

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Feature Showcase Card */}
        <Card className="p-6 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border-indigo-200">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-indigo-900">
                  🎯 Enhanced Raw Material Inventory with Tooltips
                </h3>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-5 w-5 text-indigo-600" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      This demo showcases role-based access control with lock icons and
                      comprehensive tooltip system for better user experience
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm text-indigo-700">
                Switch between roles to see how tooltips and lock icons adapt. Hover over icons for
                detailed explanations.
              </p>
            </div>

            {/* Role Selector */}
            <div>
              <h4 className="font-semibold text-sm text-indigo-900 mb-3">Select User Role:</h4>
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.id;

                  return (
                    <Tooltip key={role.id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedRole(role.id)}
                          className={
                            isSelected
                              ? "bg-indigo-600 hover:bg-indigo-700"
                              : "border-gray-200 hover:bg-gray-50"
                          }
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {role.name}
                          {role.canEdit && (
                            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                              Can Edit
                            </Badge>
                          )}
                          {!role.canEdit && (
                            <Badge className="ml-2 bg-gray-100 text-gray-800 text-xs flex items-center gap-1">
                              <Lock className="h-2 w-2" />
                              View Only
                            </Badge>
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">{role.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            {/* Current Role Info */}
            {currentRoleData && (
              <Card className="p-4 bg-white border-indigo-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                      <currentRoleData.icon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        Currently Viewing As: {currentRoleData.name}
                      </p>
                      <p className="text-sm text-muted-foreground">{currentRoleData.access}</p>
                    </div>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        className={
                          currentRoleData.canEdit
                            ? "bg-green-100 text-green-800 border-green-200 cursor-help"
                            : "bg-gray-100 text-gray-800 border-gray-200 cursor-help"
                        }
                      >
                        {currentRoleData.canEdit ? (
                          <>
                            <Edit className="h-3 w-3 mr-1" />
                            Full Access
                          </>
                        ) : (
                          <>
                            <Lock className="h-3 w-3 mr-1" />
                            Read-Only
                          </>
                        )}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        {currentRoleData.canEdit
                          ? "You can view and edit all inventory data, add new materials, and adjust stock levels"
                          : "You can view all inventory data but cannot make changes. Hover over lock icons to learn more."}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </Card>
            )}

            {/* Tooltip Features Grid */}
            <div>
              <h4 className="font-semibold text-sm text-indigo-900 mb-3">
                Enhanced UX Features:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {tooltipFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <Card
                          className={`p-3 bg-${feature.color}-50 border-${feature.color}-200 cursor-help hover:shadow-md transition-shadow`}
                        >
                          <div className="flex items-start gap-2">
                            <Icon className={`h-4 w-4 text-${feature.color}-600 flex-shrink-0`} />
                            <div>
                              <h5 className={`font-semibold text-xs text-${feature.color}-900`}>
                                {feature.title}
                              </h5>
                              <p className={`text-xs text-${feature.color}-700 mt-0.5`}>
                                {feature.description.substring(0, 40)}...
                              </p>
                            </div>
                          </div>
                        </Card>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-xs">{feature.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </div>

            {/* Access Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-start gap-2 mb-2">
                  <Edit className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-green-900 text-sm">
                    ✅ With Edit Access (Raw Material + Master Admin)
                  </h4>
                </div>
                <ul className="text-xs text-green-700 space-y-1 ml-6">
                  <li>• "Update Stock" button available</li>
                  <li>• Can add/remove stock quantities</li>
                  <li>• Stock adjustment form enabled</li>
                  <li>• Can add new material items</li>
                  <li>• All tooltips provide contextual help</li>
                  <li>• No lock icons on actions</li>
                </ul>
              </Card>

              <Card className="p-4 bg-gray-50 border-gray-200">
                <div className="flex items-start gap-2 mb-2">
                  <Lock className="h-4 w-4 text-gray-600 flex-shrink-0 mt-0.5" />
                  <h4 className="font-semibold text-gray-900 text-sm">
                    🔒 View-Only Access (All Other Roles)
                  </h4>
                </div>
                <ul className="text-xs text-gray-700 space-y-1 ml-6">
                  <li>• "View Details" button with tooltip</li>
                  <li>• Blue notice banner displayed</li>
                  <li>• Lock icons on disabled features</li>
                  <li>• Tooltips explain restrictions</li>
                  <li>• Input fields disabled/read-only</li>
                  <li>• No add material button shown</li>
                </ul>
              </Card>
            </div>

            {/* Tooltip Examples */}
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-2 mb-3">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 text-sm mb-1">
                    💡 Tooltip Examples (Hover to Try)
                  </h4>
                  <p className="text-xs text-blue-700">
                    The inventory screen includes these helpful tooltips:
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 ml-6">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="cursor-help bg-white border-blue-300">
                      <Lock className="h-3 w-3 mr-1" />
                      Locked Button
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      Adding new materials requires Raw Material Store or Master Admin role
                    </p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="cursor-help bg-white border-blue-300">
                      <Info className="h-3 w-3 mr-1" />
                      Reorder Point
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      Stock level at which new orders should be placed
                    </p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="cursor-help bg-white border-blue-300">
                      <HelpCircle className="h-3 w-3 mr-1" />
                      Lead Time Info
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      Below reorder point! Lead time: 7 days - Order now to avoid stockout
                    </p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="cursor-help bg-white border-blue-300">
                      <Eye className="h-3 w-3 mr-1" />
                      View Action
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">View details (Read-only)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </Card>

            {/* Instructions */}
            <Card className="p-4 bg-purple-50 border-purple-200">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-purple-900 text-sm mb-1">
                    🎓 How to Explore
                  </h4>
                  <ul className="text-xs text-purple-700 space-y-1">
                    <li>1. Switch between different roles using the buttons above</li>
                    <li>2. Notice the blue banner for view-only users</li>
                    <li>3. Hover over lock icons to read permission explanations</li>
                    <li>4. Try clicking "Add Material" or "Update" buttons</li>
                    <li>5. Check the reorder point warnings with orange icons</li>
                    <li>6. Explore all tooltips throughout the interface</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        </Card>

        {/* Actual Raw Material Inventory Screen */}
        <RawMaterialInventoryScreen currentRole={selectedRole} />
      </div>
    </TooltipProvider>
  );
}
