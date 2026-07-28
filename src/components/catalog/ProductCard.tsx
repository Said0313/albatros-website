"use client";

import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/types";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/ui/ProductImage";
import { categoryLabel, productShort } from "@/data/i18n";
import { categoryPill } from "@/lib/categoryAccents";
import { imageAlt, type AppLocale } from "@/lib/seo";

export function ProductCard({ product }: { product: Product }) {
  const locale = useLocale();
  const tc = useTranslations("common");
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-bg-border bg-bg-card shadow-[0_1px_2px_rgba(16,40,90,0.04)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-blue-light hover:shadow-[0_24px_48px_-28px_rgba(29,58,130,0.35)]"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-t-2xl bg-white">
        <ProductImage
          src={product.images[0]}
          alt={imageAlt({ name: product.name, brand: product.brand, category: product.category, locale: locale as AppLocale })}
          brand={product.brand}
          category={product.category}
          name={product.name}
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="p-4 transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span aria-hidden className="mb-3 block h-px w-full bg-bg-border" />
        <Badge color={categoryPill(product.category)}>{categoryLabel(product.category, locale)}</Badge>
        <h3 className="mt-2 font-display text-[15px] font-bold text-text-primary">{product.name}</h3>
        <p className="mt-1 font-mono text-[11px] text-brand-blue-deep">{product.brand}</p>
        <p className="mt-2 line-clamp-2 text-xs text-text-secondary">{productShort(product, locale)}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-[13px] text-brand-red-bright group-hover:gap-2 group-hover:underline">
          {tc("more")} <ArrowRight className="h-3.5 w-3.5 transition-all" />
        </span>
      </div>
    </Link>
  );
}
