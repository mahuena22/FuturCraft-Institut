import { getProjects } from "@/lib/data-service";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { Layers } from "lucide-react";
import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";

export const revalidate = 3600;
export const metadata = {
  title: "Galerie des Projets Étudiants | FuturCraft Institut Bénin",
  description:
    "Découvrez les projets technologiques réels développés par les étudiants de FuturCraft : GEN3RVTO RH, AgroConnect, drones et IA.",
};

export default async function ProjetsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-[var(--color-fc-bg)]">
      <PageIntro
        eyebrow="Portfolio & réalisations"
        title="Les idées prennent forme, les projets deviennent réels."
        description="Chaque parcours donne lieu à une réalisation concrète, développée par les étudiants et présentée à des entreprises partenaires."
      />
      <div className="page-container py-14 sm:py-20">
        {/* Live Project Filter & Modal */}
        <ProjectsShowcase projects={projects} />
      </div>
    </div>
  );
}
