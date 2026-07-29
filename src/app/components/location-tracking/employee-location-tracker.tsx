import { useState } from "react";
import { MapPin, Users, Navigation, TrendingUp, Filter, Download, RefreshCw, Map, Grid } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { EmployeeMapView } from "@/app/components/location-tracking/employee-map-view";

const mockEmployees = [
  {
    id: "1",
    name: "Rajesh Kumar",
    role: "Field Supervisor",
    location: "Andheri West, Mumbai",
    status: "active",
    lastUpdate: "2m ago",
    battery: 85,
    signal: "strong",
    distance: 12.5,
  },
  {
    id: "2",
    name: "Priya Sharma",
    role: "Quality Inspector",
    location: "Malad West, Mumbai",
    status: "active",
    lastUpdate: "5m ago",
    battery: 92,
    signal: "strong",
    distance: 8.3,
  },
  {
    id: "3",
    name: "Amit Patel",
    role: "Delivery Agent",
    location: "Bandra West, Mumbai",
    status: "active",
    lastUpdate: "1m ago",
    battery: 45,
    signal: "medium",
    distance: 15.7,
  },
  {
    id: "4",
    name: "Sunita Desai",
    role: "Field Supervisor",
    location: "Worli, Mumbai",
    status: "idle",
    lastUpdate: "15m ago",
    battery: 68,
    signal: "strong",
    distance: 5.2,
  },
  {
    id: "5",
    name: "Vikram Singh",
    role: "Delivery Agent",
    location: "Powai, Mumbai",
    status: "offline",
    lastUpdate: "45m ago",
    battery: 12,
    signal: "weak",
    distance: 0,
  },
];

export function EmployeeLocationTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredEmployees = mockEmployees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || emp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: mockEmployees.length,
    active: mockEmployees.filter((e) => e.status === "active").length,
    idle: mockEmployees.filter((e) => e.status === "idle").length,
    offline: mockEmployees.filter((e) => e.status === "offline").length,
    avgDistance: (mockEmployees.reduce((sum, e) => sum + e.distance, 0) / mockEmployees.length).toFixed(1),
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Employee Location Tracker</h1>
        <p className="text-sm text-gray-500 mt-2">Real-time tracking of field employees</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-indigo-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <Navigation className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Idle</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.idle}</p>
            </div>
            <MapPin className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-gray-600">{stats.offline}</p>
            </div>
            <MapPin className="h-8 w-8 text-gray-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Distance</p>
              <p className="text-2xl font-bold text-blue-600">{stats.avgDistance}km</p>
            </div>
            <TrendingUp className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
      </div>

      {/* Controls */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-1 gap-3 w-full md:w-auto">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="idle">Idle</option>
              <option value="offline">Offline</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="list">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="list">
            <Grid className="h-4 w-4 mr-2" />
            List
          </TabsTrigger>
          <TabsTrigger value="map">
            <Map className="h-4 w-4 mr-2" />
            Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {/* Employee Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                    <p className="text-sm text-gray-600">{employee.role}</p>
                  </div>
                  <Badge variant="outline" className={getStatusBadge(employee.status)}>
                    {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <p className="text-sm text-gray-700">{employee.location}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Update:</span>
                    <span className="font-medium text-gray-900">{employee.lastUpdate}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-medium text-gray-900">{employee.distance} km</span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${getBatteryColor(employee.battery)}`}>
                        Battery: {employee.battery}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-700 capitalize">
                        Signal: {employee.signal}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map">
          <EmployeeMapView />
        </TabsContent>
      </Tabs>
    </div>
  );
}