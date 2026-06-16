"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export function AnimatedCounter({
  start = 0,
  end,
  suffix = "",
  duration = 2,
}: {
  start?: number;
  end: number;
  suffix?: string;
  duration?: number;
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.4 });
  return (
    <span ref={ref}>
      {inView ? (
        <CountUp start={start} end={end} duration={duration} suffix={suffix} separator=" " />
      ) : (
        <span>{start}{suffix}</span>
      )}
    </span>
  );
}
