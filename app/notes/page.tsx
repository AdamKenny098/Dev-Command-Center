import { notes } from "@/lib/mock-data";

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Notes</h1>
        <p className="mt-2 text-slate-400">
          Keep this simple. Notes should support execution, not turn into a second app.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-3">
        {notes.map((note) => (
          <article
            key={note.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">{note.title}</h2>
              {note.pinned && (
                <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs text-yellow-300">
                  pinned
                </span>
              )}
            </div>

            <p className="mt-4 text-sm leading-7 text-slate-300">{note.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}