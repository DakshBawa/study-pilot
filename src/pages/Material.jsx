import { useState } from "react";
import PageHeader from "../components/PageHeader.jsx";
import { SAMPLE } from "../data/sample.js";

export default function Material({ materials, setMaterials, topics }) {
  const [paste, setPaste] = useState("");
  const [note, setNote] = useState("");
  const add = (name, text) => setMaterials((m) => [...m, { id: `m${Date.now()}${m.length}`, name, text }]);

  const readFiles = (files) => {
    [...files].forEach((f) => {
      if (!/\.(txt|md)$/i.test(f.name)) { setNote(`${f.name}: only .txt and .md files can be read for now. Paste the text instead.`); return; }
      const r = new FileReader();
      r.onload = () => { add(f.name, String(r.result)); setNote(""); };
      r.readAsText(f);
    });
  };

  return (
    <>
      <PageHeader eyebrow="Step 1" title="Study material" sub="Add your notes. Use headings like “# Topic name” so each topic is detected separately." />
      <div className="grid gap-5 md:grid-cols-2">
        <section className="panel space-y-3">
          <label onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); readFiles(e.dataTransfer.files); }}
            className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-edge p-8 text-center hover:border-violet-400">
            <span className="text-3xl" aria-hidden>⬆️</span>
            <span className="mt-2 text-sm font-medium text-white">Drop a .txt or .md file, or click to browse</span>
            <input type="file" accept=".txt,.md" multiple className="sr-only" onChange={(e) => readFiles(e.target.files)} />
          </label>
          {note && <p role="status" className="text-sm text-amber">{note}</p>}
          <textarea className="input" rows={5} placeholder="…or paste your notes here" value={paste} onChange={(e) => setPaste(e.target.value)} aria-label="Paste notes" />
          <div className="flex gap-2">
            <button className="btn" disabled={!paste.trim()} onClick={() => { add("Pasted notes", paste); setPaste(""); }}>Add notes</button>
            <button className="btn-alt" onClick={() => add("Sample: Operating Systems", SAMPLE)}>Try sample</button>
          </div>
        </section>

        <section className="panel">
          <h2 className="mb-3 font-display font-semibold text-white">Detected topics ({topics.length})</h2>
          {topics.length === 0 && <p className="text-sm text-slate-400">Nothing yet. Add material to see topics here.</p>}
          <ul className="space-y-2">
            {topics.map((t) => (
              <li key={t.id} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-sm">
                <span className="font-medium text-white">{t.title}</span>
                <span className="text-xs text-slate-400">{t.sentences.length} key facts</span>
              </li>
            ))}
          </ul>
          {materials.length > 0 && (
            <div className="mt-4 border-t border-edge pt-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Files</p>
              {materials.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-1 text-sm">
                  <span className="truncate">{m.name}</span>
                  <button className="text-xs text-coral hover:underline" onClick={() => setMaterials((x) => x.filter((y) => y.id !== m.id))}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
