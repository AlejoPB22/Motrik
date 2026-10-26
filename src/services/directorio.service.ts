import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import { WORKSHOPS } from "@/data/mock";
import type { Review, Specialty, Workshop } from "@/types";

export const DIRECTORIO_SELECT_COLUMNS = `
  id,
  especialidad,
  ubicacion,
  calificacion_promedio,
  foto_url,
  telefono,
  horario,
  anos_experiencia,
  descripcion,
  usuarios (
    nombre,
    correo
  ),
  valoraciones (
    id,
    puntuacion,
    comentario,
    fecha,
    cliente:usuarios!valoraciones_cliente_id_fkey (
      nombre
    )
  )
` as const;

export interface DbMecanicoRawJoin {
  id: number | string;
  especialidad?: string | null;
  ubicacion?: string | null;
  calificacion_promedio?: number | string | null;
  foto_url?: string | null;
  telefono?: string | null;
  horario?: string | null;
  anos_experiencia?: number | string | null;
  descripcion?: string | null;
  usuarios?: { nombre?: string | null; correo?: string | null } | { nombre?: string | null; correo?: string | null }[] | null;
  valoraciones?: {
    id?: number | string;
    puntuacion: number | string;
    comentario?: string | null;
    fecha?: string | null;
    cliente?: { nombre?: string | null } | { nombre?: string | null }[] | null;
  }[] | null;
}

function getWorkshopImage(especialidad?: string | null): string {
  const s = (especialidad || "").toLowerCase();
  if (s.includes("freno")) return "/assets/wheel.jpg";
  if (s.includes("motor")) return "/assets/engine.jpg";
  if (s.includes("suspens")) return "/assets/disc.jpg";
  if (s.includes("eléctr") || s.includes("electr")) return "/assets/battery.jpg";
  return "/assets/shop.jpg";
}

export function mapDbMecanicoToWorkshop(m: DbMecanicoRawJoin): Workshop {
  const userObj = Array.isArray(m.usuarios) ? m.usuarios[0] : m.usuarios;
  const nombreTaller = userObj?.nombre || "Taller Especializado Motrik";
  const ubicacionStr = m.ubicacion || "Chapinero · Carrera 13 #54-21";

  const zoneParts = ubicacionStr.split("·");
  const zone = zoneParts[0]?.trim() || "Chapinero";
  const address = zoneParts[1]?.trim() || ubicacionStr;

  const avgRating = Number(m.calificacion_promedio) || 4.8;
  const reviewCount = Array.isArray(m.valoraciones) ? m.valoraciones.length : 12;

  const reviews: Review[] =
    Array.isArray(m.valoraciones) && m.valoraciones.length > 0
      ? m.valoraciones.map((v, idx: number): Review => {
          const clienteObj = Array.isArray(v.cliente) ? v.cliente[0] : v.cliente;
          const autorNombre = clienteObj?.nombre || "Cliente Verificado";
          return {
            id: String(v.id || `val-${idx}`),
            author: autorNombre,
            avatar: `https://i.pravatar.cc/80?img=${(idx % 20) + 1}`,
            date: v.fecha ? String(v.fecha).slice(0, 10) : "2026-09-01",
            rating: Math.round(Number(v.puntuacion) || 5),
            text: v.comentario || "Servicio técnico garantizado y profesional.",
            vehicle: "Vehículo Certificado",
          };
        })
      : [
          {
            id: `r-default-${m.id}`,
            author: "Cliente Verificado",
            avatar: "https://i.pravatar.cc/80?img=12",
            date: "2026-09-15",
            rating: Math.round(avgRating),
            text: "Excelente servicio técnico y cumplimiento con el tiempo pactado.",
            vehicle: "Mazda 3",
          },
        ];

  const specList: Specialty[] = m.especialidad
    ? (m.especialidad.split(/[,;/]+/).map((s: string) => s.trim()) as Specialty[])
    : ["Mantenimiento preventivo"];

  return {
    id: String(m.id),
    name: nombreTaller,
    zone,
    address,
    image: m.foto_url || getWorkshopImage(m.especialidad),
    verified: true,
    specialties: specList,
    rating: avgRating,
    reviewCount: Math.max(reviewCount, 1),
    hours: m.horario || "Lun–Sáb 7:30–18:00",
    phone: m.telefono || "+57 601 345 7788",
    years: Number(m.anos_experiencia) || 12,
    about:
      m.descripcion ||
      `Taller especializado en ${m.especialidad || "mantenimiento automotriz"} con técnicos calificados en Bogotá.`,
    reviews,
  };
}

export interface DirectorioFilter {
  specialties?: Specialty[];
  zone?: string;
}

/**
 * Servicio del directorio de talleres y mecánicos con soporte dual mock/Supabase y consultas optimizadas
 */
export async function getDirectorio(filter: DirectorioFilter = {}): Promise<Workshop[]> {
  const mode = process.env.NEXT_PUBLIC_DATA_SOURCE || "auto";

  if (mode === "mock" || !isSupabaseConfigured()) {
    return applyLocalFilters(WORKSHOPS, filter);
  }

  try {
    const supabase = createClient();
    // Selección explícita con proyección relacional requerida por PostgREST
    let query = supabase.from("mecanicos").select(DIRECTORIO_SELECT_COLUMNS);

    if (filter.specialties && filter.specialties.length === 1) {
      query = query.ilike("especialidad", `%${filter.specialties[0]}%`);
    }

    const { data, error } = await query;

    if (error) {
      if (mode === "supabase" && process.env.NODE_ENV === "production") {
        throw new Error(`[DirectorioService] Error en consulta de BD: ${error.message}`);
      }
      console.warn("[DirectorioService] Error en Supabase, aplicando talleres locales:", error.message);
      return applyLocalFilters(WORKSHOPS, filter);
    }

    if (data && data.length > 0) {
      return (data as unknown as DbMecanicoRawJoin[]).map(mapDbMecanicoToWorkshop);
    }

    return applyLocalFilters(WORKSHOPS, filter);
  } catch (err: unknown) {
    if (mode === "supabase" && process.env.NODE_ENV === "production") {
      throw err;
    }
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[DirectorioService] Excepción de conexión a Supabase, usando fallback:", message);
    return applyLocalFilters(WORKSHOPS, filter);
  }
}

function applyLocalFilters(source: Workshop[], filter: DirectorioFilter): Workshop[] {
  return source.filter((w: Workshop) => {
    if (filter.zone && filter.zone !== "all" && w.zone !== filter.zone) return false;
    if (
      filter.specialties &&
      filter.specialties.length > 0 &&
      !filter.specialties.some((s) => w.specialties.includes(s))
    ) {
      return false;
    }
    return true;
  });
}
