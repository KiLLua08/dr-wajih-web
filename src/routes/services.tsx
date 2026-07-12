import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useLang, localized } from "@/lib/lang";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/services")({"head": () => ({"meta": [{"title": "Services — Cabinet Dr. Wajih Bensoltana"}, {"name": "description", "content": "Découvrez nos services dentaires complets à Menzel Temime."}]}),"component": ServicesPage});

function ServicesPage() {
  const { t } = useTranslation();
  const lang = useLang();

  const { data: services = [] } = useQuery({
    queryKey: ["services-page"],
    queryFn: async () => {
      const { data } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  return (
    <PublicLayout>
      <section className="gradient-hero py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl md:text-4xl font-bold">{t("home.servicesTitle")}</h1>
          <p className="mt-2 text-muted-foreground">{t("booking.subtitle")}</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service: any) => (
              <Card key={service.id} className="group hover:shadow-elegant transition-all">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Heart className="size-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {localized(service, "name", lang)}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {localized(service, "description", lang)}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {t("services.duration", { min: service.duration_min })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
