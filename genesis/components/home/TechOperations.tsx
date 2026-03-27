import Image from "next/image";

export function TechOperations() {
  return (
    <section className="space-y-12">
      <h3 className="text-secondary text-4xl font-bold text-center">
        TECH OPERATIONS &amp; DEPLOYMENTS
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group">
          <div className="relative aspect-video overflow-hidden mb-6">
            <Image
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80"
              alt="Tech"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-primary-container/40 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h4 className="text-2xl font-bold text-primary flex items-center gap-3">
            <span className="material-symbols-outlined">terminal</span>
            Cyber-Warfare
          </h4>
          <p className="mt-2 text-on-surface-variant">
            Defense and offense drills in virtual simulated environments. Real-time
            threat mitigation.
          </p>
        </div>
        <div className="group">
          <div className="relative aspect-video overflow-hidden mb-6">
            <Image
              src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80"
              alt="Robotics"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-secondary-container/40 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h4 className="text-2xl font-bold text-primary flex items-center gap-3">
            <span className="material-symbols-outlined">precision_manufacturing</span>
            Iron Sentry Build
          </h4>
          <p className="mt-2 text-on-surface-variant">
            Advanced robotics workshop focusing on autonomous navigation and
            objective acquisition.
          </p>
        </div>
        <div className="group">
          <div className="relative aspect-video overflow-hidden mb-6">
            <Image
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
              alt="Workshop"
              fill
              unoptimized
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-primary-container/40 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h4 className="text-2xl font-bold text-primary flex items-center gap-3">
            <span className="material-symbols-outlined">hub</span>
            Imperial Strategy
          </h4>
          <p className="mt-2 text-on-surface-variant">
            Collaborative seminars on game theory, historical military tactics, and
            modern leadership.
          </p>
        </div>
      </div>
    </section>
  );
  return null;
}