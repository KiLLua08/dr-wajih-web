import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import { Award, Zap, Users, Smile, Shield, Star, Calendar } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À Propos — Cabinet Dr. Wajih Bensoltana" },
      { name: "description", content: "Découvrez le Cabinet Dr. Wajih Bensoltana, dentiste à Manzel Tmime, Tunisie." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "fr";

  const pillars = [
    {
      icon: Award,
      title:
        lang === "ar"
          ? "خبرة أكثر من 10 سنوات"
          : lang === "en"
          ? "10+ years of experience"
          : "Plus de 10 ans d'expérience",
      desc:
        lang === "ar"
          ? "تدريب مستمر وشهادات دولية في أحدث تقنيات طب الأسنان."
          : lang === "en"
          ? "Continuous training and international certifications in modern dental techniques."
          : "Formations continues et certifications internationales dans les techniques dentaires modernes.",
    },
    {
      icon: Zap,
      title: t("about.equipment"),
      desc:
        lang === "ar"
          ? "أجهزة تشخيص متطورة وتقنيات علاج طفيفة التوغل."
          : lang === "en"
          ? "Advanced diagnostic equipment and minimally invasive treatment techniques."
          : "Équipement de diagnostic avancé et techniques de traitement minimalement invasives.",
    },
    {
      icon: Shield,
      title:
        lang === "ar"
          ? "السلامة والنظافة"
          : lang === "en"
          ? "Safety & hygiene"
          : "Sécurité et hygiène",
      desc:
        lang === "ar"
          ? "بروتوكولات صارمة لضمان بيئة آمنة ومعقمة لكل مريض."
          : lang === "en"
          ? "Strict protocols to guarantee a safe and sterile environment for every patient."
          : "Protocoles rigoureux pour garantir un environnement sûr et stérilisé pour chaque patient.",
    },
    {
      icon: Users,
      title: t("about.team"),
      desc:
        lang === "ar"
          ? "فريق مدرب ومتفانٍ مكرس لراحتك ورضاك."
          : lang === "en"
          ? "Trained and dedicated staff committed to your comfort and satisfaction."
          : "Personnel qualifié et bienveillant dédié à votre confort et à votre satisfaction.",
    },
    {
      icon: Smile,
      title: t("about.mission"),
      desc:
        lang === "ar"
          ? "خلق ابتسامات صحية وجميلة مع التركيز على راحة المريض."
          : lang === "en"
          ? "Creating healthy, beautiful smiles with a focus on patient well-being."
          : "Créer des sourires sains et magnifiques en mettant l'accent sur le bien-être du patient.",
    },
    {
      icon: Star,
      title:
        lang === "ar"
          ? "رعاية مخصصة"
          : lang === "en"
          ? "Personalized care"
          : "Soins personnalisés",
      desc:
        lang === "ar"
          ? "كل مريض يتلقى خطة علاج مخصصة تناسب احتياجاته الخاصة."
          : lang === "en"
          ? "Every patient receives a treatment plan tailored to their specific needs."
          : "Chaque patient reçoit un plan de traitement adapté à ses besoins spécifiques.",
    },
  ];

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="gradient-hero py-14">
        <div className="mx-auto max-w-6xl px-4 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur px-3 py-1 text-xs font-medium text-primary shadow-soft mb-6">
              <span className="size-2 rounded-full bg-primary" />
              Médecin Dentiste — Manzel Tmime
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{t("about.title")}</h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">{t("about.intro")}</p>
            <p className="mt-3 text-muted-foreground leading-relaxed">{t("about.experience")}</p>
            <div className="mt-8 flex gap-3 flex-wrap">
              <Button asChild size="lg" className="shadow-elegant">
                <Link to="/booking">
                  <Calendar className="size-4" />
                  {t("home.cta")}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">{t("nav.contact")}</Link>
              </Button>
            </div>
          </div>

          {/* Doctor card */}
          <div className="relative hidden md:block">
            <div className="rounded-3xl gradient-primary shadow-elegant p-8 text-primary-foreground text-center">
              <div className="mx-auto mb-4 grid size-24 place-items-center rounded-full bg-white/20 shadow-soft">
                <svg viewBox="0 0 200 200" className="w-14 h-14 opacity-90" fill="currentColor">
                  <path d="M100 20c-30 0-55 20-55 55 0 15 5 30 12 45 5 10 8 20 8 30 0 15 10 30 20 30s15-15 15-25c0-5 5-10 10-10s10 5 10 10c0 10 5 25 15 25s20-15 20-30c0-10 3-20 8-30 7-15 12-30 12-45 0-35-25-55-55-55z" />
                </svg>
              </div>
              <div className="text-2xl font-bold">Dr. Wajih Bensoltana</div>
              <div className="text-primary-foreground/80 text-sm mt-1">Médecin Dentiste</div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/15 p-3">
                  <div className="text-2xl font-bold">10+</div>
                  <div className="text-xs text-primary-foreground/70">
                    {lang === "ar" ? "سنوات خبرة" : lang === "en" ? "years exp." : "ans d'exp."}
                  </div>
                </div>
                <div className="rounded-xl bg-white/15 p-3">
                  <div className="text-2xl font-bold">5★</div>
                  <div className="text-xs text-primary-foreground/70">
                    {lang === "ar" ? "تقييم المرضى" : lang === "en" ? "patient rating" : "avis patients"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {lang === "ar" ? "مهمتنا وقيمنا" : lang === "en" ? "Our mission & values" : "Notre mission & nos valeurs"}
            </h2>
            <p className="text-muted-foreground">{t("about.mission")}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <Card key={i} className="shadow-soft hover:shadow-elegant transition-all group">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-soft group-hover:scale-110 transition-transform">
                    <p.icon className="size-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{p.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary/40">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            {lang === "ar"
              ? "هل أنت مستعد لزيارتنا؟"
              : lang === "en"
              ? "Ready to visit us?"
              : "Prêt à nous rendre visite ?"}
          </h2>
          <p className="text-muted-foreground mb-8">{t("home.heroSubtitle")}</p>
          <Button asChild size="lg" className="shadow-elegant">
            <Link to="/booking">
              <Calendar className="size-4" />
              {t("home.cta")}
            </Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
}
