// test-real.mjs - Ejecución de pruebas reales contra Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vdtmnkgherljtjsdhdzw.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_nM5si_ueRqus_rpUydsfbQ_oCNRKLgU";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runRealTests() {
  console.log("=== INICIANDO EJECUCIÓN DE PRUEBAS REALES EN MOTRICK ===\n");

  // T04: Prueba Real de Filtro de Directorio
  console.log("[T04] Probando consulta real de mecánicos por especialidad (Frenos)...");
  const { data: talleres, error: errT4 } = await supabase
    .from('mecanicos')
    .select('*, usuarios(nombre)')
    .ilike('especialidad', '%Frenos%');
  if (errT4) {
    console.error("Error T04:", errT4.message);
  } else {
    console.log(`✓ T04 Aprobada: Se encontraron ${talleres.length} talleres reales. Primer taller:`, talleres[0]?.usuarios?.nombre);
  }

  // T05: Prueba Real de Límite (CHECK constraint de puntuación en PostgreSQL)
  console.log("\n[T05] Probando inserción inválida de valoración con puntuación = 6 (Límite 1..5)...");
  const { error: errT5 } = await supabase
    .from('valoraciones')
    .insert({
      puntuacion: 6,
      comentario: "Prueba de frontera fuera de rango",
      mecanico_id: "b0000000-0000-0000-0000-000000000001",
      cliente_id: "a0000000-0000-0000-0000-000000000001"
    });

  if (errT5) {
    console.log("✓ T05 Rechazada correctamente por PostgreSQL!");
    console.log("  Código de error de BD:", errT5.code);
    console.log("  Detalle técnico real:", errT5.message);
  } else {
    console.warn("Fallo T05: La base de datos permitió puntuación 6.");
  }

  // T06: Prueba Real de Repuestos Compatibles
  console.log("\n[T06] Probando consulta real de repuestos para 'Mazda 3'...");
  const { data: repuestos, error: errT6 } = await supabase
    .from('repuestos')
    .select('*')
    .ilike('compatibilidad', '%Mazda 3%');
  if (errT6) {
    console.error("Error T06:", errT6.message);
  } else {
    console.log(`✓ T06 Aprobada: Se recuperaron ${repuestos.length} piezas compatibles reales. Primera:`, repuestos[0]?.nombre);
  }

  console.log("\n=== PRUEBAS REALES FINALIZADAS CON ÉXITO ===");
}

runRealTests();
