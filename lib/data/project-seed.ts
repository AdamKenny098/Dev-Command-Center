import { Project } from "@/lib/project-types";

export const projectSeed: Project[] = [
    {
        id: "p1",
        name: "Echoes of the Labyrinth",
        slug: "echoes-of-the-labyrinth",
        summary:
          "Dark fantasy roguelike with procedural dungeons, room decoration systems, AI states, and combat polish.",
        status: "Active",
        repoHealth: "Needs Attention",
        repoName: "echoes-of-the-labyrinth",
        focus:
          "Stabilise room decoration density and stop generic props overlapping specialised room items.",
        nextAction:
          "Fix the remaining generic-versus-specialised overlap cases in large rooms.",
        blockers: [
          "Overlap edge cases still exist",
          "Large rooms can still feel too sparse",
        ],
        lastUpdated: "2h ago",
        boards: [
          {
            id: "b1",
            name: "Decor Overhaul",
            description:
              "Planner rewrite, cluster selection, density tuning, and overlap prevention.",
            cards: [
              {
                id: "c1",
                title: "Tune large-room cluster count",
                description: "Adjust scaling so 1500+ area rooms stop looking barren.",
                priority: "High",
                due: "Today",
                urgent: true,
                column: "doing",
              },
              {
                id: "c2",
                title: "Stop generic and specific decor collisions",
                description: "Make reservations properly block generic decoration passes.",
                priority: "Critical",
                due: "Today",
                urgent: true,
                column: "next",
              },
              {
                id: "c3",
                title: "Add cluster debug overlay",
                description: "Visualise selected clusters and rejected positions.",
                priority: "Medium",
                due: "This Week",
                column: "backlog",
              },
              {
                id: "c4",
                title: "Refactor reservation validation",
                description: "Make planning rules cheaper and more predictable.",
                priority: "High",
                due: "Tomorrow",
                column: "next",
              },
              {
                id: "c5",
                title: "Torch pillar placement pass",
                description: "Placement now looks correct after height fixes.",
                priority: "Low",
                due: "Done",
                column: "done",
              },
            ],
          },
          {
            id: "b2",
            name: "AI & Combat",
            description:
              "Enemy sensing, chase, flee, animation sync, and combat state behaviour.",
            cards: [
              {
                id: "c6",
                title: "Verify chase never overrides flee",
                description: "Low-health priority should always beat chase.",
                priority: "Critical",
                due: "Today",
                urgent: true,
                column: "doing",
              },
              {
                id: "c7",
                title: "Clean combat sense blackboard vars",
                description: "Reduce ambiguity in combat target and range values.",
                priority: "Medium",
                due: "This Week",
                column: "next",
              },
              {
                id: "c8",
                title: "Death state footage capture",
                description: "Grab clean clips for submission and showcase.",
                priority: "Low",
                due: "Later",
                column: "backlog",
              },
            ],
          },
        ],
        notes: [
          {
            id: "n1",
            title: "Rule",
            content:
              "Project boards should reflect real subsystems, not one giant dumping ground.",
            pinned: true,
          },
          {
            id: "n2",
            title: "Reminder",
            content:
              "Large rooms looking barren matters more right now than perfect pillar counts.",
          },
        ],
        links: [
          {
            id: "l1",
            label: "GitHub Repo",
            url: "github.com/you/echoes-of-the-labyrinth",
            type: "Repo",
          },
          {
            id: "l2",
            label: "Itch Page",
            url: "itch.io/echoes-of-the-labyrinth",
            type: "Build",
          },
        ],
      },
      {
        id: "p2",
        name: "Project Command Center",
        slug: "project-command-center",
        summary:
          "Personal command hub for urgent tasks, project workspaces, board collections, and repo awareness.",
        status: "Planning",
        repoHealth: "Watch",
        repoName: "project-command-center",
        focus:
          "Turn the generic dashboard into a real home screen plus proper project workspaces.",
        nextAction:
          "Build project detail pages with board collections and overview widgets.",
        blockers: [],
        lastUpdated: "Just now",
        boards: [
          {
            id: "b3",
            name: "V3 Product Shape",
            description:
              "Home command center, projects grid, project detail workspace.",
            cards: [
              {
                id: "c9",
                title: "Replace generic home with urgent-first layout",
                description: "Home should answer what matters right now.",
                priority: "Critical",
                due: "Today",
                urgent: true,
                column: "doing",
              },
              {
                id: "c10",
                title: "Model projects as primary entity",
                description: "Tasks and boards should belong to projects.",
                priority: "High",
                due: "Today",
                urgent: true,
                column: "next",
              },
              {
                id: "c11",
                title: "Add project detail sections",
                description: "Overview, boards, notes, and links on each project page.",
                priority: "High",
                due: "Tomorrow",
                column: "next",
              },
              {
                id: "c12",
                title: "Move boards under projects",
                description: "Stop treating the board as the whole app.",
                priority: "High",
                due: "Tomorrow",
                column: "backlog",
              },
            ],
          },
          {
            id: "b4",
            name: "Future Backend",
            description:
              "Prisma, persistence, GitHub integration, and repo health syncing.",
            cards: [
              {
                id: "c13",
                title: "Draft Prisma models",
                description: "Project, Board, Column, Card, Note, Link.",
                priority: "Medium",
                due: "Later",
                column: "backlog",
              },
              {
                id: "c14",
                title: "Define GitHub sync fields",
                description: "Decide what repo info belongs in the UI.",
                priority: "Medium",
                due: "Later",
                column: "backlog",
              },
            ],
          },
        ],
        notes: [
          {
            id: "n3",
            title: "Core identity",
            content:
              "Global home first. Project workspaces second. Boards live inside projects.",
            pinned: true,
          },
          {
            id: "n4",
            title: "Do not do",
            content:
              "Do not turn the whole app into a Trello clone or a vague life planner.",
          },
        ],
        links: [
          {
            id: "l3",
            label: "GitHub Repo",
            url: "github.com/you/project-command-center",
            type: "Repo",
          },
          {
            id: "l4",
            label: "Design Notes",
            url: "internal/design-notes",
            type: "Docs",
          },
        ],
      },
      {
        id: "p3",
        name: "VeriLite",
        slug: "verilite",
        summary:
          "Lightweight file integrity checker focused on education, forensic clarity, and signed baseline manifests.",
        status: "Polish",
        repoHealth: "Healthy",
        repoName: "verilite",
        focus: "Keep the scope tight and present the evaluation clearly.",
        nextAction: "Finalise the report polishing checklist.",
        blockers: ["Presentation polish"],
        lastUpdated: "1d ago",
        boards: [
          {
            id: "b5",
            name: "Report & Delivery",
            description:
              "Report sections, screenshots, evaluation evidence, and submission items.",
            cards: [
              {
                id: "c15",
                title: "Tighten conclusion wording",
                description: "Keep it aligned with what was actually achieved.",
                priority: "Medium",
                due: "This Week",
                column: "next",
              },
              {
                id: "c16",
                title: "Poster icon choices",
                description: "Pick clean icons for scan, hash, compare, detect, log.",
                priority: "Low",
                due: "Later",
                column: "backlog",
              },
              {
                id: "c17",
                title: "Testing section final pass",
                description: "Make sure evidence and terminology stay consistent.",
                priority: "High",
                due: "Today",
                urgent: true,
                column: "doing",
              },
            ],
          },
        ],
        notes: [
          {
            id: "n5",
            title: "Pitch",
            content:
              "Position VeriLite as clarity-first and secure-by-default, not enterprise-grade.",
            pinned: true,
          },
        ],
        links: [
          {
            id: "l5",
            label: "GitHub Repo",
            url: "github.com/you/verilite",
            type: "Repo",
          },
        ],
      },
];