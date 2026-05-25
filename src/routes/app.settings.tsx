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
                <div>
                  <CardTitle className="text-base">Equipe</CardTitle>
                  <p className="text-xs text-muted-foreground">Gerencie cargos e permissões.</p>
                </div>
                <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo usuário</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar usuário</DialogTitle>
                    </DialogHeader>
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
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="sectors" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Setores</CardTitle>
                  <p className="text-xs text-muted-foreground">Gerencie setores.</p>
                </div>
                <Dialog open={showAddSector} onOpenChange={setShowAddSector}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Novo setor</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar setor</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nome do setor</Label>
                        <Input value={newSectorName} onChange={(e) => setNewSectorName(e.target.value)} placeholder="Nome do setor" />
                      </div>
                      <div>
                        <Label>Cor do setor</Label>
                        <Input value={newSectorColor} onChange={(e) => setNewSectorColor(e.target.value)} placeholder="#3b82f6" />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="replies" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Respostas rápidas</CardTitle>
                  <p className="text-xs text-muted-foreground">Gerencie respostas rápidas.</p>
                </div>
                <Dialog open={showAddQuickReply} onOpenChange={setShowAddQuickReply}>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Nova resposta rápida</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar resposta rápida</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Atalho</Label>
                        <Input value={newQuickShortcut} onChange={(e) => setNewQuickShortcut(e.target.value)} placeholder="Atalho" />
                      </div>
                      <div>
                        <Label>Mensagem</Label>
                        <Input value={newQuickBody} onChange={(e) => setNewQuickBody(e.target.value)} placeholder="Mensagem" />
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">Integrações</CardTitle>
                  <p className="text-xs text-muted-foreground">Gerencie integrações.</p>
                </div>
              </CardHeader>
            </Card>
          </TabsContent>
        </TabsList>
      </div>
    </div>
  );
}