import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { certificates } from "@/data/certificates";
import { totalPositions } from "@/lib/catalog";
import { pageMetadata, type AppLocale } from "@/lib/seo";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ContactCTA } from "@/components/home/ContactCTA";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    path: "/about",
    title: t("about.title"),
    description: t("about.description"),
  });
}

const stats = [
  { end: 45, suffix: "+", key: "models" },
  { end: 16, key: "directions" },
  { end: 12, key: "leaders" },
  { end: 85, key: "conferences" },
  { end: 24, key: "congresses" },
  { end: totalPositions(), suffix: "+", key: "assortment" },
  { end: 4500, suffix: "+", key: "doctors" },
  { end: 900, suffix: "+", key: "clients" },
];

export default function AboutPage() {
  const t = useTranslations("aboutPage");
  const locale = useLocale();
  return (
    <div className="pt-28 md:pt-32">
      <div className="container-x">
        <ScrollReveal>
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-red">{t("eyebrow")}</span>
          <h1 className="mt-3 max-w-3xl font-display text-[clamp(26px,6.5vw,36px)] font-extrabold leading-tight text-text-primary md:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-[1.8] text-text-secondary">{t("intro1")}</p>
          <p className="mt-5 max-w-3xl text-base leading-[1.8] text-text-secondary">
            {t("intro2")} <span className="font-mono text-brand-blue-deep">{t("slogan")}</span>
          </p>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-2 gap-6 border-y border-bg-border py-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.key} className="text-center">
              <div className="font-display text-2xl font-bold text-brand-blue-deep sm:text-3xl md:text-4xl">
                <AnimatedCounter end={s.end} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-xs text-text-secondary sm:text-[13px]">{t(`stats.${s.key}`)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <ServicesSection />
      </div>

      <div className="container-x">
        <section id="certificates" className="mt-16 scroll-mt-28 border-t border-bg-border pt-14 pb-20">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">{t("certificatesTitle")}</h2>
          {certificates.filter((c) => !c.hidden).length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {certificates.filter((c) => !c.hidden).map((c) => {
                const certTitle =
                  locale === "uz" ? c.titleUz ?? c.title
                  : locale === "en" ? c.titleEn ?? c.title
                  : c.title;
                return (
                  <a
                    key={c.id}
                    href={c.file ?? c.image}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group"
                  >
                    <div className="flex items-center justify-center rounded-2xl border border-bg-border bg-bg-card p-4 shadow-[0_1px_2px_rgba(16,40,90,0.04)] transition group-hover:border-brand-blue-light">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.image} alt={certTitle ?? ""} className="h-auto w-full object-contain" />
                    </div>
                    {certTitle && (
                      <div className="mt-2 text-center text-sm text-text-secondary">{certTitle}</div>
                    )}
                  </a>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 flex items-center justify-center rounded-2xl border border-dashed border-bg-border bg-bg-elevated py-16 text-sm text-text-muted">
              {t("certificatesEmpty")}
            </div>
          )}
        </section>
      </div>
      <ContactCTA />
    </div>
  );
}
