# Motrik — Ecosistema Digital Automotriz

Plataforma web integral para el sector automotriz que conecta la compra de repuestos con compatibilidad garantizada, un directorio geolocalizado de talleres certificados y la gestión digital del garaje virtual con bitácora de mantenimiento y alertas reglamentarias.

---

## 1. Descripción y Objetivos del Proyecto

En el mercado vehicular colombiano, los conductores enfrentan alta incertidumbre al adquirir autopartes debido a errores de compatibilidad, dispersión en la oferta de talleres de confianza y desorden en el seguimiento técnico de sus vehículos.

**Motrik** resuelve esta problemática centralizando en una arquitectura moderna:
- **Certeza Técnica**: Algoritmo de compatibilidad vehicular según marca, modelo y año.
- **Red de Confianza**: Directorio de talleres mecánicos con valoraciones verificadas, especialidades y datos de contacto.
- **Trazabilidad y Cumplimiento Legal**: Garaje virtual con registro de kilometraje, historial de servicios y control de vencimientos de SOAT y revisión técnico-mecánica.

---

## 2. Funcionalidades Principales por Módulo

| Módulo | Ruta | Funcionalidades Implementadas |
|---|---|---|
| **Panel Central** | `/` | Vista 360° del vehículo activo, odómetro digital, alertas prioritarias de documentos por vencer, picks compatibles y accesos directos. |
| **Tienda de Repuestos** | `/repuestos` | Catálogo filtrable por categoría (Frenos, Motor, Suspensión, etc.), selector vehicular dinámico, verificación de compatibilidad (`fitsVehicle`), cálculo de fletes y simulación de compra con modal de checkout seguro. |
| **Directorio de Talleres** | `/directorio` | Directorio con filtrado por zonas de Bogotá, especialidades mecánicas, detalle de talleres con reseñas auditadas y formulario de verificación comercial (Ley 1480). |
| **Garaje y Bitácora** | `/bitacora` | Ficha técnica del vehículo (motor, combustible, transmisión), alertas semafóricas de SOAT/Tecnomecánica, historial cronológico de servicios y registro asistido de nuevos mantenimientos con vinculación opcional de repuestos. |

---

## 3. Stack Tecnológico y Versiones

- **Framework**: [Next.js](https://nextjs.org/) `14.2.35` (App Router, Server & Client Components).
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) `5.x` (Modo estricto, 0 errores de tipado).
- **Librería UI**: [React](https://react.dev/) `18.x`.
- **Estilos y Diseño**: [Tailwind CSS](https://tailwindcss.com/) `3.4.1`, [Lucide React](https://lucide.dev/) (Iconografía), [Radix UI](https://www.radix-ui.com/) (Primitivas accesibles).
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/) `14.6.0`.
- **Notificaciones**: [Sonner](https://sonner.emilkowal.ski/) `2.0.8`.
- **Persistencia & Backend SSR**: [Supabase](https://supabase.com/) (`@supabase/ssr` `0.12.7`, `@supabase/supabase-js` `2.116.0`).

---

## 4. Requisitos Previos

- **Node.js**: Versión `18.17.0` o superior (se recomienda Node `20 LTS`).
- **NPM**: Versión `9.x` o superior (incluido con Node.js).
- **Navegador Web**: Chrome, Edge, Firefox o Safari con soporte moderno de CSS Grid y ESModules.

---

## 5. Instalación y Ejecución Local

1. Clonar el repositorio o situarse en la raíz del espacio de trabajo:
   ```bash
   cd motrik
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Acceder en el navegador a: [http://localhost:3000](http://localhost:3000).

---

## 6. Configuración de Variables de Entorno

Copiar la plantilla de variables:
```bash
cp .env.example .env.local
```

Contenido de `.env.local`:
```env
# URL del proyecto en Supabase (requerido para modo Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co

# Clave pública anónima de Supabase
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu_clave_anonima_o_publishable

# Origen de datos: 'auto' | 'supabase' | 'mock'
NEXT_PUBLIC_DATA_SOURCE=auto
```

---

## 7. Funcionamiento de los Modos Mock y Supabase

Motrik implementa una estrategia de datos híbrida y tolerante a fallos:
1. **Modo Automático (`auto`)**:
   - Detecta si las credenciales de Supabase son URLs válidas y activas.
   - Si existen, consulta la base de datos remota; si no están configuradas o presentan errores de red en desarrollo, recurre inmediatamente a los datos simulados de `src/data/mock.ts` sin detener la ejecución ni lanzar excepciones 500.
2. **Modo Mock Puro (`mock`)**:
   - Fuerza el uso exclusivo de datos en memoria para pruebas locales offline, demostraciones o corrección de diseño visual.
3. **Modo Supabase Estricto (`supabase`)**:
   - Configuración para entornos productivos. No encubre fallos de red con datos simulados, asegurando integridad en las operaciones de los usuarios.

---

## 8. Estructura de Carpetas y Responsabilidades

```text
motrik/
├── .agents/                    # Skills y directrices locales para agentes de desarrollo
│   └── skills/
│       ├── ui-styling/         # Directrices de diseño automotriz y Tailwind
│       ├── security-audit/     # Auditoría de seguridad, RLS y sanitización
│       └── inventory/          # Reglas de negocio de autopartes y compatibilidad
├── docs/                       # Documentación técnica complementaria
│   ├── ARCHITECTURE.md         # Arquitectura detallada y flujo de datos
│   ├── DATABASE.md             # Esquema relacional, llaves y políticas RLS
│   ├── SECURITY.md             # Medidas de seguridad y prevención de vulnerabilidades
│   └── DEVELOPMENT.md          # Guía de convenciones y scripts de desarrollo
├── public/                     # Archivos estáticos y fotografías de repuestos y talleres
├── src/
│   ├── app/                    # Rutas de Next.js App Router (Páginas y layouts)
│   │   ├── layout.tsx          # Shell general y providers
│   │   ├── page.tsx            # Inicio (Resumen y estado del auto)
│   │   ├── repuestos/          # Módulo de Tienda
│   │   ├── directorio/         # Módulo de Talleres
│   │   └── bitacora/           # Módulo de Garaje Virtual
│   ├── components/
│   │   ├── ui/                 # Primitivas accesibles de interfaz (Radix UI)
│   │   └── motrick/            # Componentes de negocio (Header, Checkout, SponsoredCard)
│   ├── data/
│   │   └── mock.ts             # Datos simulados base y catálogos de vehículos
│   ├── lib/
│   │   ├── store.tsx           # Contexto global de estado (useApp)
│   │   └── utils.ts            # Utilidades de Tailwind y clases (cn)
│   ├── services/               # Capa desacoplada de acceso a datos
│   │   ├── repuestos.service.ts
│   │   ├── directorio.service.ts
│   │   └── bitacora.service.ts
│   ├── types/                  # Definiciones TypeScript de entidades y contratos
│   │   └── index.ts
│   ├── utils/
│   │   └── supabase/           # Clientes validados SSR y Middleware
│   │       ├── client.ts
│   │       ├── server.ts
│   │       └── middleware.ts
│   └── middleware.ts           # Interceptor de rutas y sesión de Next.js
├── supabase/
│   ├── schema.sql              # Esquema SQL DDL, restricciones y políticas RLS
│   └── seed.sql                # Datos iniciales para pruebas en Supabase
├── AGENTS.md                   # Instrucciones permanentes para agentes de software
├── SKILLS_INDEX.md             # Catálogo de skills locales
├── package.json
└── README.md
```

---

## 9. Modelo de Datos y Relaciones Principales

El esquema de base de datos se basa en 6 entidades relacionales clave:
1. `usuarios`: Cuentas de clientes, mecánicos y administradores.
2. `vehiculos`: Vehículos registrados por cada usuario con su odómetro y fechas de documentos.
3. `repuestos`: Catálogo de autopartes con compatibilidad, precios y especificaciones en `jsonb`.
4. `registros_bitacora`: Mantenimientos técnicos vinculados a vehículos y repuestos.
5. `mecanicos`: Perfiles comerciales y geográficos de los talleres.
6. `valoraciones`: Evaluaciones de clientes a talleres con restricción explícita:
   ```sql
   CONSTRAINT valoraciones_cliente_id_fkey FOREIGN KEY (cliente_id) REFERENCES public.usuarios(id)
   ```

---

## 10. Estrategia de Seguridad y Row Level Security (RLS)

- **Aislamiento de Privilegios**: Separación estricta entre cliente (`@supabase/ssr`) y servidor. Claves maestras (`service_role`) jamás se exponen en el frontend.
- **Protección de Navegación**: Middleware robusto que valida la sintaxis de las variables de entorno antes de procesar solicitudes, eliminando pantallas de error 500 por variables ausentes.
- **Políticas RLS en PostgreSQL**:
  - Lectura pública para catálogo de repuestos, talleres y valoraciones.
  - Inserciones controladas de mantenimientos desde la bitácora técnica.
  - Protección de datos privados de vehículos para evitar accesos cruzados entre usuarios.

---

## 11. Verificaciones y Pruebas Disponibles

El proyecto cuenta con un conjunto de verificaciones automatizadas ejecutables mediante npm:

```bash
# 1. Comprobación estricta de tipos TypeScript
npm run typecheck

# 2. Análisis estático de código (ESLint)
npm run lint

# 3. Compilación optimizada de producción
npm run build
```

*Estado de la auditoría*:
- **TypeScript**: 0 errores (`tsc --noEmit` completado exitosamente).
- **ESLint**: 0 errores en todas las páginas y componentes.
- **Build**: Compilación exitosa de todas las rutas estáticas y dinámicas.

---

## 12. Procedimiento de Despliegue

### Despliegue en Vercel
1. Conectar el repositorio de GitHub a Vercel.
2. En la configuración del proyecto, establecer **Root Directory** como `motrik`.
3. Configurar las variables de entorno de producción:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_DATA_SOURCE=auto` (o `supabase`)
4. Desplegar. Vercel ejecutará automáticamente `npm run build` y servirá la aplicación en el borde (Edge Network).

---

## 13. Limitaciones Conocidas y Funcionalidades Pendientes

1. **Pasarela de Pagos**: El modal de compra (`Checkout.tsx`) realiza una simulación completa con validación Luhn y estados interactivos, pero la pasarela transaccional real (Wompi / PayU) está prevista para la siguiente fase.
2. **Autenticación con Proveedores Sociales**: La aplicación opera con una sesión local preconfigurada (Alejandro Paternina) para demostraciones ágiles; el flujo de inicio de sesión con Google/Magic Links se integrará en el módulo `/auth`.
3. **Carga Multimedia de Usuarios**: Actualmente las imágenes utilizan assets locales optimizados (`public/assets/`); se contempla la integración de Supabase Storage para subir fotos reales de facturas y mantenimientos en la bitácora.

---

## 14. Justificación de Decisiones Arquitectónicas

1. **Next.js 14 App Router**: Permite aprovechar Server Components para la entrega eficiente de interfaces y optimización de SEO automotriz, limitando Client Components a áreas interactivas (filtros, modales, formularios).
2. **Capa de Servicios Intermedia**: Evita que las páginas UI llamen directamente a Supabase o dependan rígidamente de una base de datos remota. Esto habilita el modo híbrido (Mock/Real) sin refactorizaciones en la vista.
3. **Tailwind CSS + Radix UI**: Proporciona máxima flexibilidad estética con accesibilidad certificada (WAI-ARIA) en diálogos, selectores y acordeones, manteniendo tiempos de carga ultraligeros.
4. **PostgreSQL + Supabase**: Brinda la solidez de una base de datos relacional ACID para la integridad de datos vehiculares (claves foráneas, restricciones de odómetro y calificaciones 1..5) combinada con APIs en tiempo real mediante PostgREST.
