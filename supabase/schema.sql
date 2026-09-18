-- DDL Schema para Motrik (MVP) - v2

-- 1. Usuarios / Perfiles
-- (Usualmente se vincula con auth.users, pero aquí definimos la estructura base requerida)
CREATE TABLE public.usuarios (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  nombre text NOT NULL,
  correo text NOT NULL UNIQUE,
  rol text CHECK (rol IN ('cliente', 'mecanico', 'admin')) DEFAULT 'cliente',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Mecanicos (Atributos exclusivos)
CREATE TABLE public.mecanicos (
  id uuid REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL PRIMARY KEY,
  especialidad text,
  ubicacion text,
  calificacion_promedio numeric(3, 2) DEFAULT 0.00
);

-- 3. Vehiculos
CREATE TABLE public.vehiculos (
  id bigint generated always as identity primary key,
  marca text NOT NULL,
  modelo text NOT NULL,
  ano integer NOT NULL,
  usuario_id uuid REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL
);

CREATE INDEX vehiculos_usuario_id_idx ON public.vehiculos(usuario_id);

-- 4. Repuestos
CREATE TABLE public.repuestos (
  id bigint generated always as identity primary key,
  nombre text NOT NULL,
  categoria_vehiculo text NOT NULL,
  precio numeric(10, 2) NOT NULL,
  compatibilidad text NOT NULL
);

-- 5. Valoraciones
CREATE TABLE public.valoraciones (
  id bigint generated always as identity primary key,
  puntuacion integer CHECK (puntuacion >= 1 AND puntuacion <= 5) NOT NULL,
  comentario text,
  fecha timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  cliente_id uuid REFERENCES public.usuarios(id) ON DELETE CASCADE NOT NULL,
  mecanico_id uuid REFERENCES public.mecanicos(id) ON DELETE CASCADE NOT NULL
);

CREATE INDEX valoraciones_cliente_id_idx ON public.valoraciones(cliente_id);
CREATE INDEX valoraciones_mecanico_id_idx ON public.valoraciones(mecanico_id);

-- 6. Registros de Bitacora
CREATE TABLE public.registros_bitacora (
  id bigint generated always as identity primary key,
  fecha timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  descripcion_cambio text NOT NULL,
  pieza_actualizada text,
  vehiculo_id bigint REFERENCES public.vehiculos(id) ON DELETE CASCADE NOT NULL,
  repuesto_id bigint REFERENCES public.repuestos(id) ON DELETE SET NULL
);

CREATE INDEX registros_bitacora_vehiculo_id_idx ON public.registros_bitacora(vehiculo_id);
CREATE INDEX registros_bitacora_repuesto_id_idx ON public.registros_bitacora(repuesto_id);

-- Habilitar Row Level Security
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mecanicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repuestos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valoraciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_bitacora ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para Usuarios
-- Leer su propio perfil
CREATE POLICY usuarios_read_own ON public.usuarios
  FOR SELECT TO authenticated
  USING (id = auth.uid());

-- Admin puede leer todos
CREATE POLICY usuarios_read_admin ON public.usuarios
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND rol = 'admin'));

-- Políticas RLS para Mecanicos
-- Todos pueden leer mecánicos (Directorio)
CREATE POLICY mecanicos_read_all ON public.mecanicos
  FOR SELECT TO authenticated
  USING (true);

-- Mecánico puede actualizar su propio perfil
CREATE POLICY mecanicos_update_own ON public.mecanicos
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

-- Admin CRUD completo sobre mecánicos
CREATE POLICY mecanicos_all_admin ON public.mecanicos
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND rol = 'admin'));

-- Políticas RLS para Vehiculos
-- Usuario lee y gestiona sus propios vehículos
CREATE POLICY vehiculos_crud_own ON public.vehiculos
  FOR ALL TO authenticated
  USING (usuario_id = auth.uid());

-- Admin lee todos
CREATE POLICY vehiculos_read_admin ON public.vehiculos
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND rol = 'admin'));

-- Políticas RLS para Repuestos
-- Todos pueden leer el catálogo de repuestos
CREATE POLICY repuestos_read_all ON public.repuestos
  FOR SELECT TO authenticated
  USING (true);

-- Solo Admin puede hacer cambios en repuestos
CREATE POLICY repuestos_all_admin ON public.repuestos
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND rol = 'admin'));

-- Políticas RLS para Valoraciones
-- Todos pueden leer valoraciones
CREATE POLICY valoraciones_read_all ON public.valoraciones
  FOR SELECT TO authenticated
  USING (true);

-- Cliente puede crear valoraciones (y editar las suyas)
CREATE POLICY valoraciones_crud_own ON public.valoraciones
  FOR ALL TO authenticated
  USING (cliente_id = auth.uid());

-- Admin puede moderar (CRUD) todas las valoraciones
CREATE POLICY valoraciones_all_admin ON public.valoraciones
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND rol = 'admin'));

-- Políticas RLS para Registros de Bitacora
-- Usuario gestiona bitácora de sus vehículos
CREATE POLICY registros_bitacora_crud_own ON public.registros_bitacora
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.vehiculos v WHERE v.id = registros_bitacora.vehiculo_id AND v.usuario_id = auth.uid()));

-- Admin lee todas las bitácoras
CREATE POLICY registros_bitacora_read_admin ON public.registros_bitacora
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.usuarios WHERE id = auth.uid() AND rol = 'admin'));
