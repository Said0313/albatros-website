"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";
import { AlbatrosWordmark } from "@/components/ui/AlbatrosWordmark";

/**
 * "О компании" stats panel — ported from the Claude Design "Albatros About"
 * prototype, converted to the light theme. Two-column identity + count-up stats.
 * The wordmark is set in the site font (Inter) via <AlbatrosWordmark> to avoid
 * the raster logo's font clash. Numbers count up on scroll; static under reduced-motion.
 */

interface Stat {
  num: number;
  suffix: string;
  key: string;
  year?: boolean;
}

const STATS: Stat[] = [
  { num: 44, suffix: "+", key: "models" },
  { num: 12, suffix: "", key: "brands" },
  { num: 900, suffix: "+", key: "clients" },
  { num: 24, suffix: "/7", key: "support" },
  { num: 2017, suffix: "", key: "founded", year: true },
  { num: 4500, suffix: "+", key: "trained" },
];

const fmt = (n: number) => n.toLocaleString("en-US").replace(/,/g, " ");

const ACCENT = "#ED1C24";

function useCountUp(target: number, run: boolean, duration = 1600) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!run) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, duration]);
  return value;
}

function StatItem({ stat, run }: { stat: Stat; run: boolean }) {
  const value = useCountUp(stat.num, run);
  const t = useTranslations("about.stats");
  return (
    <div style={{ padding: "30px 0", borderTop: "1px solid #E5EAF3" }}>
      <div style={{ display: "flex", alignItems: "baseline", lineHeight: 1 }}>
        <span style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 800, fontSize: "clamp(36px,11vw,58px)", color: "#0C1B3A", letterSpacing: "-.01em" }}>
          {stat.year ? value : fmt(value)}
        </span>
        {stat.suffix && (
          <span style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 800, fontSize: "clamp(20px,6vw,32px)", marginLeft: 2, color: ACCENT }}>
            {stat.suffix}
          </span>
        )}
      </div>
      <div style={{ color: "#5E6E8F", fontSize: 15, marginTop: 14 }}>{t(stat.key)}</div>
    </div>
  );
}

export function AboutSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
  const runRef = useRef(false);
  const t = useTranslations("about");
  if (inView) runRef.current = true;

  return (
    <section
      style={{ position: "relative", background: "#EEF3FA", fontFamily: "var(--font-inter), sans-serif", overflow: "hidden" }}
    >
      <div
        style={{
          position: "absolute",
          top: "-10%",
          left: "-6%",
          width: 560,
          height: 560,
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(46,84,156,.06),transparent 68%)",
          filter: "blur(8px)",
          pointerEvents: "none",
        }}
      />

      <div
        ref={ref}
        className="container-x grid grid-cols-1 items-center gap-14 py-24 lg:grid-cols-[1.05fr_1.35fr] lg:gap-20"
        style={{ position: "relative" }}
      >
        {/* left: identity */}
        <div>
          <div style={{ fontFamily: "var(--font-mono), var(--font-inter), monospace", fontSize: 13, letterSpacing: ".18em", color: "#2E8AA0", marginBottom: 30 }}>
            {t("eyebrow")}
          </div>
          <div style={{ marginBottom: 34 }}>
            <AlbatrosWordmark markSize={56} textSize={40} />
          </div>
          <p style={{ color: "#5E6E8F", fontSize: 18, lineHeight: 1.65, maxWidth: 440, margin: 0 }}>{t("panelText")}</p>
        </div>

        {/* right: stats */}
        <div className="grid grid-cols-2 gap-x-6 sm:gap-x-12">
          {STATS.map((s) => (
            <StatItem key={s.key} stat={s} run={runRef.current} />
          ))}
        </div>
      </div>
    </section>
  );
}
