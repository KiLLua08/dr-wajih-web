import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { PublicLayout } from "@/components/PublicLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.navigate({ to: "/admin" });
  }, [user, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
      }
      router.navigate({ to: "/admin" });
    } catch (err: any) {
      toast.error(err?.message ?? t("auth.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PublicLayout>
      <section className="py-16">
        <div className="mx-auto max-w-md px-4">
          <Card className="shadow-elegant">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-6">
                {mode === "in" ? t("auth.signIn") : t("auth.signUp")}
              </h1>
              <form onSubmit={submit} className="space-y-4">
                {mode === "up" && (
                  <div>
                    <Label>{t("auth.fullName")}</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                )}
                <div>
                  <Label>{t("auth.email")}</Label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <Label>{t("auth.password")}</Label>
                  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {mode === "in" ? t("auth.submitIn") : t("auth.submitUp")}
                </Button>
              </form>
              <div className="mt-4 text-sm text-center text-muted-foreground">
                {mode === "in" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
                <button
                  className="text-primary font-medium hover:underline"
                  onClick={() => setMode(mode === "in" ? "up" : "in")}
                >
                  {mode === "in" ? t("auth.submitUp") : t("auth.submitIn")}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PublicLayout>
  );
}