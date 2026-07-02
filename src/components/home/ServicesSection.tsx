import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/**
 * Company service advantages on the homepage: four cards (turnkey supply,
 * 24/7 service, international standards, education). Reuses the exact card style
 * used for the value cards on the About page (rounded surface card, navy title,
 * muted body). Copy comes from the `services` message namespace so it stays
 * separate from the About page's own aboutPage.v* keys.
 */
const KEYS = ["turnkey", "service", "standards", "education"] as const;

export function ServicesSection() {
  const t = useTranslations("services");
  return (
    <section className="section-pad border-t border-bg-border">
      <div className="container-x grid grid-cols-1 gap-6 md:grid-cols-2">
        {KEYS.map((k, i) => (
          <ScrollReveal key={k} delay={(i % 2) * 0.08}>
            <div className="h-full rounded-2xl border border-bg-border bg-bg-card p-7 shadow-[0_1px_2px_rgba(16,40,90,0.04)]">
              <h3 className="font-display text-xl font-bold text-text-primary">{t(`${k}.title`)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{t(`${k}.body`)}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
