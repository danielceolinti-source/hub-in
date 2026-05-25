import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthService } from "@/lib/services/auth";

type Role = "admin_master" | "diretor" | "supervisor" | "atendente" | "financeiro" | "posvenda" | "marketing";

export interface Profile {
  id: string;
  full_name: string;
  username?: string;
  email: string | null;
  avatar_url: string | null;
  company_id: string | null;
  sector_id: string | null;
  job_title: string | null;
  phone: string | null;
  presence: "online" | "away" | "busy" | "offline";
  last_seen_at: string | null;
}

export interface Company { id: string; name: string; brand: string; brand_color: string; slug: string; }

interface AuthCtx {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  company: Company | null;
  roles: Role[];
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (uid: string) => {
    const { data: p } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", uid)
      .maybeSingle();
    
    if (p) {
      setProfile(p as any);
      
      if ((p as any).company_id) {
        const { data: c } = await supabase
          .from("companies")
          .select("id,name,brand,brand_color,slug")
          .eq("id", (p as any).company_id)
          .maybeSingle();
        setCompany(c as any);
      } else {
        setCompany(null);
      }
      
      const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", uid);
      setRoles((r ?? []).map((x: any) => x.role) as Role[]);
    } else {
      setProfile(null);
      setCompany(null);
      setRoles([]);
    }
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) {
        loadProfile(s.user.id);
        // Update presence to online
        supabase.from("profiles").update({ presence: "online", last_seen_at: new Date().toISOString() }).eq("id", s.user.id);
      } else {
        setProfile(null);
        setCompany(null);
        setRoles([]);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        loadProfile(data.session.user.id).finally(() => setLoading(false));
        supabase.from("profiles").update({ presence: "online" }).eq("id", data.session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // Set presence to offline on window close
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (session?.user?.id) {
        try {
          navigator.sendBeacon(
            `${import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL}/rest/v1/profiles?id=eq.${session.user.id}`,
            JSON.stringify({ presence: "offline", last_seen_at: new Date().toISOString() })
          );
        } catch {}
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [session]);

  const value: AuthCtx = {
    session,
    user: session?.user ?? null,
    profile,
    company,
    roles,
    loading,
    signOut: async () => {
      if (session?.user?.id) {
        await supabase.from("profiles").update({ presence: "offline", last_seen_at: new Date().toISOString() }).eq("id", session.user.id);
      }
      await supabase.auth.signOut();
    },
    refresh: async () => { if (session?.user) await loadProfile(session.user.id); },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}