# Next Steps — What’s Missing to Go Live

> **Goal:** turn a good demo into a clinic that *actually* takes bookings tomorrow without you babysitting Supabase or WhatsApp.
> Date: 2026-09-09 | Branch `arena/01a086f7-dr-wajih-web` | Audit of `52f1590`

---

## 1) Honest audit — what already works

Give credit first, otherwise the list feels endless.

| ✔ Done | Notes |
|---|---|
| **Architecture clean** | TanStack Start + Nitro + RLS is the right call, no leaky API layer |
| **Schema solid** | 8 tables, enums, triggers, partial unique index anti-double-book, single migration |
| **Public site** | `/`, `/services`, `/about`, `/contact`, `/testimonials`, `/booking` all render, fr/en/ar + RTL |
| **Booking wizard UI** | 4 steps + slot grid + zod validation |
| **Admin shell** | `/admin` gate + 7 tabs + 4 stat cards, status filter, inline edits |
| **Design system** | OKLCH teal, `gradient-hero`, shadcn — consistent |
| **Error handling** | h3 swallow fix, global error capture, root error boundary — better than most launches |
| **Maps** | Embed + directions + landmark context (above Pizzeria Mimo) |

If you ran `bun install && bun run dev` right now with a provisioned Supabase project, it *would* boot.

---

## 2) What actually blocks going live — P0 (must-fix this week)

### P0-1 — Supabase is half-wired

**Current `.env`:**
```
SUPABASE_URL ok
VITE_SUPABASE_URL ok
VITE_SUPABASE_PUBLISHABLE_KEY ok (sb_publishable_...)
SUPABASE_SERVICE_ROLE_KEY ❌ missing
SUPABASE_PUBLISHABLE_KEY vs VITE_ duplication, no SECRET/JWKS use
```

- `client.server.ts` (`supabaseAdmin`) will `throw` on any import because `SUPABASE_SERVICE_ROLE_KEY` is undefined — today it’s lazy so it doesn’t crash until first use, but the *moment* you add a server function it explodes.
- `curl /rest/v1/services` returned empty in audit — network may be sandboxed, but verify from your machine that `vefiungygrrkkwekydre.supabase.co` actually answers. `supabase/config.toml` points to `vefiungy...` while git history had `liolgk...` — confirm which project is canonical and that the migration + `seed.sql` were applied.
- `bun.lock` + `package-lock.json` both exist → lock drift. Pick **one** package manager (you’re on `bun`, so delete `package-lock.json`).

**Fix:**
- [ ] Regenerate service_role + publishable in Supabase Dashboard → paste into Lovable Cloud env + local `.env`
- [ ] `supabase db push` or run `supabase/migrations/*.sql` + `supabase/seed.sql` (verify 5 services + 7 clinic_hours rows)
- [ ] Delete `package-lock.json`, keep `bun.lock` (and add CI check)
- [ ] Add `.env.example` so next dev knows what’s required

### P0-2 — Booking looks booked but nobody is notified

- `booking.tsx` inserts `patients` (random UUID, not deduped) → `appointments` `status=pending` **and stops**. No email, no WhatsApp, no notification to clinic. Patient sees success toast; clinic must poll `/admin` to discover it.
- `contact.tsx` is `await new Promise(r=>setTimeout(r,1000))` — fake success.
- Plan.md promised transactional emails (FR/EN/AR) but none exist.

**Fix — pick one provider this week (Resend is simplest):**
- [ ] Add `RESEND_API_KEY` + verified sender `noreply@drwajihbensoltana.tn`
- [ ] Server function `createAppointment` (not client insert):
  ```ts
  // createServerFn + requireSupabaseAuth? actually public
  // 1. upsert patient by lower(email) INTO patients (or create new if not found)
  // 2. INSERT appointment status pending
  // 3. send 2 emails: clinic (new booking alert) + patient (received, in booking.language)
  // 4. optional: WhatsApp via Meta or Twilio template
  ```
- [ ] Do the same for contact form → `contact_messages` table (+ email)
- [ ] Add `email_logs` table for audit (who, what, when, provider id)

> Without this, you will miss bookings. This is the #1 “actually working” gap.

### P0-3 — Admin has no way to be born

- `/auth` lets anyone `signUp` → gets `patient` role via trigger, but **no one** is `admin`. You must run SQL manually:
  ```sql
  insert into user_roles(user_id, role) values ('<uuid from auth.users>', 'admin');
  ```
- No docs, no bootstrap script.

**Fix:**
- [ ] Create `supabase/seed-admin.sql` + README with one-liner, or a one-time server function `promoteToAdmin(email)` gated by `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Document flow in `docs/ARCHITECTURE.md` + show banner on `/admin` “no admin found — click to create”

### P0-4 — Double-booking still possible for 60-min services

- `getAvailableSlots` loops `m += 30` and only skips if `takenTimes.has(time)` **exact**. A 60-min `devitalisation` at `09:00` blocks `09:00` but **not** `09:30` — second user can book `09:30` overlapping by 30 min. DB unique index also only guards exact same `time`.

**Fix:**
- [ ] Change engine to interval overlap:
  ```ts
  const intervals = appts.map(a=> [toMinutes(a.time), toMinutes(a.time)+a.service.duration_min])
  skip if any overlap with [m, m+durationMin)
  ```
- [ ] Or add DB exclusion constraint / function to enforce interval (better, race-free)

### P0-5 — Spam + abuse hole

- RLS: `patients INSERT true` + `appointments INSERT status=pending` → **anonymous internet can flood DB**. No rate limit, no captcha, no honeypot.

**Fix (cheap & fast):**
- [ ] Cloudflare Turnstile on `/booking` + `/contact` (free, same as captcha but better)
- [ ] Edge rate limit: 5 bookings / IP / hour (Nitro middleware or Supabase pg_cron job)
- [ ] Add `created_at` + `ip_hash` column for audit

### P0-6 — Hardcoded Google Maps API key in `MapEmbed.tsx`

```ts
const EMBED_URL = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD-9tSrke...`
```
- Key is in git, billable to your console, and quota-exhausted will blank the map. Fallback `maps.google.com/maps?q=...&output=embed` already exists and is used — the keyed URL isn’t even used. Remove it.

**Fix:** [ ] Delete `EMBED_URL` + key, keep `EMBED_FALLBACK` only. Rotate key in Google Cloud.

---

## 3) P1 — Needed before you tell patients “book online now” (week 2)

### P1-1 — Booking transaction + validation hardening

- [ ] Move booking write to server function with real transaction + `pg` advisory lock or `SELECT ... FOR UPDATE` on that date
- [ ] Validate email/phone with stricter zod + `libphonenumber-js` for TN (`+216...`)
- [ ] Normalize phone, lower email, dedup `patients` by `lower(email)` → reuse `patient_id` instead of new UUID per booking
- [ ] Return meaningful errors (409 slot taken vs 500)

### P1-2 — Ops essentials

- [ ] `robots.txt` + `sitemap.xml` (generate from routeTree)
- [ ] OG image + `head` per-route canonical, `json-ld` MedicalBusiness schema for SEO “dentiste Menzel Temime”
- [ ] `/mentions-legales` + privacy policy (RGPD/TNPD) — required because you store health-adjacent PII
- [ ] Error monitoring: Sentry or Logflare → wire `lovable-error-reporting.ts` (currently just console)
- [ ] Analytics: privacy-friendly (Plausible) — you want to know “booking abandonment where?”

### P1-3 — Admin UX at clinic scale

- [ ] Pagination + search (today admin loads *all* rows)
- [ ] Realtime: `supabase.channel('appointments')` → toast “new booking” + invalidates stats (no refresh dance)
- [ ] Confirm dialog on delete, undo toast
- [ ] Reschedule flow (pick new date/time, auto-check slots, send email)
- [ ] CSV export for accountants

### P1-4 — Domain + deploy

- [ ] Pick host: Cloudflare Pages/Workers (Nitro default) or Vercel or Lovable Cloud — decide once, then set
- [ ] Custom domain `drwajihbensoltana.tn` + SSL
- [ ] Env injection: `VITE_*` at build, `SUPABASE_*` at runtime — add `wrangler.toml` / `vite.preview` host allowlist already handled by `@lovable` config but verify

### P1-5 — i18n polish & content

- [ ] Audit `ar.json` vs `fr.json` completeness (ar was 55 lines shorter in earlier snapshot)
- [ ] Seed real services (currently only 5 generic; plan.md lists 7 — align with Dr. Wajih’s actual list)
- [ ] Real doctor photos replace SVG tooth placeholder

---

## 4) P2 — Polish that feels premium (month 2, after revenue)

- WhatsApp booking button (`wa.me/216...?text=Bonjour...`) alongside calendar
- SMS reminders via `pg_cron` + Twilio/Resend 24h before appointment (reduces no-shows 20-30%)
- PWA “Add to home screen” for staff
- Animations (framer-motion) + skeleton loaders
- Image optimization (Supabase Storage for CMS images)
- Vitest + Playwright e2e (booking happy path)

---

## 5) Proposed 2-week sprint plan

### Week 1 — “Actually takes bookings without you” (P0)

| Day | Task | Owner | Done when |
|-----|------|-------|-----------|
| **1** | Env + DB bootstrap | You | `bun run build` passes, `/rest/v1/services` returns 5 rows |
| **1** | Remove exposed Maps key | You | `git grep AIza` = 0, map still renders |
| **2** | Turnstile on booking/contact | Dev | Bot can’t spam, human sees no friction |
| **3-4** | Server `createAppointment` + Resend emails (2 templates ×3 langs) | Dev | Booking → clinic inbox < 10s, patient inbox localized |
| **4** | Admin bootstrap flow | Dev | First user can become admin without SQL |
| **5** | Slot interval fix + tests | Dev | 60-min blocks correctly, e2e shows no overlap |
| **—** | Staging deploy + manual QA 10 bookings | Both | You sign off |

### Week 2 — “Tell Menzel Temime” (P1)

- Sitemap/robots/OG/JSON-LD, mentions légales, analytics, domain SSL, pagination+realtime, phone normalization, lockfile cleanup.

---

## 6) Decision matrix — your call now

We can’t build all P0 in one turn without knowing:

1. **Email provider** — Resend (recommended, free 100/d), Supabase Auth SMTP, or Gmail SMTP?
2. **Domain** — do you own `drwajihbensoltana.tn` or should we deploy to `*.lovable.app` first?
3. **WhatsApp** — do you want a “Book via WhatsApp” button as primary or secondary to calendar?
4. **Admin email** — who gets the `admin` role? Give me the signup email and I’ll seed it.
5. **Risk tolerance** — ship Turnstile (adds one widget) or ship without anti-spam first (faster but spam risk)?

Answer 1-5 (even one word each) and we’ll start on that path immediately — I’ll wire the code in this branch.

---

## 7) Quick wins you can do in 5 minutes right now

```bash
# 1. verify DB live
curl -H "apikey: $VITE_SUPABASE_PUBLISHABLE_KEY" \
  "$VITE_SUPABASE_URL/rest/v1/services?select=slug"

# 2. rotate maps key (delete EMBED_URL line in src/components/MapEmbed.tsx)
git grep -n "AIzaSy" src/components/MapEmbed.tsx

# 3. clean lockfiles
git rm package-lock.json   # keep bun.lock
bun install
```

---

*Next doc:* `docs/ROADMAP.html` (visual Gantt) — coming after your answers. For now the full deep-dives are `docs/ARCHITECTURE.md` + `docs/architecture.html`.*
