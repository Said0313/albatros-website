"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useState } from "react";

// Site-wide particle field (v2), mounted once in the [locale] layout.
// Client-only: it draws on canvas from mount and must never run during SSR.
// The fixed z-0 canvas sits behind all routes; content stacks above via z-1
// on main. No props: every default in the component is already tuned.
const ParticleBackground3 = dynamic(() => import("@/components/ui/ParticleBackground3"), { ssr: false });

type RevealState = { on: boolean; fast: boolean };

const FieldRevealContext = createContext<RevealState>({ on: false, fast: false });

/**
 * Reveal signal from the field's intro choreography. ONLY the homepage hero
 * gates content on this; every other route renders normally and must never
 * wait for it. Because the layout persists across client navigations, the
 * intro plays once per load and the signal stays revealed afterwards.
 */
export function useFieldReveal(): RevealState {
  return useContext(FieldRevealContext);
}

export function ParticleFieldProvider({ children }: { children: React.ReactNode }) {
  const [reveal, setReveal] = useState<RevealState>({ on: false, fast: false });
  const onReady = useCallback((fast: boolean) => {
    setReveal((r) => (r.on ? r : { on: true, fast }));
  }, []);
  return (
    <FieldRevealContext.Provider value={reveal}>
      <ParticleBackground3 onRevealReady={onReady} />
      {children}
    </FieldRevealContext.Provider>
  );
}
