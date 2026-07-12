import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import fr from "./locales/fr.json";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

export const SUPPORTED_LANGUAGES = ["fr", "en", "ar"] as const;
export type Lang = (typeof SUPPORTED_LANGUAGES)[number];
export const RTL_LANGUAGES: Lang[] = ["ar"];

let initialized = false;

export function initI18n() {
  if (initialized) return i18n;
  initialized = true;
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        fr: { translation: fr },
        en: { translation: en },
        ar: { translation: ar },
      },
      fallbackLng: "fr",
      supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage", "navigator"],
        caches: ["localStorage"],
        lookupLocalStorage: "clinic_lang",
      },
    });
  return i18n;
}

export function applyDirection(lang: string) {
  if (typeof document === "undefined") return;
  const isRtl = (RTL_LANGUAGES as string[]).includes(lang);
  document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", lang);
}

export default i18n;