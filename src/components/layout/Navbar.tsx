"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const NAV = [
  { href: "/", key: "home" },
  { href: "/catalog", key: "catalog" },
  { href: "/about", key: "about" },
  { href: "/partners", key: "partners" },
  { href: "/events", key: "events" },
  { href: "/contact", key: "contact" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const tn = useTranslations("nav");
  const tc = useTranslations("common");
  const isUz = locale === "uz";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-bg-border transition-all duration-300",
        scrolled
          ? "bg-[rgba(251,252,254,0.92)] shadow-[0_1px_2px_rgba(16,40,90,0.05)] backdrop-blur-[14px]"
          : "bg-[rgba(251,252,254,0.8)] backdrop-blur-[8px]"
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="relative z-10">
          <Image src="/logo.png" alt="Albatros Health Care" width={180} height={27} priority className="h-7 w-auto md:h-8" />
        </Link>

        <div className={cn("hidden items-center lg:ml-10 lg:flex", isUz ? "gap-5" : "gap-8")}>
          {NAV.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "nav-underline relative whitespace-nowrap text-[15px] transition-colors",
                pathname === l.href ? "active text-text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {tn(l.key)}
            </Link>
          ))}
        </div>

        {/* RU/UZ switcher sits BETWEEN the nav links and the price button (both locales) */}
        <LanguageSwitcher className="hidden lg:inline-flex" />

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="/price-list.pdf"
            download="Albatros_Price_List.pdf"
            className="btn-red flex items-center gap-2 whitespace-nowrap rounded-lg px-5 py-2.5 text-sm font-medium"
          >
            <Download className="h-4 w-4 shrink-0" /> {tc("priceShort")}
          </a>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <LanguageSwitcher />
          <button className="relative z-10 p-2 text-text-primary" onClick={() => setMobileOpen((v) => !v)} aria-label={tc("menu")}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-0 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
              className="fixed right-0 top-0 z-[5] flex h-screen w-72 flex-col gap-2 border-l border-bg-border bg-bg-card px-6 pt-24 lg:hidden"
            >
              {NAV.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-lg px-3 py-3 text-lg",
                    pathname === l.href ? "bg-bg-elevated text-text-primary" : "text-text-secondary"
                  )}
                >
                  {tn(l.key)}
                </Link>
              ))}
              <a
                href="/price-list.pdf"
                download="Albatros_Price_List.pdf"
                onClick={() => setMobileOpen(false)}
                className="btn-red mt-4 flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-medium"
              >
                <Download className="h-4 w-4" /> {tc("downloadPrice")}
              </a>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
