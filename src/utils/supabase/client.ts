import { createBrowserClient } from "@supabase/ssr";

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

type QueryResult<T = unknown> = {
  data: T | null;
  error: { message: string } | null;
};

interface DummyQueryBuilder {
  select: (...args: unknown[]) => DummyQueryBuilder;
  insert: (...args: unknown[]) => DummyQueryBuilder;
  update: (...args: unknown[]) => DummyQueryBuilder;
  delete: (...args: unknown[]) => DummyQueryBuilder;
  eq: (...args: unknown[]) => DummyQueryBuilder;
  order: (...args: unknown[]) => DummyQueryBuilder;
  ilike: (...args: unknown[]) => DummyQueryBuilder;
  or: (...args: unknown[]) => DummyQueryBuilder;
  then: (resolve: (val: QueryResult) => void) => Promise<void>;
}

/**
 * Cliente seguro de fallback cuando Supabase no está configurado en local.
 * Emula una promesa de consulta que retorna { data: null, error: ... }, permitiendo
 * que todas las páginas activen limpiamente sus fallbacks de datos locales sin lanzar excepciones.
 */
const createDummyClient = () => {
  const dummyQuery: DummyQueryBuilder = {
    select: () => dummyQuery,
    insert: () => dummyQuery,
    update: () => dummyQuery,
    delete: () => dummyQuery,
    eq: () => dummyQuery,
    order: () => dummyQuery,
    ilike: () => dummyQuery,
    or: () => dummyQuery,
    then: (resolve: (val: QueryResult) => void) =>
      Promise.resolve(
        resolve({
          data: null,
          error: { message: "Supabase no está configurado o variables son de plantilla." },
        })
      ),
  };

  return {
    from: () => dummyQuery,
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
      getSession: async () => ({ data: { session: null }, error: null }),
    },
  };
};

export const createClient = () => {
  if (!isSupabaseConfigured()) {
    return createDummyClient() as unknown as ReturnType<typeof createBrowserClient>;
  }

  return createBrowserClient(
    supabaseUrl!,
    supabaseKey!
  );
};
