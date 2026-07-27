import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "uz", "en"],
  defaultLocale: "ru",
  // ru stays at the root (/, /catalog ...) so existing URLs are unchanged;
  // uz and en are served under /uz/... and /en/...
  localePrefix: "as-needed",
  // Do NOT sniff Accept-Language: a first-time visitor to / must always get
  // Russian (the business default), not whatever their browser advertises.
  // Visitors switch deliberately via the switcher; the NEXT_LOCALE cookie it
  // sets still persists their choice across visits.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
