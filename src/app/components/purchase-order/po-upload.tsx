import { uploadFileToStorage, STORAGE_FOLDERS } from "@/app/api/supabase-api";
import { useState, useRef } from "react";
import { ArrowLeft, Upload, FileText, AlertCircle, CheckCircle2, X, Loader2 } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { PurchaseOrder } from "./purchase-order-types";

interface POUploadProps {
  onSave: (po: PurchaseOrder) => void;
  onCancel: () => void;
}

export function POUpload({ onSave, onCancel }: POUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [poNumber, setPONumber] = useState("");
  const [clientCompanyName, setClientCompanyName] = useState("");
  const [deliveryDeadline, setDeliveryDeadline] = useState("");
  const [totalQuantity, setTotalQuantity] = useState("");
  const [uniformType, setUniformType] = useState<"both" | "shirt-only" | "pant-only" | "tshirt-only">("both");
  const [shirtsPerPerson, setShirtsPerPerson] = useState("");
  const [pantsPerPerson, setPantsPerPerson] = useState("");
  const [tshirtsPerPerson, setTshirtsPerPerson] = useState("");
  const [notes, setNotes] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

  const handleFileChange = (file: File) => {
    // Accept PDF, Word documents, and images
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];

    if (allowedTypes.includes(file.type)) {
      setUploadedFile(file);
    } else {
      alert("Please upload a valid file (PDF, Word, or Image)");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const generatePONumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PO-${year}-${random}`;
  };

  const handleSubmit = async () => {
    if (!uploadedFile || !poNumber || !clientCompanyName || !deliveryDeadline || !totalQuantity) {
      alert("Please fill in all required fields and upload a PO document");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Try Supabase Storage; fall back to a local object URL if unavailable
      let fileUrl: string;
      try {
        fileUrl = await uploadFileToStorage(uploadedFile, STORAGE_FOLDERS.PO_DOCUMENTS);
      } catch {
        console.log("[POUpload] Storage unavailable, using local file reference");
        fileUrl = URL.createObjectURL(uploadedFile);
      }

      const newPO: PurchaseOrder = {
        id: `po_${Date.now()}`,
        poNumber: poNumber || generatePONumber(),
        clientCompanyName,
        clientContactPerson: "",
        clientContactPhone: "",
        clientContactEmail: "",
        clientAddress: "",
        uniformType,
        shirtsPerPerson: (uniformType === "both" || uniformType === "shirt-only") ? parseInt(shirtsPerPerson) || 1 : undefined,
        pantsPerPerson: (uniformType === "both" || uniformType === "pant-only") ? parseInt(pantsPerPerson) || 1 : undefined,
        tshirtsPerPerson: uniformType === "tshirt-only" ? parseInt(tshirtsPerPerson) || 1 : undefined,
        totalQuantity: parseInt(totalQuantity) || 0,
        orderDate: new Date().toISOString().split('T')[0],
        poDate: new Date().toISOString().split('T')[0],
        deliveryDeadline,
        unitPrice: 0,
        totalOrderValue: 0,
        paymentTerms: "full-advance",
        advanceAmount: 0,
        brandLogoRequired: false,
        qualityStandard: "standard",
        status: "draft",
        createdBy: "current-user",
        measurementsCompleted: 0,
        measurementsInProgress: 0,
        employeesUploaded: 0,
        orderPriority: "normal",
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
        uploadedDocument: {
          fileName: uploadedFile.name,
          fileSize: uploadedFile.size,
          fileType: uploadedFile.type,
          uploadDate: new Date().toISOString(),
          fileUrl, // Supabase Storage URL
        },
        notes: notes || undefined,
      };

      onSave(newPO);
    } catch (err: any) {
      console.log("[POUpload] Upload failed:", err.message);
      setUploadError(err.message || "Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Upload Purchase Order</h1>
          <p className="text-muted-foreground mt-1">
            Upload an existing PO document and enter basic details
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <Card className="p-8">
        <div className="space-y-6">
          {/* File Upload Drag & Drop */}
          <div>
            <Label className="text-base font-semibold mb-4 block">PO Document *</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300 hover:border-indigo-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!uploadedFile ? (
                <div>
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Drop your PO document here
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse (PDF, Word, or Image)
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Select File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileInputChange}
                  />
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                      <div className="text-left flex-1">
                        <h4 className="font-semibold text-green-900">{uploadedFile.name}</h4>
                        <p className="text-sm text-green-700 mt-1">
                          {formatFileSize(uploadedFile.size)} • {uploadedFile.type.split('/')[1].toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              <AlertCircle className="h-4 w-4 inline mr-1" />
              Supported formats: PDF, Word Document, JPG, PNG (Max 10MB)
            </p>
          </div>

          {/* Basic PO Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 pt-6 border-t">
            <div>
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">PO Number *</Label>
              <Input value={poNumber} onChange={(e) => setPONumber(e.target.value)} placeholder="e.g., PO-2026-0001" className="font-mono mt-1" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Client Company Name *</Label>
              <Input value={clientCompanyName} onChange={(e) => setClientCompanyName(e.target.value)} placeholder="Enter company name" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Delivery Deadline *</Label>
              <Input type="date" value={deliveryDeadline} onChange={(e) => setDeliveryDeadline(e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Employees *</Label>
              <Input type="number" value={totalQuantity} onChange={(e) => setTotalQuantity(e.target.value)} placeholder="Number of employees" min="1" className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Uniform Type *</Label>
              <select
                value={uniformType}
                onChange={(e) => setUniformType(e.target.value as "both" | "shirt-only" | "pant-only" | "tshirt-only")}
                className="mt-1 w-full sm:w-64 h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="both">Both (Shirt + Pant)</option>
                <option value="shirt-only">Shirt Only</option>
                <option value="pant-only">Pant Only</option>
                <option value="tshirt-only">T-Shirt Only</option>
              </select>
            </div>
          </div>

          {/* Quantity Summary Table */}
          {(() => {
            const emp = parseInt(totalQuantity) || 0;
            const spp = parseInt(shirtsPerPerson) || 0;
            const ppp = parseInt(pantsPerPerson) || 0;
            const tpp = parseInt(tshirtsPerPerson) || 0;

            const showShirt = uniformType === "both" || uniformType === "shirt-only";
            const showPant  = uniformType === "both" || uniformType === "pant-only";
            const showTshirt = uniformType === "tshirt-only";

            return (
              <div className="pt-4 border-t space-y-4">
                {/* Per-person inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {showShirt && (
                    <div>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Shirts per Person *</Label>
                      <Input type="number" value={shirtsPerPerson} onChange={(e) => setShirtsPerPerson(e.target.value)} placeholder="e.g., 2" min="1" className="mt-1" />
                    </div>
                  )}
                  {showPant && (
                    <div>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Pants per Person *</Label>
                      <Input type="number" value={pantsPerPerson} onChange={(e) => setPantsPerPerson(e.target.value)} placeholder="e.g., 1" min="1" className="mt-1" />
                    </div>
                  )}
                  {showTshirt && (
                    <div>
                      <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">T-Shirts per Person *</Label>
                      <Input type="number" value={tshirtsPerPerson} onChange={(e) => setTshirtsPerPerson(e.target.value)} placeholder="e.g., 2" min="1" className="mt-1" />
                    </div>
                  )}
                </div>

                {/* Summary table — shows once any value is entered */}
                {emp > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Order Summary</p>
                    <table className="w-full border-collapse text-sm">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold text-gray-600">Item</th>
                          <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-600">Total Employees</th>
                          <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-600">Qty / Person</th>
                          <th className="border border-gray-300 px-4 py-2 text-center font-semibold text-gray-600">Total Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {showShirt && (
                          <tr className="bg-indigo-50/50">
                            <td className="border border-gray-300 px-4 py-2 font-medium text-indigo-700">Shirt</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{emp}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{spp || "—"}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center font-bold text-indigo-700">{spp ? emp * spp : "—"}</td>
                          </tr>
                        )}
                        {showPant && (
                          <tr className="bg-blue-50/50">
                            <td className="border border-gray-300 px-4 py-2 font-medium text-blue-700">Pant</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{emp}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{ppp || "—"}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center font-bold text-blue-700">{ppp ? emp * ppp : "—"}</td>
                          </tr>
                        )}
                        {showTshirt && (
                          <tr className="bg-purple-50/50">
                            <td className="border border-gray-300 px-4 py-2 font-medium text-purple-700">T-Shirt</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{emp}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center">{tpp || "—"}</td>
                            <td className="border border-gray-300 px-4 py-2 text-center font-bold text-purple-700">{tpp ? emp * tpp : "—"}</td>
                          </tr>
                        )}
                        {(showShirt || showPant || showTshirt) && (
                          <tr className="bg-gray-50 font-semibold">
                            <td className="border border-gray-300 px-4 py-2 text-gray-700">Total Pieces</td>
                            <td className="border border-gray-300 px-4 py-2 text-center text-gray-500">—</td>
                            <td className="border border-gray-300 px-4 py-2 text-center text-gray-500">—</td>
                            <td className="border border-gray-300 px-4 py-2 text-center text-gray-900 font-bold">
                              {(showShirt ? emp * spp : 0) + (showPant ? emp * ppp : 0) + (showTshirt ? emp * tpp : 0) || "—"}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Notes */}
          <div>
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Additional Notes (Optional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional information about this PO..." rows={3} className="mt-1" />
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      {uploadError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={isUploading}>
          {isUploading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Upload className="h-4 w-4 mr-2" />
          )}
          {isUploading ? "Uploading to Cloud..." : "Upload Purchase Order"}
        </Button>
      </div>
    </div>
  );
}