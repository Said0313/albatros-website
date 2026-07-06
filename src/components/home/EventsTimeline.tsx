import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { events } from "@/lib/catalog";
import { eventTitle, eventDescription, eventDate } from "@/data/i18n";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";

export function EventsTimeline() {
  const t = useTranslations("events");
  const tc = useTranslations("common");
  const locale = useLocale();
  return (
    <section className="section-pad border-t border-bg-border">
      <div className="container-x">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">{t("title")}</h2>
        </div>

        <div className="mx-auto max-w-3xl">
          {events.slice(0, 8).map((e, i) => (
            <ScrollReveal key={e.id} delay={i * 0.08}>
              <div className="flex gap-5">
                <div className="w-14 shrink-0 pt-1 text-right font-mono text-sm text-brand-red">{e.year}</div>
                <div className="relative flex flex-col items-center">
                  <span className="z-10 mt-1.5 h-3 w-3 rounded-full bg-brand-red" />
                  <span className="w-px flex-1 bg-brand-red/30" />
                </div>
                <div className="flex-1 pb-8">
                  <h3 className="text-[15px] font-medium text-text-primary">{eventTitle(e, locale)}</h3>
                  <p className="mt-1 text-[13px] text-text-secondary">{eventDate(e.date, locale)}</p>
                  {eventDescription(e, locale) && <p className="mt-2 text-sm text-text-secondary">{eventDescription(e, locale)}</p>}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button href="/events" variant="outline">
            {tc("allEvents")} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
