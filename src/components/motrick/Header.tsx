"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, Car, Check, ChevronDown, LogOut, Moon, NotebookPen, Package, Search, Settings, Sun, User, Wrench } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { PARTS, WORKSHOPS, cop, formatVehicleName } from "@/data/mock";
import { useApp } from "@/lib/store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/repuestos", label: "Repuestos & Tienda", short: "Tienda", icon: Package },
  { to: "/directorio", label: "Talleres y Mecánicos", short: "Talleres", icon: Wrench },
  { to: "/bitacora", label: "Mi Garaje / Bitácora", short: "Garaje", icon: NotebookPen },
] as const;

export function Header() {
  const { vehicles, active, setActiveId, dark, toggleDark } = useApp();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const blurT = useRef<ReturnType<typeof setTimeout>>(undefined);

  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return { parts: [], shops: [] };
    return {
      parts: PARTS.filter((p) => `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(t)).slice(0, 4),
      shops: WORKSHOPS.filter((w) => `${w.name} ${w.zone} ${w.specialties.join(" ")}`.toLowerCase().includes(t)).slice(0, 3),
    };
  }, [q]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-ink-foreground">
              <Car className="h-4 w-4" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">Motrick</span>
          </Link>

          <div className="relative flex-1 md:max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              onBlur={() => { blurT.current = setTimeout(() => setOpen(false), 150); }}
              placeholder="Buscar repuestos, talleres…"
              className="h-10 w-full rounded-full border border-input bg-card pl-9 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
            <AnimatePresence>
              {open && q.trim() && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-12 overflow-hidden rounded-xl border border-border bg-popover shadow-lift"
                >
                  {results.parts.length + results.shops.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">Sin resultados para &quot;{q}&quot;</p>
                  ) : (
                    <div className="max-h-96 overflow-y-auto p-1.5">
                      {results.parts.length > 0 && <p className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Repuestos</p>}
                      {results.parts.map((p) => (
                        <button key={p.id} onMouseDown={() => { router.push(`/repuestos?part=${p.id}`); setQ(""); }} className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-muted">
                          <img src={p.images[0]} alt="" className="h-9 w-9 rounded-md object-cover" />
                          <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.brand}</p></div>
                          <span className="text-sm font-semibold">{cop(p.price)}</span>
                        </button>
                      ))}
                      {results.shops.length > 0 && <p className="px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Talleres</p>}
                      {results.shops.map((w) => (
                        <button key={w.id} onMouseDown={() => { router.push(`/directorio?shop=${w.id}`); setQ(""); }} className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left hover:bg-muted">
                          <img src={w.image} alt="" className="h-9 w-9 rounded-md object-cover" />
                          <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{w.name}</p><p className="text-xs text-muted-foreground">{w.zone} · {w.rating}★</p></div>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="ml-auto flex items-center gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden items-center gap-2 rounded-full border border-border bg-card py-1.5 pl-2 pr-3 text-sm font-medium transition-colors hover:bg-muted sm:flex">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-accent text-accent-foreground"><Car className="h-3.5 w-3.5" /></span>
                <span className="max-w-[140px] truncate">{formatVehicleName(active.brand, active.model)} {active.year}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Vehículo activo</DropdownMenuLabel>
                {vehicles.map((v) => (
                  <DropdownMenuItem key={v.id} onClick={() => setActiveId(v.id)} className="gap-3 py-2">
                    <img src={v.image} alt="" className="h-9 w-12 rounded object-cover" />
                    <div className="flex-1"><p className="text-sm font-medium">{formatVehicleName(v.brand, v.model)} {v.year}</p><p className="text-xs text-muted-foreground">{v.plate}</p></div>
                    {v.id === active.id && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button onClick={toggleDark} aria-label="Cambiar tema" className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button aria-label="Notificaciones" className="relative hidden h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground sm:grid">
              <Bell className="h-4 w-4" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-cta" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Perfil" className="overflow-hidden rounded-full ring-2 ring-transparent transition hover:ring-border">
                <img src="https://i.pravatar.cc/80?img=12" alt="" className="h-9 w-9 object-cover" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel><p className="text-sm">Alejandro P.</p><p className="text-xs font-normal text-muted-foreground">Miembro desde 2024</p></DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem><User className="h-4 w-4 mr-2" /> Mi perfil</DropdownMenuItem>
                <DropdownMenuItem><Package className="h-4 w-4 mr-2" /> Mis compras</DropdownMenuItem>
                <DropdownMenuItem><Settings className="h-4 w-4 mr-2" /> Configuración</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem><LogOut className="h-4 w-4 mr-2" /> Cerrar sesión</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <nav className="mx-auto hidden max-w-7xl gap-1 px-4 md:flex md:px-6">
          {NAV.map((n) => {
            const isActive = pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                href={n.to}
                className={cn(
                  "group relative flex items-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors hover:text-foreground",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <n.icon className="h-4 w-4" />
                {n.label}
                {isActive && <motion.span layoutId="nav-underline" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
        {NAV.map((n) => {
          const isActive = pathname.startsWith(n.to);
          return (
            <Link
              key={n.to}
              href={n.to}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <n.icon className={cn("h-5 w-5", isActive && "stroke-[2.4]")} />
              {n.short}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
