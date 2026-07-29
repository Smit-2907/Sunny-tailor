import React, { useState } from "react";
import {
  Package,
  Plus,
  Edit,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Download,
  Upload,
  TrendingDown,
  TrendingUp,
  Eye,
  Lock,
  Save,
  X,
  MapPin,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { PageHeader } from "@/app/components/page-header";
import { StatCard } from "@/app/components/stat-card";
import { SharedFilters } from "@/app/components/shared-filters";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
const VisuallyHidden = ({ children }: { children: React.ReactNode }) => (
  <span style={{ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", borderWidth: 0 }}>{children}</span>
);
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { AddFabricPage, NewFabricInput } from "@/app/components/inventory/add-fabric-page";

interface FabricItem {
  id: string;
  fabricCode: string;
  fabricName: string;
  fabricType: string;
  color: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unit: string;
  pricePerUnit: number;
  location: string;
  supplier: string;
  lastUpdated: string;
  status: "sufficient" | "low" | "critical" | "overstocked";
  lastRestockDate: string;
  lastRestockQuantity: number;
  // extended purchase / storage fields
  garmentType?: "pant" | "shirt";
  sellerName?: string;
  billNo?: string;
  companyName?: string;
  rack?: string;
  floor?: string;
  photo?: string;
}

interface FabricInventoryScreenProps {
  currentRole: string;
  openAddForm?: boolean;
}

const mockFabricInventory: FabricItem[] = [
  {
    id: "1",
    fabricCode: "FAB-001",
    fabricName: "Premium Cotton",
    fabricType: "Cotton",
    color: "White",
    currentStock: 2800,
    minimumStock: 1000,
    maximumStock: 5000,
    unit: "meters",
    pricePerUnit: 45,
    location: "Rack A1",
    supplier: "Cotton Mills Ltd",
    lastUpdated: "2026-01-26",
    status: "sufficient",
    lastRestockDate: "2026-01-20",
    lastRestockQuantity: 1500,
  },
  {
    id: "2",
    fabricCode: "FAB-002",
    fabricName: "Polyester Blend",
    fabricType: "Polyester",
    color: "Navy Blue",
    currentStock: 600,
    minimumStock: 1500,
    maximumStock: 4000,
    unit: "meters",
    pricePerUnit: 38,
    location: "Rack A2",
    supplier: "Synthetic Fabrics Co",
    lastUpdated: "2026-01-25",
    status: "critical",
    lastRestockDate: "2026-01-15",
    lastRestockQuantity: 800,
  },
  {
    id: "3",
    fabricCode: "FAB-003",
    fabricName: "Cotton Blend",
    fabricType: "Cotton Blend",
    color: "Black",
    currentStock: 1500,
    minimumStock: 2000,
    maximumStock: 4500,
    unit: "meters",
    pricePerUnit: 42,
    location: "Rack B1",
    supplier: "Textile Industries",
    lastUpdated: "2026-01-24",
    status: "low",
    lastRestockDate: "2026-01-18",
    lastRestockQuantity: 1000,
  },
  {
    id: "4",
    fabricCode: "FAB-004",
    fabricName: "Linen Premium",
    fabricType: "Linen",
    color: "Beige",
    currentStock: 1200,
    minimumStock: 800,
    maximumStock: 3000,
    unit: "meters",
    pricePerUnit: 65,
    location: "Rack B2",
    supplier: "Natural Fibers Ltd",
    lastUpdated: "2026-01-26",
    status: "sufficient",
    lastRestockDate: "2026-01-22",
    lastRestockQuantity: 600,
  },
  {
    id: "5",
    fabricCode: "FAB-005",
    fabricName: "Denim Heavy",
    fabricType: "Denim",
    color: "Indigo",
    currentStock: 300,
    minimumStock: 1000,
    maximumStock: 3500,
    unit: "meters",
    pricePerUnit: 55,
    location: "Rack C1",
    supplier: "Denim Masters",
    lastUpdated: "2026-01-23",
    status: "critical",
    lastRestockDate: "2026-01-10",
    lastRestockQuantity: 500,
  },
  {
    id: "6",
    fabricCode: "FAB-006",
    fabricName: "Silk Satin",
    fabricType: "Silk",
    color: "Ivory",
    currentStock: 450,
    minimumStock: 300,
    maximumStock: 1500,
    unit: "meters",
    pricePerUnit: 120,
    location: "Rack C2",
    supplier: "Premium Silk Co",
    lastUpdated: "2026-01-26",
    status: "sufficient",
    lastRestockDate: "2026-01-21",
    lastRestockQuantity: 200,
  },
  {
    id: "7",
    fabricCode: "FAB-007",
    fabricName: "Wool Blend",
    fabricType: "Wool",
    color: "Charcoal Gray",
    currentStock: 5200,
    minimumStock: 1200,
    maximumStock: 4000,
    unit: "meters",
    pricePerUnit: 85,
    location: "Rack D1",
    supplier: "Wool Textiles Inc",
    lastUpdated: "2026-01-25",
    status: "overstocked",
    lastRestockDate: "2026-01-19",
    lastRestockQuantity: 2500,
  },
  {
    id: "8",
    fabricCode: "FAB-008",
    fabricName: "Viscose Rayon",
    fabricType: "Viscose",
    color: "Burgundy",
    currentStock: 850,
    minimumStock: 800,
    maximumStock: 2500,
    unit: "meters",
    pricePerUnit: 48,
    location: "Rack D2",
    supplier: "Modern Fabrics",
    lastUpdated: "2026-01-26",
    status: "sufficient",
    lastRestockDate: "2026-01-23",
    lastRestockQuantity: 400,
  },
];

export function FabricInventoryScreen({ currentRole, openAddForm = false }: FabricInventoryScreenProps) {
  const [fabrics, setFabrics] = useState<FabricItem[]>(mockFabricInventory);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedFabric, setSelectedFabric] = useState<FabricItem | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showAddPage, setShowAddPage] = useState(openAddForm);
  const [editingStock, setEditingStock] = useState<string>("");
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");

  // Role-based permissions
  const canEdit = currentRole === "fabric-store" || currentRole === "master-manager";
  const canViewOnly = !canEdit;

  // Filter options
  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Sufficient", value: "sufficient" },
    { label: "Low Stock", value: "low" },
    { label: "Critical", value: "critical" },
    { label: "Overstocked", value: "overstocked" },
  ];

  const typeOptions = [
    { label: "All Types", value: "all" },
    { label: "Cotton", value: "Cotton" },
    { label: "Polyester", value: "Polyester" },
    { label: "Cotton Blend", value: "Cotton Blend" },
    { label: "Linen", value: "Linen" },
    { label: "Denim", value: "Denim" },
    { label: "Silk", value: "Silk" },
    { label: "Wool", value: "Wool" },
    { label: "Viscose", value: "Viscose" },
  ];

  // Filtered fabrics
  const filteredFabrics = fabrics.filter((fabric) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        fabric.fabricCode.toLowerCase().includes(query) ||
        fabric.fabricName.toLowerCase().includes(query) ||
        fabric.color.toLowerCase().includes(query) ||
        fabric.supplier.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== "all" && fabric.status !== statusFilter) {
      return false;
    }

    // Type filter
    if (typeFilter !== "all" && fabric.fabricType !== typeFilter) {
      return false;
    }

    return true;
  });

  // Calculate statistics
  const totalFabrics = fabrics.length;
  const criticalStock = fabrics.filter((f) => f.status === "critical").length;
  const lowStock = fabrics.filter((f) => f.status === "low").length;
  const totalValue = fabrics.reduce((sum, f) => sum + f.currentStock * f.pricePerUnit, 0);

  // Calculate active filter count
  const activeFilterCount =
    (searchQuery ? 1 : 0) + (statusFilter !== "all" ? 1 : 0) + (typeFilter !== "all" ? 1 : 0);

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sufficient":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Sufficient
          </Badge>
        );
      case "low":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <TrendingDown className="h-3 w-3 mr-1" />
            Low Stock
          </Badge>
        );
      case "critical":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Critical
          </Badge>
        );
      case "overstocked":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <TrendingUp className="h-3 w-3 mr-1" />
            Overstocked
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleEditStock = (fabric: FabricItem) => {
    setSelectedFabric(fabric);
    setEditingStock(fabric.currentStock.toString());
    setAdjustmentQuantity("");
    setAdjustmentReason("");
    setAdjustmentType("add");
    setShowEditDialog(true);
  };

  const handleViewDetails = (fabric: FabricItem) => {
    setSelectedFabric(fabric);
    setEditingStock(fabric.currentStock.toString());
    setShowEditDialog(true);
  };

  const handleSaveStockUpdate = () => {
    if (!selectedFabric) return;

    const quantity = parseInt(adjustmentQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (!adjustmentReason.trim()) {
      alert("Please provide a reason for the adjustment");
      return;
    }

    const updatedFabrics = fabrics.map((fabric) => {
      if (fabric.id === selectedFabric.id) {
        const newStock =
          adjustmentType === "add"
            ? fabric.currentStock + quantity
            : fabric.currentStock - quantity;

        // Determine new status
        let newStatus: FabricItem["status"] = "sufficient";
        if (newStock < fabric.minimumStock * 0.5) {
          newStatus = "critical";
        } else if (newStock < fabric.minimumStock) {
          newStatus = "low";
        } else if (newStock > fabric.maximumStock) {
          newStatus = "overstocked";
        }

        return {
          ...fabric,
          currentStock: Math.max(0, newStock),
          status: newStatus,
          lastUpdated: new Date().toISOString().split("T")[0],
          ...(adjustmentType === "add" && {
            lastRestockDate: new Date().toISOString().split("T")[0],
            lastRestockQuantity: quantity,
          }),
        };
      }
      return fabric;
    });

    setFabrics(updatedFabrics);
    setShowEditDialog(false);
    setSelectedFabric(null);
  };

  const getStockPercentage = (fabric: FabricItem) => {
    if (!fabric.maximumStock) return 0;
    return Math.round((fabric.currentStock / fabric.maximumStock) * 100);
  };

  const handleAddFabric = (data: NewFabricInput) => {
    const currentStock = parseInt(data.fabricMeter) || 0;
    const minimumStock = parseInt(data.minimumStock) || 0;
    const maximumStock = parseInt(data.maximumStock) || Math.max(currentStock, 1);

    let status: FabricItem["status"] = "sufficient";
    if (minimumStock > 0) {
      if (currentStock < minimumStock * 0.5) status = "critical";
      else if (currentStock < minimumStock) status = "low";
      else if (currentStock > maximumStock) status = "overstocked";
    }

    const today = new Date().toISOString().split("T")[0];
    const newFabric: FabricItem = {
      id: `fab_${Date.now()}`,
      fabricCode: data.fabricCode,
      fabricName: data.fabricName,
      fabricType: data.garmentType === "pant" ? "Pant Fabric" : "Shirt Fabric",
      color: data.color || "-",
      currentStock,
      minimumStock,
      maximumStock,
      unit: data.unit || "meters",
      pricePerUnit: parseFloat(data.pricePerUnit) || 0,
      location: [data.rack, data.floor].filter(Boolean).join(", ") || "-",
      supplier: data.sellerName || "-",
      lastUpdated: today,
      status,
      lastRestockDate: today,
      lastRestockQuantity: currentStock,
      garmentType: data.garmentType,
      sellerName: data.sellerName,
      billNo: data.billNo,
      companyName: data.companyName,
      rack: data.rack,
      floor: data.floor,
      photo: data.photo,
    };

    setFabrics((prev) => [newFabric, ...prev]);
    setShowAddPage(false);
  };

  const colorSwatch: Record<string, string> = {
    "White": "#FFFFFF", "Black": "#000000", "Navy Blue": "#000080", "Beige": "#F5F5DC",
    "Indigo": "#4B0082", "Ivory": "#FFFFF0", "Charcoal Gray": "#36454F", "Burgundy": "#800020",
  };

  // Full-page Add Fabric flow
  if (showAddPage) {
    return <AddFabricPage onSave={handleAddFabric} onCancel={() => setShowAddPage(false)} />;
  }

  return (
    <div className="space-y-5">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Fabric Store</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {totalFabrics} fabrics · ₹{(totalValue / 1000).toFixed(1)}K stock value
              {canViewOnly && " · View-only"}
            </p>
          </div>
        </div>
        {canEdit && (
          <Button className="bg-indigo-600 hover:bg-indigo-700 shrink-0" onClick={() => setShowAddPage(true)}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add Fabric
          </Button>
        )}
      </div>

      {/* Critical Stock Alert */}
      {criticalStock > 0 && (
        <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span><strong>{criticalStock}</strong> fabric{criticalStock > 1 ? "s" : ""} at critical stock — restock required.</span>
        </div>
      )}

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, code, colour or supplier…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 bg-white"
          />
        </div>
        <select
          className="h-10 px-3 border border-gray-200 rounded-md text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <select
          className="h-10 px-3 border border-gray-200 rounded-md text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {typeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Fabric gallery — 5 per row */}
      {filteredFabrics.length === 0 ? (
        <div className="text-center py-20 text-gray-400 border border-dashed border-gray-200 rounded-xl">
          <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium text-gray-500">No fabrics found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFabrics.map((fabric) => {
            const swatch = colorSwatch[fabric.color] || "#E5E7EB";
            const statusStyle =
              fabric.status === "critical" ? "bg-red-100 text-red-700"
              : fabric.status === "low" ? "bg-amber-100 text-amber-700"
              : fabric.status === "overstocked" ? "bg-blue-100 text-blue-700"
              : "bg-green-100 text-green-700";
            const statusLabel =
              fabric.status === "critical" ? "Critical"
              : fabric.status === "low" ? "Low"
              : fabric.status === "overstocked" ? "Overstocked"
              : "Sufficient";

            return (
              <button
                key={fabric.id}
                onClick={() => canEdit ? handleEditStock(fabric) : handleViewDetails(fabric)}
                className="group flex flex-col text-left bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                {/* Square fabric image / colour block */}
                <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
                  {fabric.photo ? (
                    <img src={fabric.photo} alt={fabric.fabricName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: swatch }}>
                      <Package className="h-7 w-7 text-black/10" />
                    </div>
                  )}
                  {/* Status pill */}
                  <span className={`absolute top-2 right-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle}`}>
                    {statusLabel}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col gap-2 flex-1">
                  {/* Name + code */}
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 truncate leading-tight">{fabric.fabricName}</p>
                    <p className="text-[11px] text-gray-400">{fabric.fabricCode}</p>
                  </div>

                  {/* Colour + stock */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-3 h-3 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: swatch }} />
                      <span className="text-xs text-gray-500 truncate">{fabric.color}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900 shrink-0">
                      {fabric.currentStock.toLocaleString()}
                      <span className="text-[10px] font-normal text-gray-400 ml-0.5">{fabric.unit}</span>
                    </span>
                  </div>

                  {/* Storage location */}
                  <div className="flex items-center gap-1 text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                    <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
                    <span className="truncate">
                      {fabric.rack || "No rack"}{fabric.floor ? ` · ${fabric.floor}` : ""}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Edit/View Stock Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0">
          <VisuallyHidden>
            <DialogTitle>{selectedFabric?.fabricName ?? "Fabric Details"}</DialogTitle>
            <DialogDescription>View and manage fabric stock details</DialogDescription>
          </VisuallyHidden>
          {selectedFabric && (
            <>
              {/* Compact header */}
              <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Color swatch avatar */}
                  <div
                    className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border border-black/5"
                    style={{ backgroundColor: selectedFabric.photo ? "#F3F4F6" : (colorSwatch[selectedFabric.color] || "#E5E7EB") }}
                  >
                    {selectedFabric.photo
                      ? <img src={selectedFabric.photo} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      : <Package className="h-4 w-4 text-black/25" />
                    }
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-semibold text-gray-900 leading-tight">{selectedFabric.fabricName}</h3>
                      {selectedFabric.garmentType && (
                        <Badge variant="outline" className="capitalize text-[10px] px-1.5 py-0 shrink-0">{selectedFabric.garmentType}</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                      <span>{selectedFabric.fabricCode}</span>
                      <span className="text-gray-300">·</span>
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full border border-gray-200 shrink-0" style={{ backgroundColor: colorSwatch[selectedFabric.color] || "#CCCCCC" }} />
                        <span>{selectedFabric.color}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="shrink-0 ml-3">{getStatusBadge(selectedFabric.status)}</div>
              </div>

              <div className="p-5 space-y-4">

                {/* Stock strip */}
                <div className="grid grid-cols-3 divide-x divide-gray-200 border border-gray-200 rounded-lg overflow-hidden">
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-[11px] text-gray-500">Current</p>
                    <p className="text-lg font-bold text-gray-900">{selectedFabric.currentStock.toLocaleString()}</p>
                  </div>
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-[11px] text-gray-500">Minimum</p>
                    <p className="text-lg font-bold text-amber-600">{selectedFabric.minimumStock.toLocaleString()}</p>
                  </div>
                  <div className="px-3 py-2.5 text-center">
                    <p className="text-[11px] text-gray-500">Maximum</p>
                    <p className="text-lg font-bold text-green-600">{selectedFabric.maximumStock.toLocaleString()}</p>
                  </div>
                </div>

                {/* Details — key/value list */}
                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 text-sm">
                  {[
                    ["Seller Name", selectedFabric.sellerName || selectedFabric.supplier || "-"],
                    ["Bill No", selectedFabric.billNo || "-"],
                    ["Company Name", selectedFabric.companyName || "-"],
                    ["Price per Unit", `₹${selectedFabric.pricePerUnit}`],
                    ["Rack", selectedFabric.rack || selectedFabric.location || "-"],
                    ["Floor", selectedFabric.floor || "-"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between px-3 py-2">
                      <span className="text-gray-500">{k}</span>
                      <span className="font-medium text-gray-900">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Stock Adjustment (editors only) */}
                {canEdit && (
                  <div className="space-y-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="text-sm font-semibold text-gray-700">Stock Adjustment</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">Type</Label>
                        <Select value={adjustmentType} onValueChange={(value: any) => setAdjustmentType(value)}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="add">Add (Restock)</SelectItem>
                            <SelectItem value="remove">Remove (Usage)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-gray-600">Quantity</Label>
                        <Input type="number" placeholder="0" value={adjustmentQuantity} onChange={(e) => setAdjustmentQuantity(e.target.value)} min="0" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Reason</Label>
                      <Input placeholder="e.g. New shipment, Used for PO-2026-001" value={adjustmentReason} onChange={(e) => setAdjustmentReason(e.target.value)} />
                    </div>
                    {adjustmentQuantity && (
                      <p className="text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md px-3 py-2">
                        New stock: {adjustmentType === "add"
                          ? selectedFabric.currentStock + parseInt(adjustmentQuantity || "0")
                          : selectedFabric.currentStock - parseInt(adjustmentQuantity || "0")} {selectedFabric.unit}
                      </p>
                    )}
                  </div>
                )}

                {canViewOnly && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <Lock className="h-4 w-4 shrink-0" />
                    Stock updates are restricted to Fabric Store & Master Admin.
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  Last restocked {selectedFabric.lastRestockDate} · Updated {selectedFabric.lastUpdated}
                </p>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <Button variant="outline" className="flex-1" onClick={() => setShowEditDialog(false)}>
                    {canEdit ? "Cancel" : "Close"}
                  </Button>
                  {canEdit && (
                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={handleSaveStockUpdate}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}