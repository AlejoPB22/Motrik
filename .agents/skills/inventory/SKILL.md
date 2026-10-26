---
name: inventory
description: Gestión y reglas de negocio del catálogo de autopartes, repuestos y compatibilidad para motocicletas y automóviles en Motrik. Cubre categorización técnica OEM/Aftermarket, motor de compatibilidad vehicular (fitsVehicle), control de existencias, cálculo de envíos en COP y consistencia comercial.
---

# Inventory — Autopartes, Motopartes & Catálogo Motrik

Skill especializada en la gestión de inventario, categorización técnica y motor de compatibilidad de repuestos para **Motrik** (Next.js 14 App Router + Supabase SSR).

---

## 1. Alcance y Dominio Técnico
Esta habilidad opera exclusivamente sobre el sector automotriz y de motocicletas en Colombia:
- Repuestos originales OEM y homologados certificados (Aftermarket).
- Compatibilidad garantizada para vehículos y motocicletas por Marca, Modelo y Rango de Años.
- Consistencia monetaria en Pesos Colombianos (`COP`), sin fracciones decimales.

---

## 2. Categorías Técnicas del Catálogo
El catálogo se divide estrictamente en 6 familias técnicas automotrices:
1. **Frenos**: Pastillas de freno cerámicas/semimetálicas, discos ventilados y sólidos, tambores, bandas de freno, calipers y líquido de frenos DOT 4 / DOT 5.1.
2. **Motor**: Kits de distribución (correa/cadena), bujías de iridio/platino, bombas de agua y gasolina, empaquetaduras de culata, válvulas y soportes de motor.
3. **Suspensión**: Amortiguadores presurizados a gas/hidráulicos, espirales, tijeras de suspensión, rótulas, terminales de dirección y bujes de horquilla.
4. **Eléctrico**: Baterías selladas de libre mantenimiento (AGM/Gel), alternadores, motores de arranque, bobinas de encendido, reguladores de voltaje y sensores de oxígeno/OBD2.
5. **Filtros**: Filtros de aceite roscados/cartucho, filtros de aire de motor de alto flujo, filtros de combustible para inyección electrónica y filtros de cabina antipolen.
6. **Lubricantes**: Aceites sintéticos 100% multigrado (0W-20, 5W-30, 10W-40 4T para motos), aceites para transmisión manual/automática (ATF/CVT), y refrigerantes orgánicos de larga duración.

---

## 3. Motor de Compatibilidad Vehicular (`fitsVehicle`)
La compatibilidad es el diferenciador central de valor en Motrik para evitar devoluciones y garantizar compras seguras:

```typescript
export interface VehicleFitment {
  brand: Brand;
  model: string;
  years: number[];
}

export interface Part {
  id: string;
  name: string;
  brand: string;
  category: Category;
  price: number;
  oldPrice?: number;
  stock: number;
  fits: VehicleFitment[];
  specs: Record<string, string>;
  freeShipping?: boolean;
}

/**
 * Valida si un repuesto es compatible con el vehículo activo en el Garaje Virtual
 */
export function fitsVehicle(part: Part, vehicle: { brand: string; model: string; year: number } | null): boolean {
  if (!vehicle) return false;
  return part.fits.some((fit) => {
    const matchBrand = fit.brand.toLowerCase() === vehicle.brand.toLowerCase();
    const matchModel = fit.model.toLowerCase() === vehicle.model.toLowerCase();
    const matchYear = fit.years.includes(vehicle.year);
    return matchBrand && matchModel && matchYear;
  });
}
```

- **Insignia "Compatible con tu auto"**: Si `fitsVehicle(p, activeVehicle) === true`, la tarjeta debe destacar el badge de confianza `bg-success`.
- **Compatibilidad Universal**: Los productos con etiqueta `"Universal"` en compatibilidad aplican a cualquier modelo del catálogo sin restricción de año.

---

## 4. Control de Stock y Reglas Comerciales
- **Umbral de Escasez**: Cuando `stock < 8`, la vista muestra una alerta de urgencia visual (`¡Últimas X unidades!`) para acelerar la decisión de compra.
- **Validación en Pasarela (`Checkout`)**: No se puede solicitar una cantidad superior al stock físico actual (`Math.min(stock, requestedQty)`).
- **Política de Flete Nacional**:
  - Compras $\ge \$150.000\text{ COP}$: **Envío Gratis** a nivel nacional.
  - Compras $<\$150.000\text{ COP}$: Tarifa fija de logística de $\$12.900\text{ COP}$.
- **Formateo Monetario**: Utilizar siempre la función `cop()` (`Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })`).
