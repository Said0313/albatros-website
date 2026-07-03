/**
 * First-paint splash loader. Rendered as the FIRST child of <body> in the initial
 * server HTML with fully self-contained inline critical CSS, so it paints from a
 * tiny payload before the JS bundle, with zero dependency on the app stylesheet or
 * any JS, and with NO external asset at all.
 *
 * The DNA is the real beaded double helix, animated the way the original albatros.uz
 * loader is: 40 fixed vertical columns (.el), each a teal dashed rung carrying a
 * blue bead on top and a red bead on the bottom, each rotating around the X axis
 * (rotateX 0 -> 360deg) under a shared perspective, with staggered negative
 * animation-delays so the columns form a travelling, rotating double helix. Because
 * the columns are FIXED and rotate in place (not a sliding image), the motion reads
 * as a real rotating helix, and perspective makes front beads larger for depth. It
 * is pure CSS: one single stage, smooth from the very first painted frame, no logo
 * gap, no poster, no video, no buffering. !important keeps it animating under the
 * global reduced-motion freeze. The logo is STATIC.
 *
 * Removal is event-based (window `load`), never a timer, and shows on every load.
 * Emitted via one dangerouslySetInnerHTML on a <div suppressHydrationWarning> so the
 * inline script can removeChild #alb-pre with no hydration mismatch.
 */

const ELS = `<span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span><span class="el"></span>`;

const STYLE = `
#alb-pre{position:fixed;inset:0;z-index:10001;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px;background:radial-gradient(120% 80% at 50% 40%,#FFFFFF,#EAF0F8);}
#alb-pre img.alb-logo{height:56px;width:auto;display:block;}
#alb-pre .alb-dna{width:min(760px,86vw);height:210px;display:flex;align-items:center;justify-content:center;overflow:hidden;perspective:600px;-webkit-perspective:600px;}
#alb-pre .alb-dna .el{position:relative;width:1px;height:140px;margin:0 9px;border-left:1px dashed #3E8FA6;transform-style:preserve-3d;-webkit-transform-style:preserve-3d;transform:rotateX(0deg);animation:alb-run 3.696s linear infinite !important;-webkit-animation:alb-run 3.696s linear infinite !important;}
#alb-pre .alb-dna .el:before,#alb-pre .alb-dna .el:after{content:"";position:absolute;left:50%;width:12px;height:12px;margin-left:-6px;border-radius:50%;}
#alb-pre .alb-dna .el:before{top:-6px;background:#2E549C;}
#alb-pre .alb-dna .el:after{bottom:-6px;background:#D0181F;}
#alb-pre .alb-dna .el:nth-of-type(1){animation-delay:-0.000s;-webkit-animation-delay:-0.000s;}#alb-pre .alb-dna .el:nth-of-type(2){animation-delay:-0.240s;-webkit-animation-delay:-0.240s;}#alb-pre .alb-dna .el:nth-of-type(3){animation-delay:-0.480s;-webkit-animation-delay:-0.480s;}#alb-pre .alb-dna .el:nth-of-type(4){animation-delay:-0.721s;-webkit-animation-delay:-0.721s;}#alb-pre .alb-dna .el:nth-of-type(5){animation-delay:-0.961s;-webkit-animation-delay:-0.961s;}#alb-pre .alb-dna .el:nth-of-type(6){animation-delay:-1.201s;-webkit-animation-delay:-1.201s;}#alb-pre .alb-dna .el:nth-of-type(7){animation-delay:-1.441s;-webkit-animation-delay:-1.441s;}#alb-pre .alb-dna .el:nth-of-type(8){animation-delay:-1.682s;-webkit-animation-delay:-1.682s;}#alb-pre .alb-dna .el:nth-of-type(9){animation-delay:-1.922s;-webkit-animation-delay:-1.922s;}#alb-pre .alb-dna .el:nth-of-type(10){animation-delay:-2.162s;-webkit-animation-delay:-2.162s;}#alb-pre .alb-dna .el:nth-of-type(11){animation-delay:-2.402s;-webkit-animation-delay:-2.402s;}#alb-pre .alb-dna .el:nth-of-type(12){animation-delay:-2.643s;-webkit-animation-delay:-2.643s;}#alb-pre .alb-dna .el:nth-of-type(13){animation-delay:-2.883s;-webkit-animation-delay:-2.883s;}#alb-pre .alb-dna .el:nth-of-type(14){animation-delay:-3.123s;-webkit-animation-delay:-3.123s;}#alb-pre .alb-dna .el:nth-of-type(15){animation-delay:-3.363s;-webkit-animation-delay:-3.363s;}#alb-pre .alb-dna .el:nth-of-type(16){animation-delay:-3.604s;-webkit-animation-delay:-3.604s;}#alb-pre .alb-dna .el:nth-of-type(17){animation-delay:-3.844s;-webkit-animation-delay:-3.844s;}#alb-pre .alb-dna .el:nth-of-type(18){animation-delay:-4.084s;-webkit-animation-delay:-4.084s;}#alb-pre .alb-dna .el:nth-of-type(19){animation-delay:-4.324s;-webkit-animation-delay:-4.324s;}#alb-pre .alb-dna .el:nth-of-type(20){animation-delay:-4.565s;-webkit-animation-delay:-4.565s;}#alb-pre .alb-dna .el:nth-of-type(21){animation-delay:-4.805s;-webkit-animation-delay:-4.805s;}#alb-pre .alb-dna .el:nth-of-type(22){animation-delay:-5.045s;-webkit-animation-delay:-5.045s;}#alb-pre .alb-dna .el:nth-of-type(23){animation-delay:-5.285s;-webkit-animation-delay:-5.285s;}#alb-pre .alb-dna .el:nth-of-type(24){animation-delay:-5.526s;-webkit-animation-delay:-5.526s;}#alb-pre .alb-dna .el:nth-of-type(25){animation-delay:-5.766s;-webkit-animation-delay:-5.766s;}#alb-pre .alb-dna .el:nth-of-type(26){animation-delay:-6.006s;-webkit-animation-delay:-6.006s;}#alb-pre .alb-dna .el:nth-of-type(27){animation-delay:-6.246s;-webkit-animation-delay:-6.246s;}#alb-pre .alb-dna .el:nth-of-type(28){animation-delay:-6.486s;-webkit-animation-delay:-6.486s;}#alb-pre .alb-dna .el:nth-of-type(29){animation-delay:-6.727s;-webkit-animation-delay:-6.727s;}#alb-pre .alb-dna .el:nth-of-type(30){animation-delay:-6.967s;-webkit-animation-delay:-6.967s;}#alb-pre .alb-dna .el:nth-of-type(31){animation-delay:-7.207s;-webkit-animation-delay:-7.207s;}#alb-pre .alb-dna .el:nth-of-type(32){animation-delay:-7.447s;-webkit-animation-delay:-7.447s;}#alb-pre .alb-dna .el:nth-of-type(33){animation-delay:-7.688s;-webkit-animation-delay:-7.688s;}#alb-pre .alb-dna .el:nth-of-type(34){animation-delay:-7.928s;-webkit-animation-delay:-7.928s;}#alb-pre .alb-dna .el:nth-of-type(35){animation-delay:-8.168s;-webkit-animation-delay:-8.168s;}#alb-pre .alb-dna .el:nth-of-type(36){animation-delay:-8.408s;-webkit-animation-delay:-8.408s;}#alb-pre .alb-dna .el:nth-of-type(37){animation-delay:-8.649s;-webkit-animation-delay:-8.649s;}#alb-pre .alb-dna .el:nth-of-type(38){animation-delay:-8.889s;-webkit-animation-delay:-8.889s;}#alb-pre .alb-dna .el:nth-of-type(39){animation-delay:-9.129s;-webkit-animation-delay:-9.129s;}#alb-pre .alb-dna .el:nth-of-type(40){animation-delay:-9.369s;-webkit-animation-delay:-9.369s;}
@keyframes alb-run{from{transform:rotateX(0deg);}to{transform:rotateX(360deg);}}
@-webkit-keyframes alb-run{from{-webkit-transform:rotateX(0deg);}to{-webkit-transform:rotateX(360deg);}}
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
    `<div class="alb-dna">${ELS}</div>` +
    `</div>` +
    `<script>${SCRIPT}</script>`;
  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
