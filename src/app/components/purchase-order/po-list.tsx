import { useState } from "react";
import { Plus, Search, Calendar, Building2, Package, TrendingUp, Eye, Upload, HelpCircle, Loader2, FileText, ChevronDown, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { PurchaseOrder } from "./purchase-order-types";
import { WorkflowGuide } from "./workflow-guide";
import { usePOData } from "@/app/contexts/po-data-context";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface POListProps {
  purchaseOrders: PurchaseOrder[];
  onCreateDetailedPO: () => void;
  onUploadPO: () => void;
  onSelectPO: (po: PurchaseOrder) => void;
  onUploadEmployees: (po: PurchaseOrder) => void;
  onViewPOTemplate: (po: PurchaseOrder) => void;
  userRole: string;
  onOpenSizeAnalysis?: () => void;
}

export function POList({ 
  purchaseOrders, 
  onCreateDetailedPO,
  onUploadPO,
  onSelectPO,
  onUploadEmployees,
  onViewPOTemplate,
  userRole,
  onOpenSizeAnalysis
}: POListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const { isLoading, isSyncing, deletePurchaseOrder, updatePurchaseOrder } = usePOData();

  const filteredPOs = purchaseOrders.filter((po) =>
    po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    po.clientCompanyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (po: PurchaseOrder) => {
    setSelectedPO(po);
    setEditDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPO) {
      deletePurchaseOrder(selectedPO.id);
      setDeleteDialogOpen(false);
      setSelectedPO(null);
      toast.success("Purchase Order deleted successfully!");
    }
  };

  const handleUpdatePO = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedPO) {
      updatePurchaseOrder({
        ...selectedPO,
        updatedDate: new Date().toISOString(),
      });
      setEditDialogOpen(false);
      setSelectedPO(null);
      toast.success("Purchase Order updated successfully!");
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      "draft": { bg: "bg-gray-100", text: "text-gray-700", label: "Draft" },
      "confirmed": { bg: "bg-blue-100", text: "text-blue-700", label: "Confirmed" },
      "in-measurement": { bg: "bg-yellow-100", text: "text-yellow-700", label: "In Measurement" },
      "in-production": { bg: "bg-purple-100", text: "text-purple-700", label: "In Production" },
      "completed": { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
      "cancelled": { bg: "bg-red-100", text: "text-red-700", label: "Cancelled" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getProgressPercentage = (po: PurchaseOrder) => {
    if (po.totalQuantity === 0) return 0;
    return Math.round((po.measurementsCompleted / po.totalQuantity) * 100);
  };

  // Calculate dynamic stats
  const totalEmployees = purchaseOrders.reduce((sum, po) => sum + po.totalQuantity, 0);
  const totalMeasured = purchaseOrders.reduce((sum, po) => sum + po.measurementsCompleted, 0);
  const totalOrderValue = purchaseOrders.reduce((sum, po) => sum + (po.totalOrderValue || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">Purchase Orders</h1>
            {isSyncing && (
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-blue-50 px-2 py-1 rounded-full">
                <Loader2 className="h-3 w-3 animate-spin" />
                Syncing...
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage all purchase orders and track measurement progress
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {onOpenSizeAnalysis && purchaseOrders.filter(po => po.employeesUploaded > 0).length > 0 && (
            <Button 
              variant="outline"
              onClick={onOpenSizeAnalysis}
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              Size Analysis
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={() => setShowWorkflowGuide(true)}
          >
            <HelpCircle className="h-5 w-5 mr-2" />
            View Workflow Guide
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Package className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total POs</p>
              <p className="text-2xl font-bold">{purchaseOrders.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active POs</p>
              <p className="text-2xl font-bold">
                {purchaseOrders.filter(po => 
                  ["confirmed", "in-measurement", "in-production"].includes(po.status)
                ).length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Measurement</p>
              <p className="text-2xl font-bold">
                {purchaseOrders.filter(po => po.status === "in-measurement").length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold">
                {purchaseOrders.filter(po => po.status === "completed").length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      {purchaseOrders.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by PO number or client name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0"
            />
          </div>
        </Card>
      )}

      {/* Loading State */}
      {isLoading ? (
        <Card className="p-12 text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold mb-2">Loading Purchase Orders...</h3>
          <p className="text-muted-foreground">
            Fetching your data from the server
          </p>
        </Card>
      ) : (
        /* PO List */
        <div className="space-y-4">
          {filteredPOs.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-16 w-16 text-indigo-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? "No Matching Purchase Orders" : "No Purchase Orders Yet"}
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? "Try adjusting your search criteria to find what you're looking for." 
                  : "Get started by creating your first purchase order. You can then upload employee data and begin the measurement workflow."
                }
              </p>
              {userRole === "master-manager" && !searchQuery && (
                <div className="flex flex-col items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowWorkflowGuide(true)}
                    className="text-muted-foreground"
                  >
                    <HelpCircle className="h-4 w-4 mr-1" />
                    Learn how the PO workflow works
                  </Button>
                </div>
              )}
              {userRole !== "master-manager" && !searchQuery && (
                <p className="text-sm text-muted-foreground italic">
                  Only Master Manager can create new purchase orders. Please contact your admin.
                </p>
              )}
            </Card>
          ) : (
            filteredPOs.map((po) => {
              const progressPercent = getProgressPercentage(po);
              const daysUntilDeadline = Math.ceil(
                (new Date(po.deliveryDeadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );

              return (
                <Card key={po.id} className="p-4 md:p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold font-mono text-indigo-600">
                          {po.poNumber}
                        </h3>
                        {getStatusBadge(po.status)}
                        {po.orderPriority === "urgent" && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase">
                            Urgent
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Building2 className="h-4 w-4" />
                        <span className="font-semibold">{po.clientCompanyName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {new Date(po.deliveryDeadline).toLocaleDateString()}</span>
                        <span className={`ml-2 ${daysUntilDeadline < 7 ? "text-red-600 font-semibold" : ""}`}>
                          ({daysUntilDeadline > 0 ? `${daysUntilDeadline} days left` : "Overdue"})
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(userRole === "master-manager" || userRole === "hr") && 
                       (po.status === "draft" || po.status === "confirmed") && 
                       po.employeesUploaded === 0 && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => onUploadEmployees(po)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Employees
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectPO(po)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewPOTemplate(po)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Template
                      </Button>
                      {userRole === "master-manager" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleEditClick(po)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit PO
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteClick(po)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete PO
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 p-3 md:p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Quantity</p>
                      <p className="font-semibold">{po.totalQuantity} employees</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Uniform Type</p>
                      <p className="font-semibold capitalize">{po.uniformType.replace("-", " ")}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Order Value</p>
                      <p className="font-semibold">
                        {po.totalOrderValue ? `₹${po.totalOrderValue.toLocaleString('en-IN')}` : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Employees Uploaded</p>
                      <p className="font-semibold">
                        {po.employeesUploaded > 0 ? (
                          <span className="text-green-600">{po.employeesUploaded}</span>
                        ) : (
                          <span className="text-gray-400">Not uploaded</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Measurement Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {po.measurementsCompleted} / {po.totalQuantity} completed ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          progressPercent === 100 ? "bg-green-600" : "bg-indigo-600"
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    {po.measurementsInProgress > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {po.measurementsInProgress} measurements in progress
                      </p>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Workflow Guide */}
      {showWorkflowGuide && (
        <WorkflowGuide onClose={() => setShowWorkflowGuide(false)} />
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Delete Purchase Order
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this purchase order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedPO && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">PO Number:</span>
                <span className="text-sm font-mono font-bold text-red-700">{selectedPO.poNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Client:</span>
                <span className="text-sm text-gray-900">{selectedPO.clientCompanyName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Total Quantity:</span>
                <span className="text-sm text-gray-900">{selectedPO.totalQuantity} employees</span>
              </div>
              {selectedPO.employeesUploaded > 0 && (
                <div className="mt-2 pt-2 border-t border-red-200">
                  <p className="text-xs text-red-700 font-medium">
                    ⚠️ Warning: {selectedPO.employeesUploaded} employee(s) have been uploaded for this PO. All associated data will be permanently deleted.
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Purchase Order</DialogTitle>
            <DialogDescription>
              Make changes to the purchase order details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePO} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="poNumber">PO Number</Label>
                <Input
                  id="poNumber"
                  placeholder="PO-12345"
                  value={selectedPO?.poNumber || ""}
                  onChange={(e) => setSelectedPO({ ...selectedPO!, poNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientCompanyName">Client Company Name</Label>
                <Input
                  id="clientCompanyName"
                  placeholder="ABC Company"
                  value={selectedPO?.clientCompanyName || ""}
                  onChange={(e) => setSelectedPO({ ...selectedPO!, clientCompanyName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientContactPerson">Contact Person</Label>
                <Input
                  id="clientContactPerson"
                  placeholder="John Doe"
                  value={selectedPO?.clientContactPerson || ""}
                  onChange={(e) => setSelectedPO({ ...selectedPO!, clientContactPerson: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientContactEmail">Contact Email</Label>
                <Input
                  id="clientContactEmail"
                  type="email"
                  placeholder="john@example.com"
                  value={selectedPO?.clientContactEmail || ""}
                  onChange={(e) => setSelectedPO({ ...selectedPO!, clientContactEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryDeadline">Delivery Deadline</Label>
                <Input
                  id="deliveryDeadline"
                  type="date"
                  value={selectedPO?.deliveryDeadline || ""}
                  onChange={(e) => setSelectedPO({ ...selectedPO!, deliveryDeadline: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalQuantity">Total Quantity</Label>
                <Input
                  id="totalQuantity"
                  type="number"
                  placeholder="10"
                  value={selectedPO?.totalQuantity || ""}
                  onChange={(e) => setSelectedPO({ ...selectedPO!, totalQuantity: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="uniformType">Uniform Type</Label>
                <Select
                  value={selectedPO?.uniformType || "both"}
                  onValueChange={(value) => setSelectedPO({ ...selectedPO!, uniformType: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select uniform type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shirt-only">Shirt Only</SelectItem>
                    <SelectItem value="pant-only">Pant Only</SelectItem>
                    <SelectItem value="both">Both (Shirt & Pant)</SelectItem>
                    <SelectItem value="blazer">Blazer</SelectItem>
                    <SelectItem value="full-suit">Full Suit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalOrderValue">Total Order Value (₹)</Label>
                <Input
                  id="totalOrderValue"
                  type="number"
                  placeholder="50000"
                  value={selectedPO?.totalOrderValue || ""}
                  onChange={(e) => setSelectedPO({ ...selectedPO!, totalOrderValue: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={selectedPO?.status || "draft"}
                  onValueChange={(value) => setSelectedPO({ ...selectedPO!, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="in-measurement">In Measurement</SelectItem>
                    <SelectItem value="in-production">In Production</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderPriority">Order Priority</Label>
                <Select
                  value={selectedPO?.orderPriority || "normal"}
                  onValueChange={(value) => setSelectedPO({ ...selectedPO!, orderPriority: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="rush">Rush</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}