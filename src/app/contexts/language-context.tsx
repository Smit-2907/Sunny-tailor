/**
 * LanguageContext — instant, synchronous language switching
 *
 * How it works:
 *  - setLanguage() calls i18n.changeLanguage() SYNCHRONOUSLY, so i18next
 *    is already in the new locale by the time React re-renders consumers.
 *  - t() calls i18n.t() which is always in sync because changeLanguage was
 *    already called before the state update triggered the re-render.
 *  - localStorage + <html lang> are also written synchronously.
 *  - No direct JSON imports needed — i18next already has all bundles loaded.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

import i18n from "../../i18n";

// ── Types ─────────────────────────────────────────────────────────
export type Language = "en" | "hi" | "gu";

export const LANGUAGES: Record<
  Language,
  { label: string; nativeLabel: string; flag: string }
> = {
  en: { label: "English",  nativeLabel: "English",  flag: "🇬🇧" },
  hi: { label: "Hindi",    nativeLabel: "हिंदी",    flag: "🇮🇳" },
  gu: { label: "Gujarati", nativeLabel: "ગુજરાતી", flag: "🇮🇳" },
};

// ── Context shape ─────────────────────────────────────────────────
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

// ── Helper — read + validate the persisted language ───────────────
function getSavedLanguage(): Language {
  try {
    const saved = localStorage.getItem("app-language");
    if (saved === "hi" || saved === "gu" || saved === "en") return saved;
  } catch {
    // localStorage not available (e.g. private browsing edge cases)
  }
  return "en";
}

// ── Provider ──────────────────────────────────────────────────────
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getSavedLanguage);

  /**
   * setLanguage — all three side-effects happen BEFORE React re-renders:
   *  1. i18next is switched → all i18n.t() calls in the next render
   *     already return new-language text.
   *  2. localStorage is persisted.
   *  3. <html lang> attribute is updated for accessibility / SEO.
   *  4. React state update triggers the re-render.
   */
  const setLanguage = useCallback((lang: Language) => {
    if (lang === language) return;
    i18n.changeLanguage(lang);                    // sync — i18next updated immediately
    localStorage.setItem("app-language", lang);
    document.documentElement.lang = lang;
    setLanguageState(lang);                       // triggers re-render
  }, [language]);

  /**
   * t("sidebar.dashboard") — delegates to i18next which already has the
   * correct language loaded (see setLanguage above).  Returns the key
   * unchanged when no translation is found, matching the original behaviour.
   */
  const t = useCallback((key: string): string => {
    const result = i18n.t(key);
    return result !== key ? (result as string) : key;
  }, [language]); // re-create when language changes so consumers re-render

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────
export function useLanguage() {
  const context = useContext(LanguageContext);

  // If context is not available (e.g., in Figma preview mode), return fallback
  if (!context) {
    console.warn("[Language] Context not available, using fallback");
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: (key: string) => key, // Return the key as-is when no translation available
    };
  }

  return context;
}
