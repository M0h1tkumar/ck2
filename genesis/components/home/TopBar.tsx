export function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center w-full px-6 py-4 bg-[#1C1010] shadow-[0px_20px_40px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-4">
        <button className="text-[#E9C349] hover:bg-[#342727] p-2 transition-colors duration-300 rounded-sm">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="text-2xl font-bold text-[#FFB4A8] uppercase tracking-widest">
          CHAKRAVYUH 2K26
        </h1>
      </div>
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-8">
          <a href="#" className="text-[#E9C349] tracking-tight text-sm uppercase">
            Hub
          </a>
          <a
            href="#"
            className="text-[#E3BEB8] hover:text-[#FF907F] tracking-tight text-sm uppercase transition-colors"
          >
            Arena
          </a>
          <a
            href="#"
            className="text-[#E3BEB8] hover:text-[#FF907F] tracking-tight text-sm uppercase transition-colors"
          >
            Relics
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1 px-4 py-1.5 border border-secondary/40 text-secondary text-xs font-bold uppercase tracking-widest hover:bg-secondary/10 transition-all">
            <span className="material-symbols-outlined text-sm">3d_rotation</span>
            <span>3D View</span>
          </button>
          <button className="bg-secondary-container text-on-secondary-container px-6 py-1.5 font-bold text-sm uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all">
            Log In
          </button>
        </div>
      </div>
    </header>
  );
  return null;
}