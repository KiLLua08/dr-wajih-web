import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Patient {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  created_at: string;
}

export default function PatientsTab() {
  const { t } = useTranslation();

  const { data: patients = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-patients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Patient[];
    },
  });

  const deletePatient = async (id: string) => {
    try {
      await supabase.from("patients").delete().eq("id", id);
      refetch();
      toast.success(t("admin.deleted"));
    } catch (e) {
      toast.error(t("admin.error"));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin.patientsTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-6 animate-spin" />
          </div>
        ) : patients.length === 0 ? (
          <p className="text-center py-8 text-muted-foreground">
            {t("admin.noPatients")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("admin.name")}</TableHead>
                  <TableHead>{t("admin.email")}</TableHead>
                  <TableHead>{t("admin.phone")}</TableHead>
                  <TableHead>{t("admin.joined")}</TableHead>
                  <TableHead>{t("admin.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient: any) => (
                  <TableRow key={patient.id}>
                    <TableCell className="font-medium">{patient.full_name}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>
                      {new Date(patient.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => deletePatient(patient.id)}
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
