-- ==============================================================================
-- Motrik - Script SQL Semilla (Seed Data) v1.0
-- Diseñado para ejecutarse en el SQL Editor de Supabase
-- Satisface: RNF-02 (Persistencia y Supabase), RF-01, RF-02, RF-03, RF-04
-- ==============================================================================

-- 1. Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Asegurar columnas de soporte para URLs estáticas de public/assets y metadatos
ALTER TABLE public.mecanicos ADD COLUMN IF NOT EXISTS foto_url text;
ALTER TABLE public.mecanicos ADD COLUMN IF NOT EXISTS telefono text;
ALTER TABLE public.mecanicos ADD COLUMN IF NOT EXISTS horario text;
ALTER TABLE public.mecanicos ADD COLUMN IF NOT EXISTS anos_experiencia integer;
ALTER TABLE public.mecanicos ADD COLUMN IF NOT EXISTS descripcion text;

ALTER TABLE public.repuestos ADD COLUMN IF NOT EXISTS imagen_url text;
ALTER TABLE public.repuestos ADD COLUMN IF NOT EXISTS marca text;
ALTER TABLE public.repuestos ADD COLUMN IF NOT EXISTS precio_anterior numeric(10, 2);
ALTER TABLE public.repuestos ADD COLUMN IF NOT EXISTS calificacion numeric(3, 2) DEFAULT 4.8;
ALTER TABLE public.repuestos ADD COLUMN IF NOT EXISTS resenas_count integer DEFAULT 45;
ALTER TABLE public.repuestos ADD COLUMN IF NOT EXISTS stock integer DEFAULT 20;
ALTER TABLE public.repuestos ADD COLUMN IF NOT EXISTS envio_gratis boolean DEFAULT true;

ALTER TABLE public.vehiculos ADD COLUMN IF NOT EXISTS placa text;
ALTER TABLE public.vehiculos ADD COLUMN IF NOT EXISTS kilometraje integer DEFAULT 45000;
ALTER TABLE public.vehiculos ADD COLUMN IF NOT EXISTS motor text;
ALTER TABLE public.vehiculos ADD COLUMN IF NOT EXISTS combustible text;
ALTER TABLE public.vehiculos ADD COLUMN IF NOT EXISTS transmision text;
ALTER TABLE public.vehiculos ADD COLUMN IF NOT EXISTS color text;
ALTER TABLE public.vehiculos ADD COLUMN IF NOT EXISTS imagen_url text;
ALTER TABLE public.vehiculos ADD COLUMN IF NOT EXISTS soat_vencimiento text;
ALTER TABLE public.vehiculos ADD COLUMN IF NOT EXISTS tecno_vencimiento text;

ALTER TABLE public.registros_bitacora ADD COLUMN IF NOT EXISTS titulo text;
ALTER TABLE public.registros_bitacora ADD COLUMN IF NOT EXISTS kilometraje integer;
ALTER TABLE public.registros_bitacora ADD COLUMN IF NOT EXISTS taller text;
ALTER TABLE public.registros_bitacora ADD COLUMN IF NOT EXISTS costo numeric(10, 2);

-- ==============================================================================
-- 3. Creación de usuarios base (auth.users y public.usuarios)
-- ==============================================================================

-- 3.1 Usuario Cliente Principal (Alejandro Paternina)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin
)
VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000000'::uuid,
  'authenticated', 'authenticated',
  'alejopaternina22@gmail.com',
  crypt('Motrik2026*', gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"nombre":"Alejandro Paternina"}',
  false
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.usuarios (id, nombre, correo, rol)
VALUES (
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'Alejandro Paternina',
  'alejopaternina22@gmail.com',
  'cliente'
)
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;

-- 3.2 Usuario Mecánico 1: Torque Automotriz
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
VALUES ('b0000000-0000-0000-0000-000000000001'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'torque@motrik.com', crypt('Motrik2026*', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"nombre":"Torque Automotriz"}', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.usuarios (id, nombre, correo, rol)
VALUES ('b0000000-0000-0000-0000-000000000001'::uuid, 'Torque Automotriz', 'torque@motrik.com', 'mecanico')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;

-- 3.3 Usuario Mecánico 2: MotorLab Diagnóstico
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
VALUES ('b0000000-0000-0000-0000-000000000002'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'motorlab@motrik.com', crypt('Motrik2026*', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"nombre":"MotorLab Diagnóstico"}', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.usuarios (id, nombre, correo, rol)
VALUES ('b0000000-0000-0000-0000-000000000002'::uuid, 'MotorLab Diagnóstico', 'motorlab@motrik.com', 'mecanico')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;

-- 3.4 Usuario Mecánico 3: Frenos & Ejes del Norte
INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
VALUES ('b0000000-0000-0000-0000-000000000003'::uuid, '00000000-0000-0000-0000-000000000000'::uuid, 'authenticated', 'authenticated', 'frenosejes@motrik.com', crypt('Motrik2026*', gen_salt('bf')), now(), now(), now(), '{"provider":"email","providers":["email"]}', '{"nombre":"Frenos & Ejes del Norte"}', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.usuarios (id, nombre, correo, rol)
VALUES ('b0000000-0000-0000-0000-000000000003'::uuid, 'Frenos & Ejes del Norte', 'frenosejes@motrik.com', 'mecanico')
ON CONFLICT (id) DO UPDATE SET nombre = EXCLUDED.nombre;

-- ==============================================================================
-- 4. Semilla de Mecánicos (public.mecanicos)
-- ==============================================================================
INSERT INTO public.mecanicos (id, especialidad, ubicacion, calificacion_promedio, foto_url, telefono, horario, anos_experiencia, descripcion)
VALUES
(
  'b0000000-0000-0000-0000-000000000001'::uuid,
  'Frenos, Suspensión, Mantenimiento preventivo',
  'Chapinero · Carrera 13 #54-21',
  4.9,
  '/assets/shop.jpg',
  '+57 601 345 7788',
  'Lun–Sáb 7:00–18:00',
  14,
  'Taller especializado en vehículos japoneses y livianos con equipos de diagnóstico de concesionario.'
),
(
  'b0000000-0000-0000-0000-000000000002'::uuid,
  'Motor, Eléctrico, Mantenimiento preventivo',
  'Usaquén · Calle 140 #9-45',
  4.8,
  '/assets/engine.jpg',
  '+57 601 612 0091',
  'Lun–Vie 8:00–18:00',
  9,
  'Diagnóstico electrónico avanzado, escaneo computarizado, inyección y reparación general de motores.'
),
(
  'b0000000-0000-0000-0000-000000000003'::uuid,
  'Frenos, Suspensión',
  'Suba · Av Suba #118-30',
  4.6,
  '/assets/wheel.jpg',
  '+57 601 477 2310',
  'Lun–Sáb 8:00–17:00',
  6,
  'Alineación computarizada 3D, balanceo de rines y reconstrucción de sistemas de frenado.'
)
ON CONFLICT (id) DO UPDATE SET
  especialidad = EXCLUDED.especialidad,
  ubicacion = EXCLUDED.ubicacion,
  calificacion_promedio = EXCLUDED.calificacion_promedio,
  foto_url = EXCLUDED.foto_url;

-- ==============================================================================
-- 5. Semilla de Valoraciones (public.valoraciones)
-- ==============================================================================
INSERT INTO public.valoraciones (puntuacion, comentario, fecha, cliente_id, mecanico_id)
VALUES
(5, 'Diagnóstico transparente y entrega puntual. Muy recomendado.', now() - interval '10 days', 'a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid),
(5, 'Cambiaron las pastillas de freno en tiempo récord. Todo excelente.', now() - interval '25 days', 'a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000001'::uuid),
(4, 'Buen servicio con el motor, revisaron bobinas e inyectores sin sobrecostos.', now() - interval '14 days', 'a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000002'::uuid),
(5, 'Excelente alineación y balanceo en Suba. Muy atentos.', now() - interval '30 days', 'a0000000-0000-0000-0000-000000000001'::uuid, 'b0000000-0000-0000-0000-000000000003'::uuid);

-- ==============================================================================
-- 6. Semilla de Repuestos (public.repuestos)
-- ==============================================================================
INSERT INTO public.repuestos (nombre, categoria_vehiculo, precio, compatibilidad, imagen_url, marca, precio_anterior, calificacion, resenas_count, stock, envio_gratis)
VALUES
(
  'Pastillas de freno cerámicas delanteras',
  'Frenos',
  289000.00,
  'Mazda 3 (2018-2023), CX-30 (2020-2023)',
  '/assets/brake.jpg',
  'Brembo',
  340000.00,
  4.9,
  412,
  24,
  true
),
(
  'Aceite sintético 5W-30 (4 Litros)',
  'Lubricantes',
  189900.00,
  'Mazda 3, Toyota Corolla, Kia Rio, Universal',
  '/assets/oil.jpg',
  'Mobil 1',
  NULL,
  4.9,
  1290,
  80,
  true
),
(
  'Batería 12V 60Ah libre de mantenimiento',
  'Eléctrico',
  465000.00,
  'Mazda 3, Chevrolet Tracker, Renault Duster',
  '/assets/battery.jpg',
  'MAC Gold',
  520000.00,
  4.8,
  540,
  18,
  true
),
(
  'Amortiguador delantero a gas presurizado',
  'Suspensión',
  412000.00,
  'Toyota Hilux (2017-2023), Fortuner',
  '/assets/disc.jpg',
  'Monroe Gas-Magnum',
  NULL,
  4.6,
  198,
  8,
  false
),
(
  'Kit de bujías de iridio de alto rendimiento (x4)',
  'Motor',
  236000.00,
  'Mazda 3, Toyota Corolla, Ford Escape',
  '/assets/engine.jpg',
  'NGK Laser Iridium',
  NULL,
  4.9,
  702,
  35,
  true
),
(
  'Filtro de aire de alto flujo para motor',
  'Filtros',
  72000.00,
  'Chevrolet Onix, Kia Picanto, Universal',
  '/assets/engine.jpg',
  'Mann-Filter',
  NULL,
  4.7,
  315,
  50,
  false
);

-- ==============================================================================
-- 7. Semilla de Vehículos (public.vehiculos)
-- ==============================================================================
INSERT INTO public.vehiculos (marca, modelo, ano, usuario_id, placa, kilometraje, motor, combustible, transmision, color, imagen_url, soat_vencimiento, tecno_vencimiento)
VALUES
(
  'Mazda',
  'Mazda 3',
  2021,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'KDM-482',
  48230,
  '2.0L Skyactiv-G',
  'Gasolina',
  'Automática 6V',
  'Gris Machine',
  '/assets/car1.jpg',
  '2026-11-15',
  '2027-03-20'
),
(
  'Toyota',
  'Hilux',
  2019,
  'a0000000-0000-0000-0000-000000000001'::uuid,
  'JTX-917',
  112450,
  '2.4L Diésel 2GD',
  'Diésel',
  'Manual 6V',
  'Blanco Perlado',
  '/assets/car2.jpg',
  '2026-10-30',
  '2026-11-05'
);

-- ==============================================================================
-- 8. Semilla de Registros de Bitácora (public.registros_bitacora)
-- ==============================================================================
-- Insertar registros vinculados al primer vehículo (Mazda 3)
INSERT INTO public.registros_bitacora (fecha, descripcion_cambio, pieza_actualizada, vehiculo_id, repuesto_id, titulo, kilometraje, taller, costo)
SELECT
  now() - interval '45 days',
  'Cambio de aceite 5W-30 y filtro de aceite. Revisión general de niveles. [Taller: Torque Automotriz | Km: 47800 | Costo: $285000]',
  'Aceite sintético 5W-30 (4L) · Mobil 1',
  v.id,
  (SELECT id FROM public.repuestos WHERE nombre ILIKE '%Aceite%' LIMIT 1),
  'Cambio de aceite sintético',
  47800,
  'Torque Automotriz',
  285000.00
FROM public.vehiculos v WHERE v.placa = 'KDM-482' LIMIT 1;

INSERT INTO public.registros_bitacora (fecha, descripcion_cambio, pieza_actualizada, vehiculo_id, repuesto_id, titulo, kilometraje, taller, costo)
SELECT
  now() - interval '140 days',
  'Instalación de pastillas delanteras cerámicas y rectificado de discos. [Taller: Frenos & Ejes del Norte | Km: 41250 | Costo: $420000]',
  'Pastillas de freno cerámicas · Brembo',
  v.id,
  (SELECT id FROM public.repuestos WHERE nombre ILIKE '%Pastillas%' LIMIT 1),
  'Cambio de pastillas de freno',
  41250,
  'Frenos & Ejes del Norte',
  420000.00
FROM public.vehiculos v WHERE v.placa = 'KDM-482' LIMIT 1;

-- ==============================================================================
-- 9. Políticas RLS para catálogo, directorio y bitácora
-- ==============================================================================

-- Catálogo de repuestos accesible para lectura general
DROP POLICY IF EXISTS repuestos_read_all ON public.repuestos;
CREATE POLICY repuestos_read_all ON public.repuestos FOR SELECT TO anon, authenticated USING (true);

-- Directorio de mecánicos accesible para lectura general
DROP POLICY IF EXISTS mecanicos_read_all ON public.mecanicos;
CREATE POLICY mecanicos_read_all ON public.mecanicos FOR SELECT TO anon, authenticated USING (true);

-- Perfiles de mecánicos accesibles en la tabla usuarios
DROP POLICY IF EXISTS usuarios_read_mecanicos ON public.usuarios;
CREATE POLICY usuarios_read_mecanicos ON public.usuarios FOR SELECT TO anon, authenticated USING (rol = 'mecanico' OR id = auth.uid());

-- Valoraciones accesibles para lectura e inserción
DROP POLICY IF EXISTS valoraciones_read_all ON public.valoraciones;
CREATE POLICY valoraciones_read_all ON public.valoraciones FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS valoraciones_anon_insert ON public.valoraciones;
CREATE POLICY valoraciones_anon_insert ON public.valoraciones FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Políticas RLS para vehículos y registros de bitácora
DROP POLICY IF EXISTS vehiculos_anon_read ON public.vehiculos;
CREATE POLICY vehiculos_anon_read ON public.vehiculos FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS registros_bitacora_anon_read ON public.registros_bitacora;
CREATE POLICY registros_bitacora_anon_read ON public.registros_bitacora FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS registros_bitacora_anon_insert ON public.registros_bitacora;
CREATE POLICY registros_bitacora_anon_insert ON public.registros_bitacora FOR INSERT TO anon, authenticated WITH CHECK (true);
