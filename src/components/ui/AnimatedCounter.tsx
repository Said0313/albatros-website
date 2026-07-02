"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

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
  return (
    <span ref={ref}>
      {inView ? (
        <CountUp start={start} end={end} duration={duration} suffix={suffix} separator={plain ? "" : " "} />
      ) : (
        <span>{start}{suffix}</span>
      )}
    </span>
  );
}
