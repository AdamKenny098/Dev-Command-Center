import type { Project, RepoHealth, TaskPriority } from "@/lib/project-types";

export function projectStatusClasses(status: Project["status"]) {
  switch (status) {
    case "Active":
      return "border-blue-500/30 bg-blue-500/10 text-blue-300";
    case "Planning":
      return "border-violet-500/30 bg-violet-500/10 text-violet-300";
    case "Blocked":
      return "border-red-500/30 bg-red-500/10 text-red-300";
    case "Polish":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-300";
    default:
      return "border-slate-700 bg-slate-800 text-slate-300";
  }
}

export function repoHealthClasses(repoHealth: RepoHealth) {
  switch (repoHealth) {
    case "Healthy":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
    case "Watch":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
    default:
      return "border-red-500/30 bg-red-500/10 text-red-300";
  }
}

export function priorityClasses(priority: TaskPriority) {
  switch (priority) {
    case "Critical":
      return "border-red-500/30 bg-red-500/10 text-red-300";
    case "High":
      return "border-orange-500/30 bg-orange-500/10 text-orange-300";
    case "Medium":
      return "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
    default:
      return "border-slate-700 bg-slate-800 text-slate-300";
  }
}

type PillProps = {
  children: React.ReactNode;
  className?: string;
};

export function Pill({ children, className = "" }: PillProps) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs ${className}`}>
      {children}
    </span>
  );
}
