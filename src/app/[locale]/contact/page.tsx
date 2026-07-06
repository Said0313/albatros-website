import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { ContactForm } from "@/components/contact/ContactForm";

const contacts: { icon: typeof MapPin; key: string; valueKey?: string; value?: string; href?: string }[] = [
  { icon: MapPin, key: "address", valueKey: "addressValue" },
  { icon: Phone, key: "office", value: "+998 78 147 88 80", href: "tel:+998781478880" },
  { icon: Phone, key: "accounting", value: "+998 99 831 77 81", href: "tel:+998998317781" },
  { icon: Mail, key: "email", value: "info@albatros.uz", href: "mailto:info@albatros.uz" },
  { icon: Clock, key: "hours", valueKey: "hoursValue" },
  { icon: Send, key: "telegram", value: "@ahc_seminars", href: "https://t.me/ahc_seminars" },
];

export default function ContactPage() {
  const t = useTranslations("contact");
  return (
    <div className="pb-24 pt-28 md:pt-32">
      <div className="container-x">
        <h1 className="font-display text-4xl font-extrabold text-text-primary md:text-5xl">{t("title")}</h1>
        <p className="mt-3 max-w-2xl text-text-secondary">{t("subtitle")}</p>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_3fr]">
          <div className="space-y-5">
            {contacts.map((c) => {
              const value = c.valueKey ? t(c.valueKey) : c.value!;
              return (
                <div key={c.key} className="flex items-start gap-4 rounded-xl border border-bg-border bg-bg-card p-5">
                  <c.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand-red" />
                  <div>
                    <div className="text-xs uppercase tracking-wide text-text-muted">{t(c.key)}</div>
                    {c.href ? (
                      <a href={c.href} className="mt-1 block text-[15px] leading-relaxed text-text-primary hover:text-brand-red">
                        {value}
                      </a>
                    ) : (
                      <div className="mt-1 text-[15px] leading-relaxed text-text-primary">{value}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <ContactForm />
        </div>
      </div>
    </div>
  );
}
