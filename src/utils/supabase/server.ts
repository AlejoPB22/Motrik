import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

export const createClient = (cookieStore: Awaited<ReturnType<typeof cookies>>) => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase no está configurado en el servidor.");
  }

  return createServerClient(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignorado en Server Components con refresco delegado al middleware
          }
        },
      },
    }
  );
};
