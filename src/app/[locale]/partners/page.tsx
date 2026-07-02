import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { brands } from "@/lib/catalog";
import { brandSpecialty, brandDescription, brandCountry } from "@/data/i18n";
import { Link } from "@/i18n/navigation";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ContactCTA } from "@/components/home/ContactCTA";

export default function PartnersPage() {
  const t = useTranslations("partners");
  const tc = useTranslations("common");
  const locale = useLocale();
  return (
    <div className="pt-28 md:pt-32">
      <div className="container-x">
        <h1 className="font-display text-4xl font-extrabold text-text-primary md:text-5xl">{t("pageTitle")}</h1>
        <p className="mt-3 max-w-2xl text-text-secondary">{t("pageSubtitle")}</p>

        <div className="mt-12 grid grid-cols-1 gap-6 pb-20 md:grid-cols-2">
          {brands.map((b, i) => (
            <ScrollReveal key={b.id} delay={(i % 2) * 0.08}>
              <div
                id={`partner-${b.id}`}
                className="partner-card flex h-full gap-5 rounded-2xl border border-bg-border bg-bg-card p-6 shadow-[0_1px_2px_rgba(16,40,90,0.04)]"
              >
                <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-lg bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                  <Image src={b.logo} alt={b.name} width={120} height={48} className="max-h-10 w-auto object-contain" />
                </div>
                <div className="flex flex-col">
                  <h3 className="font-display text-lg font-bold text-text-primary">{b.name}</h3>
                  {(b.country || b.founded) && (
                    <div className="mt-1 font-mono text-[11px] uppercase tracking-wide text-brand-teal">
                      {[brandCountry(b, locale), b.founded && t("since", { year: b.founded })].filter(Boolean).join(" · ")}
                    </div>
                  )}
                  {brandSpecialty(b, locale) && (
                    <div className="mt-1 text-[13px] font-medium text-brand-blue-deep">{brandSpecialty(b, locale)}</div>
                  )}
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{brandDescription(b, locale)}</p>
                  <Link
                    href={`/partners/${b.id}`}
                    className="mt-3 inline-flex items-center gap-1 self-start text-sm font-medium text-brand-red-bright hover:gap-2 hover:underline"
                  >
                    {tc("more")}
                    <ArrowRight className="h-3.5 w-3.5 transition-all" />
                  </Link>
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
