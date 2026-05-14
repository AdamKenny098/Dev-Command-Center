import Link from "next/link";

import { getRecentActivity } from "@/lib/services/project-service";
import { formatDateTime } from "@/lib/utils/date-utils";

export const dynamic = "force-dynamic";

export default function ActivityPage() {
  const activity = getRecentActivity(80);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-red-300">
          V3.4 activity trace
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">Activity</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          A cross-project feed of recent edits, task changes, note changes, link changes, and project settings updates.
        </p>
      </header>

      <section className="space-y-3">
        {activity.map(({ project, entry }) => (
          <Link
            key={`${project.id}-${entry.id}`}
            href={`/projects/${project.slug}`}
            className="block rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-red-500/30"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                {entry.type}
              </span>
              <span className="text-sm text-slate-500">{formatDateTime(entry.createdAt)}</span>
              <span className="text-sm text-slate-500">{project.name}</span>
            </div>
            <h2 className="mt-3 text-lg font-semibold text-white">{entry.summary}</h2>
            {entry.detail && (
              <p className="mt-2 text-sm leading-7 text-slate-400">{entry.detail}</p>
            )}
          </Link>
        ))}
      </section>
    </div>
  );
}
