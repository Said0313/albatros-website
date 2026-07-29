"use client";

import { Children, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useStrandGuard } from "@/components/ui/useStrandGuard";

const MOBILE_STEP = 5;
const DESKTOP_STEP = 9;

/**
 * Catalog/events list control. All children render into the DOM (hydration
 * safe, no layout shift); visibility differs per breakpoint:
 *
 * - Below lg (both modes): incremental loading. The first 5 items show, a
 *   "Показать ещё" button reveals 5 more per tap (.inc-mobile-hidden in
 *   globals.css hides the rest below lg only) and disappears once everything
 *   is visible.
 * - lg and up, desktopMode "expandAll" (default, catalog): the classic
 *   CappedList behavior, 9 items then expand all (.capped-collapsed-lg).
 * - lg and up, desktopMode "increment" (events): 9 items, then 9 more per
 *   click of the same "Показать ещё" button (.inc-desktop-hidden), which
 *   disappears once everything is visible.
 *
 * Mount with a key derived from the active filters/search so any filter change
 * remounts the list and resets both counts.
 */
export function IncrementalList({
  children,
  count,
  className,
  desktopMode = "expandAll",
}: {
  children: React.ReactNode;
  count: number;
  className?: string;
  desktopMode?: "expandAll" | "increment";
}) {
  const [shown, setShown] = useState(MOBILE_STEP); // mobile progressive count
  const [dShown, setDShown] = useState(DESKTOP_STEP); // desktop progressive count (increment mode)
  const [expanded, setExpanded] = useState(false); // desktop expand-all toggle
  const tc = useTranslations("common");
  const { ref, guard } = useStrandGuard<HTMLDivElement>();
  const items = Children.toArray(children);
  const incrementDesktop = desktopMode === "increment";

  // Mobile only: fold the progressively-expanded list back to the initial 5 in
  // one step, then keep the scroll position sensible (see useStrandGuard).
  const collapseMobile = () => {
    setShown(MOBILE_STEP);
    guard();
  };

  return (
    <div ref={ref} className="scroll-mt-24">
      <div className={cn(className, !incrementDesktop && !expanded && count > 9 && "capped-collapsed-lg")}>
        {items.map((child, i) => (
          <div
            key={i}
            className={cn(
              i >= shown && "inc-mobile-hidden",
              incrementDesktop && i >= dShown && "inc-desktop-hidden"
            )}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Mobile: "show more" adds 5 per tap; the collapse control appears as soon
          as the list has been expanded past the initial 5 and folds it all the
          way back in one step. Both sit side by side so the visitor can keep
          expanding or fold everything back at any point. */}
      {(shown < count || shown > MOBILE_STEP) && (
        <div className="mt-8 flex flex-wrap justify-center gap-3 lg:hidden">
          {shown < count && (
            <button
              type="button"
              onClick={() => setShown((s) => s + MOBILE_STEP)}
              className="inline-flex items-center gap-2 rounded-full border border-bg-border bg-bg-card px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-brand-blue-light"
            >
              {tc("showMore")}
              <ChevronDown className="h-4 w-4" />
            </button>
          )}
          {shown > MOBILE_STEP && (
            <button
              type="button"
              onClick={collapseMobile}
              aria-label={tc("collapse")}
              className="inline-flex items-center gap-2 rounded-full border border-bg-border bg-bg-card px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-brand-blue-light"
            >
              {tc("collapse")}
              <ChevronUp className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Desktop, increment mode: 9 more per click; gone when everything is shown */}
      {incrementDesktop && dShown < count && (
        <div className="mt-8 hidden justify-center lg:flex">
          <button
            type="button"
            onClick={() => setDShown((s) => s + DESKTOP_STEP)}
            className="inline-flex items-center gap-2 rounded-full border border-bg-border bg-bg-card px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-brand-blue-light"
          >
            {tc("showMore")}
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Desktop, expand-all mode (catalog): unchanged 9-then-expand-all */}
      {!incrementDesktop && count > 9 && (
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
