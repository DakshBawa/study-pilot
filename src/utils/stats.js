export function topicStats(topics, attempts) {
  const m = Object.fromEntries(topics.map((t) => [t.id, { id: t.id, title: t.title, attempted: 0, correct: 0 }]));
  attempts.forEach((a) => a.answers.forEach((x) => { const s = m[x.topicId]; if (s) { s.attempted++; if (x.correct) s.correct++; } }));
  return Object.values(m).map((s) => ({ ...s, pct: s.attempted ? Math.round((s.correct / s.attempted) * 100) : null }));
}

export const level = (p) => (p === null ? "Not tested" : p < 50 ? "Needs work" : p < 75 ? "Getting there" : "Strong");
export const levelStyle = (p) => (p === null ? "bg-slate-600 text-slate-300" : p < 50 ? "bg-coral text-night" : p < 75 ? "bg-amber text-night" : "bg-lime text-night");
