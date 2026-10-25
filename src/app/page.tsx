"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Gauge, NotebookPen, Package, Wrench } from "lucide-react";
import { useApp } from "@/lib/store";
import { PARTS, cop, fitsVehicle } from "@/data/mock";
import { Img } from "@/components/motrick/shared";

const MODULES = [
  { to: "/repuestos", icon: Package, title: "Repuestos & Tienda", text: "Piezas con compatibilidad garantizada para tu modelo." },
  { to: "/directorio", icon: Wrench, title: "Talleres y Mecánicos", text: "Compara especialidades, zonas y reseñas reales." },
  { to: "/bitacora", icon: NotebookPen, title: "Mi Garaje / Bitácora", text: "Historial de servicios, kilometraje y piezas instaladas." },
] as const;

export default function HomePage() {
  const { active } = useApp();
  const picks = PARTS.filter((p) => fitsVehicle(p, active)).slice(0, 4);

  return (
    <div className="space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-ink p-8 text-ink-foreground md:p-12 shadow-lift"
      >
        <div className="relative z-10 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Hola, Alejandro</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">Tu {active.model} {active.year}, bajo control.</h1>
          <p className="mt-3 flex items-center gap-2 opacity-75">
            <Gauge className="h-4 w-4" />
            {active.odometer.toLocaleString("es-CO")} km · próximo cambio de aceite en ~1.800 km
          </p>
          {active.soatExpiry && (
            <p className="mt-1.5 flex items-center gap-2 text-xs font-medium text-amber-300">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              SOAT vence el {new Date(active.soatExpiry + "T12:00").toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
              {active.tecnoExpiry && ` · Tecnomecánica el ${new Date(active.tecnoExpiry + "T12:00").toLocaleDateString("es-CO", { day: "numeric", month: "short" })}`}
            </p>
          )}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/repuestos"
              className="inline-flex h-11 items-center gap-2 rounded-full bg-cta px-6 text-sm font-semibold text-cta-foreground transition hover:brightness-105"
            >
              Comprar repuestos <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/bitacora"
              className="inline-flex h-11 items-center rounded-full border border-ink-foreground/25 px-6 text-sm font-semibold transition hover:bg-ink-foreground/10"
            >
              Ver bitácora & documentos
            </Link>
          </div>
        </div>
        <img
          src={active.image}
          alt=""
          className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover opacity-50 [mask-image:linear-gradient(to_right,transparent,black_50%)] md:block"
        />
      </motion.section>

      <section className="grid gap-4 md:grid-cols-3">
        {MODULES.map((m, i) => (
          <motion.div key={m.to} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Link
              href={m.to}
              className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                <m.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">{m.title}</h2>
              <p className="mt-1 flex-1 text-sm text-muted-foreground">{m.text}</p>
              <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                Entrar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </motion.div>
        ))}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-xl font-semibold">Compatibles con tu {active.model}</h2>
          <Link href="/repuestos" className="text-sm font-medium text-primary hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {picks.map((p) => (
            <Link
              key={p.id}
              href={`/repuestos?part=${p.id}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:shadow-lift"
            >
              <Img src={p.images[0] ?? ""} alt={p.name} className="aspect-square" />
              <div className="p-4">
                <p className="line-clamp-1 text-sm font-medium">{p.name}</p>
                <p className="mt-1 font-semibold text-foreground">{cop(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
