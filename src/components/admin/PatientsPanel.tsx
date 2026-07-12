import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

export function PatientsPanel() {
  const { data: patients = [] } = useQuery({
    queryKey: ["admin-patients"],
    queryFn: async () => {
      const { data } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
      return data ?? [];
    },
  });
  return (
    <div className="space-y-2">
      {patients.map((p: any) => (
        <Card key={p.id}><CardContent className="p-4 flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="font-semibold">{p.full_name}</div>
            <div className="text-xs text-muted-foreground">{p.email}</div>
          </div>
          <div className="text-sm text-muted-foreground">{p.phone}</div>
        </CardContent></Card>
      ))}
    </div>
  );
}