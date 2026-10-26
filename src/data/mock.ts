const brakeImg = "/assets/brake.jpg";
const oilImg = "/assets/oil.jpg";
const batteryImg = "/assets/battery.jpg";
const discImg = "/assets/disc.jpg";
const shopImg = "/assets/shop.jpg";
const engineImg = "/assets/engine.jpg";
const car1Img = "/assets/car1.jpg";
const car2Img = "/assets/car2.jpg";

export type Brand = "Toyota" | "Mazda" | "Chevrolet" | "Ford" | "Renault" | "Kia";

export const CATALOG: Record<Brand, Record<string, number[]>> = {
  Toyota: { Corolla: [2018, 2019, 2020, 2021, 2022, 2023], Hilux: [2017, 2019, 2021, 2023], RAV4: [2019, 2020, 2022, 2024] },
  Mazda: { "Mazda 3": [2018, 2019, 2020, 2021, 2022, 2023], "CX-5": [2018, 2020, 2022, 2024], "CX-30": [2020, 2021, 2023] },
  Chevrolet: { Onix: [2020, 2021, 2022, 2023], Tracker: [2019, 2021, 2023], Spark: [2016, 2018, 2020] },
  Ford: { Ranger: [2018, 2020, 2022, 2024], Escape: [2019, 2021, 2023], Fiesta: [2016, 2018, 2019] },
  Renault: { Duster: [2018, 2020, 2022, 2024], Logan: [2017, 2019, 2021], Sandero: [2018, 2020, 2022] },
  Kia: { Picanto: [2018, 2020, 2022, 2024], Sportage: [2019, 2021, 2023], Rio: [2018, 2020, 2022] },
};

export type Vehicle = {
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
  soatExpiry?: string; // YYYY-MM-DD
  tecnoExpiry?: string; // YYYY-MM-DD
  hasTecno?: boolean;
};

export function formatVehicleName(brand?: string | null, model?: string | null): string {
  const b = (brand || "").trim();
  const m = (model || "").trim();
  if (!b) return m;
  if (!m) return b;
  return m.toLowerCase().startsWith(b.toLowerCase()) ? m : `${b} ${m}`;
}

export const USER_VEHICLES: Vehicle[] = [
  {
    id: "1",
    brand: "Mazda",
    model: "Mazda 3",
    year: 2021,
    plate: "KDM-482",
    odometer: 48230,
    engine: "2.0L Skyactiv-G",
    fuel: "Gasolina",
    transmission: "Automática 6V",
    color: "Gris Machine",
    image: car1Img,
    soatExpiry: "2026-11-15",
    tecnoExpiry: "2027-03-20",
    hasTecno: true,
  },
  {
    id: "2",
    brand: "Toyota",
    model: "Hilux",
    year: 2019,
    plate: "JTX-917",
    odometer: 112450,
    engine: "2.4L Diésel 2GD",
    fuel: "Diésel",
    transmission: "Manual 6V",
    color: "Blanco Perlado",
    image: car2Img,
    soatExpiry: "2026-10-30",
    tecnoExpiry: "2026-11-05",
    hasTecno: true,
  },
];

export type Category = "Frenos" | "Motor" | "Suspensión" | "Eléctrico" | "Filtros" | "Lubricantes";
export const CATEGORIES: Category[] = ["Frenos", "Motor", "Suspensión", "Eléctrico", "Filtros", "Lubricantes"];

export type Part = {
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
};

const IMG = {
  brake: brakeImg, engine: engineImg, parts: engineImg, garage: shopImg,
  wheel: discImg, oil: oilImg, battery: batteryImg, mech: shopImg,
};

export const PARTS: Part[] = [
  { id: "p1", name: "Pastillas de freno cerámicas delanteras", brand: "Brembo", category: "Frenos", price: 289000, oldPrice: 340000, rating: 4.8, reviews: 412, stock: 24, images: [IMG.brake, IMG.wheel, IMG.parts], fits: [{ brand: "Mazda", model: "Mazda 3", years: [2019, 2020, 2021, 2022, 2023] }, { brand: "Mazda", model: "CX-30", years: [2020, 2021, 2023] }], specs: { Material: "Cerámica", Posición: "Delantera", "Incluye sensor": "Sí", Garantía: "12 meses" }, freeShipping: true },
  { id: "p2", name: "Aceite sintético 5W-30 (4L)", brand: "Mobil 1", category: "Lubricantes", price: 189900, rating: 4.9, reviews: 1290, stock: 80, images: [IMG.oil, IMG.engine], fits: [{ brand: "Mazda", model: "Mazda 3", years: [2018, 2019, 2020, 2021, 2022, 2023] }, { brand: "Toyota", model: "Corolla", years: [2018, 2019, 2020, 2021, 2022, 2023] }, { brand: "Kia", model: "Rio", years: [2018, 2020, 2022] }], specs: { Viscosidad: "5W-30", Tipo: "100% sintético", Volumen: "4 litros", Norma: "API SP" }, freeShipping: true },
  { id: "p3", name: "Filtro de aceite premium", brand: "Bosch", category: "Filtros", price: 38500, rating: 4.7, reviews: 860, stock: 140, images: [IMG.parts, IMG.engine], fits: [{ brand: "Mazda", model: "Mazda 3", years: [2018, 2019, 2020, 2021, 2022, 2023] }, { brand: "Mazda", model: "CX-5", years: [2018, 2020, 2022] }], specs: { Rosca: "M20x1.5", Altura: "65 mm", Válvula: "Antirretorno" } },
  { id: "p4", name: "Amortiguador delantero a gas", brand: "Monroe", category: "Suspensión", price: 412000, rating: 4.6, reviews: 198, stock: 6, images: [IMG.wheel, IMG.garage], fits: [{ brand: "Toyota", model: "Hilux", years: [2017, 2019, 2021] }], specs: { Tipo: "Gas presurizado", Posición: "Delantero", Garantía: "24 meses" } },
  { id: "p5", name: "Batería 12V 60Ah libre de mantenimiento", brand: "MAC", category: "Eléctrico", price: 465000, oldPrice: 520000, rating: 4.8, reviews: 540, stock: 18, images: [IMG.battery, IMG.engine], fits: [{ brand: "Mazda", model: "Mazda 3", years: [2019, 2020, 2021, 2022] }, { brand: "Chevrolet", model: "Tracker", years: [2019, 2021, 2023] }, { brand: "Renault", model: "Duster", years: [2018, 2020, 2022] }], specs: { Capacidad: "60 Ah", CCA: "520 A", Garantía: "18 meses" }, freeShipping: true },
  { id: "p6", name: "Kit de embrague completo", brand: "LuK", category: "Motor", price: 890000, rating: 4.7, reviews: 87, stock: 4, images: [IMG.engine, IMG.parts], fits: [{ brand: "Toyota", model: "Hilux", years: [2017, 2019, 2021, 2023] }, { brand: "Ford", model: "Ranger", years: [2018, 2020, 2022] }], specs: { Incluye: "Disco, prensa, balinera", Diámetro: "275 mm" } },
  { id: "p7", name: "Discos de freno ventilados (par)", brand: "Brembo", category: "Frenos", price: 520000, rating: 4.9, reviews: 233, stock: 12, images: [IMG.brake, IMG.wheel], fits: [{ brand: "Mazda", model: "Mazda 3", years: [2019, 2020, 2021, 2022, 2023] }, { brand: "Mazda", model: "CX-5", years: [2020, 2022, 2024] }], specs: { Tipo: "Ventilado", Diámetro: "295 mm", Cantidad: "2 unidades" }, freeShipping: true },
  { id: "p8", name: "Filtro de aire de motor", brand: "Mann-Filter", category: "Filtros", price: 72000, rating: 4.6, reviews: 315, stock: 55, images: [IMG.parts, IMG.mech], fits: [{ brand: "Chevrolet", model: "Onix", years: [2020, 2021, 2022, 2023] }, { brand: "Kia", model: "Picanto", years: [2018, 2020, 2022, 2024] }], specs: { Material: "Celulosa", Forma: "Panel" } },
  { id: "p9", name: "Bujías iridio (juego x4)", brand: "NGK", category: "Motor", price: 236000, rating: 4.9, reviews: 702, stock: 30, images: [IMG.engine, IMG.parts], fits: [{ brand: "Mazda", model: "Mazda 3", years: [2018, 2019, 2020, 2021, 2022, 2023] }, { brand: "Toyota", model: "Corolla", years: [2019, 2020, 2021, 2022] }, { brand: "Ford", model: "Escape", years: [2019, 2021] }], specs: { Electrodo: "Iridio", Vida: "100.000 km", Cantidad: "4" } },
  { id: "p10", name: "Kit de rótulas y terminales", brand: "Moog", category: "Suspensión", price: 318000, rating: 4.5, reviews: 74, stock: 9, images: [IMG.wheel, IMG.mech], fits: [{ brand: "Renault", model: "Duster", years: [2018, 2020, 2022, 2024] }, { brand: "Renault", model: "Logan", years: [2017, 2019, 2021] }], specs: { Incluye: "2 rótulas, 2 terminales" } },
  { id: "p11", name: "Alternador remanufacturado 120A", brand: "Denso", category: "Eléctrico", price: 1150000, rating: 4.4, reviews: 41, stock: 3, images: [IMG.engine, IMG.garage], fits: [{ brand: "Toyota", model: "Hilux", years: [2017, 2019, 2021, 2023] }], specs: { Salida: "120 A", Voltaje: "12 V", Garantía: "12 meses" } },
  { id: "p12", name: "Aceite sintético 0W-20 (4L)", brand: "Castrol EDGE", category: "Lubricantes", price: 175000, rating: 4.8, reviews: 520, stock: 64, images: [IMG.oil, IMG.engine], fits: [{ brand: "Toyota", model: "Corolla", years: [2020, 2021, 2022, 2023] }, { brand: "Toyota", model: "RAV4", years: [2019, 2020, 2022, 2024] }, { brand: "Kia", model: "Sportage", years: [2021, 2023] }], specs: { Viscosidad: "0W-20", Volumen: "4 litros" } },
];

export type Specialty = "Frenos" | "Motor" | "Suspensión" | "Eléctrico" | "Mantenimiento preventivo";
export const SPECIALTIES: Specialty[] = ["Frenos", "Motor", "Suspensión", "Eléctrico", "Mantenimiento preventivo"];
export const ZONES = ["Manga", "Bocagrande", "Pie de la Popa", "El Bosque", "Ternera", "Crespo"];

export type Review = { id: string; author: string; avatar: string; date: string; rating: number; text: string; vehicle: string };
export type Workshop = {
  id: string; name: string; zone: string; address: string; image: string; verified: boolean;
  specialties: Specialty[]; rating: number; reviewCount: number; hours: string; phone: string; years: number; about: string; reviews: Review[];
};

const av = (n: number) => `https://i.pravatar.cc/80?img=${n}`;
const R = (seed: number): Review[] => [
  { id: `r${seed}a`, author: "Camilo Restrepo", avatar: av(seed + 3), date: "2026-09-18", rating: 5, text: "Diagnóstico claro y precio justo. Me mostraron las piezas cambiadas y entregaron el carro antes de lo prometido.", vehicle: "Mazda CX-5 2020" },
  { id: `r${seed}b`, author: "Laura Gómez", avatar: av(seed + 9), date: "2026-08-02", rating: 4, text: "Muy buen trabajo con la suspensión. La sala de espera podría mejorar, pero la atención fue excelente.", vehicle: "Renault Duster 2022" },
  { id: `r${seed}c`, author: "Andrés Molina", avatar: av(seed + 14), date: "2026-06-21", rating: 5, text: "Llevo tres años haciendo aquí el mantenimiento. Confianza total y reportes detallados de cada servicio.", vehicle: "Toyota Corolla 2019" },
];

export const WORKSHOPS: Workshop[] = [
  { id: "w1", name: "Torque Automotriz", zone: "Manga", address: "Calle Real #24-15", image: IMG.mech, verified: true, specialties: ["Frenos", "Suspensión", "Mantenimiento preventivo"], rating: 4.9, reviewCount: 328, hours: "Lun–Sáb 7:00–18:00", phone: "+57 605 660 7788", years: 14, about: "Taller especializado en vehículos japoneses con equipos de diagnóstico de concesionario en Cartagena.", reviews: R(1) },
  { id: "w2", name: "MotorLab Diagnóstico", zone: "Bocagrande", address: "Cra 3 #6-40", image: IMG.engine, verified: true, specialties: ["Motor", "Eléctrico"], rating: 4.8, reviewCount: 214, hours: "Lun–Vie 8:00–18:00", phone: "+57 605 655 0091", years: 9, about: "Diagnóstico electrónico avanzado, reprogramación y reparación de motores.", reviews: R(2) },
  { id: "w3", name: "Frenos & Ejes del Caribe", zone: "Pie de la Popa", address: "Calle 30 #21-18", image: IMG.wheel, verified: false, specialties: ["Frenos", "Suspensión"], rating: 4.5, reviewCount: 96, hours: "Lun–Sáb 8:00–17:00", phone: "+57 605 669 2310", years: 6, about: "Alineación, balanceo y sistemas de frenado para livianos y camionetas.", reviews: R(3) },
  { id: "w4", name: "Centro Técnico El Bosque", zone: "El Bosque", address: "Av. Crisanto Luque #48-20", image: IMG.garage, verified: true, specialties: ["Mantenimiento preventivo", "Motor"], rating: 4.6, reviewCount: 451, hours: "Lun–Dom 7:00–19:00", phone: "+57 605 667 4455", years: 18, about: "Servicio rápido de mantenimiento con más de 12 bahías y repuestos originales.", reviews: R(4) },
  { id: "w5", name: "VoltCar Eléctricos", zone: "Ternera", address: "Diag 32 #71-55", image: IMG.battery, verified: true, specialties: ["Eléctrico"], rating: 4.7, reviewCount: 132, hours: "Lun–Sáb 8:00–18:00", phone: "+57 605 653 6602", years: 7, about: "Especialistas en sistemas eléctricos, baterías, alternadores e híbridos.", reviews: R(5) },
  { id: "w6", name: "Suspensiones del Caribe", zone: "Crespo", address: "Cra 1 #62-10", image: IMG.parts, verified: false, specialties: ["Suspensión", "Frenos"], rating: 3.9, reviewCount: 58, hours: "Lun–Vie 8:00–17:30", phone: "+57 605 664 1940", years: 4, about: "Reparación de suspensión, amortiguadores y dirección hidráulica.", reviews: R(6) },
];

export type MaintenanceRecord = {
  id: string; vehicleId: string; date: string; km: number; title: string; description: string; workshop: string; cost: number; part?: string | undefined;
};

export const RECORDS: MaintenanceRecord[] = [
  { id: "m1", vehicleId: "1", date: "2026-09-12", km: 47800, title: "Cambio de aceite sintético", description: "Cambio de aceite 5W-30 y filtro. Revisión de niveles y presión de llantas.", workshop: "Torque Automotriz", cost: 285000, part: "Aceite sintético 5W-30 (4L) · Mobil 1" },
  { id: "m2", vehicleId: "1", date: "2026-05-30", km: 41250, title: "Cambio de pastillas de freno", description: "Pastillas delanteras cerámicas; rectificado de discos.", workshop: "Frenos & Ejes del Caribe", cost: 420000, part: "Pastillas de freno cerámicas · Brembo" },
  { id: "m3", vehicleId: "1", date: "2026-01-14", km: 35600, title: "Alineación y balanceo", description: "Alineación computarizada 3D y balanceo de las cuatro ruedas.", workshop: "Torque Automotriz", cost: 140000 },
  { id: "m4", vehicleId: "1", date: "2025-08-03", km: 28900, title: "Mantenimiento de 30.000 km", description: "Bujías, filtro de aire, filtro de cabina y líquido de frenos.", workshop: "Centro Técnico El Bosque", cost: 690000, part: "Bujías iridio (juego x4) · NGK" },
  { id: "m5", vehicleId: "2", date: "2026-08-20", km: 111900, title: "Cambio de amortiguadores", description: "Amortiguadores delanteros y revisión de bujes.", workshop: "Suspensiones del Caribe", cost: 980000, part: "Amortiguador delantero a gas · Monroe" },
  { id: "m6", vehicleId: "2", date: "2026-03-11", km: 104300, title: "Cambio de aceite y filtros", description: "Aceite diésel 15W-40, filtro de combustible y de aire.", workshop: "Centro Técnico El Bosque", cost: 410000 },
];

export const cop = (n: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

export const fitsVehicle = (p: Part, v: { brand: string; model: string; year: number } | null) =>
  !!v && p.fits.some((f) => f.brand === v.brand && f.model === v.model && f.years.includes(v.year));
