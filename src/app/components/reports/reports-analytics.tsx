import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  FileText,
  Download,
  Printer,
  Mail,
  RefreshCw,
  Filter,
  Building2,
  Factory,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export function ReportsAnalytics() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCompany, setSelectedCompany] = useState("All Companies");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    return date.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [showFilters, setShowFilters] = useState(true);

  // Load real data from localStorage
  const [bills, setBills] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    try {
      const billsExpensesData = JSON.parse(localStorage.getItem("erp_bills_expenses") || "[]");
      const billsData = billsExpensesData.filter((item: any) => item.type === "bill");
      const expensesData = billsExpensesData.filter((item: any) => item.type === "expense");

      setBills(billsData);
      setExpenses(expensesData);
      setAllTransactions(billsExpensesData);
    } catch (e) {
      console.error("Failed to load data:", e);
    }
  };

  // Extract unique companies and categories
  const companies = ["All Companies", ...Array.from(new Set(allTransactions.map(t => t.vendor || t.customer).filter(Boolean)))];
  const categories = ["All Categories", ...Array.from(new Set(expenses.map(e => e.category).filter(Boolean)))];

  // Calculate date range (last 6 months)
  const getMonthLabel = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  const getLast6Months = () => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: getMonthLabel(date),
        year: date.getFullYear(),
        monthNum: date.getMonth(),
      });
    }
    return months;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleExportExcel = () => {
    alert("Exporting to Excel...");
  };

  const handleExportPDF = () => {
    alert("Exporting to PDF...");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEmailReport = () => {
    alert("Sending report via email...");
  };

  const handleResetFilters = () => {
    setSelectedCompany("All Companies");
    setSelectedCategory("All Categories");
    const date = new Date();
    date.setMonth(date.getMonth() - 6);
    setStartDate(date.toISOString().split("T")[0]);
    setEndDate(new Date().toISOString().split("T")[0]);
  };

  // Filter data based on selections
  const filteredTransactions = allTransactions.filter((item) => {
    const companyMatch =
      selectedCompany === "All Companies" ||
      item.vendor === selectedCompany ||
      item.customer === selectedCompany;
    const categoryMatch =
      selectedCategory === "All Categories" ||
      item.category === selectedCategory;
    const dateMatch =
      new Date(item.date || item.invoiceDate || item.createdAt) >= new Date(startDate) &&
      new Date(item.date || item.invoiceDate || item.createdAt) <= new Date(endDate);
    return companyMatch && categoryMatch && dateMatch;
  });

  const filteredBills = filteredTransactions.filter(t => t.type === "bill");
  const filteredExpenses = filteredTransactions.filter(t => t.type === "expense");

  // Calculate summary statistics
  const totalTransactions = filteredTransactions.length;
  const totalBills = filteredBills.length;
  const totalExpenses = filteredExpenses.length;

  const totalBillsAmount = filteredBills.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  const totalExpensesAmount = filteredExpenses.reduce((sum, item) => sum + (item.totalAmount || 0), 0);
  const totalPaidAmount = filteredTransactions.reduce((sum, item) => sum + (item.paidAmount || 0), 0);
  const totalBalanceAmount = filteredTransactions.reduce((sum, item) => sum + (item.balanceAmount || 0), 0);

  const netRevenue = totalBillsAmount - totalExpensesAmount;
  const collectionRate = totalBillsAmount > 0 ? ((totalPaidAmount / (totalBillsAmount + totalExpensesAmount)) * 100).toFixed(1) : "0";

  // Monthly trend data - calculate from real data
  const monthlyTrendData = getLast6Months().map(({ month, year, monthNum }) => {
    const monthTransactions = allTransactions.filter(t => {
      const date = new Date(t.date || t.invoiceDate || t.createdAt);
      return date.getMonth() === monthNum && date.getFullYear() === year;
    });

    const monthBills = monthTransactions.filter(t => t.type === "bill");
    const monthExpenses = monthTransactions.filter(t => t.type === "expense");

    return {
      month,
      bills: monthBills.length,
      expenses: monthExpenses.length,
      billsAmount: monthBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
      expensesAmount: monthExpenses.reduce((sum, e) => sum + (e.totalAmount || 0), 0),
      revenue: monthBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0) - monthExpenses.reduce((sum, e) => sum + (e.totalAmount || 0), 0),
    };
  });

  // Status distribution
  const statusCounts = {
    paid: filteredTransactions.filter(t => t.status === "paid").length,
    partial: filteredTransactions.filter(t => t.status === "partial").length,
    pending: filteredTransactions.filter(t => t.status === "pending").length,
    overdue: filteredTransactions.filter(t => t.status === "overdue").length,
  };

  const orderStatusData = [
    { name: "Paid", value: statusCounts.paid, color: "#10B981" },
    { name: "Partial", value: statusCounts.partial, color: "#3B82F6" },
    { name: "Pending", value: statusCounts.pending, color: "#EAB308" },
    { name: "Overdue", value: statusCounts.overdue, color: "#EF4444" },
  ].filter(item => item.value > 0);

  // Category breakdown for expenses
  const categoryData = Array.from(
    expenses.reduce((acc, exp) => {
      const category = exp.category || "Uncategorized";
      const existing = acc.get(category) || { category, amount: 0, count: 0 };
      existing.amount += exp.totalAmount || 0;
      existing.count += 1;
      acc.set(category, existing);
      return acc;
    }, new Map<string, any>())
  ).map(([_, data]) => data);

  const totalCategoryAmount = categoryData.reduce((sum, c) => sum + c.amount, 0);
  const revenueDepartmentData = categoryData.map(c => ({
    department: c.category,
    amount: c.amount,
    percentage: totalCategoryAmount > 0 ? Math.round((c.amount / totalCategoryAmount) * 100) : 0,
  }));

  // Company performance
  const companyMap = new Map<string, any>();

  filteredBills.forEach(bill => {
    const company = bill.customer || bill.vendor || "Unknown";
    const existing = companyMap.get(company) || { company, bills: 0, revenue: 0, paid: 0 };
    existing.bills += 1;
    existing.revenue += bill.totalAmount || 0;
    existing.paid += bill.paidAmount || 0;
    companyMap.set(company, existing);
  });

  const companyPerformanceData = Array.from(companyMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-indigo-600" />
            <h3 className="font-semibold text-lg">Filters</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide" : "Show"} Filters
          </Button>
        </div>

        {showFilters && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Company Filter */}
              <div className="space-y-2">
                <Label htmlFor="company">Company/Vendor</Label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger id="company">
                    <Building2 className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger id="category">
                    <FileText className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date Filter */}
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              {/* End Date Filter */}
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleResetFilters}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
              <div className="flex-1" />
              <Button variant="outline" onClick={handleEmailReport}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button onClick={handleExportExcel}>
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </>
        )}
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Bills</p>
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">{totalBills}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatCurrency(totalBillsAmount)}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <Package className="h-5 w-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">{totalExpenses}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatCurrency(totalExpensesAmount)}</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Net Revenue</p>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{formatCurrency(netRevenue)}</p>
          <p className="text-xs text-muted-foreground mt-1">Bills - Expenses</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Collection Rate</p>
            <BarChart3 className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-orange-900">{collectionRate}%</p>
          <p className="text-xs text-muted-foreground mt-1">Payment collected</p>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Outstanding</p>
            <DollarSign className="h-5 w-5 text-cyan-600" />
          </div>
          <p className="text-2xl font-bold text-cyan-900">{formatCurrency(totalBalanceAmount)}</p>
          <p className="text-xs text-muted-foreground mt-1">Balance due</p>
        </Card>
      </div>

      {/* Tabs for Different Report Views */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="financial">
              <DollarSign className="h-4 w-4 mr-2" />
              Financial
            </TabsTrigger>
            <TabsTrigger value="company">
              <Building2 className="h-4 w-4 mr-2" />
              Company Analysis
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Transaction Status Distribution */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Payment Status Distribution</h3>
                {orderStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={orderStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {orderStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                    No data available for selected filters
                  </div>
                )}
              </Card>

              {/* Monthly Trend */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Bills vs Expenses Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="bills"
                      stroke="#4F46E5"
                      strokeWidth={2}
                      name="Bills"
                    />
                    <Line
                      type="monotone"
                      dataKey="expenses"
                      stroke="#EF4444"
                      strokeWidth={2}
                      name="Expenses"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            </div>

            {/* Revenue Trend */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Net Revenue Trend (Last 6 Months)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyTrendData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10B981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Bills and Expenses Amount Comparison */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Monthly Amount Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Bar dataKey="billsAmount" fill="#10B981" name="Bills Amount" />
                  <Bar dataKey="expensesAmount" fill="#EF4444" name="Expenses Amount" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </TabsContent>

          {/* Financial Tab */}
          <TabsContent value="financial" className="space-y-6">
            <h3 className="font-semibold text-lg">Financial Analysis</h3>

            {/* Expense by Category */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Expenses by Category</h3>
              {revenueDepartmentData.length > 0 ? (
                <div className="space-y-4">
                  {revenueDepartmentData.map((dept, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Package className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-semibold">{dept.department}</p>
                            <p className="text-sm text-muted-foreground">
                              {dept.percentage}% of total expenses
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-red-700">
                          {formatCurrency(dept.amount)}
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full"
                          style={{ width: `${dept.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                  No expense data available for selected filters
                </div>
              )}
            </Card>

            {/* Category Comparison Chart */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Category Expense Comparison</h3>
              {revenueDepartmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={revenueDepartmentData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis type="number" stroke="#6B7280" />
                    <YAxis dataKey="department" type="category" stroke="#6B7280" width={150} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Bar dataKey="amount" fill="#EF4444" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                  No expense data available
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Company Analysis Tab */}
          <TabsContent value="company" className="space-y-6">
            <h3 className="font-semibold text-lg">Company/Customer Analysis</h3>

            {/* Company Performance Table */}
            {companyPerformanceData.length > 0 ? (
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold">Company Name</th>
                      <th className="text-left p-3 text-xs font-semibold">Total Bills</th>
                      <th className="text-left p-3 text-xs font-semibold">Total Revenue</th>
                      <th className="text-left p-3 text-xs font-semibold">Amount Paid</th>
                      <th className="text-left p-3 text-xs font-semibold">Payment Rate</th>
                      <th className="text-left p-3 text-xs font-semibold">Avg Bill Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyPerformanceData.map((company, index) => {
                      const paymentRate = company.revenue > 0
                        ? ((company.paid / company.revenue) * 100).toFixed(1)
                        : "0";
                      const avgBillValue = company.bills > 0
                        ? company.revenue / company.bills
                        : 0;

                      return (
                        <tr
                          key={company.company}
                          className={`border-t hover:bg-muted/50 transition-colors ${
                            index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                          }`}
                        >
                          <td className="p-3 font-semibold">{company.company}</td>
                          <td className="p-3 text-sm">{company.bills}</td>
                          <td className="p-3 text-sm font-bold text-blue-700">
                            {formatCurrency(company.revenue)}
                          </td>
                          <td className="p-3 text-sm text-green-600 font-semibold">
                            {formatCurrency(company.paid)}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${paymentRate}%` }}
                                />
                              </div>
                              <span className="text-sm font-semibold">{paymentRate}%</span>
                            </div>
                          </td>
                          <td className="p-3 text-sm font-semibold">
                            {formatCurrency(avgBillValue)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <Card className="p-8 text-center text-muted-foreground">
                No company data available for selected filters
              </Card>
            )}

            {/* Company Bills Chart */}
            {companyPerformanceData.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Bills and Payments by Company</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={companyPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="company"
                      stroke="#6B7280"
                      angle={-45}
                      textAnchor="end"
                      height={100}
                    />
                    <YAxis stroke="#6B7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#4F46E5" name="Total Revenue" />
                    <Bar dataKey="paid" fill="#10B981" name="Amount Paid" />
                  </BarChart>
                </ResponsiveContainer>
              </Card>
            )}

            {/* Revenue by Company */}
            {companyPerformanceData.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Revenue Distribution by Company</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={companyPerformanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ company, revenue }) =>
                        `${company}: ${formatCurrency(revenue)}`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="revenue"
                    >
                      {companyPerformanceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4", "#EC4899", "#14B8A6", "#F97316", "#A855F7"][index % 10]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  </PieChart>
                </ResponsiveContainer>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Active Filters Display */}
      {(selectedCompany !== "All Companies" || selectedCategory !== "All Categories") && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-blue-900">Active Filters:</span>
              {selectedCompany !== "All Companies" && (
                <Badge variant="outline" className="bg-white">
                  Company: {selectedCompany}
                </Badge>
              )}
              {selectedCategory !== "All Categories" && (
                <Badge variant="outline" className="bg-white">
                  Category: {selectedCategory}
                </Badge>
              )}
              <Badge variant="outline" className="bg-white">
                Date: {startDate} to {endDate}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              Clear All
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}