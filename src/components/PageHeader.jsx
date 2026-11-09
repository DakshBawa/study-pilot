export default function PageHeader({ eyebrow, title, sub }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">{eyebrow}</p>
      <h1 className="mt-1 font-display text-3xl font-bold text-white">{title}</h1>
      {sub && <p className="mt-2 max-w-xl text-sm text-slate-400">{sub}</p>}
    </div>
  );
}
