import { useState, useMemo } from "react";
import {
  Plus,
  Upload,
  Search,
  Package,
  Eye,
  Download,
  Trash2,
  MoreVertical,
  Pencil,
  ArrowLeft,
  Loader2,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  TrendingUp,
} from "lucide-react";
import { DetailedPOCreationForm } from "@/app/components/purchase-order/detailed-po-creation-form";
import { POUpload } from "@/app/components/purchase-order/po-upload";
import { POTemplatePreview } from "@/app/components/purchase-order/po-template-preview";
import { usePOData } from "@/app/contexts/po-data-context";
import { PurchaseOrder } from "@/app/components/purchase-order/purchase-order-types";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";

type View = "dashboard" | "create" | "upload";

// ── Helpers ────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { dot: string; label: string; badge: string }> = {
  draft:            { dot: "bg-gray-400",   label: "Draft",          badge: "bg-gray-100 text-gray-600" },
  confirmed:        { dot: "bg-blue-500",   label: "Confirmed",      badge: "bg-blue-50 text-blue-700" },
  "in-measurement": { dot: "bg-amber-500",  label: "In Measurement", badge: "bg-amber-50 text-amber-700" },
  "in-production":  { dot: "bg-violet-500", label: "In Production",  badge: "bg-violet-50 text-violet-700" },
  completed:        { dot: "bg-emerald-500",label: "Completed",      badge: "bg-emerald-50 text-emerald-700" },
  cancelled:        { dot: "bg-rose-400",   label: "Cancelled",      badge: "bg-rose-50 text-rose-600" },
};

function StatusPill({ status }: { status: string }) {
  const c = STATUS_CONFIG[status] ?? STATUS_CONFIG.draft;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${c.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function uniformDisplay(type: string) {
  const map: Record<string, string> = {
    "shirt-only": "Shirt Only",
    "pant-only":  "Pant Only",
    "both":       "Shirt & Pant",
    "tshirt-only":"T-Shirt Only",
    "blazer":     "Blazer",
    "full-suit":  "Full Suit",
  };
  return map[type] ?? type;
}

// ── Section primitives (same as master dashboard) ──────────────────────────

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ title, sub, right }: { title: string; sub?: string; right?: React.ReactNode }) {
  return (
    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

// ── PO Table ───────────────────────────────────────────────────────────────

interface POTableProps {
  title: string;
  sub: string;
  pos: PurchaseOrder[];
  onView: (po: PurchaseOrder) => void;
  onDownload: (po: PurchaseOrder) => void;
  onEdit: (po: PurchaseOrder) => void;
  onDelete: (po: PurchaseOrder) => void;
}

function POTable({ title, sub, pos, onView, onDownload, onEdit, onDelete }: POTableProps) {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [uniformFilter, setUniformFilter] = useState("all");

  const filtered = useMemo(() => pos.filter((po) => {
    const q = search.toLowerCase();
    const matchSearch =
      po.poNumber.toLowerCase().includes(q) ||
      po.clientCompanyName.toLowerCase().includes(q) ||
      (po.clientContactPerson || "").toLowerCase().includes(q);
    const matchStatus  = statusFilter === "all"  || po.status === statusFilter;
    const matchUniform = uniformFilter === "all" || po.uniformType === uniformFilter;
    return matchSearch && matchStatus && matchUniform;
  }), [pos, search, statusFilter, uniformFilter]);

  return (
    <SectionCard>
      <CardHeader
        title={title}
        sub={sub}
        right={
          <span className="text-[11px] text-gray-400 font-medium">
            {filtered.length} / {pos.length}
          </span>
        }
      />

      {/* Filter bar */}
      <div className="px-6 py-3 border-b border-gray-100 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search PO number, client…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 text-xs border-gray-200 bg-gray-50 focus:bg-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-8 text-xs w-full sm:w-40 border-gray-200 bg-gray-50">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in-measurement">In Measurement</SelectItem>
            <SelectItem value="in-production">In Production</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={uniformFilter} onValueChange={setUniformFilter}>
          <SelectTrigger className="h-8 text-xs w-full sm:w-40 border-gray-200 bg-gray-50">
            <SelectValue placeholder="All uniforms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Uniforms</SelectItem>
            <SelectItem value="shirt-only">Shirt Only</SelectItem>
            <SelectItem value="pant-only">Pant Only</SelectItem>
            <SelectItem value="both">Shirt & Pant</SelectItem>
            <SelectItem value="tshirt-only">T-Shirt Only</SelectItem>
            <SelectItem value="blazer">Blazer</SelectItem>
            <SelectItem value="full-suit">Full Suit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-2 text-gray-400">
            <Package className="h-8 w-8 opacity-30" />
            <p className="text-xs font-medium">
              {pos.length === 0 ? "No records yet" : "No records match your filters"}
            </p>
          </div>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wide">
                <th className="text-left px-6 py-3 font-semibold">PO Number</th>
                <th className="text-left px-6 py-3 font-semibold">Client</th>
                <th className="text-left px-6 py-3 font-semibold">Uniform</th>
                <th className="text-left px-6 py-3 font-semibold">Qty</th>
                <th className="text-left px-6 py-3 font-semibold">Deadline</th>
                <th className="text-left px-6 py-3 font-semibold">Status</th>
                <th className="text-left px-6 py-3 font-semibold">Progress</th>
                <th className="text-right px-6 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((po) => {
                const progress  = po.totalQuantity > 0 ? Math.round((po.measurementsCompleted / po.totalQuantity) * 100) : 0;
                const deadline  = new Date(po.deliveryDeadline);
                const daysLeft  = Math.ceil((deadline.getTime() - Date.now()) / 86_400_000);
                const overdue   = daysLeft < 0;

                return (
                  <tr key={po.id} className="hover:bg-gray-50/60 transition-colors">
                    {/* PO number */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold text-indigo-600 text-[13px]">
                          {po.poNumber}
                        </span>
                        {po.orderPriority === "urgent" && (
                          <span className="px-1.5 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded uppercase tracking-wide">
                            Urgent
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Client */}
                    <td className="px-6 py-3.5">
                      <p className="font-medium text-gray-800 truncate max-w-[150px]">{po.clientCompanyName}</p>
                      {po.clientContactPerson && (
                        <p className="text-gray-400 truncate max-w-[150px]">{po.clientContactPerson}</p>
                      )}
                    </td>

                    {/* Uniform */}
                    <td className="px-6 py-3.5 text-gray-600">{uniformDisplay(po.uniformType)}</td>

                    {/* Qty */}
                    <td className="px-6 py-3.5 font-medium text-gray-700">{po.totalQuantity}</td>

                    {/* Deadline */}
                    <td className="px-6 py-3.5">
                      <p className="text-gray-700">
                        {deadline.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </p>
                      <p className={overdue ? "text-rose-500 font-medium" : "text-gray-400"}>
                        {overdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-3.5">
                      <StatusPill status={po.status} />
                    </td>

                    {/* Progress */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2 min-w-[80px]">
                        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-1 rounded-full ${progress === 100 ? "bg-emerald-500" : "bg-indigo-500"}`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <span className="text-gray-400 w-8 text-right">{progress}%</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-0.5">
                        <button
                          onClick={() => onView(po)}
                          title="View document"
                          className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDownload(po)}
                          title="Download"
                          className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="text-xs">
                            <DropdownMenuItem onClick={() => onEdit(po)} className="text-xs">
                              <Pencil className="h-3.5 w-3.5 mr-2" /> Edit PO
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onDelete(po)} className="text-xs text-rose-600 focus:text-rose-600">
                              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete PO
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </SectionCard>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export function CreatePOPage({ onNavigate }: { onNavigate: (key: string) => void }) {
  const [view, setView] = useState<View>("dashboard");
  const { purchaseOrders, addPurchaseOrder, deletePurchaseOrder, updatePurchaseOrder, isLoading } = usePOData();
  const userEmail = localStorage.getItem("loggedInUser") || "";

  const [previewPO,      setPreviewPO]      = useState<PurchaseOrder | null>(null);
  const [deleteOpen,     setDeleteOpen]     = useState(false);
  const [editOpen,       setEditOpen]       = useState(false);
  const [selectedPO,     setSelectedPO]     = useState<PurchaseOrder | null>(null);

  const clientPOs      = purchaseOrders.filter((p) =>  p.uploadedDocument);
  const sunnyFabricPOs = purchaseOrders.filter((p) => !p.uploadedDocument);

  // ── Actions ─────────────────────────────────────────────────────────────

  const handleSave = (po: PurchaseOrder) => {
    addPurchaseOrder(po);
    toast.success("Purchase Order saved.");
    setView("dashboard");
  };

  const handleDownload = (po: PurchaseOrder) => {
    if (po.uploadedDocument) {
      const src = po.uploadedDocument.fileUrl || po.uploadedDocument.fileData;
      if (src) {
        const a = document.createElement("a");
        a.href = src;
        a.download = po.uploadedDocument.fileName;
        a.target = "_blank";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
      }
    }
    setPreviewPO(po);
  };

  const confirmDelete = () => {
    if (selectedPO) {
      deletePurchaseOrder(selectedPO.id);
      toast.success("Purchase Order deleted.");
      setDeleteOpen(false);
      setSelectedPO(null);
    }
  };

  const handleUpdatePO = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedPO) {
      updatePurchaseOrder({ ...selectedPO, updatedDate: new Date().toISOString() });
      toast.success("Purchase Order updated.");
      setEditOpen(false);
      setSelectedPO(null);
    }
  };

  // ── Sub-views ────────────────────────────────────────────────────────────

  if (view === "create") {
    return <DetailedPOCreationForm onSave={handleSave} onCancel={() => setView("dashboard")} currentUserEmail={userEmail} />;
  }

  if (view === "upload") {
    return <POUpload onSave={handleSave} onCancel={() => setView("dashboard")} />;
  }

  // ── Stats ────────────────────────────────────────────────────────────────

  const totalPOs    = purchaseOrders.length;
  const activePOs   = purchaseOrders.filter((p) => ["confirmed","in-measurement","in-production"].includes(p.status)).length;
  const completedPOs= purchaseOrders.filter((p) => p.status === "completed").length;
  const urgentPOs   = purchaseOrders.filter((p) => p.orderPriority === "urgent").length;

  const statItems = [
    { label: "Total POs",  value: totalPOs,     icon: Package,      dot: "bg-indigo-500"  },
    { label: "Active",     value: activePOs,     icon: TrendingUp,   dot: "bg-blue-500"    },
    { label: "Completed",  value: completedPOs,  icon: CheckCircle2, dot: "bg-emerald-500" },
    { label: "Urgent",     value: urgentPOs,     icon: AlertTriangle,dot: "bg-rose-500"    },
  ];

  // ── Dashboard ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5 pb-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Purchase Orders</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage client POs and Sunny Fabric internal POs</p>
        </div>
        <button
          onClick={() => onNavigate("master-dashboard")}
          className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Dashboard
        </button>
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => setView("upload")}
          className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:border-indigo-300 hover:shadow-sm transition-all text-left group shadow-sm"
        >
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-100 transition-colors flex-shrink-0">
            <Upload className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Upload Client PO</p>
            <p className="text-xs text-gray-400 mt-0.5">Import a purchase order received from a client</p>
          </div>
        </button>

        <button
          onClick={() => setView("create")}
          className="flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:border-emerald-300 hover:shadow-sm transition-all text-left group shadow-sm"
        >
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-100 transition-colors flex-shrink-0">
            <Plus className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Create New PO</p>
            <p className="text-xs text-gray-400 mt-0.5">Create a Sunny Fabric purchase order manually</p>
          </div>
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading purchase orders…</span>
        </div>
      ) : (
        <>
          {/* Stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statItems.map(({ label, value, icon: Icon, dot }) => (
              <div key={label} className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-4 flex items-center gap-4">
                <div className={`w-2 h-8 rounded-full ${dot}`} />
                <div>
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Client PO table */}
          <POTable
            title="Client PO Records"
            sub="Purchase orders uploaded from clients"
            pos={clientPOs}
            onView={setPreviewPO}
            onDownload={handleDownload}
            onEdit={(po) => { setSelectedPO(po); setEditOpen(true); }}
            onDelete={(po) => { setSelectedPO(po); setDeleteOpen(true); }}
          />

          {/* Sunny Fabric PO table */}
          <POTable
            title="Sunny Fabric PO Records"
            sub="Internal purchase orders created by Sunny And Friends"
            pos={sunnyFabricPOs}
            onView={setPreviewPO}
            onDownload={handleDownload}
            onEdit={(po) => { setSelectedPO(po); setEditOpen(true); }}
            onDelete={(po) => { setSelectedPO(po); setDeleteOpen(true); }}
          />
        </>
      )}

      {/* Document preview */}
      {previewPO && <POTemplatePreview purchaseOrder={previewPO} onClose={() => setPreviewPO(null)} />}

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-rose-600 text-sm">
              <Trash2 className="h-4 w-4" /> Delete Purchase Order
            </DialogTitle>
            <DialogDescription className="text-xs">
              This action cannot be undone. All associated data will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          {selectedPO && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 space-y-1.5 text-xs">
              <div className="flex gap-2"><span className="text-gray-500 font-medium w-24">PO Number</span><span className="font-mono font-bold text-rose-700">{selectedPO.poNumber}</span></div>
              <div className="flex gap-2"><span className="text-gray-500 font-medium w-24">Client</span><span className="text-gray-800">{selectedPO.clientCompanyName}</span></div>
              <div className="flex gap-2"><span className="text-gray-500 font-medium w-24">Quantity</span><span className="text-gray-800">{selectedPO.totalQuantity} employees</span></div>
              {selectedPO.employeesUploaded > 0 && (
                <p className="text-rose-600 font-medium pt-2 border-t border-rose-100">
                  ⚠ {selectedPO.employeesUploaded} employee(s) uploaded — all data will be deleted.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <button onClick={() => setDeleteOpen(false)} className="text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
              Cancel
            </button>
            <button onClick={confirmDelete} className="text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5">
              <Trash2 className="h-3.5 w-3.5" /> Delete Permanently
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[580px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">Edit Purchase Order</DialogTitle>
            <DialogDescription className="text-xs">Update the purchase order details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdatePO} className="space-y-4 pt-1">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "pn",  label: "PO Number",      field: "poNumber",          type: "text"  },
                { id: "cl",  label: "Client Company",  field: "clientCompanyName", type: "text"  },
                { id: "cp",  label: "Contact Person",  field: "clientContactPerson",type:"text"  },
                { id: "ce",  label: "Contact Email",   field: "clientContactEmail", type:"email" },
                { id: "dd",  label: "Deadline",        field: "deliveryDeadline",  type: "date"  },
                { id: "qty", label: "Total Quantity",  field: "totalQuantity",     type: "number"},
                { id: "ov",  label: "Order Value (₹)", field: "totalOrderValue",   type: "number"},
              ].map(({ id, label, field, type }) => (
                <div key={id} className="space-y-1.5">
                  <Label htmlFor={id} className="text-xs font-medium text-gray-700">{label}</Label>
                  <Input
                    id={id}
                    type={type}
                    value={(selectedPO as any)?.[field] ?? ""}
                    onChange={(e) => setSelectedPO((p) => p ? ({
                      ...p,
                      [field]: type === "number" ? (parseFloat(e.target.value) || 0) : e.target.value,
                    }) : p)}
                    className="h-8 text-xs border-gray-200"
                  />
                </div>
              ))}

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700">Uniform Type</Label>
                <Select value={selectedPO?.uniformType ?? "both"} onValueChange={(v) => setSelectedPO((p) => p ? ({ ...p, uniformType: v as any }) : p)}>
                  <SelectTrigger className="h-8 text-xs border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="shirt-only">Shirt Only</SelectItem>
                    <SelectItem value="pant-only">Pant Only</SelectItem>
                    <SelectItem value="both">Shirt & Pant</SelectItem>
                    <SelectItem value="tshirt-only">T-Shirt Only</SelectItem>
                    <SelectItem value="blazer">Blazer</SelectItem>
                    <SelectItem value="full-suit">Full Suit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700">Status</Label>
                <Select value={selectedPO?.status ?? "draft"} onValueChange={(v) => setSelectedPO((p) => p ? ({ ...p, status: v as any }) : p)}>
                  <SelectTrigger className="h-8 text-xs border-gray-200"><SelectValue /></SelectTrigger>
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

              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700">Priority</Label>
                <Select value={selectedPO?.orderPriority ?? "normal"} onValueChange={(v) => setSelectedPO((p) => p ? ({ ...p, orderPriority: v as any }) : p)}>
                  <SelectTrigger className="h-8 text-xs border-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="rush">Rush</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <button type="button" onClick={() => setEditOpen(false)} className="text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" className="text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 px-4 py-2 rounded-lg transition-colors">
                Save Changes
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
