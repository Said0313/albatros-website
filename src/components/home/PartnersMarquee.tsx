import Image from "next/image";
import { brands } from "@/lib/catalog";

export function PartnersMarquee() {
  const loop = [...brands, ...brands];
  return (
    <section className="section-pad border-t border-bg-border">
      <div className="container-x mb-12 text-center">
        <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
          Наши зарубежные партнёры
        </h2>
        <p className="mt-3 text-text-secondary">
          14 мировых лидеров In-Vitro диагностики в Узбекистане
        </p>
      </div>
      <div className="marquee">
        <div className="marquee-track">
          {loop.map((b, i) => (
            <div key={`${b.id}-${i}`} className="logo-chip">
              <Image
                src={b.logo}
                alt={b.name}
                width={150}
                height={36}
                className="h-9 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
