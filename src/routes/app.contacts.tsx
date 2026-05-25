import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/app/contacts")({ component: () => <Placeholder title="Contatos" /> });

function Placeholder({ title }: { title: string }) {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">Em construção — preparado para CRM completo.</p>
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--neon)]/15 text-[color:var(--neon)]">
              <Sparkles className="h-6 w-6" />
            </div>
            <p className="text-base font-medium">Módulo será habilitado em breve</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              A base de dados já está pronta. Esta tela se conectará automaticamente quando o módulo for habilitado.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
