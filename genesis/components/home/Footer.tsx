export function Footer() {
  return (
    <footer className="pt-16 pb-32 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between gap-12">
      <div className="space-y-4">
        <h4 className="text-primary text-2xl font-bold uppercase tracking-widest">
          SOA &amp; CHAKRAVYUH
        </h4>
        <p className="text-on-surface-variant max-w-xs">
          Building the future on the foundations of ancient excellence. Join the
          council.
        </p>
        <div className="flex gap-4">
          <span className="material-symbols-outlined aurora-hover text-secondary cursor-pointer hover:scale-110 transition-transform">
            share
          </span>
          <span className="material-symbols-outlined aurora-hover text-secondary cursor-pointer hover:scale-110 transition-transform">
            mail
          </span>
          <span className="material-symbols-outlined aurora-hover text-secondary cursor-pointer hover:scale-110 transition-transform">
            public
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-12">
        <div className="space-y-4">
          <h5 className="text-on-surface font-bold uppercase text-sm tracking-widest">
            Navigation
          </h5>
          <ul className="space-y-2 text-on-surface-variant text-sm">
            <li className="aurora-hover hover:text-secondary cursor-pointer">The Prophets</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h5 className="text-on-surface font-bold uppercase text-sm tracking-widest">
            Legal
          </h5>
          <ul className="space-y-2 text-on-surface-variant text-sm">
            <li className="aurora-hover hover:text-secondary cursor-pointer">Charter</li>
            <li className="aurora-hover hover:text-secondary cursor-pointer">Privacy Decree</li>
            <li className="aurora-hover hover:text-secondary cursor-pointer">Code of Honor</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
