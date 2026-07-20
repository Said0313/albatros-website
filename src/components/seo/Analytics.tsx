import Script from "next/script";

// GA4 + Yandex Metrica, loaded once site-wide from the root layout.
// The IDs are PUBLIC counter ids, so a committed default is safe and, unlike a
// gitignored env value, guarantees the counters are present at build time.
// NEXT_PUBLIC_GA_ID / NEXT_PUBLIC_YM_ID still override the defaults if set.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-PTGDZY33XG";
const YM_ID = process.env.NEXT_PUBLIC_YM_ID || "110885927";

export function Analytics() {
  return (
    <>
      {GA_ID ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
          </Script>
        </>
      ) : null}

      {YM_ID ? (
        <>
          {/* Official Yandex Metrica tag.js snippet (the in-loop return guards
              against double-loading). Init options per owner request. */}
          <Script id="ym-init" strategy="afterInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
ym(${YM_ID}, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true});`}
          </Script>
          <noscript>
            <div>
              {/* Plain img is required: this is the Metrica tracking pixel and
                  it lives inside <noscript>, where next/image cannot run. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://mc.yandex.ru/watch/${YM_ID}`}
                style={{ position: "absolute", left: "-9999px" }}
                alt=""
              />
            </div>
          </noscript>
        </>
      ) : null}
    </>
  );
}
