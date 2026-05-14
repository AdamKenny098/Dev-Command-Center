import { notFound } from "next/navigation";
import ProjectWorkspace from "@/components/ProjectWorkspace";
import { getProjectBySlug } from "../../../lib/data/project-service"


export const dynamic = "force-dynamic";
type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectWorkspace project={project} />;
}