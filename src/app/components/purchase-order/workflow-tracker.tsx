import { CheckCircle, Circle, FileText, Users, Ruler, Package } from "lucide-react";
import { Card } from "@/app/components/ui/card";

interface WorkflowTrackerProps {
  currentStep: "po-created" | "employees-uploaded" | "in-measurement" | "measurement-completed";
}

export function WorkflowTracker({ currentStep }: WorkflowTrackerProps) {
  const steps = [
    {
      key: "po-created",
      label: "PO Created",
      icon: FileText,
      description: "Purchase order generated",
    },
    {
      key: "employees-uploaded",
      label: "Employees Uploaded",
      icon: Users,
      description: "Employee list uploaded and linked",
    },
    {
      key: "in-measurement",
      label: "Measurement Entry",
      icon: Ruler,
      description: "Recording employee measurements",
    },
    {
      key: "measurement-completed",
      label: "Ready for Production",
      icon: Package,
      description: "All measurements completed",
    },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
      <h3 className="text-sm font-semibold text-indigo-900 mb-4">Workflow Progress</h3>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isUpcoming = index > currentStepIndex;

          return (
            <div key={step.key} className="flex items-center flex-1">
              {/* Step */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-12 h-12 rounded-full border-2 mb-2
                    ${isCompleted ? "bg-green-500 border-green-500 text-white" : ""}
                    ${isCurrent ? "bg-indigo-600 border-indigo-600 text-white" : ""}
                    ${isUpcoming ? "bg-white border-gray-300 text-gray-400" : ""}
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <p
                  className={`
                    text-xs font-medium text-center max-w-[100px]
                    ${isCompleted ? "text-green-700" : ""}
                    ${isCurrent ? "text-indigo-700" : ""}
                    ${isUpcoming ? "text-gray-400" : ""}
                  `}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground text-center max-w-[120px] mt-1">
                  {step.description}
                </p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 mb-12">
                  <div
                    className={`
                      h-full
                      ${isCompleted ? "bg-green-500" : ""}
                      ${isCurrent ? "bg-indigo-300" : ""}
                      ${isUpcoming ? "bg-gray-300" : ""}
                    `}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
