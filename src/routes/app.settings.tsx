import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { AuthService } from "@/lib/services/auth";
import { SectorsService } from "@/lib/services/sectors";
import { supabase } from "@/integrations/supabase/client";
import { Plug, Users, Workflow, MessageCircle, Zap, ShieldCheck, Loader2, Plus, Pencil, Trash2, UserCog, Save } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/app/settings")({ component: Settings });

function Settings() {
  const { profile, company, roles, refresh } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [sectors, setSectors] = useState<any[]>([]);
  const [quickReplies, setQuickReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddSector, setShowAddSector] = useState(false);
  const [showAddQuickReply, setShowAddQuickReply] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [editSector, setEditSector] = useState<any>(null);
  const [editQuickReply, setEditQuickReply] = useState<any>(null);
  const [newSectorName, setNewSectorName] = useState("");
  const [newSectorColor, setNewSectorColor] = useState("#3b82f6");
  const [newQuickShortcut, setNewQuickShortcut] = useState("");
  const [newQuickBody, setNewQuickBody] = useState("");
  const [newUserUsername, setNewUserUsername] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("atendente");
  const [editUserRole, setEditUserRole] = useState("");

  const isAdmin = roles.some(r => ["admin_master", "diretor", "supervisor"].includes(r));

  useEffect(() => {
    if (!company?.id) return;
    setLoading(true);
    Promise.all([
      supabase.from("profiles").select(`*, user_roles(role)`,).eq("company_id", company.id).order("full_name"),
      SectorsService.getAll(company.id),
      supabase.from("quick_replies").select("*").eq("company_id", company.id).order("shortcut"),
    ]).then(([usersRes, sectorsData, repliesRes]) => {
      setUsers(usersRes.data || []);
      setSectors(sectorsData);
      setQuickReplies(repliesRes.data || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, [company?.id]);

  const handleUpdateUserRole = async (userId: string, role: string) => {
    if (!company?.id) return;
    try {
      await AuthService.updateUserRole(userId, role, company.id);
      toast.success("Cargo atualizado");
      const { data } = await supabase.from("profiles").select(`*, user_roles(role)`).eq("company_id", company.id);
      if (data) setUsers(data);
    } catch {
      toast.error("Erro ao atualizar cargo");
    }
  };

  const handleAddSector = async () => {
    if (!newSectorName.trim() || !company?.id) return;
    try {
      await SectorsService.create({
        company_id: company.id,
        name: newSectorName.trim(),
        slug: newSectorName.trim().toLowerCase().replace(/\s+/g, "-"),
        color: newSectorColor,
      });
      toast.success("Setor criado!");
      setShowAddSector(false);
      setNewSectorName("");
      setSectors(await SectorsService.getAll(company.id));
    } catch { toast.error("Erro ao criar setor"); }
  };

  const handleDeleteSector = async (id: string) => {
    try {
      await SectorsService.delete(id);
      toast.success("Setor removido");
      if (company) setSectors(await SectorsService.getAll(company.id));
    } catch { toast.error("Erro ao remover setor"); }
  };

  const handleAddQuickReply = async () => {
    if (!newQuickShortcut.trim() || !newQuickBody.trim() || !company?.id) return;
    try {
      const { error } = await supabase.from("quick_replies").insert({
        company_id: company.id,
        shortcut: newQuickShortcut.trim(),
        body: newQuickBody.trim(),
      });
      if (error) throw error;
      toast.success("Resposta rápida criada!");
      setShowAddQuickReply(false);
      setNewQuickShortcut("");
      setNewQuickBody("");
      const { data } = await supabase.from("quick_replies").select("*").eq("company_id", company.id);
      if (data) setQuickReplies(data);
    } catch { toast.error("Erro ao criar resposta rápida"); }
  };

  const handleDeleteQuickReply = async (id: string) => {
    try {
      await supabase.from("quick_replies").delete().eq("id", id);
      toast.success("Resposta removida");
      if (company) {
        const { data } = await supabase.from("quick_replies").select("*").eq("company_id", company.id);
        if (data) setQuickReplies(data);
      }
    } catch { toast.error("Erro ao remover"); }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-[1200px] space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
          <p className="text-sm text-muted-foreground">Administre usuários, setores e regras operacionais.</p>
        </div>

        <Tabs defaultValue="users">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="users" className="gap-1.5"><Users className="h-3.5 w-3.5" />Usuários</TabsTrigger>
            <TabsTrigger value="sectors" className="gap-1.5"><Workflow className="h-3.5 w-3.5" />Setores</TabsTrigger>
            <TabsTrigger value="replies" className="gap-1.5"><MessageCircle className="h-3.5 w-3.5" />Respostas</TabsTrigger>
            <TabsTrigger value="integrations" className="gap-1.5"><Plug className="h-3.5 w-3.5" />Integrações</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle className="text-base">Equipe</CardTitle><p className="text-xs text-muted-foreground">Gerencie cargos e permissões.</p></div>
                <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo usuário</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Adicionar usuário</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nome de usuário</Label>
                        <Input value={newUserUsername} onChange={(e) => setNewUserUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))} placeholder="username" />
                      </div>
                      <div>
                        <Label>Senha temporária</Label>
                        <Input type="password" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
                      </div>
                      <div>
                        <Label>Cargo</Label>
                        <select value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option value="atendente">Atendente</option>
                          <option value="supervisor">Supervisor</option>
                          <option value="diretor">Diretor</option>
                          <option value="admin_master">Admin Master</option>
                        </select>
                      </div>
                      <Button disabled={!newUserUsername || !newUserPassword} className="w-full" onClick={async () => {
                        try {
                          await AuthService.signUp({ username: newUserUsername, full_name: newUserUsername, password: newUserPassword });
                          if (company) {
                            await AuthService.updateUserRole(
                              (await supabase.from("profiles").select("id").eq("username", newUserUsername).single()).data?.id!,
                              newUserRole,
                              company.id
                            );
                          }
                          toast.success("Usuário criado!");
                          setShowAddUser(false);
                          setNewUserUsername(""); setNewUserPassword("");
                          if (company) {
                            const { data } = await supabase.from("profiles").select(`*, user_roles(role)`).eq("company_id", company.id);
                            if (data) setUsers(data);
                          }
                        } catch (err: any) { toast.error(err.message); }
                      }}>
                        Criar usuário
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="divide-y">
                {users.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Nenhum usuário encontrado
                  </div>
                ) : (
                  users.map((u: any) => {
                    const userRole = u.user_roles?.[0]?.role || "atendente";
                    return (
                      <div key={u.id} className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback>{(u.full_name || "?").split(" ").map((p: string) => p[0]).slice(0, 2).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{u.full_name || "—"}</p>
                            <p className="text-xs text-muted-foreground">
                              @{u.username || "—"} {u.email ? `• ${u.email}` : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <select value={userRole} onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                            className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                            disabled={!isAdmin}>
                            <option value="atendente">Atendente</option>
                            <option value="supervisor">Supervisor</option>
                            <option value="diretor">Diretor</option>
                            <option value="admin_master">Admin Master</option>
                          </select>
                          <div className={`h-2 w-2 rounded-full ${u.presence === "online" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sectors" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle className="text-base">Setores</CardTitle><p className="text-xs text-muted-foreground">Departamentos da empresa.</p></div>
                <Button size="sm" onClick={() => setShowAddSector(true)}><Plus className="h-4 w-4 mr-1" /> Novo setor</Button>
              </CardHeader>
              <CardContent className="divide-y">
                {sectors.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Nenhum setor criado
                  </div>
                ) : (
                  sectors.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-3 w-3 rounded-full" style={{ background: s.color || "#3b82f6" }} />
                        <div>
                          <p className="text-sm font-medium">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.slug}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteSector(s.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Dialog open={showAddSector} onOpenChange={setShowAddSector}>
              <DialogContent>
                <DialogHeader><DialogTitle>Novo setor</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nome</Label>
                    <Input value={newSectorName} onChange={(e) => setNewSectorName(e.target.value)} placeholder="ex: Vendas" />
                  </div>
                  <div>
                    <Label>Cor</Label>
                    <div className="flex items-center gap-2">
                      <input type="color" value={newSectorColor} onChange={(e) => setNewSectorColor(e.target.value)} className="h-10 w-10 rounded border cursor-pointer" />
                      <span className="text-sm text-muted-foreground">{newSectorColor}</span>
                    </div>
                  </div>
                  <Button onClick={handleAddSector} disabled={!newSectorName.trim()} className="w-full">Criar setor</Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="replies" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div><CardTitle className="text-base">Respostas rápidas</CardTitle><p className="text-xs text-muted-foreground">Atalhos para agilizar atendimento.</p></div>
                <Button size="sm" onClick={() => setShowAddQuickReply(true)}><Plus className="h-4 w-4 mr-1" /> Nova resposta</Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickReplies.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    Nenhuma resposta rápida criada
                  </div>
                ) : (
                  quickReplies.map((q: any) => (
                    <div key={q.id} className="flex items-start gap-3 rounded-lg border p-3">
                      <code className="rounded bg-muted px-2 py-1 text-xs whitespace-nowrap">/{q.shortcut}</code>
                      <p className="flex-1 text-sm">{q.body}</p>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteQuickReply(q.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Dialog open={showAddQuickReply} onOpenChange={setShowAddQuickReply}>
              <DialogContent>
                <DialogHeader><DialogTitle>Nova resposta rápida</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Atalho</Label>
                    <Input value={newQuickShortcut} onChange={(e) => setNewQuickShortcut(e.target.value.replace(/\s+/g, '-'))} placeholder="saudacao" />
                  </div>
                  <div>
                    <Label>Mensagem</Label>
                    <textarea value={newQuickBody} onChange={(e) => setNewQuickBody(e.target.value)}
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Texto da resposta..." />
                  </div>
                  <Button onClick={handleAddQuickReply} disabled={!newQuickShortcut.trim() || !newQuickBody.trim()} className="w-full">
                    Criar resposta
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <IntegrationCard name="Z-API" desc="Conecte múltiplos números WhatsApp via Z-API com reconexão automática." status="disponível" configured={false} />
            <IntegrationCard name="Evolution API" desc="Servidor open-source para WhatsApp multiusuário." status="disponível" configured={false} />
            <IntegrationCard name="Meta WhatsApp Cloud" desc="API oficial Meta. Templates aprovados e alta confiabilidade." status="disponível" configured={false} />
            <IntegrationCard name="IA Gateway" desc="IA integrada para roteamento inteligente e sugestões." status="ativo" configured={true} />
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
        </div>
      </CardContent>
    </Card>
  );
}