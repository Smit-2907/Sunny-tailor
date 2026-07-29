import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Shield, UserCog, Wrench, Eye } from "lucide-react";

type UserRole = "admin" | "manager" | "operator" | "viewer";

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const roles = [
  {
    value: "admin" as UserRole,
    label: "Administrator",
    description: "Full system access with all permissions",
    icon: Shield,
    color: "bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300"
  },
  {
    value: "manager" as UserRole,
    label: "Manager",
    description: "Access to analytics, operations, and reports",
    icon: UserCog,
    color: "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300"
  },
  {
    value: "operator" as UserRole,
    label: "Operator",
    description: "Production and inventory management access",
    icon: Wrench,
    color: "bg-green-100 text-green-700 hover:bg-green-200 border-green-300"
  },
  {
    value: "viewer" as UserRole,
    label: "Viewer",
    description: "Read-only access to dashboards and reports",
    icon: Eye,
    color: "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300"
  }
];

export function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="font-semibold text-lg">Switch User Role</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Select a role to see different menu items based on permissions
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = currentRole === role.value;
          
          return (
            <Button
              key={role.value}
              variant={isActive ? "default" : "outline"}
              className={`h-auto flex-col items-start p-4 ${
                isActive 
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600" 
                  : `${role.color} border-2`
              }`}
              onClick={() => onRoleChange(role.value)}
            >
              <Icon className={`h-6 w-6 mb-2 ${isActive ? 'text-white' : ''}`} />
              <span className="font-semibold text-sm mb-1">{role.label}</span>
              <span className={`text-xs text-left ${isActive ? 'text-indigo-100' : 'opacity-70'}`}>
                {role.description}
              </span>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
