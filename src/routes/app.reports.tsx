import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { DashboardService } from "@/lib/services/dashboard";
import { Loader2, BarChart3, Download, Calendar } from "lucide-react";
import type { DashboardStats } from "@/lib/types";

export const Route = createFileRoute("/app/reports")({ component: Reports });

function Reports() {
  const { company } = useAuth();
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

  // Calculate totals from stats
  const totalMessages = (stats?.volume_24h || []).reduce((acc, h) => acc + h.inbound + h.outbound, 0);
  const avgMessagesPerHour = stats?.volume_24h?.length ? Math.round(totalMessages / stats.volume_24h.length) : 0;

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Relatórios</h1>
            <p className="text-sm text-muted-foreground">Análises e métricas da operação.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5"><Calendar className="h-4 w-4" /> Últimas 24h</Button>
            <Button variant="outline" size="sm" className="gap-1.5"><Download className="h-4 w-4" /> Exportar</Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total de mensagens" value={String(totalMessages)} loading={loading} />
          <MetricCard title="Mensagens/hora (média)" value={String(avgMessagesPerHour)} loading={loading} />
          <MetricCard title="Atendimentos ativos" value={String(stats?.active_conversations || 0)} loading={loading} />
          <MetricCard title="Atendentes online" value={`${stats?.agents_online || 0}/${stats?.total_agents || 0}`} loading={loading} />
        </div>

        {/* Volume by sector */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribuição por setor</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : (stats?.by_sector || []).length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Nenhum dado disponível</div>
            ) : (
              <div className="space-y-4">
                {stats?.by_sector.map((s) => (
                  <div key={s.name} className="flex items-center gap-4">
                    <span className="w-40 text-sm font-medium truncate">{s.name}</span>
                    <div className="flex-1 h-4 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-[color:var(--neon)] transition-all duration-500"
                        style={{ width: `${Math.min(100, (s.value / Math.max(...(stats?.by_sector.map(x => x.value) || [1]))) * 100)}%` }} />
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">{s.value}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top agents */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ranking de atendentes</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : (stats?.top_agents || []).length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Nenhum atendente com atendimentos</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="pb-2 font-medium">#</th>
                      <th className="pb-2 font-medium">Atendente</th>
                      <th className="pb-2 font-medium">Setor</th>
                      <th className="pb-2 font-medium text-right">Atendimentos</th>
                      <th className="pb-2 font-medium text-right">Tempo médio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats?.top_agents.map((agent, i) => (
                      <tr key={agent.id} className="border-b last:border-0">
                        <td className="py-3 text-muted-foreground">{i + 1}</td>
                        <td className="py-3 font-medium">{agent.name}</td>
                        <td className="py-3 text-muted-foreground">{agent.sector}</td>
                        <td className="py-3 text-right font-semibold">{agent.conversations}</td>
                        <td className="py-3 text-right text-muted-foreground">{agent.avg_time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Hourly volume table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Volume horário (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-muted-foreground" /></div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {(stats?.volume_24h || []).map((h) => (
                  <div key={h.hour} className="rounded-lg border bg-card p-2 text-center">
                    <p className="text-[10px] text-muted-foreground">{h.hour}</p>
                    <div className="mt-1 flex justify-center gap-2 text-xs">
                      <span className="text-[color:var(--neon)] font-medium">{h.inbound}</span>
                      <span className="text-emerald-500 font-medium">{h.outbound}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MetricCard({ title, value, loading }: { title: string; value: string; loading: boolean }) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
        {loading ? (
          <div className="mt-2 h-8 w-20 rounded bg-muted animate-pulse" />
        ) : (
          <p className="mt-2 text-2xl font-semibold tracking-tight">{value}</p>
        )}
      </CardContent>
    </Card>
  );
}