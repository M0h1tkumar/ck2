import Image from "next/image";

export function InnovationCorner() {
  return (
    <section className="relic-card overflow-hidden border-l-2 border-primary">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="p-12 space-y-8">
          <div className="inline-flex items-center gap-2 bg-secondary/10 px-4 py-1 text-secondary text-sm font-bold uppercase tracking-widest">
            <span className="material-symbols-outlined text-sm">lightbulb</span>
            Innovation Corner
          </div>
          <h3 className="text-4xl font-black text-on-surface leading-tight">
            Project: VEDAS II
            <br />
            <span className="text-primary italic">The Neural Archive</span>
          </h3>
          <p className="text-on-surface-variant text-lg">
            Our flagship R&amp;D project involves the creation of a decentralized
            knowledge base powered by a proprietary LLM trained on the club&apos;s
            25-year history of technical documents.
          </p>
          <div className="flex gap-4">
            <div className="bg-surface-container p-4 flex-1">
              <span className="text-secondary text-2xl font-black">94%</span>
              <p className="text-xs uppercase text-on-surface-variant">Accuracy</p>
            </div>
            <div className="bg-surface-container p-4 flex-1">
              <span className="text-secondary text-2xl font-black">2.4TB</span>
              <p className="text-xs uppercase text-on-surface-variant">Data Index</p>
            </div>
          </div>
          <button className="text-secondary font-bold flex items-center gap-2 group">
            VIEW ALL PROJECTS
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
        <div className="bg-primary-container/20 relative flex items-center justify-center p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-container/30 to-transparent" />
          <Image
            src="https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80"
            alt="Innovation"
            width={500}
            height={400}
            unoptimized
            className="w-full h-full object-cover rounded-sm mix-blend-screen opacity-60"
          />
        </div>
      </div>
    </section>
  );
  return null;
}