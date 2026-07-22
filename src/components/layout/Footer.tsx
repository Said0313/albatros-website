"use client";

import Image from "next/image";
import { Send, MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categoryLabel } from "@/data/i18n";

const NAV = [
  { href: "/catalog", key: "catalog" },
  { href: "/about", key: "about" },
  { href: "/partners", key: "partners" },
  { href: "/events", key: "events" },
  { href: "/contact", key: "contact" },
] as const;

const TOP_CATEGORIES = ["ИХЛА", "Биохимия", "Гематология", "Микробиология", "ПЦР", "Генетика"];

/**
 * Deep-navy footer (#0C1B3A) grounding the light site. Uses explicit light text
 * (not the light theme tokens) and the WHITE logo.
 */
export function Footer() {
  const locale = useLocale();
  const tn = useTranslations("nav");
  const tf = useTranslations("footer");
  return (
    <footer className="bg-[#0C1B3A] text-white/70">
      {/* Below lg: 2 columns so НАВИГАЦИЯ and НАПРАВЛЕНИЯ sit side by side
          (nav LEFT, directions RIGHT) with brand and КОНТАКТЫ full-width
          around them. lg and up: the original 4-column layout. */}
      <div className="container-x grid grid-cols-2 gap-10 py-16 lg:grid-cols-4">
        <div className="col-span-2 lg:col-span-1">
          <Image src="/logo-white.png" alt="Albatros Health Care" width={180} height={27} className="h-9 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">{tf("tagline")}</p>
          <div className="mt-4 flex items-center gap-2 text-sm text-white/65">
            <Clock className="h-4 w-4 text-brand-red-bright" /> {tf("hours")}
          </div>
          <div className="mt-4 flex items-center gap-2">
            {[
              { href: "https://t.me/ahc_seminars", label: "Telegram", Icon: Send },
              { href: "https://www.instagram.com/albatros_healthcareuz/", label: "Instagram", Icon: Instagram },
              { href: "https://www.facebook.com/albatros.uz/", label: "Facebook", Icon: Facebook },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#6E9BD6] bg-white/5 text-white transition-colors hover:border-[#5C7FB4] hover:bg-[#5C7FB4]"
              >
                <Icon className="h-4 w-4 text-[#6E9BD6] transition-colors group-hover:text-white" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wide text-white">{tf("navigation")}</h4>
          <ul className="mt-4 space-y-2.5">
            {NAV.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-white/65 transition-colors hover:text-brand-red-bright">
                  {tn(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wide text-white">{tf("directions")}</h4>
          <ul className="mt-4 space-y-2.5">
            {TOP_CATEGORIES.map((c) => (
              <li key={c}>
                <Link
                  href={{ pathname: "/catalog", query: { category: c } }}
                  className="text-sm text-white/65 transition-colors hover:text-brand-red-bright"
                >
                  {categoryLabel(c, locale)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <h4 className="font-display text-sm font-bold uppercase tracking-wide text-white">{tf("contacts")}</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-red-bright" /> {tf("addressValue")}
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-brand-red-bright" />
              <a href="tel:+998781478880" className="hover:text-white">+998 78 147 88 80</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-brand-red-bright" />
              <a href="tel:+998998317781" className="hover:text-white">+998 99 831 77 81</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand-red-bright" />
              <a href="mailto:info@albatros.uz" className="hover:text-white">info@albatros.uz</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-white/45 sm:flex-row">
          <span>{tf("rights")}</span>
          <span>{tf("city")}</span>
        </div>
      </div>
    </footer>
  );
}
