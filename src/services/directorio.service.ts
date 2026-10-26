import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import { WORKSHOPS, type Review, type Specialty, type Workshop } from "@/data/mock";
import type { DbMecanico, DbValoracion } from "@/types";

function getWorkshopImage(especialidad?: string | null): string {
  const s = (especialidad || "").toLowerCase();
  if (s.includes("freno")) return "/assets/wheel.jpg";
  if (s.includes("motor")) return "/assets/engine.jpg";
  if (s.includes("suspens")) return "/assets/disc.jpg";
  if (s.includes("eléctr") || s.includes("electr")) return "/assets/battery.jpg";
  return "/assets/shop.jpg";
}

export function mapDbMecanicoToWorkshop(m: DbMecanico): Workshop {
  const userObj = Array.isArray(m.usuarios) ? m.usuarios[0] : m.usuarios;
  const nombreTaller = userObj?.nombre || "Taller Especializado Motrick";
  const ubicacionStr = m.ubicacion || "Chapinero · Carrera 13 #54-21";

  const zoneParts = ubicacionStr.split("·");
  const zone = zoneParts[0]?.trim() || "Chapinero";
  const address = zoneParts[1]?.trim() || ubicacionStr;

  const avgRating = Number(m.calificacion_promedio) || 4.8;
  const reviewCount = Array.isArray(m.valoraciones) ? m.valoraciones.length : 12;

  const reviews: Review[] =
    Array.isArray(m.valoraciones) && m.valoraciones.length > 0
      ? m.valoraciones.map((v: DbValoracion, idx: number) => {
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
 * Servicio del directorio de talleres y mecánicos con soporte dual mock/Supabase
 */
export async function getDirectorio(filter: DirectorioFilter = {}): Promise<Workshop[]> {
  const mode = process.env.NEXT_PUBLIC_DATA_SOURCE || "auto";

  if (mode === "mock" || !isSupabaseConfigured()) {
    return applyLocalFilters(WORKSHOPS, filter);
  }

  try {
    const supabase = createClient();
    let query = supabase.from("mecanicos").select(`
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
    `);

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
      return (data as unknown as DbMecanico[]).map(mapDbMecanicoToWorkshop);
    }

    return applyLocalFilters(WORKSHOPS, filter);
  } catch (err) {
    if (mode === "supabase" && process.env.NODE_ENV === "production") {
      throw err;
    }
    console.warn("[DirectorioService] Excepción de conexión a Supabase, usando fallback:", err);
    return applyLocalFilters(WORKSHOPS, filter);
  }
}

function applyLocalFilters(source: Workshop[], filter: DirectorioFilter): Workshop[] {
  return source.filter((w) => {
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

