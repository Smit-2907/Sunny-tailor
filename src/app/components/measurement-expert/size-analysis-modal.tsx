import { useState, useMemo, useEffect, useCallback } from "react";
import {
  X,
  Search,
  Plus,
  Trash2,
  Users,
  Filter,
  Download,
  TrendingUp,
  CheckSquare,
  Square,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Checkbox } from "@/app/components/ui/checkbox";
import { PurchaseOrder } from "../purchase-order/purchase-order-types";
import { EmployeeData } from "../measurement-system/employee-excel-upload";
import { usePOData } from "@/app/contexts/po-data-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface SizeAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  availablePOs: PurchaseOrder[];
}

interface MeasurementFilter {
  id: string;
  measurementType: "shirt" | "pant";
  measurementField: string;
  targetValue: number;
  tolerance: number;
}

const SHIRT_MEASUREMENTS = [
  { value: "length", label: "Length" },
  { value: "shoulder", label: "Shoulder" },
  { value: "chest", label: "Chest" },
  { value: "waist", label: "Waist" },
  { value: "sleeve", label: "Sleeve" },
  { value: "neck", label: "Neck" },
  { value: "front", label: "Front" },
  { value: "collar", label: "Collar" },
  { value: "cuff", label: "Cuff" },
];

const PANT_MEASUREMENTS = [
  { value: "length", label: "Length" },
  { value: "waist", label: "Waist" },
  { value: "hip", label: "Hip" },
  { value: "thigh", label: "Thigh" },
  { value: "inseam", label: "Inseam" },
  { value: "round", label: "Round" },
  { value: "bottom", label: "Bottom" },
];

function getMeasurementLabel(type: string, field: string): string {
  const list = type === "shirt" ? SHIRT_MEASUREMENTS : PANT_MEASUREMENTS;
  const found = list.find((m) => m.value === field);
  return found ? found.label : field;
}

export function SizeAnalysisModal({
  isOpen,
  onClose,
  availablePOs,
}: SizeAnalysisModalProps) {
  const { getEmployeesForPO } = usePOData();
  const [selectedPOIds, setSelectedPOIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<MeasurementFilter[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<MeasurementFilter[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Reset all state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedPOIds([]);
      setFilters([]);
      setAppliedFilters([]);
      setHasSearched(false);
    }
  }, [isOpen]);

  // Get all employees from selected POs (with measurement data)
  const allEmployees = useMemo(() => {
    if (!isOpen || selectedPOIds.length === 0) return [];
    const employees: (EmployeeData & { poNumber: string })[] = [];
    selectedPOIds.forEach((poId) => {
      const po = availablePOs.find((p) => p.id === poId);
      const poEmployees = getEmployeesForPO(poId);
      poEmployees.forEach((emp) => {
        employees.push({ ...emp, poNumber: po?.poNumber || "" });
      });
    });
    return employees;
  }, [isOpen, selectedPOIds, availablePOs, getEmployeesForPO]);

  // Count employees that actually have measurement data
  const employeesWithMeasurements = useMemo(() => {
    return allEmployees.filter(
      (emp) =>
        emp.measurementStatus === "completed" ||
        emp.measurementStatus === "in-progress"
    ).length;
  }, [allEmployees]);

  // Filter employees based on APPLIED filters
  const matchingEmployees = useMemo(() => {
    if (!hasSearched || appliedFilters.length === 0) return [];
    return allEmployees.filter((emp) => {
      return appliedFilters.every((filter) => {
        const measurements =
          filter.measurementType === "shirt"
            ? emp.measurements?.shirt
            : emp.measurements?.pant;

        if (!measurements) return false;

        const rawValue =
          measurements[filter.measurementField as keyof typeof measurements];

        // Skip empty strings (fixed size or not yet measured)
        if (rawValue === "" || rawValue === undefined || rawValue === null)
          return false;

        const value =
          typeof rawValue === "number" ? rawValue : parseFloat(String(rawValue));
        if (isNaN(value)) return false;

        const min = filter.targetValue - filter.tolerance;
        const max = filter.targetValue + filter.tolerance;

        return value >= min && value <= max;
      });
    });
  }, [hasSearched, allEmployees, appliedFilters]);

  if (!isOpen) return null;

  const handlePOToggle = (poId: string) => {
    setSelectedPOIds((prev) =>
      prev.includes(poId)
        ? prev.filter((id) => id !== poId)
        : [...prev, poId]
    );
    // Reset search results when PO selection changes
    setHasSearched(false);
    setAppliedFilters([]);
  };

  const handleSelectAllPOs = () => {
    if (selectedPOIds.length === availablePOs.length) {
      setSelectedPOIds([]);
    } else {
      setSelectedPOIds(availablePOs.map((po) => po.id));
    }
    setHasSearched(false);
    setAppliedFilters([]);
  };

  const handleAddFilter = () => {
    const newFilter: MeasurementFilter = {
      id: Date.now().toString(),
      measurementType: "shirt",
      measurementField: "length",
      targetValue: 0,
      tolerance: 2,
    };
    setFilters([...filters, newFilter]);
    setHasSearched(false);
  };

  const handleRemoveFilter = (filterId: string) => {
    setFilters((prev) => prev.filter((f) => f.id !== filterId));
    setHasSearched(false);
  };

  const handleUpdateFilter = (
    filterId: string,
    updates: Partial<MeasurementFilter>
  ) => {
    setFilters((prev) =>
      prev.map((f) => (f.id === filterId ? { ...f, ...updates } : f))
    );
    setHasSearched(false);
  };

  const handleSearch = () => {
    setAppliedFilters(filters.map((f) => ({ ...f })));
    setHasSearched(true);
  };

  const handleClearAll = () => {
    setFilters([]);
    setAppliedFilters([]);
    setHasSearched(false);
  };

  const canSearch =
    selectedPOIds.length > 0 &&
    filters.length > 0 &&
    filters.every((f) => f.targetValue > 0);

  const handleDownloadResults = () => {
    if (matchingEmployees.length === 0) return;

    const headers = [
      "PO Number",
      "Serial No",
      "Employee ID",
      "Employee Name",
      "Department",
    ];

    // Use appliedFilters (not filters) for CSV columns
    appliedFilters.forEach((filter) => {
      const type = filter.measurementType.toUpperCase();
      const label = getMeasurementLabel(
        filter.measurementType,
        filter.measurementField
      );
      headers.push(`${type} ${label}`);
    });

    const rows = matchingEmployees.map((emp) => {
      const row: string[] = [
        emp.poNumber,
        emp.uniqueSerialNumber,
        emp.employeeId,
        emp.employeeName,
        emp.department,
      ];

      appliedFilters.forEach((filter) => {
        const measurements =
          filter.measurementType === "shirt"
            ? emp.measurements?.shirt
            : emp.measurements?.pant;
        const value =
          measurements?.[
            filter.measurementField as keyof typeof measurements
          ] || "-";
        row.push(String(value));
      });

      return row;
    });

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `size-analysis-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Step indicator
  const currentStep =
    selectedPOIds.length === 0
      ? 1
      : filters.length === 0
      ? 2
      : !hasSearched
      ? 3
      : 4;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold">Size Analysis</h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Find employees with similar measurements for production planning
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Step Indicator */}
        <div className="px-4 md:px-6 py-3 border-b bg-gray-50">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                currentStep >= 1
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-400"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                1
              </span>
              Select POs
            </span>
            <ArrowRight className="h-3 w-3 text-gray-400" />
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                currentStep >= 2
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-400"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 2
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 text-white"
                }`}
              >
                2
              </span>
              Add Filters
            </span>
            <ArrowRight className="h-3 w-3 text-gray-400" />
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                currentStep >= 3
                  ? "bg-indigo-100 text-indigo-700"
                  : "text-gray-400"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 3
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-300 text-white"
                }`}
              >
                3
              </span>
              Search
            </span>
            <ArrowRight className="h-3 w-3 text-gray-400" />
            <span
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                currentStep >= 4
                  ? "bg-green-100 text-green-700"
                  : "text-gray-400"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                  currentStep >= 4
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-white"
                }`}
              >
                4
              </span>
              Results
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Left Panel - Configuration */}
            <div className="lg:col-span-1 space-y-4">
              {/* Select PO Sheets */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-indigo-600" />
                    <h3 className="font-semibold text-sm">Select PO Sheets</h3>
                  </div>
                  {availablePOs.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleSelectAllPOs}
                      className="text-xs h-7 px-2"
                    >
                      {selectedPOIds.length === availablePOs.length ? (
                        <>
                          <CheckSquare className="h-3 w-3 mr-1" />
                          Deselect All
                        </>
                      ) : (
                        <>
                          <Square className="h-3 w-3 mr-1" />
                          Select All
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {availablePOs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No PO sheets available
                    </p>
                  ) : (
                    availablePOs.map((po) => {
                      const empCount = getEmployeesForPO(po.id).length;
                      const measuredCount = getEmployeesForPO(po.id).filter(
                        (e) => e.measurementStatus === "completed"
                      ).length;
                      return (
                        <div
                          key={po.id}
                          className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                            selectedPOIds.includes(po.id)
                              ? "bg-indigo-50 border border-indigo-200"
                              : "hover:bg-gray-50 border border-transparent"
                          }`}
                          onClick={() => handlePOToggle(po.id)}
                        >
                          <div onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                              id={`po-${po.id}`}
                              checked={selectedPOIds.includes(po.id)}
                              onCheckedChange={() => handlePOToggle(po.id)}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium font-mono text-indigo-600 text-xs">
                              {po.poNumber}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {po.clientCompanyName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {measuredCount}/{empCount} measured
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {selectedPOIds.length > 0 && (
                  <div className="mt-3 pt-3 border-t space-y-1">
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-indigo-600">
                        {selectedPOIds.length}
                      </span>{" "}
                      PO{selectedPOIds.length > 1 ? "s" : ""} selected
                      {" \u2022 "}
                      <span className="font-semibold text-indigo-600">
                        {allEmployees.length}
                      </span>{" "}
                      total employees
                    </p>
                    {employeesWithMeasurements < allEmployees.length && (
                      <p className="text-xs text-amber-600 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {employeesWithMeasurements} have measurements,{" "}
                        {allEmployees.length - employeesWithMeasurements} not yet
                        measured
                      </p>
                    )}
                  </div>
                )}
              </Card>

              {/* Measurement Filters */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-indigo-600" />
                    <h3 className="font-semibold text-sm">
                      Measurement Filters
                    </h3>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAddFilter}
                    className="h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Filter
                  </Button>
                </div>

                <div className="space-y-3">
                  {filters.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                      <Filter className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click "Add Filter" to start
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Search by shirt or pant measurements
                      </p>
                    </div>
                  ) : (
                    filters.map((filter, index) => (
                      <div
                        key={filter.id}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2"
                      >
                        {/* Filter Header */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-500">
                            FILTER {index + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFilter(filter.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Type + Field in one row */}
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={filter.measurementType}
                            onValueChange={(value) =>
                              handleUpdateFilter(filter.id, {
                                measurementType: value as "shirt" | "pant",
                                measurementField: "length",
                              })
                            }
                          >
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="shirt">Shirt</SelectItem>
                              <SelectItem value="pant">Pant</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            value={filter.measurementField}
                            onValueChange={(value) =>
                              handleUpdateFilter(filter.id, {
                                measurementField: value,
                              })
                            }
                          >
                            <SelectTrigger className="h-9 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(filter.measurementType === "shirt"
                                ? SHIRT_MEASUREMENTS
                                : PANT_MEASUREMENTS
                              ).map((m) => (
                                <SelectItem key={m.value} value={m.value}>
                                  {m.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Target Value + Tolerance in one row */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs text-gray-500">
                              Value (cm)
                            </Label>
                            <Input
                              type="number"
                              step="0.1"
                              min="0"
                              value={filter.targetValue || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                handleUpdateFilter(filter.id, {
                                  targetValue:
                                    val === "" ? 0 : parseFloat(val),
                                });
                              }}
                              placeholder="e.g., 60"
                              className="h-9 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-gray-500">
                              Tolerance: \u00b1{filter.tolerance}
                            </Label>
                            <Input
                              type="range"
                              min="0"
                              max="10"
                              step="0.5"
                              value={filter.tolerance}
                              onChange={(e) =>
                                handleUpdateFilter(filter.id, {
                                  tolerance: parseFloat(e.target.value),
                                })
                              }
                              className="w-full h-9"
                            />
                          </div>
                        </div>

                        {/* Range Preview */}
                        {filter.targetValue > 0 && (
                          <div className="text-xs text-center bg-indigo-50 text-indigo-700 py-1 px-2 rounded font-medium">
                            Range: {filter.targetValue - filter.tolerance} \u2013{" "}
                            {filter.targetValue + filter.tolerance} cm
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Search Button */}
                {filters.length > 0 && (
                  <div className="flex gap-2 mt-4">
                    <Button
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                      onClick={handleSearch}
                      disabled={!canSearch}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      {hasSearched ? "Search Again" : "Search"}
                    </Button>
                    <Button variant="outline" onClick={handleClearAll}>
                      Clear
                    </Button>
                  </div>
                )}

                {/* Validation hints */}
                {filters.length > 0 && !canSearch && (
                  <div className="mt-2 space-y-1">
                    {selectedPOIds.length === 0 && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Select at least one PO sheet
                      </p>
                    )}
                    {filters.some((f) => f.targetValue === 0) && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Enter target values for all filters
                      </p>
                    )}
                  </div>
                )}
              </Card>
            </div>

            {/* Right Panel - Results */}
            <div className="lg:col-span-2 space-y-4">
              {/* Results Header */}
              <Card className="p-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        hasSearched && matchingEmployees.length > 0
                          ? "bg-green-100"
                          : "bg-gray-100"
                      }`}
                    >
                      <Users
                        className={`h-5 w-5 ${
                          hasSearched && matchingEmployees.length > 0
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Matching Employees</h3>
                      <p className="text-sm text-muted-foreground">
                        {!hasSearched
                          ? "Configure filters and click Search to find matches"
                          : matchingEmployees.length === 0
                          ? "No employees match your criteria"
                          : `${matchingEmployees.length} employee${
                              matchingEmployees.length !== 1 ? "s" : ""
                            } found matching your criteria`}
                      </p>
                    </div>
                  </div>
                  {matchingEmployees.length > 0 && (
                    <Button
                      onClick={handleDownloadResults}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  )}
                </div>

                {/* Applied Filters Summary */}
                {hasSearched && appliedFilters.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      Active filters:
                    </span>
                    {appliedFilters.map((f) => (
                      <span
                        key={f.id}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs"
                      >
                        {f.measurementType.toUpperCase()}{" "}
                        {getMeasurementLabel(f.measurementType, f.measurementField)}
                        : {f.targetValue} \u00b1{f.tolerance}cm
                      </span>
                    ))}
                  </div>
                )}
              </Card>

              {/* Results Table */}
              {hasSearched && matchingEmployees.length > 0 ? (
                <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            #
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            PO Number
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            Serial No
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            Employee ID
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            Name
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 whitespace-nowrap">
                            Department
                          </th>
                          {appliedFilters.map((filter) => (
                            <th
                              key={filter.id}
                              className="px-3 py-3 text-center text-xs font-semibold text-indigo-700 bg-indigo-50 whitespace-nowrap"
                            >
                              {filter.measurementType.toUpperCase()}
                              <br />
                              {getMeasurementLabel(
                                filter.measurementType,
                                filter.measurementField
                              )}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {matchingEmployees.map((emp, idx) => (
                          <tr
                            key={`${emp.poNumber}-${emp.uniqueSerialNumber}-${idx}`}
                            className={
                              idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                            }
                          >
                            <td className="px-3 py-2.5 text-xs text-gray-400">
                              {idx + 1}
                            </td>
                            <td className="px-3 py-2.5 text-xs font-mono text-indigo-600 font-medium">
                              {emp.poNumber}
                            </td>
                            <td className="px-3 py-2.5 text-xs font-medium">
                              {emp.uniqueSerialNumber}
                            </td>
                            <td className="px-3 py-2.5 text-xs">
                              {emp.employeeId}
                            </td>
                            <td className="px-3 py-2.5 text-xs font-medium">
                              {emp.employeeName}
                            </td>
                            <td className="px-3 py-2.5 text-xs">
                              {emp.department}
                            </td>
                            {appliedFilters.map((filter) => {
                              const measurements =
                                filter.measurementType === "shirt"
                                  ? emp.measurements?.shirt
                                  : emp.measurements?.pant;
                              const rawValue =
                                measurements?.[
                                  filter.measurementField as keyof typeof measurements
                                ];
                              const numValue = parseFloat(String(rawValue));
                              const isExact = numValue === filter.targetValue;
                              return (
                                <td
                                  key={filter.id}
                                  className={`px-3 py-2.5 text-xs text-center font-semibold ${
                                    isExact
                                      ? "bg-green-50 text-green-700"
                                      : "bg-indigo-50 text-indigo-700"
                                  }`}
                                >
                                  {rawValue || "-"}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-4 py-2 border-t bg-gray-50 text-xs text-muted-foreground">
                    Showing {matchingEmployees.length} matching employee
                    {matchingEmployees.length !== 1 ? "s" : ""} out of{" "}
                    {allEmployees.length} total
                  </div>
                </Card>
              ) : (
                <Card className="p-8 md:p-12 text-center">
                  {hasSearched ? (
                    <>
                      <AlertCircle className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">
                        No Matching Employees Found
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        No employees match your filter criteria. Try increasing
                        the tolerance range or adjusting the target values.
                      </p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        {appliedFilters.map((f) => (
                          <span
                            key={f.id}
                            className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600"
                          >
                            {f.measurementType.toUpperCase()}{" "}
                            {getMeasurementLabel(f.measurementType, f.measurementField)}
                            : {f.targetValue} \u00b1{f.tolerance}cm
                          </span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {selectedPOIds.length === 0
                          ? "Step 1: Select PO Sheets"
                          : filters.length === 0
                          ? "Step 2: Add Measurement Filters"
                          : "Step 3: Click Search"}
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        {selectedPOIds.length === 0
                          ? "Choose one or more PO sheets from the left panel to start analyzing measurements."
                          : filters.length === 0
                          ? "Add measurement filters to define what sizes you're looking for. You can add multiple filters."
                          : "Enter your target measurement values and click the Search button to find matching employees."}
                      </p>
                    </>
                  )}
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}