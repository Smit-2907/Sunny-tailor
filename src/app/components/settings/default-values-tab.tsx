import { Input } from "@/app/components/ui/input";
import { type DefaultValues } from "@/app/data/mock-settings";
import { Ruler, Package, DollarSign, Factory, Archive } from "lucide-react";

interface DefaultValuesTabProps {
  settings: DefaultValues;
  onChange: (settings: DefaultValues) => void;
}

export function DefaultValuesTab({ settings, onChange }: DefaultValuesTabProps) {
  const handleChange = (section: keyof DefaultValues, field: string, value: any) => {
    onChange({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Measurement Defaults */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Ruler className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Measurement Defaults</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Unit</label>
            <select
              value={settings.measurements.defaultUnit}
              onChange={(e) => handleChange("measurements", "defaultUnit", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="cm">Centimeters (cm)</option>
              <option value="inch">Inches (inch)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tolerance + (cm)
            </label>
            <Input
              type="number"
              step="0.1"
              value={settings.measurements.defaultTolerancePlus}
              onChange={(e) =>
                handleChange(
                  "measurements",
                  "defaultTolerancePlus",
                  parseFloat(e.target.value)
                )
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tolerance - (cm)
            </label>
            <Input
              type="number"
              step="0.1"
              value={settings.measurements.defaultToleranceMinus}
              onChange={(e) =>
                handleChange(
                  "measurements",
                  "defaultToleranceMinus",
                  parseFloat(e.target.value)
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Payment Defaults */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Payment Defaults</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Terms
            </label>
            <Input
              value={settings.payment.defaultPaymentTerms}
              onChange={(e) => handleChange("payment", "defaultPaymentTerms", e.target.value)}
              placeholder="30 days"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Mode
            </label>
            <Input
              value={settings.payment.defaultPaymentMode}
              onChange={(e) => handleChange("payment", "defaultPaymentMode", e.target.value)}
              placeholder="Bank Transfer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GST Rate (%)
            </label>
            <Input
              type="number"
              value={settings.payment.defaultTaxRate}
              onChange={(e) =>
                handleChange("payment", "defaultTaxRate", parseFloat(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IGST Rate (%)
            </label>
            <Input
              type="number"
              value={settings.payment.defaultIGSTRate}
              onChange={(e) =>
                handleChange("payment", "defaultIGSTRate", parseFloat(e.target.value))
              }
            />
          </div>
        </div>
      </div>

      {/* Production Defaults */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Factory className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Production Defaults</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Working Hours/Day
            </label>
            <Input
              type="number"
              value={settings.production.defaultWorkingHoursPerDay}
              onChange={(e) =>
                handleChange(
                  "production",
                  "defaultWorkingHoursPerDay",
                  parseInt(e.target.value)
                )
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Working Days/Week
            </label>
            <Input
              type="number"
              value={settings.production.defaultWorkingDaysPerWeek}
              onChange={(e) =>
                handleChange(
                  "production",
                  "defaultWorkingDaysPerWeek",
                  parseInt(e.target.value)
                )
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Shifts
            </label>
            <Input
              type="number"
              value={settings.production.defaultShifts}
              onChange={(e) =>
                handleChange("production", "defaultShifts", parseInt(e.target.value))
              }
            />
          </div>
        </div>
      </div>

      {/* Inventory Defaults */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Archive className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Inventory Defaults</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reorder Level
            </label>
            <Input
              type="number"
              value={settings.inventory.defaultReorderLevel}
              onChange={(e) =>
                handleChange("inventory", "defaultReorderLevel", parseInt(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Stock Level
            </label>
            <Input
              type="number"
              value={settings.inventory.defaultMaxStockLevel}
              onChange={(e) =>
                handleChange("inventory", "defaultMaxStockLevel", parseInt(e.target.value))
              }
            />
          </div>

          <div className="col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.inventory.enableAutoReorder}
                onChange={(e) =>
                  handleChange("inventory", "enableAutoReorder", e.target.checked)
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Enable automatic reordering when stock falls below reorder level
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
