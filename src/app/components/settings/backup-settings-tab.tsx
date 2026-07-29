import { Input } from "@/app/components/ui/input";
import { type BackupSettings } from "@/app/data/mock-settings";
import { Database, Clock, HardDrive, Bell } from "lucide-react";

interface BackupSettingsTabProps {
  settings: BackupSettings;
  onChange: (settings: BackupSettings) => void;
}

export function BackupSettingsTab({ settings, onChange }: BackupSettingsTabProps) {
  const handleChange = (section: keyof BackupSettings, field: string, value: any) => {
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
      {/* Automated Backup */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Automated Backup</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.automated.enabled}
              onChange={(e) => handleChange("automated", "enabled", e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable automated backups
            </label>
          </div>

          {settings.automated.enabled && (
            <div className="grid grid-cols-2 gap-4 ml-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                <select
                  value={settings.automated.frequency}
                  onChange={(e) => handleChange("automated", "frequency", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Backup Time
                </label>
                <Input
                  type="time"
                  value={settings.automated.time}
                  onChange={(e) => handleChange("automated", "time", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Retention Policy */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Retention Policy</h3>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Daily Backups
            </label>
            <Input
              type="number"
              min="1"
              value={settings.retention.keepDailyBackups}
              onChange={(e) =>
                handleChange("retention", "keepDailyBackups", parseInt(e.target.value))
              }
            />
            <p className="text-xs text-gray-500 mt-1">Keep last N daily backups</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weekly Backups
            </label>
            <Input
              type="number"
              min="1"
              value={settings.retention.keepWeeklyBackups}
              onChange={(e) =>
                handleChange("retention", "keepWeeklyBackups", parseInt(e.target.value))
              }
            />
            <p className="text-xs text-gray-500 mt-1">Keep last N weekly backups</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Backups
            </label>
            <Input
              type="number"
              min="1"
              value={settings.retention.keepMonthlyBackups}
              onChange={(e) =>
                handleChange("retention", "keepMonthlyBackups", parseInt(e.target.value))
              }
            />
            <p className="text-xs text-gray-500 mt-1">Keep last N monthly backups</p>
          </div>
        </div>
      </div>

      {/* Backup Location */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Backup Location</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Storage Type
            </label>
            <select
              value={settings.location.type}
              onChange={(e) => handleChange("location", "type", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="local">Local Storage</option>
              <option value="cloud">Cloud Storage</option>
              <option value="both">Both (Local + Cloud)</option>
            </select>
          </div>

          {(settings.location.type === "cloud" || settings.location.type === "both") && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cloud Provider
                </label>
                <select
                  value={settings.location.cloudProvider}
                  onChange={(e) => handleChange("location", "cloudProvider", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="aws">AWS S3</option>
                  <option value="azure">Azure Blob</option>
                  <option value="google">Google Cloud</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bucket Name
                </label>
                <Input
                  value={settings.location.cloudBucket}
                  onChange={(e) => handleChange("location", "cloudBucket", e.target.value)}
                  placeholder="bucket-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <Input
                  value={settings.location.cloudRegion}
                  onChange={(e) => handleChange("location", "cloudRegion", e.target.value)}
                  placeholder="ap-south-1"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Backup Notifications</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications.notifyOnSuccess}
              onChange={(e) =>
                handleChange("notifications", "notifyOnSuccess", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Notify on successful backup</label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.notifications.notifyOnFailure}
              onChange={(e) =>
                handleChange("notifications", "notifyOnFailure", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Notify on backup failure</label>
          </div>
        </div>
      </div>
    </div>
  );
}
