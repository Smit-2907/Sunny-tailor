import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit2,
  Save,
  X,
  Camera,
  Building2,
  Briefcase,
  Shield,
  Crown,
  Award,
  Users,
  FileText,
  Activity,
  Clock,
  CheckCircle2,
  Settings,
  Globe,
  Lock,
} from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { toast } from "sonner";

interface AdminProfile {
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  dateOfBirth?: string;
  joiningDate?: string;
  department?: string;
  profilePhoto?: string;
  isProfileComplete: boolean;
  // Admin-specific fields
  employeeId?: string;
  designation?: string;
  reportingTo?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  emergencyContactName?: string;
  aadhaarNumber?: string;
  panNumber?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankIFSC?: string;
  companyName?: string;
  companyAddress?: string;
  companyGSTIN?: string;
  companyPAN?: string;
}

interface AdminProfileProps {
  userEmail: string;
  userName: string;
  userRole: string;
}

type ProfileTab = "personal" | "contact" | "company" | "documents" | "security";

export function AdminProfile({ userEmail, userName, userRole }: AdminProfileProps) {
  const [profile, setProfile] = useState<AdminProfile>(() => {
    const savedProfile = localStorage.getItem(`profile:${userEmail}`);
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }
    return {
      email: userEmail,
      name: userName,
      role: userRole,
      isProfileComplete: false,
    };
  });

  const [activeTab, setActiveTab] = useState<ProfileTab>("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<AdminProfile>(profile);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check if profile needs to be completed
    if (!profile.isProfileComplete) {
      setIsEditing(true);
      toast.info("Please complete your admin profile", {
        duration: 5000,
      });
    }
  }, []);

  const handleSave = async () => {
    // Validate required fields
    if (!formData.name || !formData.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const updatedProfile = {
        ...formData,
        isProfileComplete: true,
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem(`profile:${userEmail}`, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    if (profile.isProfileComplete) {
      setIsEditing(false);
    } else {
      toast.warning("You need to complete your profile");
    }
  };

  const getInitials = () => {
    return profile.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const tabs = [
    { id: "personal" as const, label: "Personal Info", icon: User },
    { id: "contact" as const, label: "Contact Details", icon: Phone },
    { id: "company" as const, label: "Company Info", icon: Building2 },
    { id: "documents" as const, label: "Documents", icon: FileText },
    { id: "security" as const, label: "Security", icon: Lock },
  ];

  if (!profile.isProfileComplete && isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 sm:p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Crown className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Complete Your Admin Profile
              </h1>
              <p className="text-gray-600">
                As an administrator, please fill in your complete information
              </p>
            </div>

            <div className="space-y-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-indigo-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input
                      id="employeeId"
                      value={formData.employeeId || ""}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      placeholder="EMP-001"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={formData.designation || ""}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="Master Manager"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      value={formData.department || ""}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      placeholder="Management"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={formData.dateOfBirth || ""}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="joiningDate">Joining Date</Label>
                    <Input
                      id="joiningDate"
                      type="date"
                      value={formData.joiningDate || ""}
                      onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bloodGroup">Blood Group</Label>
                    <Input
                      id="bloodGroup"
                      value={formData.bloodGroup || ""}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      placeholder="O+"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="h-5 w-5 text-indigo-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      value={formData.email}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street address"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city || ""}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Mumbai"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state || ""}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Maharashtra"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={formData.pincode || ""}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="400001"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, emergencyContactName: e.target.value })
                      }
                      placeholder="Name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact Number</Label>
                    <Input
                      id="emergencyContact"
                      type="tel"
                      value={formData.emergencyContact || ""}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                  Company Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName || ""}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Company name"
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="companyAddress">Company Address</Label>
                    <Input
                      id="companyAddress"
                      value={formData.companyAddress || ""}
                      onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                      placeholder="Company address"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyGSTIN">Company GSTIN</Label>
                    <Input
                      id="companyGSTIN"
                      value={formData.companyGSTIN || ""}
                      onChange={(e) => setFormData({ ...formData, companyGSTIN: e.target.value })}
                      placeholder="22AAAAA0000A1Z5"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyPAN">Company PAN</Label>
                    <Input
                      id="companyPAN"
                      value={formData.companyPAN || ""}
                      onChange={(e) => setFormData({ ...formData, companyPAN: e.target.value })}
                      placeholder="AAAAA0000A"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Document Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Document Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="aadhaar">Aadhaar Number</Label>
                    <Input
                      id="aadhaar"
                      value={formData.aadhaarNumber || ""}
                      onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                      placeholder="XXXX XXXX XXXX"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input
                      id="pan"
                      value={formData.panNumber || ""}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                      placeholder="ABCDE1234F"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankAccount">Bank Account Number</Label>
                    <Input
                      id="bankAccount"
                      value={formData.bankAccountNumber || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, bankAccountNumber: e.target.value })
                      }
                      placeholder="Account number"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankName || ""}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      placeholder="Bank name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bankIFSC">Bank IFSC Code</Label>
                    <Input
                      id="bankIFSC"
                      value={formData.bankIFSC || ""}
                      onChange={(e) => setFormData({ ...formData, bankIFSC: e.target.value })}
                      placeholder="ABCD0123456"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  {isSaving ? (
                    <>
                      <Save className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Complete Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Crown className="h-8 w-8 text-purple-600" />
            Admin Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your administrative profile and system settings
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 sm:h-32 sm:w-32 bg-white/20 ring-4 ring-white/30">
                <AvatarFallback className="bg-white/20 text-white text-2xl sm:text-3xl font-bold">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors">
                  <Camera className="h-4 w-4 text-purple-600" />
                </button>
              )}
              <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Crown className="h-5 w-5 text-white" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {profile.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-3">
                <Badge className="bg-purple-900/50 text-white border-purple-400">
                  <Shield className="h-3 w-3 mr-1" />
                  Master Admin
                </Badge>
                {profile.designation && (
                  <Badge className="bg-indigo-900/50 text-white border-indigo-400">
                    {profile.designation}
                  </Badge>
                )}
                {profile.employeeId && (
                  <Badge className="bg-blue-900/50 text-white border-blue-400">
                    {profile.employeeId}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-indigo-600 text-indigo-600 bg-white"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {activeTab === "personal" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>

              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name <span className="text-red-500">*</span></Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Employee ID</Label>
                    <Input
                      value={formData.employeeId || ""}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Designation</Label>
                    <Input
                      value={formData.designation || ""}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input
                      value={formData.department || ""}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth || ""}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Joining Date</Label>
                    <Input
                      type="date"
                      value={formData.joiningDate || ""}
                      onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Blood Group</Label>
                    <Input
                      value={formData.bloodGroup || ""}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoField icon={User} label="Full Name" value={profile.name} />
                  <InfoField icon={Briefcase} label="Employee ID" value={profile.employeeId} />
                  <InfoField icon={Award} label="Designation" value={profile.designation} />
                  <InfoField icon={Building2} label="Department" value={profile.department} />
                  <InfoField
                    icon={Calendar}
                    label="Date of Birth"
                    value={profile.dateOfBirth && new Date(profile.dateOfBirth).toLocaleDateString()}
                  />
                  <InfoField
                    icon={Calendar}
                    label="Joining Date"
                    value={profile.joiningDate && new Date(profile.joiningDate).toLocaleDateString()}
                  />
                  <InfoField icon={Activity} label="Blood Group" value={profile.bloodGroup} />
                </div>
              )}
            </div>
          )}

          {activeTab === "contact" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>

              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone Number <span className="text-red-500">*</span></Label>
                    <Input
                      type="tel"
                      value={formData.phone || ""}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Address</Label>
                    <Input
                      value={formData.address || ""}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input
                      value={formData.city || ""}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      value={formData.state || ""}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input
                      value={formData.pincode || ""}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Emergency Contact Name</Label>
                    <Input
                      value={formData.emergencyContactName || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, emergencyContactName: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Emergency Contact Number</Label>
                    <Input
                      type="tel"
                      value={formData.emergencyContact || ""}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoField icon={Mail} label="Email" value={profile.email} />
                  <InfoField icon={Phone} label="Phone" value={profile.phone} />
                  <InfoField
                    icon={MapPin}
                    label="Address"
                    value={
                      [profile.address, profile.city, profile.state, profile.pincode]
                        .filter(Boolean)
                        .join(", ") || undefined
                    }
                    className="sm:col-span-2"
                  />
                  <InfoField icon={User} label="Emergency Contact Name" value={profile.emergencyContactName} />
                  <InfoField icon={Phone} label="Emergency Contact" value={profile.emergencyContact} />
                </div>
              )}
            </div>
          )}

          {activeTab === "company" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Company Information
              </h3>

              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label>Company Name</Label>
                    <Input
                      value={formData.companyName || ""}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Company Address</Label>
                    <Input
                      value={formData.companyAddress || ""}
                      onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Company GSTIN</Label>
                    <Input
                      value={formData.companyGSTIN || ""}
                      onChange={(e) => setFormData({ ...formData, companyGSTIN: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Company PAN</Label>
                    <Input
                      value={formData.companyPAN || ""}
                      onChange={(e) => setFormData({ ...formData, companyPAN: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoField icon={Building2} label="Company Name" value={profile.companyName} />
                  <InfoField icon={MapPin} label="Company Address" value={profile.companyAddress} className="sm:col-span-2" />
                  <InfoField icon={FileText} label="Company GSTIN" value={profile.companyGSTIN} />
                  <InfoField icon={FileText} label="Company PAN" value={profile.companyPAN} />
                </div>
              )}
            </div>
          )}

          {activeTab === "documents" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Document Information
              </h3>

              {isEditing ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Aadhaar Number</Label>
                    <Input
                      value={formData.aadhaarNumber || ""}
                      onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>PAN Number</Label>
                    <Input
                      value={formData.panNumber || ""}
                      onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Bank Account Number</Label>
                    <Input
                      value={formData.bankAccountNumber || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, bankAccountNumber: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Bank Name</Label>
                    <Input
                      value={formData.bankName || ""}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Bank IFSC Code</Label>
                    <Input
                      value={formData.bankIFSC || ""}
                      onChange={(e) => setFormData({ ...formData, bankIFSC: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InfoField icon={FileText} label="Aadhaar Number" value={profile.aadhaarNumber} />
                  <InfoField icon={FileText} label="PAN Number" value={profile.panNumber} />
                  <InfoField icon={Building2} label="Bank Account Number" value={profile.bankAccountNumber} />
                  <InfoField icon={Building2} label="Bank Name" value={profile.bankName} />
                  <InfoField icon={Building2} label="Bank IFSC Code" value={profile.bankIFSC} />
                </div>
              )}
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Security Settings
              </h3>

              <Card className="p-6 bg-gray-50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Lock className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Change Password</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Update your password regularly to keep your account secure
                    </p>
                    <Button variant="outline" size="sm">
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gray-50">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      Add an extra layer of security to your admin account
                    </p>
                    <Button variant="outline" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {isEditing && (
            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
              >
                {isSaving ? (
                  <>
                    <Save className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

// Helper component for displaying info fields
function InfoField({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: React.ElementType;
  label: string;
  value?: string;
  className?: string;
}) {
  if (!value) return null;

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="h-5 w-5 text-indigo-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-base font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
