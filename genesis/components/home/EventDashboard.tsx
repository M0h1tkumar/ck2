export function EventDashboard() {
  return (
    <section className="space-y-8">
      <div className="flex justify-between items-end">
        <h3 className="text-primary text-4xl font-bold uppercase tracking-widest">
          EVENT DASHBOARD
        </h3>
        <span className="text-secondary font-bold tracking-tighter">
          PHASE IV • ACTIVE
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 md:row-span-2 relic-card p-8 flex flex-col justify-between group border-l-2 border-primary">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] text-green-500 font-bold uppercase tracking-[0.3em]">
                System Live
              </span>
            </div>
            <span className="text-secondary text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
              Main Event
            </span>
            <h4 className="text-3xl font-bold text-on-surface group-hover:text-primary transition-colors">
              THE GREAT CHAKRAVYUH
            </h4>
            <p className="mt-4 text-on-surface-variant">
              The final confrontation. A 48-hour endurance test of wit, strength,
              and digital supremacy.
            </p>
          </div>
          <div className="mt-8">
            <div className="flex items-center gap-4 text-secondary mb-2">
              <span className="material-symbols-outlined">calendar_today</span>
              <span className="font-bold">OCT 24-26</span>
            </div>
            <div className="flex items-center gap-4 text-on-surface-variant">
              <span className="material-symbols-outlined">location_on</span>
              <span>Central Grounds</span>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-low p-6 flex flex-col justify-between border-l-4 border-primary-container">
          <span className="text-secondary text-sm font-bold uppercase">Pre-Trials</span>
          <h5 className="text-xl font-bold mt-2">Logic Gates Duel</h5>
          <p className="text-xs text-on-surface-variant mt-2 uppercase tracking-widest">
            Sept 15 • 14:00
          </p>
        </div>
        <div className="bg-surface-container-low p-6 flex flex-col justify-between border-l-4 border-secondary-container">
          <span className="text-secondary text-sm font-bold uppercase">Workshops</span>
          <h5 className="text-xl font-bold mt-2">Quantum Siege</h5>
          <p className="text-xs text-on-surface-variant mt-2 uppercase tracking-widest">
            Sept 22 • 10:00
          </p>
        </div>
        <div className="md:col-span-2 bg-surface-container-high p-6 flex items-center justify-between group cursor-pointer hover:bg-primary-container/20 transition-all">
          <div>
            <h5 className="text-2xl font-bold">Registration Deadline</h5>
            <p className="text-on-surface-variant">
              Secure your place in history before the gates close.
            </p>
          </div>
          <div className="text-right">
            <span className="text-primary text-3xl font-black">AUG 30</span>
          </div>
        </div>
      </div>
    </section>
  );
}
