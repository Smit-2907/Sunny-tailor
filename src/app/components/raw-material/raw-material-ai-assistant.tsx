import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Boxes,
  Package2,
  TrendingUp,
  AlertCircle,
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

export function RawMaterialAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "👋 Hello! I'm your Raw Material Store AI Assistant. I can help you with:\n\n• Raw material inventory\n• Thread & button tracking\n• Zipper stock management\n• Label & tag inventory\n• Supplier coordination\n• Usage tracking & reports\n\nHow can I assist you today?",
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
      messageLower.includes("material list")
    ) {
      return `📦 **Raw Material Inventory**

**Threads:**
• Polyester Thread (White) - 850 spools (🟢 Good)
• Polyester Thread (Black) - 620 spools (🟢 Good)
• Polyester Thread (Blue) - 340 spools (🟡 Low)
• Polyester Thread (Red) - 280 spools (🟡 Low)
• Cotton Thread (White) - 450 spools (🟢 Good)
• Cotton Thread (Colors) - 680 spools (🟢 Good)

**Buttons:**
• Plastic Buttons (White) - 45,000 pcs (🟢 Excellent)
• Plastic Buttons (Black) - 32,000 pcs (🟢 Good)
• Metal Buttons (Silver) - 15,600 pcs (🟡 Low)
• Metal Buttons (Gold) - 8,900 pcs (🔴 Critical)
• Wooden Buttons - 6,700 pcs (🟢 Good)
• Shell Buttons - 4,200 pcs (🟡 Low)

**Zippers:**
• Metal Zippers (5") - 3,400 pcs (🟢 Good)
• Metal Zippers (7") - 2,100 pcs (🟡 Low)
• Plastic Zippers (5") - 5,600 pcs (🟢 Excellent)
• Plastic Zippers (7") - 3,890 pcs (🟢 Good)
• Invisible Zippers - 1,450 pcs (🟡 Low)
• Heavy Duty Zippers - 890 pcs (🟢 Good)

**Labels & Tags:**
• Woven Labels - 28,000 pcs (🟢 Excellent)
• Printed Labels - 15,600 pcs (🟢 Good)
• Care Labels - 22,400 pcs (🟢 Good)
• Price Tags - 18,900 pcs (🟢 Good)
• Brand Tags - 12,300 pcs (🟡 Low)
• Size Labels (Assorted) - 35,000 pcs (🟢 Excellent)

**Accessories:**
• Elastic Bands - 450 meters (🟢 Good)
• Velcro Strips - 280 meters (🟡 Low)
• Hook & Eye Sets - 12,600 sets (🟢 Good)
• Snap Buttons - 18,900 pcs (🟢 Good)
• Shoulder Pads - 2,340 pairs (🟡 Low)
• Collar Stays - 8,900 sets (🟢 Good)

**Packaging Materials:**
• Poly Bags (Small) - 15,000 pcs (🟢 Good)
• Poly Bags (Medium) - 12,400 pcs (🟢 Good)
• Poly Bags (Large) - 8,900 pcs (🟡 Low)
• Carton Boxes - 890 pcs (🟢 Good)
• Hangers - 5,600 pcs (🟢 Good)

**Stock Status:**
🟢 **Good Stock** - 32 items (68%)
🟡 **Low Stock** - 12 items (26%)
🔴 **Critical** - 3 items (6%)

**Total Inventory Value:** ₹8,45,900
**Storage Utilization:** 78%

**Today's Activity:**
• Items received: 15 deliveries
• Items issued: 28 requisitions
• Low stock alerts: 3 new
• Reorder initiated: 4 items

**Critical Alerts:**
⚠️ Metal Buttons (Gold) - Immediate reorder!
⚠️ Polyester Thread (Blue) - Order this week
⚠️ Invisible Zippers - Monitor closely

Need details on specific materials?`;
    }

    if (
      messageLower.includes("thread") ||
      messageLower.includes("spool")
    ) {
      return `🧵 **Thread Inventory & Management**

**Thread Types in Stock:**

**Polyester Threads:**
• **White** - 850 spools
  - Usage: 45 spools/day
  - Days remaining: 19 days
  - Status: 🟢 Good stock

• **Black** - 620 spools
  - Usage: 32 spools/day
  - Days remaining: 19 days
  - Status: 🟢 Good stock

• **Blue** - 340 spools
  - Usage: 28 spools/day
  - Days remaining: 12 days
  - Status: 🟡 Reorder soon

• **Red** - 280 spools
  - Usage: 18 spools/day
  - Days remaining: 15 days
  - Status: 🟡 Reorder soon

**Cotton Threads:**
• **White** - 450 spools
  - Usage: 22 spools/day
  - Days remaining: 20 days
  - Status: 🟢 Good stock

• **Mixed Colors** - 680 spools
  - Usage: 35 spools/day
  - Days remaining: 19 days
  - Status: 🟢 Good stock

**Thread Specifications:**
• Standard spool: 5000 meters
• Premium quality polyester
• Color fastness: Grade 4-5
• Tensile strength: High
• Suitable for all machines

**Usage Per Garment:**
**Shirts:**
• Body stitching: 80-100 meters
• Button attachment: 5-8 meters
• Hemming: 15-20 meters
• **Total:** ~120 meters per shirt

**Pants:**
• Body stitching: 100-120 meters
• Zipper attachment: 8-10 meters
• Hemming: 20-25 meters
• **Total:** ~140 meters per pant

**Blazers:**
• Body stitching: 150-180 meters
• Lining: 60-80 meters
• Button attachment: 10-15 meters
• **Total:** ~250 meters per blazer

**Today's Thread Usage:**
• White: 45 spools (225,000 meters)
• Black: 32 spools (160,000 meters)
• Colored: 38 spools (190,000 meters)
• **Total:** 115 spools issued

**Quality Standards:**
✅ No breaks during stitching
✅ Uniform thickness
✅ Color consistency
✅ Smooth finish
✅ No knots or tangles

**Storage Guidelines:**
• Keep in cool, dry place
• Away from direct sunlight
• Organized by color
• FIFO rotation system
• Check for damage before issue

**Supplier Information:**
**Primary:** ThreadMaster Industries
• Lead time: 5 days
• Min order: 500 spools
• Credit: 30 days
• Quality: Excellent

**Reorder Points:**
• White: 600 spools
• Black: 400 spools
• Colors: 300 spools each

**Cost Per Spool:**
• Polyester: ₹145
• Cotton: ₹168
• Premium: ₹195

Need to check specific thread color availability?`;
    }

    if (
      messageLower.includes("button") ||
      messageLower.includes("buttons")
    ) {
      return `🔘 **Button Inventory & Management**

**Button Stock by Type:**

**Plastic Buttons:**
• **White (2-hole, 12mm)** - 45,000 pcs
  - Most used size
  - Daily usage: 1,800 pcs
  - Days supply: 25 days
  - Status: 🟢 Excellent

• **Black (4-hole, 15mm)** - 32,000 pcs
  - Premium quality
  - Daily usage: 1,200 pcs
  - Days supply: 26 days
  - Status: 🟢 Good

• **Mixed Colors** - 28,400 pcs
  - Various sizes (10-18mm)
  - Special orders
  - Status: 🟢 Good

**Metal Buttons:**
• **Silver (Brass, 18mm)** - 15,600 pcs
  - For blazers/coats
  - Daily usage: 450 pcs
  - Days supply: 35 days
  - Status: 🟡 Monitor

• **Gold (Brass, 20mm)** - 8,900 pcs
  - Premium garments
  - Daily usage: 380 pcs
  - Days supply: 23 days
  - Status: 🔴 **Reorder Now!**

• **Antique Finish** - 6,700 pcs
  - Designer collection
  - Status: 🟢 Good

**Wooden Buttons:**
• Natural finish - 6,700 pcs
• Sizes: 15-25mm
• Eco-friendly option
• Status: 🟢 Good stock

**Shell Buttons:**
• Natural shell - 4,200 pcs
• Premium quality
• Sizes: 10-15mm
• Status: 🟡 Low - reorder soon

**Button Usage Per Garment:**

**Shirts:**
• Front buttons: 7-9 pcs
• Cuff buttons: 2 pcs
• Collar buttons: 2 pcs
• **Total:** 11-13 buttons per shirt

**Pants:**
• Waist button: 1 pc
• Fly buttons: 1 pc
• **Total:** 2 buttons per pant

**Blazers:**
• Front buttons: 2-3 pcs
• Sleeve buttons: 4 pcs (2 per sleeve)
• **Total:** 6-7 buttons per blazer

**Today's Button Issue:**
• Shirts: 1,800 buttons (150 garments)
• Pants: 180 buttons (90 garments)
• Blazers: 280 buttons (40 garments)
• **Total:** 2,260 buttons issued

**Quality Checks:**
✅ No cracks or chips
✅ Smooth edges
✅ Uniform color
✅ Holes properly aligned
✅ Correct size/thickness

**Storage:**
• Organized by type, size, color
• Plastic containers with labels
• Cool, dry environment
• FIFO system
• Regular stock counts

**Supplier Details:**
**ButtonCraft India**
📞 +91-98765-55555
• Lead time: 7 days
• MOQ: 10,000 pcs per type
• Credit terms: 45 days
• Quality: Premium

**Pricing:**
• Plastic (standard): ₹0.50/pc
• Metal (brass): ₹3.50/pc
• Wooden: ₹2.80/pc
• Shell: ₹4.20/pc

**Reorder Alert:**
🔴 **URGENT:** Gold metal buttons
🟡 **Soon:** Shell buttons, Silver metal
🟢 **Good:** All plastic buttons

**Cost Calculation:**
• Average shirt: ₹6.50 (buttons)
• Average pant: ₹1.00
• Average blazer: ₹24.50

Need specific button type information?`;
    }

    if (
      messageLower.includes("zipper") ||
      messageLower.includes("zip")
    ) {
      return `🔐 **Zipper Inventory & Management**

**Zipper Stock by Type:**

**Metal Zippers:**
• **5 inch (Brass)** - 3,400 pcs
  - For pants/skirts
  - Daily usage: 85 pcs
  - Days supply: 40 days
  - Status: 🟢 Good stock

• **7 inch (Brass)** - 2,100 pcs
  - For jackets/dresses
  - Daily usage: 52 pcs
  - Days supply: 40 days
  - Status: 🟡 Monitor closely

• **Heavy Duty (10 inch)** - 890 pcs
  - For jackets/coats
  - Daily usage: 18 pcs
  - Status: 🟢 Good

**Plastic Zippers:**
• **5 inch (Nylon)** - 5,600 pcs
  - Most popular size
  - Daily usage: 120 pcs
  - Days supply: 47 days
  - Status: 🟢 Excellent stock

• **7 inch (Nylon)** - 3,890 pcs
  - Multi-purpose use
  - Daily usage: 95 pcs
  - Days supply: 41 days
  - Status: 🟢 Good stock

• **10 inch (Coil)** - 2,450 pcs
  - Special applications
  - Status: 🟢 Good

**Invisible Zippers:**
• **7 inch** - 1,450 pcs
  - For dresses/formal wear
  - Daily usage: 28 pcs
  - Days supply: 52 days
  - Status: 🟡 **Order this week**

• **9 inch** - 890 pcs
  - Premium garments
  - Status: 🟢 Sufficient

**Zipper Colors Available:**
• Black: 40% of stock
• White: 25% of stock
• Navy Blue: 15% of stock
• Brown: 10% of stock
• Other colors: 10% of stock

**Usage by Garment Type:**

**Pants:**
• Standard: 5-inch metal zipper
• Usage: 90 pcs/day
• Most common: Brass finish

**Skirts:**
• Standard: 5-7 inch (depends on length)
• Usage: 25 pcs/day
• Type: Metal or invisible

**Jackets:**
• Standard: 10-14 inch metal
• Usage: 18 pcs/day
• Type: Heavy duty brass

**Dresses:**
• Standard: 7-9 inch invisible
• Usage: 28 pcs/day
• Type: Invisible/concealed

**Today's Zipper Issue:**
• Metal 5": 85 pcs (pants)
• Plastic 5": 120 pcs (casual wear)
• Plastic 7": 95 pcs (mixed)
• Invisible 7": 28 pcs (dresses)
• Heavy duty: 18 pcs (jackets)
• **Total:** 346 zippers issued

**Quality Standards:**
✅ Smooth operation (no snags)
✅ Strong teeth (no gaps)
✅ Durable slider
✅ Color matching available
✅ Lock mechanism works
✅ No rust/corrosion

**Quality Check Procedure:**
1. Visual inspection for defects
2. Test slider operation (up/down 10 times)
3. Check lock mechanism
4. Verify length accuracy
5. Inspect teeth alignment

**Storage Guidelines:**
• Store flat or hanging
• Organize by size and type
• Keep in moisture-free area
• Separate metal from plastic
• FIFO rotation
• Regular inventory checks

**Supplier Information:**
**ZipTech Solutions**
📞 +91-98765-66666
📧 sales@ziptech.in
• Lead time: 10 days
• MOQ: 1,000 pcs per size/type
• Credit: 30 days
• Quality: Premium YKK compatible

**Pricing:**
• Metal 5": ₹8.50/pc
• Metal 7": ₹12.00/pc
• Plastic 5": ₹4.50/pc
• Plastic 7": ₹6.00/pc
• Invisible: ₹9.50/pc
• Heavy Duty: ₹18.00/pc

**Reorder Points:**
• Metal 5": 2,000 pcs
• Metal 7": 1,500 pcs
• Plastic 5": 3,000 pcs
• Invisible: 1,000 pcs

**Cost Impact:**
• Average pant: ₹8.50 (zipper cost)
• Average dress: ₹9.50
• Average jacket: ₹18.00

**Common Issues:**
❌ Slider gets stuck → Check for bent teeth
❌ Zipper won't lock → Replace slider
❌ Teeth separation → Quality defect, reject
❌ Wrong length → Measure before issue

Need specific zipper type or size?`;
    }

    if (
      messageLower.includes("label") ||
      messageLower.includes("tag") ||
      messageLower.includes("tags")
    ) {
      return `🏷️ **Labels & Tags Inventory**

**Label & Tag Stock:**

**Woven Labels:**
• **Brand Labels (Main)** - 28,000 pcs
  - Company logo labels
  - Premium quality
  - Woven polyester
  - Daily usage: 850 pcs
  - Days supply: 33 days
  - Status: 🟢 Excellent

**Care Labels:**
• **Washing Instructions** - 22,400 pcs
  - Standard care symbols
  - Multiple languages
  - Daily usage: 680 pcs
  - Days supply: 33 days
  - Status: 🟢 Good stock

**Printed Labels:**
• **Size Labels** - 35,000 pcs
  - All sizes (XS to XXL)
  - Breakdown:
    - XS: 3,500 pcs
    - S: 7,000 pcs
    - M: 10,500 pcs (most used)
    - L: 8,750 pcs
    - XL: 3,500 pcs
    - XXL: 1,750 pcs
  - Status: 🟢 Excellent

• **Composition Labels** - 15,600 pcs
  - Fabric content details
  - Compliance labels
  - Status: 🟢 Good

**Price Tags:**
• **Barcode Price Tags** - 18,900 pcs
  - With barcode
  - Pre-printed format
  - Daily usage: 580 pcs
  - Days supply: 32 days
  - Status: 🟢 Good

**Brand Tags:**
• **Hang Tags (Premium)** - 12,300 pcs
  - Glossy cardboard
  - Full color print
  - With string attachment
  - Daily usage: 450 pcs
  - Days supply: 27 days
  - Status: 🟡 Monitor

**Usage Per Garment:**

**Complete Label Set for Shirts:**
1. Main brand label (neck/back)
2. Size label (side seam)
3. Care label (side seam)
4. Composition label (side seam)
5. Price tag (hang tag)
6. Brand tag (front attachment)
**Total:** 6 labels/tags per garment

**Complete Label Set for Pants:**
1. Main brand label (waistband)
2. Size label (waistband)
3. Care label (waistband)
4. Composition label (waistband)
5. Price tag (hang tag)
**Total:** 5 labels/tags per garment

**Today's Label Issue:**

**Morning Batch (8 AM - 12 PM):**
• Woven labels: 425 pcs
• Care labels: 340 pcs
• Size labels: 425 pcs
• Price tags: 290 pcs

**Afternoon Batch (1 PM - 5 PM):**
• Woven labels: 425 pcs
• Care labels: 340 pcs
• Size labels: 425 pcs
• Price tags: 290 pcs

**Total Today:** 2,960 labels/tags

**Label Placement Standards:**

**Shirts:**
• Brand label: Center back neck
• Size: Left side seam (inside)
• Care: Below size label
• Composition: Below care label
• Price tag: Left cuff button

**Pants:**
• Brand label: Center back waistband
• Size: Inside waistband (back)
• Care: Next to size label
• Composition: Inside waistband (side)
• Price tag: Back right pocket

**Quality Checks:**
✅ Print clarity and legibility
✅ Correct information
✅ No spelling errors
✅ Color accuracy
✅ Proper cutting/trimming
✅ Attachment strings intact

**Storage:**
• Organized by type
• Climate-controlled area
• Flat storage (prevent curling)
• Protected from moisture
• Easy access for issue
• FIFO system

**Supplier Information:**
**PrintPro Labels**
📞 +91-98765-77777
📧 orders@printprolabels.com
• Lead time: 12 days
• MOQ: 10,000 pcs per design
• Credit: 45 days
• Quality: Premium fabric labels

**Pricing:**
• Woven labels: ₹2.50/pc
• Care labels: ₹1.20/pc
• Size labels: ₹0.80/pc
• Price tags: ₹1.50/pc
• Brand hang tags: ₹4.50/pc

**Label Cost Per Garment:**
• Shirt complete set: ₹10.50
• Pant complete set: ₹8.50
• Average: ₹9.50 per garment

**Compliance Requirements:**
✅ Country of origin
✅ Fabric composition (%)
✅ Washing instructions (symbols)
✅ Size (standard sizing)
✅ Brand identification
✅ RN/CA number (if applicable)

**Reorder Points:**
• Woven labels: 15,000 pcs
• Care labels: 12,000 pcs
• Size labels: 20,000 pcs
• Price tags: 10,000 pcs
• Brand tags: 8,000 pcs

**Current Status:**
🟢 All label types well-stocked
🟡 Brand hang tags - monitor weekly
✅ No urgent reorders needed

Need custom label information?`;
    }

    if (
      messageLower.includes("reorder") ||
      messageLower.includes("low stock") ||
      messageLower.includes("purchase") ||
      messageLower.includes("order")
    ) {
      return `🔔 **Reorder Alerts & Purchase Orders**

**CRITICAL - Immediate Action Required:**

🔴 **Metal Buttons (Gold, 20mm)**
• Current stock: 8,900 pcs
• Reorder point: 10,000 pcs
• Daily usage: 380 pcs
• Days remaining: 23 days
• **Action:** PO raised today
• Supplier: ButtonCraft India
• Quantity ordered: 20,000 pcs
• Expected: Feb 3, 2026

**LOW STOCK - Order This Week:**

🟡 **Invisible Zippers (7 inch)**
• Current: 1,450 pcs
• Reorder point: 2,000 pcs
• Daily usage: 28 pcs
• Days remaining: 52 days
• **Action:** Prepare PO
• Recommended qty: 3,000 pcs

🟡 **Polyester Thread (Blue)**
• Current: 340 spools
• Reorder point: 300 spools
• Daily usage: 28 spools
• Days remaining: 12 days
• **Action:** Contact supplier
• Recommended qty: 500 spools

🟡 **Shell Buttons**
• Current: 4,200 pcs
• Reorder point: 5,000 pcs
• Daily usage: 85 pcs
• Days remaining: 49 days
• **Action:** Get quotation
• Recommended qty: 10,000 pcs

🟡 **Brand Hang Tags**
• Current: 12,300 pcs
• Reorder point: 15,000 pcs
• Daily usage: 450 pcs
• Days remaining: 27 days
• **Action:** Place order
• Recommended qty: 25,000 pcs

**MONITOR CLOSELY:**

🟡 **Metal Zippers (7 inch)** - 40 days left
🟡 **Shoulder Pads** - 45 days left
🟡 **Velcro Strips** - 38 days left
🟡 **Poly Bags (Large)** - 42 days left

**Active Purchase Orders:**

**PO-RM-2026-034** ✅ Confirmed
• Item: Metal Buttons (Gold)
• Quantity: 20,000 pcs
• Supplier: ButtonCraft India
• Order date: Jan 27, 2026
• Expected: Feb 3, 2026
• Value: ₹70,000
• Status: 🚚 In production

**PO-RM-2026-032** 🚚 In Transit
• Item: Polyester Thread (Mixed)
• Quantity: 1,000 spools
• Supplier: ThreadMaster
• Order date: Jan 22, 2026
• Expected: Jan 29, 2026
• Value: ₹1,45,000
• Status: Dispatched yesterday

**PO-RM-2026-031** ✅ Delivered
• Item: Plastic Buttons (White)
• Quantity: 50,000 pcs
• Supplier: ButtonCraft
• Received: Jan 26, 2026
• Value: ₹25,000
• Quality: Approved

**Supplier Performance:**

**ThreadMaster Industries**
⭐ Rating: 4.9/5
• On-time delivery: 96%
• Quality acceptance: 98%
• Lead time: 5 days
• Credit: 30 days
• **Status:** Excellent

**ButtonCraft India**
⭐ Rating: 4.7/5
• On-time delivery: 94%
• Quality acceptance: 96%
• Lead time: 7 days
• Credit: 45 days
• **Status:** Very good

**ZipTech Solutions**
⭐ Rating: 4.8/5
• On-time delivery: 95%
• Quality acceptance: 97%
• Lead time: 10 days
• Credit: 30 days
• **Status:** Excellent

**PrintPro Labels**
⭐ Rating: 4.6/5
• On-time delivery: 92%
• Quality acceptance: 99%
• Lead time: 12 days
• Credit: 45 days
• **Status:** Very good

**This Month's Procurement:**
• Total POs raised: 12
• Total value: ₹6,85,000
• Items received: 8
• Pending delivery: 4
• Quality rejections: 1 (2.3%)

**Budget Status:**
• Monthly budget: ₹8,00,000
• Spent so far: ₹6,85,000
• Remaining: ₹1,15,000
• Utilization: 86%

**Cost Optimization Tips:**
✅ Bulk ordering for 5-10% discount
✅ Annual contracts for price stability
✅ Compare 3 quotes before ordering
✅ Negotiate extended credit terms
✅ Plan purchases to avoid rush orders

**Reorder Checklist:**
1. ✅ Check current stock level
2. ✅ Calculate days remaining
3. ✅ Review consumption trend
4. ✅ Get supplier quotations
5. ✅ Verify budget availability
6. ✅ Raise purchase order
7. ✅ Follow up with supplier
8. ✅ Track delivery status
9. ✅ Inspect upon receipt
10. ✅ Update inventory

**Emergency Contacts:**
**ThreadMaster:** +91-98765-11111
**ButtonCraft:** +91-98765-55555
**ZipTech:** +91-98765-66666
**PrintPro:** +91-98765-77777

Need to raise a purchase order?`;
    }

    if (
      messageLower.includes("help") ||
      messageLower.includes("can you") ||
      messageLower.includes("what can")
    ) {
      return `💡 **How I Can Help You - Raw Materials**

**Inventory Management:**
• Current stock levels (all materials)
• Thread inventory & usage tracking
• Button stock by type & size
• Zipper availability & types
• Labels & tags inventory
• Packaging materials

**Material-Specific Info:**
• Thread types & specifications
• Button varieties & pricing
• Zipper sizes & applications
• Label types & compliance
• Accessories inventory
• Storage guidelines

**Procurement Support:**
• Reorder point alerts
• Critical stock warnings
• Supplier contact details
• Purchase order tracking
• Lead time information
• Cost optimization tips

**Usage & Planning:**
• Material usage per garment
• Daily consumption tracking
• Requisition processing
• Issue documentation
• Return management
• Wastage analysis

**Quality Control:**
• Quality check procedures
• Acceptance criteria
• Defect identification
• Storage best practices
• FIFO implementation
• Inspection guidelines

**Reports & Analytics:**
• Daily usage reports
• Stock status summaries
• Reorder recommendations
• Supplier performance
• Cost analysis
• Inventory valuation

**Quick Commands:**
• "Show inventory"
• "Thread stock"
• "Button availability"
• "Zipper types"
• "Reorder alerts"
• "Purchase order status"

**Try asking:**
• "What's the thread inventory?"
• "Show button stock levels"
• "Which items need reordering?"
• "Zipper usage per garment"
• "Label types available"
• "Supplier contact info"

What specific information do you need?`;
    }

    return `🤔 I understand you're asking about: "${userMessage}"

I can help with raw material management! Here's what I specialize in:

**Quick Suggestions:**
• "Show inventory" - All materials stock
• "Thread stock" - Thread availability
• "Button types" - Button inventory
• "Zipper info" - Zipper details
• "Reorder alerts" - Low stock items
• "Labels & tags" - Label inventory

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
    { icon: Boxes, label: "Inventory", question: "Show inventory" },
    { icon: Package2, label: "Thread", question: "Thread stock" },
    { icon: TrendingUp, label: "Buttons", question: "Button types" },
    { icon: AlertCircle, label: "Reorder", question: "Reorder alerts" },
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
            Ask Raw Material Assistant
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
                  <h3 className="font-semibold">Raw Material AI</h3>
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
