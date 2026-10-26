"use client";

import { BadgeCheck, Clock, MapPin, MessageCircle, Phone, ShieldCheck, Store, Wrench } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cop, WORKSHOPS, type Part, type Workshop } from "@/data/mock";
import { useRouter } from "next/navigation";

export function Checkout({
  part,
  qty,
  open,
  onOpenChange,
}: {
  part: Part | null;
  qty: number;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const router = useRouter();

  if (!part) return null;

  // Asignar taller aliado en Cartagena según especialidad de la pieza
  const cat = (part.category || "").toLowerCase();
  let workshop: Workshop = WORKSHOPS[0]; // Torque Automotriz (Manga) por defecto
  if (cat.includes("freno") || cat.includes("suspens")) {
    workshop = WORKSHOPS.find((w) => w.id === "w3") || WORKSHOPS[2]; // Frenos & Ejes del Caribe (Pie de la Popa)
  } else if (cat.includes("motor") || cat.includes("electr") || cat.includes("eléctr")) {
    workshop = WORKSHOPS.find((w) => w.id === "w2") || WORKSHOPS[1]; // MotorLab Diagnóstico (Bocagrande)
  }

  const subtotal = part.price * qty;
  const cleanPhone = (workshop.phone || "+576056607788").replace(/\s+/g, "");

  const whatsappMessage = encodeURIComponent(
    `Hola, me comunico a través de Motrik Cartagena. Estoy interesado en el repuesto: ${part.name} (Marca: ${part.brand}, Cantidad: ${qty}). ¿Tienen disponibilidad inmediata para retiro o instalación en su sede de ${workshop.zone}?`
  );

  const whatsappUrl = `https://wa.me/${cleanPhone.replace("+", "")}?text=${whatsappMessage}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0 border border-border bg-card shadow-lift sm:rounded-2xl">
        <DialogTitle className="sr-only">Contacto Directo con Taller Aliado</DialogTitle>

        {/* Encabezado */}
        <div className="border-b border-border bg-muted/30 px-6 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                <Store className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold leading-tight text-foreground">
                  Contacto Directo con el Taller
                </h3>
                <p className="text-xs text-muted-foreground">
                  Disponibilidad y retiro en Cartagena
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
              <ShieldCheck className="h-3.5 w-3.5" /> Sin intermediación
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Resumen del repuesto solicitado */}
          <div className="flex gap-4 rounded-xl border border-border bg-muted/20 p-3.5">
            <img
              src={part.images[0]}
              alt={part.name}
              className="h-16 w-16 shrink-0 aspect-square rounded-lg object-cover border border-border"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {part.brand} · {part.category}
              </p>
              <p className="text-sm font-medium leading-snug truncate text-foreground">{part.name}</p>
              <div className="mt-1 flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Cant: {qty} unidad(es)</span>
                <span className="text-base font-semibold text-primary">{cop(subtotal)}</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5">Precio referencial fijado por el distribuidor</p>
            </div>
          </div>

          {/* Información del Taller Aliado */}
          <div className="rounded-xl border border-border p-4 bg-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-foreground">{workshop.name}</span>
                {workshop.verified && (
                  <BadgeCheck className="h-4 w-4 text-primary" />
                )}
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {workshop.zone}
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>{workshop.address}, Cartagena</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>{workshop.hours}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-primary" />
                <span>{workshop.phone}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground border-t border-border/60 pt-2.5 leading-relaxed">
              {workshop.about}
            </p>
          </div>

          {/* Transparencia y blindaje legal: No cobro de comisiones ni intermediación */}
          <div className="rounded-lg bg-muted/40 p-3 text-[11px] text-muted-foreground flex gap-2.5 items-start">
            <ShieldCheck className="h-4 w-4 shrink-0 text-primary mt-0.5" />
            <p className="leading-relaxed">
              <strong>Motrik no procesa pagos por repuestos:</strong> Para garantizar precios justos y proteger la garantía del consumidor, el pago y entrega o instalación se acuerdan directamente con el taller en Cartagena.
            </p>
          </div>

          {/* Botones de acción directa */}
          <div className="space-y-2 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-11 w-full rounded-full bg-success text-success-foreground font-semibold text-sm shadow-soft transition-all hover:bg-success/90 hover:shadow-lift"
            >
              <MessageCircle className="h-4 w-4" /> Contactar por WhatsApp
            </a>

            <div className="flex gap-2">
              <a
                href={`tel:${cleanPhone}`}
                className="flex-1 flex items-center justify-center gap-1.5 h-10 rounded-full border border-border bg-card text-xs font-semibold text-foreground hover:bg-muted transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-primary" /> Llamar al Taller
              </a>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-10 rounded-full gap-1.5 text-xs font-semibold"
                onClick={() => {
                  onOpenChange(false);
                  router.push(`/directorio?shop=${workshop.id}`);
                }}
              >
                <Wrench className="h-3.5 w-3.5 text-primary" /> Ver en Directorio
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
