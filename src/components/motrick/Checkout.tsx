"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CreditCard, Loader2, Lock, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cop, type Part } from "@/data/mock";
import { cn } from "@/lib/utils";

function Field({ label, err, show, children }: { label: string; err: string; show: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
      {show && err && <span className="mt-1 block text-xs text-destructive">{err}</span>}
    </label>
  );
}

const STEPS = ["Resumen", "Pago", "Procesando", "Listo"];

export function Checkout({ part, qty, open, onOpenChange }: { part: Part | null; qty: number; open: boolean; onOpenChange: (o: boolean) => void }) {
  const [step, setStep] = useState(0);
  const [card, setCard] = useState({ number: "", name: "", exp: "", cvv: "" });
  const [flip, setFlip] = useState(false);
  const [touched, setTouched] = useState(false);
  const [order] = useState(() => `MT-${Math.floor(100000 + Math.random() * 900000)}`);

  useEffect(() => { if (open) { setStep(0); setTouched(false); setCard({ number: "", name: "", exp: "", cvv: "" }); } }, [open]);
  useEffect(() => { if (step === 2) { const t = setTimeout(() => setStep(3), 2200); return () => clearTimeout(t); } return undefined; }, [step]);

  if (!part) return null;
  const subtotal = part.price * qty;
  const shipping = part.freeShipping ? 0 : 12900;
  const total = subtotal + shipping;

  const digits = card.number.replace(/\D/g, "");
  const errors = {
    number: digits.length !== 16 ? "Ingresa 16 dígitos" : "",
    name: card.name.trim().length < 3 ? "Nombre como aparece en la tarjeta" : "",
    exp: !/^(0[1-9]|1[0-2])\/\d{2}$/.test(card.exp) ? "Formato MM/AA" : "",
    cvv: !/^\d{3,4}$/.test(card.cvv) ? "3 o 4 dígitos" : "",
  };
  const valid = Object.values(errors).every((e) => !e);
  const fmtNum = (v: string) => v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  const fmtExp = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d; };

  const inputCls = "h-11 w-full rounded-lg border border-input bg-card px-3.5 text-sm outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <Dialog open={open} onOpenChange={(o) => step !== 2 && onOpenChange(o)}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Checkout</DialogTitle>
        <div className="flex items-center gap-2 border-b border-border px-6 py-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full text-[11px] font-semibold transition-colors", i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{i + 1}</div>
              <span className={cn("hidden text-xs font-medium sm:block", i <= step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
              {i < STEPS.length - 1 && <div className={cn("h-px flex-1 transition-colors", i < step ? "bg-primary" : "bg-border")} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }} className="p-6">
            {step === 0 && (
              <div className="space-y-5">
                <h3 className="text-lg font-semibold">Resumen de compra</h3>
                <div className="flex gap-4 rounded-xl border border-border p-3">
                  <img src={part.images[0]} alt="" className="h-20 w-20 rounded-lg object-cover" />
                  <div className="flex-1"><p className="text-sm font-medium leading-snug">{part.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{part.brand} · Cantidad {qty}</p><p className="mt-2 font-semibold">{cop(subtotal)}</p></div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{cop(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Envío</span><span className={shipping === 0 ? "font-medium text-success" : ""}>{shipping === 0 ? "Gratis" : cop(shipping)}</span></div>
                  <div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><span>Total</span><span>{cop(total)}</span></div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2.5 text-xs text-muted-foreground"><Truck className="h-4 w-4" /> Llega entre 2 y 4 días hábiles a Bogotá</div>
                <Button variant="cta" size="lg" className="h-12 w-full" onClick={() => setStep(1)}>Continuar al pago</Button>
              </div>
            )}
            {step === 1 && (
              <div className="space-y-5">
                <div style={{ perspective: 1000 }} className="mx-auto h-44 w-full max-w-[320px]">
                  <motion.div animate={{ rotateY: flip ? 180 : 0 }} transition={{ duration: 0.5 }} style={{ transformStyle: "preserve-3d" }} className="relative h-full w-full">
                    <div style={{ backfaceVisibility: "hidden" }} className="absolute inset-0 flex flex-col justify-between rounded-2xl bg-gradient-ink p-5 text-ink-foreground shadow-lift">
                      <div className="flex justify-between"><div className="h-8 w-11 rounded-md bg-cta/80" /><CreditCard className="h-6 w-6 opacity-70" /></div>
                      <p className="font-mono text-lg tracking-[0.15em]">{card.number || "•••• •••• •••• ••••"}</p>
                      <div className="flex justify-between text-xs uppercase opacity-80"><span className="truncate">{card.name || "Nombre del titular"}</span><span>{card.exp || "MM/AA"}</span></div>
                    </div>
                    <div style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }} className="absolute inset-0 rounded-2xl bg-gradient-ink pt-6 text-ink-foreground shadow-lift">
                      <div className="h-10 bg-ink" />
                      <div className="mx-5 mt-4 flex h-9 items-center justify-end rounded bg-ink-foreground/90 px-3 font-mono text-sm text-ink">{card.cvv || "•••"}</div>
                    </div>
                  </motion.div>
                </div>
                <div className="space-y-3">
                  <Field show={touched} label="Número de tarjeta" err={errors.number}><input inputMode="numeric" className={cn(inputCls, "font-mono")} placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: fmtNum(e.target.value) })} onFocus={() => setFlip(false)} /></Field>
                  <Field show={touched} label="Nombre del titular" err={errors.name}><input className={inputCls} placeholder="Como aparece en la tarjeta" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} onFocus={() => setFlip(false)} /></Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field show={touched} label="Expiración" err={errors.exp}><input inputMode="numeric" className={cn(inputCls, "font-mono")} placeholder="MM/AA" value={card.exp} onChange={(e) => setCard({ ...card, exp: fmtExp(e.target.value) })} onFocus={() => setFlip(false)} /></Field>
                    <Field show={touched} label="CVV" err={errors.cvv}><input inputMode="numeric" className={cn(inputCls, "font-mono")} placeholder="123" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })} onFocus={() => setFlip(true)} onBlur={() => setFlip(false)} /></Field>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="lg" className="h-12" onClick={() => setStep(0)}>Atrás</Button>
                  <Button variant="cta" size="lg" className="h-12 flex-1" onClick={() => { setTouched(true); if (valid) setStep(2); }}><Lock className="h-4 w-4" /> Pagar {cop(total)}</Button>
                </div>
                <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground"><ShieldCheck className="h-3.5 w-3.5" /> Pago simulado · ningún cobro real</p>
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col items-center py-12 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h3 className="mt-5 text-lg font-semibold">Procesando pago…</h3>
                <p className="mt-1 text-sm text-muted-foreground">Verificando con tu banco. No cierres esta ventana.</p>
                <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-muted"><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2.1 }} className="h-full bg-primary" /></div>
              </div>
            )}
            {step === 3 && (
              <div className="text-center">
                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
                  <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
                </motion.div>
                <h3 className="mt-3 text-xl font-semibold">¡Compra confirmada!</h3>
                <p className="mt-1 text-sm text-muted-foreground">Te enviamos el comprobante a tu correo.</p>
                <div className="mt-6 rounded-xl border border-dashed border-border bg-muted/40 p-5 text-left text-sm">
                  <div className="mb-3 flex justify-between"><span className="text-muted-foreground">Orden</span><span className="font-mono font-semibold">{order}</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Producto</span><span className="max-w-[60%] truncate text-right">{part.name}</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Cantidad</span><span>{qty}</span></div>
                  <div className="flex justify-between py-1"><span className="text-muted-foreground">Tarjeta</span><span className="font-mono">•••• {digits.slice(-4)}</span></div>
                  <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold"><span>Total pagado</span><span>{cop(total)}</span></div>
                </div>
                <Button variant="ink" size="lg" className="mt-6 h-12 w-full" onClick={() => onOpenChange(false)}>Seguir comprando</Button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
