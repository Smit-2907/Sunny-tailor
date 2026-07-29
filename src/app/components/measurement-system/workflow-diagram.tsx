import { Card } from "@/app/components/ui/card";
import { 
  FileText, 
  Upload, 
  FileSpreadsheet, 
  Ruler,
  Factory,
  Truck,
  CheckCircle,
  ArrowRight,
  AlertCircle
} from "lucide-react";

export function WorkflowDiagram() {
  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      <h3 className="font-bold text-lg mb-6 text-center">
        Measurement System Workflow
      </h3>

      <div className="space-y-4">
        {/* Step 1: PO Upload */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
            1
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-indigo-600" />
              <h4 className="font-semibold">Purchase Order Upload</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter PO details including company name, order date, delivery date, and total quantity
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="h-6 w-6 text-indigo-400" />
        </div>

        {/* Step 2: Excel Upload */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            2
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Upload className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold">Company Excel Upload</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Upload Excel file with: Sr. No, Employee ID, Employee Name, Branch
            </p>
            <div className="p-2 bg-blue-100 rounded text-xs text-blue-900">
              <strong>System Processing:</strong> Validates data → Generates Unique Serial Numbers (Company Prefix + Sr. No) → Creates Master Sheet
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="h-6 w-6 text-indigo-400" />
        </div>

        {/* Step 3: Master Sheet Created */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
            3
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileSpreadsheet className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold">Employee Master Sheet</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Single source of truth containing all employee records with empty measurement fields
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="h-6 w-6 text-indigo-400" />
        </div>

        {/* Step 4: Measurement Entry */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
            4
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Ruler className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold">Measurement Application</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Measurement expert fills: Shirt measurements, Pant measurements, Photo, Remarks
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs mt-2">
              <div className="p-2 bg-red-100 rounded text-red-900 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Not Measured
              </div>
              <div className="p-2 bg-blue-100 rounded text-blue-900 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                In Progress
              </div>
              <div className="p-2 bg-green-100 rounded text-green-900 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Completed
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="h-6 w-6 text-indigo-400" />
        </div>

        {/* Step 5: Production */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center font-bold">
            5
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Factory className="h-5 w-5 text-orange-600" />
              <h4 className="font-semibold">Production Access</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Production team accesses same master sheet to view completed measurements and start manufacturing
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <ArrowRight className="h-6 w-6 text-indigo-400" />
        </div>

        {/* Step 6: Dispatch */}
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold">
            6
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="h-5 w-5 text-teal-600" />
              <h4 className="font-semibold">Dispatch Verification</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Dispatch team verifies completeness using Unique Serial Number + Employee ID
            </p>
            <div className="p-2 bg-red-100 rounded text-xs text-red-900 mt-2">
              <strong>⚠️ Important:</strong> Employees without measurements marked as incomplete → Cannot dispatch
            </div>
          </div>
        </div>
      </div>

      {/* Key Identifiers */}
      <div className="mt-6 p-4 bg-white rounded-lg border-2 border-indigo-200">
        <h4 className="font-semibold mb-3 text-sm">Primary Identifiers Across System:</h4>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-bold">1</span>
            </div>
            <div>
              <p className="font-semibold text-indigo-900">Unique Serial Number</p>
              <p className="text-muted-foreground">Company Prefix + Sr. No</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-bold">2</span>
            </div>
            <div>
              <p className="font-semibold text-indigo-900">Employee ID</p>
              <p className="text-muted-foreground">Company's original ID</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
