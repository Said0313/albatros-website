import type { Metadata } from "next";

// Single source of truth for the canonical production domain. Read from the
// environment so it lives in exactly one place (.env / Hostinger), with a safe
// fallback so builds never emit an undefined URL.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://albatros.uz").replace(/\/$/, "");

export type AppLocale = "ru" | "uz";
export const LOCALES: AppLocale[] = ["ru", "uz"];

// Routing is next-intl "as-needed" with defaultLocale "ru": ru lives at the root
// (/, /catalog) and uz is prefixed (/uz, /uz/catalog). Keep URL building here so
// the sitemap, canonical tags and hreflang alternates all agree.
function normalize(path: string): string {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export function localePath(locale: AppLocale, path = "/"): string {
  const p = normalize(path);
  return locale === "ru" ? p || "/" : `/uz${p}`;
}

export function absoluteUrl(locale: AppLocale, path = "/"): string {
  const p = normalize(path);
  return locale === "ru" ? `${SITE_URL}${p}` : `${SITE_URL}/uz${p}`;
}

// Self-referencing canonical for the active locale plus ru/uz/x-default hreflang
// alternates pointing at the same page in each language. x-default -> ru.
export function seoAlternates(locale: AppLocale, path = "/"): NonNullable<Metadata["alternates"]> {
  return {
    canonical: absoluteUrl(locale, path),
    languages: {
      ru: absoluteUrl("ru", path),
      uz: absoluteUrl("uz", path),
      "x-default": absoluteUrl("ru", path),
    },
  };
}

const OG_LOCALE: Record<AppLocale, string> = { ru: "ru_RU", uz: "uz_UZ" };

// Category -> primary search keyword (from the SEO keyword map). Used to build
// product titles like "MAGLUMI X8 · ИХЛА анализатор" so brand-model AND
// category searches both match. RU category name is the key.
const CATEGORY_KEYWORD: Record<string, { ru: string; uz: string }> = {
  "ИХЛА": { ru: "ИХЛА анализатор", uz: "IXLA analizatori" },
  "Биохимия": { ru: "биохимический анализатор", uz: "biokimyoviy analizator" },
  "Гематология": { ru: "гематологический анализатор", uz: "gematologik analizator" },
  "Гемостаз": { ru: "анализатор гемостаза", uz: "gemostaz analizatori" },
  "КЩС": { ru: "анализатор КЩС", uz: "KIShH analizatori" },
  "ПЦР": { ru: "ПЦР анализатор", uz: "PZR analizatori" },
  "Генетика": { ru: "генетический анализатор", uz: "genetik analizator" },
  "Микробиология": { ru: "микробиологический анализатор", uz: "mikrobiologik analizator" },
  "Клинический анализ": { ru: "клинический анализатор", uz: "klinik analizator" },
  "ВЭЖХ": { ru: "ВЭЖХ анализатор (HPLC)", uz: "HPLC analizatori" },
  "Иммуногематология": { ru: "иммуногематология", uz: "immunogematologiya" },
  "Токсикология": { ru: "токсикология", uz: "toksikologiya" },
  "Аллергология": { ru: "молекулярная аллергодиагностика", uz: "molekulyar allergodiagnostika" },
  "Программы контроля качества": { ru: "контроль качества лаборатории", uz: "laboratoriya sifat nazorati" },
  "Функциональная диагностика": { ru: "функциональная диагностика", uz: "funksional diagnostika" },
  "Автоматизированная лаборатория": {
    ru: "автоматизированная лаборатория",
    uz: "avtomatlashtirilgan laboratoriya",
  },
};

export function categoryKeyword(category: string, locale: AppLocale): string {
  return CATEGORY_KEYWORD[category]?.[locale] ?? category;
}

// Descriptive, localized image alt: "<category keyword> <brand> <model>",
// e.g. "ИХЛА анализатор SNIBE Maglumi X3". Keyword sits naturally, no stuffing.
export function imageAlt(opts: {
  name: string;
  brand?: string;
  category?: string;
  locale: AppLocale;
}): string {
  const { name, brand, category, locale } = opts;
  const kw = category ? categoryKeyword(category, locale) : "";
  return [kw, brand, name].filter(Boolean).join(" ");
}

/**
 * Build a full Metadata object for a page: title, description, self-canonical +
 * hreflang alternates, and matching OpenGraph/Twitter. `path` is the ru (root)
 * path without locale prefix, e.g. "/catalog" or "/product/maglumi-x8".
 */
export function pageMetadata(opts: {
  locale: AppLocale;
  path: string;
  title: string;
  description: string;
  images?: string[];
}): Metadata {
  const { locale, path, title, description, images } = opts;
  const url = absoluteUrl(locale, path);
  const ogImages = images && images.length ? images : ["/logo.png"];
  return {
    title,
    description,
    alternates: seoAlternates(locale, path),
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Albatros Health Care",
      locale: OG_LOCALE[locale],
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages,
    },
  };
}
