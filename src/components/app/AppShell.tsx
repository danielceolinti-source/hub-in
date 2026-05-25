import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, MessageSquare, Hash, Users, Settings, Search,
  Bell, Sun, Moon, LogOut, ChevronsUpDown, Inbox, BarChart3,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const items = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/inbox", label: "Atendimentos", icon: MessageSquare, badge: 12 },
  { to: "/app/internal", label: "Chat interno", icon: Hash, badge: 3 },
  { to: "/app/contacts", label: "Contatos", icon: Users },
  { to: "/app/reports", label: "Relatórios", icon: BarChart3 },
  { to: "/app/settings", label: "Configurações", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { profile, company, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const loc = useLocation();

  const initials = (profile?.full_name || "U").split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <Logo />
        </div>

        {/* Company switcher */}
        <div className="px-3 pt-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex w-full items-center gap-3 rounded-lg border border-sidebar-border bg-sidebar-accent/40 px-3 py-2.5 text-left transition hover:bg-sidebar-accent">
                <div className="grid h-9 w-9 place-items-center rounded-md text-xs font-bold text-white"
                  style={{ background: company?.brand_color || "#0b3d91" }}>
                  {(company?.brand || "?").slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{company?.name || "Sem empresa"}</p>
                  <p className="truncate text-[11px] text-sidebar-foreground/60">Workspace ativo</p>
                </div>
                <ChevronsUpDown className="h-4 w-4 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="start">
              <DropdownMenuLabel>Empresas</DropdownMenuLabel>
              <DropdownMenuItem>FIAT</DropdownMenuItem>
              <DropdownMenuItem>JEEP</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Nav */}
        <nav className="mt-2 flex-1 space-y-0.5 overflow-y-auto px-3 py-2">
          <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            Operação
          </p>
          {items.map((it) => {
            const active = it.exact ? loc.pathname === it.to : loc.pathname.startsWith(it.to);
            return (
              <Link key={it.to} to={it.to}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                }`}>
                {active && (
                  <motion.span layoutId="active-pill"
                    className="absolute inset-y-1 left-0 w-[3px] rounded-r bg-[color:var(--sidebar-primary)]" />
                )}
                <it.icon className="h-[18px] w-[18px]" />
                <span className="flex-1">{it.label}</span>
                {it.badge && (
                  <Badge variant="secondary" className="h-5 bg-[color:var(--sidebar-primary)]/15 text-[color:var(--sidebar-primary)]">
                    {it.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer card */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/40 p-2.5">
            <div className="relative">
              <Avatar className="h-9 w-9 ring-2 ring-sidebar-border">
                <AvatarImage src={profile?.avatar_url ?? undefined} />
                <AvatarFallback className="bg-[color:var(--sidebar-primary)]/20 text-[color:var(--sidebar-primary)]">{initials}</AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-sidebar" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{profile?.full_name || "—"}</p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">{profile?.job_title || "Atendente"}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-sidebar-foreground/70 hover:bg-sidebar-accent">
                  <ChevronsUpDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel>{profile?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={toggle}>
                  {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                  Alternar tema
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-16 shrink-0 items-center gap-3 border-b bg-card/60 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/40">
          <div className="md:hidden"><Logo withText={false} /></div>
          <div className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar conversas, clientes, atendentes…"
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-16 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">⌘K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggle}>
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Alternar tema</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[color:var(--neon)]" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Notificações</TooltipContent>
            </Tooltip>
            <div className="ml-2 flex items-center gap-2 rounded-full border bg-muted/40 px-2 py-1">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-emerald-500/15 text-emerald-500"><Inbox className="h-3 w-3" /></span>
              <span className="pr-1 text-xs font-medium">Online</span>
            </div>
          </div>
        </header>

        <main className="min-h-0 flex-1 overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
