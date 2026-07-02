/**
 * First-paint pre-layer for the splash. Rendered as part of the INITIAL server
 * HTML (first child of <body> in the locale layout) so DNA is visibly ANIMATING
 * during the pre-JS window on slow connections — a <canvas> cannot draw until its
 * JS bundle loads, so this is a no-JS (inline SVG + SMIL) replica of the real
 * canvas helix that hands off to it seamlessly.
 *
 * The replica is matched to the canvas in src/components/home/Splash.tsx:
 *  - same background gradient, same palette (blue strand #1D3A82->#2E549C, red
 *    strand #D0181F->#ED1C24, teal rungs #2E8AA0), same amplitude (h*0.34), same
 *    2.6 periods across the width, same node spacing (fx=i/51), same bead radius
 *    (2.6..7.0 by depth) and opacity (0.4..1.0), dashed [2,4] rungs, beads sorted
 *    far->near, NO backbone lines (canvas draws beads + rungs only).
 *  - Motion: the canvas advances phase at 1.7 rad/s (one 2*PI period every
 *    2*PI/1.7 = 3.696s) and the wave travels LEFT. A phase shift of the whole
 *    helix is equivalent to translating the periodic pattern horizontally, so the
 *    replica draws the helix over the visible width PLUS one extra spatial period
 *    (P = 744/2.6 = 286.15 user units) and scrolls the group left by exactly P
 *    over 3.696s, looping seamlessly (the pattern is 2*PI-periodic, so translate 0
 *    and -P are identical within the viewport).
 *
 * Everything is self-contained in the server HTML: literal hex colors, an inline
 * <style> for the layout/logo, and SMIL <animateTransform> for the motion. It does
 * NOT depend on globals.css, CSS variables, Tailwind, or JS, so it paints and
 * animates as soon as the browser renders the document (and with JS disabled).
 * SMIL animates regardless of prefers-reduced-motion, matching the owner's
 * "the intro always animates" requirement.
 *
 * z-index 10001 sits just above the <Splash> canvas overlay (10000, also SSR'd on
 * the identical gradient with an empty canvas + hidden logo before JS), so the
 * replica + pulsing logo are what show during the gap. The SVG has the same
 * footprint/position as the canvas, so when <Splash> mounts and removes #alb-pre
 * there is no background or position jump. The whole blob is emitted via one
 * dangerouslySetInnerHTML on a <div suppressHydrationWarning> so the inline script
 * can removeChild #alb-pre with no hydration mismatch. Once-per-session via
 * sessionStorage `alb_splash`; a 4s failsafe drops it if the client splash never
 * mounts.
 */

// ── Build the canvas-matched double helix as static SVG (motion via SMIL) ──
function buildDNA() {
  const W = 760; // viewBox width (canvas cw max); scaled to min(760px,86vw) via CSS
  const H = 210; // canvas ch
  const mid = H / 2; // cy = 105
  const amp = H * 0.34; // 71.4, matches canvas
  const periods = 2.6;
  const step = 1 / 51; // canvas fx = i/(N-1), N=52
  const P = (W - 16) / periods; // one spatial period = 744 / 2.6 = 286.1538

  const RED = [208, 24, 31];
  const REDL = [237, 28, 36];
  const BLUE = [29, 58, 130];
  const BLUEL = [46, 84, 156];

  const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, "0");
  const mixHex = (a: number[], b: number[], m: number) =>
    "#" + hex2(a[0] + (b[0] - a[0]) * m) + hex2(a[1] + (b[1] - a[1]) * m) + hex2(a[2] + (b[2] - a[2]) * m);

  const rungs: string[] = [];
  const beads: { depth: number; el: string }[] = [];

  // Cover the visible width plus one extra period so the -P scroll loops seamlessly.
  const maxX = W + P + 16;
  for (let i = 0; ; i++) {
    const fx = i * step;
    const x = +(8 + fx * (W - 16)).toFixed(2);
    if (x > maxX) break;
    const th = fx * periods * Math.PI * 2;
    const s = Math.sin(th);
    const z = Math.cos(th);
    const yA = +(mid + amp * s).toFixed(2);
    const yB = +(mid - amp * s).toFixed(2);

    const rungOp = (0.18 + 0.4 * (1 - Math.abs(z))).toFixed(3);
    rungs.push(
      `<line x1="${x}" y1="${yA}" x2="${x}" y2="${yB}" stroke="#2E8AA0" stroke-opacity="${rungOp}" stroke-width="1.4" stroke-dasharray="2 4"/>`,
    );

    const dnA = (z + 1) / 2;
    const dnB = (1 - z) / 2; // strand B uses -z
    beads.push({
      depth: z,
      el: `<circle cx="${x}" cy="${yA}" r="${(2.6 + 4.4 * dnA).toFixed(2)}" fill="${mixHex(BLUE, BLUEL, dnA)}" fill-opacity="${(0.4 + 0.6 * dnA).toFixed(3)}"/>`,
    });
    beads.push({
      depth: -z,
      el: `<circle cx="${x}" cy="${yB}" r="${(2.6 + 4.4 * dnB).toFixed(2)}" fill="${mixHex(RED, REDL, dnB)}" fill-opacity="${(0.4 + 0.6 * dnB).toFixed(3)}"/>`,
    });
  }
  // Canvas draws far beads first (sorted by depth ascending) so nearer beads sit on top.
  beads.sort((a, b) => a.depth - b.depth);

  return (
    `<svg class="alb-dna" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">` +
    `<g>` +
    `<animateTransform attributeName="transform" attributeType="XML" type="translate" from="0 0" to="${-P.toFixed(4)} 0" dur="3.696s" repeatCount="indefinite" additive="sum"/>` +
    rungs.join("") +
    beads.map((b) => b.el).join("") +
    `</g></svg>`
  );
}

const DNA = buildDNA();

const STYLE = `
#alb-pre{position:fixed;inset:0;z-index:10001;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;background:radial-gradient(120% 80% at 50% 40%,#FFFFFF,#EAF0F8);}
#alb-pre img{height:56px;width:auto;animation:alb-pre-pulse 1.6s ease-in-out infinite !important;}
#alb-pre .alb-dna{width:min(760px,86vw);height:210px;display:block;overflow:hidden;}
@keyframes alb-pre-pulse{0%,100%{opacity:.7;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}
`.trim();

const SCRIPT = `
(function(){
  try{
    var el=document.getElementById('alb-pre');
    if(!el)return;
    if(sessionStorage.getItem('alb_splash')){if(el.parentNode)el.parentNode.removeChild(el);return;}
    setTimeout(function(){var e=document.getElementById('alb-pre');if(e&&e.parentNode)e.parentNode.removeChild(e);},4000);
  }catch(e){var x=document.getElementById('alb-pre');if(x&&x.parentNode)x.parentNode.removeChild(x);}
})();
`.trim();

export function InlineSplash() {
  const html =
    `<style>${STYLE}</style>` +
    `<div id="alb-pre" aria-hidden="true">` +
    `<img src="/logo.png" alt="Albatros Health Care"/>` +
    DNA +
    `</div>` +
    `<script>${SCRIPT}</script>`;
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
