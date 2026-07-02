"use client";

import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import { useContactModal } from "@/components/ui/ContactModal";

export function ContactCTA() {
  const { open } = useContactModal();
  const t = useTranslations("cta");
  const tc = useTranslations("common");
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #16315F 0%, #102A52 60%, #0E244A 100%)" }}
    >
      {/* thin red top accent + soft glow for depth against the light page */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand-red to-transparent opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red/20 blur-[120px]" />
      {/* hairline at the boundary so the lighter CTA navy reads separate from the darker footer */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/10" />
      <div className="container-x relative z-10 flex flex-col items-center py-20 text-center md:py-28">
        <h2 className="font-display text-3xl font-bold text-white md:text-[44px]">{t("title")}</h2>
        <p className="mt-4 max-w-xl text-white/70">{t("subtitle")}</p>
        <a href="tel:+998781478880" className="mt-6 font-mono text-2xl text-white">
          +998 78 147 88 80
        </a>
        <a
          href="/price-list.pdf"
          download="Albatros_Price_List.pdf"
          className="btn-red mt-8 inline-flex items-center gap-2 rounded-lg px-7 py-3.5 font-medium"
        >
          <Download className="h-4 w-4" /> {tc("downloadPrice")}
        </a>
        <button
          onClick={() => open()}
          className="mt-4 text-sm text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
        >
          {tc("contactUs")}
        </button>
      </div>
    </section>
  );
}
