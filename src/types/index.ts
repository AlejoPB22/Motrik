export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  // contrasena: string; // Generally not exposed to the client
}

export interface Cliente extends Usuario {
  // Propiedades específicas de cliente
}

export interface Mecanico extends Usuario {
  especialidad: string;
  ubicacion: string;
  calificacion_promedio: number;
}

export interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  ano: number;
  cliente_id: number; // Foráneo
}

export interface Valoracion {
  id: number;
  puntuacion: number;
  comentario: string;
  fecha: Date;
  mecanico_id: number; // Foráneo
  cliente_id: number; // Foráneo
}

export interface Repuesto {
  id: number;
  nombre: string;
  categoria_vehiculo: string;
  precio: number;
  compatibilidad: string; // Puede ser un string o array de strings
}

export interface RegistroBitacora {
  id: number;
  fecha: Date;
  descripcion_cambio: string;
  pieza_actualizada: string;
  vehiculo_id: number; // Foráneo
  repuesto_id?: number; // Opcional, Foráneo
}
