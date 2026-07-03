/**
 * First-paint pre-layer for the splash. Rendered as the FIRST child of <body> in
 * the initial server HTML with fully self-contained inline critical CSS, so the
 * branded load screen (solid bg + static logo + DNA video) paints from a tiny
 * initial payload, before the JS bundle and with zero dependency on the app
 * stylesheet or any JS.
 *
 * The DNA is the real Claude Design beaded double helix, pre-rendered to a seamless
 * 60fps H.264 video (/loader-dna.mp4, background baked to the #F4F7FB surface tone,
 * matched by the overlay background so there is no seam). H.264 is decoded in
 * hardware on every browser and device, so it plays smoothly from the first frame
 * (transparent WebM is decoded in software, which stutters at load; that is why we
 * use H.264 here). preload="auto" fetches it immediately so it is buffered before it
 * plays. It runs with NO JavaScript via a muted autoplay loop <video>; the poster is
 * the still first frame. The logo is STATIC.
 *
 * When the real client canvas <Splash> is ready it takes over (z-index 10000, under
 * #alb-pre's 10001) and removes #alb-pre, so there is no white gap. Removal is
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
    `<video class="alb-dna" poster="/loader-poster.png" preload="auto" autoplay muted loop playsinline>` +
    `<source src="/loader-dna.mp4" type="video/mp4"/>` +
    `</video>` +
    `</div>` +
    `<script>${SCRIPT}</script>`;
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
