import { Input } from "@/app/components/ui/input";
import { type SecuritySettings } from "@/app/data/mock-settings";
import { Lock, Shield, Clock, Database } from "lucide-react";

interface SecuritySettingsTabProps {
  settings: SecuritySettings;
  onChange: (settings: SecuritySettings) => void;
}

export function SecuritySettingsTab({ settings, onChange }: SecuritySettingsTabProps) {
  const handleChange = (section: keyof SecuritySettings, field: string, value: any) => {
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
      {/* Password Policy */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Password Policy</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Length</label>
            <Input
              type="number"
              min="6"
              max="20"
              value={settings.passwordPolicy.minLength}
              onChange={(e) =>
                handleChange("passwordPolicy", "minLength", parseInt(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Expiry (Days)
            </label>
            <Input
              type="number"
              value={settings.passwordPolicy.passwordExpiryDays}
              onChange={(e) =>
                handleChange("passwordPolicy", "passwordExpiryDays", parseInt(e.target.value))
              }
            />
          </div>

          <div className="col-span-2 space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireUppercase}
                onChange={(e) =>
                  handleChange("passwordPolicy", "requireUppercase", e.target.checked)
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Require uppercase letters</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireLowercase}
                onChange={(e) =>
                  handleChange("passwordPolicy", "requireLowercase", e.target.checked)
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Require lowercase letters</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireNumbers}
                onChange={(e) =>
                  handleChange("passwordPolicy", "requireNumbers", e.target.checked)
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Require numbers</label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.passwordPolicy.requireSpecialChars}
                onChange={(e) =>
                  handleChange("passwordPolicy", "requireSpecialChars", e.target.checked)
                }
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">Require special characters</label>
            </div>
          </div>
        </div>
      </div>

      {/* Session Settings */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Session Settings</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Timeout (Minutes)
            </label>
            <Input
              type="number"
              value={settings.sessionSettings.defaultTimeout}
              onChange={(e) =>
                handleChange("sessionSettings", "defaultTimeout", parseInt(e.target.value))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Concurrent Sessions
            </label>
            <Input
              type="number"
              value={settings.sessionSettings.maxConcurrentSessions}
              onChange={(e) =>
                handleChange(
                  "sessionSettings",
                  "maxConcurrentSessions",
                  parseInt(e.target.value)
                )
              }
            />
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.twoFactorAuth.enabled}
              onChange={(e) => handleChange("twoFactorAuth", "enabled", e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable Two-Factor Authentication
            </label>
          </div>

          {settings.twoFactorAuth.enabled && (
            <div className="ml-6 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth.enforceForAllUsers}
                  onChange={(e) =>
                    handleChange("twoFactorAuth", "enforceForAllUsers", e.target.checked)
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Enforce for all users</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Authentication Method
                </label>
                <select
                  value={settings.twoFactorAuth.method}
                  onChange={(e) => handleChange("twoFactorAuth", "method", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="email">Email OTP</option>
                  <option value="sms">SMS OTP</option>
                  <option value="authenticator">Authenticator App</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Encryption */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Data Encryption</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.dataEncryption.encryptDatabase}
              onChange={(e) =>
                handleChange("dataEncryption", "encryptDatabase", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Encrypt database</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.dataEncryption.encryptBackups}
              onChange={(e) =>
                handleChange("dataEncryption", "encryptBackups", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Encrypt backups</label>
          </div>
        </div>
      </div>
    </div>
  );
}
