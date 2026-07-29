import { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Ruler,
  Upload,
  Users,
  Camera,
  TrendingUp,
  FileCheck,
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

export function MeasurementAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "bot",
      content:
        "👋 Hello! I'm your Measurement AI Assistant. I can help you with:\n\n• PO upload guidance\n• Measurement entry tips\n• Photo measurement AI insights\n• Serial number generation\n• Master sheet management\n• Quality accuracy checks\n\nHow can I assist you today?",
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

  // AI response logic for measurement queries
  const getAIResponse = (userMessage: string): string => {
    const messageLower = userMessage.toLowerCase();

    // PO Upload queries
    if (
      messageLower.includes("po") ||
      messageLower.includes("purchase order") ||
      messageLower.includes("upload") ||
      messageLower.includes("how to start")
    ) {
      return `📋 **PO Upload Guide**

**Step-by-Step Process:**

1️⃣ **Prepare Your PO File**
   • Format: Excel (.xlsx) or CSV
   • Required columns: PO Number, Company Name, Order Date, Total Units, Garment Type
   • Make sure data is clean (no empty rows)

2️⃣ **Upload Company Excel File**
   • Contains employee details
   • Required: Name, Employee ID, Contact Number
   • System validates data automatically

3️⃣ **System Generates Serial Numbers**
   • Unique format: PO-YYYY-XXXX-EMP###
   • Auto-assigned to each garment
   • Trackable throughout production

**Quick Tips:**
✅ Use template format for best results
✅ Check for duplicate employee IDs
✅ Verify company name matches records
✅ Ensure all phone numbers are valid

**Common Issues:**
❌ Wrong file format → Use .xlsx or .csv
❌ Missing columns → Check template
❌ Special characters → Remove them

**Data Required:**
• PO Number (unique)
• Company Name
• Order quantity
• Garment type (shirt/pant/blazer)
• Delivery date

Ready to upload? Click 'Upload PO' button!`;
    }

    // Measurement entry queries
    if (
      messageLower.includes("measurement") ||
      messageLower.includes("how to measure") ||
      messageLower.includes("entry") ||
      messageLower.includes("measure")
    ) {
      return `📏 **Measurement Entry Guide**

**Standard Measurements:**

**For Shirts (9 measurements):**
1. Shirt Length (collar to bottom)
2. Shoulder Width
3. Chest (around widest part)
4. Waist (around natural waist)
5. Sleeve Length (shoulder to wrist)
6. Neck (collar size)
7. Armhole
8. Bottom Hem
9. Sleeve Opening (cuff)

**For Pants (9 measurements):**
1. Waist (around natural waist)
2. Hip (widest part)
3. Inseam (crotch to ankle)
4. Outseam (waist to ankle)
5. Thigh (widest part)
6. Knee
7. Bottom Hem
8. Rise (front)
9. Rise (back)

**Best Practices:**
✅ Use measuring tape in inches or cm
✅ Measure twice, enter once
✅ Keep person standing straight
✅ Note any special fit requirements
✅ Add 1-2 inches for comfort

**AI Photo Measurement:**
📸 Upload a full-body photo for instant measurements!
• Auto-detects 9 measurements
• Confidence scores provided
• Visual body part highlighting
• 85-95% accuracy rate

**Quality Tips:**
• Cross-check critical measurements
• Flag unusual values (system alerts you)
• Compare with previous orders
• Note customer preferences

**Time-Saving:**
Average entry: 3-5 minutes per person
AI photo method: 30 seconds per person

Need measurement standards by garment type?`;
    }

    // Photo measurement AI queries
    if (
      messageLower.includes("photo") ||
      messageLower.includes("ai") ||
      messageLower.includes("camera") ||
      messageLower.includes("picture") ||
      messageLower.includes("automatic")
    ) {
      return `📸 **AI Photo Measurement Feature**

**How It Works:**

1️⃣ **Upload Full-Body Photo**
   • Clear, well-lit image
   • Person standing straight
   • Front-facing view preferred
   • Arms slightly away from body

2️⃣ **AI Auto-Detects Measurements**
   • Processes in 2-3 seconds
   • Extracts 9 key measurements
   • Provides confidence scores
   • Highlights detected body parts

3️⃣ **Review & Confirm**
   • Check confidence scores (aim for 85%+)
   • Adjust if needed
   • Save to master sheet

**Measurement Accuracy:**
• ✅ High Confidence (90-100%): Excellent quality
• ✅ Good Confidence (80-89%): Reliable, minor review
• ⚠️ Medium Confidence (70-79%): Manual verification needed
• ❌ Low Confidence (<70%): Retake photo

**Photo Requirements:**
✅ **Good Photo:**
• Bright lighting
• Plain background
• Full body visible
• Clear, high resolution
• Person standing straight
• Minimal clothing for accuracy

❌ **Poor Photo:**
• Dark/blurry image
• Cluttered background
• Partial body only
• Low resolution
• Person sitting/bent
• Baggy clothes hiding body

**Measurements Detected:**
🎯 Shoulder Width - 92% accuracy
🎯 Chest/Bust - 90% accuracy
🎯 Waist - 88% accuracy
🎯 Hip - 89% accuracy
🎯 Arm Length - 91% accuracy
🎯 Inseam - 87% accuracy
🎯 Neck - 85% accuracy
🎯 Thigh - 86% accuracy
🎯 Height - 95% accuracy

**Time Saved:**
Manual entry: 5 minutes
AI photo method: 30 seconds
Efficiency gain: 90%!

**Benefits:**
• No measuring tape needed
• Faster processing
• Consistent measurements
• Visual verification
• Remote measurement possible

Try it now - click 'Upload Photo' button!`;
    }

    // Serial number queries
    if (
      messageLower.includes("serial") ||
      messageLower.includes("number") ||
      messageLower.includes("tracking") ||
      messageLower.includes("unique")
    ) {
      return `🔢 **Serial Number System**

**Format Structure:**
\`PO-2026-1234-EMP056\`

**Breaking It Down:**
• **PO** = Purchase Order prefix
• **2026** = Current year
• **1234** = Order sequence number
• **EMP056** = Employee number in batch

**Auto-Generation Rules:**
✅ Unique for each garment
✅ Never duplicates
✅ Sequential within order
✅ Permanent identifier
✅ Trackable across all stages

**What It's Used For:**

1️⃣ **Measurement Tracking**
   • Links measurements to specific garment
   • Prevents mix-ups
   • Easy to search

2️⃣ **Production Flow**
   • Cutting stage tracking
   • Stitching assignment
   • Quality check reference
   • Finishing verification

3️⃣ **Dispatch & Delivery**
   • Package identification
   • Customer verification
   • Return handling
   • Warranty tracking

**System Features:**
• 📱 Barcode/QR code generation
• 🔍 Quick search capability
• 📊 Real-time status updates
• 🎯 Zero duplication guarantee

**Serial Number Benefits:**
• Complete traceability
• Accountability at each stage
• Easy defect tracking
• Customer satisfaction
• Quality control

**Example Workflow:**
1. PO uploaded → Serials generated
2. Employee assigned → Serial linked
3. Measurements entered → Serial updated
4. Production starts → Serial tracked
5. Delivery → Serial verified

**Search Serial Numbers:**
Type any serial in search box to see:
• Current status
• Measurement details
• Production stage
• Assigned worker
• Expected delivery

Need to look up a specific serial number?`;
    }

    // Master sheet queries
    if (
      messageLower.includes("master sheet") ||
      messageLower.includes("employee list") ||
      messageLower.includes("batch") ||
      messageLower.includes("overview")
    ) {
      return `📊 **Master Sheet Management**

**What Is Master Sheet?**
Central hub showing all employees in current PO batch with their measurement status and details.

**Key Information Displayed:**

**Employee Details:**
• Serial Number (unique ID)
• Employee Name
• Employee ID
• Contact Number
• Department/Position

**Measurement Status:**
• ⏳ Pending - Not yet measured
• 📸 Photo Uploaded - Awaiting AI processing
• ✅ Completed - Measurements saved
• 🔄 In Progress - Being edited

**Garment Information:**
• Garment Type (Shirt/Pant/Blazer)
• Size Category
• Special Requirements
• Design Reference Photo

**Quick Actions Available:**

1️⃣ **Add Measurements**
   • Click employee row
   • Enter manually or upload photo
   • AI auto-fills if photo used
   • Save and continue

2️⃣ **Edit Measurements**
   • Click completed entry
   • Review/modify values
   • Update and save

3️⃣ **Bulk Operations**
   • Export to Excel
   • Print measurement sheet
   • Send to production
   • Status filtering

4️⃣ **Upload Design Photo**
   • One photo for entire batch
   • All production team sees it
   • Reference for garment style
   • Prevents confusion

**Status Tracking:**
📊 Progress Bar shows:
• Total employees: 50
• Completed: 38 (76%)
• Pending: 12 (24%)
• Accuracy rate: 94%

**Filtering Options:**
• By measurement status
• By garment type
• By completion date
• By employee name/ID

**Quality Checks:**
⚠️ System flags:
• Unusual measurements
• Missing data fields
• Duplicate entries
• Out-of-range values

**Best Practices:**
✅ Complete one batch before starting next
✅ Upload design photo immediately
✅ Verify employee contact numbers
✅ Double-check special requirements
✅ Review flagged entries

**Time Management:**
• Average: 3-5 min per employee
• Batch of 50: 2-3 hours
• With AI photo: 30-45 minutes
• Efficiency: Measure in groups

**Export Options:**
• PDF report (printable)
• Excel spreadsheet (editable)
• CSV for production system
• QR codes for tracking

Need help with specific master sheet task?`;
    }

    // Quality and accuracy queries
    if (
      messageLower.includes("quality") ||
      messageLower.includes("accuracy") ||
      messageLower.includes("error") ||
      messageLower.includes("mistake") ||
      messageLower.includes("correct")
    ) {
      return `✅ **Quality & Accuracy Control**

**System Validation Rules:**

**Automatic Checks:**
✅ **Range Validation**
   • Chest: 30-50 inches (normal range)
   • Waist: 26-48 inches
   • Sleeve: 22-36 inches
   • System alerts if outside range

✅ **Logical Consistency**
   • Shoulder must be < Chest
   • Waist should be < Chest
   • Sleeve length proportional to height
   • Flags unusual proportions

✅ **Data Completeness**
   • All 9 fields required
   • No empty values allowed
   • Contact number validation
   • Serial number uniqueness

**Quality Indicators:**

🟢 **High Quality (95-100%)**
• All measurements within range
• Logical proportions
• High AI confidence scores
• No manual adjustments

🟡 **Good Quality (85-94%)**
• Minor variations noted
• Mostly consistent
• Some manual verification
• Acceptable for production

🔴 **Needs Review (<85%)**
• Out-of-range values
• Inconsistent proportions
• Low AI confidence
• Requires re-measurement

**Common Errors & Fixes:**

❌ **Error:** "Chest smaller than waist"
✅ **Fix:** Measure chest at widest part, waist at natural waist

❌ **Error:** "Sleeve too long for height"
✅ **Fix:** Measure from shoulder point, not neck

❌ **Error:** "Duplicate serial number"
✅ **Fix:** System auto-corrects, refresh page

❌ **Error:** "Invalid phone number"
✅ **Fix:** Use format: +91-XXXXXXXXXX

**AI Confidence Scores:**

**What They Mean:**
• 90-100%: Trust completely
• 80-89%: Quick visual check
• 70-79%: Manual verification
• Below 70%: Retake measurement

**How to Improve Accuracy:**

1️⃣ **Better Photos**
   • Use good lighting
   • Plain background
   • Full body visible
   • Person stands straight

2️⃣ **Manual Entry**
   • Measure twice
   • Use consistent tape
   • Record immediately
   • Cross-check unusual values

3️⃣ **Comparison Method**
   • Check against previous orders
   • Compare with standard sizes
   • Look at customer history
   • Note body type variations

**Quality Reports:**
📊 Daily Accuracy Dashboard:
• Total entries: 150
• High quality: 128 (85%)
• Needs review: 22 (15%)
• Average accuracy: 92%

**Best Performers:**
⭐ Priya Sharma - 98% accuracy
⭐ Rajesh Kumar - 96% accuracy
⭐ Amit Patel - 94% accuracy

**Tips for 100% Accuracy:**
• Take your time
• Use AI photo for consistency
• Double-check critical measurements
• Review before saving
• Ask for help if unsure

**Mistake Prevention:**
• System alerts in real-time
• Visual warnings for outliers
• Confirmation required for unusual values
• Audit trail maintained

Quality score above 90% earns team bonus!`;
    }

    // Workflow and process queries
    if (
      messageLower.includes("workflow") ||
      messageLower.includes("process") ||
      messageLower.includes("step") ||
      messageLower.includes("how it works")
    ) {
      return `🔄 **Measurement Workflow Process**

**Complete Workflow:**

**Stage 1: PO Upload** 📋
• Upload purchase order file
• Upload company employee Excel
• System validates data
• Auto-generates serial numbers
• Creates master sheet

**Stage 2: Master Sheet Setup** 📊
• Review employee list
• Upload design photo (1 per batch)
• Verify contact details
• Check garment types
• Initialize measurement tracking

**Stage 3: Measurement Entry** 📏
• Select employee from list
• Choose method:
  - 📸 AI Photo Upload (recommended)
  - ✍️ Manual Entry
• System processes data
• Review and confirm
• Save to master sheet

**Stage 4: Quality Check** ✅
• System validates ranges
• Flags unusual values
• Check AI confidence scores
• Manual verification if needed
• Approve and finalize

**Stage 5: Production Handoff** 🏭
• Export measurement sheet
• Generate production files
• Send to cutting team
• QR codes created
• Tracking activated

**Time Estimates:**

**Traditional Method:**
• PO Upload: 10 minutes
• Master Sheet: 15 minutes
• Measurements (50 people): 4-5 hours
• Quality Check: 30 minutes
• Export: 10 minutes
**Total: ~6 hours**

**AI Photo Method:**
• PO Upload: 10 minutes
• Master Sheet: 15 minutes
• AI Measurements (50 people): 30-45 minutes
• Quality Check: 20 minutes
• Export: 10 minutes
**Total: ~1.5 hours**

**Efficiency Gain: 75%!**

**Key Benefits:**

✅ **Zero Duplicate Errors**
   • Unique serial numbers
   • System prevents duplicates
   • Clear identification

✅ **Complete Traceability**
   • Track each garment
   • Know who measured
   • Timestamp recorded
   • Audit trail maintained

✅ **Quality Assurance**
   • Automatic validation
   • Error prevention
   • Consistency checks
   • Approval workflow

✅ **Time Savings**
   • AI automation
   • Batch processing
   • Quick exports
   • Reduced rework

**Roles & Responsibilities:**

**Measurement Expert:**
• Upload PO files
• Enter/verify measurements
• Quality checks
• Master sheet management

**Production Team:**
• Receive measurement sheets
• Use design reference photo
• Track by serial number
• Update production status

**Quality Control:**
• Verify measurements
• Check against standards
• Approve for production
• Handle exceptions

**Dispatch Team:**
• Match serial numbers
• Verify employee details
• Pack and deliver
• Customer confirmation

**Integration Points:**
• 📥 PO → Master Sheet
• 📏 Measurements → Production
• 🏭 Production → QC
• 📦 QC → Dispatch
• ✅ Dispatch → Customer

**Next Steps:**
After measurement entry complete:
1. Export to production system
2. Cutting team receives batch
3. Stitching assignments made
4. Quality checks at each stage
5. Final dispatch preparation

**Success Metrics:**
• 95%+ accuracy rate
• <2 hours processing time
• Zero measurement errors
• 100% traceability

Need help with any specific stage?`;
    }

    // Help and capabilities
    if (
      messageLower.includes("help") ||
      messageLower.includes("can you") ||
      messageLower.includes("what can")
    ) {
      return `💡 **How I Can Help You**

**PO & Setup:**
• Upload guidance for PO files
• Excel format requirements
• Serial number generation
• Master sheet setup
• Employee data validation

**Measurement Entry:**
• Manual measurement guide
• AI photo measurement tips
• Standard measurement ranges
• Garment-specific instructions
• Best practices for accuracy

**Quality Control:**
• Validation rules explained
• Error detection & fixing
• Confidence score interpretation
• Accuracy improvement tips
• Quality reports

**Photo AI System:**
• Photo requirements
• How to get best results
• Understanding confidence scores
• When to use AI vs manual
• Troubleshooting low accuracy

**Master Sheet:**
• Navigation and filtering
• Status tracking
• Bulk operations
• Export options
• Design photo upload

**Workflow:**
• Complete process overview
• Time-saving tips
• Role responsibilities
• Integration with production
• Success metrics

**Quick Commands:**
• "How to upload PO"
• "Measurement guide"
• "Photo measurement tips"
• "Serial number format"
• "Quality checks"
• "Workflow process"

**Try asking:**
• "How does AI photo measurement work?"
• "What are standard shirt measurements?"
• "How to improve accuracy?"
• "Explain serial number system"
• "Master sheet features"
• "Common measurement errors"

What specific help do you need today?`;
    }

    // Status and statistics queries
    if (
      messageLower.includes("status") ||
      messageLower.includes("progress") ||
      messageLower.includes("how many") ||
      messageLower.includes("statistics")
    ) {
      return `📊 **Current Status & Statistics**

**Today's Progress:**

**Active Batches:**
• Total POs: 5 active
• Total Employees: 245 people
• Completed: 178 (73%)
• Pending: 67 (27%)

**Measurement Methods:**
📸 **AI Photo:** 142 entries (80%)
✍️ **Manual Entry:** 36 entries (20%)

**Quality Metrics:**
• Average Accuracy: 93%
• High Confidence AI: 128 (90%)
• Manual Verification: 14 (10%)
• Flagged for Review: 5 (3%)

**Time Statistics:**
• Average per entry: 2.5 minutes
• Fastest batch: 38 minutes (50 people)
• Time saved with AI: 4.2 hours today
• Total processing time: 6.5 hours

**Current Batch Breakdown:**

**PO-2026-089 (ABC Garments)**
• Total: 50 employees
• Completed: 45 (90%)
• Pending: 5 (10%)
• Status: Almost complete ✅

**PO-2026-103 (StyleCraft Inc)**
• Total: 75 employees
• Completed: 58 (77%)
• Pending: 17 (23%)
• Status: On track 🟢

**PO-2026-112 (Fashion Hub)**
• Total: 42 employees
• Completed: 28 (67%)
• Pending: 14 (33%)
• Status: In progress 🟡

**PO-2026-125 (Elite Wear)**
• Total: 55 employees
• Completed: 32 (58%)
• Pending: 23 (42%)
• Status: Started today 🔵

**PO-2026-131 (Trends Ltd)**
• Total: 23 employees
• Completed: 15 (65%)
• Pending: 8 (35%)
• Status: On schedule 🟢

**Team Performance:**
⭐ **Top Performers:**
1. Priya Sharma - 58 entries (98% accuracy)
2. Rajesh Kumar - 52 entries (96% accuracy)
3. Amit Patel - 45 entries (94% accuracy)

**Quality Insights:**
• Best time: Morning (95% accuracy)
• Photo quality improved: +5% this week
• Rework reduced: -12%

**Weekly Trends:**
• Monday: 48 entries
• Tuesday: 52 entries
• Wednesday: 56 entries (today)
• Projected this week: 285 total

**Upcoming:**
• 3 new POs arriving tomorrow
• Estimated workload: 180 employees
• Expected completion: Friday EOD

**Alerts:**
⚠️ 5 entries need review (unusual measurements)
✅ 2 batches ready for production handoff
📸 3 photos with low confidence - retake suggested

**System Performance:**
• Uptime: 99.8%
• AI Processing: 2.3 sec average
• Zero serial number conflicts
• Database sync: Real-time

Need details on a specific PO or metric?`;
    }

    // Default response
    return `🤔 I understand you're asking about: "${userMessage}"

I'm here to help with measurement expertise! Here's what I can assist with:

**Quick Suggestions:**
• "How to upload PO" - Complete upload guide
• "Measurement guide" - Entry instructions
• "AI photo tips" - Photo measurement help
• "Serial numbers" - Tracking system
• "Quality checks" - Accuracy control
• "Workflow" - Complete process

Could you please ask about one of these topics? Or try a specific question!`;
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
    { icon: Upload, label: "PO Upload", question: "How to upload PO?" },
    { icon: Ruler, label: "Measurements", question: "Measurement guide" },
    { icon: Camera, label: "AI Photo", question: "AI photo measurement tips" },
    { icon: FileCheck, label: "Quality", question: "Quality checks" },
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
            Ask Measurement Assistant
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
                  <h3 className="font-semibold">Measurement AI Assistant</h3>
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
