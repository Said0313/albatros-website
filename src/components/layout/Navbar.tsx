"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContactModal } from "@/components/ui/ContactModal";

const links = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "О компании" },
  { href: "/partners", label: "Партнёры" },
  { href: "/events", label: "Мероприятия" },
  { href: "/contact", label: "Контакты" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { open } = useContactModal();

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
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-bg-border bg-[rgba(6,12,26,0.92)] backdrop-blur-lg" : "bg-transparent"
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="relative z-10">
          <Image src="/logo.png" alt="Albatros Health Care" width={180} height={27} priority className="h-9 w-auto md:h-11" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "nav-underline relative text-[15px] transition-colors",
                pathname === l.href ? "active text-text-primary" : "text-text-secondary hover:text-text-primary"
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <button
            onClick={() => open()}
            className="btn-red flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
          >
            <Phone className="h-4 w-4" /> Заказать звонок
          </button>
        </div>

        <button className="relative z-10 p-2 text-text-primary md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Меню">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-0 bg-black/60 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.35 }}
              className="fixed right-0 top-0 z-[5] flex h-screen w-72 flex-col gap-2 border-l border-bg-border bg-bg-card px-6 pt-24 md:hidden"
            >
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "rounded-lg px-3 py-3 text-lg",
                    pathname === l.href ? "bg-bg-elevated text-text-primary" : "text-text-secondary"
                  )}
                >
                  {l.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  open();
                }}
                className="btn-red mt-4 flex items-center justify-center gap-2 rounded-lg px-5 py-3 font-medium"
              >
                <Phone className="h-4 w-4" /> Заказать звонок
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
