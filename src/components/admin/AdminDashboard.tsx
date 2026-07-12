import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PublicLayout } from "@/components/PublicLayout";
import AppointmentsTab from "./AppointmentsTab";
import PatientsTab from "./PatientsTab";
import ServicesTab from "./ServicesTab";
import ClinicHoursTab from "./ClinicHoursTab";
import TestimonialsTab from "./TestimonialsTab";
import { Calendar, Users, Stethoscope, Clock, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("appointments");

  return (
    <PublicLayout>
      <section className="py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-bold mb-2">{t("admin.title")}</h1>
          <p className="text-muted-foreground mb-8">{t("admin.subtitle")}</p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 lg:w-auto">
              <TabsTrigger value="appointments" className="flex items-center gap-2">
                <Calendar className="size-4" />
                <span className="hidden sm:inline">{t("admin.appointments")}</span>
              </TabsTrigger>
              <TabsTrigger value="patients" className="flex items-center gap-2">
                <Users className="size-4" />
                <span className="hidden sm:inline">{t("admin.patients")}</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Stethoscope className="size-4" />
                <span className="hidden sm:inline">{t("admin.services")}</span>
              </TabsTrigger>
              <TabsTrigger value="hours" className="flex items-center gap-2">
                <Clock className="size-4" />
                <span className="hidden sm:inline">{t("admin.hours")}</span>
              </TabsTrigger>
              <TabsTrigger value="testimonials" className="flex items-center gap-2">
                <MessageSquare className="size-4" />
                <span className="hidden sm:inline">{t("admin.testimonials")}</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments">
              <AppointmentsTab />
            </TabsContent>
            <TabsContent value="patients">
              <PatientsTab />
            </TabsContent>
            <TabsContent value="services">
              <ServicesTab />
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
