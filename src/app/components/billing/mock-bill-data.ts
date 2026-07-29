import { Bill, BillTemplate } from "./bill-types";

export const defaultTemplate: BillTemplate = {
  id: "template-001",
  templateName: "Default Tax Invoice",
  companyDetails: {
    name: "SUNNY FABRIC PRIVATE LIMITED",
    address: "J-183-GIDC/NATH ALIGARH HALOL PANCHMAHAL",
    city: "HALOL",
    state: "Gujarat",
    pincode: "389350",
    gstin: "24AABCA7801B1ZH",
    pan: "AABCA7801B",
    phone: "9537736351",
    email: "info@sunnyfabric.com"
  },
  bankDetails: {
    bankName: "SBI",
    branchName: "NANDESAR",
    accountNumber: "38190064436",
    ifscCode: "SBIN0006614"
  },
  termsAndConditions: [
    "Goods once sold will not be taken back.",
    "Interest @18% p.a. will be charged if the bill not paid in 7 DueBillDate 01-2026.",
    "Subject to Halol Jurisdiction",
    "Goods are Delivered at Godown / Base and Insurance options."
  ],
  showLogo: true,
  showBankDetails: true,
  showTerms: true,
  headerColor: "#1e40af",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01"
};

export const proformaTemplate: BillTemplate = {
  id: "template-002",
  templateName: "Proforma Invoice",
  companyDetails: {
    name: "SUNNY FABRIC PRIVATE LIMITED",
    address: "J-183-GIDC/NATH ALIGARH HALOL PANCHMAHAL",
    city: "HALOL",
    state: "Gujarat",
    pincode: "389350",
    gstin: "24AABCA7801B1ZH",
    pan: "AABCA7801B",
    phone: "9537736351",
    email: "info@sunnyfabric.com"
  },
  bankDetails: {
    bankName: "SBI",
    branchName: "NANDESAR",
    accountNumber: "38190064436",
    ifscCode: "SBIN0006614"
  },
  termsAndConditions: [
    "This is a proforma invoice and not a demand for payment.",
    "Prices are valid for 30 days from the date of issue.",
    "Actual invoice will be generated upon order confirmation.",
    "Subject to Halol Jurisdiction"
  ],
  showLogo: true,
  showBankDetails: true,
  showTerms: true,
  headerColor: "#059669",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01"
};

export const deliveryChallanTemplate: BillTemplate = {
  id: "template-003",
  templateName: "Delivery Challan",
  companyDetails: {
    name: "SUNNY FABRIC PRIVATE LIMITED",
    address: "J-183-GIDC/NATH ALIGARH HALOL PANCHMAHAL",
    city: "HALOL",
    state: "Gujarat",
    pincode: "389350",
    gstin: "24AABCA7801B1ZH",
    pan: "AABCA7801B",
    phone: "9537736351",
    email: "info@sunnyfabric.com"
  },
  bankDetails: {
    bankName: "SBI",
    branchName: "NANDESAR",
    accountNumber: "38190064436",
    ifscCode: "SBIN0006614"
  },
  termsAndConditions: [
    "This is a delivery challan for goods dispatched.",
    "Please verify the quantity and quality at the time of delivery.",
    "Any discrepancy must be reported within 24 hours.",
    "Subject to Halol Jurisdiction"
  ],
  showLogo: true,
  showBankDetails: false,
  showTerms: true,
  headerColor: "#7c3aed",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01"
};

export const creditNoteTemplate: BillTemplate = {
  id: "template-004",
  templateName: "Credit Note",
  companyDetails: {
    name: "SUNNY FABRIC PRIVATE LIMITED",
    address: "J-183-GIDC/NATH ALIGARH HALOL PANCHMAHAL",
    city: "HALOL",
    state: "Gujarat",
    pincode: "389350",
    gstin: "24AABCA7801B1ZH",
    pan: "AABCA7801B",
    phone: "9537736351",
    email: "info@sunnyfabric.com"
  },
  bankDetails: {
    bankName: "SBI",
    branchName: "NANDESAR",
    accountNumber: "38190064436",
    ifscCode: "SBIN0006614"
  },
  termsAndConditions: [
    "This credit note is issued against the original invoice.",
    "Amount will be adjusted in the next billing cycle.",
    "Subject to Halol Jurisdiction"
  ],
  showLogo: true,
  showBankDetails: true,
  showTerms: true,
  headerColor: "#dc2626",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01"
};

export const quotationTemplate: BillTemplate = {
  id: "template-005",
  templateName: "Quotation / Estimate",
  companyDetails: {
    name: "SUNNY FABRIC PRIVATE LIMITED",
    address: "J-183-GIDC/NATH ALIGARH HALOL PANCHMAHAL",
    city: "HALOL",
    state: "Gujarat",
    pincode: "389350",
    gstin: "24AABCA7801B1ZH",
    pan: "AABCA7801B",
    phone: "9537736351",
    email: "info@sunnyfabric.com"
  },
  bankDetails: {
    bankName: "SBI",
    branchName: "NANDESAR",
    accountNumber: "38190064436",
    ifscCode: "SBIN0006614"
  },
  termsAndConditions: [
    "This quotation is valid for 15 days from date of issue.",
    "Prices are subject to change based on raw material costs.",
    "50% advance payment required upon order confirmation.",
    "Delivery within 3-4 weeks from order confirmation.",
    "Subject to Halol Jurisdiction"
  ],
  showLogo: true,
  showBankDetails: false,
  showTerms: true,
  headerColor: "#d97706",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01"
};

export const proformaModernTemplate: BillTemplate = {
  id: "template-006",
  templateName: "Proforma Invoice – Modern",
  companyDetails: {
    name: "SUNNY FABRIC PRIVATE LIMITED",
    address: "J-183-GIDC/NATH ALIGARH HALOL PANCHMAHAL",
    city: "HALOL",
    state: "Gujarat",
    pincode: "389350",
    gstin: "24AABCA7801B1ZH",
    pan: "AABCA7801B",
    phone: "9537736351",
    email: "info@sunnyfabric.com"
  },
  bankDetails: {
    bankName: "SBI",
    branchName: "NANDESAR",
    accountNumber: "38190064436",
    ifscCode: "SBIN0006614"
  },
  termsAndConditions: [
    "This is a proforma invoice and not a demand for payment.",
    "Prices are valid for 30 days from the date of issue.",
    "Actual invoice will be generated upon order confirmation.",
    "50% advance required to commence production.",
    "Subject to Halol Jurisdiction"
  ],
  showLogo: true,
  showBankDetails: true,
  showTerms: true,
  headerColor: "#0f172a",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01"
};

export const proformaClassicTemplate: BillTemplate = {
  id: "template-007",
  templateName: "Proforma Invoice – Classic",
  companyDetails: {
    name: "SUNNY FABRIC PRIVATE LIMITED",
    address: "J-183-GIDC/NATH ALIGARH HALOL PANCHMAHAL",
    city: "HALOL",
    state: "Gujarat",
    pincode: "389350",
    gstin: "24AABCA7801B1ZH",
    pan: "AABCA7801B",
    phone: "9537736351",
    email: "info@sunnyfabric.com"
  },
  bankDetails: {
    bankName: "SBI",
    branchName: "NANDESAR",
    accountNumber: "38190064436",
    ifscCode: "SBIN0006614"
  },
  termsAndConditions: [
    "This is a proforma invoice and not a demand for payment.",
    "Prices are valid for 30 days from the date of issue.",
    "Actual invoice will be generated upon order confirmation.",
    "Subject to Halol Jurisdiction"
  ],
  showLogo: true,
  showBankDetails: true,
  showTerms: true,
  headerColor: "#7c2d12",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01"
};

export const allTemplates: BillTemplate[] = [
  defaultTemplate,
  proformaTemplate,
  proformaModernTemplate,
  proformaClassicTemplate,
  deliveryChallanTemplate,
  creditNoteTemplate,
  quotationTemplate
];

export const mockBills: Bill[] = [
  {
    id: "bill-001",
    billNumber: "25-26/136",
    challanNo: "SF-136",
    poNumber: "PO-25-26-246",
    poDate: "24-11-2025",
    invoiceDate: "24-11-2025",
    templateId: "template-001",
    companyDetails: defaultTemplate.companyDetails,
    billedTo: {
      name: "ANKUR SCIENTIFIC ENERGY TECHNOLOGIES (P) LIMITED",
      address: "VADODARA - SAVLI ROAD NR VILLAGE GOTHDA",
      city: "TA Savli, Vadodara",
      state: "Gujarat",
      pincode: "391775",
      gstin: "24AABCA7801B1ZH",
      stateCode: "24"
    },
    shippedTo: {
      name: "ANKUR SCIENTIFIC ENERGY TECHNOLOGIES (P) LIMITED",
      address: "VADODARA-SAVLI ROAD NR VILLAGE GOTHDA TA SAVLI, Vadodara",
      city: "Vadodara",
      state: "Gujarat",
      pincode: "391774",
      gstin: "24AABCA7801B1ZH",
      stateCode: "24"
    },
    items: [
      {
        id: "item-001",
        srNo: 1,
        particulars: "UNIFORM SHIRT & TROUSER",
        hsnSac: "62044/1901",
        qty: 218,
        unit: "PAIR",
        gstPercent: 5,
        rate: 750,
        taxableAmount: 163500
      }
    ],
    additionalCharges: 0,
    subtotal: 163500,
    taxBreakdown: {
      cgst: 4087.5,
      sgst: 4087.5,
      igst: 0
    },
    totalAmount: 171675,
    amountInWords: "One Lakh Seventy One Thousand Six Hundred Seventy Five Rupees Only",
    bankDetails: defaultTemplate.bankDetails,
    termsAndConditions: defaultTemplate.termsAndConditions,
    remarks: "One Lakh Seventy One Thousand Six Hundred Seventy",
    vehicleNo: "",
    stationFrom: "Vadodara",
    status: "sent",
    createdBy: "Master Manager",
    createdAt: "2024-11-24T10:00:00",
    updatedAt: "2024-11-24T10:00:00"
  },
  {
    id: "bill-002",
    billNumber: "25-26/137",
    challanNo: "SF-137",
    invoiceDate: "25-11-2025",
    templateId: "template-001",
    companyDetails: defaultTemplate.companyDetails,
    billedTo: {
      name: "TECH SOLUTIONS INDIA PVT LTD",
      address: "PLOT NO 45, GIDC ESTATE",
      city: "Anand",
      state: "Gujarat",
      pincode: "388001",
      gstin: "24AAECT1234A1Z5",
      stateCode: "24"
    },
    items: [
      {
        id: "item-002",
        srNo: 1,
        particulars: "CORPORATE BLAZER",
        hsnSac: "62033300",
        qty: 50,
        unit: "PCS",
        gstPercent: 12,
        rate: 2500,
        taxableAmount: 125000
      },
      {
        id: "item-003",
        srNo: 2,
        particulars: "FORMAL TROUSER",
        hsnSac: "62034300",
        qty: 100,
        unit: "PCS",
        gstPercent: 12,
        rate: 850,
        taxableAmount: 85000
      }
    ],
    additionalCharges: 500,
    additionalChargesDesc: "Transportation",
    subtotal: 210000,
    taxBreakdown: {
      cgst: 12600,
      sgst: 12600,
      igst: 0
    },
    totalAmount: 235700,
    amountInWords: "Two Lakh Thirty Five Thousand Seven Hundred Rupees Only",
    bankDetails: defaultTemplate.bankDetails,
    termsAndConditions: defaultTemplate.termsAndConditions,
    status: "draft",
    createdBy: "Master Manager",
    createdAt: "2024-11-25T14:30:00",
    updatedAt: "2024-11-25T14:30:00"
  }
];