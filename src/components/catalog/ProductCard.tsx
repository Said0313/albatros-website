import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { ProductImage } from "@/components/ui/ProductImage";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-bg-border bg-[linear-gradient(145deg,#0C1628,#111E38)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-red hover:shadow-[0_0_24px_rgba(208,24,31,0.15)]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-elevated">
        <ProductImage
          src={product.images[0]}
          alt={product.name}
          brand={product.brand}
          category={product.category}
          name={product.name}
          className="p-4 transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3">
            <Badge variant="teal">NEW</Badge>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <Badge>{product.category}</Badge>
        <h3 className="mt-2 font-display text-base font-bold text-text-primary">{product.name}</h3>
        <p className="mt-1 font-mono text-xs text-brand-blue-light">{product.brand}</p>
        <p className="mt-2 line-clamp-2 text-[13px] text-text-secondary">{product.shortDescription}</p>
        <span className="mt-3 inline-flex items-center gap-1 text-sm text-brand-red-bright group-hover:gap-2 group-hover:underline">
          Подробнее <ArrowRight className="h-3.5 w-3.5 transition-all" />
        </span>
      </div>
    </Link>
  );
}
