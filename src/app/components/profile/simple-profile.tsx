import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera, Building2, Briefcase } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { toast } from "sonner";

interface UserProfile {
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
}

interface SimpleProfileProps {
  userEmail: string;
  userName: string;
  userRole: string;
}

export function SimpleProfile({ userEmail, userName, userRole }: SimpleProfileProps) {
  const [profile, setProfile] = useState<UserProfile>(() => {
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

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check if profile needs to be completed
    if (!profile.isProfileComplete) {
      setIsEditing(true);
      toast.info("Please complete your profile", {
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

  const getRoleBadgeColor = () => {
    const roleColors: { [key: string]: string } = {
      "master-manager": "bg-purple-100 text-purple-700 border-purple-200",
      "hr": "bg-blue-100 text-blue-700 border-blue-200",
      "measurement-expert": "bg-cyan-100 text-cyan-700 border-cyan-200",
      "production-manager": "bg-indigo-100 text-indigo-700 border-indigo-200",
      "fabric-store": "bg-green-100 text-green-700 border-green-200",
      "raw-material-store": "bg-teal-100 text-teal-700 border-teal-200",
      "dispatch": "bg-orange-100 text-orange-700 border-orange-200",
      "accountant": "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
    return roleColors[profile.role] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getRoleLabel = () => {
    const roleLabels: { [key: string]: string } = {
      "master-manager": "Master Manager",
      "hr": "HR",
      "measurement-expert": "Measurement Expert",
      "production-manager": "Production Manager",
      "fabric-store": "Fabric Store",
      "raw-material-store": "Raw Material Store",
      "dispatch": "Dispatch",
      "accountant": "Accountant",
    };
    return roleLabels[profile.role] || profile.role;
  };

  if (!profile.isProfileComplete && isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <Card className="p-6 sm:p-8 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-indigo-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Complete Your Profile
              </h1>
              <p className="text-gray-600">
                Please fill in your information to get started
              </p>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
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

              {/* Email (disabled) */}
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  value={formData.email}
                  disabled
                  className="mt-1 bg-gray-50"
                />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
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

              {/* Date of Birth */}
              <div>
                <Label htmlFor="dob" className="text-sm font-medium text-gray-700">
                  Date of Birth
                </Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="mt-1"
                />
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address
                </Label>
                <Input
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street address"
                  className="mt-1"
                />
              </div>

              {/* City, State, Pincode */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City
                  </Label>
                  <Input
                    id="city"
                    value={formData.city || ""}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                    State
                  </Label>
                  <Input
                    id="state"
                    value={formData.state || ""}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="pincode" className="text-sm font-medium text-gray-700">
                    Pincode
                  </Label>
                  <Input
                    id="pincode"
                    value={formData.pincode || ""}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="400001"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Department */}
              <div>
                <Label htmlFor="department" className="text-sm font-medium text-gray-700">
                  Department
                </Label>
                <Input
                  id="department"
                  value={formData.department || ""}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Department"
                  className="mt-1"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-700"
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your personal information</p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <Card className="overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 sm:p-8">
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
                  <Camera className="h-4 w-4 text-indigo-600" />
                </button>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {profile.name}
              </h2>
              <Badge className={`${getRoleBadgeColor()} mb-3`}>
                {getRoleLabel()}
              </Badge>
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

        {/* Content Section */}
        <div className="p-6 sm:p-8">
          {isEditing ? (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Edit Profile Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-name">Full Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone Number <span className="text-red-500">*</span></Label>
                  <Input
                    id="edit-phone"
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-dob">Date of Birth</Label>
                <Input
                  id="edit-dob"
                  type="date"
                  value={formData.dateOfBirth || ""}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="edit-address">Address</Label>
                <Input
                  id="edit-address"
                  value={formData.address || ""}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    value={formData.city || ""}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-state">State</Label>
                  <Input
                    id="edit-state"
                    value={formData.state || ""}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-pincode">Pincode</Label>
                  <Input
                    id="edit-pincode"
                    value={formData.pincode || ""}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-department">Department</Label>
                <Input
                  id="edit-department"
                  value={formData.department || ""}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-indigo-600 hover:bg-indigo-700"
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
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-base font-medium text-gray-900">{profile.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-base font-medium text-gray-900">{profile.email}</p>
                  </div>
                </div>

                {profile.phone && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-base font-medium text-gray-900">{profile.phone}</p>
                    </div>
                  </div>
                )}

                {profile.dateOfBirth && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="text-base font-medium text-gray-900">
                        {new Date(profile.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {profile.department && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="text-base font-medium text-gray-900">{profile.department}</p>
                    </div>
                  </div>
                )}

                {(profile.address || profile.city || profile.state || profile.pincode) && (
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-base font-medium text-gray-900">
                        {[profile.address, profile.city, profile.state, profile.pincode]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
