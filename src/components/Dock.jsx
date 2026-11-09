const ITEMS = [["material", "Material", "📚"], ["practice", "Quiz", "✏️"], ["mock", "Mock test", "⏱️"], ["plan", "Plan", "📅"], ["report", "Report", "📊"]];

export default function Dock({ tab, setTab }) {
  return (
    <nav className="dock fixed bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-1 rounded-2xl p-1.5" aria-label="Main">
      {ITEMS.map(([id, label, icon]) => (
        <button key={id} onClick={() => setTab(id)} aria-current={tab === id ? "page" : undefined}
          className={`dock-item flex min-w-[58px] flex-col items-center rounded-xl px-2.5 py-1.5 text-[11px] font-medium sm:min-w-[76px] sm:text-xs ${tab === id ? "bg-lime text-night" : "text-slate-300 hover:bg-white/10"}`}>
          <span className="text-lg" aria-hidden>{icon}</span>{label}
        </button>
      ))}
    </nav>
  );
}
