"use client";

import { Children, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const MOBILE_STEP = 5;

/**
 * Catalog/events list control. All children render into the DOM (hydration
 * safe, no layout shift); visibility differs per breakpoint:
 *
 * - Below lg: incremental loading. The first 5 items show, a "Показать ещё"
 *   button reveals 5 more per tap (.inc-mobile-hidden in globals.css hides the
 *   rest below lg only) and disappears once everything is visible.
 * - lg and up: the classic CappedList behavior, 9 items then expand all
 *   (.capped-collapsed-lg hides children past 9 at lg only).
 *
 * Mount with a key derived from the active filters/search so any filter change
 * remounts the list and resets the mobile count back to 5.
 */
export function IncrementalList({
  children,
  count,
  className,
}: {
  children: React.ReactNode;
  count: number;
  className?: string;
}) {
  const [shown, setShown] = useState(MOBILE_STEP); // mobile progressive count
  const [expanded, setExpanded] = useState(false); // desktop expand-all toggle
  const tc = useTranslations("common");
  const items = Children.toArray(children);

  return (
    <div>
      <div className={cn(className, !expanded && count > 9 && "capped-collapsed-lg")}>
        {items.map((child, i) => (
          <div key={i} className={cn(i >= shown && "inc-mobile-hidden")}>
            {child}
          </div>
        ))}
      </div>

      {/* Mobile: 5 more per tap; gone when everything is shown */}
      {shown < count && (
        <div className="mt-8 flex justify-center lg:hidden">
          <button
            type="button"
            onClick={() => setShown((s) => s + MOBILE_STEP)}
            className="inline-flex items-center gap-2 rounded-full border border-bg-border bg-bg-card px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-brand-blue-light"
          >
            {tc("showMore")}
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Desktop: unchanged 9-then-expand-all behavior */}
      {count > 9 && (
        <div className="mt-8 hidden justify-center lg:flex">
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="inline-flex items-center gap-2 rounded-full border border-bg-border bg-bg-card px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-brand-blue-light"
          >
            {expanded ? tc("collapse") : tc("showAll")}
            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
          </button>
        </div>
      )}
    </div>
  );
}
