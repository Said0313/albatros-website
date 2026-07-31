import Image from "next/image";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Link } from "@/i18n/navigation";
import { brands } from "@/lib/catalog";
import { chipSize } from "@/lib/logoChip";

export function PartnersMarquee() {
  const t = useTranslations("partners");
  const loop = [...brands, ...brands];
  // Mobile: two half-set rows scrolling in opposite directions (first row
  // right, second row left). Each half is duplicated exactly once so the
  // 0 -> -50% loop stays seamless.
  const half = Math.ceil(brands.length / 2);
  const rowA = brands.slice(0, half);
  const rowB = brands.slice(half);
  const loopA = [...rowA, ...rowA];
  const loopB = [...rowB, ...rowB];

  const chip = (b: (typeof brands)[number], i: number) => {
    const { width, height, intrinsic } = chipSize(b.logo);
    return (
      <Link
        key={`${b.id}-${i}`}
        href={`/partners#partner-${b.id}`}
        aria-label={b.name}
        className="logo-chip transition-shadow hover:shadow-[0_10px_28px_-14px_rgba(29,58,130,0.45)]"
      >
        <Image
          src={b.logo}
          alt={b.name}
          width={intrinsic[0]}
          height={intrinsic[1]}
          style={{ "--chip-w": `${width}px`, "--chip-h": `${height}px` } as React.CSSProperties}
          className="object-contain"
        />
      </Link>
    );
  };
  return (
    <section className="section-pad border-t border-bg-border">
      <div className="container-x mb-12">
        <ScrollReveal>
        <div className="section-card mx-auto max-w-3xl px-8 py-6 text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
            {t("homeTitle")}
          </h2>
          <p className="mt-3 text-text-secondary">{t("homeSubtitle")}</p>
        </div>
        </ScrollReveal>
      </div>
      {/* Desktop: single row scrolling right (unchanged) */}
      <div className="marquee hidden lg:block">
        <div className="marquee-track">{loop.map(chip)}</div>
      </div>
      {/* Mobile: two rows, first right, second left */}
      <div className="marquee lg:hidden">
        <div className="marquee-track">{loopA.map(chip)}</div>
      </div>
      <div className="marquee mt-4 lg:hidden">
        <div className="marquee-track-rev">{loopB.map(chip)}</div>
      </div>
    </section>
  );
}
