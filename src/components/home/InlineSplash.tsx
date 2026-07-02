/**
 * First-paint pre-layer for the splash. Rendered as the FIRST child of <body> in
 * the initial server HTML with fully self-contained inline critical CSS, so the
 * branded load screen (gradient + static logo + animated DNA) paints from a tiny
 * initial payload — before the ~864 kB JS bundle and with zero dependency on the
 * app's main stylesheet, CSS variables, or any JS.
 *
 * The DNA is adapted from the production albatros.uz preloader (its own asset): a
 * pure-CSS 3D double helix. 20 thin dashed "rungs" (.el) each carry a node dot on
 * top and bottom; each rung rotates around the X axis (rotateX(-360deg) -> none)
 * over 2s, and staggered negative animation-delays across the 20 rungs produce the
 * rotating double-helix wave. Palette matched to the site: red node #ED1C24, blue
 * node #2E549C, teal dashed rung #3E8FA6. It animates with no JS (pure CSS) and no
 * external CSS. The logo is STATIC (no pulse/scale/bounce). !important on the rung
 * animation keeps it running under the global reduced-motion freeze in globals.css
 * (owner wants the intro to always animate).
 *
 * When the real client canvas <Splash> is ready it takes over on the identical
 * gradient background (z-index 10000, under #alb-pre's 10001) and removes #alb-pre
 * (its own dropPre), so there is no white gap. Emitted via one dangerouslySetInnerHTML
 * on a <div suppressHydrationWarning> so the inline script can removeChild #alb-pre
 * with no hydration mismatch. Once-per-session via sessionStorage `alb_splash`; a 4s
 * failsafe drops it if the client splash never mounts.
 */

// Staggered per-rung delays (matches the reference: -0.15s * n across 20 rungs),
// negative so the helix is already mid-rotation on the very first painted frame.
const DELAYS = Array.from(
  { length: 20 },
  (_, i) => `#alb-pre .alb-dna .el:nth-of-type(${i + 1}){animation-delay:-${((i + 1) * 0.15).toFixed(2)}s;}`,
).join("");

const ELS = Array.from({ length: 20 }, () => `<span class="el"></span>`).join("");

const STYLE = `
#alb-pre{position:fixed;inset:0;z-index:10001;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;background:radial-gradient(120% 80% at 50% 40%,#FFFFFF,#EAF0F8);}
#alb-pre img{height:56px;width:auto;display:block;}
#alb-pre .alb-dna{display:flex;align-items:center;justify-content:center;height:120px;perspective:400px;-webkit-perspective:400px;transform-style:preserve-3d;}
#alb-pre .alb-dna .el{width:1px;height:88px;margin:0 6px;border-left:1px dashed #3E8FA6;position:relative;transform:rotateX(-360deg);-webkit-transform:rotateX(-360deg);animation:alb-run 2s linear infinite !important;-webkit-animation:alb-run 2s linear infinite !important;}
#alb-pre .alb-dna .el:before,#alb-pre .alb-dna .el:after{content:"";width:10px;height:10px;border-radius:50%;position:absolute;left:50%;transform:translateX(-50%);}
#alb-pre .alb-dna .el:before{top:-2px;background:#ED1C24;}
#alb-pre .alb-dna .el:after{bottom:-2px;background:#2E549C;}
${DELAYS}
@keyframes alb-run{to{transform:none;}}
@-webkit-keyframes alb-run{to{-webkit-transform:none;}}
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
    `<div class="alb-dna">${ELS}</div>` +
    `</div>` +
    `<script>${SCRIPT}</script>`;
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
