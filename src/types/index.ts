export type RolUsuario = 'cliente' | 'mecanico' | 'admin';

export interface Usuario {
  id: string; // uuid
  nombre: string;
  correo: string;
  rol: RolUsuario;
  created_at: string;
  // contrasena: string; // Generally not exposed to the client
}

// Mecánico extiende los atributos base de un usuario (cuando rol === 'mecanico')
export interface Mecanico extends Usuario {
  especialidad: string | null;
  ubicacion: string | null;
  calificacion_promedio: number;
}

export interface Vehiculo {
  id: number; // bigint identity
  marca: string;
  modelo: string;
  ano: number;
  usuario_id: string; // Foráneo -> Usuario.id (uuid)
}

export interface Valoracion {
  id: number; // bigint identity
  puntuacion: number;
  comentario: string | null;
  fecha: string;
  cliente_id: string; // Foráneo -> Usuario.id (uuid)
  mecanico_id: string; // Foráneo -> Mecanico.id (uuid)
}

export interface Repuesto {
  id: number; // bigint identity
  nombre: string;
  categoria_vehiculo: string;
  precio: number;
  compatibilidad: string; // Puede ser un string o array de strings
}

export interface RegistroBitacora {
  id: number; // bigint identity
  fecha: string;
  descripcion_cambio: string;
  pieza_actualizada: string | null;
  vehiculo_id: number; // Foráneo -> Vehiculo.id (bigint)
  repuesto_id: number | null; // Opcional, Foráneo -> Repuesto.id (bigint)
}
