import { useTranslation } from "react-i18next";
import { MapPin, Navigation, Phone, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const CLINIC_LAT = 36.7843;
const CLINIC_LNG = 10.9877;
const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=36.7843,10.9877&destination_place_id=ChIJSa9EpQ16ThMRtHXlkmzNVsA";

// Real embed URL — q= param drops a red pin at exact lat/lng
const EMBED_URL = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${CLINIC_LAT},${CLINIC_LNG}&zoom=16`;

// Fallback: plain iframe using the /maps/embed?pb= approach (no API key needed)
// Centered on Menzel Temime with a q= marker pin
const EMBED_FALLBACK = `https://maps.google.com/maps?q=${CLINIC_LAT},${CLINIC_LNG}&z=16&output=embed`;

const LANDMARK: Record<string, string> = {
  fr: "Situé au-dessus de la Pizzeria Mimo",
  en: "Located above Pizzeria Mimo",
  ar: "يقع فوق بيتزيريا ميمو",
};

export function MapEmbed() {
  const { i18n } = useTranslation();
  const lang = i18n.language || "fr";
  const landmark = LANDMARK[lang] ?? LANDMARK["fr"];

  return (
    <div className="space-y-4">
      {/* Map card */}
      <div className="relative rounded-2xl overflow-hidden shadow-elegant border border-border">
        {/* Custom overlay pin label */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/95 backdrop-blur shadow-elegant rounded-xl px-4 py-3 flex items-center gap-3 max-w-xs pointer-events-none">
          <div className="flex size-9 items-center justify-center rounded-lg gradient-primary text-primary-foreground flex-shrink-0">
            <MapPin className="size-5" />
          </div>
          <div>
            <div className="font-semibold text-sm leading-tight">Cabinet Dr. Wajih Bensoltana</div>
            <div className="text-xs text-muted-foreground">Rue Mongi Slim, Manzel Tmime</div>
          </div>
        </div>

        <iframe
          title="Localisation Cabinet Dr. Wajih Bensoltana"
          width="100%"
          height="420"
          frameBorder="0"
          src={EMBED_FALLBACK}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block"
        />
      </div>

      {/* Info bar below map */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Landmark */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-soft">
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground flex-shrink-0">
            <MapPin className="size-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
              {lang === "ar" ? "العنوان" : lang === "en" ? "Address" : "Adresse"}
            </div>
            <p className="text-sm font-medium leading-snug">{landmark}</p>
            <p className="text-xs text-muted-foreground">Rue Mongi Slim, Manzel Tmime</p>
          </div>
        </div>

        {/* Phone 1 */}
        <a
          href="tel:+21655740439"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-soft hover:border-primary/40 hover:shadow-elegant transition-all group"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground flex-shrink-0 transition-colors">
            <Phone className="size-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">
              {lang === "ar" ? "هاتف" : lang === "en" ? "Phone" : "Téléphone"}
            </div>
            <p className="text-sm font-medium">+216 55 740 439</p>
            <p className="text-sm font-medium">+216 58 411 555</p>
          </div>
        </a>

        {/* Email */}
        <a
          href="mailto:dr.bensoltanawajih@gmail.com"
          className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-soft hover:border-primary/40 hover:shadow-elegant transition-all group"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground flex-shrink-0 transition-colors">
            <Mail className="size-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">Email</div>
            <p className="text-sm font-medium break-all">dr.bensoltanawajih@gmail.com</p>
          </div>
        </a>

        {/* Directions */}
        <a
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 shadow-soft hover:bg-primary hover:text-primary-foreground transition-all group cursor-pointer"
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground flex-shrink-0 group-hover:bg-primary-foreground group-hover:text-primary transition-colors">
            <Navigation className="size-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-primary group-hover:text-primary-foreground uppercase tracking-wide mb-0.5 transition-colors">
              {lang === "ar" ? "الاتجاهات" : lang === "en" ? "Get directions" : "Itinéraire"}
            </div>
            <p className="text-sm font-medium text-primary group-hover:text-primary-foreground transition-colors flex items-center gap-1">
              Google Maps <ExternalLink className="size-3" />
            </p>
          </div>
        </a>
      </div>

      {/* Static fallback text */}
      <p className="text-xs text-center text-muted-foreground">
        {lang === "ar"
          ? "إذا لم يظهر الخريطة، يمكنك "
          : lang === "en"
          ? "If the map doesn't load, you can "
          : "Si la carte ne charge pas, vous pouvez "}
        <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          {lang === "ar" ? "فتحها في خرائط جوجل" : lang === "en" ? "open it in Google Maps" : "l'ouvrir dans Google Maps"}
        </a>
        .
      </p>
    </div>
  );
}
