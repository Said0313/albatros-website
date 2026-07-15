import type { Metadata } from "next";
import { useLocale, useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { clients } from "@/data/clients";
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
  const tcl = useTranslations("clients");
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
              <div className="font-display text-3xl font-bold text-brand-blue-deep md:text-4xl">
                <AnimatedCounter end={s.end} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-[13px] text-text-secondary">{t(`stats.${s.key}`)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <ServicesSection />
      </div>

      <div className="container-x">
        <section id="clients" className="mt-16 scroll-mt-28 border-t border-bg-border pt-14 pb-20">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">{tcl("pageTitle")}</h2>
          <p className="mt-4 font-display text-xl font-bold text-brand-blue-deep md:text-2xl">{tcl("scaleStat")}</p>
          <p className="mt-2 max-w-2xl text-text-secondary">{tcl("scaleNote")}</p>

          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
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
        </section>

        <section id="certificates" className="mt-16 scroll-mt-28 border-t border-bg-border pt-14 pb-20">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">{t("certificatesTitle")}</h2>
          {certificates.length > 0 ? (
            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {certificates.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-center rounded-2xl border border-bg-border bg-bg-card p-4 shadow-[0_1px_2px_rgba(16,40,90,0.04)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.image} alt={c.title ?? ""} className="h-auto w-full object-contain" />
                </div>
              ))}
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
