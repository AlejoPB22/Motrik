import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos, error } = await supabase.from("todos").select();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
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
          Tubería de backend aprovisionada. Las variables de entorno y los clientes SSR de Supabase han sido integrados con éxito.
        </p>

        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Prueba de lectura (tabla: <code>todos</code>)
            </h2>
            <span className="text-[11px] text-slate-500 font-mono">SSR Query</span>
          </div>

          {todos && todos.length > 0 ? (
            <ul className="space-y-1.5 pt-1">
              {todos.map((todo) => (
                <li key={todo.id} className="text-sm text-emerald-400 flex items-center gap-2">
                  <span className="text-xs">✓</span> {todo.name ?? JSON.stringify(todo)}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-xs text-slate-500 py-1">
              {error ? (
                <p className="text-amber-400/90 font-mono text-[11px]">
                  Respuesta de Supabase: {error.message}
                </p>
              ) : (
                <p className="italic">No hay filas en la tabla &apos;todos&apos; aún.</p>
              )}
            </div>
          )}
        </div>

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
