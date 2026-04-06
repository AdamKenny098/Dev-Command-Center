import Board from "@/components/Board";
import { tasks } from "@/lib/mock-data";

export default function BoardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Board</h1>
        <p className="mt-2 text-slate-400">
          This is the core of the app. Everything else supports this.
        </p>
      </header>

      <Board tasks={tasks} />
    </div>
  );
}