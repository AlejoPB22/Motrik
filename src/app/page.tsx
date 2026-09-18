import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

interface TableStatus {
  name: string;
  label: string;
  description: string;
  exists: boolean;
  hasData: boolean;
  count: number;
  error?: string | null;
}

const MVP_TABLES = [
  { name: "usuarios", label: "Usuarios", description: "Perfiles base (clientes, mecánicos, admin)" },
  { name: "mecanicos", label: "Mecánicos", description: "Especialidades y calificaciones" },
  { name: "vehiculos", label: "Vehículos", description: "Vehículos registrados por los usuarios" },
  { name: "repuestos", label: "Repuestos", description: "Catálogo de piezas y compatibilidad" },
  { name: "valoraciones", label: "Valoraciones", description: "Reseñas y puntuaciones a talleres" },
  { name: "registros_bitacora", label: "Registros de Bitácora", description: "Historial de mantenimientos" },
];

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const tableStatuses: TableStatus[] = await Promise.all(
    MVP_TABLES.map(async (table) => {
      const { count, error } = await supabase
        .from(table.name)
        .select("*", { count: "exact", head: true });

      if (error) {
        return {
          name: table.name,
          label: table.label,
          description: table.description,
          exists: false,
          hasData: false,
          count: 0,
          error: error.message,
        };
      }

      const rowCount = count ?? 0;
      return {
        name: table.name,
        label: table.label,
        description: table.description,
        exists: true,
        hasData: rowCount > 0,
        count: rowCount,
        error: null,
      };
    })
  );

  const existingCount = tableStatuses.filter((t) => t.exists).length;
  const withDataCount = tableStatuses.filter((t) => t.hasData).length;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white">Motrik × Supabase</h1>
          </div>
          <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-mono">
            Conectado
          </span>
        </div>

        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Estado del esquema relacional en Supabase. Verificación en tiempo real de las tablas y existencia de datos en el backend.
        </p>

        {/* Sección de prueba de lectura multi-tabla */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Prueba de Lectura del Esquema
              </h2>
              <span className="text-[11px] px-2 py-0.5 bg-slate-800 text-slate-400 rounded-md font-mono">
                {existingCount}/{MVP_TABLES.length} activas
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">SSR Live Query</span>
          </div>

          <div className="space-y-2.5">
            {tableStatuses.map((table) => (
              <div
                key={table.name}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-900/60 border border-slate-800/70 rounded-lg hover:border-slate-700/80 transition"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      !table.exists
                        ? "bg-rose-500"
                        : table.hasData
                        ? "bg-emerald-400"
                        : "bg-cyan-400"
                    }`}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-200">{table.label}</span>
                      <code className="text-[11px] text-slate-500 font-mono">({table.name})</code>
                    </div>
                    <p className="text-[11px] text-slate-400">{table.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {table.exists ? (
                    table.hasData ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                        <span>✓</span> Con datos ({table.count} {table.count === 1 ? "fila" : "filas"})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                        <span>✓</span> Existe (Sin datos / 0 filas)
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
                      <span>✗</span> No existe o sin acceso
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>Tablas con registros: <strong className="text-slate-300 font-mono">{withDataCount}</strong></span>
            <span>Tablas vacías (listas): <strong className="text-slate-300 font-mono">{existingCount - withDataCount}</strong></span>
          </div>
        </div>

        {/* Enlaces a los módulos */}
        <div className="border-t border-slate-800/80 pt-5">
          <p className="text-xs text-slate-400 mb-3 font-medium">Módulos del MVP preparados:</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <a
              href="/repuestos"
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-lg transition border border-slate-700/50"
            >
              Buscador de Repuestos →
            </a>
            <a
              href="/directorio"
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-lg transition border border-slate-700/50"
            >
              Directorio de Talleres →
            </a>
            <a
              href="/bitacora"
              className="px-3 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded-lg transition border border-slate-700/50"
            >
              Bitácora de Mantenimiento →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

