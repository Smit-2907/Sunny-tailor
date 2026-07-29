import { useState } from "react";
import { 
  X, Save, Building2, Calendar, Package, FileText, Plus, Trash2, 
  User, Phone, Mail, MapPin, DollarSign, Hash, AlertCircle 
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Separator } from "@/app/components/ui/separator";
import { 
  PurchaseOrder, 
  POLineItem, 
  POVendorDetails, 
  POCompanyDetails,
  POTaxDetails,
  POTermsAndConditions,
  generatePONumber 
} from "./purchase-order-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { CompanyAutocomplete } from "@/app/components/ui/company-autocomplete";

interface DetailedPOCreationFormProps {
  onSave: (po: PurchaseOrder) => void;
  onCancel: () => void;
  currentUserEmail: string;
}

export function DetailedPOCreationForm({ onSave, onCancel, currentUserEmail }: DetailedPOCreationFormProps) {
  const [poNumber, setPONumber] = useState(generatePONumber());
  const [poDate, setPODate] = useState(new Date().toISOString().split('T')[0]);

  // Company Details (Your Company - Sunny Tailor)
  const [companyDetails, setCompanyDetails] = useState<POCompanyDetails>({
    companyName: "Sunny Tailor",
    billingAddress: "Shop No. 5, Textile Market, Gandhi Road, Mumbai - 400001, Maharashtra",
    shippingAddress: "Shop No. 5, Textile Market, Gandhi Road, Mumbai - 400001, Maharashtra",
    gstin: "27AABCS1234F1Z5",
    pan: "AABCS1234F",
    cin: "",
    email: "contact@sunnytailor.com",
    phone: "+91 9876543210",
  });

  // Vendor Details (Client/Supplier)
  const [vendorDetails, setVendorDetails] = useState<POVendorDetails>({
    vendorCode: "",
    supplierName: "",
    contactPerson: "",
    mobileNumber: "",
    email: "",
    address: "",
    gstin: "",
    msme: "",
    state: "Gujarat",
  });

  // Line Items
  const [lineItems, setLineItems] = useState<POLineItem[]>([
    {
      srNo: 1,
      itemCode: "",
      description: "",
      hsnCode: "6203",
      quantity: 0,
      uom: "PCS",
      rate: 0,
      basicAmount: 0,
      tax: 0,
      totalAmount: 0,
      deliveryDate: "",
    }
  ]);

  // Terms and Conditions
  const [termsAndConditions, setTermsAndConditions] = useState<POTermsAndConditions>({
    deliveryLocation: "OUR WORKS",
    deliveryTerms: "WITHIN 30 DAYS",
    paymentTerms: "100% payment against Delivery",
    freightCharges: "Free",
    taxDetails: "GST 18% EXTRA",
    validityPeriod: "30 days",
    otherTerms: [],
  });

  // Additional Fields
  const [mode, setMode] = useState("RT15");
  const [priceBasis, setPriceBasis] = useState("CFR");
  const [offerNumber, setOfferNumber] = useState("");
  const [offerDate, setOfferDate] = useState("");
  const [headerText, setHeaderText] = useState("We are pleased to place our Purchase Order for the supply of the following items subject to the General Terms and Conditions overleaf:");
  const [specialRequirements, setSpecialRequirements] = useState("As per Annexure");

  // Calculate totals
  const calculateTotals = () => {
    const basicAmount = lineItems.reduce((sum, item) => sum + item.basicAmount, 0);
    const cgst = basicAmount * 0.09; // 9% CGST
    const sgst = basicAmount * 0.09; // 9% SGST
    const totalAmount = basicAmount + cgst + sgst;

    return {
      basicAmount,
      taxableAmount: basicAmount,
      cgst,
      sgst,
      totalAmount,
    };
  };

  const handleAddLineItem = () => {
    const newItem: POLineItem = {
      srNo: lineItems.length + 1,
      itemCode: "",
      description: "",
      hsnCode: "6203",
      quantity: 0,
      uom: "PCS",
      rate: 0,
      basicAmount: 0,
      tax: 0,
      totalAmount: 0,
      deliveryDate: "",
    };
    setLineItems([...lineItems, newItem]);
  };

  const handleRemoveLineItem = (index: number) => {
    if (lineItems.length === 1) return; // Keep at least one item
    const updated = lineItems.filter((_, i) => i !== index);
    // Re-number items
    const renumbered = updated.map((item, idx) => ({ ...item, srNo: idx + 1 }));
    setLineItems(renumbered);
  };

  const handleLineItemChange = (index: number, field: keyof POLineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-calculate amounts
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : updated[index].quantity;
      const rate = field === 'rate' ? parseFloat(value) || 0 : updated[index].rate;
      const basicAmount = quantity * rate;
      const tax = basicAmount * 0.18; // 18% GST
      const totalAmount = basicAmount + tax;

      updated[index].basicAmount = basicAmount;
      updated[index].tax = tax;
      updated[index].totalAmount = totalAmount;
    }

    setLineItems(updated);
  };

  const isFormValid = () => {
    return (
      vendorDetails.supplierName &&
      vendorDetails.contactPerson &&
      vendorDetails.mobileNumber &&
      vendorDetails.email &&
      vendorDetails.address &&
      lineItems.length > 0 &&
      lineItems.every(item => item.description && item.quantity > 0 && item.rate > 0 && item.deliveryDate)
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      alert("Please fill all required fields");
      return;
    }

    const totals = calculateTotals();
    const totalQuantity = lineItems.reduce((sum, item) => sum + item.quantity, 0);

    const newPO: PurchaseOrder = {
      id: `po-${Date.now()}`,
      poNumber,
      poDate,

      // Basic client info (for compatibility with existing system)
      clientCompanyName: vendorDetails.supplierName,
      clientContactPerson: vendorDetails.contactPerson,
      clientContactEmail: vendorDetails.email,
      clientContactPhone: vendorDetails.mobileNumber,
      clientAddress: vendorDetails.address,
      clientReferenceNumber: vendorDetails.vendorCode,

      // Order details
      totalQuantity,
      uniformType: "both",
      deliveryDeadline: lineItems[0].deliveryDate,
      orderDate: poDate,

      // Pricing
      unitPrice: lineItems[0].rate,
      totalOrderValue: totals.basicAmount,
      paymentTerms: "100% payment against Delivery",
      advanceAmount: 0,

      // Order specs
      orderPriority: "normal",
      brandLogoRequired: false,
      qualityStandard: "standard",
      specialRequirements,

      // Status
      status: "draft",
      createdBy: currentUserEmail,
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),

      // Progress
      employeesUploaded: 0,
      measurementsCompleted: 0,
      measurementsInProgress: 0,

      // Enhanced details
      vendorDetails,
      companyDetails,
      lineItems,
      taxDetails: totals,
      termsAndConditions,
      mode,
      priceBasis,
      offerNumber,
      offerDate,
      headerText,
    };

    onSave(newPO);
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Create Detailed Purchase Order</h2>
          <p className="text-muted-foreground">Generate professional PO with complete details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid()}>
            <Save className="h-4 w-4 mr-2" />
            Create PO
          </Button>
        </div>
      </div>

      {/* PO Number and Date */}
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>PO Number *</Label>
            <Input 
              value={poNumber} 
              onChange={(e) => setPONumber(e.target.value)}
              className="font-mono font-bold" 
              placeholder="PO-2026-XXXX"
            />
          </div>
          <div>
            <Label>PO Date *</Label>
            <Input
              type="date"
              value={poDate}
              onChange={(e) => setPODate(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Company Details (Your Company) */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-indigo-600" />
          Your Company Details (Sunny Tailor)
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Company Name *</Label>
            <Input
              value={companyDetails.companyName}
              onChange={(e) => setCompanyDetails({ ...companyDetails, companyName: e.target.value })}
            />
          </div>
          <div>
            <Label>GSTIN *</Label>
            <Input
              value={companyDetails.gstin}
              onChange={(e) => setCompanyDetails({ ...companyDetails, gstin: e.target.value })}
            />
          </div>
          <div>
            <Label>PAN *</Label>
            <Input
              value={companyDetails.pan}
              onChange={(e) => setCompanyDetails({ ...companyDetails, pan: e.target.value })}
            />
          </div>
          <div>
            <Label>CIN</Label>
            <Input
              value={companyDetails.cin}
              onChange={(e) => setCompanyDetails({ ...companyDetails, cin: e.target.value })}
            />
          </div>
          <div className="col-span-2">
            <Label>Billing Address *</Label>
            <Textarea
              value={companyDetails.billingAddress}
              onChange={(e) => setCompanyDetails({ ...companyDetails, billingAddress: e.target.value })}
              rows={2}
            />
          </div>
          <div className="col-span-2">
            <Label>Shipping Address *</Label>
            <Textarea
              value={companyDetails.shippingAddress}
              onChange={(e) => setCompanyDetails({ ...companyDetails, shippingAddress: e.target.value })}
              rows={2}
            />
          </div>
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={companyDetails.email}
              onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })}
            />
          </div>
          <div>
            <Label>Phone *</Label>
            <Input
              value={companyDetails.phone}
              onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Vendor Details (Client/Supplier) */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-indigo-600" />
          Vendor/Supplier Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Vendor Code</Label>
            <Input
              value={vendorDetails.vendorCode}
              onChange={(e) => setVendorDetails({ ...vendorDetails, vendorCode: e.target.value })}
              placeholder="V0000107130"
            />
          </div>
          <div>
            <Label>Supplier Name *</Label>
            <CompanyAutocomplete
              value={vendorDetails.supplierName}
              onChange={(val) => setVendorDetails({ ...vendorDetails, supplierName: val })}
              onSelectCompany={(company) => {
                setVendorDetails({
                  ...vendorDetails,
                  supplierName: company.name,
                  contactPerson: company.contactPerson || vendorDetails.contactPerson,
                  mobileNumber: company.phone || vendorDetails.mobileNumber,
                  email: company.email || vendorDetails.email,
                  address: [company.address, company.city, company.state, company.pincode].filter(Boolean).join(", ") || vendorDetails.address,
                  gstin: company.gstNumber || vendorDetails.gstin,
                  state: company.state || vendorDetails.state,
                });
              }}
              placeholder="Type or select supplier name..."
            />
          </div>
          <div>
            <Label>Contact Person *</Label>
            <Input
              value={vendorDetails.contactPerson}
              onChange={(e) => setVendorDetails({ ...vendorDetails, contactPerson: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label>Mobile Number *</Label>
            <Input
              value={vendorDetails.mobileNumber}
              onChange={(e) => setVendorDetails({ ...vendorDetails, mobileNumber: e.target.value })}
              placeholder="+91 9876543210"
            />
          </div>
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={vendorDetails.email}
              onChange={(e) => setVendorDetails({ ...vendorDetails, email: e.target.value })}
              placeholder="contact@supplier.com"
            />
          </div>
          <div>
            <Label>GSTIN</Label>
            <Input
              value={vendorDetails.gstin}
              onChange={(e) => setVendorDetails({ ...vendorDetails, gstin: e.target.value })}
              placeholder="24AAGCP7350M1Z0"
            />
          </div>
          <div>
            <Label>MSME</Label>
            <Input
              value={vendorDetails.msme}
              onChange={(e) => setVendorDetails({ ...vendorDetails, msme: e.target.value })}
              placeholder="MICRO"
            />
          </div>
          <div>
            <Label>State *</Label>
            <Input
              value={vendorDetails.state}
              onChange={(e) => setVendorDetails({ ...vendorDetails, state: e.target.value })}
              placeholder="Gujarat"
            />
          </div>
          <div className="col-span-2">
            <Label>Address *</Label>
            <Textarea
              value={vendorDetails.address}
              onChange={(e) => setVendorDetails({ ...vendorDetails, address: e.target.value })}
              placeholder="17,18,19, MADHAV PARK CHANNI JAKATNAKA OVER BRIDGE, VADODARA"
              rows={2}
            />
          </div>
        </div>
      </Card>

      {/* Line Items */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-600" />
            Line Items
          </h3>
          <Button size="sm" onClick={handleAddLineItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="space-y-4">
          {lineItems.map((item, index) => (
            <Card key={index} className="p-4 border-2">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">Item #{item.srNo}</span>
                {lineItems.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveLineItem(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <Label className="text-xs">Item Code</Label>
                  <Input
                    value={item.itemCode}
                    onChange={(e) => handleLineItemChange(index, 'itemCode', e.target.value)}
                    placeholder="3901029012"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-xs">Description *</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                    placeholder="Corporate Uniform (Shirt + Pant)"
                  />
                </div>
                <div>
                  <Label className="text-xs">HSN Code *</Label>
                  <Input
                    value={item.hsnCode}
                    onChange={(e) => handleLineItemChange(index, 'hsnCode', e.target.value)}
                    placeholder="6203"
                  />
                </div>
                <div>
                  <Label className="text-xs">Quantity *</Label>
                  <Input
                    type="number"
                    value={item.quantity || ''}
                    onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                    placeholder="90"
                  />
                </div>
                <div>
                  <Label className="text-xs">UOM *</Label>
                  <Select
                    value={item.uom}
                    onValueChange={(value) => handleLineItemChange(index, 'uom', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PCS">PCS</SelectItem>
                      <SelectItem value="EA">EA</SelectItem>
                      <SelectItem value="MTR">MTR</SelectItem>
                      <SelectItem value="KG">KG</SelectItem>
                      <SelectItem value="SET">SET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Rate (₹) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={item.rate || ''}
                    onChange={(e) => handleLineItemChange(index, 'rate', e.target.value)}
                    placeholder="450.00"
                  />
                </div>
                <div>
                  <Label className="text-xs">Delivery Date *</Label>
                  <Input
                    type="date"
                    value={item.deliveryDate}
                    onChange={(e) => handleLineItemChange(index, 'deliveryDate', e.target.value)}
                  />
                </div>
                <div className="col-span-4 grid grid-cols-3 gap-3 mt-2 p-3 bg-gray-50 rounded">
                  <div>
                    <Label className="text-xs text-muted-foreground">Basic Amount</Label>
                    <div className="font-semibold">₹{item.basicAmount.toFixed(2)}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Tax (18%)</Label>
                    <div className="font-semibold">₹{item.tax.toFixed(2)}</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Total Amount</Label>
                    <div className="font-semibold text-indigo-600">₹{item.totalAmount.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Tax Summary */}
      <Card className="p-6 bg-indigo-50">
        <h3 className="font-semibold text-lg mb-4">Tax Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Basic Amount:</span>
            <span className="font-semibold">₹{totals.basicAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxable Amount:</span>
            <span className="font-semibold">₹{totals.taxableAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>CGST (9%):</span>
            <span className="font-semibold">₹{totals.cgst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>SGST (9%):</span>
            <span className="font-semibold">₹{totals.sgst.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg">
            <span className="font-bold">Total Amount:</span>
            <span className="font-bold text-indigo-600">₹{totals.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* Terms and Conditions */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-indigo-600" />
          Terms and Conditions
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Delivery Location</Label>
            <Input
              value={termsAndConditions.deliveryLocation}
              onChange={(e) => setTermsAndConditions({ ...termsAndConditions, deliveryLocation: e.target.value })}
            />
          </div>
          <div>
            <Label>Delivery Terms</Label>
            <Input
              value={termsAndConditions.deliveryTerms}
              onChange={(e) => setTermsAndConditions({ ...termsAndConditions, deliveryTerms: e.target.value })}
            />
          </div>
          <div>
            <Label>Payment Terms</Label>
            <Input
              value={termsAndConditions.paymentTerms}
              onChange={(e) => setTermsAndConditions({ ...termsAndConditions, paymentTerms: e.target.value })}
            />
          </div>
          <div>
            <Label>Freight Charges</Label>
            <Input
              value={termsAndConditions.freightCharges}
              onChange={(e) => setTermsAndConditions({ ...termsAndConditions, freightCharges: e.target.value })}
            />
          </div>
          <div>
            <Label>Tax Details</Label>
            <Input
              value={termsAndConditions.taxDetails}
              onChange={(e) => setTermsAndConditions({ ...termsAndConditions, taxDetails: e.target.value })}
            />
          </div>
          <div>
            <Label>Validity Period</Label>
            <Input
              value={termsAndConditions.validityPeriod}
              onChange={(e) => setTermsAndConditions({ ...termsAndConditions, validityPeriod: e.target.value })}
            />
          </div>
        </div>
      </Card>

      {/* Additional Details */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Additional Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Mode</Label>
            <Input
              value={mode}
              onChange={(e) => setMode(e.target.value)}
              placeholder="RT15"
            />
          </div>
          <div>
            <Label>Price Basis</Label>
            <Input
              value={priceBasis}
              onChange={(e) => setPriceBasis(e.target.value)}
              placeholder="CFR"
            />
          </div>
          <div>
            <Label>Offer Number</Label>
            <Input
              value={offerNumber}
              onChange={(e) => setOfferNumber(e.target.value)}
              placeholder="205"
            />
          </div>
          <div>
            <Label>Offer Date</Label>
            <Input
              type="date"
              value={offerDate}
              onChange={(e) => setOfferDate(e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <Label>Header Text</Label>
            <Textarea
              value={headerText}
              onChange={(e) => setHeaderText(e.target.value)}
              rows={2}
            />
          </div>
          <div className="col-span-2">
            <Label>Special Requirements / Annexure</Label>
            <Textarea
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </Card>

      {/* Form Validation Alert */}
      {!isFormValid() && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <div className="font-semibold mb-1">Required fields missing</div>
              <div>Please fill in all required fields marked with * before creating the PO.</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}