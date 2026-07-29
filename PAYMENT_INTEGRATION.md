# Payment Link Integration Guide

## Overview

The billing system now supports **secure payment links** that can be shared with customers. Customers can pay invoices online using Razorpay payment gateway integration.

---

## Features

✅ **Generate Payment Links** from the Bills list
✅ **Flexible Payment Options**: Full, Half, or Custom amount
✅ **Razorpay Integration**: Accept credit/debit cards, UPI, net banking
✅ **Auto-sync to Accounting**: Payment status automatically updates in accounting module
✅ **Secure & Professional**: Customer-facing payment page with company branding

---

## How to Use

### 1. Generate Payment Link (Billing Module)

1. Go to **Billing & Invoices** page
2. Find the invoice you want to collect payment for
3. Click the **Share** icon (green button) in the Actions column
4. Choose payment type:
   - **Full Payment**: Customer pays entire invoice amount
   - **Half Payment**: Customer pays 50% of invoice amount
   - **Custom Amount**: You specify the exact amount
5. Click **Generate Link**
6. Copy the payment link and share it with your customer via:
   - Email
   - WhatsApp
   - SMS
   - Any messaging platform

### 2. Customer Payment Process

1. Customer clicks on the payment link
2. They see a professional payment page with:
   - Invoice details
   - Customer name
   - Amount to pay
   - Security badges
3. Customer clicks "Pay Now"
4. Razorpay payment gateway opens (supports all payment methods):
   - Credit/Debit Cards (Visa, Mastercard, RuPay, Amex)
   - UPI (Google Pay, PhonePe, Paytm, etc.)
   - Net Banking
   - Wallets
5. Customer completes payment
6. Payment confirmation shown immediately

### 3. Automatic Updates

Once payment is successful, the system automatically:
- ✅ Updates invoice status in **Billing** module (pending → partial/paid)
- ✅ Updates payment received amount
- ✅ Syncs to **Accounting** module
- ✅ Updates bills & expenses data
- ✅ Reflects in financial reports and dashboard

---

## Razorpay Setup (Required)

### Step 1: Create Razorpay Account

1. Go to [https://razorpay.com](https://razorpay.com)
2. Click **Sign Up** and create your account
3. Complete KYC verification (required for live payments)

### Step 2: Get API Keys

1. Login to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Generate API keys
   - **Test Mode**: For testing (use test cards)
   - **Live Mode**: For real payments (after KYC approval)

### Step 3: Configure in Code

Open `/src/app/components/payment/payment-page.tsx` and replace:

```typescript
const RAZORPAY_KEY_ID = "rzp_test_xxxxxxxxxxxxxxxx";
```

With your actual Razorpay Key ID:

```typescript
// For Test Mode
const RAZORPAY_KEY_ID = "rzp_test_YOUR_KEY_ID_HERE";

// For Live Mode (after KYC approval)
const RAZORPAY_KEY_ID = "rzp_live_YOUR_KEY_ID_HERE";
```

### Step 4: Test Payment

**Test Mode Credentials:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- UPI: `success@razorpay`

---

## Payment Flow Diagram

```
┌─────────────────────────┐
│  Billing Module         │
│  - Create Invoice       │
│  - Click "Share" icon   │
└───────────┬─────────────┘
            │
            │ Generate Payment Link
            ▼
┌─────────────────────────┐
│  Payment Link Dialog    │
│  - Choose amount type   │
│  - Generate & Copy link │
└───────────┬─────────────┘
            │
            │ Share Link (WhatsApp/Email)
            ▼
┌─────────────────────────┐
│  Customer               │
│  - Clicks payment link  │
│  - Sees payment page    │
└───────────┬─────────────┘
            │
            │ Click "Pay Now"
            ▼
┌─────────────────────────┐
│  Razorpay Gateway       │
│  - Choose payment mode  │
│  - Enter details        │
│  - Complete payment     │
└───────────┬─────────────┘
            │
            │ Payment Success
            ▼
┌─────────────────────────┐
│  Auto Update System     │
│  ✓ Update invoice       │
│  ✓ Sync to accounting   │
│  ✓ Update dashboards    │
└─────────────────────────┘
```

---

## Payment Link Example

Generated link format:
```
https://your-domain.com/payment/pay-bill123-1234567890
```

This link can be accessed by anyone (customer doesn't need to login).

---

## Payment Page Features

### For Customers:
- ✅ Professional branded payment page
- ✅ Clear invoice and amount details
- ✅ Multiple payment options (Card, UPI, NetBanking)
- ✅ Secure encryption (SSL)
- ✅ Instant payment confirmation
- ✅ Mobile-friendly responsive design

### For Business:
- ✅ No manual payment tracking
- ✅ Automatic reconciliation
- ✅ Real-time payment updates
- ✅ Reduced collection time
- ✅ Professional customer experience
- ✅ Payment analytics and reports

---

## Security Features

1. **PCI DSS Compliant**: Razorpay is PCI-DSS Level 1 certified
2. **Encrypted Transactions**: All data encrypted with 256-bit SSL
3. **Secure Payment Links**: Unique, non-guessable URLs
4. **Fraud Detection**: Razorpay's built-in fraud prevention
5. **Two-Factor Authentication**: For card payments

---

## Pricing (Razorpay)

### Transaction Fees:
- **Domestic Cards**: 2% + GST
- **International Cards**: 3% + GST
- **UPI**: 0% (free for first ₹1 crore/month, then 0.7%)
- **Net Banking**: 2% + GST
- **Wallets**: 2% + GST

*Note: Check [Razorpay Pricing](https://razorpay.com/pricing/) for latest rates*

---

## Troubleshooting

### Payment Link Not Working?
- Verify Razorpay API key is correctly configured
- Check internet connection
- Ensure payment link is not expired (links valid for 7 days)

### Payment Successful but Not Reflecting?
- Check browser console for errors
- Verify localStorage data: `erp_bills`, `erp_bills_expenses`
- Refresh accounting dashboard

### Razorpay Gateway Not Opening?
- Check if Razorpay script loaded (check browser console)
- Verify API key is correct
- Try different browser
- Clear browser cache

---

## Production Checklist

Before going live:

- [ ] Complete Razorpay KYC verification
- [ ] Replace test API key with live API key
- [ ] Test payment flow end-to-end
- [ ] Configure webhook URL (optional, for advanced integration)
- [ ] Set up payment notifications/emails
- [ ] Enable required payment methods in Razorpay dashboard
- [ ] Test on mobile devices
- [ ] Add company logo to payment page

---

## Support

### Razorpay Support:
- Email: support@razorpay.com
- Phone: +91 76529 87556
- Docs: https://razorpay.com/docs/

### Common Issues:
- Payment failed: Customer should retry or use different payment method
- Duplicate payment: Contact Razorpay support for refund
- Gateway timeout: Check Razorpay status page

---

## Future Enhancements

Possible improvements:
- 📧 Email payment reminders
- 📱 WhatsApp payment notifications
- 🔔 Payment received notifications
- 📊 Payment analytics dashboard
- 🧾 Auto-generate payment receipts
- 💳 Save customer payment methods
- 📅 Scheduled payment links
- 🔁 Recurring payment plans

---

## Data Flow

### Payment Link Storage:
```typescript
localStorage.setItem("erp_payment_links", JSON.stringify([
  {
    paymentId: "pay-bill123-1234567890",
    billId: "bill123",
    billNumber: "INV-2024-001",
    customerName: "ABC Garments Ltd",
    amount: 50000,
    fullAmount: 100000,
    paymentType: "half",
    createdAt: "2024-01-15T10:30:00Z",
    status: "completed",
    razorpayPaymentId: "pay_xxxxxxxxxxxxx"
  }
]));
```

### Invoice Update:
```typescript
// Bill status changes:
"pending" → "partial" (if partial payment)
"pending" → "paid" (if full payment)

// Accounting sync happens automatically
```

---

## Summary

This integration provides a **complete payment collection solution** for your garment ERP:

1. **Easy to Use**: Generate payment links with 2 clicks
2. **Professional**: Customer sees branded payment page
3. **Secure**: Industry-standard encryption and security
4. **Automated**: No manual work, everything syncs automatically
5. **Flexible**: Support for partial and custom payments
6. **Comprehensive**: Works with all major payment methods in India

**Result**: Faster payment collection, better cash flow, happier customers! 🎉
