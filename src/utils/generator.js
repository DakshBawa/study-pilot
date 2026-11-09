/* Client-side question generator (no AI needed for the demo).
   To plug in a real AI/backend later, replace parseTopics/makeQuestions with API calls
   that return the same shapes. */
const STOP = new Set("about after again also because before being between both could does during each every from have having into more most other over same several should since some such than that their them then there these they this those through under until very were what when where which while with within would your".split(" "));

export const shuffle = (a) => [...a].sort(() => Math.random() - 0.5);
const sentencesOf = (t) => t.split(/(?<=[.!?])\s+/).map((s) => s.replace(/\s+/g, " ").trim()).filter((s) => s.length >= 35 && s.length <= 240);

function keyOf(sentence) {
  const words = sentence.match(/[A-Za-z][A-Za-z-]{4,}[A-Za-z]/g) || [];
  return words.slice(1).filter((w) => !STOP.has(w.toLowerCase())).sort((a, b) => b.length - a.length)[0] || null;
}

/* Turns uploaded text into topics. Headings ("# Title" or "Title:") start a new topic. */
export function parseTopics(materials) {
  const topics = [];
  materials.forEach((m) => {
    let cur = null;
    const open = (title) => { cur = { id: `${m.id}-${topics.length}`, title, text: "", material: m.name }; topics.push(cur); };
    m.text.split("\n").forEach((line) => {
      const l = line.trim();
      if (!l) return;
      if (/^#{1,3}\s+/.test(l) || /^[A-Z][^.!?]{2,60}:$/.test(l)) open(l.replace(/^#+\s*|:$/g, ""));
      else { if (!cur) open(m.name.replace(/\.[^.]+$/, "")); cur.text += ` ${l}`; }
    });
  });
  return topics.map((t) => ({ ...t, sentences: sentencesOf(t.text) })).filter((t) => t.sentences.length >= 2);
}

/* Fill-in-the-blank multiple choice questions from the chosen topics. */
export function makeQuestions(allTopics, topicIds, count) {
  const pool = [...new Set(allTopics.flatMap((t) => t.sentences.map(keyOf).filter(Boolean)).map((w) => w.toLowerCase()))];
  const items = allTopics.filter((t) => topicIds.includes(t.id)).flatMap((t) => t.sentences.map((s) => ({ t, s, k: keyOf(s) })).filter((x) => x.k));
  return shuffle(items).slice(0, count).map((x, i) => {
    const answer = x.k.toLowerCase();
    return {
      id: `${x.t.id}-${i}`, topicId: x.t.id, topic: x.t.title, answer,
      q: x.s.replace(new RegExp(`\\b${x.k}\\b`, "i"), "_____"),
      options: shuffle([answer, ...shuffle(pool.filter((w) => w !== answer)).slice(0, 3)]),
    };
  });
}
