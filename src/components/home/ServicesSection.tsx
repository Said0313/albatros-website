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
  { key: "turnkey", color: "#D0181F", tint: "rgba(208,24,31,0.10)" },
  { key: "service", color: "#2E549C", tint: "rgba(46,84,156,0.10)" },
  { key: "standards", color: "#3E8FA6", tint: "rgba(62,143,166,0.12)" },
  { key: "education", color: "#5C7FB4", tint: "rgba(92,127,180,0.13)" },
] as const;

export function ServicesSection() {
  const t = useTranslations("services");
  return (
    <section className="border-y border-bg-border bg-[rgba(244,247,251,0.86)] py-16 backdrop-blur-[6px] md:py-20">
      <div className="container-x mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
          {t("sectionTitle")}
        </h2>
      </div>
      <div className="container-x grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
        {CARDS.map((c, i) => (
          <ScrollReveal key={c.key} delay={(i % 2) * 0.08} className="h-full">
            <div
              className="relative h-full overflow-hidden rounded-2xl border border-bg-border bg-white/90 p-7 pl-8 shadow-[0_1px_2px_rgba(16,40,90,0.04)] backdrop-blur-[6px]"
              style={{ borderLeft: `4px solid ${c.color}` }}
            >
              <span
                aria-hidden
                className="pointer-events-none absolute right-5 top-2 font-display text-6xl font-extrabold leading-none"
                style={{ color: c.tint }}
              >
                {`0${i + 1}`}
              </span>
              <h3 className="relative max-w-[calc(100%-4rem)] font-display text-lg font-bold leading-snug text-text-primary md:text-xl">
                {t(`${c.key}.title`)}
              </h3>
              <p className="relative mt-3 max-w-[46ch] text-sm leading-relaxed text-text-secondary">
                {t(`${c.key}.body`)}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
