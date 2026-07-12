import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useLang, localized } from "@/lib/lang";
import { Star } from "lucide-react";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Témoignages — Cabinet Dr. Wajih Bensoltana" },
      { name: "description", content: "Ce que nos patients disent du Cabinet Dr. Wajih Bensoltana." },
    ],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const { data: items = [] } = useQuery({
    queryKey: ["testimonials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  return (
    <PublicLayout>
      <section className="gradient-hero py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold">{t("home.testimonialsTitle")}</h1>
        </div>
      </section>
      <section className="py-14">
        <div className="mx-auto max-w-6xl px-4 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((tst: any) => (
            <Card key={tst.id} className="shadow-soft">
              <CardContent className="p-6">
                <div className="flex mb-3">
                  {Array.from({ length: tst.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="italic text-foreground/90">"{localized(tst, "content", lang)}"</p>
                <div className="mt-4 font-semibold">{tst.patient_name}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}