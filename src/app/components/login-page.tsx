import { useState } from "react";
import { Shield, Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card } from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import companyLogo from "figma:asset/9bcecdb98fc72c6ea6c43f2c7c27c72b54658c70.png";
import { loginUser } from "@/app/api/supabase-api";

interface LoginPageProps {
  onLogin: (username: string, password: string, role: string) => void;
}

const roles = [
  { value: "master-manager", label: "Master Manager" },
  { value: "hr", label: "HR" },
  { value: "measurement-expert", label: "Measurement Expert" },
  { value: "production-manager", label: "Production Manager" },
  { value: "fabric-store", label: "Fabric Store" },
  { value: "raw-material-store", label: "Raw Material Store" },
  { value: "dispatch", label: "Dispatch" },
  { value: "accountant", label: "Accountant" },
];

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password || !role) {
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const userData = await loginUser(username.trim(), password, role);
      setIsLoading(false);
      onLogin(userData.email || username.trim(), password, userData.role || role);
    } catch (err: any) {
      console.error("[Login] Auth error:", err.message);
      let errorMsg = err.message || "Login failed. Please check your credentials.";
      if (errorMsg.startsWith("API error")) {
        try {
          const jsonPart = errorMsg.substring(errorMsg.indexOf("{"));
          const parsed = JSON.parse(jsonPart);
          errorMsg = parsed.error || errorMsg;
        } catch {
          // keep original
        }
      }
      setError(errorMsg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1920&q=80"
          alt="Industrial background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/95 via-indigo-800/90 to-gray-900/95" />
      </div>

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="p-8 sm:p-10 shadow-2xl border-0 bg-white/98 backdrop-blur-sm">
          {/* Logo & Header */}
          <div className="flex items-center justify-center mb-8">
            <img 
              src={companyLogo} 
              alt="Sunny Tailor Corporate Garment" 
              className="h-24 w-auto object-contain -ml-8"
            />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                Select Role
              </Label>
              <Select value={role} onValueChange={(v) => { setRole(v); setError(""); }}>
                <SelectTrigger 
                  id="role"
                  className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder="Choose your role" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((roleOption) => (
                    <SelectItem key={roleOption.value} value={roleOption.value}>
                      {roleOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Username/Email Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your email"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  className="pl-11 h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  className="pl-11 pr-11 h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isLoading || !username || !password || !role}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500">
              Secure access to your manufacturing operations
            </p>
          </div>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/90">
            Need help? Contact your system administrator
          </p>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="absolute bottom-8 left-0 right-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-white/80 text-xs">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>256-bit Encryption</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Secure Login</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
