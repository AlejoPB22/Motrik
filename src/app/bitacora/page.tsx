"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Edit3,
  FileCheck2,
  Fuel,
  Gauge,
  Package,
  Plus,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { PARTS, WORKSHOPS, cop, type Vehicle } from "@/data/mock";
import { useApp } from "@/lib/store";
import { Img, PageHeader } from "@/components/motrick/shared";
import { cn } from "@/lib/utils";

const km = (n: number) => `${n.toLocaleString("es-CO")} km`;

// Helper para calcular días restantes y estado de vencimiento
function getExpiryStatus(dateStr?: string) {
  if (!dateStr) return { status: "missing", days: null, text: "Sin registrar", color: "text-muted-foreground", bg: "bg-muted" };
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: "expired",
      days: Math.abs(diffDays),
      text: `Venció hace ${Math.abs(diffDays)} días`,
      badge: "Vencido",
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/30",
      icon: AlertTriangle,
    };
  }
  if (diffDays <= 30) {
    return {
      status: "warning",
      days: diffDays,
      text: `Vence en ${diffDays} días`,
      badge: "Por vencer",
      color: "text-cta",
      bg: "bg-cta/10 border-cta/30",
      icon: Clock,
    };
  }
  return {
    status: "ok",
    days: diffDays,
    text: `Vigente (${diffDays} días)`,
    badge: "Vigente",
    color: "text-success",
    bg: "bg-success-soft border-success/30",
    icon: CheckCircle2,
  };
}

export default function BitacoraPage() {
  const { vehicles, active, setActiveId, records } = useApp();
  const [openMaintenance, setOpenMaintenance] = useState(false);
  const [openDocs, setOpenDocs] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const list = records.filter((r) => r.vehicleId === active.id).sort((a, b) => b.date.localeCompare(a.date));
  const spent = list.reduce((s, r) => s + r.cost, 0);

  const soatStatus = getExpiryStatus(active.soatExpiry);
  const tecnoStatus = getExpiryStatus(active.tecnoExpiry);

  return (
    <div>
      <PageHeader
        eyebrow="Mi Garaje"
        title="Bitácora de mantenimiento y documentos"
        subtitle="Historial técnico, kilometraje y recordatorios de SOAT y Tecnomecánica."
      >
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="lg" className="h-11 rounded-full" onClick={() => setOpenDocs(true)}>
            <FileCheck2 className="h-4 w-4 mr-1 text-primary" /> SOAT & Tecnomecánica
          </Button>
          <Button variant="cta" size="lg" className="h-11 rounded-full" onClick={() => setOpenMaintenance(true)}>
            <Plus className="h-4 w-4 mr-1" /> Registrar Mantenimiento
          </Button>
        </div>
      </PageHeader>

      <div className="mb-6 flex gap-3 overflow-x-auto pb-1">
        {vehicles.map((v) => (
          <button
            key={v.id}
            onClick={() => setActiveId(v.id)}
            className={cn(
              "flex shrink-0 items-center gap-3 rounded-2xl border p-2 pr-5 text-left transition-all",
              v.id === active.id ? "border-foreground bg-card shadow-soft" : "border-border opacity-70 hover:opacity-100"
            )}
          >
            <img src={v.image} alt="" className="h-12 w-16 rounded-xl object-cover" />
            <div>
              <p className="text-sm font-semibold">{v.brand} {v.model}</p>
              <p className="text-xs text-muted-foreground">{v.year} · {v.plate}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-6 lg:sticky lg:top-24 h-fit">
          {/* Card del Vehículo */}
          <motion.aside
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
          >
            <Img src={active.image} alt={active.model} className="aspect-[16/10]" />
            <div className="p-5">
              <h2 className="text-xl font-semibold">{active.brand} {active.model} {active.year}</h2>
              <p className="text-sm text-muted-foreground">Placa {active.plate} · {active.color}</p>
              <div className="mt-5 rounded-xl bg-gradient-ink p-4 text-ink-foreground">
                <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-70">
                  <Gauge className="h-3.5 w-3.5" /> Odómetro actual
                </p>
                <p className="mt-1 font-mono text-3xl font-semibold tracking-tight">
                  {active.odometer.toLocaleString("es-CO")}
                  <span className="ml-1 text-base opacity-60">km</span>
                </p>
              </div>
              <dl className="mt-4 space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <dt className="flex items-center gap-2 text-muted-foreground"><Settings2 className="h-4 w-4" />Motor</dt>
                  <dd className="font-medium">{active.engine}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="flex items-center gap-2 text-muted-foreground"><Fuel className="h-4 w-4" />Combustible</dt>
                  <dd className="font-medium">{active.fuel}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="flex items-center gap-2 text-muted-foreground"><Wrench className="h-4 w-4" />Transmisión</dt>
                  <dd className="font-medium">{active.transmission}</dd>
                </div>
              </dl>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Servicios</p>
                  <p className="text-xl font-semibold">{list.length}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Invertido</p>
                  <p className="text-xl font-semibold">{cop(spent)}</p>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Card de Documentación Legal & Vencimientos */}
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-base">Papeles y Vencimientos</h3>
              </div>
              <button
                onClick={() => setOpenDocs(true)}
                className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
              >
                <Edit3 className="h-3 w-3" /> Editar
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {/* SOAT */}
              <div className={cn("p-3.5 rounded-xl border transition-all", soatStatus.bg)}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">SOAT</span>
                    <p className="font-semibold text-sm mt-0.5">
                      {active.soatExpiry
                        ? new Date(active.soatExpiry + "T12:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })
                        : "No configurado"}
                    </p>
                  </div>
                  <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1", soatStatus.color)}>
                    {soatStatus.text}
                  </span>
                </div>
              </div>

              {/* Tecnomecánica */}
              {active.hasTecno !== false ? (
                <div className={cn("p-3.5 rounded-xl border transition-all", tecnoStatus.bg)}>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">Tecnomecánica</span>
                      <p className="font-semibold text-sm mt-0.5">
                        {active.tecnoExpiry
                          ? new Date(active.tecnoExpiry + "T12:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })
                          : "No configurado"}
                      </p>
                    </div>
                    <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-semibold border flex items-center gap-1", tecnoStatus.color)}>
                      {tecnoStatus.text}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl border border-border bg-muted/40 text-xs text-muted-foreground">
                  Vehículo nuevo exento de revisión técnico-mecánica.
                </div>
              )}
            </div>

            {(soatStatus.status === "warning" || soatStatus.status === "expired" || tecnoStatus.status === "warning" || tecnoStatus.status === "expired") && (
              <div className="mt-4 flex items-start gap-2.5 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  Tienes documentos próximos a vencer o vencidos. Renueva a tiempo para evitar sanciones y circular legalmente.
                </p>
              </div>
            )}
          </div>
        </div>

        <section>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Historial de Mantenimientos</h3>
          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border py-16 text-center text-sm text-muted-foreground">
              Aún no hay registros para este vehículo.
            </div>
          ) : (
            <ol className="relative space-y-4 before:absolute before:bottom-4 before:left-[19px] before:top-4 before:w-px before:bg-border">
              <AnimatePresence initial={false}>
                {list.map((r, i) => {
                  const isOpen = expanded === r.id;
                  return (
                    <motion.li
                      key={r.id}
                      layout
                      initial={{ opacity: 0, y: -12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="relative pl-12"
                    >
                      <span className={cn("absolute left-2.5 top-5 grid h-[19px] w-[19px] place-items-center rounded-full border-2 border-background", i === 0 ? "bg-primary" : "bg-muted-foreground/40")} />
                      <button
                        onClick={() => setExpanded(isOpen ? null : r.id)}
                        className="w-full rounded-2xl border border-border bg-card p-4 text-left shadow-soft transition-all hover:shadow-lift"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{r.title}</p>
                            <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(r.date + "T12:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                              </span>
                              <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" />{km(r.km)}</span>
                              <span className="flex items-center gap-1"><Wrench className="h-3.5 w-3.5" />{r.workshop}</span>
                            </p>
                          </div>
                          <ChevronDown className={cn("mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")} />
                        </div>
                        {r.part && (
                          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">
                            <Package className="h-3 w-3" />{r.part}
                          </span>
                        )}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                              <div className="mt-3 border-t border-border pt-3 text-sm">
                                <p className="text-muted-foreground">{r.description}</p>
                                <p className="mt-2 font-medium">Costo: {cop(r.cost)}</p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </button>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ol>
          )}
        </section>
      </div>

      <MaintenanceDialog open={openMaintenance} onOpenChange={setOpenMaintenance} />
      <DocumentModal vehicle={active} open={openDocs} onOpenChange={setOpenDocs} />
    </div>
  );
}

// Modal para configurar SOAT y Tecnomecánica
function DocumentModal({ vehicle, open, onOpenChange }: { vehicle: Vehicle; open: boolean; onOpenChange: (o: boolean) => void }) {
  const { updateVehicle } = useApp();
  const [soat, setSoat] = useState(vehicle.soatExpiry || "");
  const [tecno, setTecno] = useState(vehicle.tecnoExpiry || "");
  const [hasTecno, setHasTecno] = useState(vehicle.hasTecno ?? true);

  const save = () => {
    updateVehicle(vehicle.id, {
      soatExpiry: soat,
      tecnoExpiry: hasTecno ? tecno : undefined,
      hasTecno,
    });
    toast.success("Fechas de documentos actualizadas", {
      description: `Recordatorios guardados para tu ${vehicle.model} (${vehicle.plate})`,
    });
    onOpenChange(false);
  };

  const inputCls = "h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogTitle className="text-xl flex items-center gap-2">
          <FileCheck2 className="h-5 w-5 text-primary" /> Documentos Obligatorios
        </DialogTitle>
        <p className="-mt-2 text-sm text-muted-foreground">
          {vehicle.brand} {vehicle.model} · Placa {vehicle.plate}
        </p>

        <div className="space-y-4 pt-2">
          {/* Campo SOAT */}
          <div className="rounded-xl border border-border p-4 bg-muted/20">
            <label className="block">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-semibold">Vencimiento del SOAT</span>
                <span className="text-xs text-muted-foreground font-mono">Anual</span>
              </div>
              <input
                type="date"
                className={inputCls}
                value={soat}
                onChange={(e) => setSoat(e.target.value)}
              />
              <span className="mt-1.5 block text-xs text-muted-foreground">
                Te notificaremos cuando falten 30, 15 y 5 días antes de vencer.
              </span>
            </label>
          </div>

          {/* Campo Tecnomecánica */}
          <div className="rounded-xl border border-border p-4 bg-muted/20">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-sm font-semibold block">Revisión Técnico-Mecánica</span>
                <span className="text-xs text-muted-foreground">¿Este vehículo requiere revisión?</span>
              </div>
              <Switch checked={hasTecno} onCheckedChange={setHasTecno} />
            </div>

            {hasTecno && (
              <label className="block pt-2 border-t border-border/60">
                <span className="text-xs font-medium text-muted-foreground mb-1.5 block">Fecha de vencimiento</span>
                <input
                  type="date"
                  className={inputCls}
                  value={tecno}
                  onChange={(e) => setTecno(e.target.value)}
                />
              </label>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="lg" className="h-11 flex-1" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button variant="cta" size="lg" className="h-11 flex-1" onClick={save}>
              Guardar Recordatorios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MaintenanceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { active, addRecord } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({ date: today, km: "", title: "", description: "", workshop: WORKSHOPS[0]!.name, cost: "" });
  const [hasPart, setHasPart] = useState(false);
  const [partQ, setPartQ] = useState("");
  const [part, setPart] = useState("");
  const [err, setErr] = useState("");
  const matches = useMemo(() => (partQ.trim() ? PARTS.filter((p) => `${p.name} ${p.brand}`.toLowerCase().includes(partQ.toLowerCase())).slice(0, 4) : []), [partQ]);
  const inputCls = "h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10";

  const submit = () => {
    const kmN = Number(f.km);
    if (!f.title.trim()) return setErr("Describe el servicio realizado.");
    if (!kmN) return setErr("Ingresa el kilometraje.");
    addRecord({ vehicleId: active.id, date: f.date, km: kmN, title: f.title.trim(), description: f.description.trim() || "Sin notas adicionales.", workshop: f.workshop, cost: Number(f.cost) || 0, part: hasPart ? (part || partQ.trim() || undefined) : undefined });
    toast.success("Mantenimiento registrado", { description: `${f.title} · ${km(kmN)}` });
    onOpenChange(false);
    setF({ date: today, km: "", title: "", description: "", workshop: WORKSHOPS[0]!.name, cost: "" });
    setHasPart(false);
    setPartQ("");
    setPart("");
    setErr("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-lg overflow-y-auto">
        <DialogTitle className="text-xl">Registrar mantenimiento</DialogTitle>
        <p className="-mt-2 text-sm text-muted-foreground">{active.brand} {active.model} {active.year} · {km(active.odometer)}</p>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="mb-1.5 block text-xs font-medium text-muted-foreground">Fecha</span><input type="date" className={inputCls} value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} /></label>
            <label className="block"><span className="mb-1.5 block text-xs font-medium text-muted-foreground">Kilometraje</span><input inputMode="numeric" className={cn(inputCls, "font-mono")} placeholder={String(active.odometer)} value={f.km} onChange={(e) => setF({ ...f, km: e.target.value.replace(/\D/g, "") })} /></label>
          </div>
          <label className="block"><span className="mb-1.5 block text-xs font-medium text-muted-foreground">Servicio</span><input className={inputCls} placeholder="Ej. Cambio de aceite sintético" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} /></label>
          <label className="block"><span className="mb-1.5 block text-xs font-medium text-muted-foreground">Descripción</span><textarea rows={3} className={cn(inputCls, "h-auto py-2.5")} placeholder="Detalles del trabajo realizado" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block"><span className="mb-1.5 block text-xs font-medium text-muted-foreground">Taller</span>
              <select className={inputCls} value={f.workshop} onChange={(e) => setF({ ...f, workshop: e.target.value })}>{WORKSHOPS.map((w) => <option key={w.id}>{w.name}</option>)}<option>Otro / Particular</option></select>
            </label>
            <label className="block"><span className="mb-1.5 block text-xs font-medium text-muted-foreground">Costo (COP)</span><input inputMode="numeric" className={cn(inputCls, "font-mono")} placeholder="0" value={f.cost} onChange={(e) => setF({ ...f, cost: e.target.value.replace(/\D/g, "") })} /></label>
          </div>

          <div className="rounded-xl border border-border p-4">
            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span><span className="block text-sm font-medium">¿Se instaló pieza o repuesto nuevo?</span><span className="text-xs text-muted-foreground">Vincúlalo al historial del vehículo</span></span>
              <Switch checked={hasPart} onCheckedChange={setHasPart} />
            </label>
            <AnimatePresence>
              {hasPart && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="pt-4">
                    <input className={inputCls} placeholder="Busca en el catálogo o escribe la pieza" value={part || partQ} onChange={(e) => { setPart(""); setPartQ(e.target.value); }} />
                    {!part && matches.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {matches.map((p) => (
                          <button key={p.id} type="button" onClick={() => setPart(`${p.name} · ${p.brand}`)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-muted">
                            <img src={p.images[0]} alt="" className="h-8 w-8 rounded object-cover" /><span className="flex-1 text-sm">{p.name}</span><span className="text-xs text-muted-foreground">{p.brand}</span>
                          </button>
                        ))}
                      </div>
                    )}
                    {part && <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-success"><Package className="h-3.5 w-3.5" /> Vinculado del catálogo</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {err && <p className="text-sm text-destructive">{err}</p>}
          <div className="flex gap-2">
            <Button variant="outline" size="lg" className="h-11" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button variant="cta" size="lg" className="h-11 flex-1" onClick={submit}>Guardar registro</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
