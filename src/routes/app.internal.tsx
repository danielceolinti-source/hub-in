import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Hash, Lock, Plus, Send, Smile, Paperclip, AtSign, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/app/internal")({ component: Internal });

const channels = [
  { id: "geral", name: "geral", unread: 0, members: 38 },
  { id: "anuncios", name: "anuncios", unread: 2, members: 52 },
  { id: "vendas", name: "vendas", unread: 5, members: 12, private: true },
  { id: "posvenda", name: "posvenda", unread: 0, members: 8 },
  { id: "marketing", name: "marketing", unread: 0, members: 6 },
];

const dms = [
  { id: "rafael", name: "Rafael Lima", status: "online" },
  { id: "ana", name: "Ana Pereira", status: "online" },
  { id: "bruno", name: "Bruno Alves", status: "away" },
];

const msgs = [
  { id: "1", author: "Rafael Lima", initials: "RL", time: "09:02", text: "Pessoal, recebemos 3 leads quentes pelo Instagram hoje cedo. Marina, pode assumir o primeiro?" },
  { id: "2", author: "Marina Costa", initials: "MC", time: "09:03", text: "Pode deixar 🚀", reactions: ["🔥","👏"] },
  { id: "3", author: "Bruno Alves", initials: "BA", time: "09:10", text: "Lembrete: campanha do Pulse Abarth termina sexta. Já passei a tabela atualizada no canal #anuncios." },
  { id: "4", author: "Você", initials: "VC", time: "09:14", text: "Show. Vou priorizar.", mine: true },
];

function Internal() {
  const [active, setActive] = useState("geral");
  return (
    <div className="grid h-full grid-cols-[260px_1fr_280px] overflow-hidden">
      {/* Left: channels list */}
      <aside className="flex flex-col border-r bg-card/40 backdrop-blur">
        <div className="border-b p-4">
          <h2 className="text-base font-semibold">Chat interno</h2>
          <p className="text-xs text-muted-foreground">Comunicação corporativa</p>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <Section title="Canais" action={<Button variant="ghost" size="icon" className="h-6 w-6"><Plus className="h-3.5 w-3.5" /></Button>}>
            {channels.map((c) => (
              <ChannelItem key={c.id} active={active === c.id} onClick={() => setActive(c.id)}
                icon={c.private ? Lock : Hash} name={c.name} unread={c.unread} />
            ))}
          </Section>
          <Section title="Mensagens diretas">
            {dms.map((u) => (
              <button key={u.id}
                className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
                <div className="relative">
                  <Avatar className="h-5 w-5"><AvatarFallback className="text-[9px]">{u.name.split(" ").map(p=>p[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
                  <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-card ${
                    u.status === "online" ? "bg-emerald-500" : "bg-amber-500"
                  }`} />
                </div>
                <span className="flex-1 text-left">{u.name}</span>
              </button>
            ))}
          </Section>
        </div>
      </aside>

      {/* Center: messages */}
      <section className="flex min-w-0 flex-col bg-background">
        <div className="flex h-16 items-center justify-between border-b bg-card/40 px-5 backdrop-blur">
          <div className="flex items-center gap-2">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-semibold">{active}</h3>
            <Badge variant="outline" className="ml-2 gap-1.5 text-xs"><Users className="h-3 w-3" /> 38</Badge>
          </div>
          <Button variant="outline" size="sm" className="gap-1.5"><AtSign className="h-3.5 w-3.5" /> Mencionar</Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-3xl space-y-4">
            <div className="rounded-xl border bg-card p-4">
              <p className="text-sm font-medium"># {active}</p>
              <p className="mt-1 text-xs text-muted-foreground">Este é o início do canal. Compartilhe novidades, briefings e alinhamentos da operação.</p>
            </div>
            {msgs.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="group flex gap-3 rounded-lg px-2 py-1.5 hover:bg-accent/40">
                <Avatar className="h-9 w-9"><AvatarFallback>{m.initials}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-semibold">{m.author}</span>
                    <span className="text-[10px] text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  {m.reactions && (
                    <div className="mt-1.5 flex gap-1">
                      {m.reactions.map((r, i) => (
                        <button key={i} className="rounded-full border bg-card px-2 py-0.5 text-xs hover:bg-accent">{r} 1</button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="border-t bg-card/60 px-5 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-end gap-2 rounded-xl border bg-background p-2 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
            <Button variant="ghost" size="icon" className="h-9 w-9"><Paperclip className="h-4 w-4" /></Button>
            <Input placeholder={`Mensagem para #${active}`} className="border-0 bg-transparent shadow-none focus-visible:ring-0" />
            <Button variant="ghost" size="icon" className="h-9 w-9"><Smile className="h-4 w-4" /></Button>
            <Button size="icon" className="h-9 w-9"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </section>

      {/* Right: members */}
      <aside className="flex flex-col border-l bg-card/40 backdrop-blur">
        <div className="border-b p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Membros · 38</p>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto p-3">
          {[
            { n: "Marina Costa", r: "Atendente", online: true },
            { n: "Rafael Lima", r: "Supervisor", online: true },
            { n: "Ana Pereira", r: "Atendente", online: true },
            { n: "Bruno Alves", r: "Financeiro", online: false },
            { n: "Camila Duarte", r: "Marketing", online: true },
            { n: "Diego Ferraz", r: "Diretor", online: false },
          ].map((u) => (
            <div key={u.n} className="flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-accent">
              <div className="relative">
                <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">{u.n.split(" ").map(p=>p[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
                <span className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ring-2 ring-card ${u.online ? "bg-emerald-500" : "bg-muted-foreground"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{u.n}</p>
                <p className="truncate text-[11px] text-muted-foreground">{u.r}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
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

function ChannelItem({ active, onClick, icon: Icon, name, unread }: any) {
  return (
    <button onClick={onClick}
      className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition ${
        active ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
      }`}>
      <Icon className="h-3.5 w-3.5" />
      <span className="flex-1 text-left">{name}</span>
      {unread > 0 && <Badge className="h-4 min-w-[16px] justify-center bg-[color:var(--neon)] px-1 text-[10px] text-white">{unread}</Badge>}
    </button>
  );
}
