import { useState, useRef } from "react";
import {
  ArrowLeft, Save, Shirt, Camera, Upload, X, ChevronDown, ChevronUp, Package,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

export interface NewFabricInput {
  garmentType: "pant" | "shirt";
  sellerName: string;
  billNo: string;
  companyName: string;
  fabricName: string;
  fabricCode: string;
  fabricMeter: string;
  color: string;
  photo: string;
  rack: string;
  floor: string;
  // optional
  pricePerUnit: string;
  minimumStock: string;
  maximumStock: string;
  unit: string;
}

const emptyInput: NewFabricInput = {
  garmentType: "shirt",
  sellerName: "",
  billNo: "",
  companyName: "",
  fabricName: "",
  fabricCode: "",
  fabricMeter: "",
  color: "",
  photo: "",
  rack: "",
  floor: "",
  pricePerUnit: "",
  minimumStock: "",
  maximumStock: "",
  unit: "meters",
};

interface AddFabricPageProps {
  onSave: (data: NewFabricInput) => void;
  onCancel: () => void;
}

export function AddFabricPage({ onSave, onCancel }: AddFabricPageProps) {
  const [form, setForm] = useState<NewFabricInput>(emptyInput);
  const [showOptional, setShowOptional] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof NewFabricInput, value: string) => setForm((p) => ({ ...p, [key]: value }));

  const handlePhoto = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => set("photo", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.fabricName.trim() || !form.fabricCode.trim()) {
      alert("Fabric Name and Fabric Code are required");
      return;
    }
    onSave(form);
  };

  const renderField = (label: string, keyName: keyof NewFabricInput, placeholder?: string, required?: boolean, type = "text") => (
    <div className="space-y-1">
      <Label className="text-xs text-gray-600">{label}{required && <span className="text-red-500"> *</span>}</Label>
      <Input
        type={type}
        value={form[keyName] as string}
        onChange={(e) => set(keyName, e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Add New Fabric</h2>
          <p className="text-xs text-gray-500 mt-0.5">Enter fabric details to add it to inventory</p>
        </div>
      </div>

      {/* Garment type selector */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Garment Type</Label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {([
            { key: "shirt" as const, label: "Shirt" },
            { key: "pant" as const, label: "Pant" },
          ]).map((g) => (
            <button
              key={g.key}
              type="button"
              onClick={() => set("garmentType", g.key)}
              className={`flex items-center justify-center gap-2 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                form.garmentType === g.key
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300"
              }`}
            >
              <Shirt className="h-4 w-4" />
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Purchase details */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Purchase Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          {renderField("Seller Name", "sellerName", "e.g. Cotton Mills Ltd")}
          {renderField("Bill No", "billNo", "e.g. BILL-2026-001")}
          {renderField("Company Name", "companyName", "e.g. ABC Garments Pvt Ltd")}
        </div>
      </div>

      {/* Fabric details */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Fabric Details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          {renderField("Fabric Name", "fabricName", "e.g. Premium Cotton", true)}
          {renderField("Fabric Code", "fabricCode", "e.g. FAB-001", true)}
          {renderField("Fabric Meter", "fabricMeter", "e.g. 1500", false, "number")}
          {renderField("Fabric Colour", "color", "e.g. Navy Blue")}
        </div>

        {/* Photo */}
        <div className="mt-4 space-y-1">
          <Label className="text-xs text-gray-600">Fabric Photo</Label>
          {form.photo ? (
            <div className="relative inline-block">
              <img src={form.photo} alt="Fabric" className="h-32 w-32 object-cover rounded-lg border border-gray-200" />
              <button
                type="button"
                onClick={() => set("photo", "")}
                className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 h-28 w-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors text-gray-500"
              >
                <Camera className="h-6 w-6" />
                <span className="text-xs font-medium">Take Photo</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 h-28 w-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-400 hover:bg-indigo-50/40 transition-colors text-gray-500"
              >
                <Upload className="h-6 w-6" />
                <span className="text-xs font-medium">Upload</span>
              </button>
            </div>
          )}
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handlePhoto(e.target.files?.[0])} />
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handlePhoto(e.target.files?.[0])} />
        </div>
      </div>

      {/* Storage location */}
      <div className="bg-white border border-gray-200 rounded-lg p-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Storage Location</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          {renderField("Rack", "rack", "e.g. Rack A1")}
          {renderField("Floor", "floor", "e.g. Ground Floor")}
        </div>
      </div>

      {/* Optional: price & stock */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setShowOptional((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Pricing & Stock Levels</span>
            <span className="text-xs text-gray-400">(optional)</span>
          </div>
          {showOptional ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>
        {showOptional && (
          <div className="px-5 pb-5 pt-1 border-t border-gray-100">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 mt-3">
              {renderField("Price / Unit (₹)", "pricePerUnit", "0", false, "number")}
              <div className="space-y-1">
                <Label className="text-xs text-gray-600">Unit</Label>
                <select
                  value={form.unit}
                  onChange={(e) => set("unit", e.target.value)}
                  className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                >
                  <option value="meters">Meters</option>
                  <option value="yards">Yards</option>
                  <option value="kilograms">Kilograms</option>
                </select>
              </div>
              {renderField("Minimum Stock", "minimumStock", "0", false, "number")}
              {renderField("Maximum Stock", "maximumStock", "0", false, "number")}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCancel}>Cancel</Button>
        <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700" onClick={handleSubmit}>
          <Save className="h-4 w-4 mr-2" />
          Add Fabric
        </Button>
      </div>
    </div>
  );
}
