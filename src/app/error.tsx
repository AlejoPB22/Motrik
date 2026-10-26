"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, ArrowLeft, RotateCcw, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Motrik][GlobalError] Excepción no controlada en la plataforma:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-lg rounded-3xl border border-destructive/20 bg-card p-8 md:p-10 shadow-lift">
        <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertOctagon className="h-8 w-8" />
        </div>

        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent-foreground">
          <ShieldAlert className="h-3.5 w-3.5" /> Error de Ejecución
        </div>

        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Inconveniente técnico detectado
        </h1>

        <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
          La plataforma experimentó una excepción inesperada durante la carga de datos. El sistema activó los protocolos de contingencia para preservar la integridad de la sesión.
        </p>

        {error.message && (
          <details className="mt-4 text-left rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
            <summary className="cursor-pointer font-medium hover:text-foreground">
              Traza y código del error
            </summary>
            <p className="mt-2 font-mono text-[11px] break-all">
              {error.message}
              {error.digest ? ` (Digest: ${error.digest})` : ""}
            </p>
          </details>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => reset()}
            variant="cta"
            className="w-full sm:w-auto gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reintentar operación
          </Button>

          <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Regresar al inicio
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

