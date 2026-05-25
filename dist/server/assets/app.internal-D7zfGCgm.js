import { U as reactExports, L as jsxRuntimeExports } from "./server-DJBFbZXq.js";
import { A as Avatar, a as AvatarFallback } from "./avatar-CoWyifmn.js";
import { L as LoaderCircle, B as Button } from "./loader-circle-C4DuzWLX.js";
import { I as Input } from "./input-Dtd6GMp8.js";
import { B as Badge } from "./badge-B-LTY4Gf.js";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-DoEE-fEh.js";
import { s as supabase, u as useAuth, t as toast } from "./router-C7G81YgB.js";
import { L as Lock } from "./lock-DwAAGoZT.js";
import { H as Hash } from "./hash-DBw90vKe.js";
import { P as Plus, M as MessageCircle } from "./plus-DlSG476T.js";
import { U as Users } from "./users-C2Dm-Yjm.js";
import { m as motion } from "./proxy-B4abZrjL.js";
import { S as Send } from "./send-DwEHiMOO.js";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./createLucideIcon-DYOIArt-.js";
import "./Combination-D4FWDTZC.js";
class InternalChatService {
  static async getChannels(companyId) {
    const { data: channels, error } = await supabase.from("internal_channels").select(`
        *,
        channel_members!inner(user_id)
      `).eq("company_id", companyId).order("name");
    if (error) throw error;
    const result = [];
    for (const ch of channels) {
      const { count } = await supabase.from("channel_members").select("*", { count: "exact", head: true }).eq("channel_id", ch.id);
      const { data: lastMsg } = await supabase.from("internal_messages").select("body, created_at").eq("channel_id", ch.id).order("created_at", { ascending: false }).limit(1);
      result.push({
        id: ch.id,
        company_id: ch.company_id,
        name: ch.name,
        description: ch.description,
        is_private: ch.is_private,
        is_direct: ch.is_direct,
        created_by: ch.created_by,
        created_at: ch.created_at,
        members_count: count || 0,
        last_message: lastMsg?.[0]?.body,
        last_message_at: lastMsg?.[0]?.created_at
      });
    }
    return result;
  }
  static async createChannel(data) {
    const { data: channel, error } = await supabase.from("internal_channels").insert({
      company_id: data.company_id,
      name: data.name,
      description: data.description,
      is_private: data.is_private || false,
      created_by: data.created_by
    }).select().single();
    if (error) throw error;
    await supabase.from("channel_members").insert({ channel_id: channel.id, user_id: data.created_by });
    return channel;
  }
  static async getMessages(channelId) {
    const { data, error } = await supabase.from("internal_messages").select(`
        *,
        sender:profiles!internal_messages_sender_id_fkey(full_name, avatar_url)
      `).eq("channel_id", channelId).order("created_at", { ascending: true }).limit(100);
    if (error) throw error;
    return (data || []).map((m) => ({
      ...m,
      sender_name: m.sender?.full_name || "Desconhecido",
      sender_avatar: m.sender?.avatar_url || null
    }));
  }
  static async sendMessage(data) {
    const { data: msg, error } = await supabase.from("internal_messages").insert({
      channel_id: data.channel_id,
      sender_id: data.sender_id,
      body: data.body
    }).select(`*, sender:profiles(full_name, avatar_url)`).single();
    if (error) throw error;
    return msg;
  }
  static async getMembers(channelId) {
    const { data, error } = await supabase.from("channel_members").select(`*, profile:profiles(full_name, avatar_url, job_title, presence)`).eq("channel_id", channelId);
    if (error) throw error;
    return (data || []).map((m) => m.profile);
  }
  static async joinChannel(channelId, userId) {
    const { error } = await supabase.from("channel_members").insert({ channel_id: channelId, user_id: userId });
    if (error) throw error;
  }
  static async leaveChannel(channelId, userId) {
    const { error } = await supabase.from("channel_members").delete().eq("channel_id", channelId).eq("user_id", userId);
    if (error) throw error;
  }
  static subscribeToMessages(channelId, callback) {
    return supabase.channel(`internal-messages-${channelId}`).on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "internal_messages",
        filter: `channel_id=eq.${channelId}`
      },
      callback
    ).subscribe();
  }
}
function Internal() {
  const {
    profile,
    company
  } = useAuth();
  const [channels, setChannels] = reactExports.useState([]);
  const [activeChannel, setActiveChannel] = reactExports.useState("");
  const [messages, setMessages] = reactExports.useState([]);
  const [members, setMembers] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [sending, setSending] = reactExports.useState(false);
  const [messageText, setMessageText] = reactExports.useState("");
  const [showCreateChannel, setShowCreateChannel] = reactExports.useState(false);
  const [newChannelName, setNewChannelName] = reactExports.useState("");
  const [newChannelDesc, setNewChannelDesc] = reactExports.useState("");
  const messagesEndRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!company?.id) return;
    setLoading(true);
    InternalChatService.getChannels(company.id).then((data) => {
      setChannels(data);
      if (data.length > 0 && !activeChannel) {
        setActiveChannel(data[0].id);
      }
    }).catch(console.error).finally(() => setLoading(false));
  }, [company?.id]);
  reactExports.useEffect(() => {
    if (!activeChannel) return;
    InternalChatService.getMessages(activeChannel).then(setMessages).catch(console.error);
    InternalChatService.getMembers(activeChannel).then(setMembers).catch(console.error);
    const sub = InternalChatService.subscribeToMessages(activeChannel, async (payload) => {
      if (payload.eventType === "INSERT") {
        const msg = payload.new;
        if (msg.sender_id) {
          const {
            data: sender
          } = await (await fetch(`/api/profile/${msg.sender_id}`)).json();
          setMessages((prev) => [...prev, {
            ...msg,
            sender_name: sender?.full_name || "Desconhecido",
            sender_avatar: sender?.avatar_url || null
          }]);
        } else {
          setMessages((prev) => [...prev, {
            ...msg,
            sender_name: "Desconhecido",
            sender_avatar: null
          }]);
        }
      }
    });
    return () => sub.unsubscribe();
  }, [activeChannel]);
  reactExports.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages.length]);
  const activeChannelData = channels.find((c) => c.id === activeChannel);
  const handleSend = async () => {
    if (!messageText.trim() || !activeChannel || !profile?.id) return;
    setSending(true);
    try {
      await InternalChatService.sendMessage({
        channel_id: activeChannel,
        sender_id: profile.id,
        body: messageText.trim()
      });
      setMessageText("");
    } catch (err) {
      toast.error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };
  const handleCreateChannel = async () => {
    if (!newChannelName.trim() || !company?.id || !profile?.id) return;
    try {
      await InternalChatService.createChannel({
        company_id: company.id,
        name: newChannelName.trim().toLowerCase().replace(/\s+/g, "-"),
        description: newChannelDesc.trim() || void 0,
        created_by: profile.id
      });
      toast.success("Canal criado!");
      setShowCreateChannel(false);
      setNewChannelName("");
      setNewChannelDesc("");
      const data = await InternalChatService.getChannels(company.id);
      setChannels(data);
    } catch {
      toast.error("Erro ao criar canal");
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid h-full grid-cols-[260px_1fr_280px] overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "flex flex-col border-r bg-card/40 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-b p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold", children: "Chat interno" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Comunicação corporativa" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-2 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Section, { title: "Canais", action: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", className: "h-6 w-6", onClick: () => setShowCreateChannel(true), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "h-3.5 w-3.5" }) }), children: channels.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setActiveChannel(c.id), className: `flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition ${activeChannel === c.id ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`, children: [
          c.is_private ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-left", children: c.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: c.members_count })
        ] }, c.id)) }),
        channels.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-2 py-4 text-center text-xs text-muted-foreground", children: [
          "Nenhum canal ainda.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowCreateChannel(true), className: "block mt-1 text-[color:var(--neon)] hover:underline", children: "Criar primeiro canal" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "flex min-w-0 flex-col bg-background", children: activeChannelData ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-16 items-center justify-between border-b bg-card/40 px-5 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        activeChannelData.is_private ? /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5 text-muted-foreground" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "h-5 w-5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-base font-semibold", children: activeChannelData.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "ml-2 gap-1.5 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3" }),
          " ",
          activeChannelData.members_count
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-card p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-medium", children: [
            "# ",
            activeChannelData.name
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: activeChannelData.description || "Este é o início do canal." })
        ] }),
        messages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs(motion.div, { initial: {
          opacity: 0,
          y: 6
        }, animate: {
          opacity: 1,
          y: 0
        }, className: "group flex gap-3 rounded-lg px-2 py-1.5 hover:bg-accent/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-9 w-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-xs", children: (m.sender_name || "??").split(" ").map((p) => p[0]).slice(0, 2).join("") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold", children: m.sender_name || "Desconhecido" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground", children: new Date(m.created_at).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit"
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm leading-relaxed", children: m.body })
          ] })
        ] }, m.id)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t bg-card/60 px-5 py-3 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
        e.preventDefault();
        handleSend();
      }, className: "mx-auto flex max-w-3xl items-end gap-2 rounded-xl border bg-background p-2 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: messageText, onChange: (e) => setMessageText(e.target.value), placeholder: `Mensagem para #${activeChannelData.name}`, className: "border-0 bg-transparent shadow-none focus-visible:ring-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", size: "icon", className: "h-9 w-9", disabled: sending || !messageText.trim(), children: sending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
      ] }) })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-full items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "mx-auto h-12 w-12 text-muted-foreground/30" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Selecione um canal" })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "flex flex-col border-l bg-card/40 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: [
        "Membros · ",
        members.length
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-1 overflow-y-auto p-3", children: [
        members.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-7 w-7", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "text-[10px]", children: (u.full_name || "?").split(" ").map((p) => p[0]).slice(0, 2).join("") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-card ${u.presence === "online" ? "bg-emerald-500" : u.presence === "away" ? "bg-amber-500" : "bg-muted-foreground"}` })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-sm font-medium", children: u.full_name || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[11px] text-muted-foreground", children: u.job_title || "Atendente" })
          ] })
        ] }, u.id)),
        members.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-2 py-4 text-center text-xs text-muted-foreground", children: "Nenhum membro" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showCreateChannel, onOpenChange: setShowCreateChannel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Criar canal" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Nome do canal" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newChannelName, onChange: (e) => setNewChannelName(e.target.value), placeholder: "ex: vendas, marketing" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium", children: "Descrição (opcional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: newChannelDesc, onChange: (e) => setNewChannelDesc(e.target.value), placeholder: "Para que serve este canal?" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: handleCreateChannel, disabled: !newChannelName.trim(), className: "w-full", children: "Criar canal" })
      ] })
    ] }) })
  ] });
}
function Section({
  title,
  action,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center justify-between px-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground", children: title }),
      action
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5", children })
  ] });
}
export {
  Internal as component
};
