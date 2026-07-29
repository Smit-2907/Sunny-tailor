import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Truck,
  Package,
  MapPin,
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

export function DispatchAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "👋 Hello! I'm your Dispatch AI Assistant. I can help you with:\n\n• Order dispatch tracking\n• Delivery status updates\n• Customer confirmation\n• Packaging guidelines\n• Serial number verification\n• Delivery route optimization\n\nHow can I assist you today?",
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
      messageLower.includes("ready") ||
      messageLower.includes("dispatch") ||
      messageLower.includes("pending") ||
      messageLower.includes("status")
    ) {
      return `📦 **Dispatch Status Dashboard**

**Ready for Dispatch:**

**PO-2026-089** (ABC Garments) ✅
• Order: 50 shirts
• Company: ABC Garments Pvt Ltd
• Serial range: PO-2026-0089-001 to 050
• Quality checked: ✅ Passed
• Packed: ✅ Complete
• Labels verified: ✅ All correct
• Delivery address confirmed: ✅ Yes
• **Status:** Ready to ship today
• Expected delivery: Jan 28, 2026

**PO-2026-103** (StyleCraft) ✅
• Order: 75 pants
• Company: StyleCraft Inc
• Serial range: PO-2026-0103-001 to 075
• Quality checked: ✅ Passed
• Packed: ✅ Complete
• Labels verified: ✅ All correct
• Delivery address confirmed: ✅ Yes
• **Status:** Ready to ship today
• Expected delivery: Jan 29, 2026

**In Packing - 2 orders:**

**PO-2026-112** (Fashion Hub) 🟡
• Order: 42 blazers
• Serial range: PO-2026-0112-001 to 042
• Quality check: ✅ Complete
• Packing: 🟡 In progress (60%)
• Expected ready: 3 PM today
• Delivery: Jan 30, 2026

**PO-2026-115** (Elite Wear) 🟡
• Order: 55 shirts
• Serial range: PO-2026-0115-001 to 055
• Quality check: 🟡 In progress
• Packing: ⏳ Pending QC
• Expected ready: 5 PM today
• Delivery: Jan 31, 2026

**Dispatched Today:**

**Morning Batch (8:00 AM):**
• PO-2026-085: 60 garments → Delivered ✅
• PO-2026-087: 45 garments → In transit 🚚

**Afternoon Batch (2:00 PM):**
• PO-2026-089: 50 garments → Scheduled
• PO-2026-103: 75 garments → Scheduled

**Delivery Statistics:**

**Today:**
• Total orders dispatched: 4
• Total garments: 230 pieces
• On-time dispatch rate: 100%
• Vehicle utilization: 85%

**This Week:**
• Orders dispatched: 28
• Total garments: 1,450 pieces
• Delivery success: 96%
• Average delivery time: 1.8 days

**Pending Customer Confirmation:**
• PO-2026-081: Awaiting address
• PO-2026-095: Contact unreachable
• PO-2026-098: Delivery date to be confirmed

**Vehicle Schedule:**

**Vehicle 1 (MH-01-AB-1234):**
• Driver: Ramesh Kumar
• Route: Mumbai - Thane - Kalyan
• Orders: 3 (185 garments)
• Departure: 9:00 AM
• Status: 🚚 On route

**Vehicle 2 (MH-02-CD-5678):**
• Driver: Suresh Patil
• Route: Pune - Nashik
• Orders: 2 (125 garments)
• Departure: 2:00 PM
• Status: Ready

**Urgent Actions Needed:**
⚠️ Confirm delivery address for PO-2026-081
⚠️ Contact customer for PO-2026-095
⚠️ Schedule delivery date for PO-2026-098

Need details on a specific order?`;
    }

    if (
      messageLower.includes("pack") ||
      messageLower.includes("packaging") ||
      messageLower.includes("how to pack") ||
      messageLower.includes("guidelines")
    ) {
      return `📦 **Packaging Guidelines & Checklist**

**Standard Packaging Process:**

**Step 1: Quality Verification ✅**
• Check garment quality
• Verify measurements
• Inspect for defects
• Ensure all accessories attached
• Check labels and tags

**Step 2: Folding & Presentation 👔**

**For Shirts:**
• Button all buttons
• Fold sleeves behind back
• Fold vertically in half
• Fold horizontally once
• Place tissue paper inside
• Final size: 30cm x 20cm

**For Pants:**
• Fold vertically (leg on leg)
• Fold horizontally at knee
• Fold again at waist
• Place tissue paper
• Final size: 35cm x 25cm

**For Blazers:**
• Button front buttons
• Fold sleeves behind
• Place tissue in shoulders
• Use hanger or fold carefully
• Special care for structure
• Final size: 40cm x 30cm

**Step 3: Individual Poly Bag 🛍️**
• Use appropriate size bag
• Insert garment carefully
• Add desiccant packet (moisture)
• Seal bag properly
• Attach serial number sticker

**Step 4: Serial Number Verification 🔢**
• Scan/verify serial number
• Match with order list
• Check employee details
• Confirm garment type
• Mark as packed in system

**Step 5: Box Packing 📦**
• Use sturdy corrugated box
• Layer garments carefully
• Don't overfill (max 20-25 pieces)
• Add cushioning material
• Place packing list on top

**Step 6: Box Sealing & Labeling 🏷️**
• Seal with strong packing tape
• Apply company address label
• Attach delivery address label
• Mark "Handle with Care"
• Add "Fragile" if needed
• Note box weight

**Step 7: Documentation 📄**
• Packing list (inside & outside)
• Invoice copy
• Delivery challan
• Serial number list
• Quality certificate
• Company letter (if any)

**Quality Checks During Packing:**

✅ **Visual Inspection:**
• No stains or marks
• No loose threads
• All buttons secure
• Zippers working
• Hems properly done
• Labels correctly placed

✅ **Accessories Check:**
• All buttons present
• Zipper functional
• Labels readable
• Tags attached
• Extra buttons included (if applicable)

✅ **Serial Number Accuracy:**
• Matches order list
• Readable barcode/QR
• Correct employee ID
• PO number verified

**Packaging Materials Needed:**

**Per Garment:**
• 1 poly bag (size appropriate)
• 1 tissue paper
• 1 desiccant packet
• 1 serial number sticker

**Per Box:**
• 1 corrugated box (standard size)
• Packing tape (strong adhesive)
• Cushioning material
• 2 address labels (sender + receiver)
• 1 packing list (printed)
• Fragile stickers (if needed)

**Box Size Guidelines:**
• Small box: 15-20 garments (shirts/pants)
• Medium box: 10-15 garments (mixed)
• Large box: 5-10 garments (blazers/coats)

**Special Handling:**

**Premium Garments:**
• Use premium poly bags
• Extra tissue padding
• Individual boxes (if specified)
• Handle with extra care
• Special packaging instructions

**Bulk Orders:**
• Organize by employee ID
• Group by size if requested
• Use multiple boxes
• Number boxes (1 of 3, 2 of 3, etc.)
• Master packing list

**Common Packaging Errors:**

❌ **Avoid These Mistakes:**
• Overfilling boxes → Crushing
• Poor folding → Wrinkles
• Missing serial numbers → Confusion
• Weak tape → Box opening
• No cushioning → Damage
• Wrong addresses → Return/delay

**Quality Standards:**
• Zero crushed garments
• All serials verified
• Proper labeling
• Secure packaging
• Clean presentation

**Time Standards:**
• Shirts: 2-3 minutes each
• Pants: 2-3 minutes each
• Blazers: 4-5 minutes each
• Box packing: 10-15 minutes

**Safety Tips:**
✅ Use proper lifting technique
✅ Don't overload boxes
✅ Keep workspace organized
✅ Dispose packaging waste properly
✅ Handle box cutters carefully

**Final Checklist Before Dispatch:**
□ All garments accounted for
□ Serial numbers verified
□ Quality checked
□ Properly folded
□ Poly bags sealed
□ Boxes sealed securely
□ Labels attached correctly
□ Documentation complete
□ Customer details confirmed
□ Delivery schedule set

Ready to start packing?`;
    }

    if (
      messageLower.includes("verify") ||
      messageLower.includes("serial") ||
      messageLower.includes("check") ||
      messageLower.includes("scan")
    ) {
      return `🔍 **Serial Number Verification System**

**Why Verify Serial Numbers?**
• Prevents wrong deliveries
• Ensures order accuracy
• Tracks each garment
• Customer satisfaction
• Quality accountability
• Return handling

**Verification Process:**

**Step 1: Scan/Enter Serial Number**
• Use barcode scanner (recommended)
• Or manually enter serial number
• Format: PO-2026-XXXX-EMP###
• System validates format

**Step 2: System Lookup**
• Retrieves garment details
• Shows employee information
• Displays order details
• Confirms garment type
• Shows quality status

**Step 3: Physical Verification**
• Match garment type (shirt/pant/blazer)
• Check size matches record
• Verify employee name/ID
• Confirm measurements
• Check quality approval

**Step 4: Mark as Verified**
• Update status in system
• Print verification label
• Attach to package
• Log timestamp
• Record verifier name

**Example Verification:**

**Serial:** PO-2026-0089-EMP012

**System Shows:**
• **PO Number:** PO-2026-089
• **Company:** ABC Garments Pvt Ltd
• **Employee:** Rajesh Kumar
• **Employee ID:** EMP-1234
• **Garment Type:** Shirt (Medium)
• **Measurements:** Chest 38", Waist 32"
• **Quality Status:** ✅ Approved
• **Production Date:** Jan 25, 2026
• **Packed By:** Priya S.
• **Verified:** ✅ Jan 27, 2026 2:15 PM

**Verification Checklist:**
✅ Serial number readable
✅ Matches order list
✅ Garment type correct
✅ Size matches record
✅ Quality approved
✅ Employee details correct
✅ All labels present
✅ No defects visible

**Common Verification Issues:**

**Issue:** Serial not found in system
**Solution:** Check format, verify PO number, contact production

**Issue:** Garment type mismatch
**Solution:** Flag for review, don't dispatch, notify production

**Issue:** Quality not approved
**Solution:** Return to QC, don't pack, update status

**Issue:** Employee details wrong
**Solution:** Verify with HR records, correct if minor error

**Issue:** Barcode damaged/unreadable
**Solution:** Manual entry, print new label, attach securely

**Verification Statistics:**

**Today's Progress:**
• Total scanned: 230 garments
• Verified successful: 228 (99.1%)
• Issues found: 2 (0.9%)
• Average time: 45 seconds/garment
• Error rate: 0.9% (target <1%)

**Common Errors Found:**
• Wrong size label: 1 case
• Missing care label: 1 case
• Defect found: 0 cases
• Serial mismatch: 0 cases

**Batch Verification:**

**For Large Orders (50+ garments):**
• Random sample check (10%)
• Full scan of serial numbers
• Visual inspection of all
• Document any issues
• Get supervisor approval

**Quality Gates:**
✅ **Gate 1:** Production complete
✅ **Gate 2:** Quality inspection
✅ **Gate 3:** Serial verification
✅ **Gate 4:** Packaging complete
✅ **Gate 5:** Ready for dispatch

**Verification Tools:**

**Barcode Scanner:**
• Faster processing
• Fewer errors
• Automatic logging
• Recommended method

**Manual Entry:**
• Backup method
• Double-check critical details
• Use for damaged barcodes
• Requires extra care

**Mobile App:**
• Field verification
• Real-time updates
• Photo documentation
• GPS location tracking

**Best Practices:**
✅ Scan in sequence
✅ Double-check mismatches
✅ Report issues immediately
✅ Keep workspace organized
✅ Maintain verification log
✅ Update system in real-time

**Serial Number Format:**
**PO-2026-0089-EMP012**
• **PO:** Purchase Order
• **2026:** Year
• **0089:** Order number
• **EMP012:** Employee number

**Verification Report:**
Generated daily showing:
• Total garments verified
• Issues found
• Resolution status
• Verification time
• Staff performance

**Customer Confidence:**
"100% serial verification ensures every garment reaches the right person. Zero mix-ups, 100% satisfaction!"

Need help with a specific serial number?`;
    }

    if (
      messageLower.includes("delivery") ||
      messageLower.includes("route") ||
      messageLower.includes("vehicle") ||
      messageLower.includes("driver")
    ) {
      return `🚚 **Delivery Management & Route Optimization**

**Today's Delivery Schedule:**

**Morning Deliveries (8:00 AM - 12:00 PM):**

**Route 1: Mumbai Local**
• Vehicle: MH-01-AB-1234
• Driver: Ramesh Kumar (+91-98765-11111)
• Orders: 3
  - PO-2026-085: Andheri (60 pcs) ✅ Delivered 9:15 AM
  - PO-2026-087: Borivali (45 pcs) 🚚 In transit
  - PO-2026-091: Malad (38 pcs) ⏳ Next stop
• Total garments: 143 pieces
• Distance: 45 km
• Expected completion: 11:30 AM
• Status: On schedule

**Route 2: Thane-Kalyan**
• Vehicle: MH-02-CD-5678
• Driver: Suresh Patil (+91-98765-22222)
• Orders: 2
  - PO-2026-089: Thane (50 pcs)
  - PO-2026-093: Kalyan (32 pcs)
• Total garments: 82 pieces
• Distance: 38 km
• Departure: 10:00 AM
• Expected completion: 1:00 PM
• Status: Loading in progress

**Afternoon Deliveries (2:00 PM - 6:00 PM):**

**Route 3: Pune**
• Vehicle: MH-12-EF-9012
• Driver: Amit Shah (+91-98765-33333)
• Orders: 2
  - PO-2026-103: Pune (75 pcs)
  - PO-2026-107: Pimpri (55 pcs)
• Total garments: 130 pieces
• Distance: 150 km
• Departure: 2:00 PM
• Expected completion: 6:30 PM
• Status: Scheduled

**Delivery Route Optimization:**

**Factors Considered:**
• Customer location proximity
• Traffic patterns
• Delivery time preferences
• Order priority
• Vehicle capacity
• Driver availability

**Optimization Benefits:**
✅ 25% reduction in fuel costs
✅ 30% more deliveries per day
✅ Faster delivery times
✅ Improved customer satisfaction
✅ Better vehicle utilization

**Standard Delivery Times:**

**Local (Within 30 km):**
• Same day dispatch: Delivered by 6 PM
• Morning dispatch: Delivered by 12 PM
• Afternoon dispatch: Delivered by 6 PM

**Regional (30-100 km):**
• Delivered next business day
• Morning dispatch: Next day 2 PM
• Afternoon dispatch: Next day 5 PM

**Outstation (100+ km):**
• Delivered in 2-3 business days
• Courier partner used
• Tracking number provided

**Driver Communication:**

**Before Departure:**
• Route details shared
• Customer contact numbers
• Special instructions
• Expected time per stop
• Emergency contacts

**During Delivery:**
• Real-time GPS tracking
• Status updates via app
• Photo proof of delivery
• Customer signature
• Issue reporting

**After Delivery:**
• Delivery confirmation
• Return empty boxes
• Collect payment (COD)
• Customer feedback
• Vehicle maintenance check

**Vehicle Management:**

**Vehicle 1: MH-01-AB-1234**
• Type: Tempo (1-ton capacity)
• Condition: Excellent
• Last service: Jan 15, 2026
• Next service: Feb 15, 2026
• Fuel: Diesel
• Mileage: 12 km/liter
• Status: Active

**Vehicle 2: MH-02-CD-5678**
• Type: Tempo (1-ton capacity)
• Condition: Good
• Last service: Jan 10, 2026
• Next service: Feb 10, 2026
• Fuel: Diesel
• Mileage: 11 km/liter
• Status: Active

**Vehicle 3: MH-12-EF-9012**
• Type: Truck (3-ton capacity)
• Condition: Excellent
• Last service: Jan 20, 2026
• Next service: Feb 20, 2026
• Fuel: Diesel
• Mileage: 8 km/liter
• Status: Active (Long distance)

**Delivery Success Metrics:**

**This Week:**
• Total deliveries: 28
• Successful: 27 (96%)
• Failed: 1 (customer not available)
• Average delivery time: 1.8 days
• On-time delivery: 93%

**Customer Not Available:**
• Reattempt next day
• Contact customer via phone
• Leave notice card
• Reschedule delivery
• Update system

**Special Delivery Instructions:**

**Handle with Care:**
• Premium garments
• Blazers/coats
• Designer collection
• Mark boxes clearly

**Time-Sensitive:**
• Event dates specified
• Priority delivery
• Extra communication
• Confirm arrival

**Bulk Orders:**
• Multiple boxes
• Verify count at delivery
• Get proper acknowledgment
• Take photos

**Delivery Documentation:**

**Required at Delivery:**
✅ Delivery challan (2 copies)
✅ Invoice/bill
✅ Packing list
✅ Quality certificate
✅ Company letter (if any)

**Customer to Provide:**
✅ Signature on challan
✅ Company stamp
✅ Received by (name)
✅ Date and time
✅ Any remarks

**Delivery Issues - Quick Solutions:**

**Wrong Address:**
• Contact customer immediately
• Get correct address
• Reschedule delivery
• Update system

**Customer Not Available:**
• Call customer
• Leave notice
• Arrange next-day delivery
• Store safely at warehouse

**Order Quantity Mismatch:**
• Recount with customer
• Check packing list
• Document discrepancy
• Report immediately

**Damaged Package:**
• Don't deliver
• Take photos
• Return to warehouse
• Investigate and repack

**GPS Tracking Features:**
• Real-time location
• Route history
• Speed monitoring
• Stop duration
• Geofencing alerts

**Delivery Performance:**
⭐ **Top Performer:** Ramesh Kumar
• Deliveries: 142 this month
• Success rate: 98%
• Average time: 1.5 days
• Customer rating: 4.9/5

**Contact for Delivery Help:**
📞 Dispatch Manager: +91-98765-00000
📞 Emergency: +91-98765-99999

Need to track a specific delivery?`;
    }

    if (
      messageLower.includes("customer") ||
      messageLower.includes("confirm") ||
      messageLower.includes("contact") ||
      messageLower.includes("address")
    ) {
      return `📞 **Customer Confirmation & Communication**

**Pre-Dispatch Confirmation Checklist:**

**Step 1: Customer Details Verification**
✅ Company name correct
✅ Contact person name
✅ Phone number verified
✅ Email address (if available)
✅ Delivery address complete
✅ Landmark/instructions
✅ Pin code verified

**Step 2: Order Details Confirmation**
✅ PO number
✅ Total garment count
✅ Garment types breakdown
✅ Employee list verified
✅ Special instructions noted
✅ Delivery date agreed

**Step 3: Delivery Preferences**
✅ Preferred delivery time
✅ Contact person availability
✅ Receiving procedure
✅ Payment terms (if COD)
✅ Documentation requirements

**Sample Confirmation Call Script:**

**Opening:**
"Hello, may I speak with [Contact Person]?"
"This is [Your Name] from [Company Name] regarding your garment order PO-[Number]."

**Order Verification:**
"I'm calling to confirm delivery details for your order:"
• Order number: PO-2026-089
• Total garments: 50 shirts
• Company: ABC Garments Pvt Ltd

**Address Confirmation:**
"Please confirm your delivery address:"
[Read address]
"Is this correct? Any additional directions?"

**Timing:**
"We're planning delivery for [Date]. What time works best for you?"
"Our delivery window is 10 AM to 5 PM. Do you have a preference?"

**Documentation:**
"On delivery, we'll need:"
• Signature on delivery challan
• Company stamp
• Acknowledgment of count

"Will [Contact Person] be available to receive?"

**Contact Details:**
"May I confirm your contact number: [Number]"
"Is there an alternate number in case we can't reach you?"

**Closing:**
"Thank you for confirming. We'll send you a message before dispatch."
"Our driver [Name] will call you 30 minutes before arrival."
"Is there anything else you'd like to add?"

**Communication Channels:**

**Phone Call:** (Primary method)
• Most reliable
• Immediate clarification
• Personal touch
• Document conversation

**SMS/WhatsApp:** (Confirmation)
• Delivery scheduled message
• Tracking link
• Driver contact
• Expected time update

**Email:** (Documentation)
• Formal confirmation
• Attach invoice/challan
• Packing list
• Track delivery

**Customer Categories:**

**Regular Customers:**
• Known addresses
• Standard procedures
• Quick confirmation
• Trusted relationship

**New Customers:**
• Detailed verification
• Extra communication
• Clear expectations
• Follow-up closely

**Corporate Clients:**
• Multiple contacts
• Formal communication
• Advance notice required
• Documentation critical

**Common Customer Queries:**

**Q: "When will my order be delivered?"**
A: "Your order PO-[Number] is scheduled for delivery on [Date]. We'll dispatch in the [morning/afternoon] and delivery is expected by [time]."

**Q: "Can you deliver to a different address?"**
A: "Yes, please provide the complete new address with landmark and contact person details. We'll update our records."

**Q: "What if I'm not available?"**
A: "No problem! You can either:"
• Provide alternate contact person
• Reschedule to a convenient date
• Authorize someone to receive on your behalf

**Q: "How do I verify the garments?"**
A: "Each garment has a unique serial number. We'll provide a complete list. You can verify:"
• Count matches
• Serial numbers present
• Employee names correct
• Quality as expected

**Q: "What documents will I receive?"**
A: "You'll receive:"
• Delivery challan (2 copies)
• Invoice/bill
• Packing list with serial numbers
• Quality certificate
• Our company letter

**Q: "Can I make changes to the order?"**
A: "Please contact our production team immediately at [number]. If garments are already packed, changes may not be possible."

**Customer Confirmation Status:**

**Confirmed - Ready to Dispatch:**
• PO-2026-089: ABC Garments ✅
• PO-2026-103: StyleCraft Inc ✅
• PO-2026-107: Fashion Point ✅

**Pending Confirmation:**
• PO-2026-081: Address not verified ⚠️
• PO-2026-095: Contact unreachable 🔴
• PO-2026-098: Delivery date pending 🟡

**Follow-up Required:**
• PO-2026-095: Try alternate numbers
• PO-2026-098: Send email reminder
• PO-2026-102: Confirm payment mode

**Post-Delivery Communication:**

**Immediate (On Delivery):**
• SMS confirmation sent
• "Your order PO-[Number] has been delivered successfully. Thank you!"

**Next Day:**
• Satisfaction call
• "Was everything received in good condition?"
• "Any issues or concerns?"
• Collect feedback

**One Week Later:**
• Quality check
• "Are the garments meeting your expectations?"
• "Any fit or quality issues?"
• Address any concerns

**Customer Feedback Template:**

**Delivery Experience:**
• On-time delivery: ⭐⭐⭐⭐⭐
• Driver behavior: ⭐⭐⭐⭐⭐
• Package condition: ⭐⭐⭐⭐⭐
• Documentation: ⭐⭐⭐⭐⭐

**Product Quality:**
• Garment quality: ⭐⭐⭐⭐⭐
• Fit accuracy: ⭐⭐⭐⭐⭐
• Finishing: ⭐⭐⭐⭐⭐
• Overall satisfaction: ⭐⭐⭐⭐⭐

**Communication Standards:**
✅ Professional tone
✅ Clear and concise
✅ Patient and helpful
✅ Accurate information
✅ Timely responses
✅ Document everything

**Customer Relationship Tips:**
• Build rapport
• Be proactive
• Anticipate concerns
• Solve problems quickly
• Follow up always
• Maintain records

**Emergency Contacts:**
**Dispatch Manager:** +91-98765-00000
**Customer Service:** +91-98765-00001
**After Hours:** +91-98765-00002

**Customer Satisfaction This Month:**
• Overall rating: 4.7/5
• On-time delivery: 96%
• Quality satisfaction: 98%
• Communication rating: 4.8/5
• Repeat customers: 85%

Need help contacting a specific customer?`;
    }

    if (
      messageLower.includes("help") ||
      messageLower.includes("can you") ||
      messageLower.includes("what can")
    ) {
      return `💡 **How I Can Help You - Dispatch Operations**

**Order Management:**
• Ready-to-dispatch orders
• Packing status tracking
• Order priority management
• Batch scheduling
• Delivery planning

**Packaging Support:**
• Packaging guidelines
• Quality checks
• Material requirements
• Box size selection
• Label printing

**Serial Verification:**
• Serial number lookup
• Verification process
• Error handling
• Batch verification
• System updates

**Delivery Coordination:**
• Route optimization
• Vehicle assignment
• Driver scheduling
• Delivery tracking
• Time management

**Customer Communication:**
• Confirmation calls
• Address verification
• Delivery scheduling
• Issue resolution
• Feedback collection

**Documentation:**
• Delivery challan
• Packing lists
• Invoice preparation
• Quality certificates
• Proof of delivery

**Quick Commands:**
• "Dispatch status" - Current orders
• "Packing guide" - How to pack
• "Verify serial" - Serial lookup
• "Delivery route" - Route details
• "Customer confirm" - Call scripts

**Try asking:**
• "What orders are ready for dispatch?"
• "How to pack blazers?"
• "Verify serial PO-2026-089-012"
• "Today's delivery schedule"
• "Customer confirmation checklist"
• "Packaging materials needed"

What specific help do you need today?`;
    }

    return `🤔 I understand you're asking about: "${userMessage}"

I can help with dispatch operations! Here's what I specialize in:

**Quick Suggestions:**
• "Dispatch status" - Orders ready to ship
• "Packing guide" - Packaging instructions
• "Verify serial" - Serial number lookup
• "Delivery route" - Route & vehicle info
• "Customer confirm" - Communication tips

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
    { icon: Truck, label: "Dispatch", question: "Dispatch status" },
    { icon: Package, label: "Packing", question: "Packing guide" },
    { icon: CheckCircle, label: "Verify", question: "Verify serial" },
    { icon: MapPin, label: "Delivery", question: "Delivery route" },
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
            Ask Dispatch Assistant
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
                  <h3 className="font-semibold">Dispatch AI Assistant</h3>
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
