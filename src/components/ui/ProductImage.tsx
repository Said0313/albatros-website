"use client";

import Image from "next/image";
import { useState } from "react";
import { Dna } from "lucide-react";
import { categoryIcon } from "@/lib/categoryIcons";
import { cn } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  fill = true,
  sizes,
  className,
  brand,
  category,
  name,
}: {
  src?: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  brand?: string;
  category?: string;
  name?: string;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    const Icon = categoryIcon(category);
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#0C1628,#111E38)] px-5 text-center">
        {/* faint helix watermark */}
        <Dna
          className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rotate-12 text-text-primary/[0.04]"
          strokeWidth={1}
        />
        <Icon className="h-9 w-9 text-brand-blue-light/70" strokeWidth={1.4} />
        {name && (
          <span className="mt-3 font-display text-sm font-bold leading-tight text-text-primary/90">
            {name}
          </span>
        )}
        {brand && (
          <span className="mt-1.5 font-mono text-[11px] uppercase tracking-widest text-text-muted">
            {brand}
          </span>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      sizes={sizes ?? "(max-width: 768px) 100vw, 33vw"}
      className={cn("object-contain", className)}
      onError={() => setError(true)}
    />
  );
}
