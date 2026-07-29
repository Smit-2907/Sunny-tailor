import { useState, useRef, useEffect, useMemo } from "react";
import { Bell, Search, User, Menu, ChevronDown, LogOut, Settings, UserCircle, Sparkles, LayoutDashboard, Users, Ruler, Factory, Package, Boxes, Truck, DollarSign, BarChart3, Building2, Zap, Receipt, MessagesSquare, FileText, ShoppingCart } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/app/components/ui/dropdown-menu";
import { NotificationCenter } from "@/app/components/notifications/notification-center";
import { LocationHeaderIndicator } from "@/app/components/location-tracking/location-header-indicator";
import { LanguageSwitcher } from "@/app/components/language-switcher";
import { useLanguage } from "@/app/contexts/language-context";

interface SearchableItem {
  key: string;
  label: string;
  icon: React.ElementType;
  keywords: string[];
  allowedRoles: string[];
}

const searchableItems: SearchableItem[] = [
  { key: "master-dashboard", label: "Master Dashboard", icon: LayoutDashboard, keywords: ["dashboard", "home", "overview", "master", "admin"], allowedRoles: ["master-manager"] },
{ key: "company-management", label: "Company Management", icon: Building2, keywords: ["company", "companies", "business", "organization"], allowedRoles: ["master-manager"] },
  { key: "quick-actions", label: "Quick Actions", icon: Zap, keywords: ["quick", "actions", "shortcuts", "fast"], allowedRoles: ["master-manager"] },
  { key: "user-management", label: "User Management", icon: Users, keywords: ["user", "users", "accounts", "employees", "staff"], allowedRoles: ["master-manager"] },
  { key: "billing-invoices", label: "Billing & Invoices", icon: Receipt, keywords: ["billing", "invoices", "bills", "payment", "tax"], allowedRoles: ["master-manager"] },
  { key: "hr", label: "HR Department", icon: Users, keywords: ["hr", "human resources", "department", "employees"], allowedRoles: ["master-manager", "hr"] },
  { key: "measurement-expert", label: "Measurement Expert", icon: Ruler, keywords: ["measurement", "measure", "sizing", "tailor"], allowedRoles: ["master-manager", "measurement-expert"] },
  { key: "production", label: "Production", icon: Factory, keywords: ["production", "manufacturing", "factory", "orders"], allowedRoles: ["master-manager", "production-manager"] },
  { key: "fabric-store", label: "Fabric Store", icon: Package, keywords: ["fabric", "store", "cloth", "material", "textile"], allowedRoles: ["master-manager", "fabric-store"] },
  { key: "raw-material", label: "Raw Material Store", icon: Boxes, keywords: ["raw", "material", "inventory", "stock", "supplies"], allowedRoles: ["master-manager", "raw-material-store"] },
  { key: "dispatch", label: "Dispatch", icon: Truck, keywords: ["dispatch", "shipping", "delivery", "logistics", "transport"], allowedRoles: ["master-manager", "dispatch"] },
  { key: "accountant", label: "Accountant", icon: DollarSign, keywords: ["accountant", "accounts", "bookkeeping"], allowedRoles: ["master-manager", "accountant"] },
  { key: "my-profile", label: "My Profile", icon: UserCircle, keywords: ["profile", "account", "personal", "info", "details"], allowedRoles: ["master-manager", "hr", "measurement-expert", "production-manager", "fabric-store", "raw-material-store", "dispatch", "accountant"] },
  { key: "settings", label: "Account Settings", icon: Settings, keywords: ["settings", "preferences", "configuration", "config", "account"], allowedRoles: ["master-manager", "hr", "measurement-expert", "production-manager", "fabric-store", "raw-material-store", "dispatch", "accountant"] },
  { key: "location-tracking", label: "Location Tracking", icon: Truck, keywords: ["location", "tracking", "gps", "map"], allowedRoles: ["master-manager"] },
];

interface TopBarProps {
  onMenuClick?: () => void;
  onAccountSettingsClick?: () => void;
  onLocationTrackingClick?: () => void;
  onTryOnClick?: () => void;
  onLogout?: () => void;
  userRole?: string;
  onNavigate?: (key: string) => void;
}

export function TopBar({ 
  onMenuClick, 
  onAccountSettingsClick, 
  onLocationTrackingClick,
  onTryOnClick,
  onLogout,
  userRole,
  onNavigate,
}: TopBarProps) {
  const isMasterManager = userRole === "master-manager";
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return searchableItems.filter(item => {
      if (userRole && !item.allowedRoles.includes(userRole)) return false;
      return item.label.toLowerCase().includes(q) || item.keywords.some(k => k.includes(q));
    });
  }, [searchQuery, userRole]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems.length]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
        setShowMobileSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (key: string) => {
    onNavigate?.(key);
    setSearchQuery("");
    setShowResults(false);
    setShowMobileSearch(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, filteredItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex].key);
    } else if (e.key === "Escape") {
      setShowResults(false);
      setShowMobileSearch(false);
      setSearchQuery("");
    }
  };

  const renderResults = () => {
    if (!showResults || !searchQuery.trim()) return null;
    return (
      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
        {filteredItems.length === 0 ? (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            No results found for "{searchQuery}"
          </div>
        ) : (
          filteredItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${
                  index === selectedIndex ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => handleSelect(item.key)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${index === selectedIndex ? "text-indigo-600" : "text-gray-400"}`} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })
        )}
      </div>
    );
  };

  return (
    <div className="h-16 bg-white border-b border-border fixed top-0 left-0 md:left-64 right-0 z-30">
      <div className="h-full px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden shrink-0"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search - Desktop */}
        <div className="flex-1 max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl hidden sm:block relative" ref={searchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('common.search')}
              className="pl-10 bg-muted/50 border-transparent focus:border-indigo-500 focus:bg-white text-sm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => searchQuery.trim() && setShowResults(true)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {renderResults()}
        </div>

        {/* Search button for mobile */}
        <Button variant="ghost" size="icon" className="sm:hidden shrink-0" onClick={() => { setShowMobileSearch(true); setTimeout(() => mobileInputRef.current?.focus(), 100); }}>
          <Search className="h-5 w-5" />
        </Button>

        {/* Mobile search overlay */}
        {showMobileSearch && (
          <div className="fixed inset-x-0 top-0 h-16 bg-white z-50 flex items-center px-3 gap-2 border-b border-border sm:hidden" ref={searchRef}>
            <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <input
              ref={mobileInputRef}
              className="flex-1 text-sm outline-none bg-transparent"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
              onKeyDown={handleKeyDown}
            />
            <Button variant="ghost" size="sm" onClick={() => { setShowMobileSearch(false); setSearchQuery(""); setShowResults(false); }}>
              Cancel
            </Button>
            {showResults && searchQuery.trim() && (
              <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg max-h-64 overflow-y-auto">
                {filteredItems.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">No results found</div>
                ) : (
                  filteredItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button key={item.key} className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left ${index === selectedIndex ? "bg-indigo-50 text-indigo-700" : "text-gray-700"}`} onClick={() => handleSelect(item.key)}>
                        <Icon className="h-4 w-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
          {/* Try-On Beta Button - Only for Master Manager */}
          {isMasterManager && onTryOnClick && (
            <>
              <Button
                onClick={onTryOnClick}
                variant="outline"
                className="border-2 border-purple-600 hover:bg-purple-50/50 bg-white gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg h-8 sm:h-9 hidden md:flex"
              >
                <span className="font-semibold text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Try-On</span>
                <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0 font-bold rounded-full">
                  BETA
                </Badge>
              </Button>
              
              <div className="h-8 w-px bg-border hidden md:block" />
            </>
          )}
          
          {/* Location Tracking Indicator */}
          <div className="hidden sm:block">
            <LocationHeaderIndicator onViewFull={onLocationTrackingClick} />
          </div>
          
          <div className="h-8 w-px bg-border hidden md:block" />
          
          {/* Notifications - New Component */}
          <NotificationCenter />
          
          <div className="h-8 w-px bg-border hidden sm:block" />
          
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          <div className="h-8 w-px bg-border hidden sm:block" />
          
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-1.5 sm:px-2 md:px-3 shrink-0">
                <Avatar className="h-7 w-7 sm:h-8 sm:w-8 bg-indigo-100">
                  <AvatarFallback className="bg-indigo-100 text-indigo-600">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">{t('topBar.administrator')}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">john.doe@clothingerp.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onNavigate?.('my-profile')}>
                <UserCircle className="h-4 w-4 mr-2" />
                {t('common.myProfile')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAccountSettingsClick}>
                <Settings className="h-4 w-4 mr-2" />
                {t('common.accountSettings')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={onLogout}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('common.logout')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}