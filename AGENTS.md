# Instrucciones Permanentes para Agentes de Desarrollo — Motrik

Este documento establece las directrices arquitectónicas, de codificación, seguridad y control de calidad que todo agente de desarrollo debe seguir al trabajar en **Motrik**.

---

## 1. Misión y Dominio de Negocio
Motrik es una plataforma web especializada exclusivamente en el **ecosistema automotriz y vehicular** (repuestos, directorio de talleres, garaje virtual y bitácora técnica de mantenimientos).
- **Prohibición de Dominio**: No reutilizar ni introducir conceptos, terminología o lógica de dominios ajenos (como restaurantes o POS de alimentos). Todas las referencias deben obedecer a autopartes, especificaciones mecánicas y regulaciones vehiculares colombianas (SOAT, Tecnomecánica, Ley 1480).

---

## 2. Arquitectura de Software (Next.js 14 App Router)
- **Estructura Modular**:
  - `src/app/`: Enrutamiento y composición de páginas (`/`, `/repuestos`, `/directorio`, `/bitacora`).
  - `src/services/`: Capa desacoplada de acceso a datos (`repuestos.service.ts`, `directorio.service.ts`, `bitacora.service.ts`). Ningún componente debe realizar llamadas HTTP o consultas Supabase directamente en la vista.
  - `src/components/ui/`: Primitivas reutilizables (Radix UI + Tailwind).
  - `src/components/motrick/`: Componentes de negocio compartidos (`Header`, `Checkout`, `SponsoredCard`, `shared`).
  - `src/types/`: Definición estricta de interfaces de base de datos y modelos de vista.
  - `src/utils/supabase/`: Clientes validados y tolerantes a fallos (`client.ts`, `server.ts`, `middleware.ts`).
- **Límites Servidor / Cliente**:
  - Emplear Server Components por defecto.
  - Usar `"use client"` únicamente cuando se requiera estado (`useState`), efectos (`useEffect`) o interacción directa del usuario.

---

## 3. Integración con Supabase y Tolerancia a Fallos
- **Validación de Entorno Previa**: Utilizar siempre `isSupabaseConfigured()` antes de invocar `createServerClient` o `createBrowserClient` para evitar excepciones `TypeError: Invalid URL`.
- **Estrategia de Fallback (Modo Mock vs Supabase)**:
  - En entorno de **desarrollo**, permitir el uso de datos locales (`src/data/mock.ts`) cuando las variables de Supabase no estén presentes, emitiendo advertencias controladas en consola.
  - En entorno de **producción**, cuando el origen sea `supabase`, **nunca** suplantar silenciosamente fallos de red o de permisos con datos simulados que engañen al usuario sobre el estado de sus datos. Los errores deben propagarse limpiamente.
- **Seguridad y Secretos**:
  - Jamás incluir claves `service_role` ni credenciales privadas en Client Components o en repositorios públicos.

---

## 4. Estándares de Base de Datos (PostgreSQL)
- Respetar los nombres canónicos de las entidades: `usuarios`, `vehiculos`, `repuestos`, `registros_bitacora`, `mecanicos`, `valoraciones`.
- Mantener la relación foránea explícita requerida por PostgREST en el directorio:
  `CONSTRAINT valoraciones_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id)`
- Todas las tablas deben contar con Row Level Security (RLS) habilitado.

---

## 5. Skills Especializadas
Consultar `SKILLS_INDEX.md` para aplicar las guías detalladas:
- `ui-styling`: Para diseño visual, Tailwind y Framer Motion.
- `security-audit`: Para revisión de permisos, variables y validaciones.
- `inventory`: Para reglas de compatibilidad de autopartes y cálculo de existencias.

---

## 6. Proceso Obligatorio de Verificación
Antes de dar por concluido cualquier cambio:
1. `npm run typecheck` (Debe compilar con 0 errores de TypeScript en modo estricto).
2. `npm run lint` (Debe pasar con 0 errores de ESLint).
3. `npm run build` (La compilación de Next.js debe completarse exitosamente).

