import { getProjects } from "@/lib/data-service";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { Layers } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Galerie des Projets Étudiants | FuturCraft Institut Bénin",
  description:
    "Découvrez les projets technologiques réels développés par les étudiants de FuturCraft : GEN3RVTO RH, AgroConnect, drones et IA.",
};

export default async function ProjetsPage() {
  const projects = await getProjects();

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-violet-600 bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
            Portfolio &amp; Réalisations
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Galerie des Projets Étudiants
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            À FuturCraft, chaque fin de formation donne lieu à un projet réel déployé en production et soutenu devant un jury d&apos;entreprises partenaires.
          </p>
        </div>

        {/* Live Project Filter & Modal */}
        <ProjectsShowcase projects={projects} />
      </div>
    </div>
  );
}
