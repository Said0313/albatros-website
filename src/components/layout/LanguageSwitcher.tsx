"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Compact RU / UZ toggle that preserves the current page. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: string) => {
    if (next === locale) return;
    // usePathname() returns the resolved path WITHOUT the locale prefix; re-add the
    // current query string so filters (e.g. /catalog?category=…) survive the switch.
    const search = typeof window !== "undefined" ? window.location.search : "";
    router.replace(`${pathname}${search}`, { locale: next });
    // App Router caches the RSC payload per route, so changing only the locale does
    // not re-fetch the server-rendered (translated) content — the page would appear
    // unchanged until a manual reload. refresh() forces the RSC re-fetch immediately.
    router.refresh();
  };

  return (
    <div className={cn("inline-flex items-center rounded-lg border border-bg-border bg-bg-card p-0.5 text-xs font-semibold", className)}>
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-pressed={l === locale}
          className={cn(
            "rounded-md px-2 py-1 uppercase transition-colors",
            l === locale ? "bg-brand-red text-white" : "text-text-secondary hover:text-text-primary",
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
