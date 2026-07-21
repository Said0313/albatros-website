import { useTranslations } from "next-intl";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const stats = [
  { value: 2017, start: 2010, key: "founded", plain: true },
  { value: 12, start: 0, key: "brands" },
  { value: 900, start: 0, suffix: "+", key: "clients" },
  { static: "24/7", key: "service" },
];

export function StatsBar() {
  const t = useTranslations("statsBar");
  return (
    <section className="border-y border-bg-border bg-[rgba(244,247,251,0.86)] backdrop-blur-[6px]">
      <div className="container-x grid grid-cols-2 gap-y-8 py-12 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`flex flex-col items-center text-center ${i < stats.length - 1 ? "lg:border-r lg:border-bg-border" : ""}`}
          >
            <span className="font-display text-4xl font-bold text-brand-blue-deep">
              {s.static ? s.static : <AnimatedCounter start={s.start} end={s.value!} suffix={s.suffix} plain={s.plain} />}
            </span>
            <span className="mt-2 text-[13px] text-text-secondary">{t(s.key)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
