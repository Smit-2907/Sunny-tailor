import { useState } from "react";
import { X, Save, User as UserIcon, Shield, Lock, MapPin, Heart } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { type User } from "@/app/data/mock-users";
import { roles } from "@/app/data/mock-users";

interface AddEditUserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
}

export function AddEditUserModal({ user, onClose, onSave }: AddEditUserModalProps) {
  const isEditMode = user !== null;
  const [activeTab, setActiveTab] = useState<"basic" | "contact" | "security">("basic");

  // Form state
  const [formData, setFormData] = useState<User>(
    user || {
      id: `user-${Date.now()}`,
      employeeId: `EMP-${Date.now().toString().slice(-3)}`,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: "production_worker",
      department: "",
      designation: "",
      reportingManager: null,
      status: "active",
      dateOfJoining: new Date(),
      lastLogin: null,
      loginCount: 0,
      permissions: [],
      address: "",
      city: "",
      state: "",
      pincode: "",
      emergencyContact: "",
      bloodGroup: "O+",
      dateOfBirth: new Date(),
      gender: "Male",
      maritalStatus: "Single",
      twoFactorEnabled: false,
      sessionTimeout: 30,
      lastPasswordChange: new Date(),
      failedLoginAttempts: 0,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Basic validation
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.designation.trim()) newErrors.designation = "Designation is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Update permissions based on role
      const selectedRole = roles.find((r) => r.name === formData.role);
      const updatedUser = {
        ...formData,
        permissions: selectedRole?.permissions || [],
      };
      onSave(updatedUser);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {isEditMode ? "Edit User" : "Add New User"}
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                {isEditMode
                  ? "Update user information and permissions"
                  : "Create a new user account"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-white px-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("basic")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "basic"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <UserIcon className="h-4 w-4 inline-block mr-2" />
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "contact"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <MapPin className="h-4 w-4 inline-block mr-2" />
              Contact & Address
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "security"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Lock className="h-4 w-4 inline-block mr-2" />
              Role & Security
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    placeholder="Enter first name"
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    placeholder="Enter last name"
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange("employeeId", e.target.value)}
                    placeholder="EMP-001"
                    disabled={isEditMode}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value as User["gender"])
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    value={formData.dateOfBirth.toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", new Date(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marital Status
                  </label>
                  <select
                    value={formData.maritalStatus}
                    onChange={(e) =>
                      handleInputChange(
                        "maritalStatus",
                        e.target.value as User["maritalStatus"]
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Joining <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={formData.dateOfJoining.toISOString().split("T")[0]}
                    onChange={(e) =>
                      handleInputChange("dateOfJoining", new Date(e.target.value))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.department}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                    placeholder="e.g., Production, HR, Finance"
                    className={errors.department ? "border-red-500" : ""}
                  />
                  {errors.department && (
                    <p className="text-xs text-red-500 mt-1">{errors.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={formData.designation}
                    onChange={(e) => handleInputChange("designation", e.target.value)}
                    placeholder="e.g., Manager, Executive"
                    className={errors.designation ? "border-red-500" : ""}
                  />
                  {errors.designation && (
                    <p className="text-xs text-red-500 mt-1">{errors.designation}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contact & Address Tab */}
          {activeTab === "contact" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="user@sunnytailor.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                  <Input
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Street address, building, apartment"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    placeholder="e.g., Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <Input
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="e.g., Maharashtra"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode
                  </label>
                  <Input
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    placeholder="400001"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Role & Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.displayName}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {roles.find((r) => r.name === formData.role)?.description}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      handleInputChange("status", e.target.value as User["status"])
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Timeout (minutes)
                  </label>
                  <Input
                    type="number"
                    value={formData.sessionTimeout}
                    onChange={(e) =>
                      handleInputChange("sessionTimeout", parseInt(e.target.value))
                    }
                    min="15"
                    max="120"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.twoFactorEnabled}
                      onChange={(e) =>
                        handleInputChange("twoFactorEnabled", e.target.checked)
                      }
                      className="mr-2 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Enable Two-Factor Authentication
                    </span>
                  </label>
                </div>
              </div>

              {/* Permission Preview */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  <Shield className="h-4 w-4 inline mr-2" />
                  Role Permissions
                </h4>
                <p className="text-sm text-blue-700">
                  User will have{" "}
                  <strong>
                    {roles.find((r) => r.name === formData.role)?.permissions.length || 0}{" "}
                    permissions
                  </strong>{" "}
                  based on the selected role.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditMode ? "Update User" : "Create User"}
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
