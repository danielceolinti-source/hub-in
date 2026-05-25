import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip as RTooltip, XAxis, YAxis,
} from "recharts";
import { ArrowUpRight, MessageSquare, Clock, Users, TrendingUp, Activity, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app/")({ component: Dashboard });

const series = Array.from({ length: 24 }, (_, i) => ({
  h: `${String(i).padStart(2, "0")}h`,
  msg: Math.round(40 + Math.sin(i / 2) * 30 + Math.random() * 25),
  res: Math.round(20 + Math.cos(i / 3) * 18 + Math.random() * 18),
}));

const sectors = [
  { name: "Vendas FIAT", v: 142 },
  { name: "Vendas JEEP", v: 98 },
  { name: "Pós-venda", v: 76 },
  { name: "Financeiro", v: 41 },
  { name: "Oficina", v: 65 },
  { name: "SAC", v: 28 },
];

function Kpi({ icon: Icon, label, value, delta, accent }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-[var(--shadow-elevated)]">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl transition group-hover:opacity-60"
        style={{ background: accent }} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-medium text-emerald-500">{delta}</span>
            <span className="text-muted-foreground">vs ontem</span>
          </div>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: `color-mix(in oklch, ${accent} 18%, transparent)` }}>
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
      </div>
    </motion.div>
  );
}

function Dashboard() {
  const { profile } = useAuth();
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[1400px] space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Bem-vindo de volta, {profile?.full_name?.split(" ")[0] || "operador"} 👋</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight">Visão executiva</h1>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600">
              <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" /></span>
              tempo real
            </Badge>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi icon={MessageSquare} label="Atendimentos ativos" value="284" delta="+12%" accent="oklch(0.68 0.20 250)" />
          <Kpi icon={Clock} label="Tempo médio resposta" value="1m 42s" delta="-8%" accent="oklch(0.72 0.16 155)" />
          <Kpi icon={Users} label="Atendentes online" value="38 / 52" delta="+5%" accent="oklch(0.78 0.15 80)" />
          <Kpi icon={TrendingUp} label="Taxa de resolução" value="92,4%" delta="+1,2%" accent="oklch(0.62 0.22 305)" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Volume de mensagens (24h)</CardTitle>
                <p className="text-xs text-muted-foreground">Inbound vs outbound em tempo real</p>
              </div>
              <Badge variant="outline" className="gap-1.5"><Activity className="h-3 w-3" /> live</Badge>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer>
                  <AreaChart data={series} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.68 0.20 250)" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="oklch(0.68 0.20 250)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="g2" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.72 0.16 155)" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="oklch(0.72 0.16 155)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="h" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <RTooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 10, fontSize: 12 }} />
                    <Area type="monotone" dataKey="msg" stroke="oklch(0.68 0.20 250)" strokeWidth={2} fill="url(#g1)" />
                    <Area type="monotone" dataKey="res" stroke="oklch(0.72 0.16 155)" strokeWidth={2} fill="url(#g2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Por setor</CardTitle>
              <p className="text-xs text-muted-foreground">Distribuição de atendimentos</p>
            </CardHeader>
            <CardContent>
              <div className="h-[280px]">
                <ResponsiveContainer>
                  <BarChart data={sectors} layout="vertical" margin={{ left: 0, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                    <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} width={90} tickLine={false} axisLine={false} />
                    <RTooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 10, fontSize: 12 }} />
                    <Bar dataKey="v" fill="oklch(0.68 0.20 250)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Atendentes em destaque</CardTitle></CardHeader>
            <CardContent className="divide-y">
              {[
                { n: "Marina Costa", s: "Vendas FIAT", c: 42, t: "1m 12s" },
                { n: "Rafael Lima", s: "Pós-venda FIAT", c: 38, t: "1m 38s" },
                { n: "Ana Pereira", s: "Vendas JEEP", c: 35, t: "1m 50s" },
                { n: "Bruno Alves", s: "Financeiro", c: 28, t: "2m 04s" },
              ].map((u, i) => (
                <div key={u.n} className="flex items-center gap-3 py-3">
                  <div className="text-xs font-semibold text-muted-foreground w-5">{i + 1}</div>
                  <Avatar className="h-9 w-9"><AvatarFallback>{u.n.split(" ").map(p => p[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{u.n}</p>
                    <p className="text-xs text-muted-foreground">{u.s}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">{u.c}</p>
                    <p className="text-xs text-muted-foreground">{u.t}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4 text-[color:var(--neon)]" /> Filas SLA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { l: "Vendas", v: 78, c: "oklch(0.68 0.20 250)" },
                { l: "Pós-venda", v: 62, c: "oklch(0.72 0.16 155)" },
                { l: "Financeiro", v: 41, c: "oklch(0.78 0.15 80)" },
                { l: "SAC", v: 88, c: "oklch(0.62 0.22 305)" },
              ].map((q) => (
                <div key={q.l}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-muted-foreground">{q.l}</span>
                    <span className="font-medium">{q.v}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${q.v}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full" style={{ background: q.c }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
