import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

const stats = [
  { value: 2017, start: 2010, label: "год основания" },
  { value: 14, start: 0, label: "мировых бренда" },
  { value: 2000, start: 0, suffix: "+", label: "клиентов в базе" },
  { static: "24/7", label: "технический сервис" },
];

export function StatsBar() {
  return (
    <section className="border-y border-bg-border bg-bg-elevated">
      <div className="container-x grid grid-cols-2 gap-y-8 py-12 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`flex flex-col items-center text-center ${i < stats.length - 1 ? "lg:border-r lg:border-bg-border" : ""}`}
          >
            <span className="font-display text-4xl font-bold text-brand-blue-light">
              {s.static ? s.static : <AnimatedCounter start={s.start} end={s.value!} suffix={s.suffix} />}
            </span>
            <span className="mt-2 text-[13px] text-text-secondary">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
