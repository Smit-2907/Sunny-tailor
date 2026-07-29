// Utility functions for billing

export function numberToWords(num: number): string {
  if (num === 0) return "Zero Rupees Only";

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

  function convertLessThanThousand(n: number): string {
    if (n === 0) return "";
    
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convertLessThanThousand(n % 100) : "");
  }

  const crore = Math.floor(num / 10000000);
  const lakh = Math.floor((num % 10000000) / 100000);
  const thousand = Math.floor((num % 100000) / 1000);
  const remainder = Math.floor(num % 1000);
  const paise = Math.round((num - Math.floor(num)) * 100);

  let result = "";

  if (crore > 0) {
    result += convertLessThanThousand(crore) + " Crore ";
  }
  if (lakh > 0) {
    result += convertLessThanThousand(lakh) + " Lakh ";
  }
  if (thousand > 0) {
    result += convertLessThanThousand(thousand) + " Thousand ";
  }
  if (remainder > 0) {
    result += convertLessThanThousand(remainder) + " ";
  }

  result += "Rupees";

  if (paise > 0) {
    result += " and " + convertLessThanThousand(paise) + " Paise";
  }

  return result.trim() + " Only";
}

export function calculateItemTotal(item: { qty: number; rate: number; gstPercent: number }): number {
  return item.qty * item.rate;
}

export function calculateItemTax(item: { qty: number; rate: number; gstPercent: number }): number {
  const taxableAmount = calculateItemTotal(item);
  return (taxableAmount * item.gstPercent) / 100;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function generateBillNumber(prefix: string = "INV"): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000);
  return `${prefix}-${year}${month}-${String(random).padStart(3, '0')}`;
}

export function isInterStateBill(billerGstin: string, buyerGstin: string): boolean {
  if (!billerGstin || !buyerGstin) return false;
  
  const billerStateCode = billerGstin.substring(0, 2);
  const buyerStateCode = buyerGstin.substring(0, 2);
  
  return billerStateCode !== buyerStateCode;
}

export function calculateTaxBreakdown(
  subtotal: number,
  items: Array<{ gstPercent: number; qty: number; rate: number; gstType?: "cgst-sgst" | "igst" }>,
  billerGstin: string,
  buyerGstin: string
): { cgst: number; sgst: number; igst: number } {
  let totalCGST = 0;
  let totalSGST = 0;
  let totalIGST = 0;

  items.forEach(item => {
    const taxableAmount = item.qty * item.rate;
    const tax = (taxableAmount * item.gstPercent) / 100;

    // Use gstType from item, fallback to auto-detection if not set
    const gstType = item.gstType || (isInterStateBill(billerGstin, buyerGstin) ? "igst" : "cgst-sgst");

    if (gstType === "igst") {
      totalIGST += tax;
    } else {
      // For CGST+SGST, split equally
      totalCGST += tax / 2;
      totalSGST += tax / 2;
    }
  });

  return {
    cgst: totalCGST,
    sgst: totalSGST,
    igst: totalIGST
  };
}
