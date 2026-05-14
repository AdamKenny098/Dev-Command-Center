import "server-only";

import fs from "node:fs";
import path from "node:path";
import { Project } from "@/lib/project-types";
import { projectSeed } from "@/lib/data/project-seed";

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
    fs.writeFileSync(
      PROJECTS_FILE,
      JSON.stringify(projectSeed, null, 2),
      "utf-8"
    );

    return projectSeed;
  }

  return JSON.parse(raw) as Project[];
}

export function writeProjects(projects: Project[]) {
  ensureDataFileExists();

  fs.writeFileSync(
    PROJECTS_FILE,
    JSON.stringify(projects, null, 2),
    "utf-8"
  );
}