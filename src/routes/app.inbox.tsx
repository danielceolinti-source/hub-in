import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Filter, Star, Phone, Video, MoreVertical, Paperclip,
  Mic, Send, Smile, Tag as TagIcon, UserPlus, StickyNote, ChevronRight,
  CheckCheck, Image as ImageIcon, FileText, Sparkles, Clock,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/app/inbox")({ component: Inbox });

interface Conv { id: string; name: string; phone: string; preview: string; time: string; unread: number; sector: string; sectorColor: string; status: "open" | "pending" | "resolved"; pinned?: boolean; }

const seed: Conv[] = [
  { id: "1", name: "Carlos Mendes", phone: "+55 11 98765-4321", preview: "Posso ver o Pulse hoje?", time: "agora", unread: 2, sector: "Vendas FIAT", sectorColor: "#ef4444", status: "open", pinned: true },
  { id: "2", name: "Patrícia Souza", phone: "+55 11 91234-5678", preview: "Vou levar amanhã às 10h", time: "2m", unread: 0, sector: "Oficina FIAT", sectorColor: "#6366f1", status: "pending" },
  { id: "3", name: "Juliana Reis", phone: "+55 11 99999-0000", preview: "Boleto não chegou", time: "5m", unread: 1, sector: "Financeiro", sectorColor: "#10b981", status: "open" },
  { id: "4", name: "Marcos Vinícius", phone: "+55 11 98888-7777", preview: "Compass 2024 disponível?", time: "12m", unread: 0, sector: "Vendas JEEP", sectorColor: "#0a2540", status: "open" },
  { id: "5", name: "Renata Lima", phone: "+55 11 97777-6666", preview: "Obrigada pelo atendimento!", time: "1h", unread: 0, sector: "SAC", sectorColor: "#14b8a6", status: "resolved" },
  { id: "6", name: "Eduardo Tavares", phone: "+55 11 96666-5555", preview: "Vocês têm seminovo até 80k?", time: "1h", unread: 3, sector: "Seminovos", sectorColor: "#8b5cf6", status: "open" },
  { id: "7", name: "Fernanda Castro", phone: "+55 11 95555-4444", preview: "Quero agendar revisão", time: "3h", unread: 0, sector: "Pós-venda FIAT", sectorColor: "#f59e0b", status: "pending" },
];

function Inbox() {
  const [active, setActive] = useState<string>("1");
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const conv = useMemo(() => seed.find(c => c.id === active)!, [active]);
  const list = useMemo(() => {
    return seed.filter(c => {
      if (tab === "unread" && c.unread === 0) return false;
      if (tab === "pinned" && !c.pinned) return false;
      if (tab === "resolved" && c.status !== "resolved") return false;
      if (q && !(`${c.name} ${c.preview}`).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [tab, q]);

  return (
    <div className="grid h-full grid-cols-[340px_1fr_320px] overflow-hidden">
      {/* LEFT — Conversation list */}
      <aside className="flex flex-col border-r bg-card/40 backdrop-blur">
        <div className="space-y-3 border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Atendimentos</h2>
              <p className="text-xs text-muted-foreground">{list.length} conversas</p>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8"><Filter className="h-4 w-4" /></Button>
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
          {list.map((c) => {
            const isActive = c.id === active;
            return (
              <button key={c.id} onClick={() => setActive(c.id)}
                className={`relative flex w-full items-start gap-3 border-b border-border/50 px-4 py-3 text-left transition ${
                  isActive ? "bg-accent/60" : "hover:bg-accent/40"
                }`}>
                {isActive && <span className="absolute left-0 top-2 h-[calc(100%-16px)] w-[3px] rounded-r bg-[color:var(--neon)]" />}
                <div className="relative">
                  <Avatar className="h-10 w-10"><AvatarFallback>{c.name.split(" ").map(p => p[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-card" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{c.name}</p>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{c.preview}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                      style={{ background: `${c.sectorColor}1f`, color: c.sectorColor }}>
                      <span className="h-1 w-1 rounded-full" style={{ background: c.sectorColor }} />{c.sector}
                    </span>
                    {c.pinned && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
                    {c.unread > 0 && (
                      <Badge className="ml-auto h-4 min-w-[16px] justify-center bg-[color:var(--neon)] px-1 text-[10px] text-white">{c.unread}</Badge>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* CENTER — Conversation */}
      <section className="flex min-w-0 flex-col bg-background">
        <div className="flex h-16 shrink-0 items-center justify-between border-b bg-card/40 px-5 backdrop-blur">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10"><AvatarFallback>{conv.name.split(" ").map(p=>p[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
            <div>
              <p className="text-sm font-semibold leading-tight">{conv.name}</p>
              <p className="text-xs text-muted-foreground">{conv.phone} • <span className="text-emerald-500">online agora</span></p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon"><Video className="h-4 w-4" /></Button>
            <Separator orientation="vertical" className="mx-1 h-6" />
            <Button variant="outline" size="sm" className="gap-1.5"><UserPlus className="h-3.5 w-3.5" /> Transferir</Button>
            <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mx-auto flex max-w-3xl flex-col gap-3">
            <DayDivider label="Hoje" />
            <Bubble side="in" name={conv.name} text="Olá! Vi o anúncio do Fiat Pulse Abarth no Instagram. Vocês ainda têm em estoque?" time="09:12" />
            <Bubble side="out" text="Bom dia, Carlos! 👋 Sim, temos uma unidade na cor cinza Strato disponível. Posso te enviar fotos e a tabela de financiamento?" time="09:13" name="Você" />
            <Bubble side="in" name={conv.name} text="Manda sim. E se possível, simula 60x com 30% de entrada." time="09:14" />
            <InternalNote text="Cliente com bom histórico de visita ao site (4 sessões). Lead quente — priorizar." author="Marina Costa" />
            <Bubble side="out" text="Claro! Aqui está a simulação completa, e enviei também a ficha técnica em PDF." time="09:16" name="Você" attachment={{ type: "pdf", name: "Pulse_Abarth_Financiamento.pdf", size: "284 KB" }} />
            <Bubble side="in" name={conv.name} text="Posso ver o Pulse hoje?" time="agora" />
            <TypingIndicator name={conv.name} />
          </div>
        </div>

        {/* Composer */}
        <div className="shrink-0 border-t bg-card/60 px-5 py-3 backdrop-blur">
          <div className="mx-auto flex max-w-3xl flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-[color:var(--neon)]" />
              <button className="rounded-md bg-accent/60 px-2 py-1 hover:bg-accent">/saudacao</button>
              <button className="rounded-md bg-accent/60 px-2 py-1 hover:bg-accent">/horario</button>
              <button className="rounded-md bg-accent/60 px-2 py-1 hover:bg-accent">/agendamento</button>
              <span className="ml-auto inline-flex items-center gap-1"><Clock className="h-3 w-3" /> SLA: 1m 42s</span>
            </div>
            <div className="flex items-end gap-2 rounded-xl border bg-background p-2 focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
              <Button variant="ghost" size="icon" className="h-9 w-9"><Paperclip className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-9 w-9"><ImageIcon className="h-4 w-4" /></Button>
              <textarea
                rows={1}
                placeholder="Digite uma mensagem ou use / para respostas rápidas…"
                className="max-h-32 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
              />
              <Button variant="ghost" size="icon" className="h-9 w-9"><Smile className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-9 w-9"><Mic className="h-4 w-4" /></Button>
              <Button size="icon" className="h-9 w-9"><Send className="h-4 w-4" /></Button>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT — Contact panel */}
      <aside className="flex flex-col border-l bg-card/40 backdrop-blur">
        <div className="border-b p-5 text-center">
          <Avatar className="mx-auto h-16 w-16"><AvatarFallback className="text-lg">{conv.name.split(" ").map(p=>p[0]).slice(0,2).join("")}</AvatarFallback></Avatar>
          <p className="mt-3 text-sm font-semibold">{conv.name}</p>
          <p className="text-xs text-muted-foreground">{conv.phone}</p>
          <div className="mt-3 flex justify-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5"><Star className="h-3.5 w-3.5" /> Fixar</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><TagIcon className="h-3.5 w-3.5" /> Etiqueta</Button>
          </div>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto p-5 text-sm">
          <Section title="Atribuição">
            <Row label="Setor" value={<span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs" style={{ background:`${conv.sectorColor}1f`, color: conv.sectorColor }}><span className="h-1.5 w-1.5 rounded-full" style={{ background: conv.sectorColor }} />{conv.sector}</span>} />
            <Row label="Atendente" value={<div className="flex items-center gap-2"><Avatar className="h-5 w-5"><AvatarFallback className="text-[10px]">MC</AvatarFallback></Avatar><span>Marina Costa</span></div>} />
            <Row label="Status" value={<Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600">Em andamento</Badge>} />
            <Row label="Prioridade" value={<Badge className="bg-orange-500/15 text-orange-600 hover:bg-orange-500/15">Alta</Badge>} />
          </Section>
          <Section title="Etiquetas">
            <div className="flex flex-wrap gap-1.5">
              {["Lead quente","Pulse","Financiamento"].map(t => (
                <span key={t} className="rounded-full bg-accent px-2 py-0.5 text-xs">{t}</span>
              ))}
            </div>
          </Section>
          <Section title="Notas internas" action={<Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs"><StickyNote className="h-3 w-3" />Nova</Button>}>
            <div className="rounded-lg border bg-amber-50/40 p-3 text-xs dark:bg-amber-500/5">
              <p>Cliente com bom histórico. Priorizar.</p>
              <p className="mt-1 text-[10px] text-muted-foreground">Marina Costa • há 8 min</p>
            </div>
          </Section>
          <Section title="Timeline">
            <ul className="space-y-3 text-xs">
              {[
                { t: "Conversa iniciada", at: "09:12", c: "oklch(0.68 0.20 250)" },
                { t: "Transferida → Vendas FIAT", at: "09:13", c: "oklch(0.72 0.16 155)" },
                { t: "Atribuída a Marina Costa", at: "09:14", c: "oklch(0.78 0.15 80)" },
                { t: "PDF enviado", at: "09:16", c: "oklch(0.62 0.22 305)" },
              ].map((e, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: e.c }} />
                  <div className="flex-1"><p>{e.t}</p><p className="text-[10px] text-muted-foreground">{e.at}</p></div>
                </li>
              ))}
            </ul>
          </Section>
        </div>
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

function Bubble({ side, text, time, name, attachment }: { side: "in" | "out"; text: string; time: string; name: string; attachment?: { type: string; name: string; size: string } }) {
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
        {attachment && (
          <div className={`mt-2 flex items-center gap-2 rounded-lg p-2 text-xs ${out ? "bg-white/10" : "bg-muted"}`}>
            <FileText className="h-4 w-4" />
            <div className="flex-1 min-w-0"><p className="truncate font-medium">{attachment.name}</p><p className="opacity-70">{attachment.size}</p></div>
          </div>
        )}
        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${out ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {time}{out && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    </motion.div>
  );
}

function InternalNote({ text, author }: { text: string; author: string }) {
  return (
    <div className="mx-auto flex max-w-[80%] items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-xs">
      <StickyNote className="h-4 w-4 shrink-0 text-amber-600" />
      <div>
        <p className="font-medium text-amber-700 dark:text-amber-400">Nota interna (invisível ao cliente)</p>
        <p className="mt-0.5">{text}</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">— {author}</p>
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
