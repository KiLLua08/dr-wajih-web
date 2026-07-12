import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useLang, localized } from "@/lib/lang";
import { Clock } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Cabinet Dr. Wajih Bensoltana" },
      { name: "description", content: "Découvrez nos services dentaires : consultations, soins, esthétique, orthodontie et plus." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order");
      return data ?? [];
    },
  });

  return (
    <PublicLayout>
      <section className="gradient-hero py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold">{t("services.title")}</h1>
          <p className="mt-3 text-muted-foreground text-lg max-w-2xl">{t("services.subtitle")}</p>
        </div>
      </section>
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s: any) => (
            <Card key={s.id} className="hover:shadow-elegant transition-shadow">
              <CardContent className="p-6 flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-2">{localized(s, "name", lang)}</h3>
                <p className="text-sm text-muted-foreground flex-1">{localized(s, "description", lang)}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5" /> {t("services.duration", { min: s.duration_min })}
                  </span>
                  <Button asChild size="sm" variant="ghost">
                    <Link to="/booking" search={{ service: s.id } as any}>{t("services.bookThis")}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}