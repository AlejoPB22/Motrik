import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";
import { USER_VEHICLES, RECORDS, type Brand, type MaintenanceRecord, type Vehicle } from "@/data/mock";
import type { DbRegistroBitacora, DbVehiculo } from "@/types";

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
 * Obtiene los vehículos del garaje virtual
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
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      if (mode === "supabase" && process.env.NODE_ENV === "production") {
        throw new Error(`[BitacoraService] Error al consultar vehículos: ${error.message}`);
      }
      console.warn("[BitacoraService] Error en Supabase, usando vehículos mock:", error.message);
      return USER_VEHICLES;
    }

    if (data && data.length > 0) {
      return (data as DbVehiculo[]).map((v) => ({
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
        soatExpiry: v.soat_vencimiento || "2026-11-15",
        tecnoExpiry: v.tecno_vencimiento || "2027-03-20",
        hasTecno: true,
      }));
    }

    return USER_VEHICLES;
  } catch (err) {
    if (mode === "supabase" && process.env.NODE_ENV === "production") {
      throw err;
    }
    console.warn("[BitacoraService] Fallback local para vehículos:", err);
    return USER_VEHICLES;
  }
}

/**
 * Obtiene los registros de mantenimiento de la bitácora
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
      .select("*")
      .order("fecha", { ascending: false });

    if (error) {
      if (mode === "supabase" && process.env.NODE_ENV === "production") {
        throw new Error(`[BitacoraService] Error al consultar bitácora: ${error.message}`);
      }
      console.warn("[BitacoraService] Error en Supabase, usando registros mock:", error.message);
      return RECORDS;
    }

    if (data && data.length > 0) {
      return (data as DbRegistroBitacora[]).map((r) => parseDbRecord(r, currentVehicles));
    }

    return RECORDS;
  } catch (err) {
    if (mode === "supabase" && process.env.NODE_ENV === "production") {
      throw err;
    }
    console.warn("[BitacoraService] Fallback local para bitácora:", err);
    return RECORDS;
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
        .select();

      if (!error && data && data[0]?.id) {
        createdId = String(data[0].id);
        persistedInDb = true;
      }
    } catch (err) {
      console.warn("[BitacoraService] No se pudo persistir en Supabase, guardando en memoria local:", err);
    }
  }

  const finalRecord: MaintenanceRecord = {
    ...record,
    id: createdId,
  };

  return { record: finalRecord, persistedInDb };
}

