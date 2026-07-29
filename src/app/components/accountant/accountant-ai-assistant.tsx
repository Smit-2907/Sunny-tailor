import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  DollarSign,
  FileText,
  TrendingUp,
  CreditCard,
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

export function AccountantAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "👋 Hello! I'm your Accountant AI Assistant. I can help you with:\n\n• Invoice generation & tracking\n• Payment status & follow-ups\n• Expense management\n• Financial reports & analytics\n• GST & tax calculations\n• Budget monitoring\n\nHow can I assist you today?",
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
      messageLower.includes("invoice") ||
      messageLower.includes("bill") ||
      messageLower.includes("generate")
    ) {
      return `📄 **Invoice Management**

**Pending Invoices to Generate:**

**PO-2026-089** (ABC Garments)
• Order value: ₹1,25,000
• Items: 50 shirts @ ₹2,500 each
• GST (18%): ₹22,500
• **Total:** ₹1,47,500
• Status: 🟡 Ready to invoice
• Delivery date: Jan 28, 2026

**PO-2026-103** (StyleCraft Inc)
• Order value: ₹1,87,500
• Items: 75 pants @ ₹2,500 each
• GST (18%): ₹33,750
• **Total:** ₹2,21,250
• Status: 🟡 Ready to invoice
• Delivery date: Jan 29, 2026

**Recent Invoices Generated:**

**INV-2026-0123** ✅
• PO: PO-2026-085
• Customer: TechWear Solutions
• Amount: ₹1,77,000
• Generated: Jan 27, 2026
• Sent via: Email + WhatsApp
• Status: Sent to customer

**INV-2026-0122** ✅
• PO: PO-2026-087
• Customer: Fashion Forward
• Amount: ₹1,12,500
• Generated: Jan 26, 2026
• Status: Sent to customer

**Invoice Generation Process:**

**Step 1: Order Completion Verification**
✅ Production complete
✅ Quality approved
✅ Packed and ready
✅ Dispatch scheduled

**Step 2: Invoice Details**
• Customer name and address
• GSTIN number
• PO number reference
• Item description
• Quantity and rate
• Taxable amount
• GST breakdown (CGST + SGST or IGST)
• Total amount

**Step 3: Generate Invoice**
• Use invoice template
• Auto-populate details
• Verify calculations
• Add payment terms
• Include bank details
• Generate invoice number

**Step 4: Send to Customer**
• Email invoice PDF
• WhatsApp confirmation
• Physical copy with delivery
• Record in system
• Set payment due date

**Invoice Template Includes:**

✅ **Company Details:**
• Name and logo
• Address
• GSTIN
• Contact details

✅ **Customer Details:**
• Company name
• Billing address
• GSTIN
• Contact person

✅ **Invoice Details:**
• Invoice number & date
• PO reference
• Due date
• Payment terms

✅ **Line Items:**
• Description
• HSN/SAC code
• Quantity
• Rate per unit
• Taxable value
• GST %
• Total amount

✅ **Tax Summary:**
• Taxable amount
• CGST (9%)
• SGST (9%)
• Or IGST (18%)
• Round off
• **Grand Total**

✅ **Payment Info:**
• Bank name
• Account number
• IFSC code
• Account holder
• Payment terms (Net 30)

✅ **Footer:**
• Terms & conditions
• Authorized signature
• Company seal

**Today's Invoice Summary:**
• To be generated: 2 invoices
• Total value: ₹3,68,750
• GST amount: ₹56,250
• Expected generation: Today EOD

**This Month:**
• Invoices generated: 45
• Total invoiced: ₹56,75,000
• GST collected: ₹10,21,500
• Average invoice: ₹1,26,111

**Payment Terms:**
• Standard: Net 30 days
• Corporate: Net 45 days
• Premium clients: Net 21 days
• Advance payment: 5% discount

Need help generating a specific invoice?`;
    }

    if (
      messageLower.includes("payment") ||
      messageLower.includes("paid") ||
      messageLower.includes("pending") ||
      messageLower.includes("received")
    ) {
      return `💰 **Payment Tracking & Status**

**Payments Received Today:**

**Payment 1** ✅
• Invoice: INV-2026-0118
• Customer: ABC Garments
• Amount: ₹1,47,500
• Mode: NEFT
• Reference: NEFT2601270089
• Received: 10:30 AM
• Status: ✅ Reconciled

**Payment 2** ✅
• Invoice: INV-2026-0115
• Customer: Fashion Hub
• Amount: ₹98,750
• Mode: RTGS
• Reference: RTGS2601270045
• Received: 2:15 PM
• Status: ✅ Reconciled

**Total Received Today:** ₹2,46,250

**Outstanding Payments:**

**Overdue (>30 days):**

🔴 **INV-2026-0089** (Critical)
• Customer: Elite Fashions
• Amount: ₹2,35,600
• Due date: Dec 25, 2025
• Overdue by: 33 days
• Follow-ups: 3 times
• **Action:** Legal notice prepared

🔴 **INV-2026-0095**
• Customer: Trend Setters
• Amount: ₹1,67,800
• Due date: Jan 2, 2026
• Overdue by: 25 days
• Follow-ups: 2 times
• **Action:** Call scheduled today

**Due This Week:**

🟡 **INV-2026-0112**
• Customer: StyleCraft Inc
• Amount: ₹1,89,400
• Due date: Jan 30, 2026
• Days remaining: 3 days
• **Action:** Reminder sent

🟡 **INV-2026-0108**
• Customer: Global Wear
• Amount: ₹1,45,200
• Due date: Jan 31, 2026
• Days remaining: 4 days
• **Action:** Follow-up call needed

**Due Next Week:**

🟢 **INV-2026-0120**
• Customer: Fashion Point
• Amount: ₹1,23,500
• Due date: Feb 5, 2026
• Days remaining: 9 days
• Status: On track

🟢 **INV-2026-0121**
• Customer: Clothing Co
• Amount: ₹98,600
• Due date: Feb 7, 2026
• Days remaining: 11 days
• Status: On track

**Payment Statistics:**

**This Month:**
• Total receivable: ₹65,45,000
• Received: ₹48,90,000 (75%)
• Pending: ₹16,55,000 (25%)
• Overdue: ₹4,03,400 (6%)

**Collection Efficiency:**
• On-time payments: 68%
• 1-15 days delay: 22%
• 16-30 days delay: 6%
• >30 days overdue: 4%

**Average Collection Period:** 38 days
**Target:** 35 days

**Payment Modes This Month:**
• NEFT: 45% (₹22,00,500)
• RTGS: 30% (₹14,67,000)
• Cheque: 15% (₹7,33,500)
• Cash: 5% (₹2,44,500)
• Online/UPI: 5% (₹2,44,500)

**Follow-up Schedule:**

**Today's Calls:**
• Elite Fashions (Overdue 33 days)
• Trend Setters (Overdue 25 days)
• Fashion Hub (Due in 5 days)

**This Week:**
• StyleCraft Inc (Reminder)
• Global Wear (Courtesy call)
• 5 other clients (Pre-due reminders)

**Follow-up Email Templates:**

**First Reminder (7 days before):**
"Dear [Customer], Your invoice INV-[Number] for ₹[Amount] is due on [Date]. Please arrange payment. Thank you!"

**Second Reminder (Due date):**
"Dear [Customer], Invoice INV-[Number] for ₹[Amount] is due today. Please confirm payment status."

**Third Reminder (7 days overdue):**
"Dear [Customer], Invoice INV-[Number] is overdue by 7 days. Please clear at earliest to avoid late charges."

**Final Notice (30 days overdue):**
"Dear [Customer], Invoice INV-[Number] is seriously overdue. Please settle immediately or contact us to discuss payment plan."

**Customer Payment History:**

**Best Payers** ⭐
• ABC Garments: Always on-time
• StyleCraft Inc: 2-3 days early
• Fashion Point: Reliable, within 30 days

**Watch List** ⚠️
• Elite Fashions: Consistently late
• Trend Setters: Poor payment history
• Budget Clothing: Requires follow-ups

**Payment Recovery Actions:**

**For 15-30 days overdue:**
• Daily phone calls
• Email reminders
• WhatsApp messages
• Visit if local

**For 30-60 days overdue:**
• Formal written notice
• Stop further supplies
• Escalate to senior management
• Consider legal notice

**For 60+ days overdue:**
• Legal notice sent
• Recovery agent involved
• Consider write-off
• Report to credit bureau

**Bank Reconciliation:**

**Today's Entries:**
• Opening balance: ₹12,45,600
• Receipts: ₹2,46,250
• Payments: ₹1,89,400
• **Closing balance:** ₹13,02,450

**Unreconciled Entries:** 0
**Last reconciled:** Jan 27, 2026 3:00 PM

Need help with a specific payment?`;
    }

    if (
      messageLower.includes("expense") ||
      messageLower.includes("cost") ||
      messageLower.includes("spending")
    ) {
      return `📊 **Expense Management & Tracking**

**Today's Expenses:**

**Raw Materials:**
• Thread purchase: ₹1,45,000
• Button purchase: ₹70,000
• Zipper order: ₹45,600
• Labels: ₹28,400
• **Subtotal:** ₹2,89,000

**Operational:**
• Electricity bill: ₹34,500
• Water charges: ₹4,200
• Maintenance: ₹12,000
• Cleaning supplies: ₹2,800
• **Subtotal:** ₹53,500

**Salaries & Wages:**
• Production staff wages: ₹45,000
• Office staff salary: ₹35,000
• Overtime: ₹8,500
• **Subtotal:** ₹88,500

**Transport & Logistics:**
• Delivery charges: ₹15,600
• Fuel: ₹8,900
• Vehicle maintenance: ₹5,400
• **Subtotal:** ₹29,900

**Total Expenses Today:** ₹4,60,900

**This Month's Expense Breakdown:**

**Major Categories:**
• Raw materials: ₹8,45,000 (35%)
• Salaries: ₹12,60,000 (52%)
• Operations: ₹1,45,000 (6%)
• Transport: ₹98,000 (4%)
• Miscellaneous: ₹75,000 (3%)

**Total This Month:** ₹24,23,000
**Budget:** ₹26,00,000
**Variance:** ₹1,77,000 under budget (7%)
**Status:** 🟢 On track

**Expense Trends:**

**Week-by-Week:**
• Week 1: ₹5,67,000
• Week 2: ₹6,12,000
• Week 3: ₹5,89,000
• Week 4 (current): ₹6,55,000 (projected)

**Compared to Last Month:**
• Last month: ₹23,45,000
• This month: ₹24,23,000
• Increase: ₹78,000 (3.3%)
• Reason: Higher raw material costs

**Cost Per Garment:**

**Average Production Cost:**
• Raw materials: ₹450
• Labor: ₹280
• Overhead: ₹120
• **Total cost:** ₹850 per garment

**Selling Price:** ₹2,500
**Gross Margin:** ₹1,650 (66%)
**Net Margin:** ₹1,200 (48%)

**Cost by Garment Type:**

**Shirts:**
• Fabric: ₹320
• Thread & accessories: ₹65
• Labor: ₹240
• Overhead: ₹95
• **Total:** ₹720

**Pants:**
• Fabric: ₹380
• Thread & accessories: ₹78
• Labor: ₹260
• Overhead: ₹102
• **Total:** ₹820

**Blazers:**
• Fabric: ₹680
• Thread & accessories: ₹135
• Labor: ₹420
• Overhead: ₹165
• **Total:** ₹1,400

**Expense Categories in Detail:**

**1. Raw Materials (35%)**
• Fabric: ₹5,45,000
• Threads: ₹1,20,000
• Buttons: ₹68,000
• Zippers: ₹45,000
• Labels: ₹34,000
• Other: ₹33,000

**2. Salaries & Wages (52%)**
• Production team: ₹6,80,000
• Quality control: ₹1,45,000
• Administration: ₹2,10,000
• Management: ₹1,50,000
• Support staff: ₹75,000

**3. Operations (6%)**
• Electricity: ₹68,000
• Water: ₹12,000
• Rent: ₹45,000
• Maintenance: ₹20,000

**4. Transport (4%)**
• Fuel: ₹45,000
• Vehicle maintenance: ₹28,000
• Delivery charges: ₹25,000

**5. Miscellaneous (3%)**
• Office supplies: ₹18,000
• Communication: ₹15,000
• Professional fees: ₹25,000
• Marketing: ₹17,000

**Cost Control Measures:**

✅ **Implemented:**
• Bulk purchasing (5% saving)
• Energy-efficient equipment
• Waste reduction program
• Negotiated better rates with suppliers
• Optimized delivery routes

**Savings Achieved:**
• Raw materials: ₹25,000/month
• Electricity: ₹8,000/month
• Transport: ₹12,000/month
• **Total monthly savings:** ₹45,000

**Expense Approval Workflow:**

**Up to ₹10,000:**
• Department head approval
• Direct processing

**₹10,000 - ₹50,000:**
• Finance manager approval
• Budget verification required

**Above ₹50,000:**
• MD/CEO approval
• Board notification
• Special budget allocation

**Pending Approvals:**
• Machine maintenance: ₹35,000 ⏳
• Marketing materials: ₹22,000 ⏳
• Office renovation: ₹1,25,000 ⏳

**Expense Optimization Tips:**

✅ **Raw Materials:**
• Negotiate annual contracts
• Buy in bulk for discounts
• Reduce wastage
• Quality control at receipt

✅ **Utilities:**
• Use energy-efficient lighting
• Optimal machine usage timing
• Regular maintenance
• Monitor consumption

✅ **Labor:**
• Improve productivity
• Reduce overtime
• Skill development
• Performance incentives

✅ **Transport:**
• Route optimization
• Vehicle maintenance schedule
• Fuel-efficient driving
• Load optimization

**Budget vs Actual:**

**Budget:** ₹26,00,000
**Actual:** ₹24,23,000
**Variance:** -₹1,77,000 (7% under)
**Forecast (Month-end):** ₹25,10,000

**Action Items:**
✅ Track weekly expenses
✅ Review supplier contracts
✅ Optimize production schedule
✅ Monitor utility consumption
✅ Control overtime costs

Need detailed expense report?`;
    }

    if (
      messageLower.includes("report") ||
      messageLower.includes("financial") ||
      messageLower.includes("profit") ||
      messageLower.includes("loss")
    ) {
      return `📈 **Financial Reports & Analytics**

**Monthly Financial Summary (January 2026):**

**Revenue:**
• Total orders: 450 garments
• Invoiced amount: ₹56,75,000
• GST collected: ₹10,21,500
• **Total billing:** ₹66,96,500

**Collections:**
• Cash received: ₹48,90,000 (86%)
• Pending: ₹7,85,000 (14%)
• Bad debts: ₹0

**Expenses:**
• Raw materials: ₹8,45,000
• Salaries: ₹12,60,000
• Operations: ₹1,45,000
• Transport: ₹98,000
• Other: ₹75,000
• **Total expenses:** ₹24,23,000

**Gross Profit:**
• Revenue: ₹56,75,000
• Direct costs: ₹8,45,000
• **Gross profit:** ₹48,30,000
• **Margin:** 85%

**Net Profit:**
• Gross profit: ₹48,30,000
• Operating expenses: ₹15,78,000
• **Net profit:** ₹32,52,000
• **Margin:** 57%

**Key Financial Metrics:**

**Profitability:**
• Gross margin: 85%
• Operating margin: 63%
• Net margin: 57%
• Return on sales: 57%
• Target margin: 55% ✅

**Liquidity:**
• Current ratio: 2.8:1
• Quick ratio: 2.1:1
• Cash balance: ₹13,02,450
• Working capital: ₹18,45,000

**Efficiency:**
• Receivables turnover: 7.2 times
• Avg collection period: 38 days
• Inventory turnover: 8.5 times
• Asset turnover: 3.2 times

**Growth:**
• Revenue growth: +12% MoM
• Order growth: +15% MoM
• Profit growth: +18% MoM
• Customer growth: +8% MoM

**Revenue Analysis:**

**By Garment Type:**
• Shirts (55%): ₹31,21,250
• Pants (30%): ₹17,02,500
• Blazers (12%): ₹6,81,000
• Others (3%): ₹1,70,250

**By Customer Segment:**
• Corporate (60%): ₹34,05,000
• Retail (30%): ₹17,02,500
• Export (8%): ₹4,54,000
• Others (2%): ₹1,13,500

**Top 10 Customers:**
1. ABC Garments: ₹8,45,000
2. StyleCraft Inc: ₹6,78,000
3. Fashion Hub: ₹5,23,000
4. Elite Wear: ₹4,56,000
5. TechWear: ₹3,89,000
6. Global Fashion: ₹3,45,000
7. Trend Setters: ₹2,98,000
8. Fashion Point: ₹2,67,000
9. Clothing Co: ₹2,34,000
10. Style Studio: ₹2,01,000

**Cost Analysis:**

**Variable Costs (40%):**
• Raw materials: ₹8,45,000
• Direct labor: ₹6,80,000
• Packaging: ₹1,23,000
• Delivery: ₹98,000
• **Total:** ₹17,46,000

**Fixed Costs (20%):**
• Salaries: ₹5,80,000
• Rent: ₹45,000
• Insurance: ₹28,000
• Depreciation: ₹1,24,000
• **Total:** ₹7,77,000

**Break-Even Analysis:**

**Fixed costs:** ₹7,77,000/month
**Contribution margin:** 60%
**Break-even sales:** ₹12,95,000
**Current sales:** ₹56,75,000
**Margin of safety:** 77%

**Cash Flow Statement:**

**Operating Activities:**
• Cash from customers: ₹48,90,000
• Cash to suppliers: -₹8,45,000
• Operating expenses: -₹15,78,000
• **Net operating cash:** ₹24,67,000

**Investing Activities:**
• Equipment purchase: -₹2,45,000
• Software upgrade: -₹45,000
• **Net investing cash:** -₹2,90,000

**Financing Activities:**
• Loan repayment: -₹1,50,000
• Dividend paid: -₹5,00,000
• **Net financing cash:** -₹6,50,000

**Net Cash Flow:** ₹15,27,000
**Opening cash:** ₹12,45,000
**Closing cash:** ₹27,72,000

**Balance Sheet Snapshot:**

**Assets:**
• Cash: ₹27,72,000
• Receivables: ₹7,85,000
• Inventory: ₹6,45,000
• Fixed assets: ₹18,90,000
• **Total assets:** ₹60,92,000

**Liabilities:**
• Payables: ₹3,45,000
• Loans: ₹12,50,000
• **Total liabilities:** ₹15,95,000

**Equity:**
• Share capital: ₹30,00,000
• Retained earnings: ₹14,97,000
• **Total equity:** ₹44,97,000

**Ratio Analysis:**

**Liquidity Ratios:**
• Current ratio: 2.8:1 (Good)
• Quick ratio: 2.1:1 (Good)
• Cash ratio: 1.8:1 (Excellent)

**Profitability Ratios:**
• Gross margin: 85% (Excellent)
• Net margin: 57% (Very good)
• ROE: 72% (Excellent)
• ROA: 53% (Very good)

**Efficiency Ratios:**
• Asset turnover: 3.2x (Good)
• Receivables turnover: 7.2x (Good)
• Inventory turnover: 8.5x (Excellent)

**Leverage Ratios:**
• Debt-to-equity: 0.35:1 (Low)
• Debt ratio: 26% (Healthy)
• Interest coverage: 18x (Strong)

**Financial Health Score: 92/100** ⭐

**Strengths:**
✅ High profitability
✅ Strong cash position
✅ Low debt levels
✅ Efficient operations
✅ Growing revenue

**Areas for Improvement:**
⚠️ Reduce collection period (38→35 days)
⚠️ Improve overdue management
⚠️ Control operational costs

**Year-to-Date Performance:**

**Q1 2026 (Jan only):**
• Revenue: ₹56,75,000
• Profit: ₹32,52,000
• Orders: 450

**FY 2026 Targets:**
• Revenue: ₹7.2 Crores
• Profit: ₹4.0 Crores
• Orders: 5,700
• New customers: 50

**Current vs Target:**
• Revenue: On track (8% of annual)
• Profit: Ahead (8.1% of annual)
• Orders: On track (7.9% of annual)

**Forecast:**
If current trend continues:
• Projected annual revenue: ₹6.8 Cr
• Projected profit: ₹3.9 Cr
• Achievement: 94% of target

Need detailed report for specific period?`;
    }

    if (
      messageLower.includes("gst") ||
      messageLower.includes("tax") ||
      messageLower.includes("return")
    ) {
      return `📋 **GST & Tax Management**

**GST Summary (January 2026):**

**Output GST (Sales):**
• Total taxable value: ₹56,75,000
• CGST @ 9%: ₹5,10,750
• SGST @ 9%: ₹5,10,750
• IGST @ 18%: ₹0 (no interstate)
• **Total GST collected:** ₹10,21,500

**Input GST (Purchases):**
• Raw materials: ₹8,45,000
  - CGST @ 9%: ₹76,050
  - SGST @ 9%: ₹76,050
• Services: ₹1,23,000
  - CGST @ 9%: ₹11,070
  - SGST @ 9%: ₹11,070
• **Total input GST:** ₹1,74,240

**GST Payable:**
• Output GST: ₹10,21,500
• Less: Input tax credit: ₹1,74,240
• **Net GST payable:** ₹8,47,260

**GST Filing Status:**

**GSTR-1 (Outward Supplies):**
• Period: January 2026
• Due date: Feb 11, 2026
• Status: 🟡 To be filed
• Invoices: 45 B2B invoices

**GSTR-3B (Summary Return):**
• Period: January 2026
• Due date: Feb 20, 2026
• Status: ⏳ Pending
• Payment due: ₹8,47,260

**GSTR-2B (ITC Statement):**
• Period: December 2025
• Auto-populated: ✅ Available
• Reconciliation: 🟡 In progress

**Previous Month Status:**
• December 2025: ✅ Filed on Jan 10
• GST paid: ₹7,89,450
• Status: Compliant

**GST Reconciliation:**

**Sales Register vs GSTR-1:**
• Books: ₹56,75,000
• GSTR-1: ₹56,75,000
• Difference: ₹0 ✅

**Purchase Register vs GSTR-2B:**
• Books ITC: ₹1,74,240
• GSTR-2B ITC: ₹1,68,900
• Difference: ₹5,340 ⚠️
• **Action:** Verify with suppliers

**GST Rate Structure:**

**Garments (HSN 62):**
• GST Rate: 18%
• CGST: 9%
• SGST: 9%
• IGST: 18% (interstate)

**Applicable to:**
• Shirts
• Pants
• Blazers
• All readymade garments

**Input Credit Available:**
• Fabric: 18%
• Threads: 18%
• Buttons: 18%
• All raw materials: 18%
• Services: 18%

**GST Compliance Checklist:**

**Monthly:**
□ Generate GSTR-1 (by 11th)
□ Pay GST liability (by 20th)
□ File GSTR-3B (by 20th)
□ Download GSTR-2B (by 14th)
□ Reconcile ITC
□ Maintain proper books

**Quarterly (for small businesses):**
□ File GSTR-1 (quarterly)
□ Pay tax monthly via PMT-06

**Annual:**
□ File GSTR-9 (Annual return)
□ GSTR-9C (Audit if applicable)
□ Reconciliation statement

**GST Invoice Requirements:**

**Mandatory Fields:**
✅ GSTIN of supplier
✅ GSTIN of recipient
✅ Invoice number (sequential)
✅ Invoice date
✅ HSN code (4 or 6 digit)
✅ Description of goods
✅ Quantity and unit
✅ Taxable value
✅ GST rate and amount
✅ Place of supply
✅ Signature

**Invoice Series:**
• Current series: INV/2026-27/001
• Last invoice: INV/2026-27/123
• Sequential numbers maintained ✅

**Input Tax Credit (ITC):**

**Eligible for ITC:**
✅ Raw materials for production
✅ Capital goods (machinery)
✅ Transport services
✅ Professional services
✅ Packing materials

**Not Eligible:**
❌ Motor vehicles (except specified)
❌ Food and beverages
❌ Employee welfare
❌ Personal use items

**Conditions for ITC:**
✅ Tax invoice must be available
✅ Goods/services received
✅ Tax paid to government
✅ Returns filed by supplier
✅ Used for business purpose

**GST Payment Methods:**

**Online Payment:**
• Net banking
• Debit/Credit card
• NEFT/RTGS
• Over the counter (OTC)

**Through Portal:**
1. Login to GST portal
2. Go to PMT-06
3. Add liability
4. Make payment
5. Generate challan
6. Payment confirmation

**Late Fee & Interest:**

**Late Filing:**
• GSTR-1: ₹50/day (max ₹10,000)
• GSTR-3B: ₹50/day (max ₹10,000)
• Total: ₹100/day

**Interest on Late Payment:**
• Rate: 18% per annum
• Calculated daily
• On outstanding tax amount

**Example:**
Tax due: ₹8,47,260
Days late: 10 days
Interest: ₹8,47,260 × 18% × 10/365
= ₹4,180

**GST Refund Status:**

**Pending Refunds:**
• Zero-rated supplies: ₹0
• Excess ITC: ₹0
• **Total:** ₹0

**Historical Refunds:**
• Last refund: June 2025
• Amount: ₹2,45,600
• Status: Received in 45 days

**Tax Deduction at Source (TDS):**

**TDS on Salaries:**
• Monthly TDS: ₹45,680
• YTD: ₹45,680 (January)
• Deposited: ✅ Jan 7, 2026
• Return filed: ⏳ Due Jan 31

**TDS on Payments:**
• Professional fees: ₹8,900
• Rent: ₹4,500
• Contract labor: ₹12,400
• **Total:** ₹25,800

**Other Compliances:**

**Income Tax:**
• Advance tax (Q4): Due Mar 15
• IT Return (FY25-26): Due Jul 31
• TDS returns: Quarterly

**Professional Tax:**
• Monthly: ₹2,500
• Status: ✅ Paid

**ESI/PF:**
• ESI: ₹12,450/month
• PF: ₹45,600/month
• Status: ✅ Compliant

**Upcoming Deadlines:**

🔴 **Jan 31, 2026:**
• TDS return (Q3)

🟡 **Feb 11, 2026:**
• GSTR-1 filing

🟡 **Feb 20, 2026:**
• GSTR-3B filing
• GST payment (₹8,47,260)

**Compliance Status: ✅ Compliant**
• No outstanding returns
• No pending payments
• All deadlines met
• Notice/Scrutiny: None

Need help with GST filing?`;
    }

    if (
      messageLower.includes("help") ||
      messageLower.includes("can you") ||
      messageLower.includes("what can")
    ) {
      return `💡 **How I Can Help You - Accounting & Finance**

**Invoice Management:**
• Generate new invoices
• Invoice tracking
• Pending invoices list
• Invoice templates
• Send invoices to customers

**Payment Tracking:**
• Received payments
• Outstanding payments
• Overdue tracking
• Follow-up schedules
• Payment reconciliation

**Expense Management:**
• Daily expense tracking
• Category-wise analysis
• Budget monitoring
• Cost control tips
• Approval workflows

**Financial Reports:**
• Profit & Loss statement
• Cash flow reports
• Balance sheet
• Financial ratios
• Performance analytics

**GST & Tax:**
• GST calculations
• Input tax credit
• Filing deadlines
• Tax compliance
• Return preparation

**Analytics:**
• Revenue trends
• Expense patterns
• Profitability analysis
• Customer analysis
• Cost optimization

**Quick Commands:**
• "Pending invoices" - To be generated
• "Payment status" - Receivables tracking
• "Today's expenses" - Daily spending
• "Financial report" - Monthly summary
• "GST status" - Tax compliance
• "Profit analysis" - Profitability metrics

**Try asking:**
• "Show pending invoices"
• "Payment status for this month"
• "Expense breakdown"
• "Generate financial report"
• "GST filing status"
• "Top 10 customers by revenue"

What specific help do you need today?`;
    }

    return `🤔 I understand you're asking about: "${userMessage}"

I can help with accounting and finance! Here's what I specialize in:

**Quick Suggestions:**
• "Pending invoices" - Invoice management
• "Payment status" - Receivables tracking
• "Expenses" - Cost tracking
• "Financial report" - P&L and analytics
• "GST status" - Tax compliance

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
    { icon: FileText, label: "Invoices", question: "Pending invoices" },
    { icon: DollarSign, label: "Payments", question: "Payment status" },
    { icon: TrendingUp, label: "Expenses", question: "Today's expenses" },
    { icon: CreditCard, label: "GST", question: "GST status" },
  ];

  return (
    <>
      {/* ── FAB ─────────────────────────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
        >
          <div className="w-12 h-12 bg-gray-900 hover:bg-indigo-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center">
            <MessageCircle className="h-5 w-5" />
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white" />
          <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Accountant AI
            <div className="absolute top-full right-3 border-4 border-transparent border-t-gray-900" />
          </div>
        </button>
      )}

      {/* ── Chat panel ──────────────────────────────────────────────── */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[580px] z-50 flex flex-col bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-none">Accountant AI</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <span className="text-[10px] text-gray-400">Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.type === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  message.type === "user" ? "bg-gray-900" : "bg-indigo-100"
                }`}>
                  {message.type === "user"
                    ? <User className="h-3 w-3 text-white" />
                    : <Bot className="h-3 w-3 text-indigo-600" />
                  }
                </div>

                {/* Bubble */}
                <div className={`max-w-[78%] flex flex-col ${message.type === "user" ? "items-end" : "items-start"}`}>
                  <div className={`rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
                    message.type === "user"
                      ? "bg-gray-900 text-white rounded-tr-sm"
                      : "bg-white border border-gray-200 text-gray-700 rounded-tl-sm shadow-sm"
                  }`}>
                    {parseMarkdown(message.content)}
                  </div>
                  <p className="text-[9px] text-gray-400 mt-1 px-0.5">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                  <Bot className="h-3 w-3 text-indigo-600" />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2.5 shadow-sm">
                  <div className="flex gap-1 items-center h-3">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips — only on first message */}
          {messages.length === 1 && (
            <div className="px-4 py-2.5 bg-white border-t border-gray-100 shrink-0">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 mb-2">Quick questions</p>
              <div className="grid grid-cols-2 gap-1.5">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInputMessage(q.question);
                      setTimeout(handleSendMessage, 100);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200 hover:border-indigo-200 rounded-xl transition-colors text-left"
                  >
                    <q.icon className="h-3 w-3 shrink-0" />
                    {q.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
                }}
                placeholder={isListening ? "Listening…" : "Ask me anything…"}
                disabled={isListening}
                className="flex-1 bg-transparent text-xs text-gray-800 outline-none placeholder:text-gray-400"
              />
              {speechSupported && (
                <button
                  onClick={toggleVoiceInput}
                  className={`shrink-0 p-1 rounded-lg transition-colors ${
                    isListening
                      ? "text-red-500 bg-red-50 animate-pulse"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                </button>
              )}
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="shrink-0 w-7 h-7 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-colors"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
