import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import {
  getAllProjects,
  getNextTasks,
  getRepoWatchProjects,
  getUrgentTasks,
} from "../lib/data/project-service"

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
  const projects = getAllProjects();
  const urgentItems = getUrgentTasks().slice(0, 6);
  const nextItems = getNextTasks().slice(0, 6);
  const repoWatch = getRepoWatchProjects();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Home</h1>
        <p className="mt-2 text-slate-400">
          Urgent things, repo health, next actions, and your current projects.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCard("Urgent items", String(urgentItems.length), "Things that should not wait")}
        {statCard("Repo watch", String(repoWatch.length), "Projects with repo health concerns")}
        {statCard("Next tasks", String(nextItems.length), "Work ready to be pulled")}
        {statCard("Current projects", String(projects.length), "Everything active right now")}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold text-white">Urgent right now</h2>

          <div className="mt-4 space-y-3">
            {urgentItems.map(({ project, board, card }) => (
              <Link
                key={card.id}
                href={`/projects/${project.slug}`}
                className="block rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{card.title}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {project.name} · {board.name}
                    </p>
                  </div>

                  <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs text-red-300">
                    {card.priority}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold text-white">Repo watch</h2>

          <div className="mt-4 space-y-3">
            {repoWatch.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="block rounded-xl border border-slate-800 bg-slate-950 p-4 transition hover:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{project.name}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {project.repoName} · updated {project.lastUpdated}
                    </p>
                  </div>

                  <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
                    {project.repoHealth}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-white">Current projects</h2>

            <Link
              href="/projects"
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              View all
            </Link>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold text-white">Next things to do</h2>

          <div className="mt-4 space-y-3">
            {nextItems.map(({ project, board, card }) => (
              <div
                key={card.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="font-medium text-white">{card.title}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {project.name} · {board.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}