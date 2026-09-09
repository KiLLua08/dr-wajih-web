import { supabase } from "@/integrations/supabase/client";

export interface Slot {
  time: string; // "HH:MM"
}

const STEP_MIN = 30;

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function toHHMM(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export async function getAvailableSlots(dateISO: string, durationMin: number): Promise<Slot[]> {
  const d = new Date(dateISO + "T00:00:00");
  const dow = d.getDay();

  const { data: hours } = await supabase
    .from("clinic_hours")
    .select("*")
    .eq("day_of_week", dow)
    .maybeSingle();
  if (!hours || hours.is_closed) return [];

  const { data: blocked } = await supabase
    .from("blocked_slots")
    .select("blocked_time")
    .eq("blocked_date", dateISO);
  const blockedTimes = new Set(
    (blocked ?? []).map((b: any) => (b.blocked_time ? (b.blocked_time as string).slice(0, 5) : "ALL")),
  );
  if (blockedTimes.has("ALL")) return [];

  // Fetch taken slots WITH their service durations for interval overlap check
  const { data: appts } = await supabase
    .from("appointments")
    .select("appointment_time, status, service_id, services(duration_min)")
    .eq("appointment_date", dateISO)
    .in("status", ["pending", "confirmed"]);

  // Build intervals [startMin, endMin) for each taken appointment
  const takenIntervals: Array<[number, number]> = (appts ?? []).map((a: any) => {
    const startMin = toMinutes((a.appointment_time as string).slice(0, 5));
    // duration from joined services, fallback 30 if missing
    const dur = (a.services?.duration_min as number | undefined) ?? 30;
    return [startMin, startMin + dur];
  });

  const start = toMinutes((hours.open_time as string).slice(0, 5));
  const end = toMinutes((hours.close_time as string).slice(0, 5));
  const now = new Date();
  const isToday = dateISO === now.toISOString().slice(0, 10);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const slots: Slot[] = [];
  for (let m = start; m + durationMin <= end; m += STEP_MIN) {
    const slotStart = m;
    const slotEnd = m + durationMin;
    const time = toHHMM(m);
    if (blockedTimes.has(time)) continue;
    // Exact blocked check first (keeps 09:00 whole-day semantics), then interval overlap
    const overlapsTaken = takenIntervals.some(([s, e]) => slotStart < e && slotEnd > s);
    if (overlapsTaken) continue;
    // Blocked interval check: if any blocked_time falls inside candidate interval, block it
    // (blocked slots are 30-min granularity; treat as [blockedMin, blockedMin+30))
    const blockedOverlap = Array.from(blockedTimes).some((bt) => {
      if (bt === "ALL") return true;
      const bStart = toMinutes(bt as string);
      const bEnd = bStart + 30;
      return slotStart < bEnd && slotEnd > bStart;
    });
    if (blockedOverlap) continue;
    if (isToday && m <= nowMin + 30) continue;
    slots.push({ time });
  }
  return slots;
}