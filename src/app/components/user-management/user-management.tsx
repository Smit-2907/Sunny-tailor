import { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Mail,
  Shield,
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  AlertCircle,
  Loader2,
  UserPlus,
  X,
  Save,
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
import { fetchUsers, saveUser, deleteUser } from "@/app/api/supabase-api";
import { toast } from "sonner";
import { useLanguage } from "@/app/contexts/language-context";

interface AppUser {
  email: string;
  password: string;
  role: string;
  name: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const roleOptions = [
  { value: "master-manager", label: "Master Manager", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "hr", label: "HR", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "measurement-expert", label: "Measurement Expert", color: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  { value: "production-manager", label: "Production Manager", color: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { value: "fabric-store", label: "Fabric Store", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "raw-material-store", label: "Raw Material Store", color: "bg-teal-100 text-teal-700 border-teal-200" },
  { value: "dispatch", label: "Dispatch", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "accountant", label: "Accountant", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
];

export function UserManagement() {
  const { t } = useLanguage();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Load users
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err: any) {
      console.error("[UserMgmt] Failed to load users:", err);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", password: "", role: "" });
    setFormError("");
    setShowPassword(false);
    setShowModal(true);
  };

  const handleEditUser = (user: AppUser) => {
    setEditingUser(user);
    setFormData({
      name: user.name || "",
      email: user.email,
      password: "",
      role: user.role,
    });
    setFormError("");
    setShowPassword(false);
    setShowModal(true);
  };

  const handleSave = async () => {
    const { name, email, password, role } = formData;

    if (!email.trim()) { setFormError(t('forms.required')); return; }
    if (!role) { setFormError(t('forms.required')); return; }
    if (!editingUser && !password.trim()) { setFormError(t('forms.required')); return; }
    if (!editingUser && password.length < 4) { setFormError(t('forms.required')); return; }

    setSaving(true);
    setFormError("");
    try {
      const userData: any = {
        email: email.trim().toLowerCase(),
        role,
        name: name.trim(),
        isActive: editingUser ? editingUser.isActive : true,
        password: editingUser && !password.trim() ? "••••••" : password,
      };
      await saveUser(userData);
      toast.success(editingUser ? t('userManagement.editUser') : t('userManagement.addUser'));
      setShowModal(false);
      await loadUsers();
    } catch (err: any) {
      console.error("[UserMgmt] Save error:", err);
      setFormError(err.message || t('tables.error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (email: string) => {
    if (!confirm(`${t('userManagement.deleteUser')} "${email}"?`)) return;
    try {
      await deleteUser(email);
      toast.success(t('userManagement.deleteUser'));
      setUsers(users.filter((u) => u.email !== email));
    } catch (err: any) {
      console.error("[UserMgmt] Delete error:", err);
      toast.error(t('tables.error'));
    }
  };

  const handleToggleStatus = async (user: AppUser) => {
    try {
      await saveUser({ ...user, isActive: !user.isActive, password: "••••••" });
      toast.success(user.isActive ? t('userManagement.deactivate') : t('userManagement.activate'));
      await loadUsers();
    } catch (err: any) {
      toast.error(t('tables.error'));
    }
  };

  const getRoleColor = (role: string) => {
    return roleOptions.find((r) => r.value === role)?.color || "bg-gray-100 text-gray-700";
  };

  const getRoleLabel = (role: string) => {
    return roleOptions.find((r) => r.value === role)?.label || role;
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && u.isActive !== false) ||
      (filterStatus === "inactive" && u.isActive === false);
    return matchesSearch && matchesRole && matchesStatus;
  });

  const activeCount = users.filter((u) => u.isActive !== false).length;
  const inactiveCount = users.filter((u) => u.isActive === false).length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('userManagement.totalUsers')}</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('status.active')}</p>
              <p className="text-2xl font-bold text-gray-900">{activeCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('status.inactive')}</p>
              <p className="text-2xl font-bold text-gray-900">{inactiveCount}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Shield className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('userManagement.roles')}</p>
              <p className="text-2xl font-bold text-gray-900">{roleOptions.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Toolbar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('userManagement.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{t('userManagement.allStatus')}</option>
              <option value="active">{t('status.active')}</option>
              <option value="inactive">{t('status.inactive')}</option>
            </select>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">{t('userManagement.allRoles')}</option>
              {roleOptions.map((r) => (
                <option key={r.value} value={r.value}>{t(`roles.${r.value}`)}</option>
              ))}
            </select>
            <Button onClick={handleAddUser} className="bg-indigo-600 hover:bg-indigo-700">
              <UserPlus className="h-4 w-4 mr-2" />
              {t('userManagement.addUser')}
            </Button>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-500">
          {t('userManagement.showingUsers')} {filteredUsers.length} {t('userManagement.ofUsers')} {users.length} {t('userManagement.users')}
        </div>
      </Card>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          <span className="ml-3 text-gray-500">{t('userManagement.loadingUsers')}</span>
        </div>
      )}

      {/* Users Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user) => (
            <Card key={user.email} className="p-5 hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                    {(user.name || user.email)[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {user.name || "No Name"}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEditUser(user)} className="p-1.5 hover:bg-gray-100 rounded" title={t('userManagement.editUser')}>
                    <Edit className="h-4 w-4 text-gray-600" />
                  </button>
                  <button onClick={() => handleDeleteUser(user.email)} className="p-1.5 hover:bg-red-50 rounded" title={t('userManagement.deleteUser')}>
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Role & Status */}
              <div className="flex gap-2 mb-4">
                <Badge variant="outline" className={getRoleColor(user.role)}>
                  <Shield className="h-3 w-3 mr-1" />
                  {t(`roles.${user.role}`) || getRoleLabel(user.role)}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    user.isActive !== false
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }
                >
                  {user.isActive !== false ? (
                    <><CheckCircle2 className="h-3 w-3 mr-1" /> {t('status.active')}</>
                  ) : (
                    <><XCircle className="h-3 w-3 mr-1" /> {t('status.inactive')}</>
                  )}
                </Badge>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-600 truncate">{user.email}</span>
                </div>
                {user.createdAt && (
                  <div className="text-xs text-gray-400">
                    {t('userManagement.created')}: {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="pt-3 border-t border-gray-100 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleToggleStatus(user)}
                >
                  {user.isActive !== false ? (
                    <><Lock className="h-3 w-3 mr-1" /> {t('userManagement.deactivate')}</>
                  ) : (
                    <><Unlock className="h-3 w-3 mr-1" /> {t('userManagement.activate')}</>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={() => handleEditUser(user)}
                >
                  <Edit className="h-3 w-3 mr-1" /> {t('common.edit')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filteredUsers.length === 0 && (
        <Card className="p-12 text-center">
          <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('userManagement.noUsersFound')}</h3>
          <p className="text-sm text-gray-500 mb-4">
            {users.length === 0 ? t('userManagement.createFirst') : t('userManagement.adjustFilters')}
          </p>
          <Button onClick={handleAddUser} className="bg-indigo-600 hover:bg-indigo-700">
            <UserPlus className="h-4 w-4 mr-2" />
            {t('userManagement.addFirstUser')}
          </Button>
        </Card>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setShowModal(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md p-0 shadow-2xl">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5 rounded-t-lg text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {editingUser ? t('userManagement.editUser') : t('userManagement.createUserTitle')}
                      </h3>
                      <p className="text-xs text-indigo-100">
                        {editingUser ? t('userManagement.editUserSub') : t('userManagement.createUserSub')}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-1.5 rounded">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <div className="p-6 space-y-5">
                {/* Name */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">{t('userManagement.fullName')}</Label>
                  <Input
                    placeholder="e.g. Rajesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {t('common.email')} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="e.g. rajesh@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      disabled={!!editingUser}
                    />
                  </div>
                  {editingUser && (
                    <p className="text-xs text-gray-400">{t('userManagement.emailCannotChange')}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {t('userManagement.password')} {!editingUser && <span className="text-red-500">*</span>}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={editingUser ? t('userManagement.leaveBlankPassword') : t('userManagement.enterPassword')}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Role */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    {t('userManagement.roles')} <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v })}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <SelectValue placeholder={t('userManagement.selectRole')} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {t(`roles.${r.value}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Error */}
                {formError && (
                  <div className="text-sm text-red-500 flex items-center gap-2 bg-red-50 p-3 rounded-lg">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {formError}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowModal(false)}
                    disabled={saving}
                  >
                    {t('buttons.cancel')}
                  </Button>
                  <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {t('common.loading')}...</>
                    ) : (
                      <><Save className="h-4 w-4 mr-2" /> {editingUser ? t('userManagement.editUser') : t('userManagement.createUserTitle')}</>
                    )}
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