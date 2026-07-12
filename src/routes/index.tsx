import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useLang, localized } from "@/lib/lang";
import { ShieldCheck, Sparkles, HeartHandshake, Star, ArrowRight, Calendar } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { t } = useTranslation();
  const lang = useLang();

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order");
      return data ?? [];
    },
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials-featured"],
    queryFn: async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(3);
      return data ?? [];
    },
  });

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="gradient-hero">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-xs font-medium text-primary shadow-soft mb-6">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              {t("clinic.tagline")}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight text-foreground">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">{t("home.heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="shadow-elegant">
                <Link to="/booking">
                  <Calendar className="size-4" /> {t("home.cta")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/services">
                  {t("home.learnMore")} <ArrowRight className="size-4 rtl:rotate-180" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="aspect-square rounded-3xl gradient-primary shadow-elegant grid place-items-center text-primary-foreground">
              <svg viewBox="0 0 200 200" className="w-3/5 h-3/5 opacity-90" fill="currentColor">
                <path d="M100 20c-30 0-55 20-55 55 0 15 5 30 12 45 5 10 8 20 8 30 0 15 10 30 20 30s15-15 15-25c0-5 5-10 10-10s10 5 10 10c0 10 5 25 15 25s20-15 20-30c0-10 3-20 8-30 7-15 12-30 12-45 0-35-25-55-55-55z" />
              </svg>
            </div>
            <div className="absolute -bottom-6 -left-6 rtl:-left-auto rtl:-right-6 bg-white rounded-2xl px-5 py-4 shadow-elegant border border-border">
              <div className="text-2xl font-bold text-primary">10+</div>
              <div className="text-xs text-muted-foreground">{lang === "fr" ? "années d'expérience" : lang === "ar" ? "سنوات من الخبرة" : "years of experience"}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("home.whyTitle")}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: ShieldCheck, t: t("home.why1Title"), d: t("home.why1") },
              { icon: Sparkles, t: t("home.why2Title"), d: t("home.why2") },
              { icon: HeartHandshake, t: t("home.why3Title"), d: t("home.why3") },
            ].map((f, i) => (
              <Card key={i} className="border-border/60 shadow-soft hover:shadow-elegant transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground">
                    <f.icon className="size-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{f.t}</h3>
                  <p className="text-muted-foreground text-sm">{f.d}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="py-16 md:py-24 bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">{t("home.servicesTitle")}</h2>
            <Button asChild variant="ghost" size="sm">
              <Link to="/services">
                {t("home.seeAll")} <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s: any) => (
              <Card key={s.id} className="group hover:shadow-elegant transition-all">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {localized(s, "name", lang)}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">{localized(s, "description", lang)}</p>
                  <div className="text-xs text-muted-foreground">{t("services.duration", { min: s.duration_min })}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t("home.testimonialsTitle")}</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((tst: any) => (
                <Card key={tst.id} className="shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex mb-3">
                      {Array.from({ length: tst.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/90 italic">"{localized(tst, "content", lang)}"</p>
                    <div className="mt-4 text-sm font-semibold">{tst.patient_name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-3xl gradient-primary text-primary-foreground p-10 md:p-14 text-center shadow-elegant">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t("home.heroTitle")}</h2>
            <p className="mb-8 opacity-90">{t("home.heroSubtitle")}</p>
            <Button asChild size="lg" variant="secondary" className="shadow-elegant">
              <Link to="/booking">
                <Calendar className="size-4" /> {t("home.cta")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
