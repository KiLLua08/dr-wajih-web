import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import frTranslations from "./locales/fr.json";
import enTranslations from "./locales/en.json";
import arTranslations from "./locales/ar.json";

const resources = {
  fr: { translation: frTranslations },
  en: { translation: enTranslations },
  ar: { translation: arTranslations },
};

export function initI18n() {
  if (i18n.isInitialized) return;

  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: "fr",
      defaultNS: "translation",
      interpolation: { escapeValue: false },
      // Detect from localStorage first (key: i18nextLng), then browser
      detection: {
        order: ["localStorage", "navigator"],
        lookupLocalStorage: "i18nextLng",
        caches: ["localStorage"],
      },
    });
}

export function applyDirection(lang: string) {
  const html = document.documentElement;
  if (lang === "ar") {
    html.setAttribute("dir", "rtl");
    html.setAttribute("lang", "ar");
  } else {
    html.setAttribute("dir", "ltr");
    html.setAttribute("lang", lang === "en" ? "en" : "fr");
  }
}
