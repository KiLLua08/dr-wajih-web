import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

const QUERY = encodeURIComponent("Rue Mongi Slim, Menzel Temime, Tunisia");

export function MapEmbed() {
  const { t } = useTranslation();
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${QUERY}`;
  const embed = `https://www.google.com/maps?q=${QUERY}&z=16&output=embed`;
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-border shadow-soft">
      <iframe
        title="Cabinet location map"
        src={embed}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full h-[360px] md:h-[420px]"
        allowFullScreen
      />
      <div className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3">
        <Button asChild size="sm" className="shadow-elegant">
          <a href={directions} target="_blank" rel="noopener noreferrer">
            <Navigation className="size-4" /> {t("contact.getDirections")}
          </a>
        </Button>
      </div>
    </div>
  );
}