import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { Search, UserPlus, Phone, MessageSquare, Loader2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/contacts")({ component: ContactsPage });

function ContactsPage() {
  const { company, profile } = useAuth();
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");

  useEffect(() => {
    if (!company?.id) return;
    setLoading(true);
    (async () => {
      try {
        const { data, error }: any = await supabase
          .from("conversations")
          .select("id, contact_name, contact_phone, contact_avatar_url, last_message_at, sector_id, assigned_to")
          .eq("company_id", company.id)
          .order("last_message_at", { ascending: false, nullsFirst: false });
        if (error) throw error;
        const seen = new Set<string>();
        const unique: any[] = [];
        (data || []).forEach((c: any) => {
          if (!seen.has(c.contact_phone)) {
            seen.add(c.contact_phone);
            unique.push(c);
          }
        });
        setContacts(unique);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [company?.id]);

  const filtered = contacts.filter((c: any) =>
    c.contact_name.toLowerCase().includes(search.toLowerCase()) ||
    c.contact_phone.includes(search)
  );

  const handleAdd = async () => {
    if (!newName.trim() || !newPhone.trim() || !company?.id) return;
    try {
      const { data, error }: any = await supabase
        .from("conversations")
        .insert({ company_id: company.id, contact_name: newName.trim(), contact_phone: newPhone.trim(), assigned_to: profile?.id, status: "open" })
        .select()
        .single();
      if (error) throw error;
      toast.success("Contato adicionado!");
      setContacts((prev: any[]) => [data, ...prev]);
      setShowAdd(false);
      setNewName("");
      setNewPhone("");
    } catch { toast.error("Erro ao adicionar contato"); }
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Contatos</h1>
            <p className="text-sm text-muted-foreground">{contacts.length} contatos</p>
          </div>
          <Button size="sm" onClick={() => setShowAdd(true)}>
            <UserPlus className="h-4 w-4 mr-1" /> Novo contato
          </Button>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar..." className="pl-9" />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--neon)]/15 text-[color:var(--neon)]">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="text-base font-medium">Nenhum contato encontrado</p>
              <Button variant="outline" size="sm" onClick={() => setShowAdd(true)}>
                <UserPlus className="h-4 w-4 mr-1" /> Adicionar contato
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c: any) => (
              <Card key={c.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{c.contact_name.split(" ").map((p: string) => p[0]).slice(0, 2).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{c.contact_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.contact_phone}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <MessageSquare className="h-3.5 w-3.5" /> Conversar
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogContent>
            <DialogHeader><DialogTitle>Novo contato</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Nome completo" />
              </div>
              <div>
                <label className="text-sm font-medium">Telefone</label>
                <Input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} placeholder="+55 11 99999-9999" />
              </div>
              <Button onClick={handleAdd} disabled={!newName.trim() || !newPhone.trim()} className="w-full">
                Adicionar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}