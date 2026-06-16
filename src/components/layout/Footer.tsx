import Image from "next/image";
import Link from "next/link";
import { Send, MapPin, Phone, Mail, Clock } from "lucide-react";

const navLinks = [
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О компании" },
  { href: "/partners", label: "Партнёры" },
  { href: "/events", label: "Мероприятия" },
  { href: "/contact", label: "Контакты" },
];

const topCategories = ["ИХЛА", "Биохимия", "Гематология", "Микробиология", "ПЦР", "Генетика"];

export function Footer() {
  return (
    <footer className="border-t border-bg-border bg-[#040810]">
      <div className="container-x grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image src="/logo.png" alt="Albatros Health Care" width={180} height={27} className="h-10 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
            Официальный дистрибьютор мировых лидеров IVD-диагностики в Узбекистане с 2017 года.
          </p>
          <div className="mt-4 flex items-center gap-2 text-sm text-text-secondary">
            <Clock className="h-4 w-4 text-brand-red" /> Пн–Пт 9:00–18:00
          </div>
          <a
            href="https://t.me/albatros_uz"
            className="mt-4 inline-flex items-center gap-2 rounded-lg border border-bg-border bg-bg-card px-3 py-2 text-sm text-text-secondary hover:text-text-primary"
          >
            <Send className="h-4 w-4 text-brand-blue-light" /> Telegram
          </a>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wide text-text-primary">Навигация</h4>
          <ul className="mt-4 space-y-2.5">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-text-secondary hover:text-brand-red">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wide text-text-primary">Направления</h4>
          <ul className="mt-4 space-y-2.5">
            {topCategories.map((c) => (
              <li key={c}>
                <Link
                  href={`/catalog?category=${encodeURIComponent(c)}`}
                  className="text-sm text-text-secondary hover:text-brand-red"
                >
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold uppercase tracking-wide text-text-primary">Контакты</h4>
          <ul className="mt-4 space-y-3 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" /> Ташкент, Узбекистан
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-brand-red" />
              <a href="tel:+998781500688" className="font-mono hover:text-text-primary">+998 (78) 150 06 88</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-brand-red" />
              <a href="mailto:info@albatros.uz" className="hover:text-text-primary">info@albatros.uz</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-bg-border">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs text-text-muted sm:flex-row">
          <span>© 2017–2025 Albatros Health Care. Все права защищены.</span>
          <span>Ташкент, Узбекистан</span>
        </div>
      </div>
    </footer>
  );
}
