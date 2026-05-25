import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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
import { DashboardService } from "@/lib/services/dashboard";
import { Skeleton } from "@/components/ui/skeleton";
import type { DashboardStats } from "@/lib/types";

export const Route = createFileRoute("/app/")({ component: Dashboard });

function Kpi({ icon: Icon, label, value, delta, accent, loading }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-xl border bg-card p-5 shadow-[var(--shadow-elevated)]">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30 blur-2xl transition group-hover:opacity-60"
        style={{ background: accent }} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          {loading ? (
            <Skeleton className="mt-2 h-8 w-24" />
          ) : (
            <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          )}
          {delta && (
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-medium text-emerald-500">{delta}</span>
              <span className="text-muted-foreground">vs ontem</span>
            </div>
          )}
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: `color-mix(in oklch, ${accent} 18%, transparent)` }}>
          <Icon className="h-5 w-5" style={{ color: accent }} />
        </div>
      </div>
    </motion.div>
  );
}

function Dashboard() {
  const { profile, company } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (company?.id) {
      setLoading(true);
      DashboardService.getStats(company.id)
        .then(setStats)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [company?.id]);

  const formatTime = (seconds: number) => {
    if (!seconds) return "—";
    if (seconds < 60) return `${seconds}s`;
    return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[1400px] space-y-6 p-6">
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Kpi icon={MessageSquare} label="Atendimentos ativos"
            value={loading ? "—" : String(stats?.active_conversations || 0)}
            delta="ao vivo" accent="oklch(0.68 0.20 250)" loading={loading} />
          <Kpi icon={Clock} label="Tempo médio resposta"
            value={loading ? "—" : formatTime(stats?.avg_response_time || 0)}
            delta="em análise" accent="oklch(0.72 0.16 155)" loading={loading} />
          <Kpi icon={Users} label="Atendentes online"
            value={loading ? "—" : `${stats?.agents_online || 0} / ${stats?.total_agents || 0}`}
            delta="agora" accent="oklch(0.78 0.15 80)" loading={loading} />
          <Kpi icon={TrendingUp} label="Taxa de resolução"
            value={loading ? "—" : `${stats?.resolution_rate || 0}%`}
            delta="últimas 24h" accent="oklch(0.62 0.22 305)" loading={loading} />
        </div>

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
                {loading ? (
                  <div className="flex h-full items-center justify-center"><Skeleton className="h-[240px] w-full" /></div>
                ) : (
                  <ResponsiveContainer>
                    <AreaChart data={stats?.volume_24h || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                      <XAxis dataKey="hour" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <RTooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 10, fontSize: 12 }} />
                      <Area type="monotone" dataKey="inbound" stroke="oklch(0.68 0.20 250)" strokeWidth={2} fill="url(#g1)" name="Recebidas" />
                      <Area type="monotone" dataKey="outbound" stroke="oklch(0.72 0.16 155)" strokeWidth={2} fill="url(#g2)" name="Enviadas" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
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
                {loading ? (
                  <div className="flex h-full items-center justify-center"><Skeleton className="h-[240px] w-full" /></div>
                ) : (
                  <ResponsiveContainer>
                    <BarChart data={stats?.by_sector || []} layout="vertical" margin={{ left: 0, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                      <XAxis type="number" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis type="category" dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} width={90} tickLine={false} axisLine={false} />
                      <RTooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 10, fontSize: 12 }} />
                      <Bar dataKey="value" fill="oklch(0.68 0.20 250)" radius={[0, 6, 6, 0]} name="Atendimentos" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base">Atendentes em destaque</CardTitle></CardHeader>
            <CardContent className="divide-y">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 py-3">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="space-y-1 text-right">
                      <Skeleton className="h-4 w-10 ml-auto" />
                      <Skeleton className="h-3 w-16 ml-auto" />
                    </div>
                  </div>
                ))
              ) : (stats?.top_agents || []).length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum atendente com atendimentos ainda.
                </div>
              ) : (
                (stats?.top_agents || []).map((u, i) => (
                  <div key={u.id} className="flex items-center gap-3 py-3">
                    <div className="text-xs font-semibold text-muted-foreground w-5">{i + 1}</div>
                    <Avatar className="h-9 w-9"><AvatarFallback>{u.name.split(" ").map(p => p[0]).slice(0, 2).join("")}</AvatarFallback></Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.sector}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{u.conversations}</p>
                      <p className="text-xs text-muted-foreground">{u.avg_time}</p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4 text-[color:var(--neon)]" /> Filas SLA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-8" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))
              ) : (stats?.sla_data || []).length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  Nenhum setor configurado.
                </div>
              ) : (
                (stats?.sla_data || []).map((q) => (
                  <div key={q.label}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-muted-foreground">{q.label}</span>
                      <span className="font-medium">{q.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${q.value}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full rounded-full" style={{ background: q.color }} />
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}