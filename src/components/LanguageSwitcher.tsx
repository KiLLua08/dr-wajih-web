import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { applyDirection, SUPPORTED_LANGUAGES } from "@/i18n";

const LABELS: Record<string, string> = { fr: "FR", en: "EN", ar: "AR" };

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = (i18n.language || "fr").split("-")[0];

  const change = (lng: string) => {
    i18n.changeLanguage(lng);
    applyDirection(lng);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="size-4" />
          <span className="font-medium">{LABELS[current] ?? "FR"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LANGUAGES.map((lng) => (
          <DropdownMenuItem key={lng} onClick={() => change(lng)}>
            {t(`language.${lng}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}