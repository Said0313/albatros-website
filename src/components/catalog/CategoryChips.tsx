"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { categories, products, productDirection, itemCount } from "@/lib/catalog";
import { categoryAccent } from "@/lib/categoryAccents";
import { categoryLabel } from "@/data/i18n";
import { cn } from "@/lib/utils";

/**
 * Prominent sub-category quick-links shown at the top of the catalog, under the
 * "Каталог" heading, so a visitor immediately sees the sub-categories. Larger,
 * clearer type than the sidebar filter rows; each chip carries its accent color
 * (shared with the home direction cards) and toggles the `category` URL filter,
 * so it stays in sync with the sidebar. Scoped to the selected general direction.
 */
export function CategoryChips() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const selectedDirs = searchParams.getAll("direction");
  const selectedCats = searchParams.getAll("category");

  const inDir = (p: (typeof products)[number]) =>
    selectedDirs.length === 0 || selectedDirs.includes(productDirection(p));
  const scoped = categories
    .map((c) => ({
      name: c.name,
      count: products.filter((p) => inDir(p) && p.category === c.name).reduce((s, p) => s + itemCount(p), 0),
    }))
    .filter((c) => c.count > 0);

  const toggle = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.getAll("category");
    params.delete("category");
    if (current.includes(name)) {
      current.filter((v) => v !== name).forEach((v) => params.append("category", v));
    } else {
      [...current, name].forEach((v) => params.append("category", v));
    }
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  if (scoped.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-2.5">
      {scoped.map((c) => {
        const accent = categoryAccent(c.name);
        const active = selectedCats.includes(c.name);
        return (
          <button
            key={c.name}
            onClick={() => toggle(c.name)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[15px] font-semibold transition-all",
              active
                ? "border-transparent text-white shadow-[0_6px_18px_-8px_rgba(16,40,90,0.45)]"
                : "border-bg-border bg-bg-card text-text-primary hover:-translate-y-0.5 hover:border-brand-blue-light"
            )}
            style={active ? { background: accent } : undefined}
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: active ? "rgba(255,255,255,0.85)" : accent }}
            />
            {categoryLabel(c.name, locale)}
            <span className={cn("font-mono text-xs", active ? "text-white/80" : "text-text-muted")}>{c.count}</span>
          </button>
        );
      })}
    </div>
  );
}
