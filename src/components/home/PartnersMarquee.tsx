import Image from "next/image";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Link } from "@/i18n/navigation";
import { brands } from "@/lib/catalog";
import logoSizes from "@/data/logoSizes.json";

// The track scrolls with translateX(-50%), which is relative to its CURRENT
// width, and images.unoptimized means the logos arrive progressively at full
// size. Declaring a guessed box (160x48 for every logo) let each logo's width
// snap by up to 111px as its file loaded, moving the running animation and
// producing the intermittent jerk. Real intrinsic sizes make the track width
// final at first paint. Regenerate with scripts/gen-logo-sizes.mjs.
const SIZES: Record<string, number[]> = logoSizes;
const sizeOf = (logo: string): [number, number] => {
  const s = SIZES[logo];
  return s && s.length === 2 ? [s[0], s[1]] : [160, 48];
};

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
    const [w, h] = sizeOf(b.logo);
    return (
      <Link
        key={`${b.id}-${i}`}
        href={`/partners#partner-${b.id}`}
        aria-label={b.name}
        className="logo-chip transition-shadow hover:shadow-[0_10px_28px_-14px_rgba(29,58,130,0.45)]"
      >
        <Image src={b.logo} alt={b.name} width={w} height={h} className="w-auto object-contain" />
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
