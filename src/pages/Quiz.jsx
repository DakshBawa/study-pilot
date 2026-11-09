import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Runner from "../components/Runner.jsx";
import { makeQuestions } from "../utils/generator.js";

/* Used for both the practice quiz and the timed mock test. */
export default function Quiz({ mock, topics, addAttempt, goMaterial }) {
  const [picked, setPicked] = useState(null);
  const [count, setCount] = useState(mock ? 20 : 10);
  const [minutes, setMinutes] = useState(20);
  const [run, setRun] = useState(null);

  if (topics.length === 0) return <><PageHeader eyebrow="Practice" title={mock ? "Mock test" : "Quiz"} /><EmptyState onGo={goMaterial} /></>;
  const ids = picked || topics.map((t) => t.id);
  const toggle = (id) => setPicked(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]);
  const start = () => { const qs = makeQuestions(topics, ids, count); if (qs.length) setRun(qs); };

  if (run) {
    return (
      <>
        <PageHeader eyebrow={mock ? "Mock test" : "Quiz"} title={mock ? "Stay focused" : "Pick the missing word"} />
        <Runner questions={run} mock={mock} minutes={minutes} onFinish={(answers) => addAttempt({ mode: mock ? "Mock test" : "Quiz", answers })} onExit={() => setRun(null)} />
      </>
    );
  }

  return (
    <>
      <PageHeader eyebrow={mock ? "Step 3" : "Step 2"} title={mock ? "Mock test" : "Quiz"}
        sub={mock ? "A timed test across your chosen topics. Answers are revealed when you submit." : "Instant feedback on every question. Great for learning as you go."} />
      <div className="panel max-w-2xl space-y-5">
        <div>
          <p className="mb-2 text-sm font-semibold text-white">Topics</p>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button key={t.id} onClick={() => toggle(t.id)} aria-pressed={ids.includes(t.id)}
                className={`rounded-full border px-3 py-1.5 text-sm ${ids.includes(t.id) ? "border-lime bg-lime/15 text-lime" : "border-edge text-slate-400"}`}>{t.title}</button>
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-semibold text-white">Questions
            <select className="input mt-1" value={count} onChange={(e) => setCount(+e.target.value)}>{(mock ? [10, 20, 30] : [5, 10, 15]).map((n) => <option key={n}>{n}</option>)}</select>
          </label>
          {mock && (
            <label className="text-sm font-semibold text-white">Time limit
              <select className="input mt-1" value={minutes} onChange={(e) => setMinutes(+e.target.value)}>{[10, 20, 30, 45].map((n) => <option key={n} value={n}>{n} minutes</option>)}</select>
            </label>
          )}
        </div>
        <button className="btn" disabled={ids.length === 0} onClick={start}>{mock ? "Start test" : "Start quiz"}</button>
      </div>
    </>
  );
}
