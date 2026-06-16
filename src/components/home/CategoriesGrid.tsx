"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FlaskConical, Beaker, Droplets, Microscope, Bug, Dna, Wind, Activity,
  BarChart3, TestTube2, Stethoscope, ShieldCheck, BadgeCheck, Workflow,
  HeartPulse, AlertTriangle, type LucideIcon,
} from "lucide-react";
import { categories } from "@/lib/catalog";

const icons: Record<string, LucideIcon> = {
  FlaskConical, Beaker, Droplets, Microscope, Bug, Dna, Wind, Activity,
  BarChart3, TestTube2, Stethoscope, ShieldCheck, BadgeCheck, Workflow,
  HeartPulse, AlertTriangle,
};

export function CategoriesGrid() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="section-pad">
      <div className="container-x">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">Направления диагностики</h2>
          <p className="mt-3 text-text-secondary">18 специализаций лабораторной диагностики</p>
        </div>

        <div ref={ref} className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map((c, i) => {
            const Icon = icons[c.icon] ?? FlaskConical;
            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.04, duration: 0.5 }}
              >
                <Link
                  href={`/catalog?category=${encodeURIComponent(c.name)}`}
                  className="flex h-full flex-col rounded-xl border border-bg-border bg-[linear-gradient(145deg,#0C1628,#111E38)] p-5 transition-all duration-300 hover:scale-[1.03] hover:border-brand-red hover:shadow-[0_0_20px_rgba(208,24,31,0.12)]"
                >
                  <Icon className="h-6 w-6 text-brand-red" />
                  <span className="mt-2 text-[13px] text-text-primary">{c.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
