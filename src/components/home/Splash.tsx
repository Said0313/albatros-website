"use client";

import { useEffect, useRef } from "react";

// Survives React StrictMode's dev double-invoke: the first effect run sets the
// sessionStorage flag, so a naive `seen` check would make the second run hide the
// splash. This module-level flag (reset only on a real page load) lets the splash
// play on the run that actually sticks, while still gating to once-per-session.
let playedThisLoad = false;

/**
 * DNA intro splash — the Claude Design beaded double-helix (canvas), LIGHT themed.
 * Mounts on TOP of the inline first-paint pre-layer (#alb-pre, light bg + logo)
 * and removes it once this canvas version takes over, so the user never sees a
 * white screen: branded bg+logo paints in the initial HTML, the helix animates a
 * beat later when JS loads. Shows once per session (sessionStorage `alb_splash`),
 * fades out ~2.7s, plays regardless of prefers-reduced-motion. No progress bar.
 *
 * Canvas impl is robust to a 0×0 box on first mount: size() falls back to the
 * viewport (never zero) and draw() re-measures if the box is still zero, so the
 * helix renders even before layout settles.
 */
export function Splash() {
  const splashRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const splash = splashRef.current;
    const logo = logoRef.current;
    const cv = canvasRef.current;
    if (!splash || !cv) return;

    const hide = () => {
      splash.style.opacity = "0";
      splash.style.visibility = "hidden";
      splash.style.pointerEvents = "none";
    };
    const dropPre = () => {
      const pre = document.getElementById("alb-pre");
      if (pre && pre.parentNode) pre.parentNode.removeChild(pre);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = sessionStorage.getItem("alb_splash");
    // Owner wants the splash to ALWAYS play (reduced-motion no longer skips it).
    // Skip only if it was seen in a PRIOR load (not just set by this load's first
    // StrictMode invocation).
    if (seen && !playedThisLoad) {
      dropPre();
      hide();
      return;
    }
    playedThisLoad = true;
    sessionStorage.setItem("alb_splash", "1");
    // This canvas version now owns the screen — remove the inline pre-layer.
    dropPre();
    const fadeStart = reduced ? 1.8 : 2.7;

    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const RED = [208, 24, 31];
    const REDL = [237, 28, 36];
    const BLUE = [29, 58, 130];
    const BLUEL = [46, 84, 156];
    const TEAL = [46, 138, 160];
    let cw = 0;
    let ch = 0;

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // Compute from the viewport (always non-zero) instead of getBoundingClientRect,
      // which can return 0×0 before layout settles. Set BOTH the CSS box and the
      // backing store so the canvas always displays at cw×ch (and is never squished).
      cw = Math.min(760, Math.round((window.innerWidth || 760) * 0.86)) || 760;
      ch = 210;
      cv!.style.width = cw + "px";
      cv!.style.height = ch + "px";
      cv!.width = Math.round(cw * dpr);
      cv!.height = Math.round(ch * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const rgba = (c: number[], a: number) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const mix = (a: number[], b: number[], m: number) => [
      a[0] + (b[0] - a[0]) * m,
      a[1] + (b[1] - a[1]) * m,
      a[2] + (b[2] - a[2]) * m,
    ];

    function draw(t: number) {
      if (!cw || !ch) size(); // re-measure if still zero
      const w = cw;
      const h = ch;
      const cy = h / 2;
      const amp = h * 0.34;
      const N = 52;
      const periods = 2.6;
      const phase = t * 1.7;
      ctx!.clearRect(0, 0, w, h);
      const nodes = [];
      for (let i = 0; i < N; i++) {
        const fx = i / (N - 1);
        const x = 8 + fx * (w - 16);
        const th = fx * periods * Math.PI * 2 + phase;
        nodes.push({
          x,
          yA: cy + amp * Math.sin(th),
          yB: cy - amp * Math.sin(th),
          z: Math.cos(th),
          rev: Math.max(0, Math.min(1, (t - 0.15 - fx * 0.5) / 0.45)),
        });
      }
      ctx!.setLineDash([2, 4]);
      ctx!.lineWidth = 1.4;
      for (const n of nodes) {
        if (n.rev <= 0) continue;
        const d = Math.abs(n.z);
        ctx!.strokeStyle = rgba(TEAL, (0.18 + 0.4 * (1 - d)) * n.rev);
        ctx!.beginPath();
        ctx!.moveTo(n.x, n.yA);
        ctx!.lineTo(n.x, n.yB);
        ctx!.stroke();
      }
      ctx!.setLineDash([]);
      const beads = [];
      for (const n of nodes) {
        if (n.rev <= 0) continue;
        beads.push({ x: n.x, y: n.yA, z: n.z, rev: n.rev, s: "A" });
        beads.push({ x: n.x, y: n.yB, z: -n.z, rev: n.rev, s: "B" });
      }
      beads.sort((a, b) => a.z - b.z);
      for (const b of beads) {
        const dn = (b.z + 1) / 2;
        const r = (2.6 + 4.4 * dn) * b.rev;
        const a = (0.4 + 0.6 * dn) * b.rev;
        const col = b.s === "A" ? mix(BLUE, BLUEL, dn) : mix(RED, REDL, dn);
        ctx!.beginPath();
        ctx!.fillStyle = rgba(col, a);
        ctx!.arc(b.x, b.y, r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    size();
    const onR = () => {
      size();
      // keep a frame painted on resize even if rAF is throttled
      draw((performance.now() - start) / 1000);
    };
    window.addEventListener("resize", onR);

    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    // Offset the clock so the very first synchronous frame already shows the helix
    // (robust even if requestAnimationFrame is initially throttled/paused).
    const start = performance.now() - 700;
    draw((performance.now() - start) / 1000);
    if (logo) logo.style.opacity = "1";

    let raf = 0;
    const loop = (now: number) => {
      const t = (now - start) / 1000;
      draw(t);

      if (logo) {
        const lp = clamp((t - 0.12) / 0.9);
        const e = 1 - Math.pow(1 - lp, 3);
        logo.style.opacity = String(e);
        logo.style.transform = "translateY(" + ((1 - e) * 14).toFixed(2) + "px)";
      }

      if (t < fadeStart) {
        splash.style.opacity = "1";
      } else {
        const fp = clamp((t - fadeStart) / 0.8);
        splash.style.opacity = String(1 - fp);
        if (fp >= 1) {
          splash.style.visibility = "hidden";
          splash.style.pointerEvents = "none";
        }
      }

      if (t < fadeStart + 1.0) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Failsafe: never leave the overlay up longer than ~4s even if rAF is killed.
    const failsafe = window.setTimeout(hide, 4000);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
      window.removeEventListener("resize", onR);
    };
  }, []);

  return (
    <div
      ref={splashRef}
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "radial-gradient(120% 80% at 50% 40%, #FFFFFF, #EAF0F8)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
        transition: "opacity 0.6s ease",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={logoRef}
        src="/logo.png"
        alt="Albatros Health Care"
        style={{ height: 56, width: "auto", opacity: 0 }}
      />
      <canvas ref={canvasRef} style={{ width: "min(760px, 86vw)", height: 210, display: "block" }} />
    </div>
  );
}
