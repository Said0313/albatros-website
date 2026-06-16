"use client";

import { useContactModal } from "@/components/ui/ContactModal";

export function ContactCTA() {
  const { open } = useContactModal();
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0D0204, #1A0507, #0C1628)" }}
    >
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-red/20 blur-[120px]" />
      <div className="container-x relative z-10 flex flex-col items-center py-20 text-center md:py-28">
        <h2 className="font-display text-3xl font-bold text-text-primary md:text-[44px]">
          Готовы оснастить вашу лабораторию?
        </h2>
        <p className="mt-4 max-w-xl text-text-secondary">
          Свяжитесь с нами для консультации и расчёта стоимости
        </p>
        <a href="tel:+998781500688" className="mt-6 font-mono text-2xl text-text-primary">
          +998 (78) 150 06 88
        </a>
        <button
          onClick={() => open()}
          className="mt-8 rounded-lg bg-white px-7 py-3.5 font-medium text-brand-red transition-colors hover:bg-brand-red hover:text-white"
        >
          Заказать звонок
        </button>
      </div>
    </section>
  );
}
