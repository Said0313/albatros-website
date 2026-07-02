import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { clients } from "@/data/clients";

/**
 * Clients logo marquee. Mirrors <PartnersMarquee> (same .marquee / .logo-chip
 * chrome, same duplicated-track seamless loop) but scrolls LEFT and a touch
 * slower/calmer via the .marquee-track-rev class (globals.css).
 *
 * Uses a plain <img> instead of next/image because the client logos are a mix of
 * formats including SVG, which next/image blocks unless dangerouslyAllowSVG is
 * enabled in next.config; a raw <img> renders every format uniformly and the
 * visual result inside .logo-chip is identical.
 */
export function ClientsMarquee() {
  const t = useTranslations("clients");
  const loop = [...clients, ...clients];
  return (
    <section className="section-pad border-t border-bg-border">
      <div className="container-x mb-12 text-center">
        <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
          {t("homeTitle")}
        </h2>
      </div>
      <div className="marquee">
        <div className="marquee-track-rev">
          {loop.map((c, i) => (
            <Link
              key={`${c.id}-${i}`}
              href="/partners"
              aria-label={c.name}
              className="logo-chip transition-shadow hover:shadow-[0_10px_28px_-14px_rgba(29,58,130,0.45)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.logo} alt={c.name} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
