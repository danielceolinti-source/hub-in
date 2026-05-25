import { U as reactExports, L as jsxRuntimeExports } from "./server-DJBFbZXq.js";
import { u as useAuth, y as useNavigate, t as toast } from "./router-C7G81YgB.js";
import { S as ShieldCheck, L as Label, A as AuthService } from "./shield-check-BuSyNmNk.js";
import { L as LoaderCircle, B as Button } from "./loader-circle-C4DuzWLX.js";
import { I as Input } from "./input-Dtd6GMp8.js";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-DJpeGt4x.js";
import { L as Logo } from "./Logo-CQKJe80O.js";
import { m as motion } from "./proxy-B4abZrjL.js";
import { U as Users } from "./users-C2Dm-Yjm.js";
import { Z as Zap } from "./zap-Cq18Tcqm.js";
import { c as createLucideIcon } from "./createLucideIcon-DYOIArt-.js";
import { L as Lock } from "./lock-DwAAGoZT.js";
import { U as UserPlus } from "./user-plus-b7Srj4QF.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-CXsh0KIj.js";
const __iconNode = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode);
function AuthPage() {
  const {
    session,
    loading
  } = useAuth();
  const nav = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && session) nav({
      to: "/app"
    });
  }, [session, loading, nav]);
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative min-h-screen overflow-hidden bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-grid opacity-[0.18]" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute inset-0 bg-noise opacity-80" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full blur-3xl", style: {
      background: "radial-gradient(circle, oklch(0.68 0.20 250 / .35), transparent 60%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full blur-3xl", style: {
      background: "radial-gradient(circle, oklch(0.40 0.18 262 / .35), transparent 60%)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto grid min-h-screen max-w-7xl grid-cols-1 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden flex-col justify-between p-12 lg:flex", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          y: 14
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.6
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-balance text-5xl font-semibold tracking-tight text-foreground", children: "A central operacional da sua concessionária." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 max-w-md text-lg text-muted-foreground", children: "WhatsApp compartilhado, chat interno corporativo, CRM e dashboards em tempo real — unificados em uma única plataforma." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3", children: [{
            icon: Users,
            t: "Multiusuário",
            d: "Dezenas no mesmo número"
          }, {
            icon: Zap,
            t: "Tempo real",
            d: "Mensagens instantâneas"
          }, {
            icon: ShieldCheck,
            t: "Enterprise",
            d: "Permissões e auditoria"
          }].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-xl p-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "h-5 w-5 text-[color:var(--neon)]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm font-medium", children: f.t }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: f.d })
          ] }, f.t)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Concierge Auto Suite • FIAT & JEEP"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center p-6 sm:p-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          y: 20
        }, animate: {
          opacity: 1,
          y: 0
        }, transition: {
          duration: 0.45
        }, className: "w-full max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass rounded-2xl p-8 shadow-[var(--shadow-elevated)]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "login", className: "w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "login", children: "Entrar" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "signup", children: "Criar conta" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "login", className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoginForm, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "signup", className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SignupForm, {}) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-center text-xs text-muted-foreground", children: "Ao continuar você concorda com os Termos de Uso e a Política de Privacidade." })
        ] })
      ] })
    ] })
  ] });
}
function LoginForm() {
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [forgotMode, setForgotMode] = reactExports.useState(false);
  const [resetSent, setResetSent] = reactExports.useState(false);
  const nav = useNavigate();
  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await AuthService.signInWithUsername({
        username,
        password
      });
      toast.success("Bem-vindo de volta");
      nav({
        to: "/app"
      });
    } catch (err) {
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
    } catch (err) {
      toast.error(err.message || "Erro ao solicitar recuperação.");
    } finally {
      setBusy(false);
    }
  };
  if (forgotMode) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight", children: "Recuperar senha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Digite seu nome de usuário para receber instruções." })
      ] }),
      resetSent ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-600 dark:text-emerald-400", children: "Email de recuperação enviado! Verifique sua caixa de entrada." }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reset-username", children: "Nome de usuário" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "reset-username", required: true, value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Seu nome de usuário" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleForgotPassword, disabled: busy, className: "w-full", size: "lg", children: [
          busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
          "Enviar recuperação"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setForgotMode(false), className: "w-full text-center text-xs text-muted-foreground hover:text-foreground", children: "Voltar ao login" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight", children: "Acesse sua estação" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Use suas credenciais corporativas." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "username", children: "Nome de usuário" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "username", className: "pl-9", required: true, value: username, onChange: (e) => setUsername(e.target.value), placeholder: "admin, supervisor, atendente…", autoComplete: "username" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "password", children: "Senha" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setForgotMode(true), className: "text-xs text-muted-foreground hover:text-foreground", children: "Esqueceu?" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "password", className: "pl-9", type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), placeholder: "••••••••", autoComplete: "current-password" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: busy, className: "w-full", size: "lg", children: [
      busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
      "Entrar"
    ] })
  ] });
}
function SignupForm() {
  const [name, setName] = reactExports.useState("");
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirmPassword, setConfirmPassword] = reactExports.useState("");
  const [busy, setBusy] = reactExports.useState(false);
  const [usernameCheck, setUsernameCheck] = reactExports.useState("idle");
  const nav = useNavigate();
  const checkUsername = async (val) => {
    if (val.length < 3) {
      setUsernameCheck("idle");
      return;
    }
    setUsernameCheck("checking");
    try {
      const available = await AuthService.checkUsername(val);
      setUsernameCheck(available ? "available" : "taken");
    } catch {
      setUsernameCheck("idle");
    }
  };
  const onSubmit = async (e) => {
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
      await AuthService.signUp({
        username,
        full_name: name,
        password
      });
      toast.success("Conta criada! Você já pode entrar.");
      try {
        await AuthService.signInWithUsername({
          username,
          password
        });
        nav({
          to: "/app"
        });
      } catch {
        toast.success("Faça login com suas credenciais.");
      }
    } catch (err) {
      toast.error(err.message || "Erro ao criar conta.");
    } finally {
      setBusy(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-semibold tracking-tight", children: "Crie sua conta" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Você será adicionado como Atendente." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "signup-name", children: "Nome completo" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "signup-name", required: true, value: name, onChange: (e) => setName(e.target.value), placeholder: "Seu nome completo" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "signup-username", children: "Nome de usuário" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "signup-username", className: "pl-9 pr-9", required: true, value: username, onChange: (e) => {
          setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
          checkUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""));
        }, placeholder: "ex: joao.silva", minLength: 3, autoComplete: "off" }),
        usernameCheck === "checking" && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" }),
        usernameCheck === "available" && /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" }),
        usernameCheck === "taken" && /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" })
      ] }),
      usernameCheck === "available" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-emerald-500", children: "Usuário disponível!" }),
      usernameCheck === "taken" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: "Este nome de usuário já está em uso." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "signup-password", children: "Senha" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "signup-password", className: "pl-9", type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), minLength: 6, placeholder: "Mínimo 6 caracteres", autoComplete: "new-password" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "signup-confirm", children: "Confirmar senha" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "signup-confirm", type: "password", required: true, value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), placeholder: "Repita a senha", autoComplete: "new-password" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: busy || usernameCheck === "taken", className: "w-full", size: "lg", children: [
      busy ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null,
      "Criar conta"
    ] })
  ] });
}
export {
  AuthPage as component
};
