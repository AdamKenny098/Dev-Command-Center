import { Note, Repo, Task, TaskStatus } from "@/lib/types";

export const dailyFocus =
  "Lock the command center structure before adding auth, database, or GitHub sync.";

export const boardColumns: { key: TaskStatus; title: string }[] = [
  { key: "backlog", title: "Backlog" },
  { key: "today", title: "Today" },
  { key: "doing", title: "Doing" },
  { key: "done", title: "Done" },
];

export const tasks: Task[] = [
  {
    id: "t1",
    title: "Plan MVP data model",
    description: "Define what a board, column, task, note, and pinned repo actually are.",
    priority: "critical",
    project: "Project Command Center",
    due: "Today",
    status: "doing",
  },
  {
    id: "t2",
    title: "Build board UI",
    description: "Create the Trello-style layout with four columns and task cards.",
    priority: "high",
    project: "Project Command Center",
    due: "Today",
    status: "today",
  },
  {
    id: "t3",
    title: "Decide overview widgets",
    description: "Choose what belongs on the command center and what belongs deeper in the app.",
    priority: "medium",
    project: "Project Command Center",
    due: "Tomorrow",
    status: "backlog",
  },
  {
    id: "t4",
    title: "Review repo health concept",
    description: "Make sure repo health is useful and not just vanity fluff.",
    priority: "medium",
    project: "GitHub Integration",
    due: "This Week",
    status: "backlog",
  },
  {
    id: "t5",
    title: "Write architecture notes",
    description: "Capture the product direction so future work does not drift.",
    priority: "low",
    project: "Planning",
    due: "This Week",
    status: "done",
  },
];

export const repos: Repo[] = [
  {
    id: "r1",
    name: "project-command-center",
    health: "attention",
    issues: 8,
    prs: 2,
    updated: "2h ago",
    pinned: true,
  },
  {
    id: "r2",
    name: "echoes-of-the-labyrinth",
    health: "healthy",
    issues: 4,
    prs: 1,
    updated: "6h ago",
    pinned: true,
  },
  {
    id: "r3",
    name: "verilite",
    health: "stale",
    issues: 0,
    prs: 0,
    updated: "9d ago",
    pinned: false,
  },
];

export const notes: Note[] = [
  {
    id: "n1",
    title: "Core rule",
    content: "This is a solo-dev control hub, not a generic life planner.",
    pinned: true,
  },
  {
    id: "n2",
    title: "Board first",
    content: "The board is the backbone. The dashboard wraps around it.",
    pinned: true,
  },
  {
    id: "n3",
    title: "Avoid bloat",
    content: "No team chat, no giant analytics suite, no overbuilt calendar sync in v1.",
    pinned: false,
  },
];