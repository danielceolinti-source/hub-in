import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export const Route = createFileRoute("/app/reports")({ component: Reports });

function Reports() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-semibold tracking-tight">Relatórios</h1>
        <p className="text-sm text-muted-foreground">Análises avançadas, exportação CSV e painéis personalizados.</p>
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[color:var(--neon)]/15 text-[color:var(--neon)]">
              <BarChart3 className="h-6 w-6" />
            </div>
            <p className="text-base font-medium">Em breve</p>
            <p className="max-w-sm text-sm text-muted-foreground">Os dados já estão sendo agregados no Dashboard executivo.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
