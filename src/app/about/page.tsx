import type { Metadata } from "next";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ContactCTA } from "@/components/home/ContactCTA";

export const metadata: Metadata = {
  title: "О компании",
  description: "Albatros Health Care — официальный дистрибьютор IVD-оборудования в Узбекистане с 2017 года. 14 мировых брендов, 2000+ клиентов, сервис 24/7.",
};

const stats = [
  { end: 44, suffix: "+", label: "моделей анализаторов" },
  { end: 18, label: "направлений диагностики" },
  { end: 14, label: "мировых лидеров" },
  { end: 85, label: "организованных конференций" },
  { end: 24, label: "участий в конгрессах" },
  { end: 6, label: "методических пособий" },
  { end: 4500, suffix: "+", label: "обученных врачей" },
  { end: 2000, suffix: "+", label: "клиентов в базе" },
];

const values = [
  { title: "Поставка под ключ", text: "Полный цикл — от подбора оборудования и монтажа до обучения персонала и методической поддержки." },
  { title: "Сервис 24/7", text: "Круглосуточная сервисно-техническая поддержка по всей территории Республики Узбекистан." },
  { title: "Международные стандарты", text: "Работаем только с мировыми лидерами IVD-индустрии, соответствующими стандартам ISO, FDA и Европейской фармакопеи." },
  { title: "Образование", text: "Совместно с ТашИУВ разрабатываем методические пособия и проводим конференции с международным участием." },
];

export default function AboutPage() {
  return (
    <div className="pt-28 md:pt-32">
      <div className="container-x">
        <ScrollReveal>
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-red">О компании</span>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-extrabold leading-tight text-text-primary md:text-5xl">
            Ваш надёжный партнёр в оснащении лаборатории
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-[1.8] text-text-secondary">
            Albatros Health Care основана в 2017 году в Ташкенте. За эти годы мы стали одним из ведущих
            дистрибьюторов медицинского лабораторного оборудования и IVD-решений в Узбекистане. Мы
            представляем 14 мировых брендов: SNIBE, BD, Randox, Dymind, Werfen, Lifotronic, URIT, Illumina,
            Bioquell, Clarius и других. Более 2000 клиентов по всей республике доверяют нам оснащение своих
            лабораторий. Наш слоган — <span className="font-mono text-brand-blue-light">«DRIVING SUCCESS. TOGETHER.»</span>
          </p>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-2 gap-6 border-y border-bg-border py-12 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-bold text-brand-blue-light md:text-4xl">
                <AnimatedCounter end={s.end} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-[13px] text-text-secondary">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 pb-20 md:grid-cols-2">
          {values.map((v, i) => (
            <ScrollReveal key={v.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-bg-border bg-[linear-gradient(145deg,#0C1628,#111E38)] p-7">
                <h3 className="font-display text-xl font-bold text-text-primary">{v.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{v.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
      <ContactCTA />
    </div>
  );
}
