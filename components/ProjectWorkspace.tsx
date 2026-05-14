import ProjectBoardView from "@/components/ProjectBoardView";
import {
  addProjectNoteAction,
  toggleProjectNotePinnedAction,
  updateProjectFocusAction,
  updateProjectNextActionAction,
} from "../lib/actions/project-actions";
import { Project } from "@/lib/project-types";
import { getProjectStats } from "@/lib/services/project-service";

type ProjectWorkspaceProps = {
  project: Project;
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

function statCard(title: string, value: string, subtitle: string) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

export default function ProjectWorkspace({ project }: ProjectWorkspaceProps) {
  const stats = getProjectStats(project);

  return (
    <div className="space-y-6">
      <header className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">{project.name}</h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
              {project.summary}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className={`rounded-full border px-3 py-1 text-xs ${statusClasses(
                  project.status
                )}`}
              >
                {project.status}
              </span>

              <span
                className={`rounded-full border px-3 py-1 text-xs ${repoClasses(
                  project.repoHealth
                )}`}
              >
                {project.repoHealth}
              </span>

              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                {project.repoName}
              </span>

              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                Updated {project.lastUpdated}
              </span>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-950 p-5 xl:max-w-sm">
            <p className="text-sm text-slate-400">Current focus</p>

            <p className="mt-2 text-sm leading-7 text-slate-200">
              {project.focus}
            </p>

            <form action={updateProjectFocusAction} className="mt-4 flex gap-2">
              <input type="hidden" name="slug" value={project.slug} />

              <input
                name="focus"
                defaultValue={project.focus}
                className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
              />

              <button
                type="submit"
                className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-red-500/40 hover:text-red-300"
              >
                Save focus
              </button>
            </form>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCard(
          "Urgent items",
          String(stats.urgentCount),
          "Immediate pressure inside this project"
        )}

        {statCard(
          "Boards",
          String(stats.boardCount),
          "Separate work tracks for this project"
        )}

        {statCard(
          "Notes",
          String(stats.noteCount),
          "Stored context and project memory"
        )}

        {statCard(
          "Progress",
          `${stats.progress}%`,
          "Based on cards marked done"
        )}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold text-white">Overview</h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm text-slate-400">Next action</p>

              <div className="mt-2 rounded-xl bg-slate-950 p-4 text-sm text-slate-200">
                <p>{project.nextAction}</p>

                <form
                  action={updateProjectNextActionAction}
                  className="mt-4 flex gap-2"
                >
                  <input type="hidden" name="slug" value={project.slug} />

                  <input
                    name="nextAction"
                    defaultValue={project.nextAction}
                    className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
                  />

                  <button
                    type="submit"
                    className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-red-500/40 hover:text-red-300"
                  >
                    Save next
                  </button>
                </form>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-400">Blockers</p>

              <div className="mt-2 space-y-3">
                {project.blockers.length === 0 ? (
                  <div className="rounded-xl bg-slate-950 p-4 text-sm text-slate-300">
                    No blockers recorded.
                  </div>
                ) : (
                  project.blockers.map((blocker, index) => (
                    <div
                      key={index}
                      className="rounded-xl bg-slate-950 p-4 text-sm text-slate-300"
                    >
                      {blocker}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold text-white">Project links</h2>

          <div className="mt-5 space-y-3">
            {project.links.map((link) => (
              <div key={link.id} className="rounded-xl bg-slate-950 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{link.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{link.type}</p>

                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block break-all text-sm text-slate-300 hover:text-red-300"
                    >
                      {link.url}
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Boards</h2>

        <p className="text-sm text-slate-400">
          This is the important part. Boards are now inside projects, not the
          whole app.
        </p>

        {project.boards.map((board) => (
          <ProjectBoardView
            key={board.id}
            projectSlug={project.slug}
            board={board}
          />
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Project notes</h2>

        <form
          action={addProjectNoteAction}
          className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5"
        >
          <input type="hidden" name="slug" value={project.slug} />

          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
            Add note
          </h3>

          <div className="mt-4 grid gap-3">
            <input
              name="title"
              placeholder="Note title"
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
            />

            <textarea
              name="content"
              placeholder="Note content"
              rows={4}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
            />

            <label className="flex items-center gap-2 text-sm text-slate-400">
              <input name="pinned" type="checkbox" />
              Pin note
            </label>

            <button
              type="submit"
              className="w-fit rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-red-500/40 hover:text-red-300"
            >
              Add note
            </button>
          </div>
        </form>

        <div className="grid gap-4 xl:grid-cols-3">
          {project.notes.map((note) => (
            <article
              key={note.id}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">
                  {note.title}
                </h3>

                {note.pinned && (
                  <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
                    pinned
                  </span>
                )}
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300">
                {note.content}
              </p>

              <form action={toggleProjectNotePinnedAction} className="mt-4">
                <input type="hidden" name="slug" value={project.slug} />
                <input type="hidden" name="noteId" value={note.id} />

                <button
                  type="submit"
                  className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-red-500/40 hover:text-red-300"
                >
                  {note.pinned ? "Unpin note" : "Pin note"}
                </button>
              </form>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}