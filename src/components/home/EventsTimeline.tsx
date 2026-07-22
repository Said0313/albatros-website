/* eslint-disable @next/next/no-img-element -- event photos are runtime content */
import { ArrowRight, CalendarDays } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { events } from "@/lib/catalog";
import { eventTitle, eventDate } from "@/data/i18n";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";

/**
 * Homepage events preview: a compact card grid of the most recent events (no
 * timeline line). Each card links to the event's own detail page.
 */
export function EventsTimeline() {
  const t = useTranslations("events");
  const tc = useTranslations("common");
  const locale = useLocale();
  // Preview capped to 3 (mobile) / 9 (lg) via the shared capped-collapsed CSS;
  // no in-place expand here, the button below links to the full events page.
  const recent = events.filter((e) => !e.hidden).slice(0, 9);
  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="section-card px-6 py-10 md:px-8">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">{t("title")}</h2>
          </div>
        </ScrollReveal>

        <div className="capped-collapsed grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((e, i) => {
            const title = eventTitle(e, locale);
            const photo = e.images?.[0];
            return (
              <ScrollReveal key={e.id} delay={i * 0.08}>
                <Link
                  href={`/events/${e.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-bg-border bg-white/[0.92] shadow-[0_1px_2px_rgba(16,40,90,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue-light hover:shadow-[0_18px_40px_-26px_rgba(29,58,130,0.35)]"
                >
                  {photo && (
                    <div className="overflow-hidden">
                      <img
                        src={photo}
                        alt={title}
                        loading="lazy"
                        className="aspect-[4/3] w-full bg-white object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs text-brand-red">
                      <CalendarDays className="h-3.5 w-3.5" /> {eventDate(e.date, locale)}
                    </span>
                    <h3 className="mt-2 line-clamp-3 text-[15px] font-semibold leading-snug text-text-primary">{title}</h3>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Button href="/events" variant="outline">
            {tc("allEvents")} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        </div>
      </div>
    </section>
  );
}
