import type { CompanyEvent } from "@/types";

// Russian month name -> ordinal, so a human "Апрель 2026" date string sorts
// chronologically. Every event in events.json carries a `year` plus a `date`
// beginning with one of these month names (verified: all records parse).
const MONTH_INDEX: Record<string, number> = {
  "Январь": 1, "Февраль": 2, "Март": 3, "Апрель": 4, "Май": 5, "Июнь": 6,
  "Июль": 7, "Август": 8, "Сентябрь": 9, "Октябрь": 10, "Ноябрь": 11, "Декабрь": 12,
};

/** Chronological key: year*100 + month. Newer events yield a larger number. */
export function eventSortKey(e: CompanyEvent): number {
  const year = parseInt(e.year, 10) || 0;
  const month = MONTH_INDEX[e.date.split(" ")[0]] || 0;
  return year * 100 + month;
}

/**
 * Ordering used everywhere events are listed (homepage preview + events page),
 * so the two never diverge. An optional `priority` pins an event to the top
 * (lower number first); everything else falls back to newest date first.
 */
export function compareEvents(a: CompanyEvent, b: CompanyEvent): number {
  const pa = a.priority ?? Number.POSITIVE_INFINITY;
  const pb = b.priority ?? Number.POSITIVE_INFINITY;
  if (pa !== pb) return pa - pb;
  return eventSortKey(b) - eventSortKey(a);
}

/** Visible events (not hidden), newest first. Does not mutate the input. */
export function sortedEvents(list: CompanyEvent[]): CompanyEvent[] {
  return list.filter((e) => !e.hidden).slice().sort(compareEvents);
}
