"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type {
  ProjectStatus,
  RepoHealth,
  TaskColumnId,
  TaskPriority,
} from "@/lib/project-types";
import {
  addProjectLink,
  addProjectNote,
  archiveProject,
  createProject,
  createTaskCard,
  deleteProjectLink,
  deleteProjectNote,
  deleteTaskCard,
  moveTaskCard,
  toggleProjectNotePinned,
  updateProjectFocus,
  updateProjectNextAction,
  updateProjectNote,
  updateProjectSettings,
  updateTaskCard,
} from "@/lib/services/project-service";
import { splitLines } from "@/lib/utils/text-utils";

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

export async function createProjectAction(formData: FormData) {
  const slug = createProject({
    name: getRequiredString(formData, "name"),
    summary: getRequiredString(formData, "summary"),
    repoName: getRequiredString(formData, "repoName"),
  });

  revalidatePath("/");
  revalidatePath("/projects");
  redirect(`/projects/${slug}`);
}

export async function updateProjectSettingsAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");

  updateProjectSettings(slug, {
    name: getRequiredString(formData, "name"),
    summary: getRequiredString(formData, "summary"),
    status: getRequiredStatus(formData, "status"),
    repoHealth: getRequiredRepoHealth(formData, "repoHealth"),
    repoName: getRequiredString(formData, "repoName"),
    focus: getRequiredString(formData, "focus"),
    nextAction: getRequiredString(formData, "nextAction"),
    blockers: splitLines(getOptionalString(formData, "blockers")),
  });

  revalidateProjectPaths(slug);
}

export async function archiveProjectAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");

  archiveProject(slug);
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/notes");
  revalidatePath("/activity");
  redirect("/projects");
}

export async function updateProjectFocusAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");
  const focus = getRequiredString(formData, "focus");

  updateProjectFocus(slug, focus);
  revalidateProjectPaths(slug);
}

export async function updateProjectNextActionAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");
  const nextAction = getRequiredString(formData, "nextAction");

  updateProjectNextAction(slug, nextAction);
  revalidateProjectPaths(slug);
}

export async function createTaskCardAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");
  const boardId = getRequiredString(formData, "boardId");

  createTaskCard(slug, boardId, getTaskInput(formData));
  revalidateProjectPaths(slug);
}

export async function updateTaskCardAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");
  const boardId = getRequiredString(formData, "boardId");
  const cardId = getRequiredString(formData, "cardId");

  updateTaskCard(slug, boardId, cardId, getTaskInput(formData));
  revalidateProjectPaths(slug);
}

export async function moveTaskColumnAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");
  const boardId = getRequiredString(formData, "boardId");
  const cardId = getRequiredString(formData, "cardId");
  const column = getRequiredColumn(formData, "column");

  moveTaskCard(slug, boardId, cardId, column);
  revalidateProjectPaths(slug);
}

export async function deleteTaskCardAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");
  const boardId = getRequiredString(formData, "boardId");
  const cardId = getRequiredString(formData, "cardId");

  deleteTaskCard(slug, boardId, cardId);
  revalidateProjectPaths(slug);
}

export async function addProjectNoteAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");

  addProjectNote(slug, {
    title: getRequiredString(formData, "title"),
    content: getRequiredString(formData, "content"),
    pinned: formData.get("pinned") === "on",
  });

  revalidateProjectPaths(slug);
  revalidatePath("/notes");
}

export async function updateProjectNoteAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");
  const noteId = getRequiredString(formData, "noteId");

  updateProjectNote(slug, noteId, {
    title: getRequiredString(formData, "title"),
    content: getRequiredString(formData, "content"),
    pinned: formData.get("pinned") === "on",
  });

  revalidateProjectPaths(slug);
  revalidatePath("/notes");
}

export async function deleteProjectNoteAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");
  const noteId = getRequiredString(formData, "noteId");

  deleteProjectNote(slug, noteId);
  revalidateProjectPaths(slug);
  revalidatePath("/notes");
}

export async function toggleProjectNotePinnedAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");
  const noteId = getRequiredString(formData, "noteId");

  toggleProjectNotePinned(slug, noteId);
  revalidateProjectPaths(slug);
  revalidatePath("/notes");
}

export async function addProjectLinkAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");

  addProjectLink(slug, {
    label: getRequiredString(formData, "label"),
    url: getRequiredString(formData, "url"),
    type: getRequiredString(formData, "type"),
  });

  revalidateProjectPaths(slug);
}

export async function deleteProjectLinkAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");
  const linkId = getRequiredString(formData, "linkId");

  deleteProjectLink(slug, linkId);
  revalidateProjectPaths(slug);
}

function getTaskInput(formData: FormData) {
  return {
    title: getRequiredString(formData, "title"),
    description: getRequiredString(formData, "description"),
    priority: getRequiredPriority(formData, "priority"),
    due: getRequiredString(formData, "due"),
    urgent: formData.get("urgent") === "on",
    column: getRequiredColumn(formData, "column"),
  };
}

function getRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing form value: ${key}`);
  }

  return value.trim();
}

function getOptionalString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value;
}

function getRequiredColumn(formData: FormData, key: string): TaskColumnId {
  const value = getRequiredString(formData, key) as TaskColumnId;

  if (!VALID_COLUMNS.includes(value)) {
    throw new Error(`Invalid column: ${value}`);
  }

  return value;
}

function getRequiredPriority(formData: FormData, key: string): TaskPriority {
  const value = getRequiredString(formData, key) as TaskPriority;

  if (!VALID_PRIORITIES.includes(value)) {
    throw new Error(`Invalid priority: ${value}`);
  }

  return value;
}

function getRequiredStatus(formData: FormData, key: string): ProjectStatus {
  const value = getRequiredString(formData, key) as ProjectStatus;

  if (!VALID_STATUSES.includes(value)) {
    throw new Error(`Invalid status: ${value}`);
  }

  return value;
}

function getRequiredRepoHealth(formData: FormData, key: string): RepoHealth {
  const value = getRequiredString(formData, key) as RepoHealth;

  if (!VALID_REPO_HEALTH.includes(value)) {
    throw new Error(`Invalid repo health: ${value}`);
  }

  return value;
}

function revalidateProjectPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/notes");
  revalidatePath("/activity");
}
