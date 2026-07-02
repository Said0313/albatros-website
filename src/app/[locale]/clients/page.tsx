import { useLocale, useTranslations } from "next-intl";
import { clients } from "@/data/clients";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ContactCTA } from "@/components/home/ContactCTA";

/**
 * Clients page — same card design as /partners. Each card shows the client logo,
 * name, and (where available) a short description. Four clients have no vetted
 * description yet and render logo + name only. A scale line conveys reach while
 * making clear only a selection is shown.
 */
export default function ClientsPage() {
  const t = useTranslations("clients");
  const locale = useLocale();
  return (
    <div className="pt-28 md:pt-32">
      <div className="container-x">
        <h1 className="font-display text-4xl font-extrabold text-text-primary md:text-5xl">{t("pageTitle")}</h1>
        <p className="mt-4 font-display text-xl font-bold text-brand-blue-deep md:text-2xl">{t("scaleStat")}</p>
        <p className="mt-2 max-w-2xl text-text-secondary">{t("scaleNote")}</p>

        <div className="mt-12 grid grid-cols-1 gap-6 pb-20 md:grid-cols-2">
          {clients.map((c, i) => {
            const desc = locale === "uz" ? c.descriptionUz ?? c.description : c.description;
            return (
              <ScrollReveal key={c.id} delay={(i % 2) * 0.08}>
                <div className="flex h-full gap-5 rounded-2xl border border-bg-border bg-bg-card p-6 shadow-[0_1px_2px_rgba(16,40,90,0.04)]">
                  <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-lg bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.logo} alt={c.name} className="max-h-12 w-auto object-contain" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-text-primary">{c.name}</h3>
                    {desc && <p className="mt-2 text-sm leading-relaxed text-text-secondary">{desc}</p>}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
      <ContactCTA />
    </div>
  );
}
