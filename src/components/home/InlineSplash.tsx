/**
 * First-paint pre-layer for the splash. Rendered as the FIRST child of <body> in
 * the initial server HTML with fully self-contained inline critical CSS, so the
 * branded load screen (solid bg + static logo + DNA) paints from a tiny initial
 * payload, before the JS bundle and with zero dependency on the app stylesheet or
 * any JS.
 *
 * The DNA is the real Claude Design beaded double helix (same animation as the
 * client <Splash> canvas), pre-rendered to a seamless 60fps loop. Two sources are
 * provided so it animates on EVERY device: /loader-dna.webm (VP9, transparent) for
 * Chrome/Edge/Firefox/Android, and /loader-dna.mp4 (H.264, background baked to the
 * #F4F7FB surface tone) for Safari/iOS. The overlay background is the same #F4F7FB,
 * so both sources render identically with no seam. It plays with NO JavaScript via
 * a muted autoplay loop <video>, so it animates during loading and with JS disabled;
 * /loader-poster.png is the still fallback. The logo is STATIC.
 *
 * When the real client canvas <Splash> is ready it takes over and removes #alb-pre
 * (z-index 10000, under #alb-pre's 10001), so there is no white gap. Removal is
 * event-based (window `load`), never a timer, and shows on every load. Emitted via
 * one dangerouslySetInnerHTML on a <div suppressHydrationWarning> so the inline
 * script can removeChild #alb-pre with no hydration mismatch.
 */

const STYLE = `
#alb-pre{position:fixed;inset:0;z-index:10001;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;background:#F4F7FB;}
#alb-pre img.alb-logo{height:56px;width:auto;display:block;}
#alb-pre video.alb-dna{width:min(760px,86vw);height:auto;display:block;pointer-events:none;}
`.trim();

const SCRIPT = `
(function(){
  function hide(){
    var e=document.getElementById('alb-pre');
    if(!e)return;
    e.style.transition='opacity .45s ease';
    e.style.opacity='0';
    e.addEventListener('transitionend',function(){if(e.parentNode)e.parentNode.removeChild(e);});
  }
  if(document.readyState==='complete')hide();
  else window.addEventListener('load',hide,{once:true});
})();
`.trim();

export function InlineSplash() {
  const html =
    `<style>${STYLE}</style>` +
    `<div id="alb-pre" aria-hidden="true">` +
    `<img class="alb-logo" src="/logo.png" alt="Albatros Health Care"/>` +
    `<video class="alb-dna" poster="/loader-poster.png" autoplay muted loop playsinline>` +
    `<source src="/loader-dna.webm" type="video/webm"/>` +
    `<source src="/loader-dna.mp4" type="video/mp4"/>` +
    `</video>` +
    `</div>` +
    `<script>${SCRIPT}</script>`;
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
