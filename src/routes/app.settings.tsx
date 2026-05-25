import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plug, Users, Workflow, MessageCircle, Zap, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/app/settings")({ component: Settings });

function Settings() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[1200px] space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
          <p className="text-sm text-muted-foreground">Administre usuários, integrações e regras operacionais.</p>
        </div>

        <Tabs defaultValue="integrations">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="integrations" className="gap-1.5"><Plug className="h-3.5 w-3.5" />Integrações</TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5"><Users className="h-3.5 w-3.5" />Usuários</TabsTrigger>
            <TabsTrigger value="routing" className="gap-1.5"><Workflow className="h-3.5 w-3.5" />Roteamento</TabsTrigger>
            <TabsTrigger value="replies" className="gap-1.5"><MessageCircle className="h-3.5 w-3.5" />Respostas</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <IntegrationCard
              name="Z-API"
              desc="Conecte múltiplos números WhatsApp via Z-API com reconexão automática."
              status="disponível"
              configured={false}
            />
            <IntegrationCard
              name="Evolution API"
              desc="Servidor open-source para WhatsApp multiusuário. Suporte a múltiplas instâncias."
              status="disponível"
              configured={false}
            />
            <IntegrationCard
              name="Meta WhatsApp Cloud"
              desc="API oficial Meta. Templates aprovados e alta confiabilidade."
              status="disponível"
              configured={false}
            />
            <IntegrationCard
              name="Lovable AI Gateway"
              desc="IA integrada para roteamento inteligente, sugestões e resumos automáticos."
              status="ativo"
              configured={true}
            />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle className="text-base">Equipe</CardTitle><p className="text-xs text-muted-foreground">Gerencie cargos e permissões.</p></div>
                <Button size="sm">Convidar usuário</Button>
              </CardHeader>
              <CardContent className="divide-y">
                {[
                  { n: "Marina Costa", e: "marina@fiat.com", r: "Supervisor", s: "Vendas FIAT" },
                  { n: "Rafael Lima", e: "rafael@fiat.com", r: "Atendente", s: "Pós-venda FIAT" },
                  { n: "Diego Ferraz", e: "diego@grupo.com", r: "Diretor", s: "Diretoria" },
                ].map((u) => (
                  <div key={u.e} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">{u.n}</p>
                      <p className="text-xs text-muted-foreground">{u.e} • {u.s}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">{u.r}</Badge>
                      <Button variant="ghost" size="sm">Editar</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="routing" className="mt-6 space-y-3">
            {[
              { k: "compra, comprar, preço, financiamento", to: "Vendas FIAT" },
              { k: "revisão, agendar, manutenção", to: "Pós-venda" },
              { k: "boleto, segunda via, pagamento", to: "Financeiro" },
              { k: "reclamação, problema, insatisfeito", to: "SAC" },
              { k: "seminovo, usado, troca", to: "Seminovos" },
            ].map((r, i) => (
              <Card key={i}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Palavras-chave</p>
                    <p className="font-mono text-sm">{r.k}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">→ <span className="font-semibold">{r.to}</span></span>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="replies" className="mt-6">
            <Card>
              <CardHeader><CardTitle className="text-base">Respostas rápidas</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {[
                  { s: "/saudacao", t: "Olá! Sou da equipe da concessionária. Em que posso ajudar?" },
                  { s: "/horario", t: "Funcionamos de seg a sex 8h-19h e sáb 9h-14h." },
                  { s: "/agendamento", t: "Para agendar sua visita, me informe o melhor dia e horário." },
                ].map((q) => (
                  <div key={q.s} className="flex items-start gap-3 rounded-lg border p-3">
                    <code className="rounded bg-muted px-2 py-1 text-xs">{q.s}</code>
                    <p className="flex-1 text-sm">{q.t}</p>
                    <Button variant="ghost" size="sm">Editar</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function IntegrationCard({ name, desc, status, configured }: any) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-[color:var(--neon)]/15 text-[color:var(--neon)]">
            {configured ? <ShieldCheck className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
          </div>
          <div>
            <CardTitle className="text-base">{name}</CardTitle>
            <Badge variant={configured ? "default" : "outline"} className="mt-1">{status}</Badge>
          </div>
        </div>
        <Switch checked={configured} />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{desc}</p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant={configured ? "outline" : "default"}>{configured ? "Configurar" : "Conectar"}</Button>
          <Button size="sm" variant="ghost">Documentação</Button>
        </div>
      </CardContent>
    </Card>
  );
}
