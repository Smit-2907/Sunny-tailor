import { Input } from "@/app/components/ui/input";
import { type GeneralSettings, timezones, currencies, languages } from "@/app/data/mock-settings";
import { Building2, Globe, DollarSign, Calendar } from "lucide-react";

interface GeneralSettingsTabProps {
  settings: GeneralSettings;
  onChange: (settings: GeneralSettings) => void;
}

export function GeneralSettingsTab({ settings, onChange }: GeneralSettingsTabProps) {
  const handleChange = (field: keyof GeneralSettings, value: any) => {
    onChange({ ...settings, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Company Information */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={settings.companyName}
              onChange={(e) => handleChange("companyName", e.target.value)}
              placeholder="Enter company name"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <Input
              value={settings.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Street address, building"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <Input
              value={settings.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <Input
              value={settings.state}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder="State"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <Input
              value={settings.country}
              onChange={(e) => handleChange("country", e.target.value)}
              placeholder="Country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
            <Input
              value={settings.pincode}
              onChange={(e) => handleChange("pincode", e.target.value)}
              placeholder="Pincode"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <Input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+91 00000 00000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="info@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <Input
              value={settings.website}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="www.company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
            <Input
              value={settings.gstNumber}
              onChange={(e) => handleChange("gstNumber", e.target.value)}
              placeholder="27AABCU9603R1ZM"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <Input
              value={settings.panNumber}
              onChange={(e) => handleChange("panNumber", e.target.value)}
              placeholder="AABCU9603R"
            />
          </div>
        </div>
      </div>

      {/* Fiscal Year */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Fiscal Year</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fiscal Year Start (MM-DD)
            </label>
            <Input
              value={settings.fiscalYearStart}
              onChange={(e) => handleChange("fiscalYearStart", e.target.value)}
              placeholder="04-01"
            />
            <p className="text-xs text-gray-500 mt-1">Format: MM-DD (e.g., 04-01 for April 1st)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fiscal Year End (MM-DD)
            </label>
            <Input
              value={settings.fiscalYearEnd}
              onChange={(e) => handleChange("fiscalYearEnd", e.target.value)}
              placeholder="03-31"
            />
            <p className="text-xs text-gray-500 mt-1">Format: MM-DD (e.g., 03-31 for March 31st)</p>
          </div>
        </div>
      </div>

      {/* Regional Settings */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Globe className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Regional Settings</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              value={settings.timezone}
              onChange={(e) => handleChange("timezone", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleChange("language", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
            <select
              value={settings.dateFormat}
              onChange={(e) => handleChange("dateFormat", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="DD-MM-YYYY">DD-MM-YYYY (26-01-2026)</option>
              <option value="MM-DD-YYYY">MM-DD-YYYY (01-26-2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-01-26)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
            <select
              value={settings.timeFormat}
              onChange={(e) => handleChange("timeFormat", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="12-hour">12-hour (02:30 PM)</option>
              <option value="24-hour">24-hour (14:30)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Currency Settings */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Currency & Number Format</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              value={settings.currency}
              onChange={(e) => {
                const selectedCurrency = currencies.find((c) => c.value === e.target.value);
                handleChange("currency", e.target.value);
                if (selectedCurrency) {
                  handleChange("currencySymbol", selectedCurrency.symbol);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {currencies.map((curr) => (
                <option key={curr.value} value={curr.value}>
                  {curr.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency Symbol Position
            </label>
            <select
              value={settings.currencyPosition}
              onChange={(e) =>
                handleChange("currencyPosition", e.target.value as "before" | "after")
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="before">Before amount (₹1,000)</option>
              <option value="after">After amount (1,000₹)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Decimal Separator
            </label>
            <select
              value={settings.decimalSeparator}
              onChange={(e) => handleChange("decimalSeparator", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value=".">Dot (.)</option>
              <option value=",">Comma (,)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Thousand Separator
            </label>
            <select
              value={settings.thousandSeparator}
              onChange={(e) => handleChange("thousandSeparator", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value=",">Comma (,)</option>
              <option value=".">Dot (.)</option>
              <option value=" ">Space ( )</option>
              <option value="">None</option>
            </select>
          </div>

          <div className="col-span-2">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-900 mb-1">Preview</p>
              <p className="text-lg font-bold text-blue-700">
                {settings.currencyPosition === "before"
                  ? `${settings.currencySymbol}1${settings.thousandSeparator}234${settings.decimalSeparator}56`
                  : `1${settings.thousandSeparator}234${settings.decimalSeparator}56${settings.currencySymbol}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
