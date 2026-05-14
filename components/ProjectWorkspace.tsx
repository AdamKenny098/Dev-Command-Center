import ProjectActivityLog from "@/components/ProjectActivityLog";
import ProjectBoardView from "@/components/ProjectBoardView";
import {
  Pill,
  projectStatusClasses,
  repoHealthClasses,
} from "@/components/StatusPill";
import {
  addProjectLinkAction,
  addProjectNoteAction,
  archiveProjectAction,
  deleteProjectLinkAction,
  deleteProjectNoteAction,
  toggleProjectNotePinnedAction,
  updateProjectNoteAction,
  updateProjectSettingsAction,
} from "@/lib/actions/project-actions";
import type { Project, ProjectStatus, RepoHealth } from "@/lib/project-types";
import { getProjectStats } from "@/lib/services/project-service";
import { formatDateTime } from "@/lib/utils/date-utils";
import { normaliseExternalUrl } from "@/lib/utils/text-utils";

type ProjectWorkspaceProps = {
  project: Project;
};

const statuses: ProjectStatus[] = ["Active", "Planning", "Blocked", "Polish"];
const repoHealthOptions: RepoHealth[] = ["Healthy", "Watch", "Needs Attention"];

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
  const blockersText = project.blockers.join("\n");

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
              <Pill className={projectStatusClasses(project.status)}>
                {project.status}
              </Pill>
              <Pill className={repoHealthClasses(project.repoHealth)}>
                {project.repoHealth}
              </Pill>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                {project.repoName}
              </span>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                Updated {formatDateTime(project.updatedAt)}
              </span>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-slate-800 bg-slate-950 p-5 xl:max-w-sm">
            <p className="text-sm text-slate-400">Current focus</p>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              {project.focus}
            </p>
            <p className="mt-4 text-sm text-slate-400">Next action</p>
            <p className="mt-2 text-sm leading-7 text-slate-200">
              {project.nextAction}
            </p>
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
        <form
          action={updateProjectSettingsAction}
          className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
        >
          <input type="hidden" name="slug" value={project.slug} />

          <h2 className="text-xl font-semibold text-white">Project settings</h2>
          <p className="mt-2 text-sm text-slate-400">
            V3.6 project-level editing. This replaces manual JSON changes for core project metadata.
          </p>

          <div className="mt-5 grid gap-3">
            <input
              name="name"
              defaultValue={project.name}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
            />

            <textarea
              name="summary"
              defaultValue={project.summary}
              rows={3}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
            />

            <div className="grid gap-3 md:grid-cols-3">
              <select
                name="status"
                defaultValue={project.status}
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                name="repoHealth"
                defaultValue={project.repoHealth}
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
              >
                {repoHealthOptions.map((repoHealth) => (
                  <option key={repoHealth} value={repoHealth}>
                    {repoHealth}
                  </option>
                ))}
              </select>

              <input
                name="repoName"
                defaultValue={project.repoName}
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
              />
            </div>

            <input
              name="focus"
              defaultValue={project.focus}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
            />

            <input
              name="nextAction"
              defaultValue={project.nextAction}
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
            />

            <textarea
              name="blockers"
              defaultValue={blockersText}
              rows={4}
              placeholder="One blocker per line"
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
            />

            <button
              type="submit"
              className="w-fit rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-red-500/40 hover:text-red-300"
            >
              Save project settings
            </button>
          </div>
        </form>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold text-white">Project links</h2>
          <p className="mt-2 text-sm text-slate-400">
            Keep repos, docs, builds, notes, and references tied to the project.
          </p>

          <form action={addProjectLinkAction} className="mt-5 grid gap-2">
            <input type="hidden" name="slug" value={project.slug} />
            <input
              name="label"
              placeholder="Label"
              className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
            />
            <div className="grid gap-2 md:grid-cols-[1fr_8rem]">
              <input
                name="url"
                placeholder="URL"
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
              />
              <input
                name="type"
                placeholder="Type"
                defaultValue="Docs"
                className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-fit rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-red-500/40 hover:text-red-300"
            >
              Add link
            </button>
          </form>

          <div className="mt-5 space-y-3">
            {project.links.map((link) => (
              <div key={link.id} className="rounded-xl bg-slate-950 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{link.label}</p>
                    <p className="mt-1 text-sm text-slate-500">{link.type}</p>
                    <a
                      href={normaliseExternalUrl(link.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 block break-all text-sm text-slate-300 hover:text-red-300"
                    >
                      {link.url}
                    </a>
                  </div>

                  <form action={deleteProjectLinkAction}>
                    <input type="hidden" name="slug" value={project.slug} />
                    <input type="hidden" name="linkId" value={link.id} />
                    <button
                      type="submit"
                      className="text-xs text-slate-500 hover:text-red-300"
                    >
                      Remove
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Boards</h2>
        <p className="text-sm text-slate-400">
          V3.5 complete workspace editing. Tasks can be created, changed, moved, and deleted here.
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
          {project.notes
            .filter((note) => !note.archived)
            .map((note) => (
              <article
                key={note.id}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
              >
                <form action={updateProjectNoteAction} className="space-y-3">
                  <input type="hidden" name="slug" value={project.slug} />
                  <input type="hidden" name="noteId" value={note.id} />

                  <div className="flex items-center justify-between gap-3">
                    <input
                      name="title"
                      defaultValue={note.title}
                      className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-lg font-semibold text-white outline-none"
                    />
                    {note.pinned && (
                      <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
                        pinned
                      </span>
                    )}
                  </div>

                  <textarea
                    name="content"
                    defaultValue={note.content}
                    rows={5}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm leading-7 text-slate-300 outline-none"
                  />

                  <label className="flex items-center gap-2 text-sm text-slate-400">
                    <input name="pinned" type="checkbox" defaultChecked={note.pinned} />
                    Pinned
                  </label>

                  <button
                    type="submit"
                    className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 hover:border-red-500/40 hover:text-red-300"
                  >
                    Save note
                  </button>
                </form>

                <div className="mt-3 flex gap-3">
                  <form action={toggleProjectNotePinnedAction}>
                    <input type="hidden" name="slug" value={project.slug} />
                    <input type="hidden" name="noteId" value={note.id} />
                    <button
                      type="submit"
                      className="text-xs text-slate-500 hover:text-yellow-300"
                    >
                      {note.pinned ? "Unpin" : "Pin"}
                    </button>
                  </form>

                  <form action={deleteProjectNoteAction}>
                    <input type="hidden" name="slug" value={project.slug} />
                    <input type="hidden" name="noteId" value={note.id} />
                    <button
                      type="submit"
                      className="text-xs text-slate-500 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </article>
            ))}
        </div>
      </section>

      <ProjectActivityLog activity={project.activity ?? []} />

      <section className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <h2 className="text-lg font-semibold text-red-200">Archive project</h2>
        <p className="mt-2 text-sm text-slate-400">
          This hides the project from the active dashboard. The JSON record remains in place.
        </p>
        <form action={archiveProjectAction} className="mt-4">
          <input type="hidden" name="slug" value={project.slug} />
          <button
            type="submit"
            className="rounded-xl border border-red-500/40 px-4 py-2 text-sm text-red-200 hover:bg-red-500/10"
          >
            Archive project
          </button>
        </form>
      </section>
    </div>
  );
}
