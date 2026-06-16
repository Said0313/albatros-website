"use client";

import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { fadeUp } from "@/lib/animations";

export function ScrollReveal({
  children,
  variant = fadeUp,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variants;
  delay?: number;
  className?: string;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.12 });
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variant}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
