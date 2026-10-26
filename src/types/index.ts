// ==============================================================================
// MOTRIK - Definición Unificada de Tipos y Contratos de Dominio
// ==============================================================================

export type RolUsuario = 'cliente' | 'mecanico' | 'admin';

/** Entidad de base de datos: Usuario */
export interface Usuario {
  id: string; // uuid
  nombre: string;
  correo: string;
  rol: RolUsuario;
  created_at?: string;
}

/** Entidad de base de datos: Mecánico / Taller */
export interface DbMecanico {
  id: string | number;
  usuario_id?: string | null;
  especialidad?: string | null;
  ubicacion?: string | null;
  calificacion_promedio?: number | string | null;
  foto_url?: string | null;
  telefono?: string | null;
  horario?: string | null;
  anos_experiencia?: number | string | null;
  descripcion?: string | null;
  usuarios?: { nombre?: string | null; correo?: string | null } | { nombre?: string | null; correo?: string | null }[] | null;
  valoraciones?: DbValoracion[] | null;
}

/** Entidad de base de datos: Vehículo */
export interface DbVehiculo {
  id: number | string;
  usuario_id?: string | null;
  marca?: string | null;
  modelo?: string | null;
  ano?: number | string | null;
  placa?: string | null;
  kilometraje?: number | string | null;
  motor?: string | null;
  combustible?: string | null;
  transmision?: string | null;
  color?: string | null;
  imagen_url?: string | null;
  soat_vencimiento?: string | null;
  tecno_vencimiento?: string | null;
}

/** Entidad de base de datos: Valoración */
export interface DbValoracion {
  id?: number | string;
  mecanico_id?: string | number;
  cliente_id?: string;
  puntuacion: number | string;
  comentario?: string | null;
  fecha?: string | null;
  cliente?: { nombre?: string | null } | { nombre?: string | null }[] | null;
}

/** Entidad de base de datos: Repuesto */
export interface DbRepuesto {
  id: number | string;
  nombre?: string;
  marca?: string;
  categoria_vehiculo?: string;
  precio: number | string;
  precio_anterior?: number | string | null;
  calificacion?: number;
  resenas_count?: number;
  stock?: number;
  imagen_url?: string | null;
  imagenes?: string[] | null;
  compatibilidad?: string;
  especificaciones?: Record<string, string> | null;
  envio_gratis?: boolean | null;
}

/** Entidad de base de datos: Registro de Bitácora */
export interface DbRegistroBitacora {
  id?: number | string;
  vehiculo_id?: number | string | null;
  fecha?: string | null;
  descripcion_cambio?: string | null;
  pieza_actualizada?: string | null;
  repuesto_id?: number | string | null;
  titulo?: string | null;
  descripcion?: string | null;
  kilometraje?: number | string | null;
  taller?: string | null;
  costo?: number | string | null;
}

// ------------------------------------------------------------------------------
// Modelos de Frontend / UI
// ------------------------------------------------------------------------------

export type Brand = "Toyota" | "Mazda" | "Chevrolet" | "Ford" | "Renault" | "Kia";
export type Category = "Frenos" | "Motor" | "Suspensión" | "Eléctrico" | "Filtros" | "Lubricantes";
export type Specialty = "Frenos" | "Motor" | "Suspensión" | "Eléctrico" | "Mantenimiento preventivo";

export interface Part {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  stock: number;
  images: string[];
  fits: { brand: Brand; model: string; years: number[] }[];
  specs: Record<string, string>;
  freeShipping?: boolean;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  date: string;
  rating: number;
  text: string;
  vehicle: string;
}

export interface Workshop {
  id: string;
  name: string;
  zone: string;
  address: string;
  image: string;
  verified: boolean;
  specialties: Specialty[];
  rating: number;
  reviewCount: number;
  hours: string;
  phone: string;
  years: number;
  about: string;
  reviews: Review[];
}

export interface Vehicle {
  id: string;
  brand: Brand;
  model: string;
  year: number;
  plate: string;
  odometer: number;
  engine: string;
  fuel: string;
  transmission: string;
  color: string;
  image: string;
  soatExpiry?: string;
  tecnoExpiry?: string;
  hasTecno?: boolean;
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  date: string;
  km: number;
  title: string;
  description: string;
  workshop: string;
  cost: number;
  part?: string;
}

/** Configuración de origen de datos */
export type DataSourceMode = 'auto' | 'supabase' | 'mock';
