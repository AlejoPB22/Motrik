import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import { USER_VEHICLES, RECORDS } from "@/data/mock";
import type { Brand, DbRegistroBitacora, DbVehiculo, MaintenanceRecord, Vehicle } from "@/types";

export const VEHICULOS_SELECT_COLUMNS =
  "id, usuario_id, marca, modelo, ano, placa, kilometraje, motor, combustible, transmision, color, imagen_url, soat_vencimiento, tecno_vencimiento" as const;

export const REGISTROS_BITACORA_SELECT_COLUMNS =
  "id, vehiculo_id, fecha, descripcion_cambio, pieza_actualizada, repuesto_id, titulo, descripcion, kilometraje, taller, costo" as const;

export function parseDbRecord(r: DbRegistroBitacora, currentVehicles: Vehicle[]): MaintenanceRecord {
  const rawDesc = String(r.descripcion_cambio || "");
  let title = r.titulo || "";
  let description = r.descripcion || "";
  let workshop = r.taller || "Torque Automotriz";
  let odometerKm = Number(r.kilometraje) || 45000;
  let cost = Number(r.costo) || 0;

  // Extracción de metadatos de formato plano si existen
  const bracketMatch = rawDesc.match(/\[(.*?)\]/);
  let cleanText = rawDesc;
  if (bracketMatch) {
    cleanText = rawDesc.replace(bracketMatch[0], "").trim();
    const meta = bracketMatch[1];
    const tallerM = meta?.match(/Taller:\s*([^|]+)/);
    if (tallerM && tallerM[1]) workshop = tallerM[1].trim();
    const kmM = meta?.match(/Km:\s*(\d+)/);
    if (kmM && kmM[1]) odometerKm = Number(kmM[1]);
    const costM = meta?.match(/Costo:\s*\$?(\d+)/);
    if (costM && costM[1]) cost = Number(costM[1]);
  }

  if (!title) {
    if (cleanText.includes("—")) {
      const parts = cleanText.split("—");
      title = parts[0]?.trim() || "Mantenimiento General";
      description = parts.slice(1).join("—").trim();
    } else if (cleanText.includes(":")) {
      const parts = cleanText.split(":");
      title = parts[0]?.trim() || "Mantenimiento General";
      description = parts.slice(1).join(":").trim();
    } else {
      title = cleanText || "Mantenimiento General";
      description = "Mantenimiento preventivo completado.";
    }
  }

  const vId = String(r.vehiculo_id);
  const matchedV = currentVehicles.find((v) => v.id === vId || String(v.id) === String(r.vehiculo_id));
  const finalVehicleId = matchedV ? matchedV.id : currentVehicles[0]?.id || "v1";

  return {
    id: String(r.id),
    vehicleId: finalVehicleId,
    date: r.fecha ? String(r.fecha).slice(0, 10) : new Date().toISOString().slice(0, 10),
    km: odometerKm,
    title,
    description: description || "Inspección técnica y ajustes del fabricante.",
    workshop,
    cost,
    part: r.pieza_actualizada || undefined,
  };
}

/**
 * Obtiene los vehículos del garaje virtual con columnas explícitas
 */
export async function getVehiculos(): Promise<Vehicle[]> {
  const mode = process.env.NEXT_PUBLIC_DATA_SOURCE || "auto";

  if (mode === "mock" || !isSupabaseConfigured()) {
    return USER_VEHICLES;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("vehiculos")
      .select(VEHICULOS_SELECT_COLUMNS)
      .order("id", { ascending: true });

    if (error) {
      if (mode === "supabase" && process.env.NODE_ENV === "production") {
        throw new Error(`[BitacoraService] Error al consultar vehículos: ${error.message}`);
      }
      console.warn("[BitacoraService] Error en Supabase, usando vehículos mock:", error.message);
      return USER_VEHICLES;
    }

    if (data && data.length > 0) {
      // Deduplicar vehículos por placa única
      const seenPlates = new Set<string>();
      const uniqueData = (data as DbVehiculo[]).filter((v) => {
        const plate = (v.placa || "").trim().toUpperCase();
        if (!plate || seenPlates.has(plate)) return false;
        seenPlates.add(plate);
        return true;
      });

      return uniqueData.map((v): Vehicle => {
        let sExpiry = v.soat_vencimiento || "2026-11-15";
        let tExpiry = v.tecno_vencimiento || "2027-03-20";
        let hTecno = true;

        try {
          const stored = typeof window !== "undefined" ? localStorage.getItem("motrik_vehicles_docs") : null;
          if (stored) {
            const map = JSON.parse(stored);
            if (map[String(v.id)]) {
              if (map[String(v.id)].soatExpiry !== undefined) sExpiry = map[String(v.id)].soatExpiry;
              if (map[String(v.id)].tecnoExpiry !== undefined) tExpiry = map[String(v.id)].tecnoExpiry;
              if (map[String(v.id)].hasTecno !== undefined) hTecno = map[String(v.id)].hasTecno;
            }
          }
        } catch (e) {
          console.warn("[BitacoraService] Error rehidratando documentos:", e);
        }

        return {
          id: String(v.id),
          brand: (v.marca || "Toyota") as Brand,
          model: v.modelo || "Vehículo",
          year: Number(v.ano) || 2022,
          plate: v.placa || `COL-${String(v.id).padStart(3, "0")}`,
          odometer: Number(v.kilometraje) || 48230,
          engine: v.motor || "2.0L Skyactiv-G",
          fuel: v.combustible || "Gasolina",
          transmission: v.transmision || "Automática 6V",
          color: v.color || "Gris Machine",
          image:
            v.imagen_url ||
            (String(v.marca).toLowerCase().includes("toyota") ? "/assets/car2.jpg" : "/assets/car1.jpg"),
          soatExpiry: sExpiry,
          tecnoExpiry: tExpiry,
          hasTecno: hTecno,
        };
      });
    }

    return USER_VEHICLES;
  } catch (err: unknown) {
    if (mode === "supabase" && process.env.NODE_ENV === "production") {
      throw err;
    }
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[BitacoraService] Fallback local para vehículos:", message);
    return USER_VEHICLES;
  }
}

/**
 * Obtiene los registros de mantenimiento de la bitácora con columnas optimizadas
 */
export async function getRegistrosBitacora(currentVehicles: Vehicle[]): Promise<MaintenanceRecord[]> {
  const mode = process.env.NEXT_PUBLIC_DATA_SOURCE || "auto";

  if (mode === "mock" || !isSupabaseConfigured()) {
    return RECORDS;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("registros_bitacora")
      .select(REGISTROS_BITACORA_SELECT_COLUMNS)
      .order("fecha", { ascending: false });

    if (error) {
      if (mode === "supabase" && process.env.NODE_ENV === "production") {
        throw new Error(`[BitacoraService] Error al consultar bitácora: ${error.message}`);
      }
      console.warn("[BitacoraService] Error en Supabase, usando registros mock:", error.message);
      return RECORDS;
    }

    if (data && data.length > 0) {
      // Deduplicar registros de bitácora
      const seenRecords = new Set<string>();
      const uniqueRecords = (data as DbRegistroBitacora[]).filter((r) => {
        const key = `${r.vehiculo_id}-${r.titulo}-${r.fecha}-${r.kilometraje}`;
        if (seenRecords.has(key)) return false;
        seenRecords.add(key);
        return true;
      });
      return uniqueRecords.map((r) => parseDbRecord(r, currentVehicles));
    }

    return RECORDS;
  } catch (err: unknown) {
    if (mode === "supabase" && process.env.NODE_ENV === "production") {
      throw err;
    }
    const message = err instanceof Error ? err.message : String(err);
    console.warn("[BitacoraService] Fallback local para bitácora:", message);
    return RECORDS;
  }
}

/**
 * Guarda las fechas de SOAT y Tecnomecánica de forma persistente
 */
export async function saveVehiculoDocs(
  vehicleId: string,
  data: { soatExpiry?: string; tecnoExpiry?: string; hasTecno?: boolean }
): Promise<void> {
  // 1. Persistencia inmediata en localStorage
  try {
    const stored = typeof window !== "undefined" ? localStorage.getItem("motrik_vehicles_docs") : null;
    const map = stored ? JSON.parse(stored) : {};
    map[vehicleId] = { ...(map[vehicleId] || {}), ...data };
    if (typeof window !== "undefined") {
      localStorage.setItem("motrik_vehicles_docs", JSON.stringify(map));
    }
  } catch (e) {
    console.warn("[BitacoraService] Error al guardar en localStorage:", e);
  }

  // 2. Persistencia en Supabase si está disponible
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const numId = Number(vehicleId);
      if (!isNaN(numId)) {
        await supabase
          .from("vehiculos")
          .update({
            soat_vencimiento: data.soatExpiry,
            tecno_vencimiento: data.tecnoExpiry,
          })
          .eq("id", numId);
      }
    } catch (e) {
      console.warn("[BitacoraService] Error al actualizar documentos en Supabase:", e);
    }
  }
}

/**
 * Guarda un registro de mantenimiento (en Supabase si está disponible, o en memoria)
 */
export async function saveRegistroBitacora(
  record: Omit<MaintenanceRecord, "id">,
  numVehiculoId: number
): Promise<{ record: MaintenanceRecord; persistedInDb: boolean }> {
  let createdId = `m${Date.now()}`;
  let persistedInDb = false;

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const insertPayload = {
        vehiculo_id: numVehiculoId,
        fecha: new Date(record.date).toISOString(),
        descripcion_cambio: `${record.title} — ${record.description} [Taller: ${record.workshop} | Km: ${record.km} | Costo: $${record.cost}]`,
        pieza_actualizada: record.part || null,
        titulo: record.title,
        descripcion: record.description,
        kilometraje: record.km,
        taller: record.workshop,
        costo: record.cost,
      };

      const { data, error } = await supabase
        .from("registros_bitacora")
        .insert(insertPayload)
        .select("id");

      if (!error && data && data[0]?.id) {
        createdId = String(data[0].id);
        persistedInDb = true;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn("[BitacoraService] No se pudo persistir en Supabase, guardando en memoria local:", message);
    }
  }

  const finalRecord: MaintenanceRecord = {
    ...record,
    id: createdId,
  };

  return { record: finalRecord, persistedInDb };
}
