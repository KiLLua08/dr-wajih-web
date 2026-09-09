import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const bookingNotifySchema = z.object({
  patientName: z.string().min(2).max(120),
  patientEmail: z.string().email().max(200),
  patientPhone: z.string().min(6).max(30),
  patientNotes: z.string().max(500).optional().nullable(),
  serviceName: z.string().min(1).max(200),
  date: z.string().min(1), // human formatted
  isoDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  lang: z.enum(["fr", "en", "ar"]).default("fr"),
});

export const notifyBooking = createServerFn({ method: "POST" })
  .validator((data: unknown) => bookingNotifySchema.parse(data))
  .handler(async ({ data }) => {
    const { sendEmail, bookingPatientEmail, bookingClinicEmail } = await import("./email.server");
    const { patientName, patientEmail, patientPhone, patientNotes, serviceName, date, time, lang } = data;

    // Patient email (localized) — always try, even with onboarding@ fallback
    const patientHtml = bookingPatientEmail({ patientName, serviceName, date, time, lang });
    const patientSubject =
      lang === "ar" ? "تم استلام طلب موعدك — عيادة الدكتور وجيه" : lang === "en" ? "Your appointment request — Dr. Wajih clinic" : "Votre demande de rendez-vous — Cabinet Dr. Wajih";

    // Clinic notification
    const clinicHtml = bookingClinicEmail({ patientName, patientEmail, patientPhone, patientNotes: patientNotes || undefined, serviceName, date, time, lang });
    const clinicSubject = `🗓 ${serviceName} — ${patientName} — ${date} ${time}`;

    // Fire both in parallel, but don't fail booking if email fails (log only)
    const results: any = {};
    try {
      results.patient = await sendEmail({ to: patientEmail, subject: patientSubject, html: patientHtml });
    } catch (e) {
      console.error("[notifyBooking] patient email failed", e);
      results.patientError = String(e);
    }
    try {
      // Clinic inbox — TESTING: never hit owner's dr...@gmail during dev
      // Set CLINIC_EMAIL in env to rayen08yako@gmail.com for testing; fallback to ADMIN_EMAIL
      const clinicTo =
        process.env.CLINIC_EMAIL ||
        process.env.RESEND_REPLY_TO ||
        process.env.ADMIN_EMAIL ||
        "rayen08yako@gmail.com";
      results.clinic = await sendEmail({ to: clinicTo, subject: clinicSubject, html: clinicHtml, replyTo: patientEmail });
      // Also CC admin if different and explicitly set
      if (process.env.ADMIN_EMAIL && process.env.ADMIN_EMAIL !== clinicTo) {
        try {
          results.admin = await sendEmail({ to: process.env.ADMIN_EMAIL!, subject: `[CC] ${clinicSubject}`, html: clinicHtml, replyTo: patientEmail });
        } catch {}
      }
    } catch (e) {
      console.error("[notifyBooking] clinic email failed", e);
      results.clinicError = String(e);
    }

    return { ok: true, ...results };
  });

const contactNotifySchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.string().min(3).max(120),
  message: z.string().min(10).max(1000),
});

export const notifyContact = createServerFn({ method: "POST" })
  .validator((data: unknown) => contactNotifySchema.parse(data))
  .handler(async ({ data }) => {
    const { sendEmail, contactClinicEmail } = await import("./email.server");
    const { name, email, subject, message } = data;
    const html = contactClinicEmail({ name, email, subject, message });
    const clinicTo = process.env.CLINIC_EMAIL || process.env.RESEND_REPLY_TO || process.env.ADMIN_EMAIL || "rayen08yako@gmail.com";
    const result = await sendEmail({ to: clinicTo, subject: `✉️ Contact: ${subject} — ${name}`, html, replyTo: email });
    return { ok: true, id: (result as any)?.id };
  });
