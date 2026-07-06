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
  priority = false,
}: {
  src?: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  className?: string;
  brand?: string;
  category?: string;
  name?: string;
  priority?: boolean;
}) {
  const [error, setError] = useState(false);

  if (!src || error) {
    const Icon = categoryIcon(category);
    return (
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#F5F7FA] px-5 text-center">
        {/* faint helix watermark */}
        <Dna
          className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 rotate-12 text-[#0C1628]/[0.05]"
          strokeWidth={1}
        />
        <Icon className="h-9 w-9 text-brand-red/80" strokeWidth={1.4} />
        {name && (
          <span className="mt-3 font-display text-sm font-bold leading-tight text-[#0C1628]">
            {name}
          </span>
        )}
        {brand && (
          <span className="mt-1.5 font-mono text-[11px] uppercase tracking-widest text-[#5B6B85]">
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
      priority={priority}
      className={cn("object-contain", className)}
      onError={() => setError(true)}
    />
  );
}
