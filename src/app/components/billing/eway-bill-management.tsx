import { useState, useMemo } from "react";
import {
  Plus, Search, Download, Truck, Package, MapPin, Hash,
  Calendar, ChevronDown, FileText, Printer, Eye, Trash2,
  CheckCircle, Clock, XCircle, ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

// ── Types ──────────────────────────────────────────────────────────────────

type TransactionType = "outward" | "inward";
type SupplyType = "b2b" | "b2c" | "export" | "import" | "job_work" | "others";
type TransportMode = "road" | "rail" | "air" | "ship";
type EWayStatus = "active" | "cancelled" | "expired";

interface EWayBillItem {
  id: string;
  description: string;
  hsnCode: string;
  quantity: number;
  unit: string;
  taxableValue: number;
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
}

interface EWayBill {
  id: string;
  ewbNumber: string;
  generatedDate: string;
  validUpto: string;
  status: EWayStatus;
  transactionType: TransactionType;
  supplyType: SupplyType;
  // Parties
  fromGstin: string;
  fromName: string;
  fromAddress: string;
  fromState: string;
  fromPincode: string;
  toGstin: string;
  toName: string;
  toAddress: string;
  toState: string;
  toPincode: string;
  // Transport
  transportMode: TransportMode;
  vehicleNumber: string;
  transporterName: string;
  transporterGstin: string;
  lrNumber: string;
  distance: string;
  // Document
  docType: string;
  docNumber: string;
  docDate: string;
  // Items
  items: EWayBillItem[];
  // Totals
  totalValue: number;
  cgstAmount: number;
  sgstAmount: number;
  igstAmount: number;
  totalTaxAmount: number;
  grandTotal: number;
  // Linked bill
  linkedBillNumber?: string;
}

// ── Storage ────────────────────────────────────────────────────────────────

const EWAY_KEY = "erp_eway_bills";
function loadEWayBills(): EWayBill[] {
  try { return JSON.parse(localStorage.getItem(EWAY_KEY) || "[]"); } catch { return []; }
}
function saveEWayBills(bills: EWayBill[]) {
  localStorage.setItem(EWAY_KEY, JSON.stringify(bills));
}

// ── Helpers ────────────────────────────────────────────────────────────────

function genEWBNumber() {
  return `EWB${Date.now().toString().slice(-10)}`;
}
function validUpto(fromDate: string, days = 1) {
  const d = new Date(fromDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}
function fmt(n: number) {
  return "₹" + (n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana",
  "Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
  "Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir","Ladakh",
];

const STATUS_CFG: Record<EWayStatus, { label: string; bg: string; text: string; icon: any }> = {
  active:    { label: "Active",    bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle },
  cancelled: { label: "Cancelled", bg: "bg-red-50",     text: "text-red-600",    icon: XCircle },
  expired:   { label: "Expired",   bg: "bg-gray-100",   text: "text-gray-500",   icon: Clock },
};

function StatusBadge({ status }: { status: EWayStatus }) {
  const cfg = STATUS_CFG[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <Icon className="h-2.5 w-2.5" />
      {cfg.label}
    </span>
  );
}

const BLANK_ITEM: EWayBillItem = { id: "", description: "", hsnCode: "", quantity: 1, unit: "NOS", taxableValue: 0, cgstRate: 9, sgstRate: 9, igstRate: 0 };

const BLANK_FORM: Omit<EWayBill, "id" | "ewbNumber" | "generatedDate" | "validUpto" | "status" | "totalValue" | "cgstAmount" | "sgstAmount" | "igstAmount" | "totalTaxAmount" | "grandTotal"> = {
  transactionType: "outward",
  supplyType: "b2b",
  fromGstin: "", fromName: "", fromAddress: "", fromState: "", fromPincode: "",
  toGstin: "", toName: "", toAddress: "", toState: "", toPincode: "",
  transportMode: "road", vehicleNumber: "", transporterName: "", transporterGstin: "", lrNumber: "", distance: "",
  docType: "Tax Invoice", docNumber: "", docDate: "",
  items: [{ ...BLANK_ITEM, id: "1" }],
  linkedBillNumber: "",
};

// ── Form ───────────────────────────────────────────────────────────────────

function EWayBillForm({ onSave, onCancel, linkedBills }: {
  onSave: (bill: EWayBill) => void;
  onCancel: () => void;
  linkedBills: { billNumber: string; billedTo: { name: string }; totalAmount: number }[];
}) {
  const [form, setForm] = useState({ ...BLANK_FORM });
  const [items, setItems] = useState<EWayBillItem[]>([{ ...BLANK_ITEM, id: "1" }]);

  const set = (field: string, val: any) => setForm(f => ({ ...f, [field]: val }));

  // Auto-fill from linked bill
  const loadBillCache = () => {
    try { return JSON.parse(localStorage.getItem("erp_bills") || "[]"); } catch { return []; }
  };

  function handleLinkBill(billNumber: string) {
    set("linkedBillNumber", billNumber);
    if (!billNumber) return;
    const bill = loadBillCache().find((b: any) => b.billNumber === billNumber);
    if (!bill) return;
    set("docNumber", bill.billNumber);
    set("docDate", bill.invoiceDate || bill.poDate || "");
    set("toName", bill.billedTo?.name || "");
    set("toAddress", `${bill.billedTo?.address || ""}, ${bill.billedTo?.city || ""}`);
    set("toState", bill.billedTo?.state || "");
    set("toPincode", bill.billedTo?.pincode || "");
    set("toGstin", bill.billedTo?.gstin || "");
    if (bill.items?.length) {
      setItems(bill.items.map((it: any, i: number) => ({
        id: String(i + 1),
        description: it.description || it.name || "",
        hsnCode: it.hsnCode || "",
        quantity: it.quantity || 1,
        unit: it.unit || "NOS",
        taxableValue: it.amount || it.rate * it.quantity || 0,
        cgstRate: 9, sgstRate: 9, igstRate: 0,
      })));
    }
  }

  const totals = useMemo(() => {
    const taxableValue = items.reduce((a, it) => a + (Number(it.taxableValue) || 0), 0);
    const cgst = items.reduce((a, it) => a + (Number(it.taxableValue) || 0) * (Number(it.cgstRate) || 0) / 100, 0);
    const sgst = items.reduce((a, it) => a + (Number(it.taxableValue) || 0) * (Number(it.sgstRate) || 0) / 100, 0);
    const igst = items.reduce((a, it) => a + (Number(it.taxableValue) || 0) * (Number(it.igstRate) || 0) / 100, 0);
    return { taxableValue, cgst, sgst, igst, total: taxableValue + cgst + sgst + igst };
  }, [items]);

  const addItem = () => setItems(prev => [...prev, { ...BLANK_ITEM, id: String(Date.now()) }]);
  const removeItem = (id: string) => setItems(prev => prev.filter(it => it.id !== id));
  const updateItem = (id: string, field: keyof EWayBillItem, val: any) =>
    setItems(prev => prev.map(it => it.id === id ? { ...it, [field]: val } : it));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.fromName || !form.toName || !form.docNumber) {
      toast.error("Please fill all required fields");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    const bill: EWayBill = {
      ...form,
      id: `ewb_${Date.now()}`,
      ewbNumber: genEWBNumber(),
      generatedDate: today,
      validUpto: validUpto(today, Number(form.distance) > 100 ? 3 : 1),
      status: "active",
      items,
      totalValue: totals.taxableValue,
      cgstAmount: totals.cgst,
      sgstAmount: totals.sgst,
      igstAmount: totals.igst,
      totalTaxAmount: totals.cgst + totals.sgst + totals.igst,
      grandTotal: totals.total,
    };
    onSave(bill);
    toast.success("E-Way Bill generated successfully!");
  }

  const fieldCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors";
  const labelCls = "block text-[11px] font-medium text-gray-500 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-4 flex items-center gap-3">
        <button type="button" onClick={onCancel} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Generate E-Way Bill</h2>
          <p className="text-xs text-gray-400 mt-0.5">Fill in the transport and goods details</p>
        </div>
      </div>

      {/* Link to bill */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-100">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Link to Invoice (Optional)</p>
        </div>
        <div className="px-6 py-4">
          <label className={labelCls}>Select Invoice to Auto-Fill</label>
          <select
            value={form.linkedBillNumber}
            onChange={e => handleLinkBill(e.target.value)}
            className={fieldCls}
          >
            <option value="">-- Select Invoice --</option>
            {linkedBills.map(b => (
              <option key={b.billNumber} value={b.billNumber}>
                {b.billNumber} · {b.billedTo?.name} · {fmt(b.totalAmount)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transaction details */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-100">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Transaction Details</p>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className={labelCls}>Transaction Type <span className="text-red-400">*</span></label>
            <select className={fieldCls} value={form.transactionType} onChange={e => set("transactionType", e.target.value)}>
              <option value="outward">Outward</option>
              <option value="inward">Inward</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Supply Type</label>
            <select className={fieldCls} value={form.supplyType} onChange={e => set("supplyType", e.target.value)}>
              <option value="b2b">B2B</option>
              <option value="b2c">B2C</option>
              <option value="export">Export</option>
              <option value="import">Import</option>
              <option value="job_work">Job Work</option>
              <option value="others">Others</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Document Type</label>
            <select className={fieldCls} value={form.docType} onChange={e => set("docType", e.target.value)}>
              <option>Tax Invoice</option>
              <option>Bill of Supply</option>
              <option>Delivery Challan</option>
              <option>Credit Note</option>
              <option>Debit Note</option>
              <option>Others</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Document Date <span className="text-red-400">*</span></label>
            <input type="date" className={fieldCls} value={form.docDate} onChange={e => set("docDate", e.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Document / Invoice Number <span className="text-red-400">*</span></label>
            <input className={fieldCls} value={form.docNumber} onChange={e => set("docNumber", e.target.value)} placeholder="e.g. INV-2024-001" required />
          </div>
        </div>
      </div>

      {/* From / To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* From */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">From (Consignor)</p>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div><label className={labelCls}>GSTIN <span className="text-red-400">*</span></label><input className={fieldCls} value={form.fromGstin} onChange={e => set("fromGstin", e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" maxLength={15} required /></div>
            <div><label className={labelCls}>Name <span className="text-red-400">*</span></label><input className={fieldCls} value={form.fromName} onChange={e => set("fromName", e.target.value)} placeholder="Sender company name" required /></div>
            <div><label className={labelCls}>Address</label><input className={fieldCls} value={form.fromAddress} onChange={e => set("fromAddress", e.target.value)} placeholder="Full address" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>State</label>
                <select className={fieldCls} value={form.fromState} onChange={e => set("fromState", e.target.value)}>
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Pincode</label><input className={fieldCls} value={form.fromPincode} onChange={e => set("fromPincode", e.target.value)} placeholder="400001" maxLength={6} /></div>
            </div>
          </div>
        </div>

        {/* To */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">To (Consignee)</p>
          </div>
          <div className="px-6 py-5 space-y-3">
            <div><label className={labelCls}>GSTIN</label><input className={fieldCls} value={form.toGstin} onChange={e => set("toGstin", e.target.value.toUpperCase())} placeholder="22BBBBB0000B1Z5" maxLength={15} /></div>
            <div><label className={labelCls}>Name <span className="text-red-400">*</span></label><input className={fieldCls} value={form.toName} onChange={e => set("toName", e.target.value)} placeholder="Receiver company name" required /></div>
            <div><label className={labelCls}>Address</label><input className={fieldCls} value={form.toAddress} onChange={e => set("toAddress", e.target.value)} placeholder="Full address" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>State</label>
                <select className={fieldCls} value={form.toState} onChange={e => set("toState", e.target.value)}>
                  <option value="">Select State</option>
                  {STATES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div><label className={labelCls}>Pincode</label><input className={fieldCls} value={form.toPincode} onChange={e => set("toPincode", e.target.value)} placeholder="400001" maxLength={6} /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Transport */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2">
          <Truck className="w-3.5 h-3.5 text-gray-400" />
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Transport Details</p>
        </div>
        <div className="px-6 py-5 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Mode <span className="text-red-400">*</span></label>
            <select className={fieldCls} value={form.transportMode} onChange={e => set("transportMode", e.target.value)} required>
              <option value="road">Road</option>
              <option value="rail">Rail</option>
              <option value="air">Air</option>
              <option value="ship">Ship</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Vehicle Number</label>
            <input className={fieldCls} value={form.vehicleNumber} onChange={e => set("vehicleNumber", e.target.value.toUpperCase())} placeholder="MH12AB1234" />
          </div>
          <div>
            <label className={labelCls}>Distance (km)</label>
            <input type="number" className={fieldCls} value={form.distance} onChange={e => set("distance", e.target.value)} placeholder="e.g. 250" min={0} />
          </div>
          <div>
            <label className={labelCls}>Transporter Name</label>
            <input className={fieldCls} value={form.transporterName} onChange={e => set("transporterName", e.target.value)} placeholder="Transport company" />
          </div>
          <div>
            <label className={labelCls}>Transporter GSTIN</label>
            <input className={fieldCls} value={form.transporterGstin} onChange={e => set("transporterGstin", e.target.value.toUpperCase())} placeholder="GSTIN" maxLength={15} />
          </div>
          <div>
            <label className={labelCls}>LR / RR Number</label>
            <input className={fieldCls} value={form.lrNumber} onChange={e => set("lrNumber", e.target.value)} placeholder="Lorry receipt no." />
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Goods / Items</p>
          </div>
          <button type="button" onClick={addItem} className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
            <Plus className="h-3.5 w-3.5" /> Add Item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: 780 }}>
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Description", "HSN Code", "Qty", "Unit", "Taxable Value (₹)", "CGST %", "SGST %", "IGST %", ""].map(h => (
                  <th key={h} className="text-left px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {items.map(it => (
                <tr key={it.id}>
                  <td className="px-2 py-2"><input className={fieldCls} value={it.description} onChange={e => updateItem(it.id, "description", e.target.value)} placeholder="Item name" /></td>
                  <td className="px-2 py-2"><input className={fieldCls} value={it.hsnCode} onChange={e => updateItem(it.id, "hsnCode", e.target.value)} placeholder="6203" style={{ width: 80 }} /></td>
                  <td className="px-2 py-2"><input type="number" className={fieldCls} value={it.quantity} onChange={e => updateItem(it.id, "quantity", Number(e.target.value))} min={0} style={{ width: 70 }} /></td>
                  <td className="px-2 py-2">
                    <select className={fieldCls} value={it.unit} onChange={e => updateItem(it.id, "unit", e.target.value)} style={{ width: 80 }}>
                      {["NOS","KGS","MTR","LTR","BOX","PKT","SET","PCS","DOZ"].map(u => <option key={u}>{u}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2"><input type="number" className={fieldCls} value={it.taxableValue} onChange={e => updateItem(it.id, "taxableValue", Number(e.target.value))} min={0} style={{ width: 110 }} /></td>
                  <td className="px-2 py-2"><input type="number" className={fieldCls} value={it.cgstRate} onChange={e => updateItem(it.id, "cgstRate", Number(e.target.value))} min={0} max={28} style={{ width: 65 }} /></td>
                  <td className="px-2 py-2"><input type="number" className={fieldCls} value={it.sgstRate} onChange={e => updateItem(it.id, "sgstRate", Number(e.target.value))} min={0} max={28} style={{ width: 65 }} /></td>
                  <td className="px-2 py-2"><input type="number" className={fieldCls} value={it.igstRate} onChange={e => updateItem(it.id, "igstRate", Number(e.target.value))} min={0} max={28} style={{ width: 65 }} /></td>
                  <td className="px-2 py-2">
                    {items.length > 1 && (
                      <button type="button" onClick={() => removeItem(it.id)} className="p-1 text-red-400 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <div className="w-64 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-500"><span>Taxable Value</span><span className="font-medium text-gray-900">{fmt(totals.taxableValue)}</span></div>
            <div className="flex justify-between text-gray-500"><span>CGST</span><span>{fmt(totals.cgst)}</span></div>
            <div className="flex justify-between text-gray-500"><span>SGST</span><span>{fmt(totals.sgst)}</span></div>
            <div className="flex justify-between text-gray-500"><span>IGST</span><span>{fmt(totals.igst)}</span></div>
            <div className="flex justify-between font-semibold text-gray-900 border-t border-gray-200 pt-1.5"><span>Grand Total</span><span className="text-indigo-600">{fmt(totals.total)}</span></div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
        <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors">
          <FileText className="h-4 w-4" />
          Generate E-Way Bill
        </button>
      </div>
    </form>
  );
}

// ── Print helper ───────────────────────────────────────────────────────────

function printEWayBill(bill: EWayBill) {
  const w = window.open("", "_blank");
  if (!w) { alert("Allow popups to print"); return; }
  w.document.write(`
    <!DOCTYPE html><html><head><meta charset="utf-8"><title>E-Way Bill ${bill.ewbNumber}</title>
    <style>
      * { margin:0; padding:0; box-sizing:border-box; font-family: Arial, sans-serif; }
      body { padding: 24px; font-size: 11px; color: #1a1a1a; }
      h1 { font-size: 16px; font-weight: 700; text-align: center; margin-bottom: 4px; }
      .sub { text-align: center; color: #555; margin-bottom: 16px; font-size: 10px; }
      .badge { display:inline-block; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700; background:#d1fae5; color:#065f46; }
      table { width:100%; border-collapse:collapse; margin-bottom:12px; }
      th, td { border:1px solid #d1d5db; padding:5px 8px; text-align:left; vertical-align:top; }
      th { background:#f9fafb; font-size:10px; font-weight:600; color:#6b7280; text-transform:uppercase; }
      .section { font-weight:700; font-size:12px; border-bottom:2px solid #374151; padding-bottom:4px; margin:14px 0 8px; }
      .total-row td { font-weight:700; background:#f0f9ff; }
      @media print { body { padding:12px; } }
    </style></head><body>
    <h1>E-Way Bill</h1>
    <p class="sub">Generated on ${bill.generatedDate} &nbsp;|&nbsp; Valid upto ${bill.validUpto}</p>
    <table>
      <tr><th>EWB Number</th><td><b>${bill.ewbNumber}</b></td><th>Status</th><td><span class="badge">${bill.status.toUpperCase()}</span></td></tr>
      <tr><th>Transaction Type</th><td>${bill.transactionType}</td><th>Supply Type</th><td>${bill.supplyType}</td></tr>
      <tr><th>Document Type</th><td>${bill.docType}</td><th>Doc No / Date</th><td>${bill.docNumber} / ${bill.docDate}</td></tr>
    </table>
    <div class="section">Consignor (From)</div>
    <table>
      <tr><th>GSTIN</th><td>${bill.fromGstin}</td><th>Name</th><td>${bill.fromName}</td></tr>
      <tr><th>Address</th><td colspan="3">${bill.fromAddress}, ${bill.fromState} - ${bill.fromPincode}</td></tr>
    </table>
    <div class="section">Consignee (To)</div>
    <table>
      <tr><th>GSTIN</th><td>${bill.toGstin}</td><th>Name</th><td>${bill.toName}</td></tr>
      <tr><th>Address</th><td colspan="3">${bill.toAddress}, ${bill.toState} - ${bill.toPincode}</td></tr>
    </table>
    <div class="section">Transport Details</div>
    <table>
      <tr><th>Mode</th><td>${bill.transportMode}</td><th>Vehicle No</th><td>${bill.vehicleNumber}</td></tr>
      <tr><th>Transporter</th><td>${bill.transporterName}</td><th>LR No</th><td>${bill.lrNumber}</td></tr>
      <tr><th>Distance</th><td>${bill.distance} km</td><th>GSTIN</th><td>${bill.transporterGstin}</td></tr>
    </table>
    <div class="section">Goods Details</div>
    <table>
      <tr><th>#</th><th>Description</th><th>HSN</th><th>Qty</th><th>Unit</th><th>Taxable Value</th><th>CGST</th><th>SGST</th><th>IGST</th></tr>
      ${bill.items.map((it, i) => `<tr>
        <td>${i+1}</td><td>${it.description}</td><td>${it.hsnCode}</td><td>${it.quantity}</td><td>${it.unit}</td>
        <td>₹${Number(it.taxableValue).toLocaleString("en-IN",{minimumFractionDigits:2})}</td>
        <td>${it.cgstRate}%</td><td>${it.sgstRate}%</td><td>${it.igstRate}%</td>
      </tr>`).join("")}
      <tr class="total-row"><td colspan="5">Total</td>
        <td>₹${bill.totalValue.toLocaleString("en-IN",{minimumFractionDigits:2})}</td>
        <td>₹${bill.cgstAmount.toLocaleString("en-IN",{minimumFractionDigits:2})}</td>
        <td>₹${bill.sgstAmount.toLocaleString("en-IN",{minimumFractionDigits:2})}</td>
        <td>₹${bill.igstAmount.toLocaleString("en-IN",{minimumFractionDigits:2})}</td>
      </tr>
      <tr class="total-row"><td colspan="8">Grand Total</td><td>₹${bill.grandTotal.toLocaleString("en-IN",{minimumFractionDigits:2})}</td></tr>
    </table>
    </body></html>`);
  w.document.close();
  w.onload = () => setTimeout(() => w.print(), 200);
}

// ── Main List ──────────────────────────────────────────────────────────────

export function EWayBillManagement() {
  const [bills, setBills] = useState<EWayBill[]>(loadEWayBills);
  const [view, setView] = useState<"list" | "create">("list");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EWayStatus | "all">("all");

  const linkedBills = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("erp_bills") || "[]"); } catch { return []; }
  }, []);

  function handleSave(bill: EWayBill) {
    const updated = [bill, ...bills];
    setBills(updated);
    saveEWayBills(updated);
    setView("list");
  }

  function handleCancel(id: string) {
    if (!confirm("Cancel this E-Way Bill?")) return;
    const updated = bills.map(b => b.id === id ? { ...b, status: "cancelled" as EWayStatus } : b);
    setBills(updated);
    saveEWayBills(updated);
    toast.success("E-Way Bill cancelled");
  }

  const filtered = bills.filter(b => {
    const q = search.toLowerCase();
    const matchQ = !q || b.ewbNumber.toLowerCase().includes(q) || b.toName.toLowerCase().includes(q) || b.docNumber.toLowerCase().includes(q) || b.vehicleNumber.toLowerCase().includes(q);
    const matchS = statusFilter === "all" || b.status === statusFilter;
    return matchQ && matchS;
  });

  const stats = {
    total: bills.length,
    active: bills.filter(b => b.status === "active").length,
    cancelled: bills.filter(b => b.status === "cancelled").length,
    value: bills.filter(b => b.status === "active").reduce((a, b) => a + b.grandTotal, 0),
  };

  if (view === "create") {
    return <EWayBillForm onSave={handleSave} onCancel={() => setView("list")} linkedBills={linkedBills} />;
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">E-Way Bills</h2>
          <p className="text-xs text-gray-400 mt-0.5">{stats.total} bill{stats.total !== 1 ? "s" : ""} generated</p>
        </div>
        <button
          onClick={() => setView("create")}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" /> Generate E-Way Bill
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-gray-900", accent: "bg-white border-gray-200" },
          { label: "Active", value: stats.active, color: "text-emerald-600", accent: "bg-emerald-50 border-emerald-100" },
          { label: "Cancelled", value: stats.cancelled, color: "text-red-500", accent: "bg-red-50 border-red-100" },
          { label: "Active Value", value: fmt(stats.value), color: "text-indigo-600", accent: "bg-indigo-50 border-indigo-100" },
        ].map(({ label, value, color, accent }) => (
          <div key={label} className={`border rounded-2xl px-5 py-4 shadow-sm ${accent}`}>
            <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
            <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            placeholder="Search by EWB number, party, vehicle…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-300"
          />
        </div>
        <div className="flex gap-1.5">
          {(["all", "active", "cancelled", "expired"] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors capitalize ${statusFilter === s ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"}`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Truck className="w-10 h-10 text-gray-200" />
            <p className="text-sm font-medium text-gray-400">{search || statusFilter !== "all" ? "No bills match your search" : "No E-Way Bills yet"}</p>
            {!search && statusFilter === "all" && (
              <button onClick={() => setView("create")} className="text-xs text-indigo-600 hover:underline">Generate your first E-Way Bill →</button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["EWB Number","Doc No","From","To","Vehicle","Mode","Valid Upto","Grand Total","Status","Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3"><span className="font-mono text-xs font-semibold text-indigo-600">{b.ewbNumber}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-700">{b.docNumber}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 max-w-[130px] truncate">{b.fromName}</td>
                    <td className="px-4 py-3 text-xs text-gray-700 max-w-[130px] truncate">{b.toName}</td>
                    <td className="px-4 py-3"><span className="font-mono text-xs text-gray-600">{b.vehicleNumber || "—"}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500 capitalize">{b.transportMode}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{b.validUpto}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-900">{fmt(b.grandTotal)}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => printEWayBill(b)} className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Print">
                          <Printer className="h-4 w-4" />
                        </button>
                        {b.status === "active" && (
                          <button onClick={() => handleCancel(b.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Cancel">
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
