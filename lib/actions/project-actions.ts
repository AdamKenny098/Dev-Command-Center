"use server";

import { revalidatePath } from "next/cache";

import type { TaskColumnId } from "@/lib/project-types";
import {
  addProjectNote,
  moveTaskCard,
  toggleProjectNotePinned,
  updateProjectFocus,
  updateProjectNextAction,
} from "@/lib/services/project-service";

const VALID_COLUMNS: TaskColumnId[] = ["backlog", "next", "doing", "done"];

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

export async function moveTaskColumnAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");
  const boardId = getRequiredString(formData, "boardId");
  const cardId = getRequiredString(formData, "cardId");
  const column = getRequiredColumn(formData, "column");

  moveTaskCard(slug, boardId, cardId, column);
  revalidateProjectPaths(slug);
}

export async function addProjectNoteAction(formData: FormData) {
  const slug = getRequiredString(formData, "slug");
  const title = getRequiredString(formData, "title");
  const content = getRequiredString(formData, "content");
  const pinned = formData.get("pinned") === "on";

  addProjectNote(slug, title, content, pinned);
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

function getRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing form value: ${key}`);
  }

  return value.trim();
}

function getRequiredColumn(formData: FormData, key: string): TaskColumnId {
  const value = getRequiredString(formData, key);

  if (!VALID_COLUMNS.includes(value as TaskColumnId)) {
    throw new Error(`Invalid column: ${value}`);
  }

  return value as TaskColumnId;
}

function revalidateProjectPaths(slug: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${slug}`);
}