"use client";
import { Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Stars({ value, size = 14, className }: { value: number; size?: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} style={{ width: size, height: size }} className={i <= Math.round(value) ? "fill-star text-star" : "text-border"} />
      ))}
    </div>
  );
}

export function Img({
  src,
  alt,
  className,
  fallback = "/assets/shop.jpg",
}: {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setImgSrc(src);
    setLoaded(false);
  }, [src]);

  useEffect(() => {
    if (ref.current?.complete && ref.current?.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [imgSrc]);

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-muted" />}
      <img
        ref={ref}
        src={imgSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (imgSrc !== fallback) {
            setImgSrc(fallback);
          } else {
            setLoaded(true);
          }
        }}
        className={cn("h-full w-full object-cover transition-all duration-500", loaded ? "opacity-100" : "opacity-0")}
      />
    </div>
  );
}

export function Chip({ active, children, onClick }: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-medium transition-all active:scale-95",
        active ? "border-foreground bg-foreground text-background" : "border-border bg-card text-foreground hover:border-foreground/40",
      )}
    >
      {children}
    </button>
  );
}

export function PageHeader({ eyebrow, title, subtitle, children }: { eyebrow: string; title: string; subtitle?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
        <h1 className="mt-1.5 text-3xl font-semibold md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
