/**
 * First-paint pre-layer for the splash. Rendered as part of the INITIAL server
 * HTML (first child of <body> in the locale layout) so the load screen is a calm,
 * BRANDED frame (canvas-backdrop gradient + static logo) during the pre-JS window
 * on slow connections — never white, and never a hand-built fake DNA.
 *
 * Deliberately NO DNA and NO logo animation here (Step 3 of the task brief):
 *  - There is exactly one DNA animation on the site, the real <canvas> helix in
 *    Splash.tsx. A canvas cannot draw before its JS loads, so rather than ship a
 *    hand-built SVG/CSS replica (which kept looking wrong) this pre-layer shows a
 *    calm static screen and lets the real canvas take over when JS is ready.
 *  - The logo is static (no pulse/scale/bounce) per the brief.
 *
 * The background is the EXACT gradient the <Splash> canvas container uses, and an
 * invisible spacer matches the canvas footprint, so when <Splash> mounts (z-index
 * 10000, same gradient) and removes #alb-pre (z-index 10001) there is no color or
 * logo-position jump. Everything is self-contained inline (literal hex, inline
 * <style>) so it never depends on globals.css / CSS variables / Tailwind / JS.
 *
 * The blob (style + markup + inline script) is emitted via one
 * dangerouslySetInnerHTML on a <div suppressHydrationWarning> so the inline script
 * can removeChild #alb-pre with no hydration mismatch. Once-per-session via
 * sessionStorage `alb_splash`; a 4s failsafe drops it if the client splash never
 * mounts (JS error / blocked).
 */

const STYLE = `
#alb-pre{position:fixed;inset:0;z-index:10001;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;background:radial-gradient(120% 80% at 50% 40%,#FFFFFF,#EAF0F8);}
#alb-pre img{height:56px;width:auto;display:block;}
#alb-pre .alb-pre-spacer{width:min(760px,86vw);height:210px;}
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
    `<div class="alb-pre-spacer"></div>` +
    `</div>` +
    `<script>${SCRIPT}</script>`;
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
