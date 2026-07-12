import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { toast } from "sonner";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapEmbed } from "@/components/MapEmbed";
import { Mail, Phone, MapPin, Clock, Loader2 } from "lucide-react";
import { z } from "zod";

export const Route = createFileRoute("/contact")({"head": () => ({"meta": [{"title": "Contact — Cabinet Dr. Wajih Bensoltana"}, {"name": "description", "content": "Prenez contact avec le Cabinet Dr. Wajih Bensoltana."}]}),"component": ContactPage});

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(1000),
});

function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? t("booking.errorGeneric"));
      return;
    }

    setSubmitting(true);
    try {
      // In a real app, you'd send this to a backend API or email service
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t("contact.send") + " réussi!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (e) {
      toast.error(t("booking.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <section className="gradient-hero py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl md:text-4xl font-bold">{t("contact.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("contact.subtitle")}</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground flex-shrink-0">
                    <Phone className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("contact.phone")}</h3>
                    <p className="text-sm text-muted-foreground">+216 XX XXX XXXX</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground flex-shrink-0">
                    <Mail className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("contact.email")}</h3>
                    <p className="text-sm text-muted-foreground">contact@drwajih.tn</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground flex-shrink-0">
                    <MapPin className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("contact.address")}</h3>
                    <p className="text-sm text-muted-foreground">Menzel Temime, Tunisie</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-accent text-accent-foreground flex-shrink-0">
                    <Clock className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{t("contact.hours")}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{t("contact.hoursContent")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("contact.message")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>{t("contact.name")}</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>{t("contact.email")}</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>{t("contact.subject")}</Label>
                  <Input
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label>{t("contact.message")}</Label>
                  <Textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting && <Loader2 className="size-4 animate-spin mr-2" />}
                  {t("contact.send")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4">
          <MapEmbed />
        </div>
      </section>
    </PublicLayout>
  );
}
