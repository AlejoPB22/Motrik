# Guía de Desarrollo Local y Convenciones — Motrik

Guía para desarrolladores y evaluadores técnicos para instalar, ejecutar y extender **Motrik**.

---

## 1. Requisitos Previos

- **Node.js**: v18.17.0 o superior (recomendado v20 LTS).
- **Gestor de Paquetes**: `npm` (utiliza `package-lock.json`).

---

## 2. Instalación y Puesta en Marcha

1. Clonar el repositorio y acceder a la carpeta del proyecto:
   ```bash
   cd motrik
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configurar variables de entorno:
   ```bash
   cp .env.example .env.local
   ```
4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
5. Abrir en el navegador: [http://localhost:3000](http://localhost:3000).

---

## 3. Scripts de Verificación y Compilación

| Comando | Acción | Criterio de Aceptación |
|---|---|---|
| `npm run typecheck` | Ejecuta `tsc --noEmit` en modo estricto. | Debe terminar con 0 errores de TypeScript. |
| `npm run lint` | Ejecuta Next.js ESLint. | Debe terminar con 0 errores de análisis estático. |
| `npm run build` | Genera la compilación optimizada de producción. | Debe generar los bundles de todas las rutas y el middleware. |
| `npm run start` | Arranca el servidor local con la compilación de producción. | Permite validar la velocidad de carga final. |

---

## 4. Alternancia entre Modo Mock y Supabase

En `.env.local`:
- **Modo Mock puro (sin internet / demo)**:
  ```env
  NEXT_PUBLIC_DATA_SOURCE=mock
  ```
- **Modo Supabase automático (desarrollo flexible)**:
  ```env
  NEXT_PUBLIC_DATA_SOURCE=auto
  NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_anon_key
  ```
- **Modo Supabase estricto (producción)**:
  ```env
  NEXT_PUBLIC_DATA_SOURCE=supabase
  ```

---

## 5. Convenciones de Código
- **Estilo**: Tailwind CSS utilitario, sin estilos CSS embebidos inline.
- **Tipado**: Todos los modelos deben derivarse o importarse de `@/types` o `@/data/mock`.
- **Servicios**: Toda consulta a base de datos debe residir en `src/services/` y contemplar el manejo de errores y fallbacks.

