import type { Metadata } from "next";
import Image from "next/image";
import { brands } from "@/lib/catalog";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ContactCTA } from "@/components/home/ContactCTA";

export const metadata: Metadata = {
  title: "Партнёры",
  description: "Мировые бренды-партнёры Albatros Health Care: SNIBE, BD, Randox, Dymind, Werfen, Illumina, Lifotronic, URIT, Clarius, Condalab и другие.",
};

export default function PartnersPage() {
  return (
    <div className="pt-28 md:pt-32">
      <div className="container-x">
        <h1 className="font-display text-4xl font-extrabold text-text-primary md:text-5xl">Наши партнёры</h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Мы представляем в Узбекистане 14 мировых лидеров индустрии in-vitro диагностики.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 pb-20 md:grid-cols-2">
          {brands.map((b, i) => (
            <ScrollReveal key={b.id} delay={(i % 2) * 0.08}>
              <div className="flex h-full gap-5 rounded-2xl border border-bg-border bg-[linear-gradient(145deg,#0C1628,#111E38)] p-6">
                <div className="flex h-20 w-32 shrink-0 items-center justify-center rounded-lg bg-white p-4 shadow-[0_4px_24px_rgba(0,0,0,0.25)]">
                  <Image src={b.logo} alt={b.name} width={120} height={48} className="max-h-10 w-auto object-contain" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-text-primary">{b.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{b.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
      <ContactCTA />
    </div>
  );
}
