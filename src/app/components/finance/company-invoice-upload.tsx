import { uploadFileToStorage, STORAGE_FOLDERS } from "@/app/api/supabase-api";
import { useState } from "react";
import {
  FileText,
  Upload,
  X,
  Save,
  AlertCircle,
  Trash2,
  Building2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { StoredAttachment } from "./fabric-bill-upload";

export interface CompanyInvoice {
  id: string;
  invoiceNo: string;
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  clientAddress?: string;
  invoiceDate: string;
  dueDate: string;
  invoiceAmount: number;
  receivedAmount: number;
  balance: number;
  status: "paid" | "partial" | "pending" | "overdue";
  paymentMethod?: string;
  paymentTerms: string;
  taxPercentage: number;
  taxAmount: number;
  subtotal: number;
  description: string;
  notes?: string;
  agingDays: number;
  attachments: StoredAttachment[];
  createdBy: string;
  createdAt: string;
}

interface CompanyInvoiceUploadProps {
  onSave: (invoice: CompanyInvoice) => void;
  onCancel: () => void;
  initialData?: CompanyInvoice;
}

export function CompanyInvoiceUpload({
  onSave,
  onCancel,
  initialData,
}: CompanyInvoiceUploadProps) {
  const [formData, setFormData] = useState<Partial<CompanyInvoice>>({
    invoiceNo: initialData?.invoiceNo || "",
    clientName: initialData?.clientName || "",
    clientEmail: initialData?.clientEmail || "",
    clientPhone: initialData?.clientPhone || "",
    clientAddress: initialData?.clientAddress || "",
    invoiceDate: initialData?.invoiceDate || new Date().toISOString().split("T")[0],
    dueDate: initialData?.dueDate || "",
    subtotal: initialData?.subtotal || 0,
    taxPercentage: initialData?.taxPercentage || 18,
    receivedAmount: initialData?.receivedAmount || 0,
    status: initialData?.status || "pending",
    paymentMethod: initialData?.paymentMethod || "",
    paymentTerms: initialData?.paymentTerms || "Net 30",
    description: initialData?.description || "",
    notes: initialData?.notes || "",
  });

  const [attachments, setAttachments] = useState<StoredAttachment[]>(initialData?.attachments || []);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate tax and total
  const calculatedTax = (formData.subtotal! * (formData.taxPercentage || 0)) / 100;
  const calculatedTotal = formData.subtotal! + calculatedTax;
  const calculatedBalance = calculatedTotal - (formData.receivedAmount || 0);

  // Calculate aging days
  const calculateAgingDays = () => {
    if (!formData.invoiceDate) return 0;
    const invoiceDate = new Date(formData.invoiceDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - invoiceDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleInputChange = (field: keyof CompanyInvoice, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setUploadingFiles(true);
    setUploadError(null);
    try {
      const uploaded = await Promise.all(
        files.map(async (file) => {
          const url = await uploadFileToStorage(file, STORAGE_FOLDERS.COMPANY_INVOICES);
          return { name: file.name, url, type: file.type, size: file.size } as StoredAttachment;
        })
      );
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file(s). Please try again.");
    } finally {
      setUploadingFiles(false);
      e.target.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.invoiceNo) newErrors.invoiceNo = "Invoice number is required";
    if (!formData.clientName) newErrors.clientName = "Client name is required";
    if (!formData.invoiceDate) newErrors.invoiceDate = "Invoice date is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    if (!formData.subtotal || formData.subtotal <= 0)
      newErrors.subtotal = "Valid amount is required";
    if (!formData.description) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const invoice: CompanyInvoice = {
      id: initialData?.id || `INV-${Date.now()}`,
      invoiceNo: formData.invoiceNo!,
      clientName: formData.clientName!,
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      clientAddress: formData.clientAddress,
      invoiceDate: formData.invoiceDate!,
      dueDate: formData.dueDate!,
      subtotal: formData.subtotal!,
      taxPercentage: formData.taxPercentage!,
      taxAmount: calculatedTax,
      invoiceAmount: calculatedTotal,
      receivedAmount: formData.receivedAmount || 0,
      balance: calculatedBalance,
      status: formData.status!,
      paymentMethod: formData.paymentMethod,
      paymentTerms: formData.paymentTerms!,
      description: formData.description!,
      notes: formData.notes,
      agingDays: calculateAgingDays(),
      attachments: attachments,
      createdBy: "Current User",
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSave(invoice);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Invoice {initialData ? "updated" : "created"} successfully!
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {initialData ? "Edit" : "Create New"} Company Invoice
            </h3>
            <p className="text-sm text-muted-foreground">
              Enter sales invoice details and upload supporting documents
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Invoice Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Invoice Number */}
            <div className="space-y-2">
              <Label htmlFor="invoiceNo">
                Invoice Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="invoiceNo"
                placeholder="e.g., INV-2024-001"
                value={formData.invoiceNo}
                onChange={(e) => handleInputChange("invoiceNo", e.target.value)}
                className={errors.invoiceNo ? "border-red-500" : ""}
              />
              {errors.invoiceNo && (
                <p className="text-xs text-red-500">{errors.invoiceNo}</p>
              )}
            </div>

            {/* Client Name */}
            <div className="space-y-2">
              <Label htmlFor="clientName">
                Client Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientName"
                placeholder="e.g., ABC Retail Chain"
                value={formData.clientName}
                onChange={(e) => handleInputChange("clientName", e.target.value)}
                className={errors.clientName ? "border-red-500" : ""}
              />
              {errors.clientName && (
                <p className="text-xs text-red-500">{errors.clientName}</p>
              )}
            </div>

            {/* Client Email */}
            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email</Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="client@example.com"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange("clientEmail", e.target.value)}
              />
            </div>

            {/* Client Phone */}
            <div className="space-y-2">
              <Label htmlFor="clientPhone">Client Phone</Label>
              <Input
                id="clientPhone"
                placeholder="+91 98765 43210"
                value={formData.clientPhone}
                onChange={(e) => handleInputChange("clientPhone", e.target.value)}
              />
            </div>
          </div>

          {/* Client Address */}
          <div className="space-y-2">
            <Label htmlFor="clientAddress">Client Address</Label>
            <Textarea
              id="clientAddress"
              placeholder="Enter complete client address..."
              value={formData.clientAddress}
              onChange={(e) => handleInputChange("clientAddress", e.target.value)}
              rows={2}
            />
          </div>

          {/* Invoice Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Invoice Date */}
            <div className="space-y-2">
              <Label htmlFor="invoiceDate">
                Invoice Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => handleInputChange("invoiceDate", e.target.value)}
                className={errors.invoiceDate ? "border-red-500" : ""}
              />
              {errors.invoiceDate && (
                <p className="text-xs text-red-500">{errors.invoiceDate}</p>
              )}
            </div>

            {/* Due Date */}
            <div className="space-y-2">
              <Label htmlFor="dueDate">
                Due Date <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className={errors.dueDate ? "border-red-500" : ""}
              />
              {errors.dueDate && (
                <p className="text-xs text-red-500">{errors.dueDate}</p>
              )}
            </div>

            {/* Payment Terms */}
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select
                value={formData.paymentTerms}
                onValueChange={(value) => handleInputChange("paymentTerms", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Immediate">Immediate</SelectItem>
                  <SelectItem value="Net 15">Net 15 Days</SelectItem>
                  <SelectItem value="Net 30">Net 30 Days</SelectItem>
                  <SelectItem value="Net 45">Net 45 Days</SelectItem>
                  <SelectItem value="Net 60">Net 60 Days</SelectItem>
                  <SelectItem value="Net 90">Net 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Payment Method */}
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => handleInputChange("paymentMethod", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online">Online Payment</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="credit-card">Credit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Invoice Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Invoice Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the goods/services provided..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Amount Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Subtotal */}
            <div className="space-y-2">
              <Label htmlFor="subtotal">
                Subtotal Amount (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subtotal"
                type="number"
                placeholder="e.g., 500000"
                value={formData.subtotal || ""}
                onChange={(e) => handleInputChange("subtotal", parseFloat(e.target.value))}
                className={errors.subtotal ? "border-red-500" : ""}
              />
              {errors.subtotal && (
                <p className="text-xs text-red-500">{errors.subtotal}</p>
              )}
            </div>

            {/* Tax Percentage */}
            <div className="space-y-2">
              <Label htmlFor="taxPercentage">Tax Percentage (%)</Label>
              <Select
                value={formData.taxPercentage?.toString()}
                onValueChange={(value) => handleInputChange("taxPercentage", parseFloat(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0% (Exempt)</SelectItem>
                  <SelectItem value="5">5% (GST)</SelectItem>
                  <SelectItem value="12">12% (GST)</SelectItem>
                  <SelectItem value="18">18% (GST)</SelectItem>
                  <SelectItem value="28">28% (GST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Received Amount */}
            <div className="space-y-2">
              <Label htmlFor="receivedAmount">Received Amount (₹)</Label>
              <Input
                id="receivedAmount"
                type="number"
                placeholder="e.g., 250000"
                value={formData.receivedAmount || ""}
                onChange={(e) =>
                  handleInputChange("receivedAmount", parseFloat(e.target.value))
                }
              />
            </div>
          </div>

          {/* Calculation Summary */}
          <Card className="p-4 bg-green-50 border-green-200">
            <h4 className="font-semibold mb-3">Invoice Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">
                  ₹{(formData.subtotal || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Tax ({formData.taxPercentage || 0}%)
                </span>
                <span className="font-semibold">
                  ₹{calculatedTax.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-green-300">
                <span className="font-semibold text-green-900">Invoice Amount</span>
                <span className="font-bold text-lg text-green-900">
                  ₹{calculatedTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between text-blue-700">
                <span>Received Amount</span>
                <span className="font-semibold">
                  ₹{(formData.receivedAmount || 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-green-300">
                <span className="font-semibold text-red-900">Balance Due</span>
                <span className="font-bold text-lg text-red-900">
                  ₹{calculatedBalance.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </Card>

          {/* Payment Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Payment Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partially Paid</SelectItem>
                <SelectItem value="paid">Fully Paid</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional information about this invoice..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          {/* File Attachments */}
          <div className="space-y-3">
            <Label>Supporting Documents</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
              {uploadingFiles ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
                  <p className="text-sm text-muted-foreground">Uploading to cloud storage...</p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload invoice copies, purchase orders, or related documents
                  </p>
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="max-w-xs mx-auto"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  />
                </>
              )}
            </div>

            {uploadError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Attached Files List */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Attached Files ({attachments.length})</p>
                {attachments.map((att, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <FileText className="h-4 w-4 text-indigo-600 flex-shrink-0" />
                      <span className="text-sm truncate">{att.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        ({(att.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <a
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 hover:bg-indigo-50 rounded text-indigo-600"
                        title="Open in new tab"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6 pt-6 border-t">
          <Button onClick={handleSubmit} className="flex-1 sm:flex-none">
            <Save className="h-4 w-4 mr-2" />
            {initialData ? "Update" : "Create"} Invoice
          </Button>
          <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}