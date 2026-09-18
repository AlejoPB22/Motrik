-- DDL Schema para Motrik (MVP)

-- 1. Usuarios / Perfiles
-- (Usualmente se vincula con auth.users, pero aquí definimos la estructura base requerida)
CREATE TABLE public.usuarios (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  nombre text NOT NULL,
  correo text NOT NULL UNIQUE,
  rol text CHECK (rol IN ('cliente', 'mecanico', 'admin')) DEFAULT 'cliente',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Clientes (Extiende Usuario)
CREATE TABLE public.clientes (
  id uuid REFERENCES public.usuarios(id) NOT NULL PRIMARY KEY
);

-- 3. Mecanicos (Extiende Usuario)
CREATE TABLE public.mecanicos (
  id uuid REFERENCES public.usuarios(id) NOT NULL PRIMARY KEY,
  especialidad text,
  ubicacion text,
  calificacion_promedio numeric(3, 2) DEFAULT 0.0
);

-- 4. Vehiculos
CREATE TABLE public.vehiculos (
  id serial PRIMARY KEY,
  marca text NOT NULL,
  modelo text NOT NULL,
  ano integer NOT NULL,
  cliente_id uuid REFERENCES public.clientes(id) ON DELETE CASCADE
);

-- 5. Valoraciones
CREATE TABLE public.valoraciones (
  id serial PRIMARY KEY,
  puntuacion integer CHECK (puntuacion >= 1 AND puntuacion <= 5) NOT NULL,
  comentario text,
  fecha timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  cliente_id uuid REFERENCES public.clientes(id) ON DELETE CASCADE,
  mecanico_id uuid REFERENCES public.mecanicos(id) ON DELETE CASCADE
);

-- 6. Repuestos
CREATE TABLE public.repuestos (
  id serial PRIMARY KEY,
  nombre text NOT NULL,
  categoria_vehiculo text NOT NULL,
  precio numeric(10, 2) NOT NULL,
  compatibilidad text NOT NULL
);

-- 7. Registros de Bitacora
CREATE TABLE public.registros_bitacora (
  id serial PRIMARY KEY,
  fecha timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  descripcion_cambio text NOT NULL,
  pieza_actualizada text,
  vehiculo_id integer REFERENCES public.vehiculos(id) ON DELETE CASCADE,
  repuesto_id integer REFERENCES public.repuestos(id) ON DELETE SET NULL
);

-- Políticas RLS Iniciales (Recomendadas)
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mecanicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valoraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repuestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_bitacora ENABLE ROW LEVEL SECURITY;

-- Nota: Para que el frontend acceda, debes crear políticas CREATE POLICY ...
