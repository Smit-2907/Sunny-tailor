import { useState, useEffect, useRef } from "react";
import { Building2, Search, Check, Plus } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { fetchCompanies } from "@/app/api/supabase-api";

export interface CompanyOption {
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
  [key: string]: any;
}

interface CompanyAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelectCompany?: (company: CompanyOption) => void;
  placeholder?: string;
  className?: string;
}

export function CompanyAutocomplete({
  value,
  onChange,
  onSelectCompany,
  placeholder = "Type or select company name...",
  className = "",
}: CompanyAutocompleteProps) {
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load companies from Supabase
  useEffect(() => {
    if (loaded) return;
    setLoaded(true);
    try {
      const cached = localStorage.getItem("erp_companies");
      if (cached) setCompanies(JSON.parse(cached));
    } catch {}
    fetchCompanies()
      .then((data) => {
        if (data.length > 0) setCompanies(data as CompanyOption[]);
      })
      .catch((e) => console.error("[CompanyAutocomplete] Failed to load:", e));
  }, [loaded]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = companies.filter(
    (c) =>
      c.name?.toLowerCase().includes(value.toLowerCase()) ||
      c.contactPerson?.toLowerCase().includes(value.toLowerCase()) ||
      c.city?.toLowerCase().includes(value.toLowerCase())
  );

  const exactMatch = companies.some((c) => c.name?.toLowerCase() === value.toLowerCase());

  const handleSelect = (company: CompanyOption) => {
    onChange(company.name);
    onSelectCompany?.(company);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
        <Input
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10"
        />
        {companies.length > 0 && (
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-300" />
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (filtered.length > 0 || (value.trim() && !exactMatch)) && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {filtered.length > 0 && (
            <div className="px-3 py-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">
              Existing Companies ({filtered.length})
            </div>
          )}
          {filtered.slice(0, 8).map((company) => (
            <button
              key={company.id}
              type="button"
              className="w-full text-left px-3 py-2.5 hover:bg-indigo-50 transition-colors flex items-start gap-3 border-b border-gray-50 last:border-0"
              onClick={() => handleSelect(company)}
            >
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                <Building2 className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-gray-900 truncate">{company.name}</span>
                  {company.name?.toLowerCase() === value.toLowerCase() && (
                    <Check className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  )}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {[company.contactPerson, company.city, company.state].filter(Boolean).join(" · ")}
                </div>
                {company.gstNumber && (
                  <div className="text-[10px] text-gray-400 font-mono mt-0.5">GST: {company.gstNumber}</div>
                )}
              </div>
            </button>
          ))}

          {value.trim() && !exactMatch && (
            <>
              {filtered.length > 0 && <div className="border-t border-gray-100" />}
              <button
                type="button"
                className="w-full text-left px-3 py-2.5 hover:bg-green-50 transition-colors flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                  <Plus className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-green-700">Use "{value}" as new company</span>
                  <div className="text-xs text-gray-400">Fill in details manually</div>
                </div>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
