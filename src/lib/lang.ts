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
  const suffix = lang === "ar" ? "_ar" : "_fr";
  return obj[`${field}${suffix}`] || obj[`${field}_fr`] || "";
}
