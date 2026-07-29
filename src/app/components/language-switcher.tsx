/**
 * LanguageSwitcher — English / हिंदी / ગુજરાતી
 *
 * Fully self-contained: language labels are hardcoded here so the
 * browser-language-detector can never inject an unexpected locale (e.g. zh).
 *
 * Desktop  → dropdown in the top navbar
 * Mobile   → bottom-sheet selector
 */

import { useState, useEffect, useRef } from "react";
import { Languages, Check, Loader2, ChevronDown, X } from "lucide-react";
import { toast } from "sonner";
import { useLanguage, Language } from "@/app/contexts/language-context";

// ── Hardcoded language list (never affected by browser locale) ─────
const LANG_OPTIONS: {
  code: Language;
  flag: string;
  /** label shown in its own script */
  nativeLabel: string;
  /** English name shown as subtitle in mobile sheet */
  englishLabel: string;
}[] = [
  { code: "en", flag: "🇬🇧", nativeLabel: "English",    englishLabel: "English"  },
  { code: "hi", flag: "🇮🇳", nativeLabel: "हिंदी",      englishLabel: "Hindi"    },
  { code: "gu", flag: "🇮🇳", nativeLabel: "ગુજરાતી",   englishLabel: "Gujarati" },
];

// ── Utility hook ──────────────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false,
  );
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

// ── Shared option row ─────────────────────────────────────────────
interface LangOptionProps {
  flag: string;
  nativeLabel: string;
  active: boolean;
  switching: boolean;
  onClick: () => void;
}
function LangOption({ flag, nativeLabel, active, switching, onClick }: LangOptionProps) {
  return (
    <button
      onClick={onClick}
      disabled={switching}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
        ${active ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"}
        disabled:opacity-60 disabled:cursor-not-allowed
      `}
    >
      <span className="text-base leading-none select-none">{flag}</span>
      <span className="flex-1 text-left font-medium">{nativeLabel}</span>
      {active && !switching && <Check className="w-4 h-4 text-indigo-600 flex-shrink-0" />}
      {active &&  switching && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin flex-shrink-0" />}
    </button>
  );
}

// ── Desktop Dropdown ──────────────────────────────────────────────
function DesktopDropdown() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen]           = useState(false);
  const [switching, setSwitching] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function handleChange(code: Language, nativeLabel: string, flag: string) {
    if (code === language) { setOpen(false); return; }
    setSwitching(true);
    setLanguage(code);
    await new Promise((r) => setTimeout(r, 150));
    setSwitching(false);
    setOpen(false);
    toast.success("Language changed", {
      description: nativeLabel,
      duration: 2000,
      icon: <span>{flag}</span>,
    });
  }

  const current = LANG_OPTIONS.find((l) => l.code === language) ?? LANG_OPTIONS[0];

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        title="Select Language"
      >
        {switching
          ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
          : <Languages className="w-4 h-4" />
        }
        {/* Show flag + native label on ≥ sm screens */}
        <span className="hidden sm:flex items-center gap-1.5">
          <span className="leading-none">{current.flag}</span>
          <span>{current.nativeLabel}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="
          absolute right-0 top-full mt-2 w-48
          bg-white border border-gray-200 rounded-xl shadow-xl
          py-2 px-1.5 z-50
        ">
          <p className="px-2 pb-2 text-[10px] text-gray-400 uppercase tracking-widest">
            Select Language
          </p>
          {LANG_OPTIONS.map(({ code, flag, nativeLabel }) => (
            <LangOption
              key={code}
              flag={flag}
              nativeLabel={nativeLabel}
              active={language === code}
              switching={switching && language === code}
              onClick={() => handleChange(code, nativeLabel, flag)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Mobile Bottom Sheet ───────────────────────────────────────────
function MobileBottomSheet() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen]           = useState(false);
  const [switching, setSwitching] = useState(false);

  async function handleChange(code: Language, nativeLabel: string, flag: string) {
    if (code === language) { setOpen(false); return; }
    setSwitching(true);
    setLanguage(code);
    await new Promise((r) => setTimeout(r, 150));
    setSwitching(false);
    setOpen(false);
    toast.success("Language changed", {
      description: nativeLabel,
      duration: 2000,
      icon: <span>{flag}</span>,
    });
  }

  const current = LANG_OPTIONS.find((l) => l.code === language) ?? LANG_OPTIONS[0];

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
      >
        {switching
          ? <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
          : <Languages className="w-4 h-4" />
        }
        <span className="text-xs">{current.flag} {current.nativeLabel}</span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          {/* Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl p-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <div className="mx-auto mb-4 w-10 h-1 rounded-full bg-gray-200" />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">Select Language</p>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Options */}
            <div className="space-y-2 mb-6">
              {LANG_OPTIONS.map(({ code, flag, nativeLabel, englishLabel }) => {
                const active = language === code;
                return (
                  <button
                    key={code}
                    onClick={() => handleChange(code, nativeLabel, flag)}
                    disabled={switching}
                    className={`
                      w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all
                      ${active
                        ? "bg-indigo-50 border border-indigo-200"
                        : "border border-gray-100 hover:bg-gray-50"
                      }
                      disabled:opacity-60
                    `}
                  >
                    <span className="text-2xl leading-none select-none">{flag}</span>
                    <div className="flex-1 text-left">
                      {/* Native script — always clear, always the correct font */}
                      <p className={`text-sm font-medium ${active ? "text-indigo-700" : "text-gray-800"}`}>
                        {nativeLabel}
                      </p>
                      {/* English subtitle so every user knows what they're clicking */}
                      <p className="text-xs text-gray-400">{englishLabel}</p>
                    </div>
                    {active && !switching && <Check className="w-5 h-5 text-indigo-600" />}
                    {active &&  switching && <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Public export ─────────────────────────────────────────────────
export function LanguageSwitcher() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileBottomSheet /> : <DesktopDropdown />;
}
