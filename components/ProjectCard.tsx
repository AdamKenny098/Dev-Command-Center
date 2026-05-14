import Link from "next/link";

import { Pill, projectStatusClasses, repoHealthClasses } from "@/components/StatusPill";
import type { Project } from "@/lib/project-types";
import { getProjectStats } from "@/lib/services/project-service";
import { formatDateTime } from "@/lib/utils/date-utils";

type ProjectCardProps = {
  project: Project;
  expanded?: boolean;
};

export default function ProjectCard({
  project,
  expanded = false,
}: ProjectCardProps) {
  const stats = getProjectStats(project);

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-sm shadow-black/20">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">{project.name}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            {project.summary}
          </p>
        </div>

        <Link
          href={`/projects/${project.slug}`}
          className="w-fit rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-red-500/40 hover:text-red-300"
        >
          Open workspace
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Pill className={projectStatusClasses(project.status)}>
          {project.status}
        </Pill>
        <Pill className={repoHealthClasses(project.repoHealth)}>
          {project.repoHealth}
        </Pill>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
          {stats.boardCount} boards
        </span>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
          {stats.noteCount} notes
        </span>
        {stats.urgentCount > 0 && (
          <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-300">
            {stats.urgentCount} urgent
          </span>
        )}
      </div>

      {expanded && (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Current focus
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {project.focus}
            </p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Next action
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {project.nextAction}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
        <span className="text-xs text-slate-500">{project.repoName}</span>
        <span className="text-xs text-slate-500">
          Updated {formatDateTime(project.updatedAt)}
        </span>
      </div>
    </article>
  );
}
