## Cabinet Dr. Wajih Bensoltana — Dental Clinic Website

A production-ready bilingual+ (FR/EN/AR-RTL) marketing site and admin dashboard with real appointment booking backed by Lovable Cloud (Supabase/Postgres).

### Assumptions (please correct if wrong)
- **Cloud backend**: I'll enable Lovable Cloud (managed Supabase) for DB, auth, and email. OK?
- **Admin account**: I'll create the schema + role system; you'll sign up once and I'll grant you `admin` via SQL. Share the email you'll use, or I'll seed a placeholder for you to change.
- **Email**: appointment confirmations via Lovable Emails. Requires a verified sender domain — I'll scaffold templates now and prompt you to set up the domain in a follow-up step (auth emails still work with default sender).
- **Google Maps**: I'll embed via iframe (no API key needed) centered on Rue Mongi Slim, Menzel Temime, using your provided share link, plus a "Directions" button opening Google Maps. If you want an interactive JS map with markers, we can add the Google Maps connector later.
- **Services list & clinic hours**: I'll use standard dental services (consultation, cleaning, whitening, orthodontics, implants, pediatric, emergency) and Mon–Sat 9:00–18:00 with 30-min slots, closed Sunday. Editable in DB later.
- **Booking approval flow**: patients book → status `pending` → admin approves/rejects/reschedules → confirmation email sent on approval. Double-booking prevented via DB unique constraint on `(appointment_date, appointment_time)` for non-cancelled rows.

### Design System
- White + medical teal (`oklch` primary teal, soft mint accents), generous whitespace, rounded-2xl cards, subtle shadows.
- Typography: Inter for FR/EN, Noto Sans Arabic for AR; large headings, calm body.
- Full RTL support via `dir="rtl"` on `<html>` when AR selected; logical Tailwind utilities.
- Mobile-first, sticky header with language switcher + "Prendre RDV" CTA.

### i18n Architecture
- `react-i18next` + `i18next-browser-languagedetector`.
- Files: `src/i18n/index.ts`, `src/i18n/locales/{fr,en,ar}.json`, namespaced by page (common, home, services, about, contact, booking, admin).
- Language persisted in `localStorage`; `<html lang dir>` updated reactively.
- Default: FR.

### Database (Postgres via Lovable Cloud)
Tables (all with GRANTs + RLS):
- `profiles` (id → auth.users, full_name, phone)
- `user_roles` (id, user_id, role enum: admin|patient) + `has_role()` security-definer
- `patients` (id, user_id nullable, full_name, email, phone, date_of_birth, notes, created_at)
- `services` (id, slug, name_fr, name_en, name_ar, duration_min, description_*)
- `appointments` (id, patient_id, service_id, appointment_date, appointment_time, status enum: pending|confirmed|cancelled|completed|rescheduled, language, notes, created_at, updated_at) — **unique index** on `(appointment_date, appointment_time) WHERE status IN ('pending','confirmed')`
- `blocked_slots` (id, blocked_date, blocked_time nullable, reason) — nullable time = whole-day block
- `clinic_hours` (day_of_week 0–6, open_time, close_time, is_closed)
- `testimonials` (id, patient_name, rating, content_fr/en/ar, is_published, created_at)

RLS: public can INSERT into `appointments` + `patients` (with rate-limited pattern), SELECT services/testimonials/hours/blocked_slots. Only admins can UPDATE/DELETE and SELECT patient/appointment lists.

### Public Pages (routes under `src/routes/`)
- `/` Home — hero, services preview, why choose us, testimonials, CTA
- `/services` — full list with prices/duration
- `/about` — Dr. Bensoltana bio, clinic photos, credentials
- `/contact` — form + map + hours + phone/email
- `/booking` — multi-step: service → date → available time slots (queried live) → patient info → confirmation
- `/testimonials` — grid
- Legal: `/mentions-legales`

### Admin Dashboard (`/_authenticated/admin/*`)
- `/auth` (public sign in / sign up)
- `/_authenticated/admin` — stats dashboard (today's appts, week, pending count, revenue estimate)
- `/admin/calendar` — month/week view with appointments
- `/admin/appointments` — table with filters, approve/reject/reschedule actions
- `/admin/patients` — searchable list + detail
- `/admin/blocked-slots` — add/remove blocked times
- `/admin/settings` — clinic hours, services

### Server Functions (TanStack `createServerFn`)
- `getAvailableSlots({ date, serviceId })` — computes from clinic_hours minus booked + blocked
- `createAppointment({...})` — public, inserts patient (upsert by email) + pending appointment, sends "received" email
- `updateAppointmentStatus(...)` — admin only, sends confirmation email on approve
- `getAdminStats()` — admin only
- Email via scaffolded transactional templates in booking language (FR/EN/AR).

### Interactive Map
- Embedded Google Maps iframe pointing at Rue Mongi Slim, Menzel Temime, Tunisia.
- "Get Directions" button → `https://www.google.com/maps/dir/?api=1&destination=...`.
- Static coordinates hardcoded (36.7833, 10.9833 approx).

### Delivery Order (this turn)
1. Enable Lovable Cloud + migration (schema, RLS, seed services & hours).
2. Design tokens (teal palette) in `src/styles.css`.
3. i18n setup + FR/EN/AR translation files + language switcher.
4. Public site: layout, home, services, about, contact w/ map, booking flow.
5. Auth + admin dashboard (calendar, appointments, patients, blocked slots, stats).
6. Email templates scaffold (FR/EN/AR) + wire to booking approval.
7. Sitemap + robots + head metadata per route.

This is a large build (~30-40 files). I'll ship it end-to-end in this session; you'll then sign up, I'll grant admin, and you can add domain for emails.

**Confirm to proceed** (or adjust: services list, hours, admin email, whether to use interactive JS map instead of iframe).
