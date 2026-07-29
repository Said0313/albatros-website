"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useStrandGuard } from "@/components/ui/useStrandGuard";

/**
 * Reusable "preview then expand" control. Renders ALL children into the DOM (so
 * it is hydration-safe with no layout shift); when collapsed, CSS in globals.css
 * (.capped-collapsed nth-child rules) hides items past the per-breakpoint cap:
 * 3 below lg, 9 at lg and up. The arrow toggles a class on the container to
 * remove the cap. No localStorage/sessionStorage.
 *
 * Pass the grid/flex layout classes via `className`; `count` is the number of
 * children (used to decide whether the control is needed and, at lg, shown).
 */
export function CappedList({
  children,
  count,
  className,
}: {
  children: React.ReactNode;
  count: number;
  className?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const tc = useTranslations("common");
  const { ref, guard } = useStrandGuard<HTMLDivElement>();

  // Nothing is ever capped when there are 3 or fewer items.
  if (count <= 3) return <div className={className}>{children}</div>;

  const toggle = () => {
    setExpanded((v) => {
      if (v) guard(); // collapsing: keep scroll sensible so we do not strand
      return !v;
    });
  };

  return (
    <div ref={ref} className="scroll-mt-24">
      <div className={cn(className, !expanded && "capped-collapsed")}>{children}</div>
      {/* When there are 9 or fewer items, nothing is hidden at lg, so the control
          is only useful on mobile: hide it at lg in that case. */}
      <div className={cn("mt-8 flex justify-center", count <= 9 && "lg:hidden")}>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={expanded}
          className="inline-flex items-center gap-2 rounded-full border border-bg-border bg-bg-card px-5 py-2.5 text-sm font-medium text-text-primary transition-colors hover:border-brand-blue-light"
        >
          {expanded ? tc("collapse") : tc("showAll")}
          <ChevronDown className={cn("h-4 w-4 transition-transform", expanded && "rotate-180")} />
        </button>
      </div>
    </div>
  );
}
