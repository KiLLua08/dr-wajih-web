import { Link, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useAuth } from "./AuthProvider";

export function Header() {
  const { t } = useTranslation();
  const { user, isAdmin, signOut } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/services", label: t("nav.services") },
    { to: "/about", label: t("nav.about") },
    { to: "/testimonials", label: t("nav.testimonials") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <div className="grid size-9 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft">
            <span className="text-lg font-bold">W</span>
          </div>
          <span className="hidden sm:inline text-sm leading-tight">
            <span className="block">Dr. Wajih</span>
            <span className="block text-xs text-muted-foreground">Bensoltana</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-primary" }}
              className="text-foreground/80 hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {user ? (
            <>
              {isAdmin && (
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <Link to="/admin">{t("nav.admin")}</Link>
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
                onClick={async () => {
                  await signOut();
                  router.navigate({ to: "/" });
                }}
              >
                {t("nav.signOut")}
              </Button>
            </>
          ) : null}
          <Button asChild size="sm" className="hidden sm:inline-flex shadow-soft">
            <Link to="/booking">{t("nav.book")}</Link>
          </Button>
          <button
            className="md:hidden inline-flex size-9 items-center justify-center rounded-md hover:bg-muted"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-2">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2 text-foreground/80 hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
            <Button asChild size="sm" className="mt-2">
              <Link to="/booking" onClick={() => setOpen(false)}>
                {t("nav.book")}
              </Link>
            </Button>
            {user ? (
              <>
                {isAdmin && (
                  <Button asChild variant="outline" size="sm">
                    <Link to="/admin" onClick={() => setOpen(false)}>
                      {t("nav.admin")}
                    </Link>
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    setOpen(false);
                    await signOut();
                    router.navigate({ to: "/" });
                  }}
                >
                  {t("nav.signOut")}
                </Button>
              </>
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth" onClick={() => setOpen(false)}>
                  {t("nav.signIn")}
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}