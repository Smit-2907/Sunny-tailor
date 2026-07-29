export interface POLineItem {
  srNo: number;
  itemCode: string;
  description: string;
  hsnCode: string;
  quantity: number;
  uom: string; // Unit of Measurement (EA, PCS, MTR, etc.)
  rate: number;
  basicAmount: number;
  tax: number;
  totalAmount: number;
  deliveryDate: string;
}

export interface POCompanyDetails {
  companyName: string;
  billingAddress: string;
  shippingAddress: string;
  gstin: string;
  pan: string;
  cin?: string;
  email: string;
  phone: string;
  logo?: string;
}

export interface POVendorDetails {
  vendorCode: string;
  supplierName: string;
  contactPerson: string;
  mobileNumber: string;
  email: string;
  address: string;
  gstin: string;
  msme?: string;
  state: string;
}

export interface POTaxDetails {
  basicAmount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst?: number;
  totalAmount: number;
}

export interface POTermsAndConditions {
  deliveryLocation: string;
  deliveryTerms: string;
  paymentTerms: string;
  freightCharges: string;
  taxDetails: string;
  validityPeriod: string;
  otherTerms?: string[];
}

export interface POUploadedDocument {
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: string;
  fileData?: string; // Base64 encoded (legacy / fallback)
  fileUrl?: string;  // Supabase Storage public URL (preferred)
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  poDate: string;
  
  // Client Information
  clientCompanyName: string;
  clientContactPerson: string;
  clientContactEmail: string;
  clientContactPhone: string;
  clientAddress: string;
  clientReferenceNumber?: string;
  
  // Order Details
  totalQuantity: number;
  uniformType: "shirt-only" | "pant-only" | "both" | "tshirt-only" | "shirt-and-pant" | "blazer" | "full-suit";
  shirtsPerPerson?: number;
  pantsPerPerson?: number;
  tshirtsPerPerson?: number;
  deliveryDeadline: string;
  orderDate: string;
  
  // Pricing & Payment
  unitPrice: number;
  totalOrderValue: number;
  paymentTerms: "full-advance" | "50-advance" | "net-30" | "net-60" | "100% payment against Delivery";
  advanceAmount: number;
  
  // Order Specifications
  orderPriority: "normal" | "urgent" | "rush";
  brandLogoRequired: boolean;
  brandLogoDetails?: string;
  qualityStandard: "standard" | "premium" | "custom";
  packagingRequirements?: string;
  
  // Additional Details
  specialRequirements?: string;
  
  // Status & Tracking
  status: "draft" | "confirmed" | "in-measurement" | "in-production" | "completed" | "cancelled";
  createdBy: string;
  createdDate: string;
  updatedDate: string;
  
  // Progress tracking
  employeesUploaded: number;
  measurementsCompleted: number;
  measurementsInProgress: number;

  // Enhanced PO Details (Optional - for detailed PO template)
  vendorDetails?: POVendorDetails;
  companyDetails?: POCompanyDetails;
  lineItems?: POLineItem[];
  taxDetails?: POTaxDetails;
  termsAndConditions?: POTermsAndConditions;
  mode?: string; // RT15, RT16, etc.
  priceBasis?: string; // CFR, FOB, etc.
  personLiableForGST?: string;
  offerNumber?: string;
  offerDate?: string;
  headerText?: string;
  
  // Uploaded Document (Optional - for uploaded PO files)
  uploadedDocument?: POUploadedDocument;
}

export const generatePONumber = (): string => {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `PO-${year}-${random}`;
};