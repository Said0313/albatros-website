import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { ClientsMarquee } from "@/components/home/ClientsMarquee";
import { AboutSection } from "@/components/home/AboutSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { EventsTimeline } from "@/components/home/EventsTimeline";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getFeatured } from "@/lib/catalog";

// Below-the-fold carousel pulls in embla — code-split it (ssr stays on, so the
// SSR HTML is unchanged) to keep it out of the initial client bundle.
const FeaturedProducts = dynamic(() =>
  import("@/components/home/FeaturedProducts").then((m) => m.FeaturedProducts)
);

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
