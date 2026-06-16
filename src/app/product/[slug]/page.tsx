import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { products, getProduct, getRelated } from "@/lib/catalog";
import { Badge } from "@/components/ui/Badge";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductCard } from "@/components/catalog/ProductCard";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = getProduct(params.slug);
  if (!product) return { title: "Продукт не найден" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: { images: product.images.length ? product.images : ["/logo.png"] },
  };
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProduct(params.slug);
  if (!product) notFound();
  const related = getRelated(product);

  return (
    <div className="pb-24 pt-28 md:pt-32">
      <div className="container-x">
        <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-text-secondary">
          <Link href="/" className="hover:text-text-primary">Главная</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/catalog" className="hover:text-text-primary">Каталог</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/catalog?category=${encodeURIComponent(product.category)}`} className="hover:text-text-primary">
            {product.category}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[55fr_45fr]">
          <ProductGallery images={product.images} name={product.name} brand={product.brand} category={product.category} />

          <div>
            <div className="flex flex-wrap gap-2">
              <Badge>{product.category}</Badge>
              <Badge variant="blue">{product.brand}</Badge>
              {product.isNew && <Badge variant="teal">NEW</Badge>}
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold text-text-primary md:text-4xl">{product.name}</h1>
            <p className="mt-2 font-mono text-sm text-brand-blue-light">{product.brand}</p>

            <div className="my-6 h-px w-full bg-bg-border" />

            <p className="text-[15px] leading-[1.8] text-text-secondary">{product.fullDescription}</p>

            {product.specifications.length > 0 && (
              <div className="mt-7 overflow-hidden rounded-xl border border-bg-border">
                {product.specifications.map((s, i) => (
                  <div
                    key={s.label}
                    className={`grid grid-cols-[40%_60%] gap-2 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-bg-card" : "bg-bg-elevated"}`}
                  >
                    <span className="text-text-secondary">{s.label}</span>
                    <span className="font-mono text-text-primary">{s.value}</span>
                  </div>
                ))}
              </div>
            )}

            <ProductActions name={product.name} />
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-6 font-display text-2xl font-bold text-text-primary">Похожие продукты</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
