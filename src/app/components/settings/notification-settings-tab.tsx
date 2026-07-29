import { Input } from "@/app/components/ui/input";
import { type NotificationSettings } from "@/app/data/mock-settings";
import { Mail, MessageSquare, Bell, AlertTriangle, DollarSign } from "lucide-react";

interface NotificationSettingsTabProps {
  settings: NotificationSettings;
  onChange: (settings: NotificationSettings) => void;
}

export function NotificationSettingsTab({
  settings,
  onChange,
}: NotificationSettingsTabProps) {
  const handleChange = (section: keyof NotificationSettings, field: string, value: any) => {
    onChange({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Email Settings */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Mail className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Email Configuration (SMTP)</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.email.enabled}
              onChange={(e) => handleChange("email", "enabled", e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable email notifications
            </label>
          </div>

          {settings.email.enabled && (
            <div className="grid grid-cols-2 gap-4 ml-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Host
                </label>
                <Input
                  value={settings.email.smtpHost}
                  onChange={(e) => handleChange("email", "smtpHost", e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Port
                </label>
                <Input
                  type="number"
                  value={settings.email.smtpPort}
                  onChange={(e) =>
                    handleChange("email", "smtpPort", parseInt(e.target.value))
                  }
                  placeholder="587"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <Input
                  value={settings.email.smtpUsername}
                  onChange={(e) => handleChange("email", "smtpUsername", e.target.value)}
                  placeholder="noreply@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  value={settings.email.smtpPassword}
                  onChange={(e) => handleChange("email", "smtpPassword", e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sender Email
                </label>
                <Input
                  type="email"
                  value={settings.email.senderEmail}
                  onChange={(e) => handleChange("email", "senderEmail", e.target.value)}
                  placeholder="noreply@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sender Name
                </label>
                <Input
                  value={settings.email.senderName}
                  onChange={(e) => handleChange("email", "senderName", e.target.value)}
                  placeholder="Company ERP"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.email.useSSL}
                  onChange={(e) => handleChange("email", "useSSL", e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Use SSL/TLS</label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SMS Settings */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">SMS Configuration</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.sms.enabled}
              onChange={(e) => handleChange("sms", "enabled", e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable SMS notifications
            </label>
          </div>

          {settings.sms.enabled && (
            <div className="grid grid-cols-2 gap-4 ml-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider
                </label>
                <select
                  value={settings.sms.provider}
                  onChange={(e) => handleChange("sms", "provider", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Twilio">Twilio</option>
                  <option value="MSG91">MSG91</option>
                  <option value="TextLocal">TextLocal</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <Input
                  type="password"
                  value={settings.sms.apiKey}
                  onChange={(e) => handleChange("sms", "apiKey", e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sender ID
                </label>
                <Input
                  value={settings.sms.senderId}
                  onChange={(e) => handleChange("sms", "senderId", e.target.value)}
                  placeholder="SUNNY"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stock Alerts */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Stock Alerts</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.stockAlerts.enabled}
              onChange={(e) => handleChange("stockAlerts", "enabled", e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable stock level alerts
            </label>
          </div>

          {settings.stockAlerts.enabled && (
            <div className="grid grid-cols-2 gap-4 ml-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fabric Minimum Threshold
                </label>
                <Input
                  type="number"
                  value={settings.stockAlerts.fabricMinimumThreshold}
                  onChange={(e) =>
                    handleChange(
                      "stockAlerts",
                      "fabricMinimumThreshold",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raw Material Minimum Threshold
                </label>
                <Input
                  type="number"
                  value={settings.stockAlerts.rawMaterialMinimumThreshold}
                  onChange={(e) =>
                    handleChange(
                      "stockAlerts",
                      "rawMaterialMinimumThreshold",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert Frequency
                </label>
                <select
                  value={settings.stockAlerts.frequency}
                  onChange={(e) => handleChange("stockAlerts", "frequency", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="realtime">Real-time (Immediate)</option>
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Summary</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Delay Alerts */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Order Delay Alerts</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.orderDelayAlerts.enabled}
              onChange={(e) => handleChange("orderDelayAlerts", "enabled", e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable order delay alerts
            </label>
          </div>

          {settings.orderDelayAlerts.enabled && (
            <div className="grid grid-cols-2 gap-4 ml-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delay Threshold (Days)
                </label>
                <Input
                  type="number"
                  value={settings.orderDelayAlerts.delayThresholdDays}
                  onChange={(e) =>
                    handleChange(
                      "orderDelayAlerts",
                      "delayThresholdDays",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Escalate After (Days)
                </label>
                <Input
                  type="number"
                  value={settings.orderDelayAlerts.escalateAfterDays}
                  onChange={(e) =>
                    handleChange(
                      "orderDelayAlerts",
                      "escalateAfterDays",
                      parseInt(e.target.value)
                    )
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Overdue Alerts */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Payment Overdue Alerts</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.paymentOverdueAlerts.enabled}
              onChange={(e) =>
                handleChange("paymentOverdueAlerts", "enabled", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable payment overdue alerts
            </label>
          </div>

          {settings.paymentOverdueAlerts.enabled && (
            <div className="ml-6 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send Reminders On (Days after due date)
              </label>
              <div className="flex gap-2 flex-wrap">
                {settings.paymentOverdueAlerts.reminderDays.map((day, index) => (
                  <div
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                  >
                    Day {day}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Reminders sent at 7, 14, 30, and 45 days overdue
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
