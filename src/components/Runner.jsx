import { useEffect, useRef, useState } from "react";

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/* Runs a quiz (instant feedback) or a mock test (timed, answers revealed at the end). */
export default function Runner({ questions, mock, minutes = 0, onFinish, onExit }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState({});
  const [result, setResult] = useState(null);
  const [left, setLeft] = useState(minutes * 60);
  const ref = useRef({});

  const finish = () => {
    if (result) return;
    const answers = questions.map((q) => ({ qid: q.id, topicId: q.topicId, topic: q.topic, q: q.q, picked: ref.current[q.id] || null, answer: q.answer, correct: ref.current[q.id] === q.answer }));
    setResult(answers); onFinish(answers);
  };
  const choose = (q, o) => { if (!mock && picked[q.id]) return; ref.current = { ...ref.current, [q.id]: o }; setPicked(ref.current); };

  useEffect(() => { if (!mock || result) return; const t = setInterval(() => setLeft((l) => l - 1), 1000); return () => clearInterval(t); }, [mock, result]);
  useEffect(() => { if (mock && !result && left <= 0) finish(); }); // eslint-disable-line

  if (result) {
    const score = result.filter((a) => a.correct).length;
    const wrong = result.filter((a) => !a.correct);
    return (
      <div className="space-y-4">
        <div className="panel text-center">
          <p className="text-sm text-slate-400">Your score</p>
          <p className="font-display text-5xl font-bold text-lime">{score}<span className="text-2xl text-slate-500">/{result.length}</span></p>
          <p className="mt-1 text-sm text-slate-400">{Math.round((score / result.length) * 100)}% correct</p>
          <button className="btn mt-4" onClick={onExit}>Done</button>
        </div>
        {wrong.length > 0 && <h2 className="font-display font-semibold text-white">Review your mistakes</h2>}
        {wrong.map((a) => (
          <div key={a.qid} className="panel text-sm">
            <p className="text-xs text-violet-400">{a.topic}</p>
            <p className="my-1 text-slate-200">{a.q}</p>
            <p><span className="text-coral">You: {a.picked || "no answer"}</span> · <span className="text-lime">Correct: {a.answer}</span></p>
          </div>
        ))}
      </div>
    );
  }

  const q = questions[i];
  const last = i === questions.length - 1;
  const shown = !mock && picked[q.id];
  const style = (o) => {
    if (shown) return o === q.answer ? "border-lime bg-lime/10 text-lime" : o === picked[q.id] ? "border-coral bg-coral/10 text-coral" : "border-edge opacity-50";
    return picked[q.id] === o ? "border-violet bg-violet/20 text-white" : "border-edge hover:border-violet-400";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-400">Question {i + 1} of {questions.length}</span>
        {mock && <span className={`rounded-lg px-2.5 py-1 font-mono font-semibold ${left < 60 ? "bg-coral text-night" : "bg-white/10"}`}>⏱ {fmt(Math.max(0, left))}</span>}
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-edge"><div className="h-full bg-violet transition-all" style={{ width: `${((i + 1) / questions.length) * 100}%` }} /></div>
      <div className="panel">
        <p className="text-xs font-semibold text-violet-400">{q.topic}</p>
        <p className="my-3 font-display text-lg leading-snug text-white">{q.q}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {q.options.map((o) => (
            <button key={o} onClick={() => choose(q, o)} className={`rounded-xl border px-3 py-2.5 text-left text-sm capitalize ${style(o)}`}>{o}</button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          {mock && <button className="btn-alt" disabled={i === 0} onClick={() => setI(i - 1)}>Back</button>}
          <button className="btn-alt" onClick={onExit}>Quit</button>
        </div>
        <div className="flex gap-2">
          {mock && !last && <button className="btn-alt" onClick={() => setI(i + 1)}>Next</button>}
          {(mock || last) ? <button className="btn" disabled={!mock && !picked[q.id]} onClick={finish}>{mock ? "Submit test" : "Finish"}</button>
            : <button className="btn" disabled={!picked[q.id]} onClick={() => setI(i + 1)}>Next</button>}
        </div>
      </div>
    </div>
  );
}
