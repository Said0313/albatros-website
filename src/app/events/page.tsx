import type { Metadata } from "next";
import { events } from "@/lib/catalog";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ContactCTA } from "@/components/home/ContactCTA";

export const metadata: Metadata = {
  title: "Мероприятия",
  description: "Конференции, семинары и ключевые события Albatros Health Care в области лабораторной диагностики.",
};

export default function EventsPage() {
  return (
    <div className="pt-28 md:pt-32">
      <div className="container-x">
        <h1 className="font-display text-4xl font-extrabold text-text-primary md:text-5xl">Мероприятия</h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Конференции, семинары и значимые события компании.
        </p>

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
                  <h3 className="text-base font-medium text-text-primary">{e.title}</h3>
                  <p className="mt-1 text-[13px] text-text-secondary">{e.date}</p>
                  {e.description && <p className="mt-2 text-sm leading-relaxed text-text-secondary">{e.description}</p>}
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
