import { useState } from "react";
import {
  Settings,
  Building2,
  GitBranch,
  Bell,
  Briefcase,
  Plug,
  Shield,
  Database,
  Sliders,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { GeneralSettingsTab } from "@/app/components/settings/general-settings-tab";
import { WorkflowSettingsTab } from "@/app/components/settings/workflow-settings-tab";
import { NotificationSettingsTab } from "@/app/components/settings/notification-settings-tab";
import { BusinessRulesTab } from "@/app/components/settings/business-rules-tab";
import { IntegrationSettingsTab } from "@/app/components/settings/integration-settings-tab";
import { SecuritySettingsTab } from "@/app/components/settings/security-settings-tab";
import { BackupSettingsTab } from "@/app/components/settings/backup-settings-tab";
import { DefaultValuesTab } from "@/app/components/settings/default-values-tab";
import {
  mockGeneralSettings,
  mockWorkflowSettings,
  mockNotificationSettings,
  mockBusinessRules,
  mockIntegrationSettings,
  mockSecuritySettings,
  mockBackupSettings,
  mockDefaultValues,
} from "@/app/data/mock-settings";

type SettingsTab =
  | "general"
  | "workflow"
  | "notifications"
  | "business"
  | "integrations"
  | "security"
  | "backup"
  | "defaults";

export function SettingsHub() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Settings state
  const [generalSettings, setGeneralSettings] = useState(mockGeneralSettings);
  const [workflowSettings, setWorkflowSettings] = useState(mockWorkflowSettings);
  const [notificationSettings, setNotificationSettings] = useState(mockNotificationSettings);
  const [businessRules, setBusinessRules] = useState(mockBusinessRules);
  const [integrationSettings, setIntegrationSettings] = useState(mockIntegrationSettings);
  const [securitySettings, setSecuritySettings] = useState(mockSecuritySettings);
  const [backupSettings, setBackupSettings] = useState(mockBackupSettings);
  const [defaultValues, setDefaultValues] = useState(mockDefaultValues);

  const tabs = [
    {
      id: "general" as const,
      label: "General",
      icon: Building2,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Company info and regional settings",
    },
    {
      id: "workflow" as const,
      label: "Workflows",
      icon: GitBranch,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Approval workflows and processes",
    },
    {
      id: "notifications" as const,
      label: "Notifications",
      icon: Bell,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Email, SMS and alert settings",
    },
    {
      id: "business" as const,
      label: "Business Rules",
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Payment terms and business logic",
    },
    {
      id: "integrations" as const,
      label: "Integrations",
      icon: Plug,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: "Third-party integrations and APIs",
    },
    {
      id: "security" as const,
      label: "Security",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: "Password policies and access control",
    },
    {
      id: "backup" as const,
      label: "Backup",
      icon: Database,
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      description: "Backup schedules and recovery",
    },
    {
      id: "defaults" as const,
      label: "Defaults",
      icon: Sliders,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      description: "Default values and presets",
    },
  ];

  const handleSave = () => {
    setSaveStatus("saving");
    setHasUnsavedChanges(false);

    // Simulate API call
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => {
        setSaveStatus("idle");
      }, 3000);
    }, 1000);
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all changes? This will discard any unsaved modifications.")) {
      // Reset to mock data
      setGeneralSettings(mockGeneralSettings);
      setWorkflowSettings(mockWorkflowSettings);
      setNotificationSettings(mockNotificationSettings);
      setBusinessRules(mockBusinessRules);
      setIntegrationSettings(mockIntegrationSettings);
      setSecuritySettings(mockSecuritySettings);
      setBackupSettings(mockBackupSettings);
      setDefaultValues(mockDefaultValues);
      setHasUnsavedChanges(false);
      setSaveStatus("idle");
    }
  };

  const markAsChanged = () => {
    setHasUnsavedChanges(true);
    setSaveStatus("idle");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">System Configuration</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage system-wide settings and preferences
            </p>
          </div>
        </div>

        {/* Save Status */}
        <div className="flex items-center gap-3">
          {saveStatus === "saved" && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Changes saved successfully</span>
            </div>
          )}
          {saveStatus === "error" && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Failed to save changes</span>
            </div>
          )}
          {hasUnsavedChanges && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
              Unsaved Changes
            </Badge>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <Card className="p-2">
        <div className="grid grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-lg text-left transition-all ${
                  isActive
                    ? `${tab.bgColor} border-2 border-${tab.color.replace("text-", "")}`
                    : "bg-white border-2 border-transparent hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isActive ? tab.bgColor : "bg-gray-100"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? tab.color : "text-gray-600"}`} />
                  </div>
                  <span
                    className={`font-semibold text-sm ${
                      isActive ? tab.color : "text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 ml-11">{tab.description}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Tab Content */}
      <Card className="p-6">
        {activeTab === "general" && (
          <GeneralSettingsTab
            settings={generalSettings}
            onChange={(settings) => {
              setGeneralSettings(settings);
              markAsChanged();
            }}
          />
        )}
        {activeTab === "workflow" && (
          <WorkflowSettingsTab
            settings={workflowSettings}
            onChange={(settings) => {
              setWorkflowSettings(settings);
              markAsChanged();
            }}
          />
        )}
        {activeTab === "notifications" && (
          <NotificationSettingsTab
            settings={notificationSettings}
            onChange={(settings) => {
              setNotificationSettings(settings);
              markAsChanged();
            }}
          />
        )}
        {activeTab === "business" && (
          <BusinessRulesTab
            settings={businessRules}
            onChange={(settings) => {
              setBusinessRules(settings);
              markAsChanged();
            }}
          />
        )}
        {activeTab === "integrations" && (
          <IntegrationSettingsTab
            settings={integrationSettings}
            onChange={(settings) => {
              setIntegrationSettings(settings);
              markAsChanged();
            }}
          />
        )}
        {activeTab === "security" && (
          <SecuritySettingsTab
            settings={securitySettings}
            onChange={(settings) => {
              setSecuritySettings(settings);
              markAsChanged();
            }}
          />
        )}
        {activeTab === "backup" && (
          <BackupSettingsTab
            settings={backupSettings}
            onChange={(settings) => {
              setBackupSettings(settings);
              markAsChanged();
            }}
          />
        )}
        {activeTab === "defaults" && (
          <DefaultValuesTab
            settings={defaultValues}
            onChange={(settings) => {
              setDefaultValues(settings);
              markAsChanged();
            }}
          />
        )}
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 sticky bottom-4 shadow-lg">
        <div className="text-sm text-gray-600">
          {hasUnsavedChanges
            ? "You have unsaved changes. Click Save to apply them."
            : "All changes are saved."}
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasUnsavedChanges && saveStatus !== "saved"}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Changes
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasUnsavedChanges || saveStatus === "saving"}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {saveStatus === "saving" ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
