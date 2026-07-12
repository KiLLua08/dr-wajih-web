import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PublicLayout } from "@/components/PublicLayout";
import AppointmentsTab from "./AppointmentsTab";
import PatientsTab from "./PatientsTab";
import ServicesTab from "./ServicesTab";
import ClinicHoursTab from "./ClinicHoursTab";
import TestimonialsTab from "./TestimonialsTab";
import { CalendarPanel } from "./CalendarPanel";
import { BlockedSlotsPanel } from "./BlockedSlotsPanel";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar as CalendarIcon,
  Users,
  Stethoscope,
  Clock,
  MessageSquare,
  ShieldAlert,
  TrendingUp,
  UserCheck
} from "lucide-react";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("appointments");

  const now = new Date();
  
  // Start of current week (Sunday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const startOfWeekISO = startOfWeek.toISOString().slice(0, 10);
  
  // End of current week (Saturday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const endOfWeekISO = endOfWeek.toISOString().slice(0, 10);

  // Start of current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfMonthISO = startOfMonth.toISOString().slice(0, 10);

  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // 1. Appointments this week
      const { count: appointmentsThisWeek, error: err1 } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .gte("appointment_date", startOfWeekISO)
        .lte("appointment_date", endOfWeekISO);
      
      // 2. New patients this month
      const { count: newPatientsThisMonth, error: err2 } = await supabase
        .from("patients")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfMonthISO);

      // 3. Pending appointments
      const { count: pendingAppointments, error: err3 } = await supabase
        .from("appointments")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending");

      // 4. Total patients
      const { count: totalPatients, error: err4 } = await supabase
        .from("patients")
        .select("*", { count: "exact", head: true });

      if (err1 || err2 || err3 || err4) {
        console.error({ err1, err2, err3, err4 });
      }

      return {
        appointmentsThisWeek: appointmentsThisWeek ?? 0,
        newPatientsThisMonth: newPatientsThisMonth ?? 0,
        pendingAppointments: pendingAppointments ?? 0,
        totalPatients: totalPatients ?? 0,
      };
    },
  });

  return (
    <PublicLayout>
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold mb-2">{t("admin.title")}</h1>
          <p className="text-muted-foreground mb-8">{t("admin.subtitle")}</p>

          {/* Stats Section */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4 mb-8">
            <Card className="shadow-soft border-border/60">
              <CardContent className="p-4 md:p-6 flex items-center gap-4">
                <div className="rounded-xl bg-primary/10 p-2 md:p-3 text-primary">
                  <CalendarIcon className="size-5 md:size-6" />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold">{stats?.appointmentsThisWeek ?? 0}</div>
                  <p className="text-xs text-muted-foreground">{t("admin.stats.week")}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-border/60">
              <CardContent className="p-4 md:p-6 flex items-center gap-4">
                <div className="rounded-xl bg-emerald-500/10 p-2 md:p-3 text-emerald-600">
                  <UserCheck className="size-5 md:size-6" />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold">{stats?.newPatientsThisMonth ?? 0}</div>
                  <p className="text-xs text-muted-foreground">{t("admin.stats.month")}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-border/60">
              <CardContent className="p-4 md:p-6 flex items-center gap-4">
                <div className="rounded-xl bg-amber-500/10 p-2 md:p-3 text-amber-600">
                  <Clock className="size-5 md:size-6" />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold">{stats?.pendingAppointments ?? 0}</div>
                  <p className="text-xs text-muted-foreground">{t("admin.stats.pending")}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-soft border-border/60">
              <CardContent className="p-4 md:p-6 flex items-center gap-4">
                <div className="rounded-xl bg-sky-500/10 p-2 md:p-3 text-sky-600">
                  <TrendingUp className="size-5 md:size-6" />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-bold">{stats?.totalPatients ?? 0}</div>
                  <p className="text-xs text-muted-foreground">{t("admin.stats.totalPatients")}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-wrap gap-1 mb-8 bg-muted/50 p-1 rounded-xl w-full h-auto">
              <TabsTrigger value="appointments" className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm">
                <CalendarIcon className="size-4" />
                <span>{t("admin.appointments")}</span>
              </TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm">
                <CalendarIcon className="size-4" />
                <span>{t("admin.calendar")}</span>
              </TabsTrigger>
              <TabsTrigger value="patients" className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm">
                <Users className="size-4" />
                <span>{t("admin.patients")}</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm">
                <Stethoscope className="size-4" />
                <span>{t("admin.services")}</span>
              </TabsTrigger>
              <TabsTrigger value="blocked" className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm">
                <ShieldAlert className="size-4" />
                <span>{t("admin.blockedSlots")}</span>
              </TabsTrigger>
              <TabsTrigger value="hours" className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm">
                <Clock className="size-4" />
                <span>{t("admin.hours")}</span>
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="flex items-center gap-2 px-3 py-2 text-xs md:text-sm">
                <MessageSquare className="size-4" />
                <span>{t("admin.testimonials")}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments">
              <AppointmentsTab />
            </TabsContent>
            <TabsContent value="calendar">
              <CalendarPanel />
            </TabsContent>
            <TabsContent value="patients">
              <PatientsTab />
            </TabsContent>
            <TabsContent value="services">
              <ServicesTab />
            </TabsContent>
            <TabsContent value="blocked">
              <BlockedSlotsPanel />
            </TabsContent>
            <TabsContent value="hours">
              <ClinicHoursTab />
            </TabsContent>
            <TabsContent value="testimonials">
              <TestimonialsTab />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PublicLayout>
  );
}
