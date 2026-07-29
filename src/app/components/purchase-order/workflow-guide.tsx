import { 
  FileText, 
  Users, 
  Ruler, 
  Package, 
  Truck, 
  CheckCircle,
  ArrowRight,
  Building2
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

interface WorkflowGuideProps {
  onClose: () => void;
}

export function WorkflowGuide({ onClose }: WorkflowGuideProps) {
  const phases = [
    {
      phase: "Phase 1: Order Initiation",
      color: "indigo",
      steps: [
        {
          icon: FileText,
          title: "Purchase Order Creation",
          role: "Master Manager",
          description: "Create new PO with client details, quantity, delivery deadline, and uniform type",
          output: "PO Number (e.g., PO-2026-1001)",
        }
      ]
    },
    {
      phase: "Phase 2: Employee Data Collection",
      color: "blue",
      steps: [
        {
          icon: Users,
          title: "Employee List Upload",
          role: "HR / Master Manager",
          description: "Upload Excel file with employee details and link to specific PO number. System auto-assigns unique serial numbers",
          output: "Employee list linked to PO with unique serial numbers",
        }
      ]
    },
    {
      phase: "Phase 3: Measurement Collection",
      color: "cyan",
      steps: [
        {
          icon: Ruler,
          title: "Measurement Entry",
          role: "Measurement Expert",
          description: "View employees under specific PO, enter measurements (manual or AI photo), select fit type, and track progress",
          output: "Complete measurement data with fit type for all employees",
        }
      ]
    },
    {
      phase: "Phase 4: Production (Coming Soon)",
      color: "purple",
      steps: [
        {
          icon: Package,
          title: "Fabric & Material Management",
          role: "Fabric Store & Raw Material Store",
          description: "Calculate fabric requirements, check inventory, allocate materials",
          output: "Materials ready for production",
        },
        {
          icon: Package,
          title: "Production Execution",
          role: "Production Manager",
          description: "Create production orders, track cutting, stitching, finishing, and quality check",
          output: "Finished garments ready for dispatch",
        }
      ]
    },
    {
      phase: "Phase 5: Dispatch (Coming Soon)",
      color: "green",
      steps: [
        {
          icon: Truck,
          title: "Packing & Delivery",
          role: "Dispatch & Accountant",
          description: "Pack by employee/branch, generate invoices, track payment",
          output: "Order delivered and payment received",
        }
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
      indigo: { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700", iconBg: "bg-indigo-600" },
      blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", iconBg: "bg-blue-600" },
      cyan: { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", iconBg: "bg-cyan-600" },
      purple: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", iconBg: "bg-purple-600" },
      green: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", iconBg: "bg-green-600" },
    };
    return colors[color] || colors.indigo;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-6xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold">Manufacturing Workflow Guide</h2>
              <p className="text-muted-foreground mt-1">
                Complete flow from PO creation to delivery
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>Close</Button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Current Implementation Badge */}
          <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">Currently Implemented: Phase 1-3</p>
                <p className="text-sm text-green-700">
                  PO Creation → Employee Upload → Measurement Entry (with Fit Type Selection)
                </p>
              </div>
            </div>
          </Card>

          {/* Workflow Phases */}
          {phases.map((phase, phaseIndex) => {
            const colors = getColorClasses(phase.color);
            const isImplemented = phaseIndex < 3;

            return (
              <div key={phaseIndex} className="relative">
                {/* Phase Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`px-4 py-2 rounded-lg ${colors.bg} ${colors.border} border-2`}>
                    <h3 className={`font-bold text-lg ${colors.text}`}>
                      {phase.phase}
                    </h3>
                  </div>
                  {isImplemented && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      ✓ Implemented
                    </span>
                  )}
                  {!isImplemented && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                      Coming Soon
                    </span>
                  )}
                </div>

                {/* Steps */}
                <div className="space-y-4 ml-6">
                  {phase.steps.map((step, stepIndex) => (
                    <Card key={stepIndex} className={`p-6 ${colors.bg} ${colors.border}`}>
                      <div className="flex gap-4">
                        <div className={`p-3 ${colors.iconBg} text-white rounded-lg h-fit`}>
                          <step.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-lg">{step.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                <strong>Role:</strong> {step.role}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm mb-3">{step.description}</p>
                          <div className={`p-3 bg-white rounded-lg border ${colors.border}`}>
                            <p className="text-xs text-muted-foreground mb-1">Output:</p>
                            <p className="text-sm font-medium">{step.output}</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Arrow between phases */}
                {phaseIndex < phases.length - 1 && (
                  <div className="flex justify-center my-6">
                    <ArrowRight className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Key Features */}
          <Card className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" />
              Key Features Currently Available
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <p className="font-semibold mb-1">PO-Based Organization</p>
                <p className="text-sm text-muted-foreground">
                  All employees are linked to specific purchase orders for better tracking
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <p className="font-semibold mb-1">Fit Type Selection</p>
                <p className="text-sm text-muted-foreground">
                  Choose between Medium Fit, Loose Fit, and Straight Fit for each employee
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <p className="font-semibold mb-1">Progress Tracking</p>
                <p className="text-sm text-muted-foreground">
                  Real-time tracking of measurement completion per PO with detailed statistics
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-indigo-200">
                <p className="font-semibold mb-1">AI Photo Measurement</p>
                <p className="text-sm text-muted-foreground">
                  Upload photos to automatically extract measurements using AI technology
                </p>
              </div>
            </div>
          </Card>

          {/* How to Use */}
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">How to Use the New Workflow</h3>
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="font-bold text-indigo-600 min-w-[24px]">1.</span>
                <span><strong>Master Manager:</strong> Create a Purchase Order with all client and order details</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-indigo-600 min-w-[24px]">2.</span>
                <span><strong>HR/Master Manager:</strong> Upload employee Excel file and link it to the PO</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-indigo-600 min-w-[24px]">3.</span>
                <span><strong>Measurement Expert:</strong> Select PO from the list and enter measurements for each employee</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-indigo-600 min-w-[24px]">4.</span>
                <span>For each employee: Select fit type, enter shirt and pant measurements, add remarks if needed</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-indigo-600 min-w-[24px]">5.</span>
                <span>Track progress in real-time - see how many measurements are completed, in progress, or pending</span>
              </li>
            </ol>
          </Card>
        </div>
      </Card>
    </div>
  );
}