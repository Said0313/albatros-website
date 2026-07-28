"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useState } from "react";

// Site-wide particle field (v2), mounted once in the [locale] layout.
// Client-only: it draws on canvas from mount and must never run during SSR.
// The fixed z-0 canvas sits behind all routes; content stacks above via z-1
// on main. No props: every default in the component is already tuned.
const ParticleBackground3 = dynamic(() => import("@/components/ui/ParticleBackground3"), { ssr: false });

type RevealState = { on: boolean; fast: boolean; started: boolean };

const FieldRevealContext = createContext<RevealState>({ on: false, fast: false, started: false });

/**
 * Reveal signal from the field's intro choreography. ONLY the homepage hero
 * gates content on this; every other route renders normally and must never
 * wait for it. Because the layout persists across client navigations, the
 * intro plays once per load and the signal stays revealed afterwards.
 */
export function useFieldReveal(): RevealState {
  return useContext(FieldRevealContext);
}

// The homepage in every locale: "/", "/uz", "/en" (with or without a trailing
// slash). Anything else ("/catalog", "/uz/catalog", "/en/contact", ...) is an
// inner route and gets the field at rest with no mark assembly.
const HOME_PATH = /^\/(uz|en)?\/?$/;

export function ParticleFieldProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Frozen at mount: the intro decision belongs to the page LOAD. The field
  // stays mounted across client-side navigation, so re-evaluating on route
  // change would wrongly restart the field mid-session.
  const [introEnabled] = useState(() => HOME_PATH.test(pathname));
  const [reveal, setReveal] = useState<RevealState>({ on: false, fast: false, started: false });
  const onReady = useCallback((fast: boolean) => {
    setReveal((r) => (r.on ? r : { ...r, on: true, fast }));
  }, []);
  // Fired when the intro's hold releases and the logo scan-print begins. The
  // hero starts its reveal failsafe from this signal, not from mount.
  const onStart = useCallback(() => {
    setReveal((r) => (r.started ? r : { ...r, started: true }));
  }, []);
  return (
    <FieldRevealContext.Provider value={reveal}>
      {/* linkIntensity lowered from the 0.55 default so the (now shorter-reach)
          links read as faint connective texture, not a mesh. Radius is reduced
          inside the component; this only dims the remaining lines. */}
      <ParticleBackground3 onRevealReady={onReady} onChoreographyStart={onStart} linkIntensity={0.35} intro={introEnabled} navKey={pathname} />
      {children}
    </FieldRevealContext.Provider>
  );
}
