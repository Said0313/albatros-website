import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PartnersMarquee } from "@/components/home/PartnersMarquee";
import { AboutSection } from "@/components/home/AboutSection";
import { EventsTimeline } from "@/components/home/EventsTimeline";
import { ContactCTA } from "@/components/home/ContactCTA";
import { getFeatured } from "@/lib/catalog";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <CategoriesGrid />
      <FeaturedProducts products={getFeatured()} />
      <PartnersMarquee />
      <AboutSection />
      <EventsTimeline />
      <ContactCTA />
    </>
  );
}
