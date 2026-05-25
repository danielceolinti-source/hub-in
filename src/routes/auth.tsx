import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/brand/Logo";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Zap, Users } from "lucide-react";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const { session, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && session) nav({ to: "/app" }); }, [session, loading, nav]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background décor */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.18]" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-80" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.68 0.20 250 / .35), transparent 60%)" }} />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.40 0.18 262 / .35), transparent 60%)" }} />

      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
        {/* Left — brand panel */}
        <div className="hidden flex-col justify-between p-12 lg:flex">
          <Logo />
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-balance text-5xl font-semibold tracking-tight text-foreground">
              A central operacional da sua concessionária.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted-foreground">
              WhatsApp compartilhado, chat interno corporativo, CRM e dashboards em tempo real — unificados em uma única plataforma.
            </p>
            <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { icon: Users, t: "Multiusuário", d: "Dezenas no mesmo número" },
                { icon: Zap, t: "Tempo real", d: "Mensagens instantâneas" },
                { icon: ShieldCheck, t: "Enterprise", d: "Permissões e auditoria" },
              ].map((f) => (
                <div key={f.t} className="glass rounded-xl p-4">
                  <f.icon className="h-5 w-5 text-[color:var(--neon)]" />
                  <p className="mt-2 text-sm font-medium">{f.t}</p>
                  <p className="text-xs text-muted-foreground">{f.d}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Concierge Auto Suite • FIAT & JEEP</p>
        </div>

        {/* Right — form */}
        <div className="flex flex-col items-center justify-center p-6 sm:p-12">
          <div className="lg:hidden mb-8"><Logo /></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="w-full max-w-md"
          >
            <div className="glass rounded-2xl p-8 shadow-[var(--shadow-elevated)]">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="signup">Criar conta</TabsTrigger>
                </TabsList>
                <TabsContent value="login" className="mt-6"><LoginForm /></TabsContent>
                <TabsContent value="signup" className="mt-6"><SignupForm /></TabsContent>
              </Tabs>
            </div>
            <p className="mt-5 text-center text-xs text-muted-foreground">
              Ao continuar você concorda com os Termos de Uso e a Política de Privacidade.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Bem-vindo de volta"); nav({ to: "/app" }); }
  };
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Acesse sua estação</h2>
        <p className="mt-1 text-sm text-muted-foreground">Use suas credenciais corporativas.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@concessionaria.com" />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <Link to="/auth" className="text-xs text-muted-foreground hover:text-foreground">Esqueceu?</Link>
        </div>
        <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
      </div>
      <Button type="submit" disabled={busy} className="w-full" size="lg">
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Entrar
      </Button>
    </form>
  );
}

function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin, data: { full_name: name } },
    });
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Conta criada! Verifique seu e-mail para confirmar.");
  };
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Crie sua conta</h2>
        <p className="mt-1 text-sm text-muted-foreground">Você será adicionado como Atendente.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo</Label>
        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email2">E-mail corporativo</Label>
        <Input id="email2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password2">Senha</Label>
        <Input id="password2" type="password" minLength={6} required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" disabled={busy} className="w-full" size="lg">
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Criar conta
      </Button>
    </form>
  );
}
