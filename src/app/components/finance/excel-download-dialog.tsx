import { useState } from "react";
import { Download, FileSpreadsheet, X } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import * as XLSX from "xlsx";
import { toast } from "sonner";

const MONTHS = [
  { value: "all", label: "All Months" },
  { value: "1",  label: "January" },
  { value: "2",  label: "February" },
  { value: "3",  label: "March" },
  { value: "4",  label: "April" },
  { value: "5",  label: "May" },
  { value: "6",  label: "June" },
  { value: "7",  label: "July" },
  { value: "8",  label: "August" },
  { value: "9",  label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const STATUSES = [
  { value: "all",     label: "All Statuses" },
  { value: "paid",    label: "Paid" },
  { value: "partial", label: "Partially Paid" },
  { value: "pending", label: "Pending" },
  { value: "overdue", label: "Overdue" },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => ({
  value: String(y),
  label: String(y),
}));
YEARS.unshift({ value: "all", label: "All Years" });

export interface DownloadableRow {
  [key: string]: string | number;
  date: string;
  status: string;
}

interface ExcelDownloadDialogProps {
  open: boolean;
  onClose: () => void;
  type: "bills" | "expenses";
  data: DownloadableRow[];
}

export function ExcelDownloadDialog({ open, onClose, type, data }: ExcelDownloadDialogProps) {
  const [month, setMonth]   = useState("all");
  const [year, setYear]     = useState(String(currentYear));
  const [status, setStatus] = useState("all");

  const isBills = type === "bills";
  const title   = isBills ? "Download Bills / Sales Report" : "Download Expenses Report";
  const color   = isBills ? "text-indigo-600" : "text-orange-600";

  const filtered = data.filter((row) => {
    const d = new Date(row.date);
    if (isNaN(d.getTime())) return true;
    const monthMatch  = month  === "all" || d.getMonth() + 1 === parseInt(month);
    const yearMatch   = year   === "all" || d.getFullYear() === parseInt(year);
    const statusMatch = status === "all" || row.status === status;
    return monthMatch && yearMatch && statusMatch;
  });

  const handleDownload = () => {
    if (filtered.length === 0) {
      toast.error("No data matches the selected filters.");
      return;
    }

    const monthLabel  = MONTHS.find((m) => m.value === month)?.label  || "All";
    const yearLabel   = year === "all" ? "All" : year;
    const statusLabel = STATUSES.find((s) => s.value === status)?.label || "All";

    const ws = XLSX.utils.json_to_sheet(filtered);

    // Auto-fit column widths
    const colWidths = Object.keys(filtered[0] || {}).map((key) => ({
      wch: Math.max(key.length, ...filtered.map((r) => String(r[key] ?? "").length)) + 2,
    }));
    ws["!cols"] = colWidths;

    const wb = XLSX.utils.book_new();
    const sheetName = isBills ? "Bills" : "Expenses";
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const today    = new Date().toISOString().split("T")[0];
    const fileName = isBills
      ? `Bills_${monthLabel}_${yearLabel}_${today}.xlsx`
      : `Expenses_${monthLabel}_${yearLabel}_${today}.xlsx`;

    XLSX.writeFile(wb, fileName);
    toast.success(`Downloaded: ${fileName} (${filtered.length} records)`);
    onClose();
  };

  const monthLabel  = MONTHS.find((m) => m.value === month)?.label  || "";
  const statusLabel = STATUSES.find((s) => s.value === status)?.label || "";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${color}`}>
            <FileSpreadsheet className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Filter by month, year, and status, then download as an Excel file.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Preview badge */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
            <span className="text-sm text-muted-foreground">
              Matching records:
            </span>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              {filtered.length} {isBills ? "bill(s)" : "expense(s)"}
            </Badge>
          </div>

          {/* Month */}
          <div className="space-y-2">
            <Label>Month</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          <div className="space-y-2">
            <Label>Year</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y.value} value={y.value}>{y.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label>Payment Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Summary of selection */}
          <div className="text-xs text-muted-foreground bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-1">
            <p className="font-medium text-blue-700">Export Summary</p>
            <p>Period: <span className="font-semibold">{monthLabel} {year === "all" ? "(All Years)" : year}</span></p>
            <p>Status: <span className="font-semibold">{statusLabel}</span></p>
            <p>Records: <span className="font-semibold">{filtered.length}</span></p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            disabled={filtered.length === 0}
            className={isBills ? "bg-indigo-600 hover:bg-indigo-700" : "bg-orange-600 hover:bg-orange-700"}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Excel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
