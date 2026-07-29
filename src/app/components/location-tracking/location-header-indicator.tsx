import { useState } from "react";
import { MapPin, Navigation, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

interface LocationHeaderIndicatorProps {
  onViewFull?: () => void;
}

const mockEmployees = [
  { id: "1", name: "Rajesh Kumar", location: "Andheri West", status: "active" },
  { id: "2", name: "Priya Sharma", location: "Malad West", status: "active" },
  { id: "3", name: "Amit Patel", location: "Bandra West", status: "active" },
];

export function LocationHeaderIndicator({ onViewFull }: LocationHeaderIndicatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = mockEmployees.filter(e => e.status === "active").length;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 relative">
          <div className="relative">
            <MapPin className="h-5 w-5 text-indigo-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <span className="hidden md:inline text-sm font-medium text-gray-700">
            {activeCount} Active
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Live Tracking</h3>
                <p className="text-xs text-gray-600">Field Employees</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {activeCount} Active
            </Badge>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-lg p-2 text-center">
              <Users className="h-4 w-4 text-indigo-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-gray-900">5</p>
              <p className="text-xs text-gray-600">Total</p>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <Navigation className="h-4 w-4 text-green-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-gray-900">{activeCount}</p>
              <p className="text-xs text-gray-600">On Field</p>
            </div>
            <div className="bg-white rounded-lg p-2 text-center">
              <TrendingUp className="h-4 w-4 text-blue-600 mx-auto mb-1" />
              <p className="text-xs font-semibold text-gray-900">8.5km</p>
              <p className="text-xs text-gray-600">Avg Dist</p>
            </div>
          </div>
        </div>

        {/* Employee List */}
        <div className="p-3 space-y-2 max-h-64 overflow-y-auto">
          {mockEmployees.map((emp) => (
            <div
              key={emp.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="relative flex-shrink-0">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{emp.name}</p>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{emp.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t bg-gray-50">
          <Button
            variant="outline"
            size="sm"
            className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
            onClick={() => {
              setIsOpen(false);
              onViewFull?.();
            }}
          >
            <Navigation className="h-4 w-4 mr-2" />
            View Full Tracking Dashboard
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
