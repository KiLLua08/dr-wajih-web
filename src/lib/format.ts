export function fmtDate(d: Date | string, lang: string) {
  const date = typeof d === "string" ? new Date(d) : d;
  const localeMap: Record<string, string> = { fr: "fr-FR", en: "en-US", ar: "ar-TN" };
  return date.toLocaleDateString(localeMap[lang] || "fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function timeToStr(t: string) {
  return t.slice(0, 5);
}

export function toISODate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}