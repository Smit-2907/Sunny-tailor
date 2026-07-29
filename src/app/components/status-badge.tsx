import { Badge } from "@/app/components/ui/badge";

type StatusType = 
  | "pending" 
  | "in-progress" 
  | "completed" 
  | "cancelled" 
  | "delayed"
  | "approved"
  | "rejected"
  | "active"
  | "inactive";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
  },
  delayed: {
    label: "Delayed",
    className: "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-100",
  },
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100",
  },
  active: {
    label: "Active",
    className: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100",
  },
  inactive: {
    label: "Inactive",
    className: "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100",
  },
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant="outline" className={`${config.className} font-medium`}>
      {label || config.label}
    </Badge>
  );
}
