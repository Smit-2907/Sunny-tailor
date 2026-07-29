import { uploadFileToStorage, STORAGE_FOLDERS } from "@/app/api/supabase-api";
import { useState } from "react";
import {
  Package,
  Upload,
  X,
  Save,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
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

export interface StoredAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface FabricBill {
  id: string;
  billNo: string;
  supplierName: string;
  fabricType: string;
  quantity: number;
  unit: string;
  rate: number;
  taxPercentage: number;
  tax: number;
  totalAmount: number;
  status: "paid" | "partial" | "pending" | "overdue";
  billDate: string;
  dueDate: string;
  paymentTerms: string;
  notes?: string;
  attachments: StoredAttachment[];
  createdBy: string;
  createdAt: string;
}

interface FabricBillUploadProps {
  onSave: (bill: FabricBill) => void;
  onCancel: () => void;
  initialData?: FabricBill;
}

export function FabricBillUpload({ onSave, onCancel, initialData }: FabricBillUploadProps) {
  const [formData, setFormData] = useState<Partial<FabricBill>>({
    billNo: initialData?.billNo || "",
    supplierName: initialData?.supplierName || "",
    fabricType: initialData?.fabricType || "",
    quantity: initialData?.quantity || 0,
    unit: initialData?.unit || "meters",
    rate: initialData?.rate || 0,
    taxPercentage: initialData?.taxPercentage || 18,
    status: initialData?.status || "pending",
    billDate: initialData?.billDate || new Date().toISOString().split("T")[0],
    dueDate: initialData?.dueDate || "",
    paymentTerms: initialData?.paymentTerms || "Net 30",
    notes: initialData?.notes || "",
  });

  const [attachments, setAttachments] = useState<StoredAttachment[]>(initialData?.attachments || []);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Calculate tax and total
  const subtotal = formData.quantity! * formData.rate!;
  const calculatedTax = (subtotal * (formData.taxPercentage || 0)) / 100;
  const calculatedTotal = subtotal + calculatedTax;

  const handleInputChange = (field: keyof FabricBill, value: any) => {
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
          const url = await uploadFileToStorage(file, STORAGE_FOLDERS.FABRIC_BILLS);
          return { name: file.name, url, type: file.type, size: file.size } as StoredAttachment;
        })
      );
      setAttachments((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload file(s). Please try again.");
    } finally {
      setUploadingFiles(false);
      // Reset input so the same file can be re-selected if needed
      e.target.value = "";
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.billNo) newErrors.billNo = "Bill number is required";
    if (!formData.supplierName) newErrors.supplierName = "Supplier name is required";
    if (!formData.fabricType) newErrors.fabricType = "Fabric type is required";
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Valid quantity is required";
    if (!formData.rate || formData.rate <= 0) newErrors.rate = "Valid rate is required";
    if (!formData.billDate) newErrors.billDate = "Bill date is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const bill: FabricBill = {
      id: initialData?.id || `FB-${Date.now()}`,
      billNo: formData.billNo!,
      supplierName: formData.supplierName!,
      fabricType: formData.fabricType!,
      quantity: formData.quantity!,
      unit: formData.unit!,
      rate: formData.rate!,
      taxPercentage: formData.taxPercentage!,
      tax: calculatedTax,
      totalAmount: calculatedTotal,
      status: formData.status!,
      billDate: formData.billDate!,
      dueDate: formData.dueDate!,
      paymentTerms: formData.paymentTerms!,
      notes: formData.notes,
      attachments,
      createdBy: "Current User",
      createdAt: initialData?.createdAt || new Date().toISOString(),
    };

    onSave(bill);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {showSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Fabric bill {initialData ? "updated" : "created"} successfully!
          </AlertDescription>
        </Alert>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <Package className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              {initialData ? "Edit" : "Add New"} Fabric Bill
            </h3>
            <p className="text-sm text-muted-foreground">
              Enter fabric purchase details and upload supporting documents
            </p>
          </div>
        </div>

        {/* Bill Information - all existing fields below */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Bill No */}
            <div>
              <Label>Bill Number *</Label>
              <Input
                value={formData.billNo}
                onChange={(e) => handleInputChange("billNo", e.target.value)}
                placeholder="e.g., FB-2026-001"
              />
              {errors.billNo && <p className="text-xs text-red-500 mt-1">{errors.billNo}</p>}
            </div>
            {/* Supplier Name */}
            <div>
              <Label>Supplier Name *</Label>
              <Input
                value={formData.supplierName}
                onChange={(e) => handleInputChange("supplierName", e.target.value)}
                placeholder="Enter supplier name"
              />
              {errors.supplierName && <p className="text-xs text-red-500 mt-1">{errors.supplierName}</p>}
            </div>
            {/* Fabric Type */}
            <div>
              <Label>Fabric Type *</Label>
              <Input
                value={formData.fabricType}
                onChange={(e) => handleInputChange("fabricType", e.target.value)}
                placeholder="e.g., Cotton, Polyester"
              />
              {errors.fabricType && <p className="text-xs text-red-500 mt-1">{errors.fabricType}</p>}
            </div>
            {/* Unit */}
            <div>
              <Label>Unit</Label>
              <Select value={formData.unit} onValueChange={(v) => handleInputChange("unit", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="meters">Meters</SelectItem>
                  <SelectItem value="yards">Yards</SelectItem>
                  <SelectItem value="kg">Kg</SelectItem>
                  <SelectItem value="pieces">Pieces</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Quantity */}
            <div>
              <Label>Quantity *</Label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", parseFloat(e.target.value) || 0)}
                placeholder="0"
                min="0"
              />
              {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity}</p>}
            </div>
            {/* Rate */}
            <div>
              <Label>Rate (₹) *</Label>
              <Input
                type="number"
                value={formData.rate}
                onChange={(e) => handleInputChange("rate", parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                min="0"
              />
              {errors.rate && <p className="text-xs text-red-500 mt-1">{errors.rate}</p>}
            </div>
            {/* Tax */}
            <div>
              <Label>Tax Percentage (%)</Label>
              <Select
                value={String(formData.taxPercentage)}
                onValueChange={(v) => handleInputChange("taxPercentage", parseFloat(v))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0%</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="12">12%</SelectItem>
                  <SelectItem value="18">18%</SelectItem>
                  <SelectItem value="28">28%</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Status */}
            <div>
              <Label>Payment Status</Label>
              <Select value={formData.status} onValueChange={(v) => handleInputChange("status", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Bill Date */}
            <div>
              <Label>Bill Date *</Label>
              <Input
                type="date"
                value={formData.billDate}
                onChange={(e) => handleInputChange("billDate", e.target.value)}
              />
              {errors.billDate && <p className="text-xs text-red-500 mt-1">{errors.billDate}</p>}
            </div>
            {/* Due Date */}
            <div>
              <Label>Due Date *</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
              />
              {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
            </div>
            {/* Payment Terms */}
            <div>
              <Label>Payment Terms</Label>
              <Select value={formData.paymentTerms} onValueChange={(v) => handleInputChange("paymentTerms", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Immediate">Immediate</SelectItem>
                  <SelectItem value="Net 15">Net 15</SelectItem>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                  <SelectItem value="Net 60">Net 60</SelectItem>
                  <SelectItem value="Net 90">Net 90</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Subtotal</p>
              <p className="font-semibold">₹{subtotal.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tax ({formData.taxPercentage}%)</p>
              <p className="font-semibold">₹{calculatedTax.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Amount</p>
              <p className="font-semibold text-indigo-700">₹{calculatedTotal.toFixed(2)}</p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label>Notes (Optional)</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          {/* File Attachments — uploads to Supabase Storage */}
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
                    Upload bill copies, invoices, or related documents
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
          <Button onClick={handleSubmit} className="flex-1 sm:flex-none" disabled={uploadingFiles}>
            <Save className="h-4 w-4 mr-2" />
            {initialData ? "Update" : "Save"} Fabric Bill
          </Button>
          <Button variant="outline" onClick={onCancel} className="flex-1 sm:flex-none">
            Cancel
          </Button>
        </div>
      </Card>
    </div>
  );
}