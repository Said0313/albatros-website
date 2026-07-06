import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "uz"],
  defaultLocale: "ru",
  // ru stays at the root (/, /catalog ...) so existing URLs are unchanged;
  // uz is served under /uz/...
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
