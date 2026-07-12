import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Users, Zap, Smile } from "lucide-react";

export const Route = createFileRoute("/about")({"head": () => ({"meta": [{"title": "À Propos — Cabinet Dr. Wajih Bensoltana"}, {"name": "description", "content": "Découvrez le Cabinet Dr. Wajih Bensoltana et notre équipe."}]}),"component": AboutPage});

function AboutPage() {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <section className="gradient-hero py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl md:text-4xl font-bold">{t("about.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("about.intro")}</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 space-y-12">
          <div className="prose prose-sm max-w-none">
            <p className="text-lg text-muted-foreground">{t("about.experience")}</p>
            <p className="text-lg text-muted-foreground">{t("about.mission")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                  <Award className="size-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t("about.experience")}</h3>
                <p className="text-sm text-muted-foreground">
                  Formations continues et certifications internationales dans les techniques dentaires modernes.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                  <Zap className="size-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t("about.equipment")}</h3>
                <p className="text-sm text-muted-foreground">
                  Équipement de diagnostic avancé et techniques de traitement minimalement invasives.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                  <Users className="size-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t("about.team")}</h3>
                <p className="text-sm text-muted-foreground">
                  Personnel qualifié et bienveillant dédié à votre confort et à votre satisfaction.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
                  <Smile className="size-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{t("about.mission")}</h3>
                <p className="text-sm text-muted-foreground">
                  Créer des sourires sains et magnifiques en mettant l'accent sur le bien-être du patient.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
