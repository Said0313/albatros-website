import type { MetadataRoute } from "next";
import { products, brands } from "@/lib/catalog";
import { absoluteUrl, LOCALES, type AppLocale } from "@/lib/seo";

// Enumerate every real route in BOTH locales. Static top-level pages, plus one
// entry per brand page and per product page (image-less catalog cards have no
// product page, matching product/[slug]/generateStaticParams). Each entry
// carries hreflang alternates so Google links the ru/uz versions.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticPaths = ["/", "/catalog", "/partners", "/about", "/events", "/contact"];
  const productPaths = products.filter((p) => !p.imageless).map((p) => `/product/${p.slug}`);
  const brandPaths = brands.map((b) => `/partners/${b.id}`);

  const allPaths = [...staticPaths, ...productPaths, ...brandPaths];

  const languagesFor = (path: string) => ({
    ru: absoluteUrl("ru", path),
    uz: absoluteUrl("uz", path),
  });

  // One entry per locale per page, each with full language alternates.
  return allPaths.flatMap((path) =>
    LOCALES.map((locale: AppLocale) => ({
      url: absoluteUrl(locale, path),
      lastModified,
      changeFrequency: (path === "/" ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: path === "/" ? 1 : path.startsWith("/product/") ? 0.7 : 0.8,
      alternates: { languages: languagesFor(path) },
    }))
  );
}
