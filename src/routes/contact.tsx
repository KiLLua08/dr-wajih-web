import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/PublicLayout";
import { MapEmbed } from "@/components/MapEmbed";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Cabinet Dr. Wajih Bensoltana" },
      { name: "description", content: "Nous contacter — Rue Mongi Slim, Menzel Temime, Tunisie." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useTranslation();
  const { data: hours = [] } = useQuery({
    queryKey: ["clinic_hours"],
    queryFn: async () => {
      const { data } = await supabase.from("clinic_hours").select("*").order("day_of_week");
      return data ?? [];
    },
  });

  return (
    <PublicLayout>
      <section className="gradient-hero py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold">{t("contact.title")}</h1>
          <p className="mt-3 text-muted-foreground text-lg">{t("contact.subtitle")}</p>
        </div>
      </section>
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card className="shadow-soft">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="size-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-semibold">{t("clinic.name")}</div>
                    <div className="text-sm text-muted-foreground">{t("clinic.address")}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="size-5 text-primary" />
                  <a href={`tel:${t("clinic.phone")}`} className="hover:text-primary">{t("clinic.phone")}</a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="size-5 text-primary" />
                  <a href={`mailto:${t("clinic.email")}`} className="hover:text-primary">{t("clinic.email")}</a>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4 font-semibold">
                  <Clock className="size-5 text-primary" /> {t("contact.hours")}
                </div>
                <ul className="text-sm divide-y divide-border">
                  {hours.map((h: any) => (
                    <li key={h.day_of_week} className="flex justify-between py-2">
                      <span>{t(`contact.days.${h.day_of_week}`)}</span>
                      <span className="text-muted-foreground">
                        {h.is_closed
                          ? t("contact.closed")
                          : `${(h.open_time as string).slice(0, 5)} – ${(h.close_time as string).slice(0, 5)}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          <div>
            <MapEmbed />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}