"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll reveal with a hard visibility guarantee. The SSR/no-JS default is
 * fully visible: the hidden starting state (opacity 0, translateY 18px) is
 * applied by JS only once IntersectionObserver is live, and every path
 * (observer hit, safety timeout, reduced motion, missing observer, element
 * already in view) lands back on visible. Reveals once and stays visible.
 *
 * Effect: fade + rise, 500ms, cubic-bezier(.2,.7,.2,1). Grouped items pass a
 * per-index `delay` (seconds) for a small stagger.
 */
export function ScrollReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Content already (partly) on screen at mount stays visible: arming it
    // would flash, and above-the-fold text (incl. the hero area) must not be
    // touched by the scroll reveal.
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.85 && r.bottom > 0) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    el.style.transition =
      `opacity 0.5s cubic-bezier(.2,.7,.2,1) ${delay}s, ` +
      `transform 0.5s cubic-bezier(.2,.7,.2,1) ${delay}s`;

    let done = false;
    let tid = 0;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) show();
      },
      // fire when the element is ~15% into the viewport
      { rootMargin: "0px 0px -15% 0px" }
    );
    const show = () => {
      if (done) return;
      done = true;
      // clearing the inline start values transitions back to the stylesheet
      // defaults (opacity 1, no transform): no layout shift, clean end state
      el.style.opacity = "";
      el.style.transform = "";
      obs.disconnect();
      window.clearTimeout(tid);
    };
    obs.observe(el);
    // absolute safety net: nothing may stay hidden even if the observer
    // never fires for any reason
    tid = window.setTimeout(show, 8000);

    return () => {
      obs.disconnect();
      window.clearTimeout(tid);
      el.style.opacity = "";
      el.style.transform = "";
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
