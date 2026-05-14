import { moveTaskColumnAction } from "@/lib/actions/project-actions";
import { ProjectBoard, TaskColumnId, TaskPriority } from "@/lib/project-types";

type ProjectBoardViewProps = {
  projectSlug: string;
  board: ProjectBoard;
};

const columns: { key: TaskColumnId; title: string }[] = [
  { key: "backlog", title: "Backlog" },
  { key: "next", title: "Next" },
  { key: "doing", title: "Doing" },
  { key: "done", title: "Done" },
];

function priorityClasses(priority: TaskPriority) {
  switch (priority) {
    case "Critical":
      return "border-red-500/30 bg-red-500/10 text-red-300";
    case "High":
      return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    case "Medium":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
    default:
      return "border-slate-700 bg-slate-800 text-slate-300";
  }
}

export default function ProjectBoardView({
  projectSlug,
  board,
}: ProjectBoardViewProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <div>
        <h3 className="text-lg font-semibold text-slate-100">{board.name}</h3>
        <p className="mt-1 text-sm text-slate-400">{board.description}</p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-4">
        {columns.map((column) => {
          const cards = board.cards.filter((card) => card.column === column.key);

          return (
            <div
              key={column.key}
              className="rounded-xl border border-slate-800 bg-black/20 p-3"
            >
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-200">
                  {column.title}
                </h4>
                <span className="rounded-full border border-slate-700 px-2 py-0.5 text-xs text-slate-400">
                  {cards.length}
                </span>
              </div>

              <div className="space-y-3">
                {cards.map((card) => (
                  <article
                    key={card.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h5 className="text-sm font-semibold text-slate-100">
                        {card.title}
                      </h5>

                      {card.urgent && (
                        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-red-300">
                          urgent
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      {card.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] ${priorityClasses(
                          card.priority
                        )}`}
                      >
                        {card.priority}
                      </span>

                      <span className="text-xs text-slate-500">
                        Due: {card.due}
                      </span>
                    </div>

                    <form action={moveTaskColumnAction} className="mt-3 flex gap-2">
                      <input type="hidden" name="slug" value={projectSlug} />
                      <input type="hidden" name="boardId" value={board.id} />
                      <input type="hidden" name="cardId" value={card.id} />

                      <select
                        name="column"
                        defaultValue={card.column}
                        className="min-w-0 flex-1 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-300 outline-none"
                      >
                        {columns.map((option) => (
                          <option key={option.key} value={option.key}>
                            {option.title}
                          </option>
                        ))}
                      </select>

                      <button
                        type="submit"
                        className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-red-500/40 hover:text-red-300"
                      >
                        Move
                      </button>
                    </form>
                  </article>
                ))}

                {cards.length === 0 && (
                  <p className="rounded-xl border border-dashed border-slate-800 p-3 text-xs text-slate-500">
                    Nothing here yet.
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}