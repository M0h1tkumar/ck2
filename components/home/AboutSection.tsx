import Image from "next/image";

export function AboutSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
      <div className="md:col-span-7 space-y-6">
        <h3 className="text-secondary text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
          Our Sacred Vision
        </h3>
        <div className="h-1 w-24 bg-primary-container" />
        <p className="text-on-surface text-base sm:text-lg md:text-xl leading-relaxed">
          SOA &amp; CHAKRAVYUH is not merely a club; it is a bastion of intellectual
          and physical excellence. Born from the legacy of ancient strategies and
          modern technological prowess, we forge the leaders of tomorrow through
          rigorous challenge and collaborative innovation.
        </p>
        <p className="text-on-surface-variant">
          Our history stretches back through decades of competitive spirit, evolving
          from a small gathering of visionaries into an imperial force of student-led
          excellence.
        </p>
      </div>
      <div className="md:col-span-5 relative">
        <div className="aspect-[4/5] overflow-hidden bg-surface-container-high rounded-sm shadow-2xl">
          <Image
            src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80"
            alt="History"
            width={600}
            height={750}
            unoptimized
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </div>
        <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 bg-primary-container p-4 sm:p-6 md:p-8 shadow-2xl border border-white/5">
          <span className="text-on-primary-container text-xl sm:text-2xl md:text-4xl font-black block leading-none">EST.</span>
          <span className="text-secondary text-2xl sm:text-3xl md:text-5xl font-black tracking-widest leading-none">1998</span>
        </div>
      </div>
    </section>
  );
}
