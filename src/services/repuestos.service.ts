import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import { CATALOG, PARTS, type Brand, type Category, type Part } from "@/data/mock";
import type { DbRepuesto } from "@/types";

function getPartFallbackImage(category: string): string {
  const c = (category || "").toLowerCase();
  if (c.includes("freno")) return "/assets/brake.jpg";
  if (c.includes("aceite") || c.includes("lubricante")) return "/assets/oil.jpg";
  if (c.includes("bater") || c.includes("eléctr") || c.includes("electr")) return "/assets/battery.jpg";
  if (c.includes("suspens")) return "/assets/disc.jpg";
  if (c.includes("filtro")) return "/assets/engine.jpg";
  return "/assets/engine.jpg";
}

export function parseDbFits(compatText: string): { brand: Brand; model: string; years: number[] }[] {
  if (!compatText) return [];
  const results: { brand: Brand; model: string; years: number[] }[] = [];
  const brands: Brand[] = ["Toyota", "Mazda", "Chevrolet", "Ford", "Renault", "Kia"];
  const lower = compatText.toLowerCase();

  for (const b of brands) {
    if (lower.includes(b.toLowerCase())) {
      const models = Object.keys(CATALOG[b] || {});
      let matched = false;
      for (const m of models) {
        if (lower.includes(m.toLowerCase())) {
          results.push({
            brand: b,
            model: m,
            years: CATALOG[b][m] || [2018, 2019, 2020, 2021, 2022, 2023],
          });
          matched = true;
        }
      }
      if (!matched && models[0]) {
        results.push({
          brand: b,
          model: models[0],
          years: CATALOG[b][models[0]] || [2018, 2019, 2020, 2021, 2022, 2023],
        });
      }
    }
  }

  if (results.length === 0 && lower.includes("universal")) {
    for (const b of brands) {
      for (const m of Object.keys(CATALOG[b])) {
        results.push({ brand: b, model: m, years: CATALOG[b][m] });
      }
    }
  }
  return results;
}

export function mapDbRepuestoToPart(item: DbRepuesto): Part {
  const category = (item.categoria_vehiculo || "Motor") as Category;
  const image = item.imagen_url || getPartFallbackImage(category);
  const compat = String(item.compatibilidad || "Universal");
  const fits = parseDbFits(compat);

  return {
    id: String(item.id),
    name: item.nombre || "Repuesto Automotriz",
    brand: item.marca || "Original OEM",
    category,
    price: Number(item.precio) || 0,
    oldPrice: item.precio_anterior ? Number(item.precio_anterior) : undefined,
    rating: Number(item.calificacion) || 4.8,
    reviews: Number(item.resenas_count) || 85,
    stock: Number(item.stock) || 15,
    images: item.imagenes ? (Array.isArray(item.imagenes) ? item.imagenes : [item.imagenes]) : [image],
    fits,
    specs:
      typeof item.especificaciones === "object" && item.especificaciones !== null
        ? item.especificaciones
        : { Compatibilidad: compat, "Categoría Vehicular": category, Garantía: "12 meses" },
    freeShipping: item.envio_gratis ?? Number(item.precio) >= 150000,
  };
}

export interface RepuestosFilter {
  category?: string;
  model?: string;
  onlyFit?: boolean;
}

/**
 * Servicio de catálogo de repuestos con soporte de fallback mock e integración a Supabase
 */
export async function getRepuestos(filter: RepuestosFilter = {}): Promise<Part[]> {
  const mode = process.env.NEXT_PUBLIC_DATA_SOURCE || "auto";

  // Modo mock forzado
  if (mode === "mock" || !isSupabaseConfigured()) {
    return applyLocalFilters(PARTS, filter);
  }

  try {
    const supabase = createClient();
    let query = supabase.from("repuestos").select("*");

    if (filter.category) {
      query = query.ilike("categoria_vehiculo", `%${filter.category}%`);
    }

    if (filter.onlyFit && filter.model) {
      query = query.or(`compatibilidad.ilike.%${filter.model}%,compatibilidad.ilike.%Universal%`);
    }

    const { data, error } = await query;

    if (error) {
      if (mode === "supabase" && process.env.NODE_ENV === "production") {
        throw new Error(`[RepuestosService] Error en consulta de BD: ${error.message}`);
      }
      console.warn("[RepuestosService] Error al consultar Supabase, usando catálogo local:", error.message);
      return applyLocalFilters(PARTS, filter);
    }

    if (data && data.length > 0) {
      return (data as DbRepuesto[]).map(mapDbRepuestoToPart);
    }

    // Si filtró y no hubo coincidencias en BD, retorna vacío
    if (filter.category || (filter.onlyFit && filter.model)) {
      return [];
    }

    return PARTS;
  } catch (err) {
    if (mode === "supabase" && process.env.NODE_ENV === "production") {
      throw err;
    }
    console.warn("[RepuestosService] Excepción de conexión a Supabase, aplicando fallback local:", err);
    return applyLocalFilters(PARTS, filter);
  }
}

function applyLocalFilters(source: Part[], filter: RepuestosFilter): Part[] {
  return source.filter((p) => {
    if (filter.category && p.category !== filter.category) return false;
    return true;
  });
}

