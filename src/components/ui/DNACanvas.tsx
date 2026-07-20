"use client";

import { useEffect, useRef } from "react";

interface P {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  pulse: number;
  red: boolean;
}

/**
 * Hero particle/network background (light theme). Dots ALWAYS drift and pulse
 * (ambient branding the owner wants - not gated by prefers-reduced-motion).
 * Nearby dots are connected by faint blue lines; on hover, dots within ~160px of
 * the cursor brighten/enlarge and brand-red lines reach to the cursor. Pure
 * canvas + rAF.
 *
 * The canvas stays behind the hero content (z-0, pointer-events:none) so the CTA
 * buttons stay clickable; the mouse is tracked on the hero <section> (the
 * canvas's parent) so the effect works even over the headline/buttons.
 */
export default function DNACanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const host = canvas.parentElement; // hero <section>

    let W = 0;
    let H = 0;
    const measure = () => {
      W = canvas.clientWidth || host?.clientWidth || window.innerWidth;
      H = canvas.clientHeight || host?.clientHeight || window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    measure();

    // keep density on desktop; cap on small screens for performance
    const count = W < 700 ? 28 : 50;
    const ps: P[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1.8 + Math.random() * 1.4,
      pulse: Math.random() * 6.3,
      red: i % 3 === 0, // ~1/3 red dots, rest blue - keeps the current look
    }));

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    host?.addEventListener("mousemove", onMove);
    host?.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);

      // lines between nearby particles
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const a = ps[i];
          const b = ps[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 130) {
            ctx.strokeStyle = `rgba(46,84,156,${(1 - d / 130) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of ps) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        // hover: nearby dots brighten/enlarge + a red line reaches to the cursor
        const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        let boost = 0;
        if (md < 160) {
          boost = 1 - md / 160;
          ctx.strokeStyle = `rgba(208,24,31,${boost * 0.5})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        p.pulse += 0.02;
        const r = p.r * (0.8 + 0.3 * Math.sin(p.pulse)) * (1 + boost * 0.9);
        const col = p.red ? "208,24,31" : "46,84,156";
        const a = (p.red ? 0.55 : 0.4) + boost * 0.4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(${col},${a})`;
        ctx.arc(p.x, p.y, r, 0, 6.3);
        ctx.fill();
      }

      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      host?.removeEventListener("mousemove", onMove);
      host?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 z-0 h-full w-full" />;
}
