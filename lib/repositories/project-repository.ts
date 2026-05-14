import "server-only";

import fs from "node:fs";
import path from "node:path";

import { projectSeed } from "@/lib/data/project-seed";
import type { Project } from "@/lib/project-types";
import { nowIso, relativeLastUpdatedToIso } from "@/lib/utils/date-utils";

const DATA_DIR = path.join(process.cwd(), "data");
const PROJECTS_FILE = path.join(DATA_DIR, "projects.json");

function ensureDataFileExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(
      PROJECTS_FILE,
      JSON.stringify(projectSeed, null, 2),
      "utf-8"
    );
  }
}

export function readProjects(): Project[] {
  ensureDataFileExists();

  const raw = fs.readFileSync(PROJECTS_FILE, "utf-8");

  if (!raw.trim()) {
    writeProjects(projectSeed);
    return normaliseProjects(projectSeed);
  }

  try {
    const parsed = JSON.parse(raw) as Project[];
    return normaliseProjects(parsed);
  } catch {
    const backupName = `projects.invalid-${new Date()
      .toISOString()
      .replace(/[:.]/g, "-")}.json`;
    const backupPath = path.join(DATA_DIR, backupName);

    fs.renameSync(PROJECTS_FILE, backupPath);
    writeProjects(projectSeed);

    return normaliseProjects(projectSeed);
  }
}

export function writeProjects(projects: Project[]) {
  ensureDataFileExists();

  fs.writeFileSync(
    PROJECTS_FILE,
    JSON.stringify(normaliseProjects(projects), null, 2),
    "utf-8"
  );
}

function normaliseProjects(projects: Project[]): Project[] {
  return projects.map((project) => {
    const updatedAt =
      project.updatedAt ?? relativeLastUpdatedToIso(project.lastUpdated);

    return {
      ...project,
      updatedAt,
      archived: project.archived ?? project.status === "Archived",
      boards: project.boards.map((board) => ({
        ...board,
        cards: board.cards.map((card) => ({
          ...card,
          archived: card.archived ?? false,
          createdAt: card.createdAt ?? updatedAt,
          updatedAt: card.updatedAt ?? updatedAt,
        })),
      })),
      notes: project.notes.map((note) => ({
        ...note,
        pinned: note.pinned ?? false,
        archived: note.archived ?? false,
        createdAt: note.createdAt ?? updatedAt,
        updatedAt: note.updatedAt ?? updatedAt,
      })),
      links: project.links ?? [],
      activity:
        project.activity && project.activity.length > 0
          ? project.activity
          : [
              {
                id: `seed-${project.id}`,
                type: "system",
                summary: "Project loaded into local command center",
                detail:
                  "This entry was generated while normalising older project data.",
                createdAt: nowIso(),
              },
            ],
    };
  });
}
