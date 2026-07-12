import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLang, localized } from "@/lib/lang";

interface Appointment {
  id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  language: string;
  patient_notes: string;
  admin_notes: string;
  patients: { full_name: string; email: string; phone: string };
  services: { name_fr: string; name_ar: string };
}

export default function AppointmentsTab() {
  const { t } = useTranslation();
  const lang = useLang();
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("pending");

  const { data: appointments = [], refetch, isLoading } = useQuery({
    queryKey: ["admin-appointments", statusFilter],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          "*,patients(*),services(name_fr,name_ar)"
        )
        .eq("status", statusFilter)
        .order("appointment_date", { ascending: true });
      if (error) throw error;
      return data as Appointment[];
    },
  });

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await supabase
        .from("appointments")
        .update({ status: newStatus })
        .eq("id", id);
      refetch();
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(t("admin.updated"));
    } catch (e) {
      toast.error(t("admin.error"));
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      await supabase.from("appointments").delete().eq("id", id);
      refetch();
      qc.invalidateQueries({ queryKey: ["admin-stats"] });
      toast.success(t("admin.deleted"));
    } catch (e) {
      toast.error(t("admin.error"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin.appointmentsTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Label>{t("admin.filterStatus")}</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="rescheduled">Rescheduled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            {t("admin.noAppointments")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.patient")}</TableHead>
                  <TableHead>{t("admin.service")}</TableHead>
                  <TableHead>{t("admin.date")}</TableHead>
                  <TableHead>{t("admin.time")}</TableHead>
                  <TableHead>{t("admin.phone")}</TableHead>
                  <TableHead>{t("admin.status")}</TableHead>
                  <TableHead>{t("admin.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((apt: any) => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-medium">
                      <div>{apt.patients.full_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {apt.patients.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {localized(apt.services, "name", lang)}
                    </TableCell>
                    <TableCell>{apt.appointment_date}</TableCell>
                    <TableCell>{(apt.appointment_time as string).slice(0, 5)}</TableCell>
                    <TableCell>{apt.patients.phone}</TableCell>
                    <TableCell>
                      <Select value={apt.status} onValueChange={(s) => updateStatus(apt.id, s)}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="rescheduled">Rescheduled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => deleteAppointment(apt.id)}
                        className="text-destructive hover:text-destructive/80"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
