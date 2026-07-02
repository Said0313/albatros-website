import { Package, Wrench, ShieldCheck, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

/**
 * Company service advantages on the homepage: four cards (turnkey supply,
 * 24/7 service, international standards, education). Copy comes from the `services`
 * message namespace. Each card carries a lucide icon in a soft tinted chip; the
 * accent color rotates across the four cards (brand red / blue / teal / blue-2)
 * and the section sits on the surface-2 tone so the white cards stand out.
 */
const CARDS = [
  { key: "turnkey", Icon: Package, color: "#D0181F", tint: "rgba(208,24,31,0.10)" },
  { key: "service", Icon: Wrench, color: "#2E549C", tint: "rgba(46,84,156,0.10)" },
  { key: "standards", Icon: ShieldCheck, color: "#3E8FA6", tint: "rgba(62,143,166,0.13)" },
  { key: "education", Icon: GraduationCap, color: "#5C7FB4", tint: "rgba(92,127,180,0.15)" },
] as const;

export function ServicesSection() {
  const t = useTranslations("services");
  return (
    <section className="border-t border-bg-border bg-bg-elevated pt-14 pb-16 md:pt-16 md:pb-20">
      <div className="container-x mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
          {t("sectionTitle")}
        </h2>
      </div>
      <div className="container-x grid grid-cols-1 gap-6 md:grid-cols-2">
        {CARDS.map((c, i) => {
          const Icon = c.Icon;
          return (
            <ScrollReveal key={c.key} delay={(i % 2) * 0.08}>
              <div className="h-full rounded-2xl border border-bg-border bg-bg-card p-7 shadow-[0_1px_2px_rgba(16,40,90,0.04)]">
                <span
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: c.tint }}
                >
                  <Icon className="h-6 w-6" style={{ color: c.color }} strokeWidth={2} />
                </span>
                <h3 className="font-display text-xl font-bold text-text-primary">{t(`${c.key}.title`)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{t(`${c.key}.body`)}</p>
              </div>
            </ScrollReveal>
          );
        })}
      </div>
    </section>
  );
}
