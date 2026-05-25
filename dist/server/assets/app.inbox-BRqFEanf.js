import { U as reactExports, L as jsxRuntimeExports } from "./server-DJBFbZXq.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-CoWyifmn.js";
import { B as Badge } from "./badge-B-LTY4Gf.js";
import { L as LoaderCircle, B as Button } from "./loader-circle-C4DuzWLX.js";
import { I as Input } from "./input-Dtd6GMp8.js";
import { D as Dialog, d as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-DoEE-fEh.js";
import { T as Tabs, b as TabsList, c as TabsTrigger } from "./tabs-DJpeGt4x.js";
import { i as cn, s as supabase, u as useAuth, t as toast } from "./router-C7G81YgB.js";
import { c as createLucideIcon, a as createSlot } from "./createLucideIcon-DYOIArt-.js";
import { S as SectorsService } from "./sectors-HN5yciuM.js";
import { U as UserPlus } from "./user-plus-b7Srj4QF.js";
import { S as Search } from "./search-YJG3FFGL.js";
import { P as Phone, S as Sparkles } from "./sparkles-Ce-ynm17.js";
import { C as Clock } from "./clock--VyFA4N5.js";
import { S as Send } from "./send-DwEHiMOO.js";
import { m as motion } from "./proxy-B4abZrjL.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./Combination-D4FWDTZC.js";
import "./index-CXsh0KIj.js";
const __iconNode$4 = [
  ["path", { d: "M18 6 7 17l-5-5", key: "116fxf" }],
  ["path", { d: "m22 10-7.5 7.5L13 16", key: "ke71qq" }]
];
const CheckCheck = createLucideIcon("check-check", __iconNode$4);
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
];
const EllipsisVertical = createLucideIcon("ellipsis-vertical", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z",
      key: "sc7q7i"
    }
  ]
];
const Funnel = createLucideIcon("funnel", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",
      key: "r04s7s"
    }
  ]
];
const Star = createLucideIcon("star", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z",
      key: "1dfntj"
    }
  ],
  ["path", { d: "M15 3v5a1 1 0 0 0 1 1h5", key: "6s6qgf" }]
];
const StickyNote = createLucideIcon("sticky-note", __iconNode);
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[/* @__PURE__ */ Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var NAME = "Separator";
var DEFAULT_ORIENTATION = "horizontal";
var ORIENTATIONS = ["horizontal", "vertical"];
var Separator$1 = reactExports.forwardRef((props, forwardedRef) => {
  const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
  const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
  const ariaOrientation = orientation === "vertical" ? orientation : void 0;
  const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Primitive.div,
    {
      "data-orientation": orientation,
      ...semanticProps,
      ...domProps,
      ref: forwardedRef
    }
  );
});
Separator$1.displayName = NAME;
function isValidOrientation(orientation) {
  return ORIENTATIONS.includes(orientation);
}
var Root = Separator$1;
const Separator = reactExports.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    decorative,
    orientation,
    className: cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    ),
    ...props
  }
));
Separator.displayName = Root.displayName;
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
class ConversationsService {
  static async getConversations(params) {
    let query = supabase.from("conversations").select(`
        *,
        sectors(name, color),
        assigned:profiles!conversations_assigned_to_fkey(full_name)
      `).eq("company_id", params.companyId).order("last_message_at", { ascending: false, nullsFirst: false });
    if (params.status && params.status !== "all") {
      if (params.status === "unread") {
        query = query.gt("unread_count", 0);
      } else if (params.status === "pinned") {
        query = query.eq("is_favorite", true);
      } else {
        query = query.eq("status", params.status);
      }
    }
    if (params.assignedTo) {
      query = query.eq("assigned_to", params.assignedTo);
    }
    if (params.sectorId) {
      query = query.eq("sector_id", params.sectorId);
    }
    if (params.favorite) {
      query = query.eq("is_favorite", true);
    }
    if (params.search) {
      query = query.or(`contact_name.ilike.%${params.search}%,contact_phone.ilike.%${params.search}%,last_message_preview.ilike.%${params.search}%`);
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map((c) => ({
      ...c,
      sector_name: c.sectors?.name || null,
      sector_color: c.sectors?.color || null,
      assigned_name: c.assigned?.full_name || null,
      tags: []
    }));
  }
  static async getConversation(id) {
    const { data, error } = await supabase.from("conversations").select(`
        *,
        sectors(name, color),
        assigned:profiles!conversations_assigned_to_fkey(full_name, avatar_url),
        conversation_tags(
          tags(id, name, color)
        )
      `).eq("id", id).single();
    if (error) throw error;
    const conv = data;
    return {
      ...conv,
      sector_name: conv.sectors?.name || null,
      sector_color: conv.sectors?.color || null,
      assigned_name: conv.assigned?.full_name || null,
      tags: conv.conversation_tags?.map((ct) => ct.tags) || []
    };
  }
  static async createConversation(data) {
    const { data: result, error } = await supabase.from("conversations").insert({
      company_id: data.company_id,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      sector_id: data.sector_id,
      assigned_to: data.assigned_to,
      channel: data.channel || "whatsapp",
      status: "open"
    }).select().single();
    if (error) throw error;
    return result;
  }
  static async updateConversation(id, updates) {
    const { data, error } = await supabase.from("conversations").update(updates).eq("id", id).select().single();
    if (error) throw error;
    return data;
  }
  static async assignConversation(id, userId) {
    return this.updateConversation(id, { assigned_to: userId });
  }
  static async toggleFavorite(id, isFavorite) {
    return this.updateConversation(id, { is_favorite: !isFavorite });
  }
  static async updateStatus(id, status) {
    return this.updateConversation(id, { status });
  }
  static async markAsRead(id) {
    return this.updateConversation(id, { unread_count: 0 });
  }
  static async deleteConversation(id) {
    const { error } = await supabase.from("conversations").delete().eq("id", id);
    if (error) throw error;
  }
  static subscribeToConversations(companyId, callback) {
    return supabase.channel("conversations-realtime").on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "conversations",
        filter: `company_id=eq.${companyId}`
      },
      callback
    ).subscribe();
  }
}
class MessagesService {
  static async getMessages(conversationId) {
    const { data, error } = await supabase.from("messages").select(`
        *,
        sender:profiles!messages_sender_id_fkey(full_name, avatar_url)
      `).eq("conversation_id", conversationId).order("created_at", { ascending: true });
    if (error) throw error;
    return (data || []).map((m) => ({
      ...m,
      sender_name: m.sender?.full_name || null,
      sender_avatar: m.sender?.avatar_url || null
    }));
  }
  static async sendMessage(data) {
    const { data: result, error } = await supabase.from("messages").insert({
      conversation_id: data.conversation_id,
      sender_id: data.sender_id,
      direction: data.direction,
      body: data.body,
      type: data.type || "text",
      is_internal: data.is_internal || false
    }).select().single();
    if (error) throw error;
    await supabase.from("conversations").update({
      last_message_preview: data.body.substring(0, 100),
      last_message_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", data.conversation_id);
    return result;
  }
  static async sendInternalNote(data) {
    const { data: result, error } = await supabase.from("notes").insert({
      conversation_id: data.conversation_id,
      author_id: data.author_id,
      body: data.body
    }).select(`*, author:profiles(full_name, avatar_url)`).single();
    if (error) throw error;
    return result;
  }
  static async getNotes(conversationId) {
    const { data, error } = await supabase.from("notes").select(`*, author:profiles(full_name, avatar_url)`).eq("conversation_id", conversationId).order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }
  static async markAsRead(messageIds) {
    const { error } = await supabase.from("messages").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).in("id", messageIds);
    if (error) throw error;
  }
  static subscribeToMessages(conversationId, callback) {
    return supabase.channel(`messages-${conversationId}`).on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`
      },
      callback
    ).subscribe();
  }
  static async setTypingIndicator(conversationId, userId, isTyping) {
    const { error } = await supabase.from("typing_indicators").upsert(
      {
        conversation_id: conversationId,
        user_id: userId,
        is_typing: isTyping,
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      },
      { onConflict: "conversation_id, user_id" }
    );
    if (error) console.error("Typing indicator error:", error);
  }
  static subscribeToTyping(conversationId, userId, callback) {
    return supabase.channel(`typing-${conversationId}`).on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "typing_indicators",
        filter: `conversation_id=eq.${conversationId}`
      },
      (payload) => {
        if (payload.new?.user_id !== userId) {
          callback(payload);
        }
      }
    ).subscribe();
  }
}
function Inbox() {
  const {
    profile,
    company
  } = useAuth();
  const [conversations, setConversations] = reactExports.useState([]);
  const [activeId, setActiveId] = reactExports.useState(null);
  const [messages, setMessages] = reactExports.useState([]);
  const [notes, setNotes] = reactExports.useState([]);
  const [tab, setTab] = reactExports.useState("all");
  const [q, setQ] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(true);
  const [sending, setSending] = reactExports.useState(false);
  const [messageText, setMessageText] = reactExports.useState("");
  const [showTransfer, setShowTransfer] = reactExports.useState(false);
  const [sectors, setSectors] = reactExports.useState([]);
  const [agents, setAgents] = reactExports.useState([]);
  const [typingUsers, setTypingUsers] = reactExports.useState(/* @__PURE__ */ new Set());
  const messagesEndRef = reactExports.useRef(null);
  const typingTimeoutRef = reactExports.useRef();
  const activeConv = reactExports.useMemo(() => conversations.find((c) => c.id === activeId), [conversations, activeId]);
  reactExports.useEffect(() => {
    if (!company?.id) return;
    setLoading(true);
    const load = async () => {
      try {
        const data = await ConversationsService.getConversations({
          companyId: company.id
        });
        setConversations(data);
        if (data.length > 0 && !activeId) setActiveId(data[0].id);
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar conversas");
      } finally {
        setLoading(false);
      }
    };
    load();
    SectorsService.getAll(company.id).then(setSectors).catch(() => {
    });
    fetch(`/api/users?company_id=${company.id}`).then((r) => r.json()).then(setAgents).catch(() => {
    });
    const sub = ConversationsService.subscribeToConversations(company.id, (payload) => {
      if (payload.eventType === "INSERT") {
        setConversations((prev) => [{
          ...payload.new,
          sector_name: null,
          sector_color: null,
          assigned_name: null,
          tags: []
        }, ...prev]);
      } else if (payload.eventType === "UPDATE") {
        setConversations((prev) => prev.map((c) => c.id === payload.new.id ? {
          ...c,
          ...payload.new
        } : c));
      } else if (payload.eventType === "DELETE") {
        setConversations((prev) => prev.filter((c) => c.id !== payload.old.id));
      }
    });
    return () => {
      sub.unsubscribe();
    };
  }, [company?.id]);
  reactExports.useEffect(() => {
    if (!activeId) return;
    ConversationsService.getConversation(activeId).then((conv) => {
      setConversations((prev) => prev.map((c) => c.id === activeId ? {
        ...c,
        ...conv
      } : c));
    });
    MessagesService.getMessages(activeId).then(setMessages).catch(console.error);
    MessagesService.getNotes(activeId).then(setNotes).catch(console.error);
    const sub = MessagesService.subscribeToMessages(activeId, async (payload) => {
      if (payload.eventType === "INSERT") {
        const msg = payload.new;
        if (msg.sender_id) {
          const {
            data: sender
          } = await (await fetch(`/api/profile/${msg.sender_id}`)).json();
          setMessages((prev) => [...prev, {
            ...msg,
            sender_name: sender?.full_name,
            sender_avatar: sender?.avatar_url
          }]);
        } else {
          setMessages((prev) => [...prev, msg]);
        }
      }
    });
    if (profile?.id) {
      const typingSub = MessagesService.subscribeToTyping(activeId, profile.id, (payload) => {
        if (payload.new?.is_typing) {
          setTypingUsers((prev) => new Set(prev).add(payload.new.user_id));
        } else {
          setTypingUsers((prev) => {
            const s = new Set(prev);
            s.delete(payload.new?.user_id);
            return s;
          });
        }
      });
      return () => {
        sub.unsubscribe();
        typingSub.unsubscribe();
      };
    }
    return () => {
      sub.unsubscribe();
    };
  }, [activeId]);
  reactExports.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages.length]);
  const filteredConversations = reactExports.useMemo(() => {
    return conversations.filter((c) => {
      if (tab === "unread" && c.unread_count === 0) return false;
      if (tab === "pinned" && !c.is_favorite) return false;
      if (tab === "resolved" && c.status !== "resolved") return false;
      if (q && !`${c.contact_name} ${c.contact_phone} ${c.last_message_preview || ""}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [conversations, tab, q]);
  const handleSend = async () => {
    if (!messageText.trim() || !activeId || !profile?.id) return;
    setSending(true);
    try {
      await MessagesService.sendMessage({
        conversation_id: activeId,
        sender_id: profile.id,
        direction: "outbound",
        body: messageText.trim()
      });
      setMessageText("");
      MessagesService.setTypingIndicator(activeId, profile.id, false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    } catch (err) {
      toast.error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };
  const handleTyping = (text) => {
    setMessageText(text);
    if (!activeId || !profile?.id) return;
    MessagesService.setTypingIndicator(activeId, profile.id, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      MessagesService.setTypingIndicator(activeId, profile.id, false);
    }, 2e3);
  };
  const handleStatusChange = async (status) => {
    if (!activeId) return;
    try {
      await ConversationsService.updateStatus(activeId, status);
      toast.success(`Conversa ${status === "resolved" ? "finalizada" : "atualizada"}`);
    } catch {
      toast.error("Erro ao atualizar status");
    }
  };
  const handleAssign = async (userId) => {
    if (!activeId) return;
    try {
      await ConversationsService.assignConversation(activeId, userId);
      toast.success("Atendente atribuído");
      setShowTransfer(false);
    } catch {
      toast.error("Erro ao atribuir");
    }
  };
  const handleNewConversation = async () => {
    if (!company?.id) return;
    const name = prompt("Nome do contato:");
    if (!name) return;
    const phone = prompt("Telefone do contato (com DDD):");
    if (!phone) return;
    try {
      const conv = await ConversationsService.createConversation({
        company_id: company.id,
        contact_name: name,
        contact_phone: phone,
        assigned_to: profile?.id
      });
      setActiveId(conv.id);
      setConversations((prev) => [{
        ...conv,
        sector_name: null,
        sector_color: null,
        assigned_name: profile?.full_name,
        tags: []
      }, ...prev]);
      toast.success("Conversa criada");
    } catch {
      toast.error("Erro ao criar conversa");
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid h-full grid-cols-[340px_1fr_320px] overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "flex flex-col border-r bg-card/40 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 border-b p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold", children: "Atendimentos" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              filteredConversations.length,
              " conversas"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", className: "h-8 w-8", onClick: handleNewConversation, children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-4 w-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Funnel, { className: "h-4 w-4" }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Buscar...", className: "h-9 pl-9 text-sm" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Tabs, { value: tab, onValueChange: setTab, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid h-8 w-full grid-cols-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "all", className: "text-xs", children: "Todas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "unread", className: "text-xs", children: "Novas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "pinned", className: "text-xs", children: "Fixas" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "resolved", className: "text-xs", children: "Concluídas" })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto", children: filteredConversations.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 px-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-8 w-8 text-muted-foreground/40 mb-2" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Nenhuma conversa encontrada" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "link", size: "sm", onClick: handleNewConversation, className: "mt-2", children: "Criar nova conversa" })
      ] }) : filteredConversations.map((c) => {
        const isActive = c.id === activeId;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveId(c.id), className: `relative flex w-full items-start gap-3 border-b border-border/50 px-4 py-3 text-left transition ${isActive ? "bg-accent/60" : "hover:bg-accent/40"}`, children: [
          isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-0 top-2 h-[calc(100%-16px)] w-[3px] rounded-r bg-[color:var(--neon)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-10 w-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs", children: c.contact_name.split(" ").map((p) => p[0]).slice(0, 2).join("") }) }),
            c.status === "open" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" }),
            c.status === "pending" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-card" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-semibold", children: c.contact_name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-[10px] text-muted-foreground", children: c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
              }) : "" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-xs text-muted-foreground", children: c.last_message_preview || "Nenhuma mensagem" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-1.5", children: [
              c.sector_name && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium", style: {
                background: `${c.sector_color || "#3b82f6"}1f`,
                color: c.sector_color || "#3b82f6"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1 w-1 rounded-full", style: {
                  background: c.sector_color || "#3b82f6"
                } }),
                c.sector_name
              ] }),
              c.is_favorite && /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-3 w-3 text-amber-500 fill-amber-500" }),
              c.unread_count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "ml-auto h-4 min-w-[16px] justify-center bg-[color:var(--neon)] px-1 text-[10px] text-white", children: c.unread_count })
            ] })
          ] })
        ] }, c.id);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "flex min-w-0 flex-col bg-background", children: activeConv ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-16 shrink-0 items-center justify-between border-b bg-card/40 px-5 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-10 w-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs", children: activeConv.contact_name.split(" ").map((p) => p[0]).slice(0, 2).join("") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold leading-tight", children: activeConv.contact_name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              activeConv.contact_phone,
              activeConv.status === "open" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-500 ml-1", children: "• online" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleStatusChange("resolved"), title: "Finalizar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { orientation: "vertical", className: "mx-1 h-6" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: showTransfer, onOpenChange: setShowTransfer, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3.5 w-3.5" }),
              " Transferir"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Transferir conversa" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: agents.filter((a) => a.id !== profile?.id).map((agent) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => handleAssign(agent.id), className: "flex w-full items-center gap-3 rounded-lg p-2 hover:bg-accent", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs", children: agent.full_name?.split(" ").map((p) => p[0]).join("") }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-left", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: agent.full_name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: agent.job_title || "Atendente" })
                ] })
              ] }, agent.id)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-6 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-3xl flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DayDivider, { label: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", {
          weekday: "long",
          day: "numeric",
          month: "long"
        }) }),
        messages.map((m) => m.is_internal ? /* @__PURE__ */ jsxRuntimeExports.jsx(InternalNote, { text: m.body || "", author: m.sender_name || "Sistema", time: new Date(m.created_at).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit"
        }) }, m.id) : /* @__PURE__ */ jsxRuntimeExports.jsx(Bubble, { side: m.direction === "outbound" ? "out" : "in", text: m.body || "", time: new Date(m.created_at).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit"
        }), name: m.direction === "outbound" ? "Você" : activeConv.contact_name }, m.id)),
        Array.from(typingUsers).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(TypingIndicator, { name: activeConv.contact_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0 border-t bg-card/60 px-5 py-3 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-3xl flex-col gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3.5 w-3.5 text-[color:var(--neon)]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }),
            " SLA em tempo real"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
          e.preventDefault();
          handleSend();
        }, className: "flex items-end gap-2 rounded-xl border bg-background focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: messageText, onChange: (e) => handleTyping(e.target.value), placeholder: "Digite uma mensagem…", className: "max-h-32 min-h-[44px] flex-1 resize-none border-0 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground shadow-none focus-visible:ring-0", onKeyDown: (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "icon", className: "h-9 w-9", disabled: sending || !messageText.trim(), children: sending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) }) })
        ] })
      ] }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "mx-auto h-12 w-12 text-muted-foreground/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Selecione uma conversa" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "link", size: "sm", onClick: handleNewConversation, children: "Nova conversa" })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "flex flex-col border-l bg-card/40 backdrop-blur", children: activeConv ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b p-5 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "mx-auto h-16 w-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-lg", children: activeConv.contact_name.split(" ").map((p) => p[0]).slice(0, 2).join("") }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm font-semibold", children: activeConv.contact_name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: activeConv.contact_phone }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 flex justify-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "gap-1.5", onClick: () => ConversationsService.toggleFavorite(activeId, activeConv.is_favorite), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: `h-3.5 w-3.5 ${activeConv.is_favorite ? "fill-amber-500 text-amber-500" : ""}` }),
          " ",
          activeConv.is_favorite ? "Fixada" : "Fixar"
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-5 overflow-y-auto p-5 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Section, { title: "Atribuição", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Setor", value: activeConv.sector_name ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs", style: {
            background: `${activeConv.sector_color || "#3b82f6"}1f`,
            color: activeConv.sector_color || "#3b82f6"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full", style: {
              background: activeConv.sector_color || "#3b82f6"
            } }),
            activeConv.sector_name
          ] }) : "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Atendente", value: activeConv.assigned_name || "Não atribuído" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Status", value: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: activeConv.status === "open" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" : activeConv.status === "pending" ? "border-amber-500/30 bg-amber-500/10 text-amber-600" : "border-gray-500/30 bg-gray-500/10 text-gray-600", children: activeConv.status === "open" ? "Em andamento" : activeConv.status === "pending" ? "Pendente" : activeConv.status === "resolved" ? "Resolvido" : activeConv.status }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Ações", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleStatusChange("resolved"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-3.5 w-3.5 mr-1" }),
            " Finalizar"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setShowTransfer(true), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3.5 w-3.5 mr-1" }),
            " Transferir"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Notas internas", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: notes.slice(0, 3).map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-amber-50/40 p-3 text-xs dark:bg-amber-500/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: n.body }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[10px] text-muted-foreground", children: [
            n.author?.full_name || "—",
            " • ",
            new Date(n.created_at).toLocaleString("pt-BR")
          ] })
        ] }, n.id)) }) })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground", children: "Selecione uma conversa" }) })
  ] });
}
function DayDivider({
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-muted px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 bg-border" })
  ] });
}
function Bubble({
  side,
  text,
  time,
  name
}) {
  const out = side === "out";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
    opacity: 0,
    y: 6
  }, animate: {
    opacity: 1,
    y: 0
  }, transition: {
    duration: 0.2
  }, className: `flex gap-2 ${out ? "flex-row-reverse" : ""}`, children: [
    !out && /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-7 w-7 mt-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-[10px]", children: name.split(" ").map((p) => p[0]).slice(0, 2).join("") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[68%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${out ? "rounded-br-sm bg-[color:var(--primary)] text-primary-foreground" : "rounded-bl-sm border bg-card text-card-foreground"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap leading-relaxed", children: text }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `mt-1 flex items-center justify-end gap-1 text-[10px] ${out ? "text-primary-foreground/70" : "text-muted-foreground"}`, children: [
        time,
        out && /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: "h-3 w-3" })
      ] })
    ] })
  ] });
}
function InternalNote({
  text,
  author,
  time
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-[80%] items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(StickyNote, { className: "h-4 w-4 shrink-0 text-amber-600" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-amber-700 dark:text-amber-400", children: "Nota interna (invisível ao cliente)" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5", children: text }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[10px] text-muted-foreground", children: [
        "— ",
        author,
        " • ",
        time
      ] })
    ] })
  ] });
}
function TypingIndicator({
  name
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pl-9 text-xs text-muted-foreground", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 rounded-full bg-muted px-3 py-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
      name,
      " está digitando…"
    ] })
  ] });
}
function Section({
  title,
  children,
  action
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: title }),
      action
    ] }),
    children
  ] });
}
function Row({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-1.5 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: value })
  ] });
}
export {
  Inbox as component
};
