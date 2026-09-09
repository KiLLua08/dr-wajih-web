import { createFileRoute, useRouter, Link, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import * as React from "react";
import { useAuth } from "@/components/AuthProvider";
import { PublicLayout } from "@/components/PublicLayout";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminGate,
});

function AdminGate() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.navigate({ to: "/auth" });
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <PublicLayout>
        <div className="flex justify-center py-24"><Loader2 className="size-6 animate-spin text-primary" /></div>
      </PublicLayout>
    );
  }
  if (!isAdmin) {
    return <BootstrapAdmin user={user} />;
  }
  return <AdminDashboard />;
}

function BootstrapAdmin({ user }: { user: any }) {
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  async function claimAdmin() {
    setBusy(true);
    setMsg(null);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      // @ts-ignore RPC exists after migration 20260910
      const { data, error } = await supabase.rpc("bootstrap_first_admin");
      if (error) throw error;
      if ((data as any)?.ok) {
        window.location.reload();
      } else {
        setMsg((data as any)?.reason === "admin_already_exists"
          ? "Un admin existe déjà — demandez-lui de vous promouvoir via /admin > Patients ou SQL."
          : `Échec: ${JSON.stringify(data)}`);
      }
    } catch (e: any) {
      setMsg(e.message || "Erreur");
    } finally {
      setBusy(false);
    }
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-md py-16 text-center px-4">
        <h1 className="text-2xl font-bold mb-2">Accès restreint</h1>
        <p className="text-muted-foreground mb-4 text-sm">Cet espace est réservé à l'administrateur. Si vous êtes le premier utilisateur, vous pouvez réclamer l'accès.</p>
        <div className="rounded-lg border p-4 bg-card text-sm mb-4">
          <div>Connecté en tant que</div>
          <div className="font-mono font-medium">{user?.email}</div>
        </div>
        {msg && <p className="text-sm text-destructive mb-3">{msg}</p>}
        <button
          onClick={claimAdmin}
          disabled={busy}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? <><Loader2 className="size-4 animate-spin mr-2" /> Traitement…</> : "→ Devenir admin (premier utilisateur)"}
        </button>
        <div className="mt-4">
          <Link to="/" className="text-sm text-primary hover:underline">← Accueil</Link>
        </div>
        <p className="mt-6 text-xs text-muted-foreground">Alternative SQL: <code className="bg-muted px-1 py-0.5 rounded">supabase/seed-admin.sql</code></p>
      </div>
    </PublicLayout>
  );
}

import AdminDashboard from "@/components/admin/AdminDashboard";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _unused() { return <Outlet />; }
