import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Role = "admin_master" | "diretor" | "supervisor" | "atendente" | "financeiro" | "posvenda" | "marketing";

export interface Profile {
  id: string;
  full_name: string;
  email: string | null;
  avatar_url: string | null;
  company_id: string | null;
  sector_id: string | null;
  job_title: string | null;
  presence: "online" | "away" | "busy" | "offline";
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
      .select("id,full_name,email,avatar_url,company_id,sector_id,job_title,presence")
      .eq("id", uid)
      .maybeSingle();
    setProfile(p as Profile | null);
    if (p?.company_id) {
      const { data: c } = await supabase
        .from("companies")
        .select("id,name,brand,brand_color,slug")
        .eq("id", p.company_id)
        .maybeSingle();
      setCompany(c as Company | null);
    } else { setCompany(null); }
    const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", uid);
    setRoles(((r ?? []).map((x: any) => x.role)) as Role[]);
  };

  useEffect(() => {
    // Listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) { setTimeout(() => loadProfile(s.user.id), 0); }
      else { setProfile(null); setCompany(null); setRoles([]); }
    });
    // Then session check
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) loadProfile(data.session.user.id).finally(() => setLoading(false));
      else setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const value: AuthCtx = {
    session,
    user: session?.user ?? null,
    profile,
    company,
    roles,
    loading,
    signOut: async () => { await supabase.auth.signOut(); },
    refresh: async () => { if (session?.user) await loadProfile(session.user.id); },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be inside AuthProvider");
  return c;
}
