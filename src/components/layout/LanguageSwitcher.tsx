"use client";

import { useLocale } from "next-intl";
import { usePathname, getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/** Compact RU / UZ / EN toggle that preserves the current page. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();

  const switchTo = (next: string) => {
    if (next === locale) return;
    // usePathname() returns the resolved path WITHOUT the locale prefix; re-add the
    // current query string so filters (e.g. /catalog?category=…) survive the switch.
    const search = typeof window !== "undefined" ? window.location.search : "";
    // Tell the middleware the new preference BEFORE navigating, so it doesn't
    // redirect back to the old locale based on a stale cookie. This matters
    // specifically when switching TO the default locale, whose URL has no
    // prefix to signal intent on its own.
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`;
    // A full browser navigation, not router.replace()/router.refresh(): a
    // soft client-side transition races this cookie write against Next's
    // async RSC fetch and can silently bounce back to the previous locale,
    // and router.refresh() separately forces the whole route tree to
    // re-render, which re-inserts the pre-hydration splash overlay's inline
    // <script> as an inert DOM node (browsers never execute scripts inserted
    // via innerHTML) — freezing the page on the loading screen. A hard
    // navigation avoids both: the cookie is read synchronously at request
    // time, and the browser's native HTML parser always runs the splash
    // script for real.
    window.location.href = getPathname({ href: pathname, locale: next }) + search;
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
