---
name: security-audit
description: Protocolo de auditoría de seguridad para aplicaciones Next.js 14 App Router y Supabase SSR. Abarca validación de variables de entorno, prevención de caídas fatales en Middleware, políticas de Row Level Security (RLS) y protección de datos privados del garaje virtual.
---

# Security Audit — Motrik Application Hardening

Skill especializada en la seguridad, control de acceso y blindaje de la plataforma automotriz **Motrik** (Next.js 14 + Supabase SSR + PostgreSQL).

---

## 1. Validación de Entorno y Blindaje del Middleware
- **Detección Previa de Conectividad**:
  - Toda inicialización de clientes SSR (`createServerClient`, `createBrowserClient`) debe pasar obligatoriamente por la función `isSupabaseConfigured()`.
  - Si las variables son de plantilla (`your_supabase_project_url`) o no cumplen la sintaxis de URL (`http:` o `https:`), el Middleware **no debe** intentar verificar la sesión de Supabase para evitar el error irrecuperable `TypeError: Invalid URL`.
- **Aislamiento de Secretos**:
  - Ninguna variable privada de servidor (`SUPABASE_SERVICE_ROLE_KEY` o credenciales de pasarela) debe tener el prefijo `NEXT_PUBLIC_` ni ser importada en componentes con directiva `"use client"`.

---

## 2. Row Level Security (RLS) en PostgreSQL
Todas las tablas expuestas a través de la API REST de PostgREST deben tener RLS activado y políticas explícitas:

```sql
-- 1. Catálogo y Directorio: Lectura pública sin exponer datos de administración
CREATE POLICY "repuestos_read_all" ON public.repuestos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "mecanicos_read_all" ON public.mecanicos FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "valoraciones_read_all" ON public.valoraciones FOR SELECT TO anon, authenticated USING (true);

-- 2. Integridad Foránea Estricta para Reseñas
-- Requerida para la consulta relacional cliente:usuarios!valoraciones_cliente_id_fkey(nombre)
ALTER TABLE public.valoraciones
  ADD CONSTRAINT valoraciones_cliente_id_fkey
  FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id)
  ON DELETE SET NULL;

-- 3. Aislamiento Privado del Garaje Virtual
-- En producción, vincular estrictamente vehiculos y registros a la sesión activa
CREATE POLICY "vehiculos_owner_access" ON public.vehiculos
  FOR ALL TO authenticated
  USING (usuario_id = auth.uid());
```

---

## 3. Validación de Límites y Datos de Entrada
- **Kilometraje Progresivo**: Al registrar mantenimientos en `bitacora.service.ts`, validar que el kilometraje ingresado no sea inferior al odómetro actual registrado del vehículo:
  ```typescript
  if (kmN < activeVehicle.odometer) {
    throw new Error("El kilometraje no puede ser inferior al odómetro actual.");
  }
  ```
- **Rango de Calificaciones**: Las puntuaciones de talleres y reseñas deben estar contenidas estrictamente en el intervalo $[1.0, 5.0]$.
- **Manejo Seguro de Errores**: En la capa de servicios, no exponer volcados de memoria, cadenas SQL internas ni contraseñas en los mensajes de toast dirigidos al usuario.
