const DAY = 864e5;
export const isoDate = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);

/* Weak or untested topics get more study slots. Last day is final revision; every 4th day has a mock test. */
export function buildPlan(stats, examDate, hours) {
  const start = new Date(); start.setHours(12, 0, 0, 0);
  const days = Math.min(60, Math.max(1, Math.round((new Date(`${examDate}T12:00:00`) - start) / DAY)));
  const slots = Math.max(1, Math.round(hours));
  const acc = (s) => (s.pct === null ? 50 : s.pct);
  const w = Object.fromEntries(stats.map((s) => [s.id, 1 + (1 - acc(s) / 100) * 2]));
  const total = Object.values(w).reduce((a, b) => a + b, 0);
  const credit = Object.fromEntries(stats.map((s) => [s.id, 0]));
  const weakest = [...stats].sort((a, b) => acc(a) - acc(b)).slice(0, 3);

  return Array.from({ length: days }, (_, d) => {
    const tasks = [];
    if (d === days - 1) {
      weakest.forEach((s) => tasks.push({ label: `Final revision: ${s.title}` }));
      tasks.push({ label: "Take a full mock test" });
    } else {
      for (let i = 0; i < slots; i++) {
        stats.forEach((s) => (credit[s.id] += w[s.id]));
        const pick = stats.reduce((a, b) => (credit[b.id] > credit[a.id] ? b : a));
        credit[pick.id] -= total;
        tasks.push({ label: `Study: ${pick.title}` });
      }
      if (d % 4 === 3) tasks.push({ label: "Take a mock test" });
    }
    return { date: new Date(start.getTime() + d * DAY), tasks: tasks.map((t, i) => ({ ...t, id: `${d}-${i}` })) };
  });
}
