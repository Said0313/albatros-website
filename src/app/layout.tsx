import type { Metadata } from "next";
import { Syne, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactProvider } from "@/components/ui/ContactModal";

const syne = Syne({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-syne", display: "swap" });
const inter = Inter({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], variable: "--font-inter", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-mono", display: "swap" });

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
    locale: "ru_UZ",
    type: "website",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${syne.variable} ${inter.variable} ${mono.variable}`}>
      <body>
        <ContactProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ContactProvider>
      </body>
    </html>
  );
}
