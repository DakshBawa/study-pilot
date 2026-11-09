import PageHeader from "../components/PageHeader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { level, levelStyle } from "../utils/stats.js";

export default function Report({ stats, attempts, topics, goMaterial, goQuiz }) {
  if (topics.length === 0) return <><PageHeader eyebrow="Report" title="Performance" /><EmptyState onGo={goMaterial} /></>;
  const all = attempts.flatMap((a) => a.answers);
  const overall = all.length ? Math.round((all.filter((a) => a.correct).length / all.length) * 100) : null;
  const focus = stats.filter((s) => s.pct !== null).sort((a, b) => a.pct - b.pct).slice(0, 2);

  return (
    <>
      <PageHeader eyebrow="Step 5" title="Performance report" sub="See which topics are strong and where to spend your next study session." />
      <div className="mb-5 grid max-w-3xl gap-3 sm:grid-cols-3">
        {[["Overall accuracy", overall === null ? "–" : `${overall}%`], ["Tests taken", attempts.length], ["Questions answered", all.length]].map(([k, v]) => (
          <div key={k} className="panel !p-4"><p className="text-xs text-slate-400">{k}</p><p className="font-display text-3xl font-bold text-white">{v}</p></div>
        ))}
      </div>

      <section className="panel mb-5 max-w-3xl">
        <h2 className="mb-4 font-display font-semibold text-white">Topic-wise performance</h2>
        <div className="space-y-4">
          {stats.map((s) => (
            <div key={s.id}>
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span className="font-medium text-white">{s.title}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${levelStyle(s.pct)}`}>{level(s.pct)}{s.pct !== null ? ` · ${s.pct}%` : ""}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-edge" role="img" aria-label={`${s.title}: ${s.pct ?? 0}%`}>
                <div className={`h-full rounded-full ${levelStyle(s.pct).split(" ")[0]}`} style={{ width: `${s.pct ?? 0}%` }} />
              </div>
              <p className="mt-1 text-xs text-slate-500">{s.correct} of {s.attempted} answered correctly</p>
            </div>
          ))}
        </div>
      </section>

      {attempts.length === 0 ? (
        <div className="panel max-w-3xl"><p className="mb-3 text-sm text-slate-400">No results yet. Take a quiz and your report fills up.</p><button className="btn" onClick={goQuiz}>Take a quiz</button></div>
      ) : (
        <div className="grid max-w-3xl gap-5 md:grid-cols-2">
          <section className="panel">
            <h2 className="mb-2 font-display font-semibold text-white">Focus next</h2>
            {focus.map((s) => <p key={s.id} className="py-1 text-sm">🎯 Revise <b className="text-white">{s.title}</b> ({s.pct}%)</p>)}
          </section>
          <section className="panel">
            <h2 className="mb-2 font-display font-semibold text-white">Recent tests</h2>
            {attempts.slice(0, 5).map((a) => (
              <p key={a.id} className="flex justify-between py-1 text-sm">
                <span>{a.mode}</span><span className="text-slate-400">{a.answers.filter((x) => x.correct).length}/{a.answers.length} · {a.when}</span>
              </p>
            ))}
          </section>
        </div>
      )}
    </>
  );
}
