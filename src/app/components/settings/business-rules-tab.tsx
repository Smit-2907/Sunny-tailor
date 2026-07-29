import { Input } from "@/app/components/ui/input";
import { type BusinessRules } from "@/app/data/mock-settings";
import { CreditCard, DollarSign, Clock, Users, CheckSquare } from "lucide-react";

interface BusinessRulesTabProps {
  settings: BusinessRules;
  onChange: (settings: BusinessRules) => void;
}

export function BusinessRulesTab({ settings, onChange }: BusinessRulesTabProps) {
  const handleChange = (section: keyof BusinessRules, field: string, value: any) => {
    onChange({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  const handleNestedChange = (
    section: keyof BusinessRules,
    nestedField: string,
    field: string,
    value: any
  ) => {
    onChange({
      ...settings,
      [section]: {
        ...settings[section],
        [nestedField]: {
          ...(settings[section] as any)[nestedField],
          [field]: value,
        },
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Credit Limit Rules */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Credit Limit Rules</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.creditLimitRules.enabled}
              onChange={(e) => handleChange("creditLimitRules", "enabled", e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable credit limit rules
            </label>
          </div>

          {settings.creditLimitRules.enabled && (
            <div className="grid grid-cols-2 gap-4 ml-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Credit Limit (₹)
                </label>
                <Input
                  type="number"
                  value={settings.creditLimitRules.defaultCreditLimit}
                  onChange={(e) =>
                    handleChange("creditLimitRules", "defaultCreditLimit", parseInt(e.target.value))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Period (Days)
                </label>
                <Input
                  type="number"
                  value={settings.creditLimitRules.creditPeriodDays}
                  onChange={(e) =>
                    handleChange("creditLimitRules", "creditPeriodDays", parseInt(e.target.value))
                  }
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category-wise Limits
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Premium (₹)</label>
                    <Input
                      type="number"
                      value={settings.creditLimitRules.categoryLimits.premium}
                      onChange={(e) =>
                        handleNestedChange(
                          "creditLimitRules",
                          "categoryLimits",
                          "premium",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Standard (₹)</label>
                    <Input
                      type="number"
                      value={settings.creditLimitRules.categoryLimits.standard}
                      onChange={(e) =>
                        handleNestedChange(
                          "creditLimitRules",
                          "categoryLimits",
                          "standard",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Basic (₹)</label>
                    <Input
                      type="number"
                      value={settings.creditLimitRules.categoryLimits.basic}
                      onChange={(e) =>
                        handleNestedChange(
                          "creditLimitRules",
                          "categoryLimits",
                          "basic",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Terms */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Payment Terms</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Payment Terms
            </label>
            <select
              value={settings.paymentTerms.defaultTerms}
              onChange={(e) => handleChange("paymentTerms", "defaultTerms", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="15">15 days</option>
              <option value="30">30 days</option>
              <option value="45">45 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Advance Payment %
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              value={settings.paymentTerms.advancePercentage}
              onChange={(e) =>
                handleChange("paymentTerms", "advancePercentage", parseInt(e.target.value))
              }
            />
          </div>

          <div className="col-span-2 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.paymentTerms.advancePaymentRequired}
                onChange={(e) =>
                  handleChange("paymentTerms", "advancePaymentRequired", e.target.checked)
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Require advance payment</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.paymentTerms.acceptPartialPayments}
                onChange={(e) =>
                  handleChange("paymentTerms", "acceptPartialPayments", e.target.checked)
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Accept partial payments</label>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Time Calculation */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Lead Time Calculation</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.leadTimeCalculation.enabled}
              onChange={(e) => handleChange("leadTimeCalculation", "enabled", e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable automatic lead time calculation
            </label>
          </div>

          {settings.leadTimeCalculation.enabled && (
            <div className="grid grid-cols-3 gap-4 ml-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Lead Time (Days)
                </label>
                <Input
                  type="number"
                  value={settings.leadTimeCalculation.baseLeadTimeDays}
                  onChange={(e) =>
                    handleChange(
                      "leadTimeCalculation",
                      "baseLeadTimeDays",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Days Per Unit
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={settings.leadTimeCalculation.additionalDaysPerUnit}
                  onChange={(e) =>
                    handleChange(
                      "leadTimeCalculation",
                      "additionalDaysPerUnit",
                      parseFloat(e.target.value)
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buffer Days
                </label>
                <Input
                  type="number"
                  value={settings.leadTimeCalculation.bufferDays}
                  onChange={(e) =>
                    handleChange("leadTimeCalculation", "bufferDays", parseInt(e.target.value))
                  }
                />
              </div>

              <div className="col-span-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-900">
                  <strong>Formula:</strong> Lead Time = Base ({settings.leadTimeCalculation.baseLeadTimeDays} days) + (Units × {settings.leadTimeCalculation.additionalDaysPerUnit} days) + Buffer ({settings.leadTimeCalculation.bufferDays} days)
                </p>
                <p className="text-xs text-blue-700 mt-1">
                  Example: 100 units = {settings.leadTimeCalculation.baseLeadTimeDays} + (100 × {settings.leadTimeCalculation.additionalDaysPerUnit}) + {settings.leadTimeCalculation.bufferDays} = {settings.leadTimeCalculation.baseLeadTimeDays + (100 * settings.leadTimeCalculation.additionalDaysPerUnit) + settings.leadTimeCalculation.bufferDays} days
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overtime Rules */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Overtime Rules</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.overtimeRules.enabled}
              onChange={(e) => handleChange("overtimeRules", "enabled", e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable overtime rules
            </label>
          </div>

          {settings.overtimeRules.enabled && (
            <div className="grid grid-cols-2 gap-4 ml-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max OT Hours/Day
                </label>
                <Input
                  type="number"
                  value={settings.overtimeRules.maxOvertimeHoursPerDay}
                  onChange={(e) =>
                    handleChange(
                      "overtimeRules",
                      "maxOvertimeHoursPerDay",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max OT Hours/Month
                </label>
                <Input
                  type="number"
                  value={settings.overtimeRules.maxOvertimeHoursPerMonth}
                  onChange={(e) =>
                    handleChange(
                      "overtimeRules",
                      "maxOvertimeHoursPerMonth",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Overtime Rate (Multiplier)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={settings.overtimeRules.overtimeRate}
                  onChange={(e) =>
                    handleChange("overtimeRules", "overtimeRate", parseFloat(e.target.value))
                  }
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.overtimeRules.requireManagerApproval}
                  onChange={(e) =>
                    handleChange("overtimeRules", "requireManagerApproval", e.target.checked)
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Require manager approval</label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quality Checkpoints */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckSquare className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Quality Checkpoints</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.qualityCheckpoints.enabled}
              onChange={(e) => handleChange("qualityCheckpoints", "enabled", e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable quality checkpoints
            </label>
          </div>

          {settings.qualityCheckpoints.enabled && (
            <div className="ml-6 mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  All Checkpoints
                </label>
                <div className="space-y-2">
                  {settings.qualityCheckpoints.checkpoints.map((checkpoint, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        settings.qualityCheckpoints.mandatoryCheckpoints.includes(checkpoint)
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{checkpoint}</span>
                        {settings.qualityCheckpoints.mandatoryCheckpoints.includes(checkpoint) && (
                          <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
                            MANDATORY
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
