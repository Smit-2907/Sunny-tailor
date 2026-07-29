import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  CheckCircle2,
  Circle,
  Trophy,
  Target,
  Zap,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  action: string;
  completed: boolean;
  points: number;
}

interface QuickStartChecklistProps {
  userRole: string;
  onItemComplete: (itemId: string) => void;
  onDismiss: () => void;
}

export function QuickStartChecklist({
  userRole,
  onItemComplete,
  onDismiss,
}: QuickStartChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const getChecklistItems = (): ChecklistItem[] => {
    const commonItems: ChecklistItem[] = [
      {
        id: "complete-profile",
        title: "Complete Your Profile",
        description: "Add your photo and contact information",
        action: "Go to Settings → Account",
        completed: false,
        points: 10,
      },
      {
        id: "explore-dashboard",
        title: "Explore Your Dashboard",
        description: "Familiarize yourself with key metrics and widgets",
        action: "Browse your dashboard",
        completed: false,
        points: 5,
      },
    ];

    const roleSpecificItems: Record<string, ChecklistItem[]> = {
      "master-manager": [
        {
          id: "review-departments",
          title: "Review All Departments",
          description: "Check status of each department and team",
          action: "Visit each department dashboard",
          completed: false,
          points: 15,
        },
        {
          id: "setup-notifications",
          title: "Configure Notifications",
          description: "Set up alerts for critical events",
          action: "Go to Settings → Notifications",
          completed: false,
          points: 10,
        },
        {
          id: "review-analytics",
          title: "Review Analytics",
          description: "Check company-wide performance metrics",
          action: "Visit Analytics Dashboard",
          completed: false,
          points: 15,
        },
      ],
      hr: [
        {
          id: "review-employees",
          title: "Review Employee List",
          description: "Check all active employees and their roles",
          action: "Go to Employee Management",
          completed: false,
          points: 15,
        },
        {
          id: "check-attendance",
          title: "Check Today's Attendance",
          description: "Review attendance records and mark any absences",
          action: "Go to Attendance Tracker",
          completed: false,
          points: 10,
        },
        {
          id: "try-ai-assistant",
          title: "Try AI HR Assistant",
          description: "Ask a question to your intelligent HR assistant",
          action: "Click on AI Assistant",
          completed: false,
          points: 10,
        },
      ],
      "measurement-expert": [
        {
          id: "view-pending",
          title: "View Pending Measurements",
          description: "Check orders waiting for measurement entry",
          action: "Go to Pending Orders",
          completed: false,
          points: 15,
        },
        {
          id: "try-ai-photo",
          title: "Try AI Photo Measurement",
          description: "Upload a sample photo to see AI in action",
          action: "Go to AI Photo Measurement",
          completed: false,
          points: 20,
        },
        {
          id: "complete-measurement",
          title: "Complete Your First Measurement",
          description: "Enter measurements for an order",
          action: "Select an order and enter data",
          completed: false,
          points: 15,
        },
      ],
      "production-manager": [
        {
          id: "review-queue",
          title: "Review Production Queue",
          description: "Check all orders in production",
          action: "Go to Production Queue",
          completed: false,
          points: 15,
        },
        {
          id: "mark-stage",
          title: "Update Production Stage",
          description: "Move an order to the next production stage",
          action: "Select order and update status",
          completed: false,
          points: 15,
        },
        {
          id: "quality-check",
          title: "Perform Quality Check",
          description: "Mark quality checkpoints for an order",
          action: "Go to Quality Control",
          completed: false,
          points: 20,
        },
      ],
      dispatch: [
        {
          id: "ready-orders",
          title: "Check Ready Orders",
          description: "View all orders ready for dispatch",
          action: "Go to Ready to Dispatch",
          completed: false,
          points: 15,
        },
        {
          id: "send-whatsapp",
          title: "Send WhatsApp Update",
          description: "Send an order update via WhatsApp",
          action: "Go to WhatsApp Business",
          completed: false,
          points: 20,
        },
        {
          id: "generate-invoice",
          title: "Generate Invoice",
          description: "Create an invoice for a completed order",
          action: "Select order and generate invoice",
          completed: false,
          points: 15,
        },
      ],
      accountant: [
        {
          id: "review-finances",
          title: "Review Financial Summary",
          description: "Check revenue, expenses, and profit margins",
          action: "Go to Financial Dashboard",
          completed: false,
          points: 15,
        },
        {
          id: "check-pending",
          title: "Check Pending Payments",
          description: "Review outstanding invoices and payments",
          action: "Go to Payments Tracker",
          completed: false,
          points: 15,
        },
        {
          id: "generate-report",
          title: "Generate a Report",
          description: "Create your first financial report",
          action: "Go to Reports & Analytics",
          completed: false,
          points: 20,
        },
      ],
    };

    return [
      ...commonItems,
      ...(roleSpecificItems[userRole] || []),
    ];
  };

  const [items, setItems] = useState(getChecklistItems());

  const handleToggle = (itemId: string) => {
    if (checkedItems.includes(itemId)) {
      setCheckedItems(checkedItems.filter((id) => id !== itemId));
    } else {
      setCheckedItems([...checkedItems, itemId]);
      onItemComplete(itemId);
    }

    setItems(
      items.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const completedCount = checkedItems.length;
  const totalCount = items.length;
  const progress = (completedCount / totalCount) * 100;
  const totalPoints = items.reduce((sum, item) => sum + (checkedItems.includes(item.id) ? item.points : 0), 0);
  const maxPoints = items.reduce((sum, item) => sum + item.points, 0);

  const isFullyCompleted = completedCount === totalCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-2 border-indigo-200 shadow-lg">
        {/* Header */}
        <div
          className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
                {isFullyCompleted ? (
                  <Trophy className="h-5 w-5 text-white" />
                ) : (
                  <Target className="h-5 w-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  Quick Start Checklist
                  {isFullyCompleted && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      Complete! 🎉
                    </span>
                  )}
                </h3>
                <p className="text-sm text-white/90">
                  {completedCount} of {totalCount} tasks completed • {totalPoints}/{maxPoints} points
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
              >
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <Progress value={progress} className="h-2 bg-white/20" />
          </div>
        </div>

        {/* Checklist Items */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`p-4 transition-all cursor-pointer ${
                        checkedItems.includes(item.id)
                          ? "bg-green-50 border-green-300"
                          : "hover:bg-gray-50 border-gray-200"
                      }`}
                      onClick={() => handleToggle(item.id)}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={checkedItems.includes(item.id)}
                          onCheckedChange={() => handleToggle(item.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4
                              className={`font-semibold ${
                                checkedItems.includes(item.id)
                                  ? "text-green-900 line-through"
                                  : "text-gray-900"
                              }`}
                            >
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                              <Zap className="h-3 w-3" />
                              {item.points} pts
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {item.action}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Completion Message */}
              {isFullyCompleted && (
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-t border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-900">
                        Congratulations! 🎉
                      </h4>
                      <p className="text-sm text-green-800">
                        You've completed all tasks and earned {maxPoints} points! You're ready to start using the system.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
