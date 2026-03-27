export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-center items-center px-4 pb-4 pt-2 bg-[#3F3131]/90 backdrop-blur-xl border-t border-[#5A403C]/20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-sm">
      <a
        href="#"
        className="aurora-hover flex flex-col items-center justify-center text-[#AA8984] opacity-70 hover:text-[#FF907F] transition-all active:scale-110 duration-200"
      >
        <span className="material-symbols-outlined">account_circle</span>
        <span className="text-[10px] uppercase tracking-tighter mt-1">Prophets</span>
      </a>
    </nav>
  );
}
