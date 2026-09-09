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
import { Mail, Phone, MapPin, Clock, Instagram, Loader2 } from "lucide-react";
import { z } from "zod";
import { notifyContact } from "@/lib/notify-booking.server";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Cabinet Dr. Wajih Bensoltana" },
      { name: "description", content: "Prenez contact avec le Cabinet Dr. Wajih Bensoltana à Manzel Tmime." },
    ],
  }),
  component: ContactPage,
});

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(1000),
});

function ContactPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "fr";
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? t("booking.errorGeneric"));
      return;
    }
    setSubmitting(true);
    try {
      await notifyContact({ data: { name: form.name, email: form.email, subject: form.subject, message: form.message } });
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
      toast.success(
        lang === "ar"
          ? "تم إرسال رسالتك بنجاح!"
          : lang === "en"
          ? "Message sent successfully!"
          : "Message envoyé avec succès!"
      );
    } catch (e) {
      console.error(e);
      toast.error(t("booking.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  const contactItems = [
    {
      icon: Phone,
      label: t("contact.phone"),
      content: (
        <div className="space-y-1">
          <a href="tel:+21655740439" className="block text-sm font-medium hover:text-primary transition-colors">
            +216 55 740 439
          </a>
          <a href="tel:+21658411555" className="block text-sm font-medium hover:text-primary transition-colors">
            +216 58 411 555
          </a>
        </div>
      ),
    },
    {
      icon: Mail,
      label: t("contact.email"),
      content: (
        <a
          href="mailto:dr.bensoltanawajih@gmail.com"
          className="text-sm font-medium hover:text-primary transition-colors break-all"
        >
          dr.bensoltanawajih@gmail.com
        </a>
      ),
    },
    {
      icon: MapPin,
      label: t("contact.address"),
      content: (
        <div className="space-y-0.5">
          <p className="text-sm font-medium">Rue Mongi Slim, Manzel Tmime</p>
          <p className="text-xs text-muted-foreground">
            {lang === "ar"
              ? "فوق بيتزيريا ميمو — تونس"
              : lang === "en"
              ? "Above Pizzeria Mimo — Tunisia"
              : "Au-dessus de la Pizzeria Mimo — Tunisie"}
          </p>
        </div>
      ),
    },
    {
      icon: Clock,
      label: t("contact.hours"),
      content: (
        <p className="text-sm font-medium whitespace-pre-line">{t("contact.hoursContent")}</p>
      ),
    },
    {
      icon: Instagram,
      label: "Instagram",
      content: (
        <a
          href="https://www.instagram.com/cabinet_dr_wajih_bensoltana"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          @cabinet_dr_wajih_bensoltana
        </a>
      ),
    },
  ];

  return (
    <PublicLayout>
      <section className="gradient-hero py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl md:text-4xl font-bold">{t("contact.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("contact.subtitle")}</p>
        </div>
      </section>

      {/* Map — full-width featured section */}
      <section className="py-10 bg-secondary/30">
        <div className="mx-auto max-w-6xl px-4">
          <MapEmbed />
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-2">
          {/* Contact info */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">
              {lang === "ar" ? "معلومات الاتصال" : lang === "en" ? "Contact information" : "Coordonnées"}
            </h2>
            {contactItems.map((item) => (
              <Card key={item.label} className="shadow-soft hover:shadow-elegant transition-shadow">
                <CardContent className="p-5">
                  <div className="flex gap-4 items-start">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground flex-shrink-0">
                      <item.icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-1">
                        {item.label}
                      </h3>
                      {item.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact form */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle>
                {lang === "ar" ? "أرسل رسالة" : lang === "en" ? "Send a message" : "Envoyer un message"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sent ? (
                <div className="text-center py-10">
                  <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full gradient-primary text-primary-foreground shadow-elegant">
                    <Mail className="size-8" />
                  </div>
                  <p className="font-semibold text-lg">
                    {lang === "ar" ? "تم الإرسال!" : lang === "en" ? "Sent!" : "Envoyé !"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {lang === "ar"
                      ? "سنرد عليك في أقرب وقت ممكن."
                      : lang === "en"
                      ? "We'll get back to you as soon as possible."
                      : "Nous vous répondrons dans les plus brefs délais."}
                  </p>
                  <Button className="mt-6" variant="outline" onClick={() => setSent(false)}>
                    {lang === "ar" ? "إرسال رسالة أخرى" : lang === "en" ? "Send another" : "Envoyer un autre"}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="contact-name">{t("contact.name")}</Label>
                    <Input
                      id="contact-name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email">{t("contact.email")}</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-subject">{t("contact.subject")}</Label>
                    <Input
                      id="contact-subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-message">{t("contact.message")}</Label>
                    <Textarea
                      id="contact-message"
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
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}
