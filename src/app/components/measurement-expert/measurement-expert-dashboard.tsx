import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Plus,
  ClipboardList,
  User,
  Users,
  Shirt,
  ArrowLeft,
  CheckCircle,
  Hash,
  Search,
  Filter,
  Edit,
  Download,
  FileSpreadsheet,
  Clock,
  AlertCircle,
  X,
  FileText,
  Eye,
  Package,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/app/components/ui/alert";
import { Separator } from "@/app/components/ui/separator";
import { MeasurementEntryForm } from "../measurement-system/measurement-entry-form";
import { EmployeeData } from "../measurement-system/employee-excel-upload";

// ── Types ──────────────────────────────────────────────────────────────────

type UniformType = "shirt_only" | "pant_only" | "both" | "tshirt_only";

interface MeasurementSession {
  id: string;
  poNumber: string;
  clientName: string;
  totalEmployee: number;
  uniformType: UniformType;
  shirtPerPerson: number;
  pantPerPerson: number;
  additionalInfo: string;
  createdAt: string;
  totalPieces: number;
  employeesUploaded: number;
}

// ── Storage helpers ────────────────────────────────────────────────────────

const SESSIONS_KEY = "measurement_sessions";
const employeesKey = (id: string) => `measurement_employees_${id}`;

function loadSessions(): MeasurementSession[] {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) || "[]"); } catch { return []; }
}
function saveSessions(s: MeasurementSession[]) {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(s));
}
function loadEmployees(sessionId: string): EmployeeData[] {
  try { return JSON.parse(localStorage.getItem(employeesKey(sessionId)) || "[]"); } catch { return []; }
}
function saveEmployees(sessionId: string, employees: EmployeeData[]) {
  localStorage.setItem(employeesKey(sessionId), JSON.stringify(employees));
}

// ── Helpers ────────────────────────────────────────────────────────────────

const UNIFORM_OPTIONS: { value: UniformType; label: string }[] = [
  { value: "shirt_only", label: "Shirt Only" },
  { value: "pant_only", label: "Pant Only" },
  { value: "both", label: "Both" },
  { value: "tshirt_only", label: "T-Shirt Only" },
];

function uniformLabel(type: UniformType) {
  return UNIFORM_OPTIONS.find((o) => o.value === type)?.label ?? type;
}

function uniformBadgeColor(type: UniformType) {
  const map: Record<UniformType, string> = {
    shirt_only: "bg-blue-100 text-blue-700",
    pant_only: "bg-purple-100 text-purple-700",
    both: "bg-green-100 text-green-700",
    tshirt_only: "bg-orange-100 text-orange-700",
  };
  return map[type];
}

function calcTotalPieces(type: UniformType, total: number, shirt: number, pant: number) {
  if (type === "shirt_only" || type === "tshirt_only") return total * shirt;
  if (type === "pant_only") return total * pant;
  return total * (shirt + pant);
}

// ── Stage 1: Sessions List ─────────────────────────────────────────────────

function SessionsList({
  sessions,
  onNew,
  onOpen,
}: {
  sessions: MeasurementSession[];
  onNew: () => void;
  onOpen: (s: MeasurementSession) => void;
}) {
  const [search, setSearch] = useState("");

  const totalEmployees = sessions.reduce((a, s) => a + s.totalEmployee, 0);
  const totalPieces = sessions.reduce((a, s) => a + s.totalPieces, 0);
  const totalUploaded = sessions.reduce((a, s) => a + (s.employeesUploaded || 0), 0);

  const filtered = sessions.filter((s) =>
    s.clientName.toLowerCase().includes(search.toLowerCase()) ||
    s.poNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h1 className="text-sm font-semibold text-gray-900">Measurement Sessions</h1>
            <p className="text-xs text-gray-400 mt-0.5">{sessions.length} session{sessions.length !== 1 ? "s" : ""} total</p>
          </div>
          <button
            onClick={onNew}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Measurement
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 divide-x divide-gray-100 px-6 py-3">
          {[
            { label: "Total Employees", value: totalEmployees, color: "text-indigo-600" },
            { label: "Total Pieces", value: totalPieces, color: "text-emerald-600" },
            { label: "Employees Uploaded", value: totalUploaded, color: "text-amber-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="px-4 first:pl-0 last:pr-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
              <p className={`text-lg font-bold mt-0.5 ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Search bar */}
        <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-4 h-4 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by client name or PO number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-300"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <ClipboardList className="w-10 h-10 text-gray-200" />
            <p className="text-sm font-medium text-gray-400">
              {search ? "No sessions match your search" : "No measurement sessions yet"}
            </p>
            {!search && (
              <button
                onClick={onNew}
                className="text-xs text-indigo-600 hover:underline"
              >
                Create your first session →
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-6 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Client / PO</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Uniform</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Employees</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Pieces</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Uploaded</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Created</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((s) => {
                const uploadedPct = s.totalEmployee > 0
                  ? Math.round(((s.employeesUploaded || 0) / s.totalEmployee) * 100)
                  : 0;
                return (
                  <tr
                    key={s.id}
                    className="hover:bg-gray-50/60 cursor-pointer transition-colors group"
                    onClick={() => onOpen(s)}
                  >
                    {/* Client / PO */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900 leading-tight">{s.clientName}</p>
                      <p className="text-xs font-mono text-gray-400 mt-0.5">#{s.poNumber}</p>
                    </td>

                    {/* Uniform badge */}
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${uniformBadgeColor(s.uniformType)}`}>
                        {uniformLabel(s.uniformType)}
                      </span>
                    </td>

                    {/* Employees */}
                    <td className="px-4 py-4 text-center">
                      <span className="font-semibold text-gray-900">{s.totalEmployee}</span>
                    </td>

                    {/* Pieces */}
                    <td className="px-4 py-4 text-center">
                      <span className="font-semibold text-gray-900">{s.totalPieces}</span>
                    </td>

                    {/* Uploaded with progress */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-semibold text-gray-700">
                          {s.employeesUploaded || 0}
                          <span className="text-gray-400 font-normal"> / {s.totalEmployee}</span>
                        </span>
                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${uploadedPct === 100 ? "bg-emerald-500" : uploadedPct > 0 ? "bg-indigo-400" : "bg-gray-200"}`}
                            style={{ width: `${uploadedPct}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4">
                      <span className="text-xs text-gray-500">
                        {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                      </span>
                    </td>

                    {/* Arrow */}
                    <td className="px-6 py-4">
                      <span className="text-gray-300 group-hover:text-indigo-400 transition-colors text-lg font-light">→</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ── Stage 2: New Measurement Form ──────────────────────────────────────────

interface FormState {
  poNumber: string;
  clientName: string;
  totalEmployee: string;
  uniformType: UniformType;
  shirtPerPerson: string;
  pantPerPerson: string;
  additionalInfo: string;
}

const BLANK: FormState = {
  poNumber: "",
  clientName: "",
  totalEmployee: "",
  uniformType: "both",
  shirtPerPerson: "1",
  pantPerPerson: "1",
  additionalInfo: "",
};

function NewMeasurementForm({
  onBack,
  onSaved,
}: {
  onBack: () => void;
  onSaved: (session: MeasurementSession) => void;
}) {
  const [form, setForm] = useState<FormState>(BLANK);
  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const needsShirt = form.uniformType !== "pant_only";
  const needsPant = form.uniformType !== "shirt_only" && form.uniformType !== "tshirt_only";

  const totalPieces = calcTotalPieces(
    form.uniformType,
    Number(form.totalEmployee) || 0,
    Number(form.shirtPerPerson) || 0,
    Number(form.pantPerPerson) || 0
  );

  const isValid = form.poNumber.trim() && form.clientName.trim() && Number(form.totalEmployee) > 0;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    const session: MeasurementSession = {
      id: `meas_${Date.now()}`,
      poNumber: form.poNumber.trim(),
      clientName: form.clientName.trim(),
      totalEmployee: Number(form.totalEmployee),
      uniformType: form.uniformType,
      shirtPerPerson: Number(form.shirtPerPerson) || 0,
      pantPerPerson: Number(form.pantPerPerson) || 0,
      additionalInfo: form.additionalInfo.trim(),
      createdAt: new Date().toISOString(),
      totalPieces,
      employeesUploaded: 0,
    };
    const existing = loadSessions();
    saveSessions([session, ...existing]);
    onSaved(session);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">

      {/* Page header */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-sm font-semibold text-gray-900">New Measurement Session</h1>
          <p className="text-xs text-gray-400 mt-0.5">Fill in the details to start</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Order Details */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Order Details</p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">PO Number <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <Input id="poNumber" placeholder="e.g. PO-2024-001" value={form.poNumber} onChange={set("poNumber")} className="pl-9 text-sm" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Client Name <span className="text-red-400">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <Input id="clientName" placeholder="Company or individual name" value={form.clientName} onChange={set("clientName")} className="pl-9 text-sm" required />
                </div>
              </div>
            </div>
            <div className="space-y-1.5 max-w-[220px]">
              <label className="text-xs font-medium text-gray-600">Total Employees <span className="text-red-400">*</span></label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <Input id="totalEmployee" type="number" min={1} placeholder="Number of employees" value={form.totalEmployee} onChange={set("totalEmployee")} className="pl-9 text-sm" required />
              </div>
            </div>
          </div>
        </div>

        {/* Uniform Type */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Uniform Type</p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {UNIFORM_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, uniformType: opt.value }))}
                  className={`py-2 px-3 rounded-lg border text-sm font-medium transition-all ${
                    form.uniformType === opt.value
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-100"
                      : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {needsShirt && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">{form.uniformType === "tshirt_only" ? "T-Shirt" : "Shirt"} per Person</label>
                  <Input type="number" min={0} value={form.shirtPerPerson} onChange={set("shirtPerPerson")} className="text-sm" />
                </div>
              )}
              {needsPant && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600">Pant per Person</label>
                  <Input type="number" min={0} value={form.pantPerPerson} onChange={set("pantPerPerson")} className="text-sm" />
                </div>
              )}
            </div>

            {Number(form.totalEmployee) > 0 && (
              <div className="flex items-center gap-2 text-sm bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2.5">
                <span className="text-gray-500 text-xs">Estimated total pieces:</span>
                <span className="font-semibold text-indigo-700">{totalPieces}</span>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-100">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Additional Information</p>
          </div>
          <div className="px-6 py-5">
            <Textarea
              placeholder="Special instructions, notes, or any additional details..."
              value={form.additionalInfo}
              onChange={set("additionalInfo")}
              rows={3}
              className="resize-none text-sm"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={onBack} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={!isValid} className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg transition-colors">
            Next: Upload Employees →
          </button>
        </div>
      </form>
    </div>
  );
}

// ── Stage 3: Employee Upload ───────────────────────────────────────────────

function EmployeeUploadScreen({
  session,
  onBack,
  onUploaded,
}: {
  session: MeasurementSession;
  onBack: () => void;
  onUploaded: (employees: EmployeeData[]) => void;
}) {
  const defaultPrefix = session.clientName.replace(/\s+/g, "").substring(0, 3).toUpperCase() || "EMP";
  const [serialPrefix, setSerialPrefix] = useState(defaultPrefix);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "parsing" | "preview" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [parsedEmployees, setParsedEmployees] = useState<EmployeeData[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setStatus("idle"); setErrorMessage(""); setParsedEmployees([]); }
  };

  const parseFile = () => {
    if (!file) return;
    setStatus("parsing");
    setErrorMessage("");
    const reader = new FileReader();
    const isCSV = file.name.toLowerCase().endsWith(".csv");

    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = isCSV
          ? XLSX.read(data, { type: "string", raw: false, codepage: 65001 })
          : XLSX.read(data, { type: "binary" });

        if (!workbook.SheetNames?.length) {
          setStatus("error"); setErrorMessage("File has no sheets."); return;
        }
        const ws = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "", raw: false, blankrows: false }) as any[][];

        if (!jsonData || jsonData.length < 2) {
          setStatus("error"); setErrorMessage("File has no data rows. Make sure row 1 has headers and row 2+ has employee data."); return;
        }

        const headers = jsonData[0].map((h: any) => String(h).trim().toUpperCase());
        const findCol = (name: string) => {
          const n = name.replace(/\s+/g, "").toUpperCase();
          return headers.findIndex((h: string) => { const nh = h.replace(/\s+/g, ""); return nh === n || nh.includes(n) || n.includes(nh); });
        };

        const srNoIdx = findCol("SRNO") !== -1 ? findCol("SRNO") : findCol("SR NO");
        const empIdIdx = findCol("EMPLOYEEID") !== -1 ? findCol("EMPLOYEEID") : findCol("EMPLOYEE ID");
        const nameIdx = findCol("NAME");
        const deptIdx = findCol("DEPT") !== -1 ? findCol("DEPT") : findCol("DEPARTMENT");

        const missing: string[] = [];
        if (srNoIdx === -1) missing.push("SR NO");
        if (empIdIdx === -1) missing.push("Employee ID");
        if (nameIdx === -1) missing.push("NAME");
        if (deptIdx === -1) missing.push("DEPT");

        if (missing.length > 0) {
          setStatus("error");
          setErrorMessage(`Missing columns: ${missing.join(", ")}\n\nYour columns: ${headers.join(", ")}\n\nRequired: SR NO, Employee ID, NAME, DEPT`);
          return;
        }

        const prefix = serialPrefix.trim().toUpperCase() || defaultPrefix;
        const employees: EmployeeData[] = jsonData.slice(1)
          .filter((row) => row?.length > 0 && (row[srNoIdx] || row[nameIdx]))
          .map((row, idx) => {
            const srNo = parseInt(String(row[srNoIdx] || idx + 1)) || idx + 1;
            return {
              srNo,
              employeeId: String(row[empIdIdx] || "").trim(),
              employeeName: String(row[nameIdx] || "").trim(),
              department: String(row[deptIdx] || "").trim(),
              branch: String(row[deptIdx] || "").trim(),
              uniqueSerialNumber: `${prefix}${String(srNo).padStart(3, "0")}`,
              poId: session.id,
              poNumber: session.poNumber,
              measurementStatus: "not-measured" as const,
              measurements: {
                shirt: { length: "", shoulder: "", chest: "", waist: "", sleeve: "", neck: "", front: "", collar: "", cuff: "" },
                pant: { length: "", waist: "", hip: "", thigh: "", inseam: "", round: "", bottom: "" },
              },
              shirtSizingMode: "measurement" as const,
              pantSizingMode: "measurement" as const,
            };
          });

        if (employees.length === 0) {
          setStatus("error"); setErrorMessage("No valid employee rows found."); return;
        }
        setParsedEmployees(employees);
        setStatus("preview");
      } catch (err) {
        setStatus("error");
        setErrorMessage(`Failed to parse file: ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    };

    reader.onerror = () => { setStatus("error"); setErrorMessage("Failed to read file."); };
    isCSV ? reader.readAsText(file) : reader.readAsBinaryString(file);
  };

  const downloadSampleXLSX = () => {
    const headers = ["SR NO", "Employee ID", "NAME", "DEPT"];
    const rows = [
      [1,"EMP001","Rajesh Kumar","Production"],
      [2,"EMP002","Priya Sharma","Quality Control"],
      [3,"EMP003","Amit Singh","Cutting"],
      [4,"EMP004","Sneha Patel","Stitching"],
      [5,"EMP005","Vikram Rao","Finishing"],
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws["!cols"] = [{ wch: 8 }, { wch: 14 }, { wch: 22 }, { wch: 18 }];
    XLSX.utils.book_append_sheet(wb, ws, "Employees");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Sample_Employees_${session.poNumber}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleConfirm = () => onUploaded(parsedEmployees);

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-6 py-4 flex items-center gap-3">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-gray-900">Upload Employee List</h1>
          <p className="text-xs text-gray-400 mt-0.5">{session.poNumber} — {session.clientName}</p>
        </div>
        <div className="hidden md:flex gap-6 text-xs">
          {[["PO", session.poNumber], ["Client", session.clientName], ["Employees", String(session.totalEmployee)], ["Uniform", uniformLabel(session.uniformType)]].map(([l, v]) => (
            <div key={l}>
              <p className="text-gray-400">{l}</p>
              <p className="font-semibold text-gray-900 truncate max-w-[100px]">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {status === "error" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle className="text-red-900">Error</AlertTitle>
          <AlertDescription className="text-red-700 whitespace-pre-line">{errorMessage}</AlertDescription>
        </Alert>
      )}

      {/* Step 1: Download sample */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-sm">1</span>
          </div>
          <h3 className="font-semibold text-lg">Download Sample File</h3>
        </div>
        <Separator className="mb-4" />
        <p className="text-sm text-muted-foreground mb-4">
          Required columns: <strong>SR NO, Employee ID, NAME, DEPT</strong>
        </p>
        <Button onClick={downloadSampleXLSX} className="bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4 mr-2" /> Download Sample (.xlsx)
        </Button>
        <div className="mt-4 overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["SR NO", "Employee ID", "NAME", "DEPT"].map((h) => (
                  <th key={h} className="text-left p-2.5 font-semibold text-xs text-gray-600">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {[[1,"EMP001","Rajesh Kumar","Production"],[2,"EMP002","Priya Sharma","QC"],[3,"EMP003","Amit Singh","Cutting"]].map((r, i) => (
                <tr key={i} className="border-t">
                  {r.map((c, j) => <td key={j} className="p-2.5 font-mono text-xs">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Step 2: Upload */}
      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-bold text-sm">2</span>
          </div>
          <h3 className="font-semibold text-lg">Upload Employee File</h3>
        </div>
        <Separator className="mb-4" />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="font-semibold">
              Unique Serial Prefix *
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                Serials will be like: {(serialPrefix.trim().toUpperCase() || defaultPrefix)}001, 002, ...
              </span>
            </Label>
            <Input
              value={serialPrefix}
              onChange={(e) => {
                const val = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                setSerialPrefix(val);
                if (parsedEmployees.length > 0) {
                  const p = val.trim() || defaultPrefix;
                  setParsedEmployees((prev) =>
                    prev.map((emp) => ({ ...emp, uniqueSerialNumber: `${p}${String(emp.srNo).padStart(3, "0")}` }))
                  );
                }
              }}
              placeholder={defaultPrefix}
              maxLength={10}
              className="w-40 font-mono font-semibold uppercase tracking-widest"
            />
          </div>

          <div className="space-y-2">
            <Label>Select File (.xlsx, .xls, or .csv)</Label>
            <Input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileSelect} disabled={status === "parsing"} />
          </div>

          {file && status === "idle" && (
            <Alert className="border-blue-200 bg-blue-50">
              <FileSpreadsheet className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900">File Selected</AlertTitle>
              <AlertDescription className="text-blue-700">
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button onClick={parseFile} disabled={!file || status === "parsing" || status === "preview"} className="min-w-[180px]">
              {status === "parsing" ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" /> Parsing...</>
              ) : (
                <><Eye className="h-4 w-4 mr-2" /> Parse & Preview</>
              )}
            </Button>
            {status === "error" && (
              <Button variant="outline" onClick={() => { setStatus("idle"); setErrorMessage(""); }}>Try Again</Button>
            )}
          </div>
        </div>
      </Card>

      {/* Step 3: Preview & confirm */}
      {status === "preview" && parsedEmployees.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Parsed — {parsedEmployees.length} Employees</h3>
              <p className="text-sm text-muted-foreground">Review and confirm to proceed to measurement</p>
            </div>
          </div>
          <Separator className="mb-4" />

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-indigo-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-indigo-600">{parsedEmployees.length}</p>
              <p className="text-xs text-muted-foreground">Employees</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{(serialPrefix.trim().toUpperCase() || defaultPrefix)}XXX</p>
              <p className="text-xs text-muted-foreground">Serial Format</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">16</p>
              <p className="text-xs text-muted-foreground">Measurement Fields</p>
            </div>
          </div>

          <div className="overflow-x-auto border rounded-lg max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {["SR NO", "Employee ID", "Name", "Department", "Unique Serial", "Status"].map((h) => (
                    <th key={h} className="text-left p-3 font-semibold text-xs text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedEmployees.map((emp) => (
                  <tr key={emp.uniqueSerialNumber} className="border-t hover:bg-gray-50">
                    <td className="p-3">{emp.srNo}</td>
                    <td className="p-3 font-mono text-xs">{emp.employeeId}</td>
                    <td className="p-3 font-medium">{emp.employeeName}</td>
                    <td className="p-3">{emp.department}</td>
                    <td className="p-3"><span className="font-mono font-semibold text-indigo-600">{emp.uniqueSerialNumber}</span></td>
                    <td className="p-3">
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300 text-xs">Not Measured</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center pt-4 mt-4 border-t">
            <Button variant="outline" onClick={() => { setStatus("idle"); setParsedEmployees([]); setFile(null); }}>
              Upload Different File
            </Button>
            <Button onClick={handleConfirm} size="lg" className="min-w-[280px] bg-indigo-600 hover:bg-indigo-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              Confirm & Start Measuring ({parsedEmployees.length} employees)
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Stage 4: Measurement View ──────────────────────────────────────────────

function MeasurementView({
  session,
  employees: initialEmployees,
  onBack,
  onEmployeesChanged,
}: {
  session: MeasurementSession;
  employees: EmployeeData[];
  onBack: () => void;
  onEmployeesChanged: (employees: EmployeeData[]) => void;
}) {
  const [employees, setEmployees] = useState<EmployeeData[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "not-measured" | "in-progress" | "completed">("all");
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeData | null>(null);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const filtered = employees.filter((emp) => {
    const matchesSearch =
      emp.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.uniqueSerialNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || emp.measurementStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: employees.length,
    completed: employees.filter((e) => e.measurementStatus === "completed").length,
    inProgress: employees.filter((e) => e.measurementStatus === "in-progress").length,
    notMeasured: employees.filter((e) => e.measurementStatus === "not-measured").length,
  };

  const progressPercent = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  const getStatusBadge = (status: string) => {
    const cfg: Record<string, { bg: string; text: string; label: string }> = {
      "not-measured": { bg: "bg-gray-100", text: "text-gray-700", label: "Not Measured" },
      "in-progress":  { bg: "bg-yellow-100", text: "text-yellow-700", label: "In Progress" },
      "completed":    { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
    };
    const c = cfg[status] ?? cfg["not-measured"];
    return <span className={`px-2 py-1 rounded text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
  };

  const handleSaveMeasurement = (updated: EmployeeData) => {
    const next = employees.map((e) => e.uniqueSerialNumber === updated.uniqueSerialNumber ? updated : e);
    setEmployees(next);
    saveEmployees(session.id, next);
    onEmployeesChanged(next);
    setSelectedEmployee(null);
  };

  const downloadFilteredSheet = (filter: "all" | "completed" | "in-progress" | "not-measured") => {
    const list = filter === "all" ? employees : employees.filter((e) => e.measurementStatus === filter);
    const filterLabel = { all: "All", completed: "Completed", "in-progress": "InProgress", "not-measured": "NotMeasured" }[filter];

    const mainHeader = ["Serial No", "Employee ID", "Employee Name", "Branch",
      "SHIRT","","","","","","","","",
      "PANT","","","","","","",
      "Status"];
    const subHeader = ["","","","",
      "Length","Shoulder","Chest","Waist","Sleeve","Neck","Front","Collar","Cuff",
      "Length","Waist","Hip","Thigh","Inseam","Round","Bottom",
      ""];

    const rows = list.map((emp) => {
      const shirt = emp.measurements?.shirt || {};
      const pant = emp.measurements?.pant || {};
      const shirtVals = emp.shirtSizingMode === "fixed" && emp.shirtFixedSize
        ? [emp.shirtFixedSize,"","","","","","","",""]
        : [shirt.length||"",shirt.shoulder||"",shirt.chest||"",shirt.waist||"",shirt.sleeve||"",shirt.neck||"",shirt.front||"",shirt.collar||"",shirt.cuff||""];
      const pantVals = emp.pantSizingMode === "fixed" && emp.pantFixedSize
        ? [emp.pantFixedSize,"","","","","",""]
        : [pant.length||"",pant.waist||"",pant.hip||"",pant.thigh||"",pant.inseam||"",pant.round||"",pant.bottom||""];
      return [emp.uniqueSerialNumber, emp.employeeId, emp.employeeName, emp.branch||"", ...shirtVals, ...pantVals, emp.measurementStatus];
    });

    const csv = [
      [`${session.clientName.toUpperCase()} - MEASUREMENT SHEET`],
      [`PO: ${session.poNumber} | Filter: ${filterLabel} | Total: ${list.length}`],
      [`Generated: ${new Date().toLocaleString()}`],
      [],
      mainHeader,
      subHeader,
      ...rows,
    ].map((row) => row.map((c) => {
      const s = String(c);
      return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Measurements_${session.poNumber}_${filterLabel}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    setShowDownloadOptions(false);
  };

  return (
    <div className="space-y-4">
      {/* Header card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-gray-900">{session.clientName}</h1>
              <p className="text-xs font-mono text-gray-400">#{session.poNumber}</p>
            </div>
            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${uniformBadgeColor(session.uniformType)}`}>
              {uniformLabel(session.uniformType)}
            </span>
          </div>
          <button
            onClick={() => setShowDownloadOptions(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
          >
            <Download className="h-4 w-4" /> Export
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-4 divide-x divide-gray-100 px-6 py-3">
          {[
            { label: "Total", value: stats.total, color: "text-gray-900" },
            { label: "Completed", value: stats.completed, color: "text-emerald-600" },
            { label: "In Progress", value: stats.inProgress, color: "text-amber-600" },
            { label: "Pending", value: stats.notMeasured, color: "text-gray-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="px-4 first:pl-0 last:pr-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</p>
              <p className={`text-lg font-bold mt-0.5 ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
            <span>Progress</span>
            <span className="font-semibold text-gray-700">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Search & filter */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm px-5 py-3 flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            placeholder="Search by name, employee ID, or serial number…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 text-sm text-gray-700 bg-transparent outline-none placeholder:text-gray-300"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["all","not-measured","in-progress","completed"] as const).map((f) => {
            const count = f === "all" ? stats.total : f === "not-measured" ? stats.notMeasured : f === "in-progress" ? stats.inProgress : stats.completed;
            const label = f === "all" ? "All" : f === "not-measured" ? "Pending" : f === "in-progress" ? "In Progress" : "Done";
            return (
              <button
                key={f}
                onClick={() => setStatusFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === f
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Employee table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th rowSpan={2} className="text-left px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 bg-gray-50 border-b border-r border-gray-200 whitespace-nowrap">Serial No</th>
                <th rowSpan={2} className="text-left px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 bg-gray-50 border-b border-r border-gray-200 whitespace-nowrap">Emp ID</th>
                <th rowSpan={2} className="text-left px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 bg-gray-50 border-b border-r border-gray-200 whitespace-nowrap">Name</th>
                <th rowSpan={2} className="text-left px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 bg-gray-50 border-b border-r border-gray-200 whitespace-nowrap">Branch</th>
                <th colSpan={9} className="text-center px-3 py-2 text-[10px] font-bold bg-indigo-50 border-b border-r border-gray-200 text-indigo-600 uppercase tracking-wider">Shirt Measurements</th>
                <th colSpan={7} className="text-center px-3 py-2 text-[10px] font-bold bg-sky-50 border-b border-r border-gray-200 text-sky-600 uppercase tracking-wider">Pant Measurements</th>
                <th rowSpan={2} className="text-left px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 bg-gray-50 border-b border-r border-gray-200 whitespace-nowrap">Status</th>
                <th rowSpan={2} className="text-left px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-500 bg-gray-50 border-b border-gray-200 whitespace-nowrap">Action</th>
              </tr>
              <tr>
                {["Length","Shoulder","Chest","Waist","Sleeve","Neck","Front","Collar","Cuff"].map((h) => (
                  <th key={h} className="text-center px-2 py-2 text-[10px] font-medium text-indigo-500 bg-indigo-50/60 border-b border-r border-gray-200 min-w-[52px] whitespace-nowrap">{h}</th>
                ))}
                {["Length","Waist","Hip","Thigh","Inseam","Round","Bottom"].map((h) => (
                  <th key={h} className="text-center px-2 py-2 text-[10px] font-medium text-sky-500 bg-sky-50/60 border-b border-r border-gray-200 min-w-[52px] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={22} className="py-12 text-center text-sm text-gray-400">No employees found</td>
                </tr>
              ) : (
                filtered.map((emp) => {
                  const sm = emp.measurements?.shirt || {};
                  const pm = emp.measurements?.pant || {};
                  const shirtFixed = emp.shirtSizingMode === "fixed" && emp.shirtFixedSize;
                  const pantFixed = emp.pantSizingMode === "fixed" && emp.pantFixedSize;
                  const cell = "px-2 py-2.5 text-xs text-center border-r border-gray-100";
                  return (
                    <tr key={emp.uniqueSerialNumber} className="border-t border-gray-100 hover:bg-gray-50/60 transition-colors">
                      <td className="px-3 py-2.5 border-r border-gray-100">
                        <span className="text-xs font-mono font-semibold text-indigo-600">{emp.uniqueSerialNumber}</span>
                      </td>
                      <td className="px-3 py-2.5 text-xs font-medium text-gray-700 border-r border-gray-100">{emp.employeeId}</td>
                      <td className="px-3 py-2.5 border-r border-gray-100">
                        <button onClick={() => setSelectedEmployee(emp)} className="text-xs font-medium text-gray-900 hover:text-indigo-600 transition-colors text-left whitespace-nowrap">
                          {emp.employeeName}
                        </button>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-gray-500 border-r border-gray-100 whitespace-nowrap">{emp.branch}</td>

                      {shirtFixed ? (
                        <td colSpan={9} className="px-3 py-2.5 text-xs text-center border-r border-gray-100 bg-indigo-50/40">
                          <span className="font-semibold text-indigo-600">Fixed: {emp.shirtFixedSize}</span>
                        </td>
                      ) : (
                        [sm.length,sm.shoulder,sm.chest,sm.waist,sm.sleeve,sm.neck,sm.front,sm.collar,sm.cuff].map((v, i) => (
                          <td key={i} className={`${cell} text-gray-700 bg-indigo-50/20 font-mono`}>{v || <span className="text-gray-200">—</span>}</td>
                        ))
                      )}

                      {pantFixed ? (
                        <td colSpan={7} className="px-3 py-2.5 text-xs text-center border-r border-gray-100 bg-sky-50/40">
                          <span className="font-semibold text-sky-600">Fixed: {emp.pantFixedSize}</span>
                        </td>
                      ) : (
                        [pm.length,pm.waist,pm.hip,pm.thigh,pm.inseam,pm.round,pm.bottom].map((v, i) => (
                          <td key={i} className={`${cell} text-gray-700 bg-sky-50/20 font-mono`}>{v || <span className="text-gray-200">—</span>}</td>
                        ))
                      )}

                      <td className="px-3 py-2.5 border-r border-gray-100">{getStatusBadge(emp.measurementStatus)}</td>
                      <td className="px-3 py-2.5">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                        >
                          <Edit className="h-3 w-3" />
                          {emp.measurementStatus === "completed" ? "Edit" : "Enter"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Measurement entry modal */}
      {selectedEmployee && (
        <MeasurementEntryForm
          employee={selectedEmployee}
          onSave={handleSaveMeasurement}
          onCancel={() => setSelectedEmployee(null)}
        />
      )}

      {/* Download options modal */}
      {showDownloadOptions && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl bg-white shadow-2xl">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-lg"><Download className="h-6 w-6 text-green-600" /></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Download Measurement Sheet</h3>
                    <p className="text-sm text-muted-foreground">Select employees by status</p>
                  </div>
                </div>
                <Button variant="outline" size="icon" onClick={() => setShowDownloadOptions(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {([
                  { f: "all", icon: FileSpreadsheet, label: "Complete Sheet", desc: `All ${stats.total} employees`, color: "indigo" },
                  { f: "completed", icon: CheckCircle, label: "Completed Only", desc: `${stats.completed} ready for production`, color: "green" },
                  { f: "in-progress", icon: Clock, label: "In Progress", desc: `${stats.inProgress} ongoing`, color: "yellow" },
                  { f: "not-measured", icon: AlertCircle, label: "Not Measured", desc: `${stats.notMeasured} pending`, color: "gray" },
                ] as const).map(({ f, icon: Icon, label, desc, color }) => (
                  <Button
                    key={f}
                    onClick={() => downloadFilteredSheet(f)}
                    className={`h-auto py-6 flex-col items-start bg-white hover:bg-${color}-50 border-2 border-${color}-300 text-${color}-700`}
                    variant="outline"
                  >
                    <div className="flex items-center gap-3 mb-2 w-full">
                      <Icon className="h-6 w-6" />
                      <span className="font-semibold text-lg">{label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{desc}</span>
                  </Button>
                ))}
              </div>

              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setShowDownloadOptions(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ── Root orchestrator ──────────────────────────────────────────────────────

type Stage =
  | { name: "list" }
  | { name: "new" }
  | { name: "upload"; session: MeasurementSession }
  | { name: "measure"; session: MeasurementSession; employees: EmployeeData[] };

export function MeasurementExpertDashboard() {
  const [sessions, setSessions] = useState<MeasurementSession[]>(loadSessions);
  const [stage, setStage] = useState<Stage>({ name: "list" });

  function refreshSessions() {
    setSessions(loadSessions());
  }

  function handleSessionSaved(session: MeasurementSession) {
    refreshSessions();
    setStage({ name: "upload", session });
  }

  function handleEmployeesUploaded(session: MeasurementSession, employees: EmployeeData[]) {
    saveEmployees(session.id, employees);
    // Update session with employee count
    const updatedSession: MeasurementSession = { ...session, employeesUploaded: employees.length };
    const all = loadSessions().map((s) => (s.id === session.id ? updatedSession : s));
    saveSessions(all);
    refreshSessions();
    setStage({ name: "measure", session: updatedSession, employees });
  }

  function handleOpenSession(session: MeasurementSession) {
    const employees = loadEmployees(session.id);
    if (employees.length === 0) {
      setStage({ name: "upload", session });
    } else {
      setStage({ name: "measure", session, employees });
    }
  }

  function handleEmployeesChanged(session: MeasurementSession, employees: EmployeeData[]) {
    const completed = employees.filter((e) => e.measurementStatus === "completed").length;
    const updatedSession = { ...session, employeesUploaded: employees.length };
    const all = loadSessions().map((s) => (s.id === session.id ? updatedSession : s));
    saveSessions(all);
    refreshSessions();
    void completed; // used for future tracking
  }

  if (stage.name === "new") {
    return (
      <NewMeasurementForm
        onBack={() => setStage({ name: "list" })}
        onSaved={handleSessionSaved}
      />
    );
  }

  if (stage.name === "upload") {
    return (
      <EmployeeUploadScreen
        session={stage.session}
        onBack={() => setStage({ name: "list" })}
        onUploaded={(employees) => handleEmployeesUploaded(stage.session, employees)}
      />
    );
  }

  if (stage.name === "measure") {
    return (
      <MeasurementView
        session={stage.session}
        employees={stage.employees}
        onBack={() => setStage({ name: "list" })}
        onEmployeesChanged={(employees) => handleEmployeesChanged(stage.session, employees)}
      />
    );
  }

  return (
    <SessionsList
      sessions={sessions}
      onNew={() => setStage({ name: "new" })}
      onOpen={handleOpenSession}
    />
  );
}
