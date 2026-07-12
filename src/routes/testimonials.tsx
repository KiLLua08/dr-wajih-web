import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useLang, localized } from "@/lib/lang";
import { Star } from "lucide-react";

export const Route = createFileRoute("/testimonials")({"head": () => ({"meta": [{"title": "Témoignages — Cabinet Dr. Wajih Bensoltana"}, {"name": "description", "content": "Découvrez les avis de nos patients satisfaits."}]}),"component": TestimonialsPage});

function TestimonialsPage() {
  const { t } = useTranslation();
  const lang = useLang();

  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials-page"],
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
      <section className="gradient-hero py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl md:text-4xl font-bold">{t("testimonials.title")}</h1>
          <p className="mt-2 text-muted-foreground">
            {testimonials.length === 0 ? t("testimonials.noTestimonials") : "Les avis de nos patients"}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          {testimonials.length === 0 ? (
            <Card className="text-center p-12">
              <p className="text-muted-foreground">{t("testimonials.noTestimonials")}</p>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial: any) => (
                <Card key={testimonial.id} className="shadow-soft hover:shadow-elegant transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="size-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/90 italic mb-4">
                      "{localized(testimonial, "content", lang)}"
                    </p>
                    <div className="text-sm font-semibold">{testimonial.patient_name}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
