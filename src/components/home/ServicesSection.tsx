"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

/**
 * Shared company service-advantages block, used on BOTH the homepage and the
 * About page (single source of copy + design). Four services (turnkey supply,
 * 24/7 service, international standards, education) from the `services` message
 * namespace, laid out as a VERTICAL TIMELINE: a red line down the left with a
 * dot per stage, headings and body text beside it. No cards, no 01-04 numerals.
 *
 * The line fills downward as the visitor scrolls through the section, and each
 * dot latches red once the fill reaches it. Progressive-enhancement + perf:
 *
 * - No JavaScript / SSR: the fill renders at scaleY(1) and the dots red, so the
 *   timeline looks complete rather than a blank line with grey dots.
 * - prefers-reduced-motion: JS leaves that complete state in place, no scroll
 *   animation.
 * - Otherwise JS resets the fill to empty on mount and drives it from scroll.
 *   The fill is a compositor-only `transform: scaleY()` on a red overlay with
 *   `transform-origin: top` - never height/top, so it never triggers layout.
 *   The scroll listener is passive and throttled through requestAnimationFrame
 *   (one transform write + a few dot class toggles per frame), and an
 *   IntersectionObserver gates it so nothing runs while the section is off
 *   screen. This avoids the main-thread starvation that previously broke
 *   navigation and stuttered the carousel.
 *
 * The whole timeline still sits on the section-card surface so the text is
 * readable over the particle field.
 */
const STAGES = ["turnkey", "service", "standards", "education"] as const;

const DOT_ON = ["bg-brand-red", "border-brand-red"];
const DOT_OFF = ["bg-bg-card", "border-bg-border"];

function setDot(dot: HTMLElement, on: boolean) {
  if (on) {
    dot.classList.add(...DOT_ON);
    dot.classList.remove(...DOT_OFF);
  } else {
    dot.classList.add(...DOT_OFF);
    dot.classList.remove(...DOT_ON);
  }
}

export function ServicesSection() {
  const t = useTranslations("services");
  const wrapRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const fill = fillRef.current;
    if (!wrap || !fill) return;
    const dots = dotRefs.current;

    // Respect reduced motion: keep the complete state the markup already has.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Enhance: reset to empty and drive from scroll.
    fill.style.transform = "scaleY(0)";
    dots.forEach((d) => d && setDot(d, false));

    // Fraction (0..1) of the track height at which each dot sits, so a dot
    // latches red exactly as the red fill reaches it. Measured from real
    // positions so uneven stage heights (RU/UZ/EN differ) stay accurate.
    let fracs: number[] = [];
    const measure = () => {
      const top = wrap.getBoundingClientRect().top + window.scrollY + 8; // top-2 inset
      const trackH = wrap.offsetHeight - 16;
      fracs = dots.map((d) => {
        if (!d || trackH <= 0) return 1;
        const r = d.getBoundingClientRect();
        return (r.top + window.scrollY + r.height / 2 - top) / trackH;
      });
    };

    const latched = new Array(dots.length).fill(false);
    let ticking = false;
    let inView = false;

    const update = () => {
      ticking = false;
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh * 0.72 - r.top) / r.height));
      fill.style.transform = `scaleY(${p})`;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        if (d && !latched[i] && p >= fracs[i] - 0.001) {
          latched[i] = true; // dots stay red once reached
          setDot(d, true);
        }
      }
    };

    const onScroll = () => {
      if (!inView || ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    // The observer's first callback fires on observe regardless of whether the
    // section is intersecting, so running one update on every intersection
    // change (enter AND leave) sets the correct state at mount too - including
    // when the page loads already scrolled past the section (scroll restoration
    // / deep link): update then computes p >= 1 and fills the line. Only the
    // continuous per-scroll work below is gated to the in-view window.
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        measure();
        requestAnimationFrame(update);
      },
      { rootMargin: "120px 0px" }
    );
    io.observe(wrap);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section className="py-8 md:py-14">
      <div className="container-x">
        <div className="section-card px-6 py-10 md:px-10">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl font-bold text-text-primary md:text-4xl">{t("sectionTitle")}</h2>
          </div>

          <div ref={wrapRef} className="relative mx-auto w-fit max-w-full">
            {/* Track and fill share the same top-2/bottom-2 inset, so the fill's
                scaleY maps 1:1 onto the track without measuring its height. */}
            <div aria-hidden className="pointer-events-none absolute bottom-2 left-[7px] top-2 w-0.5 bg-bg-border" />
            <div
              ref={fillRef}
              aria-hidden
              className="timeline-fill pointer-events-none absolute bottom-2 left-[7px] top-2 w-0.5 origin-top bg-brand-red"
              style={{ transform: "scaleY(1)" }}
            />

            <ol className="relative space-y-9">
              {STAGES.map((key, i) => (
                <li key={key} className="relative flex gap-5">
                  <span
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    aria-hidden
                    className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-2 border-brand-red bg-brand-red"
                  />
                  <div className="min-w-0 max-w-[72ch]">
                    <h3 className="font-display text-lg font-bold leading-snug text-text-primary md:text-xl">
                      {t(`${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary">{t(`${key}.body`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
