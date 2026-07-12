import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { PublicLayout } from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { useLang, localized } from "@/lib/lang";
import { getAvailableSlots } from "@/lib/slots";
import { toISODate, fmtDate } from "@/lib/format";
import { Check, Loader2 } from "lucide-react";

export const Route = createFileRoute("/booking")({
  head: () => ({
    meta: [
      { title: "Rendez-vous — Cabinet Dr. Wajih Bensoltana" },
      { name: "description", content: "Prenez rendez-vous en ligne au Cabinet Dr. Wajih Bensoltana." },
    ],
  }),
  component: BookingPage,
});

const patientSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(6).max(30),
  notes: z.string().trim().max(500).optional(),
});

function BookingPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const [step, setStep] = useState(1);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState<string | null>(null);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await supabase.from("services").select("*").eq("is_active", true).order("sort_order");
      return data ?? [];
    },
  });

  const service = useMemo(() => services.find((s: any) => s.id === serviceId), [services, serviceId]);

  const iso = date ? toISODate(date) : null;
  const { data: slots = [], isFetching: slotsLoading } = useQuery({
    queryKey: ["slots", iso, service?.duration_min],
    enabled: !!iso && !!service,
    queryFn: () => getAvailableSlots(iso!, service!.duration_min),
  });

  useEffect(() => {
    setTime(null);
  }, [iso, serviceId]);

  async function submit() {
    const parsed = patientSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? t("booking.errorGeneric"));
      return;
    }
    if (!serviceId || !iso || !time) return;
    setSubmitting(true);
    try {
      const { data: patient, error: pErr } = await supabase
        .from("patients")
        .insert({
          full_name: parsed.data.fullName,
          email: parsed.data.email,
          phone: parsed.data.phone,
        })
        .select("id")
        .single();
      if (pErr) throw pErr;

      const { error: aErr } = await supabase.from("appointments").insert({
        patient_id: patient.id,
        service_id: serviceId,
        appointment_date: iso,
        appointment_time: time,
        status: "pending",
        language: lang,
        patient_notes: parsed.data.notes || null,
      });
      if (aErr) {
        if ((aErr as any).code === "23505") {
          toast.error(t("booking.slotTaken"));
          setTime(null);
          setStep(2);
          return;
        }
        throw aErr;
      }
      setDone(true);
      setStep(4);
    } catch (e) {
      console.error(e);
      toast.error(t("booking.errorGeneric"));
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStep(1); setServiceId(null); setDate(undefined); setTime(null);
    setForm({ fullName: "", email: "", phone: "", notes: "" }); setDone(false);
  }

  return (
    <PublicLayout>
      <section className="gradient-hero py-14">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="text-3xl md:text-4xl font-bold">{t("booking.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("booking.subtitle")}</p>
          <Stepper step={step} />
        </div>
      </section>
      <section className="py-10">
        <div className="mx-auto max-w-4xl px-4">
          <Card className="shadow-soft">
            <CardContent className="p-6 md:p-8">
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">{t("booking.chooseService")}</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {services.map((s: any) => (
                      <button
                        key={s.id}
                        onClick={() => setServiceId(s.id)}
                        className={`text-start border rounded-xl p-4 transition-all ${
                          serviceId === s.id
                            ? "border-primary bg-accent/40 shadow-soft"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-semibold">{localized(s, "name", lang)}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {t("services.duration", { min: s.duration_min })}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button disabled={!serviceId} onClick={() => setStep(2)}>{t("booking.next")}</Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h2 className="text-xl font-semibold mb-4">{t("booking.chooseDate")}</h2>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < new Date(new Date().toDateString())}
                      className="rounded-md border"
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">{t("booking.chooseTime")}</h2>
                    {!date ? (
                      <p className="text-sm text-muted-foreground">{t("booking.chooseDate")}</p>
                    ) : slotsLoading ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" /> ...
                      </div>
                    ) : slots.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t("booking.noSlots")}</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {slots.map((s) => (
                          <button
                            key={s.time}
                            onClick={() => setTime(s.time)}
                            className={`rounded-md border py-2 text-sm transition-all ${
                              time === s.time
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            {s.time}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="md:col-span-2 flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>{t("booking.back")}</Button>
                    <Button disabled={!date || !time} onClick={() => setStep(3)}>{t("booking.next")}</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">{t("booking.step3")}</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label>{t("booking.fullName")}</Label>
                      <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                    </div>
                    <div>
                      <Label>{t("booking.email")}</Label>
                      <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div>
                      <Label>{t("booking.phone")}</Label>
                      <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label>{t("booking.notes")}</Label>
                      <Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary/60 p-4 text-sm">
                    <div><strong>{service && localized(service, "name", lang)}</strong></div>
                    <div className="text-muted-foreground">
                      {date && fmtDate(date, lang)} — {time}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>{t("booking.back")}</Button>
                    <Button onClick={submit} disabled={submitting}>
                      {submitting && <Loader2 className="size-4 animate-spin" />}
                      {t("booking.submit")}
                    </Button>
                  </div>
                </div>
              )}

              {step === 4 && done && (
                <div className="text-center py-8">
                  <div className="mx-auto grid size-16 place-items-center rounded-full gradient-primary text-primary-foreground shadow-elegant mb-4">
                    <Check className="size-8" />
                  </div>
                  <h2 className="text-2xl font-bold">{t("booking.success")}</h2>
                  <p className="text-muted-foreground mt-2">{t("booking.successDetail")}</p>
                  <Button className="mt-6" onClick={reset} variant="outline">
                    {t("booking.bookAnother")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}

function Stepper({ step }: { step: number }) {
  const { t } = useTranslation();
  const labels = [t("booking.step1"), t("booking.step2"), t("booking.step3"), t("booking.step4")];
  return (
    <div className="mt-6 flex items-center gap-2 flex-wrap">
      {labels.map((l, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <div key={l} className="flex items-center gap-2">
            <div
              className={`size-7 rounded-full grid place-items-center text-xs font-semibold ${
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <Check className="size-4" /> : n}
            </div>
            <span className={`text-sm ${active ? "font-medium" : "text-muted-foreground"}`}>{l}</span>
            {i < labels.length - 1 && <span className="mx-1 text-muted-foreground">›</span>}
          </div>
        );
      })}
    </div>
  );
}