import { FabricBillUpload, FabricBill } from "./fabric-bill-upload";
import { CompanyInvoiceUpload, CompanyInvoice } from "./company-invoice-upload";
import { useState, useEffect } from "react";
import * as api from "@/app/api/supabase-api";
import {
  Package,
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  Calendar,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";

export function FinancialDataManagement() {
  const [activeTab, setActiveTab] = useState("fabric-bills");
  const [showFabricBillUpload, setShowFabricBillUpload] = useState(false);
  const [showInvoiceUpload, setShowInvoiceUpload] = useState(false);
  const [editingFabricBill, setEditingFabricBill] = useState<FabricBill | undefined>();
  const [editingInvoice, setEditingInvoice] = useState<CompanyInvoice | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: string } | null>(null);

  // State for data
  const [fabricBills, setFabricBills] = useState<FabricBill[]>([]);
  const [companyInvoices, setCompanyInvoices] = useState<CompanyInvoice[]>([]);

  // Load data — Supabase first, localStorage fallback
  useEffect(() => {
    api.fetchFabricBills().then((data) => {
      if (data.length) setFabricBills(data);
      else {
        const stored = localStorage.getItem("erp_fabric_bills");
        if (stored) setFabricBills(JSON.parse(stored));
      }
    }).catch(() => {
      const stored = localStorage.getItem("erp_fabric_bills");
      if (stored) setFabricBills(JSON.parse(stored));
    });

    api.fetchCompanyInvoices().then((data) => {
      if (data.length) setCompanyInvoices(data);
      else {
        const stored = localStorage.getItem("erp_company_invoices");
        if (stored) setCompanyInvoices(JSON.parse(stored));
      }
    }).catch(() => {
      const stored = localStorage.getItem("erp_company_invoices");
      if (stored) setCompanyInvoices(JSON.parse(stored));
    });
  }, []);

  // Filters
  const [fabricBillSearch, setFabricBillSearch] = useState("");
  const [fabricBillStatusFilter, setFabricBillStatusFilter] = useState("all");
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all");

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      paid: { label: "Paid", className: "bg-green-100 text-green-800 border-green-200" },
      partial: { label: "Partial", className: "bg-blue-100 text-blue-800 border-blue-200" },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      overdue: { label: "Overdue", className: "bg-red-100 text-red-800 border-red-200" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // Fabric Bill Handlers
  const handleSaveFabricBill = (bill: FabricBill) => {
    setFabricBills((prev) => {
      const next = editingFabricBill ? prev.map((b) => (b.id === bill.id ? bill : b)) : [...prev, bill];
      localStorage.setItem("erp_fabric_bills", JSON.stringify(next));
      api.saveFabricBill(bill).catch(() => {});
      return next;
    });
    setEditingFabricBill(undefined);
    setShowFabricBillUpload(false);
  };

  const handleEditFabricBill = (bill: FabricBill) => {
    setEditingFabricBill(bill);
    setShowFabricBillUpload(true);
  };

  const handleDeleteFabricBill = (id: string) => {
    setItemToDelete({ type: "fabric-bill", id });
    setDeleteDialogOpen(true);
  };

  // Invoice Handlers
  const handleSaveInvoice = (invoice: CompanyInvoice) => {
    setCompanyInvoices((prev) => {
      const next = editingInvoice ? prev.map((inv) => (inv.id === invoice.id ? invoice : inv)) : [...prev, invoice];
      localStorage.setItem("erp_company_invoices", JSON.stringify(next));
      api.saveCompanyInvoice(invoice).catch(() => {});
      return next;
    });
    setEditingInvoice(undefined);
    setShowInvoiceUpload(false);
  };

  const handleEditInvoice = (invoice: CompanyInvoice) => {
    setEditingInvoice(invoice);
    setShowInvoiceUpload(true);
  };

  const handleDeleteInvoice = (id: string) => {
    setItemToDelete({ type: "invoice", id });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      if (itemToDelete.type === "fabric-bill") {
        setFabricBills((prev) => {
          const next = prev.filter((b) => b.id !== itemToDelete.id);
          localStorage.setItem("erp_fabric_bills", JSON.stringify(next));
          api.deleteFabricBill(itemToDelete.id).catch(() => {});
          return next;
        });
      } else if (itemToDelete.type === "invoice") {
        setCompanyInvoices((prev) => {
          const next = prev.filter((inv) => inv.id !== itemToDelete.id);
          localStorage.setItem("erp_company_invoices", JSON.stringify(next));
          api.deleteCompanyInvoice(itemToDelete.id).catch(() => {});
          return next;
        });
      }
    }
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  // Filter fabric bills
  const filteredFabricBills = fabricBills.filter((bill) => {
    const matchesSearch =
      fabricBillSearch === "" ||
      bill.billNo.toLowerCase().includes(fabricBillSearch.toLowerCase()) ||
      bill.supplierName.toLowerCase().includes(fabricBillSearch.toLowerCase()) ||
      bill.fabricType.toLowerCase().includes(fabricBillSearch.toLowerCase());

    const matchesStatus = fabricBillStatusFilter === "all" || bill.status === fabricBillStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Filter invoices
  const filteredInvoices = companyInvoices.filter((invoice) => {
    const matchesSearch =
      invoiceSearch === "" ||
      invoice.invoiceNo.toLowerCase().includes(invoiceSearch.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(invoiceSearch.toLowerCase());

    const matchesStatus = invoiceStatusFilter === "all" || invoice.status === invoiceStatusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const fabricBillStats = {
    total: fabricBills.length,
    totalAmount: fabricBills.reduce((sum, bill) => sum + bill.totalAmount, 0),
    paid: fabricBills.filter((b) => b.status === "paid").length,
    pending: fabricBills.filter((b) => b.status === "pending" || b.status === "partial").length,
    outstanding: fabricBills
      .filter((b) => b.status !== "paid")
      .reduce((sum, bill) => sum + bill.totalAmount, 0),
  };

  const invoiceStats = {
    total: companyInvoices.length,
    totalAmount: companyInvoices.reduce((sum, inv) => sum + inv.invoiceAmount, 0),
    paid: companyInvoices.filter((inv) => inv.status === "paid").length,
    pending: companyInvoices.filter((inv) => inv.status === "pending" || inv.status === "partial")
      .length,
    receivables: companyInvoices.reduce((sum, inv) => sum + inv.balance, 0),
  };

  // If showing upload form, display it
  if (showFabricBillUpload) {
    return (
      <FabricBillUpload
        onSave={handleSaveFabricBill}
        onCancel={() => {
          setShowFabricBillUpload(false);
          setEditingFabricBill(undefined);
        }}
        initialData={editingFabricBill}
      />
    );
  }

  if (showInvoiceUpload) {
    return (
      <CompanyInvoiceUpload
        onSave={handleSaveInvoice}
        onCancel={() => {
          setShowInvoiceUpload(false);
          setEditingInvoice(undefined);
        }}
        initialData={editingInvoice}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fabric Bills Summary */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-purple-200 flex items-center justify-center">
              <Package className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-purple-900">Fabric Bills</h3>
              <p className="text-sm text-purple-700">Purchase records</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Bills</p>
              <p className="text-2xl font-bold text-purple-900">{fabricBillStats.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold text-purple-900">
                {formatCurrency(fabricBillStats.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-lg font-semibold text-green-700">{fabricBillStats.paid}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <p className="text-lg font-semibold text-red-700">
                {formatCurrency(fabricBillStats.outstanding)}
              </p>
            </div>
          </div>
        </Card>

        {/* Company Invoices Summary */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-green-200 flex items-center justify-center">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900">Company Invoices</h3>
              <p className="text-sm text-green-700">Sales records</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Invoices</p>
              <p className="text-2xl font-bold text-green-900">{invoiceStats.total}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold text-green-900">
                {formatCurrency(invoiceStats.totalAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Paid</p>
              <p className="text-lg font-semibold text-green-700">{invoiceStats.paid}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Receivables</p>
              <p className="text-lg font-semibold text-yellow-700">
                {formatCurrency(invoiceStats.receivables)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs for Fabric Bills and Invoices */}
      <Card className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="fabric-bills">
              <Package className="h-4 w-4 mr-2" />
              Fabric Bills ({fabricBills.length})
            </TabsTrigger>
            <TabsTrigger value="invoices">
              <FileText className="h-4 w-4 mr-2" />
              Company Invoices ({companyInvoices.length})
            </TabsTrigger>
          </TabsList>

          {/* Fabric Bills Tab */}
          <TabsContent value="fabric-bills" className="space-y-4">
            {/* Actions and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <Button onClick={() => setShowFabricBillUpload(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Fabric Bill
              </Button>

              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none lg:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bills..."
                    value={fabricBillSearch}
                    onChange={(e) => setFabricBillSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={fabricBillStatusFilter} onValueChange={setFabricBillStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Fabric Bills Table */}
            {filteredFabricBills.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Fabric Bills Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by uploading your first fabric purchase bill
                </p>
                <Button onClick={() => setShowFabricBillUpload(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Fabric Bill
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold">Bill No</th>
                      <th className="text-left p-3 text-xs font-semibold">Supplier</th>
                      <th className="text-left p-3 text-xs font-semibold">Fabric Type</th>
                      <th className="text-left p-3 text-xs font-semibold">Quantity</th>
                      <th className="text-left p-3 text-xs font-semibold">Total Amount</th>
                      <th className="text-left p-3 text-xs font-semibold">Bill Date</th>
                      <th className="text-left p-3 text-xs font-semibold">Status</th>
                      <th className="text-left p-3 text-xs font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFabricBills.map((bill, index) => (
                      <tr
                        key={bill.id}
                        className={`border-t hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="p-3">
                          <span className="font-mono text-xs font-semibold text-indigo-600">
                            {bill.billNo}
                          </span>
                        </td>
                        <td className="p-3 text-sm">{bill.supplierName}</td>
                        <td className="p-3 text-sm">{bill.fabricType}</td>
                        <td className="p-3 text-sm">
                          {bill.quantity} {bill.unit}
                        </td>
                        <td className="p-3 text-sm font-semibold">
                          {formatCurrency(bill.totalAmount)}
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">{bill.billDate}</td>
                        <td className="p-3">{getStatusBadge(bill.status)}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditFabricBill(bill)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFabricBill(bill.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* Company Invoices Tab */}
          <TabsContent value="invoices" className="space-y-4">
            {/* Actions and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <Button onClick={() => setShowInvoiceUpload(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Invoice
              </Button>

              <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:flex-none lg:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    value={invoiceSearch}
                    onChange={(e) => setInvoiceSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={invoiceStatusFilter} onValueChange={setInvoiceStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Invoices Table */}
            {filteredInvoices.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Invoices Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by creating your first sales invoice
                </p>
                <Button onClick={() => setShowInvoiceUpload(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Invoice
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-xs font-semibold">Invoice No</th>
                      <th className="text-left p-3 text-xs font-semibold">Client</th>
                      <th className="text-left p-3 text-xs font-semibold">Invoice Amount</th>
                      <th className="text-left p-3 text-xs font-semibold">Received</th>
                      <th className="text-left p-3 text-xs font-semibold">Balance</th>
                      <th className="text-left p-3 text-xs font-semibold">Invoice Date</th>
                      <th className="text-left p-3 text-xs font-semibold">Status</th>
                      <th className="text-left p-3 text-xs font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice, index) => (
                      <tr
                        key={invoice.id}
                        className={`border-t hover:bg-muted/50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="p-3">
                          <span className="font-mono text-xs font-semibold text-indigo-600">
                            {invoice.invoiceNo}
                          </span>
                        </td>
                        <td className="p-3 text-sm">{invoice.clientName}</td>
                        <td className="p-3 text-sm font-semibold">
                          {formatCurrency(invoice.invoiceAmount)}
                        </td>
                        <td className="p-3 text-sm text-green-600">
                          {formatCurrency(invoice.receivedAmount)}
                        </td>
                        <td className="p-3 text-sm font-semibold text-red-600">
                          {formatCurrency(invoice.balance)}
                        </td>
                        <td className="p-3 text-xs text-muted-foreground">
                          {invoice.invoiceDate}
                        </td>
                        <td className="p-3">{getStatusBadge(invoice.status)}</td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditInvoice(invoice)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteInvoice(invoice.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the{" "}
              {itemToDelete?.type === "fabric-bill" ? "fabric bill" : "invoice"} and all associated
              data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}