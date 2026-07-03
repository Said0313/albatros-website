import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactProvider } from "@/components/ui/ContactModal";
import { InlineSplash } from "@/components/home/InlineSplash";

// Inter is the single typeface site-wide: body weights 400–600 AND heading
// weights 700/800 (headings were Syne, which has no Cyrillic — dropped so RU/UZ
// match). latin-ext covers the Uzbek modifier letters (oʻ/gʻ/ʼ), cyrillic covers RU.
const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono", display: "swap" });

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL("https://www.albatros.uz"),
  title: {
    template: "%s | Albatros Health Care",
    default: "Albatros Health Care — Лабораторное оборудование в Узбекистане",
  },
  description:
    "Официальный дистрибьютор SNIBE, BD, Randox, Dymind, Werfen, Illumina и других мировых лидеров IVD-диагностики в Узбекистане. Поставка под ключ, сервис 24/7.",
  keywords: ["лабораторное оборудование", "IVD", "Узбекистан", "SNIBE", "Maglumi", "диагностика", "Albatros"],
  openGraph: {
    title: "Albatros Health Care — Лабораторное оборудование в Узбекистане",
    description: "Официальный дистрибьютор мировых лидеров IVD-диагностики в Узбекистане.",
    type: "website",
    images: ["/logo.png"],
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as "ru" | "uz")) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${inter.variable} ${mono.variable}`}>
      <body>
        {/* Single-stage inline CSS loader only; the canvas <Splash> is intentionally
            NOT mounted so there is no second helix intro after hydration. */}
        <InlineSplash />
        <NextIntlClientProvider messages={messages}>
          <ContactProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </ContactProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
