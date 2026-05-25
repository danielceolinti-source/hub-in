import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { AppShell } from "@/components/app/AppShell";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/app")({ component: AppLayout });

function AppLayout() {
  const { session, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && !session) nav({ to: "/auth" }); }, [session, loading, nav]);

  if (loading || !session) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  return <AppShell><Outlet /></AppShell>;
}
