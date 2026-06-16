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
  { name: "Контроль качества", icon: "BadgeCheck" },
  { name: "Автоматизированная лаборатория", icon: "Workflow" },
  { name: "Иммуногематология", icon: "HeartPulse" },
  { name: "Токсикология", icon: "AlertTriangle" },
  { name: "Клиническая диагностика", icon: "FlaskConical" },
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
