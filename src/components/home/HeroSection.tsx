"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export function HeroSection() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  return (
    // Transparent so the site-wide particle field (fixed z-0, mounted in the
    // layout) shows through behind the headline, including its logo-print
    // intro. pt equals the fixed navbar height so vertical centering happens
    // in the space BELOW the navbar. The old DNACanvas + grad-hero backdrop is
    // removed: only one field renders now.
    <section className="relative flex min-h-[78vh] items-center overflow-hidden pt-16 md:pt-20">

      <div className="container-x relative z-10 py-20 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-[clamp(28px,7vw,52px)] font-extrabold leading-[1.05] tracking-tight text-text-primary lg:text-[68px]">
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="block"
            >
              {t("titleA")}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="block"
            >
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
                    animate={{ strokeDashoffset: 0 }}
                    transition={{ delay: 0.9, duration: 0.6 }}
                  />
                </svg>
              </span>
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-text-secondary sm:text-[19px]"
          >
            {t("subtitle")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
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
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <ChevronDown className="h-6 w-6 animate-bounceY text-text-muted" />
      </motion.div>
    </section>
  );
}
