import { randomUUID } from "node:crypto";

import {
  Project,
  ProjectBoard,
  ProjectNote,
  ProjectTaskCard,
  TaskColumnId,
} from "@/lib/project-types";
import {
  readProjects,
  writeProjects,
} from "@/lib/repositories/project-repository";

export type ProjectStats = {
  boardCount: number;
  noteCount: number;
  urgentCount: number;
  totalCards: number;
  doneCount: number;
  progress: number;
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

const VALID_COLUMNS: TaskColumnId[] = ["backlog", "next", "doing", "done"];

export function getAllProjects(): Project[] {
  return readProjects();
}

export function getProjectBySlug(slug: string): Project | undefined {
  return readProjects().find((project) => project.slug === slug);
}

export function getProjectStats(project: Project): ProjectStats {
  const allCards = getProjectCards(project);

  const urgentCount = allCards.filter(
    (card) => card.urgent && card.column !== "done"
  ).length;

  const doneCount = allCards.filter((card) => card.column === "done").length;

  const progress =
    allCards.length === 0 ? 0 : Math.round((doneCount / allCards.length) * 100);

  return {
    boardCount: project.boards.length,
    noteCount: project.notes.length,
    urgentCount,
    totalCards: allCards.length,
    doneCount,
    progress,
  };
}

export function getUrgentTasks(): ProjectTaskResult[] {
  return readProjects().flatMap((project) =>
    project.boards.flatMap((board) =>
      board.cards
        .filter((card) => card.urgent && card.column !== "done")
        .map((card) => ({
          project,
          board,
          card,
        }))
    )
  );
}

export function getNextTasks(): ProjectTaskResult[] {
  return readProjects().flatMap((project) =>
    project.boards.flatMap((board) =>
      board.cards
        .filter((card) => card.column === "next")
        .map((card) => ({
          project,
          board,
          card,
        }))
    )
  );
}

export function getRepoWatchProjects(): Project[] {
  return readProjects().filter((project) => project.repoHealth !== "Healthy");
}

export function getPinnedNotes(): PinnedProjectNoteResult[] {
  return readProjects().flatMap((project) =>
    project.notes
      .filter((note) => note.pinned)
      .map((note) => ({
        project,
        note,
      }))
  );
}

export function updateProjectFocus(slug: string, focus: string): void {
  const cleanFocus = focus.trim();

  if (!cleanFocus) {
    throw new Error("Project focus cannot be empty.");
  }

  updateProject(slug, (project) => ({
    ...project,
    focus: cleanFocus,
    lastUpdated: "Just now",
  }));
}

export function updateProjectNextAction(
  slug: string,
  nextAction: string
): void {
  const cleanNextAction = nextAction.trim();

  if (!cleanNextAction) {
    throw new Error("Next action cannot be empty.");
  }

  updateProject(slug, (project) => ({
    ...project,
    nextAction: cleanNextAction,
    lastUpdated: "Just now",
  }));
}

export function moveTaskCard(
  slug: string,
  boardId: string,
  cardId: string,
  column: TaskColumnId
): void {
  if (!VALID_COLUMNS.includes(column)) {
    throw new Error("Invalid task column.");
  }

  updateProject(slug, (project) => ({
    ...project,
    lastUpdated: "Just now",
    boards: project.boards.map((board) => {
      if (board.id !== boardId) {
        return board;
      }

      return {
        ...board,
        cards: board.cards.map((card) => {
          if (card.id !== cardId) {
            return card;
          }

          return {
            ...card,
            column,
          };
        }),
      };
    }),
  }));
}

export function addProjectNote(
  slug: string,
  title: string,
  content: string,
  pinned: boolean
): void {
  const cleanTitle = title.trim();
  const cleanContent = content.trim();

  if (!cleanTitle) {
    throw new Error("Note title cannot be empty.");
  }

  if (!cleanContent) {
    throw new Error("Note content cannot be empty.");
  }

  updateProject(slug, (project) => ({
    ...project,
    lastUpdated: "Just now",
    notes: [
      {
        id: randomUUID(),
        title: cleanTitle,
        content: cleanContent,
        pinned,
      },
      ...project.notes,
    ],
  }));
}

export function toggleProjectNotePinned(slug: string, noteId: string): void {
  updateProject(slug, (project) => ({
    ...project,
    lastUpdated: "Just now",
    notes: project.notes.map((note) => {
      if (note.id !== noteId) {
        return note;
      }

      return {
        ...note,
        pinned: !note.pinned,
      };
    }),
  }));
}

function updateProject(
  slug: string,
  updater: (project: Project) => Project
): void {
  let foundProject = false;

  const projects = readProjects().map((project) => {
    if (project.slug !== slug) {
      return project;
    }

    foundProject = true;
    return updater(project);
  });

  if (!foundProject) {
    throw new Error(`Project not found: ${slug}`);
  }

  writeProjects(projects);
}

function getProjectCards(project: Project): ProjectTaskCard[] {
  return project.boards.flatMap((board) => board.cards);
}