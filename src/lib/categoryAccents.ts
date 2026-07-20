// Per-sub-category accent colors. A curated, muted palette in the brand family
// (controlled saturation, medium tone) so the tiles read as intentional and
// premium — not a rainbow. Keys are the INTERNAL RU category names (same keys
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
