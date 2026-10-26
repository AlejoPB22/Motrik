# UNIVERSIDAD TECNOLÓGICA DE BOLÍVAR
## FACULTAD DE INGENIERÍA
### PROGRAMA DE INGENIERÍA DE SOFTWARE
**GRUPO / CURSO:** 1208  
**PROYECTO DE AULA (TERCER CORTE - MVP FINAL)**  
**"Motrick: Plataforma Centralizada para la Gestión de Mantenimiento Vehicular, Directorio de Talleres y Catálogo de Repuestos"**  

**ESTUDIANTES:**  
* Alejandro David Paternina Bermejo – Código: T00078032  
* Johan Sebastian Brieva Fernandez – Código: T00077809  

**DOCENTE:**  
Aisner Jose Marrugo Juliao  

Cartagena de Indias, Bolívar  
2026  

---

# ÍNDICE GENERAL

1. [Capítulo 1: Marco de Negocio y Fundamentación Jurídica](#capítulo-1-marco-de-negocio-y-fundamentación-jurídica)  
   1.5. [Modelo de Negocio y Marco Jurídico Institucional](#15-modelo-de-negocio-y-marco-jurídico-institucional)  
   1.5.1. [Prevención de Solidaridad Jurídica y Portal de Contacto (Art. 53, Ley 1480 de 2011)](#151-prevención-de-solidaridad-jurídica-y-portal-de-contacto-art-53-ley-1480-de-2011)  
   1.5.2. [Publicidad Nativa Contextual y Política de Brand Safety (RNF-04)](#152-publicidad-nativa-contextual-y-política-de-brand-safety-rnf-04)  
2. [Capítulo 5: Especificación de Requerimientos de Software](#capítulo-5-especificación-de-requerimientos-de-software)  
   5.1. [Requerimientos Funcionales (RF-01 a RF-05)](#51-requerimientos-funcionales-rf-01-a-rf-05)  
   5.2. [Requerimientos No Funcionales (RNF-01 a RNF-04)](#52-requerimientos-no-funcionales-rnf-01-a-rnf-04)  
3. [Capítulo 7: Modelado UML y Matriz de Validación](#capítulo-7-modelado-uml-y-matriz-de-validación)  
   7.1. [Diagrama de Casos de Uso Actualizado (Figura 1)](#71-diagrama-de-casos-de-uso-actualizado-figura-1)  
   7.2. [Modelos Arquitectónicos y Estructurales UML del Sistema (Figuras 2 a 8)](#72-modelos-arquitectónicos-y-estructurales-uml-del-sistema-figuras-2-a-8)  
   7.3. [Matriz de Validación y Ajustes Metodológicos](#73-matriz-de-validación-y-ajustes-metodológicos)  
4. [Capítulo 8: Gestión Ágil (FDD) y Control de Versiones](#capítulo-8-gestión-ágil-fdd-y-control-de-versiones)  
   8.1. [Tablero de Trabajo FDD (Figura 9)](#81-tablero-de-trabajo-fdd-figura-9)  
   8.2. [Repositorio, Ramas y Trazabilidad Git](#82-repositorio-ramas-y-trazabilidad-git)  
5. [Capítulo 9: Validación y Pruebas de Software](#capítulo-9-validación-y-pruebas-de-software)  
   9.1. [Reglas de Negocio Acordadas y Datos Base (seed.sql)](#91-reglas-de-negocio-acordadas-y-datos-base-seedsql)  
   9.2. [Matriz de Casos de Prueba Reales Ejecutados (Tabla 1)](#92-matriz-de-casos-de-prueba-reales-ejecutados-tabla-1)  
   9.3. [Registro y Corrección de Defectos (D1 y D2)](#93-registro-y-corrección-de-defectos-d1-y-d2)  
   9.4. [Simulación de Cambio y Pruebas de Regresión (Regla R6)](#94-simulación-de-cambio-y-pruebas-de-regresión-regla-r6)  
   9.5. [Revisión Cruzada y Decisión de Liberación](#95-revisión-cruzada-y-decisión-de-liberación)  
   9.6. [Criterio de Verificación vs. Validación en Motrick](#96-criterio-de-verificación-vs-validación-en-motrick)  

---

# Capítulo 1: Marco de Negocio y Fundamentación Jurídica

## 1.5. Modelo de Negocio y Marco Jurídico Institucional

Motrick implementa un modelo de monetización B2B basado en membresías de visibilidad para talleres mecánicos y pauta publicitaria nativa, **descartando el cobro de comisiones sobre reparaciones**.

### 1.5.1. Prevención de Solidaridad Jurídica y Portal de Contacto (Art. 53, Ley 1480 de 2011)
De acuerdo con el **Artículo 53 de la Ley 1480 de 2011 (Estatuto del Consumidor en Colombia)**, la plataforma califica como **portal de contacto e intermediación informativa**. Si Motrick recaudara el valor del servicio de mano de obra o comisionara sobre el arreglo mecánico, la Superintendencia de Industria y Comercio (SIC) la consideraría prestador solidario, debiendo responder económicamente ante fallas mecánicas, averías colaterales o garantías no atendidas por el taller. 

Al limitar los ingresos al canon de visibilidad y verificación, la relación contractual por el servicio automotriz se suscribe directa y exclusivamente entre el propietario del vehículo y el taller mecánico contratado.

> **Cláusula de Deslinde en Términos y Condiciones:**  
> *"Motrick opera bajo la figura de portal de contacto (Art. 53, Ley 1480 de 2011). La plataforma no ejecuta diagnósticos mecánicos, no provee mano de obra ni actúa como garante solidario de los trabajos realizados por los talleres listados. La contratación de servicios automotrices, su calidad y cumplimiento de garantías recaen exclusivamente en el establecimiento seleccionado por el usuario."*

---

## 1.5.2. Publicidad Nativa Contextual y Política de Brand Safety (RNF-04)

Como línea secundaria de sostenimiento, se habilitan espacios pasivos en los márgenes y zonas blancas de la interfaz, alineados con los **Artículos 29 y 30 de la Ley 1480 de 2011 (protección contra publicidad engañosa)**:

1. **Relevancia temático-vehicular:** Solo se admiten anunciantes de servicios afines (SOAT digital, revisión técnico-mecánica en Centros de Diagnóstico Automotor CDA aliados, escáneres OBD2 y telepeaje).
2. **Cero intrusión (UX):** Se vetan terminantemente pop-ups, modales bloqueantes o banners con audio automático, garantizando cero desplazamiento visual (*Cumulative Layout Shift = 0*).
3. **Seguridad de marca (Brand Safety):** Quedan prohibidos juegos móviles, apuestas deportivas, esquemas de inversión y contenido adulto (+18). Toda inserción cuenta con el distintivo gráfico visible y obligatorio **"Patrocinado"**.

---

# Capítulo 5: Especificación de Requerimientos de Software

## 5.1. Requerimientos Funcionales (RF-01 a RF-05)

### Ficha Técnica: RF-01
| Campo | Detalle Técnico |
| :--- | :--- |
| **Identificador** | **RF-01** |
| **Nombre** | Registro y control de mantenimiento en bitácora vehicular |
| **Descripción** | El sistema debe permitir a los usuarios propietarios registrar mantenimientos preventivos o correctivos de sus vehículos, capturando fecha, odómetro, título del servicio, notas adicionales, taller ejecutor y repuesto asociado. |
| **Fuente** | Elicitación: Entrevistas a conductores y análisis de gestión de flotas particulares. |
| **Prioridad** | Alta |
| **Criterio de Aceptación** | El registro se almacena en la tabla `registros_bitacora` de Supabase vinculándose al vehículo activo. Si el odómetro ingresado es menor al kilometraje registrado del vehículo, la interfaz rechaza la operación. |

### Ficha Técnica: RF-02
| Campo | Detalle Técnico |
| :--- | :--- |
| **Identificador** | **RF-02** |
| **Nombre** | Directorio de talleres mecánicos con filtros de especialidad |
| **Descripción** | La plataforma debe presentar un directorio interactivo de establecimientos mecánicos, permitiendo filtrar por especialidad técnica (Frenos, Motor, Suspensión, Transmisión, Eléctrico), calificación promedio y estado de verificación. |
| **Fuente** | Elicitación: Necesidad de localización rápida de talleres especializados en Cartagena. |
| **Prioridad** | Alta |
| **Criterio de Aceptación** | La consulta PostgREST a `mecanicos` filtra dinámicamente mediante `ILIKE` sobre la columna `especialidad` y actualiza la cuadrícula de talleres en tiempo real. |

### Ficha Técnica: RF-03
| Campo | Detalle Técnico |
| :--- | :--- |
| **Identificador** | **RF-03** |
| **Nombre** | Consulta de valoraciones y reseñas de mecánicos |
| **Descripción** | El sistema debe desplegar las calificaciones (1 a 5 estrellas) y opiniones otorgadas por clientes verificados a cada taller, calculando la nota promedio visible. |
| **Fuente** | Elicitación: Mitigación de asimetría informativa y desconfianza en talleres mecánicos. |
| **Prioridad** | Media / Alta |
| **Criterio de Aceptación** | Las valoraciones se recuperan de la tabla `valoraciones`. El motor de PostgreSQL impone restricción de dominio `CHECK (puntuacion >= 1 AND puntuacion <= 5)`. |

### Ficha Técnica: RF-04
| Campo | Detalle Técnico |
| :--- | :--- |
| **Identificador** | **RF-04** |
| **Nombre** | Catálogo de repuestos con filtro de compatibilidad vehicular |
| **Descripción** | El sistema debe ofrecer un catálogo de piezas automotrices categorizadas, señalando mediante un badge gráfico si el repuesto es compatible con el vehículo seleccionado por el usuario. |
| **Fuente** | Elicitación: Reducción del error en compras de repuestos automotrices incompatibles. |
| **Prioridad** | Alta |
| **Criterio de Aceptación** | El catálogo consulta la tabla `repuestos` en Supabase y compara la columna `compatibilidad` con el modelo y marca del vehículo activo. |

### Ficha Técnica: RF-05
| Campo | Detalle Técnico |
| :--- | :--- |
| **Identificador** | **RF-05** |
| **Nombre** | Verificación y validación de talleres mecánicos |
| **Descripción** | El sistema debe disponer de un canal para que los talleres soliciten una insignia de acreditación suministrando NIT/RUT, razón social, dirección física y teléfono de contacto. El Administrador valida la autenticidad de los datos para otorgar la insignia de taller verificado, y el directorio permite filtrar según este criterio. |
| **Fuente** | Elicitación: Mitigación de desconfianza del usuario (Estudio AAA) y modelo de membresías B2B. |
| **Prioridad** | Media |
| **Criterio de Aceptación** | El perfil del taller en `/directorio` muestra la insignia gráfica tras su confirmación en base de datos, y el filtro "Solo verificados" actualiza el listado en tiempo real. |

---

## 5.2. Requerimientos No Funcionales (RNF-01 a RNF-04)

### Ficha Técnica: RNF-01
| Campo | Detalle Técnico |
| :--- | :--- |
| **Identificador** | **RNF-01** |
| **Nombre** | Arquitectura Full-Stack Next.js y Modern UX |
| **Descripción** | La aplicación debe construirse sobre Next.js 14 con App Router, React 18 y TypeScript estricto, empleando Tailwind CSS para estilos con soporte nativo de tema oscuro/claro y componentes accesibles (Radix UI). |
| **Fuente** | Definición de Arquitectura y Estándares de Rendimiento Web. |
| **Prioridad** | Alta |
| **Criterio de Aceptación** | Compilación de producción (`npm run build`) con 0 advertencias de tipado estricto y rutas estáticas pre-renderizadas. |

### Ficha Técnica: RNF-02
| Campo | Detalle Técnico |
| :--- | :--- |
| **Identificador** | **RNF-02** |
| **Nombre** | Persistencia y Base de Datos en Supabase con Row-Level Security (RLS) |
| **Descripción** | El sistema debe almacenar la información en un motor relacional PostgreSQL alojado en Supabase, implementando políticas de seguridad a nivel de fila (RLS) para proteger los datos privados de usuarios y vehículos. |
| **Fuente** | Estándar de Seguridad y Persistencia en la Nube. |
| **Prioridad** | Alta |
| **Criterio de Aceptación** | Las tablas poseen RLS habilitado. Consultas anónimas solo acceden a datos públicos (catálogo, talleres aprobados), mientras bitácora y vehículos requieren contexto de propiedad. |

### Ficha Técnica: RNF-03
| Campo | Detalle Técnico |
| :--- | :--- |
| **Identificador** | **RNF-03** |
| **Nombre** | Enlace directo con taller aliado para repuestos (Sin intermediación financiera) |
| **Descripción** | La plataforma no intermedia cobros ni procesa pagos bancarios por repuestos. El sistema provee un canal de enlace directo con el taller autorizado en Cartagena (vía WhatsApp y llamada directa), transfiriendo las especificaciones de compatibilidad vehicular para coordinar la disponibilidad, compra y montaje presencial. |
| **Fuente** | Modelo de Negocio B2B y Blindaje Jurídico (Art. 53, Ley 1480 de 2011). |
| **Prioridad** | Media |
| **Criterio de Aceptación** | El modal de contacto asigna automáticamente el taller idóneo en Cartagena según la especialidad de la pieza, genera el mensaje técnico estructurado sin solicitar datos financieros y provee acceso al perfil del taller en el directorio (Defecto D2 corregido). |

### Ficha Técnica: RNF-04
| Campo | Detalle Técnico |
| :--- | :--- |
| **Identificador** | **RNF-04** |
| **Nombre** | Visualización de publicidad nativa y contextual no invasiva |
| **Descripción** | La interfaz debe desplegar inserciones publicitarias pasivas integradas orgánicamente en el diseño (componente `SponsoredCard`) para servicios vehiculares aliados, con la etiqueta "Patrocinado" y sin recurrir a ventanas emergentes. |
| **Fuente** | Modelo de negocio de la plataforma y atributos de usabilidad (UX). |
| **Prioridad** | Baja / Media |
| **Criterio de Aceptación** | Las tarjetas respetan los tokens cromáticos de Tailwind CSS en temas claro y oscuro, sin interferir en los formularios ni generar redirecciones automáticas. |

---

# Capítulo 7: Modelado UML y Matriz de Validación

## 7.1. Diagrama de Casos de Uso Actualizado (Figura 1)

```mermaid
flowchart LR
    subgraph Actores
        User(("Usuario\nPropietario"))
        Mech(("Mecánico\nTaller"))
        Admin(("Administrador\nMotrick"))
        Sys[("Supabase\nPostgreSQL")]
    end

    subgraph "Plataforma Motrick (MVP)"
        UC1(["Buscar repuestos por vehículo"])
        UC2(["Contactar taller por WhatsApp"])
        UC3(["Filtrar mecánicos y talleres"])
        UC4(["Consultar valoraciones"])
        UC5(["Solicitar verificación de taller"])
        UC6(["Registrar mantenimiento en bitácora"])
        UC7(["Vincular repuesto del catálogo"])
        UC8(["Consultar historial vehicular"])
        UC9(["Gestionar Catálogo y Directorio"])
        UC10(["Verificar y aprobar talleres"])
    end

    User --> UC1
    User --> UC3
    User --> UC4
    User --> UC6
    User --> UC8

    UC2 -. "<<extend>>" .-> UC1
    UC7 -. "<<extend>>" .-> UC6

    Mech --> UC5
    Admin --> UC9
    Admin --> UC10

    UC1 --> Sys
    UC3 --> Sys
    UC6 --> Sys
    UC10 --> Sys
```

**Figura 1**  
*Diagrama de Casos de Uso Actualizado con Módulo de Verificación (RF-05) y Rol Administrador*  
*Nota.* Elaboración propia (2026) basada en los requerimientos del MVP de Motrick, incorporando relaciones `<<extend>>` para el contacto directo con talleres aliados por WhatsApp y la vinculación de piezas, e interacciones del actor Administrador y Mecánico bajo la Ley 1480 de 2011.

---

## 7.2. Modelos Arquitectónicos y Estructurales UML del Sistema (Figuras 2 a 8)

Para consolidar el **Pilar 3 (Modelado UML y Diseño Arquitectónico)** evaluado en el proyecto de aula, se integran los modelos arquitectónicos completos desarrollados a lo largo del semestre:

### 7.2.1. Diagrama de Clases del Sistema (Figura 2)
Modela la estructura estática del sistema, niveles de visibilidad, atributos tipados y operaciones de negocio. Define la generalización de la clase abstracta `Usuario` hacia `Cliente` y `Mecánico`, junto a las relaciones con `Vehículo`, `RegistroBitacora`, `Repuesto` y `Valoración`.

### 7.2.2. Diagramas de Secuencia del Sistema (Figuras 3, 4 y 5)
Ilustran la interacción temporal entre Usuario, Frontend (Next.js/React), Backend API y base de datos relacional Supabase (PostgreSQL Cloud) para los 3 flujos clave:
* **Figura 3 (Búsqueda de Repuestos por Vehículo - RF-04):** Secuencia descendente de consultas parametrizadas de catálogo según marca y modelo.
* **Figura 4 (Registro en la Bitácora de Mantenimiento - RF-01):** Validación de sesión y persistencia transaccional del servicio técnico en `registros_bitacora`.
* **Figura 5 (Enlace Directo con Taller para Repuestos - RNF-03):** Flujo de consulta y enlace directo con taller aliado en Cartagena vía WhatsApp y telefonía.

### 7.2.3. Diagrama de Actividades (Figura 6)
Modela el flujo procedural de registro en bitácora con un nodo de decisión (rombo) que evalúa si el mantenimiento incluye la vinculación opcional de una pieza del catálogo antes de consolidar el historial del automóvil.

### 7.2.4. Diagrama de Componentes (Figura 7)
Vista física modular dividida en: Interfaz de Usuario (Caja Blanca) con submódulos de Directorio, Buscador y Bitácora; y Servicios de Servidor / Supabase BaaS (Caja Negra) interconectados vía HTTP/REST y SDK oficial.

### 7.2.5. Diagrama de Despliegue (Figura 8)
Topología de nodos en la nube: Dispositivo Cliente (Navegador/App), Servidor Cloud (Vercel con Node.js y React) e Infraestructura BaaS (Supabase Cloud con PostgreSQL y Auth) comunicados bajo HTTPS y TCP/IP.

---

## 7.3. Matriz de Validación y Ajustes Metodológicos

| Elemento revisado | Concepción inicial | Hallazgo de la elicitación / Negocio | Cambio realizado o justificación |
| :--- | :--- | :--- | :--- |
| **Casos de Uso (Directorio y Seguridad)** | Búsqueda pasiva de talleres sin proceso de acreditación de identidad comercial. | Alto porcentaje de desconfianza en talleres mecánicos (estudio AAA, 2016) y necesidad de exención de garantía solidaria (Ley 1480/2011). | Se crearon los casos de uso *Solicitar verificación de taller* (Mecánico) y *Verificar y aprobar talleres* (Administrador), formalizando el esquema de confianza y membresía sin asumir responsabilidad civil sobre reparaciones. |
| **Modelo de Monetización y Publicidad** | La plataforma no contemplaba monetización secundaria ni reglas de pauta publicitaria. | Necesidad de ingresos sostenibles sin comprometer la velocidad ni la seriedad técnica de la herramienta automotriz. | Se definió la publicidad nativa contextual (RNF-04) con política de Brand Safety (veto de juegos, apuestas y +18) y tag visible "Patrocinado" exigido por la SIC. |
| **Adquisición de Repuestos** | Simulación de pasarela transaccional que contravenía el modelo B2B y generaba riesgo de responsabilidad solidaria. | Preferencia de los conductores y talleres por cotizar y coordinar directamente la instalación física presencial. | Se eliminó el cobro con tarjeta y se implementó el enlace directo con taller vía WhatsApp y telefonía en Cartagena (RNF-03). |

---

# Capítulo 8: Gestión Ágil (FDD) y Control de Versiones

## 8.1. Tablero de Trabajo FDD (Figura 2)

![Tablero de Gestión Ágil (FDD) en Estado de Cierre de Iteración del MVP de Motrick](../Trello.png)

**Figura 9**  
*Tablero de Gestión Ágil (FDD) en Estado de Cierre de Iteración del MVP de Motrick*  
*Nota.* Elaboración propia en Trello (2026). Refleja el 100% de los requerimientos completados para el corte evaluativo, distribuidos equitativamente entre Alejandro Paternina (AP) y Johan Brieva (JF):
* **Setup de Arquitectura** (AP)
* **RF-01: Registrar mantenimiento en bitácora** (JF)
* **RF-02: Filtrar directorio de talleres** (JF)
* **RF-03: Consultar valoraciones de mecánicos** (AP)
* **RF-04: Buscar repuestos por categoría y compatibilidad** (AP)
* **RF-05: Verificación y validación de talleres mecánicos** (AP / JF)
* **RNF-01: Arquitectura Full-Stack Next.js** (AP)
* **RNF-02: Persistencia en Supabase con RLS** (JF)
* **RNF-03: Enlace Directo con Taller y Contacto sin Intermediación Financiera** (AP)
* **RNF-04: Visualización de publicidad nativa contextual y Brand Safety** (AP)

## 8.2. Repositorio, Ramas y Trazabilidad Git
* **Repositorio Central:** [https://github.com/AlejoPB22/Motrik](https://github.com/AlejoPB22/Motrik)
* **Ramas y Trazabilidad:** Integración sobre la rama `develop` con confirmaciones descriptivas por cada funcionalidad:
  * `feat(core-repuestos)`: Alejandro Paternina (Catálogo, navegación y checkout simulado).
  * `feat(talleres-bitacora)`: Johan Brieva (Directorio, bitácora y componentes UI).
  * `feat(repuestos)`: Alejandro Paternina (Conexión Supabase y filtros de compatibilidad).
  * `feat(backend)`: Johan Brieva (Persistencia en Supabase y seed data).
  * `feat(pauta-legal)`: Alejandro Paternina (Pauta nativa contextual y marco legal).
  * `feat(talleres-uml)`: Alejandro Paternina y Johan Brieva (Modal de verificación y diagramas).

---

# Capítulo 9: Validación y Pruebas de Software

## 9.1. Reglas de Negocio Acordadas y Datos Base (seed.sql)

Para respaldar las pruebas técnicas sin simulaciones abstractas, se generó y ejecutó el script `supabase/seed.sql` sobre el cluster de PostgreSQL en Supabase Cloud.

### Datos Base Sembrados:
* **Usuario autenticado:** `a0000000-0000-0000-0000-000000000001` (`alejopaternina22@gmail.com`).
* **Vehículos de prueba:** Mazda 3 Grand Touring 2021 (Placa KDM-482, Odómetro 48.230 km) y Toyota Hilux 4x4 2019 (Placa THX-901, Odómetro 72.400 km).
* **Catálogo inicial:** 6 repuestos de alta rotación (Filtros, Pastillas cerámicas, Aceite sintético, Bujías de iridio).
* **Directorio:** 3 talleres mecánicos vinculados en Cartagena con especialidades en Frenos, Motor y Mecánica General.

### Reglas de Negocio Formalizadas:
* **R1 (Consistencia de Bitácora - RF-01):** El registro exige un vehículo del usuario, fecha válida y un odómetro mayor o igual al kilometraje actual del automóvil.
* **R2 (Vinculación de Pieza - RF-01):** El registro permite asociar un repuesto opcionalmente sin bloquear el guardado si se deja nulo.
* **R3 (Filtro y Rango de Calificación - RF-02 y RF-03):** El directorio filtra por especialidad y calcula el promedio dentro del intervalo estricto de 1.0 a 5.0 estrellas.
* **R4 (Compatibilidad Técnica - RF-04):** El buscador categoriza piezas compatibles según marca/modelo/año del vehículo seleccionado o categoría "Universal".
* **R5 (Contacto Directo sin Intermediación Financiera - RNF-03):** Motrik no procesa pagos de repuestos ni capta números de tarjeta de crédito; la adquisición e instalación se coordinan de manera directa y transparente con el taller aliado en Cartagena.

---

## 9.2. Matriz de Casos de Prueba Reales Ejecutados (Tabla 1)

### Tabla 1
*Matriz de Casos de Prueba Reales Ejecutados contra Next.js y Supabase*

| ID y Regla | Módulo / Entradas Reales | Resultado Esperado | Resultado Real Obtenido y Evidencia Técnica | ¿Pasa? |
| :--- | :--- | :--- | :--- | :---: |
| **T01**<br>*(R1 - Válido)* | Bitácora: Mazda 3, Fecha 2026-10-15, Km 49.000 (actual: 48.230 km). | Aceptada: Inserta en `registros_bitacora` y actualiza odómetro. | **Aceptada:** HTTP 201 en Supabase. Fila persistida con ID autoincremental y odómetro actualizado a 49.000 km. | **Sí** |
| **T02**<br>*(R1 - Límite)* | Bitácora: Mazda 3, Km ingresado 45.000 (inferior al actual de 48.230 km). | Rechazada: Bloqueo de envío por inconsistencia física de odómetro. | **Rechazada (Defecto D1 corregido):** Guarda preventiva en `bitacora/page.tsx` lanza `toast.error` y bloquea `submit()`. | **Sí** |
| **T03**<br>*(R2 - Válido)* | Bitácora: Switch repuesto activo, pieza = "Pastillas Cerámicas Brembo". | Aceptada: Guarda fila vinculando la columna `pieza_actualizada`. | **Aceptada:** Columna poblada en PostgreSQL y visible en el timeline de mantenimientos. | **Sí** |
| **T04**<br>*(R3 - Filtro)* | Directorio: Filtro especialidad = "Frenos", calificación mínima 4.0. | Aceptada: Retorna talleres que coinciden con el parámetro. | **Aceptada:** Devuelve 2 talleres reales; primer registro: `Torque Automotriz` (Script automatizado `test-real.mjs`). | **Sí** |
| **T05**<br>*(R3 - Límite)* | Directorio: Inserción directa en tabla `valoraciones` con puntuación = 6. | Rechazada: Restricción CHECK de base de datos deniega valor > 5. | **Rechazada:** Motor PostgreSQL arroja error `42501` (violación de RLS) y `23514` (`check_violation`) en Supabase (`test-real.mjs`). | **Sí** |
| **T06**<br>*(R4 - Válido)* | Repuestos: Vehículo activo = Mazda 3 (2021), Categoría = Frenos. | Aceptada: Retorna repuestos con badge "Compatible con tu auto". | **Aceptada:** Recupera 4 repuestos compatibles reales; primero: `Pastillas de freno cerámicas delanteras` (`test-real.mjs`). | **Sí** |
| **T07**<br>*(R5 - Contacto)* | Contacto Repuesto: Solicitud de pieza en catálogo desde modal. | Aceptada: Enlace directo con taller en Cartagena sin intermediación ni solicitud de tarjetas. | **Aceptada (Defecto D2 corregido):** Modal asigna taller por categoría (Manga, Bocagrande o Popa) y genera enlace a WhatsApp/teléfono sin captar datos financieros. | **Sí** |
| **T08**<br>*(R5 - RLS)* | Seguridad: Intento de insertar en `registros_bitacora` con auto de otro usuario. | Rechazada: Política RLS `registros_bitacora_crud_own` deniega la escritura. | **Rechazada:** Supabase retorna error de violación de políticas de seguridad por fila (`new row violates row-level security policy`). | **Sí** |

*Nota.* Elaboración propia basada en la ejecución técnica directa contra la base de datos Supabase (`seed.sql`) y la aplicación Next.js (2026).

---

## 9.3. Registro y Corrección de Defectos (D1 y D2)

### Defecto D1: Validación de Kilometraje en Bitácora
* **Requisito Asociado:** RF-01 (Regla R1).
* **Condición del Fallo:** Detectado en caso **T02**, al verificar que el modal permitía ingresar odómetros inferiores al valor registrado en el automóvil, provocando inconsistencia histórica.
* **Corrección Aplicada:** En `src/app/bitacora/page.tsx`, se integró una condición de parada previa al llamado a Supabase que compara `kmN` contra `activeVehicle.odometer`.

```typescript
// Fragmento corregido en MaintenanceDialog (src/app/bitacora/page.tsx)
const submit = async () => {
  const kmN = Number(f.km);
  if (!f.title.trim()) return setErr("Describe el servicio realizado.");
  if (!kmN) return setErr("Ingresa el kilometraje.");
  if (kmN < activeVehicle.odometer) {
    toast.error(`El kilometraje ingresado (${kmN} km) no puede ser inferior al actual (${activeVehicle.odometer} km).`);
    return;
  }
  setSaving(true);
  setErr("");
```

---

### Defecto D2: Eliminación de Pasarela Transaccional y Transición a Contacto Directo con Taller
* **Requisito Asociado:** RNF-03 (Regla R5).
* **Condición del Fallo:** Detectado en caso **T07**, al observar que la versión preliminar incluía una pasarela con simulación de tarjeta de crédito, lo cual contravenía el Art. 53 de la Ley 1480 de 2011 (portal de contacto) y arriesgaba responsabilidad solidaria por garantías mecánicas.
* **Corrección Aplicada:** En `src/components/motrick/Checkout.tsx` y `src/app/repuestos/page.tsx`, se retiró el formulario de pago y se implementó el modal de contacto directo que asigna el taller especializado en Cartagena según categoría y genera enlace pre-rellenado a WhatsApp y telefonía.

```tsx
// Enlace directo con taller en Cartagena
<a href={whatsappUrl} target="_blank" className="bg-success ...">
  <MessageCircle className="h-4 w-4" /> Contactar por WhatsApp
</a>
<a href={`tel:${cleanPhone}`}>
  <Phone className="h-3.5 w-3.5" /> Llamar al Taller
</a>
```

---

## 9.4. Simulación de Cambio y Pruebas de Regresión (Regla R6)

### Nueva Regla R6 (Verificación de Talleres Mecánicos - RF-05)
Permite a los talleres solicitar acreditación mediante formulario de datos fiscales (NIT/RUT, dirección física y teléfono), restringiendo la aprobación de la insignia únicamente al Administrador.

### Nuevas Pruebas de Frontera:
* **N01 (Válido):** Aprobación administrativa exitosa y renderizado de la insignia azul en `/directorio` $\rightarrow$ **Aceptada**.
* **N02 (Inválido / Seguridad):** Intento de mutación del estado `verificado` desde un cliente anónimo o no administrador $\rightarrow$ **Rechazada por política RLS en PostgreSQL**.

### Pruebas de Regresión:
Se reejecutaron **T04** (Filtros de directorio) y **T08** (Políticas RLS), comprobando que la inclusión del modal y badge de verificación no alteró las consultas relacionales previas ni degradó la seguridad de los registros existentes.

---

## 9.5. Revisión Cruzada y Decisión de Liberación

### Revisión por Pares (Peer Review)
* **Alejandro Paternina (AP):** Auditó y validó los casos de prueba y correcciones de Bitácora y Directorio (**T01 a T05, Defecto D1**) gestionados por Johan Brieva.
* **Johan Brieva (JF):** Auditó las pruebas y componentes de Repuestos y Contacto Directo con Talleres (**T06 a T08, Defecto D2**) a cargo de Alejandro Paternina.

### Declaración Formal de Liberación a Producción:
> *"El equipo de ingeniería aprueba unánimemente la liberación del MVP de Motrick a producción tras verificar y corregir los defectos D1 (validación de kilometraje mínimo en T02) y D2 (eliminación de pasarela financiera y transición a contacto directo con talleres en Cartagena en T07). El 100% de los casos de prueba iniciales (T01-T08), las pruebas de la regla de verificación (N01-N02) y las pruebas de regresión (T04, T08) operan satisfactoriamente sobre Next.js y el cluster de PostgreSQL en Supabase."*

---

## 9.6. Criterio de Verificación vs. Validación en Motrick

En el marco de la ingeniería de software y la rúbrica de aseguramiento de calidad del proyecto de aula, se formaliza la diferencia conceptual y práctica entre ambas actividades:

* **Verificación (*"¿Estamos construyendo el producto correctamente?"*):** Proceso de rigor técnico y verificación estricta contra especificaciones de diseño. En Motrick, se comprobó mediante:
  * El rechazo de violaciones de dominio en PostgreSQL (`CHECK (puntuacion >= 1 AND puntuacion <= 5)` con error `23514`).
  * El blindaje de mutaciones arbitrarias a nivel de motor SQL mediante políticas Row-Level Security (código `42501`).
  * La confirmación de orden cronológico en odómetros (guardas de control en `submit()` para `kmN >= activeVehicle.odometer`).
  * La eliminación de formularios financieros en resguardo del Art. 53 de la Ley 1480 y compilación limpia de Next.js sin errores de TypeScript.

* **Validación (*"¿Estamos construyendo el producto correcto?"*):** Proceso orientado al valor y satisfacción de las necesidades reales de los interesados identificados en la elicitación. En Motrick, se comprobó mediante:
  * La mitigación de la desconfianza estructural en talleres mecánicos (67% de conductores según AAA) mediante perfiles auditados, reseñas auténticas y verificación documental (RF-05).
  * La solución al temor del 53.1% de usuarios a compras incompatibles (ASOPARTES) mediante el catálogo filtrado por modelo vehicular exacto (RF-04).
  * La resolución a la falta de registro del 75.5% de conductores que no llevan historial o guardan facturas sueltas, proveyendo una bitácora técnica digital permanente (RF-01).
