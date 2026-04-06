
import Link from "next/link";
import { Project } from "@/lib/project-types";
import { getProjectStats } from "@/lib/mock-projects";

type ProjectCardProps = {
  project: Project;
  expanded?: boolean;
};

function statusClasses(status: Project["status"]) {
  switch (status) {
    case "Active":
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    case "Planning":
      return "border-violet-500/30 bg-violet-500/10 text-violet-300";
    case "Blocked":
      return "border-red-500/30 bg-red-500/10 text-red-300";
    default:
      return "border-slate-700 bg-slate-800 text-slate-300";
  }
}

function repoClasses(repoHealth: Project["repoHealth"]) {
  switch (repoHealth) {
    case "Healthy":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Watch":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
    default:
      return "border-red-500/30 bg-red-500/10 text-red-300";
  }
}

export default function ProjectCard({
  project,
  expanded = false,
}: ProjectCardProps) {
  const stats = getProjectStats(project);

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">{project.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            {project.summary}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs ${statusClasses(
            project.status
          )}`}
        >
          {project.status}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span
          className={`rounded-full border px-3 py-1 text-xs ${repoClasses(
            project.repoHealth
          )}`}
        >
          {project.repoHealth}
        </span>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
          {stats.boardCount} boards
        </span>

        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
          {stats.noteCount} notes
        </span>

        {stats.urgentCount > 0 && (
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-300">
            {stats.urgentCount} urgent
          </span>
        )}
      </div>

      {expanded && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Next action</p>
            <p className="mt-2 text-sm text-slate-200">{project.nextAction}</p>
          </div>

          <div className="rounded-xl bg-slate-950 p-4">
            <p className="text-xs text-slate-500">Last updated</p>
            <p className="mt-2 text-sm text-slate-200">{project.lastUpdated}</p>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{project.repoName}</p>

        <Link
          href={`/projects/${project.slug}`}
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
        >
          Open workspace
        </Link>
      </div>
    </article>
  );
}