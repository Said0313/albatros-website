/**
 * First-paint pre-layer for the splash. Rendered as part of the INITIAL server
 * HTML (first child of <body> in the locale layout) so the very first frame is
 * BRANDED (canvas-backdrop background + logo) — never white — during the JS
 * download gap on slow connections.
 *
 * There is only ONE DNA animation on the site: the real canvas helix in the
 * client <Splash> component. This pre-layer deliberately contains NO helix/DNA of
 * its own (a canvas needs JS to draw, so before JS we simply show the branded
 * background + logo). Its background is the EXACT same radial gradient the <Splash>
 * container uses, so when the canvas mounts on top there is zero color jump; the
 * invisible spacer matches the canvas footprint so the logo does not shift either.
 *
 * The whole thing (scoped <style> + markup + inline <script>) is emitted as ONE
 * dangerouslySetInnerHTML blob on a <div suppressHydrationWarning> so React treats
 * the subtree as opaque — the inline script can removeChild #alb-pre with no
 * hydration mismatch.
 *
 * z-index 10001 sits just above the <Splash> overlay (10000), which is also
 * server-rendered (same gradient background) but with an empty, unpainted canvas
 * and a hidden logo before JS — so the pre-layer's visible pulsing logo shows
 * during the gap. Once hydrated, <Splash> removes #alb-pre and its canvas takes
 * over on the identical background.
 *
 * Once-per-session via sessionStorage `alb_splash`: if already seen this session,
 * the pre-layer is removed instantly (no flash). A 4s failsafe drops it even if the
 * client splash never mounts (JS error / blocked), so the page is never stuck.
 *
 * The logo pulse keyframe is id-scoped with !important so it survives the global
 * prefers-reduced-motion animation freeze in globals.css.
 */

const STYLE = `
#alb-pre{position:fixed;inset:0;z-index:10001;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;background:radial-gradient(120% 80% at 50% 40%,#FFFFFF,#EAF0F8);}
#alb-pre img{height:56px;width:auto;animation:alb-pre-pulse 1.6s ease-in-out infinite !important;}
#alb-pre .alb-pre-spacer{width:min(760px,86vw);height:210px;}
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
    `<div class="alb-pre-spacer"></div>` +
    `</div>` +
    `<script>${SCRIPT}</script>`;
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
