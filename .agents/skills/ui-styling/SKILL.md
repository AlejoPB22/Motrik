---
name: ui-styling
description: Directrices del sistema de diseño automotriz, componentes Tailwind CSS, accesibilidad WAI-ARIA y animaciones Framer Motion para la plataforma Motrik en Next.js 14 App Router.
---

# UI Styling — Motrik Automotive Design System

Skill especializada en la identidad visual, componentes interactivos y diseño responsive para **Motrik** (Tienda de Repuestos, Directorio de Talleres y Mi Garaje / Bitácora).

---

## 1. Paleta Semántica y Tokens de Color
- **`bg-background` / `text-foreground`**: Base neutra limpia con soporte nativo de modo claro y oscuro (`dark:bg-background`).
- **`bg-primary` / `text-primary` (`#3B82F6` / Azul Automotriz)**: Denota confianza, verificación técnica y enlaces principales.
- **`bg-cta` / `text-cta-foreground` (`#F97316` / Naranja de Alta Conversión)**: Utilizado exclusivamente para llamadas a la acción decisivas:
  - Botón `"Comprar ahora"` en el modal de repuestos.
  - Botón `"Registrar Mantenimiento"` en la bitácora técnica.
  - Botón `"Contactar Taller"` en el directorio.
- **`bg-success` / `text-success` (`#10B981` / Verde Esmeralda)**: Sello de `"Compatibilidad garantizada"` y estado `"Vigente"` de documentos reglamentarios.
- **`text-destructive` (`#EF4444` / Rojo Alerta)**: Documentos reglamentarios vencidos (SOAT o Tecnomecánica).
- **`text-cta` (`#F59E0B` / Ámbar Preventivo)**: Documentos próximos a vencer ($\le 30$ días).

---

## 2. Tipografía y Jerarquía Numérica
- **Titulares**: Semibold/bold con tracking equilibrado (`font-semibold tracking-tight`).
- **Odómetro y Métricas**: Utilizar siempre tipografía monoespaciada (`font-mono`) con separador de miles colombiano (`48.230 km`).
- **Precios en Moneda Local**: Tipografía destacada con badge de descuento (`% OFF`) cuando exista precio anterior (`oldPrice`).

---

## 3. Componentes de Interfaz Estándar
- **Primitivas UI (`src/components/ui/`)**: Basadas en Radix UI (`Dialog`, `Sheet`, `Select`, `DropdownMenu`, `Switch`, `Skeleton`, `Button`).
- **Tarjetas con Elevación**:
  ```tsx
  className="rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
  ```
- **Cabeceras Unificadas**: Utilizar `PageHeader` (`src/components/motrick/shared.tsx`) para mantener consistencia en títulos, subtítulos y badges de navegación.
- **Navegación Superior (`Header.tsx`)**: Header persistente con desenfoque de fondo (`backdrop-blur-xl`), buscador predictivo en tiempo real y selector vehicular activo con cambio instantáneo de contexto.

---

## 4. Animaciones y Microinteracciones (Framer Motion)
- **Entrada de Vistas**: `initial={{ opacity: 0, y: 12 }}` / `animate={{ opacity: 1, y: 0 }}`.
- **Transición de Listas y Modales**: Emplear `<AnimatePresence>` para acordeones de historial de mantenimiento, apertura de ficha técnica en Bottom Sheet y filtros por chip.
- **Accesibilidad**: Respetar siempre preferencias de reducción de movimiento del sistema (`prefers-reduced-motion`).

---

## 5. Publicidad Contextual Transparente (RNF-04)
- Todo componente de recomendación comercial o seguro (`SponsoredCard.tsx`) debe incluir de manera visible la etiqueta **"Patrocinado"** en cumplimiento de los artículos 29 y 30 de la Ley 1480 de 2011 (Estatuto del Consumidor en Colombia).
