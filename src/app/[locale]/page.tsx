import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { getTranslations } from "next-intl/server";
import { pageMetadata, type AppLocale } from "@/lib/seo";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { ClientsMarquee } from "@/components/home/ClientsMarquee";
import { ServicesSection } from "@/components/home/ServicesSection";
import { EventsTimeline } from "@/components/home/EventsTimeline";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getFeatured } from "@/lib/catalog";

// Below-the-fold carousel pulls in embla - code-split it (ssr stays on, so the
// SSR HTML is unchanged) to keep it out of the initial client bundle.
const FeaturedProducts = dynamic(() =>
  import("@/components/home/FeaturedProducts").then((m) => m.FeaturedProducts)
);
// Below-the-fold client section: code-split so its JS (count-up + intersection
// observer) stays out of the initial homepage bundle. SSR stays on.
const AboutSection = dynamic(() =>
  import("@/components/home/AboutSection").then((m) => m.AboutSection)
);

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const locale = params.locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({
    locale,
    // The home page shares the [locale] segment with the layout that declares
    // title.template, so the template is NOT applied here. Append the brand
    // suffix explicitly to match every other page's title.
    path: "/",
    title: `${t("home.title")} | Albatros Health Care`,
    description: t("home.description"),
  });
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <CategoriesGrid />
      <FeaturedProducts products={getFeatured()} />
      <PartnersMarquee />
      <ClientsMarquee />
      <AboutSection />
      <ServicesSection />
      <EventsTimeline />
      <ContactCTA />
    </>
  );
}
