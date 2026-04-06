import { ProjectBoard, TaskPriority, TaskColumnId } from "@/lib/project-types";

type ProjectBoardViewProps = {
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

export default function ProjectBoardView({ board }: ProjectBoardViewProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-white">{board.name}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {board.description}
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {columns.map((column) => {
          const cards = board.cards.filter((card) => card.column === column.key);

          return (
            <div
              key={column.key}
              className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white">
                  {column.title}
                </h4>
                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                  {cards.length}
                </span>
              </div>

              <div className="space-y-3">
                {cards.map((card) => (
                  <article
                    key={card.id}
                    className="rounded-xl border border-slate-800 bg-slate-950 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h5 className="text-sm font-semibold text-white">
                        {card.title}
                      </h5>

                      {card.urgent && (
                        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] text-red-300">
                          urgent
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {card.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs ${priorityClasses(
                          card.priority
                        )}`}
                      >
                        {card.priority}
                      </span>

                      <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                        {card.due}
                      </span>
                    </div>
                  </article>
                ))}

                {cards.length === 0 && (
                  <div className="rounded-xl border border-dashed border-slate-800 p-4 text-sm text-slate-500">
                    Nothing here yet.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}