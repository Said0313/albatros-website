import { useCallback, useRef } from "react";

/**
 * Shared "do not strand the visitor" guard for collapsing a long list back to a
 * short preview. Put the returned `ref` on the list's root element and call
 * `guard()` in the same handler that triggers the collapse (right after the
 * setState). It measures on the next frame - by then the hidden items have
 * collapsed the DOM - and, if the now-short list sits entirely above the
 * viewport (i.e. the visitor had scrolled down into the long list and would
 * otherwise be left on empty page below it), scrolls its top back into view
 * just below the sticky navbar. When the list is still on screen it does
 * nothing, so a collapse near the top never jumps.
 *
 * We capture the list's absolute top BEFORE collapsing - the content above the
 * list does not change when the items below fold away, so this position stays
 * valid - and on the next frame, only if the collapsed list now sits above the
 * viewport, scroll straight to it. Reading the pre-collapse position (rather
 * than the post-collapse rect, which is still settling under the browser's
 * scroll anchoring) makes the landing deterministic.
 */
const NAV_CLEARANCE = 96; // keep the list top clear of the sticky navbar

export function useStrandGuard<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const guard = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const absTop = el.getBoundingClientRect().top + window.scrollY;
    requestAnimationFrame(() => {
      const node = ref.current;
      if (!node) return;
      // Only act when the collapsed list now sits (almost) entirely above the
      // viewport - i.e. the visitor is stranded on the content below it.
      if (node.getBoundingClientRect().bottom < 120) {
        window.scrollTo({ top: Math.max(0, absTop - NAV_CLEARANCE), behavior: "auto" });
      }
    });
  }, []);
  return { ref, guard };
}
