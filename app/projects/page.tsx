import ProjectCard from "@/components/ProjectCard";
import { createProjectAction } from "@/lib/actions/project-actions";
import { getAllProjects, getBlockedProjects, getRepoWatchProjects } from "@/lib/services/project-service";

export const dynamic = "force-dynamic";

export default function ProjectsPage() {
  const projects = getAllProjects();
  const blockedProjects = getBlockedProjects();
  const repoWatch = getRepoWatchProjects();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-red-300">
          V3.6 project management
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">Projects</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          Create projects, open workspaces, and keep project-level settings out of manual JSON edits.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Active projects</p>
          <p className="mt-2 text-3xl font-bold text-white">{projects.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Blocked</p>
          <p className="mt-2 text-3xl font-bold text-white">{blockedProjects.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-400">Repo watch</p>
          <p className="mt-2 text-3xl font-bold text-white">{repoWatch.length}</p>
        </div>
      </section>

      <form
        action={createProjectAction}
        className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
      >
        <h2 className="text-xl font-semibold text-white">Create project</h2>
        <p className="mt-2 text-sm text-slate-400">
          This creates a real local project record in data/projects.json with a default command board.
        </p>

        <div className="mt-5 grid gap-3 xl:grid-cols-[16rem_1fr_16rem_auto]">
          <input
            name="name"
            placeholder="Project name"
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
          />
          <input
            name="summary"
            placeholder="Project summary"
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
          />
          <input
            name="repoName"
            placeholder="Repo name"
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
          />
          <button
            type="submit"
            className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-red-500/40 hover:text-red-300"
          >
            Create
          </button>
        </div>
      </form>

      <section className="space-y-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} expanded />
        ))}
      </section>
    </div>
  );
}
