export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 bg-[#3F3131]/90 backdrop-blur-xl border-t border-[#5A403C]/20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] rounded-t-sm">
      <a
        href="#"
        className="flex flex-col items-center justify-center text-[#E9C349] bg-[#8B0000]/30 rounded-md py-1 px-3 active:scale-110 transition-all duration-200"
      >
        <span className="material-symbols-outlined">fort</span>
        <span className="text-[10px] uppercase tracking-tighter mt-1">Hub</span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center justify-center text-[#AA8984] opacity-70 hover:text-[#FF907F] transition-all active:scale-110 duration-200"
      >
        <span className="material-symbols-outlined">military_tech</span>
        <span className="text-[10px] uppercase tracking-tighter mt-1">Arena</span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center justify-center text-[#AA8984] opacity-70 hover:text-[#FF907F] transition-all active:scale-110 duration-200"
      >
        <span className="material-symbols-outlined">history_edu</span>
        <span className="text-[10px] uppercase tracking-tighter mt-1">Relics</span>
      </a>
      <a
        href="#"
        className="flex flex-col items-center justify-center text-[#AA8984] opacity-70 hover:text-[#FF907F] transition-all active:scale-110 duration-200"
      >
        <span className="material-symbols-outlined">account_circle</span>
        <span className="text-[10px] uppercase tracking-tighter mt-1">Prophets</span>
      </a>
    </nav>
  );
  return null;
}