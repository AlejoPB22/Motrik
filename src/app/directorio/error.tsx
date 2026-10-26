"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DirectorioError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Motrik][DirectorioError] Excepción capturada en directorio de talleres:", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md rounded-3xl border border-destructive/20 bg-card p-8 shadow-lift">
        <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-7 w-7" />
        </div>

        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
          <Wrench className="h-3.5 w-3.5" /> Directorio de Talleres
        </div>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground">
          No se pudo consultar los talleres
        </h2>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          Ocurrió una falla al obtener la lista de talleres mecánicos o las valoraciones de clientes desde Supabase. La información se encuentra temporalmente inaccesible.
        </p>

        {error.message && (
          <details className="mt-4 text-left rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground">
            <summary className="cursor-pointer font-medium hover:text-foreground">
              Detalles técnicos del error
            </summary>
            <p className="mt-2 font-mono text-[11px] break-all">
              {error.message}
              {error.digest ? ` (Digest: ${error.digest})` : ""}
            </p>
          </details>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            variant="cta"
            className="w-full sm:w-auto gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reintentar conexión
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

