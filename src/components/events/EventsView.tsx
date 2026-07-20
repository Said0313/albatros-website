"use client";

/* eslint-disable @next/next/no-img-element -- event photos are runtime content
   added by the admin panel; plain <img> matches the clients/certificates grids */
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarDays, Search, ArrowRight } from "lucide-react";
import type { CompanyEvent } from "@/types";
import { Link } from "@/i18n/navigation";
import { eventTitle, eventDescription, eventDate } from "@/data/i18n";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { cn } from "@/lib/utils";

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

function excerpt(text: string | undefined, max = 180): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max).replace(/[\s,.;:]+\S*$/, "") + "…" : clean;
}

export function EventsView({ events }: { events: CompanyEvent[] }) {
  const t = useTranslations("events");
  const tc = useTranslations("common");
  const locale = useLocale();
  const [year, setYear] = useState("");
  const [type, setType] = useState("");
  const [query, setQuery] = useState("");

  const visible = useMemo(() => events.filter((e) => !e.hidden), [events]);

  const years = useMemo(
    () => Array.from(new Set(visible.map((e) => e.year))).sort((a, b) => b.localeCompare(a)),
    [visible]
  );
  const types = useMemo(() => {
    const present = new Set(visible.map((e) => e.type).filter(Boolean));
    return KNOWN_TYPES.filter((k) => present.has(k));
  }, [visible]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return visible
      .filter((e) => (year ? e.year === year : true))
      .filter((e) => (type ? e.type === type : true))
      .filter((e) =>
        !q ||
        eventTitle(e, locale).toLowerCase().includes(q) ||
        (eventDescription(e, locale) ?? "").toLowerCase().includes(q)
      )
      .sort(compareEvents);
  }, [visible, year, type, query, locale]);

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
      active
        ? "border-brand-red bg-brand-red text-white"
        : "border-bg-border bg-bg-card text-text-secondary hover:border-brand-blue-light hover:text-text-primary"
    );

  return (
    <div>
      {/* Year chips */}
      <div className="mt-8 flex flex-wrap gap-2">
        <button className={chip(year === "")} onClick={() => setYear("")}>
          {t("allYears")}
        </button>
        {years.map((y) => (
          <button key={y} className={chip(year === y)} onClick={() => setYear(y)}>
            {y}
          </button>
        ))}
      </div>

      {/* Search + type filter */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:max-w-xs sm:flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            aria-label={t("search")}
            className="w-full rounded-lg border border-bg-border bg-bg-card py-2.5 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-red focus:outline-none focus:ring-1 focus:ring-brand-red"
          />
        </div>
        <select
          className="rounded-lg border border-bg-border bg-bg-card px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-blue-light"
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label={t("allTypes")}
        >
          <option value="">{t("allTypes")}</option>
          {types.map((k) => (
            <option key={k} value={k}>
              {t(`types.${k}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Chronological list of event cards */}
      <div className="mt-10 flex flex-col gap-6 pb-20">
        {filtered.map((e, i) => {
          const title = eventTitle(e, locale);
          const photo = e.images?.[0];
          return (
            <ScrollReveal key={e.id} delay={Math.min(i, 4) * 0.06}>
              <Link
                href={`/events/${e.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-bg-border bg-bg-card shadow-[0_1px_2px_rgba(16,40,90,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-blue-light hover:shadow-[0_18px_40px_-26px_rgba(29,58,130,0.35)] md:flex-row"
              >
                {photo && (
                  <div className="w-full shrink-0 overflow-hidden md:w-80">
                    <img
                      src={photo}
                      alt={title}
                      loading="lazy"
                      className="aspect-[16/10] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] md:aspect-auto md:h-full"
                    />
                  </div>
                )}
                <div className="flex flex-1 flex-col p-6">
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
                      {excerpt(eventDescription(e, locale))}
                    </p>
                  )}
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-red-bright group-hover:gap-2">
                    {tc("more")} <ArrowRight className="h-3.5 w-3.5 transition-all" />
                  </span>
                </div>
              </Link>
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
