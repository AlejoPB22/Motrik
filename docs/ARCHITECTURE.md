# Arquitectura del Sistema — Motrik

Este documento describe la arquitectura técnica, los límites de responsabilidad y el flujo de datos de **Motrik**, una aplicación web automotriz desarrollada con **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS** y **Supabase SSR**.

---

## 1. Visión General de la Arquitectura

Motrik adopta una arquitectura en capas desacoplada para garantizar que la interfaz de usuario no dependa directamente de una conexión remota activa durante fases de desarrollo o pruebas locales.

```
┌───────────────────────────────────────────────────────────┐
│                    Capa de Presentación                   │
│          Next.js App Router (Páginas y Componentes)       │
│      / (Home)  |  /repuestos  |  /directorio  |  /bitacora│
└─────────────────────────────┬─────────────────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────┐
│                    Capa de Servicios                      │
│             src/services/*.service.ts                     │
│    (repuestos.service, directorio.service, bitacora.service)│
└──────────────┬─────────────────────────────┬──────────────┘
               │ (Modo Supabase)             │ (Modo Mock / Fallback)
┌──────────────▼─────────────┐ ┌─────────────▼──────────────┐
│     Supabase SSR Client    │ │         Datos Mock         │
│   src/utils/supabase/      │ │      src/data/mock.ts      │
│ (PostgreSQL + RLS + Auth)  │ │   (Catálogo, Red y Garaje) │
└────────────────────────────┘ └────────────────────────────┘
```

---

## 2. Responsabilidades por Capa

### 2.1 Capa de Enrutamiento y Composición (`src/app/`)
- **Páginas Principales**:
  - `src/app/page.tsx`: Panel principal de resumen del vehículo activo, odómetro, alertas de vencimiento (SOAT/Tecno) y accesos directos.
  - `src/app/repuestos/page.tsx`: Catálogo interactivo de autopartes, filtrado por vehículo, visualización de fichas técnicas y modal de compra.
  - `src/app/directorio/page.tsx`: Directorio de talleres mecánicos con filtrado por zona y especialidad, valoraciones reales y solicitud de verificación.
  - `src/app/bitacora/page.tsx`: Bitácora técnica del garaje virtual, cálculo de alertas de documentos obligatorios y formulario de registro de servicio.
- **Layout Global** (`src/app/layout.tsx`):
  - Inicializa el proveedor global `AppProvider`.
  - Renderiza el `Header` de navegación con selector de vehículo activo y buscador contextual.
  - Inyecta `Toaster` (Sonner) para retroalimentación accesible.

### 2.2 Capa de Servicios (`src/services/`)
Aísla la lógica de acceso a datos de la interfaz:
- `repuestos.service.ts`: Métodos `getRepuestos(filter)`. Transforma registros crudos de BD (`DbRepuesto`) a modelos de vista (`Part`).
- `directorio.service.ts`: Métodos `getDirectorio(filter)`. Procesa mecánicos, calcula promedios y estructura reseñas.
- `bitacora.service.ts`: Métodos `getVehiculos()`, `getRegistrosBitacora()` y `saveRegistroBitacora()`. Maneja la persistencia remota o local de nuevos servicios.

### 2.3 Capa de Estado (`src/lib/store.tsx`)
- Implementa el contexto `AppCtx` (`useApp()`).
- Administra el vehículo activo seleccionado por el usuario, el tema claro/oscuro y los registros acumulados en memoria durante la sesión.

### 2.4 Clientes y Middleware Supabase (`src/utils/supabase/`)
- `middleware.ts`: Refresco de sesión con validación previa de URLs (`isSupabaseConfigured()`) para evitar errores fatales `TypeError: Invalid URL` si las variables de entorno están ausentes.
- `client.ts`: Cliente de navegador tipado con emulador de fallback seguro.
- `server.ts`: Cliente de servidor para Server Components o Server Actions.

---

## 3. Modos de Origen de Datos (`NEXT_PUBLIC_DATA_SOURCE`)

Motrik soporta tres modos de operación mediante la variable `NEXT_PUBLIC_DATA_SOURCE`:

| Modo | Comportamiento | Entorno Recomendado |
|---|---|---|
| `auto` (default) | Valida credenciales de Supabase. Si son válidas, consulta la base de datos; si fallan o no existen, recurre limpiamente a datos mock. | Desarrollo local y evaluación académica |
| `mock` | Desactiva llamadas de red y opera 100% con los datos de `src/data/mock.ts`. | Demostraciones sin conexión |
| `supabase` | Modo estricto. Lanza errores explícitos si la base de datos no está disponible o las credenciales son inválidas. | Entornos de producción |

