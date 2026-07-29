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
import { LanguageSwitcher } from "@/app/components/language-switcher";
import { useLanguage } from "@/app/contexts/language-context";
import companyLogo from "figma:asset/9bcecdb98fc72c6ea6c43f2c7c27c72b54658c70.png";
import { loginUser } from "@/app/api/supabase-api";

interface TranslatedLoginPageProps {
  onLogin: (username: string, password: string, role: string) => void;
}

const roles = [
  { value: "master-manager", key: "master-manager" },
  { value: "hr", key: "hr" },
  { value: "measurement-expert", key: "measurement-expert" },
  { value: "production-manager", key: "production-manager" },
  { value: "fabric-store", key: "fabric-store" },
  { value: "raw-material-store", key: "raw-material-store" },
  { value: "dispatch", key: "dispatch" },
  { value: "accountant", key: "accountant" },
];

export function TranslatedLoginPage({ onLogin }: TranslatedLoginPageProps) {
  const { t } = useLanguage();
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
      // Parse the error message for user-friendly display
      let errorMsg = err.message || "Login failed. Please check your credentials.";
      // Clean up API error prefix if present
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

      {/* Language Switcher */}
      <div className="absolute top-6 right-6 z-20">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
          <LanguageSwitcher />
        </div>
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
                {t('login.role')}
              </Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger 
                  id="role"
                  className="h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-400" />
                    <SelectValue placeholder={t('login.rolePlaceholder')} />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((roleOption) => (
                    <SelectItem key={roleOption.value} value={roleOption.value}>
                      {t(`roles.${roleOption.key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Username/Email Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                {t('login.email')}
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="username"
                  type="text"
                  placeholder={t('login.emailPlaceholder')}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-11 h-11 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                {t('login.password')}
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t('login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
              disabled={isLoading || !username || !password || !role}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('login.signIn')}...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  {t('login.signIn')}
                </span>
              )}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}