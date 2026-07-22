import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { brands } from "@/lib/catalog";

export function PartnersMarquee() {
  const t = useTranslations("partners");
  const loop = [...brands, ...brands];
  return (
    <section className="section-pad border-t border-bg-border">
      <div className="container-x mb-12">
        <div className="section-card mx-auto max-w-3xl px-8 py-6 text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
            {t("homeTitle")}
          </h2>
          <p className="mt-3 text-text-secondary">{t("homeSubtitle")}</p>
        </div>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {loop.map((b, i) => (
            <Link
              key={`${b.id}-${i}`}
              href={`/partners#partner-${b.id}`}
              aria-label={b.name}
              className="logo-chip transition-shadow hover:shadow-[0_10px_28px_-14px_rgba(29,58,130,0.45)]"
            >
              <Image
                src={b.logo}
                alt={b.name}
                width={160}
                height={48}
                className="w-auto object-contain"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
