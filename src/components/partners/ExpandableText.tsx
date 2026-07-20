"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

/**
 * Short description with an "ещё" toggle that reveals the full text. Used on the
 * partner cards (foreign brands + local partners). The toggle only appears when
 * the text is long enough to be worth truncating.
 */
export function ExpandableText({ text, className }: { text?: string; className?: string }) {
  const tc = useTranslations("common");
  const [open, setOpen] = useState(false);
  if (!text) return null;
  const isLong = text.length > 120;
  return (
    <div className={className}>
      <p className={open || !isLong ? "text-sm leading-relaxed text-text-secondary" : "line-clamp-2 text-sm leading-relaxed text-text-secondary"}>
        {text}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="mt-1.5 text-sm font-medium text-brand-red-bright hover:underline"
        >
          {open ? tc("collapse") : tc("expand")}
        </button>
      )}
    </div>
  );
}
