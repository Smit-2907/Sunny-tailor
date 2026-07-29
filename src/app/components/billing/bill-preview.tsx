import { Bill } from "./bill-types";
import { formatCurrency } from "./bill-utils";
import companyLogo from "../../../imports/image.png";

interface BillPreviewProps {
  bill: Bill;
  showPrintMode?: boolean;
}

export function BillPreview({ bill, showPrintMode = false }: BillPreviewProps) {
  const containerClass = showPrintMode
    ? "bg-white w-[210mm] min-h-[297mm] mx-auto"
    : "bg-white border-2 border-gray-800 rounded-lg shadow-lg w-full max-w-4xl mx-auto";

  return (
    <div className={containerClass}>
      {/* Top Border with Title */}
      <div className="border-b border-gray-800 bg-gray-100 px-6 py-2 flex justify-between items-center">
        <div className="flex-1"></div>
        <h2 className="text-sm font-bold text-center flex-1">Tax Invoice</h2>
        <div className="flex-1 flex justify-end">
          <div className="bg-white px-3 py-0.5 border border-gray-800 text-xs font-semibold">
            Original
          </div>
        </div>
      </div>

      {/* Header - Company Details */}
      <div className="border-b border-gray-800 px-6 py-4">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={companyLogo}
              alt="Company Logo"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Company Info - Centered */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-bold text-gray-900 mb-1">SUNNY TAILOR</h1>
            <p className="text-[10px] text-gray-700 leading-relaxed">
              {bill.companyDetails.address}
            </p>
            <div className="mt-2 text-[10px] text-gray-700 space-y-0.5">
              <p>Vadodara, Gujarat</p>
              <p>9537736351 - StateCode : 24</p>
              <p><strong>GSTIN</strong> : {bill.companyDetails.gstin}</p>
              <p><strong>MSME No</strong> : UDYAM-GJ-24-0040211</p>
            </div>
          </div>

          {/* Right side spacer for balance */}
          <div className="flex-shrink-0 w-16"></div>
        </div>
      </div>

      {/* Invoice Details Row */}
      <div className="grid grid-cols-2 text-[10px] border-b border-gray-800">
        <div className="border-r border-gray-800 p-2 grid grid-cols-2">
          <div className="flex gap-1">
            <span className="text-gray-700">Challan No</span>
            <span className="text-gray-700">:</span>
            <span className="font-semibold">{bill.challanNo || "SF-382"}</span>
          </div>
          <div className="flex gap-1">
            <span className="text-gray-700">Invoice No</span>
            <span className="text-gray-700">:</span>
            <span className="font-semibold">{bill.billNumber}</span>
          </div>
        </div>
        <div className="p-2 grid grid-cols-2">
          <div className="flex gap-1">
            <span className="text-gray-700">Po No</span>
            <span className="text-gray-700">:</span>
            <span className="font-semibold">{bill.poNumber || "450018928"}</span>
          </div>
          <div className="flex gap-1">
            <span className="text-gray-700">Po Date</span>
            <span className="text-gray-700">:</span>
            <span className="font-semibold">{bill.poDate || "12-01-2026"}</span>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-800 p-2 text-[10px] text-right">
        <span className="text-gray-700">Invoice Date</span>
        <span className="text-gray-700 ml-1">:</span>
        <span className="font-semibold ml-1">{bill.invoiceDate}</span>
      </div>

      {/* Party Details */}
      <div className="border-b border-gray-800 bg-gray-50 px-3 py-2 grid grid-cols-2 gap-8 text-[10px]">
        {/* Billed To */}
        <div>
          <p className="font-semibold text-gray-600 mb-2">Details of Receiver (Billed to)</p>
          <p className="font-bold text-gray-900 mb-1">Name : {bill.billedTo.name}</p>
          <p className="text-gray-700 mb-1">Address : {bill.billedTo.address}</p>
        </div>

        {/* Shipped To */}
        <div>
          <p className="font-semibold text-gray-600 mb-2">Details of Consignee (Shipped to)</p>
          {bill.shippedTo && (
            <>
              <p className="font-bold text-gray-900 mb-1">Name : {bill.shippedTo.name}</p>
              <p className="text-gray-700 mb-1">Address : {bill.shippedTo.address || bill.billedTo.address}</p>
            </>
          )}
        </div>
      </div>

      {/* Additional Details */}
      <div className="grid grid-cols-3 text-[10px] border-b border-gray-800">
        <div className="border-r border-gray-800 p-2">
          <span className="text-gray-700">Mo No</span>
          <span className="text-gray-700 mx-1">:</span>
          <span className="font-semibold">{bill.vehicleNo || "0276 221001"}</span>
        </div>
        <div className="border-r border-gray-800 p-2">
          <span className="text-gray-700">State</span>
          <span className="text-gray-700 mx-1">:</span>
          <span className="font-semibold">{bill.billedTo.state} - {bill.billedTo.stateCode || "24"}</span>
        </div>
        <div className="p-2">
          <span className="text-gray-700">Ship.GST</span>
          <span className="text-gray-700 mx-1">:</span>
          <span className="font-semibold">{bill.shippedTo?.gstin || bill.billedTo.gstin || "24AAACR8758H1Z4"}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 text-[10px] border-b border-gray-800">
        <div className="border-r border-gray-800 p-2">
          <span className="text-gray-700">GSTIN</span>
          <span className="text-gray-700 mx-1">:</span>
          <span className="font-semibold">{bill.billedTo.gstin || "24AAACR8758H1Z4"}</span>
        </div>
        <div className="border-r border-gray-800 p-2 col-span-2">
          <span className="text-gray-700">State</span>
          <span className="text-gray-700 mx-1">:</span>
          <span className="font-semibold">{bill.shippedTo?.state || "Gujarat"}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 text-[10px] border-b border-gray-800">
        <div className="border-r border-gray-800 p-2">
          <span className="text-gray-700"></span>
        </div>
        <div className="border-r border-gray-800 p-2">
          <span className="text-gray-700"></span>
        </div>
        <div className="p-2">
          <span className="text-gray-700">Mob.No</span>
          <span className="text-gray-700 mx-1">:</span>
          <span className="font-semibold">{bill.billedTo.phone || "0276 221001"}</span>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-[10px] border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-800 p-2 text-center w-8">#</th>
            <th className="border border-gray-800 p-2 text-left">Particulars</th>
            <th className="border border-gray-800 p-2 text-center w-24">HSN / SAC</th>
            <th className="border border-gray-800 p-2 text-center w-16">Qty</th>
            <th className="border border-gray-800 p-2 text-center w-16">Unit</th>
            <th className="border border-gray-800 p-2 text-center w-20">Gst (%)</th>
            <th className="border border-gray-800 p-2 text-right w-20">Rate</th>
            <th className="border border-gray-800 p-2 text-right w-28">Taxable value</th>
          </tr>
        </thead>
        <tbody>
          {bill.items.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-800 p-2 text-center">{item.srNo}</td>
              <td className="border border-gray-800 p-2">{item.particulars}</td>
              <td className="border border-gray-800 p-2 text-center">{item.hsnSac}</td>
              <td className="border border-gray-800 p-2 text-center">{item.qty}</td>
              <td className="border border-gray-800 p-2 text-center">{item.unit}</td>
              <td className="border border-gray-800 p-2 text-center">{item.gstPercent}%</td>
              <td className="border border-gray-800 p-2 text-right">{formatCurrency(item.rate)}</td>
              <td className="border border-gray-800 p-2 text-right">{formatCurrency(item.taxableAmount)}</td>
            </tr>
          ))}

          {/* Empty rows for spacing */}
          {[...Array(Math.max(0, 3 - bill.items.length))].map((_, i) => (
            <tr key={`empty-${i}`} style={{ height: '40px' }}>
              <td className="border border-gray-800 p-2"></td>
              <td className="border border-gray-800 p-2"></td>
              <td className="border border-gray-800 p-2"></td>
              <td className="border border-gray-800 p-2"></td>
              <td className="border border-gray-800 p-2"></td>
              <td className="border border-gray-800 p-2"></td>
              <td className="border border-gray-800 p-2"></td>
              <td className="border border-gray-800 p-2"></td>
            </tr>
          ))}

          {/* Total Row */}
          <tr className="font-semibold bg-gray-50">
            <td colSpan={3} className="border border-gray-800 p-2 text-right">Total :</td>
            <td className="border border-gray-800 p-2 text-center">{bill.items.reduce((sum, item) => sum + item.qty, 0).toFixed(2)}</td>
            <td className="border border-gray-800 p-2"></td>
            <td className="border border-gray-800 p-2"></td>
            <td className="border border-gray-800 p-2"></td>
            <td className="border border-gray-800 p-2 text-right">{formatCurrency(bill.subtotal)}</td>
          </tr>
        </tbody>
      </table>

      {/* Bottom Section */}
      <div className="grid grid-cols-[1.2fr_1fr]">
        {/* Left: Transportation & Bank Details & Tax Table & Terms */}
        <div className="border-r border-gray-800">
          {/* Transportation Details */}
          <div className="border-b border-gray-800 bg-gray-100 px-3 py-1 text-[10px] font-semibold">
            Transportation Details :
          </div>
          <div className="grid grid-cols-2 text-[10px]">
            <div className="border-r border-gray-800 border-b border-gray-800 p-2">
              <span className="text-gray-700">Trans Name</span>
              <span className="mx-2">:</span>
              <span className="font-semibold">-</span>
            </div>
            <div className="border-b border-gray-800 p-2">
              <span className="text-gray-700">Veh .No</span>
              <span className="mx-2">:</span>
              <span className="font-semibold">{bill.vehicleNo || "gj 06 13455"}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 text-[10px]">
            <div className="border-r border-gray-800 border-b border-gray-800 p-2">
              <span className="text-gray-700">LR.no</span>
              <span className="mx-2">:</span>
              <span className="font-semibold">-</span>
            </div>
            <div className="border-b border-gray-800 p-2">
              <span className="text-gray-700">Station</span>
              <span className="mx-2">:</span>
              <span className="font-semibold">{bill.stationFrom || "Panchmahal (Godhra)"}</span>
            </div>
          </div>

          {/* Bank Details */}
          <div className="border-b border-gray-800 bg-gray-100 px-3 py-1 text-[10px] font-semibold">
            Bank Details :
          </div>
          <div className="grid grid-cols-2 text-[10px]">
            <div className="border-r border-gray-800 border-b border-gray-800 p-2">
              <span className="text-gray-700">Bank Name</span>
              <span className="mx-2">:</span>
              <span className="font-semibold">{bill.bankDetails.bankName}</span>
            </div>
            <div className="border-b border-gray-800 p-2">
              <span className="text-gray-700">A/c No</span>
              <span className="mx-2">:</span>
              <span className="font-semibold">{bill.bankDetails.accountNumber}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 text-[10px]">
            <div className="border-r border-gray-800 border-b border-gray-800 p-2">
              <span className="text-gray-700">Branch Name</span>
              <span className="mx-2">:</span>
              <span className="font-semibold">{bill.bankDetails.branchName}</span>
            </div>
            <div className="border-b border-gray-800 p-2">
              <span className="text-gray-700">IFSC Code</span>
              <span className="mx-2">:</span>
              <span className="font-semibold">{bill.bankDetails.ifscCode}</span>
            </div>
          </div>

          {/* Tax Breakdown Table */}
          <div>
            <table className="w-full text-[9px] border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-800 px-1 py-1" rowSpan={2}>GST<br/>(%)</th>
                  <th className="border border-gray-800 px-1 py-1" rowSpan={2}>Taxable<br/>Value</th>
                  <th className="border border-gray-800 px-1 py-0.5" colSpan={2}>Central Tax</th>
                  <th className="border border-gray-800 px-1 py-0.5" colSpan={2}>State Tax</th>
                  <th className="border border-gray-800 px-1 py-0.5" colSpan={2}>Integrated Tax</th>
                </tr>
                <tr className="bg-gray-200">
                  <th className="border border-gray-800 px-1 py-0.5">Rate</th>
                  <th className="border border-gray-800 px-1 py-0.5">Amount</th>
                  <th className="border border-gray-800 px-1 py-0.5">Rate</th>
                  <th className="border border-gray-800 px-1 py-0.5">Amount</th>
                  <th className="border border-gray-800 px-1 py-0.5">Rate</th>
                  <th className="border border-gray-800 px-1 py-0.5">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-800 p-1 text-center">5%</td>
                  <td className="border border-gray-800 p-1 text-right">{formatCurrency(bill.subtotal)}</td>
                  <td className="border border-gray-800 p-1 text-center">2.50%</td>
                  <td className="border border-gray-800 p-1 text-right">{formatCurrency(bill.taxBreakdown.cgst)}</td>
                  <td className="border border-gray-800 p-1 text-center">2.50%</td>
                  <td className="border border-gray-800 p-1 text-right">{formatCurrency(bill.taxBreakdown.sgst)}</td>
                  <td className="border border-gray-800 p-1 text-center">0.00%</td>
                  <td className="border border-gray-800 p-1 text-right">0.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Terms & Conditions */}
          <div className="border-t border-gray-800 p-3">
            <p className="text-[10px] font-semibold mb-2">Terms & Conditions :</p>
            <ol className="text-[9px] space-y-1 pl-4 list-decimal">
              {bill.termsAndConditions.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ol>
          </div>

          {/* E & O.E */}
          <div className="border-t border-gray-800 px-3 py-2">
            <p className="text-[9px]">E. & O.E.</p>
          </div>
        </div>

        {/* Right: Remarks & Summary */}
        <div>
          <div className="border-b border-gray-800 bg-gray-100 px-3 py-1 text-[10px] font-semibold">
            Remarks :
          </div>

          <div className="border-b border-gray-800 px-3 py-2 text-[10px]">
            <div className="flex justify-between">
              <span>Gross Amt</span>
              <span className="font-semibold">{formatCurrency(bill.subtotal)}</span>
            </div>
          </div>

          <div className="border-b border-gray-800 px-3 py-2 text-[10px]">
            <div className="flex justify-between">
              <span>CGST</span>
              <span className="font-semibold">{formatCurrency(bill.taxBreakdown.cgst)}</span>
            </div>
          </div>

          <div className="border-b border-gray-800 px-3 py-2 text-[10px]">
            <div className="flex justify-between">
              <span>SGST</span>
              <span className="font-semibold">{formatCurrency(bill.taxBreakdown.sgst)}</span>
            </div>
          </div>

          <div className="border-b border-gray-800 px-3 py-2 text-[10px]">
            <div className="flex justify-between">
              <span>IGST</span>
              <span className="font-semibold">{formatCurrency(bill.taxBreakdown.igst)}</span>
            </div>
          </div>

          <div className="border-b border-gray-800 px-3 py-2 text-[10px]">
            <div className="flex justify-between">
              <span>Add Charges</span>
              <span className="font-semibold">{formatCurrency(bill.additionalCharges)}</span>
            </div>
          </div>

          <div className="bg-gray-100 border-b border-gray-800 px-3 py-2 text-[11px]">
            <div className="flex justify-between font-bold">
              <span>Total Amt</span>
              <span>{formatCurrency(bill.totalAmount)}</span>
            </div>
          </div>

          <div className="border-b border-gray-800 px-3 py-2 text-[9px]">
            <p className="font-semibold">GST Payable on Reverse Charge : N.A</p>
          </div>

          <div className="border-b border-gray-800 px-3 py-3">
            <p className="text-[9px] font-semibold mb-1">Amount In Word</p>
            <p className="text-[9px] leading-tight">{bill.amountInWords}</p>
          </div>

          <div className="px-3 py-4 text-right" style={{ minHeight: '100px' }}>
            <p className="text-[10px] font-semibold">For, SUNNY TAILOR</p>
            <div className="mt-12">
              <p className="text-[9px]">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 px-3 py-2 flex justify-between items-center text-[8px] text-gray-600">
        <span>E. & O.E.</span>
        <span className="text-center flex-1">Generated By Transport247</span>
        <span>Credit Sale (Page 1 of 1)</span>
      </div>
    </div>
  );
}