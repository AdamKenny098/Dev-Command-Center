import Link from "next/link";

import { getAllNotes, getPinnedNotes } from "@/lib/services/project-service";
import { formatDateTime } from "@/lib/utils/date-utils";

export const dynamic = "force-dynamic";

export default function NotesPage() {
  const pinnedNotes = getPinnedNotes();
  const allNotes = getAllNotes();

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.35em] text-red-300">
          Project memory
        </p>
        <h1 className="mt-3 text-4xl font-bold text-white">Notes</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
          Pinned memory first, then every active project note. Notes remain edited inside their project workspace.
        </p>
      </header>

      <section>
        <h2 className="text-2xl font-semibold text-white">Pinned notes</h2>
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          {pinnedNotes.map(({ project, note }) => (
            <Link
              key={`${project.id}-${note.id}`}
              href={`/projects/${project.slug}`}
              className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-5 hover:border-yellow-500/40"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-yellow-300">
                {project.name}
              </p>
              <h3 className="mt-3 text-lg font-semibold text-white">{note.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{note.content}</p>
              <p className="mt-4 text-xs text-slate-500">
                Updated {formatDateTime(note.updatedAt)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-white">All notes</h2>
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          {allNotes.map(({ project, note }) => (
            <Link
              key={`${project.id}-${note.id}`}
              href={`/projects/${project.slug}`}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-5 hover:border-red-500/30"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                {project.name}
              </p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-white">{note.title}</h3>
                {note.pinned && (
                  <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
                    pinned
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">{note.content}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
