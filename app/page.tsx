import Image from "next/image";
import { ThreeDShowcase } from "@/components/home";

export default function Home() {
  return (
    <>
      <main className="relative h-dvh overflow-hidden bg-black text-on-background">
        {/* 3D Showcase (full screen) */}
        <section aria-label="3D showcase" className="h-full">
          <ThreeDShowcase />
        </section>

        {/* SOA Logo — Top Left */}
        <div className="logo-overlay logo-top-left">
          <Image
            src="/Club Logo/SOA-PNG.png"
            alt="SOA University Logo"
            width={72}
            height={72}
            className="logo-img"
            priority
          />
        </div>

        {/* Genesis Logo — Top Right */}
        <div className="logo-overlay logo-top-right">
          <Image
            src="/Club Logo/genesislogo.png"
            alt="Genesis Logo"
            width={96}
            height={96}
            className="logo-img-lg"
            priority
          />
        </div>

        {/* Credit Bar — Bottom Right */}
        <div className="credit-bar">
          <span className="credit-text">Made by</span>
          <Image
            src="/Club Logo/CODING NINJAS.png"
            alt="Coding Ninjas Logo"
            width={28}
            height={28}
            className="credit-logo"
          />
          <span className="credit-text credit-highlight">CN10XoC</span>
        </div>
      </main>
    </>
  );
}

