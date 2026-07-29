import { Card } from "@/app/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  iconBgColor?: string;
  iconColor?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  iconBgColor = "bg-indigo-100",
  iconColor = "text-indigo-600"
}: StatCardProps) {
  return (
    <Card className="p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1 truncate">{title}</p>
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-2 truncate">{value}</h3>
          {trend && (
            <div className="flex items-center gap-1 flex-wrap">
              <span className={`text-xs sm:text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {trend.value}
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-lg ${iconBgColor} flex-shrink-0`}>
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
}
