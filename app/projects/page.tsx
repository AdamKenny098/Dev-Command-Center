import ProjectCard from "@/components/ProjectCard";
import { getAllProjects } from "@/lib/mock-projects";

export default function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <p className="mt-2 text-slate-400">
          Each project is now its own workspace with overview, boards, notes, and links.
        </p>
      </header>

      <section className="grid gap-4 xl:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} expanded />
        ))}
      </section>
    </div>
  );
}