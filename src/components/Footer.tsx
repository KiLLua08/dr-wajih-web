import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Heart } from "lucide-react";

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-secondary/30 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-4 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-semibold mb-4">
              <div className="grid size-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
                <span className="text-lg font-bold">W</span>
              </div>
              <div>
                <div>Dr. Wajih</div>
                <div className="text-xs text-muted-foreground">Bensoltana</div>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Soins dentaires modernes et de qualite a Menzel Temime.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">{t("nav.home")}</h3>
            <nav className="space-y-2 text-sm">
              <Link to="/" className="text-muted-foreground hover:text-primary">
                {t("nav.home")}
              </Link>
              <Link to="/services" className="text-muted-foreground hover:text-primary">
                {t("nav.services")}
              </Link>
              <Link to="/booking" className="text-muted-foreground hover:text-primary">
                {t("nav.book")}
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Info</h3>
            <nav className="space-y-2 text-sm">
              <Link to="/about" className="text-muted-foreground hover:text-primary">
                {t("nav.about")}
              </Link>
              <Link to="/testimonials" className="text-muted-foreground hover:text-primary">
                {t("nav.testimonials")}
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-primary">
                {t("nav.contact")}
              </Link>
            </nav>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>+216 XX XXX XXXX</p>
              <p>contact@drwajih.tn</p>
              <p>Menzel Temime, Tunisie</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {currentYear} Cabinet Dr. Wajih Bensoltana. Tous droits reserves.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4 md:mt-0">
            Made with <Heart className="size-4 fill-primary text-primary" /> by Lovable
          </div>
        </div>
      </div>
    </footer>
  );
}
