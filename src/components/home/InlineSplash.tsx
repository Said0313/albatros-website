/**
 * First-paint pre-layer for the splash. Rendered as part of the INITIAL server
 * HTML (first child of <body> in the locale layout) so the very first frame is
 * BRANDED (light background + logo + DNA helix) — never a white/blank screen,
 * even on Slow 4G before any JS runs.
 *
 * The DNA here is a static, pure-CSS/SVG double helix baked into the server HTML.
 * It exists ONLY so the animation is visible during the JS download on slow
 * connections (the old pre-layer left an EMPTY box here → a blank near-white gap).
 * The good-looking Claude Design *canvas* DNA helix is still the client <Splash>
 * component; it mounts on top of this same light background as soon as JS loads
 * and removes this pre-layer (#alb-pre). This SVG does NOT touch or alter the
 * canvas animation in any way — it is a separate first-paint stand-in that hands
 * off to the canvas.
 *
 * The whole thing (scoped <style> + markup + inline <script>) is emitted as ONE
 * dangerouslySetInnerHTML blob on a <div suppressHydrationWarning> so React treats
 * the subtree as opaque — the inline script can removeChild #alb-pre with no
 * hydration mismatch.
 *
 * Once-per-session via sessionStorage `alb_splash`: if already seen this session,
 * the pre-layer is removed instantly (no flash). A 4s failsafe drops it even if the
 * client splash never mounts (JS error / blocked), so the page is never stuck.
 *
 * The helix keyframes are id-scoped with !important so they survive the global
 * prefers-reduced-motion animation freeze in globals.css — matching the owner's
 * "the intro always animates" requirement (same rationale as the marquee override).
 */

// ── Build the static double-helix markup on the server (no client JS needed) ──
// Geometry mirrors the canvas <Splash>: double sine helix, blue strand + red
// strand, teal dashed rungs, beads sized by depth. This is a still frame with a
// gentle CSS shimmer, not the canvas render loop.
function buildHelix() {
  const W = 760;
  const H = 210;
  const mid = H / 2;
  const amp = H * 0.3;
  const N = 34;
  const periods = 2.6;

  const RED = [208, 24, 31];
  const REDL = [237, 28, 36];
  const BLUE = [29, 58, 130];
  const BLUEL = [46, 84, 156];

  const mix = (a: number[], b: number[], m: number) =>
    [
      Math.round(a[0] + (b[0] - a[0]) * m),
      Math.round(a[1] + (b[1] - a[1]) * m),
      Math.round(a[2] + (b[2] - a[2]) * m),
    ].join(",");

  const aPts: string[] = [];
  const bPts: string[] = [];
  const rungs: string[] = [];
  const beads: { z: number; el: string }[] = [];

  for (let i = 0; i < N; i++) {
    const fx = i / (N - 1);
    const x = +(14 + fx * (W - 28)).toFixed(1);
    const th = fx * periods * Math.PI * 2;
    const s = Math.sin(th);
    const z = Math.cos(th);
    const yA = +(mid + amp * s).toFixed(1);
    const yB = +(mid - amp * s).toFixed(1);
    aPts.push(`${x} ${yA}`);
    bPts.push(`${x} ${yB}`);

    const dnA = (z + 1) / 2; // strand A depth (front = 1)
    const dnB = (1 - z) / 2; // strand B is the anti-phase strand
    const rA = +(2.4 + 4.2 * dnA).toFixed(1);
    const rB = +(2.4 + 4.2 * dnB).toFixed(1);
    const aA = (0.45 + 0.5 * dnA).toFixed(2);
    const aB = (0.45 + 0.5 * dnB).toFixed(2);
    const dR = (fx * 1.2).toFixed(2);
    const dA = (fx * 1.2).toFixed(2);
    const dB = (fx * 1.2 + 0.6).toFixed(2);

    rungs.push(
      `<line class="alb-rung" x1="${x}" y1="${yA}" x2="${x}" y2="${yB}" stroke="rgba(46,138,160,0.5)" stroke-width="1.4" stroke-dasharray="2 4" style="animation-delay:${dR}s"/>`,
    );
    beads.push({
      z,
      el: `<circle class="alb-bead" cx="${x}" cy="${yA}" r="${rA}" fill="rgba(${mix(BLUE, BLUEL, dnA)},${aA})" style="animation-delay:${dA}s"/>`,
    });
    beads.push({
      z: -z,
      el: `<circle class="alb-bead" cx="${x}" cy="${yB}" r="${rB}" fill="rgba(${mix(RED, REDL, dnB)},${aB})" style="animation-delay:${dB}s"/>`,
    });
  }

  // Draw far beads first, near beads last (fake depth ordering).
  beads.sort((a, b) => a.z - b.z);

  const strandA = `<polyline class="alb-strand" points="${aPts.join(" ")}" fill="none" stroke="rgba(46,84,156,0.28)" stroke-width="1.6" stroke-dasharray="5 7"/>`;
  const strandB = `<polyline class="alb-strand" points="${bPts.join(" ")}" fill="none" stroke="rgba(208,24,31,0.28)" stroke-width="1.6" stroke-dasharray="5 7"/>`;

  return (
    `<svg class="alb-helix" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">` +
    rungs.join("") +
    strandA +
    strandB +
    beads.map((b) => b.el).join("") +
    `</svg>`
  );
}

const HELIX = buildHelix();

const STYLE = `
#alb-pre{position:fixed;inset:0;z-index:9990;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;background:radial-gradient(120% 80% at 50% 40%,#FFFFFF,#EAF0F8);}
#alb-pre img{height:56px;width:auto;animation:alb-pre-pulse 1.6s ease-in-out infinite !important;}
#alb-pre .alb-helix{width:min(760px,86vw);height:auto;display:block;}
#alb-pre .alb-bead{animation:alb-bead 2.4s ease-in-out infinite !important;animation-duration:2.4s !important;animation-iteration-count:infinite !important;transition:none !important;}
#alb-pre .alb-rung{opacity:.4;animation:alb-rung 2.8s ease-in-out infinite !important;animation-duration:2.8s !important;animation-iteration-count:infinite !important;transition:none !important;}
#alb-pre .alb-strand{animation:alb-flow 3.2s linear infinite !important;animation-duration:3.2s !important;animation-iteration-count:infinite !important;transition:none !important;}
@keyframes alb-pre-pulse{0%,100%{opacity:.7;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}
@keyframes alb-bead{0%,100%{opacity:.55}50%{opacity:1}}
@keyframes alb-rung{0%,100%{opacity:.2}50%{opacity:.6}}
@keyframes alb-flow{to{stroke-dashoffset:-48}}
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
    HELIX +
    `</div>` +
    `<script>${SCRIPT}</script>`;
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
