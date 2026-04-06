import { dailyFocus, notes, repos, tasks } from "@/lib/mock-data";

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
  const openTasks = tasks.filter((task) => task.status !== "done");
  const todayTasks = tasks.filter((task) => task.status === "today");
  const doingTasks = tasks.filter((task) => task.status === "doing");
  const pinnedRepos = repos.filter((repo) => repo.pinned);
  const pinnedNotes = notes.filter((note) => note.pinned);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Overview</h1>
        <p className="mt-2 text-slate-400">
          Your command center should tell you what matters right now.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCard("Open tasks", String(openTasks.length), "Everything not finished")}
        {statCard("Today", String(todayTasks.length), "Tasks queued for today")}
        {statCard("Doing", String(doingTasks.length), "Active work in progress")}
        {statCard("Pinned repos", String(pinnedRepos.length), "Projects in focus")}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold text-white">Daily focus</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300">{dailyFocus}</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold text-white">Pinned repos</h2>
          <div className="mt-4 space-y-3">
            {pinnedRepos.map((repo) => (
              <div
                key={repo.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{repo.name}</p>
                  <span className="text-xs text-slate-500">{repo.updated}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  {repo.issues} issues · {repo.prs} PRs
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold text-white">Top tasks</h2>
          <div className="mt-4 space-y-3">
            {openTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="font-medium text-white">{task.title}</p>
                <p className="mt-2 text-sm text-slate-400">{task.project}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-xl font-semibold text-white">Pinned notes</h2>
          <div className="mt-4 space-y-3">
            {pinnedNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-xl border border-slate-800 bg-slate-950 p-4"
              >
                <p className="font-medium text-white">{note.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">{note.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}