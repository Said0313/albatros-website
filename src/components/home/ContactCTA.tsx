"use client";

import { Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { useContactModal } from "@/components/ui/ContactModal";

export function ContactCTA() {
  const { open } = useContactModal();
  const t = useTranslations("cta");
  const tc = useTranslations("common");
  const tct = useTranslations("contact");
  const phones = [
    { label: tct("office"), num: "+998 77 756 42 36", href: "tel:+998777564236" },
    { label: tct("sales"), num: "+998 99 792 79 00", href: "tel:+998997927900" },
  ];
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
      <div className="container-x relative z-10 py-14 text-center md:py-28">
        <ScrollReveal className="flex flex-col items-center">
        <h2 className="font-display text-3xl font-bold text-white md:text-[44px]">{t("title")}</h2>
        <p className="mt-4 max-w-xl text-white/70">{t("subtitle")}</p>
        {/* Each phone sits in its own rounded card, tinted with the brand blue
            (#2E549C at 30% over the navy) so it reads clearly blue, not grey,
            and the two numbers no longer run together. Stacks full-width on
            mobile, two side-by-side cards from sm up. */}
        <div className="mt-7 grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          {phones.map((p) => (
            <a
              key={p.href}
              href={p.href}
              className="flex flex-col items-center gap-1 rounded-2xl border border-white/10 bg-[#2E549C]/30 px-6 py-5 transition-colors hover:bg-[#2E549C]/40"
            >
              <span className="text-xs uppercase tracking-wide text-white/60">{p.label}</span>
              <span className="font-mono text-2xl text-white">{p.num}</span>
            </a>
          ))}
        </div>
        {/* Primary CTA: opens the contact modal (was a price-list download).
            The old secondary "contact us" text link is dropped since this
            button now carries that action. */}
        <button
          onClick={() => open()}
          className="btn-red mt-8 inline-flex items-center gap-2 rounded-lg px-7 py-3.5 font-medium"
        >
          <Phone className="h-4 w-4" /> {tc("contactUs")}
        </button>
        </ScrollReveal>
      </div>
    </section>
  );
}
