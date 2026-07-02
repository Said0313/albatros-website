import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/**
 * Shared company service-advantages block, used on BOTH the homepage and the
 * About page (single source of copy + design). Four cards (turnkey supply, 24/7
 * service, international standards, education) from the `services` message
 * namespace. No icons: each card is differentiated by a slim brand-accent left
 * bar (red / blue / teal / blue-2). Surface-2 section background so the white,
 * equal-height cards stand out.
 */
const CARDS = [
  { key: "turnkey", color: "#D0181F" },
  { key: "service", color: "#2E549C" },
  { key: "standards", color: "#3E8FA6" },
  { key: "education", color: "#5C7FB4" },
] as const;

export function ServicesSection() {
  const t = useTranslations("services");
  return (
    <section className="border-y border-bg-border bg-bg-elevated py-16 md:py-20">
      <div className="container-x mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
          {t("sectionTitle")}
        </h2>
      </div>
      <div className="container-x grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
        {CARDS.map((c, i) => (
          <ScrollReveal key={c.key} delay={(i % 2) * 0.08} className="h-full">
            <div
              className="h-full rounded-2xl border border-bg-border bg-bg-card p-7 pl-8 shadow-[0_1px_2px_rgba(16,40,90,0.04)]"
              style={{ borderLeft: `4px solid ${c.color}` }}
            >
              <h3 className="font-display text-xl font-bold text-text-primary md:text-[22px]">
                {t(`${c.key}.title`)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{t(`${c.key}.body`)}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
