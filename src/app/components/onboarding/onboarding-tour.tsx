import { useState, useEffect } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  X,
  Sparkles,
  Play,
  Rocket,
  GraduationCap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface OnboardingTourProps {
  userRole: string;
  userName: string;
  isFirstLogin: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

interface TourStep {
  title: string;
  description: string;
  target: string;
  icon: React.ReactNode;
  action?: string;
  tip?: string;
}

export function OnboardingTour({
  userRole,
  userName,
  isFirstLogin,
  onComplete,
  onSkip,
}: OnboardingTourProps) {
  const [showWelcome, setShowWelcome] = useState(isFirstLogin);
  const [showTour, setShowTour] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Role-specific tour steps
  const getTourSteps = (): TourStep[] => {
    const commonSteps: TourStep[] = [
      {
        title: "Welcome to Your Dashboard",
        description: "This is your central command center. Here you'll see all the important metrics and updates relevant to your role.",
        target: "dashboard",
        icon: <Sparkles className="h-6 w-6 text-yellow-500" />,
        tip: "Bookmark this page for quick access!",
      },
      {
        title: "Navigation Sidebar",
        description: "Use the sidebar to navigate between different sections. Your role determines which features you can access.",
        target: "sidebar",
        icon: <GraduationCap className="h-6 w-6 text-blue-500" />,
        action: "Click on any menu item to explore",
      },
      {
        title: "Quick Actions",
        description: "Access frequently used features quickly from the action buttons at the top of your dashboard.",
        target: "quick-actions",
        icon: <Rocket className="h-6 w-6 text-purple-500" />,
        tip: "These shortcuts save you time!",
      },
    ];

    // Role-specific additional steps
    const roleSpecificSteps: Record<string, TourStep[]> = {
      "master-manager": [
        {
          title: "Master Admin Controls",
          description: "You have full system access. Monitor all departments, manage users, and configure system settings from here.",
          target: "master-controls",
          icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
          tip: "Use the notifications panel to stay updated on all activities",
        },
        {
          title: "Real-Time Analytics",
          description: "Track company-wide performance metrics, production status, and financial reports in real-time.",
          target: "analytics",
          icon: <Play className="h-6 w-6 text-indigo-500" />,
        },
      ],
      "hr": [
        {
          title: "Employee Management",
          description: "Manage your team, track attendance, handle leave requests, and monitor employee performance.",
          target: "hr-panel",
          icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
          action: "Try adding a new employee",
        },
        {
          title: "AI HR Assistant",
          description: "Your intelligent assistant can answer HR policy questions, generate reports, and provide insights.",
          target: "ai-assistant",
          icon: <Sparkles className="h-6 w-6 text-pink-500" />,
          tip: "Ask anything about HR policies!",
        },
      ],
      "measurement-expert": [
        {
          title: "Measurement Entry",
          description: "Enter customer measurements here. The system validates data and generates alerts for unusual measurements.",
          target: "measurement-entry",
          icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
          action: "Start with the AI Photo Measurement feature",
        },
        {
          title: "AI Photo Measurement",
          description: "Upload customer photos to automatically extract 9 body measurements with confidence scores!",
          target: "ai-photo",
          icon: <Sparkles className="h-6 w-6 text-purple-500" />,
          tip: "This can reduce measurement time by 70%!",
        },
      ],
      "production-manager": [
        {
          title: "Production Queue",
          description: "View and manage all orders in production. Track progress through each stage from cutting to finishing.",
          target: "production-queue",
          icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
        },
        {
          title: "Quality Control",
          description: "Mark quality checkpoints and flag issues. The system tracks defect rates and alerts supervisors.",
          target: "quality-control",
          icon: <Play className="h-6 w-6 text-red-500" />,
          tip: "Regular QC reduces return rates by 40%",
        },
      ],
      "dispatch": [
        {
          title: "Ready to Dispatch",
          description: "View completed orders ready for shipping. Generate invoices and update delivery status here.",
          target: "dispatch-panel",
          icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
        },
        {
          title: "WhatsApp Notifications",
          description: "Send automated order updates to customers via WhatsApp with one click!",
          target: "whatsapp",
          icon: <Sparkles className="h-6 w-6 text-green-500" />,
          tip: "Customers love instant updates!",
        },
      ],
      "accountant": [
        {
          title: "Financial Dashboard",
          description: "Track revenue, expenses, pending payments, and generate financial reports.",
          target: "finance-panel",
          icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
        },
        {
          title: "Invoice Management",
          description: "Create, send, and track invoices. The system automatically calculates taxes and totals.",
          target: "invoices",
          icon: <Play className="h-6 w-6 text-blue-500" />,
          action: "Try generating a sample invoice",
        },
      ],
    };

    return [
      ...commonSteps,
      ...(roleSpecificSteps[userRole] || []),
      {
        title: "You're All Set!",
        description: "You've completed the tour! Feel free to explore the system. You can always restart this tour from Settings.",
        target: "complete",
        icon: <Rocket className="h-6 w-6 text-green-500" />,
        tip: "Need help? Check the Help Center or contact support.",
      },
    ];
  };

  const tourSteps = getTourSteps();
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setShowTour(false);
    setShowWelcome(false);
    onComplete();
  };

  const handleSkipTour = () => {
    setShowTour(false);
    setShowWelcome(false);
    onSkip();
  };

  const startTour = () => {
    setShowWelcome(false);
    setShowTour(true);
    setCurrentStep(0);
  };

  return (
    <>
      {/* Welcome Dialog */}
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            <DialogTitle className="text-center text-3xl">
              Welcome to Sunny Tailor ERP! 🎉
            </DialogTitle>
            <DialogDescription className="text-center text-lg mt-2">
              Hi <span className="font-semibold text-indigo-600">{userName}</span>! 
              Let's get you started with a quick tour.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    Interactive Tour (5 minutes)
                  </h3>
                  <p className="text-sm text-gray-700">
                    We'll walk you through the key features of your role as a{" "}
                    <span className="font-semibold">{userRole.replace("-", " ").toUpperCase()}</span>.
                    This tour is tailored specifically for you!
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <p className="text-xs font-medium text-gray-700">Interactive</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-xs font-medium text-gray-700">Easy to Follow</p>
              </Card>
              <Card className="p-4 text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Rocket className="h-5 w-5 text-blue-600" />
                </div>
                <p className="text-xs font-medium text-gray-700">Quick Start</p>
              </Card>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button variant="outline" onClick={handleSkipTour} className="flex-1">
              Skip for Now
            </Button>
            <Button onClick={startTour} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
              <Play className="h-4 w-4 mr-2" />
              Start Tour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tour Dialog */}
      <Dialog open={showTour} onOpenChange={setShowTour}>
        <DialogContent className="max-w-3xl">
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Step {currentStep + 1} of {tourSteps.length}
              </span>
              <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <DialogHeader>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  {tourSteps[currentStep].icon}
                </div>
                <div className="flex-1">
                  <DialogTitle className="text-xl">
                    {tourSteps[currentStep].title}
                  </DialogTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSkipTour}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <DialogDescription className="text-base leading-relaxed">
                {tourSteps[currentStep].description}
              </DialogDescription>
            </motion.div>
          </DialogHeader>

          <div className="py-6 space-y-4">
            {tourSteps[currentStep].action && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Try this:</p>
                    <p className="text-sm text-blue-800 mt-1">{tourSteps[currentStep].action}</p>
                  </div>
                </div>
              </Card>
            )}

            {tourSteps[currentStep].tip && (
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-900">Pro Tip:</p>
                    <p className="text-sm text-green-800 mt-1">{tourSteps[currentStep].tip}</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Step Indicator */}
            <div className="flex items-center justify-center gap-2 pt-4">
              {tourSteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`transition-all ${
                    index === currentStep
                      ? "w-8 h-2 bg-indigo-600"
                      : index < currentStep || completedSteps.includes(index)
                      ? "w-2 h-2 bg-green-500"
                      : "w-2 h-2 bg-gray-300"
                  } rounded-full`}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button onClick={handleNext} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
              {currentStep === tourSteps.length - 1 ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Complete Tour
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
