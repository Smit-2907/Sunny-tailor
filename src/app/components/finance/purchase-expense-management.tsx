import { useState, useEffect } from "react";
import {
  Package,
  Search,
  DollarSign,
  AlertCircle,
  RefreshCw,
  Info,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { toast } from "sonner";

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendorName: string;
  vendorContact?: string;
  orderDate: string;
  totalAmount: number;
  paidAmount: number;
  balanceAmount: number;
  dueDate: string;
  status: "paid" | "partial" | "pending" | "overdue";
  items?: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  paymentMethod?: string;
  notes?: string;
  category: string;
  syncedFromProcurement?: boolean;
}

export function PurchaseExpenseManagement() {
  const [purchases, setPurchases] = useState<PurchaseOrder[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Filters
  const [purchaseSearch, setPurchaseSearch] = useState("");
  const [purchaseStatusFilter, setPurchaseStatusFilter] = useState("all");

  // Load and sync data
  useEffect(() => {
    loadData();
    syncFromProcurement(); // Auto-sync on mount
  }, []);

  const loadData = () => {
    try {
      const storedPurchases = localStorage.getItem("erp_purchase_orders");
      if (storedPurchases) {
        setPurchases(JSON.parse(storedPurchases));
      }
    } catch (e) {
      console.error("Failed to load purchase orders:", e);
    }
  };

  const syncFromProcurement = () => {
    setIsSyncing(true);
    try {
      // Simulate sync from procurement module
      // In production, this would fetch from erp_procurement_orders or similar
      const procurementData = localStorage.getItem("erp_procurement_orders");
      if (procurementData) {
        const procurementOrders = JSON.parse(procurementData);

        const syncedPurchases: PurchaseOrder[] = procurementOrders.map((order: any) => ({
          id: order.id || `po-sync-${Date.now()}-${Math.random()}`,
          poNumber: order.poNumber || order.orderNumber,
          vendorName: order.vendorName || order.supplierName,
          vendorContact: order.vendorContact || order.supplierContact,
          orderDate: order.orderDate || order.date,
          totalAmount: order.totalAmount || order.total || 0,
          paidAmount: order.paidAmount || 0,
          balanceAmount: (order.totalAmount || order.total || 0) - (order.paidAmount || 0),
          dueDate: order.dueDate || order.deliveryDate,
          status: order.status || "pending",
          category: order.category || "Raw Materials",
          paymentMethod: order.paymentMethod,
          notes: order.notes,
          syncedFromProcurement: true,
        }));

        setPurchases(syncedPurchases);
        localStorage.setItem("erp_purchase_orders", JSON.stringify(syncedPurchases));
        toast.success(`Synced ${syncedPurchases.length} purchase orders from procurement`);
      } else {
        toast.info("No purchase orders found in procurement module");
      }
    } catch (e) {
      console.error("Sync failed:", e);
      toast.error("Failed to sync purchase orders");
    } finally {
      setTimeout(() => setIsSyncing(false), 500);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      paid: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
      partial: { label: "Partial", className: "bg-blue-100 text-blue-800 border-blue-200" },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      overdue: { label: "Overdue", className: "bg-red-100 text-red-800 border-red-200" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Filter data
  const filteredPurchases = purchases.filter((p) => {
    const matchesSearch =
      purchaseSearch === "" ||
      p.poNumber.toLowerCase().includes(purchaseSearch.toLowerCase()) ||
      p.vendorName.toLowerCase().includes(purchaseSearch.toLowerCase());
    const matchesStatus = purchaseStatusFilter === "all" || p.status === purchaseStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const totalPurchases = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalPurchasesPaid = purchases.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPurchasesPending = purchases.reduce((sum, p) => sum + p.balanceAmount, 0);

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-blue-900">
              Purchase Orders (View Only - Synced from Procurement)
            </p>
            <p className="text-xs text-blue-700">
              Purchase orders are automatically synced from the Procurement module. To create or modify purchase orders, use the Procurement module.
            </p>
          </div>
        </div>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Purchases</p>
            <Package className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">{formatCurrency(totalPurchases)}</p>
          <p className="text-xs text-purple-700 mt-1">{purchases.length} orders</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Paid</p>
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{formatCurrency(totalPurchasesPaid)}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Pending Payment</p>
            <AlertCircle className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-yellow-900">{formatCurrency(totalPurchasesPending)}</p>
        </Card>
      </div>

      {/* Purchase Orders */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <Button
              onClick={syncFromProcurement}
              disabled={isSyncing}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Syncing..." : "Sync from Procurement"}
            </Button>

            <div className="flex flex-wrap gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:flex-none lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search purchases..."
                  value={purchaseSearch}
                  onChange={(e) => setPurchaseSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={purchaseStatusFilter} onValueChange={setPurchaseStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Purchases Table */}
          <div className="overflow-x-auto border rounded-lg">
            {filteredPurchases.length === 0 ? (
              <div className="p-12 text-center text-muted-foreground">
                <Package className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <h3 className="text-lg font-semibold mb-2">No Purchase Orders</h3>
                <p className="text-sm mb-4">Purchase orders will appear here when synced from Procurement</p>
                <Button
                  onClick={syncFromProcurement}
                  disabled={isSyncing}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                  {isSyncing ? "Syncing..." : "Sync from Procurement"}
                </Button>
              </div>
            ) : (
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold">PO Number</th>
                      <th className="text-left p-3 text-xs font-semibold">Vendor</th>
                      <th className="text-left p-3 text-xs font-semibold">Category</th>
                      <th className="text-left p-3 text-xs font-semibold">Order Date</th>
                      <th className="text-left p-3 text-xs font-semibold">Total</th>
                      <th className="text-left p-3 text-xs font-semibold">Paid</th>
                      <th className="text-left p-3 text-xs font-semibold">Balance</th>
                      <th className="text-left p-3 text-xs font-semibold">Due Date</th>
                      <th className="text-left p-3 text-xs font-semibold">Status</th>
                      <th className="text-left p-3 text-xs font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPurchases.map((purchase, index) => (
                      <tr
                        key={`purchase-${purchase.id}`}
                        className={`border-t hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="p-3">
                          <span className="font-mono text-xs font-semibold text-indigo-600">
                            {purchase.poNumber}
                          </span>
                        </td>
                        <td className="p-3 text-sm">{purchase.vendorName}</td>
                        <td className="p-3 text-sm">{purchase.category}</td>
                        <td className="p-3 text-xs text-muted-foreground">{purchase.orderDate}</td>
                        <td className="p-3 text-sm font-semibold">
                          {formatCurrency(purchase.totalAmount)}
                        </td>
                        <td className="p-3 text-sm text-green-600">
                          {formatCurrency(purchase.paidAmount)}
                        </td>
                        <td className="p-3 text-sm font-semibold text-red-600">
                          {formatCurrency(purchase.balanceAmount)}
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">{purchase.dueDate}</td>
                        <td className="p-3">{getStatusBadge(purchase.status)}</td>
                        <td className="p-3">
                          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                            Synced - View Only
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </Card>
    </div>
  );
}
