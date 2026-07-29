import { useState, useEffect, useMemo } from "react";
import {
  Users,
  FileText,
  DollarSign,
  TrendingDown,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  Eye,
  Percent,
  Zap,
  CreditCard,
  BarChart3,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Vendor,
  Bill,
  VendorPayment,
  PaymentSchedule,
  calculatePayableAgingBuckets,
  getBillStatus,
  calculateDaysUntilDue,
  getEarlyPaymentSavings,
} from "@/app/types/accounts-payable";
import {
  fetchVendors,
  fetchVendorBills,
  fetchVendorPayments,
  fetchPaymentSchedules,
} from "@/app/api/supabase-api";
import { toast } from "sonner";

export function AccountsPayable() {
  const [activeTab, setActiveTab] = useState("overview");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<VendorPayment[]>([]);
  const [schedules, setSchedules] = useState<PaymentSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [vendorsData, billsData, paymentsData, schedulesData] = await Promise.all([
        fetchVendors(),
        fetchVendorBills(),
        fetchVendorPayments(),
        fetchPaymentSchedules(),
      ]);

      setVendors(vendorsData);
      setBills(billsData);
      setPayments(paymentsData);
      setSchedules(schedulesData);
    } catch (err: any) {
      console.error("[AP] Failed to load data:", err);
      toast.error("Failed to load accounts payable data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalPayable = bills.reduce((sum, bill) => sum + bill.balanceAmount, 0);
    const overdueAmount = bills
      .filter((bill) => {
        const status = getBillStatus(bill);
        return status === "overdue";
      })
      .reduce((sum, bill) => sum + bill.balanceAmount, 0);

    const currentAmount = totalPayable - overdueAmount;
    const totalBilled = bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    const totalPaid = payments
      .filter((p) => p.status === "completed")
      .reduce((sum, pay) => sum + pay.amount, 0);

    const overdueCount = bills.filter((bill) => getBillStatus(bill) === "overdue").length;
    const urgentCount = bills.filter((bill) => bill.priority === "urgent" && bill.balanceAmount > 0).length;

    // Early payment opportunities
    const earlyPaymentSavings = bills
      .filter((bill) => bill.earlyPaymentDiscount && bill.balanceAmount > 0)
      .reduce((sum, bill) => sum + (getEarlyPaymentSavings(bill) || 0), 0);

    // Scheduled payments (next 30 days)
    const today = new Date();
    const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const scheduledAmount = schedules
      .filter((s) => {
        const schedDate = new Date(s.scheduledDate);
        return s.status === "pending" && schedDate >= today && schedDate <= next30Days;
      })
      .reduce((sum, s) => sum + s.amount, 0);

    return {
      totalPayable,
      overdueAmount,
      currentAmount,
      totalBilled,
      totalPaid,
      overdueCount,
      urgentCount,
      earlyPaymentSavings,
      scheduledAmount,
      totalVendors: vendors.length,
      activeVendors: vendors.filter((v) => v.currentBalance > 0).length,
    };
  }, [bills, payments, vendors, schedules]);

  // Aging analysis
  const agingBuckets = useMemo(() => {
    return calculatePayableAgingBuckets(bills);
  }, [bills]);

  // Payment schedule for next 7 days
  const upcomingPayments = useMemo(() => {
    const today = new Date();
    const next7Days = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return bills
      .filter((bill) => {
        const dueDate = new Date(bill.dueDate);
        return (
          bill.balanceAmount > 0 &&
          dueDate >= today &&
          dueDate <= next7Days
        );
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [bills]);

  // Early payment opportunities
  const earlyPaymentOpportunities = useMemo(() => {
    const today = new Date();
    return bills
      .filter((bill) => {
        if (!bill.earlyPaymentDiscount || bill.balanceAmount <= 0) return false;
        const validUntil = new Date(bill.earlyPaymentDiscount.validUntil);
        return validUntil > today;
      })
      .map((bill) => ({
        bill,
        savings: getEarlyPaymentSavings(bill),
        daysLeft: Math.floor(
          (new Date(bill.earlyPaymentDiscount!.validUntil).getTime() - today.getTime()) /
            (1000 * 60 * 60 * 24)
        ),
      }))
      .sort((a, b) => b.savings - a.savings);
  }, [bills]);

  // Top vendors by balance
  const topVendors = useMemo(() => {
    return [...vendors].sort((a, b) => b.currentBalance - a.currentBalance).slice(0, 10);
  }, [vendors]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getPriorityBadge = (priority: Bill["priority"]) => {
    const config = {
      urgent: { label: "Urgent", className: "bg-red-100 text-red-700 border-red-200" },
      high: { label: "High", className: "bg-orange-100 text-orange-700 border-orange-200" },
      medium: { label: "Medium", className: "bg-yellow-100 text-yellow-700 border-yellow-200" },
      low: { label: "Low", className: "bg-gray-100 text-gray-700 border-gray-200" },
    };
    return config[priority];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Accounts Payable</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage vendor bills, payments, and cash flow
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Cash Flow Forecast
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Record Bill
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Payable</span>
            <DollarSign className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalPayable)}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {metrics.activeVendors} vendors
            </Badge>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Scheduled (Next 30d)</span>
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.scheduledAmount)}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              {upcomingPayments.length} due soon
            </Badge>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Overdue Amount</span>
            <AlertCircle className="h-5 w-5 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(metrics.overdueAmount)}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
              {metrics.overdueCount} bills
            </Badge>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Early Payment Savings</span>
            <Percent className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(metrics.earlyPaymentSavings)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              {earlyPaymentOpportunities.length} opportunities
            </Badge>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bills">Bills</TabsTrigger>
          <TabsTrigger value="schedule">Payment Schedule</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="early-payment">Early Payment Discounts</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Aging Analysis */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Aging Analysis</h3>
            <div className="space-y-3">
              {agingBuckets.map((bucket) => (
                <div key={bucket.range} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium text-gray-700">{bucket.days}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${
                            bucket.range === "0-30"
                              ? "bg-green-500"
                              : bucket.range === "31-60"
                              ? "bg-yellow-500"
                              : bucket.range === "61-90"
                              ? "bg-orange-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${bucket.percentage}%` }}
                        />
                      </div>
                      <div className="w-32 text-right">
                        <div className="text-sm font-semibold">{formatCurrency(bucket.amount)}</div>
                        <div className="text-xs text-gray-500">{bucket.percentage.toFixed(1)}%</div>
                      </div>
                      <div className="w-20 text-right text-sm text-gray-600">{bucket.count} bills</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Payments (Next 7 Days) */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Upcoming Payments (Next 7 Days)</h3>
              <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                {upcomingPayments.length} bills due
              </Badge>
            </div>
            <div className="space-y-3">
              {upcomingPayments.slice(0, 5).map((bill) => {
                const daysUntilDue = calculateDaysUntilDue(bill.dueDate);
                const priorityConfig = getPriorityBadge(bill.priority);
                return (
                  <div key={bill.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="font-medium text-gray-900">{bill.billNumber}</div>
                        <Badge variant="outline" className={priorityConfig.className}>
                          {priorityConfig.label}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">{bill.vendorName}</div>
                    </div>
                    <div className="text-right mr-4">
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(bill.balanceAmount)}
                      </div>
                      <div className="text-xs text-gray-600">Due: {formatDate(bill.dueDate)}</div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="outline"
                        className={
                          daysUntilDue <= 2
                            ? "bg-red-100 text-red-700 border-red-200"
                            : daysUntilDue <= 5
                            ? "bg-orange-100 text-orange-700 border-orange-200"
                            : "bg-blue-100 text-blue-700 border-blue-200"
                        }
                      >
                        {daysUntilDue === 0 ? "Today" : daysUntilDue === 1 ? "Tomorrow" : `${daysUntilDue} days`}
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm" className="ml-2 bg-green-50 hover:bg-green-100">
                      Schedule Payment
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Early Payment Opportunities */}
          {earlyPaymentOpportunities.length > 0 && (
            <Card className="p-6 border-2 border-green-200 bg-green-50/30">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Early Payment Discounts Available</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Save up to {formatCurrency(metrics.earlyPaymentSavings)} by paying early
                  </p>
                </div>
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-3">
                {earlyPaymentOpportunities.slice(0, 3).map(({ bill, savings, daysLeft }) => (
                  <div key={bill.id} className="flex items-center justify-between p-4 rounded-lg bg-white border border-green-200">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{bill.billNumber}</div>
                      <div className="text-sm text-gray-600">{bill.vendorName}</div>
                    </div>
                    <div className="text-right mr-6">
                      <div className="text-sm text-gray-600">Bill Amount</div>
                      <div className="font-semibold text-gray-900">
                        {formatCurrency(bill.balanceAmount)}
                      </div>
                    </div>
                    <div className="text-right mr-6">
                      <div className="text-sm text-green-600">Save</div>
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(savings)}
                      </div>
                    </div>
                    <div className="text-right mr-6">
                      <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">
                        {daysLeft} days left
                      </Badge>
                    </div>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Pay Now
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Top Vendors by Balance */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Top Vendors by Outstanding Balance</h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {topVendors.slice(0, 5).map((vendor, index) => (
                <div key={vendor.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-purple-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{vendor.name}</div>
                      <div className="text-xs text-gray-500">{vendor.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(vendor.currentBalance)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Total paid: {formatCurrency(vendor.totalPaid)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Bills Tab */}
        <TabsContent value="bills" className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Bill #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Vendor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bills.slice(0, 20).map((bill) => {
                    const status = getBillStatus(bill);
                    const priorityConfig = getPriorityBadge(bill.priority);
                    return (
                      <tr key={bill.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {bill.billNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {bill.vendorName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {bill.category.replace("-", " ").toUpperCase()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(bill.billDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(bill.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(bill.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <span className={bill.balanceAmount > 0 ? "text-orange-600 font-semibold" : "text-gray-900"}>
                            {formatCurrency(bill.balanceAmount)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant="outline" className={priorityConfig.className}>
                            {priorityConfig.label}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={
                              status === "paid"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : status === "overdue"
                                ? "bg-red-50 text-red-700 border-red-200"
                                : status === "partial"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-gray-50 text-gray-700 border-gray-200"
                            }
                          >
                            {status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Other tabs placeholders */}
        <TabsContent value="schedule">
          <Card className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Payment Schedule</h3>
            <p className="text-gray-600 mb-6">
              Schedule and manage upcoming vendor payments
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Schedule Payment
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
          <Card className="p-12 text-center">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Vendor Management</h3>
            <p className="text-gray-600 mb-6">
              Manage vendor details, payment terms, and ledgers
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="early-payment">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-green-700">Early Payment Discount Opportunities</h3>
            <p className="text-sm text-gray-600 mb-6">
              Take advantage of vendor discounts by paying invoices early
            </p>

            {earlyPaymentOpportunities.length === 0 ? (
              <div className="text-center py-12">
                <Percent className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">No early payment discounts available at the moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {earlyPaymentOpportunities.map(({ bill, savings, daysLeft }) => (
                  <Card key={bill.id} className="p-6 border-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-lg font-semibold text-gray-900">
                            {bill.billNumber}
                          </div>
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            {bill.earlyPaymentDiscount!.percentage}% Discount
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600">{bill.vendorName}</div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span>Bill Date: {formatDate(bill.billDate)}</span>
                          <span>Due Date: {formatDate(bill.dueDate)}</span>
                          <span className="text-orange-600 font-medium">
                            Discount valid until: {formatDate(bill.earlyPaymentDiscount!.validUntil)}
                          </span>
                        </div>
                      </div>
                      <div className="text-right mr-8">
                        <div className="text-sm text-gray-600 mb-1">Bill Amount</div>
                        <div className="text-xl font-bold text-gray-900">
                          {formatCurrency(bill.balanceAmount)}
                        </div>
                      </div>
                      <div className="text-right mr-8">
                        <div className="text-sm text-green-600 mb-1">You Save</div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(savings)}
                        </div>
                      </div>
                      <div className="text-right mr-8">
                        <div className="text-sm text-gray-600 mb-1">Pay Amount</div>
                        <div className="text-xl font-semibold text-gray-900">
                          {formatCurrency(bill.balanceAmount - savings)}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge
                          variant="outline"
                          className={
                            daysLeft <= 3
                              ? "bg-red-100 text-red-700 border-red-200"
                              : daysLeft <= 7
                              ? "bg-orange-100 text-orange-700 border-orange-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                          }
                        >
                          {daysLeft} {daysLeft === 1 ? "day" : "days"} left
                        </Badge>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Zap className="h-4 w-4 mr-2" />
                          Pay Now & Save
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
