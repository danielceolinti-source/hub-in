import { U as reactExports, L as jsxRuntimeExports } from "./server-DJBFbZXq.js";
import { C as Card, a as CardContent } from "./card-CW13SEI7.js";
import { I as Input } from "./input-Dtd6GMp8.js";
import { B as Button, L as LoaderCircle } from "./loader-circle-C4DuzWLX.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-CoWyifmn.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-DoEE-fEh.js";
import { u as useAuth, s as supabase, t as toast } from "./router-C7G81YgB.js";
import { U as UserPlus } from "./user-plus-b7Srj4QF.js";
import { S as Search } from "./search-YJG3FFGL.js";
import { S as Sparkles, P as Phone } from "./sparkles-Ce-ynm17.js";
import { M as MessageSquare } from "./message-square-5-0YFdsd.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-DYOIArt-.js";
import "./Combination-D4FWDTZC.js";
function ContactsPage() {
  const {
    company,
    profile
  } = useAuth();
  const [contacts, setContacts] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [search, setSearch] = reactExports.useState("");
  const [showAdd, setShowAdd] = reactExports.useState(false);
  const [newName, setNewName] = reactExports.useState("");
  const [newPhone, setNewPhone] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (!company?.id) return;
    setLoading(true);
    (async () => {
      try {
        const {
          data,
          error
        } = await supabase.from("conversations").select("id, contact_name, contact_phone, contact_avatar_url, last_message_at, sector_id, assigned_to").eq("company_id", company.id).order("last_message_at", {
          ascending: false,
          nullsFirst: false
        });
        if (error) throw error;
        const seen = /* @__PURE__ */ new Set();
        const unique = [];
        (data || []).forEach((c) => {
          if (!seen.has(c.contact_phone)) {
            seen.add(c.contact_phone);
            unique.push(c);
          }
        });
        setContacts(unique);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [company?.id]);
  const filtered = contacts.filter((c) => c.contact_name.toLowerCase().includes(search.toLowerCase()) || c.contact_phone.includes(search));
  const handleAdd = async () => {
    if (!newName.trim() || !newPhone.trim() || !company?.id) return;
    try {
      const {
        data,
        error
      } = await supabase.from("conversations").insert({
        company_id: company.id,
        contact_name: newName.trim(),
        contact_phone: newPhone.trim(),
        assigned_to: profile?.id,
        status: "open"
      }).select().single();
      if (error) throw error;
      toast.success("Contato adicionado!");
      setContacts((prev) => [data, ...prev]);
      setShowAdd(false);
      setNewName("");
      setNewPhone("");
    } catch {
      toast.error("Erro ao adicionar contato");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-5xl space-y-6 p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-semibold tracking-tight", children: "Contatos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
          contacts.length,
          " contatos"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setShowAdd(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-1" }),
        " Novo contato"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Buscar...", className: "pl-9" })
    ] }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center gap-3 p-12 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--neon)]/15 text-[color:var(--neon)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-6 w-6" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-medium", children: "Nenhum contato encontrado" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setShowAdd(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4 mr-1" }),
        " Adicionar contato"
      ] })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3", children: filtered.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-10 w-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { children: c.contact_name.split(" ").map((p) => p[0]).slice(0, 2).join("") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: c.contact_name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: c.contact_phone })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "flex-1 gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-3.5 w-3.5" }),
          " Conversar"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-3.5 w-3.5" }) })
      ] })
    ] }) }, c.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showAdd, onOpenChange: setShowAdd, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Novo contato" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Nome" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newName, onChange: (e) => setNewName(e.target.value), placeholder: "Nome completo" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Telefone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newPhone, onChange: (e) => setNewPhone(e.target.value), placeholder: "+55 11 99999-9999" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleAdd, disabled: !newName.trim() || !newPhone.trim(), className: "w-full", children: "Adicionar" })
      ] })
    ] }) })
  ] }) });
}
export {
  ContactsPage as component
};
