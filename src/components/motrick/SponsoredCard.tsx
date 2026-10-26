"use client";

import { ExternalLink, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SponsoredAdProps {
  title: string;
  desc: string;
  ctaText: string;
  link?: string;
  sponsor: string;
  categoryTag?: string;
  className?: string;
}

/**
 * Componente de Publicidad Nativa y Contextual (RNF-04)
 * - Cumplimiento Art. 29 y 30 de la Ley 1480 de 2011 (Estatuto del Consumidor en Colombia):
 *   Distinción clara mediante tag "Patrocinado" para evitar publicidad engañosa.
 * - Publicidad contextual no invasiva en espacios negativos sin pop-ups ni video intrusivo.
 * - Categorías estrictamente automotrices (Seguros SOAT, OBD2, Centros CDA, Lubricantes certificados).
 */
export function SponsoredCard({
  title,
  desc,
  ctaText,
  link = "#",
  sponsor,
  categoryTag = "Ecosistema Automotriz",
  className,
}: SponsoredAdProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/40 p-4 shadow-soft transition-all hover:border-primary/40 hover:shadow-lift",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2 text-[10px]">
        <div className="flex items-center gap-1.5 font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary/70" />
          <span>Patrocinado</span>
          <span className="text-border">·</span>
          <span className="font-medium lowercase tracking-normal text-muted-foreground/80">{sponsor}</span>
        </div>
        <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-medium text-muted-foreground">
          {categoryTag}
        </span>
      </div>

      <div className="mt-2.5">
        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
          {title}
        </h4>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {desc}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between pt-1">
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <ShieldCheck className="h-3 w-3 text-success" /> Alianza verificada
        </span>
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary transition-all hover:translate-x-0.5 hover:underline"
        >
          {ctaText} <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}

// Banners contextuales predefinidos para uso temático inmediato
export const SPONSORED_ADS = {
  soatSeguros: {
    sponsor: "Seguros Bolívar / Sura",
    title: "Cotiza tu SOAT Digital con 10% de Descuento",
    desc: "Emisión instantánea, notificación al RUNT en menos de 5 minutos y recordatorios automáticos de vencimiento en tu Garaje Motrick.",
    ctaText: "Renovar ahora",
    categoryTag: "Seguros & Tránsito",
    link: "https://www.runt.gov.co",
  },
  scannerOBD2: {
    sponsor: "Autel & Launch Tools",
    title: "Escáner Diagnóstico OBD2 Bluetooth",
    desc: "Lee códigos de error del motor en tiempo real directo a tu smartphone. Compatible con protocolos OBD2 de autos 2010 a 2026.",
    ctaText: "Ver escáneres compatibles",
    categoryTag: "Diagnóstico Electrónico",
    link: "#",
  },
  cdaRevision: {
    sponsor: "Red CDA Autorizados Cartagena",
    title: "Revisión Técnico-Mecánica en Centros Aliados",
    desc: "Pistas computarizadas de frenos, suspensión y gases. Agenda turno sin filas con tarifa regulada por el Ministerio de Transporte.",
    ctaText: "Reservar turno CDA",
    categoryTag: "Revisión Técnico-Mecánica",
    link: "#",
  },
  telepeaje: {
    sponsor: "FacilPass / Flypass",
    title: "Tag de Telepeaje para tu Auto",
    desc: "Pasa por peajes sin efectivo y accede a parqueaderos de centros comerciales en Cartagena sin tiquetes.",
    ctaText: "Solicitar TAG gratis",
    categoryTag: "Movilidad Inteligente",
    link: "#",
  },
};
