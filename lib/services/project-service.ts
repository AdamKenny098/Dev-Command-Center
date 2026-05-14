import "server-only";

import { randomUUID } from "node:crypto";

import type {
  ActivityType,
  Project,
  ProjectActivityEntry,
  ProjectBoard,
  ProjectLinkInput,
  ProjectNote,
  ProjectNoteInput,
  ProjectSettingsInput,
  ProjectStatus,
  ProjectTaskCard,
  RepoHealth,
  TaskCardInput,
  TaskColumnId,
  TaskPriority,
} from "@/lib/project-types";
import {
  readProjects,
  writeProjects,
} from "@/lib/repositories/project-repository";
import { isOlderThanDays, nowIso } from "@/lib/utils/date-utils";
import { slugify } from "@/lib/utils/text-utils";

export type ProjectStats = {
  boardCount: number;
  noteCount: number;
  urgentCount: number;
  totalCards: number;
  doneCount: number;
  progress: number;
  blocked: boolean;
};

export type ProjectTaskResult = {
  project: Project;
  board: ProjectBoard;
  card: ProjectTaskCard;
};

export type PinnedProjectNoteResult = {
  project: Project;
  note: ProjectNote;
};

export type RecentActivityResult = {
  project: Project;
  entry: ProjectActivityEntry;
};

export type DashboardSnapshot = {
  projects: Project[];
  commandFocus: Project | undefined;
  urgentTasks: ProjectTaskResult[];
  nextTasks: ProjectTaskResult[];
  repoWatch: Project[];
  blockedProjects: Project[];
  staleProjects: Project[];
  recentActivity: RecentActivityResult[];
};

const VALID_COLUMNS: TaskColumnId[] = ["backlog", "next", "doing", "done"];
const VALID_PRIORITIES: TaskPriority[] = ["Low", "Medium", "High", "Critical"];
const VALID_STATUSES: ProjectStatus[] = [
  "Active",
  "Planning",
  "Blocked",
  "Polish",
  "Archived",
];
const VALID_REPO_HEALTH: RepoHealth[] = [
  "Healthy",
  "Watch",
  "Needs Attention",
];

export function getAllProjects(): Project[] {
  return readProjects().filter((project) => !project.archived);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return readProjects().find(
    (project) => project.slug === slug && !project.archived
  );
}

export function getProjectStats(project: Project): ProjectStats {
  const allCards = getProjectCards(project);
  const activeCards = allCards.filter((card) => !card.archived);

  const urgentCount = activeCards.filter(
    (card) => card.urgent && card.column !== "done"
  ).length;

  const doneCount = activeCards.filter((card) => card.column === "done").length;

  const progress =
    activeCards.length === 0
      ? 0
      : Math.round((doneCount / activeCards.length) * 100);

  return {
    boardCount: project.boards.length,
    noteCount: project.notes.filter((note) => !note.archived).length,
    urgentCount,
    totalCards: activeCards.length,
    doneCount,
    progress,
    blocked: project.status === "Blocked" || project.blockers.length > 0,
  };
}

export function getDashboardSnapshot(): DashboardSnapshot {
  const projects = getAllProjects();
  const urgentTasks = getUrgentTasks();
  const nextTasks = getNextTasks();
  const repoWatch = getRepoWatchProjects();
  const blockedProjects = getBlockedProjects();
  const staleProjects = getStaleProjects();
  const recentActivity = getRecentActivity(8);

  return {
    projects,
    commandFocus: selectCommandFocus(projects),
    urgentTasks,
    nextTasks,
    repoWatch,
    blockedProjects,
    staleProjects,
    recentActivity,
  };
}

export function getUrgentTasks(): ProjectTaskResult[] {
  return getAllProjects().flatMap((project) =>
    project.boards.flatMap((board) =>
      board.cards
        .filter(
          (card) => card.urgent && card.column !== "done" && !card.archived
        )
        .map((card) => ({
          project,
          board,
          card,
        }))
    )
  );
}

export function getNextTasks(): ProjectTaskResult[] {
  return getAllProjects().flatMap((project) =>
    project.boards.flatMap((board) =>
      board.cards
        .filter((card) => card.column === "next" && !card.archived)
        .map((card) => ({
          project,
          board,
          card,
        }))
    )
  );
}

export function getRepoWatchProjects(): Project[] {
  return getAllProjects().filter((project) => project.repoHealth !== "Healthy");
}

export function getBlockedProjects(): Project[] {
  return getAllProjects().filter(
    (project) => project.status === "Blocked" || project.blockers.length > 0
  );
}

export function getStaleProjects(days = 7): Project[] {
  return getAllProjects().filter((project) =>
    isOlderThanDays(project.updatedAt, days)
  );
}

export function getPinnedNotes(): PinnedProjectNoteResult[] {
  return getAllProjects().flatMap((project) =>
    project.notes
      .filter((note) => note.pinned && !note.archived)
      .map((note) => ({
        project,
        note,
      }))
  );
}

export function getAllNotes(): PinnedProjectNoteResult[] {
  return getAllProjects().flatMap((project) =>
    project.notes
      .filter((note) => !note.archived)
      .map((note) => ({
        project,
        note,
      }))
  );
}

export function getRecentActivity(limit = 12): RecentActivityResult[] {
  return getAllProjects()
    .flatMap((project) =>
      (project.activity ?? []).map((entry) => ({
        project,
        entry,
      }))
    )
    .sort(
      (a, b) =>
        new Date(b.entry.createdAt).getTime() -
        new Date(a.entry.createdAt).getTime()
    )
    .slice(0, limit);
}

export function createProject(input: {
  name: string;
  summary: string;
  repoName: string;
}): string {
  const name = requireText(input.name, "Project name");
  const summary = requireText(input.summary, "Project summary");
  const repoName = requireText(input.repoName, "Repository name");
  const projects = readProjects();
  const slug = uniqueSlug(slugify(name), projects);
  const now = nowIso();

  const newProject: Project = {
    id: randomUUID(),
    name,
    slug,
    summary,
    status: "Planning",
    repoHealth: "Watch",
    repoName,
    focus: "Define the project focus.",
    nextAction: "Add the first concrete next action.",
    blockers: [],
    lastUpdated: "Just now",
    updatedAt: now,
    archived: false,
    boards: [
      {
        id: randomUUID(),
        name: "Command Board",
        description: "Default board for the project workspace.",
        cards: [],
      },
    ],
    notes: [],
    links: [],
    activity: [
      createActivity("project", "Created project workspace", summary),
    ],
  };

  writeProjects([newProject, ...projects]);
  return slug;
}

export function updateProjectSettings(
  slug: string,
  input: ProjectSettingsInput
): void {
  const name = requireText(input.name, "Project name");
  const summary = requireText(input.summary, "Project summary");
  const repoName = requireText(input.repoName, "Repository name");
  const focus = requireText(input.focus, "Project focus");
  const nextAction = requireText(input.nextAction, "Next action");
  const status = requireStatus(input.status);
  const repoHealth = requireRepoHealth(input.repoHealth);

  updateProject(
    slug,
    (project) => ({
      ...project,
      name,
      summary,
      status,
      repoHealth,
      repoName,
      focus,
      nextAction,
      blockers: input.blockers,
    }),
    {
      type: "project",
      summary: "Updated project settings",
      detail: `${name} settings were changed.`,
    }
  );
}

export function archiveProject(slug: string): void {
  updateProject(
    slug,
    (project) => ({
      ...project,
      status: "Archived",
      archived: true,
    }),
    {
      type: "project",
      summary: "Archived project",
      detail: "The project was hidden from active dashboard views.",
    },
    { includeArchived: true }
  );
}

export function updateProjectFocus(slug: string, focus: string): void {
  const cleanFocus = requireText(focus, "Project focus");

  updateProject(
    slug,
    (project) => ({
      ...project,
      focus: cleanFocus,
    }),
    {
      type: "project",
      summary: "Updated current focus",
      detail: cleanFocus,
    }
  );
}

export function updateProjectNextAction(
  slug: string,
  nextAction: string
): void {
  const cleanNextAction = requireText(nextAction, "Next action");

  updateProject(
    slug,
    (project) => ({
      ...project,
      nextAction: cleanNextAction,
    }),
    {
      type: "project",
      summary: "Updated next action",
      detail: cleanNextAction,
    }
  );
}

export function createTaskCard(
  slug: string,
  boardId: string,
  input: TaskCardInput
): void {
  const cardInput = cleanTaskInput(input);
  const now = nowIso();

  updateProject(
    slug,
    (project) => ({
      ...project,
      boards: project.boards.map((board) => {
        if (board.id !== boardId) return board;

        return {
          ...board,
          cards: [
            {
              id: randomUUID(),
              ...cardInput,
              archived: false,
              createdAt: now,
              updatedAt: now,
            },
            ...board.cards,
          ],
        };
      }),
    }),
    {
      type: "task",
      summary: `Created task: ${cardInput.title}`,
      detail: `${cardInput.priority} priority task added to ${cardInput.column}.`,
    }
  );
}

export function updateTaskCard(
  slug: string,
  boardId: string,
  cardId: string,
  input: TaskCardInput
): void {
  const cardInput = cleanTaskInput(input);

  updateProject(
    slug,
    (project) => ({
      ...project,
      boards: project.boards.map((board) => {
        if (board.id !== boardId) return board;

        return {
          ...board,
          cards: board.cards.map((card) => {
            if (card.id !== cardId) return card;

            return {
              ...card,
              ...cardInput,
              updatedAt: nowIso(),
            };
          }),
        };
      }),
    }),
    {
      type: "task",
      summary: `Updated task: ${cardInput.title}`,
      detail: `Column: ${cardInput.column}. Priority: ${cardInput.priority}.`,
    }
  );
}

export function moveTaskCard(
  slug: string,
  boardId: string,
  cardId: string,
  column: TaskColumnId
): void {
  const cleanColumn = requireColumn(column);
  const target = findTask(slug, boardId, cardId);
  const taskTitle = target?.card.title ?? "Task";
  const oldColumn = target?.card.column ?? "unknown";

  updateProject(
    slug,
    (project) => ({
      ...project,
      boards: project.boards.map((board) => {
        if (board.id !== boardId) return board;

        return {
          ...board,
          cards: board.cards.map((card) => {
            if (card.id !== cardId) return card;

            return {
              ...card,
              column: cleanColumn,
              updatedAt: nowIso(),
            };
          }),
        };
      }),
    }),
    {
      type: "task",
      summary: `Moved task: ${taskTitle}`,
      detail: `${oldColumn} to ${cleanColumn}.`,
    }
  );
}

export function deleteTaskCard(
  slug: string,
  boardId: string,
  cardId: string
): void {
  const target = findTask(slug, boardId, cardId);
  const taskTitle = target?.card.title ?? "Task";

  updateProject(
    slug,
    (project) => ({
      ...project,
      boards: project.boards.map((board) => {
        if (board.id !== boardId) return board;

        return {
          ...board,
          cards: board.cards.filter((card) => card.id !== cardId),
        };
      }),
    }),
    {
      type: "task",
      summary: `Deleted task: ${taskTitle}`,
      detail: "The task was removed from the board.",
    }
  );
}

export function addProjectNote(
  slug: string,
  input: ProjectNoteInput
): void {
  const noteInput = cleanNoteInput(input);
  const now = nowIso();

  updateProject(
    slug,
    (project) => ({
      ...project,
      notes: [
        {
          id: randomUUID(),
          ...noteInput,
          archived: false,
          createdAt: now,
          updatedAt: now,
        },
        ...project.notes,
      ],
    }),
    {
      type: "note",
      summary: `Added note: ${noteInput.title}`,
      detail: noteInput.pinned ? "The note was pinned." : undefined,
    }
  );
}

export function updateProjectNote(
  slug: string,
  noteId: string,
  input: ProjectNoteInput
): void {
  const noteInput = cleanNoteInput(input);

  updateProject(
    slug,
    (project) => ({
      ...project,
      notes: project.notes.map((note) => {
        if (note.id !== noteId) return note;

        return {
          ...note,
          ...noteInput,
          updatedAt: nowIso(),
        };
      }),
    }),
    {
      type: "note",
      summary: `Updated note: ${noteInput.title}`,
      detail: noteInput.pinned ? "Pinned note." : "Unpinned note.",
    }
  );
}

export function deleteProjectNote(slug: string, noteId: string): void {
  const target = findNote(slug, noteId);
  const noteTitle = target?.title ?? "Note";

  updateProject(
    slug,
    (project) => ({
      ...project,
      notes: project.notes.filter((note) => note.id !== noteId),
    }),
    {
      type: "note",
      summary: `Deleted note: ${noteTitle}`,
      detail: "The note was removed from the workspace.",
    }
  );
}

export function toggleProjectNotePinned(slug: string, noteId: string): void {
  const target = findNote(slug, noteId);
  const noteTitle = target?.title ?? "Note";
  const pinned = !(target?.pinned ?? false);

  updateProject(
    slug,
    (project) => ({
      ...project,
      notes: project.notes.map((note) => {
        if (note.id !== noteId) return note;

        return {
          ...note,
          pinned,
          updatedAt: nowIso(),
        };
      }),
    }),
    {
      type: "note",
      summary: `${pinned ? "Pinned" : "Unpinned"} note: ${noteTitle}`,
    }
  );
}

export function addProjectLink(slug: string, input: ProjectLinkInput): void {
  const linkInput = cleanLinkInput(input);

  updateProject(
    slug,
    (project) => ({
      ...project,
      links: [
        {
          id: randomUUID(),
          ...linkInput,
        },
        ...project.links,
      ],
    }),
    {
      type: "link",
      summary: `Added project link: ${linkInput.label}`,
      detail: linkInput.url,
    }
  );
}

export function deleteProjectLink(slug: string, linkId: string): void {
  const target = findLink(slug, linkId);
  const linkLabel = target?.label ?? "Project link";

  updateProject(
    slug,
    (project) => ({
      ...project,
      links: project.links.filter((link) => link.id !== linkId),
    }),
    {
      type: "link",
      summary: `Removed project link: ${linkLabel}`,
    }
  );
}

function findTask(slug: string, boardId: string, cardId: string) {
  const project = readProjects().find((item) => item.slug === slug);
  const board = project?.boards.find((item) => item.id === boardId);
  const card = board?.cards.find((item) => item.id === cardId);

  if (!project || !board || !card) {
    return undefined;
  }

  return { project, board, card };
}

function findNote(slug: string, noteId: string) {
  const project = readProjects().find((item) => item.slug === slug);
  return project?.notes.find((note) => note.id === noteId);
}

function findLink(slug: string, linkId: string) {
  const project = readProjects().find((item) => item.slug === slug);
  return project?.links.find((link) => link.id === linkId);
}

function selectCommandFocus(projects: Project[]) {
  const ranked = [...projects].sort((a, b) => scoreProject(b) - scoreProject(a));
  return ranked[0];
}

function scoreProject(project: Project) {
  const stats = getProjectStats(project);
  let score = 0;

  score += stats.urgentCount * 10;
  score += project.repoHealth === "Needs Attention" ? 6 : 0;
  score += project.repoHealth === "Watch" ? 3 : 0;
  score += project.status === "Blocked" ? 7 : 0;
  score += project.status === "Active" ? 4 : 0;
  score += project.blockers.length * 2;
  score += isOlderThanDays(project.updatedAt, 7) ? 3 : 0;

  return score;
}

function updateProject(
  slug: string,
  updater: (project: Project) => Project,
  activity: { type: ActivityType; summary: string; detail?: string },
  options?: { includeArchived?: boolean }
): void {
  let foundProject = false;
  const now = nowIso();

  const projects = readProjects().map((project) => {
    if (project.slug !== slug) return project;

    if (project.archived && !options?.includeArchived) return project;

    foundProject = true;

    const updated = updater(project);

    return {
      ...updated,
      updatedAt: now,
      lastUpdated: "Just now",
      activity: [createActivity(activity.type, activity.summary, activity.detail), ...(updated.activity ?? [])].slice(0, 80),
    };
  });

  if (!foundProject) {
    throw new Error(`Project not found: ${slug}`);
  }

  writeProjects(projects);
}

function createActivity(
  type: ActivityType,
  summary: string,
  detail?: string
): ProjectActivityEntry {
  return {
    id: randomUUID(),
    type,
    summary,
    detail,
    createdAt: nowIso(),
  };
}

function uniqueSlug(baseSlug: string, projects: Project[]) {
  const existing = new Set(projects.map((project) => project.slug));

  if (!existing.has(baseSlug)) {
    return baseSlug;
  }

  let index = 2;
  let candidate = `${baseSlug}-${index}`;

  while (existing.has(candidate)) {
    index += 1;
    candidate = `${baseSlug}-${index}`;
  }

  return candidate;
}

function getProjectCards(project: Project): ProjectTaskCard[] {
  return project.boards.flatMap((board) => board.cards);
}

function cleanTaskInput(input: TaskCardInput): TaskCardInput {
  return {
    title: requireText(input.title, "Task title"),
    description: requireText(input.description, "Task description"),
    priority: requirePriority(input.priority),
    due: requireText(input.due, "Task due field"),
    urgent: input.urgent,
    column: requireColumn(input.column),
  };
}

function cleanNoteInput(input: ProjectNoteInput): ProjectNoteInput {
  return {
    title: requireText(input.title, "Note title"),
    content: requireText(input.content, "Note content"),
    pinned: input.pinned,
  };
}

function cleanLinkInput(input: ProjectLinkInput): ProjectLinkInput {
  return {
    label: requireText(input.label, "Link label"),
    url: requireText(input.url, "Link URL"),
    type: requireText(input.type, "Link type"),
  };
}

function requireText(value: string, label: string) {
  const clean = value.trim();

  if (!clean) {
    throw new Error(`${label} cannot be empty.`);
  }

  return clean;
}

function requireColumn(value: TaskColumnId) {
  if (!VALID_COLUMNS.includes(value)) {
    throw new Error(`Invalid column: ${value}`);
  }

  return value;
}

function requirePriority(value: TaskPriority) {
  if (!VALID_PRIORITIES.includes(value)) {
    throw new Error(`Invalid priority: ${value}`);
  }

  return value;
}

function requireStatus(value: ProjectStatus) {
  if (!VALID_STATUSES.includes(value)) {
    throw new Error(`Invalid status: ${value}`);
  }

  return value;
}

function requireRepoHealth(value: RepoHealth) {
  if (!VALID_REPO_HEALTH.includes(value)) {
    throw new Error(`Invalid repo health: ${value}`);
  }

  return value;
}
