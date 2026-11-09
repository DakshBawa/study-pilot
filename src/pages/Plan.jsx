import { useMemo, useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { buildPlan, isoDate } from "../utils/planner.js";

export default function Plan({ stats, topics, goMaterial }) {
  const [date, setDate] = useState(isoDate(new Date(Date.now() + 14 * 864e5)));
  const [hours, setHours] = useState(2);
  const [plan, setPlan] = useState(null);
  const [done, setDone] = useState({});

  const total = useMemo(() => (plan ? plan.reduce((s, d) => s + d.tasks.length, 0) : 0), [plan]);
  const finished = Object.values(done).filter(Boolean).length;

  if (topics.length === 0) return <><PageHeader eyebrow="Plan" title="Revision schedule" /><EmptyState onGo={goMaterial} /></>;
  const weak = stats.filter((s) => s.pct !== null && s.pct < 50).length;

  return (
    <>
      <PageHeader eyebrow="Step 4" title="Revision schedule" sub="Weak and untested topics get more study time. Take quizzes first for a smarter plan." />
      <div className="panel mb-6 grid max-w-2xl gap-4 sm:grid-cols-3 sm:items-end">
        <label className="text-sm font-semibold text-white">Exam date
          <input type="date" className="input mt-1" min={isoDate(new Date())} value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className="text-sm font-semibold text-white">Study hours per day: {hours}
          <input type="range" min="1" max="8" value={hours} onChange={(e) => setHours(+e.target.value)} className="mt-3 w-full accent-violet" />
        </label>
        <button className="btn" disabled={!date} onClick={() => { setPlan(buildPlan(stats, date, hours)); setDone({}); }}>Build my plan</button>
      </div>
      {weak > 0 && <p className="mb-4 text-sm text-amber">{weak} weak topic{weak > 1 ? "s" : ""} found. They are scheduled more often.</p>}

      {plan && (
        <>
          <div className="mb-4 max-w-2xl">
            <div className="mb-1 flex justify-between text-xs text-slate-400"><span>Progress</span><span>{finished}/{total} done</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-edge"><div className="h-full bg-lime transition-all" style={{ width: `${total ? (finished / total) * 100 : 0}%` }} /></div>
          </div>
          <div className="grid max-w-3xl gap-3 sm:grid-cols-2">
            {plan.map((d, i) => (
              <section key={i} className="panel !p-4">
                <h3 className="mb-2 font-display text-sm font-semibold text-violet-400">{i === plan.length - 1 ? "Final day · " : ""}{d.date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</h3>
                {d.tasks.map((t) => (
                  <label key={t.id} className="flex cursor-pointer items-start gap-2 py-1 text-sm">
                    <input type="checkbox" className="mt-1 accent-lime" checked={!!done[`${i}-${t.id}`]} onChange={(e) => setDone({ ...done, [`${i}-${t.id}`]: e.target.checked })} />
                    <span className={done[`${i}-${t.id}`] ? "text-slate-500 line-through" : ""}>{t.label}</span>
                  </label>
                ))}
              </section>
            ))}
          </div>
        </>
      )}
    </>
  );
}
