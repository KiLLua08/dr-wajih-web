import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { AppointmentsPanel } from "./AppointmentsPanel";
import { PatientsPanel } from "./PatientsPanel";
import { BlockedSlotsPanel } from "./BlockedSlotsPanel";
import { CalendarPanel } from "./CalendarPanel";
import { CalendarDays, Users, ShieldAlert, LayoutDashboard } from "lucide-react";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("dashboard");

  const today = new Date().toISOString().slice(0, 10);
  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + 7);
  const weekEndISO = weekEnd.toISOString().slice(0, 10);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [todayCount, weekCount, pendingCount, patientCount] = await Promise.all([
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("appointment_date", today),
        supabase.from("appointments").select("id", { count: "exact", head: true }).gte("appointment_date", today).lte("appointment_date", weekEndISO),
        supabase.from("appointments").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("patients").select("id", { count: "exact", head: true }),
      ]);
      return {
        today: todayCount.count ?? 0,
        week: weekCount.count ?? 0,
        pending: pendingCount.count ?? 0,
        patients: patientCount.count ?? 0,
      };
    },
  });

  const cards = [
    { label: t("admin.stats.today"), value: stats?.today ?? "—" },
    { label: t("admin.stats.week"), value: stats?.week ?? "—" },
    { label: t("admin.stats.pending"), value: stats?.pending ?? "—" },
    { label: t("admin.stats.totalPatients"), value: stats?.patients ?? "—" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{t("admin.dashboard")}</h1>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {cards.map((c) => (
            <Card key={c.label} className="shadow-soft">
              <CardContent className="p-5">
                <div className="text-sm text-muted-foreground">{c.label}</div>
                <div className="text-3xl font-bold text-primary mt-1">{c.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard"><LayoutDashboard className="size-4" /> {t("admin.appointments")}</TabsTrigger>
            <TabsTrigger value="calendar"><CalendarDays className="size-4" /> {t("admin.calendar")}</TabsTrigger>
            <TabsTrigger value="patients"><Users className="size-4" /> {t("admin.patients")}</TabsTrigger>
            <TabsTrigger value="blocked"><ShieldAlert className="size-4" /> {t("admin.blockedSlots")}</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard"><AppointmentsPanel /></TabsContent>
          <TabsContent value="calendar"><CalendarPanel /></TabsContent>
          <TabsContent value="patients"><PatientsPanel /></TabsContent>
          <TabsContent value="blocked"><BlockedSlotsPanel /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}