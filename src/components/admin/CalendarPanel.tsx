import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { useLang, localized } from "@/lib/lang";
import { toISODate } from "@/lib/format";

export function CalendarPanel() {
  const lang = useLang();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const iso = date ? toISODate(date) : null;

  const { data: appts = [] } = useQuery({
    queryKey: ["calendar", iso],
    enabled: !!iso,
    queryFn: async () => {
      const { data } = await supabase
        .from("appointments")
        .select("*, patients(*), services(*)")
        .eq("appointment_date", iso!)
        .order("appointment_time");
      return data ?? [];
    },
  });

  return (
    <div className="grid gap-6 md:grid-cols-[auto_1fr]">
      <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border w-fit" />
      <div className="space-y-2">
        {appts.length === 0 && <p className="text-sm text-muted-foreground">—</p>}
        {appts.map((a: any) => (
          <Card key={a.id}><CardContent className="p-4 flex gap-4">
            <div className="font-mono text-primary">{(a.appointment_time as string).slice(0, 5)}</div>
            <div className="flex-1">
              <div className="font-medium">{a.patients?.full_name}</div>
              <div className="text-xs text-muted-foreground">{a.services && localized(a.services, "name", lang)} — {a.status}</div>
            </div>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}