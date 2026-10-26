# Catálogo Oficial de Skills — Motrik

Este archivo es el registro maestro de las habilidades (skills) especializadas autorizadas y activas para el desarrollo y mantenimiento del ecosistema automotriz **Motrik**.

---

## 1. Habilidades Especializadas Activas

| Skill | Ubicación | Dominio y Propósito | Cuándo Invocarla |
|---|---|---|---|
| **`ui-styling`** | `.agents/skills/ui-styling/SKILL.md` | **Diseño Automotriz & UI**: Componentes Tailwind CSS, jerarquía visual, soporte Dark/Light mode, accesibilidad y animaciones Framer Motion. | Al crear o modificar vistas (`/`, `/repuestos`, `/directorio`, `/bitacora`), tarjetas de vehículos, hojas de detalle o modales. |
| **`security-audit`** | `.agents/skills/security-audit/SKILL.md` | **Seguridad & Hardening SSR**: Validación de variables de entorno para evitar caídas en Middleware, políticas RLS en PostgreSQL y aislamiento de secretos. | Al implementar consultas a base de datos, endpoints, autenticación o formularios que reciban datos de usuarios. |
| **`inventory`** | `.agents/skills/inventory/SKILL.md` | **Autopartes & Compatibilidad**: Familias de repuestos (Frenos, Motor, Suspensión, etc.), motor de compatibilidad vehicular (`fitsVehicle`), control de stock y reglas de flete en COP. | Al modificar el catálogo de repuestos, los filtros de compatibilidad por vehículo o la pasarela de compra. |
| **`supabase`** | `.agents/skills/supabase/SKILL.md` | **Integración Supabase SSR**: Convenciones para cliente de navegador y servidor en Next.js 14 App Router, manejo de cookies y sesiones. | Al conectar nuevas entidades a la base de datos o implementar Server Components. |
| **`supabase-postgres-best-practices`** | `.agents/skills/supabase-postgres-best-practices/SKILL.md` | **Optimización PostgreSQL**: Indexación de columnas JSONB (`especificaciones`), rendimiento de RLS y restricciones de integridad relacional. | Al crear scripts de migración DDL, índices compuestos o auditar el rendimiento de consultas. |

---

## 2. Registro de Purga y Descarte de Skills Heredadas

Como resultado de la auditoría de purga del ecosistema de IA, se eliminaron **11 skills ajenas al dominio automotriz** que habían sido importadas de proyectos anteriores (Quiral POS, comercio general y generadores de marketing):

| Skill Eliminada | Dominio de Origen | Motivo Técnico de la Purga |
|---|---|---|
| `quiral-pos-engine` | POS / Comercio de Mostrador | Reglas de balanceo de lotes multi-tienda y RPCs de ventas de mostrador ajenas al modelo vehicular. |
| `quiral-ui-hig` | PWA Móvil / Apple HIG de Mostrador | Referencias a proyectos externos (`Desktop/elytras/quiral-pwa/`) y componentes irrelevantes. |
| `google-stitch` | Integración Google Stitch para POS | Conectores MCP y tokens de diseño para prototipos de Quiral PWA. |
| `stitch-design` | Integración de diseño con Vite | Dependencia de `VITE_STITCH_API_KEY` y arquitecturas anteriores. |
| `banner-design` | Marketing de Redes Sociales | Generación de banners publicitarios para Facebook, LinkedIn e Instagram no aplicables al código fuente. |
| `brand` | Marketing General | Guías genéricas de redacción corporativa no técnicas. |
| `slides` | Pitch Decks / Presentaciones | Generador de diapositivas con Chart.js para presentaciones comerciales. |
| `design` | Diseño Gráfico General | Skill sobrecargada con generadores de logos e imágenes para redes sociales. |
| `design-system` | Tokens de Presentación | Generación de slides y tokens no acoplados a Tailwind CSS ni Next.js 14. |
| `impeccable` | Auditoría Visual Externa | Dependencia de binarios externos propietarios no configurados en el proyecto. |
| `ui-ux-pro-max` | Librería Genérica de Estilos | 79 estilos genéricos con scripts de Python que duplicaban las capacidades de Tailwind y Radix UI. |

---

## 3. Gobernanza y Mantenimiento

Cualquier nueva habilidad que se proponga para el proyecto debe:
1. Pertenecer estrictamente al sector automotriz, mecánico o motociclista.
2. Ser compatible con la arquitectura **Next.js 14 App Router + TypeScript + Supabase SSR**.
3. Registrarse en este archivo antes de su adopción en producción.
