export type ProjectStatus = "Active" | "Planning" | "Blocked" | "Polish";

export type RepoHealth = "Healthy" | "Watch" | "Needs Attention";

export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export type TaskColumnId = "backlog" | "next" | "doing" | "done";

export type ProjectTaskCard = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  due: string;
  urgent?: boolean;
  column: TaskColumnId;
};

export type ProjectBoard = {
  id: string;
  name: string;
  description: string;
  cards: ProjectTaskCard[];
};

export type ProjectNote = {
  id: string;
  title: string;
  content: string;
  pinned?: boolean;
};

export type ProjectLink = {
  id: string;
  label: string;
  url: string;
  type: string;
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  summary: string;
  status: ProjectStatus;
  repoHealth: RepoHealth;
  repoName: string;
  focus: string;
  nextAction: string;
  blockers: string[];
  lastUpdated: string;
  boards: ProjectBoard[];
  notes: ProjectNote[];
  links: ProjectLink[];
};