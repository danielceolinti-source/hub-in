import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Hash, Lock, Plus, Send, Smile, Paperclip, AtSign, Users, Loader2, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { InternalChatService } from "@/lib/services/internal";
import type { InternalChannelWithDetails } from "@/lib/types";

export const Route = createFileRoute("/app/internal")({ component: Internal });

function Internal() {
  const { profile, company } = useAuth();
  const [channels, setChannels] = useState<InternalChannelWithDetails[]>([]);
  const [activeChannel, setActiveChannel] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState("");
  const [newChannelDesc, setNewChannelDesc] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load channels
  useEffect(() => {
    if (!company?.id) return;
    setLoading(true);
    InternalChatService.getChannels(company.id)
      .then(data => {
        setChannels(data);
        if (data.length > 0 && !activeChannel) {
          setActiveChannel(data[0].id);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [company?.id]);

  // Load messages and members for active channel
  useEffect(() => {
    if (!activeChannel) return;
    InternalChatService.getMessages(activeChannel).then(setMessages).catch(console.error);
    InternalChatService.getMembers(activeChannel).then(setMembers).catch(console.error);

    const sub = InternalChatService.subscribeToMessages(activeChannel, async (payload) => {
      if (payload.eventType === "INSERT") {
        const msg = payload.new;
        if (msg.sender_id) {
          const { data: sender } = await (await fetch(`/api/profile/${msg.sender_id}`)).json();
          setMessages(prev => [...prev, { ...msg, sender_name: sender?.full_name || "Desconhecido", sender_avatar: sender?.avatar_url || null }]);
        } else {
          setMessages(prev => [...prev, { ...msg, sender_name: "Desconhecido", sender_avatar: null }]);
        }
      }
    });

    return () => sub.unsubscribe();
  }, [activeChannel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const activeChannelData = channels.find(c => c.id === activeChannel);

  const handleSend = async () => {
    if (!messageText.trim() || !activeChannel || !profile?.id) return;
    setSending(true);
    try {
      await InternalChatService.sendMessage({
        channel_id: activeChannel,
        sender_id: profile.id,
        body: messageText.trim(),
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
        description: newChannelDesc.trim() || undefined,
        created_by: profile.id,
      });
      toast.success("Canal criado!");
      setShowCreateChannel(false);
      setNewChannelName("");
      setNewChannelDesc("");
      // Reload channels
      const data = await InternalChatService.getChannels(company.id);
      setChannels(data);
    } catch {
      toast.error("Erro ao criar canal");
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
    <div className="grid h-full grid-cols-[260px_1fr_280px] overflow-hidden">
      {/* Left: channels list */}
      <aside className="flex flex-col border-r bg-card/40 backdrop-blur">
        <div className="border-b p-4">
          <h2 className="text-base font-semibold">Chat interno</h2>
          <p className="text-xs text-muted-foreground">Comunicação corporativa</p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <Section title="Canais" action={
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowCreateChannel(true)}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          }>
            {channels.map((c) => (
              <button key={c.id} onClick={() => setActiveChannel(c.id)}
                className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition ${
                  activeChannel === c.id ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}>
                {c.is_private ? <Lock className="h-3.5 w-3.5" /> : <Hash className="h-3.5 w-3.5" />}
                <span className="flex-1 text-left">{c.name}</span>
                <span className="text-[10px] text-muted-foreground">{c.members_count}</span>
              </button>
            ))}
          </Section>
          {channels.length === 0 && (
            <div className="px-2 py-4 text-center text-xs text-muted-foreground">
              Nenhum canal ainda.
              <button onClick={() => setShowCreateChannel(true)} className="block mt-1 text-[color:var(--neon)] hover:underline">
                Criar primeiro canal
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Center: messages */}
      <section className="flex min-w-0 flex-col bg-background">
        {activeChannelData ? (
          <>
            <div className="flex h-16 items-center justify-between border-b bg-card/40 px-5 backdrop-blur">
              <div className="flex items-center gap-2">
                {activeChannelData.is_private ? <Lock className="h-5 w-5 text-muted-foreground" /> : <Hash className="h-5 w-5 text-muted-foreground" />}
                <h3 className="text-base font-semibold">{activeChannelData.name}</h3>
                <Badge variant="outline" className="ml-2 gap-1.5 text-xs"><Users className="h-3 w-3" /> {activeChannelData.members_count}</Badge>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mx-auto max-w-3xl space-y-4">
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-sm font-medium"># {activeChannelData.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{activeChannelData.description || "Este é o início do canal."}</p>
                </div>
                {messages.map((m) => (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="group flex gap-3 rounded-lg px-2 py-1.5 hover:bg-accent/40">
                    <Avatar className="h-9 w-9"><AvatarFallback className="text-xs">{(m.sender_name || "??").split(" ").map((p: string) => p[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold">{m.sender_name || "Desconhecido"}</span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{m.body}</p>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="border-t bg-card/60 px-5 py-3 backdrop-blur">
              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="mx-auto flex max-w-3xl items-end gap-2 rounded-xl border bg-background p-2 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
                <Input value={messageText} onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Mensagem para #${activeChannelData.name}`}
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0" />
                <Button type="submit" size="icon" className="h-9 w-9" disabled={sending || !messageText.trim()}>
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground/30" />
              <p className="mt-4 text-sm text-muted-foreground">Selecione um canal</p>
            </div>
          </div>
        )}
      </section>

      {/* Right: members */}
      <aside className="flex flex-col border-l bg-card/40 backdrop-blur">
        <div className="border-b p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Membros · {members.length}</p>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto p-3">
          {members.map((u: any) => (
            <div key={u.id} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent">
              <div className="relative">
                <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{(u.full_name || "?").split(" ").map((p: string) => p[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-card ${
                  u.presence === "online" ? "bg-emerald-500" : u.presence === "away" ? "bg-amber-500" : "bg-muted-foreground"
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{u.full_name || "—"}</p>
                <p className="truncate text-[11px] text-muted-foreground">{u.job_title || "Atendente"}</p>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <p className="px-2 py-4 text-center text-xs text-muted-foreground">Nenhum membro</p>
          )}
        </div>
      </aside>

      {/* Create channel dialog */}
      <Dialog open={showCreateChannel} onOpenChange={setShowCreateChannel}>
        <DialogContent>
          <DialogHeader><DialogTitle>Criar canal</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome do canal</label>
              <Input value={newChannelName} onChange={(e) => setNewChannelName(e.target.value)} placeholder="ex: vendas, marketing" />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição (opcional)</label>
              <Input value={newChannelDesc} onChange={(e) => setNewChannelDesc(e.target.value)} placeholder="Para que serve este canal?" />
            </div>
            <Button onClick={handleCreateChannel} disabled={!newChannelName.trim()} className="w-full">
              Criar canal
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="mb-1 flex items-center justify-between px-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
        {action}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}