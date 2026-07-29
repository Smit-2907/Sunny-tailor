import { useState } from "react";
import { Calculator, DollarSign, TrendingUp, Info } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { calculateEmployerContribution } from "@/app/data/mock-payroll-data";

export function CTCCalculator() {
  const [ctcAmount, setCtcAmount] = useState("");
  const [calculatedValues, setCalculatedValues] = useState<any>(null);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate salary breakdown
  const calculateBreakdown = () => {
    const ctc = parseFloat(ctcAmount);
    if (isNaN(ctc) || ctc <= 0) {
      alert("Please enter a valid CTC amount");
      return;
    }

    // Monthly CTC
    const monthlyCtc = ctc / 12;

    // Calculate components
    const basic = Math.round(ctc * 0.40); // 40% of CTC
    const monthlyBasic = Math.round(basic / 12);
    const hra = Math.round(monthlyBasic * 0.50); // 50% of Basic
    const conveyance = 1600; // Fixed
    const medical = 1250; // Fixed
    const specialAllowance = Math.round(monthlyCtc - monthlyBasic - hra - conveyance - medical);
    const monthlyGross = monthlyBasic + hra + conveyance + medical + specialAllowance;
    const annualGross = monthlyGross * 12;

    // Employee Deductions
    const monthlyPF = Math.round(monthlyBasic * 0.12); // 12% of Basic
    const annualPF = monthlyPF * 12;
    const monthlyESI = monthlyGross < 21000 ? Math.round(monthlyGross * 0.0075) : 0;
    const annualESI = monthlyESI * 12;
    const monthlyPT = 200; // Standard PT
    const annualPT = monthlyPT * 12;

    // Calculate TDS
    const calculateTDS = (annualIncome: number): number => {
      let tax = 0;
      if (annualIncome <= 300000) {
        tax = 0;
      } else if (annualIncome <= 700000) {
        tax = (annualIncome - 300000) * 0.05;
      } else if (annualIncome <= 1000000) {
        tax = 20000 + (annualIncome - 700000) * 0.10;
      } else if (annualIncome <= 1200000) {
        tax = 50000 + (annualIncome - 1000000) * 0.15;
      } else if (annualIncome <= 1500000) {
        tax = 80000 + (annualIncome - 1200000) * 0.20;
      } else {
        tax = 140000 + (annualIncome - 1500000) * 0.30;
      }
      return Math.round(tax);
    };

    const annualTDS = calculateTDS(annualGross);
    const monthlyTDS = Math.round(annualTDS / 12);

    const monthlyTotalDeductions = monthlyPF + monthlyESI + monthlyPT + monthlyTDS;
    const annualTotalDeductions = annualPF + annualESI + annualPT + annualTDS;

    const monthlyNet = monthlyGross - monthlyTotalDeductions;
    const annualNet = annualGross - annualTotalDeductions;

    // Employer Contributions
    const employerPF = annualPF; // 12% employer contribution
    const employerESI = monthlyESI > 0 ? Math.round(annualGross * 0.0325) : 0; // 3.25%
    const gratuity = Math.round((basic * 4.81) / 100); // 4.81% of annual basic
    const bonus = Math.round(basic * 0.0833); // 8.33% of annual basic
    const totalEmployerCost = employerPF + employerESI + gratuity + bonus;

    // Total CTC Breakdown
    const totalCost = annualGross + totalEmployerCost;

    setCalculatedValues({
      monthly: {
        basic: monthlyBasic,
        hra,
        conveyance,
        medical,
        specialAllowance,
        gross: monthlyGross,
        pf: monthlyPF,
        esi: monthlyESI,
        pt: monthlyPT,
        tds: monthlyTDS,
        totalDeductions: monthlyTotalDeductions,
        net: monthlyNet,
      },
      annual: {
        basic,
        hra: hra * 12,
        conveyance: conveyance * 12,
        medical: medical * 12,
        specialAllowance: specialAllowance * 12,
        gross: annualGross,
        pf: annualPF,
        esi: annualESI,
        pt: annualPT,
        tds: annualTDS,
        totalDeductions: annualTotalDeductions,
        net: annualNet,
      },
      employer: {
        pf: employerPF,
        esi: employerESI,
        gratuity,
        bonus,
        total: totalEmployerCost,
      },
      totalCost,
    });
  };

  const resetCalculator = () => {
    setCtcAmount("");
    setCalculatedValues(null);
  };

  return (
    <div className="space-y-6">
      {/* Calculator Input */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="h-6 w-6 text-indigo-600" />
          <h3 className="font-semibold text-lg">CTC Calculator</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Enter the annual CTC to calculate detailed salary breakdown including earnings,
          deductions, and employer contributions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="ctcAmount">Annual CTC (Cost to Company)</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="ctcAmount"
                type="number"
                placeholder="Enter CTC (e.g., 600000)"
                value={ctcAmount}
                onChange={(e) => setCtcAmount(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={calculateBreakdown} className="flex-1">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate
            </Button>
            <Button variant="outline" onClick={resetCalculator}>
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {calculatedValues && (
        <>
          {/* Monthly Breakdown */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-indigo-900">
              Monthly Salary Breakdown
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Earnings */}
              <div>
                <h4 className="font-semibold mb-3 text-green-700 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Monthly Earnings
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Basic Salary</span>
                    <span className="font-semibold">
                      {formatCurrency(calculatedValues.monthly.basic)}
                    </span>
                  </div>
                  <div className="flex justify-between p-2">
                    <span className="text-sm">HRA (50% of Basic)</span>
                    <span className="font-semibold">
                      {formatCurrency(calculatedValues.monthly.hra)}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Conveyance Allowance</span>
                    <span className="font-semibold">
                      {formatCurrency(calculatedValues.monthly.conveyance)}
                    </span>
                  </div>
                  <div className="flex justify-between p-2">
                    <span className="text-sm">Medical Allowance</span>
                    <span className="font-semibold">
                      {formatCurrency(calculatedValues.monthly.medical)}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Special Allowance</span>
                    <span className="font-semibold">
                      {formatCurrency(calculatedValues.monthly.specialAllowance)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-green-100 rounded font-bold text-green-900 border-2 border-green-200">
                    <span>Gross Salary</span>
                    <span>{formatCurrency(calculatedValues.monthly.gross)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h4 className="font-semibold mb-3 text-red-700 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 rotate-180" />
                  Monthly Deductions
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Provident Fund (12%)</span>
                    <span className="font-semibold">
                      {formatCurrency(calculatedValues.monthly.pf)}
                    </span>
                  </div>
                  {calculatedValues.monthly.esi > 0 && (
                    <div className="flex justify-between p-2">
                      <span className="text-sm">ESI (0.75%)</span>
                      <span className="font-semibold">
                        {formatCurrency(calculatedValues.monthly.esi)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between p-2 bg-muted rounded">
                    <span className="text-sm">Professional Tax</span>
                    <span className="font-semibold">
                      {formatCurrency(calculatedValues.monthly.pt)}
                    </span>
                  </div>
                  {calculatedValues.monthly.tds > 0 && (
                    <div className="flex justify-between p-2">
                      <span className="text-sm">TDS (Income Tax)</span>
                      <span className="font-semibold">
                        {formatCurrency(calculatedValues.monthly.tds)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between p-3 bg-red-100 rounded font-bold text-red-900 border-2 border-red-200">
                    <span>Total Deductions</span>
                    <span>{formatCurrency(calculatedValues.monthly.totalDeductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Net Salary */}
            <div className="mt-6 p-6 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Monthly Net Salary</p>
                  <p className="text-xs text-indigo-700">Amount credited to bank account</p>
                </div>
                <p className="text-3xl font-bold text-indigo-900">
                  {formatCurrency(calculatedValues.monthly.net)}
                </p>
              </div>
            </div>
          </Card>

          {/* Annual Breakdown */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-purple-900">
              Annual Salary Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Annual Gross</p>
                <p className="font-bold text-green-900">
                  {formatCurrency(calculatedValues.annual.gross)}
                </p>
              </div>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Annual Deductions</p>
                <p className="font-bold text-red-900">
                  {formatCurrency(calculatedValues.annual.totalDeductions)}
                </p>
              </div>
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Annual Net Salary</p>
                <p className="font-bold text-indigo-900">
                  {formatCurrency(calculatedValues.annual.net)}
                </p>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Take Home %</p>
                <p className="font-bold text-purple-900">
                  {((calculatedValues.annual.net / calculatedValues.annual.gross) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </Card>

          {/* Employer Contribution */}
          <Card className="p-6 bg-orange-50 border-orange-200">
            <div className="flex items-start gap-3 mb-4">
              <Info className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg text-orange-900 mb-1">
                  Employer Contributions (Annual)
                </h3>
                <p className="text-sm text-orange-800">
                  Additional costs borne by the employer over the gross salary
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-sm">Employer PF (12%)</span>
                  <span className="font-semibold">
                    {formatCurrency(calculatedValues.employer.pf)}
                  </span>
                </div>
                {calculatedValues.employer.esi > 0 && (
                  <div className="flex justify-between p-2 bg-white rounded">
                    <span className="text-sm">Employer ESI (3.25%)</span>
                    <span className="font-semibold">
                      {formatCurrency(calculatedValues.employer.esi)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-sm">Gratuity (4.81%)</span>
                  <span className="font-semibold">
                    {formatCurrency(calculatedValues.employer.gratuity)}
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-white rounded">
                  <span className="text-sm">Bonus (8.33%)</span>
                  <span className="font-semibold">
                    {formatCurrency(calculatedValues.employer.bonus)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-center p-6 bg-white rounded-lg border-2 border-orange-300">
                  <p className="text-sm text-muted-foreground mb-2">
                    Total Employer Contribution
                  </p>
                  <p className="text-3xl font-bold text-orange-900">
                    {formatCurrency(calculatedValues.employer.total)}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Total CTC Summary */}
          <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200">
            <h3 className="font-semibold text-xl mb-4 text-indigo-900">
              Total Cost to Company (CTC) Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium">Annual Gross Salary (Employee Take Home)</span>
                <span className="font-bold text-lg text-indigo-900">
                  {formatCurrency(calculatedValues.annual.gross)}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="font-medium">Total Employer Contributions</span>
                <span className="font-bold text-lg text-orange-900">
                  {formatCurrency(calculatedValues.employer.total)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg">
                <span className="font-bold text-lg">Total CTC</span>
                <span className="font-bold text-2xl">
                  {formatCurrency(calculatedValues.totalCost)}
                </span>
              </div>
            </div>
          </Card>
        </>
      )}

      {/* Information Card */}
      {!calculatedValues && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How CTC is Calculated</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Basic Salary: 40% of CTC</li>
                <li>• HRA: 50% of Basic Salary</li>
                <li>• Conveyance: ₹1,600/month (fixed)</li>
                <li>• Medical: ₹1,250/month (fixed)</li>
                <li>• Special Allowance: Remaining amount</li>
                <li>• PF: 12% of Basic (Employee) + 12% (Employer)</li>
                <li>• ESI: 0.75% (Employee) + 3.25% (Employer) if Gross {"<"} ₹21,000</li>
                <li>• TDS: Based on income tax slabs</li>
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
