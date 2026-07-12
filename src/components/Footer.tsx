import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border bg-secondary/40 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="font-semibold mb-3">{t("clinic.name")}</h3>
          <p className="text-sm text-muted-foreground">{t("clinic.tagline")}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">{t("footer.quickLinks")}</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/services" className="hover:text-primary">{t("nav.services")}</Link></li>
            <li><Link to="/about" className="hover:text-primary">{t("nav.about")}</Link></li>
            <li><Link to="/booking" className="hover:text-primary">{t("nav.book")}</Link></li>
            <li><Link to="/contact" className="hover:text-primary">{t("nav.contact")}</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">{t("footer.contactUs")}</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><MapPin className="size-4 mt-0.5 text-primary shrink-0" />{t("clinic.address")}</li>
            <li className="flex items-center gap-2"><Phone className="size-4 text-primary" />{t("clinic.phone")}</li>
            <li className="flex items-center gap-2"><Mail className="size-4 text-primary" />{t("clinic.email")}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("clinic.name")} — {t("footer.rights")}
      </div>
    </footer>
  );
}