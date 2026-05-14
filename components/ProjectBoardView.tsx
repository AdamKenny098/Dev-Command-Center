import {
  createTaskCardAction,
  deleteTaskCardAction,
  updateTaskCardAction,
} from "@/lib/actions/project-actions";
import type {
  ProjectBoard,
  TaskColumnId,
  TaskPriority,
} from "@/lib/project-types";
import { priorityClasses } from "@/components/StatusPill";

const columns: { key: TaskColumnId; title: string }[] = [
  { key: "backlog", title: "Backlog" },
  { key: "next", title: "Next" },
  { key: "doing", title: "Doing" },
  { key: "done", title: "Done" },
];

const priorities: TaskPriority[] = ["Low", "Medium", "High", "Critical"];

type ProjectBoardViewProps = {
  projectSlug: string;
  board: ProjectBoard;
};

export default function ProjectBoardView({
  projectSlug,
  board,
}: ProjectBoardViewProps) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">{board.name}</h3>
          <p className="mt-1 text-sm text-slate-400">{board.description}</p>
        </div>

        <form
          action={createTaskCardAction}
          className="rounded-xl border border-slate-800 bg-slate-900 p-4 xl:w-[26rem]"
        >
          <input type="hidden" name="slug" value={projectSlug} />
          <input type="hidden" name="boardId" value={board.id} />

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
            Create task
          </p>

          <div className="mt-3 grid gap-2">
            <input
              name="title"
              placeholder="Task title"
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
            />
            <textarea
              name="description"
              placeholder="Task description"
              rows={2}
              className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
            />
            <div className="grid gap-2 md:grid-cols-3">
              <select
                name="priority"
                defaultValue="Medium"
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
              >
                {priorities.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
              <select
                name="column"
                defaultValue="backlog"
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
              >
                {columns.map((column) => (
                  <option key={column.key} value={column.key}>
                    {column.title}
                  </option>
                ))}
              </select>
              <input
                name="due"
                placeholder="Due"
                defaultValue="Later"
                className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input name="urgent" type="checkbox" />
              Mark urgent
            </label>
            <button
              type="submit"
              className="w-fit rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:border-red-500/40 hover:text-red-300"
            >
              Add task
            </button>
          </div>
        </form>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-4">
        {columns.map((column) => {
          const cards = board.cards.filter(
            (card) => card.column === column.key && !card.archived
          );

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
                    <form action={updateTaskCardAction} className="space-y-3">
                      <input type="hidden" name="slug" value={projectSlug} />
                      <input type="hidden" name="boardId" value={board.id} />
                      <input type="hidden" name="cardId" value={card.id} />

                      <div className="flex items-start justify-between gap-3">
                        <input
                          name="title"
                          defaultValue={card.title}
                          className="min-w-0 flex-1 rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-sm font-semibold text-slate-100 outline-none"
                        />
                        {card.urgent && (
                          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-red-300">
                            urgent
                          </span>
                        )}
                      </div>

                      <textarea
                        name="description"
                        defaultValue={card.description}
                        rows={3}
                        className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs leading-5 text-slate-400 outline-none"
                      />

                      <div className="grid gap-2">
                        <select
                          name="priority"
                          defaultValue={card.priority}
                          className={`rounded-lg border px-2 py-1 text-xs outline-none ${priorityClasses(
                            card.priority
                          )}`}
                        >
                          {priorities.map((priority) => (
                            <option key={priority} value={priority}>
                              {priority}
                            </option>
                          ))}
                        </select>

                        <select
                          name="column"
                          defaultValue={card.column}
                          className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-300 outline-none"
                        >
                          {columns.map((option) => (
                            <option key={option.key} value={option.key}>
                              {option.title}
                            </option>
                          ))}
                        </select>

                        <input
                          name="due"
                          defaultValue={card.due}
                          className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs text-slate-300 outline-none"
                        />
                      </div>

                      <label className="flex items-center gap-2 text-xs text-slate-400">
                        <input
                          name="urgent"
                          type="checkbox"
                          defaultChecked={card.urgent}
                        />
                        Urgent
                      </label>

                      <button
                        type="submit"
                        className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-red-500/40 hover:text-red-300"
                      >
                        Save task
                      </button>
                    </form>

                    <form action={deleteTaskCardAction} className="mt-2">
                      <input type="hidden" name="slug" value={projectSlug} />
                      <input type="hidden" name="boardId" value={board.id} />
                      <input type="hidden" name="cardId" value={card.id} />
                      <button
                        type="submit"
                        className="text-xs text-slate-500 hover:text-red-300"
                      >
                        Delete task
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
