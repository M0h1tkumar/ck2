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
      <main className="h-dvh overflow-hidden bg-background text-on-background">
        <section aria-label="3D showcase" className="h-full">
          <ThreeDShowcase />
        </section>
      </main>
    </>
  );
}
