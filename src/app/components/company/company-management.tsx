import { useState, useEffect, useRef } from "react";
import {
  Building2,
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  X,
  Save,
  DollarSign,
  FileText,
  Star,
  Loader2,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { toast } from "sonner";
import * as api from "@/app/api/supabase-api";

export interface Company {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber: string;
  panNumber: string;
  creditLimit: number;
  paymentTerms: string;
  status: "active" | "inactive";
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  outstandingAmount: number;
  performanceScore: number;
  registrationDate: string;
  lastOrderDate: string;
  category: "A" | "B" | "C";
}

type FilterStatus = "all" | "active" | "inactive";
type FilterCategory = "all" | "A" | "B" | "C";

// GST state code → state name map
const GST_STATE_MAP: Record<string, string> = {
  "01":"Jammu and Kashmir","02":"Himachal Pradesh","03":"Punjab","04":"Chandigarh",
  "05":"Uttarakhand","06":"Haryana","07":"Delhi","08":"Rajasthan","09":"Uttar Pradesh",
  "10":"Bihar","11":"Sikkim","12":"Arunachal Pradesh","13":"Nagaland","14":"Manipur",
  "15":"Mizoram","16":"Tripura","17":"Meghalaya","18":"Assam","19":"West Bengal",
  "20":"Jharkhand","21":"Odisha","22":"Chhattisgarh","23":"Madhya Pradesh","24":"Gujarat",
  "26":"Dadra & Nagar Haveli","27":"Maharashtra","28":"Andhra Pradesh (old)","29":"Karnataka",
  "30":"Goa","31":"Lakshadweep","32":"Kerala","33":"Tamil Nadu","34":"Puducherry",
  "35":"Andaman & Nicobar","36":"Telangana","37":"Andhra Pradesh","38":"Ladakh",
};

function parseGSTIN(gstin: string) {
  const g = gstin.toUpperCase().trim();
  if (g.length !== 15) return null;
  const stateCode = g.substring(0, 2);
  const pan = g.substring(2, 12);
  return { stateCode, state: GST_STATE_MAP[stateCode] || "", pan };
}

async function fetchGSTDetails(gstin: string): Promise<Partial<{ name: string; address: string; city: string; state: string; pincode: string; pan: string }>> {
  const parsed = parseGSTIN(gstin);
  const base = parsed ? { state: parsed.state, pan: parsed.pan } : {};

  try {
    const res = await fetch(`https://api.gstincheck.com/check/demo/${gstin.toUpperCase()}`);
    if (res.ok) {
      const json = await res.json();
      if (json?.flag && json?.data) {
        const d = json.data;
        const addr = d.pradr?.addr || {};
        return {
          name: d.tradeNam || d.lgnm || "",
          address: [addr.bnm, addr.st, addr.loc].filter(Boolean).join(", "),
          city: addr.dst || addr.loc || "",
          state: addr.stcd || parsed?.state || "",
          pincode: addr.pncd || "",
          pan: parsed?.pan || "",
        };
      }
    }
  } catch {}

  return base;
}

// localStorage cache
const CACHE_KEY = "erp_companies";
function loadCache(): Company[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function writeCache(companies: Company[]) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(companies)); } catch {}
}

const emptyCompany: Omit<Company, "id"> = {
  name: "", contactPerson: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
  gstNumber: "", panNumber: "", creditLimit: 0, paymentTerms: "30 Days", status: "active",
  totalOrders: 0, completedOrders: 0, pendingOrders: 0, totalRevenue: 0, outstandingAmount: 0,
  performanceScore: 0, registrationDate: new Date().toISOString(), lastOrderDate: new Date().toISOString(),
  category: "C",
};

export function CompanyManagement() {
  const [companies, setCompanies] = useState<Company[]>(() => loadCache());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [formData, setFormData] = useState<Omit<Company, "id">>(emptyCompany);
  const [saving, setSaving] = useState(false);
  const [gstInput, setGstInput] = useState("");
  const [gstFetching, setGstFetching] = useState(false);
  const [gstFetched, setGstFetched] = useState<"idle" | "success" | "partial" | "error">("idle");
  const [showFormFields, setShowFormFields] = useState(false);
  const loadDone = useRef(false);

  // Load from Supabase
  useEffect(() => {
    if (loadDone.current) return;
    loadDone.current = true;
    (async () => {
      try {
        const remote = await api.fetchCompanies();
        if (remote.length > 0) {
          setCompanies(remote as Company[]);
          writeCache(remote as Company[]);
          console.log(`[Companies] Loaded ${remote.length} from Supabase`);
        } else {
          console.log("[Companies] Supabase empty – starting fresh");
        }
      } catch (e) {
        console.log("[Companies] Server unavailable, using localStorage cache");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || company.status === filterStatus;
    const matchesCategory = filterCategory === "all" || company.category === filterCategory;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

  const formatDate = (date: string) => {
    try {
      return new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
    } catch { return date; }
  };

  const getCategoryColor = (category: Company["category"]) => {
    switch (category) {
      case "A": return "bg-green-100 text-green-700 border-green-200";
      case "B": return "bg-blue-100 text-blue-700 border-blue-200";
      case "C": return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 95) return "text-green-600";
    if (score >= 85) return "text-blue-600";
    if (score >= 75) return "text-yellow-600";
    return "text-red-600";
  };

  const handleAddCompany = () => {
    setEditingCompany(null);
    setFormData({ ...emptyCompany });
    setGstInput("");
    setGstFetched("idle");
    setShowFormFields(false);
    setShowModal(true);
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    const { id, ...rest } = company;
    setFormData(rest);
    setGstInput(company.gstNumber || "");
    setGstFetched("idle");
    setShowFormFields(true);
    setShowModal(true);
  };

  const handleFetchGST = async () => {
    const gstin = gstInput.trim().toUpperCase();
    if (gstin.length !== 15) { toast.error("Enter a valid 15-character GSTIN"); return; }
    setGstFetching(true);
    setGstFetched("idle");
    try {
      const details = await fetchGSTDetails(gstin);
      const hasFullDetails = !!(details.name && details.address);
      setFormData(prev => ({
        ...prev,
        gstNumber: gstin,
        panNumber: details.pan || prev.panNumber,
        name: details.name || prev.name,
        address: details.address || prev.address,
        city: details.city || prev.city,
        state: details.state || prev.state,
        pincode: details.pincode || prev.pincode,
      }));
      setGstFetched(hasFullDetails ? "success" : "partial");
      setShowFormFields(true);
      if (hasFullDetails) toast.success("Company details fetched successfully!");
      else toast.info("Partial details filled from GSTIN. Please complete the form.");
    } catch {
      const parsed = parseGSTIN(gstin);
      if (parsed) {
        setFormData(prev => ({ ...prev, gstNumber: gstin, panNumber: parsed.pan, state: parsed.state }));
      }
      setGstFetched("partial");
      setShowFormFields(true);
      toast.info("Could not fetch full details. State & PAN filled from GSTIN — please complete the rest.");
    } finally {
      setGstFetching(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) { toast.error("Company name is required"); return; }
    setSaving(true);
    try {
      const company: Company = {
        id: editingCompany?.id || `COMP-${Date.now()}`,
        ...formData,
      };
      // Optimistic update
      let newList: Company[];
      if (editingCompany) {
        newList = companies.map((c) => (c.id === company.id ? company : c));
      } else {
        newList = [company, ...companies];
      }
      setCompanies(newList);
      writeCache(newList);
      setShowModal(false);

      // Persist to Supabase
      await api.saveCompany(company);
      toast.success(editingCompany ? "Company updated" : "Company created");
    } catch (e: any) {
      console.error("[Companies] Save error:", e);
      toast.error("Failed to save company");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return;
    const newList = companies.filter((c) => c.id !== id);
    setCompanies(newList);
    writeCache(newList);
    if (selectedCompany?.id === id) setSelectedCompany(null);
    try {
      await api.deleteCompany(id);
      toast.success("Company deleted");
    } catch (e) {
      console.error("[Companies] Delete error:", e);
      toast.error("Failed to delete from server");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Companies</p>
              <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{companies.filter((c) => c.status === "active").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(companies.reduce((s, c) => s + c.totalRevenue, 0))}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Outstanding</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(companies.reduce((s, c) => s + c.outstandingAmount, 0))}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search companies by name, contact, or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          <div className="flex gap-2">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as FilterStatus)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as FilterCategory)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="all">All Categories</option>
              <option value="A">Category A</option>
              <option value="B">Category B</option>
              <option value="C">Category C</option>
            </select>
            <Button onClick={handleAddCompany} className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Company
            </Button>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">Showing {filteredCompanies.length} of {companies.length} companies</div>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="ml-3 text-gray-500">Loading companies...</span>
        </div>
      )}

      {/* Companies Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="p-5 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{company.name}</h3>
                    <Badge variant="outline" className={getCategoryColor(company.category)}>{company.category}</Badge>
                  </div>
                  <p className="text-xs text-gray-500">{company.id}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setSelectedCompany(company)} className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="View Details">
                    <Eye className="h-4 w-4 text-gray-600" />
                  </button>
                  <button onClick={() => handleEditCompany(company)} className="p-1.5 hover:bg-gray-100 rounded transition-colors" title="Edit">
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                  <button onClick={() => handleDeleteCompany(company.id)} className="p-1.5 hover:bg-red-50 rounded transition-colors" title="Delete">
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <Badge variant="outline" className={company.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}>
                  {company.status === "active" ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                  {company.status}
                </Badge>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm"><Phone className="h-3.5 w-3.5 text-gray-400" /><span className="text-gray-600">{company.phone}</span></div>
                <div className="flex items-center gap-2 text-sm"><Mail className="h-3.5 w-3.5 text-gray-400" /><span className="text-gray-600 truncate">{company.email}</span></div>
                <div className="flex items-center gap-2 text-sm"><MapPin className="h-3.5 w-3.5 text-gray-400" /><span className="text-gray-600 truncate">{company.city}, {company.state}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                <div><p className="text-xs text-gray-500">Total Orders</p><p className="text-lg font-semibold text-gray-900">{company.totalOrders}</p></div>
                <div><p className="text-xs text-gray-500">Pending</p><p className="text-lg font-semibold text-yellow-600">{company.pendingOrders}</p></div>
                <div><p className="text-xs text-gray-500">Revenue</p><p className="text-sm font-semibold text-gray-900">{formatCurrency(company.totalRevenue)}</p></div>
                <div><p className="text-xs text-gray-500">Performance</p><p className={`text-sm font-semibold ${getPerformanceColor(company.performanceScore)}`}>{company.performanceScore}%</p></div>
              </div>

              {company.outstandingAmount > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Outstanding</span>
                    <span className="text-sm font-semibold text-red-600">{formatCurrency(company.outstandingAmount)}</span>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCompanies.length === 0 && (
        <Card className="p-12 text-center">
          <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No companies found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {companies.length === 0 ? "Create your first company to get started" : "Try adjusting your search or filters"}
          </p>
          <Button onClick={handleAddCompany}><Plus className="h-4 w-4 mr-2" />Add First Company</Button>
        </Card>
      )}

      {/* Company Details Modal */}
      {selectedCompany && !showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h2>
                <button onClick={() => setSelectedCompany(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="h-5 w-5" /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-gray-500">Company ID</p><p className="text-sm font-medium text-gray-900">{selectedCompany.id}</p></div>
                    <div><p className="text-xs text-gray-500">Status</p><Badge variant="outline" className={selectedCompany.status === "active" ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}>{selectedCompany.status}</Badge></div>
                    <div><p className="text-xs text-gray-500">Category</p><Badge variant="outline" className={getCategoryColor(selectedCompany.category)}>Category {selectedCompany.category}</Badge></div>
                    <div><p className="text-xs text-gray-500">Performance Score</p><p className={`text-sm font-semibold ${getPerformanceColor(selectedCompany.performanceScore)}`}>{selectedCompany.performanceScore}%</p></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Details</h3>
                  <div className="space-y-2">
                    <div><p className="text-xs text-gray-500">Contact Person</p><p className="text-sm font-medium text-gray-900">{selectedCompany.contactPerson}</p></div>
                    <div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium text-gray-900">{selectedCompany.email}</p></div>
                    <div><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium text-gray-900">{selectedCompany.phone}</p></div>
                    <div><p className="text-xs text-gray-500">Address</p><p className="text-sm font-medium text-gray-900">{selectedCompany.address}, {selectedCompany.city}, {selectedCompany.state} - {selectedCompany.pincode}</p></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Financial Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-gray-500">GST Number</p><p className="text-sm font-medium text-gray-900">{selectedCompany.gstNumber}</p></div>
                    <div><p className="text-xs text-gray-500">PAN Number</p><p className="text-sm font-medium text-gray-900">{selectedCompany.panNumber}</p></div>
                    <div><p className="text-xs text-gray-500">Credit Limit</p><p className="text-sm font-medium text-gray-900">{formatCurrency(selectedCompany.creditLimit)}</p></div>
                    <div><p className="text-xs text-gray-500">Payment Terms</p><p className="text-sm font-medium text-gray-900">{selectedCompany.paymentTerms}</p></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Statistics</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg"><p className="text-2xl font-bold text-gray-900">{selectedCompany.totalOrders}</p><p className="text-xs text-gray-600 mt-1">Total Orders</p></div>
                    <div className="text-center p-4 bg-green-50 rounded-lg"><p className="text-2xl font-bold text-green-600">{selectedCompany.completedOrders}</p><p className="text-xs text-gray-600 mt-1">Completed</p></div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg"><p className="text-2xl font-bold text-yellow-600">{selectedCompany.pendingOrders}</p><p className="text-xs text-gray-600 mt-1">Pending</p></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Revenue Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg"><p className="text-xs text-gray-600 mb-1">Total Revenue</p><p className="text-xl font-bold text-blue-600">{formatCurrency(selectedCompany.totalRevenue)}</p></div>
                    <div className="p-4 bg-red-50 rounded-lg"><p className="text-xs text-gray-600 mb-1">Outstanding Amount</p><p className="text-xl font-bold text-red-600">{formatCurrency(selectedCompany.outstandingAmount)}</p></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Important Dates</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-gray-500">Registration Date</p><p className="text-sm font-medium text-gray-900">{formatDate(selectedCompany.registrationDate)}</p></div>
                    <div><p className="text-xs text-gray-500">Last Order Date</p><p className="text-sm font-medium text-gray-900">{formatDate(selectedCompany.lastOrderDate)}</p></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <Button onClick={() => { setSelectedCompany(null); handleEditCompany(selectedCompany); }} className="flex-1 bg-indigo-600 hover:bg-indigo-700"><Edit className="h-4 w-4 mr-2" />Edit Company</Button>
                <Button onClick={() => setSelectedCompany(null)} variant="outline" className="flex-1">Close</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl max-h-[92vh] overflow-y-auto p-0 shadow-2xl">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{editingCompany ? "Edit Company" : "Add Company"}</h3>
                    <p className="text-xs text-gray-500">{editingCompany ? "Update company information" : "Enter GST number to auto-fill details"}</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-5">

                {/* GST Lookup — Step 1 */}
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    GST Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={gstInput}
                      onChange={(e) => { setGstInput(e.target.value.toUpperCase()); setGstFetched("idle"); }}
                      placeholder="e.g. 24AABCA7801B1ZH"
                      maxLength={15}
                      className="font-mono tracking-widest"
                      onKeyDown={(e) => e.key === "Enter" && handleFetchGST()}
                    />
                    <Button
                      onClick={handleFetchGST}
                      disabled={gstFetching || gstInput.length !== 15}
                      className="shrink-0 bg-indigo-600 hover:bg-indigo-700 px-5"
                    >
                      {gstFetching
                        ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Fetching…</>
                        : <><Search className="h-4 w-4 mr-2" />Fetch Details</>
                      }
                    </Button>
                  </div>

                  {/* Status banner */}
                  {gstFetched === "success" && (
                    <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                      Company details fetched successfully. Review and save.
                    </div>
                  )}
                  {gstFetched === "partial" && (
                    <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      Partial details filled from GSTIN. Please complete the remaining fields.
                    </div>
                  )}
                  {gstFetched === "idle" && !showFormFields && gstInput.length < 15 && (
                    <p className="text-xs text-gray-400">Enter a 15-character GSTIN and click Fetch to auto-fill company details.</p>
                  )}

                  {/* Skip link */}
                  {!showFormFields && (
                    <button
                      type="button"
                      onClick={() => setShowFormFields(true)}
                      className="text-xs text-indigo-600 hover:underline"
                    >
                      Don't have GSTIN? Fill manually →
                    </button>
                  )}
                </div>

                {/* Form fields — shown after fetch or manual skip */}
                {showFormFields && (
                  <>
                    <div className="border-t pt-5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Company Details</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">

                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs text-gray-600">Company Name <span className="text-red-500">*</span></Label>
                          <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. ABC Garments Pvt Ltd" />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">PAN Number</Label>
                          <Input value={formData.panNumber} onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })} placeholder="AABCU9603R" className="font-mono" />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Contact Person</Label>
                          <Input value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} placeholder="e.g. Ramesh Sharma" />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Email</Label>
                          <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="contact@company.com" />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Phone</Label>
                          <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" />
                        </div>

                        <div className="col-span-2 space-y-1">
                          <Label className="text-xs text-gray-600">Address</Label>
                          <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="123, Industrial Area" />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">City</Label>
                          <Input value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Mumbai" />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">State</Label>
                          <Input value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="Maharashtra" />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Pincode</Label>
                          <Input value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} placeholder="400001" />
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-5">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Business Settings</p>
                      <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Credit Limit (₹)</Label>
                          <Input type="number" value={formData.creditLimit} onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })} />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Payment Terms</Label>
                          <select value={formData.paymentTerms} onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })} className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400">
                            <option value="30 Days">30 Days</option>
                            <option value="45 Days">45 Days</option>
                            <option value="60 Days">60 Days</option>
                            <option value="Advance">Advance</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Category</Label>
                          <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value as "A" | "B" | "C" })} className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400">
                            <option value="A">A – High Value</option>
                            <option value="B">B – Medium</option>
                            <option value="C">C – Standard</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Status</Label>
                          <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })} className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400">
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)} disabled={saving}>Cancel</Button>
                  <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleSave}
                    disabled={saving || !showFormFields}
                  >
                    {saving
                      ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</>
                      : <><Save className="h-4 w-4 mr-2" />{editingCompany ? "Update" : "Save"} Company</>
                    }
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}