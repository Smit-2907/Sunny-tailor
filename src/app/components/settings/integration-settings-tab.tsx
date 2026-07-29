import { Input } from "@/app/components/ui/input";
import { type IntegrationSettings } from "@/app/data/mock-settings";
import { Plug } from "lucide-react";

interface IntegrationSettingsTabProps {
  settings: IntegrationSettings;
  onChange: (settings: IntegrationSettings) => void;
}

export function IntegrationSettingsTab({ settings, onChange }: IntegrationSettingsTabProps) {
  const handleChange = (section: keyof IntegrationSettings, field: string, value: any) => {
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
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Third-party Integrations</strong> - Connect your ERP with external accounting software and services.
        </p>
      </div>

      {/* Tally Integration */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">Tally Integration</h3>
          </div>
          <input
            type="checkbox"
            checked={settings.tally.enabled}
            onChange={(e) => handleChange("tally", "enabled", e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        </div>

        {settings.tally.enabled && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Server URL</label>
              <Input
                value={settings.tally.serverUrl}
                onChange={(e) => handleChange("tally", "serverUrl", e.target.value)}
                placeholder="http://localhost:9000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <Input
                value={settings.tally.companyName}
                onChange={(e) => handleChange("tally", "companyName", e.target.value)}
                placeholder="Company Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sync Frequency</label>
              <select
                value={settings.tally.syncFrequency}
                onChange={(e) => handleChange("tally", "syncFrequency", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="realtime">Real-time</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* QuickBooks Integration */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-indigo-600" />
            <h3 className="text-lg font-semibold text-gray-900">QuickBooks Integration</h3>
          </div>
          <input
            type="checkbox"
            checked={settings.quickbooks.enabled}
            onChange={(e) => handleChange("quickbooks", "enabled", e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
        </div>

        {settings.quickbooks.enabled && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
              <Input
                value={settings.quickbooks.clientId}
                onChange={(e) => handleChange("quickbooks", "clientId", e.target.value)}
                placeholder="Enter client ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
              <Input
                type="password"
                value={settings.quickbooks.clientSecret}
                onChange={(e) => handleChange("quickbooks", "clientSecret", e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
