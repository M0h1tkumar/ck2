export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#3F3131]/95 backdrop-blur-2xl border-t border-secondary/10 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] rounded-t-2xl">
      <a
        href="#"
        className="aurora-hover flex flex-col items-center justify-center text-[#AA8984] opacity-70 hover:text-[#FF907F] transition-all active:scale-110 duration-200"
      >
        <span className="material-symbols-outlined text-2xl">home</span>
        <span className="text-[10px] uppercase tracking-tighter mt-1 font-bold">Base</span>
      </a>
    </nav>
  );
}
