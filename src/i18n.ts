import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./i18n/en.json";
import hi from "./i18n/hi.json";
import gu from "./i18n/gu.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      gu: { translation: gu },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "hi", "gu"],
    detection: {
      // Only read from localStorage — never from navigator/browser language.
      // This prevents the browser's system language (e.g. Chinese) from
      // being detected and written back to localStorage.
      order: ["localStorage"],
      lookupLocalStorage: "app-language",
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;