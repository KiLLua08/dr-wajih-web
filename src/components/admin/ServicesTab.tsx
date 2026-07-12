import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface Service {
  id: string;
  slug: string;
  name_fr: string;
  name_en: string;
  name_ar: string;
  description_fr: string | null;
  description_en: string | null;
  description_ar: string | null;
  duration_min: number;
  is_active: boolean;
  sort_order: number;
}

export default function ServicesTab() {
  const { t } = useTranslation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Service | null>(null);

  const { data: services = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as Service[];
    },
  });

  const saveService = async () => {
    if (!formData) return;
    try {
      const { id, ...updates } = formData;
      if (editingId) {
        const { error } = await supabase
          .from("services")
          .update(updates)
          .eq("id", editingId);
        if (error) throw error;
      }
      refetch();
      setEditingId(null);
      setFormData(null);
      toast.success(t("admin.saved"));
    } catch (e) {
      toast.error(t("admin.error"));
    }
  };

  const deleteService = async (id: string) => {
    try {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
      refetch();
      toast.success(t("admin.deleted"));
    } catch (e) {
      toast.error(t("admin.error"));
    }
  };

  return (
    <div className="space-y-6">
      {editingId && formData && (
        <Card>
          <CardHeader>
            <CardTitle>{t("admin.editService")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Slug</Label>
                <Input
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Name (FR)</Label>
                <Input
                  value={formData.name_fr}
                  onChange={(e) =>
                    setFormData({ ...formData, name_fr: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Name (EN)</Label>
                <Input
                  value={formData.name_en}
                  onChange={(e) =>
                    setFormData({ ...formData, name_en: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Name (AR)</Label>
                <Input
                  value={formData.name_ar}
                  onChange={(e) =>
                    setFormData({ ...formData, name_ar: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Description (FR)</Label>
                <Textarea
                  value={formData.description_fr || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description_fr: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Description (AR)</Label>
                <Textarea
                  value={formData.description_ar || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description_ar: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Duration (min)</Label>
                <Input
                  type="number"
                  value={formData.duration_min}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duration_min: parseInt(e.target.value, 10) || 30,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={saveService}>{t("admin.save")}</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setEditingId(null);
                  setFormData(null);
                }}
              >
                {t("admin.cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("admin.servicesTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : services.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">
              {t("admin.noServices")}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("admin.name")}</TableHead>
                    <TableHead>{t("admin.duration")}</TableHead>
                    <TableHead>{t("admin.active")}</TableHead>
                    <TableHead>{t("admin.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">
                        <div>{service.name_fr}</div>
                        <div className="text-xs text-muted-foreground">
                          {service.name_ar}
                        </div>
                      </TableCell>
                      <TableCell>{service.duration_min} min</TableCell>
                      <TableCell>{service.is_active ? "✓" : "✗"}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingId(service.id);
                              setFormData(service);
                            }}
                            className="text-primary hover:text-primary/80"
                          >
                            <Edit2 className="size-4" />
                          </button>
                          <button
                            onClick={() => deleteService(service.id)}
                            className="text-destructive hover:text-destructive/80"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
