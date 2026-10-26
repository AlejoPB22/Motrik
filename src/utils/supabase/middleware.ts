import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Valida si las credenciales de Supabase están definidas y son URLs válidas,
 * evitando que la aplicación rompa en el Middleware con valores de plantilla o vacíos.
 */
export const isSupabaseConfigured = (): boolean => {
  if (!supabaseUrl || !supabaseKey) return false;
  if (
    supabaseUrl.includes("your_supabase_project_url") ||
    supabaseKey.includes("your_supabase_publishable_key")
  ) {
    return false;
  }
  try {
    const parsed = new URL(supabaseUrl);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const createClient = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Si Supabase aún no está configurado con credenciales válidas, continuar sin bloquear la navegación
  if (!isSupabaseConfigured()) {
    return supabaseResponse;
  }

  try {
    const supabase = createServerClient(
      supabaseUrl!,
      supabaseKey!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            supabaseResponse = NextResponse.next({
              request,
            });
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            );
          },
        },
      }
    );

    // Refresco de sesión activa
    await supabase.auth.getUser();
  } catch (error) {
    // Si hay un fallo temporal en la conexión a Supabase, evitar tumbar la app
    console.warn("[Supabase Middleware] Sesión no verificada:", error);
  }

  return supabaseResponse;
};
