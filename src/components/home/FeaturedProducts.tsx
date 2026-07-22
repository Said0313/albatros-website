"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import type { Product } from "@/types";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/ui/ProductImage";
import { categoryLabel, productShort } from "@/data/i18n";
import { categoryPill } from "@/lib/categoryAccents";
import { cn } from "@/lib/utils";

export function FeaturedProducts({ products }: { products: Product[] }) {
  const locale = useLocale();
  const tf = useTranslations("featured");
  const tc = useTranslations("common");
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
    <section className="section-pad">
      <div className="container-x">
        <div className="section-card px-6 py-10 md:px-8">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">{tf("title")}</h2>
            <p className="mt-3 text-text-secondary">{tf("subtitle")}</p>
          </div>
        </ScrollReveal>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-5">
              {products.map((p) => (
                <Link
                  key={p.slug}
                  href={`/product/${p.slug}`}
                  className="group w-[280px] shrink-0 overflow-hidden rounded-2xl border border-bg-border bg-white/95 shadow-[0_1px_2px_rgba(16,40,90,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-blue-light hover:shadow-[0_24px_48px_-28px_rgba(29,58,130,0.35)] sm:w-[300px]"
                >
                  <div className="relative aspect-square overflow-hidden rounded-t-2xl bg-white">
                    <ProductImage src={p.images[0]} alt={p.name} brand={p.brand} category={p.category} name={p.name} sizes="300px" className="p-4" />
                  </div>
                  <div className="p-4">
                    <Badge color={categoryPill(p.category)}>{categoryLabel(p.category, locale)}</Badge>
                    <h3 className="mt-2 font-display text-base font-bold text-text-primary">{p.name}</h3>
                    <p className="mt-1 font-mono text-xs text-brand-blue-deep">{p.brand}</p>
                    <p className="mt-2 line-clamp-2 text-[13px] text-text-secondary">{productShort(p, locale)}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-red-bright group-hover:underline">
                      {tc("more")} <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={scrollPrev}
            aria-label="Назад"
            className="absolute left-0 top-1/2 block -translate-y-1/2 rounded-full border border-bg-border bg-bg-card p-2.5 text-text-primary shadow-[0_2px_10px_rgba(16,40,90,0.12)] hover:border-brand-red md:-left-3"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            aria-label="Вперёд"
            className="absolute right-0 top-1/2 block -translate-y-1/2 rounded-full border border-bg-border bg-bg-card p-2.5 text-text-primary shadow-[0_2px_10px_rgba(16,40,90,0.12)] hover:border-brand-red md:-right-3"
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
      </div>
    </section>
  );
}
