"use client";

import { useEffect, useRef } from "react";

/**
 * Albatros particle background: load choreography (scatter -> DNA helix ->
 * Albatros mark -> constellation), living idle field, scroll-linked
 * disperse + full-page parallax stream. Fixed canvas, z-index 0,
 * pointer-events none. See Background/README.md for integration.
 */

export interface ParticleBackgroundProps {
  density?: number; // particle count multiplier (base 320)
  dotSize?: number; // dot radius multiplier
  redMix?: number; // share of red dots 0..0.3
  speed?: number; // choreography speed multiplier
  linkIntensity?: number; // 0..1
  glow?: number; // 0..1
  markSrc?: string; // logo mark png (transparent) for the mark phase
  onRevealReady?: (fast: boolean) => void; // fire hero content reveal
}

interface Dot {
  seed: number;
  sx: number; sy: number; // scatter position
  rx: number; ry: number; // resting (stratified grid)
  mx: number; my: number; // mark position
  sat: { x: number; y: number; col: number[] }[] | null; // mark satellites
  x: number; y: number; px: number; py: number;
  vx: number; vy: number;
  ux: number; uy: number;
  r: number; pulse: number;
  strand: number; hfx: number;
  colF: number[]; colH: number[]; colM: number[];
}

// Field palette: red and blue family ONLY (navy #0C1B3A, blue #2E549C,
// lighter blue #5C7FB4, reds #D0181F / #ED1C24). No teal or warm tones
// anywhere in the field; teal stays a brand color elsewhere in the UI.
const NAVY = [12, 27, 58], BLUE = [46, 84, 156], BLUEL = [92, 127, 180],
  RED = [208, 24, 31], REDB = [237, 28, 36], WHITE = [255, 255, 255];
const PALETTE = [NAVY, BLUE, BLUEL, RED, REDB];
// snap an arbitrary sampled color (e.g. from the mark png) to the palette so
// no off-family hue can be derived or blended into the field
const snap = (c: number[]) => {
  let best = PALETTE[0], bd = Infinity;
  for (const p of PALETTE) {
    const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
    if (d < bd) { bd = d; best = p; }
  }
  return best;
};
const D = [0.6, 0.7, 0.9, 0.7, 0.6, 0.8]; // phase durations, s (at speed=1)
const CUM = D.reduce<number[]>((a, d) => (a.push((a[a.length - 1] || 0) + d), a), []);
const TOTAL = CUM[CUM.length - 1];
const JIT = 5, HELIX_SPEED = 0.65, TWISTS = 2.6;

const mix = (a: number[], b: number[], m: number) =>
  [a[0] + (b[0] - a[0]) * m, a[1] + (b[1] - a[1]) * m, a[2] + (b[2] - a[2]) * m];
const ei = (x: number) => (x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const rgba = (c: number[], a: number) =>
  `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a.toFixed(3)})`;

export default function ParticleBackground({
  density = 1.55,
  dotSize = 1.25,
  // 0.12 -> 0.15: modest bump to compensate for the removed teal share so the
  // constellation does not read monochrome; red stays an accent
  redMix = 0.15,
  speed = 0.75,
  linkIntensity = 0.85,
  glow = 0.55,
  markSrc = "/images/albatros-helix-mark.png",
  onRevealReady,
}: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealRef = useRef(onRevealReady);
  revealRef.current = onRevealReady;

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = window.innerWidth, H = window.innerHeight;
    let ps: Dot[] = [];
    // adaptive quality: heuristic start, one-way downgrade on sustained slow frames
    let quality = 1, ftAcc = 0, ftN = 0;
    const hc = navigator.hardwareConcurrency || 8;
    const dm = (navigator as any).deviceMemory || 8;
    if (hc <= 4 || dm <= 4) quality = 0.7;
    if (hc <= 2 || dm <= 2) quality = 0.5;
    // Mobile (below lg): the field is a subtle background, not a feature.
    // Capping quality cuts the dot count ~40% and caps DPR at 1; the canvas is
    // additionally dimmed via CSS (.particle-canvas media rule). Desktop keeps
    // full density.
    if (window.innerWidth < 1024) quality = Math.min(quality, 0.6);
    let markPts: { fx: number; fy: number; col: number[] }[] | null = null;
    let ph = reduced ? TOTAL : 0, hrot = 0, disp = 0, scrollY = 0;
    let lastPhase = -1, revealed = false, last = 0, raf = 0;
    const mouse = { x: -9999, y: -9999 };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, quality < 1 ? 1 : 1.5);
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const build = () => {
      const n = Math.max(40, Math.round(320 * density * quality));
      const cols = Math.ceil(n / 2);
      const idle = ph >= TOTAL;
      ps = [];
      for (let i = 0; i < n; i++) {
        let colF: number[];
        if (Math.random() < redMix) colF = Math.random() < 0.5 ? RED : REDB;
        else {
          const r2 = Math.random();
          colF = r2 < 0.34 ? NAVY : r2 < 0.72 ? BLUE : BLUEL;
        }
        const strand = i % 2;
        const gc = 8, gr = 5, cell = i % (gc * gr);
        const p: Dot = {
          seed: Math.random(),
          sx: Math.random() * W, sy: Math.random() * H,
          rx: ((cell % gc) + 0.1 + Math.random() * 0.8) * (W / gc),
          ry: (((cell / gc) | 0) + 0.1 + Math.random() * 0.8) * (H / gr),
          mx: W / 2, my: H * 0.44, sat: null,
          x: 0, y: 0, px: 0, py: 0,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          ux: 0, uy: 0,
          r: 1.7 + Math.random() * 1.5, pulse: Math.random() * 6.3,
          strand, hfx: cols > 1 ? (i >> 1) / (cols - 1) : 0,
          colF, colH: strand ? RED : BLUE, colM: colF,
        };
        if (markPts) {
          const mp = markPts;
          const mw = Math.min(860, W * 0.66), mh = (mw * 1188) / 2720;
          const pick = (idx: number) => {
            const pt = mp[idx % mp.length];
            return {
              x: W / 2 + (pt.fx - 0.5) * mw + (Math.random() - 0.5) * 2.5,
              y: H * 0.44 + (pt.fy - 0.5) * mh + (Math.random() - 0.5) * 2.5,
              col: pt.col,
            };
          };
          const m0 = pick(i * 7919);
          p.mx = m0.x; p.my = m0.y; p.colM = m0.col;
          p.sat = [pick(i * 7919 + 2711), pick(i * 7919 + 5413), pick(i * 7919 + 1237), pick(i * 7919 + 8117)];
        }
        p.x = idle ? p.rx : p.sx;
        p.y = idle ? p.ry : p.sy;
        const dx = p.rx - W / 2, dy = p.ry - H / 2, dd = Math.hypot(dx, dy) || 1;
        p.ux = dx / dd; p.uy = dy / dd;
        ps.push(p);
      }
    };

    const helixPos = (p: Dot) => {
      const th = p.hfx * TWISTS * Math.PI * 2 + hrot;
      const s = Math.sin(th) * (p.strand ? -1 : 1);
      const z = Math.cos(th) * (p.strand ? -1 : 1);
      return { x: W * 0.13 + p.hfx * W * 0.74, y: H * 0.45 + H * 0.19 * s, z };
    };

    const reveal = (fast: boolean) => {
      if (revealed) return;
      revealed = true;
      revealRef.current?.(fast);
    };

    const skip = () => {
      if (ph >= TOTAL) return;
      ph = TOTAL;
      for (const p of ps) { p.x = p.rx; p.y = p.ry; }
      reveal(true);
    };

    const step = (now: number) => {
      const rawDt = Math.min(0.05, (now - (last || now)) / 1000);
      const dt = rawDt * speed;
      last = now;
      ftAcc += rawDt; ftN++;
      if (ftN >= 90) {
        const avg = ftAcc / ftN;
        ftAcc = 0; ftN = 0;
        if (avg > 0.024 && quality > 0.4) {
          quality = Math.max(0.4, quality * 0.75);
          sizeCanvas();
          build();
        }
      }
      ph += dt;
      const t = ph;
      let phase = 6;
      for (let i = 0; i < 6; i++) if (t < CUM[i]) { phase = i; break; }
      if (phase !== lastPhase) {
        for (const p of ps) { p.px = p.x; p.py = p.y; }
        lastPhase = phase;
      }
      if (phase >= 1 && phase <= 2) hrot += dt * 1.7 * HELIX_SPEED;
      if (phase >= 5 && !revealed) reveal(false);

      ctx.clearRect(0, 0, W, H);
      const pr = (i: number) => (t - (i ? CUM[i - 1] : 0)) / D[i];
      const parX = mouse.x > -999 ? (mouse.x - W / 2) / (W / 2) : 0;
      const parY = mouse.y > -999 ? (mouse.y - H / 2) / (H / 2) : 0;
      const fieldLike = phase === 0 || phase >= 5;

      type DrawDot = { ox: number; oy: number; col: number[]; alpha: number; rad: number; z: number; boost: number };
      const draw: DrawDot[] = [];

      for (const p of ps) {
        p.pulse += dt * 1.2;
        let alpha: number, col: number[], rad: number, z = 0;
        if (phase === 0) {
          const e = Math.min(1, pr(0));
          p.x = p.sx + Math.sin(p.pulse + p.seed * 9) * 6;
          p.y = p.sy + Math.cos(p.pulse * 0.8 + p.seed * 7) * 6;
          alpha = e * 0.5; col = p.colF; rad = p.r;
        } else if (phase === 1) {
          const e = ei(Math.min(1, pr(1)));
          const h = helixPos(p); z = h.z;
          p.x = p.px + (h.x - p.px) * e; p.y = p.py + (h.y - p.py) * e;
          const dn = (z + 1) / 2;
          col = mix(p.colF, mix(p.colH, WHITE, 0.15 * dn), e);
          alpha = 0.5 + e * (0.35 * dn); rad = p.r * (1 + e * dn * 1.1);
        } else if (phase === 2) {
          const h = helixPos(p); z = h.z;
          p.x = h.x + Math.sin(p.pulse * 1.4 + p.seed * 13) * JIT * 0.16;
          p.y = h.y + Math.cos(p.pulse * 1.1 + p.seed * 17) * JIT * 0.16;
          const dn = (z + 1) / 2;
          col = mix(p.colH, WHITE, 0.15 * dn);
          alpha = 0.42 + 0.5 * dn; rad = p.r * (1 + dn * 1.1);
        } else if (phase === 3) {
          const e = ei(Math.min(1, pr(3)));
          p.x = p.px + (p.mx - p.px) * e; p.y = p.py + (p.my - p.py) * e;
          col = mix(p.colH, p.colM, e); alpha = 0.75; rad = p.r * (1.15 - 0.15 * e);
        } else if (phase === 4) {
          p.x = p.mx + Math.sin(p.pulse * 1.3 + p.seed * 11) * JIT * 0.12;
          p.y = p.my + Math.cos(p.pulse + p.seed * 5) * JIT * 0.12;
          col = p.colM; alpha = 0.85; rad = p.r;
        } else if (phase === 5) {
          const e = ei(Math.min(1, pr(5)));
          p.x = p.px + (p.rx - p.px) * e; p.y = p.py + (p.ry - p.py) * e;
          col = mix(p.colM, p.colF, e); alpha = 0.85 - e * 0.4; rad = p.r;
        } else {
          p.x += p.vx * dt * 60; p.y += p.vy * dt * 60;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          col = p.colF;
          alpha = (p.colF[0] > 150 ? 0.55 : 0.42) + 0.1 * Math.sin(p.pulse);
          rad = p.r * (0.85 + 0.25 * Math.sin(p.pulse));
        }

        let ox = p.x, oy = p.y, boost = 0;
        if (fieldLike || phase === 6) {
          ox += parX * p.seed * 12; oy += parY * p.seed * 8;
          // tight cursor halo: only dots CLOSE to the pointer react (small
          // local cluster, not a wide net); boost drives both the dot
          // enlarge/brighten and the red cursor links below
          const md = Math.hypot(ox - mouse.x, oy - mouse.y);
          if (md < 80) boost = 1 - md / 80;
        }
        if (disp > 0) {
          ox += Math.sin(p.seed * 9.4) * disp * 60;
          alpha *= 1 - disp * 0.5;
          rad *= 1 - disp * 0.45;
        }
        // scroll-linked parallax stream, normalized to page length: over the FULL page
        // each dot travels 0.6-1.8 viewport heights, so long pages animate end to end
        if (phase === 6 && scrollY > 0) {
          const docH = Math.max(1, document.documentElement.scrollHeight - H);
          const sp = scrollY / docH;
          oy = oy - sp * H * (0.6 + 1.2 * p.seed);
          oy = ((oy % H) + H) % H;
          ox += Math.sin(sp * 6.3 + p.seed * 12) * 26 * disp;
        }
        alpha = Math.min(1, alpha + boost * 0.4);
        rad = rad * dotSize * (1 + boost * 0.8);
        draw.push({ ox, oy, col, alpha, rad, z, boost });

        if (p.sat && phase >= 3 && phase <= 5) {
          const sf = phase === 3 ? ei(Math.min(1, pr(3))) : phase === 4 ? 1 : Math.max(0, 1 - pr(5) * 10);
          if (sf > 0.02)
            for (const st of p.sat)
              draw.push({ ox: st.x, oy: st.y, col: st.col, alpha: 0.85 * sf, rad: p.r * 0.8 * dotSize, z: 0, boost: 0 });
        }
      }

      // links via spatial hash (field states only). Sparse on purpose: a short
      // reach (100px vs 130px) and a hard cap of 3 links per dot keep the
      // constellation legible instead of a dense mesh of lines.
      if ((fieldLike || phase === 6) && linkIntensity > 0.02) {
        const la = phase === 5 ? ei(Math.min(1, pr(5))) : phase === 0 ? Math.min(1, pr(0)) * 0.5 : 1;
        const cell = 100, maxLinks = 3;
        const linkCount = new Uint8Array(draw.length);
        const grid = new Map<string, number[]>();
        draw.forEach((d, i) => {
          const k = `${(d.ox / cell) | 0},${(d.oy / cell) | 0}`;
          const b = grid.get(k);
          if (b) b.push(i); else grid.set(k, [i]);
        });
        ctx.lineWidth = 1;
        for (let i = 0; i < draw.length; i++) {
          const a = draw[i];
          const gx = (a.ox / cell) | 0, gy = (a.oy / cell) | 0;
          for (let nx = gx; nx <= gx + 1 && linkCount[i] < maxLinks; nx++)
            for (let ny = gy - 1; ny <= gy + 1 && linkCount[i] < maxLinks; ny++) {
              if (nx === gx && ny < gy) continue;
              const bucket = grid.get(`${nx},${ny}`);
              if (!bucket) continue;
              for (const j of bucket) {
                if (j <= i || linkCount[j] >= maxLinks) continue;
                if (linkCount[i] >= maxLinks) break;
                const b = draw[j];
                const dx = a.ox - b.ox, dy = a.oy - b.oy, d2 = dx * dx + dy * dy;
                if (d2 < 10000) {
                  const d = Math.sqrt(d2);
                  ctx.strokeStyle = rgba(BLUE, (1 - d / 100) * 0.3 * linkIntensity * la * Math.min(a.alpha + 0.3, 1));
                  ctx.beginPath(); ctx.moveTo(a.ox, a.oy); ctx.lineTo(b.ox, b.oy); ctx.stroke();
                  linkCount[i]++; linkCount[j]++;
                }
              }
            }
          if (a.boost > 0 && phase === 6 && disp < 0.3) {
            ctx.strokeStyle = rgba(RED, a.boost * 0.45 * linkIntensity);
            ctx.beginPath(); ctx.moveTo(a.ox, a.oy); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
        }
      }

      // helix rungs
      if (phase === 2 || (phase === 1 && pr(1) > 0.75)) {
        const f = phase === 2 ? 1 : (pr(1) - 0.75) / 0.25;
        ctx.setLineDash([2, 4]); ctx.lineWidth = 1.3;
        for (let i = 0; i + 1 < ps.length; i += 14) {
          const a = ps[i], b = ps[i + 1];
          const dz = 1 - Math.abs(Math.cos(a.hfx * TWISTS * Math.PI * 2 + hrot));
          ctx.strokeStyle = rgba(BLUEL, (0.14 + 0.32 * dz) * f);
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
        ctx.setLineDash([]);
      }

      if (phase === 1 || phase === 2) draw.sort((a, b) => a.z - b.z);
      for (const d of draw) {
        if (d.alpha <= 0.005) continue;
        if (quality >= 0.6 && glow > 0.03 && d.rad > 1) {
          ctx.beginPath();
          ctx.fillStyle = rgba(d.col, d.alpha * 0.1 * glow);
          ctx.arc(d.ox, d.oy, d.rad * 3.2, 0, 6.3); ctx.fill();
        }
        ctx.beginPath();
        ctx.fillStyle = rgba(d.col, d.alpha);
        ctx.arc(d.ox, d.oy, d.rad, 0, 6.3); ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    const onMouse = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onScroll = () => {
      disp = Math.min(1, Math.max(0, window.scrollY / (H * 1.4)));
      scrollY = window.scrollY;
      if (ph < TOTAL && window.scrollY > 8) skip();
    };
    const onClick = () => skip();
    const onResize = () => { W = window.innerWidth; H = window.innerHeight; sizeCanvas(); build(); };

    sizeCanvas();
    build();
    if (reduced) reveal(true);

    // sample the mark png into normalized points
    const img = new Image();
    img.onload = () => {
      const w = 240, h = Math.max(1, Math.round((w * img.height) / img.width));
      const c = document.createElement("canvas");
      c.width = w; c.height = h;
      const x = c.getContext("2d");
      if (!x) return;
      x.drawImage(img, 0, 0, w, h);
      const d = x.getImageData(0, 0, w, h).data;
      const pts: { fx: number; fy: number; col: number[] }[] = [];
      for (let py = 0; py < h; py += 2)
        for (let px = 0; px < w; px += 2) {
          const o = (py * w + px) * 4;
          if (d[o + 3] > 110) pts.push({ fx: px / w, fy: py / h, col: snap([d[o], d[o + 1], d[o + 2]]) });
        }
      if (pts.length) { markPts = pts; build(); }
    };
    img.src = markSrc;

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [density, dotSize, redMix, speed, linkIntensity, glow, markSrc]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="particle-canvas"
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none",
          // Calm the top of the viewport (navbar strip + page titles): dots and
          // links fade out toward the top, full strength by ~a quarter of the
          // viewport. GPU-composited, zero per-frame cost. The hero assembly
          // centers near 45vh so the intro stays strong.
          maskImage: "linear-gradient(to bottom, transparent 0, rgba(0,0,0,0.5) 12vh, #000 24vh)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0, rgba(0,0,0,0.5) 12vh, #000 24vh)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 70% 55% at 50% 38%, rgba(46,84,156,0.06) 0%, transparent 70%)",
        }}
      />
    </>
  );
}
