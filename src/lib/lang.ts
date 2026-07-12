import { useTranslation } from "react-i18next";
import type { Lang } from "@/i18n";

export function useLang(): Lang {
  const { i18n } = useTranslation();
  const lng = (i18n.language || "fr").split("-")[0];
  if (lng === "en" || lng === "ar") return lng;
  return "fr";
}

export function localized<T extends Record<string, unknown>>(
  row: T,
  base: string,
  lang: Lang,
): string {
  const key = `${base}_${lang}` as keyof T;
  return (row[key] as string) || (row[`${base}_fr` as keyof T] as string) || "";
}