"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Gauge,
  NotebookPen,
  Package,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { PARTS, cop, fitsVehicle } from "@/data/mock";
import { Img } from "@/components/motrick/shared";
import { cn } from "@/lib/utils";

const MODULES = [
  {
    to: "/repuestos",
    icon: Package,
    title: "Repuestos & Tienda",
    text: "Piezas originales y homologadas con compatibilidad garantizada para tu modelo.",
    badge: "Garantía OEM",
  },
  {
    to: "/directorio",
    icon: Wrench,
    title: "Talleres y Mecánicos",
    text: "Compara talleres certificados por zonas de Bogotá y valoraciones verificadas.",
    badge: "Ley 1480",
  },
  {
    to: "/bitacora",
    icon: NotebookPen,
    title: "Mi Garaje / Bitácora",
    text: "Historial cronológico de servicios, odómetro digital y control de documentos.",
    badge: "SOAT & Tecno",
  },
] as const;

interface ExpiryStatus {
  days: number;
  level: "ok" | "warning" | "urgent" | "expired";
  label: string;
  badge: string;
  cardClass: string;
  badgeClass: string;
  dotClass: string;
  icon: typeof ShieldCheck;
}

function calculateExpiryStatus(dateStr?: string | null): ExpiryStatus | null {
  if (!dateStr) return null;
  const target = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffMs = target.getTime() - nowMidnight.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      days: diffDays,
      level: "expired",
      label: `Vencido hace ${Math.abs(diffDays)} días`,
      badge: "Vencido",
      cardClass: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300 shadow-sm",
      badgeClass: "bg-red-500 text-white shadow-sm",
      dotClass: "bg-red-500 animate-ping",
      icon: ShieldAlert,
    };
  }

  if (diffDays <= 15) {
    return {
      days: diffDays,
      level: "urgent",
      label: diffDays === 0 ? "¡Vence hoy!" : `¡Vence en ${diffDays} días!`,
      badge: "¡Urgente!",
      cardClass: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300 shadow-sm",
      badgeClass: "bg-red-500 text-white shadow-sm",
      dotClass: "bg-red-500 animate-pulse",
      icon: AlertTriangle,
    };
  }

  if (diffDays <= 30) {
    return {
      days: diffDays,
      level: "warning",
      label: `Vence en ${diffDays} días`,
      badge: "Próximo a vencer",
      cardClass: "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300 shadow-sm",
      badgeClass: "bg-amber-500 text-white shadow-sm",
      dotClass: "bg-amber-400 animate-pulse",
      icon: Clock,
    };
  }

  return {
    days: diffDays,
    level: "ok",
    label: `Al día (${diffDays} días de vigencia)`,
    badge: "Vigente",
    cardClass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-sm",
    badgeClass: "bg-emerald-600 text-white shadow-sm",
    dotClass: "bg-emerald-400",
    icon: CheckCircle2,
  };
}

export default function HomePage() {
  const { active } = useApp();
  const picks = PARTS.filter((p) => fitsVehicle(p, active)).slice(0, 4);

  const soatStatus = calculateExpiryStatus(active.soatExpiry);
  const tecnoStatus = active.hasTecno !== false ? calculateExpiryStatus(active.tecnoExpiry) : null;

  return (
    <div className="space-y-10">
      {/* Hero 360° del Vehículo Activo */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-ink p-8 text-ink-foreground md:p-12 shadow-lift border border-ink-foreground/10"
      >
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            <span>Vehículo Activo · Garaje Motrik</span>
          </div>

          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Tu {active.brand} {active.model} {active.year}, bajo control.
          </h1>

          <p className="mt-3 flex items-center gap-2 text-sm md:text-base opacity-80">
            <Gauge className="h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong className="font-semibold text-white">{active.odometer.toLocaleString("es-CO")} km</strong> registrados · próximo cambio en ~1.800 km
            </span>
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/repuestos"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-cta px-6 text-sm font-semibold text-cta-foreground shadow-sm transition hover:brightness-105 active:scale-[0.98]"
            >
              Comprar repuestos <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/bitacora"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-ink-foreground/25 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10 active:scale-[0.98]"
            >
              Ver bitácora & documentos
            </Link>
          </div>
        </div>

        <img
          src={active.image}
          alt={active.model}
          className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-45 [mask-image:linear-gradient(to_right,transparent,black_45%)] md:block"
        />
      </motion.section>

      {/* Indicadores Visuales Dinámicos (Semáforos de Vencimiento) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" /> Estado Reglamentario Vehicular
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Control semafórico en tiempo real de documentos obligatorios en Colombia (SOAT y Tecnomecánica).
            </p>
          </div>
          <Link href="/bitacora" className="text-xs font-semibold text-primary hover:underline">
            Gestionar fechas →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Tarjeta SOAT */}
          {soatStatus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={cn("rounded-2xl border p-5 transition-all hover:shadow-soft", soatStatus.cardClass)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-75">Seguro Obligatorio (SOAT)</span>
                  </div>
                  <p className="text-xl font-bold tracking-tight">
                    {soatStatus.label}
                  </p>
                  <p className="text-xs opacity-80">
                    Fecha límite: {new Date(active.soatExpiry + "T12:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", soatStatus.badgeClass)}>
                    <span className={cn("h-2 w-2 rounded-full", soatStatus.dotClass)} />
                    {soatStatus.badge}
                  </span>
                  <Link
                    href="/bitacora"
                    className="text-[11px] font-semibold underline underline-offset-2 opacity-80 hover:opacity-100"
                  >
                    Actualizar
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tarjeta Tecnomecánica */}
          {tecnoStatus ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className={cn("rounded-2xl border p-5 transition-all hover:shadow-soft", tecnoStatus.cardClass)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider opacity-75">Revisión Técnico-Mecánica (CDA)</span>
                  </div>
                  <p className="text-xl font-bold tracking-tight">
                    {tecnoStatus.label}
                  </p>
                  <p className="text-xs opacity-80">
                    Fecha límite: {new Date(active.tecnoExpiry + "T12:00").toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold", tecnoStatus.badgeClass)}>
                    <span className={cn("h-2 w-2 rounded-full", tecnoStatus.dotClass)} />
                    {tecnoStatus.badge}
                  </span>
                  <Link
                    href="/bitacora"
                    className="text-[11px] font-semibold underline underline-offset-2 opacity-80 hover:opacity-100"
                  >
                    Actualizar
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="rounded-2xl border border-border bg-card/60 p-5 flex items-center justify-between text-muted-foreground text-xs">
              <div>
                <p className="font-semibold text-sm text-foreground">Revisión Técnico-Mecánica</p>
                <p className="mt-0.5">Vehículo nuevo dentro del periodo de exención legal.</p>
              </div>
              <span className="rounded-full bg-accent px-2.5 py-1 font-medium text-[11px]">Exento</span>
            </div>
          )}
        </div>
      </section>

      {/* Módulos Principales de Navegación */}
      <section className="grid gap-4 md:grid-cols-3">
        {MODULES.map((m, i) => (
          <motion.div
            key={m.to}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Link
              href={m.to}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-foreground group-hover:scale-105 transition-transform">
                  <m.icon className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                  {m.badge}
                </span>
              </div>
              <h2 className="mt-5 text-lg font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                {m.title}
              </h2>
              <p className="mt-1.5 flex-1 text-sm text-muted-foreground leading-relaxed">
                {m.text}
              </p>
              <span className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-primary">
                Explorar módulo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* Repuestos Compatibles Destacados */}
      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Compatibles con tu {active.brand} {active.model}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Filtrado técnico automático validado para el año {active.year}.
            </p>
          </div>
          <Link href="/repuestos" className="text-sm font-semibold text-primary hover:underline">
            Ver catálogo completo ({PARTS.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {picks.map((p) => (
            <Link
              key={p.id}
              href={`/repuestos?part=${p.id}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative">
                <Img src={p.images[0] ?? ""} alt={p.name} className="aspect-square group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute left-2.5 top-2.5 rounded-full bg-emerald-600/95 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm border border-emerald-400/30">
                  100% Compatible
                </span>
              </div>
              <div className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{p.brand}</p>
                <p className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{p.name}</p>
                <p className="mt-1.5 font-bold text-foreground text-base">{cop(p.price)}</p>
                {p.freeShipping && (
                  <span className="mt-1 block text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Envío gratis
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
