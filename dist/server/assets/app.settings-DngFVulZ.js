import { U as reactExports, L as jsxRuntimeExports } from "./server-DJBFbZXq.js";
import { C as Card, b as CardHeader, c as CardTitle, a as CardContent } from "./card-CW13SEI7.js";
import { T as Tabs, b as TabsList, c as TabsTrigger, a as TabsContent } from "./tabs-DJpeGt4x.js";
import { L as LoaderCircle, B as Button } from "./loader-circle-C4DuzWLX.js";
import { B as Badge } from "./badge-B-LTY4Gf.js";
import { q as useComposedRefs, v as useControllableState, c as Primitive, j as composeEventHandlers, z as useSize, m as createContextScope, i as cn, u as useAuth, s as supabase, t as toast } from "./router-C7G81YgB.js";
import { I as Input } from "./input-Dtd6GMp8.js";
import { L as Label, A as AuthService, S as ShieldCheck } from "./shield-check-BuSyNmNk.js";
import { D as Dialog, d as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-DoEE-fEh.js";
import { S as SectorsService } from "./sectors-HN5yciuM.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-CoWyifmn.js";
import { U as Users } from "./users-C2Dm-Yjm.js";
import { c as createLucideIcon } from "./createLucideIcon-DYOIArt-.js";
import { M as MessageCircle, P as Plus } from "./plus-DlSG476T.js";
import { Z as Zap } from "./zap-Cq18Tcqm.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./index-CXsh0KIj.js";
import "./Combination-D4FWDTZC.js";
const __iconNode$2 = [
  ["path", { d: "M12 22v-5", key: "1ega77" }],
  ["path", { d: "M15 8V2", key: "18g5xt" }],
  [
    "path",
    { d: "M17 8a1 1 0 0 1 1 1v4a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1z", key: "1xoxul" }
  ],
  ["path", { d: "M9 8V2", key: "14iosj" }]
];
const Plug = createLucideIcon("plug", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M10 11v6", key: "nco0om" }],
  ["path", { d: "M14 11v6", key: "outv1u" }],
  ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
];
const Trash2 = createLucideIcon("trash-2", __iconNode$1);
const __iconNode = [
  ["rect", { width: "8", height: "8", x: "3", y: "3", rx: "2", key: "by2w9f" }],
  ["path", { d: "M7 11v4a2 2 0 0 0 2 2h4", key: "xkn7yn" }],
  ["rect", { width: "8", height: "8", x: "13", y: "13", rx: "2", key: "1cgmvn" }]
];
const Workflow = createLucideIcon("workflow", __iconNode);
function usePrevious(value) {
  const ref = reactExports.useRef({ value, previous: value });
  return reactExports.useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value;
      ref.current.value = value;
    }
    return ref.current.previous;
  }, [value]);
}
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
const Switch = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    className: cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    ),
    ...props,
    ref,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Thumb,
      {
        className: cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
        )
      }
    )
  }
));
Switch.displayName = Root.displayName;
function Settings() {
  const {
    profile,
    company,
    roles,
    refresh
  } = useAuth();
  const [users, setUsers] = reactExports.useState([]);
  const [sectors, setSectors] = reactExports.useState([]);
  const [quickReplies, setQuickReplies] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [saving, setSaving] = reactExports.useState(false);
  const [showAddUser, setShowAddUser] = reactExports.useState(false);
  const [showAddSector, setShowAddSector] = reactExports.useState(false);
  const [showAddQuickReply, setShowAddQuickReply] = reactExports.useState(false);
  const [editUser, setEditUser] = reactExports.useState(null);
  const [editSector, setEditSector] = reactExports.useState(null);
  const [editQuickReply, setEditQuickReply] = reactExports.useState(null);
  const [newSectorName, setNewSectorName] = reactExports.useState("");
  const [newSectorColor, setNewSectorColor] = reactExports.useState("#3b82f6");
  const [newQuickShortcut, setNewQuickShortcut] = reactExports.useState("");
  const [newQuickBody, setNewQuickBody] = reactExports.useState("");
  const [newUserUsername, setNewUserUsername] = reactExports.useState("");
  const [newUserPassword, setNewUserPassword] = reactExports.useState("");
  const [newUserRole, setNewUserRole] = reactExports.useState("atendente");
  const [editUserRole, setEditUserRole] = reactExports.useState("");
  const isAdmin = roles.some((r) => ["admin_master", "diretor", "supervisor"].includes(r));
  reactExports.useEffect(() => {
    if (!company?.id) return;
    setLoading(true);
    Promise.all([supabase.from("profiles").select(`*, user_roles(role)`).eq("company_id", company.id).order("full_name"), SectorsService.getAll(company.id), supabase.from("quick_replies").select("*").eq("company_id", company.id).order("shortcut")]).then(([usersRes, sectorsData, repliesRes]) => {
      setUsers(usersRes.data || []);
      setSectors(sectorsData);
      setQuickReplies(repliesRes.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [company?.id]);
  const handleUpdateUserRole = async (userId, role) => {
    if (!company?.id) return;
    try {
      await AuthService.updateUserRole(userId, role, company.id);
      toast.success("Cargo atualizado");
      const {
        data
      } = await supabase.from("profiles").select(`*, user_roles(role)`).eq("company_id", company.id);
      if (data) setUsers(data);
    } catch {
      toast.error("Erro ao atualizar cargo");
    }
  };
  const handleAddSector = async () => {
    if (!newSectorName.trim() || !company?.id) return;
    try {
      await SectorsService.create({
        company_id: company.id,
        name: newSectorName.trim(),
        slug: newSectorName.trim().toLowerCase().replace(/\s+/g, "-"),
        color: newSectorColor
      });
      toast.success("Setor criado!");
      setShowAddSector(false);
      setNewSectorName("");
      setSectors(await SectorsService.getAll(company.id));
    } catch {
      toast.error("Erro ao criar setor");
    }
  };
  const handleDeleteSector = async (id) => {
    try {
      await SectorsService.delete(id);
      toast.success("Setor removido");
      if (company) setSectors(await SectorsService.getAll(company.id));
    } catch {
      toast.error("Erro ao remover setor");
    }
  };
  const handleAddQuickReply = async () => {
    if (!newQuickShortcut.trim() || !newQuickBody.trim() || !company?.id) return;
    try {
      const {
        error
      } = await supabase.from("quick_replies").insert({
        company_id: company.id,
        shortcut: newQuickShortcut.trim(),
        body: newQuickBody.trim()
      });
      if (error) throw error;
      toast.success("Resposta rápida criada!");
      setShowAddQuickReply(false);
      setNewQuickShortcut("");
      setNewQuickBody("");
      const {
        data
      } = await supabase.from("quick_replies").select("*").eq("company_id", company.id);
      if (data) setQuickReplies(data);
    } catch {
      toast.error("Erro ao criar resposta rápida");
    }
  };
  const handleDeleteQuickReply = async (id) => {
    try {
      await supabase.from("quick_replies").delete().eq("id", id);
      toast.success("Resposta removida");
      if (company) {
        const {
          data
        } = await supabase.from("quick_replies").select("*").eq("company_id", company.id);
        if (data) setQuickReplies(data);
      }
    } catch {
      toast.error("Erro ao remover");
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] space-y-6 p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Configurações" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Administre usuários, setores e regras operacionais." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "users", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full max-w-2xl grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "users", className: "gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3.5 w-3.5" }),
          "Usuários"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "sectors", className: "gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Workflow, { className: "h-3.5 w-3.5" }),
          "Setores"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "replies", className: "gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5" }),
          "Respostas"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "integrations", className: "gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plug, { className: "h-3.5 w-3.5" }),
          "Integrações"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "users", className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Equipe" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Gerencie cargos e permissões." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: showAddUser, onOpenChange: setShowAddUser, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
              " Novo usuário"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Adicionar usuário" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome de usuário" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newUserUsername, onChange: (e) => setNewUserUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")), placeholder: "username" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Senha temporária" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "password", value: newUserPassword, onChange: (e) => setNewUserPassword(e.target.value), placeholder: "Mínimo 6 caracteres" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cargo" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: newUserRole, onChange: (e) => setNewUserRole(e.target.value), className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "atendente", children: "Atendente" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "supervisor", children: "Supervisor" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "diretor", children: "Diretor" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin_master", children: "Admin Master" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { disabled: !newUserUsername || !newUserPassword, className: "w-full", onClick: async () => {
                  try {
                    await AuthService.signUp({
                      username: newUserUsername,
                      full_name: newUserUsername,
                      password: newUserPassword
                    });
                    if (company) {
                      await AuthService.updateUserRole((await supabase.from("profiles").select("id").eq("username", newUserUsername).single()).data?.id, newUserRole, company.id);
                    }
                    toast.success("Usuário criado!");
                    setShowAddUser(false);
                    setNewUserUsername("");
                    setNewUserPassword("");
                    if (company) {
                      const {
                        data
                      } = await supabase.from("profiles").select(`*, user_roles(role)`).eq("company_id", company.id);
                      if (data) setUsers(data);
                    }
                  } catch (err) {
                    toast.error(err.message);
                  }
                }, children: "Criar usuário" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "divide-y", children: users.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-sm text-muted-foreground", children: "Nenhum usuário encontrado" }) : users.map((u) => {
          const userRole = u.user_roles?.[0]?.role || "atendente";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-9 w-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: (u.full_name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: u.full_name || "—" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                  "@",
                  u.username || "—",
                  " ",
                  u.email ? `• ${u.email}` : ""
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: userRole, onChange: (e) => handleUpdateUserRole(u.id, e.target.value), className: "h-8 rounded-md border border-input bg-background px-2 text-xs", disabled: !isAdmin, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "atendente", children: "Atendente" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "supervisor", children: "Supervisor" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "diretor", children: "Diretor" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "admin_master", children: "Admin Master" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `h-2 w-2 rounded-full ${u.presence === "online" ? "bg-emerald-500" : "bg-muted-foreground"}` })
            ] })
          ] }, u.id);
        }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "sectors", className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Setores" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Departamentos da empresa." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setShowAddSector(true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
              " Novo setor"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "divide-y", children: sectors.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-sm text-muted-foreground", children: "Nenhum setor criado" }) : sectors.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-3 rounded-full", style: {
                background: s.color || "#3b82f6"
              } }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: s.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: s.slug })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteSector(s.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
          ] }, s.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAddSector, onOpenChange: setShowAddSector, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Novo setor" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Nome" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newSectorName, onChange: (e) => setNewSectorName(e.target.value), placeholder: "ex: Vendas" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Cor" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "color", value: newSectorColor, onChange: (e) => setNewSectorColor(e.target.value), className: "h-10 w-10 rounded border cursor-pointer" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: newSectorColor })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleAddSector, disabled: !newSectorName.trim(), className: "w-full", children: "Criar setor" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "replies", className: "mt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Respostas rápidas" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Atalhos para agilizar atendimento." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setShowAddQuickReply(true), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-4 w-4 mr-1" }),
              " Nova resposta"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-2", children: quickReplies.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-8 text-center text-sm text-muted-foreground", children: "Nenhuma resposta rápida criada" }) : quickReplies.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-lg border p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("code", { className: "rounded bg-muted px-2 py-1 text-xs whitespace-nowrap", children: [
              "/",
              q.shortcut
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "flex-1 text-sm", children: q.body }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", onClick: () => handleDeleteQuickReply(q.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })
          ] }, q.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAddQuickReply, onOpenChange: setShowAddQuickReply, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Nova resposta rápida" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Atalho" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newQuickShortcut, onChange: (e) => setNewQuickShortcut(e.target.value.replace(/\s+/g, "-")), placeholder: "saudacao" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Mensagem" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: newQuickBody, onChange: (e) => setNewQuickBody(e.target.value), className: "flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm", placeholder: "Texto da resposta..." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleAddQuickReply, disabled: !newQuickShortcut.trim() || !newQuickBody.trim(), className: "w-full", children: "Criar resposta" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "integrations", className: "mt-6 grid grid-cols-1 gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(IntegrationCard, { name: "Z-API", desc: "Conecte múltiplos números WhatsApp via Z-API com reconexão automática.", status: "disponível", configured: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(IntegrationCard, { name: "Evolution API", desc: "Servidor open-source para WhatsApp multiusuário.", status: "disponível", configured: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(IntegrationCard, { name: "Meta WhatsApp Cloud", desc: "API oficial Meta. Templates aprovados e alta confiabilidade.", status: "disponível", configured: false }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(IntegrationCard, { name: "IA Gateway", desc: "IA integrada para roteamento inteligente e sugestões.", status: "ativo", configured: true })
      ] })
    ] })
  ] }) });
}
function IntegrationCard({
  name,
  desc,
  status,
  configured
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-start justify-between space-y-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-10 w-10 place-items-center rounded-lg bg-[color:var(--neon)]/15 text-[color:var(--neon)]", children: configured ? /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-5 w-5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: configured ? "default" : "outline", className: "mt-1", children: status })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Switch, { checked: configured })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: desc }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: configured ? "outline" : "default", children: configured ? "Configurar" : "Conectar" }) })
    ] })
  ] });
}
export {
  Settings as component
};
