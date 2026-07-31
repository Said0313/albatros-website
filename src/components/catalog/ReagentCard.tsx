"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { categoryLabel, productShort, productName, analyteLabel } from "@/data/i18n";
import { categoryPill } from "@/lib/categoryAccents";

/**
 * Image-less catalog card for reagents / consumables / controls. Renders cleanly
 * without any product image: category badge, brand, name, a card-level description
 * and a language-neutral analyte/item sub-list (collapsible when long). The analyte
 * names are indexed by the catalog search (see CatalogView).
 */
// Show a small, consistent number of chips so cards line up: with 5, every
// reagent card in the catalog shows exactly 5 chips collapsed (10 of the 13
// have more and get the expand control; the 3 smallest have exactly 5). The
// full list is always reachable via the "Показать все тесты (N)" toggle.
const LIMIT = 5;

export function ReagentCard({ product }: { product: Product }) {
  const locale = useLocale();
  const tc = useTranslations("catalog");
  const [open, setOpen] = useState(false);
  const analytes = product.analytes ?? [];
  const shown = open ? analytes : analytes.slice(0, LIMIT);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-bg-border bg-bg-card p-5 shadow-[0_1px_2px_rgba(16,40,90,0.04)]">
      {/* No divider here: this card has no image, so the line that separates a
          product photo from the text below would just sit at the top separating
          nothing. */}
      <div className="flex items-start justify-between gap-2">
        <Badge color={categoryPill(product.category)}>{categoryLabel(product.category, locale)}</Badge>
        <span className="shrink-0 font-mono text-xs text-brand-blue-deep">{product.brand}</span>
      </div>
      <h3 className="mt-3 break-words font-display text-base font-bold text-text-primary">{productName(product, locale)}</h3>
      <p className="mt-2 break-words text-[13px] leading-relaxed text-text-secondary">{productShort(product, locale)}</p>

      {analytes.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-1.5">
            {shown.map((a) => (
              <span
                key={a}
                className="break-words rounded-md bg-bg-elevated px-2 py-1 font-mono text-[11px] text-text-secondary"
              >
                {analyteLabel(a, locale)}
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
