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
 * The line fills downward as the visitor scrolls through the section. The fill
 * front tracks the middle of the screen, so a stage lights up as its dot
 * reaches the centre of the viewport, and goes back off when the front recedes
 * past it on the way up. Progressive-enhancement + perf:
 *
 * - No JavaScript / SSR: the fill renders at scaleY(1) and the dots red, so the
 *   timeline looks complete rather than a blank line with grey dots.
 * - prefers-reduced-motion: JS leaves that complete state in place, no scroll
 *   animation.
 * - Otherwise JS resets the fill to empty on mount and drives it from its own
 *   rAF loop while the section is near the viewport. The fill is a
 *   compositor-only `transform: scaleY()` on a red overlay with
 *   `transform-origin: top` - never height/top, so it never triggers layout.
 *   Each frame returns immediately unless the scroll position or the viewport
 *   height changed, so an idle in-view section does no layout work, and an
 *   IntersectionObserver cancels the loop outright once the section leaves.
 *   This avoids the main-thread starvation that previously broke navigation and
 *   stuttered the carousel.
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

    // Current on/off state per dot, so a frame only touches classList when a dot
    // actually crosses the line rather than on every frame.
    const dotOn = new Array(dots.length).fill(false);

    const update = () => {
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // The fill front sits at the middle of the screen, so a stage lights up as
      // its dot reaches the centre of the viewport on the way down.
      const p = Math.max(0, Math.min(1, (vh * 0.5 - r.top) / r.height));
      fill.style.transform = `scaleY(${p})`;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        if (!d) continue;
        // Reversible: the fill front passing a dot turns it red going down, and
        // receding past it turns it back off going up.
        const on = p >= fracs[i] - 0.001;
        if (on !== dotOn[i]) {
          dotOn[i] = on;
          setDot(d, on);
        }
      }
    };

    // The fill is driven from several independent sources, because any one of
    // them can fail to fire on a real device.
    //
    // The rule that matters: NOTHING here may gate the event-driven path behind
    // the observer. An earlier version did, and it was the bug. On any load with
    // the section below the fold the observer's first callback reports
    // "not intersecting", which set inView = false, which made schedule() a
    // no-op, which left the scroll listener dead with only another observer
    // callback able to revive it. On iOS that callback apparently never came, so
    // the line sat at zero at every scroll position. The observer now does one
    // job only: start and stop the continuous rAF loop. It can never switch the
    // scroll path off.
    //
    // Scroll is listened for on the document in the capture phase, so it also
    // catches scrolling from a nested scroller rather than only the window, and
    // visualViewport is listened to as well since that is what actually moves on
    // iOS when the address bar collapses.
    //
    // The loop stays cheap: each frame compares scroll position and viewport
    // height against the previous frame and returns immediately when neither
    // moved, so an idle in-view section does no layout work. The only write is a
    // compositor-only transform either way, and all geometry is read fresh from
    // getBoundingClientRect at update time rather than cached.
    let raf = 0;
    let ticking = false;
    let inView = true;
    let lastY = NaN;
    let lastVh = NaN;

    const frame = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (y !== lastY || vh !== lastVh) {
        if (vh !== lastVh) measure(); // address bar shown/hidden: dot positions move
        lastY = y;
        lastVh = vh;
        update();
      }
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!raf) {
        lastY = NaN; // force one update on entry
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    // Deliberately NOT gated on inView: see the note above. Coalesced to one
    // update per frame, and falls back to a direct call if rAF is unavailable.
    const schedule = () => {
      if (ticking) return;
      ticking = true;
      const run = () => {
        ticking = false;
        update();
      };
      if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
      else run();
    };
    const onScroll = () => schedule();
    const onResize = () => {
      measure();
      schedule();
    };

    measure();
    update(); // paint the correct state immediately, without waiting for anything
    // The observer gates the continuous loop. Its first callback fires on
    // observe regardless of whether the section is intersecting, so this also
    // settles the state at mount, including when the page loads already scrolled
    // past the section (scroll restoration / deep link), where p computes to 1
    // and the line renders filled.
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0].isIntersecting;
        measure();
        if (inView) start();
        else {
          stop();
          update(); // settle on the correct end state
        }
      },
      { rootMargin: "120px 0px" }
    );
    io.observe(wrap);
    // Capture phase on the document, so scrolling inside any nested scroller
    // reaches this too, not just a scroll of the window itself.
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onResize, { passive: true });
    // On iOS the address bar collapsing moves the visual viewport without
    // necessarily firing a window resize.
    const vv = window.visualViewport;
    vv?.addEventListener("resize", onResize);
    vv?.addEventListener("scroll", onScroll);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onResize);
      vv?.removeEventListener("resize", onResize);
      vv?.removeEventListener("scroll", onScroll);
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
