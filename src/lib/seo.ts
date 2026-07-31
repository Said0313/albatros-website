import type { Metadata } from "next";

// Single source of truth for the canonical production domain. Read from the
// environment so it lives in exactly one place (.env / Hostinger), with a safe
// fallback so builds never emit an undefined URL.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://albatros.uz").replace(/\/$/, "");

// Brand shown in every browser tab and search result. Latin in all locales
// (never transliterated). Titles are built brand-first as
// "Albatros Health Care | <page>" so the company name stays visible even when
// a narrow tab truncates the title.
export const SITE_NAME = "Albatros Health Care";
export const brandTitle = (page: string): string => `${SITE_NAME} | ${page}`;

export type AppLocale = "ru" | "uz" | "en";
export const LOCALES: AppLocale[] = ["ru", "uz", "en"];

// Routing is next-intl "as-needed" with defaultLocale "ru": ru lives at the root
// (/, /catalog), uz is prefixed (/uz, /uz/catalog) and en is prefixed (/en, /en/catalog).
// Keep URL building here so the sitemap, canonical tags and hreflang alternates all agree.
function normalize(path: string): string {
  if (!path || path === "/") return "";
  return path.startsWith("/") ? path : `/${path}`;
}

export function localePath(locale: AppLocale, path = "/"): string {
  const p = normalize(path);
  return locale === "ru" ? p || "/" : `/${locale}${p}`;
}

export function absoluteUrl(locale: AppLocale, path = "/"): string {
  const p = normalize(path);
  return locale === "ru" ? `${SITE_URL}${p}` : `${SITE_URL}/${locale}${p}`;
}

// Self-referencing canonical for the active locale plus ru/uz/en/x-default hreflang
// alternates pointing at the same page in each language. x-default -> ru.
export function seoAlternates(locale: AppLocale, path = "/"): NonNullable<Metadata["alternates"]> {
  return {
    canonical: absoluteUrl(locale, path),
    languages: {
      ru: absoluteUrl("ru", path),
      uz: absoluteUrl("uz", path),
      en: absoluteUrl("en", path),
      "x-default": absoluteUrl("ru", path),
    },
  };
}

const OG_LOCALE: Record<AppLocale, string> = { ru: "ru_RU", uz: "uz_UZ", en: "en_US" };

// Category -> primary search keyword (from the SEO keyword map). Used to build
// product titles like "MAGLUMI X8 · ИХЛА анализатор" so brand-model AND
// category searches both match. RU category name is the key.
const CATEGORY_KEYWORD: Record<string, { ru: string; uz: string; en: string }> = {
  "ИХЛА": { ru: "ИХЛА анализатор", uz: "IXLA analizatori", en: "CLIA analyzer" },
  "Биохимия": { ru: "биохимический анализатор", uz: "biokimyoviy analizator", en: "biochemistry analyzer" },
  "Гематология": { ru: "гематологический анализатор", uz: "gematologik analizator", en: "hematology analyzer" },
  "Гемостаз": { ru: "анализатор гемостаза", uz: "gemostaz analizatori", en: "hemostasis analyzer" },
  "КЩС": { ru: "анализатор КЩС", uz: "KIShH analizatori", en: "blood gas analyzer" },
  "ПЦР": { ru: "ПЦР анализатор", uz: "PZR analizatori", en: "PCR analyzer" },
  "Генетика": { ru: "генетический анализатор", uz: "genetik analizator", en: "genetic analyzer" },
  "Микробиология": { ru: "микробиологический анализатор", uz: "mikrobiologik analizator", en: "microbiology analyzer" },
  "Клинический анализ": { ru: "клинический анализатор", uz: "klinik analizator", en: "clinical analyzer" },
  "ВЭЖХ": { ru: "ВЭЖХ анализатор (HPLC)", uz: "HPLC analizatori", en: "HPLC analyzer" },
  "Иммуногематология": { ru: "иммуногематология", uz: "immunogematologiya", en: "immunohematology" },
  "Токсикология": { ru: "токсикология", uz: "toksikologiya", en: "toxicology" },
  "Скрининг": { ru: "скрининг", uz: "skrining", en: "screening" },
  "Аллергология": { ru: "молекулярная аллергодиагностика", uz: "molekulyar allergodiagnostika", en: "molecular allergy diagnostics" },
  "Программы контроля качества": { ru: "контроль качества лаборатории", uz: "laboratoriya sifat nazorati", en: "laboratory quality control" },
  "Функциональная диагностика": { ru: "функциональная диагностика", uz: "funksional diagnostika", en: "functional diagnostics" },
  "Автоматизированная лаборатория": {
    ru: "автоматизированная лаборатория",
    uz: "avtomatlashtirilgan laboratoriya",
    en: "automated laboratory",
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
  // `title` is the page portion (e.g. "Каталог оборудования"); prepend the brand
  // once here so the tab, OpenGraph and Twitter titles all read the same
  // brand-first string. The root layout no longer sets a title.template, so this
  // is the single place the brand is joined.
  const full = brandTitle(title);
  return {
    title: full,
    description,
    alternates: seoAlternates(locale, path),
    openGraph: {
      title: full,
      description,
      url,
      type: "website",
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale],
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: full,
      description,
      images: ogImages,
    },
  };
}
