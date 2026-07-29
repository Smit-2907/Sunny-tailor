import { useState, useEffect, useMemo } from "react";
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Plus,
  Search,
  Filter,
  Download,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Edit,
  Trash2,
  BarChart3,
  Percent,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  Customer,
  Invoice,
  Payment,
  calculateAgingBuckets,
  getInvoiceStatus,
  calculateOverdueDays,
} from "@/app/types/accounts-receivable";
import {
  fetchCustomers,
  fetchInvoices,
  fetchCustomerPayments,
  saveCustomer,
  saveInvoice,
  saveCustomerPayment,
} from "@/app/api/supabase-api";
import { toast } from "sonner";

export function AccountsReceivable() {
  const [activeTab, setActiveTab] = useState("overview");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [customersData, invoicesData, paymentsData] = await Promise.all([
        fetchCustomers(),
        fetchInvoices(),
        fetchCustomerPayments(),
      ]);

      setCustomers(customersData);
      setInvoices(invoicesData);
      setPayments(paymentsData);
    } catch (err: any) {
      console.error("[AR] Failed to load data:", err);
      toast.error("Failed to load accounts receivable data");
    } finally {
      setLoading(false);
    }
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalReceivable = invoices.reduce((sum, inv) => sum + inv.balanceAmount, 0);
    const overdueAmount = invoices
      .filter((inv) => {
        const status = getInvoiceStatus(inv);
        return status === "overdue";
      })
      .reduce((sum, inv) => sum + inv.balanceAmount, 0);

    const currentAmount = totalReceivable - overdueAmount;
    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalCollected = payments.reduce((sum, pay) => sum + pay.amount, 0);

    const overdueCount = invoices.filter((inv) => getInvoiceStatus(inv) === "overdue").length;
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter((c) => c.currentBalance > 0).length;

    return {
      totalReceivable,
      overdueAmount,
      currentAmount,
      totalInvoiced,
      totalCollected,
      overdueCount,
      totalCustomers,
      activeCustomers,
      collectionRate: totalInvoiced > 0 ? (totalCollected / totalInvoiced) * 100 : 0,
    };
  }, [invoices, payments, customers]);

  // Aging analysis
  const agingBuckets = useMemo(() => {
    return calculateAgingBuckets(invoices);
  }, [invoices]);

  // Top customers by balance
  const topCustomers = useMemo(() => {
    return [...customers]
      .sort((a, b) => b.currentBalance - a.currentBalance)
      .slice(0, 10);
  }, [customers]);

  // Overdue invoices
  const overdueInvoices = useMemo(() => {
    return invoices
      .filter((inv) => getInvoiceStatus(inv) === "overdue")
      .sort((a, b) => calculateOverdueDays(b.dueDate) - calculateOverdueDays(a.dueDate));
  }, [invoices]);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Accounts Receivable</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage customer invoices, payments, and collections
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Receivable</span>
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalReceivable)}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs">
              {metrics.activeCustomers} customers
            </Badge>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Current (0-30 days)</span>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.currentAmount)}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              On Track
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
              {metrics.overdueCount} invoices
            </Badge>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Collection Rate</span>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{metrics.collectionRate.toFixed(1)}%</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500">
              {formatCurrency(metrics.totalCollected)} collected
            </span>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="aging">Aging Analysis</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Aging Analysis Chart */}
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
                      <div className="w-20 text-right text-sm text-gray-600">{bucket.count} invoices</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Top Customers */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Top Customers by Outstanding Balance</h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {topCustomers.slice(0, 5).map((customer, index) => (
                <div key={customer.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-indigo-600">{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{customer.name}</div>
                      <div className="text-xs text-gray-500">{customer.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(customer.currentBalance)}
                    </div>
                    {customer.overdueBalance > 0 && (
                      <div className="text-xs text-red-600">
                        {formatCurrency(customer.overdueBalance)} overdue
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Overdue Invoices */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-600">Urgent: Overdue Invoices</h3>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {overdueInvoices.length} overdue
              </Badge>
            </div>
            <div className="space-y-2">
              {overdueInvoices.slice(0, 5).map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50/50">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                    <div className="text-sm text-gray-600">{invoice.customerName}</div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="font-semibold text-red-600">
                      {formatCurrency(invoice.balanceAmount)}
                    </div>
                    <div className="text-xs text-gray-600">Due: {formatDate(invoice.dueDate)}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                      {calculateOverdueDays(invoice.dueDate)} days
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-2">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <Card className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search invoices..."
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
                      Invoice #
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Customer
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoices.slice(0, 20).map((invoice) => {
                    const status = getInvoiceStatus(invoice);
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {invoice.invoiceNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {invoice.customerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(invoice.invoiceDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(invoice.dueDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                          {formatCurrency(invoice.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <span className={invoice.balanceAmount > 0 ? "text-orange-600 font-semibold" : "text-gray-900"}>
                            {formatCurrency(invoice.balanceAmount)}
                          </span>
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex gap-2 justify-end">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Other tabs can be added similarly */}
        <TabsContent value="customers">
          <Card className="p-12 text-center">
            <Users className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Customer Management</h3>
            <p className="text-gray-600 mb-6">
              View and manage customer details, credit limits, and ledgers
            </p>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="aging">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Detailed Aging Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {agingBuckets.map((bucket) => (
                <Card key={bucket.range} className="p-4 border-2">
                  <div className="text-sm font-medium text-gray-600 mb-2">{bucket.days}</div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(bucket.amount)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{bucket.count} invoices</span>
                    <Badge variant="outline">{bucket.percentage.toFixed(1)}%</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="overdue">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-red-600">Overdue Invoices</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {overdueInvoices.length} invoices requiring immediate attention
                </p>
              </div>
              <Button className="bg-red-600 hover:bg-red-700">
                <Mail className="h-4 w-4 mr-2" />
                Send Bulk Reminders
              </Button>
            </div>

            <div className="space-y-3">
              {overdueInvoices.map((invoice) => (
                <Card key={invoice.id} className="p-4 border-2 border-red-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-lg font-semibold text-gray-900">
                          {invoice.invoiceNumber}
                        </div>
                        <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                          {calculateOverdueDays(invoice.dueDate)} days overdue
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">{invoice.customerName}</div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Invoice Date: {formatDate(invoice.invoiceDate)}</span>
                        <span>Due Date: {formatDate(invoice.dueDate)}</span>
                      </div>
                    </div>
                    <div className="text-right mr-6">
                      <div className="text-2xl font-bold text-red-600">
                        {formatCurrency(invoice.balanceAmount)}
                      </div>
                      <div className="text-sm text-gray-600">
                        of {formatCurrency(invoice.totalAmount)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="bg-green-50 hover:bg-green-100">
                        Record Payment
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
