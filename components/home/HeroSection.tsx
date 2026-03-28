import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-[80dvh] flex flex-col items-center justify-center text-center py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-container/40 via-background to-background blur-3xl opacity-60" />
      <div className="relative group mb-12">
        <div className="absolute inset-[-15%] sm:inset-[-20%] border-[2px] border-dashed border-secondary/20 rounded-full animate-rotate-slow pointer-events-none flex items-center justify-center scale-[0.6] sm:scale-100">
          <div className="w-[95%] h-[95%] border border-secondary/10 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-full bg-secondary/5" />
            <div className="w-1 h-full bg-secondary/5 rotate-45" />
            <div className="w-1 h-full bg-secondary/5 rotate-90" />
            <div className="w-1 h-full bg-secondary/5 rotate-[135deg]" />
          </div>
        </div>
        <div className="absolute inset-0 bg-primary-container/20 blur-2xl rounded-full scale-150 animate-pulse" />
        <Image
          src="/logo.png"
          alt="Chakravyuh & Genesis 2K26 Logo"
          width={450}
          height={450}
          className="h-40 sm:h-56 md:h-[450px] w-auto relative z-10 drop-shadow-[0_0_50px_rgba(233,195,73,0.3)] transition-transform duration-700 hover:scale-105"
          priority
        />
      </div>
      <div className="space-y-12 relative z-20">
        <div className="flex flex-col items-center gap-4 pt-8 opacity-60 hover:opacity-100 transition-opacity cursor-pointer animate-bounce-slow">
          <span className="aurora-hover text-secondary font-bold tracking-[0.4em] text-xs uppercase">
            Scroll to Explore
          </span>
          <span className="material-symbols-outlined aurora-hover text-4xl text-secondary">
            keyboard_double_arrow_down
          </span>
        </div>
      </div>
    </section>
  );
}
