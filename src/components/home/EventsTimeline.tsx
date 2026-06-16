import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { events } from "@/lib/catalog";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";

export function EventsTimeline() {
  return (
    <section className="section-pad border-t border-bg-border">
      <div className="container-x">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">Мероприятия</h2>
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
                  <h3 className="text-[15px] font-medium text-text-primary">{e.title}</h3>
                  <p className="mt-1 text-[13px] text-text-secondary">{e.date}</p>
                  {e.description && <p className="mt-2 text-sm text-text-secondary">{e.description}</p>}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button href="/events" variant="outline">
            Все мероприятия <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
