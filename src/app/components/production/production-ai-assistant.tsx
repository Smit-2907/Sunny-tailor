import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Factory,
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  Package,
  Mic,
  MicOff,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";

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

export function ProductionAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "👋 Hello! I'm your Production AI Assistant. I can help you with:\n\n• Production status & tracking\n• Worker performance & assignments\n• Quality control insights\n• Delay predictions & alerts\n• Material consumption analysis\n• Efficiency optimization\n\nWhat would you like to know?",
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
              content: "🎤 **Microphone Not Found**\n\nI couldn't detect a microphone on your device.\n\n**Please check:**\n• Your microphone is connected\n• Your browser has permission to access it\n• No other app is using the microphone\n\nYou can still type your questions!",
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
        content: "🎤 **Voice Input Not Supported**\n\nYour browser doesn't support voice input. Please try:\n• Google Chrome (recommended)\n• Microsoft Edge\n• Safari (iOS/macOS)\n\nYou can still type your questions!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        // Request microphone permission explicitly
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognitionRef.current?.start();
        setIsListening(true);
        setMicPermission("granted");
      } catch (error: any) {
        console.error("Microphone permission error:", error);
        setMicPermission("denied");
        
        let errorMessage = "";
        
        if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
          errorMessage = "🎤 **Microphone Access Denied**\n\nI need permission to use your microphone.\n\n**How to enable microphone:**\n\n**Chrome/Edge:**\n1. Click the 🔒 or 🛈 icon in your address bar\n2. Find 'Microphone' permissions\n3. Change to 'Allow'\n4. Refresh the page and try again\n\n**Safari:**\n1. Go to Safari → Settings → Websites\n2. Select 'Microphone'\n3. Set this website to 'Allow'\n4. Refresh the page\n\n**Alternative:** You can type your questions instead!";
        } else if (error.name === "NotFoundError") {
          errorMessage = "🎤 **No Microphone Found**\n\nI couldn't detect a microphone on your device.\n\n**Please check:**\n• Your microphone is connected\n• It's not being used by another app\n• Your device has microphone support\n\nYou can type your questions instead!";
        } else if (error.name === "NotReadableError") {
          errorMessage = "🎤 **Microphone In Use**\n\nYour microphone is being used by another application.\n\n**Please:**\n• Close other apps using the microphone\n• Try again\n\nYou can type your questions in the meantime!";
        } else {
          errorMessage = "🎤 **Microphone Error**\n\nSomething went wrong with the microphone.\n\n**Try:**\n• Refresh the page\n• Check your microphone settings\n• Type your questions instead";
        }
        
        const errorMsg: Message = {
          id: Date.now().toString(),
          type: "bot",
          content: errorMessage,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    }
  };

  // Parse simple markdown
  const parseMarkdown = (text: string) => {
    return text.split("\n").map((line, i) => {
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <strong key={i} className="font-bold">
            {line.slice(2, -2)}
            <br />
          </strong>
        );
      }
      if (line.startsWith("• ")) {
        return (
          <span key={i} className="block ml-2">
            {line}
          </span>
        );
      }
      return (
        <span key={i}>
          {line}
          <br />
        </span>
      );
    });
  };

  // AI response logic for production queries
  const getAIResponse = (userMessage: string): string => {
    const messageLower = userMessage.toLowerCase();

    // Production status queries
    if (
      messageLower.includes("status") ||
      messageLower.includes("how many") ||
      messageLower.includes("pending")
    ) {
      return `📊 **Production Status Overview**

**Today's Production:**
• Total Orders: 28 active
• In Cutting: 5 orders (18%)
• In Stitching: 12 orders (43%)
• In Quality Check: 6 orders (21%)
• Finishing: 5 orders (18%)

**Completion Status:**
• On Track: 22 orders (78%)
• At Risk: 4 orders (14%)
• Delayed: 2 orders (8%)

**Today's Target:** 450 pieces
**Completed:** 287 pieces (64%)
**Remaining:** 163 pieces

Would you like details on any specific stage or order?`;
    }

    // Worker performance queries
    if (
      messageLower.includes("worker") ||
      messageLower.includes("staff") ||
      messageLower.includes("employee") ||
      messageLower.includes("performance")
    ) {
      return `👷 **Worker Performance Insights**

**Top Performers Today:**
1. Ramesh Kumar - 52 pieces (Stitching) ⭐
2. Priya Sharma - 48 pieces (Cutting)
3. Amit Patel - 45 pieces (Finishing)

**Current Assignments:**
• Cutting Team: 8 workers (75% capacity)
• Stitching Team: 15 workers (90% capacity)
• Quality Team: 5 workers (60% capacity)
• Finishing Team: 6 workers (80% capacity)

**Efficiency Metrics:**
• Average: 42 pieces/worker/day
• Team Efficiency: 82%
• Quality Pass Rate: 94%

**Recommendations:**
• Assign 2 more workers to stitching (high demand)
• Consider overtime for finishing team

Need specific worker details?`;
    }

    // Quality control queries
    if (
      messageLower.includes("quality") ||
      messageLower.includes("defect") ||
      messageLower.includes("qc") ||
      messageLower.includes("reject")
    ) {
      return `✅ **Quality Control Analysis**

**Today's QC Stats:**
• Total Inspected: 287 pieces
• Passed: 270 pieces (94%)
• Rejected: 12 pieces (4%)
• Rework: 5 pieces (2%)

**Top Defects:**
1. Stitching errors: 8 cases
2. Button misalignment: 3 cases
3. Fabric issues: 6 cases

**Quality Trends:**
• Week-over-week: +3% improvement
• Best time: Morning shift (97% pass rate)
• Watch area: Button stitching

**Alerts:**
⚠️ Worker "Suresh" has 3 quality issues today - recommend training

**Prediction:**
📈 Based on current trends, expect 95% quality rate tomorrow

Need defect photos or detailed reports?`;
    }

    // Delay and bottleneck queries
    if (
      messageLower.includes("delay") ||
      messageLower.includes("late") ||
      messageLower.includes("bottleneck") ||
      messageLower.includes("problem")
    ) {
      return `⚠️ **Delay Analysis & Bottlenecks**

**Delayed Orders (2):**
1. **PO-2026-089** - ABC Garments
   • Due: Today 6:00 PM
   • Status: Stitching (75% complete)
   • Risk: High (2 hours behind)
   • Action: Assigned 2 extra workers

2. **PO-2026-103** - StyleCraft Inc.
   • Due: Tomorrow 10:00 AM
   • Status: Quality Check
   • Risk: Medium (defects found)
   • Action: 5 pieces in rework

**Bottleneck Detected:**
🔴 **Stitching Stage** - Running at 90% capacity
• Cause: Complex design orders
• Impact: 4 orders slowing down
• Solution: Consider overtime or reassignment

**At-Risk Orders (4):**
• PO-2026-112, PO-2026-118, PO-2026-125, PO-2026-131
• Reason: Material shortage (buttons)

**Recommendations:**
• Expedite button delivery
• Prioritize high-margin orders
• Schedule overtime for stitching team

Need specific order action plans?`;
    }

    // Material consumption queries
    if (
      messageLower.includes("material") ||
      messageLower.includes("fabric") ||
      messageLower.includes("consumption") ||
      messageLower.includes("waste")
    ) {
      return `📦 **Material Consumption Analysis**

**Today's Usage:**
• Fabric: 285 meters (planned: 290m) ✅
• Thread: 45 spools
• Buttons: 2,850 pieces
• Zippers: 120 pieces

**Wastage Stats:**
• Fabric Waste: 4.2% (industry avg: 6%)
• Savings: ₹8,500 vs planned
• Best Practice: Cutting team optimization

**Low Stock Alerts:**
⚠️ Buttons (White): Only 1,200 left (2 days stock)
⚠️ Thread (Black): 8 spools remaining

**Material Efficiency:**
• Overall: 95.8% (Excellent!)
• Best Worker: Priya Sharma (97.5%)
• Improvement needed: Evening shift (92%)

**Cost Impact:**
• Material Cost Today: ₹1,24,500
• Saved from waste reduction: ₹8,500
• Monthly projected savings: ₹2,55,000

**Recommendations:**
• Order buttons immediately
• Continue current cutting optimization
• Train evening shift workers

Need supplier recommendations?`;
    }

    // Optimization and efficiency queries
    if (
      messageLower.includes("optimize") ||
      messageLower.includes("improve") ||
      messageLower.includes("efficiency") ||
      messageLower.includes("suggestion")
    ) {
      return `🚀 **AI Optimization Recommendations**

**Priority Actions:**

1. **Worker Reallocation** (High Impact)
   • Move 2 workers: Cutting → Stitching
   • Expected gain: +8% throughput
   • Implementation: Immediate

2. **Schedule Optimization** (Medium Impact)
   • Start complex orders in morning shift
   • Reason: 12% higher quality rate
   • Expected gain: -15% rework

3. **Material Grouping** (High Impact)
   • Batch orders by fabric type
   • Expected savings: 3% material waste
   • Cost benefit: ₹12,000/day

4. **Preventive Maintenance** (Critical)
   • Machine #3 & #7 showing patterns
   • Predict failure in 48 hours
   • Schedule tonight: Avoid 6-hour downtime

5. **Quality Checkpoint** (Medium Impact)
   • Add mid-stage QC for complex orders
   • Reduce final rework by 40%
   • Time investment: +5 min/order

**Predicted Outcomes (Next 7 Days):**
📈 Production: +12% efficiency
💰 Cost Savings: ₹85,000
✅ Quality: 96% pass rate (up from 94%)
⏰ Delivery: 95% on-time (up from 89%)

**Implementation Priority:**
🔴 Action #4 - Tonight
🟡 Action #1 - Tomorrow morning
🟢 Actions #2, #3, #5 - This week

Ready to implement any of these?`;
    }

    // Machine and equipment queries
    if (
      messageLower.includes("machine") ||
      messageLower.includes("equipment") ||
      messageLower.includes("maintenance")
    ) {
      return `🔧 **Machine & Equipment Status**

**All Machines (18 total):**
• Active: 15 machines (83%)
• Idle: 2 machines (11%)
• Maintenance: 1 machine (6%)

**Machine Health:**
✅ Good: 12 machines
⚠️ Watch: 4 machines (#3, #7, #11, #14)
🔴 Critical: 2 machines (#5 - in maintenance, #9)

**Utilization:**
• Cutting Machines: 78% (optimal)
• Stitching Machines: 92% (high)
• Finishing Machines: 65% (low)

**Maintenance Alerts:**
⚠️ Machine #3 - Unusual vibration detected
⚠️ Machine #7 - Speed dropped 8%
🔴 Machine #9 - Schedule maintenance tonight

**Predictions:**
• Machine #3: 85% chance of issue in 48 hrs
• Machine #7: Recommend service this week

**Maintenance Schedule:**
• Preventive due: Machines #2, #8, #15 (next week)
• Last serviced: All machines <30 days

**Impact on Production:**
• Current: Minimal (backup capacity available)
• If #3 & #7 fail: 12% capacity loss

Should I schedule maintenance or reassign tasks?`;
    }

    // Order specific queries
    if (
      messageLower.includes("order") ||
      messageLower.includes("po-") ||
      messageLower.includes("customer")
    ) {
      return `📋 **Order Management Insights**

**Active Orders:** 28

**By Priority:**
🔴 Urgent: 5 orders (delivery today/tomorrow)
🟡 High: 12 orders (delivery this week)
🟢 Normal: 11 orders (delivery next week)

**By Customer:**
• ABC Garments Ltd.: 6 orders
• StyleCraft Inc.: 4 orders
• Fashion Hub: 3 orders
• Others: 15 orders

**By Complexity:**
• Simple: 8 orders (t-shirts, basic shirts)
• Medium: 15 orders (formal shirts, pants)
• Complex: 5 orders (blazers, suits)

**Top Orders to Watch:**
1. **PO-2026-089** (ABC Garments)
   • Status: 75% complete
   • Risk: High - 2 hours behind
   • Action: Extra workers assigned

2. **PO-2026-103** (StyleCraft)
   • Status: Quality check
   • Risk: Medium - rework needed
   • Action: 5 pieces being fixed

3. **PO-2026-112** (Fashion Hub)
   • Status: On hold
   • Risk: High - material shortage
   • Action: Waiting for buttons

**Predictions:**
• 92% will deliver on-time
• 2 orders need customer communication
• 4 orders may need deadline extension

Need details on a specific PO number?`;
    }

    // Timeline and scheduling queries
    if (
      messageLower.includes("when") ||
      messageLower.includes("timeline") ||
      messageLower.includes("schedule") ||
      messageLower.includes("complete")
    ) {
      return `📅 **Production Timeline & Schedule**

**Today's Completion Forecast:**
• Expected finish: 6:30 PM
• Target pieces: 450
• Projected: 438 pieces (97%)
• Confidence: 85%

**This Week Schedule:**
• Monday: 450 pieces ✅ (102%)
• Tuesday: 480 pieces ✅ (98%)
• Wednesday: 450 pieces (target - today)
• Thursday: 520 pieces (planned)
• Friday: 490 pieces (planned)

**Order Completion Schedule:**
• Today EOD: 3 orders
• Tomorrow: 7 orders
• By Friday: 18 orders (64%)
• Next week: 10 orders (36%)

**Critical Deadlines:**
🔴 **Today 6:00 PM**
• PO-2026-089 (at risk - 75% done)
• PO-2026-095 (on track - 90% done)

🟡 **Tomorrow**
• 7 orders (all on track)
• Estimated completion: 4:00 PM

**Capacity Analysis:**
• Current: 85% utilized
• Thursday: Will hit 95% (high load)
• Recommendation: Plan overtime for Thursday

**Bottleneck Windows:**
• 2:00 PM - 4:00 PM (shift change)
• Impact: -8% productivity

Need to adjust any schedules?`;
    }

    // Help and capabilities
    if (
      messageLower.includes("help") ||
      messageLower.includes("can you") ||
      messageLower.includes("what can")
    ) {
      return `💡 **How I Can Help You**

**Production Tracking:**
• Current status of all orders
• Stage-wise breakdown
• Real-time progress updates
• Bottleneck identification

**Worker Management:**
• Performance analytics
• Task assignments
• Efficiency metrics
• Training recommendations

**Quality Control:**
• Defect analysis
• QC pass rates
• Trend predictions
• Worker quality scores

**Predictions & Alerts:**
• Delay predictions
• Machine failure warnings
• Material shortage alerts
• Deadline risk assessment

**Optimization:**
• Resource allocation suggestions
• Schedule optimization
• Cost reduction ideas
• Efficiency improvements

**Analytics:**
• Material consumption
• Waste analysis
• Cost tracking
• Performance trends

**Quick Commands:**
• "Show production status"
• "Worker performance today"
• "Which orders are delayed?"
• "Material consumption"
• "Optimization suggestions"
• "Machine status"

**Try asking:**
• "Show me delayed orders"
• "Who are the top performers?"
• "What's the quality rate?"
• "Any bottlenecks today?"
• "How to improve efficiency?"

What would you like to know?`;
    }

    // Default response
    return `🤔 I understand you're asking about: "${userMessage}"

I'm here to help with production insights! Here's what I can assist with:

**Quick Suggestions:**
• "Show production status" - Current overview
• "Worker performance" - Team analytics
• "Quality report" - QC insights
• "Delayed orders" - Risk analysis
• "Optimize production" - AI recommendations
• "Machine status" - Equipment health

Could you please rephrase your question using one of these topics? Or ask me something specific about production!`;
  };

  // Handle send message
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

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse = getAIResponse(inputMessage);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
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
    { icon: Factory, label: "Production Status", question: "Show production status" },
    { icon: Users, label: "Worker Performance", question: "Worker performance today" },
    { icon: AlertTriangle, label: "Delays", question: "Which orders are delayed?" },
    { icon: TrendingUp, label: "Optimize", question: "Optimization suggestions" },
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
            Ask Production Assistant
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
                  <h3 className="font-semibold">Production AI Assistant</h3>
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
                    <p className="text-xs text-gray-400 mt-1 px-1">
                      {message.timestamp.toLocaleTimeString([], {
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
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickQuestion(q.question)}
                      className="flex items-center gap-2 p-2 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors text-left"
                    >
                      <q.icon className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder={isListening ? "Listening..." : "Ask me anything..."}
                    className="pr-12"
                    disabled={isListening}
                  />
                  {speechSupported && (
                    <button
                      onClick={toggleVoiceInput}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-colors ${
                        isListening
                          ? "bg-red-100 text-red-600 animate-pulse"
                          : micPermission === "denied"
                          ? "bg-gray-100 text-gray-400"
                          : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                      }`}
                      title={
                        isListening
                          ? "Stop listening"
                          : micPermission === "denied"
                          ? "Microphone access denied"
                          : "Voice input"
                      }
                    >
                      {isListening ? (
                        <MicOff className="h-4 w-4" />
                      ) : (
                        <Mic className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
