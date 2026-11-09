import { useMemo, useState } from "react";
import Dock from "./components/Dock.jsx";
import Material from "./pages/Material.jsx";
import Quiz from "./pages/Quiz.jsx";
import Plan from "./pages/Plan.jsx";
import Report from "./pages/Report.jsx";
import { parseTopics } from "./utils/generator.js";
import { topicStats } from "./utils/stats.js";

export default function App() {
  const [tab, setTab] = useState("material");
  const [materials, setMaterials] = useState([]);
  const [attempts, setAttempts] = useState([]);

  const topics = useMemo(() => parseTopics(materials), [materials]);
  const stats = useMemo(() => topicStats(topics, attempts), [topics, attempts]);
  const addAttempt = (a) => setAttempts((x) => [{ id: Date.now(), when: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }), ...a }, ...x]);
  const goMaterial = () => setTab("material");

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-4xl items-center justify-between px-5 pt-6">
        <span className="font-display text-lg font-extrabold text-white">Study<span className="text-lime">Pilot</span></span>
        <span className="rounded-full border border-edge px-3 py-1 text-xs text-slate-400">{topics.length} topics · {attempts.length} tests</span>
      </header>
      <main className="mx-auto max-w-4xl px-5 pb-32 pt-8">
        {tab === "material" && <Material materials={materials} setMaterials={setMaterials} topics={topics} />}
        {tab === "practice" && <Quiz topics={topics} addAttempt={addAttempt} goMaterial={goMaterial} />}
        {tab === "mock" && <Quiz mock topics={topics} addAttempt={addAttempt} goMaterial={goMaterial} />}
        {tab === "plan" && <Plan stats={stats} topics={topics} goMaterial={goMaterial} />}
        {tab === "report" && <Report stats={stats} attempts={attempts} topics={topics} goMaterial={goMaterial} goQuiz={() => setTab("practice")} />}
      </main>
      <Dock tab={tab} setTab={setTab} />
    </div>
  );
}
