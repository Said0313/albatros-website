"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { categoryLabel, productShort } from "@/data/i18n";
import { categoryPill } from "@/lib/categoryAccents";

/**
 * Image-less catalog card for reagents / consumables / controls. Renders cleanly
 * without any product image: category badge, brand, name, a card-level description
 * and a language-neutral analyte/item sub-list (collapsible when long). The analyte
 * names are indexed by the catalog search (see CatalogView).
 */
const LIMIT = 12;

export function ReagentCard({ product }: { product: Product }) {
  const locale = useLocale();
  const tc = useTranslations("catalog");
  const [open, setOpen] = useState(false);
  const analytes = product.analytes ?? [];
  const shown = open ? analytes : analytes.slice(0, LIMIT);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-bg-border bg-bg-card p-5 shadow-[0_1px_2px_rgba(16,40,90,0.04)]">
      <span aria-hidden className="mb-3 block h-px w-full bg-bg-border" />
      <div className="flex items-start justify-between gap-2">
        <Badge color={categoryPill(product.category)}>{categoryLabel(product.category, locale)}</Badge>
        <span className="shrink-0 font-mono text-xs text-brand-blue-deep">{product.brand}</span>
      </div>
      <h3 className="mt-3 break-words font-display text-base font-bold text-text-primary">{product.name}</h3>
      <p className="mt-2 break-words text-[13px] leading-relaxed text-text-secondary">{productShort(product, locale)}</p>

      {analytes.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-1.5">
            {shown.map((a) => (
              <span
                key={a}
                className="break-words rounded-md bg-bg-elevated px-2 py-1 font-mono text-[11px] text-text-secondary"
              >
                {a}
              </span>
            ))}
          </div>
          {analytes.length > LIMIT && (
            <button
              onClick={() => setOpen((v) => !v)}
              className="mt-2.5 text-xs font-medium text-brand-red-bright hover:underline"
            >
              {open ? tc("hideTests") : tc("showAllTests", { count: analytes.length })}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
