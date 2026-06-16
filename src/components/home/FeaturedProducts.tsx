"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/ui/ProductImage";
import { cn } from "@/lib/utils";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 4500, stopOnInteraction: false }),
  ]);
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => embla?.scrollPrev(), [embla]);
  const scrollNext = useCallback(() => embla?.scrollNext(), [embla]);

  useEffect(() => {
    if (!embla) return;
    setSnaps(embla.scrollSnapList());
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
  }, [embla]);

  return (
    <section className="section-pad border-t border-bg-border">
      <div className="container-x">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">Флагманское оборудование</h2>
          <p className="mt-3 text-text-secondary">Передовые решения от мировых производителей</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {products.map((p) => (
                <Link
                  key={p.slug}
                  href={`/product/${p.slug}`}
                  className="group w-[280px] shrink-0 overflow-hidden rounded-2xl border border-bg-border bg-[linear-gradient(145deg,#0C1628,#111E38)] transition-colors hover:border-brand-red sm:w-[300px]"
                >
                  <div className="relative h-[200px] overflow-hidden rounded-t-2xl bg-bg-elevated">
                    <ProductImage src={p.images[0]} alt={p.name} brand={p.brand} category={p.category} name={p.name} className="p-4" />
                  </div>
                  <div className="p-4">
                    <Badge>{p.category}</Badge>
                    <h3 className="mt-2 font-display text-base font-bold text-text-primary">{p.name}</h3>
                    <p className="mt-1 font-mono text-xs text-brand-blue-light">{p.brand}</p>
                    <p className="mt-2 line-clamp-2 text-[13px] text-text-secondary">{p.shortDescription}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-red-bright group-hover:underline">
                      Подробнее <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            aria-label="Назад"
            className="absolute -left-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-bg-border bg-bg-card p-2.5 text-text-primary hover:border-brand-red md:block"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Вперёд"
            className="absolute -right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-bg-border bg-bg-card p-2.5 text-text-primary hover:border-brand-red md:block"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {snaps.map((_, i) => (
            <button
              key={i}
              aria-label={`Слайд ${i + 1}`}
              onClick={() => embla?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === selected ? "w-6 bg-brand-red" : "w-2 bg-bg-border"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
