import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import {
  X,
  Lightbulb,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface FeatureHighlight {
  id: string;
  title: string;
  description: string;
  benefit: string;
  target: string;
  position: "top" | "bottom" | "left" | "right";
}

interface FeatureHighlightsProps {
  userRole: string;
  onDismiss: () => void;
  currentView: string;
}

export function FeatureHighlights({
  userRole,
  onDismiss,
  currentView,
}: FeatureHighlightsProps) {
  const [currentHighlight, setCurrentHighlight] = useState(0);

  const getHighlights = (): FeatureHighlight[] => {
    const roleHighlights: Record<string, FeatureHighlight[]> = {
      "master-manager": [
        {
          id: "real-time-dashboard",
          title: "Real-Time Dashboard",
          description: "Monitor all departments simultaneously with live updates",
          benefit: "Stay informed without checking each department individually",
          target: "dashboard-widgets",
          position: "bottom",
        },
        {
          id: "notification-center",
          title: "Smart Notifications",
          description: "Get alerts for critical events across all departments",
          benefit: "Never miss important updates or issues",
          target: "notifications",
          position: "left",
        },
        {
          id: "analytics-panel",
          title: "Advanced Analytics",
          description: "Access comprehensive reports and data visualizations",
          benefit: "Make data-driven decisions quickly",
          target: "analytics",
          position: "right",
        },
      ],
      hr: [
        {
          id: "ai-assistant",
          title: "AI HR Assistant",
          description: "Get instant answers to HR policy questions",
          benefit: "Save time on routine inquiries",
          target: "ai-assistant",
          position: "right",
        },
        {
          id: "attendance-tracker",
          title: "Biometric Attendance",
          description: "Track employee attendance automatically",
          benefit: "Eliminate manual attendance marking",
          target: "attendance",
          position: "bottom",
        },
        {
          id: "leave-management",
          title: "Smart Leave System",
          description: "Approve/reject leave requests with one click",
          benefit: "Streamline leave management process",
          target: "leave",
          position: "left",
        },
      ],
      "measurement-expert": [
        {
          id: "ai-photo-measurement",
          title: "AI Photo Measurement",
          description: "Extract 9 body measurements from a single photo",
          benefit: "70% faster than manual measurement",
          target: "ai-photo",
          position: "right",
        },
        {
          id: "measurement-validation",
          title: "Smart Validation",
          description: "System flags unusual measurements automatically",
          benefit: "Reduce measurement errors by 90%",
          target: "validation",
          position: "bottom",
        },
        {
          id: "try-on-preview",
          title: "Try-On Beta",
          description: "Show customers how garments will look on them",
          benefit: "Increase customer confidence and sales",
          target: "tryon",
          position: "left",
        },
      ],
      "production-manager": [
        {
          id: "production-queue",
          title: "Smart Production Queue",
          description: "Orders automatically prioritized by deadline",
          benefit: "Never miss a delivery date",
          target: "queue",
          position: "bottom",
        },
        {
          id: "qr-tracking",
          title: "QR Code Tracking",
          description: "Scan QR codes to update production stages",
          benefit: "Real-time production visibility",
          target: "qr-scanner",
          position: "right",
        },
        {
          id: "quality-alerts",
          title: "Quality Alerts",
          description: "Instant notifications for quality issues",
          benefit: "Catch defects before completion",
          target: "quality",
          position: "left",
        },
      ],
      dispatch: [
        {
          id: "whatsapp-updates",
          title: "WhatsApp Updates",
          description: "Send automated order updates to customers",
          benefit: "Reduce customer inquiry calls by 60%",
          target: "whatsapp",
          position: "right",
        },
        {
          id: "batch-invoicing",
          title: "Batch Invoicing",
          description: "Generate multiple invoices at once",
          benefit: "Save hours on invoice creation",
          target: "invoices",
          position: "bottom",
        },
        {
          id: "delivery-tracking",
          title: "Delivery Tracking",
          description: "Track all dispatched orders in real-time",
          benefit: "Proactive delivery management",
          target: "tracking",
          position: "left",
        },
      ],
      accountant: [
        {
          id: "auto-calculations",
          title: "Smart Calculations",
          description: "Automatic tax and total calculations",
          benefit: "Zero calculation errors",
          target: "calculator",
          position: "right",
        },
        {
          id: "payment-reminders",
          title: "Payment Reminders",
          description: "Automated reminders for pending payments",
          benefit: "Improve cash flow by 40%",
          target: "reminders",
          position: "bottom",
        },
        {
          id: "financial-reports",
          title: "One-Click Reports",
          description: "Generate comprehensive financial reports instantly",
          benefit: "Save days of manual work",
          target: "reports",
          position: "left",
        },
      ],
    };

    return roleHighlights[userRole] || [];
  };

  const highlights = getHighlights();

  if (highlights.length === 0) return null;

  const currentFeature = highlights[currentHighlight];

  const handleNext = () => {
    if (currentHighlight < highlights.length - 1) {
      setCurrentHighlight(currentHighlight + 1);
    } else {
      onDismiss();
    }
  };

  const handleSkip = () => {
    onDismiss();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50 w-96"
      >
        <Card className="overflow-hidden border-2 border-yellow-300 shadow-2xl">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-400">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Lightbulb className="h-4 w-4 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-white">Feature Highlight</h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={handleSkip}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <motion.div
              key={currentHighlight}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  <h4 className="font-bold text-lg text-gray-900">
                    {currentFeature.title}
                  </h4>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  {currentFeature.description}
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-green-900 mb-1">
                    💡 Benefit:
                  </p>
                  <p className="text-sm text-green-800">
                    {currentFeature.benefit}
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {highlights.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 rounded-full transition-all ${
                      index === currentHighlight
                        ? "w-8 bg-indigo-600"
                        : index < currentHighlight
                        ? "w-2 bg-green-500"
                        : "w-2 bg-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="flex-1"
                >
                  Skip All
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  {currentHighlight === highlights.length - 1 ? (
                    "Got it!"
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Step Counter */}
          <div className="px-4 py-2 bg-gray-50 border-t text-center">
            <p className="text-xs text-gray-600">
              Tip {currentHighlight + 1} of {highlights.length}
            </p>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
