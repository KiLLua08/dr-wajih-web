import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const LANGS = [
  { code: "fr", label: "FR", name: "Français" },
  { code: "en", label: "EN", name: "English" },
  { code: "ar", label: "AR", name: "العربية" },
] as const;

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language || "fr";

  // Persist language to localStorage
  useEffect(() => {
    localStorage.setItem("i18nextLng", current);
  }, [current]);

  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-border bg-muted/40 p-0.5">
      {LANGS.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => i18n.changeLanguage(code)}
          className={`
            rounded-md px-2 py-1 text-xs font-semibold transition-all
            ${current === code
              ? "bg-primary text-primary-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground hover:bg-background/60"
            }
          `}
          title={LANGS.find((l) => l.code === code)?.name}
          aria-label={`Switch to ${LANGS.find((l) => l.code === code)?.name}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
