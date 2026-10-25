"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BadgeCheck, Clock, MapPin, Phone, Star } from "lucide-react";
import { Suspense, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SPECIALTIES, WORKSHOPS, ZONES, type Specialty } from "@/data/mock";
import { Chip, Img, PageHeader, Stars } from "@/components/motrick/shared";
import { toast } from "sonner";

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

  const list = useMemo(
    () => WORKSHOPS.filter((w) => (zone === "all" || w.zone === zone) && (!top || w.rating >= 4) && specs.every((s) => w.specialties.includes(s))),
    [specs, zone, top],
  );
  const selected = WORKSHOPS.find((w) => w.id === shopParam) ?? null;
  const toggle = (s: Specialty) => setSpecs((p) => (p.includes(s) ? p.filter((x) => x !== s) : [...p, s]));

  return (
    <div>
      <PageHeader
        eyebrow="Directorio"
        title="Talleres y mecánicos verificados"
        subtitle="Talleres evaluados por la comunidad de conductores Motrick en Bogotá."
      />

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
          {(specs.length > 0 || zone !== "all" || top) && (
            <button
              onClick={() => { setSpecs([]); setZone("all"); setTop(false); }}
              className="ml-auto text-sm font-medium text-primary hover:underline"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">{list.length} talleres encontrados</p>
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
    </div>
  );
}
