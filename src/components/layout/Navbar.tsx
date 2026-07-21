"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { categoryLabel } from "@/data/i18n";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const NAV = [
  { href: "/", key: "home" },
  { href: "/catalog", key: "catalog" },
  { href: "/about", key: "about" },
  { href: "/partners", key: "partners" },
  { href: "/events", key: "events" },
  { href: "/contact", key: "contact" },
] as const;

// Top catalog directions for the mobile menu's second column (mirrors the footer).
const MENU_DIRECTIONS = ["ИХЛА", "Биохимия", "Гематология", "Микробиология", "ПЦР", "Генетика"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const tn = useTranslations("nav");
  const tc = useTranslations("common");
  const tf = useTranslations("footer");
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
          <Image src="/logo.png" alt="Albatros Health Care" width={1998} height={300} priority className="h-7 w-auto object-contain md:h-8" />
        </Link>

        {/* Desktop right cluster: nav links, RU/UZ toggle and price button, evenly
            spaced so the right side breathes. justify-between keeps the whole
            cluster pushed right, preserving the logo-to-nav gap. */}
        <div className="hidden items-center lg:ml-10 lg:flex lg:gap-4 xl:gap-8">
          <div className={cn("flex items-center", isUz ? "gap-3 xl:gap-5" : "gap-4 xl:gap-7")}>
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

          {/* RU/UZ switcher sits BETWEEN the nav links and the price button */}
          <LanguageSwitcher className="inline-flex" />

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
          <button className="relative z-40 p-2 text-text-primary" onClick={() => setMobileOpen((v) => !v)} aria-label={tc("menu")}>
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
              className="fixed inset-0 z-20 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
              className="fixed right-0 top-0 z-30 flex h-screen w-[86vw] max-w-md flex-col overflow-y-auto border-l border-bg-border bg-bg-card px-6 pb-8 pt-24 lg:hidden"
            >
              {/* Two columns so the width is used: navigation on the left, catalog
                  directions on the right. */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                <div>
                  <h4 className="mb-3 font-display text-xs font-bold uppercase tracking-wide text-text-muted">
                    {tf("navigation")}
                  </h4>
                  <div className="flex flex-col">
                    {NAV.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        className={cn(
                          "rounded-lg px-3 py-2.5 text-base",
                          pathname === l.href ? "bg-bg-elevated text-text-primary" : "text-text-secondary"
                        )}
                      >
                        {tn(l.key)}
                      </Link>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="mb-3 font-display text-xs font-bold uppercase tracking-wide text-text-muted">
                    {tf("directions")}
                  </h4>
                  <div className="flex flex-col">
                    {MENU_DIRECTIONS.map((c) => (
                      <Link
                        key={c}
                        href={{ pathname: "/catalog", query: { category: c } }}
                        className="rounded-lg px-3 py-2.5 text-base text-text-secondary"
                      >
                        {categoryLabel(c, locale)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <a
                href="/price-list.pdf"
                download="Albatros_Price_List.pdf"
                onClick={() => setMobileOpen(false)}
                className="btn-red mt-6 flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-medium"
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
