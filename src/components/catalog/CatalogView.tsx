"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { products, categories, getBrandList, categoryCount, brandCount } from "@/lib/catalog";
import { ProductCard } from "@/components/catalog/ProductCard";

export function CatalogView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const brandList = getBrandList();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const selectedCats = searchParams.getAll("category");
  const selectedBrands = searchParams.getAll("brand");

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
    return products.filter((p) => {
      const matchCat = selectedCats.length === 0 || selectedCats.includes(p.category);
      const matchBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
      const matchQuery =
        !query ||
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchBrand && matchQuery;
    });
  }, [selectedCats, selectedBrands, query]);

  const hasFilters = selectedCats.length > 0 || selectedBrands.length > 0 || query.length > 0;

  return (
    <div className="container-x grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Поиск оборудования..."
            className="w-full rounded-lg border border-bg-border bg-bg-card py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>

        <FilterGroup title="Направление">
          {categories
            .filter((c) => categoryCount(c.name) > 0)
            .map((c) => (
              <CheckRow
                key={c.name}
                label={c.name}
                count={categoryCount(c.name)}
                checked={selectedCats.includes(c.name)}
                onChange={() => updateParams("category", c.name)}
              />
            ))}
        </FilterGroup>

        <FilterGroup title="Бренд">
          {brandList.map((b) => (
            <CheckRow
              key={b}
              label={b}
              count={brandCount(b)}
              checked={selectedBrands.includes(b)}
              onChange={() => updateParams("brand", b)}
            />
          ))}
        </FilterGroup>

        {hasFilters && (
          <button onClick={reset} className="mt-5 flex items-center gap-1 text-sm text-text-secondary hover:text-brand-red">
            <X className="h-3.5 w-3.5" /> Сбросить фильтры
          </button>
        )}
      </aside>

      <div>
        <p className="mb-5 font-mono text-sm text-text-secondary">Найдено: {filtered.length} продукта</p>
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-bg-border bg-bg-card py-20 text-center">
            <p className="text-text-secondary">Ничего не найдено</p>
            <button onClick={reset} className="text-sm text-brand-red hover:underline">
              Сбросить фильтры
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
                  <ProductCard product={p} />
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
