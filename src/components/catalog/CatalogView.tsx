"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, SlidersHorizontal, ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { products, categories, generalDirections, directionPositions, itemCount, productDirection } from "@/lib/catalog";
import { categoryLabel } from "@/data/i18n";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ReagentCard } from "@/components/catalog/ReagentCard";
import { cn } from "@/lib/utils";

export function CatalogView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("catalog");

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const selectedDirs = searchParams.getAll("direction");
  const selectedCats = searchParams.getAll("category");
  const selectedBrands = searchParams.getAll("brand");

  // Sub-category and brand options are scoped to the selected general direction(s),
  // so the second filter level reflects the first. With no direction selected, all
  // are shown. Counts are computed within that scope.
  const inDir = (p: (typeof products)[number]) =>
    selectedDirs.length === 0 || selectedDirs.includes(productDirection(p));
  const scopedCats = categories.filter((c) => products.some((p) => inDir(p) && p.category === c.name));
  const scopedCatCount = (name: string) =>
    products.filter((p) => inDir(p) && p.category === name).reduce((s, p) => s + itemCount(p), 0);
  const scopedBrands = Array.from(new Set(products.filter(inDir).map((p) => p.brand))).sort();
  const scopedBrandCount = (b: string) =>
    products.filter((p) => inDir(p) && p.brand === b).reduce((s, p) => s + itemCount(p), 0);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const updateParams = (key: string, value: string, multi = true) => {
    const params = new URLSearchParams(searchParams.toString());
    if (multi) {
      const current = params.getAll(key);
      params.delete(key);
      if (current.includes(value)) {
        current.filter((v) => v !== value).forEach((v) => params.append(key, v));
      } else {
        [...current, value].forEach((v) => params.append(key, v));
      }
    } else if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const onSearch = (v: string) => {
    setQuery(v);
    const params = new URLSearchParams(searchParams.toString());
    if (v) params.set("q", v);
    else params.delete("q");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const reset = () => router.push(pathname, { scroll: false });

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return products.filter((p) => {
      const matchDir = selectedDirs.length === 0 || selectedDirs.includes(productDirection(p));
      const matchCat = selectedCats.length === 0 || selectedCats.includes(p.category);
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        (p.analytes?.some((a) => a.toLowerCase().includes(q)) ?? false);
      return matchDir && matchCat && matchBrand && matchQuery;
    });
  }, [selectedDirs, selectedCats, selectedBrands, query]);

  const hasFilters =
    selectedDirs.length > 0 || selectedCats.length > 0 || selectedBrands.length > 0 || query.length > 0;

  return (
    <div className="container-x grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="filter-scroll lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pb-6 lg:pr-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={t("search")}
            className="w-full rounded-lg border border-bg-border bg-bg-card py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>

        {/* Mobile-only toggle - desktop (lg) shows the filters inline as before */}
        <button
          onClick={() => setFiltersOpen((v) => !v)}
          className="mt-4 flex w-full items-center justify-between rounded-lg border border-bg-border bg-bg-card px-4 py-3 text-sm font-medium text-text-primary lg:hidden"
          aria-expanded={filtersOpen}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" /> {t("filters")}
            {hasFilters && <span className="h-2 w-2 rounded-full bg-brand-red" />}
          </span>
          <ChevronDown className={cn("h-4 w-4 transition-transform", filtersOpen && "rotate-180")} />
        </button>

        <div className={cn(filtersOpen ? "block" : "hidden", "lg:block")}>
        <FilterGroup title={t("generalDirection")}>
          {generalDirections
            .filter((g) => directionPositions(g.key) > 0)
            .map((g) => (
              <CheckRow
                key={g.key}
                label={categoryLabel(g.name, locale)}
                count={directionPositions(g.key)}
                checked={selectedDirs.includes(g.key)}
                onChange={() => updateParams("direction", g.key)}
              />
            ))}
        </FilterGroup>

        <FilterGroup title={t("direction")}>
          {scopedCats.map((c) => (
            <CheckRow
              key={c.name}
              label={categoryLabel(c.name, locale)}
              count={scopedCatCount(c.name)}
              checked={selectedCats.includes(c.name)}
              onChange={() => updateParams("category", c.name)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title={t("brand")}>
          {scopedBrands.map((b) => (
            <CheckRow
              key={b}
              label={b}
              count={scopedBrandCount(b)}
              checked={selectedBrands.includes(b)}
              onChange={() => updateParams("brand", b)}
            />
          ))}
        </FilterGroup>

        {hasFilters && (
          <button onClick={reset} className="mt-5 flex items-center gap-1 text-sm text-text-secondary hover:text-brand-red">
            <X className="h-3.5 w-3.5" /> {t("reset")}
          </button>
        )}
        </div>
      </aside>

      <div>
        {selectedDirs.length === 1 && (
          <p className="mb-5 max-w-3xl text-sm leading-relaxed text-text-secondary">
            {t(`directionDesc.${selectedDirs[0]}`)}
          </p>
        )}
        <p className="mb-5 font-mono text-sm text-text-secondary">{t("found", { count: filtered.length })}</p>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-bg-border bg-bg-card py-20 text-center">
            <p className="text-text-secondary">{t("empty")}</p>
            <button onClick={reset} className="text-sm text-brand-red hover:underline">
              {t("reset")}
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p) => (
                <motion.div
                  key={p.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  {p.imageless ? <ReagentCard product={p} /> : <ProductCard product={p} />}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wide text-text-primary">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 text-sm">
      <span className="flex items-center gap-2 text-text-secondary">
        <input type="checkbox" checked={checked} onChange={onChange} className="accent-brand-red" />
        {label}
      </span>
      <span className="font-mono text-xs text-text-muted">{count}</span>
    </label>
  );
}
