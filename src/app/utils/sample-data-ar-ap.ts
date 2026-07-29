// Sample Data for Accounts Receivable and Accounts Payable Testing

import { Customer, Invoice, Payment } from "@/app/types/accounts-receivable";
import { Vendor, Bill, VendorPayment } from "@/app/types/accounts-payable";

// Generate sample customers
export function generateSampleCustomers(): Customer[] {
  const customers: Customer[] = [
    {
      id: "cust-001",
      name: "Reliance Retail Ltd.",
      email: "accounts@relianceretail.com",
      phone: "+91 22 1234 5678",
      address: "Mumbai, Maharashtra",
      gstin: "27AABCU9603R1ZM",
      creditLimit: 500000,
      currentBalance: 125000,
      overdueBalance: 0,
      isActive: true,
      paymentTerms: 30,
      reminderEnabled: true,
      createdAt: new Date("2024-01-15").toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cust-002",
      name: "Future Lifestyle Fashions",
      email: "billing@futurelifestyle.com",
      phone: "+91 80 9876 5432",
      address: "Bangalore, Karnataka",
      gstin: "29AABCU9603R1ZN",
      creditLimit: 300000,
      currentBalance: 85000,
      overdueBalance: 35000,
      isActive: true,
      paymentTerms: 45,
      reminderEnabled: true,
      createdAt: new Date("2024-02-01").toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cust-003",
      name: "Shoppers Stop",
      email: "finance@shoppersstop.com",
      phone: "+91 22 8765 4321",
      address: "Mumbai, Maharashtra",
      gstin: "27AABCU9603R1ZO",
      creditLimit: 400000,
      currentBalance: 95000,
      overdueBalance: 0,
      isActive: true,
      paymentTerms: 30,
      reminderEnabled: true,
      createdAt: new Date("2024-01-20").toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return customers;
}

// Generate sample invoices
export function generateSampleInvoices(): Invoice[] {
  const today = new Date();
  const invoices: Invoice[] = [
    {
      id: "inv-001",
      invoiceNumber: "INV-2024-001",
      customerId: "cust-001",
      customerName: "Reliance Retail Ltd.",
      invoiceDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      totalAmount: 125000,
      paidAmount: 0,
      balanceAmount: 125000,
      status: "sent",
      paymentTerms: 30,
      items: [
        { description: "Corporate Shirts - 500 units", quantity: 500, rate: 200, amount: 100000 },
        { description: "Corporate Trousers - 250 units", quantity: 250, rate: 100, amount: 25000 },
      ],
      taxAmount: 22500,
      discountAmount: 0,
      createdAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "inv-002",
      invoiceNumber: "INV-2024-002",
      customerId: "cust-002",
      customerName: "Future Lifestyle Fashions",
      invoiceDate: new Date(today.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      totalAmount: 85000,
      paidAmount: 50000,
      balanceAmount: 35000,
      status: "overdue",
      paymentTerms: 45,
      items: [
        { description: "Casual Shirts - 300 units", quantity: 300, rate: 250, amount: 75000 },
        { description: "Casual Trousers - 100 units", quantity: 100, rate: 100, amount: 10000 },
      ],
      taxAmount: 15300,
      discountAmount: 0,
      createdAt: new Date(today.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "inv-003",
      invoiceNumber: "INV-2024-003",
      customerId: "cust-003",
      customerName: "Shoppers Stop",
      invoiceDate: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      totalAmount: 95000,
      paidAmount: 0,
      balanceAmount: 95000,
      status: "sent",
      paymentTerms: 30,
      items: [
        { description: "Formal Suits - 100 units", quantity: 100, rate: 800, amount: 80000 },
        { description: "Formal Shirts - 150 units", quantity: 150, rate: 100, amount: 15000 },
      ],
      taxAmount: 17100,
      discountAmount: 0,
      createdAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return invoices;
}

// Generate sample payments
export function generateSamplePayments(): Payment[] {
  const payments: Payment[] = [
    {
      id: "pay-001",
      paymentNumber: "PAY-2024-001",
      customerId: "cust-002",
      customerName: "Future Lifestyle Fashions",
      invoiceId: "inv-002",
      invoiceNumber: "INV-2024-002",
      paymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 50000,
      paymentMethod: "bank",
      referenceNumber: "NEFT123456789",
      notes: "Partial payment received",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return payments;
}

// Generate sample vendors
export function generateSampleVendors(): Vendor[] {
  const vendors: Vendor[] = [
    {
      id: "vend-001",
      name: "Premium Fabrics India",
      email: "sales@premiumfabrics.com",
      phone: "+91 22 1111 2222",
      address: "Surat, Gujarat",
      gstin: "24AABCU9603R1ZP",
      panNumber: "AABCU9603R",
      currentBalance: 150000,
      totalPaid: 850000,
      isActive: true,
      paymentTerms: 30,
      bankDetails: {
        accountNumber: "1234567890",
        ifscCode: "HDFC0001234",
        accountName: "Premium Fabrics India",
        bankName: "HDFC Bank",
      },
      createdAt: new Date("2024-01-01").toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "vend-002",
      name: "Textile Suppliers Co.",
      email: "accounts@textilesuppliers.com",
      phone: "+91 80 3333 4444",
      address: "Bangalore, Karnataka",
      gstin: "29AABCU9603R1ZQ",
      panNumber: "AABCU9603S",
      currentBalance: 85000,
      totalPaid: 450000,
      isActive: true,
      paymentTerms: 45,
      bankDetails: {
        accountNumber: "9876543210",
        ifscCode: "ICIC0001234",
        accountName: "Textile Suppliers Co.",
        bankName: "ICICI Bank",
      },
      createdAt: new Date("2024-01-15").toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "vend-003",
      name: "Button & Zipper Mart",
      email: "sales@buttonzipper.com",
      phone: "+91 22 5555 6666",
      address: "Mumbai, Maharashtra",
      gstin: "27AABCU9603R1ZR",
      panNumber: "AABCU9603T",
      currentBalance: 45000,
      totalPaid: 250000,
      isActive: true,
      paymentTerms: 30,
      createdAt: new Date("2024-02-01").toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return vendors;
}

// Generate sample vendor bills
export function generateSampleVendorBills(): Bill[] {
  const today = new Date();
  const bills: Bill[] = [
    {
      id: "bill-001",
      billNumber: "BILL-2024-001",
      vendorId: "vend-001",
      vendorName: "Premium Fabrics India",
      billDate: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      totalAmount: 150000,
      paidAmount: 0,
      balanceAmount: 150000,
      status: "pending",
      paymentTerms: 30,
      items: [
        { description: "Cotton Fabric - 1000 meters", quantity: 1000, rate: 120, amount: 120000 },
        { description: "Silk Fabric - 200 meters", quantity: 200, rate: 150, amount: 30000 },
      ],
      taxAmount: 27000,
      tdsAmount: 0,
      discountAmount: 0,
      earlyPaymentDiscount: {
        percentage: 2,
        validUntil: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        discountAmount: 3000,
      },
      priority: "medium",
      category: "fabric",
      createdAt: new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "bill-002",
      billNumber: "BILL-2024-002",
      vendorId: "vend-002",
      vendorName: "Textile Suppliers Co.",
      billDate: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      totalAmount: 85000,
      paidAmount: 0,
      balanceAmount: 85000,
      status: "overdue",
      paymentTerms: 45,
      items: [
        { description: "Thread - 500 spools", quantity: 500, rate: 150, amount: 75000 },
        { description: "Labels - 10000 pieces", quantity: 10000, rate: 1, amount: 10000 },
      ],
      taxAmount: 15300,
      tdsAmount: 850,
      discountAmount: 0,
      priority: "urgent",
      category: "raw-material",
      createdAt: new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "bill-003",
      billNumber: "BILL-2024-003",
      vendorId: "vend-003",
      vendorName: "Button & Zipper Mart",
      billDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(today.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(),
      totalAmount: 45000,
      paidAmount: 0,
      balanceAmount: 45000,
      status: "pending",
      paymentTerms: 30,
      items: [
        { description: "Buttons - 20000 pieces", quantity: 20000, rate: 1.5, amount: 30000 },
        { description: "Zippers - 1000 pieces", quantity: 1000, rate: 15, amount: 15000 },
      ],
      taxAmount: 8100,
      tdsAmount: 0,
      discountAmount: 0,
      earlyPaymentDiscount: {
        percentage: 3,
        validUntil: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        discountAmount: 1350,
      },
      priority: "low",
      category: "raw-material",
      createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  return bills;
}

// Initialize all sample data
export function initializeSampleARAPData() {
  // Check if data already exists
  const existingCustomers = localStorage.getItem("erp_customers");
  const existingVendors = localStorage.getItem("erp_vendors");

  // Don't overwrite existing data
  if (!existingCustomers) {
    const customers = generateSampleCustomers();
    localStorage.setItem("erp_customers", JSON.stringify(customers));
    console.log(`[Sample Data] Initialized ${customers.length} customers`);
  }

  if (!localStorage.getItem("erp_invoices")) {
    const invoices = generateSampleInvoices();
    localStorage.setItem("erp_invoices", JSON.stringify(invoices));
    console.log(`[Sample Data] Initialized ${invoices.length} invoices`);
  }

  if (!localStorage.getItem("erp_customer_payments")) {
    const payments = generateSamplePayments();
    localStorage.setItem("erp_customer_payments", JSON.stringify(payments));
    console.log(`[Sample Data] Initialized ${payments.length} customer payments`);
  }

  if (!existingVendors) {
    const vendors = generateSampleVendors();
    localStorage.setItem("erp_vendors", JSON.stringify(vendors));
    console.log(`[Sample Data] Initialized ${vendors.length} vendors`);
  }

  if (!localStorage.getItem("erp_vendor_bills")) {
    const bills = generateSampleVendorBills();
    localStorage.setItem("erp_vendor_bills", JSON.stringify(bills));
    console.log(`[Sample Data] Initialized ${bills.length} vendor bills`);
  }

  return {
    message: "Sample AR/AP data initialized successfully",
    customersCount: generateSampleCustomers().length,
    invoicesCount: generateSampleInvoices().length,
    vendorsCount: generateSampleVendors().length,
    billsCount: generateSampleVendorBills().length,
  };
}
