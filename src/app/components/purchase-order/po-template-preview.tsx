import { useState } from "react";
import { X, Download, Printer, FileText } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { PurchaseOrder, POLineItem } from "./purchase-order-types";

interface POTemplatePreviewProps {
  purchaseOrder: PurchaseOrder;
  onClose: () => void;
}

export function POTemplatePreview({ purchaseOrder, onClose }: POTemplatePreviewProps) {
  const [downloading, setDownloading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string>('');

  // Check if this PO has an uploaded document
  const hasUploadedDocument = purchaseOrder.uploadedDocument && purchaseOrder.uploadedDocument.fileName;

  const handleDownloadPDF = () => {
    setDownloading(true);
    
    if (hasUploadedDocument) {
      // Prefer Supabase Storage URL, fall back to legacy base64
      const src = purchaseOrder.uploadedDocument?.fileUrl || purchaseOrder.uploadedDocument?.fileData;
      if (src) {
        const link = document.createElement('a');
        link.href = src;
        link.download = purchaseOrder.uploadedDocument!.fileName;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setDownloading(false);
        return;
      }
    }
    
    // Create a printable version for generated templates
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(generatePrintableHTML());
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        setDownloading(false);
      }, 250);
    }
  };

  const handlePrint = () => {
    if (hasUploadedDocument) {
      alert("Please download the file and print from your PDF viewer.");
      return;
    }
    window.print();
  };

  const generatePrintableHTML = () => {
    const content = document.getElementById('po-template-content');
    if (!content) return '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Purchase Order - ${purchaseOrder.poNumber}</title>
          <style>
            * { 
              margin: 0; 
              padding: 0; 
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              color-adjust: exact !important;
            }
            body { 
              font-family: Arial, sans-serif; 
              font-size: 11px;
              line-height: 1.4;
              padding: 20px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-bottom: 10px;
            }
            th, td { 
              border: 1px solid #000; 
              padding: 6px; 
              text-align: left;
            }
            th { 
              background-color: #f0f0f0 !important; 
              font-weight: bold;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .header { 
              text-align: center; 
              font-size: 16px; 
              font-weight: bold; 
              margin-bottom: 15px;
              border-bottom: 2px solid #000;
              padding-bottom: 10px;
            }
            .section-title {
              background-color: #4F46E5 !important;
              color: white !important;
              font-weight: bold;
              padding: 8px;
              margin-top: 15px;
              margin-bottom: 5px;
              text-align: center;
              font-size: 13px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
            }
            .company-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 20px;
              padding: 15px;
              border: 2px solid #000;
            }
            .logo-section {
              width: 100px;
              height: 100px;
              border: 1px solid #ccc;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: #f9fafb !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .po-title {
              background-color: #4F46E5 !important;
              color: white !important;
              text-align: center;
              font-size: 16px;
              font-weight: bold;
              padding: 10px;
              margin-bottom: 15px;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .bg-gray {
              background-color: #f0f0f0 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .bg-indigo {
              background-color: #4F46E5 !important;
              color: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .bg-indigo-light {
              background-color: #EEF2FF !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .text-blue {
              color: #1D4ED8 !important;
            }
            .text-gray {
              color: #6b7280 !important;
            }
            .no-border { border: none; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .bold { font-weight: bold; }
            @media print {
              body { 
                padding: 0;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              button { display: none; }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body>
          ${content.innerHTML}
        </body>
      </html>
    `;
  };

  // Default company details for Sunny Tailor
  const companyDetails = purchaseOrder.companyDetails || {
    companyName: "Sunny Tailor",
    billingAddress: "Shop No. 5, Textile Market, Gandhi Road, Mumbai - 400001, Maharashtra",
    shippingAddress: "Shop No. 5, Textile Market, Gandhi Road, Mumbai - 400001, Maharashtra",
    gstin: "27AABCS1234F1Z5",
    pan: "AABCS1234F",
    email: "contact@sunnytailor.com",
    phone: "+91 9876543210",
  };

  const vendorDetails = purchaseOrder.vendorDetails || {
    vendorCode: "V" + purchaseOrder.poNumber.replace("PO-", ""),
    supplierName: purchaseOrder.clientCompanyName,
    contactPerson: purchaseOrder.clientContactPerson,
    mobileNumber: purchaseOrder.clientContactPhone,
    email: purchaseOrder.clientContactEmail,
    address: purchaseOrder.clientAddress,
    gstin: "N/A",
    state: "Gujarat",
  };

  // Generate line items if not provided
  const lineItems: POLineItem[] = purchaseOrder.lineItems || [
    {
      srNo: 1,
      itemCode: purchaseOrder.uniformType === "both" ? "UNIFORM-SHP" : 
                purchaseOrder.uniformType === "shirt-only" ? "UNIFORM-S" : "UNIFORM-P",
      description: purchaseOrder.uniformType === "both" ? "Corporate Uniform (Shirt + Pant)" :
                   purchaseOrder.uniformType === "shirt-only" ? "Corporate Shirt" : "Corporate Pant",
      hsnCode: "6203",
      quantity: purchaseOrder.totalQuantity,
      uom: "PCS",
      rate: purchaseOrder.unitPrice,
      basicAmount: purchaseOrder.totalOrderValue,
      tax: purchaseOrder.totalOrderValue * 0.18, // 18% GST
      totalAmount: purchaseOrder.totalOrderValue * 1.18,
      deliveryDate: purchaseOrder.deliveryDeadline,
    }
  ];

  const taxDetails = purchaseOrder.taxDetails || {
    basicAmount: purchaseOrder.totalOrderValue,
    taxableAmount: purchaseOrder.totalOrderValue,
    cgst: purchaseOrder.totalOrderValue * 0.09, // 9% CGST
    sgst: purchaseOrder.totalOrderValue * 0.09, // 9% SGST
    totalAmount: purchaseOrder.totalOrderValue * 1.18,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const convertNumberToWords = (num: number): string => {
    // Handle invalid inputs
    if (typeof num !== 'number' || isNaN(num) || num < 0) {
      return 'Zero';
    }
    
    // Convert to integer to avoid infinite recursion with decimals
    const intNum = Math.floor(Math.abs(num));
    
    if (intNum === 0) return 'Zero';
    
    const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    // Helper function for numbers less than 100
    const convertTwoDigits = (n: number): string => {
      if (n === 0) return '';
      if (n < 10) return units[n];
      if (n < 20) return teens[n - 10];
      return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + units[n % 10] : '');
    };
    
    // Helper function for numbers less than 1000
    const convertThreeDigits = (n: number): string => {
      if (n === 0) return '';
      if (n < 100) return convertTwoDigits(n);
      const hundreds = Math.floor(n / 100);
      const remainder = n % 100;
      return units[hundreds] + ' Hundred' + (remainder !== 0 ? ' ' + convertTwoDigits(remainder) : '');
    };
    
    // Process number in Indian numbering system
    if (intNum < 100) {
      return convertTwoDigits(intNum);
    } else if (intNum < 1000) {
      return convertThreeDigits(intNum);
    } else if (intNum < 100000) {
      // Thousands
      const thousands = Math.floor(intNum / 1000);
      const remainder = intNum % 1000;
      return convertTwoDigits(thousands) + ' Thousand' + (remainder !== 0 ? ' ' + convertThreeDigits(remainder) : '');
    } else if (intNum < 10000000) {
      // Lakhs
      const lakhs = Math.floor(intNum / 100000);
      const remainder = intNum % 100000;
      return convertTwoDigits(lakhs) + ' Lakh' + (remainder !== 0 ? ' ' + convertNumberToWords(remainder) : '');
    } else {
      // Crores
      const crores = Math.floor(intNum / 10000000);
      const remainder = intNum % 10000000;
      return convertNumberToWords(crores) + ' Crore' + (remainder !== 0 ? ' ' + convertNumberToWords(remainder) : '');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-5xl bg-white relative my-8">
        {/* Header with Actions */}
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold">Purchase Order Preview</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={downloading}
            >
              <Download className="h-4 w-4 mr-2" />
              {downloading ? "Preparing..." : "Download"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* PO Template Content */}
        <div id="po-template-content" className="p-8 bg-white" style={{ fontSize: '11px', fontFamily: 'Arial, sans-serif' }}>
          {hasUploadedDocument ? (
            // Display uploaded document
            <div className="space-y-6">
              {/* Document Viewer */}
              {purchaseOrder.uploadedDocument?.fileType.startsWith('image/') ? (
                // Display image
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={purchaseOrder.uploadedDocument.fileUrl || purchaseOrder.uploadedDocument.fileData} 
                    alt={purchaseOrder.uploadedDocument.fileName}
                    className="w-full h-auto"
                  />
                </div>
              ) : purchaseOrder.uploadedDocument?.fileType === 'application/pdf' ? (
                // Display PDF in iframe
                <div className="border rounded-lg overflow-hidden" style={{ height: '800px' }}>
                  <iframe
                    src={purchaseOrder.uploadedDocument.fileUrl || purchaseOrder.uploadedDocument.fileData}
                    className="w-full h-full"
                    title={purchaseOrder.uploadedDocument.fileName}
                  />
                </div>
              ) : (
                // For Word documents or other formats, show download option
                <div className="text-center py-12">
                  <FileText className="h-24 w-24 text-indigo-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Uploaded Purchase Order Document</h3>
                  <p className="text-muted-foreground mb-6">
                    This PO was created by uploading an existing document
                  </p>
                  
                  <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 max-w-2xl mx-auto text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">File Name</p>
                        <p className="font-semibold">{purchaseOrder.uploadedDocument?.fileName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">File Type</p>
                        <p className="font-semibold uppercase">
                          {purchaseOrder.uploadedDocument?.fileType?.split('/')[1] || 'Document'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">File Size</p>
                        <p className="font-semibold">
                          {purchaseOrder.uploadedDocument?.fileSize 
                            ? (purchaseOrder.uploadedDocument.fileSize < 1024 * 1024 
                                ? (purchaseOrder.uploadedDocument.fileSize / 1024).toFixed(2) + ' KB'
                                : (purchaseOrder.uploadedDocument.fileSize / (1024 * 1024)).toFixed(2) + ' MB')
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Upload Date</p>
                        <p className="font-semibold">
                          {purchaseOrder.uploadedDocument?.uploadDate 
                            ? new Date(purchaseOrder.uploadedDocument.uploadDate).toLocaleDateString('en-IN')
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        onClick={() => {
                          const src = purchaseOrder.uploadedDocument?.fileUrl || purchaseOrder.uploadedDocument?.fileData || '';
                          const link = document.createElement('a');
                          link.href = src;
                          link.download = purchaseOrder.uploadedDocument?.fileName || 'document';
                          link.target = "_blank";
                          link.click();
                        }}
                        className="w-full"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Document
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8 p-6 bg-gray-50 rounded-lg max-w-2xl mx-auto text-left">
                    <h4 className="font-semibold mb-4 text-lg">PO Basic Details</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">PO Number</p>
                        <p className="font-semibold font-mono">{purchaseOrder.poNumber}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Client Company</p>
                        <p className="font-semibold">{purchaseOrder.clientCompanyName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total Quantity</p>
                        <p className="font-semibold">{purchaseOrder.totalQuantity} employees</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Uniform Type</p>
                        <p className="font-semibold capitalize">{purchaseOrder.uniformType.replace('-', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Delivery Deadline</p>
                        <p className="font-semibold">{new Date(purchaseOrder.deliveryDeadline).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-semibold capitalize">{purchaseOrder.status}</p>
                      </div>
                    </div>
                    {purchaseOrder.notes && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-muted-foreground mb-1">Notes</p>
                        <p className="text-sm">{purchaseOrder.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 text-sm text-muted-foreground">
                    <p>
                      📄 This document format requires downloading to view the full content.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Display generated template
            <>
          {/* Company Header */}
          <div style={{ border: '2px solid #000', marginBottom: '15px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td rowSpan={2} style={{ width: '120px', border: '1px solid #000', padding: '10px', verticalAlign: 'top' }}>
                    <div style={{ 
                      width: '100px', 
                      height: '100px', 
                      border: '1px solid #ccc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#f9fafb',
                      fontSize: '10px',
                      color: '#6b7280'
                    }}>
                      LOGO
                    </div>
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>Billing Address</div>
                    <div style={{ fontWeight: 'bold' }}>{companyDetails.companyName}</div>
                    <div>{companyDetails.billingAddress}</div>
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px', backgroundColor: '#f0f0f0' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '12px' }}>Shipping Address</div>
                    <div style={{ fontWeight: 'bold' }}>{companyDetails.companyName}</div>
                    <div>{companyDetails.shippingAddress}</div>
                  </td>
                </tr>
                <tr>
                  <td style={{ border: '1px solid #000', padding: '8px' }}>
                    <div><strong>GSTIN No.:</strong> {companyDetails.gstin}</div>
                    <div><strong>PAN No.:</strong> {companyDetails.pan}</div>
                    {companyDetails.cin && <div><strong>CIN No.:</strong> {companyDetails.cin}</div>}
                  </td>
                  <td style={{ border: '1px solid #000', padding: '8px' }}>
                    <div><strong>Email:</strong> {companyDetails.email}</div>
                    <div><strong>Phone:</strong> {companyDetails.phone}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Purchase Order Title */}
          <div style={{ 
            textAlign: 'center', 
            fontSize: '16px', 
            fontWeight: 'bold', 
            backgroundColor: '#4F46E5',
            color: 'white',
            padding: '10px',
            marginBottom: '15px'
          }}>
            Purchase Order
          </div>

          {/* Vendor and PO Details */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
            <tbody>
              <tr>
                <td style={{ border: '1px solid #000', padding: '8px', width: '50%', verticalAlign: 'top' }}>
                  <div><strong>Vendor Code:</strong> {vendorDetails.vendorCode}</div>
                  <div><strong>Supplier Name:</strong> {vendorDetails.supplierName}</div>
                  <div><strong>Contact Person:</strong> {vendorDetails.contactPerson}</div>
                  <div><strong>Mobile Number:</strong> {vendorDetails.mobileNumber}</div>
                  <div><strong>Email Id:</strong> {vendorDetails.email}</div>
                  <div><strong>Address:</strong> {vendorDetails.address}</div>
                  <div><strong>GSTIN:</strong> {vendorDetails.gstin}</div>
                  {vendorDetails.msme && <div><strong>MSME:</strong> {vendorDetails.msme}</div>}
                  <div><strong>State:</strong> {vendorDetails.state}</div>
                </td>
                <td style={{ border: '1px solid #000', padding: '8px', width: '50%', verticalAlign: 'top' }}>
                  <div><strong>PO No.:</strong> {purchaseOrder.poNumber}</div>
                  <div><strong>Date:</strong> {formatDate(purchaseOrder.poDate || purchaseOrder.orderDate)}</div>
                  <div><strong>Contact Person:</strong> {purchaseOrder.clientContactPerson}</div>
                  <div><strong>Email Id:</strong> {purchaseOrder.clientContactEmail}</div>
                  <div><strong>Mobile No.:</strong> {purchaseOrder.clientContactPhone}</div>
                  {purchaseOrder.offerNumber && <div><strong>Offer no & Date:</strong> {purchaseOrder.offerNumber}</div>}
                  {purchaseOrder.mode && <div><strong>Mode:</strong> {purchaseOrder.mode}</div>}
                  {purchaseOrder.priceBasis && <div><strong>Price Basis (Incr Terms):</strong> {purchaseOrder.priceBasis}</div>}
                  <div><strong>Delivery Location:</strong> {purchaseOrder.termsAndConditions?.deliveryLocation || "OUR WORKS"}</div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* Person Liable for GST */}
          <div style={{ border: '1px solid #000', padding: '6px', marginBottom: '10px', fontWeight: 'bold' }}>
            Person Liable for GST is Consigner / Service Provider
          </div>

          {/* Opening Text */}
          <div style={{ marginBottom: '10px', fontSize: '10px' }}>
            <strong>Dear Sir,</strong>
            <div style={{ marginTop: '5px' }}>
              {purchaseOrder.headerText || "We are pleased to place our Purchase Order for the supply of the following items subject to the General Terms and Conditions overleaf:"}
            </div>
          </div>

          {/* Line Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ border: '1px solid #000', padding: '6px', width: '40px' }}>Sr.</th>
                <th style={{ border: '1px solid #000', padding: '6px', width: '100px' }}>Item Code</th>
                <th style={{ border: '1px solid #000', padding: '6px' }}>Description of Goods</th>
                <th style={{ border: '1px solid #000', padding: '6px', width: '80px' }}>HSN</th>
                <th style={{ border: '1px solid #000', padding: '6px', width: '70px' }}>Quantity</th>
                <th style={{ border: '1px solid #000', padding: '6px', width: '50px' }}>UOM</th>
                <th style={{ border: '1px solid #000', padding: '6px', width: '80px' }}>Rate (INR)</th>
                <th style={{ border: '1px solid #000', padding: '6px', width: '90px' }}>Basic Amount</th>
                <th style={{ border: '1px solid #000', padding: '6px', width: '80px' }}>Tax</th>
                <th style={{ border: '1px solid #000', padding: '6px', width: '90px' }}>Total Amount</th>
                <th style={{ border: '1px solid #000', padding: '6px', width: '90px' }}>Delivery Date</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => {
                // Ensure all numeric values are properly converted
                const quantity = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity) || 0;
                const rate = typeof item.rate === 'number' ? item.rate : parseFloat(item.rate) || 0;
                const basicAmount = typeof item.basicAmount === 'number' ? item.basicAmount : parseFloat(item.basicAmount) || 0;
                const totalAmount = typeof item.totalAmount === 'number' ? item.totalAmount : parseFloat(item.totalAmount) || 0;
                
                return (
                  <tr key={item.srNo}>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{item.srNo}</td>
                    <td style={{ border: '1px solid #000', padding: '6px' }}>{item.itemCode}</td>
                    <td style={{ border: '1px solid #000', padding: '6px' }}>{item.description}</td>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{item.hsnCode}</td>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{quantity}</td>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{item.uom}</td>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{rate.toFixed(2)}</td>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{basicAmount.toFixed(2)}</td>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>
                      <div style={{ fontSize: '9px' }}>CGST 9%:</div>
                      <div style={{ fontSize: '9px' }}>SGST 9%:</div>
                    </td>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{totalAmount.toFixed(2)}</td>
                    <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{formatDate(item.deliveryDate)}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={11} style={{ border: '1px solid #000', padding: '4px', fontSize: '9px', fontStyle: 'italic' }}>
                  {purchaseOrder.specialRequirements || "As per Annexure"}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Tax Summary */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
            <tbody>
              <tr>
                <td colSpan={2} style={{ border: '1px solid #000', padding: '6px', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                  Basic Amount
                </td>
                <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>
                  {formatCurrency(taxDetails.basicAmount)}
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ border: '1px solid #000', padding: '6px', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                  Taxable Amount
                </td>
                <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold' }}>
                  {formatCurrency(taxDetails.taxableAmount)}
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ border: '1px solid #000', padding: '6px', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                  Total Central GST
                </td>
                <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>
                  {formatCurrency(taxDetails.cgst)}
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ border: '1px solid #000', padding: '6px', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>
                  IN : State GST
                </td>
                <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>
                  {formatCurrency(taxDetails.sgst)}
                </td>
              </tr>
              <tr>
                <td colSpan={2} style={{ border: '1px solid #000', padding: '6px', backgroundColor: '#4F46E5', color: 'white', fontWeight: 'bold' }}>
                  Total (Including other expenses)
                </td>
                <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right', fontWeight: 'bold', backgroundColor: '#EEF2FF' }}>
                  {formatCurrency(taxDetails.totalAmount)}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Amount in Words */}
          <div style={{ border: '1px solid #000', padding: '8px', marginBottom: '15px', fontWeight: 'bold' }}>
            <strong>Amount:</strong> {convertNumberToWords(Math.round(taxDetails.totalAmount))} Rupees Only
          </div>

          {/* Terms and Conditions */}
          <div style={{ border: '1px solid #000', padding: '8px', marginBottom: '15px' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px', textDecoration: 'underline' }}>Header Text:-</div>
            <div style={{ marginBottom: '8px', fontSize: '10px' }}>
              # REF TO QUOTE NO {purchaseOrder.offerNumber || '205'} DTD {formatDate(purchaseOrder.offerDate || purchaseOrder.orderDate)}
            </div>
            <div style={{ marginBottom: '5px', fontSize: '10px' }}>Details as per below material line</div>
            <div style={{ marginBottom: '5px', fontSize: '10px' }}># TAX : GST 18% EXTRA</div>
            <div style={{ marginBottom: '5px', fontSize: '10px' }}># FREIGHT : -Free</div>
            <div style={{ marginBottom: '5px', fontSize: '10px' }}>
              # DELIVERY : WITHIN {Math.ceil((new Date(purchaseOrder.deliveryDeadline).getTime() - new Date(purchaseOrder.orderDate).getTime()) / (1000 * 60 * 60 * 24))} DAYS
            </div>
            {purchaseOrder.termsAndConditions?.otherTerms && purchaseOrder.termsAndConditions.otherTerms.map((term, idx) => (
              <div key={idx} style={{ marginBottom: '5px', fontSize: '10px' }}>{term}</div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ 
            marginTop: '30px', 
            paddingTop: '15px', 
            borderTop: '1px solid #ccc',
            fontSize: '9px',
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
              Principal Place of Business: {companyDetails.companyName}
            </div>
            <div>{companyDetails.billingAddress}</div>
            <div style={{ marginTop: '10px' }}>
              <strong>PRD</strong> | Page 1 of 1
            </div>
          </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}