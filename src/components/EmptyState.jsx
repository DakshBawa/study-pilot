export default function EmptyState({ onGo }) {
  return (
    <div className="panel text-center">
      <p className="text-3xl" aria-hidden>📚</p>
      <p className="mt-2 font-display text-lg font-semibold text-white">Add your study material first</p>
      <p className="mb-4 mt-1 text-sm text-slate-400">Upload notes or paste text, and topics will appear here.</p>
      <button className="btn" onClick={onGo}>Go to Material</button>
    </div>
  );
}
