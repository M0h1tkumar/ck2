export function TopBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center w-full px-6 py-4 bg-[#1C1010] shadow-[0px_20px_40px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-4">
        <button className="aurora-hover text-[#E9C349] hover:bg-[#342727] p-2 transition-colors duration-300 rounded-sm">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="text-sm sm:text-lg md:text-2xl font-bold text-[#FFB4A8] uppercase tracking-[0.1em] sm:tracking-[0.2em] md:tracking-widest whitespace-nowrap">
          CHAKRAVYUH 2K26
        </h1>
      </div>
      <div className="h-10" />
    </header>
  );
}
