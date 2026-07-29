import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Plus, Trash2, Save, ArrowLeft, ChevronRight } from "lucide-react";
import { Bill, BillItem, PartyDetails, BillTemplate, GSTType } from "./bill-types";
import { generateBillNumber, calculateTaxBreakdown, numberToWords } from "./bill-utils";
import { defaultTemplate } from "./mock-bill-data";
import { CompanyAutocomplete } from "@/app/components/ui/company-autocomplete";

interface BillCreationFormProps {
  onSave: (bill: Bill) => void;
  onCancel: () => void;
  editBill?: Bill;
  selectedTemplate?: BillTemplate;
}

// ── Tiny shared primitives ────────────────────────────────────────────────

const inp = "w-full px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 placeholder:text-gray-300 transition-colors";
const lbl = "block text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-1";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className={lbl}>{label}</p>
      {children}
    </div>
  );
}

function SectionHead({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────

export function BillCreationForm({ onSave, onCancel, editBill, selectedTemplate }: BillCreationFormProps) {
  const template = selectedTemplate || defaultTemplate;
  const [billNumber, setBillNumber] = useState(editBill?.billNumber || generateBillNumber());
  const [challanNo, setChallanNo] = useState(editBill?.challanNo || "");
  const [poNumber, setPoNumber] = useState(editBill?.poNumber || "");
  const [poDate, setPoDate] = useState(editBill?.poDate || "");
  const [invoiceDate, setInvoiceDate] = useState(
    editBill?.invoiceDate || new Date().toISOString().split("T")[0]
  );

  const [billedTo, setBilledTo] = useState<PartyDetails>(
    editBill?.billedTo || { name: "", address: "", city: "", state: "", pincode: "", gstin: "", stateCode: "" }
  );

  const [shippedTo, setShippedTo] = useState<PartyDetails>(editBill?.shippedTo || billedTo);
  const [sameAsBilling, setSameAsBilling] = useState(true);

  const [items, setItems] = useState<BillItem[]>(
    editBill?.items || [{
      id: crypto.randomUUID(), srNo: 1, particulars: "", hsnSac: "",
      qty: 0, unit: "PCS", gstPercent: 5, gstType: "cgst-sgst" as const, rate: 0, taxableAmount: 0
    }]
  );

  const [additionalCharges, setAdditionalCharges] = useState(editBill?.additionalCharges || 0);
  const [additionalChargesDesc, setAdditionalChargesDesc] = useState(editBill?.additionalChargesDesc || "");
  const [remarks, setRemarks] = useState(editBill?.remarks || "");
  const [vehicleNo, setVehicleNo] = useState(editBill?.vehicleNo || "");
  const [stationFrom, setStationFrom] = useState(editBill?.stationFrom || "");

  const handleAddItem = () => {
    setItems([...items, {
      id: crypto.randomUUID(), srNo: items.length + 1, particulars: "", hsnSac: "",
      qty: 0, unit: "PCS", gstPercent: 5, gstType: "cgst-sgst" as const, rate: 0, taxableAmount: 0
    }]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) setItems(items.filter(i => i.id !== id));
  };

  const handleItemChange = (id: string, field: keyof BillItem, value: any) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === "qty" || field === "rate") updated.taxableAmount = updated.qty * updated.rate;
      return updated;
    }));
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((s, i) => s + i.taxableAmount, 0);
    const taxBreakdown = calculateTaxBreakdown(subtotal, items, template.companyDetails.gstin, billedTo.gstin || "");
    const totalTax = taxBreakdown.cgst + taxBreakdown.sgst + taxBreakdown.igst;
    const totalAmount = subtotal + totalTax + additionalCharges;
    return { subtotal, taxBreakdown, totalAmount };
  };

  const handleSave = () => {
    const { subtotal, taxBreakdown, totalAmount } = calculateTotals();
    const bill: Bill = {
      id: editBill?.id || crypto.randomUUID(), billNumber, challanNo, poNumber, poDate, invoiceDate,
      templateId: template.id, companyDetails: template.companyDetails,
      billedTo, shippedTo: sameAsBilling ? billedTo : shippedTo,
      items, additionalCharges, additionalChargesDesc, subtotal, taxBreakdown, totalAmount,
      amountInWords: numberToWords(totalAmount), bankDetails: template.bankDetails,
      termsAndConditions: template.termsAndConditions, remarks, vehicleNo, stationFrom,
      status: "draft", createdBy: "Master Manager",
      createdAt: editBill?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    onSave(bill);
  };

  const { subtotal, taxBreakdown, totalAmount } = calculateTotals();

  return (
    <div className="flex flex-col gap-0 min-h-0">

      {/* ── Sticky top bar ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl shadow-sm px-4 py-3 mb-4 gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900 truncate">
                {editBill ? "Edit Invoice" : "New Invoice"}
              </span>
              <span
                className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold border"
                style={{ borderColor: template.headerColor || "#6366f1", color: template.headerColor || "#6366f1" }}
              >
                {template.templateName}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 truncate">{billNumber}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 text-xs font-medium text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save Invoice
          </button>
        </div>
      </div>

      {/* ── Body: left sidebar + right main ──────────────────────────── */}
      <div className="flex gap-4 items-start">

        {/* Left sidebar — meta fields */}
        <div className="w-72 shrink-0 space-y-4">

          {/* Invoice Details */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
            <SectionHead title="Invoice Details" />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Field label="Invoice No *">
                  <input className={inp} value={billNumber} onChange={e => setBillNumber(e.target.value)} placeholder="INV-2024-001" />
                </Field>
                <Field label="Date *">
                  <input type="date" className={inp} value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Challan No">
                  <input className={inp} value={challanNo} onChange={e => setChallanNo(e.target.value)} placeholder="SF-136" />
                </Field>
                <Field label="PO Number">
                  <input className={inp} value={poNumber} onChange={e => setPoNumber(e.target.value)} placeholder="PO-2024-001" />
                </Field>
              </div>
              <Field label="PO Date">
                <input type="date" className={inp} value={poDate} onChange={e => setPoDate(e.target.value)} />
              </Field>
            </div>
          </div>

          {/* Billed To */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
            <SectionHead title="Billed To" />
            <div className="space-y-3">
              <Field label="Company *">
                <CompanyAutocomplete
                  value={billedTo.name}
                  onChange={val => setBilledTo({ ...billedTo, name: val })}
                  onSelectCompany={company => {
                    setBilledTo({
                      name: company.name, address: company.address || "",
                      city: company.city || "", state: company.state || "",
                      pincode: company.pincode || "", gstin: company.gstNumber || "",
                      stateCode: "", phone: company.phone || "",
                    });
                  }}
                  placeholder="Company name…"
                />
              </Field>
              <Field label="Address">
                <textarea
                  className={`${inp} resize-none`}
                  rows={2}
                  value={billedTo.address}
                  onChange={e => setBilledTo({ ...billedTo, address: e.target.value })}
                  placeholder="Full address"
                />
              </Field>
              <div className="grid grid-cols-2 gap-2">
                <Field label="City">
                  <input className={inp} value={billedTo.city} onChange={e => setBilledTo({ ...billedTo, city: e.target.value })} placeholder="City" />
                </Field>
                <Field label="State">
                  <input className={inp} value={billedTo.state} onChange={e => setBilledTo({ ...billedTo, state: e.target.value })} placeholder="State" />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Pincode">
                  <input className={inp} value={billedTo.pincode} onChange={e => setBilledTo({ ...billedTo, pincode: e.target.value })} placeholder="400001" />
                </Field>
                <Field label="GSTIN">
                  <input className={inp} value={billedTo.gstin || ""} onChange={e => setBilledTo({ ...billedTo, gstin: e.target.value })} placeholder="24AAAB…" />
                </Field>
              </div>
            </div>
          </div>

          {/* Additional */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
            <SectionHead title="Logistics" />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Field label="Vehicle No">
                  <input className={inp} value={vehicleNo} onChange={e => setVehicleNo(e.target.value)} placeholder="GJ-01-AB-1234" />
                </Field>
                <Field label="Station">
                  <input className={inp} value={stationFrom} onChange={e => setStationFrom(e.target.value)} placeholder="Vadodara" />
                </Field>
              </div>
              <Field label="Remarks">
                <textarea className={`${inp} resize-none`} rows={2} value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Any notes…" />
              </Field>
            </div>
          </div>
        </div>

        {/* Right main — items + summary */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Items table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Invoice Items</span>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Row
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs" style={{ minWidth: 700 }}>
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-6">#</th>
                    <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Description</th>
                    <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-24">HSN/SAC</th>
                    <th className="text-left px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-16">Unit</th>
                    <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-20">Qty</th>
                    <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-24">Rate (₹)</th>
                    <th className="text-center px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-28">GST Type</th>
                    <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-20">GST %</th>
                    <th className="text-right px-3 py-2.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-28">Taxable (₹)</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50/60 transition-colors group">
                      <td className="px-3 py-2">
                        <span className="text-[10px] font-semibold text-indigo-400 font-mono">{idx + 1}</span>
                      </td>
                      <td className="px-2 py-2">
                        <input
                          className={`${inp} min-w-[160px]`}
                          value={item.particulars}
                          onChange={e => handleItemChange(item.id, "particulars", e.target.value)}
                          placeholder="e.g., UNIFORM SHIRT & TROUSER"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          className={inp}
                          value={item.hsnSac}
                          onChange={e => handleItemChange(item.id, "hsnSac", e.target.value)}
                          placeholder="62044"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          className={inp}
                          value={item.unit}
                          onChange={e => handleItemChange(item.id, "unit", e.target.value)}
                          placeholder="PCS"
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          className={`${inp} text-right`}
                          value={item.qty}
                          onChange={e => handleItemChange(item.id, "qty", parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min={0}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          className={`${inp} text-right`}
                          value={item.rate}
                          onChange={e => handleItemChange(item.id, "rate", parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          min={0}
                        />
                      </td>
                      <td className="px-2 py-2">
                        <Select
                          value={item.gstType || "cgst-sgst"}
                          onValueChange={val => handleItemChange(item.id, "gstType", val as GSTType)}
                        >
                          <SelectTrigger className="h-7 text-xs border-gray-200 rounded-lg focus:ring-indigo-500/20 focus:border-indigo-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cgst-sgst">CGST + SGST</SelectItem>
                            <SelectItem value="igst">IGST</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-2 py-2">
                        <input
                          type="number"
                          className={`${inp} text-right`}
                          value={item.gstPercent}
                          onChange={e => handleItemChange(item.id, "gstPercent", parseFloat(e.target.value) || 0)}
                          placeholder="5"
                          min={0}
                          max={28}
                        />
                        {item.gstType === "cgst-sgst" && item.gstPercent > 0 && (
                          <p className="text-[9px] text-gray-400 text-right mt-0.5">
                            {(item.gstPercent / 2).toFixed(1)}% + {(item.gstPercent / 2).toFixed(1)}%
                          </p>
                        )}
                      </td>
                      <td className="px-2 py-2 text-right">
                        <span className="font-semibold text-gray-800 font-mono">
                          ₹{item.taxableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Summary</span>
            </div>
            <div className="px-5 py-4 flex flex-col sm:flex-row gap-6">
              {/* Additional charges */}
              <div className="flex-1 space-y-2">
                <p className={lbl}>Additional Charges</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className={`${inp} w-28`}
                    value={additionalCharges}
                    onChange={e => setAdditionalCharges(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    min={0}
                  />
                  <input
                    className={`${inp} flex-1`}
                    value={additionalChargesDesc}
                    onChange={e => setAdditionalChargesDesc(e.target.value)}
                    placeholder="e.g., Transportation"
                  />
                </div>
              </div>

              {/* Tax + total */}
              <div className="w-64 shrink-0 space-y-1.5">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal</span>
                  <span className="font-mono">₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
                {taxBreakdown.cgst > 0 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>CGST</span>
                    <span className="font-mono">₹{taxBreakdown.cgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {taxBreakdown.sgst > 0 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>SGST</span>
                    <span className="font-mono">₹{taxBreakdown.sgst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {taxBreakdown.igst > 0 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>IGST</span>
                    <span className="font-mono">₹{taxBreakdown.igst.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                {additionalCharges > 0 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{additionalChargesDesc || "Additional"}</span>
                    <span className="font-mono">₹{additionalCharges.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-1.5 flex justify-between">
                  <span className="text-sm font-semibold text-gray-900">Total</span>
                  <span className="text-sm font-bold text-indigo-600 font-mono">
                    ₹{totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 mt-1">
                  <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Amount in Words</p>
                  <p className="text-[10px] text-gray-600 leading-snug">{numberToWords(totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
