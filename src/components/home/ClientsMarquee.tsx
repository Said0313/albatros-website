import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Link } from "@/i18n/navigation";
import { clients } from "@/data/clients";
import logoSizes from "@/data/logoSizes.json";

/**
 * Clients logo marquee. Mirrors <PartnersMarquee> (same .marquee / .logo-chip
 * chrome, same duplicated-track seamless loop) but scrolls LEFT and a touch
 * slower/calmer via the .marquee-track-rev class (globals.css).
 *
 * Uses a plain <img> instead of next/image because the client logos are a mix of
 * formats including SVG, which next/image blocks unless dangerouslyAllowSVG is
 * enabled in next.config; a raw <img> renders every format uniformly and the
 * visual result inside .logo-chip is identical.
 *
 * The width/height attributes are the logo's REAL intrinsic size (from
 * src/data/logoSizes.json, regenerate with scripts/gen-logo-sizes.mjs). Without
 * them a raw <img> has no aspect ratio until its file arrives, so with
 * images.unoptimized every chip started at zero width and widened as it loaded.
 * The track scrolls with translateX(-50%), which is relative to its current
 * width, so that reflow moved the running animation and made it jump.
 */
const SIZES = logoSizes as Record<string, [number, number]>;
const sizeOf = (logo: string): [number, number] => SIZES[logo] ?? [160, 48];

export function ClientsMarquee() {
  const t = useTranslations("clients");
  const loop = [...clients, ...clients];
  // Mobile: two half-set rows scrolling in opposite directions (first row
  // right, second row left), each duplicated once for the seamless loop.
  const half = Math.ceil(clients.length / 2);
  const rowA = clients.slice(0, half);
  const rowB = clients.slice(half);
  const loopA = [...rowA, ...rowA];
  const loopB = [...rowB, ...rowB];

  const chip = (c: (typeof clients)[number], i: number) => {
    const [w, h] = sizeOf(c.logo);
    return (
      <Link
        key={`${c.id}-${i}`}
        href="/about#clients"
        aria-label={c.name}
        className="logo-chip transition-shadow hover:shadow-[0_10px_28px_-14px_rgba(29,58,130,0.45)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={c.logo} alt={c.name} width={w} height={h} />
      </Link>
    );
  };
  return (
    <section className="section-pad border-t border-bg-border">
      <div className="container-x mb-12">
        <ScrollReveal>
        <div className="section-card mx-auto max-w-3xl px-8 py-6 text-center">
          <Link href="/about#clients" className="inline-block transition-colors hover:text-brand-blue-deep">
            <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
              {t("homeTitle")}
            </h2>
          </Link>
          <p className="mt-3 text-text-secondary">{t("homeSubtitle")}</p>
        </div>
        </ScrollReveal>
      </div>
      {/* Desktop: single row scrolling left (unchanged) */}
      <div className="marquee hidden lg:block">
        <div className="marquee-track-rev">{loop.map(chip)}</div>
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
