import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function BlockedSlotsPanel() {
  const { t, i18n } = useTranslation();
  const qc = useQueryClient();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const { data: items = [] } = useQuery({
    queryKey: ["blocked_slots"],
    queryFn: async () => {
      const { data } = await supabase.from("blocked_slots").select("*").order("blocked_date");
      return data ?? [];
    },
  });

  async function add() {
    if (!date) return;
    const { error } = await supabase.from("blocked_slots").insert({
      blocked_date: date,
      blocked_time: time || null,
      reason: reason || null,
    });
    if (error) toast.error(error.message);
    else {
      setDate(""); setTime(""); setReason("");
      qc.invalidateQueries({ queryKey: ["blocked_slots"] });
      qc.invalidateQueries({ queryKey: ["slots"] });
    }
  }
  async function del(id: string) {
    await supabase.from("blocked_slots").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["blocked_slots"] });
    qc.invalidateQueries({ queryKey: ["slots"] });
  }

  const lang = i18n.language || "fr";

  return (
    <div className="space-y-4">
      <Card><CardContent className="p-5 grid gap-3 sm:grid-cols-4">
        <div><Label>{t("admin.blockedSlot.date")}</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <div><Label>{t("admin.blockedSlot.time")}</Label><Input type="time" value={time} onChange={(e) => setTime(e.target.value)} /></div>
        <div><Label>{t("admin.blockedSlot.reason")}</Label><Input value={reason} onChange={(e) => setReason(e.target.value)} /></div>
        <div className="flex items-end"><Button onClick={add} className="w-full">{t("admin.blockedSlot.addBlock")}</Button></div>
      </CardContent></Card>
      <div className="space-y-2">
        {items.map((b: any) => (
          <Card key={b.id}><CardContent className="p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="font-medium">
                {b.blocked_date}
                {b.blocked_time 
                  ? ` — ${(b.blocked_time as string).slice(0, 5)}` 
                  : ` (${lang === "ar" ? "اليوم بأكمله" : lang === "en" ? "Whole day" : "Journée entière"})`
                }
              </div>
              {b.reason && <div className="text-xs text-muted-foreground">{b.reason}</div>}
            </div>
            <Button size="sm" variant="ghost" onClick={() => del(b.id)}><Trash2 className="size-4" /></Button>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}