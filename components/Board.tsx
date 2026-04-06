import { boardColumns } from "@/lib/mock-data";
import { Priority, Task, TaskStatus } from "@/lib/types";

type BoardProps = {
  tasks: Task[];
};

function priorityClasses(priority: Priority) {
  switch (priority) {
    case "critical":
      return "border-red-500/30 bg-red-500/10 text-red-300";
    case "high":
      return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    case "medium":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
    default:
      return "border-slate-700 bg-slate-800 text-slate-300";
  }
}

export default function Board({ tasks }: BoardProps) {
  const grouped: Record<TaskStatus, Task[]> = {
    backlog: [],
    today: [],
    doing: [],
    done: [],
  };

  for (const task of tasks) {
    grouped[task.status].push(task);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-4">
      {boardColumns.map((column) => (
        <section
          key={column.key}
          className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-white">{column.title}</h2>
            <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
              {grouped[column.key].length}
            </span>
          </div>

          <div className="space-y-3">
            {grouped[column.key].map((task) => (
              <article
                key={task.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <h3 className="text-sm font-semibold text-white">{task.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {task.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${priorityClasses(
                      task.priority
                    )}`}
                  >
                    {task.priority}
                  </span>

                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                    {task.project}
                  </span>

                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">
                    {task.due}
                  </span>
                </div>
              </article>
            ))}

            {grouped[column.key].length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-800 p-4 text-sm text-slate-500">
                No tasks here yet.
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  );
}