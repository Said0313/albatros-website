import Image from "next/image";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { slideFromLeft, slideFromRight } from "@/lib/animations";

const highlights = [
  "Поставка под ключ с методической поддержкой",
  "Специалисты с профильным образованием",
  "Международные конференции и семинары",
];

const orbitBrands = ["SNIBE", "BD", "Randox", "Werfen", "Dymind", "Illumina"];

export function AboutSection() {
  return (
    <section className="section-pad border-t border-bg-border">
      <div className="container-x grid grid-cols-1 items-center gap-14 lg:grid-cols-[3fr_2fr]">
        <ScrollReveal variant={slideFromLeft}>
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-red">О компании</span>
          <h2 className="mt-3 font-display text-3xl font-bold leading-tight text-text-primary md:text-[38px]">
            Ваш надёжный партнёр в оснащении лаборатории
          </h2>
          <p className="mt-5 text-base leading-[1.8] text-text-secondary">
            Albatros Health Care с 2017 года поставляет современное лабораторное оборудование и
            IVD-решения по всему Узбекистану. Мы представляем 14 мировых лидеров отрасли и обслуживаем
            более 2000 клиентов — от районных лабораторий до крупнейших клинических центров.
            Поставка под ключ, методическая поддержка и круглосуточный технический сервис — наш стандарт работы.
          </p>
          <ul className="mt-6 space-y-3">
            {highlights.map((h) => (
              <li key={h} className="flex items-center gap-3 text-text-primary">
                <span className="h-2 w-2 shrink-0 rounded-full bg-brand-red" />
                {h}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <Button href="/about" variant="outline">Подробнее о компании</Button>
          </div>
        </ScrollReveal>

        <ScrollReveal variant={slideFromRight}>
          <div className="relative mx-auto flex aspect-square w-full max-w-[380px] items-center justify-center">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 380 380">
              <circle cx="190" cy="190" r="90" fill="none" stroke="rgba(46,84,156,0.35)" strokeWidth="1" className="origin-center animate-spin-slow" style={{ transformBox: "fill-box" }} />
              <circle cx="190" cy="190" r="130" fill="none" stroke="rgba(93,127,180,0.25)" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="190" cy="190" r="170" fill="none" stroke="rgba(208,24,31,0.2)" strokeWidth="1" />
            </svg>
            <div className="absolute inset-0 animate-spin-slow">
              {orbitBrands.map((b, i) => {
                const angle = (i / orbitBrands.length) * 2 * Math.PI;
                const r = 130;
                const x = 190 + r * Math.cos(angle);
                const y = 190 + r * Math.sin(angle);
                return (
                  <div
                    key={b}
                    className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bg-border bg-bg-card text-[9px] font-bold text-text-secondary"
                    style={{ left: `${(x / 380) * 100}%`, top: `${(y / 380) * 100}%` }}
                  >
                    {b}
                  </div>
                );
              })}
            </div>
            <div className="relative z-10 flex h-28 w-28 animate-float items-center justify-center rounded-full border border-bg-border bg-bg-card p-4">
              <Image src="/logo.png" alt="Albatros" width={90} height={90} className="h-auto w-full object-contain" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
