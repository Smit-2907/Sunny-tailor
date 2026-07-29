import { useState, useEffect } from "react";
import { Save, X, CheckCircle, Ruler, Tag, Sparkles, Camera } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { EmployeeData } from "./employee-excel-upload";
import { AIPhotoMeasurement } from "@/app/components/measurement/ai-photo-measurement";

interface MeasurementEntryFormProps {
  employee: EmployeeData;
  onSave: (updatedEmployee: EmployeeData) => void;
  onCancel: () => void;
}

type FixedSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";
type SizingMode = "measurement" | "fixed";

const FIXED_SIZES: FixedSize[] = ["XS", "S", "M", "L", "XL", "XXL"];

const FIT_TYPES = [
  { key: "medium" as const, label: "Medium Fit", desc: "Standard comfortable fit" },
  { key: "loose" as const, label: "Loose Fit", desc: "Relaxed and roomy" },
  { key: "straight" as const, label: "Straight Fit", desc: "Tailored and fitted" },
];

function SectionHeader({ label, complete, completedLabel }: { label: string; complete: boolean; completedLabel?: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      {complete && (
        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
          <CheckCircle className="h-3.5 w-3.5" />
          {completedLabel || "Complete"}
        </span>
      )}
    </div>
  );
}

function ModeToggle({ mode, onMeasurement, onFixed }: { mode: SizingMode; onMeasurement: () => void; onFixed: () => void }) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
      <button
        type="button"
        onClick={onMeasurement}
        className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
          mode === "measurement" ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
        }`}
      >
        <Ruler className="h-3 w-3" />
        Custom
      </button>
      <button
        type="button"
        onClick={onFixed}
        className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors border-l border-gray-200 ${
          mode === "fixed" ? "bg-gray-900 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
        }`}
      >
        <Tag className="h-3 w-3" />
        Fixed Size
      </button>
    </div>
  );
}

function MeasurementGrid({ fields }: { fields: { label: string; value: string; setter: (v: string) => void; placeholder: string }[] }) {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full border-collapse" style={{ tableLayout: "fixed" }}>
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {fields.map((f, i) => (
              <th
                key={f.label}
                className={`py-2 px-1.5 text-center text-[10px] font-semibold text-gray-500 uppercase tracking-wide ${i < fields.length - 1 ? "border-r border-gray-200" : ""}`}
              >
                {f.label} <span className="text-gray-300 font-normal">*</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="bg-white">
            {fields.map((f, i) => (
              <td
                key={f.label}
                className={`p-0 ${i < fields.length - 1 ? "border-r border-gray-200" : ""}`}
              >
                <input
                  type="text"
                  placeholder={f.placeholder}
                  value={f.value}
                  onChange={(e) => f.setter(e.target.value)}
                  className="w-full py-2 px-1 text-xs font-mono text-center text-gray-800 bg-white focus:outline-none focus:bg-indigo-50/70 placeholder:text-gray-300 transition-colors"
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SizeGrid({ sizes, selected, onSelect }: { sizes: FixedSize[]; selected: FixedSize | ""; onSelect: (s: FixedSize) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onSelect(s)}
          className={`relative w-14 h-11 rounded-lg border text-sm font-semibold transition-all ${
            selected === s
              ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200"
              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          {s}
          {selected === s && (
            <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-indigo-600 rounded-full flex items-center justify-center">
              <CheckCircle className="h-2.5 w-2.5 text-white" strokeWidth={3} />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function MeasurementEntryForm({ employee, onSave, onCancel }: MeasurementEntryFormProps) {
  const [shirtSizingMode, setShirtSizingMode] = useState<SizingMode>("measurement");
  const [shirtFixedSize, setShirtFixedSize] = useState<FixedSize | "">(employee.shirtFixedSize || "");
  const [pantSizingMode, setPantSizingMode] = useState<SizingMode>("measurement");
  const [pantFixedSize, setPantFixedSize] = useState<FixedSize | "">(employee.pantFixedSize || "");
  const [fitType, setFitType] = useState<"medium" | "loose" | "straight">("medium");

  const [shirtLength, setShirtLength] = useState("");
  const [shoulder, setShoulder] = useState("");
  const [chest, setChest] = useState("");
  const [shirtWaist, setShirtWaist] = useState("");
  const [sleeve, setSleeve] = useState("");
  const [neck, setNeck] = useState("");
  const [front, setFront] = useState("");
  const [collar, setCollar] = useState("");
  const [cuff, setCuff] = useState("");

  const [pantLength, setPantLength] = useState("");
  const [pantWaist, setPantWaist] = useState("");
  const [hip, setHip] = useState("");
  const [thigh, setThigh] = useState("");
  const [inseam, setInseam] = useState("");
  const [round, setRound] = useState("");
  const [bottom, setBottom] = useState("");

  const [remarks, setRemarks] = useState("");
  const [showAIPhotoModal, setShowAIPhotoModal] = useState(false);

  useEffect(() => {
    if (employee.shirtSizingMode) setShirtSizingMode(employee.shirtSizingMode);
    if (employee.shirtFixedSize) setShirtFixedSize(employee.shirtFixedSize);
    if (employee.pantSizingMode) setPantSizingMode(employee.pantSizingMode);
    if (employee.pantFixedSize) setPantFixedSize(employee.pantFixedSize);
    if (employee.measurements) {
      const { shirt, pant } = employee.measurements;
      setShirtLength(shirt.length || ""); setShoulder(shirt.shoulder || ""); setChest(shirt.chest || "");
      setShirtWaist(shirt.waist || ""); setSleeve(shirt.sleeve || ""); setNeck(shirt.neck || "");
      setFront(shirt.front || ""); setCollar(shirt.collar || ""); setCuff(shirt.cuff || "");
      setPantLength(pant.length || ""); setPantWaist(pant.waist || ""); setHip(pant.hip || "");
      setThigh(pant.thigh || ""); setInseam(pant.inseam || ""); setRound(pant.round || ""); setBottom(pant.bottom || "");
    }
    if (employee.fitType) setFitType(employee.fitType);
    if (employee.remarks) setRemarks(employee.remarks);
  }, [employee]);

  const allShirtCustomFilled = shirtLength && shoulder && chest && shirtWaist && sleeve && neck && front && collar && cuff;
  const allPantCustomFilled = pantLength && pantWaist && hip && thigh && inseam && round && bottom;
  const shirtComplete = shirtSizingMode === "fixed" ? shirtFixedSize !== "" : !!allShirtCustomFilled;
  const pantComplete = pantSizingMode === "fixed" ? pantFixedSize !== "" : !!allPantCustomFilled;
  const isComplete = shirtComplete && pantComplete;

  const hasAnyEntry = shirtFixedSize !== "" || pantFixedSize !== "" ||
    shirtLength || shoulder || chest || shirtWaist || sleeve || neck || front || collar || cuff ||
    pantLength || pantWaist || hip || thigh || inseam || round || bottom;

  let status: "not-measured" | "in-progress" | "completed";
  if (isComplete) status = "completed";
  else if (hasAnyEntry) status = "in-progress";
  else status = "not-measured";

  const handleSave = () => {
    onSave({
      ...employee,
      shirtSizingMode,
      shirtFixedSize: shirtSizingMode === "fixed" ? (shirtFixedSize as FixedSize) : undefined,
      pantSizingMode,
      pantFixedSize: pantSizingMode === "fixed" ? (pantFixedSize as FixedSize) : undefined,
      measurements: {
        shirt: shirtSizingMode === "measurement"
          ? { length: shirtLength, shoulder, chest, waist: shirtWaist, sleeve, neck, front, collar, cuff }
          : { length: "", shoulder: "", chest: "", waist: "", sleeve: "", neck: "", front: "", collar: "", cuff: "" },
        pant: pantSizingMode === "measurement"
          ? { length: pantLength, waist: pantWaist, hip, thigh, inseam, round, bottom }
          : { length: "", waist: "", hip: "", thigh: "", inseam: "", round: "", bottom: "" },
      },
      fitType,
      remarks,
      measurementStatus: status,
    });
  };

  const handleAIPhotoMeasurementSave = (measurements: any) => {
    if (measurements.shirt) {
      setShirtSizingMode("measurement");
      setNeck(measurements.shirt.neck || ""); setChest(measurements.shirt.chest || "");
      setShoulder(measurements.shirt.shoulder || ""); setShirtWaist(measurements.shirt.waist || "");
      setSleeve(measurements.shirt.sleeve || ""); setShirtLength(measurements.shirt.length || "");
      setFront(measurements.shirt.front || ""); setCollar(measurements.shirt.collar || ""); setCuff(measurements.shirt.cuff || "");
    }
    if (measurements.pant) {
      setPantSizingMode("measurement");
      setPantWaist(measurements.pant.waist || ""); setHip(measurements.pant.hip || "");
      setPantLength(measurements.pant.length || ""); setThigh(measurements.pant.thigh || "");
      setInseam(measurements.pant.inseam || ""); setRound(measurements.pant.round || ""); setBottom(measurements.pant.bottom || "");
    }
    setShowAIPhotoModal(false);
  };

  const shirtFields = [
    { label: "Length", value: shirtLength, setter: setShirtLength, placeholder: "30" },
    { label: "Shoulder", value: shoulder, setter: setShoulder, placeholder: "17.5" },
    { label: "Chest", value: chest, setter: setChest, placeholder: "40" },
    { label: "Waist", value: shirtWaist, setter: setShirtWaist, placeholder: "36" },
    { label: "Sleeve", value: sleeve, setter: setSleeve, placeholder: "34" },
    { label: "Neck", value: neck, setter: setNeck, placeholder: "15.5" },
    { label: "Front", value: front, setter: setFront, placeholder: "18" },
    { label: "Collar", value: collar, setter: setCollar, placeholder: "16" },
    { label: "Cuff", value: cuff, setter: setCuff, placeholder: "10" },
  ];

  const pantFields = [
    { label: "Length", value: pantLength, setter: setPantLength, placeholder: "42" },
    { label: "Waist", value: pantWaist, setter: setPantWaist, placeholder: "34" },
    { label: "Hip", value: hip, setter: setHip, placeholder: "40" },
    { label: "Thigh", value: thigh, setter: setThigh, placeholder: "24" },
    { label: "Inseam", value: inseam, setter: setInseam, placeholder: "32" },
    { label: "Round", value: round, setter: setRound, placeholder: "30" },
    { label: "Bottom", value: bottom, setter: setBottom, placeholder: "35" },
  ];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="w-full max-w-3xl my-8 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Measurement Entry</h2>
              <p className="text-xs text-gray-400 mt-0.5">Custom measurements or fixed size per garment</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAIPhotoModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <Camera className="h-3.5 w-3.5" />
                AI Measure
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1">

            {/* Employee Info */}
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-x-6 gap-y-2 text-xs">
                {[
                  { label: "Serial No", value: employee.uniqueSerialNumber, accent: true },
                  { label: "Employee ID", value: employee.employeeId },
                  { label: "Name", value: employee.employeeName },
                  { label: "Branch", value: employee.branch },
                  { label: "Status", value: employee.measurementStatus.replace("-", " ") },
                ].map(({ label, value, accent }) => (
                  <div key={label}>
                    <p className="text-gray-400 mb-0.5">{label}</p>
                    <p className={`font-semibold truncate ${accent ? "text-indigo-600 font-mono" : "text-gray-900"}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="px-6 py-2 border-b border-gray-100 flex items-center gap-3">
              <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${isComplete ? "bg-emerald-500" : hasAnyEntry ? "bg-indigo-400" : "bg-gray-200"}`}
                  style={{ width: isComplete ? "100%" : hasAnyEntry ? (shirtComplete ? "66%" : pantComplete ? "33%" : "10%") : "0%" }}
                />
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wide shrink-0 ${isComplete ? "text-emerald-600" : hasAnyEntry ? "text-indigo-500" : "text-gray-400"}`}>
                {isComplete ? "Complete" : hasAnyEntry ? "In Progress" : "Not Started"}
              </span>
            </div>

            {/* Fit Type */}
            <div className="border-b border-gray-100">
              <SectionHeader label="Fit Type" complete={false} />
              <div className="px-5 py-4 grid grid-cols-3 gap-3">
                {FIT_TYPES.map((fit) => (
                  <button
                    key={fit.key}
                    type="button"
                    onClick={() => setFitType(fit.key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      fitType === fit.key
                        ? "border-indigo-600 bg-indigo-50 ring-2 ring-indigo-100"
                        : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <p className={`text-sm font-semibold ${fitType === fit.key ? "text-indigo-700" : "text-gray-800"}`}>{fit.label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{fit.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Shirt Section */}
            <div className="border-b border-gray-100">
              <SectionHeader
                label="Shirt Measurements (inches)"
                complete={shirtComplete}
                completedLabel={shirtSizingMode === "fixed" ? `Fixed ${shirtFixedSize}` : "Complete"}
              />
              <div className="px-5 pt-4 pb-1 space-y-4">
                <ModeToggle
                  mode={shirtSizingMode}
                  onMeasurement={() => setShirtSizingMode("measurement")}
                  onFixed={() => setShirtSizingMode("fixed")}
                />
              </div>
              {shirtSizingMode === "measurement" ? (
                <div className="px-5 pb-4">
                  <MeasurementGrid fields={shirtFields} />
                </div>
              ) : (
                <div className="px-5 pb-5 space-y-3">
                  <p className="text-xs text-gray-400">Select a standard shirt size</p>
                  <SizeGrid sizes={FIXED_SIZES} selected={shirtFixedSize} onSelect={setShirtFixedSize} />
                </div>
              )}
            </div>

            {/* Pant Section */}
            <div className="border-b border-gray-100">
              <SectionHeader
                label="Pant Measurements (inches)"
                complete={pantComplete}
                completedLabel={pantSizingMode === "fixed" ? `Fixed ${pantFixedSize}` : "Complete"}
              />
              <div className="px-5 pt-4 pb-1 space-y-4">
                <ModeToggle
                  mode={pantSizingMode}
                  onMeasurement={() => setPantSizingMode("measurement")}
                  onFixed={() => setPantSizingMode("fixed")}
                />
              </div>
              {pantSizingMode === "measurement" ? (
                <div className="px-5 pb-4">
                  <MeasurementGrid fields={pantFields} />
                </div>
              ) : (
                <div className="px-5 pb-5 space-y-3">
                  <p className="text-xs text-gray-400">Select a standard pant size</p>
                  <SizeGrid sizes={FIXED_SIZES} selected={pantFixedSize} onSelect={setPantFixedSize} />
                </div>
              )}
            </div>

            {/* Remarks */}
            <div className="px-5 py-4">
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-2">Remarks (optional)</label>
              <Textarea
                placeholder="Add special instructions or notes..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={2}
                className="text-sm resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white shrink-0">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${shirtComplete ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-gray-100 text-gray-400"}`}>
                  Shirt {shirtComplete ? (shirtSizingMode === "fixed" ? shirtFixedSize : "✓") : "—"}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${pantComplete ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-gray-100 text-gray-400"}`}>
                  Pant {pantComplete ? (pantSizingMode === "fixed" ? pantFixedSize : "✓") : "—"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Save className="h-4 w-4" />
                Save Measurements
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAIPhotoModal && (
        <AIPhotoMeasurement
          employeeData={{
            employeeId: employee.employeeId,
            employeeName: employee.employeeName,
            uniqueSerialNumber: employee.uniqueSerialNumber,
            branch: employee.branch,
            department: employee.department,
            designation: employee.designation,
          }}
          onClose={() => setShowAIPhotoModal(false)}
          onSave={handleAIPhotoMeasurementSave}
        />
      )}
    </>
  );
}
