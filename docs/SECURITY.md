# Estrategia de Seguridad — Motrik

Este documento describe las medidas de seguridad, validación de variables, aislamiento de privilegios y protección de datos implementadas en **Motrik**.

---

## 1. Aislamiento de Entorno y Manejo Seguro de Secretos

- **Variables Públicas**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (Anon Key)
  - `NEXT_PUBLIC_DATA_SOURCE`
  Estas variables se inyectan en el bundle del navegador y únicamente poseen permisos públicos regulados por RLS.
- **Secretos de Servidor**:
  - Claves como `SUPABASE_SERVICE_ROLE_KEY` o credenciales administrativas nunca llevan el prefijo `NEXT_PUBLIC_` y jamás se importan en archivos marcados con `"use client"`.
- **Sanitización de Repositorio**:
  - Se eliminaron credenciales embebidas en scripts (`test-real.mjs`).
  - `.env.example` provee valores ilustrativos seguros sin exponer llaves activas de producción.

---

## 2. Prevención de Errores Críticos (Middleware SSR)

- En Next.js App Router, el middleware intercepta cada solicitud antes de que se renderice el layout. Si se inicializa un cliente con una URL vacía o de plantilla (`your_supabase_project_url`), Node lanza `TypeError: Invalid URL` tumbando la aplicación.
- Motrik implementa la validación:
  ```typescript
  export const isSupabaseConfigured = (): boolean => {
    if (!supabaseUrl || !supabaseKey) return false;
    if (supabaseUrl.includes("your_supabase_project_url")) return false;
    try {
      const parsed = new URL(supabaseUrl);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };
  ```
- Si no hay credenciales válidas, el middleware continúa de inmediato sin bloquear la navegación ni exponer errores 500 al usuario.

---

## 3. Modelo de Autorización y Row Level Security (RLS)

- **PostgreSQL RLS Activo**: Cada tabla tiene políticas explícitas en `supabase/schema.sql`.
- **Integridad Referencial en Consultas PostgREST**:
  - Para evitar ambigüedades en la relación foránea entre `valoraciones` y `usuarios`, se definió explícitamente:
    `CONSTRAINT valoraciones_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id)`
- **Protección de Datos Privados**:
  - En producción, los datos del garaje virtual (`vehiculos` y `registros_bitacora`) están vinculados a `usuario_id`, impidiendo que un conductor consulte o altere el historial técnico de otros vehículos.

---

## 4. Validación de Entradas y Protección contra Inyecciones

- Parámetros numéricos (`kilometraje`, `costo`, `precio`, `puntuacion`) son casteados y validados explícitamente antes de insertarse en la base de datos o en el estado local.
- Se previene la inserción de kilometrajes regresivos en la bitácora (el kilometraje del nuevo servicio no puede ser inferior al odómetro actual registrado).
- El cliente PostgREST utiliza consultas parametrizadas internamente, mitigando riesgos de inyección SQL (SQLi).

