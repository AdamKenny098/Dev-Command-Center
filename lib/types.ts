export type Priority = "low" | "medium" | "high" | "critical";

export type TaskStatus = "backlog" | "today" | "doing" | "done";

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  project: string;
  due: string;
  status: TaskStatus;
};

export type RepoHealth = "healthy" | "attention" | "stale";

export type Repo = {
  id: string;
  name: string;
  health: RepoHealth;
  issues: number;
  prs: number;
  updated: string;
  pinned: boolean;
};

export type Note = {
  id: string;
  title: string;
  content: string;
  pinned: boolean;
};