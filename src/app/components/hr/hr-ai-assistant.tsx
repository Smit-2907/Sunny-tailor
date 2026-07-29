import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Calendar,
  DollarSign,
  Clock,
  FileText,
  HelpCircle,
  ChevronDown,
  Mic,
  MicOff,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { mockSalaryStructures } from "@/app/data/mock-payroll-data";
import { mockLeaveBalances } from "@/app/data/mock-attendance-data";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
}

interface QuickAction {
  label: string;
  action: () => void;
  icon?: any;
}

export function HRAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "👋 Hello! I'm your HR AI Assistant. I can help you with:\n\n• Leave policies & balance\n• Salary & payslip information\n• Attendance queries\n• HR policies & benefits\n• Tax & PF information\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Check for speech recognition support
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        setSpeechSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "en-IN"; // Indian English

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          
          // Handle different error types
          if (event.error === "not-allowed" || event.error === "permission-denied") {
            setMicPermission("denied");
            // Show inline error message instead of alert
            const errorMsg: Message = {
              id: Date.now().toString(),
              type: "bot",
              content: "🎤 **Microphone Access Required**\n\nI need access to your microphone to listen to your questions.\n\n**How to enable:**\n1. Click the 🔒 lock icon in your browser's address bar\n2. Find 'Microphone' permissions\n3. Select 'Allow'\n4. Refresh the page and try again\n\n**Alternative:** You can always type your questions instead!",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
          } else if (event.error === "no-speech") {
            const errorMsg: Message = {
              id: Date.now().toString(),
              type: "bot",
              content: "🎤 I didn't hear anything. Please try again and speak clearly.",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
          } else if (event.error === "audio-capture") {
            const errorMsg: Message = {
              id: Date.now().toString(),
              type: "bot",
              content: "🎤 **Microphone Not Found**\n\nI couldn't detect a microphone on your device.\n\n**Please check:**\n Your microphone is connected\n• Your browser has permission to access it\n• No other app is using the microphone\n\nYou can still type your questions!",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
          } else if (event.error === "network") {
            const errorMsg: Message = {
              id: Date.now().toString(),
              type: "bot",
              content: "🎤 Network error occurred. Please check your internet connection and try again.",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMsg]);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  // Check microphone permission on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.permissions) {
      navigator.permissions
        .query({ name: "microphone" as PermissionName })
        .then((permissionStatus) => {
          setMicPermission(permissionStatus.state as "granted" | "denied" | "prompt");
          
          permissionStatus.onchange = () => {
            setMicPermission(permissionStatus.state as "granted" | "denied" | "prompt");
          };
        })
        .catch((err) => {
          console.log("Permission API not supported:", err);
        });
    }
  }, []);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Toggle voice input
  const toggleVoiceInput = async () => {
    if (!speechSupported) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: "🎤 **Speech Recognition Not Supported**\n\nYour browser doesn't support voice input. Please use:\n• Google Chrome\n• Microsoft Edge\n• Safari (iOS 14.5+)\n\nYou can still type your questions!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    if (isListening) {
      // Stop listening
      try {
        recognitionRef.current?.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
      setIsListening(false);
      return;
    }

    // Check microphone permission before starting
    try {
      // Request microphone access using getUserMedia first
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Stop the stream immediately - we just needed to check permission
      stream.getTracks().forEach(track => track.stop());
      
      // Now start speech recognition
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setMicPermission("granted");
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
        
        const errorMsg: Message = {
          id: Date.now().toString(),
          type: "bot",
          content: "🎤 **Unable to Start Voice Input**\n\nThere was an issue starting the microphone. Please try again or use typing instead.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch (error: any) {
      console.error("Microphone permission error:", error);
      setMicPermission("denied");
      
      // Show detailed error message based on the error type
      let errorMessage = "";
      
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage = "🎤 **Microphone Access Denied**\n\nI need permission to use your microphone.\n\n**How to enable microphone:**\n\n**Chrome/Edge:**\n1. Click the 🔒 or 🛈 icon in your address bar\n2. Find 'Microphone' permissions\n3. Change to 'Allow'\n4. Refresh the page and try again\n\n**Safari:**\n1. Go to Safari → Settings → Websites\n2. Select 'Microphone'\n3. Set this website to 'Allow'\n4. Refresh the page\n\n**Alternative:** You can type your questions instead!";
      } else if (error.name === "NotFoundError") {
        errorMessage = "🎤 **No Microphone Found**\n\nI couldn't detect a microphone on your device.\n\n**Please check:**\n• Your microphone is connected\n• It's not being used by another app\n• Your device has microphone support\n\nYou can type your questions instead!";
      } else if (error.name === "NotReadableError") {
        errorMessage = "🎤 **Microphone In Use**\n\nYour microphone is already being used by another application.\n\n**Please:**\n• Close other apps using the microphone\n• Try again\n\nYou can type your questions instead!";
      } else {
        errorMessage = "🎤 **Microphone Error**\n\nThere was an issue accessing your microphone.\n\nError: " + error.name + "\n\nYou can type your questions instead!";
      }
      
      const errorMsg: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: errorMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Parse markdown in message content
  const parseMarkdown = (text: string) => {
    // Split by lines to preserve structure
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Parse bold text **text** -> <strong>text</strong>
      const parts = line.split(/(\*\*.*?\*\*)/g);
      
      return (
        <span key={lineIndex}>
          {parts.map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              // Bold text
              return <strong key={partIndex} className="font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  // AI Response Logic
  const generateAIResponse = (userMessage: string): Message => {
    const messageLower = userMessage.toLowerCase();
    let content = "";
    let quickActions: QuickAction[] = [];

    // Leave-related queries
    if (
      messageLower.includes("leave") &&
      (messageLower.includes("balance") ||
        messageLower.includes("available") ||
        messageLower.includes("remaining"))
    ) {
      const sampleBalance = mockLeaveBalances[0];
      content = `📅 **Your Leave Balance:**

**Casual Leave:** ${sampleBalance.casual.available} days available (${sampleBalance.casual.used} used of ${sampleBalance.casual.total})

**Sick Leave:** ${sampleBalance.sick.available} days available (${sampleBalance.sick.used} used of ${sampleBalance.sick.total})

**Earned Leave:** ${sampleBalance.earned.available} days available (${sampleBalance.earned.used} used of ${sampleBalance.earned.total})

**Compensatory Off:** ${sampleBalance.compensatory.available} days available

Would you like to apply for leave?`;
      quickActions = [
        { label: "Apply for Leave", action: () => console.log("Navigate to leave application") },
        { label: "View Leave History", action: () => console.log("Show leave history") },
      ];
    } else if (
      messageLower.includes("leave") &&
      (messageLower.includes("apply") || messageLower.includes("how"))
    ) {
      content = `📝 **How to Apply for Leave:**

1. Go to the **Leave Management** tab
2. Click on **"Apply for Leave"**
3. Select leave type (Casual/Sick/Earned)
4. Choose date range
5. Enter reason
6. Submit application

**Approval Process:**
- Your manager will be notified
- Typical approval time: 24-48 hours
- You'll receive an email notification

**Pro Tip:** Apply at least 3 days in advance for planned leaves!`;
      quickActions = [
        { label: "Apply Now", action: () => console.log("Navigate to leave application") },
      ];
    } else if (
      messageLower.includes("leave") &&
      messageLower.includes("policy")
    ) {
      content = `📋 **Leave Policy:**

**Annual Entitlement:**
• Casual Leave: 12 days/year
• Sick Leave: 12 days/year
• Earned Leave: 15 days/year
• National Holidays: As per calendar

**Rules:**
• Casual Leave: Min 3 days advance notice
• Sick Leave: Medical certificate required for >2 days
• Earned Leave: Can be carried forward (max 30 days)
• Half-day leave is allowed

**Leave Encashment:**
Earned leaves can be encashed at year-end.`;
    }

    // Salary-related queries
    else if (
      (messageLower.includes("salary") || messageLower.includes("payslip")) &&
      (messageLower.includes("structure") || messageLower.includes("breakdown"))
    ) {
      const sampleSalary = mockSalaryStructures[0];
      content = `💰 **Your Salary Structure:**

**Earnings:**
• Basic Salary: ${formatCurrency(sampleSalary.basic)}
• HRA (50% of Basic): ${formatCurrency(sampleSalary.hra)}
• Conveyance: ${formatCurrency(sampleSalary.conveyance)}
• Medical: ${formatCurrency(sampleSalary.medical)}
• Special Allowance: ${formatCurrency(sampleSalary.specialAllowance)}
• **Gross Salary:** ${formatCurrency(sampleSalary.grossSalary)}

**Deductions:**
• PF (12%): ${formatCurrency(sampleSalary.pf)}
${sampleSalary.esi > 0 ? `• ESI (0.75%): ${formatCurrency(sampleSalary.esi)}` : ""}
• Professional Tax: ${formatCurrency(sampleSalary.professionalTax)}
${sampleSalary.tds > 0 ? `• TDS: ${formatCurrency(sampleSalary.tds)}` : ""}
• **Total Deductions:** ${formatCurrency(sampleSalary.pf + sampleSalary.esi + sampleSalary.professionalTax + sampleSalary.tds)}

**Net Salary:** ${formatCurrency(sampleSalary.netSalary)}

Your CTC is ${formatCurrency(sampleSalary.ctc)} per annum.`;
      quickActions = [
        { label: "Download Payslip", action: () => console.log("Download payslip") },
        { label: "View Pay History", action: () => console.log("Show pay history") },
      ];
    } else if (
      (messageLower.includes("payslip") || messageLower.includes("salary slip")) &&
      (messageLower.includes("download") || messageLower.includes("get") || messageLower.includes("view"))
    ) {
      content = `📄 **Download Payslip:**

You can download your payslip from the **Payroll** section:

1. Go to **Payroll → Payslips** tab
2. Search for your employee ID
3. Click **"View"** on your payslip
4. Click **"Download PDF"**

**Alternative:** You'll also receive payslips via email by the 5th of every month.

Would you like me to show you the current month's payslip?`;
      quickActions = [
        { label: "View Current Payslip", action: () => console.log("Show payslip") },
        { label: "Go to Payroll Section", action: () => console.log("Navigate to payroll") },
      ];
    }

    // Attendance queries
    else if (
      messageLower.includes("attendance") ||
      messageLower.includes("present") ||
      messageLower.includes("absent")
    ) {
      content = `⏰ **Attendance Information:**

**Working Hours:**
• Office timings: 9:00 AM - 6:00 PM
• Lunch break: 1:00 PM - 2:00 PM
• Working days: Monday to Saturday (alternate)

**Attendance Rules:**
• Grace period: 15 minutes
• Half-day: If present for 4+ hours
• Late marks: 3 late arrivals = 1 day LOP

**Current Month:**
• Working days: 26
• Your attendance: 24 days present
• Late arrivals: 2 days

**Overtime:**
Overtime is calculated at 2x hourly rate and credited in next month's salary.`;
      quickActions = [
        { label: "View Attendance Report", action: () => console.log("Show attendance") },
      ];
    }

    // PF/ESI queries
    else if (messageLower.includes("pf") || messageLower.includes("provident fund")) {
      const sampleSalary = mockSalaryStructures[0];
      content = `🏦 **Provident Fund (PF) Information:**

**Your Contribution:** ${formatCurrency(sampleSalary.pf)}/month (12% of Basic)
**Employer Contribution:** ${formatCurrency(sampleSalary.pf)}/month (12% of Basic)
**Total Monthly PF:** ${formatCurrency(sampleSalary.pf * 2)}

**PF Account Details:**
• PF Number: ${sampleSalary.pfNumber}
• UAN: Available in your profile

**Benefits:**
• Retirement savings with interest (~8.1% p.a.)
• Tax benefits under Section 80C
• Withdrawable after retirement or resignation

**Access Your PF:**
Visit EPFO portal: https://www.epfindia.gov.in`;
      quickActions = [
        { label: "View PF Statement", action: () => console.log("Show PF statement") },
      ];
    } else if (messageLower.includes("esi") || messageLower.includes("insurance")) {
      const sampleSalary = mockSalaryStructures[0];
      if (sampleSalary.esi > 0) {
        content = `🏥 **Employee State Insurance (ESI) Information:**

**Your Contribution:** ${formatCurrency(sampleSalary.esi)}/month (0.75% of Gross)
**Employer Contribution:** ${formatCurrency(Math.round(sampleSalary.grossSalary * 0.0325))}/month (3.25% of Gross)

**ESI Number:** ${sampleSalary.esiNumber}

**Benefits:**
• Medical benefits for you and family
• Sickness benefit (70% of wages)
• Maternity benefit
• Disability benefit
• Dependent benefit

**ESI Hospitals:**
Access medical facilities at any ESI hospital near you.`;
      } else {
        content = `ℹ️ **ESI Information:**

ESI is applicable only if your gross salary is below ₹21,000/month.

Your current gross salary is ${formatCurrency(sampleSalary.grossSalary)}, so ESI is not deducted from your salary.

However, you're covered under the company's health insurance policy.`;
      }
    }

    // Tax queries
    else if (messageLower.includes("tax") || messageLower.includes("tds")) {
      const sampleSalary = mockSalaryStructures[0];
      content = `💳 **Tax Information (TDS):**

**Monthly TDS:** ${sampleSalary.tds > 0 ? formatCurrency(sampleSalary.tds) : "Not Applicable"}
**Annual Tax:** ${sampleSalary.tds > 0 ? formatCurrency(sampleSalary.tds * 12) : "₹0"}

**Your Tax Regime:** New Tax Regime (default)

**Tax Saving Options:**
• Section 80C: ₹1.5 lakh (PPF, ELSS, Life Insurance)
• Section 80D: ₹25,000 (Health Insurance)
• HRA exemption available

**Investment Declaration:**
Submit your investment proofs by January 31st to optimize tax deductions.

**Form 16:**
Download from Payroll section at the end of financial year.`;
      quickActions = [
        { label: "Investment Declaration", action: () => console.log("Show declaration form") },
      ];
    }

    // HR Policies
    else if (
      messageLower.includes("policy") ||
      messageLower.includes("rules") ||
      messageLower.includes("benefits")
    ) {
      content = `📚 **HR Policies & Benefits:**

**Working Hours:**
• 9:00 AM - 6:00 PM (Mon-Sat alternate)
• Flexible timings available (subject to approval)

**Benefits:**
✅ Health Insurance (Self + Family)
✅ Provident Fund (PF)
✅ Gratuity (after 5 years)
✅ Annual Bonus
✅ Performance Incentives

**Other Policies:**
• Maternity Leave: 26 weeks
• Paternity Leave: 15 days
• Bereavement Leave: 5 days
• Work from Home: As per manager approval

**Code of Conduct:**
• Professional behavior
• Dress code: Business casual
• Confidentiality agreement`;
    }

    // Default/Greeting
    else if (
      messageLower.includes("hello") ||
      messageLower.includes("hi") ||
      messageLower.includes("hey")
    ) {
      content = `👋 Hello! I'm here to help you with HR-related queries.

You can ask me about:
• Leave balance and policies
• Salary structure and payslips
• Attendance and working hours
• PF, ESI, and tax information
• HR policies and benefits

What would you like to know?`;
    } else if (messageLower.includes("thank")) {
      content = `You're welcome! 😊 

Is there anything else I can help you with today?`;
    }

    // Fallback
    else {
      content = `I understand you're asking about "${userMessage}". 

I can help you with:

📅 **Leave Management** - Balance, apply, policies
💰 **Payroll** - Salary structure, payslips, CTC
⏰ **Attendance** - Working hours, late marks
🏦 **Benefits** - PF, ESI, tax information
📋 **Policies** - HR policies, code of conduct

Please ask me something specific, or choose from the quick topics below!`;
      quickActions = [
        { label: "Leave Balance", action: () => handleQuickQuestion("What is my leave balance?") },
        { label: "Salary Structure", action: () => handleQuickQuestion("Show my salary structure") },
        { label: "HR Policies", action: () => handleQuickQuestion("What are the HR policies?") },
      ];
    }

    return {
      id: Date.now().toString(),
      type: "bot",
      content,
      timestamp: new Date(),
      quickActions,
    };
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const botResponse = generateAIResponse(inputMessage);
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  // Handle quick question
  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // Quick question suggestions
  const quickQuestions = [
    { icon: Calendar, label: "Leave Balance", question: "What is my leave balance?" },
    { icon: DollarSign, label: "Salary Structure", question: "Show my salary structure" },
    { icon: Clock, label: "Attendance", question: "Tell me about attendance policy" },
    { icon: FileText, label: "Download Payslip", question: "How to download payslip?" },
  ];

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
        >
          <MessageCircle className="h-7 w-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask HR Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] z-50 flex flex-col shadow-2xl rounded-lg overflow-hidden">
          <Card className="flex flex-col h-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">HR AI Assistant</h3>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.type === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      message.type === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div
                    className={`max-w-[75%] ${
                      message.type === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-indigo-600 text-white"
                          : "bg-white border shadow-sm"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-line">{parseMarkdown(message.content)}</p>
                    </div>

                    {/* Quick Actions */}
                    {message.quickActions && message.quickActions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {message.quickActions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={action.action}
                            className="px-3 py-1 text-xs bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div className="bg-white border shadow-sm rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="p-4 bg-white border-t">
                <p className="text-xs text-muted-foreground mb-2">Quick Questions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleQuickQuestion(q.question)}
                      className="p-2 text-xs border rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors text-left flex items-center gap-2"
                    >
                      <q.icon className="h-3 w-3 text-indigo-600" />
                      <span>{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t">
              {/* Listening Indicator */}
              {isListening && (
                <div className="mb-3 p-3 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-lg">
                  <div className="flex items-center justify-center gap-3">
                    <div className="relative">
                      <Mic className="h-5 w-5 text-red-600 animate-pulse" />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-red-900">Listening...</span>
                      <span className="text-xs text-red-700">Speak now, I'm all ears!</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse"></div>
                      <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse delay-75"></div>
                      <div className="w-1 h-8 bg-red-500 rounded-full animate-pulse delay-150"></div>
                      <div className="w-1 h-6 bg-red-500 rounded-full animate-pulse delay-75"></div>
                      <div className="w-1 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={isListening ? "Listening to your voice..." : "Ask me anything about HR..."}
                  className="flex-1"
                  disabled={isListening}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isListening}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                  <Send className="h-4 w-4" />
                </Button>
                <Button
                  onClick={toggleVoiceInput}
                  className={`${
                    isListening
                      ? "bg-gradient-to-r from-red-500 to-pink-500 animate-pulse"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600"
                  } transition-all`}
                  title={speechSupported ? (isListening ? "Stop listening" : "Click to speak") : "Voice input not supported"}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                {speechSupported 
                  ? "Powered by AI • Type or speak your question" 
                  : "Powered by AI • For HR assistance only"}
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}