/**
 * First-paint pre-layer for the splash. Rendered as the FIRST child of <body> in
 * the initial server HTML with fully self-contained inline critical CSS, so the
 * branded load screen (gradient + static logo + DNA) paints from a tiny initial
 * payload, before the JS bundle and with zero dependency on the app stylesheet or
 * any JS.
 *
 * The DNA is the real Claude Design beaded double helix (the same animation as the
 * client <Splash> canvas), pre-rendered to a seamless looping alpha WebM
 * (/loader-dna.webm) with a transparent poster (/loader-poster.png). It plays with
 * NO JavaScript via a muted autoplay loop <video>, so it animates during loading
 * and with JS disabled. Browsers without VP9-alpha (e.g. Safari) show the poster,
 * which is a still frame of the same helix. The logo is STATIC.
 *
 * When the real client canvas <Splash> is ready it takes over on the identical
 * gradient background (z-index 10000, under #alb-pre's 10001) and removes #alb-pre,
 * so there is no white gap. Removal is event-based (window `load`), never a timer,
 * and shows on every load. Emitted via one dangerouslySetInnerHTML on a
 * <div suppressHydrationWarning> so the inline script can removeChild #alb-pre with
 * no hydration mismatch.
 */

const STYLE = `
#alb-pre{position:fixed;inset:0;z-index:10001;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;background:radial-gradient(120% 80% at 50% 40%,#FFFFFF,#EAF0F8);}
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
    `<video class="alb-dna" src="/loader-dna.webm" poster="/loader-poster.png" autoplay muted loop playsinline></video>` +
    `</div>` +
    `<script>${SCRIPT}</script>`;
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
