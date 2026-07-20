import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "uz", "en"],
  defaultLocale: "ru",
  // ru stays at the root (/, /catalog ...) so existing URLs are unchanged;
  // uz and en are served under /uz/... and /en/...
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
