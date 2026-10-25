"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BadgeCheck, Clock, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SPECIALTIES, WORKSHOPS, ZONES, type Review, type Specialty, type Workshop } from "@/data/mock";
import { Chip, Img, PageHeader, Stars } from "@/components/motrick/shared";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";
import { useEffect } from "react";
import { SponsoredCard, SPONSORED_ADS } from "@/components/motrick/SponsoredCard";

function getWorkshopImage(especialidad?: string | null): string {
  const s = (especialidad || "").toLowerCase();
  if (s.includes("freno")) return "/assets/wheel.jpg";
  if (s.includes("motor")) return "/assets/engine.jpg";
  if (s.includes("suspens")) return "/assets/disc.jpg";
  if (s.includes("eléctr") || s.includes("electr")) return "/assets/battery.jpg";
  return "/assets/shop.jpg";
}

interface DbValoracion {
  id?: number | string;
  puntuacion: number | string;
  comentario?: string | null;
  fecha?: string | null;
  cliente?: { nombre?: string | null } | { nombre?: string | null }[] | null;
}

interface DbMecanico {
  id: string | number;
  especialidad?: string | null;
  ubicacion?: string | null;
  calificacion_promedio?: number | string | null;
  foto_url?: string | null;
  telefono?: string | null;
  horario?: string | null;
  anos_experiencia?: number | string | null;
  descripcion?: string | null;
  usuarios?:
    | {
        nombre?: string | null;
        correo?: string | null;
      }
    | {
        nombre?: string | null;
        correo?: string | null;
      }[]
    | null;
  valoraciones?: DbValoracion[] | null;
}

function mapDbMecanicoToWorkshop(m: DbMecanico): Workshop {
  const userObj = Array.isArray(m.usuarios) ? m.usuarios[0] : m.usuarios;
  const nombreTaller = userObj?.nombre || "Taller Especializado Motrick";
  const ubicacionStr = m.ubicacion || "Chapinero · Carrera 13 #54-21";
  const parts = ubicacionStr.split(/[·,]/);
  const zone = parts[0]?.trim() || "Bogotá";
  const address = parts.slice(1).join(",").trim() || ubicacionStr;

  // Cálculo de calificación promedio a partir de los datos registrados en la tabla 'valoraciones'
  const vals = Array.isArray(m.valoraciones) ? m.valoraciones : [];
  let avgRating = Number(m.calificacion_promedio) || 5.0;
  if (vals.length > 0) {
    const sum = vals.reduce((acc: number, v: DbValoracion) => acc + (Number(v.puntuacion) || 5), 0);
    avgRating = Number((sum / vals.length).toFixed(1));
  }

  const reviewCount = vals.length > 0 ? vals.length : (Number(m.calificacion_promedio) ? 14 : 0);

  const reviews: Review[] = vals.length > 0
    ? vals.map((v: DbValoracion, idx: number) => {
        const cObj = Array.isArray(v.cliente) ? v.cliente[0] : v.cliente;
        return {
          id: String(v.id || idx),
          author: cObj?.nombre || `Conductor Motrick #${idx + 1}`,
          avatar: `https://i.pravatar.cc/80?img=${(idx % 30) + 1}`,
          date: v.fecha ? String(v.fecha).slice(0, 10) : "2026-09-18",
          rating: Number(v.puntuacion) || 5,
          text: v.comentario || "Excelente servicio, diagnóstico claro y repuestos de primera calidad.",
          vehicle: "Vehículo verificado",
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
    about: m.descripcion || `Taller especializado en ${m.especialidad || "mantenimiento automotriz"} con técnicos calificados en Bogotá.`,
    reviews,
  };
}

export default function DirectorioPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando directorio...</div>}>
      <DirectorioContent />
    </Suspense>
  );
}

function DirectorioContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const shopParam = searchParams.get("shop");

  const [specs, setSpecs] = useState<Specialty[]>([]);
  const [zone, setZone] = useState("all");
  const [top, setTop] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [openVerification, setOpenVerification] = useState(false);
  const [workshops, setWorkshops] = useState<Workshop[]>(WORKSHOPS);
  const [loading, setLoading] = useState(true);

  // Consulta SELECT a las tablas 'mecanicos', 'usuarios' y 'valoraciones' en Supabase
  useEffect(() => {
    let activeEffect = true;
    async function loadDirectorio() {
      setLoading(true);
      try {
        const supabase = createClient();
        let query = supabase.from("mecanicos").select(`
          id,
          especialidad,
          ubicacion,
          calificacion_promedio,
          foto_url,
          telefono,
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

        // Filtro por especialidad técnica consultado en Supabase
        if (specs.length === 1) {
          query = query.ilike("especialidad", `%${specs[0]}%`);
        }

        const { data, error } = await query;

        if (!activeEffect) return;

        if (error) {
          console.warn("Aviso al consultar 'mecanicos' con joins en Supabase:", error.message);
          // Consulta fallback sencilla si las políticas RLS o foreign keys requieren formato base
          const simple = await supabase.from("mecanicos").select("*, usuarios(nombre, correo)");
          if (!simple.error && simple.data && simple.data.length > 0) {
            setWorkshops(simple.data.map(mapDbMecanicoToWorkshop));
          } else {
            setWorkshops(WORKSHOPS);
          }
        } else if (data && data.length > 0) {
          const mapped = data.map(mapDbMecanicoToWorkshop);
          setWorkshops(mapped);
        } else {
          if (specs.length > 0) {
            setWorkshops([]);
          } else {
            setWorkshops(WORKSHOPS);
          }
        }
      } catch (e) {
        console.error("Error en conexión con Supabase en Directorio:", e);
        if (activeEffect) setWorkshops(WORKSHOPS);
      } finally {
        if (activeEffect) setLoading(false);
      }
    }

    loadDirectorio();
    return () => {
      activeEffect = false;
    };
  }, [specs]);

  const list = useMemo(
    () =>
      workshops.filter((w) => {
        const matchZone = zone === "all" || w.zone.toLowerCase().includes(zone.toLowerCase());
        const matchTop = !top || w.rating >= 4;
        const matchVerified = !onlyVerified || w.verified;
        const matchSpecs = specs.length === 0 || specs.every((s) => w.specialties.some((ws) => ws.toLowerCase().includes(s.toLowerCase())));
        return matchZone && matchTop && matchVerified && matchSpecs;
      }),
    [workshops, specs, zone, top, onlyVerified],
  );

  const selected = workshops.find((w) => String(w.id) === String(shopParam)) ?? WORKSHOPS.find((w) => String(w.id) === String(shopParam)) ?? null;
  const toggle = (s: Specialty) => setSpecs((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  return (
    <div>
      <PageHeader
        eyebrow="Directorio"
        title="Talleres y mecánicos verificados"
        subtitle="Talleres evaluados por la comunidad de conductores Motrick en Bogotá."
      >
        <Button
          variant="outline"
          size="lg"
          className="h-11 rounded-full gap-2 border-primary/40 hover:border-primary"
          onClick={() => setOpenVerification(true)}
        >
          <ShieldCheck className="h-4 w-4 text-primary" /> Soy Mecánico / Verificar Taller
        </Button>
      </PageHeader>

      <div className="mb-6 space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex gap-2 overflow-x-auto pb-0.5">
          {SPECIALTIES.map((s) => <Chip key={s} active={specs.includes(s)} onClick={() => toggle(s)}>{s}</Chip>)}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={zone} onValueChange={setZone}>
            <SelectTrigger className="h-10 w-[180px] rounded-full">
              <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las zonas</SelectItem>
              {ZONES.map((z) => <SelectItem key={z} value={z}>{z}</SelectItem>)}
            </SelectContent>
          </Select>
          <Chip active={top} onClick={() => setTop(!top)}>
            <Star className="h-3.5 w-3.5 mr-1" /> 4+ estrellas
          </Chip>
          <Chip active={onlyVerified} onClick={() => setOnlyVerified(!onlyVerified)}>
            <BadgeCheck className="h-3.5 w-3.5 mr-1 text-primary" /> Solo verificados
          </Chip>
          {(specs.length > 0 || zone !== "all" || top || onlyVerified) && (
            <button
              onClick={() => { setSpecs([]); setZone("all"); setTop(false); setOnlyVerified(false); }}
              className="ml-auto text-sm font-medium text-primary hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {loading ? "Cargando talleres..." : `${list.length} talleres encontrados`}
      </p>
      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <p className="font-medium">Ningún taller cumple todos los filtros</p>
          <p className="mt-1 text-sm text-muted-foreground">Prueba quitando alguna especialidad o cambiando de zona.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((w, i) => (
            <motion.article
              key={w.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="relative">
                <Img src={w.image} alt={w.name} className="aspect-[16/10] transition-transform duration-500 group-hover:scale-[1.03]" />
                {w.verified && (
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verificado
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold">{w.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />{w.zone} · {w.address}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xl font-semibold">{w.rating.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">{w.reviewCount} reseñas</p>
                  </div>
                </div>
                <Stars value={w.rating} className="mt-2" />
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {w.specialties.map((s) => (
                    <span key={s} className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                      {s}
                    </span>
                  ))}
                </div>
                <Button
                  variant="ink"
                  className="mt-5 h-10 w-full rounded-full"
                  onClick={() => router.push(`/directorio?shop=${w.id}`)}
                >
                  Ver Perfil & Reseñas
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(o) => !o && router.push("/directorio")}>
        <DialogContent className="max-h-[90vh] max-w-2xl gap-0 overflow-y-auto p-0">
          {selected && (
            <>
              <Img src={selected.image} alt={selected.name} className="aspect-[21/9]" />
              <div className="p-6">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-2xl font-semibold">{selected.name}</DialogTitle>
                  {selected.verified && <BadgeCheck className="h-5 w-5 text-primary" />}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{selected.about}</p>
                <div className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
                  <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{selected.address}</span>
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" />{selected.hours}</span>
                  <span className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{selected.phone}</span>
                </div>
                <div className="mt-5 flex items-center gap-5 rounded-xl bg-muted/60 p-4">
                  <div className="text-center">
                    <p className="text-4xl font-semibold">{selected.rating.toFixed(1)}</p>
                    <Stars value={selected.rating} size={12} />
                    <p className="mt-1 text-xs text-muted-foreground">{selected.reviewCount} reseñas</p>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((n, i) => {
                      const pct = [72, 18, 6, 3, 1][i];
                      return (
                        <div key={n} className="flex items-center gap-2 text-xs">
                          <span className="w-3 text-muted-foreground">{n}</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.1 + i * 0.05 }} className="h-full bg-star" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <h3 className="mb-3 mt-6 text-sm font-semibold">Opiniones de clientes</h3>
                <div className="space-y-4">
                  {selected.reviews.map((r) => (
                    <div key={r.id} className="border-b border-border pb-4 last:border-0">
                      <div className="flex items-center gap-3">
                        <img src={r.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{r.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {r.vehicle} · {new Date(r.date).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <Stars value={r.rating} size={12} />
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.text}</p>
                    </div>
                  ))}
                </div>
                <Button
                  variant="cta"
                  size="lg"
                  className="mt-4 h-12 w-full rounded-full"
                  onClick={() => toast.success(`Solicitud enviada a ${selected.name}`, { description: "Te contactarán para coordinar tu cita." })}
                >
                  Agendar cita
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Publicidad Nativa Contextual Automotriz (RNF-04) */}
      <div className="mt-12 pt-6 border-t border-border/60">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Alianzas y Servicios de Movilidad
          </p>
          <span className="text-[10px] text-muted-foreground">Publicidad transparente · Ley 1480</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <SponsoredCard {...SPONSORED_ADS.telepeaje} />
          <SponsoredCard {...SPONSORED_ADS.soatSeguros} />
        </div>
      </div>

      <VerificationRequestModal
        open={openVerification}
        onOpenChange={setOpenVerification}
      />
    </div>
  );
}

function VerificationRequestModal({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("Frenos");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rut.trim()) {
      toast.error("Por favor completa los datos comerciales obligatorios.");
      return;
    }
    toast.success("Solicitud de Verificación enviada (RF-05)", {
      description: `El equipo de Motrick validará el RUT ${rut} y la sede física en menos de 24h.`,
    });
    setName("");
    setRut("");
    setAddress("");
    setPhone("");
    onOpenChange(false);
  };

  const inputCls = "h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle className="text-xl flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" /> Verificación de Taller (RF-05)
        </DialogTitle>
        <p className="-mt-2 text-sm text-muted-foreground">
          Obtén la insignia de Taller Verificado y posiciónate prioritariamente ante miles de conductores en Bogotá.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Razón Social o Nombre Comercial</label>
            <input className={inputCls} placeholder="Ej. Torque Automotriz S.A.S." value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">NIT o RUT Comercial (DIAN)</label>
            <input className={inputCls} placeholder="Ej. 901.234.567-8" value={rut} onChange={(e) => setRut(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Dirección Física</label>
              <input className={inputCls} placeholder="Cra / Calle #" value={address} onChange={(e) => setAddress(e.target.value)} required />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Teléfono Móvil</label>
              <input className={inputCls} placeholder="+57 300..." value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Especialidad Principal</label>
            <select className={inputCls} value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
              {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <p className="text-[11px] text-muted-foreground leading-snug">
            Nota legal: Al enviar este formulario declaras cumplir con los estándares técnicos y la idoneidad exigida por la Ley 1480 de 2011.
          </p>
          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" size="lg" className="h-11 flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="cta" size="lg" className="h-11 flex-1">
              Enviar Solicitud
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
