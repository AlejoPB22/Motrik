"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BadgeCheck, Clock, FileText, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SPECIALTIES, WORKSHOPS, ZONES, type Specialty, type Workshop } from "@/data/mock";
import { Chip, Img, PageHeader } from "@/components/motrick/shared";
import { toast } from "sonner";
import { getDirectorio } from "@/services/directorio.service";
import { SponsoredCard, SPONSORED_ADS } from "@/components/motrick/SponsoredCard";
import { cn } from "@/lib/utils";

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
        subtitle="Compara talleres por zona, especialidad y opiniones auditadas de otros conductores en Cartagena."
      >
        <Button variant="outline" size="sm" className="rounded-full gap-1.5 shadow-sm" onClick={() => setOpenVerification(true)}>
          <ShieldCheck className="h-4 w-4 text-primary" /> ¿Tienes un taller? Verifícate (Ley 1480)
        </Button>
      </PageHeader>

      {/* Barra de Filtros Clean Grid */}
      <div className="mb-6 space-y-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={zone} onValueChange={setZone}>
            <SelectTrigger className="h-10 w-[170px] rounded-full">
              <SelectValue placeholder="Zona de Cartagena" />
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
            className={cn(
              "flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-all active:scale-[0.98]",
              top ? "border-amber-400 bg-amber-400/10 text-amber-700 dark:text-amber-300 font-semibold" : "border-border text-muted-foreground hover:bg-accent"
            )}
          >
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> 4.0 o más
          </button>

          <button
            onClick={() => setOnlyVerified(!onlyVerified)}
            className={cn(
              "flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition-all active:scale-[0.98]",
              onlyVerified ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-muted-foreground hover:bg-accent"
            )}
          >
            <BadgeCheck className="h-4 w-4" /> Solo verificados
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          <span className="text-xs font-semibold text-muted-foreground mr-1">Especialidad técnica:</span>
          {SPECIALTIES.map((s) => (
            <Chip key={s} active={specs.includes(s)} onClick={() => toggleSpec(s)}>
              {s}
            </Chip>
          ))}
          {specs.length > 0 && (
            <button onClick={() => setSpecs([])} className="text-xs text-primary font-medium hover:underline ml-1">
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {loading ? "Consultando red de talleres…" : `${list.length} talleres especializados encontrados`}
      </p>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <p className="font-semibold text-lg">No se encontraron talleres con estos filtros</p>
          <p className="mt-1 text-sm text-muted-foreground">Prueba seleccionando otra zona o limpiando las especialidades mecánicas.</p>
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
        /* Clean Grid Layout con elevación y sombras dinámicas */
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {list.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => router.push(`/directorio?shop=${w.id}`)}
              className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift hover:border-primary/40"
            >
              <div className="relative">
                <Img src={w.image} alt={w.name} className="aspect-[16/10] transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                {w.verified && (
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-background/90 px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur border border-primary/20">
                    <BadgeCheck className="h-3.5 w-3.5 text-primary" /> Verificado
                  </span>
                )}
                <span className="absolute bottom-3 right-3 rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-semibold backdrop-blur text-foreground">
                  {w.zone}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-lg leading-snug group-hover:text-primary transition-colors">
                      {w.name}
                    </h3>
                    <div className="flex shrink-0 items-center gap-1 font-bold text-sm bg-amber-500/10 px-2 py-0.5 rounded-md text-amber-600 dark:text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{w.rating}</span>
                      <span className="text-xs text-muted-foreground font-normal">({w.reviewCount})</span>
                    </div>
                  </div>

                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                    <span className="truncate">{w.address}</span>
                  </p>

                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">{w.about}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {w.specialties.map((s) => (
                      <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {w.hours}
                  </span>
                  <span className="font-semibold text-foreground/80">{w.years} años de trayectoria</span>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold backdrop-blur">
                      {selected.zone}
                    </span>
                    {selected.verified && (
                      <span className="flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground shadow-sm">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verificado por Motrik (Ley 1480)
                      </span>
                    )}
                  </div>
                  <h2 className="mt-2 text-2xl font-bold">{selected.name}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-white/80">
                    <MapPin className="h-3.5 w-3.5 text-primary" /> {selected.address}
                  </p>
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div className="grid grid-cols-3 gap-3 rounded-2xl border border-border bg-card p-4 text-center shadow-soft">
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Calificación</p>
                    <p className="mt-1 flex items-center justify-center gap-1 font-bold text-xl text-foreground">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" /> {selected.rating}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Opiniones</p>
                    <p className="mt-1 font-bold text-xl text-foreground">{selected.reviewCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Experiencia</p>
                    <p className="mt-1 font-bold text-xl text-foreground">{selected.years} años</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold tracking-tight">Acerca del taller</h4>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{selected.about}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold tracking-tight">Especialidades mecánicas</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selected.specialties.map((s) => (
                      <span key={s} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold tracking-tight">Contacto y Atención</h4>
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
                  <h4 className="mb-3 text-sm font-semibold tracking-tight">Opiniones auditadas ({selected.reviews.length})</h4>
                  <div className="space-y-3">
                    {selected.reviews.map((r) => (
                      <div key={r.id} className="rounded-xl border border-border bg-muted/30 p-3.5 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold">{r.author}</span>
                          <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {r.rating}
                          </div>
                        </div>
                        <p className="mt-1.5 text-muted-foreground text-xs leading-relaxed">{r.text}</p>
                        <p className="mt-2 text-[11px] text-muted-foreground/75 font-mono">
                          {r.date} · {r.vehicle}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button variant="outline" size="lg" className="h-11 flex-1" onClick={() => router.push("/directorio")}>
                    Cerrar
                  </Button>
                  <Button
                    variant="cta"
                    size="lg"
                    className="h-11 flex-1"
                    onClick={() => {
                      toast.success(`Conectando con ${selected.name}`, { description: selected.phone });
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
  const [matricula, setMatricula] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("Frenos");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !rut.trim()) {
      toast.error("Por favor completa los datos comerciales obligatorios.");
      return;
    }
    toast.success("Solicitud de Verificación enviada (RF-05 / Ley 1480)", {
      description: `El equipo auditor de Motrik validará el NIT ${rut} y la matrícula mercantil en menos de 24 horas.`,
    });
    setName("");
    setRut("");
    setMatricula("");
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
        <p className="-mt-2 text-xs text-muted-foreground leading-relaxed">
          Inscribe tu taller mecánico para obtener la insignia de <strong>Taller Verificado</strong> y posicionarte ante miles de conductores en Cartagena bajo el marco del Art. 53 de la Ley 1480 de 2011.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Razón Social o Nombre Comercial</label>
            <input
              className={inputCls}
              placeholder="Ej. Torque Automotriz S.A.S."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">NIT / RUT (DIAN)</label>
              <input
                className={inputCls}
                placeholder="901.234.567-8"
                value={rut}
                onChange={(e) => setRut(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Matrícula Mercantil</label>
              <input
                className={inputCls}
                placeholder="Cámara Comercio"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Dirección Física</label>
              <input
                className={inputCls}
                placeholder="Cra 13 #54-21"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Teléfono Móvil</label>
              <input
                className={inputCls}
                placeholder="+57 300 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Especialidad Técnica Principal</label>
            <select className={inputCls} value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
              {SPECIALTIES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 p-3 text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground flex items-center gap-1 mb-0.5">
              <FileText className="h-3.5 w-3.5 text-primary" /> Marco de Responsabilidad (Ley 1480):
            </span>
            Motrik valida la existencia legal del taller sin intermediar contractualmente en el arreglo mecánico, preservando el rol de portal de contacto.
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" size="lg" className="h-11 flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="cta" size="lg" className="h-11 flex-1">
              Enviar para Auditoría
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
