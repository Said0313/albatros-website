import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Свяжитесь с Albatros Health Care для консультации и расчёта стоимости лабораторного оборудования. Ташкент, Узбекистан.",
};

const contacts = [
  { icon: MapPin, label: "Адрес", value: "Ташкент, Узбекистан" },
  { icon: Phone, label: "Телефон", value: "+998 (78) 150 06 88", href: "tel:+998781500688" },
  { icon: Mail, label: "Email", value: "info@albatros.uz", href: "mailto:info@albatros.uz" },
  { icon: Clock, label: "Часы работы", value: "Пн–Пт 9:00–18:00" },
  { icon: Send, label: "Telegram", value: "@albatros_uz", href: "https://t.me/albatros_uz" },
];

export default function ContactPage() {
  return (
    <div className="pb-24 pt-28 md:pt-32">
      <div className="container-x">
        <h1 className="font-display text-4xl font-extrabold text-text-primary md:text-5xl">Контакты</h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Свяжитесь с нами для консультации и расчёта стоимости оборудования.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_3fr]">
          <div className="space-y-5">
            {contacts.map((c) => (
              <div key={c.label} className="flex items-start gap-4 rounded-xl border border-bg-border bg-bg-card p-5">
                <c.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
                <div>
                  <div className="text-xs uppercase tracking-wide text-text-muted">{c.label}</div>
                  {c.href ? (
                    <a href={c.href} className="mt-0.5 block font-mono text-text-primary hover:text-brand-red">
                      {c.value}
                    </a>
                  ) : (
                    <div className="mt-0.5 font-mono text-text-primary">{c.value}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
