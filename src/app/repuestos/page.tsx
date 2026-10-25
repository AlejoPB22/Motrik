"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Minus, Plus, ShieldCheck, SlidersHorizontal, Truck, X } from "lucide-react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CATALOG, CATEGORIES, PARTS, cop, fitsVehicle, type Brand, type Part } from "@/data/mock";
import { useApp } from "@/lib/store";
import { Chip, Img, PageHeader, Stars } from "@/components/motrick/shared";
import { Checkout } from "@/components/motrick/Checkout";
import { cn } from "@/lib/utils";

export default function RepuestosPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Cargando catálogo...</div>}>
      <RepuestosContent />
    </Suspense>
  );
}

function RepuestosContent() {
  const { active } = useApp();
  const searchParams = useSearchParams();
  const router = useRouter();
  const partParam = searchParams.get("part");

  const [brand, setBrand] = useState<Brand | "">(active.brand);
  const [model, setModel] = useState(active.model);
  const [year, setYear] = useState<string>(String(active.year));
  const [cat, setCat] = useState<string>("");
  const [sort, setSort] = useState("relevance");
  const [onlyFit, setOnlyFit] = useState(true);
  const [loading, setLoading] = useState(true);
  const [checkout, setCheckout] = useState<{ part: Part; qty: number } | null>(null);

  useEffect(() => {
    setBrand(active.brand);
    setModel(active.model);
    setYear(String(active.year));
  }, [active]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, [brand, model, year, cat, sort, onlyFit]);

  const filterV = brand && model && year ? { brand, model, year: Number(year) } : null;
  const list = useMemo(() => {
    let l = PARTS.filter((p) => (!cat || p.category === cat) && (!onlyFit || !filterV || fitsVehicle(p, filterV)));
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "rating") l = [...l].sort((a, b) => b.rating - a.rating);
    return l;
  }, [cat, sort, onlyFit, filterV?.brand, filterV?.model, filterV?.year]);

  const selected = PARTS.find((p) => p.id === partParam) ?? null;

  return (
    <div>
      <PageHeader
        eyebrow="Repuestos & Tienda"
        title="Repuestos garantizados para tu auto"
        subtitle="Filtra por vehículo y compra solo lo que encaja con compatibilidad garantizada."
      />

      <div className="sticky top-16 z-30 -mx-4 mb-6 border-y border-border bg-background/90 px-4 py-3 backdrop-blur-xl md:top-[70px] md:mx-0 md:rounded-2xl md:border md:bg-card md:px-4 md:shadow-soft">
        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="hidden h-4 w-4 text-muted-foreground md:block" />
          <Select value={brand} onValueChange={(v) => { setBrand(v as Brand); setModel(""); setYear(""); }}>
            <SelectTrigger className="h-10 w-[140px] rounded-full"><SelectValue placeholder="Marca" /></SelectTrigger>
            <SelectContent>{Object.keys(CATALOG).map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={model} onValueChange={(v) => { setModel(v); setYear(""); }} disabled={!brand}>
            <SelectTrigger className="h-10 w-[140px] rounded-full"><SelectValue placeholder="Modelo" /></SelectTrigger>
            <SelectContent>{brand && Object.keys(CATALOG[brand]).map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={year} onValueChange={setYear} disabled={!model}>
            <SelectTrigger className="h-10 w-[110px] rounded-full"><SelectValue placeholder="Año" /></SelectTrigger>
            <SelectContent>{brand && model && CATALOG[brand][model]?.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent>
          </Select>
          <button
            onClick={() => setOnlyFit(!onlyFit)}
            className={cn(
              "flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all",
              onlyFit ? "border-success/40 bg-success-soft text-success" : "border-border text-muted-foreground"
            )}
          >
            <BadgeCheck className="h-4 w-4" /> Solo compatibles
          </button>
          <div className="ml-auto">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-10 w-[170px] rounded-full"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Más relevantes</SelectItem>
                <SelectItem value="low">Menor precio</SelectItem>
                <SelectItem value="high">Mayor precio</SelectItem>
                <SelectItem value="rating">Mejor calificados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5">
          <Chip active={!cat} onClick={() => setCat("")}>Todo</Chip>
          {CATEGORIES.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Chip>)}
        </div>
      </div>

      <p className="mb-4 text-sm text-muted-foreground">
        {loading ? "Buscando…" : `${list.length} resultados`}{filterV && onlyFit ? ` para ${filterV.brand} ${filterV.model} ${filterV.year}` : ""}
      </p>

      {loading ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
              <Skeleton className="aspect-square rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-20 text-center">
          <p className="font-medium">No hay repuestos para estos filtros</p>
          <p className="mt-1 text-sm text-muted-foreground">Prueba otra categoría o desactiva &quot;Solo compatibles&quot;.</p>
          <Button variant="outline" className="mt-4" onClick={() => { setCat(""); setOnlyFit(false); }}>
            Ver todo el catálogo
          </Button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {list.map((p, i) => {
            const fit = fitsVehicle(p, filterV ?? active);
            return (
              <motion.button
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push(`/repuestos?part=${p.id}`)}
                className="group overflow-hidden rounded-2xl border border-border bg-card text-left shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="relative">
                  <Img src={p.images[0] ?? ""} alt={p.name} className="aspect-square transition-transform duration-500 group-hover:scale-[1.03]" />
                  {fit && (
                    <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-success px-2 py-1 text-[10px] font-semibold text-success-foreground shadow-sm">
                      <BadgeCheck className="h-3 w-3" /> Compatible con tu auto
                    </span>
                  )}
                </div>
                <div className="p-3.5 md:p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{p.brand}</p>
                  <p className="mt-0.5 line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug">{p.name}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <Stars value={p.rating} size={12} />
                    <span className="text-xs text-muted-foreground">({p.reviews})</span>
                  </div>
                  {p.oldPrice && <p className="mt-2 text-xs text-muted-foreground line-through">{cop(p.oldPrice)}</p>}
                  <div className={cn("flex items-baseline gap-2", !p.oldPrice && "mt-2")}>
                    <span className="font-semibold text-lg">{cop(p.price)}</span>
                    {p.oldPrice && <span className="text-xs font-semibold text-success">{Math.round((1 - p.price / p.oldPrice) * 100)}% OFF</span>}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-2 text-xs">
                    {p.freeShipping && <span className="font-medium text-success">Envío gratis</span>}
                    <span className={p.stock < 8 ? "text-cta" : "text-muted-foreground"}>
                      {p.stock < 8 ? `¡Últimas ${p.stock}!` : "En stock"}
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      )}

      <PartDetail
        part={selected}
        onClose={() => router.push("/repuestos")}
        onBuy={(qty) => {
          if (selected) {
            setCheckout({ part: selected, qty });
            router.push("/repuestos");
          }
        }}
      />
      <Checkout part={checkout?.part ?? null} qty={checkout?.qty ?? 1} open={!!checkout} onOpenChange={(o) => !o && setCheckout(null)} />
    </div>
  );
}

function PartDetail({ part, onClose, onBuy }: { part: Part | null; onClose: () => void; onBuy: (qty: number) => void }) {
  const { active } = useApp();
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [last, setLast] = useState<Part | null>(part);

  useEffect(() => {
    if (part) {
      setLast(part);
      setImg(0);
      setQty(1);
    }
  }, [part]);

  const p = part ?? last;

  return (
    <Sheet open={!!part} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-xl [&>button]:hidden">
        {p && (
          <>
            <SheetTitle className="sr-only">{p.name}</SheetTitle>
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div key={img} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Img src={p.images[img] ?? ""} alt={p.name} className="aspect-[4/3]" />
                </motion.div>
              </AnimatePresence>
              <button onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/90 shadow-sm backdrop-blur transition hover:bg-background">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex gap-2 px-6 pt-4">
              {p.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImg(i)}
                  className={cn("overflow-hidden rounded-lg border-2 transition-all", i === img ? "border-primary" : "border-transparent opacity-60 hover:opacity-100")}
                >
                  <img src={src} alt="" className="h-14 w-14 object-cover" />
                </button>
              ))}
            </div>
            <div className="space-y-6 p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{p.brand} · {p.category}</p>
                <h2 className="mt-1 text-2xl font-semibold leading-tight">{p.name}</h2>
                <div className="mt-2 flex items-center gap-2">
                  <Stars value={p.rating} />
                  <span className="text-sm text-muted-foreground">{p.rating} · {p.reviews} opiniones</span>
                </div>
                <p className="mt-4 text-3xl font-semibold">{cop(p.price)}</p>
                <p className="text-sm text-muted-foreground">Hasta 12 cuotas sin interés</p>
              </div>

              {fitsVehicle(p, active) ? (
                <div className="flex gap-3 rounded-xl border border-success/30 bg-success-soft p-4">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-success" />
                  <div>
                    <p className="text-sm font-semibold text-success">Compatibilidad garantizada</p>
                    <p className="text-sm text-muted-foreground">Encaja en tu {active.brand} {active.model} {active.year}. Si no, te devolvemos el dinero.</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                  No verificado para tu {active.model} {active.year}. Revisa la tabla de compatibilidad.
                </div>
              )}

              <div>
                <h3 className="mb-2 text-sm font-semibold">Especificaciones técnicas</h3>
                <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border text-sm">
                  {Object.entries(p.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between px-4 py-2.5">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="font-medium">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold">Compatible con</h3>
                <div className="flex flex-wrap gap-2">
                  {p.fits.map((f) => (
                    <span key={f.model} className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                      {f.brand} {f.model} · {Math.min(...f.years)}–{Math.max(...f.years)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Truck className="h-4 w-4" />
                {p.freeShipping ? "Envío gratis · llega en 2–4 días" : "Envío desde $12.900"}
              </div>
            </div>
            <div className="sticky bottom-0 flex items-center gap-3 border-t border-border bg-background/95 p-4 backdrop-blur">
              <div className="flex items-center rounded-full border border-border">
                <button aria-label="Menos" onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-11 w-10 place-items-center text-muted-foreground hover:text-foreground">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                <button aria-label="Más" onClick={() => setQty(Math.min(p.stock, qty + 1))} className="grid h-11 w-10 place-items-center text-muted-foreground hover:text-foreground">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button variant="cta" size="lg" className="h-12 flex-1 rounded-full" onClick={() => onBuy(qty)}>
                Comprar ahora
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
