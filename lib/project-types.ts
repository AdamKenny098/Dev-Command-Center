export type ProjectStatus = "Active" | "Planning" | "Blocked" | "Polish" | "Archived";

export type RepoHealth = "Healthy" | "Watch" | "Needs Attention";

export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export type TaskColumnId = "backlog" | "next" | "doing" | "done";

export type ActivityType =
  | "project"
  | "task"
  | "note"
  | "link"
  | "system";

export type ProjectActivityEntry = {
  id: string;
  type: ActivityType;
  summary: string;
  detail?: string;
  createdAt: string;
};

export type ProjectTaskCard = {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  due: string;
  urgent?: boolean;
  column: TaskColumnId;
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  archived?: boolean;
  createdAt?: string;
  updatedAt?: string;
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
  updatedAt?: string;
  archived?: boolean;
  boards: ProjectBoard[];
  notes: ProjectNote[];
  links: ProjectLink[];
  activity?: ProjectActivityEntry[];
};

export type ProjectSettingsInput = {
  name: string;
  summary: string;
  status: ProjectStatus;
  repoHealth: RepoHealth;
  repoName: string;
  focus: string;
  nextAction: string;
  blockers: string[];
};

export type TaskCardInput = {
  title: string;
  description: string;
  priority: TaskPriority;
  due: string;
  urgent: boolean;
  column: TaskColumnId;
};

export type ProjectNoteInput = {
  title: string;
  content: string;
  pinned: boolean;
};

export type ProjectLinkInput = {
  label: string;
  url: string;
  type: string;
};
