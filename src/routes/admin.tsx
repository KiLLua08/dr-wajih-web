import { createFileRoute, useRouter, Link, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
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
    return (
      <PublicLayout>
        <div className="mx-auto max-w-md py-24 text-center px-4">
          <h1 className="text-2xl font-bold mb-2">Accès restreint</h1>
          <p className="text-muted-foreground">Cet espace est réservé à l'administrateur.</p>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">← Accueil</Link>
        </div>
      </PublicLayout>
    );
  }
  return <AdminDashboard />;
}

import AdminDashboard from "@/components/admin/AdminDashboard";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _unused() { return <Outlet />; }