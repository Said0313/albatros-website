"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { useFieldReveal } from "@/components/ui/ParticleField";

// Reveal choreography: 550ms per element, 100ms stagger, translateY 18px -> 0.
// fast (intro skipped by click/scroll): no stagger, 0.4x durations.
const EASE = [0.2, 0.7, 0.2, 1] as const;

export function HeroSection() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  // The particle field is mounted site-wide in the layout; its intro fires the
  // reveal signal through context (fast=true when skipped by click/scroll).
  const reveal = useFieldReveal();

  // Safety net: if the signal never arrives (field failed to mount, or the
  // intro stalled in a throttled tab), reveal anyway so the hero can never get
  // stuck invisible. The intro naturally fires at ~4.7s (spread phase at
  // speed 0.75), so the fallback sits just past it; anything shorter would
  // preempt the choreography on every normal load.
  const [safety, setSafety] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setSafety(true), 6000);
    return () => clearTimeout(id);
  }, []);

  const on = reveal.on || safety;
  const fast = reveal.fast;
  const dur = fast ? 0.55 * 0.4 : 0.55;
  const stagger = (i: number) => (fast ? 0 : i * 0.1);
  const item = (i: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: on ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { delay: stagger(i), duration: dur, ease: EASE },
  });

  return (
    // pt equals the fixed navbar height so the vertical centering happens in
    // the space BELOW the navbar; the container padding adds breathing room.
    // No background: the section is transparent so the site-wide field (fixed
    // z-0, below main's z-1) shows through; the body carries the page color.
    <section className="relative flex min-h-[78vh] items-center overflow-hidden pt-16 md:pt-20">
      <div className="container-x relative z-10 py-20 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-[clamp(28px,7vw,52px)] font-extrabold leading-[1.05] tracking-tight text-text-primary lg:text-[68px]">
            <motion.span {...item(0)} className="block">
              {t("titleA")}
            </motion.span>
            <motion.span {...item(1)} className="block">
              {t("titleB")}{" "}
              <span className="relative inline-block grad-text">
                {t("titleHighlight")}
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 300 8" preserveAspectRatio="none">
                  <motion.path
                    d="M0,4 Q150,8 300,4"
                    stroke="var(--red-primary)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="400"
                    initial={{ strokeDashoffset: 400 }}
                    animate={{ strokeDashoffset: on ? 0 : 400 }}
                    transition={{ delay: fast ? 0.28 : 0.7, duration: fast ? 0.24 : 0.6 }}
                  />
                </svg>
              </span>
            </motion.span>
          </h1>

          <motion.p {...item(2)} className="mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-text-secondary sm:text-[19px]">
            {t("subtitle")}
          </motion.p>

          <motion.div {...item(3)} className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Button href="/catalog">{tc("openCatalog")}</Button>
            </motion.div>
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Button href="/about" variant="outline">{tc("aboutCompany")}</Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{ delay: fast ? 0.3 : 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <ChevronDown className="h-6 w-6 animate-bounceY text-text-muted" />
      </motion.div>
    </section>
  );
}
