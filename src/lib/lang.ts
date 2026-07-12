import { useTranslation } from "react-i18next";

export function useLang() {
  const { i18n } = useTranslation();
  return i18n.language || "fr";
}

export function localized(
  obj: any,
  field: string,
  lang: string
): string {
  if (!obj) return "";
  if (lang === "ar") return obj[`${field}_ar`] || obj[`${field}_fr`] || "";
  if (lang === "en") return obj[`${field}_en`] || obj[`${field}_fr`] || "";
  return obj[`${field}_fr`] || obj[`${field}_en`] || "";
}
