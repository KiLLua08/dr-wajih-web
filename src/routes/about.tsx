import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — Cabinet Dr. Wajih Bensoltana" },
      { name: "description", content: "Découvrez le cabinet dentaire du Dr. Wajih Bensoltana à Menzel Temime." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useTranslation();
  const icons = [Heart, ShieldCheck, Sparkles];
  return (
    <PublicLayout>
      <section className="gradient-hero py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold">{t("about.title")}</h1>
          <p className="mt-3 text-lg text-primary font-medium">{t("about.subtitle")}</p>
        </div>
      </section>
      <section className="py-14">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-lg leading-relaxed text-foreground/90">{t("about.bio")}</p>
          <h2 className="mt-14 mb-6 text-2xl font-bold">{t("about.values")}</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[1, 2, 3].map((n, i) => {
              const Icon = icons[i];
              return (
                <Card key={n} className="shadow-soft">
                  <CardContent className="p-6">
                    <div className="mb-3 grid size-10 place-items-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="size-5" />
                    </div>
                    <p className="font-medium">{t(`about.value${n}`)}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}