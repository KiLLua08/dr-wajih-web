// Server-only email via Resend (never import in client components directly
// except via createServerFn). Uses native fetch so no extra dep needed.

interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, replyTo, from }: SendEmailParams) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY missing — skipping send to", to);
    return { skipped: true, reason: "missing_api_key" };
  }

  const fromAddr = from || process.env.RESEND_FROM || "Cabinet Dr. Wajih <onboarding@resend.dev>";
  const replyToAddr = replyTo || process.env.RESEND_REPLY_TO || undefined;

  // Resend falls back to onboarding@resend.dev if domain not verified.
  // We try configured FROM first, if it fails (domain not verified) we retry once with onboarding.
  const attempt = async (fromAddress: string) => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyToAddr ? { reply_to: replyToAddr } : {}),
      }),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  };

  let result = await attempt(fromAddr);
  if (!result.ok && fromAddr !== "onboarding@resend.dev" && result.data?.message?.includes("domain")) {
    console.warn(`[email] From domain not verified (${fromAddr}), retrying with onboarding@resend.dev`, result.data);
    result = await attempt("Cabinet Dr. Wajih <onboarding@resend.dev>");
  }

  if (!result.ok) {
    console.error("[email] Resend failed", result.status, result.data);
    throw new Error(`Email send failed: ${result.status} ${JSON.stringify(result.data)}`);
  }

  console.log("[email] Sent", { to, subject, id: result.data?.id });
  return result.data;
}

// ---------- Templates ----------
const baseStyles = `
  font-family: Inter, system-ui, -apple-system, sans-serif;
  line-height: 1.6; color: #0f172a; max-width: 600px; margin: 0 auto;
`;
const headerHtml = `
  <div style="background: linear-gradient(135deg, #0f766e 0%, #0891b2 100%); padding: 28px; border-radius: 16px 16px 0 0; text-align: center;">
    <div style="display:inline-grid; place-items:center; width:48px;height:48px; background:rgba(255,255,255,.15); border-radius:12px; color:white; font-weight:800; font-size:20px; margin-bottom:10px;">W</div>
    <div style="color:white; font-weight:700; font-size:18px;">Cabinet Dr. Wajih Bensoltana</div>
    <div style="color:rgba(255,255,255,.85); font-size:13px;">Médecin Dentiste — Menzel Temime</div>
  </div>
`;

export function bookingPatientEmail({
  patientName,
  serviceName,
  date,
  time,
  lang,
}: {
  patientName: string;
  serviceName: string;
  date: string;
  time: string;
  lang: string;
}) {
  const isAr = lang === "ar";
  const isEn = lang === "en";
  const dir = isAr ? "rtl" : "ltr";
  const title = isAr ? "تم استلام طلب موعدك" : isEn ? "Your appointment request received" : "Votre demande de rendez-vous reçue";
  const intro = isAr
    ? `مرحباً ${patientName}،`
    : isEn
      ? `Hello ${patientName},`
      : `Bonjour ${patientName},`;
  const body = isAr
    ? `شكراً لحجزك في عيادة الدكتور وجيه بن سلطانة. تم استلام طلبك وسيؤكد فريقنا الموعد قريباً.`
    : isEn
      ? `Thank you for booking at Dr. Wajih Bensoltana clinic. We've received your request and our team will confirm shortly.`
      : `Merci d'avoir réservé au cabinet Dr. Wajih Bensoltana. Nous avons bien reçu votre demande et notre équipe va la confirmer rapidement.`;
  const detailsLabel = isAr ? "تفاصيل الموعد" : isEn ? "Appointment details" : "Détails du rendez-vous";
  const serviceLabel = isAr ? "الخدمة" : isEn ? "Service" : "Service";
  const dateLabel = isAr ? "التاريخ" : isEn ? "Date" : "Date";
  const timeLabel = isAr ? "الوقت" : isEn ? "Time" : "Heure";
  const statusNote = isAr
    ? "الحالة: قيد الانتظار — سنتواصل معك عبر الهاتف/الإيميل للتأكيد."
    : isEn
      ? "Status: pending — we'll contact you by phone/email to confirm."
      : "Statut : en attente — nous vous contacterons par téléphone/email pour confirmer.";
  const whatsappNote = isAr
    ? "للاستعجال: تواصل عبر واتساب 55 740 439"
    : isEn
      ? "Need faster reply? WhatsApp us at +216 55 740 439"
      : "Besoin d'une réponse rapide ? WhatsApp au 55 740 439";
  const footer = isAr
    ? "Rue Mongi Slim, Manzel Tmime — فوق بيتزيريا ميمو<br>+216 55 740 439 · dr.bensoltanawajih@gmail.com"
    : isEn
      ? "Rue Mongi Slim, Manzel Tmime — Above Pizzeria Mimo<br>+216 55 740 439 · dr.bensoltanawajih@gmail.com"
      : "Rue Mongi Slim, Manzel Tmime — Au-dessus de la Pizzeria Mimo<br>+216 55 740 439 · dr.bensoltanawajih@gmail.com";

  return `
  <div dir="${dir}" style="${baseStyles}">
    ${headerHtml}
    <div style="background:white; border:1px solid #e2e8f0; border-top:0; border-radius:0 0 16px 16px; padding:28px;">
      <h1 style="margin:0 0 12px; font-size:20px;">${title}</h1>
      <p style="margin:0 0 10px;">${intro}</p>
      <p style="margin:0 0 18px; color:#475569;">${body}</p>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; margin:16px 0;">
        <div style="font-weight:600; font-size:13px; text-transform:uppercase; letter-spacing:.06em; color:#64748b; margin-bottom:8px;">${detailsLabel}</div>
        <div><strong>${serviceLabel}:</strong> ${serviceName}</div>
        <div><strong>${dateLabel}:</strong> ${date}</div>
        <div><strong>${timeLabel}:</strong> ${time}</div>
        <div style="margin-top:10px; color:#0f766e; font-size:13px;">${statusNote}</div>
      </div>
      <p style="font-size:13px; color:#475569; background:#ecfdf5; border:1px solid #a7f3d0; padding:10px 12px; border-radius:10px;">${whatsappNote} · <a href="https://wa.me/21655740439" style="color:#0f766e; font-weight:600;">WhatsApp</a></p>
      <hr style="border:0; border-top:1px solid #e2e8f0; margin:18px 0;" />
      <p style="font-size:12px; color:#64748b; text-align:center;">${footer}</p>
    </div>
  </div>`;
}

export function bookingClinicEmail({
  patientName,
  patientEmail,
  patientPhone,
  patientNotes,
  serviceName,
  date,
  time,
  lang,
}: {
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientNotes?: string;
  serviceName: string;
  date: string;
  time: string;
  lang: string;
}) {
  return `
  <div style="${baseStyles}">
    ${headerHtml}
    <div style="background:white; border:1px solid #e2e8f0; border-top:0; border-radius:0 0 16px 16px; padding:28px;">
      <h1 style="margin:0 0 6px; font-size:20px;">🗓 Nouvelle demande — ${serviceName}</h1>
      <p style="margin:0 0 16px; color:#475569;">Un patient vient de réserver en <strong>${lang}</strong> — statut <span style="color:#d97706; font-weight:600;">pending</span>. À confirmer dans <a href="https://drwajihbensoltana.tn/admin" style="color:#0f766e;">/admin</a>.</p>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px;">
        <div style="display:grid; gap:6px;">
          <div><strong>Patient:</strong> ${patientName}</div>
          <div><strong>Email:</strong> <a href="mailto:${patientEmail}">${patientEmail}</a> &nbsp; <strong>Tél:</strong> <a href="tel:${patientPhone}">${patientPhone}</a> &nbsp; <a href="https://wa.me/${patientPhone.replace(/[^0-9]/g,"")}" style="color:#059669;">WhatsApp</a></div>
          <div><strong>Service:</strong> ${serviceName}</div>
          <div><strong>Date:</strong> ${date} — <strong>${time}</strong></div>
          ${patientNotes ? `<div style="margin-top:8px; padding:10px; background:white; border:1px solid #e2e8f0; border-radius:8px;"><strong>Notes:</strong> ${patientNotes}</div>` : ""}
        </div>
      </div>
      <p style="margin-top:14px; font-size:13px;"><a href="https://drwajihbensoltana.tn/admin" style="display:inline-block; background:#0f766e; color:white; padding:10px 16px; border-radius:999px; text-decoration:none; font-weight:600;">Ouvrir /admin → Confirmer</a></p>
      <hr style="border:0; border-top:1px solid #e2e8f0; margin:18px 0;" />
      <p style="font-size:12px; color:#64748b; text-align:center;">Cabinet Dr. Wajih — Rue Mongi Slim, Manzel Tmime</p>
    </div>
  </div>`;
}

export function contactClinicEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  return `
  <div style="${baseStyles}">
    ${headerHtml}
    <div style="background:white; border:1px solid #e2e8f0; border-top:0; border-radius:0 0 16px 16px; padding:28px;">
      <h1 style="margin:0 0 8px;">✉️ Nouveau message — ${subject}</h1>
      <p style="color:#475569;">De <strong>${name}</strong> &lt;<a href="mailto:${email}">${email}</a>&gt;</p>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; white-space:pre-wrap;">${message.replace(/</g,"&lt;")}</div>
      <p style="margin-top:14px;"><a href="mailto:${email}?subject=Re:%20${encodeURIComponent(subject)}" style="display:inline-block; background:#0f766e; color:white; padding:10px 16px; border-radius:999px; text-decoration:none; font-weight:600;">Répondre à ${name}</a></p>
    </div>
  </div>`;
}
