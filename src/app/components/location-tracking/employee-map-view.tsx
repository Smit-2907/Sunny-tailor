import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { MapPin, Navigation, Battery, Signal, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";

// Employee data with coordinates (converted to percentage positions on map)
const employeesData = [
  {
    id: "1",
    name: "Rajesh Kumar",
    role: "Field Supervisor",
    // Andheri West position on Mumbai map (as percentage)
    position: { x: 35, y: 25 },
    status: "active",
    battery: 85,
    signal: "strong",
    lastUpdate: "2m ago",
    location: "Andheri West, Mumbai",
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "Quality Inspector",
    // Malad West position
    position: { x: 30, y: 15 },
    status: "active",
    battery: 92,
    signal: "strong",
    lastUpdate: "5m ago",
    location: "Malad West, Mumbai",
  },
  {
    id: "3",
    name: "Amit Patel",
    role: "Delivery Agent",
    // Bandra West position
    position: { x: 45, y: 50 },
    status: "active",
    battery: 45,
    signal: "medium",
    lastUpdate: "1m ago",
    location: "Bandra West, Mumbai",
  },
  {
    id: "4",
    name: "Sunita Desai",
    role: "Field Supervisor",
    // Worli position
    position: { x: 50, y: 60 },
    status: "idle",
    battery: 68,
    signal: "strong",
    lastUpdate: "15m ago",
    location: "Worli, Mumbai",
  },
  {
    id: "5",
    name: "Vikram Singh",
    role: "Delivery Agent",
    // Powai position
    position: { x: 70, y: 30 },
    status: "offline",
    battery: 12,
    signal: "weak",
    lastUpdate: "45m ago",
    location: "Powai, Mumbai",
  },
];

const getStatusColor = (status: string) => {
  return status === "active" ? "#10b981" : status === "idle" ? "#f59e0b" : "#9ca3af";
};

const getStatusBadge = (status: string) => {
  const styles = {
    active: "bg-green-50 text-green-700 border-green-200",
    idle: "bg-yellow-50 text-yellow-700 border-yellow-200",
    offline: "bg-gray-50 text-gray-700 border-gray-200",
  };
  return styles[status as keyof typeof styles] || styles.offline;
};

const getBatteryColor = (battery: number) => {
  if (battery > 50) return "text-green-600";
  if (battery > 20) return "text-yellow-600";
  return "text-red-600";
};

export function EmployeeMapView() {
  const [selectedEmployee, setSelectedEmployee] = useState<typeof employeesData[0] | null>(null);

  return (
    <Card className="overflow-hidden">
      <div className="h-[600px] relative bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Map Background with Grid */}
        <div className="absolute inset-0">
          {/* Grid pattern */}
          <svg className="w-full h-full opacity-10">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4f46e5" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          
          {/* Map Areas */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5">
            <MapPin className="h-64 w-64 text-indigo-600" />
          </div>
        </div>

        {/* Location Labels */}
        <div className="absolute top-4 left-4 space-y-1 z-10">
          <div className="text-xs font-semibold text-indigo-900 bg-white/80 backdrop-blur px-2 py-1 rounded">
            Mumbai Region
          </div>
          <div className="text-xs text-indigo-700 bg-white/60 backdrop-blur px-2 py-1 rounded">
            Real-time Employee Tracking
          </div>
        </div>

        {/* Employee Markers */}
        {employeesData.map((employee) => (
          <div
            key={employee.id}
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer group z-20"
            style={{
              left: `${employee.position.x}%`,
              top: `${employee.position.y}%`,
            }}
            onClick={() => setSelectedEmployee(employee)}
          >
            {/* Marker Pin */}
            <div className="relative">
              {/* Pin */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white transition-transform group-hover:scale-110"
                style={{ backgroundColor: getStatusColor(employee.status) }}
              >
                <MapPin className="h-5 w-5 text-white" />
              </div>
              
              {/* Pulse animation for active status */}
              {employee.status === "active" && (
                <div
                  className="absolute inset-0 rounded-full animate-ping opacity-75"
                  style={{ backgroundColor: getStatusColor(employee.status) }}
                />
              )}
              
              {/* Hover Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <div className="bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs">
                  <div className="font-semibold">{employee.name}</div>
                  <div className="text-gray-300">{employee.role}</div>
                </div>
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Map Legend */}
        <div className="absolute bottom-6 left-6 bg-white p-4 rounded-lg shadow-lg z-30">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Status Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-700">Active ({employeesData.filter(e => e.status === 'active').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-gray-700">Idle ({employeesData.filter(e => e.status === 'idle').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-xs text-gray-700">Offline ({employeesData.filter(e => e.status === 'offline').length})</span>
            </div>
          </div>
        </div>

        {/* Employee Details Popup */}
        {selectedEmployee && (
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => setSelectedEmployee(null)}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Employee Info */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedEmployee.name}</h3>
                  <p className="text-sm text-gray-600">{selectedEmployee.role}</p>
                </div>
                <Badge variant="outline" className={getStatusBadge(selectedEmployee.status)}>
                  {selectedEmployee.status.charAt(0).toUpperCase() + selectedEmployee.status.slice(1)}
                </Badge>
              </div>

              {/* Location */}
              <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                  <span className="text-gray-900 font-medium">{selectedEmployee.location}</span>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Battery className={`h-4 w-4 ${getBatteryColor(selectedEmployee.battery)}`} />
                    <span className="text-xs text-gray-600">Battery</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900">{selectedEmployee.battery}%</div>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Signal className="h-4 w-4 text-gray-600" />
                    <span className="text-xs text-gray-600">Signal</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900 capitalize">{selectedEmployee.signal}</div>
                </div>
              </div>

              {/* Last Update */}
              <div className="flex items-center gap-2 text-xs text-gray-500 border-t pt-3">
                <Navigation className="h-3 w-3" />
                <span>Last update: {selectedEmployee.lastUpdate}</span>
              </div>

              {/* Action Button */}
              <Button className="w-full mt-4" variant="outline">
                <Navigation className="h-4 w-4 mr-2" />
                Track in Real-time
              </Button>
            </div>
          </div>
        )}

        {/* Map Controls */}
        <div className="absolute top-6 right-6 space-y-2 z-30">
          <Button variant="outline" size="icon" className="bg-white shadow-lg">
            <span className="text-lg">+</span>
          </Button>
          <Button variant="outline" size="icon" className="bg-white shadow-lg">
            <span className="text-lg">−</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
