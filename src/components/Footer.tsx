import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Phone, Mail, MapPin, Instagram } from "lucide-react";

export function Footer() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "fr";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-secondary/30 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-4 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-semibold mb-4">
              <div className="grid size-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
                <span className="text-lg font-bold">W</span>
              </div>
              <div>
                <div className="text-sm font-semibold">Dr. Wajih Bensoltana</div>
                <div className="text-xs text-muted-foreground">Médecin Dentiste</div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {lang === "ar"
                ? "عيادة أسنان حديثة في منزل تيمة، تونس."
                : lang === "en"
                ? "Modern dental clinic in Manzel Tmime, Tunisia."
                : "Cabinet dentaire moderne à Manzel Tmime, Tunisie."}
            </p>
            <a
              href="https://www.instagram.com/cabinet_dr_wajih_bensoltana"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              <Instagram className="size-4" />
              @cabinet_dr_wajih_bensoltana
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
              {lang === "ar" ? "روابط" : lang === "en" ? "Pages" : "Navigation"}
            </h3>
            <nav className="space-y-2 text-sm flex flex-col">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                {t("nav.home")}
              </Link>
              <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                {t("nav.services")}
              </Link>
              <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                {t("nav.about")}
              </Link>
              <Link to="/testimonials" className="text-muted-foreground hover:text-primary transition-colors">
                {t("nav.testimonials")}
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                {t("nav.contact")}
              </Link>
              <Link to="/booking" className="text-primary font-medium hover:underline transition-colors">
                {t("nav.book")}
              </Link>
            </nav>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
              {t("contact.hours")}
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="whitespace-pre-line">{t("contact.hoursContent")}</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wide text-muted-foreground">
              {t("contact.title")}
            </h3>
            <div className="space-y-3 text-sm">
              <a
                href="tel:+21655740439"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="size-4 shrink-0" />
                +216 55 740 439
              </a>
              <a
                href="tel:+21658411555"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="size-4 shrink-0" />
                +216 58 411 555
              </a>
              <a
                href="mailto:dr.bensoltanawajih@gmail.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="size-4 shrink-0" />
                dr.bensoltanawajih@gmail.com
              </a>
              <div className="flex items-start gap-2 text-muted-foreground">
                <MapPin className="size-4 shrink-0 mt-0.5" />
                <span>
                  Rue Mongi Slim, Manzel Tmime
                  <br />
                  <span className="text-xs">
                    {lang === "ar"
                      ? "فوق بيتزيريا ميمو"
                      : lang === "en"
                      ? "Above Pizzeria Mimo"
                      : "Au-dessus de la Pizzeria Mimo"}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-start">
            © {currentYear} Cabinet Dr. Wajih Bensoltana.{" "}
            {lang === "ar" ? "جميع الحقوق محفوظة." : lang === "en" ? "All rights reserved." : "Tous droits réservés."}
          </p>
          <p className="text-xs text-muted-foreground">
            {lang === "ar" ? "مطور بعناية" : lang === "en" ? "Crafted with care" : "Conçu avec soin"}
          </p>
        </div>
      </div>
    </footer>
  );
}
