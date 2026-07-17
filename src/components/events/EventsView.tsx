"use client";

/* eslint-disable @next/next/no-img-element -- event photos are runtime content
   added by the admin panel; plain <img> matches the clients/certificates grids */
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays } from "lucide-react";
import type { CompanyEvent } from "@/types";
import { eventTitle, eventDescription, eventDate } from "@/data/i18n";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

const KNOWN_TYPES = [
  "seminar",
  "conference",
  "congress",
  "symposium",
  "exhibition",
  "installation",
  "registration",
  "other",
] as const;

const MONTH_INDEX: Record<string, number> = {
  "Январь": 1, "Февраль": 2, "Март": 3, "Апрель": 4, "Май": 5, "Июнь": 6,
  "Июль": 7, "Август": 8, "Сентябрь": 9, "Октябрь": 10, "Ноябрь": 11, "Декабрь": 12,
};

// Newest first: explicit priority (lower number = higher) wins, then date.
function sortKey(e: CompanyEvent): number {
  const year = parseInt(e.year, 10) || 0;
  const month = MONTH_INDEX[e.date.split(" ")[0]] || 0;
  return year * 100 + month;
}

function compareEvents(a: CompanyEvent, b: CompanyEvent): number {
  const pa = a.priority ?? Number.POSITIVE_INFINITY;
  const pb = b.priority ?? Number.POSITIVE_INFINITY;
  if (pa !== pb) return pa - pb;
  return sortKey(b) - sortKey(a);
}

export function EventsView({ events }: { events: CompanyEvent[] }) {
  const t = useTranslations("events");
  const locale = useLocale();
  const [year, setYear] = useState("");
  const [type, setType] = useState("");

  const visible = useMemo(() => events.filter((e) => !e.hidden), [events]);

  const years = useMemo(
    () => Array.from(new Set(visible.map((e) => e.year))).sort((a, b) => b.localeCompare(a)),
    [visible]
  );
  const types = useMemo(() => {
    const present = new Set(visible.map((e) => e.type).filter(Boolean));
    return KNOWN_TYPES.filter((k) => present.has(k));
  }, [visible]);

  const filtered = useMemo(
    () =>
      visible
        .filter((e) => (year ? e.year === year : true))
        .filter((e) => (type ? e.type === type : true))
        .sort(compareEvents),
    [visible, year, type]
  );

  const selectCls =
    "rounded-lg border border-bg-border bg-bg-card px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-blue-light";

  return (
    <div>
      <div className="mt-8 flex flex-wrap gap-3">
        <select className={selectCls} value={year} onChange={(e) => setYear(e.target.value)} aria-label={t("allYears")}>
          <option value="">{t("allYears")}</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
        <select className={selectCls} value={type} onChange={(e) => setType(e.target.value)} aria-label={t("allTypes")}>
          <option value="">{t("allTypes")}</option>
          {types.map((k) => (
            <option key={k} value={k}>
              {t(`types.${k}`)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 pb-20">
        {filtered.map((e, i) => {
          const photos = e.images ?? [];
          const title = eventTitle(e, locale);
          return (
            <ScrollReveal key={e.id} delay={Math.min(i, 4) * 0.06}>
              <article className="flex flex-col gap-5 rounded-2xl border border-bg-border bg-bg-card p-5 shadow-[0_1px_2px_rgba(16,40,90,0.04)] md:flex-row md:gap-7 md:p-6">
                {photos.length > 0 && (
                  <div className="w-full shrink-0 md:w-72">
                    <img
                      src={photos[0]}
                      alt={title}
                      loading="lazy"
                      className="aspect-[4/3] w-full rounded-xl border border-bg-border object-cover"
                    />
                    {photos.length > 1 && (
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {photos.slice(1, 5).map((p, j) => (
                          <img
                            key={p}
                            src={p}
                            alt={`${title} ${j + 2}`}
                            loading="lazy"
                            className="aspect-square w-full rounded-lg border border-bg-border object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 font-mono text-sm text-brand-red">
                      <CalendarDays className="h-4 w-4" />
                      {eventDate(e.date, locale)}
                    </span>
                    {e.type && (KNOWN_TYPES as readonly string[]).includes(e.type) && (
                      <span className="rounded-full border border-bg-border bg-bg-elevated px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wide text-brand-teal">
                        {t(`types.${e.type}`)}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 font-display text-lg font-bold leading-snug text-text-primary md:text-xl">
                    {title}
                  </h3>
                  {eventDescription(e, locale) && (
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">
                      {eventDescription(e, locale)}
                    </p>
                  )}
                </div>
              </article>
            </ScrollReveal>
          );
        })}
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-dashed border-bg-border bg-bg-elevated py-16 text-center text-sm text-text-muted">
            {t("empty")}
          </div>
        )}
      </div>
    </div>
  );
}
