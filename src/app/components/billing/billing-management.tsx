import { useState, useEffect, useRef } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import {
  Plus,
  Search,
  FileText,
  Eye,
  Edit,
  Download,
  Trash2,
  Filter,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Share2,
  Copy,
  ExternalLink
} from "lucide-react";
import { Bill, BillStatus, BillTemplate } from "./bill-types";
import { mockBills, allTemplates } from "./mock-bill-data";
import { BillCreationForm } from "./bill-creation-form";
import { BillPreview } from "./bill-preview";
import { formatCurrency } from "./bill-utils";
import { Separator } from "@/app/components/ui/separator";
import { Select } from "@/app/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import {
  FileCheck,
  FileOutput,
  Receipt as ReceiptIcon,
  FileX,
  FileQuestion,
  ArrowLeft,
  Check,
  Truck
} from "lucide-react";
import { toast } from "sonner";
import { EWayBillManagement } from "./eway-bill-management";

import * as billApi from "@/app/api/supabase-api";
import companyLogoSrc from "../../../imports/image.png";

// localStorage cache helpers for bills
const BILL_CACHE_KEY = "erp_bills";
function loadBillCache(): Bill[] {
  try {
    const raw = localStorage.getItem(BILL_CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function writeBillCache(bills: Bill[]) {
  try { localStorage.setItem(BILL_CACHE_KEY, JSON.stringify(bills)); } catch { /* noop */ }
}

type View = "list" | "select-template" | "create" | "edit" | "preview" | "eway-bill";

export function BillingManagement() {
  const [currentView, setCurrentView] = useState<View>("list");
  // Initialize from cache; will be replaced by Supabase data on load
  const [bills, setBills] = useState<Bill[]>(() => {
    const cached = loadBillCache();
    return cached;
  });
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<BillTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BillStatus | "all">("all");
  const [billsLoading, setBillsLoading] = useState(true);
  const loadDone = useRef(false);

  // Payment link state
  const [showPaymentLinkDialog, setShowPaymentLinkDialog] = useState(false);
  const [paymentLinkBill, setPaymentLinkBill] = useState<Bill | null>(null);
  const [paymentType, setPaymentType] = useState<"full" | "half" | "custom">("full");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [generatedPaymentLink, setGeneratedPaymentLink] = useState<string>("");

  // Load bills from Supabase on mount
  useEffect(() => {
    if (loadDone.current) return;
    loadDone.current = true;
    (async () => {
      try {
        const remote = await billApi.fetchBills();
        if (remote.length > 0) {
          setBills(remote as Bill[]);
          writeBillCache(remote as Bill[]);
          console.log(`[Bills] Loaded ${remote.length} bills from Supabase`);
        } else {
          console.log("[Bills] Supabase empty – starting fresh");
        }
      } catch (e) {
        console.log("[Bills] Server unavailable, using localStorage cache");
      } finally {
        setBillsLoading(false);
      }
    })();
  }, []);

  const handleCreateNew = () => {
    setSelectedBill(null);
    setSelectedTemplate(null);
    setCurrentView("select-template");
  };

  const handleSelectTemplate = (template: BillTemplate) => {
    setSelectedTemplate(template);
  };

  const handleProceedWithTemplate = () => {
    if (selectedTemplate) {
      setCurrentView("create");
    }
  };

  const handleEdit = (bill: Bill) => {
    setSelectedBill(bill);
    setCurrentView("edit");
  };

  const handlePreview = (bill: Bill) => {
    setSelectedBill(bill);
    setCurrentView("preview");
  };

  const handleSave = (bill: Bill) => {
    let newBills: Bill[];
    if (selectedBill) {
      newBills = bills.map((b) => (b.id === bill.id ? bill : b));
    } else {
      newBills = [bill, ...bills];
    }
    setBills(newBills);
    writeBillCache(newBills);
    setCurrentView("list");
    // Persist to Supabase
    billApi.saveBill(bill).catch((e) => console.error("[Bills] Failed to save bill to Supabase:", e));
  };

  const handleDelete = (billId: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      const newBills = bills.filter((b) => b.id !== billId);
      setBills(newBills);
      writeBillCache(newBills);
      // Persist to Supabase
      billApi.deleteBill(billId).catch((e) => console.error("[Bills] Failed to delete bill from Supabase:", e));
    }
  };

  // Payment link handlers
  const handleSharePaymentLink = (bill: Bill) => {
    setPaymentLinkBill(bill);
    setPaymentType("full");
    setCustomAmount("");
    setGeneratedPaymentLink("");
    setShowPaymentLinkDialog(true);
  };

  const generatePaymentLink = () => {
    if (!paymentLinkBill) return;

    let amount = paymentLinkBill.totalAmount;
    if (paymentType === "half") {
      amount = paymentLinkBill.totalAmount / 2;
    } else if (paymentType === "custom") {
      amount = parseFloat(customAmount);
      if (isNaN(amount) || amount <= 0 || amount > paymentLinkBill.totalAmount) {
        toast.error("Please enter a valid amount");
        return;
      }
    }

    // Generate unique payment link
    const paymentId = `pay-${paymentLinkBill.id}-${Date.now()}`;
    const paymentLink = `${window.location.origin}/payment/${paymentId}`;

    // Store payment link data in localStorage for the payment page to access
    const paymentData = {
      paymentId,
      billId: paymentLinkBill.id,
      billNumber: paymentLinkBill.billNumber,
      customerName: paymentLinkBill.billedTo.name,
      amount: amount,
      fullAmount: paymentLinkBill.totalAmount,
      paymentType: paymentType,
      createdAt: new Date().toISOString(),
      status: "pending"
    };

    // Save to localStorage + Supabase
    const existingLinks = JSON.parse(localStorage.getItem("erp_payment_links") || "[]");
    existingLinks.push(paymentData);
    localStorage.setItem("erp_payment_links", JSON.stringify(existingLinks));
    billApi.savePaymentLink(paymentData).catch(() => {});

    setGeneratedPaymentLink(paymentLink);
    toast.success("Payment link generated successfully!");
  };

  const copyPaymentLink = () => {
    if (generatedPaymentLink) {
      navigator.clipboard.writeText(generatedPaymentLink);
      toast.success("Payment link copied to clipboard!");
    }
  };

  const handleDownload = async (bill: Bill) => {
    // Convert logo to base64 for embedding in print HTML
    const logoBase64 = await fetch(companyLogoSrc)
      .then(res => res.blob())
      .then(blob => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      }))
      .catch(() => '');

    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      alert('Please allow popups to download the invoice');
      return;
    }

    const emptyRows = Math.max(0, 5 - bill.items.length);
    const emptyRowsHTML = Array(emptyRows).fill(0).map(() => `
      <tr style="height:28px;">
        <td style="border:1px solid #9ca3af;padding:4px;"></td>
        <td style="border:1px solid #9ca3af;padding:4px;"></td>
        <td style="border:1px solid #9ca3af;padding:4px;"></td>
        <td style="border:1px solid #9ca3af;padding:4px;"></td>
        <td style="border:1px solid #9ca3af;padding:4px;"></td>
        <td style="border:1px solid #9ca3af;padding:4px;"></td>
        <td style="border:1px solid #9ca3af;padding:4px;"></td>
        <td style="border:1px solid #9ca3af;padding:4px;"></td>
      </tr>
    `).join('');

    const fc = (n: number) => n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const billHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice ${bill.billNumber}</title>
          <style>
            * { margin:0; padding:0; box-sizing:border-box; }
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding:20px; background:#f5f5f5; font-size:11px; color:#111; }
            .invoice { background:white; max-width:210mm; margin:0 auto; box-shadow:0 0 10px rgba(0,0,0,0.1); padding:24px 32px; }
            .header { border-bottom:2px solid #1f2937; padding:0 0 20px 0; margin-bottom:0; display:flex; justify-content:space-between; align-items:flex-start; }
            .company p { font-size:10px; color:#374151; line-height:1.4; }
            .badge { background:#f3f4f6; padding:3px 10px; border:1px solid #9ca3af; display:inline-block; margin-bottom:6px; font-size:10px; font-weight:600; }
            .row { display:grid; border-bottom:1px solid #9ca3af; font-size:10px; }
            .row.cols-4 { grid-template-columns: 1fr 1fr 1fr 1fr; }
            .row.cols-2 { grid-template-columns: 1fr 1fr; }
            .cell { padding:6px 8px; border-right:1px solid #9ca3af; }
            .cell:last-child { border-right:none; }
            .cell .label { color:#6b7280; margin-bottom:2px; }
            .cell .value { font-weight:600; }
            table { width:100%; border-collapse:collapse; font-size:10px; }
            th { background:#f3f4f6; border:1px solid #9ca3af; padding:4px 6px; font-weight:600; }
            td { border:1px solid #9ca3af; padding:4px 6px; }
            .text-right { text-align:right; }
            .text-center { text-align:center; }
            .bottom-grid { display:grid; grid-template-columns:1fr 1fr; border-top:1px solid #9ca3af; }
            .bottom-left { border-right:1px solid #9ca3af; }
            .section-header { background:#f3f4f6; padding:6px 8px; font-weight:600; font-size:10px; border-bottom:1px solid #9ca3af; }
            .detail-row { display:grid; grid-template-columns:1fr 1fr; border-bottom:1px solid #9ca3af; font-size:10px; }
            .detail-cell { padding:6px 8px; border-right:1px solid #9ca3af; }
            .detail-cell:last-child { border-right:none; }
            .summary-row { padding:6px 8px; border-bottom:1px solid #9ca3af; font-size:10px; display:flex; justify-content:space-between; }
            .total-row { background:#f3f4f6; padding:6px 8px; border-bottom:1px solid #9ca3af; font-size:12px; font-weight:bold; display:flex; justify-content:space-between; }
            .tax-table { width:100%; border-collapse:collapse; font-size:9px; }
            .tax-table th, .tax-table td { border:1px solid #9ca3af; padding:3px 4px; text-align:center; }
            .footer { border-top:1px solid #9ca3af; padding:8px 0; text-align:center; font-size:9px; color:#6b7280; }
            @media print {
              body { background:white; padding:0; }
              .invoice { box-shadow:none; padding:16px 20px; }
            }
          </style>
        </head>
        <body>
          <div class="invoice">
            <!-- Header -->
            <div class="header">
              <div style="display:flex;flex-direction:column;gap:8px;">
                <div>
                  <img src="${logoBase64}" alt="Company Logo" style="height:56px;width:auto;object-fit:contain;" />
                </div>
                <div class="company">
                  <p>${bill.companyDetails.address}</p>
                  <p style="margin-top:6px;"><strong>GSTIN:</strong> ${bill.companyDetails.gstin}</p>
                  <p><strong>State:</strong> ${bill.companyDetails.state} | <strong>Code:</strong> ${bill.companyDetails.gstin.substring(0, 2)}</p>
                </div>
              </div>
              <div style="text-align:right;">
                <div class="badge">Original</div>
                <h2 style="font-size:15px;font-weight:bold;">Tax Invoice</h2>
              </div>
            </div>

            <!-- Invoice Details Row 1 -->
            <div class="row cols-4">
              <div class="cell" style="padding:8px;"><div class="label" style="font-size:9px;color:#6B7280;margin-bottom:3px;">Challan No</div><div class="value" style="color:#111827;">${bill.challanNo || "SF-136"}</div></div>
              <div class="cell" style="padding:8px;"><div class="label" style="font-size:9px;color:#6B7280;margin-bottom:3px;">Invoice No</div><div class="value" style="color:#111827;">${bill.billNumber}</div></div>
              <div class="cell" style="padding:8px;"><div class="label" style="font-size:9px;color:#6B7280;margin-bottom:3px;">Po Date</div><div class="value" style="color:#111827;">${bill.poDate || "-"}</div></div>
              <div class="cell" style="padding:8px;"><div class="label" style="font-size:9px;color:#6B7280;margin-bottom:3px;">Invoice Date</div><div class="value" style="color:#111827;">${bill.invoiceDate}</div></div>
            </div>

            <!-- PO & Billed To -->
            <div class="row" style="grid-template-columns:200px 1fr;">
              <div class="cell" style="padding:8px;"><div class="label" style="font-size:9px;color:#6B7280;margin-bottom:3px;">Po No</div><div class="value" style="color:#111827;">${bill.poNumber || "PO-25-26-246"}</div></div>
              <div class="cell" style="border-right:none;padding:8px;">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                  <div>
                    <div class="label" style="font-size:9px;color:#6B7280;margin-bottom:6px;font-weight:500;">Details of Receiver (Billed to)</div>
                    <div class="value" style="font-weight:bold;color:#111827;margin-bottom:3px;">${bill.billedTo.name}</div>
                    <div style="color:#374151;font-size:10px;line-height:1.5;margin-top:2px;">${bill.billedTo.address}</div>
                    <div style="color:#374151;font-size:10px;">${bill.billedTo.city}, ${bill.billedTo.state} - ${bill.billedTo.pincode}</div>
                  </div>
                  ${bill.shippedTo ? `
                  <div>
                    <div class="label" style="font-size:9px;color:#6B7280;margin-bottom:6px;font-weight:500;">Details of Consignee (Shipped to)</div>
                    <div class="value" style="font-weight:bold;color:#111827;margin-bottom:3px;">${bill.shippedTo.name}</div>
                    <div style="color:#374151;font-size:10px;line-height:1.5;margin-top:2px;">${bill.shippedTo.address}</div>
                  </div>
                  ` : ''}
                </div>
              </div>
            </div>

            <!-- Mo No / Ship GST / State -->
            <div class="row cols-4">
              <div class="cell" style="padding:8px;"><div class="label" style="font-size:9px;color:#6B7280;margin-bottom:3px;">Mo No</div><div class="value" style="color:#111827;">${bill.vehicleNo || "-"}</div></div>
              <div class="cell" style="padding:8px;"><div class="label" style="font-size:9px;color:#6B7280;margin-bottom:3px;">Ship GST</div><div class="value" style="color:#111827;">${bill.shippedTo?.gstin || "24AABCA7801B1ZH"}</div></div>
              <div class="cell" style="padding:8px;border-right:none;" colspan="2"><div class="label" style="font-size:9px;color:#6B7280;margin-bottom:3px;">State</div><div class="value" style="color:#111827;">${bill.shippedTo?.state || "Gujarat"}</div></div>
            </div>

            <!-- Desply / State / Mob -->
            <div class="row cols-4">
              <div class="cell" style="padding:8px;"><div class="label" style="font-size:9px;color:#6B7280;margin-bottom:3px;">Desply</div><div class="value" style="color:#111827;">${bill.stationFrom || "Vadodara"}</div></div>
              <div class="cell" style="padding:8px;"><div class="label" style="font-size:9px;color:#6B7280;margin-bottom:3px;">State</div><div class="value" style="color:#111827;">${bill.billedTo.state} - ${bill.billedTo.stateCode || "24"}</div></div>
              <div class="cell" style="padding:8px;border-right:none;" colspan="2"><div class="label" style="font-size:9px;color:#6B7280;margin-bottom:3px;">Mob.No</div><div class="value" style="color:#111827;">${bill.billedTo.phone || "-"}</div></div>
            </div>

            <!-- Items Table -->
            <table>
              <thead>
                <tr>
                  <th style="width:28px;text-align:left;">#</th>
                  <th style="text-align:left;">Particulars</th>
                  <th style="width:70px;text-align:center;">HSN / SAC</th>
                  <th style="width:40px;text-align:center;">Qty</th>
                  <th style="width:50px;text-align:center;">Unit</th>
                  <th style="width:50px;text-align:center;">GST (%)</th>
                  <th style="width:65px;text-align:right;">Rate</th>
                  <th style="width:80px;text-align:right;">Taxable (Rs)</th>
                </tr>
              </thead>
              <tbody>
                ${bill.items.map((item) => `
                  <tr>
                    <td class="text-center">${item.srNo}</td>
                    <td>${item.particulars}</td>
                    <td class="text-center">${item.hsnSac}</td>
                    <td class="text-center">${item.qty}</td>
                    <td class="text-center">${item.unit}</td>
                    <td class="text-center">${item.gstPercent}%</td>
                    <td class="text-right">${fc(item.rate)}</td>
                    <td class="text-right">${fc(item.taxableAmount)}</td>
                  </tr>
                `).join('')}
                ${emptyRowsHTML}
                <tr style="font-weight:600;background:#f9fafb;">
                  <td colspan="6" class="text-right">Total :</td>
                  <td class="text-right">${fc(bill.items.reduce((s, i) => s + i.qty, 0))}</td>
                  <td class="text-right">${fc(bill.subtotal)}</td>
                </tr>
              </tbody>
            </table>

            <!-- Bottom Section -->
            <div class="bottom-grid">
              <!-- Left Column -->
              <div class="bottom-left">
                <div class="section-header">Transport / Courier Details</div>
                <div class="detail-row">
                  <div class="detail-cell"><div class="label">Trans Name</div><div class="value">-</div></div>
                  <div class="detail-cell"><div class="label">Veh. No</div><div class="value">${bill.vehicleNo || "-"}</div></div>
                </div>
                <div class="detail-row">
                  <div class="detail-cell"><div class="label">LR No</div><div class="value">-</div></div>
                  <div class="detail-cell"><div class="label">Station</div><div class="value">${bill.stationFrom || "Vadodara"}</div></div>
                </div>

                <div class="section-header">Bank Details</div>
                <div class="detail-row">
                  <div class="detail-cell"><div class="label">Bank Name</div><div class="value">${bill.bankDetails.bankName}</div></div>
                  <div class="detail-cell"><div class="label">Ac No</div><div class="value">${bill.bankDetails.accountNumber}</div></div>
                </div>
                <div class="detail-row">
                  <div class="detail-cell"><div class="label">Branch Name</div><div class="value">${bill.bankDetails.branchName}</div></div>
                  <div class="detail-cell"><div class="label">IFSC Code</div><div class="value">${bill.bankDetails.ifscCode}</div></div>
                </div>

                <!-- Tax Breakdown -->
                <div style="border-top:1px solid #9ca3af;">
                  <table class="tax-table">
                    <thead>
                      <tr style="background:#f3f4f6;">
                        <th rowspan="2">Taxable (%)</th>
                        <th colspan="3">CGST Tax</th>
                        <th colspan="3">SGST Tax</th>
                        <th colspan="3">Integrated Tax</th>
                      </tr>
                      <tr style="background:#f3f4f6;">
                        <th>Value</th><th>Rate</th><th>Amount</th>
                        <th>Value</th><th>Rate</th><th>Amount</th>
                        <th>Value</th><th>Rate</th><th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>${fc(bill.subtotal)}</td>
                        <td>2.50%</td><td>${fc(bill.taxBreakdown.cgst)}</td>
                        <td>2.50%</td><td>${fc(bill.taxBreakdown.sgst)}</td>
                        <td>0.00%</td>
                        <td>0.00</td><td>0.00%</td><td>0.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <!-- Terms -->
                <div style="border-top:1px solid #9ca3af;padding:8px;">
                  <p style="font-weight:600;margin-bottom:4px;">Terms & Conditions :</p>
                  <ol style="padding-left:16px;font-size:9px;line-height:1.6;">
                    ${bill.termsAndConditions.map((term) => `<li>${term}</li>`).join('')}
                  </ol>
                  <p style="font-size:9px;margin-top:6px;">E & O.E</p>
                </div>
              </div>

              <!-- Right Column -->
              <div>
                <div class="section-header">Remarks</div>
                <div class="summary-row"><span>Gross Value</span><span style="font-weight:600;">${fc(bill.subtotal)}</span></div>
                <div class="summary-row"><span>CGST</span><span style="font-weight:600;">${fc(bill.taxBreakdown.cgst)}</span></div>
                <div class="summary-row"><span>SGST</span><span style="font-weight:600;">${fc(bill.taxBreakdown.sgst)}</span></div>
                <div class="summary-row"><span>IGST</span><span style="font-weight:600;">${fc(bill.taxBreakdown.igst)}</span></div>
                <div class="summary-row"><span>Add charges</span><span style="font-weight:600;">${fc(bill.additionalCharges)}</span></div>
                <div class="total-row"><span>Total Amt</span><span>${fc(bill.totalAmount)}</span></div>
                <div style="padding:8px;font-size:10px;">
                  <p style="font-weight:600;">GST Payable on Reverse Charge : N.A</p>
                  <p style="font-weight:600;margin-top:8px;">Amount In Word</p>
                  <p style="font-size:9px;line-height:1.4;">${bill.amountInWords}</p>
                </div>
                <div style="border-top:1px solid #9ca3af;padding:12px;text-align:right;">
                  <p style="font-weight:600;margin-bottom:40px;">For ${bill.companyDetails.name}</p>
                  <p>Authorised Signatory</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="footer">Generated By ${bill.companyDetails.name.split(" ")[0]} ERP</div>
          </div>
        </body>
      </html>
    `;

    // Template-006: Modern Proforma
    const modernProformaHTML = `
      <!DOCTYPE html><html><head><meta charset="utf-8"><title>Proforma ${bill.billNumber}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8fafc;padding:20px;font-size:11px;color:#1e293b;}
        .wrap{background:#fff;max-width:210mm;margin:0 auto;box-shadow:0 4px 24px rgba(0,0,0,0.12);}
        .topbar{background:#0f172a;color:#fff;padding:20px 32px;display:flex;justify-content:space-between;align-items:center;}
        .topbar-title{font-size:22px;font-weight:700;letter-spacing:2px;color:#fff;}
        .topbar-badge{background:#38bdf8;color:#0f172a;font-size:10px;font-weight:800;padding:4px 12px;border-radius:4px;letter-spacing:1px;}
        .body-wrap{padding:24px 32px;}
        .meta-row{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:20px;}
        .meta-box{background:#f1f5f9;border-radius:8px;padding:14px 16px;}
        .meta-box .ttl{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin-bottom:6px;}
        .meta-box .val{font-size:12px;font-weight:700;color:#0f172a;}
        .meta-box .sub{font-size:10px;color:#475569;margin-top:2px;line-height:1.4;}
        .divider{height:2px;background:linear-gradient(90deg,#38bdf8,#0f172a);margin:16px 0;}
        table{width:100%;border-collapse:collapse;font-size:10px;margin-bottom:16px;}
        thead tr{background:#0f172a;color:#fff;}
        th{padding:8px 10px;text-align:left;font-weight:600;letter-spacing:.5px;}
        td{border-bottom:1px solid #e2e8f0;padding:7px 10px;}
        tr:nth-child(even) td{background:#f8fafc;}
        .total-section{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-top:16px;}
        .bank-box{background:#f1f5f9;border-radius:8px;padding:14px 16px;}
        .bank-box .ttl{font-size:9px;text-transform:uppercase;letter-spacing:1px;color:#64748b;margin-bottom:8px;}
        .bank-row{display:flex;justify-content:space-between;font-size:10px;padding:3px 0;border-bottom:1px dashed #cbd5e1;}
        .bank-row .k{color:#64748b;}
        .bank-row .v{font-weight:600;color:#0f172a;}
        .summary-box{background:#f1f5f9;border-radius:8px;padding:14px 16px;}
        .sum-row{display:flex;justify-content:space-between;font-size:10px;padding:4px 0;border-bottom:1px dashed #cbd5e1;}
        .sum-total{display:flex;justify-content:space-between;font-size:13px;font-weight:800;padding:8px 0 0 0;color:#0f172a;}
        .terms{background:#f8fafc;border-left:3px solid #38bdf8;padding:10px 14px;margin-top:16px;border-radius:0 6px 6px 0;}
        .terms .ttl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#0f172a;margin-bottom:6px;}
        .terms li{font-size:9px;color:#475569;margin-bottom:3px;list-style:disc;margin-left:14px;}
        .sign-row{display:flex;justify-content:space-between;align-items:flex-end;margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;}
        .sign-left{font-size:9px;color:#64748b;}
        .sign-right{text-align:right;font-size:10px;}
        .sign-right .name{font-weight:700;color:#0f172a;}
        .footer-bar{background:#0f172a;color:#94a3b8;text-align:center;font-size:9px;padding:8px;}
        @media print{body{background:#fff;padding:0;}.wrap{box-shadow:none;}}
      </style></head><body>
      <div class="wrap">
        <div class="topbar">
          <div>
            <img src="${logoBase64}" alt="Logo" style="height:48px;width:auto;filter:brightness(0) invert(1);" />
          </div>
          <div style="text-align:right;">
            <div class="topbar-title">PROFORMA INVOICE</div>
            <div style="font-size:10px;color:#94a3b8;margin-top:4px;">${bill.companyDetails.name}</div>
          </div>
          <div class="topbar-badge">PROFORMA</div>
        </div>
        <div class="body-wrap">
          <div class="meta-row">
            <div class="meta-box">
              <div class="ttl">Bill To</div>
              <div class="val">${bill.billedTo.name}</div>
              <div class="sub">${bill.billedTo.address}<br>${bill.billedTo.city}, ${bill.billedTo.state} ${bill.billedTo.pincode}</div>
              ${bill.billedTo.gstin ? `<div class="sub" style="margin-top:4px;"><b>GSTIN:</b> ${bill.billedTo.gstin}</div>` : ''}
            </div>
            <div class="meta-box">
              <div class="ttl">Invoice Details</div>
              <div class="bank-row"><span class="k">Invoice No</span><span class="v">${bill.billNumber}</span></div>
              <div class="bank-row"><span class="k">Invoice Date</span><span class="v">${bill.invoiceDate}</span></div>
              <div class="bank-row"><span class="k">PO Number</span><span class="v">${bill.poNumber || '-'}</span></div>
              <div class="bank-row"><span class="k">PO Date</span><span class="v">${bill.poDate || '-'}</span></div>
            </div>
          </div>
          <div class="divider"></div>
          <table>
            <thead><tr>
              <th>#</th><th>Description</th><th>HSN</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Rate</th><th style="text-align:right;">Amount</th>
            </tr></thead>
            <tbody>
              ${bill.items.map((item: any, i: number) => `<tr>
                <td>${i+1}</td><td>${item.description}</td><td>${item.hsnCode||'-'}</td>
                <td style="text-align:center;">${item.quantity}</td>
                <td style="text-align:right;">₹${(Number(item.rate)||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
                <td style="text-align:right;">₹${(Number(item.amount)||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
              </tr>`).join('')}
            </tbody>
          </table>
          <div class="total-section">
            <div class="bank-box">
              <div class="ttl">Bank Details</div>
              <div class="bank-row"><span class="k">Bank</span><span class="v">${bill.companyDetails.name.split(' ')[0]} – SBI</span></div>
              <div class="bank-row"><span class="k">A/C No</span><span class="v">38190064436</span></div>
              <div class="bank-row"><span class="k">IFSC</span><span class="v">SBIN0006614</span></div>
              <div class="bank-row"><span class="k">Branch</span><span class="v">NANDESAR</span></div>
            </div>
            <div class="summary-box">
              <div class="sum-row"><span>Subtotal</span><span>₹${bill.subtotal.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>
              ${bill.cgstAmount ? `<div class="sum-row"><span>CGST (${bill.cgstRate||''}%)</span><span>₹${bill.cgstAmount.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>` : ''}
              ${bill.sgstAmount ? `<div class="sum-row"><span>SGST (${bill.sgstRate||''}%)</span><span>₹${bill.sgstAmount.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>` : ''}
              ${bill.igstAmount ? `<div class="sum-row"><span>IGST (${bill.igstRate||''}%)</span><span>₹${bill.igstAmount.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>` : ''}
              <div class="sum-total"><span>TOTAL</span><span>₹${bill.totalAmount.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>
            </div>
          </div>
          <div class="terms">
            <div class="ttl">Terms & Conditions</div>
            <ul>${(bill.termsAndConditions||[]).map((t:string)=>`<li>${t}</li>`).join('')}</ul>
          </div>
          <div class="sign-row">
            <div class="sign-left">This is a computer-generated proforma invoice.<br>No signature required.</div>
            <div class="sign-right">
              <div style="margin-bottom:32px;" class="name">For ${bill.companyDetails.name}</div>
              <div style="border-top:1px solid #0f172a;padding-top:4px;color:#64748b;">Authorised Signatory</div>
            </div>
          </div>
        </div>
        <div class="footer-bar">Generated by ${bill.companyDetails.name.split(' ')[0]} ERP &nbsp;|&nbsp; PROFORMA – NOT A TAX INVOICE</div>
      </div></body></html>`;

    // Template-007: Classic Proforma
    const classicProformaHTML = `
      <!DOCTYPE html><html><head><meta charset="utf-8"><title>Proforma ${bill.billNumber}</title>
      <style>
        *{margin:0;padding:0;box-sizing:border-box;}
        body{font-family:'Times New Roman',Times,serif;background:#fff;padding:20px;font-size:11px;color:#1a1a1a;}
        .wrap{max-width:210mm;margin:0 auto;border:2px solid #7c2d12;padding:0;}
        .outer-border{border:1px solid #7c2d12;margin:6px;padding:0;}
        .top-stripe{background:#7c2d12;height:6px;}
        .header{padding:20px 28px 16px;border-bottom:2px double #7c2d12;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:16px;}
        .co-name{font-size:16px;font-weight:900;color:#7c2d12;letter-spacing:.5px;}
        .co-sub{font-size:9px;color:#555;margin-top:3px;line-height:1.5;}
        .center-logo{text-align:center;}
        .doc-title{text-align:right;}
        .doc-title h2{font-size:18px;font-weight:900;color:#7c2d12;letter-spacing:2px;}
        .doc-title .badge{display:inline-block;border:2px solid #7c2d12;padding:2px 10px;font-size:9px;font-weight:700;color:#7c2d12;letter-spacing:2px;margin-top:4px;}
        .info-strip{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #7c2d12;}
        .info-cell{padding:10px 16px;border-right:1px solid #7c2d12;}
        .info-cell:last-child{border-right:none;}
        .info-cell .lbl{font-size:9px;text-transform:uppercase;letter-spacing:.5px;color:#7c2d12;font-weight:700;margin-bottom:4px;}
        .info-cell .val{font-size:11px;font-weight:700;color:#1a1a1a;}
        .info-cell .sub{font-size:10px;color:#444;margin-top:2px;line-height:1.4;}
        .meta-strip{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid #7c2d12;background:#fef2f2;}
        .meta-cell{padding:7px 10px;border-right:1px solid #7c2d12;text-align:center;}
        .meta-cell:last-child{border-right:none;}
        .meta-cell .k{font-size:8px;text-transform:uppercase;letter-spacing:.5px;color:#7c2d12;font-weight:700;}
        .meta-cell .v{font-size:10px;font-weight:700;color:#1a1a1a;margin-top:2px;}
        table{width:100%;border-collapse:collapse;font-size:10px;}
        th{background:#7c2d12;color:#fff;padding:7px 10px;text-align:left;font-weight:700;letter-spacing:.3px;}
        td{border:1px solid #d4a5a5;padding:6px 10px;}
        tr:nth-child(even) td{background:#fff5f5;}
        .bottom-grid{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #7c2d12;}
        .bottom-left{border-right:1px solid #7c2d12;padding:14px 16px;}
        .bottom-right{padding:14px 16px;}
        .section-label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#7c2d12;margin-bottom:8px;border-bottom:1px solid #7c2d12;padding-bottom:3px;}
        .detail-row{display:flex;justify-content:space-between;font-size:10px;padding:3px 0;border-bottom:1px dotted #d4a5a5;}
        .total-box{background:#7c2d12;color:#fff;padding:8px 14px;display:flex;justify-content:space-between;font-size:13px;font-weight:900;margin-top:8px;}
        .terms-strip{background:#fef2f2;border-top:1px solid #7c2d12;padding:10px 16px;}
        .terms-strip .lbl{font-size:9px;font-weight:700;text-transform:uppercase;color:#7c2d12;margin-bottom:4px;}
        .terms-strip li{font-size:9px;color:#555;margin-bottom:2px;margin-left:14px;list-style:disc;}
        .sign-strip{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid #7c2d12;padding:12px 16px;}
        .sign-strip .right{text-align:right;}
        .sign-strip .right .name{font-weight:700;margin-bottom:28px;}
        .sign-strip .right .sig-line{border-top:1px solid #1a1a1a;padding-top:3px;font-size:9px;color:#555;}
        .bottom-stripe{background:#7c2d12;height:6px;}
        .footer-txt{text-align:center;font-size:8px;color:#7c2d12;padding:4px;letter-spacing:.5px;}
        @media print{body{background:#fff;padding:0;}}
      </style></head><body>
      <div class="wrap"><div class="outer-border">
        <div class="top-stripe"></div>
        <div class="header">
          <div>
            <div class="co-name">${bill.companyDetails.name}</div>
            <div class="co-sub">${bill.companyDetails.address}<br>${bill.companyDetails.city}, ${bill.companyDetails.state} – ${bill.companyDetails.pincode}<br>GSTIN: ${bill.companyDetails.gstin} | PAN: ${bill.companyDetails.pan}</div>
          </div>
          <div class="center-logo"><img src="${logoBase64}" alt="Logo" style="height:60px;width:auto;object-fit:contain;" /></div>
          <div class="doc-title">
            <h2>PROFORMA</h2>
            <h2>INVOICE</h2>
            <div class="badge">NOT A TAX INVOICE</div>
          </div>
        </div>
        <div class="info-strip">
          <div class="info-cell">
            <div class="lbl">Bill To</div>
            <div class="val">${bill.billedTo.name}</div>
            <div class="sub">${bill.billedTo.address}<br>${bill.billedTo.city}, ${bill.billedTo.state} – ${bill.billedTo.pincode}</div>
            ${bill.billedTo.gstin ? `<div class="sub" style="margin-top:3px;"><b>GSTIN:</b> ${bill.billedTo.gstin}</div>` : ''}
          </div>
          <div class="info-cell">
            <div class="lbl">Company Details</div>
            <div class="sub"><b>Phone:</b> ${bill.companyDetails.phone || ''}</div>
            <div class="sub"><b>Email:</b> ${bill.companyDetails.email || ''}</div>
            <div class="sub" style="margin-top:6px;"><b>State:</b> ${bill.companyDetails.state} &nbsp; <b>Code:</b> ${bill.companyDetails.gstin.substring(0,2)}</div>
          </div>
        </div>
        <div class="meta-strip">
          <div class="meta-cell"><div class="k">Invoice No</div><div class="v">${bill.billNumber}</div></div>
          <div class="meta-cell"><div class="k">Invoice Date</div><div class="v">${bill.invoiceDate}</div></div>
          <div class="meta-cell"><div class="k">PO Number</div><div class="v">${bill.poNumber||'-'}</div></div>
          <div class="meta-cell"><div class="k">Challan No</div><div class="v">${bill.challanNo||'-'}</div></div>
        </div>
        <table>
          <thead><tr><th width="30">#</th><th>Description of Goods</th><th width="70">HSN Code</th><th width="60" style="text-align:center;">Qty</th><th width="80" style="text-align:right;">Rate (₹)</th><th width="90" style="text-align:right;">Amount (₹)</th></tr></thead>
          <tbody>
            ${bill.items.map((item: any, i: number) => `<tr>
              <td style="text-align:center;">${i+1}</td><td>${item.description}</td><td>${item.hsnCode||'-'}</td>
              <td style="text-align:center;">${item.quantity}</td>
              <td style="text-align:right;">${(Number(item.rate)||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
              <td style="text-align:right;">${(Number(item.amount)||0).toLocaleString('en-IN',{minimumFractionDigits:2})}</td>
            </tr>`).join('')}
            <tr><td colspan="4"></td><td style="text-align:right;font-weight:700;background:#fef2f2;">Subtotal</td><td style="text-align:right;font-weight:700;background:#fef2f2;">₹${bill.subtotal.toLocaleString('en-IN',{minimumFractionDigits:2})}</td></tr>
            ${bill.cgstAmount ? `<tr><td colspan="4"></td><td style="text-align:right;">CGST ${bill.cgstRate||''}%</td><td style="text-align:right;">₹${bill.cgstAmount.toLocaleString('en-IN',{minimumFractionDigits:2})}</td></tr>` : ''}
            ${bill.sgstAmount ? `<tr><td colspan="4"></td><td style="text-align:right;">SGST ${bill.sgstRate||''}%</td><td style="text-align:right;">₹${bill.sgstAmount.toLocaleString('en-IN',{minimumFractionDigits:2})}</td></tr>` : ''}
            ${bill.igstAmount ? `<tr><td colspan="4"></td><td style="text-align:right;">IGST ${bill.igstRate||''}%</td><td style="text-align:right;">₹${bill.igstAmount.toLocaleString('en-IN',{minimumFractionDigits:2})}</td></tr>` : ''}
          </tbody>
        </table>
        <div class="bottom-grid">
          <div class="bottom-left">
            <div class="section-label">Bank Details</div>
            <div class="detail-row"><span>Bank Name</span><span><b>SBI</b></span></div>
            <div class="detail-row"><span>Branch</span><span>NANDESAR</span></div>
            <div class="detail-row"><span>Account No</span><span><b>38190064436</b></span></div>
            <div class="detail-row"><span>IFSC Code</span><span><b>SBIN0006614</b></span></div>
          </div>
          <div class="bottom-right">
            <div class="section-label">Amount Summary</div>
            <div class="detail-row"><span>Total Amount</span><span>₹${bill.totalAmount.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>
            <div class="total-box"><span>NET PAYABLE</span><span>₹${bill.totalAmount.toLocaleString('en-IN',{minimumFractionDigits:2})}</span></div>
            <div style="margin-top:28px;text-align:right;font-size:10px;">
              <div style="font-weight:700;margin-bottom:24px;">For ${bill.companyDetails.name}</div>
              <div style="border-top:1px solid #1a1a1a;padding-top:3px;font-size:9px;color:#555;">Authorised Signatory</div>
            </div>
          </div>
        </div>
        <div class="terms-strip">
          <div class="lbl">Terms & Conditions</div>
          <ul>${(bill.termsAndConditions||[]).map((t:string)=>`<li>${t}</li>`).join('')}</ul>
        </div>
        <div class="footer-txt">This is a Proforma Invoice and NOT a demand for payment &nbsp;|&nbsp; Generated by ${bill.companyDetails.name.split(' ')[0]} ERP</div>
        <div class="bottom-stripe"></div>
      </div></div></body></html>`;

    const finalHTML =
      bill.templateId === "template-006" ? modernProformaHTML :
      bill.templateId === "template-007" ? classicProformaHTML :
      billHTML;

    printWindow.document.write(finalHTML);
    printWindow.document.close();
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
  };

  const getStatusBadge = (status: BillStatus) => {
    const variants: Record<BillStatus, { variant: any; label: string }> = {
      draft: { variant: "secondary", label: "Draft" },
      sent: { variant: "default", label: "Sent" },
      paid: { variant: "success", label: "Paid" },
      cancelled: { variant: "destructive", label: "Cancelled" }
    };

    const { variant, label } = variants[status];
    return <Badge variant={variant as any}>{label}</Badge>;
  };

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      searchQuery === "" ||
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.billedTo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.poNumber?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || bill.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: bills.length,
    totalAmount: bills.reduce((sum, b) => sum + b.totalAmount, 0),
    draft: bills.filter((b) => b.status === "draft").length,
    sent: bills.filter((b) => b.status === "sent").length,
    paid: bills.filter((b) => b.status === "paid").length,
    paidAmount: bills.filter((b) => b.status === "paid").reduce((sum, b) => sum + b.totalAmount, 0)
  };

  if (currentView === "select-template") {
    const templateMeta: Record<string, { icon: React.ElementType; color: string; description: string }> = {
      "template-001": { icon: FileText, color: "#1e40af", description: "Standard GST-compliant tax invoice with full company details, bank info, and terms & conditions." },
      "template-002": { icon: FileOutput, color: "#059669", description: "Pre-sale invoice for quotation purposes. Not a demand for payment." },
      "template-006": { icon: FileOutput, color: "#0f172a", description: "Modern proforma with dark header band, clean two-column layout and accent highlights." },
      "template-007": { icon: FileOutput, color: "#7c2d12", description: "Classic bordered proforma with formal header, ruled table and traditional typography." },
      "template-003": { icon: ReceiptIcon, color: "#7c3aed", description: "Delivery challan for goods dispatched without payment details." },
      "template-004": { icon: FileX, color: "#dc2626", description: "Credit note issued against an original invoice for returns or adjustments." },
      "template-005": { icon: FileQuestion, color: "#d97706", description: "Quotation or estimate for potential orders with validity period." },
    };

    return (
      <div className="space-y-4">
        {/* Compact header */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setCurrentView("list")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-base font-semibold">Select Template</h2>
            <p className="text-xs text-muted-foreground">Choose a type for your new invoice</p>
          </div>
        </div>

        {/* Compact template list — table-like rows */}
        <div className="border rounded-lg overflow-hidden divide-y divide-gray-100">
          {allTemplates.map(template => {
            const meta = templateMeta[template.id] || { icon: FileText, color: "#6b7280", description: "" };
            const Icon = meta.icon;
            const isSelected = selectedTemplate?.id === template.id;

            return (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                  isSelected ? "bg-indigo-50" : "bg-white hover:bg-gray-50"
                }`}
              >
                {/* Color dot */}
                <div className="w-1 self-stretch rounded-full flex-shrink-0" style={{ backgroundColor: meta.color }} />

                {/* Icon */}
                <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${meta.color}18` }}>
                  <Icon className="h-4 w-4" style={{ color: meta.color }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isSelected ? "text-indigo-700" : "text-gray-900"}`}>
                    {template.templateName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{meta.description}</p>
                </div>

                {/* Badges */}
                <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                  {template.showBankDetails && <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Bank</span>}
                  {template.showTerms && <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">T&C</span>}
                  {template.showLogo && <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">Logo</span>}
                </div>

                {/* Selected check */}
                {isSelected
                  ? <Check className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                  : <div className="h-4 w-4 flex-shrink-0" />
                }
              </button>
            );
          })}
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {selectedTemplate ? <>Selected: <strong className="text-gray-900">{selectedTemplate.templateName}</strong></> : "Select a template to continue"}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentView("list")}>Cancel</Button>
            <Button size="sm" onClick={handleProceedWithTemplate} disabled={!selectedTemplate}>
              <FileCheck className="h-3.5 w-3.5 mr-1.5" />
              Continue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === "create" || currentView === "edit") {
    return (
      <BillCreationForm
        editBill={selectedBill || undefined}
        selectedTemplate={selectedTemplate || undefined}
        onSave={handleSave}
        onCancel={() => setCurrentView("list")}
      />
    );
  }

  if (currentView === "preview" && selectedBill) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setCurrentView("list")}>
            ← Back to List
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleEdit(selectedBill)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button onClick={() => handleDownload(selectedBill)}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
        <BillPreview bill={selectedBill} />
      </div>
    );
  }

  if (currentView === "eway-bill") {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3 mb-1">
          <button
            onClick={() => setCurrentView("list")}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Invoices
          </button>
        </div>
        <EWayBillManagement />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Invoices</h2>
          <p className="text-xs text-gray-500 mt-0.5">{stats.total} total</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentView("eway-bill")}
            className="border-gray-200 text-gray-600 hover:text-indigo-600 hover:border-indigo-300"
          >
            <Truck className="h-4 w-4 mr-1.5" />
            E-Way Bills
          </Button>
          <Button onClick={handleCreateNew} size="sm" className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-1.5" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
        {[
          { label: "Total", value: stats.total, sub: "invoices", color: "text-gray-900" },
          { label: "Revenue", value: `₹${formatCurrency(stats.totalAmount)}`, sub: "total billed", color: "text-gray-900" },
          { label: "Paid", value: stats.paid, sub: `₹${formatCurrency(stats.paidAmount)}`, color: "text-green-700" },
          { label: "Pending", value: stats.sent + stats.draft, sub: `${stats.draft} drafts`, color: "text-orange-600" },
        ].map((s) => (
          <div key={s.label} className="px-5 py-4">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Search invoice, customer or PO…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-sm bg-white"
          />
        </div>
        <select
          className="h-9 px-3 border border-gray-200 rounded-md text-sm bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as BillStatus | "all")}
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Invoice</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">PO No.</th>
                <th className="text-right px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-center px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-gray-400">
                    <FileText className="h-8 w-8 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium text-gray-500">No invoices found</p>
                    <p className="text-xs mt-1">{searchQuery || statusFilter !== "all" ? "Try adjusting your filters" : "Create your first invoice to get started"}</p>
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 text-sm">{bill.billNumber}</p>
                      {bill.challanNo && <p className="text-xs text-gray-400">Challan: {bill.challanNo}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{bill.invoiceDate}</td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">{bill.billedTo.name}</p>
                      <p className="text-xs text-gray-400">{bill.billedTo.city}, {bill.billedTo.state}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{bill.poNumber || "—"}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900 whitespace-nowrap">₹{formatCurrency(bill.totalAmount)}</td>
                    <td className="px-4 py-3 text-center">{getStatusBadge(bill.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-0.5">
                        {[
                          { icon: Eye, action: () => handlePreview(bill), title: "Preview", cls: "" },
                          { icon: Edit, action: () => handleEdit(bill), title: "Edit", cls: "" },
                          { icon: Share2, action: () => handleSharePaymentLink(bill), title: "Share", cls: "text-green-600" },
                          { icon: Download, action: () => handleDownload(bill), title: "Download", cls: "" },
                          { icon: Trash2, action: () => handleDelete(bill.id), title: "Delete", cls: "text-red-500" },
                        ].map(({ icon: Icon, action, title, cls }) => (
                          <button key={title} onClick={action} title={title}
                            className={`p-1.5 rounded hover:bg-gray-100 transition-colors ${cls}`}>
                            <Icon className="h-3.5 w-3.5" />
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Link Dialog */}
      <Dialog open={showPaymentLinkDialog} onOpenChange={setShowPaymentLinkDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Share Payment Link</DialogTitle>
            <DialogDescription>
              Generate a secure payment link for{" "}
              <strong>{paymentLinkBill?.billNumber}</strong>
            </DialogDescription>
          </DialogHeader>

          {!generatedPaymentLink ? (
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <Label>Payment Amount</Label>
                <RadioGroup value={paymentType} onValueChange={(val) => setPaymentType(val as any)}>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="full" id="full" />
                    <Label htmlFor="full" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Full Payment</div>
                      <div className="text-sm text-muted-foreground">
                        ₹{formatCurrency(paymentLinkBill?.totalAmount || 0)}
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="half" id="half" />
                    <Label htmlFor="half" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Half Payment (50%)</div>
                      <div className="text-sm text-muted-foreground">
                        ₹{formatCurrency((paymentLinkBill?.totalAmount || 0) / 2)}
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Custom Amount</div>
                      <div className="text-sm text-muted-foreground">
                        Enter a specific amount
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentType === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="customAmount">Custom Amount (₹)</Label>
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    max={paymentLinkBill?.totalAmount}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum: ₹{formatCurrency(paymentLinkBill?.totalAmount || 0)}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="font-semibold text-green-900">Payment Link Generated!</p>
                </div>
                <p className="text-sm text-green-700">
                  Share this link with your customer to receive payment
                </p>
              </div>

              <div className="space-y-2">
                <Label>Payment Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={generatedPaymentLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyPaymentLink}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <ExternalLink className="h-4 w-4 text-blue-600" />
                <div className="text-sm text-blue-900">
                  <p className="font-semibold">Amount: ₹{formatCurrency(
                    paymentType === "full"
                      ? paymentLinkBill?.totalAmount || 0
                      : paymentType === "half"
                      ? (paymentLinkBill?.totalAmount || 0) / 2
                      : parseFloat(customAmount) || 0
                  )}</p>
                  <p className="text-xs text-blue-700">
                    Link expires in 7 days
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            {!generatedPaymentLink ? (
              <>
                <Button variant="outline" onClick={() => setShowPaymentLinkDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={generatePaymentLink}>
                  Generate Link
                </Button>
              </>
            ) : (
              <Button onClick={() => setShowPaymentLinkDialog(false)}>
                Done
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}