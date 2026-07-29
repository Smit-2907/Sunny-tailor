import { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Loader2,
  TrendingUp,
  TrendingDown,
  DollarSign,
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
import {
  ChartOfAccount,
  AccountType,
  ACCOUNT_TYPES,
  DEFAULT_ACCOUNTS,
  getNextAccountCode,
} from "@/app/types/chart-of-accounts";
import {
  fetchChartOfAccounts,
  saveChartOfAccount,
  deleteChartOfAccount,
  bulkSaveChartOfAccounts,
} from "@/app/api/supabase-api";
import { toast } from "sonner";

export function ChartOfAccounts() {
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<AccountType | "all">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [viewMode, setViewMode] = useState<"list" | "tree">("list");
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [initializing, setInitializing] = useState(false);

  // Load accounts
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await fetchChartOfAccounts();

      // If no accounts exist, initialize with defaults
      if (!data || data.length === 0) {
        console.log("[CoA] No accounts found, will need initialization");
      }

      setAccounts(data || []);
    } catch (err: any) {
      console.error("[CoA] Failed to load accounts:", err);
      toast.error("Failed to load chart of accounts");
    } finally {
      setLoading(false);
    }
  };

  // Initialize default accounts
  const initializeDefaultAccounts = async () => {
    setInitializing(true);
    try {
      const defaultAccounts: ChartOfAccount[] = DEFAULT_ACCOUNTS.map((acc, index) => ({
        ...acc,
        id: `account-${Date.now()}-${index}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      await bulkSaveChartOfAccounts(defaultAccounts);
      setAccounts(defaultAccounts);
      toast.success(`Initialized ${defaultAccounts.length} default accounts`);
    } catch (err: any) {
      console.error("[CoA] Failed to initialize accounts:", err);
      toast.error("Failed to initialize default accounts");
    } finally {
      setInitializing(false);
    }
  };

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) => {
      const matchesSearch =
        searchQuery === "" ||
        acc.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.accountCode.includes(searchQuery) ||
        acc.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === "all" || acc.accountType === filterType;
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && acc.isActive) ||
        (filterStatus === "inactive" && !acc.isActive);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [accounts, searchQuery, filterType, filterStatus]);

  // Group accounts by type for tree view
  const accountsByType = useMemo(() => {
    const grouped: Record<AccountType, ChartOfAccount[]> = {
      asset: [],
      liability: [],
      equity: [],
      income: [],
      expense: [],
    };

    filteredAccounts.forEach((acc) => {
      grouped[acc.accountType].push(acc);
    });

    return grouped;
  }, [filteredAccounts]);

  // Calculate totals by type
  const totalsByType = useMemo(() => {
    const totals: Record<AccountType, number> = {
      asset: 0,
      liability: 0,
      equity: 0,
      income: 0,
      expense: 0,
    };

    accounts.forEach((acc) => {
      if (acc.isActive) {
        totals[acc.accountType] += acc.currentBalance;
      }
    });

    return totals;
  }, [accounts]);

  const handleAddAccount = () => {
    setEditingAccount(null);
    setShowModal(true);
  };

  const handleEditAccount = (account: ChartOfAccount) => {
    setEditingAccount(account);
    setShowModal(true);
  };

  const handleDeleteAccount = async (account: ChartOfAccount) => {
    if (account.isSystemAccount) {
      toast.error("Cannot delete system account");
      return;
    }

    if (!confirm(`Delete account "${account.accountName}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      await deleteChartOfAccount(account.id);
      setAccounts(accounts.filter((a) => a.id !== account.id));
      toast.success("Account deleted successfully");
    } catch (err: any) {
      console.error("[CoA] Delete error:", err);
      toast.error("Failed to delete account");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Account Code",
      "Account Name",
      "Type",
      "Sub-Type",
      "Opening Balance",
      "Current Balance",
      "Status",
      "Description",
    ];

    const rows = filteredAccounts.map((acc) => [
      acc.accountCode,
      acc.accountName,
      ACCOUNT_TYPES[acc.accountType].label,
      acc.accountSubType,
      acc.openingBalance.toFixed(2),
      acc.currentBalance.toFixed(2),
      acc.isActive ? "Active" : "Inactive",
      acc.description || "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `chart-of-accounts-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast.success("Chart of Accounts exported successfully");
  };

  const toggleNode = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const getAccountTypeColor = (type: AccountType) => {
    const colors = {
      asset: "bg-blue-100 text-blue-700 border-blue-200",
      liability: "bg-red-100 text-red-700 border-red-200",
      equity: "bg-purple-100 text-purple-700 border-purple-200",
      income: "bg-green-100 text-green-700 border-green-200",
      expense: "bg-orange-100 text-orange-700 border-orange-200",
    };
    return colors[type];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Show initialization prompt if no accounts
  if (accounts.length === 0 && !loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Chart of Accounts</h2>
            <p className="text-sm text-gray-500 mt-1">
              Set up your accounting structure
            </p>
          </div>
        </div>

        <Card className="p-12 text-center">
          <BookOpen className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Accounts Found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Your Chart of Accounts is empty. Initialize with standard accounting accounts
            or create your own custom structure.
          </p>
          <div className="flex gap-3 justify-center">
            <Button
              onClick={initializeDefaultAccounts}
              disabled={initializing}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {initializing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Initializing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Initialize Default Accounts
                </>
              )}
            </Button>
            <Button onClick={handleAddAccount} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Account
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Chart of Accounts</h2>
          <p className="text-sm text-gray-500 mt-1">
            {filteredAccounts.length} account{filteredAccounts.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={handleAddAccount} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Account
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {(Object.keys(ACCOUNT_TYPES) as AccountType[]).map((type) => (
          <Card key={type} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                {ACCOUNT_TYPES[type].label}
              </span>
              <Badge className={getAccountTypeColor(type)} variant="outline">
                {accountsByType[type].length}
              </Badge>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {formatCurrency(totalsByType[type])}
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterType} onValueChange={(v) => setFilterType(v as AccountType | "all")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {(Object.keys(ACCOUNT_TYPES) as AccountType[]).map((type) => (
                <SelectItem key={type} value={type}>
                  {ACCOUNT_TYPES[type].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterStatus}
            onValueChange={(v) => setFilterStatus(v as "all" | "active" | "inactive")}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 border-l pl-4">
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              List
            </Button>
            <Button
              variant={viewMode === "tree" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("tree")}
            >
              Tree
            </Button>
          </div>
        </div>
      </Card>

      {/* Accounts Table/Tree */}
      {viewMode === "list" ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Opening Balance
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAccounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {account.accountCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {account.accountName}
                      </div>
                      {account.description && (
                        <div className="text-xs text-gray-500">{account.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getAccountTypeColor(account.accountType)} variant="outline">
                        {ACCOUNT_TYPES[account.accountType].label}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                      {formatCurrency(account.openingBalance)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span
                        className={
                          account.currentBalance >= 0 ? "text-green-600" : "text-red-600"
                        }
                      >
                        {formatCurrency(account.currentBalance)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={account.isActive ? "default" : "secondary"}>
                        {account.isActive ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditAccount(account)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!account.isSystemAccount && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAccount(account)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {(Object.keys(ACCOUNT_TYPES) as AccountType[]).map((type) => {
            const typeAccounts = accountsByType[type];
            const isExpanded = expandedNodes.has(type);

            return (
              <Card key={type} className="overflow-hidden">
                <div
                  className="p-4 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 flex items-center justify-between"
                  onClick={() => toggleNode(type)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                    <h3 className="text-lg font-semibold">{ACCOUNT_TYPES[type].label}</h3>
                    <Badge className={getAccountTypeColor(type)} variant="outline">
                      {typeAccounts.length} accounts
                    </Badge>
                  </div>
                  <div className="text-lg font-bold">{formatCurrency(totalsByType[type])}</div>
                </div>

                {isExpanded && (
                  <div className="p-4 space-y-2">
                    {typeAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <span className="text-sm font-mono text-gray-600 w-16">
                            {account.accountCode}
                          </span>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{account.accountName}</div>
                            {account.description && (
                              <div className="text-xs text-gray-500">{account.description}</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              {formatCurrency(account.currentBalance)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Opening: {formatCurrency(account.openingBalance)}
                            </div>
                          </div>
                          <Badge variant={account.isActive ? "default" : "secondary"}>
                            {account.isActive ? "Active" : "Inactive"}
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditAccount(account)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            {!account.isSystemAccount && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAccount(account)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <AccountModal
          account={editingAccount}
          accounts={accounts}
          onClose={() => setShowModal(false)}
          onSave={(account) => {
            if (editingAccount) {
              setAccounts(accounts.map((a) => (a.id === account.id ? account : a)));
            } else {
              setAccounts([...accounts, account]);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

// Account Add/Edit Modal Component
function AccountModal({
  account,
  accounts,
  onClose,
  onSave,
}: {
  account: ChartOfAccount | null;
  accounts: ChartOfAccount[];
  onClose: () => void;
  onSave: (account: ChartOfAccount) => void;
}) {
  const [formData, setFormData] = useState({
    accountCode: account?.accountCode || "",
    accountName: account?.accountName || "",
    accountType: account?.accountType || ("asset" as AccountType),
    accountSubType: account?.accountSubType || "",
    description: account?.description || "",
    openingBalance: account?.openingBalance?.toString() || "0",
    isActive: account?.isActive ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Auto-suggest next account code when type changes
  useEffect(() => {
    if (!account && formData.accountType) {
      try {
        const nextCode = getNextAccountCode(accounts, formData.accountType);
        setFormData((prev) => ({ ...prev, accountCode: nextCode }));
      } catch (err) {
        // Range full
      }
    }
  }, [formData.accountType, account, accounts]);

  const handleSave = async () => {
    setError("");

    // Validation
    if (!formData.accountCode.trim()) {
      setError("Account code is required");
      return;
    }
    if (!formData.accountName.trim()) {
      setError("Account name is required");
      return;
    }
    if (!formData.accountSubType) {
      setError("Account sub-type is required");
      return;
    }

    // Check for duplicate account code
    const duplicate = accounts.find(
      (a) => a.accountCode === formData.accountCode && a.id !== account?.id
    );
    if (duplicate) {
      setError(`Account code ${formData.accountCode} is already in use`);
      return;
    }

    setSaving(true);
    try {
      const accountData: ChartOfAccount = {
        id: account?.id || `account-${Date.now()}`,
        accountCode: formData.accountCode.trim(),
        accountName: formData.accountName.trim(),
        accountType: formData.accountType,
        accountSubType: formData.accountSubType,
        description: formData.description.trim(),
        openingBalance: parseFloat(formData.openingBalance) || 0,
        currentBalance: account?.currentBalance || parseFloat(formData.openingBalance) || 0,
        isActive: formData.isActive,
        isSystemAccount: account?.isSystemAccount || false,
        createdAt: account?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveChartOfAccount(accountData);
      toast.success(account ? "Account updated successfully" : "Account created successfully");
      onSave(accountData);
    } catch (err: any) {
      console.error("[CoA] Save error:", err);
      setError(err.message || "Failed to save account");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">
            {account ? "Edit Account" : "Add New Account"}
          </h3>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Account Type *</Label>
              <Select
                value={formData.accountType}
                onValueChange={(v) =>
                  setFormData({ ...formData, accountType: v as AccountType, accountSubType: "" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ACCOUNT_TYPES) as AccountType[]).map((type) => (
                    <SelectItem key={type} value={type}>
                      {ACCOUNT_TYPES[type].label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Account Sub-Type *</Label>
              <Select
                value={formData.accountSubType}
                onValueChange={(v) => setFormData({ ...formData, accountSubType: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select sub-type" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES[formData.accountType].subTypes.map((subType) => (
                    <SelectItem key={subType.value} value={subType.value}>
                      {subType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Account Code *</Label>
              <Input
                value={formData.accountCode}
                onChange={(e) => setFormData({ ...formData, accountCode: e.target.value })}
                placeholder="e.g., 1000"
              />
              <p className="text-xs text-gray-500 mt-1">
                Range: {ACCOUNT_TYPES[formData.accountType].codeRange}
              </p>
            </div>

            <div>
              <Label>Opening Balance</Label>
              <Input
                type="number"
                step="0.01"
                value={formData.openingBalance}
                onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <Label>Account Name *</Label>
            <Input
              value={formData.accountName}
              onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
              placeholder="e.g., Cash in Hand"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional description"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded border-gray-300"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Active
            </Label>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>Save Account</>
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
