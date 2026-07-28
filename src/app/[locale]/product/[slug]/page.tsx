import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { products, getProduct, getRelated, brandIdOf } from "@/lib/catalog";
import { Link } from "@/i18n/navigation";
import { categoryLabel, productFull, productShort, productDetailed, specLabel, specValue } from "@/data/i18n";
import { youtubeId } from "@/lib/youtube";
import { absoluteUrl, categoryKeyword, pageMetadata, SITE_URL, type AppLocale } from "@/lib/seo";
import { BreadcrumbJsonLd, JsonLd } from "@/components/seo/JsonLd";
import { Badge } from "@/components/ui/Badge";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductActions } from "@/components/product/ProductActions";
import { ProductCard } from "@/components/catalog/ProductCard";

export function generateStaticParams() {
  // Image-less catalog entries (reagents/consumables/controls) have no product page.
  return products.filter((p) => !p.imageless).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  const product = getProduct(params.slug);
  if (!product) return { title: "404" };
  const locale = params.locale as AppLocale;
  const kw = categoryKeyword(product.category, locale);
  return pageMetadata({
    locale,
    path: `/product/${product.slug}`,
    title: `${product.name} · ${kw}`,
    description: productShort(product, locale),
    images: product.images.length ? product.images : ["/logo.png"],
  });
}

export default function ProductPage({ params }: { params: { slug: string; locale: string } }) {
  const product = getProduct(params.slug);
  if (!product || product.imageless) notFound();
  const related = getRelated(product);
  const locale = params.locale;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useTranslations("product");
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const tn = useTranslations("nav");

  const loc = locale as AppLocale;
  const brandId = brandIdOf(product.brand);
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.length ? product.images.map((i) => `${SITE_URL}${i}`) : [`${SITE_URL}/logo.png`],
    description: productFull(product, loc) || productShort(product, loc),
    brand: { "@type": "Brand", name: product.brand },
    category: categoryLabel(product.category, loc),
    url: absoluteUrl(loc, `/product/${product.slug}`),
  };
  const crumbs = [
    { name: t("breadcrumbHome"), path: "/" },
    { name: tn("catalog"), path: "/catalog" },
    { name: categoryLabel(product.category, loc), path: `/catalog?category=${encodeURIComponent(product.category)}` },
    { name: product.name, path: `/product/${product.slug}` },
  ];

  return (
    <div className="pb-16 md:pb-24 pt-24 md:pt-32">
      <JsonLd data={productLd} />
      <BreadcrumbJsonLd locale={loc} items={crumbs} />
      <div className="container-x">
        <div className="section-card px-5 py-6 md:px-8">
        <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-text-secondary">
          <Link href="/" className="hover:text-text-primary">{t("breadcrumbHome")}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/catalog" className="hover:text-text-primary">{tn("catalog")}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={{ pathname: "/catalog", query: { category: product.category } }} className="hover:text-text-primary">
            {categoryLabel(product.category, locale)}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-text-primary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[55fr_45fr]">
          <ProductGallery images={product.images} name={product.name} brand={product.brand} category={product.category} />

          <div>
            <div className="flex flex-wrap gap-2">
              <Link href={{ pathname: "/catalog", query: { category: product.category } }}>
                <Badge>{categoryLabel(product.category, locale)}</Badge>
              </Link>
              {brandId ? (
                <Link href={`/partners/${brandId}`}>
                  <Badge variant="blue">{product.brand}</Badge>
                </Link>
              ) : (
                <Badge variant="blue">{product.brand}</Badge>
              )}
            </div>
            <h1 className="mt-4 font-display text-3xl font-extrabold text-text-primary md:text-4xl">{product.name}</h1>
            {brandId ? (
              <Link href={`/partners/${brandId}`} className="mt-2 inline-block font-mono text-sm text-brand-blue-deep hover:underline">
                {product.brand}
              </Link>
            ) : (
              <p className="mt-2 font-mono text-sm text-brand-blue-deep">{product.brand}</p>
            )}

            <div className="my-6 h-px w-full bg-bg-border" />

            <p className="text-[15px] leading-[1.8] text-text-secondary">{productFull(product, locale)}</p>

            {product.specifications.length > 0 && (
              <div className="mt-7 overflow-hidden rounded-xl border border-bg-border">
                {product.specifications.map((s, i) => (
                  <div
                    key={s.label}
                    className={`grid grid-cols-[40%_60%] gap-2 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-bg-card" : "bg-bg-elevated"}`}
                  >
                    <span className="text-text-secondary">{specLabel(s.label, locale)}</span>
                    <span className="font-mono text-text-primary">{specValue(s.value, locale)}</span>
                  </div>
                ))}
              </div>
            )}

            <ProductActions name={product.name} />
          </div>
        </div>

        {(() => {
          const vid = youtubeId(product.videoUrl);
          const detailed = productDetailed(product, locale);
          if (!vid && !detailed) return null;
          return (
            <div className="mt-16 border-t border-bg-border pt-12">
              {vid && (
                <div className="mb-12">
                  <h2 className="mb-5 font-display text-2xl font-bold text-text-primary">{t("video")}</h2>
                  <div className="aspect-video w-full max-w-3xl overflow-hidden rounded-2xl border border-bg-border bg-black">
                    <iframe
                      className="h-full w-full border-0"
                      src={`https://www.youtube-nocookie.com/embed/${vid}`}
                      title={product.name}
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
              {detailed && (
                <div>
                  <h2 className="mb-5 font-display text-2xl font-bold text-text-primary">{t("detailed")}</h2>
                  <div className="max-w-3xl space-y-3 text-[15px] leading-[1.8] text-text-secondary">
                    {detailed.split("\n").map((line) => line.trim()).filter(Boolean).map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="mb-6 font-display text-2xl font-bold text-text-primary">{t("related")}</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
