import { repos } from "@/lib/mock-data";

function healthClasses(health: "healthy" | "attention" | "stale") {
  switch (health) {
    case "healthy":
      return "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30";
    case "attention":
      return "bg-orange-500/10 text-orange-300 border border-orange-500/30";
    default:
      return "bg-slate-800 text-slate-300 border border-slate-700";
  }
}

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <p className="mt-2 text-slate-400">
          Repo visibility belongs here. Later this gets real GitHub data.
        </p>
      </header>

      <div className="grid gap-4 xl:grid-cols-2">
        {repos.map((repo) => (
          <article
            key={repo.id}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-white">{repo.name}</h2>
              <span className={`rounded-full px-3 py-1 text-xs ${healthClasses(repo.health)}`}>
                {repo.health}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-slate-500">Issues</p>
                <p className="mt-2 text-xl font-semibold text-white">{repo.issues}</p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-slate-500">PRs</p>
                <p className="mt-2 text-xl font-semibold text-white">{repo.prs}</p>
              </div>

              <div className="rounded-xl bg-slate-950 p-4">
                <p className="text-slate-500">Updated</p>
                <p className="mt-2 text-sm font-semibold text-white">{repo.updated}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}