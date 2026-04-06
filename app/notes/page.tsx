import Link from "next/link";
import { getPinnedNotes } from "@/lib/mock-projects";

export default function NotesPage() {
  const pinnedNotes = getPinnedNotes();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Notes</h1>
        <p className="mt-2 text-slate-400">
          Pinned notes pulled from across your projects.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-3">
        {pinnedNotes.map(({ project, note }) => (
          <article
            key={note.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">{note.title}</h2>

              <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
                pinned
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-500">{project.name}</p>

            <p className="mt-4 text-sm leading-7 text-slate-300">
              {note.content}
            </p>

            <div className="mt-4">
              <Link
                href={`/projects/${project.slug}`}
                className="text-sm font-medium text-slate-300 transition hover:text-white"
              >
                Open project
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}