import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { AuthService } from "@/lib/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/brand/Logo";
import { toast } from "sonner";
import { Loader2, ShieldCheck, Zap, Users, User, Lock, UserPlus } from "lucide-react";

export const Route = createFileRoute("/auth")({ component: AuthPage });

function AuthPage() {
  const { session, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && session) nav({ to: "/app" }); }, [session, loading, nav]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.18]" />
      <div className="pointer-events-none absolute inset-0 bg-noise opacity-80" />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.68 0.20 250 / .35), transparent 60%)" }} />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.40 0.18 262 / .35), transparent 60%)" }} />

      <div className="relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2">
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const nav = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await AuthService.signInWithUsername({ username, password });
      toast.success("Bem-vindo de volta");
      nav({ to: "/app" });
    } catch (err: any) {
      toast.error(err.message || "Erro ao entrar. Verifique suas credenciais.");
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!username) {
      toast.error("Digite seu nome de usuário primeiro.");
      return;
    }
    setBusy(true);
    try {
      await AuthService.resetPassword(username);
      setResetSent(true);
      toast.success("Se o usuário existir, um email de recuperação será enviado.");
    } catch (err: any) {
      toast.error(err.message || "Erro ao solicitar recuperação.");
    } finally {
      setBusy(false);
    }
  };

  if (forgotMode) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Recuperar senha</h2>
          <p className="mt-1 text-sm text-muted-foreground">Digite seu nome de usuário para receber instruções.</p>
        </div>
        {resetSent ? (
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-600 dark:text-emerald-400">
            Email de recuperação enviado! Verifique sua caixa de entrada.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="reset-username">Nome de usuário</Label>
              <Input id="reset-username" required value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu nome de usuário" />
            </div>
            <Button onClick={handleForgotPassword} disabled={busy} className="w-full" size="lg">
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Enviar recuperação
            </Button>
          </div>
        )}
        <button onClick={() => setForgotMode(false)} className="w-full text-center text-xs text-muted-foreground hover:text-foreground">
          Voltar ao login
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Acesse sua estação</h2>
        <p className="mt-1 text-sm text-muted-foreground">Use suas credenciais corporativas.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Nome de usuário</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="username" className="pl-9" required value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin, supervisor, atendente…" autoComplete="username" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <button type="button" onClick={() => setForgotMode(true)}
            className="text-xs text-muted-foreground hover:text-foreground">Esqueceu?</button>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="password" className="pl-9" type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" autoComplete="current-password" />
        </div>
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
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [usernameCheck, setUsernameCheck] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const nav = useNavigate();

  const checkUsername = async (val: string) => {
    if (val.length < 3) { setUsernameCheck("idle"); return; }
    setUsernameCheck("checking");
    try {
      const available = await AuthService.checkUsername(val);
      setUsernameCheck(available ? "available" : "taken");
    } catch {
      setUsernameCheck("idle");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      toast.error("A senha deve ter no mínimo 6 caracteres.");
      return;
    }
    setBusy(true);
    try {
      await AuthService.signUp({ username, full_name: name, password });
      toast.success("Conta criada! Você já pode entrar.");
      // Auto-login after signup
      try {
        await AuthService.signInWithUsername({ username, password });
        nav({ to: "/app" });
      } catch {
        toast.success("Faça login com suas credenciais.");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar conta.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Crie sua conta</h2>
        <p className="mt-1 text-sm text-muted-foreground">Você será adicionado como Atendente.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-name">Nome completo</Label>
        <Input id="signup-name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome completo" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-username">Nome de usuário</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="signup-username" className="pl-9 pr-9" required value={username}
            onChange={(e) => { setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')); checkUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')); }}
            placeholder="ex: joao.silva" minLength={3} autoComplete="off" />
          {usernameCheck === "checking" && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
          {usernameCheck === "available" && <UserPlus className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />}
          {usernameCheck === "taken" && <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />}
        </div>
        {usernameCheck === "available" && <p className="text-xs text-emerald-500">Usuário disponível!</p>}
        {usernameCheck === "taken" && <p className="text-xs text-destructive">Este nome de usuário já está em uso.</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-password">Senha</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input id="signup-password" className="pl-9" type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)} minLength={6} placeholder="Mínimo 6 caracteres" autoComplete="new-password" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="signup-confirm">Confirmar senha</Label>
        <Input id="signup-confirm" type="password" required value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha" autoComplete="new-password" />
      </div>
      <Button type="submit" disabled={busy || usernameCheck === "taken"} className="w-full" size="lg">
        {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Criar conta
      </Button>
    </form>
  );
}