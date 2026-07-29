// Bill/Invoice Types and Interfaces

export interface CompanyDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin: string;
  pan: string;
  phone: string;
  email: string;
  logo?: string;
}

export interface PartyDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
  stateCode?: string;
}

export type GSTType = "cgst-sgst" | "igst";

export interface BillItem {
  id: string;
  srNo: number;
  particulars: string;
  hsnSac: string;
  qty: number;
  unit: string;
  gstPercent: number;
  gstType: GSTType;
  rate: number;
  taxableAmount: number;
}

export interface BankDetails {
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
}

export interface TaxBreakdown {
  cgst: number;
  sgst: number;
  igst: number;
}

export interface BillTemplate {
  id: string;
  templateName: string;
  companyDetails: CompanyDetails;
  bankDetails: BankDetails;
  termsAndConditions: string[];
  showLogo: boolean;
  showBankDetails: boolean;
  showTerms: boolean;
  headerColor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bill {
  id: string;
  billNumber: string;
  challanNo?: string;
  poNumber?: string;
  poDate?: string;
  invoiceDate: string;
  
  // Template reference
  templateId: string;
  companyDetails: CompanyDetails;
  
  // Party details
  billedTo: PartyDetails;
  shippedTo?: PartyDetails;
  
  // Items
  items: BillItem[];
  
  // Additional charges
  additionalCharges: number;
  additionalChargesDesc?: string;
  
  // Calculations
  subtotal: number;
  taxBreakdown: TaxBreakdown;
  totalAmount: number;
  amountInWords: string;
  
  // Bank and terms
  bankDetails: BankDetails;
  termsAndConditions: string[];
  
  // Metadata
  remarks?: string;
  vehicleNo?: string;
  stationFrom?: string;
  stationTo?: string;
  
  // Status
  status: "draft" | "sent" | "paid" | "cancelled";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export type BillStatus = Bill["status"];
