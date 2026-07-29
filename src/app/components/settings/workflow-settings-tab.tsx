import { Input } from "@/app/components/ui/input";
import { type WorkflowSettings } from "@/app/data/mock-settings";
import { CheckCircle2, UserCheck, ShoppingCart, DollarSign, Factory } from "lucide-react";

interface WorkflowSettingsTabProps {
  settings: WorkflowSettings;
  onChange: (settings: WorkflowSettings) => void;
}

export function WorkflowSettingsTab({ settings, onChange }: WorkflowSettingsTabProps) {
  const handleChange = (
    section: keyof WorkflowSettings,
    field: string,
    value: any
  ) => {
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
      {/* Order Approval */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingCart className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Order Approval Workflow</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.orderApproval.enabled}
              onChange={(e) =>
                handleChange("orderApproval", "enabled", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable order approval workflow
            </label>
          </div>

          {settings.orderApproval.enabled && (
            <div className="grid grid-cols-2 gap-4 ml-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Approval Levels
                </label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={settings.orderApproval.levels}
                  onChange={(e) =>
                    handleChange("orderApproval", "levels", parseInt(e.target.value))
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of approval levels required
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-Approve Below (₹)
                </label>
                <Input
                  type="number"
                  value={settings.orderApproval.autoApproveBelow}
                  onChange={(e) =>
                    handleChange("orderApproval", "autoApproveBelow", parseInt(e.target.value))
                  }
                />
                <p className="text-xs text-gray-500 mt-1">
                  Orders below this amount are auto-approved
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Leave Approval */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Leave Approval Workflow</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.leaveApproval.enabled}
              onChange={(e) =>
                handleChange("leaveApproval", "enabled", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable leave approval workflow
            </label>
          </div>

          {settings.leaveApproval.enabled && (
            <div className="space-y-3 ml-6 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.leaveApproval.requireManagerApproval}
                  onChange={(e) =>
                    handleChange("leaveApproval", "requireManagerApproval", e.target.checked)
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Require Manager Approval
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.leaveApproval.requireHRApproval}
                  onChange={(e) =>
                    handleChange("leaveApproval", "requireHRApproval", e.target.checked)
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Require HR Approval
                </label>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auto-Approve Below (Days)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={settings.leaveApproval.autoApproveBelow}
                  onChange={(e) =>
                    handleChange("leaveApproval", "autoApproveBelow", parseInt(e.target.value))
                  }
                  className="w-48"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave requests below this duration are auto-approved
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Purchase Order Approval */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            Purchase Order Approval Workflow
          </h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.purchaseOrderApproval.enabled}
              onChange={(e) =>
                handleChange("purchaseOrderApproval", "enabled", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable purchase order approval workflow
            </label>
          </div>

          {settings.purchaseOrderApproval.enabled && (
            <div className="ml-6 mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Threshold Amount (₹)
              </label>
              <Input
                type="number"
                value={settings.purchaseOrderApproval.thresholdAmount}
                onChange={(e) =>
                  handleChange(
                    "purchaseOrderApproval",
                    "thresholdAmount",
                    parseInt(e.target.value)
                  )
                }
                className="w-64"
              />
              <p className="text-xs text-gray-500 mt-1">
                POs above this amount require approval
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Approval */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Payment Approval Workflow</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.paymentApproval.enabled}
              onChange={(e) =>
                handleChange("paymentApproval", "enabled", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable payment approval workflow
            </label>
          </div>

          {settings.paymentApproval.enabled && (
            <div className="space-y-4 ml-6 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Threshold Amount (₹)
                </label>
                <Input
                  type="number"
                  value={settings.paymentApproval.thresholdAmount}
                  onChange={(e) =>
                    handleChange(
                      "paymentApproval",
                      "thresholdAmount",
                      parseInt(e.target.value)
                    )
                  }
                  className="w-64"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Payments above this amount require approval
                </p>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.paymentApproval.requireDualApproval}
                  onChange={(e) =>
                    handleChange("paymentApproval", "requireDualApproval", e.target.checked)
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Require Dual Approval (two approvers)
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Production Stage Gates */}
      <div className="border border-gray-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Factory className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold text-gray-900">Production Stage Gates</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={settings.productionStageGates.enabled}
              onChange={(e) =>
                handleChange("productionStageGates", "enabled", e.target.checked)
              }
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">
              Enable production stage gate workflow
            </label>
          </div>

          {settings.productionStageGates.enabled && (
            <div className="space-y-4 ml-6 mt-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.productionStageGates.requireQualityCheck}
                  onChange={(e) =>
                    handleChange(
                      "productionStageGates",
                      "requireQualityCheck",
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Require quality check at each stage
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Production Stages
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-wrap gap-2">
                    {settings.productionStageGates.stages.map((stage, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-700"
                      >
                        {index + 1}. {stage}
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Orders must pass through each stage sequentially
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
