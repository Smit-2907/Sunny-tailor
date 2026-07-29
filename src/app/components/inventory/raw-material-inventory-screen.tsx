import { useState } from "react";
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
  Info,
  Box,
  Boxes,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

interface RawMaterialItem {
  id: string;
  materialCode: string;
  materialName: string;
  category: string;
  subCategory: string;
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
  reorderPoint: number;
  leadTimeDays: number;
}

interface RawMaterialInventoryScreenProps {
  currentRole: string;
}

const mockRawMaterialInventory: RawMaterialItem[] = [
  {
    id: "1",
    materialCode: "RM-001",
    materialName: "Polyester Thread - White",
    category: "Thread & Yarn",
    subCategory: "Polyester Thread",
    currentStock: 450,
    minimumStock: 500,
    maximumStock: 2000,
    unit: "spools",
    pricePerUnit: 25,
    location: "Shelf A1-01",
    supplier: "Thread Masters Inc",
    lastUpdated: "2026-01-26",
    status: "low",
    lastRestockDate: "2026-01-15",
    lastRestockQuantity: 200,
    reorderPoint: 600,
    leadTimeDays: 7,
  },
  {
    id: "2",
    materialCode: "RM-002",
    materialName: "Metal Buttons - 15mm",
    category: "Fasteners",
    subCategory: "Buttons",
    currentStock: 12000,
    minimumStock: 5000,
    maximumStock: 20000,
    unit: "pieces",
    pricePerUnit: 0.5,
    location: "Bin B3-12",
    supplier: "Button Factory Ltd",
    lastUpdated: "2026-01-25",
    status: "sufficient",
    lastRestockDate: "2026-01-20",
    lastRestockQuantity: 5000,
    reorderPoint: 7000,
    leadTimeDays: 5,
  },
  {
    id: "3",
    materialCode: "RM-003",
    materialName: "Metal Zippers - 20cm",
    category: "Fasteners",
    subCategory: "Zippers",
    currentStock: 300,
    minimumStock: 1200,
    maximumStock: 5000,
    unit: "pieces",
    pricePerUnit: 8,
    location: "Shelf C2-05",
    supplier: "Zipper World Co",
    lastUpdated: "2026-01-24",
    status: "critical",
    lastRestockDate: "2026-01-10",
    lastRestockQuantity: 500,
    reorderPoint: 1500,
    leadTimeDays: 10,
  },
  {
    id: "4",
    materialCode: "RM-004",
    materialName: "Elastic Band - 25mm",
    category: "Elastic & Trims",
    subCategory: "Elastic Band",
    currentStock: 850,
    minimumStock: 800,
    maximumStock: 3000,
    unit: "meters",
    pricePerUnit: 12,
    location: "Rack D1-08",
    supplier: "Elastic Solutions",
    lastUpdated: "2026-01-26",
    status: "sufficient",
    lastRestockDate: "2026-01-22",
    lastRestockQuantity: 400,
    reorderPoint: 1000,
    leadTimeDays: 7,
  },
  {
    id: "5",
    materialCode: "RM-005",
    materialName: "Woven Labels - Custom",
    category: "Labels & Tags",
    subCategory: "Woven Labels",
    currentStock: 500,
    minimumStock: 1850,
    maximumStock: 5000,
    unit: "pieces",
    pricePerUnit: 2,
    location: "Shelf E1-03",
    supplier: "Label Print Pro",
    lastUpdated: "2026-01-23",
    status: "critical",
    lastRestockDate: "2026-01-12",
    lastRestockQuantity: 800,
    reorderPoint: 2000,
    leadTimeDays: 14,
  },
  {
    id: "6",
    materialCode: "RM-006",
    materialName: "Velcro Strips - 50mm",
    category: "Fasteners",
    subCategory: "Velcro",
    currentStock: 650,
    minimumStock: 400,
    maximumStock: 1500,
    unit: "meters",
    pricePerUnit: 15,
    location: "Bin F2-06",
    supplier: "Fastener Hub",
    lastUpdated: "2026-01-26",
    status: "sufficient",
    lastRestockDate: "2026-01-21",
    lastRestockQuantity: 300,
    reorderPoint: 500,
    leadTimeDays: 7,
  },
  {
    id: "7",
    materialCode: "RM-007",
    materialName: "Cotton Thread - Black",
    category: "Thread & Yarn",
    subCategory: "Cotton Thread",
    currentStock: 2100,
    minimumStock: 600,
    maximumStock: 1800,
    unit: "spools",
    pricePerUnit: 28,
    location: "Shelf A1-05",
    supplier: "Thread Masters Inc",
    lastUpdated: "2026-01-25",
    status: "overstocked",
    lastRestockDate: "2026-01-19",
    lastRestockQuantity: 1000,
    reorderPoint: 800,
    leadTimeDays: 7,
  },
  {
    id: "8",
    materialCode: "RM-008",
    materialName: "Snap Fasteners - 10mm",
    category: "Fasteners",
    subCategory: "Snaps",
    currentStock: 3500,
    minimumStock: 2000,
    maximumStock: 8000,
    unit: "pieces",
    pricePerUnit: 0.75,
    location: "Bin B3-08",
    supplier: "Button Factory Ltd",
    lastUpdated: "2026-01-26",
    status: "sufficient",
    lastRestockDate: "2026-01-23",
    lastRestockQuantity: 2000,
    reorderPoint: 2500,
    leadTimeDays: 5,
  },
  {
    id: "9",
    materialCode: "RM-009",
    materialName: "Interlining Fabric",
    category: "Interfacing",
    subCategory: "Interlining",
    currentStock: 280,
    minimumStock: 500,
    maximumStock: 2000,
    unit: "meters",
    pricePerUnit: 18,
    location: "Rack G1-02",
    supplier: "Fabric Supplies Co",
    lastUpdated: "2026-01-24",
    status: "critical",
    lastRestockDate: "2026-01-08",
    lastRestockQuantity: 150,
    reorderPoint: 700,
    leadTimeDays: 12,
  },
  {
    id: "10",
    materialCode: "RM-010",
    materialName: "Sewing Needles - Assorted",
    category: "Notions",
    subCategory: "Needles",
    currentStock: 1200,
    minimumStock: 500,
    maximumStock: 2000,
    unit: "packs",
    pricePerUnit: 35,
    location: "Drawer H1-01",
    supplier: "Sewing Essentials",
    lastUpdated: "2026-01-26",
    status: "sufficient",
    lastRestockDate: "2026-01-20",
    lastRestockQuantity: 500,
    reorderPoint: 700,
    leadTimeDays: 5,
  },
];

export function RawMaterialInventoryScreen({ currentRole }: RawMaterialInventoryScreenProps) {
  const [materials, setMaterials] = useState<RawMaterialItem[]>(mockRawMaterialInventory);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterialItem | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");

  // Role-based permissions
  const canEdit = currentRole === "raw-material" || currentRole === "master-manager";
  const canViewOnly = !canEdit;

  // Filter options
  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Sufficient", value: "sufficient" },
    { label: "Low Stock", value: "low" },
    { label: "Critical", value: "critical" },
    { label: "Overstocked", value: "overstocked" },
  ];

  const categoryOptions = [
    { label: "All Categories", value: "all" },
    { label: "Thread & Yarn", value: "Thread & Yarn" },
    { label: "Fasteners", value: "Fasteners" },
    { label: "Elastic & Trims", value: "Elastic & Trims" },
    { label: "Labels & Tags", value: "Labels & Tags" },
    { label: "Interfacing", value: "Interfacing" },
    { label: "Notions", value: "Notions" },
  ];

  // Filtered materials
  const filteredMaterials = materials.filter((material) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        material.materialCode.toLowerCase().includes(query) ||
        material.materialName.toLowerCase().includes(query) ||
        material.category.toLowerCase().includes(query) ||
        material.supplier.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter !== "all" && material.status !== statusFilter) {
      return false;
    }

    // Category filter
    if (categoryFilter !== "all" && material.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  // Calculate statistics
  const totalMaterials = materials.length;
  const criticalStock = materials.filter((m) => m.status === "critical").length;
  const lowStock = materials.filter((m) => m.status === "low").length;
  const totalValue = materials.reduce((sum, m) => sum + m.currentStock * m.pricePerUnit, 0);

  // Calculate active filter count
  const activeFilterCount =
    (searchQuery ? 1 : 0) + (statusFilter !== "all" ? 1 : 0) + (categoryFilter !== "all" ? 1 : 0);

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setCategoryFilter("all");
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

  const handleEditStock = (material: RawMaterialItem) => {
    setSelectedMaterial(material);
    setAdjustmentQuantity("");
    setAdjustmentReason("");
    setAdjustmentType("add");
    setShowEditDialog(true);
  };

  const handleViewDetails = (material: RawMaterialItem) => {
    setSelectedMaterial(material);
    setShowEditDialog(true);
  };

  const handleSaveStockUpdate = () => {
    if (!selectedMaterial) return;

    const quantity = parseInt(adjustmentQuantity);
    if (isNaN(quantity) || quantity <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    if (!adjustmentReason.trim()) {
      alert("Please provide a reason for the adjustment");
      return;
    }

    const updatedMaterials = materials.map((material) => {
      if (material.id === selectedMaterial.id) {
        const newStock =
          adjustmentType === "add"
            ? material.currentStock + quantity
            : material.currentStock - quantity;

        // Determine new status
        let newStatus: RawMaterialItem["status"] = "sufficient";
        if (newStock < material.minimumStock * 0.5) {
          newStatus = "critical";
        } else if (newStock < material.minimumStock) {
          newStatus = "low";
        } else if (newStock > material.maximumStock) {
          newStatus = "overstocked";
        }

        return {
          ...material,
          currentStock: Math.max(0, newStock),
          status: newStatus,
          lastUpdated: new Date().toISOString().split("T")[0],
          ...(adjustmentType === "add" && {
            lastRestockDate: new Date().toISOString().split("T")[0],
            lastRestockQuantity: quantity,
          }),
        };
      }
      return material;
    });

    setMaterials(updatedMaterials);
    setShowEditDialog(false);
    setSelectedMaterial(null);
  };

  const getStockPercentage = (material: RawMaterialItem) => {
    return Math.round((material.currentStock / material.maximumStock) * 100);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <PageHeader
          title="Raw Material Inventory Management"
          description={
            canViewOnly
              ? "View raw material stock levels and inventory details (View-only access)"
              : "Manage raw material stock levels and inventory"
          }
        />

        {/* Permission Notice for View-Only Users */}
        {canViewOnly && (
          <Card className="p-4 border-blue-200 bg-blue-50">
            <div className="flex items-start gap-3">
              <Lock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 mb-1">
                  🔒 View-Only Access
                </h3>
                <p className="text-sm text-blue-700">
                  You have read-only access to the raw material inventory. Stock updates are
                  restricted to Raw Material Store and Master Admin roles. Hover over lock icons for
                  more information.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Critical Stock Alert */}
        {criticalStock > 0 && (
          <Card className="p-4 border-red-200 bg-red-50">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">⚠️ Critical Stock Alert</h3>
                <p className="text-sm text-red-700">
                  {criticalStock} raw material item(s) are at critical stock levels. Immediate
                  restocking required.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            title="Total Material Items"
            value={totalMaterials.toString()}
            icon={Boxes}
            iconBgColor="bg-indigo-100"
            iconColor="text-indigo-600"
          />
          <StatCard
            title="Total Inventory Value"
            value={`₹${(totalValue / 1000).toFixed(1)}K`}
            icon={TrendingUp}
            trend={{ value: "Current stock value", isPositive: true }}
            iconBgColor="bg-green-100"
            iconColor="text-green-600"
          />
          <StatCard
            title="Low Stock Items"
            value={lowStock.toString()}
            icon={TrendingDown}
            iconBgColor="bg-yellow-100"
            iconColor="text-yellow-600"
          />
          <StatCard
            title="Critical Stock"
            value={criticalStock.toString()}
            icon={AlertTriangle}
            iconBgColor="bg-red-100"
            iconColor="text-red-600"
          />
        </div>

        {/* Inventory Table */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Box className="h-5 w-5 text-indigo-600" />
              <h3 className="font-semibold text-lg">Raw Material Stock Inventory</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {canEdit ? (
                <Button size="sm" onClick={() => setShowAddDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Material
                </Button>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="sm" disabled className="cursor-not-allowed">
                      <Lock className="h-4 w-4 mr-2" />
                      Add Material
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs max-w-xs">
                      Adding new materials requires Raw Material Store or Master Admin role
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Filters */}
          <SharedFilters
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search by code, name, category, or supplier..."
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            statusOptions={statusOptions}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            categoryOptions={categoryOptions}
            activeFilterCount={activeFilterCount}
            onClearAll={handleClearFilters}
          />

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Material Code</TableHead>
                  <TableHead>Name & Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reorder Point</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No materials found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMaterials.map((material) => {
                    const stockPercentage = getStockPercentage(material);
                    const isCritical = material.status === "critical";
                    const isLow = material.status === "low";
                    const needsReorder = material.currentStock <= material.reorderPoint;

                    return (
                      <TableRow key={material.id}>
                        <TableCell className="font-medium">{material.materialCode}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{material.materialName}</p>
                            <p className="text-xs text-muted-foreground">
                              {material.category} • {material.subCategory}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">
                              {material.currentStock} {material.unit}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Min: {material.minimumStock} / Max: {material.maximumStock}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-24">
                            <div className="flex justify-between text-xs mb-1">
                              <span>{stockPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  isCritical
                                    ? "bg-red-500"
                                    : isLow
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{ width: `${Math.min(100, stockPercentage)}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(material.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{material.reorderPoint}</span>
                            {needsReorder && (
                              <Tooltip>
                                <TooltipTrigger>
                                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="text-xs">
                                    Below reorder point! Lead time: {material.leadTimeDays} days
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{material.location}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{material.lastUpdated}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          {canEdit ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditStock(material)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Update
                            </Button>
                          ) : (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewDetails(material)}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="text-xs">View details (Read-only)</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Edit/View Stock Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {canEdit ? "Update Raw Material Stock" : "View Material Details"}
                {canViewOnly && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Lock className="h-4 w-4 inline-block ml-2 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs max-w-xs">
                        Stock editing is disabled for your role. Contact Raw Material Store or
                        Master Admin for changes.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </DialogTitle>
              <DialogDescription>
                {canEdit
                  ? "Adjust stock levels and track inventory movements"
                  : "Raw material inventory details (Read-only)"}
              </DialogDescription>
            </DialogHeader>

            {selectedMaterial && (
              <div className="space-y-6">
                {/* Material Details */}
                <Card className="p-4 bg-muted">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Material Code</p>
                      <p className="font-semibold">{selectedMaterial.materialCode}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Material Name</p>
                      <p className="font-semibold">{selectedMaterial.materialName}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Category</p>
                      <p className="font-semibold">{selectedMaterial.category}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Sub-Category</p>
                      <p className="font-semibold">{selectedMaterial.subCategory}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Supplier</p>
                      <p className="font-semibold">{selectedMaterial.supplier}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-semibold">{selectedMaterial.location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Price per Unit</p>
                      <p className="font-semibold">₹{selectedMaterial.pricePerUnit}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Lead Time</p>
                      <p className="font-semibold">{selectedMaterial.leadTimeDays} days</p>
                    </div>
                  </div>
                </Card>

                {/* Current Stock Info */}
                <div className="grid grid-cols-4 gap-4">
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <p className="text-sm text-muted-foreground mb-1">Current Stock</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {selectedMaterial.currentStock}
                    </p>
                    <p className="text-xs text-muted-foreground">{selectedMaterial.unit}</p>
                  </Card>
                  <Card className="p-4 bg-yellow-50 border-yellow-200">
                    <p className="text-sm text-muted-foreground mb-1">Minimum Stock</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {selectedMaterial.minimumStock}
                    </p>
                    <p className="text-xs text-muted-foreground">{selectedMaterial.unit}</p>
                  </Card>
                  <Card className="p-4 bg-green-50 border-green-200">
                    <p className="text-sm text-muted-foreground mb-1">Maximum Stock</p>
                    <p className="text-2xl font-bold text-green-600">
                      {selectedMaterial.maximumStock}
                    </p>
                    <p className="text-xs text-muted-foreground">{selectedMaterial.unit}</p>
                  </Card>
                  <Card className="p-4 bg-orange-50 border-orange-200">
                    <div className="flex items-center gap-1 mb-1">
                      <p className="text-sm text-muted-foreground">Reorder Point</p>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">
                            Stock level at which new orders should be placed
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-2xl font-bold text-orange-600">
                      {selectedMaterial.reorderPoint}
                    </p>
                    <p className="text-xs text-muted-foreground">{selectedMaterial.unit}</p>
                  </Card>
                </div>

                {/* Stock Status Info */}
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Status:</span>
                    {getStatusBadge(selectedMaterial.status)}
                  </div>
                  {selectedMaterial.currentStock <= selectedMaterial.reorderPoint && (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <AlertTriangle className="h-4 w-4" />
                      <span>Below reorder point - Order now!</span>
                    </div>
                  )}
                </div>

                {/* Stock Adjustment Form (Only for authorized users) */}
                {canEdit && (
                  <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                    <h4 className="font-semibold">Stock Adjustment</h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Adjustment Type</Label>
                        <Select
                          value={adjustmentType}
                          onValueChange={(value: any) => setAdjustmentType(value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="add">Add Stock (Restock)</SelectItem>
                            <SelectItem value="remove">Remove Stock (Usage/Damage)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          placeholder="Enter quantity"
                          value={adjustmentQuantity}
                          onChange={(e) => setAdjustmentQuantity(e.target.value)}
                          min="0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Reason for Adjustment</Label>
                      <Input
                        placeholder="e.g., New shipment received, Used for PO-2026-001, Damaged goods"
                        value={adjustmentReason}
                        onChange={(e) => setAdjustmentReason(e.target.value)}
                      />
                    </div>

                    {adjustmentQuantity && (
                      <Card className="p-3 bg-blue-50 border-blue-200">
                        <p className="text-sm font-semibold text-blue-900">
                          New Stock Level:{" "}
                          {adjustmentType === "add"
                            ? selectedMaterial.currentStock + parseInt(adjustmentQuantity || "0")
                            : selectedMaterial.currentStock - parseInt(adjustmentQuantity || "0")}{" "}
                          {selectedMaterial.unit}
                        </p>
                      </Card>
                    )}
                  </div>
                )}

                {/* View-Only Notice with Tooltip */}
                {canViewOnly && (
                  <Card className="p-4 bg-gray-50 border-gray-200">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Tooltip>
                        <TooltipTrigger>
                          <Lock className="h-4 w-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs max-w-xs">
                            You do not have permission to modify stock levels. Required role: Raw
                            Material Store or Master Admin.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                      <p className="text-sm">
                        Stock updates are disabled. Contact Raw Material Store or Master Admin for
                        changes.
                      </p>
                    </div>
                  </Card>
                )}

                {/* Last Restock Info */}
                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>Last Restocked:</strong> {selectedMaterial.lastRestockDate} (
                    {selectedMaterial.lastRestockQuantity} {selectedMaterial.unit})
                  </p>
                  <p>
                    <strong>Last Updated:</strong> {selectedMaterial.lastUpdated}
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                {canEdit ? "Cancel" : "Close"}
              </Button>
              {canEdit && (
                <Button onClick={handleSaveStockUpdate}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Material Dialog */}
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Raw Material</DialogTitle>
              <DialogDescription>Add a new raw material item to the inventory</DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Material Code</Label>
                <Input placeholder="RM-XXX" />
              </div>
              <div>
                <Label>Material Name</Label>
                <Input placeholder="e.g., Polyester Thread - White" />
              </div>
              <div>
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thread">Thread & Yarn</SelectItem>
                    <SelectItem value="fasteners">Fasteners</SelectItem>
                    <SelectItem value="elastic">Elastic & Trims</SelectItem>
                    <SelectItem value="labels">Labels & Tags</SelectItem>
                    <SelectItem value="interfacing">Interfacing</SelectItem>
                    <SelectItem value="notions">Notions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Sub-Category</Label>
                <Input placeholder="e.g., Polyester Thread" />
              </div>
              <div>
                <Label>Initial Stock</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <Label>Unit</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pieces">Pieces</SelectItem>
                    <SelectItem value="spools">Spools</SelectItem>
                    <SelectItem value="meters">Meters</SelectItem>
                    <SelectItem value="packs">Packs</SelectItem>
                    <SelectItem value="boxes">Boxes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Minimum Stock</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <Label>Maximum Stock</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <Label>Reorder Point</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <Label>Lead Time (Days)</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <Label>Price per Unit (₹)</Label>
                <Input type="number" placeholder="0" />
              </div>
              <div>
                <Label>Location</Label>
                <Input placeholder="e.g., Shelf A1-01" />
              </div>
              <div className="col-span-2">
                <Label>Supplier</Label>
                <Input placeholder="e.g., Thread Masters Inc" />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
}