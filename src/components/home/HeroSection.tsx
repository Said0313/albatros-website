"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

const DNACanvas = dynamic(() => import("@/components/ui/DNACanvas"), { ssr: false });

export function HeroSection() {
  const t = useTranslations("hero");
  const tc = useTranslations("common");
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden" style={{ background: "var(--grad-hero)" }}>
      <DNACanvas />
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "radial-gradient(ellipse 70% 55% at 50% 38%, rgba(46,84,156,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="container-x relative z-10 py-28">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="inline-flex items-center rounded-full border border-bg-border bg-white/70 px-4 py-1.5 text-[13px] text-text-secondary shadow-[0_1px_2px_rgba(16,40,90,0.04)]"
          >
            {t("eyebrow")}
          </motion.div>

          <h1 className="mt-7 font-display text-[clamp(28px,7.5vw,56px)] font-extrabold leading-[1.05] tracking-tight text-text-primary lg:text-[76px]">
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
