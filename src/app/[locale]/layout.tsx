import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "../globals.css";
import { routing } from "@/i18n/routing";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactProvider } from "@/components/ui/ContactModal";
import { ParticleFieldProvider } from "@/components/ui/ParticleField";
import { InlineSplash } from "@/components/home/InlineSplash";
import { Analytics } from "@/components/seo/Analytics";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL, type AppLocale } from "@/lib/seo";

// Inter is the single typeface site-wide: body weights 400–600 AND heading
// weights 700/800 (headings were Syne, which has no Cyrillic - dropped so RU/UZ
// match). latin-ext covers the Uzbek modifier letters (oʻ/gʻ/ʼ), cyrillic covers RU.
const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono", display: "swap" });

// Bounded is the display face for headings in BOTH locales. Verified with
// fontTools: the variable file carries the FULL Cyrillic block (all RU letters)
// plus the Uzbek modifier letters ʻ/ʼ (U+02BB / U+02BC), so RU and UZ headings
// both render in real Bounded (no missing-glyph squares). Weight axis 200-900
// covers the 700/800 heading weights; Inter stays the fallback.
const bounded = localFont({
  src: "../../fonts/Bounded-Variable.ttf",
  weight: "200 900",
  variable: "--font-bounded",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const uz = locale === "uz";
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: "%s | Albatros Health Care",
      default: uz
        ? "Albatros Health Care - Oʻzbekistonda laboratoriya uskunalari"
        : "Albatros Health Care - Лабораторное оборудование в Узбекистане",
    },
    description: uz
      ? "SNIBE, BD, Randox, Dymind, Werfen, Illumina va boshqa IVD diagnostika yetakchilarining Oʻzbekistondagi rasmiy distribyutori. Kalit topshirish asosida yetkazib berish, 24/7 servis."
      : "Официальный дистрибьютор SNIBE, BD, Randox, Dymind, Werfen, Illumina и других мировых лидеров IVD-диагностики в Узбекистане. Поставка под ключ, сервис 24/7.",
    keywords: uz
      ? ["laboratoriya uskunalari", "IVD", "Oʻzbekiston", "SNIBE", "Maglumi", "diagnostika", "Albatros"]
      : ["лабораторное оборудование", "IVD", "Узбекистан", "SNIBE", "Maglumi", "диагностика", "Albatros"],
    openGraph: {
      type: "website",
      siteName: "Albatros Health Care",
      locale: uz ? "uz_UZ" : "ru_RU",
      images: ["/logo.png"],
    },
    twitter: { card: "summary_large_image", images: ["/logo.png"] },
  };
}

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
    <html lang={locale} className={`${inter.variable} ${mono.variable} ${bounded.variable}`}>
      <body>
        <OrganizationJsonLd locale={locale as AppLocale} />
        {/* Single-stage inline CSS loader only; the canvas <Splash> is intentionally
            NOT mounted so there is no second helix intro after hydration. */}
        <InlineSplash />
        <NextIntlClientProvider messages={messages}>
          <ContactProvider>
            {/* Site-wide particle field (fixed z-0 canvas). relative z-1 on
                main and the footer wrapper keeps all content above it. */}
            <ParticleFieldProvider>
              <Navbar />
              <main className="relative z-[1]">{children}</main>
              <div className="relative z-[1]">
                <Footer />
              </div>
            </ParticleFieldProvider>
          </ContactProvider>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
