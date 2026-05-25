import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Star, Phone, Video, MoreVertical, Paperclip,
  Mic, Send, Smile, Tag as TagIcon, UserPlus, StickyNote, ChevronRight,
  CheckCheck, Image as ImageIcon, FileText, Sparkles, Clock, Loader2, X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { ConversationsService } from "@/lib/services/conversations";
import { MessagesService } from "@/lib/services/messages";
import { SectorsService } from "@/lib/services/sectors";
import type { ConversationWithDetails, MessageWithSender } from "@/lib/types";

export const Route = createFileRoute("/app/inbox")({ component: Inbox });

function Inbox() {
  const { profile, company } = useAuth();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showTransfer, setShowTransfer] = useState(false);
  const [sectors, setSectors] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const activeConv = useMemo(() => conversations.find(c => c.id === activeId), [conversations, activeId]);

  // Load conversations
  useEffect(() => {
    if (!company?.id) return;
    setLoading(true);
    const load = async () => {
      try {
        const data = await ConversationsService.getConversations({ companyId: company.id });
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

    // Load sectors and agents
    SectorsService.getAll(company.id).then(setSectors).catch(() => {});
    fetch(`/api/users?company_id=${company.id}`).then(r => r.json()).then(setAgents).catch(() => {});

    // Subscribe to realtime
    const sub = ConversationsService.subscribeToConversations(company.id, (payload) => {
      if (payload.eventType === "INSERT") {
        setConversations(prev => [{ ...payload.new, sector_name: null, sector_color: null, assigned_name: null, tags: [] }, ...prev]);
      } else if (payload.eventType === "UPDATE") {
        setConversations(prev => prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c));
      } else if (payload.eventType === "DELETE") {
        setConversations(prev => prev.filter(c => c.id !== payload.old.id));
      }
    });

    return () => { sub.unsubscribe(); };
  }, [company?.id]);

  // Load messages for active conversation
  useEffect(() => {
    if (!activeId) return;
    ConversationsService.getConversation(activeId).then(conv => {
      setConversations(prev => prev.map(c => c.id === activeId ? { ...c, ...conv } : c));
    });
    MessagesService.getMessages(activeId).then(setMessages).catch(console.error);
    MessagesService.getNotes(activeId).then(setNotes).catch(console.error);

    // Subscribe to new messages
    const sub = MessagesService.subscribeToMessages(activeId, async (payload) => {
      if (payload.eventType === "INSERT") {
        const msg = payload.new;
        // Fetch sender info
        if (msg.sender_id) {
          const { data: sender } = await (await fetch(`/api/profile/${msg.sender_id}`)).json();
          setMessages(prev => [...prev, { ...msg, sender_name: sender?.full_name, sender_avatar: sender?.avatar_url }]);
        } else {
          setMessages(prev => [...prev, msg]);
        }
      }
    });

    // Subscribe to typing
    if (profile?.id) {
      const typingSub = MessagesService.subscribeToTyping(activeId, profile.id, (payload) => {
        if (payload.new?.is_typing) {
          setTypingUsers(prev => new Set(prev).add(payload.new.user_id));
        } else {
          setTypingUsers(prev => { const s = new Set(prev); s.delete(payload.new?.user_id); return s; });
        }
      });
      return () => { sub.unsubscribe(); typingSub.unsubscribe(); };
    }

    return () => { sub.unsubscribe(); };
  }, [activeId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const filteredConversations = useMemo(() => {
    return conversations.filter(c => {
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
        body: messageText.trim(),
      });
      setMessageText("");
      // Clear typing indicator
      MessagesService.setTypingIndicator(activeId, profile.id, false);
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    } catch (err) {
      toast.error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (text: string) => {
    setMessageText(text);
    if (!activeId || !profile?.id) return;
    MessagesService.setTypingIndicator(activeId, profile.id, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      MessagesService.setTypingIndicator(activeId, profile.id, false);
    }, 2000);
  };

  const handleStatusChange = async (status: string) => {
    if (!activeId) return;
    try {
      await ConversationsService.updateStatus(activeId, status);
      toast.success(`Conversa ${status === "resolved" ? "finalizada" : "atualizada"}`);
    } catch {
      toast.error("Erro ao atualizar status");
    }
  };

  const handleAssign = async (userId: string | null) => {
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
        assigned_to: profile?.id,
      });
      setActiveId(conv.id);
      setConversations(prev => [{ ...conv, sector_name: null, sector_color: null, assigned_name: profile?.full_name, tags: [] }, ...prev]);
      toast.success("Conversa criada");
    } catch {
      toast.error("Erro ao criar conversa");
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-[340px_1fr_320px] overflow-hidden">
      {/* LEFT — Conversation list */}
      <aside className="flex flex-col border-r bg-card/40 backdrop-blur">
        <div className="space-y-3 border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Atendimentos</h2>
              <p className="text-xs text-muted-foreground">{filteredConversations.length} conversas</p>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleNewConversation}>
                <UserPlus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8"><Filter className="h-4 w-4" /></Button>
            </div>
          </div>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." className="h-9 pl-9 text-sm" />
          </div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid h-8 w-full grid-cols-4">
              <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">Novas</TabsTrigger>
              <TabsTrigger value="pinned" className="text-xs">Fixas</TabsTrigger>
              <TabsTrigger value="resolved" className="text-xs">Concluídas</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">Nenhuma conversa encontrada</p>
              <Button variant="link" size="sm" onClick={handleNewConversation} className="mt-2">
                Criar nova conversa
              </Button>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isActive = c.id === activeId;
              return (
                <button key={c.id} onClick={() => setActiveId(c.id)}
                  className={`relative flex w-full items-start gap-3 border-b border-border/50 px-4 py-3 text-left transition ${
                    isActive ? "bg-accent/60" : "hover:bg-accent/40"
                  }`}>
                  {isActive && <span className="absolute left-0 top-2 h-[calc(100%-16px)] w-[3px] rounded-r bg-[color:var(--neon)]" />}
                  <div className="relative">
                    <Avatar className="h-10 w-10"><AvatarFallback className="text-xs">{c.contact_name.split(" ").map(p => p[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
                    {c.status === "open" && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />}
                    {c.status === "pending" && <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-card" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{c.contact_name}</p>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {c.last_message_at ? new Date(c.last_message_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{c.last_message_preview || "Nenhuma mensagem"}</p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {c.sector_name && (
                        <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                          style={{ background: `${c.sector_color || "#3b82f6"}1f`, color: c.sector_color || "#3b82f6" }}>
                          <span className="h-1 w-1 rounded-full" style={{ background: c.sector_color || "#3b82f6" }} />{c.sector_name}
                        </span>
                      )}
                      {c.is_favorite && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
                      {c.unread_count > 0 && (
                        <Badge className="ml-auto h-4 min-w-[16px] justify-center bg-[color:var(--neon)] px-1 text-[10px] text-white">{c.unread_count}</Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* CENTER — Conversation */}
      <section className="flex min-w-0 flex-col bg-background">
        {activeConv ? (
          <>
            <div className="flex h-16 shrink-0 items-center justify-between border-b bg-card/40 px-5 backdrop-blur">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10"><AvatarFallback className="text-xs">{activeConv.contact_name.split(" ").map(p=>p[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
                <div>
                  <p className="text-sm font-semibold leading-tight">{activeConv.contact_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {activeConv.contact_phone}
                    {activeConv.status === "open" && <span className="text-emerald-500 ml-1">• online</span>}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleStatusChange("resolved")} title="Finalizar">
                  <CheckCheck className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                <Separator orientation="vertical" className="mx-1 h-6" />
                <Dialog open={showTransfer} onOpenChange={setShowTransfer}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1.5"><UserPlus className="h-3.5 w-3.5" /> Transferir</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Transferir conversa</DialogTitle></DialogHeader>
                    <div className="space-y-2">
                      {agents.filter((a: any) => a.id !== profile?.id).map((agent: any) => (
                        <button key={agent.id} onClick={() => handleAssign(agent.id)}
                          className="flex w-full items-center gap-3 rounded-lg p-2 hover:bg-accent">
                          <Avatar className="h-8 w-8"><AvatarFallback className="text-xs">{agent.full_name?.split(" ").map((p: string) => p[0]).join("")}</AvatarFallback></Avatar>
                          <div className="text-left">
                            <p className="text-sm font-medium">{agent.full_name}</p>
                            <p className="text-xs text-muted-foreground">{agent.job_title || "Atendente"}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mx-auto flex max-w-3xl flex-col gap-3">
                <DayDivider label={new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })} />
                {messages.map((m) => (
                  m.is_internal ? (
                    <InternalNote key={m.id} text={m.body || ""} author={m.sender_name || "Sistema"} time={new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} />
                  ) : (
                    <Bubble key={m.id} side={m.direction === "outbound" ? "out" : "in"}
                      text={m.body || ""}
                      time={new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                      name={m.direction === "outbound" ? "Você" : activeConv.contact_name} />
                  )
                ))}
                {Array.from(typingUsers).length > 0 && <TypingIndicator name={activeConv.contact_name} />}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="shrink-0 border-t bg-card/60 px-5 py-3 backdrop-blur">
              <div className="mx-auto flex max-w-3xl flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-[color:var(--neon)]" />
                  <span className="ml-auto inline-flex items-center gap-1"><Clock className="h-3 w-3" /> SLA em tempo real</span>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-end gap-2 rounded-xl border bg-background focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
                  <Textarea
                    value={messageText}
                    onChange={(e) => handleTyping(e.target.value)}
                    placeholder="Digite uma mensagem…"
                    className="max-h-32 min-h-[44px] flex-1 resize-none border-0 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground shadow-none focus-visible:ring-0"
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  />
                  <div className="flex items-center gap-1 p-2">
                    <Button type="submit" size="icon" className="h-9 w-9" disabled={sending || !messageText.trim()}>
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-sm text-muted-foreground">Selecione uma conversa</p>
              <Button variant="link" size="sm" onClick={handleNewConversation}>Nova conversa</Button>
            </div>
          </div>
        )}
      </section>

      {/* RIGHT — Contact panel */}
      <aside className="flex flex-col border-l bg-card/40 backdrop-blur">
        {activeConv ? (
          <>
            <div className="border-b p-5 text-center">
              <Avatar className="mx-auto h-16 w-16"><AvatarFallback className="text-lg">{activeConv.contact_name.split(" ").map(p=>p[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
              <p className="mt-3 text-sm font-semibold">{activeConv.contact_name}</p>
              <p className="text-xs text-muted-foreground">{activeConv.contact_phone}</p>
              <div className="mt-3 flex justify-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => ConversationsService.toggleFavorite(activeId!, activeConv.is_favorite)}>
                  <Star className={`h-3.5 w-3.5 ${activeConv.is_favorite ? "fill-amber-500 text-amber-500" : ""}`} /> {activeConv.is_favorite ? "Fixada" : "Fixar"}
                </Button>
              </div>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto p-5 text-sm">
              <Section title="Atribuição">
                <Row label="Setor" value={
                  activeConv.sector_name ?
                  <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs"
                    style={{ background: `${activeConv.sector_color || "#3b82f6"}1f`, color: activeConv.sector_color || "#3b82f6" }}>
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: activeConv.sector_color || "#3b82f6" }} />{activeConv.sector_name}
                  </span> : "—"
                } />
                <Row label="Atendente" value={activeConv.assigned_name || "Não atribuído"} />
                <Row label="Status" value={
                  <Badge variant="outline" className={
                    activeConv.status === "open" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600" :
                    activeConv.status === "pending" ? "border-amber-500/30 bg-amber-500/10 text-amber-600" :
                    "border-gray-500/30 bg-gray-500/10 text-gray-600"
                  }>
                    {activeConv.status === "open" ? "Em andamento" : activeConv.status === "pending" ? "Pendente" : activeConv.status === "resolved" ? "Resolvido" : activeConv.status}
                  </Badge>
                } />
              </Section>
              <Section title="Ações">
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleStatusChange("resolved")}>
                    <CheckCheck className="h-3.5 w-3.5 mr-1" /> Finalizar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowTransfer(true)}>
                    <UserPlus className="h-3.5 w-3.5 mr-1" /> Transferir
                  </Button>
                </div>
              </Section>
              <Section title="Notas internas">
                <div className="space-y-2">
                  {notes.slice(0, 3).map((n: any) => (
                    <div key={n.id} className="rounded-lg border bg-amber-50/40 p-3 text-xs dark:bg-amber-500/5">
                      <p>{n.body}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground">{n.author?.full_name || "—"} • {new Date(n.created_at).toLocaleString("pt-BR")}</p>
                    </div>
                  ))}
                </div>
              </Section>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
            Selecione uma conversa
          </div>
        )}
      </aside>
    </div>
  );
}

function DayDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="h-px flex-1 bg-border" />
      <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

function Bubble({ side, text, time, name }: { side: "in" | "out"; text: string; time: string; name: string }) {
  const out = side === "out";
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
      className={`flex gap-2 ${out ? "flex-row-reverse" : ""}`}>
      {!out && <Avatar className="h-7 w-7 mt-auto"><AvatarFallback className="text-[10px]">{name.split(" ").map(p=>p[0]).slice(0,2).join("")}</AvatarFallback></Avatar>}
      <div className={`max-w-[68%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
        out
          ? "rounded-br-sm bg-[color:var(--primary)] text-primary-foreground"
          : "rounded-bl-sm border bg-card text-card-foreground"
      }`}>
        <p className="whitespace-pre-wrap leading-relaxed">{text}</p>
        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${out ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {time}{out && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    </motion.div>
  );
}

function InternalNote({ text, author, time }: { text: string; author: string; time: string }) {
  return (
    <div className="mx-auto flex max-w-[80%] items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs">
      <StickyNote className="h-4 w-4 shrink-0 text-amber-600" />
      <div>
        <p className="font-medium text-amber-700 dark:text-amber-400">Nota interna (invisível ao cliente)</p>
        <p className="mt-0.5">{text}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">— {author} • {time}</p>
      </div>
    </div>
  );
}

function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 pl-9 text-xs text-muted-foreground">
      <div className="flex gap-1 rounded-full bg-muted px-3 py-2">
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-muted-foreground" />
      </div>
      <span>{name} está digitando…</span>
    </div>
  );
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        {action}
      </div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div>{value}</div>
    </div>
  );
}