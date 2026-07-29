import { useState } from "react";
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Sun,
  Moon,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { PageHeader } from "@/app/components/page-header";
import { StatCard } from "@/app/components/stat-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";

interface DispatchOrder {
  id: string;
  poNumber: string;
  companyName: string;
  totalUnits: number;
  readyForDispatch: number;
  dispatchedUnits: number;
  pendingUnits: number;
  dispatchStatus: "ready" | "partial" | "dispatched" | "pending";
  dispatchShift: "morning" | "evening" | "both" | "none";
  dispatchDate: string;
  courierName?: string;
  trackingNumber?: string;
  bagCount?: number;
}

const mockDispatchOrders: DispatchOrder[] = [
  {
    id: "1",
    poNumber: "PO-2026-001",
    companyName: "ABC Garments",
    totalUnits: 500,
    readyForDispatch: 350,
    dispatchedUnits: 200,
    pendingUnits: 150,
    dispatchStatus: "partial",
    dispatchShift: "morning",
    dispatchDate: "2026-01-26",
    courierName: "Express Logistics",
    trackingNumber: "EXP123456789",
    bagCount: 20,
  },
  {
    id: "2",
    poNumber: "PO-2026-002",
    companyName: "XYZ Fashion",
    totalUnits: 300,
    readyForDispatch: 300,
    dispatchedUnits: 0,
    pendingUnits: 300,
    dispatchStatus: "ready",
    dispatchShift: "evening",
    dispatchDate: "2026-01-26",
    bagCount: 30,
  },
  {
    id: "3",
    poNumber: "PO-2026-003",
    companyName: "StyleCo",
    totalUnits: 450,
    readyForDispatch: 450,
    dispatchedUnits: 450,
    pendingUnits: 0,
    dispatchStatus: "dispatched",
    dispatchShift: "morning",
    dispatchDate: "2026-01-26",
    courierName: "Fast Courier",
    trackingNumber: "FC987654321",
    bagCount: 45,
  },
  {
    id: "4",
    poNumber: "PO-2026-004",
    companyName: "TrendWear",
    totalUnits: 600,
    readyForDispatch: 0,
    dispatchedUnits: 0,
    pendingUnits: 600,
    dispatchStatus: "pending",
    dispatchShift: "none",
    dispatchDate: "2026-01-28",
    bagCount: 0,
  },
  {
    id: "5",
    poNumber: "PO-2026-005",
    companyName: "Fashion Hub",
    totalUnits: 250,
    readyForDispatch: 250,
    dispatchedUnits: 0,
    pendingUnits: 250,
    dispatchStatus: "ready",
    dispatchShift: "evening",
    dispatchDate: "2026-01-26",
    bagCount: 25,
  },
];

export function DispatchManagementDashboard({ onManageBags }: { onManageBags: (poNumber: string, companyName: string) => void }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<DispatchOrder | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  // Calculate statistics
  const todayOrders = mockDispatchOrders.filter(
    (o) => o.dispatchDate === "2026-01-26"
  );
  const totalTodayUnits = todayOrders.reduce((sum, o) => sum + o.totalUnits, 0);
  const dispatchedToday = todayOrders.reduce((sum, o) => sum + o.dispatchedUnits, 0);
  const pendingToday = todayOrders.reduce((sum, o) => sum + o.pendingUnits, 0);

  const morningDispatch = todayOrders.filter(
    (o) => o.dispatchShift === "morning" || o.dispatchShift === "both"
  );
  const eveningDispatch = todayOrders.filter(
    (o) => o.dispatchShift === "evening" || o.dispatchShift === "both"
  );

  const morningUnits = morningDispatch.reduce((sum, o) => sum + o.dispatchedUnits, 0);
  const eveningUnits = eveningDispatch.reduce((sum, o) => sum + o.dispatchedUnits, 0);

  const readyForDispatch = mockDispatchOrders.filter(
    (o) => o.dispatchStatus === "ready"
  ).length;

  // Filter orders
  const filteredOrders = mockDispatchOrders.filter((order) => {
    const matchesSearch =
      order.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.dispatchStatus === statusFilter;

    const matchesShift =
      shiftFilter === "all" || order.dispatchShift === shiftFilter;

    return matchesSearch && matchesStatus && matchesShift;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "dispatched":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Dispatched
          </Badge>
        );
      case "ready":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Package className="h-3 w-3 mr-1" />
            Ready
          </Badge>
        );
      case "partial":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Partial
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const getShiftBadge = (shift: string) => {
    switch (shift) {
      case "morning":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            <Sun className="h-3 w-3 mr-1" />
            Morning
          </Badge>
        );
      case "evening":
        return (
          <Badge className="bg-indigo-100 text-indigo-800 border-indigo-200">
            <Moon className="h-3 w-3 mr-1" />
            Evening
          </Badge>
        );
      case "both":
        return (
          <Badge className="bg-purple-100 text-purple-800 border-purple-200">
            Both Shifts
          </Badge>
        );
      case "none":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            Not Scheduled
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleViewDetails = (order: DispatchOrder) => {
    setSelectedOrder(order);
    setShowDetailsDialog(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dispatch Management Dashboard"
        description="Manage today's dispatch, track shipments, and monitor delivery schedules"
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Today's Total Units"
          value={totalTodayUnits.toString()}
          icon={Package}
          iconBgColor="bg-indigo-100"
          iconColor="text-indigo-600"
        />
        <StatCard
          title="Dispatched Today"
          value={dispatchedToday.toString()}
          icon={CheckCircle}
          trend={{ value: `${Math.round((dispatchedToday / totalTodayUnits) * 100)}%`, isPositive: true }}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="Pending Dispatch"
          value={pendingToday.toString()}
          icon={Clock}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
        />
        <StatCard
          title="Ready for Dispatch"
          value={readyForDispatch.toString()}
          icon={Truck}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
      </div>

      {/* Morning and Evening Dispatch Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Morning Dispatch */}
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Sun className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Morning Dispatch</h3>
              <p className="text-sm text-muted-foreground">
                6:00 AM - 12:00 PM
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm font-medium">Total Orders</span>
              <span className="text-xl font-bold text-amber-600">
                {morningDispatch.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm font-medium">Units Dispatched</span>
              <span className="text-xl font-bold text-green-600">
                {morningUnits}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              Orders:
            </p>
            {morningDispatch.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center p-2 bg-white rounded text-sm"
              >
                <span className="font-medium">{order.poNumber}</span>
                <span className="text-muted-foreground">
                  {order.dispatchedUnits}/{order.readyForDispatch} units
                </span>
              </div>
            ))}
            {morningDispatch.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                No morning dispatch scheduled
              </p>
            )}
          </div>
        </Card>

        {/* Evening Dispatch */}
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white rounded-full shadow-sm">
              <Moon className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Evening Dispatch</h3>
              <p className="text-sm text-muted-foreground">
                3:00 PM - 8:00 PM
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm font-medium">Total Orders</span>
              <span className="text-xl font-bold text-indigo-600">
                {eveningDispatch.length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-white rounded-lg">
              <span className="text-sm font-medium">Units Dispatched</span>
              <span className="text-xl font-bold text-green-600">
                {eveningUnits}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              Orders:
            </p>
            {eveningDispatch.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center p-2 bg-white rounded text-sm"
              >
                <span className="font-medium">{order.poNumber}</span>
                <span className="text-muted-foreground">
                  {order.dispatchedUnits}/{order.readyForDispatch} units
                </span>
              </div>
            ))}
            {eveningDispatch.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-2">
                No evening dispatch scheduled
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by PO number or company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
              <SelectItem value="partial">Partial</SelectItem>
              <SelectItem value="dispatched">Dispatched</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Select value={shiftFilter} onValueChange={setShiftFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* Dispatch Orders Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">All Dispatch Orders</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  PO Number
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Company
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Total Units
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Ready
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Dispatched
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Pending
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Bags
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Status
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Shift
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Date
                </th>
                <th className="text-left py-3 px-4 font-semibold text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">
                    <span className="font-semibold">{order.poNumber}</span>
                  </td>
                  <td className="py-3 px-4">{order.companyName}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold">{order.totalUnits}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-blue-600 font-semibold">
                      {order.readyForDispatch}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 font-semibold">
                      {order.dispatchedUnits}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-yellow-600 font-semibold">
                      {order.pendingUnits}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold">{order.bagCount || 0}</span>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(order.dispatchStatus)}
                  </td>
                  <td className="py-3 px-4">
                    {getShiftBadge(order.dispatchShift)}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {order.dispatchDate}
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewDetails(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </div>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dispatch Order Details</DialogTitle>
            <DialogDescription>
              Complete dispatch information for {selectedOrder?.poNumber}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <Card className="p-4 bg-muted">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">PO Number</p>
                    <p className="font-semibold">{selectedOrder.poNumber}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Company</p>
                    <p className="font-semibold">{selectedOrder.companyName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Dispatch Date</p>
                    <p className="font-semibold">{selectedOrder.dispatchDate}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Dispatch Shift</p>
                    <div className="mt-1">
                      {getShiftBadge(selectedOrder.dispatchShift)}
                    </div>
                  </div>
                  {selectedOrder.courierName && (
                    <div>
                      <p className="text-muted-foreground">Courier</p>
                      <p className="font-semibold">{selectedOrder.courierName}</p>
                    </div>
                  )}
                  {selectedOrder.trackingNumber && (
                    <div>
                      <p className="text-muted-foreground">Tracking Number</p>
                      <p className="font-semibold font-mono text-xs">
                        {selectedOrder.trackingNumber}
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              <div>
                <h4 className="font-semibold mb-3">Dispatch Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-indigo-50 rounded border border-indigo-200">
                    <span className="text-sm font-medium">Total Units</span>
                    <span className="text-lg font-bold text-indigo-600">
                      {selectedOrder.totalUnits}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded border border-blue-200">
                    <span className="text-sm font-medium">Ready for Dispatch</span>
                    <span className="text-lg font-bold text-blue-600">
                      {selectedOrder.readyForDispatch}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded border border-green-200">
                    <span className="text-sm font-medium">Dispatched Units</span>
                    <span className="text-lg font-bold text-green-600">
                      {selectedOrder.dispatchedUnits}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded border border-yellow-200">
                    <span className="text-sm font-medium">Pending Units</span>
                    <span className="text-lg font-bold text-yellow-600">
                      {selectedOrder.pendingUnits}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded border border-purple-200">
                    <span className="text-sm font-medium">Total Bags</span>
                    <span className="text-lg font-bold text-purple-600">
                      {selectedOrder.bagCount || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                  Close
                </Button>
                <Button
                  onClick={() => {
                    if (selectedOrder) {
                      onManageBags(selectedOrder.poNumber, selectedOrder.companyName);
                    }
                  }}
                >
                  <Package className="h-4 w-4 mr-2" />
                  Manage Bags
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}