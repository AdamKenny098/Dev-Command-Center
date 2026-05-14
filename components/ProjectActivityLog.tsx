import type { ProjectActivityEntry } from "@/lib/project-types";
import { formatDateTime } from "@/lib/utils/date-utils";

const typeClasses: Record<ProjectActivityEntry["type"], string> = {
  project: "border-blue-500/30 bg-blue-500/10 text-blue-300",
  task: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  note: "border-yellow-500/30 bg-yellow-500/10 text-yellow-300",
  link: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
  system: "border-slate-700 bg-slate-800 text-slate-300",
};

type ProjectActivityLogProps = {
  activity: ProjectActivityEntry[];
  limit?: number;
};

export default function ProjectActivityLog({
  activity,
  limit = 10,
}: ProjectActivityLogProps) {
  const visibleActivity = [...activity]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div>
        <h2 className="text-xl font-semibold text-white">Activity trace</h2>
        <p className="mt-2 text-sm text-slate-400">
          V3.4 trace layer. Every important workspace edit records what changed.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {visibleActivity.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-800 p-4 text-sm text-slate-500">
            No activity recorded yet.
          </p>
        ) : (
          visibleActivity.map((entry) => (
            <article
              key={entry.id}
              className="rounded-xl border border-slate-800 bg-slate-950 p-4"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] ${typeClasses[entry.type]}`}
                >
                  {entry.type}
                </span>
                <span className="text-xs text-slate-500">
                  {formatDateTime(entry.createdAt)}
                </span>
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-100">
                {entry.summary}
              </p>

              {entry.detail && (
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {entry.detail}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
