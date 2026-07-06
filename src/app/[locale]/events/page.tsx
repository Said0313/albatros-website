import { useLocale, useTranslations } from "next-intl";
import { events } from "@/lib/catalog";
import { eventTitle, eventDescription, eventDate } from "@/data/i18n";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function EventsPage() {
  const t = useTranslations("events");
  const locale = useLocale();
  return (
    <div className="pt-28 md:pt-32">
      <div className="container-x">
        <h1 className="font-display text-4xl font-extrabold text-text-primary md:text-5xl">{t("title")}</h1>
        <p className="mt-3 max-w-2xl text-text-secondary">{t("pageSubtitle")}</p>

        <div className="mx-auto mt-12 max-w-3xl pb-20">
          {events.map((e, i) => (
            <ScrollReveal key={e.id} delay={i * 0.06}>
              <div className="flex gap-5">
                <div className="w-16 shrink-0 pt-1 text-right font-mono text-sm text-brand-red">{e.year}</div>
                <div className="relative flex flex-col items-center">
                  <span className="z-10 mt-1.5 h-3 w-3 rounded-full bg-brand-red" />
                  <span className="w-px flex-1 bg-brand-red/30" />
                </div>
                <div className="flex-1 pb-10">
                  <h3 className="text-base font-medium text-text-primary">{eventTitle(e, locale)}</h3>
                  <p className="mt-1 text-[13px] text-text-secondary">{eventDate(e.date, locale)}</p>
                  {eventDescription(e, locale) && (
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{eventDescription(e, locale)}</p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
      <ContactCTA />
    </div>
  );
}
