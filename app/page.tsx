import Link from "next/link";

import ProjectCard from "@/components/ProjectCard";
import {
  Pill,
  projectStatusClasses,
  repoHealthClasses,
} from "@/components/StatusPill";
import { getDashboardSnapshot, getProjectStats } from "@/lib/services/project-service";
import { formatDateTime } from "@/lib/utils/date-utils";

export const dynamic = "force-dynamic";

function statCard(title: string, value: string, subtitle: string) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

export default function HomePage() {
  const snapshot = getDashboardSnapshot();
  const commandFocusStats = snapshot.commandFocus
    ? getProjectStats(snapshot.commandFocus)
    : undefined;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-red-300">
          V3.7 dashboard intelligence
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">Home</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          Urgent work, repo pressure, blockers, stale projects, recent activity, and the current command focus.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCard(
          "Urgent items",
          String(snapshot.urgentTasks.length),
          "Tasks that should not wait"
        )}
        {statCard(
          "Repo watch",
          String(snapshot.repoWatch.length),
          "Projects with repo health concerns"
        )}
        {statCard(
          "Blocked",
          String(snapshot.blockedProjects.length),
          "Projects with recorded blockers"
        )}
        {statCard(
          "Stale",
          String(snapshot.staleProjects.length),
          "Projects not touched in 7 days"
        )}
      </section>

      {snapshot.commandFocus && commandFocusStats && (
        <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-red-300">
                Command focus
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                {snapshot.commandFocus.name}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                {snapshot.commandFocus.focus}
              </p>
              <p className="mt-3 text-sm text-slate-400">
                Next: {snapshot.commandFocus.nextAction}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Pill className={projectStatusClasses(snapshot.commandFocus.status)}>
                {snapshot.commandFocus.status}
              </Pill>
              <Pill className={repoHealthClasses(snapshot.commandFocus.repoHealth)}>
                {snapshot.commandFocus.repoHealth}
              </Pill>
              <span className="rounded-full bg-slate-900 px-3 py-1 text-xs text-slate-300">
                {commandFocusStats.urgentCount} urgent
              </span>
            </div>
          </div>

          <Link
            href={`/projects/${snapshot.commandFocus.slug}`}
            className="mt-5 inline-flex rounded-xl border border-red-500/40 px-4 py-2 text-sm text-red-200 hover:bg-red-500/10"
          >
            Open command focus
          </Link>
        </section>
      )}

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Urgent right now</h2>
            <span className="text-xs text-slate-500">Top 6</span>
          </div>

          <div className="mt-5 space-y-3">
            {snapshot.urgentTasks.slice(0, 6).map(({ project, board, card }) => (
              <Link
                key={`${project.id}-${board.id}-${card.id}`}
                href={`/projects/${project.slug}`}
                className="block rounded-xl border border-slate-800 bg-slate-950 p-4 hover:border-red-500/30"
              >
                <p className="font-medium text-white">{card.title}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {project.name} · {board.name}
                </p>
                <p className="mt-2 text-xs text-red-300">{card.priority}</p>
              </Link>
            ))}

            {snapshot.urgentTasks.length === 0 && (
              <p className="rounded-xl border border-dashed border-slate-800 p-4 text-sm text-slate-500">
                No urgent tasks recorded.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Recent activity</h2>
            <Link href="/activity" className="text-sm text-slate-400 hover:text-red-300">
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {snapshot.recentActivity.map(({ project, entry }) => (
              <Link
                key={`${project.id}-${entry.id}`}
                href={`/projects/${project.slug}`}
                className="block rounded-xl border border-slate-800 bg-slate-950 p-4 hover:border-red-500/30"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] text-slate-400">
                    {entry.type}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatDateTime(entry.createdAt)}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium text-white">{entry.summary}</p>
                <p className="mt-1 text-xs text-slate-500">{project.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold text-white">Blocked projects</h2>
          <div className="mt-5 space-y-3">
            {snapshot.blockedProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="block rounded-xl bg-slate-950 p-4 hover:text-red-300"
              >
                <p className="font-medium text-white">{project.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {project.blockers.length} blockers
                </p>
              </Link>
            ))}
            {snapshot.blockedProjects.length === 0 && (
              <p className="text-sm text-slate-500">No blocked projects.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold text-white">Repo watch</h2>
          <div className="mt-5 space-y-3">
            {snapshot.repoWatch.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="block rounded-xl bg-slate-950 p-4 hover:text-red-300"
              >
                <p className="font-medium text-white">{project.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  {project.repoName} · {project.repoHealth}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold text-white">Stale projects</h2>
          <div className="mt-5 space-y-3">
            {snapshot.staleProjects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="block rounded-xl bg-slate-950 p-4 hover:text-red-300"
              >
                <p className="font-medium text-white">{project.name}</p>
                <p className="mt-1 text-sm text-slate-500">
                  Updated {formatDateTime(project.updatedAt)}
                </p>
              </Link>
            ))}
            {snapshot.staleProjects.length === 0 && (
              <p className="text-sm text-slate-500">No stale projects.</p>
            )}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold text-white">Current projects</h2>
          <Link href="/projects" className="text-sm text-slate-400 hover:text-red-300">
            View all
          </Link>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {snapshot.projects.slice(0, 4).map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    </div>
  );
}
