"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BadgeCheck, Clock, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SPECIALTIES, WORKSHOPS, ZONES, type Specialty, type Workshop } from "@/data/mock";
import { Chip, Img, PageHeader } from "@/components/motrick/shared";
import { toast } from "sonner";
import { getDirectorio } from "@/services/directorio.service";
import { SponsoredCard, SPONSORED_ADS } from "@/components/motrick/SponsoredCard";

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

  // Carga de directorio de talleres mediante la capa de servicios
  useEffect(() => {
    let activeEffect = true;
    async function loadDirectorio() {
      setLoading(true);
      try {
        const data = await getDirectorio({ specialties: specs, zone });
        if (activeEffect) {
          setWorkshops(data);
        }
      } catch (e) {
        console.error("[DirectorioPage] Error al cargar talleres:", e);
        if (activeEffect) setWorkshops(WORKSHOPS);
      } finally {
        if (activeEffect) setLoading(false);
      }
    }

    loadDirectorio();
    return () => {
      activeEffect = false;
    };
  }, [specs, zone]);

  const list = useMemo(
    () =>
      workshops.filter((w) => {
        const matchZone = zone === "all" || w.zone.toLowerCase().includes(zone.toLowerCase());
        const matchTop = !top || w.rating >= 4;
        const matchVerified = !onlyVerified || w.verified;
        const matchSpecs =
          specs.length === 0 ||
          specs.every((s) => w.specialties.some((ws) => ws.toLowerCase().includes(s.toLowerCase())));
        return matchZone && matchTop && matchVerified && matchSpecs;
      }),
    [workshops, zone, top, onlyVerified, specs]
  );

  const selected =
    workshops.find((w) => String(w.id) === String(shopParam)) ??
    WORKSHOPS.find((w) => String(w.id) === String(shopParam)) ??
    null;

  const toggleSpec = (s: Specialty) => {
    setSpecs((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  return (
    <div>
      <PageHeader
        eyebrow="Directorio & Red de Confianza"
        title="Talleres mecánicos verificados"
        subtitle="Compara talleres por zona, especialidad y opiniones reales de otros conductores."
      >
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => setOpenVerification(true)}>
          <ShieldCheck className="h-4 w-4 mr-1 text-primary" /> ¿Tienes un taller? Verifícate
        </Button>
      </PageHeader>

      <div className="mb-6 space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={zone} onValueChange={setZone}>
            <SelectTrigger className="h-10 w-[160px] rounded-full">
              <SelectValue placeholder="Zona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las zonas</SelectItem>
              {ZONES.map((z) => (
                <SelectItem key={z} value={z}>
                  {z}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <button
            onClick={() => setTop(!top)}
            className={`flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-all ${
              top ? "border-amber-400 bg-amber-400/10 text-amber-700 dark:text-amber-300" : "border-border text-muted-foreground"
            }`}
          >
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.0 o más
          </button>

          <button
            onClick={() => setOnlyVerified(!onlyVerified)}
            className={`flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-all ${
              onlyVerified ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"
            }`}
          >
            <BadgeCheck className="h-4 w-4" /> Solo verificados
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/60">
          <span className="text-xs font-medium text-muted-foreground mr-1">Especialidad:</span>
          {SPECIALTIES.map((s) => (
            <Chip key={s} active={specs.includes(s)} onClick={() => toggleSpec(s)}>
              {s}
            </Chip>
          ))}
          {specs.length > 0 && (
            <button onClick={() => setSpecs([])} className="text-xs text-muted-foreground hover:underline ml-1">
              Limpiar
            </button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {loading ? "Buscando talleres…" : `${list.length} talleres encontrados`}
      </p>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <p className="font-medium">No se encontraron talleres con estos filtros</p>
          <p className="mt-1 text-sm text-muted-foreground">Prueba seleccionando otra zona o quitando filtros.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSpecs([]);
              setZone("all");
              setTop(false);
              setOnlyVerified(false);
            }}
          >
            Ver todos los talleres
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => router.push(`/directorio?shop=${w.id}`)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="relative">
                <Img src={w.image} alt={w.name} className="aspect-[16/10]" />
                {w.verified && (
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur">
                    <BadgeCheck className="h-3.5 w-3.5 text-primary" /> Verificado
                  </span>
                )}
                <span className="absolute bottom-3 right-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-medium backdrop-blur">
                  {w.zone}
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                    {w.name}
                  </h3>
                  <div className="flex shrink-0 items-center gap-1 font-semibold text-sm">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span>{w.rating}</span>
                    <span className="text-xs text-muted-foreground font-normal">({w.reviewCount})</span>
                  </div>
                </div>

                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{w.address}</span>
                </p>

                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{w.about}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {w.specialties.map((s) => (
                    <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {s}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {w.hours}
                  </span>
                  <span>{w.years} años de exp.</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de Detalle de Taller */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && router.push("/directorio")}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto p-0">
          {selected && (
            <div>
              <div className="relative">
                <Img src={selected.image} alt={selected.name} className="aspect-[16/9]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur">
                      {selected.zone}
                    </span>
                    {selected.verified && (
                      <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verificado por Motrick
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-2xl font-bold">{selected.name}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-white/80">
                    <MapPin className="h-3.5 w-3.5" /> {selected.address}
                  </p>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div className="grid grid-cols-3 gap-3 rounded-xl border border-border p-3 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Calificación</p>
                    <p className="mt-0.5 flex items-center justify-center gap-1 font-semibold text-lg">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {selected.rating}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Opiniones</p>
                    <p className="mt-0.5 font-semibold text-lg">{selected.reviewCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Experiencia</p>
                    <p className="mt-0.5 font-semibold text-lg">{selected.years} años</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Acerca del taller</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{selected.about}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Especialidades</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.specialties.map((s) => (
                      <span key={s} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold">Contacto y Horarios</h4>
                  <div className="mt-2 space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" /> {selected.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" /> {selected.hours}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-semibold">Opiniones de clientes ({selected.reviews.length})</h4>
                  <div className="space-y-3">
                    {selected.reviews.map((r) => (
                      <div key={r.id} className="rounded-xl border border-border bg-muted/30 p-3.5 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{r.author}</span>
                          <div className="flex items-center gap-1 text-xs text-amber-500">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {r.rating}
                          </div>
                        </div>
                        <p className="mt-1.5 text-muted-foreground">{r.text}</p>
                        <p className="mt-2 text-[11px] text-muted-foreground/75">
                          {r.date} · {r.vehicle}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="lg" className="h-11 flex-1" onClick={() => router.push("/directorio")}>
                    Cerrar
                  </Button>
                  <Button
                    variant="cta"
                    size="lg"
                    className="h-11 flex-1"
                    onClick={() => {
                      toast.success(`Llamando a ${selected.name}`, { description: selected.phone });
                    }}
                  >
                    Contactar Taller
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pauta publicitaria contextual (RNF-04) */}
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

      <VerificationRequestModal open={openVerification} onOpenChange={setOpenVerification} />
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

  const inputCls =
    "h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10";

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
            <input
              className={inputCls}
              placeholder="Ej. Torque Automotriz S.A.S."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">NIT o RUT Comercial (DIAN)</label>
            <input
              className={inputCls}
              placeholder="Ej. 901.234.567-8"
              value={rut}
              onChange={(e) => setRut(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Dirección Física</label>
              <input
                className={inputCls}
                placeholder="Cra / Calle #"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1">Teléfono Móvil</label>
              <input
                className={inputCls}
                placeholder="+57 300..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1">Especialidad Principal</label>
            <select className={inputCls} value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
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
