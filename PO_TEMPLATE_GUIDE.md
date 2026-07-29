# Purchase Order Template System for Sunny Tailor

## 🎯 Overview
A complete Purchase Order creation and management system that generates professional, print-ready PO documents similar to the sample Rubamin PO template.

---

## 📋 Two PO Creation Modes

### 1. **Basic PO Creation** (Quick Mode)
- Simple form with essential fields
- Best for quick PO generation
- Includes: Client info, quantity, uniform type, deadline, pricing
- Automatically creates basic line items

### 2. **Detailed PO Creation** (Professional Mode)
- Comprehensive form with all professional PO fields
- Generates documents exactly like the sample template
- Includes all fields from Rubamin PO example

---

## 🏢 Detailed PO Template - Complete Fields

### **Company Details (Your Company - Sunny Tailor)**
- ✅ Company Name
- ✅ Billing Address
- ✅ Shipping Address
- ✅ GSTIN (GST Identification Number)
- ✅ PAN (Permanent Account Number)
- ✅ CIN (Corporate Identification Number) - Optional
- ✅ Email Address
- ✅ Phone Number
- ✅ Company Logo Placeholder

### **Vendor/Supplier Details (Client)**
- ✅ Vendor Code (e.g., V0000107130)
- ✅ Supplier Name
- ✅ Contact Person
- ✅ Mobile Number
- ✅ Email Address
- ✅ Full Address
- ✅ GSTIN
- ✅ MSME Registration (if applicable)
- ✅ State

### **PO Header Information**
- ✅ PO Number (Auto-generated: PO-2026-XXXX)
- ✅ PO Date
- ✅ Contact Person
- ✅ Email ID
- ✅ Mobile No.
- ✅ Offer Number & Date
- ✅ Mode (RT15, RT16, etc.)
- ✅ Price Basis (CFR, FOB, etc.)
- ✅ Delivery Location

### **Line Items Table**
Each item includes:
- ✅ Sr. No.
- ✅ Item Code
- ✅ Description of Goods
- ✅ HSN Code (Harmonized System of Nomenclature)
- ✅ Quantity
- ✅ UOM (Unit of Measurement: PCS, EA, MTR, KG, SET)
- ✅ Rate (INR)
- ✅ Basic Amount (Auto-calculated)
- ✅ Tax (18% GST with CGST 9% + SGST 9%)
- ✅ Total Amount (Auto-calculated)
- ✅ Delivery Date

**Features:**
- ➕ Add multiple line items
- 🗑️ Remove line items
- 🔢 Auto-calculation of amounts
- 📊 Real-time tax calculation

### **Tax Summary**
- ✅ Basic Amount
- ✅ Taxable Amount
- ✅ Total Central GST (9%)
- ✅ IN: State GST (9%)
- ✅ **Total Amount (Including other expenses)**
- ✅ Amount in Words (Auto-converted)

### **Terms and Conditions**
- ✅ Delivery Location
- ✅ Delivery Terms (e.g., "WITHIN 30 DAYS")
- ✅ Payment Terms (e.g., "100% payment against Delivery")
- ✅ Freight Charges (e.g., "Free")
- ✅ Tax Details (e.g., "GST 18% EXTRA")
- ✅ Validity Period
- ✅ Other Custom Terms (Multiple entries supported)

### **Additional Information**
- ✅ Header Text (Customizable greeting)
- ✅ Special Requirements / Annexure
- ✅ Reference to Quote Number
- ✅ Material Line Details

---

## 🎨 Generated PO Template Features

### **Professional Layout**
```
┌─────────────────────────────────────────────────────┐
│ [LOGO]  │  Billing Address  │  Shipping Address    │
│         │  GSTIN, PAN, CIN  │  Email, Phone        │
├─────────────────────────────────────────────────────┤
│           PURCHASE ORDER (Centered Header)          │
├─────────────────────────────────────────────────────┤
│ Vendor Details        │  PO Details                 │
│ - Vendor Code         │  - PO No.                   │
│ - Supplier Name       │  - Date                     │
│ - Contact Person      │  - Contact Person           │
│ - Mobile, Email       │  - Email, Mobile            │
│ - Address             │  - Offer No. & Date         │
│ - GSTIN, MSME, State  │  - Mode, Price Basis        │
│                       │  - Delivery Location        │
├─────────────────────────────────────────────────────┤
│ Person Liable for GST is Consigner/Service Provider│
├─────────────────────────────────────────────────────┤
│ Dear Sir,                                           │
│ [Header Text]                                       │
├─────────────────────────────────────────────────────┤
│ LINE ITEMS TABLE                                    │
│ Sr │ Item Code │ Description │ HSN │ Qty │ UOM │   │
│    │ Rate │ Basic Amt │ Tax │ Total │ Del Date │   │
├─────────────────────────────────────────────────────┤
│ TAX SUMMARY                                         │
│ - Basic Amount                      ₹XX,XXX.XX     │
│ - Taxable Amount                    ₹XX,XXX.XX     │
│ - Total Central GST (9%)            ₹X,XXX.XX      │
│ - IN: State GST (9%)                ₹X,XXX.XX      │
│ - TOTAL                             ₹XX,XXX.XX     │
├─────────────────────────────────────────────────────┤
│ Amount: [Amount in Words] Rupees Only               │
├─────────────────────────────────────────────────────┤
│ TERMS AND CONDITIONS                                │
│ # REF TO QUOTE NO XXX DTD DD/MM/YYYY               │
│ # TAX: GST 18% EXTRA                               │
│ # FREIGHT: -Free                                    │
│ # DELIVERY: WITHIN XX DAYS                         │
├─────────────────────────────────────────────────────┤
│ Principal Place of Business: [Company Details]      │
│ PRD | Page 1 of 1                                   │
└─────────────────────────────────────────────────────┘
```

### **Automatic Calculations**
1. **Line Item Totals:**
   - Basic Amount = Quantity × Rate
   - Tax = Basic Amount × 18%
   - Total = Basic Amount + Tax

2. **Overall Totals:**
   - Basic Amount = Sum of all line items
   - CGST = Basic Amount × 9%
   - SGST = Basic Amount × 9%
   - Grand Total = Basic Amount + CGST + SGST

3. **Amount in Words:**
   - Automatically converts numbers to Indian number words
   - Example: 42,525 → "Forty Two Thousand Five Hundred Twenty Five Rupees Only"

---

## 🚀 How to Use

### **Step 1: Access PO Creation**
1. Navigate to Purchase Orders Dashboard
2. Click "Create New PO" dropdown
3. Choose:
   - **Create Basic PO** - Quick mode
   - **Create Detailed PO** - Professional mode

### **Step 2: Fill Company Details**
Pre-filled for Sunny Tailor:
- Company Name: Sunny Tailor
- Address: Shop No. 5, Textile Market, Gandhi Road, Mumbai
- GSTIN: 27AABCS1234F1Z5
- PAN: AABCS1234F
- Email: contact@sunnytailor.com
- Phone: +91 9876543210

*You can edit these details as needed*

### **Step 3: Enter Vendor Details**
Fill in client/supplier information:
- Vendor Code (optional)
- Supplier Name *
- Contact Person *
- Mobile Number *
- Email *
- Address *
- GSTIN
- MSME
- State *

### **Step 4: Add Line Items**
1. Click "Add Item" to add more products
2. Fill in each item:
   - Item Code
   - Description (e.g., "Corporate Uniform Shirt+Pant")
   - HSN Code (default: 6203 for garments)
   - Quantity
   - UOM (PCS, EA, MTR, etc.)
   - Rate per unit
   - Delivery Date
3. Amounts calculate automatically
4. Remove items with trash icon if needed

### **Step 5: Set Terms & Conditions**
Configure delivery and payment terms:
- Delivery Location (default: "OUR WORKS")
- Delivery Terms (default: "WITHIN 30 DAYS")
- Payment Terms (default: "100% payment against Delivery")
- Freight Charges (default: "Free")
- Tax Details (default: "GST 18% EXTRA")
- Validity Period (default: "30 days")

### **Step 6: Add Additional Details**
Optional fields:
- Mode (RT15, RT16, etc.)
- Price Basis (CFR, FOB, etc.)
- Offer Number
- Offer Date
- Header Text (custom greeting)
- Special Requirements

### **Step 7: Review & Create**
1. Check tax summary
2. Verify all required fields (marked with *)
3. Click "Create PO"

### **Step 8: View PO Template**
From PO List:
1. Find your PO
2. Click "View Template" button
3. Preview the professional PO document
4. Options available:
   - **Print** - Direct print
   - **Download** - Save as PDF/print to file
   - **Close** - Return to list

---

## 📄 Sample Data

### **Example Line Item:**
```
Item Code: UNIFORM-SHP
Description: Corporate Uniform (Shirt + Pant)
HSN Code: 6203
Quantity: 50
UOM: PCS
Rate: 450.00
Basic Amount: 22,500.00
Tax (18%): 4,050.00
Total: 26,550.00
Delivery Date: 15/04/2026
```

### **Example Tax Calculation:**
```
Basic Amount:        ₹22,500.00
Taxable Amount:      ₹22,500.00
CGST (9%):          ₹2,025.00
SGST (9%):          ₹2,025.00
──────────────────────────────
Total Amount:        ₹26,550.00
```

---

## 🎯 Key Features

### ✅ **Professional Template**
- Matches industry-standard PO formats
- Based on Rubamin PO sample
- Print-ready design
- Professional layout with borders and tables

### ✅ **Automatic Calculations**
- Real-time amount calculations
- Tax calculations (CGST + SGST)
- Number to words conversion
- Total summaries

### ✅ **Multiple Line Items**
- Add unlimited products/services
- Each with separate pricing and delivery
- Auto-numbering
- Easy add/remove

### ✅ **Complete Tax Compliance**
- GSTIN support
- HSN Code tracking
- GST breakdown (CGST/SGST)
- Tax summary section

### ✅ **Customizable**
- Edit company details
- Custom terms and conditions
- Flexible payment terms
- Multiple UOM options

### ✅ **Print & Download**
- One-click printing
- PDF generation capability
- Professional page layout
- Page numbering

---

## 💡 Tips & Best Practices

### **For Sunny Tailor:**
1. **Keep Company Details Updated**
   - Update GSTIN if changed
   - Keep address current
   - Update contact information regularly

2. **Use Correct HSN Codes**
   - 6203: Men's garments (shirts, pants)
   - 6204: Women's garments
   - 6211: Track suits, sportswear

3. **Line Item Descriptions**
   - Be specific: "Premium Cotton Formal Shirt - White"
   - Include details: "Corporate Blazer - Navy Blue, Size M-XXL"
   - Mention customizations: "With Company Logo Embroidery"

4. **Payment Terms**
   - Clearly specify: "50% Advance + 50% Before Delivery"
   - Or: "100% payment against Delivery"
   - Add bank details in terms if needed

5. **Delivery Terms**
   - Specify timeline: "WITHIN 30 DAYS from PO date"
   - Add location: "Delivery at OUR WORKS / Client Location"
   - Include freight terms: "Free Delivery" or "FOB"

---

## 🔄 Workflow Integration

The Detailed PO system integrates seamlessly with the existing workflow:

```
Create Detailed PO
    ↓
PO Created (with professional template)
    ↓
Upload Employees (same as before)
    ↓
Enter Measurements (same as before)
    ↓
Download Measurement Sheet (same as before)
```

**Additional Feature:**
- At any time, click "View Template" on any PO to see/print the professional PO document

---

## 📊 Comparison: Basic vs Detailed PO

| Feature | Basic PO | Detailed PO |
|---------|----------|-------------|
| Creation Time | 2-3 minutes | 5-7 minutes |
| Fields | 15+ fields | 40+ fields |
| Line Items | Auto-generated | Manual entry (multiple) |
| Tax Breakdown | Simple | Detailed (CGST/SGST) |
| Template | Simple | Professional |
| HSN Codes | No | Yes |
| UOM Options | No | Yes (5 options) |
| Terms & Conditions | Basic | Comprehensive |
| Print Ready | Yes | Yes (Professional) |
| Best For | Internal use | Client submission |

---

## 🆘 Troubleshooting

### **Q: Required fields not showing?**
A: Fields marked with * are mandatory. Fill them to enable "Create PO" button.

### **Q: Tax calculation wrong?**
A: System uses 18% GST (9% CGST + 9% SGST). Check if rate and quantity are correct.

### **Q: Can't add more line items?**
A: Click "Add Item" button below line items section. No limit on items.

### **Q: Template not showing all details?**
A: Make sure you filled vendor details and line items. Preview updates automatically.

### **Q: How to change company logo?**
A: Currently shows placeholder. Logo upload feature can be added later.

### **Q: Print layout issues?**
A: Use "Download" button which opens print dialog with correct formatting.

---

## 📞 Support

For questions or issues:
- Check WORKFLOW_GUIDE.md for general PO workflow
- Review this guide for template-specific questions
- Contact system administrator for technical support

---

*Created for: Sunny Tailor*  
*System: Clothing Manufacturing ERP*  
*Version: 1.0*  
*Last Updated: March 25, 2026*
