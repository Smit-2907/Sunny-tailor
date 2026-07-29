import { useState, useEffect } from "react";
import * as api from "@/app/api/supabase-api";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Building2,
  User,
  CreditCard,
  Shield,
  AlertCircle,
} from "lucide-react";
import { formatCurrency } from "@/app/components/billing/bill-utils";
import { toast } from "sonner";

interface PaymentData {
  paymentId: string;
  billId: string;
  billNumber: string;
  customerName: string;
  amount: number;
  fullAmount: number;
  paymentType: "full" | "half" | "custom";
  createdAt: string;
  status: "pending" | "completed" | "failed";
}

// Razorpay configuration - Replace with your actual keys
const RAZORPAY_KEY_ID = "rzp_test_xxxxxxxxxxxxxxxx"; // Replace with your Razorpay Key ID

export function PaymentPage() {
  // Extract payment ID from URL
  const paymentId = window.location.pathname.split('/payment/')[1];
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "failed">("idle");

  useEffect(() => {
    const loadPaymentData = async () => {
      try {
        const links = await api.fetchPaymentLinks();
        const payment = links.find((p: PaymentData) => p.paymentId === paymentId);

        if (payment) {
          if (payment.status === "completed") setPaymentStatus("success");
          setPaymentData(payment);
        } else {
          toast.error("Payment link not found or invalid");
        }
      } catch (e) {
        console.error("Failed to load payment data:", e);
        toast.error("Failed to load payment details");
      } finally {
        setLoading(false);
      }
    };

    loadPaymentData();
  }, [paymentId]);

  const handlePayment = async () => {
    if (!paymentData) return;

    setProcessing(true);

    try {
      // Load Razorpay script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        // Initialize Razorpay
        const options = {
          key: RAZORPAY_KEY_ID,
          amount: paymentData.amount * 100, // Convert to paise
          currency: "INR",
          name: "Garment ERP",
          description: `Payment for Invoice ${paymentData.billNumber}`,
          image: "/logo.png", // Add your company logo
          handler: function (response: any) {
            // Payment successful
            handlePaymentSuccess(response);
          },
          prefill: {
            name: paymentData.customerName,
          },
          theme: {
            color: "#6366f1",
          },
          modal: {
            ondismiss: function () {
              setProcessing(false);
              toast.info("Payment cancelled");
            },
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      };

      script.onerror = () => {
        setProcessing(false);
        toast.error("Failed to load payment gateway. Please try again.");
      };
    } catch (error) {
      console.error("Payment error:", error);
      setProcessing(false);
      toast.error("Payment failed. Please try again.");
    }
  };

  const handlePaymentSuccess = async (razorpayResponse: any) => {
    try {
      // Update payment link status
      const links = await api.fetchPaymentLinks();
      const updatedLink = links.find((p: PaymentData) => p.paymentId === paymentId);
      if (updatedLink) {
        const newLink = { ...updatedLink, status: "completed", razorpayPaymentId: razorpayResponse.razorpay_payment_id };
        await api.savePaymentLink(newLink);
      }

      // Update bill status
      const bills = JSON.parse(localStorage.getItem("erp_bills") || "[]");
      const updatedBills = bills.map((bill: any) => {
        if (bill.id === paymentData?.billId) {
          const paidAmount = bill.paidAmount || 0;
          const newPaidAmount = paidAmount + (paymentData?.amount || 0);
          return { ...bill, paidAmount: newPaidAmount, status: newPaidAmount >= bill.totalAmount ? "paid" : "partial" };
        }
        return bill;
      });
      localStorage.setItem("erp_bills", JSON.stringify(updatedBills));
      // sync billing bill to supabase
      const changedBill = updatedBills.find((b: any) => b.id === paymentData?.billId);
      if (changedBill) api.saveBill(changedBill).catch(() => {});

      // Sync to accounting (bills_expenses)
      const billsExpenses = await api.fetchBillsExpenses();
      const updatedBillsExpenses = billsExpenses.map((item: any) => {
        if (item.billNumber === paymentData?.billNumber && item.syncedFromBilling) {
          const paidAmount = item.paidAmount || 0;
          const newPaidAmount = paidAmount + (paymentData?.amount || 0);
          const balanceAmount = item.totalAmount - newPaidAmount;
          return { ...item, paidAmount: newPaidAmount, balanceAmount, status: newPaidAmount >= item.totalAmount ? "paid" : "partial" };
        }
        return item;
      });
      localStorage.setItem("erp_bills_expenses", JSON.stringify(updatedBillsExpenses));
      api.bulkSaveBillsExpenses(updatedBillsExpenses).catch(() => {});

      setPaymentStatus("success");
      setProcessing(false);
      toast.success("Payment successful!");
    } catch (error) {
      console.error("Failed to update payment status:", error);
      setPaymentStatus("failed");
      setProcessing(false);
      toast.error("Payment successful but failed to update records. Please contact support.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-muted-foreground">Loading payment details...</p>
        </Card>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <XCircle className="h-16 w-16 mx-auto mb-4 text-red-600" />
          <h1 className="text-2xl font-bold mb-2">Payment Link Invalid</h1>
          <p className="text-muted-foreground mb-6">
            This payment link is invalid or has expired.
          </p>
        </Card>
      </div>
    );
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2 text-green-900">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Your payment has been processed successfully.
            </p>
          </div>

          <div className="space-y-3 mb-6 text-left">
            <div className="flex justify-between p-3 bg-white rounded-lg border">
              <span className="text-sm text-muted-foreground">Invoice</span>
              <span className="font-semibold">{paymentData.billNumber}</span>
            </div>
            <div className="flex justify-between p-3 bg-white rounded-lg border">
              <span className="text-sm text-muted-foreground">Amount Paid</span>
              <span className="font-semibold text-green-600">
                ₹{formatCurrency(paymentData.amount)}
              </span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your registered email address.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Company Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-900">Garment ERP</h1>
          </div>
          <p className="text-muted-foreground">Secure Payment Portal</p>
        </div>

        <Card className="p-6 md:p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Invoice Payment</h2>
              <Badge variant="outline" className="text-sm">
                {paymentData.status === "pending" ? "Pending" : "Completed"}
              </Badge>
            </div>
            <div className="h-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full mb-6" />
          </div>

          {/* Payment Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
              <User className="h-5 w-5 text-indigo-600" />
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Customer Name</p>
                <p className="font-semibold">{paymentData.customerName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Invoice Number</p>
                <p className="font-semibold">{paymentData.billNumber}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Payment Type</p>
                <p className="font-semibold capitalize">{paymentData.paymentType} Payment</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">Total Invoice Amount</p>
                <p className="text-lg font-semibold">₹{formatCurrency(paymentData.fullAmount)}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-green-900">Amount to Pay</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{formatCurrency(paymentData.amount)}
                </p>
              </div>
            </div>

            {paymentData.paymentType !== "full" && (
              <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                <p className="text-sm text-amber-900">
                  This is a partial payment. Remaining balance: ₹
                  {formatCurrency(paymentData.fullAmount - paymentData.amount)}
                </p>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
            <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Secure Payment</p>
              <p className="text-xs text-blue-700">
                Your payment is secured with industry-standard encryption. We accept all major
                credit/debit cards, UPI, and net banking.
              </p>
            </div>
          </div>

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={processing || paymentData.status === "completed"}
            className="w-full h-12 text-base bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
          >
            {processing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : paymentData.status === "completed" ? (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Payment Completed
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Pay ₹{formatCurrency(paymentData.amount)}
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-4">
            By proceeding, you agree to our terms and conditions
          </p>
        </Card>

        {/* Powered by Razorpay */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            Powered by <span className="font-semibold">Razorpay</span>
          </p>
        </div>
      </div>
    </div>
  );
}
