import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const DAYS = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

interface ClinicHour {
  id: string;
  day_of_week: number;
  open_time: string;
  close_time: string;
  is_closed: boolean;
}

export default function ClinicHoursTab() {
  const { t } = useTranslation();
  const [hours, setHours] = useState<ClinicHour[]>([]);

  const { isLoading } = useQuery({
    queryKey: ["admin-clinic-hours"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clinic_hours")
        .select("*")
        .order("day_of_week");
      if (error) throw error;
      setHours(data as ClinicHour[]);
      return data;
    },
  });

  const updateHours = async () => {
    try {
      for (const hour of hours) {
        await supabase
          .from("clinic_hours")
          .update({
            open_time: hour.open_time,
            close_time: hour.close_time,
            is_closed: hour.is_closed,
          })
          .eq("id", hour.id);
      }
      toast.success(t("admin.saved"));
    } catch (e) {
      toast.error(t("admin.error"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin.clinicHoursTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {hours.map((hour) => {
              const day = DAYS.find((d) => d.value === hour.day_of_week);
              return (
                <div key={hour.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1 font-semibold w-24">{day?.label}</div>
                  <div className="flex items-center gap-2 flex-1">
                    <Label className="w-16">Open</Label>
                    <Input
                      type="time"
                      value={hour.open_time}
                      onChange={(e) =>
                        setHours(
                          hours.map((h) =>
                            h.id === hour.id
                              ? { ...h, open_time: e.target.value }
                              : h
                          )
                        )
                      }
                      disabled={hour.is_closed}
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <Label className="w-16">Close</Label>
                    <Input
                      type="time"
                      value={hour.close_time}
                      onChange={(e) =>
                        setHours(
                          hours.map((h) =>
                            h.id === hour.id
                              ? { ...h, close_time: e.target.value }
                              : h
                          )
                        )
                      }
                      disabled={hour.is_closed}
                    />
                  </div>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="checkbox"
                      checked={hour.is_closed}
                      onChange={(e) =>
                        setHours(
                          hours.map((h) =>
                            h.id === hour.id
                              ? { ...h, is_closed: e.target.checked }
                              : h
                          )
                        )
                      }
                      className="rounded"
                    />
                    <Label className="text-sm">Closed</Label>
                  </div>
                </div>
              );
            })}
            <Button onClick={updateHours} className="w-full mt-6">
              {t("admin.save")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
