import catalogData from "@/data/catalog.json";
import brandsData from "@/data/brands.json";
import eventsData from "@/data/events.json";
import type { Product, Brand, CompanyEvent, Category } from "@/types";

export const products = catalogData as Product[];
export const brands = brandsData as Brand[];
export const events = eventsData as CompanyEvent[];

export const categories: Category[] = [
  { name: "ИХЛА", icon: "FlaskConical" },
  { name: "Биохимия", icon: "Beaker" },
  { name: "Гемостаз", icon: "Droplets" },
  { name: "Гематология", icon: "Microscope" },
  { name: "Микробиология", icon: "Bug" },
  { name: "ПЦР", icon: "Dna" },
  { name: "Аллергология", icon: "Wind" },
  { name: "КЩС", icon: "Activity" },
  { name: "ВЭЖХ", icon: "BarChart3" },
  { name: "Клинический анализ", icon: "TestTube2" },
  { name: "Генетика", icon: "Dna" },
  { name: "Функциональная диагностика", icon: "Stethoscope" },
  { name: "Биодеконтаминация", icon: "ShieldCheck" },
  { name: "Программы контроля качества", icon: "BadgeCheck" },
  { name: "Автоматизированная лаборатория", icon: "Workflow" },
  { name: "Иммуногематология", icon: "HeartPulse" },
  { name: "Токсикология", icon: "AlertTriangle" },
  { name: "Клиническая диагностика", icon: "FlaskConical" },
];

/**
 * Diagnostic directions for the photo-card grid (ported from Claude Design).
 * `img` = each category's FLAGSHIP PRODUCT photo from /public/images/products
 * (already normalized to a uniform 1000×1000 white canvas, so every card shows
 * the device at a consistent scale and depicts the right equipment — the raw
 * assets/dir/* images were inconsistently framed and a few were mismatched).
 * `brand` = correct flagship brand. Counts are computed live via categoryCount().
 */
export interface Direction {
  name: string;
  img: string;
  brand: string;
}

export const directions: Direction[] = [
  { name: "ИХЛА", brand: "SNIBE · Maglumi", img: "/images/products/maglumi-x8.png" },
  { name: "Биохимия", brand: "SNIBE · Biossays", img: "/images/products/biossays-c10.png" },
  { name: "Гемостаз", brand: "Werfen · ACL TOP", img: "/images/products/acl-top-350-cts.png" },
  { name: "Гематология", brand: "Dymind · DH", img: "/images/products/dh-800.png" },
  { name: "Микробиология", brand: "BD · BACTEC", img: "/images/products/bd-phoenix-m50.png" },
  { name: "ПЦР", brand: "SNIBE · Molecision", img: "/images/products/molecision-r8.png" },
  { name: "Аллергология", brand: "Thermo Fisher · Phadia", img: "/images/products/phadia-200.png" },
  { name: "КЩС", brand: "Werfen · GEM", img: "/images/products/gem-premier-5000.png" },
  { name: "ВЭЖХ", brand: "Lifotronic · H", img: "/images/products/h100-plus.png" },
  { name: "Клинический анализ", brand: "URIT · US", img: "/images/products/urit-us-1000.png" },
  { name: "Генетика", brand: "Illumina · MiSeq", img: "/images/products/miseq-i100.png" },
  { name: "Функциональная диагностика", brand: "Clarius", img: "/images/products/clarius-c3-hd3.png" },
  { name: "Программы контроля качества", brand: "Randox", img: "/images/products/acusera.png" },
  { name: "Автоматизированная лаборатория", brand: "SNIBE · SATLARS", img: "/images/products/satlars-t8.png" },
  { name: "Иммуногематология", brand: "BLOZER", img: "/images/products/blozer-200.png" },
  { name: "Токсикология", brand: "Randox · Evidence", img: "/images/products/evidence-multistat.png" },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeatured(): Product[] {
  return products.filter((p) => p.featured);
}

export function getRelated(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, limit);
}

export function getBrandList(): string[] {
  return Array.from(new Set(products.map((p) => p.brand))).sort();
}

export function categoryCount(name: string): number {
  return products.filter((p) => p.category === name).length;
}

export function brandCount(name: string): number {
  return products.filter((p) => p.brand === name).length;
}

// ── General directions (top level of the two-level taxonomy) ──
export type GeneralDirectionKey = "equipment" | "reagents" | "consumables" | "controls";

export interface GeneralDirection {
  key: GeneralDirectionKey;
  name: string; // RU (localised via categoryLabel/CATEGORY_UZ)
}

export const generalDirections: GeneralDirection[] = [
  { key: "equipment", name: "Медицинское оборудование" },
  { key: "reagents", name: "Реагенты" },
  { key: "consumables", name: "Расходные материалы" },
  { key: "controls", name: "Контроль качества" },
];

/** A product with no explicit generalDirection belongs to the equipment catalog. */
export function productDirection(p: Product): GeneralDirectionKey {
  return p.generalDirection ?? "equipment";
}

export function directionCount(key: GeneralDirectionKey): number {
  return products.filter((p) => productDirection(p) === key).length;
}

// ── Position counting ──
// An equipment product is 1 position; a grouped image-less card (reagents /
// consumables / controls) counts as its number of individual analytes/items.
export function itemCount(p: Product): number {
  return p.imageless ? p.analytes?.length ?? 1 : 1;
}

export function directionPositions(key: GeneralDirectionKey): number {
  return products.filter((p) => productDirection(p) === key).reduce((s, p) => s + itemCount(p), 0);
}

export function totalPositions(): number {
  return products.reduce((s, p) => s + itemCount(p), 0);
}
