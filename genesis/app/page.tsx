import {
  AboutSection,
  EventDashboard,
  Footer,
  GallerySection,
  HeroSection,
  InnovationCorner,
  MobileNav,
  ThreeDShowcase,
  TechOperations,
  TopBar,
} from "@/components/home";

export default function Home() {
  return (
    <>
      <TopBar />

      <main className="bg-background text-on-background pb-20">
        <section aria-label="3D showcase">
          <ThreeDShowcase />
        </section>

        <section className="relative z-10 mx-auto max-w-7xl space-y-24 px-4 py-16 md:px-12 md:py-24">
          <HeroSection />
          <AboutSection />
          <EventDashboard />
          <TechOperations />
          <InnovationCorner />
          <GallerySection />
          <Footer />
        </section>
      </main>

      <MobileNav />
    </>
  );
}
