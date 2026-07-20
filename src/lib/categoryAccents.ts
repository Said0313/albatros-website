// Per-sub-category accent colors. A curated, muted palette in the brand family
// (controlled saturation, medium tone) so the tiles read as intentional and
// premium, not a rainbow. Keys are the INTERNAL RU category names (same keys
// used across catalog.json / URLs); values are a single accent hex applied
// subtly (thin top border on a tile, a small dot next to the brand label).
//
// Owner: this mapping is printed in the task report for approval.
export const CATEGORY_ACCENT: Record<string, string> = {
  "ИХЛА": "#3A6EA5", // muted blue
  "Биохимия": "#2E8AA0", // brand teal
  "Гемостаз": "#B0495B", // muted rose
  "Гематология": "#9C4A6B", // muted plum
  "Микробиология": "#4E8D6E", // muted green
  "ПЦР": "#6C5CA6", // muted violet
  "Аллергология": "#C08552", // muted amber
  "КЩС": "#4A7BA6", // muted steel blue
  "ВЭЖХ": "#5B7A9C", // muted slate
  "Клинический анализ": "#C79A3E", // muted gold
  "Генетика": "#7A6CB0", // muted indigo
  "Функциональная диагностика": "#3E9AA6", // muted cyan-teal
  "Программы контроля качества": "#6E8B4A", // muted olive
  "Автоматизированная лаборатория": "#4C6EA0", // muted royal
  "Иммуногематология": "#A85466", // muted maroon
  "Токсикология": "#B36A45", // muted terracotta
};

// Brand-blue fallback keeps any unmapped category on-palette.
export function categoryAccent(name: string): string {
  return CATEGORY_ACCENT[name] ?? "#2E549C";
}

// Per-sub-category PILL colors for the product-card category badge. Vivid and,
// where possible, tied to the meaning of the sub-category (all dark enough for
// white text). Keys are the INTERNAL RU category names (product.category values,
// same keys used across catalog.json / URLs), so the admin category list can
// reference this same map. If a sub-category is unmapped, the pill falls back to
// brand red (the previous single color for every pill).
//
// Note: the QC EQUIPMENT sub-category is stored internally as "Программы контроля
// качества" but displayed as "Системы контроля качества" (steel). The general
// direction displayed as "Программы контроля качества" is stored internally as
// "Контроль качества" (dark teal); it is not a product category, so it never
// appears on a card pill, but it is kept here for the admin category list.
export const CATEGORY_PILL: Record<string, string> = {
  "ИХЛА": "#8B1A1A", // deep wine red (immunochemistry; darker than Гематология/Гемостаз to stay distinct)
  "Биохимия": "#EA580C", // bright orange
  "Гемостаз": "#E11D48", // rose (coagulation)
  "Гематология": "#DC2626", // red (blood)
  "Микробиология": "#16A34A", // green
  "ПЦР": "#7C3AED", // violet (molecular)
  "Аллергология": "#0D9488", // teal
  "КЩС": "#0891B2", // cyan
  "ВЭЖХ": "#4F46E5", // indigo
  "Клинический анализ": "#D97706", // amber
  "Генетика": "#DB2777", // pink
  "Функциональная диагностика": "#0284C7", // sky
  "Биодеконтаминация": "#0E7490", // deep cyan
  "Контроль качества": "#059669", // emerald (general direction, displayed as "Программы контроля качества")
  "Программы контроля качества": "#0F766E", // dark teal (displayed as "Системы контроля качества")
  "Автоматизированная лаборатория": "#4338CA", // deep indigo (modular lab)
  "Иммуногематология": "#BE123C", // deep rose
  "Токсикология": "#C2410C", // deep orange
};

// Fall back to the previous single pill color (brand red) when unmapped.
export function categoryPill(name: string): string {
  return CATEGORY_PILL[name] ?? "#D0181F";
}
