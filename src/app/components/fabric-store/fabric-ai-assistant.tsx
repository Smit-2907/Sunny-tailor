import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Package,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Mic,
  MicOff,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

export function FabricAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "👋 Hello! I'm your Fabric Store AI Assistant. I can help you with:\n\n• Fabric inventory tracking\n• Stock level monitoring\n• Quality inspection guidance\n• Consumption calculations\n• Reorder point alerts\n• Supplier management\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleVoiceInput = async () => {
    if (!speechSupported) return;

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error("Microphone error:", error);
      }
    }
  };

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

  const getAIResponse = (userMessage: string): string => {
    const messageLower = userMessage.toLowerCase();

    if (
      messageLower.includes("inventory") ||
      messageLower.includes("stock") ||
      messageLower.includes("available") ||
      messageLower.includes("fabric list")
    ) {
      return `📦 **Current Fabric Inventory**

**Cotton Fabrics:**
• Premium Cotton - 2,450 meters (🟢 Good Stock)
• Organic Cotton - 890 meters (🟡 Low Stock)
• Cotton Blend - 3,200 meters (🟢 Excellent)
• Printed Cotton - 1,560 meters (🟢 Good Stock)

**Polyester Fabrics:**
• Pure Polyester - 1,890 meters (🟢 Good Stock)
• Poly-Cotton Blend - 4,500 meters (🟢 Excellent)
• Textured Polyester - 670 meters (🔴 Critical - Reorder!)
• Satin Polyester - 1,120 meters (🟡 Low Stock)

**Premium Fabrics:**
• Silk Blend - 340 meters (🟡 Low Stock)
• Linen - 560 meters (🟢 Good Stock)
• Wool Blend - 280 meters (🟡 Low Stock)
• Denim - 2,890 meters (🟢 Excellent)

**Stock Status Legend:**
🟢 **Good Stock** - Above reorder point
🟡 **Low Stock** - Near reorder point (action soon)
🔴 **Critical** - Below reorder point (urgent!)

**Total Fabric Value:** ₹18,45,600
**Storage Utilization:** 72%
**Avg Age of Stock:** 18 days

**Today's Activity:**
• Received: 850 meters (3 deliveries)
• Issued: 620 meters (4 requisitions)
• Quality Rejected: 15 meters
• Net Change: +215 meters

**Alerts:**
⚠️ Textured Polyester - Critical stock level!
⚠️ 3 fabrics approaching reorder point
✅ No expired stock
✅ All quality checks up to date

Need details on a specific fabric?`;
    }

    if (
      messageLower.includes("quality") ||
      messageLower.includes("inspection") ||
      messageLower.includes("check") ||
      messageLower.includes("defect")
    ) {
      return `✅ **Fabric Quality Inspection Guide**

**Quality Check Process:**

**1. Visual Inspection** 👁️
• Check for color consistency
• Look for stains, marks, spots
• Identify weaving defects
• Check for holes or tears
• Verify print alignment

**2. Physical Testing** 🔍
• Fabric weight (GSM check)
• Width measurement
• Shrinkage test
• Color fastness
• Tensile strength

**3. Touch & Feel** 🤚
• Texture consistency
• Softness level
• Stiffness check
• Surface smoothness
• Hand feel quality

**Quality Parameters:**

**Color Verification:**
✅ Matches approved sample
✅ No shade variation
✅ Even dyeing throughout
✅ No color bleeding
✅ Fastness grade: 4-5

**Weaving Quality:**
✅ No broken threads
✅ Consistent weave pattern
✅ No loose yarns
✅ No slubs or knots
✅ Uniform density

**Measurements:**
✅ Width tolerance: ±2%
✅ GSM tolerance: ±5%
✅ Length accuracy: ±1%

**Defect Classification:**

**Major Defects** ❌ (Reject)
• Large holes (>1cm)
• Heavy stains
• Wrong color shade
• Severe weaving defects
• Chemical damage

**Minor Defects** ⚠️ (Accept with note)
• Small spots (<5mm)
• Minor shade variation
• Slight width variation
• Tiny holes (<2mm)
• End cuts not neat

**Acceptable** ✅
• Within tolerance limits
• Meets all parameters
• No visible defects
• Quality certificate issued

**Quality Rejection Rate:**
• This Week: 2.3%
• Last Week: 1.8%
• Target: <2%
• Status: Slightly high

**Top Defect Causes:**
1. Shade variation - 35%
2. Weaving defects - 28%
3. Stains/marks - 22%
4. Width issues - 10%
5. Other - 5%

**Inspection Tools:**
• Color matching cabinet
• GSM weighing machine
• Width measuring scale
• Magnifying glass
• Tension tester

**Documentation:**
✅ Quality inspection report
✅ Photos of defects
✅ Supplier notification
✅ Accept/Reject decision
✅ Storage location assigned

**Best Practices:**
• Inspect immediately upon receipt
• Check random samples from roll
• Document everything with photos
• Reject diplomatically with evidence
• Maintain quality records

Inspecting a specific fabric batch?`;
    }

    if (
      messageLower.includes("consumption") ||
      messageLower.includes("usage") ||
      messageLower.includes("calculate") ||
      messageLower.includes("how much")
    ) {
      return `📊 **Fabric Consumption Calculator**

**Standard Consumption Rates:**

**Men's Shirts:**
• Small: 1.8 - 2.0 meters
• Medium: 2.0 - 2.2 meters
• Large: 2.2 - 2.4 meters
• XL: 2.4 - 2.6 meters
• XXL: 2.6 - 2.8 meters
**Average:** 2.2 meters per shirt

**Men's Pants:**
• Small: 1.5 - 1.7 meters
• Medium: 1.7 - 1.9 meters
• Large: 1.9 - 2.1 meters
• XL: 2.1 - 2.3 meters
• XXL: 2.3 - 2.5 meters
**Average:** 1.9 meters per pant

**Women's Shirts/Blouses:**
• Small: 1.5 - 1.7 meters
• Medium: 1.7 - 1.9 meters
• Large: 1.9 - 2.1 meters
• XL: 2.1 - 2.3 meters
**Average:** 1.8 meters

**Blazers/Jackets:**
• Small: 2.2 - 2.5 meters
• Medium: 2.5 - 2.8 meters
• Large: 2.8 - 3.1 meters
• XL: 3.1 - 3.4 meters
**Average:** 2.8 meters

**Wastage Allowance:**
• Cutting waste: 8-12%
• Quality rejection: 2-3%
• Shrinkage: 2-4%
• **Total safety margin:** 15%

**Example Calculation:**

**Order:** 100 shirts (Medium size)
• Base consumption: 2.2 meters × 100 = 220 meters
• Add wastage (15%): 220 × 1.15 = 253 meters
• **Total fabric needed:** 253 meters

**Current Orders Analysis:**

**PO-2026-089** (ABC Garments)
• 50 shirts × 2.2m = 110m
• With wastage: 127 meters
• Fabric: Premium Cotton
• Status: ✅ Fabric issued

**PO-2026-103** (StyleCraft)
• 75 pants × 1.9m = 142.5m
• With wastage: 164 meters
• Fabric: Poly-Cotton
• Status: ✅ Fabric issued

**PO-2026-112** (Fashion Hub)
• 42 blazers × 2.8m = 117.6m
• With wastage: 135 meters
• Fabric: Wool Blend
• Status: 🟡 Pending approval

**Today's Consumption:**
• Total issued: 620 meters
• Orders fulfilled: 4
• Pending requisitions: 2
• Average per order: 155 meters

**Consumption Trends:**
• This Week: 3,450 meters
• Last Week: 3,890 meters
• Monthly Average: 14,200 meters
• Efficiency: 92% (low wastage)

**Cost Analysis:**
• Avg fabric cost: ₹450/meter
• Total cost today: ₹2,79,000
• Monthly projection: ₹63,90,000

**Tips to Reduce Wastage:**
✅ Accurate measurements
✅ Proper cutting layout
✅ Fabric utilization planning
✅ Quality control at receipt
✅ Proper storage to prevent damage

Need calculation for a specific order?`;
    }

    if (
      messageLower.includes("reorder") ||
      messageLower.includes("low stock") ||
      messageLower.includes("purchase") ||
      messageLower.includes("supplier")
    ) {
      return `🔔 **Reorder Point & Supplier Management**

**Critical Stock Alerts:**

🔴 **URGENT - Immediate Action Required:**
• Textured Polyester: 670m (Reorder: 1000m)
  - Supplier: Premium Textiles Ltd
  - Lead time: 7 days
  - **Action:** PO raised today

🟡 **Low Stock - Order Soon:**
• Organic Cotton: 890m (Reorder: 1200m)
  - Supplier: EcoFabrics India
  - Lead time: 10 days
  - **Action:** Contact supplier

• Satin Polyester: 1,120m (Reorder: 1500m)
  - Supplier: Silk Touch Enterprises
  - Lead time: 5 days
  - **Action:** Prepare PO

• Silk Blend: 340m (Reorder: 500m)
  - Supplier: Luxury Fabrics Co
  - Lead time: 14 days
  - **Action:** Check requirements

**Reorder Point Formula:**
Reorder Point = (Daily Usage × Lead Time) + Safety Stock

**Example Calculation:**
• Daily usage: 100 meters
• Lead time: 10 days
• Safety stock: 200 meters
• **Reorder Point:** (100 × 10) + 200 = 1,200 meters

**Supplier Directory:**

**Premium Textiles Ltd**
📞 +91-98765-43210
📧 orders@premiumtextiles.com
⭐ Rating: 4.8/5
💰 Credit: 30 days
🚚 Lead time: 7 days
📦 Min order: 500 meters
✅ Reliable, good quality

**EcoFabrics India**
📞 +91-98765-43211
📧 sales@ecofabrics.in
⭐ Rating: 4.6/5
💰 Credit: 45 days
🚚 Lead time: 10 days
📦 Min order: 300 meters
✅ Organic certified

**Silk Touch Enterprises**
📞 +91-98765-43212
📧 info@silktouch.com
⭐ Rating: 4.9/5
💰 Credit: 21 days
🚚 Lead time: 5 days
📦 Min order: 200 meters
✅ Fast delivery, premium

**Denim Works**
📞 +91-98765-43213
📧 sales@denimworks.in
⭐ Rating: 4.7/5
💰 Credit: 30 days
🚚 Lead time: 12 days
📦 Min order: 1000 meters
✅ Bulk specialist

**Purchase Order Status:**

**Pending POs:**
• PO-FAB-2026-045: 2000m Cotton
  - Supplier: Premium Textiles
  - Expected: Jan 29, 2026
  - Status: In transit

• PO-FAB-2026-046: 1500m Polyester
  - Supplier: Silk Touch
  - Expected: Jan 31, 2026
  - Status: Processing

**Recent Deliveries:**
✅ PO-FAB-2026-043: 850m received today
✅ PO-FAB-2026-044: 1200m received yesterday

**Procurement KPIs:**
• On-time delivery: 94%
• Quality acceptance: 97.7%
• Average lead time: 8.5 days
• Stock-out incidents: 1 this month

**Cost Negotiation Tips:**
✅ Order in bulk for discounts
✅ Build long-term relationships
✅ Compare quotes from 3 suppliers
✅ Negotiate payment terms
✅ Annual contracts for best rates

**Quality Tracking by Supplier:**
• Premium Textiles: 98% acceptance
• EcoFabrics: 97% acceptance
• Silk Touch: 99% acceptance
• Denim Works: 96% acceptance

Need to raise a purchase order?`;
    }

    if (
      messageLower.includes("issue") ||
      messageLower.includes("requisition") ||
      messageLower.includes("production") ||
      messageLower.includes("cutting")
    ) {
      return `📤 **Fabric Issue & Requisition Process**

**Fabric Issue Workflow:**

**Step 1: Receive Requisition**
• Production team submits request
• Requisition ID generated
• PO details verified
• Fabric type confirmed

**Step 2: Check Availability**
• Verify stock levels
• Confirm fabric quality
• Check storage location
• Prepare for issue

**Step 3: Quality Check Before Issue**
• Visual inspection
• Measure accurate quantity
• Check for any defects
• Document condition

**Step 4: Issue & Document**
• Update inventory system
• Generate issue slip
• Get acknowledgment
• Update stock register

**Today's Requisitions:**

**REQ-2026-0089** ✅ Completed
• PO: PO-2026-089
• Fabric: Premium Cotton
• Quantity: 127 meters
• Issued to: Cutting Team A
• Time: 09:15 AM
• Issued by: Ramesh K.

**REQ-2026-0090** ✅ Completed
• PO: PO-2026-103
• Fabric: Poly-Cotton Blend
• Quantity: 164 meters
• Issued to: Cutting Team B
• Time: 11:30 AM
• Issued by: Priya S.

**REQ-2026-0091** 🟡 Pending
• PO: PO-2026-115
• Fabric: Silk Blend
• Quantity: 85 meters
• Status: Waiting approval
• Reason: Quality check in progress

**REQ-2026-0092** 🟡 Pending
• PO: PO-2026-118
• Fabric: Denim
• Quantity: 220 meters
• Status: Stock verification
• Note: Checking batch number

**Issue Statistics:**

**Today:**
• Total requisitions: 6
• Completed: 4
• Pending: 2
• Total issued: 620 meters
• Average time: 18 minutes

**This Week:**
• Requisitions processed: 34
• Total fabric issued: 3,450 meters
• Average per day: 690 meters
• Efficiency: 96%

**Common Issue Types:**
• To Cutting: 65%
• To Stitching (direct): 15%
• To Sampling: 10%
• Returns/Replacements: 8%
• Other: 2%

**Documentation Required:**

✅ **Fabric Issue Slip**
• Requisition number
• PO details
• Fabric specification
• Quantity issued
• Issued by & to
• Date & time
• Signatures

✅ **Stock Update**
• Inventory system entry
• Running balance update
• Location tracking
• Batch/roll tracking

**Quality Issues During Issue:**

⚠️ **If Defect Found:**
1. Stop the issue process
2. Notify quality team
3. Document defect with photos
4. Isolate affected fabric
5. Arrange replacement
6. Update requisition status

**Return Process:**

**Unused Fabric Returns:**
• Check quantity & condition
• Verify it's the same batch
• Inspect for damage
• Accept if quality OK
• Update stock (+)
• Document in register

**This Week's Returns:**
• Total returned: 145 meters
• Reason - Excess cut: 130m
• Reason - Defect found: 15m
• Return rate: 4.2% (Good)

**Fabric Accountability:**
• Issued: 3,450 meters
• Returned: 145 meters
• Net consumption: 3,305 meters
• Wastage: 8.9% (Target: <10%)
• Status: ✅ Within target

**Best Practices:**
✅ Measure accurately
✅ Issue in sequence (FIFO)
✅ Document immediately
✅ Check quality before issue
✅ Track returns promptly
✅ Maintain clear records

**Critical Points:**
• Never issue without requisition
• Always check PO authorization
• Verify fabric specification matches
• Get proper acknowledgment
• Update system in real-time

Need to process a requisition?`;
    }

    if (
      messageLower.includes("help") ||
      messageLower.includes("can you") ||
      messageLower.includes("what can")
    ) {
      return `💡 **How I Can Help You - Fabric Store**

**Inventory Management:**
• Current stock levels
• Fabric availability check
• Storage location tracking
• Stock valuation
• Inventory turnover analysis

**Quality Control:**
• Inspection guidelines
• Quality parameters
• Defect identification
• Rejection criteria
• Quality reports

**Consumption & Planning:**
• Fabric consumption calculator
• Order requirements
• Wastage analysis
• Usage trends
• Cost estimation

**Procurement:**
• Reorder point alerts
• Supplier information
• Purchase order status
• Lead time tracking
• Cost negotiation tips

**Issue & Requisition:**
• Requisition processing
• Issue procedure
• Return management
• Documentation
• Tracking & accountability

**Reports & Analytics:**
• Daily issue summary
• Stock status report
• Quality metrics
• Supplier performance
• Cost analysis

**Quick Commands:**
• "Show inventory"
• "Quality inspection guide"
• "Calculate consumption"
• "Reorder alerts"
• "Today's requisitions"
• "Supplier details"

**Try asking:**
• "What's the current stock level?"
• "How to inspect fabric quality?"
• "Calculate fabric for 100 shirts"
• "Which fabrics need reordering?"
• "Show pending requisitions"
• "Supplier contact details"

What specific help do you need today?`;
    }

    return `🤔 I understand you're asking about: "${userMessage}"

I can help with fabric store operations! Here's what I specialize in:

**Quick Suggestions:**
• "Show inventory" - Current stock levels
• "Quality check" - Inspection guidelines
• "Calculate consumption" - Usage calculator
• "Reorder alerts" - Low stock warnings
• "Issue fabric" - Requisition process
• "Supplier info" - Contact details

Could you please ask about one of these topics?`;
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

  const quickQuestions = [
    { icon: Package, label: "Inventory", question: "Show inventory" },
    { icon: CheckCircle, label: "Quality", question: "Quality check guide" },
    { icon: TrendingDown, label: "Consumption", question: "Calculate consumption" },
    { icon: AlertTriangle, label: "Reorder", question: "Reorder alerts" },
  ];

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
        >
          <MessageCircle className="h-7 w-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
          
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Ask Fabric Store Assistant
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[400px] h-[600px] z-50 flex flex-col shadow-2xl rounded-lg overflow-hidden">
          <Card className="flex flex-col h-full">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Fabric Store AI</h3>
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

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.type === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
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

            {messages.length === 1 && (
              <div className="p-4 bg-white border-t">
                <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickQuestions.map((q, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputMessage(q.question);
                        setTimeout(handleSendMessage, 100);
                      }}
                      className="flex items-center gap-2 p-2 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors text-left"
                    >
                      <q.icon className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{q.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                          : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                      }`}
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
