import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  BarChart3,
  DollarSign,
  AlertCircle,
  Mic,
  MicOff,
  Users,
  Factory,
  Bell,
  Target,
  Zap,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";

interface Message {
  id: string;
  type: "user" | "bot" | "recommendation";
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
  context?: string; // For tracking conversation context
}

interface QuickAction {
  label: string;
  action: () => void;
  icon?: any;
}

interface ConversationContext {
  topic?: string;
  lastEntity?: string;
  lastMetric?: string;
  lastDepartment?: string;
  lastTimeframe?: string;
}

// Smart Recommendations based on time and data
const getSmartRecommendations = (): Message => {
  const hour = new Date().getHours();
  const dayOfWeek = new Date().getDay();
  
  let recommendations = "";
  let quickActions: QuickAction[] = [];

  // Morning recommendations (6 AM - 12 PM)
  if (hour >= 6 && hour < 12) {
    recommendations = `🌅 **Good Morning! Here's Your Daily Briefing:**

**🎯 Top Priorities Today:**
1. **Urgent:** 3 orders delayed - material shortage
   → Cotton fabric arriving today ✅
   → Action: Fast-track PO-2026-087, 089, 091

2. **Revenue Target:** ₹1.2Cr daily goal
   → Current pace: ₹1.05Cr (projected)
   → Gap: ₹15L - Need 2 more orders today

3. **Pending Approvals:** 8 leave requests waiting
   → HR flagged 2 as urgent (medical leave)
   → Recommend: Review within 2 hours

**💡 Smart Suggestions:**
• **Opportunity:** XYZ Fashion likely to order (3-day pattern)
  → Proactive call could secure ₹4.2L order
• **Cost Saving:** Bulk thread purchase today saves ₹45K
  → Current stock: 3 days left, price increases tomorrow
• **Risk Alert:** Production Line 3 at 98% capacity
  → Consider overtime or shift priority orders

**📊 Quick Stats:**
• Workforce: 153/156 present (98.2%) ✅
• Production: 92% capacity utilization
• Cash Flow: Healthy (₹15.6Cr net positive)

What would you like to tackle first?`;

    quickActions = [
      { label: "View Delayed Orders", action: () => console.log("Delayed orders") },
      { label: "Review Leave Requests", action: () => console.log("Leave requests") },
      { label: "Check Revenue Gap", action: () => console.log("Revenue") },
      { label: "Contact XYZ Fashion", action: () => console.log("Contact client") },
    ];
  }
  // Afternoon recommendations (12 PM - 5 PM)
  else if (hour >= 12 && hour < 17) {
    recommendations = `☀️ **Afternoon Update - Here's What Needs Attention:**

**📈 Progress Check:**
• **Revenue So Far:** ₹8.5L (71% of daily target)
  → On track for ₹11.9L by EOD ✅
  → 2 large orders confirmed this afternoon

• **Production Status:** 28 orders completed today
  → 12 quality checks passed
  → 3 minor reworks (button alignment)

**⚠️ Action Items:**
1. **Material Stock Alert:** Buttons running low
   → Current: 2,000 pcs (2 days supply)
   → Recommend: Order 10,000 pcs today
   → Supplier: Same-day delivery available

2. **Client Follow-up:** ABC Garments payment due
   → Amount: ₹2.3L (invoice dated Jan 20)
   → Status: 6 days overdue
   → Suggest: Gentle reminder call

3. **Quality Issue:** Pattern defect in Batch #447
   → Impact: 12 garments affected
   → Root cause: New fabric supplier
   → Action: Switch to regular supplier

**💡 Optimization Opportunity:**
• Cutting efficiency down 7% this week
  → AI Analysis: New operator needs training
  → Solution: Pair with senior for 2 days
  → Potential savings: ₹18K/week in fabric waste

Next critical task?`;

    quickActions = [
      { label: "Order Buttons Now", action: () => console.log("Order materials") },
      { label: "Call ABC Garments", action: () => console.log("Follow-up") },
      { label: "Review Quality Issue", action: () => console.log("Quality") },
      { label: "Check Cutting Efficiency", action: () => console.log("Efficiency") },
    ];
  }
  // Evening recommendations (5 PM - 10 PM)
  else if (hour >= 17 && hour < 22) {
    recommendations = `🌆 **End of Day Summary & Tomorrow's Prep:**

**✅ Today's Achievements:**
• **Revenue:** ₹12.7Cr (105% of target) 🎉
• **Orders Completed:** 32 orders dispatched
• **Quality Rate:** 96.8% (above target)
• **Attendance:** 98.2% (excellent)

**📋 Tomorrow's Forecast:**
• **Expected Orders:** 28-32 orders
• **Material Deliveries:** Cotton fabric (850m)
• **Staffing:** All departments fully staffed
• **Priority Orders:** 5 urgent deadlines

**⚠️ Overnight Actions Needed:**
1. **Production Setup:** Prepare Line 4 for bulk order
   → PO-2026-095 (XYZ Fashion, 500 units)
   → Start time: 7:00 AM sharp

2. **Material Inspection:** Check cotton delivery quality
   → Arriving: 6:00 AM tomorrow
   → Inspector: Assign Ramesh (expert)

3. **Payment Reminders:** 3 invoices due tomorrow
   → Total: ₹5.8L expected
   → Auto-reminders scheduled ✅

**💡 Strategic Insight:**
This month trending +12% vs last month! 📈
• If pattern continues: ₹9.5Cr by month-end
• Current best month: Dec 2025 (₹12.5Cr)
• Opportunity: Beat record by ₹2.5Cr

**🎯 Tomorrow's Focus:**
Priority #1: XYZ Fashion bulk order (high margin)
Priority #2: Complete 5 urgent deadline orders
Priority #3: Review weekly performance with department heads

Ready for tomorrow?`;

    quickActions = [
      { label: "View Tomorrow's Schedule", action: () => console.log("Schedule") },
      { label: "Check Urgent Orders", action: () => console.log("Urgent") },
      { label: "Prepare for Bulk Order", action: () => console.log("Bulk order") },
      { label: "Review Weekly Performance", action: () => console.log("Performance") },
    ];
  }
  // Night/Early morning (10 PM - 6 AM)
  else {
    recommendations = `🌙 **Late Night Check-In:**

**🔍 System Status:**
✅ All production lines secured
✅ Night shift: 12 workers on duty
✅ Security: Active monitoring
✅ Backup: Completed at 2:15 AM

**📊 Real-Time Metrics:**
• Night Shift Progress: 8/12 orders on track
• Quality Checks: 100% pass rate tonight
• Material Security: All inventory secured

**⏰ Upcoming (Next 6 Hours):**
• 6:00 AM: Cotton fabric delivery
• 6:30 AM: Day shift arrival
• 7:00 AM: Production Line 4 start
• 8:00 AM: Department manager meeting

**💡 Did You Know?**
Your best performing day was January 18, 2026:
• Revenue: ₹14.2L
• Orders: 38 completed
• Quality: 98.5% pass rate

Get some rest! The system is running smoothly. 😊`;

    quickActions = [
      { label: "View Night Shift Status", action: () => console.log("Night shift") },
      { label: "Check Tomorrow's Schedule", action: () => console.log("Schedule") },
      { label: "System Health Report", action: () => console.log("System") },
    ];
  }

  // Add Monday-specific recommendations
  if (dayOfWeek === 1) {
    recommendations += `\n\n**📅 Monday Special:**
• Weekly planning meeting at 10 AM
• Review last week's performance
• Set this week's targets
• 3 new client meetings scheduled`;
  }

  return {
    id: "smart-recommendations-" + Date.now(),
    type: "recommendation",
    content: recommendations,
    timestamp: new Date(),
    quickActions,
  };
};

export function MasterManagerAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShownRecommendations, setHasShownRecommendations] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "👋 Hello! I'm your Executive AI Assistant with **Smart Recommendations** and **Context-Aware** conversations.\n\nI can help you with:\n\n• **Smart Daily Briefings** - Proactive insights\n• **Company Performance** - KPIs & metrics\n• **Department Analytics** - Cross-department insights\n• **Production Overview** - Real-time status\n• **Financial Summary** - Revenue & profitability\n• **Workforce Management** - Employee analytics\n\nI'll remember our conversation and give you smart suggestions! 🧠",
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
  
  // Context tracking for conversation awareness
  const [conversationContext, setConversationContext] = useState<ConversationContext>({});

  // Show smart recommendations on first open
  useEffect(() => {
    if (isOpen && !hasShownRecommendations && messages.length === 1) {
      setTimeout(() => {
        const recommendations = getSmartRecommendations();
        setMessages((prev) => [...prev, recommendations]);
        setHasShownRecommendations(true);
      }, 1500);
    }
  }, [isOpen, hasShownRecommendations, messages.length]);

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
        recognitionRef.current.lang = "en-IN";

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          
          if (event.error === "not-allowed" || event.error === "permission-denied") {
            setMicPermission("denied");
            const errorMsg: Message = {
              id: Date.now().toString(),
              type: "bot",
              content: "🎤 **Microphone Access Required**\n\nI need access to your microphone to listen to your questions.\n\n**How to enable:**\n1. Click the 🔒 lock icon in your browser's address bar\n2. Find 'Microphone' permissions\n3. Select 'Allow'\n4. Refresh the page and try again\n\n**Alternative:** You can always type your questions instead!",
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

  // Check microphone permission
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
      try {
        recognitionRef.current?.stop();
      } catch (error) {
        console.error("Error stopping speech recognition:", error);
      }
      setIsListening(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setMicPermission("granted");
      } catch (error) {
        console.error("Error starting speech recognition:", error);
        setIsListening(false);
      }
    } catch (error: any) {
      console.error("Microphone permission error:", error);
      setMicPermission("denied");
      
      const errorMsg: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: "🎤 **Microphone Access Denied**\n\nI need permission to use your microphone.\n\nPlease enable microphone access in your browser settings and try again.\n\nYou can type your questions instead!",
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

  // Parse markdown
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, lineIndex) => {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      
      return (
        <span key={lineIndex}>
          {parts.map((part, partIndex) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={partIndex} className="font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  // Enhanced AI Response with Context Awareness
  const generateAIResponse = (userMessage: string, previousMessages: Message[]): Message => {
    const messageLower = userMessage.toLowerCase();
    let content = "";
    let quickActions: QuickAction[] = [];
    let newContext: ConversationContext = { ...conversationContext };

    // Context-aware follow-up questions
    const isFollowUp = 
      messageLower.includes("why") ||
      messageLower.includes("how") ||
      messageLower.includes("what about") ||
      messageLower.includes("tell me more") ||
      messageLower.includes("explain") ||
      messageLower.includes("details") ||
      messageLower.includes("compare") ||
      messageLower.includes("it") ||
      messageLower.includes("that") ||
      messageLower.includes("them");

    // Check if this is a follow-up to previous context
    if (isFollowUp && conversationContext.topic) {
      // Handle context-aware follow-ups
      if (conversationContext.topic === "revenue" || conversationContext.topic === "financial") {
        if (messageLower.includes("why") || messageLower.includes("how")) {
          content = `💡 **Why Revenue is ${conversationContext.lastMetric}:**

**Key Contributing Factors:**

1. **Increased Order Volume** (+22%)
   • New client acquisitions: 7 companies
   • Repeat order rate improved: 68% (was 61%)
   • Larger average order size: ₹2.85L (was ₹2.54L)

2. **Better Pricing Strategy** (+8% margins)
   • Premium fabric orders increased
   • Value-added services (rush orders, custom designs)
   • Negotiated better supplier costs

3. **Operational Efficiency** (+12% productivity)
   • Reduced production time by 8%
   • Less material waste (-7%)
   • Improved quality (fewer reworks)

4. **Market Conditions** (Favorable)
   • Seasonal demand peak
   • Competitor capacity issues (clients switching to us)
   • Strong referrals from existing clients

**Trend Analysis:**
📈 Revenue growing steadily since October 2025
📊 Best performing categories: Corporate wear, Uniforms
🎯 On track to exceed annual target by 15%

This growth is sustainable if we maintain quality and delivery times!`;

          quickActions = [
            { label: "View Detailed P&L", action: () => console.log("P&L") },
            { label: "Check Order Sources", action: () => console.log("Sources") },
            { label: "Analyze Best Categories", action: () => console.log("Categories") },
          ];
        } else if (messageLower.includes("compare")) {
          content = `📊 **Revenue Comparison Analysis:**

**This Month vs Last Month:**
• Current: ${formatCurrency(87400000)} (26 days)
• Last Month: ${formatCurrency(78200000)} (31 days)
• Growth: +11.8% 📈
• Daily Average: +15.3%

**This Year vs Last Year (Same Period):**
• 2026 YTD: ${formatCurrency(945000000)}
• 2025 YTD: ${formatCurrency(807000000)}
• Growth: +17.1% 🎉

**Quarter-over-Quarter:**
• Q4 2025: ${formatCurrency(287000000)}
• Q3 2025: ${formatCurrency(245000000)}
• Growth: +17.1%

**Top Growing Segments:**
1. Corporate Wear: +28% YoY
2. Uniforms: +23% YoY
3. Custom Orders: +19% YoY

**Declining Segments:**
1. Casual Wear: -5% (market saturation)

**Projection:**
If current trend continues:
• Month-end: ${formatCurrency(103000000)} ✅
• Quarter-end: ${formatCurrency(295000000)} ✅
• Year-end: ${formatCurrency(1150000000)} 🎯

Recommendation: Focus on corporate & uniform segments!`;

          quickActions = [
            { label: "Segment Analysis", action: () => console.log("Segments") },
            { label: "Growth Drivers", action: () => console.log("Drivers") },
            { label: "Future Projections", action: () => console.log("Projections") },
          ];
        }
      } else if (conversationContext.topic === "production") {
        if (messageLower.includes("why") || messageLower.includes("delayed")) {
          content = `🔍 **Root Cause Analysis: Delayed Orders**

**3 Orders Currently Delayed:**

**1. PO-2026-087 (ABC Garments)**
   • Delay: 2 days
   • Root Cause: Cotton fabric stock-out
   • Why it happened: Supplier delivery delayed
   • Deeper reason: Supplier truck breakdown
   • Prevention: Add backup supplier ✅
   • Status: Material arriving today, resuming production

**2. PO-2026-089 (XYZ Fashion)**
   • Delay: 1 day
   • Root Cause: Custom buttons not available
   • Why it happened: First-time button design
   • Deeper reason: Sample approval took 3 days
   • Prevention: Buffer time for custom items
   • Status: Buttons arrived yesterday, in production

**3. PO-2026-091 (StyleCo)**
   • Delay: 3 days
   • Root Cause: Zipper supplier issue
   • Why it happened: Quality rejection (2 batches)
   • Deeper reason: New supplier used for cost saving
   • Prevention: Revert to trusted supplier ✅
   • Status: Premium zippers ordered, arriving tomorrow

**Systemic Issues Identified:**
⚠️ **Single-supplier dependency** for critical materials
⚠️ **Insufficient buffer stock** for fast-moving items
⚠️ **Cost-cutting risks** with new suppliers

**Actions Taken:**
✅ Added 2 backup suppliers for cotton & zippers
✅ Increased safety stock levels by 20%
✅ New policy: Test new suppliers on small orders first
✅ Real-time supplier performance tracking

**Impact Mitigation:**
• All 3 clients contacted and informed
• Offered 5% discount on next order
• Expedited production with overtime
• Quality double-checked to maintain standards

These delays are anomalies - our on-time rate is still 94.5%!`;

          quickActions = [
            { label: "View Supplier Performance", action: () => console.log("Suppliers") },
            { label: "Check Safety Stock Levels", action: () => console.log("Stock") },
            { label: "Review Prevention Plan", action: () => console.log("Prevention") },
          ];
        }
      } else if (conversationContext.topic === "department") {
        if (messageLower.includes("hr") || messageLower.includes("human")) {
          content = `👥 **HR Department Deep Dive:**

**Team Structure:**
• Department Head: Priya Sharma (8 years exp)
• HR Manager: Amit Patel (5 years exp)
• HR Executives: 2 members
• Recruitment Specialist: 1 member
• Total Team: 5 employees

**Current Workload:**
• Active Employees: 156
• Pending Leave Requests: 8
• Recruitment in Progress: 3 positions
• Onboarding This Week: 2 new hires
• Performance Reviews Due: 12

**Key Metrics (This Month):**
• Attendance Rate: 98.2% (Target: 95%)
• Leave Approval Time: 1.2 days avg (Target: 2 days)
• Recruitment Time: 18 days avg (Target: 21 days)
• Employee Satisfaction: 8.4/10
• Turnover Rate: 4.2% annual (Low ✅)

**Outstanding Achievements:**
✅ Zero payroll errors (12 months streak)
✅ 100% compliance with labor laws
✅ Employee engagement program running successfully
✅ Training completion rate: 94%

**Current Challenges:**
⚠️ 2 critical positions unfilled (Production Supervisors)
⚠️ Annual appraisal cycle starting next month
⚠️ New labor law compliance updates needed

**Budget Performance:**
• Allocated: ${formatCurrency(650000)}/month
• Spent: ${formatCurrency(612000)} (94%)
• Savings: ${formatCurrency(38000)} ✅

**Recommendations:**
1. Fast-track hiring for 2 supervisor positions
2. Automate leave approval workflow
3. Implement employee referral bonus program
4. Start appraisal preparation now

HR department is performing excellently! 🌟`;

          newContext.lastDepartment = "HR";
          
          quickActions = [
            { label: "View Open Positions", action: () => console.log("Positions") },
            { label: "Check Leave Requests", action: () => console.log("Leaves") },
            { label: "Employee Satisfaction Details", action: () => console.log("Satisfaction") },
          ];
        }
      }
    }
    // Fresh queries (not follow-ups)
    else if (
      messageLower.includes("performance") ||
      messageLower.includes("overview") ||
      messageLower.includes("company") ||
      messageLower.includes("overall")
    ) {
      content = `📊 **Company Performance Overview**

**Today's Highlights:**
• **Production:** 120 active orders across 8 production lines
• **Revenue:** ${formatCurrency(12500000)} (MTD: ${formatCurrency(87400000)})
• **Orders:** 32 new orders, 156 in production, 45 dispatched
• **Workforce:** 156 employees, 98.2% attendance today

**Key Metrics:**
• **Success Rate:** 98.6% order completion
• **On-Time Delivery:** 94.5%
• **Quality Pass Rate:** 96.8%
• **Customer Satisfaction:** 4.7/5.0

**Department Status:**
✅ HR: All systems normal
✅ Production: Operating at 92% capacity
⚠️ Fabric Store: 3 items below threshold
✅ Dispatch: 45 orders ready to ship

**💡 AI Recommendation:**
Consider increasing production capacity by 10% - current demand exceeds supply by 8%. Adding 2 production lines could generate additional ${formatCurrency(8500000)}/month revenue.

Would you like details on any specific area?`;
      
      newContext.topic = "performance";
      newContext.lastMetric = "strong";

      quickActions = [
        { label: "Why is it performing well?", action: () => setInputMessage("Why is it performing well?") },
        { label: "Compare with last month", action: () => setInputMessage("Compare with last month") },
        { label: "Show department details", action: () => setInputMessage("Tell me about departments") },
      ];
    } 
    else if (
      messageLower.includes("department") ||
      messageLower.includes("team")
    ) {
      content = `👥 **Department Analytics**

**All Departments Overview:**

**1. HR Management** - ⭐ Excellent
   • Team Size: 5 employees
   • Performance Score: 9.2/10
   • Key Strength: Zero payroll errors

**2. Production** - ⭐ Strong
   • Team Size: 12 managers + 85 workers
   • Capacity: 92% utilization
   • Quality Rate: 96.8%

**3. Measurement Expert** - ⭐ Excellent
   • Team Size: 3 employees
   • Accuracy: 99.5%
   • Turnaround: 2.1 hours avg

**4. Fabric Store** - ⚠️ Needs Attention
   • Team Size: 4 employees
   • Issue: 3 items below threshold
   • Action: Purchase orders raised

**5. Raw Material Store** - ✅ Good
   • Team Size: 4 employees
   • Stock Health: 94%
   • 5 items need reordering

**6. Dispatch** - ⭐ Excellent
   • Team Size: 6 employees
   • On-time Rate: 95.2%
   • Customer Feedback: 4.8/5

**7. Accounts** - ✅ Good
   • Team Size: 3 employees
   • Collections: 94.5%
   • Pending: ${formatCurrency(2300000)}

**💡 Smart Insight:**
Top performing: Dispatch & Measurement teams
Needs support: Fabric Store (consider adding 1 team member)

Which department would you like to explore?`;

      newContext.topic = "department";
      
      quickActions = [
        { label: "Tell me about HR", action: () => setInputMessage("Tell me more about HR department") },
        { label: "What about Production?", action: () => setInputMessage("What about Production department?") },
        { label: "Why is Fabric Store struggling?", action: () => setInputMessage("Why is Fabric Store having issues?") },
      ];
    }
    else if (
      messageLower.includes("production") ||
      messageLower.includes("orders")
    ) {
      content = `🏭 **Production Overview**

**Real-Time Status:**
• **Active Orders:** 120 in production
• **Production Lines:** 8 lines operating
• **Capacity:** 92% utilization
• **Today's Output:** 1,847 garments

**Order Pipeline:**
• **New Orders:** 32 (awaiting measurement)
• **In Cutting:** 28 orders
• **In Stitching:** 45 orders
• **In Finishing:** 35 orders
• **Quality Check:** 12 orders
• **Ready to Dispatch:** 45 orders

**Quality Metrics:**
• **Pass Rate:** 96.8%
• **Rejection Rate:** 2.1%
• **Rework Required:** 1.1%

**Delays & Issues:**
⚠️ 3 orders delayed (material shortage)
⚠️ 1 order on hold (client clarification needed)
✅ 116 orders on schedule

**💡 Smart Recommendation:**
Production Line 3 operating at 98% capacity - consider overtime or redistribute workload to prevent bottleneck.

Need more details?`;

      newContext.topic = "production";
      newContext.lastMetric = "92% capacity";

      quickActions = [
        { label: "Why are orders delayed?", action: () => setInputMessage("Why are 3 orders delayed?") },
        { label: "Show quality details", action: () => setInputMessage("Tell me more about quality metrics") },
        { label: "Compare with last week", action: () => setInputMessage("Compare production with last week") },
      ];
    }
    else if (
      messageLower.includes("revenue") ||
      messageLower.includes("finance") ||
      messageLower.includes("financial")
    ) {
      content = `💰 **Financial Summary**

**Revenue & Profitability:**
• **Today's Revenue:** ${formatCurrency(12500000)}
• **MTD Revenue:** ${formatCurrency(87400000)}
• **YTD Revenue:** ${formatCurrency(945000000)}
• **Gross Margin:** 34.5%

**Cost Breakdown:**
• **Material Costs:** ${formatCurrency(45200000)} (51.7%)
• **Labor Costs:** ${formatCurrency(28500000)} (32.6%)
• **Operating Costs:** ${formatCurrency(13700000)} (15.7%)

**Cash Flow:**
• **Receivables:** ${formatCurrency(34500000)}
• **Payables:** ${formatCurrency(18900000)}
• **Net Cash Position:** ${formatCurrency(15600000)} ✅

**💡 Smart Insight:**
Revenue up 17.1% YoY! You're on track to exceed annual target by ${formatCurrency(150000000)}. Consider reinvesting in capacity expansion.

**Financial Health:** ✅ Strong

Want to dive deeper into any metric?`;

      newContext.topic = "financial";
      newContext.lastMetric = "up 17.1% YoY";

      quickActions = [
        { label: "Why is revenue up?", action: () => setInputMessage("Why is revenue increasing?") },
        { label: "Compare with last month", action: () => setInputMessage("Compare revenue with last month") },
        { label: "Show cash flow details", action: () => setInputMessage("Explain cash flow") },
      ];
    }
    else if (messageLower.includes("refresh") || messageLower.includes("new recommendations")) {
      // Allow user to refresh recommendations
      const newRecommendations = getSmartRecommendations();
      return newRecommendations;
    }
    else {
      content = `🤔 I understand you're asking about "${userMessage}".

As your **Context-Aware Executive AI Assistant**, I can help with:

📊 **Business Analytics**
   • Company performance & KPIs
   • Department analytics
   • Revenue & profitability

🏭 **Operations**
   • Production status
   • Order tracking
   • Quality metrics

💬 **Smart Conversations**
   • Ask follow-up questions
   • I remember our chat context
   • Compare data across timeframes

Try asking: "Show company performance" then follow up with "Why?" or "Compare with last month"`;

      quickActions = [
        { label: "Show Performance", action: () => setInputMessage("Show company performance") },
        { label: "Production Status", action: () => setInputMessage("What is the production status?") },
        { label: "Financial Summary", action: () => setInputMessage("Show me financial summary") },
      ];
    }

    // Update conversation context
    setConversationContext(newContext);

    return {
      id: Date.now().toString(),
      type: "bot",
      content,
      timestamp: new Date(),
      quickActions,
      context: newContext.topic,
    };
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, messages);
      setMessages((prev) => [...prev, aiResponse]);
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
    { icon: TrendingUp, label: "Performance", question: "Show company performance" },
    { icon: DollarSign, label: "Revenue", question: "Show me financial summary" },
    { icon: Factory, label: "Production", question: "What is the production status?" },
    { icon: Users, label: "Workforce", question: "Show workforce analytics" },
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
          
          {/* Smart Badge */}
          <span className="absolute -bottom-1 -left-1 bg-yellow-400 text-yellow-900 text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
            <Zap className="h-2 w-2" />
            AI
          </span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Smart AI Assistant
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
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center relative">
                  <Bot className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-yellow-400 text-yellow-900 text-[8px] font-bold px-1 rounded-full">
                    AI
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold flex items-center gap-2">
                    Executive AI Assistant
                    <Sparkles className="h-3 w-3 text-yellow-300" />
                  </h3>
                  <div className="flex items-center gap-1 text-xs">
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>Smart & Context-Aware</span>
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
                        : message.type === "recommendation"
                        ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white"
                        : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4" />
                    ) : message.type === "recommendation" ? (
                      <Target className="h-4 w-4" />
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
                    {/* Recommendation Badge */}
                    {message.type === "recommendation" && (
                      <Badge className="mb-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                        <Zap className="h-3 w-3 mr-1" />
                        Smart Recommendations
                      </Badge>
                    )}
                    
                    <div
                      className={`rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-indigo-600 text-white"
                          : message.type === "recommendation"
                          ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 shadow-md"
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
                            className={`px-3 py-1 text-xs rounded-full transition-colors ${
                              message.type === "recommendation"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300"
                                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                            }`}
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

              {/* Context Indicator */}
              {conversationContext.topic && (
                <div className="mb-2 flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                  <CheckCircle className="h-3 w-3" />
                  <span>Context: {conversationContext.topic}</span>
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder={isListening ? "Listening to your voice..." : "Ask me anything..."}
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
                  ? "🧠 Context-aware • Type or speak" 
                  : "🧠 Smart AI with context memory"}
              </p>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
