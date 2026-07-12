import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useLang, localized } from "@/lib/lang";
import { fmtDate } from "@/lib/format";

export function AppointmentsPanel() {
  const { t } = useTranslation();
  const lang = useLang();
  const qc = useQueryClient();

  const { data: appts = [] } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () => {
      const { data } = await supabase
        .from("appointments")
        .select("*, patients(*), services(*)")
        .order("appointment_date", { ascending: true })
        .order("appointment_time", { ascending: true });
      return data ?? [];
    },
  });

  async function update(id: string, status: string) {
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("OK");
      qc.invalidateQueries({ queryKey: ["admin-appointments"] });
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
    }
  }

  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-primary/15 text-primary",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-green-100 text-green-800",
    rescheduled: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="space-y-3">
      {appts.length === 0 && (
        <p className="text-sm text-muted-foreground">—</p>
      )}
      {appts.map((a: any) => (
        <Card key={a.id} className="shadow-soft">
          <CardContent className="p-5 flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[220px]">
              <div className="font-semibold">{a.patients?.full_name}</div>
              <div className="text-xs text-muted-foreground">
                {a.patients?.email} · {a.patients?.phone}
              </div>
              <div className="mt-1 text-sm">
                {a.services && localized(a.services, "name", lang)}
              </div>
              {a.patient_notes && (
                <div className="mt-1 text-xs text-muted-foreground italic">"{a.patient_notes}"</div>
              )}
            </div>
            <div className="text-sm">
              <div className="font-medium">{fmtDate(a.appointment_date, lang)}</div>
              <div className="text-muted-foreground">{(a.appointment_time as string).slice(0, 5)}</div>
            </div>
            <Badge className={colors[a.status] || ""}>{t(`admin.status.${a.status}`)}</Badge>
            <div className="flex flex-wrap gap-2">
              {a.status === "pending" && (
                <>
                  <Button size="sm" onClick={() => update(a.id, "confirmed")}>{t("admin.actions.approve")}</Button>
                  <Button size="sm" variant="outline" onClick={() => update(a.id, "cancelled")}>{t("admin.actions.reject")}</Button>
                </>
              )}
              {a.status === "confirmed" && (
                <>
                  <Button size="sm" variant="outline" onClick={() => update(a.id, "completed")}>{t("admin.actions.complete")}</Button>
                  <Button size="sm" variant="outline" onClick={() => update(a.id, "cancelled")}>{t("admin.actions.reject")}</Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}