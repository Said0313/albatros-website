import { useTranslations } from "next-intl";
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
            <div key={`${c.id}-${i}`} className="logo-chip">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.logo} alt={c.name} className="h-9 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
