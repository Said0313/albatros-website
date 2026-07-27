"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

/**
 * Count-up as PROGRESSIVE ENHANCEMENT. The server-rendered HTML (and the
 * pre-hydration client render, so markup matches) contains the real END value:
 * visitors without JS and search engines see the true figure, never the start
 * value. Once hydrated and scrolled into view, the number animates.
 */
export function AnimatedCounter({
  start = 0,
  end,
  suffix = "",
  duration = 2,
  plain = false,
}: {
  start?: number;
  end: number;
  suffix?: string;
  duration?: number;
  plain?: boolean;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.4 });
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const staticText = `${plain ? String(end) : end.toLocaleString("en-US").replace(/,/g, " ")}${suffix}`;
  return (
    <span ref={ref}>
      {hydrated && inView ? (
        <CountUp start={start} end={end} duration={duration} suffix={suffix} separator={plain ? "" : " "} />
      ) : (
        <span>{staticText}</span>
      )}
    </span>
  );
}
