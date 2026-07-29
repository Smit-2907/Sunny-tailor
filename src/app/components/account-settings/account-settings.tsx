import { useState } from "react";
import { User, Bell, Shield, Palette, Laptop, Globe } from "lucide-react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { SettingsHub } from "@/app/components/settings/settings-hub";
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";

type SettingsTab = "profile" | "preferences" | "notifications" | "security" | "system";

interface AccountSettingsProps {
  userRole?: string;
}

export function AccountSettings({ userRole }: AccountSettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const isMasterManager = userRole === "master-manager";

  const allTabs = [
    {
      id: "profile" as const,
      label: "Profile",
      icon: User,
      description: "Manage your personal information",
    },
    {
      id: "preferences" as const,
      label: "Preferences",
      icon: Palette,
      description: "Customize your experience",
    },
    {
      id: "notifications" as const,
      label: "Notifications",
      icon: Bell,
      description: "Configure notification settings",
    },
    {
      id: "security" as const,
      label: "Security",
      icon: Shield,
      description: "Password and security settings",
    },
    {
      id: "system" as const,
      label: "System Configuration",
      icon: Laptop,
      description: "Advanced system settings",
      badge: "Admin Only",
      adminOnly: true,
    },
  ];

  // Filter tabs based on user role
  const tabs = allTabs.filter(tab => !tab.adminOnly || isMasterManager);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-sm text-gray-500 mt-2">
          Manage your account preferences and system configuration
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all whitespace-nowrap ${
                isActive
                  ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-indigo-600" : "text-gray-600"}`} />
              <span className="font-medium text-sm">{tab.label}</span>
              {tab.badge && (
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 border-purple-200 text-xs"
                >
                  {tab.badge}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "profile" && <ProfileSettings />}
        {activeTab === "preferences" && <PreferencesSettings />}
        {activeTab === "notifications" && <NotificationSettings />}
        {activeTab === "security" && <SecuritySettings />}
        {activeTab === "system" && <SystemSettings />}
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Profile Information</h3>
        
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 bg-indigo-100">
              <AvatarFallback className="bg-indigo-100 text-indigo-600 text-2xl">
                <User className="h-10 w-10" />
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">Change Photo</Button>
              <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <Input defaultValue="John" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <Input defaultValue="Doe" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <Input type="email" defaultValue="john.doe@clothingerp.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <Input type="tel" defaultValue="+91 98765 43210" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <Input defaultValue="Administrator" disabled />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <Input defaultValue="Management" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function PreferencesSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Display Preferences</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              <button className="p-4 border-2 border-indigo-500 rounded-lg bg-indigo-50">
                <div className="w-full h-8 bg-white rounded mb-2"></div>
                <p className="text-sm font-medium text-indigo-700">Light</p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="w-full h-8 bg-gray-900 rounded mb-2"></div>
                <p className="text-sm font-medium text-gray-700">Dark</p>
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="w-full h-8 bg-gradient-to-r from-white to-gray-900 rounded mb-2"></div>
                <p className="text-sm font-medium text-gray-700">Auto</p>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>English</option>
              <option>हिंदी (Hindi)</option>
              <option>मराठी (Marathi)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option>Asia/Kolkata (IST)</option>
              <option>America/New_York (EST)</option>
              <option>Europe/London (GMT)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Notification Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-500">Receive email updates about your account</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">SMS Notifications</p>
              <p className="text-sm text-gray-500">Receive text messages for urgent updates</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Order Updates</p>
              <p className="text-sm text-gray-500">Get notified about order status changes</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Stock Alerts</p>
              <p className="text-sm text-gray-500">Alerts when inventory is low</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">System Announcements</p>
              <p className="text-sm text-gray-500">Important system updates and announcements</p>
            </div>
            <input type="checkbox" defaultChecked className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Change Password</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <Input type="password" placeholder="Enter current password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <Input type="password" placeholder="Enter new password" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <Input type="password" placeholder="Confirm new password" />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline">Cancel</Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">Update Password</Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Two-Factor Authentication</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-900">Enable 2FA</p>
              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
            </div>
            <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              Two-factor authentication adds an extra layer of security by requiring a code from your phone in addition to your password.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-6">Active Sessions</h3>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Laptop className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Current Session</p>
                <p className="text-sm text-gray-500">Chrome on Windows • Mumbai, India</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Active Now
            </Badge>
          </div>
        </div>
      </Card>
    </div>
  );
}

function SystemSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Laptop className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              System Configuration
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Advanced settings for system administrators. Configure company-wide settings, workflows, integrations, security policies, and more.
            </p>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Admin Access Required
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                Global Settings
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Hub Integration */}
      <SettingsHub />
    </div>
  );
}