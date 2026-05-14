import {
    Project,
    ProjectBoard,
    ProjectNote,
    ProjectTaskCard,
  } from "@/lib/project-types";
  import { projectSeed } from "@/lib/data/project-seed";
  
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
  
  export function getAllProjects(): Project[] {
    return projectSeed;
  }
  
  export function getProjectBySlug(slug: string): Project | undefined {
    return projectSeed.find((project) => project.slug === slug);
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
    return projectSeed.flatMap((project) =>
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
    return projectSeed.flatMap((project) =>
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
    return projectSeed.filter((project) => project.repoHealth !== "Healthy");
  }
  
  export function getPinnedNotes(): PinnedProjectNoteResult[] {
    return projectSeed.flatMap((project) =>
      project.notes
        .filter((note) => note.pinned)
        .map((note) => ({
          project,
          note,
        }))
    );
  }
  
  function getProjectCards(project: Project): ProjectTaskCard[] {
    return project.boards.flatMap((board) => board.cards);
  }