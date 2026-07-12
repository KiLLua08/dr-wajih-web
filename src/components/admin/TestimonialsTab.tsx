import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  patient_name: string;
  content_fr: string;
  content_ar: string;
  rating: number;
  is_published: boolean;
}

export default function TestimonialsTab() {
  const { t } = useTranslation();

  const { data: testimonials = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const togglePublish = async (id: string, isPublished: boolean) => {
    try {
      await supabase
        .from("testimonials")
        .update({ is_published: !isPublished })
        .eq("id", id);
      refetch();
      toast.success(t("admin.updated"));
    } catch (e) {
      toast.error(t("admin.error"));
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await supabase.from("testimonials").delete().eq("id", id);
      refetch();
      toast.success(t("admin.deleted"));
    } catch (e) {
      toast.error(t("admin.error"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin.testimonialsTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            {t("admin.noTestimonials")}
          </p>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial: any) => (
              <div
                key={testimonial.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold">{testimonial.patient_name}</div>
                    <div className="text-sm text-muted-foreground">
                      Rating: {"★".repeat(testimonial.rating)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        togglePublish(testimonial.id, testimonial.is_published)
                      }
                      className={`${
                        testimonial.is_published
                          ? "text-primary"
                          : "text-muted-foreground"
                      } hover:text-primary`}
                    >
                      {testimonial.is_published ? (
                        <Check className="size-4" />
                      ) : (
                        <X className="size-4" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteTestimonial(testimonial.id)}
                      className="text-destructive hover:text-destructive/80"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-xs text-muted-foreground mb-1">
                    FR:
                  </div>
                  <p className="text-sm italic">"{testimonial.content_fr}"</p>
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-xs text-muted-foreground mb-1">
                    AR:
                  </div>
                  <p className="text-sm italic">"{testimonial.content_ar}"</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
