import { getProjects } from "@/lib/data-service";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import Image from "next/image";
import { Layers, Sparkles } from "lucide-react";
import Link from "next/link";

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
      {/* Hero Header */}
      <section className="relative bg-[var(--color-fc-deep)] text-white py-20 lg:py-28 overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-banniere.jpeg"
            alt="FuturCraft Institut"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#051269]/90 via-[#051269]/85 to-[#051269]/95" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="badge-brand mb-2 mx-auto w-fit text-blue-300 border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Portfolio &amp; Réalisations
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto">
            Galerie des Projets
            <span className="block text-gradient-brand mt-1">
              Étudiants &amp; Réalisations
            </span>
          </h1>

          <p className="mt-4 text-blue-200/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            À FuturCraft, chaque fin de formation donne lieu à un projet réel déployé en production et soutenu devant un jury d&apos;entreprises partenaires.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-fc-bg)] to-transparent pointer-events-none" />
      </section>

      {/* Main Content */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProjectsShowcase projects={projects} />
      </section>
    </div>
  );
}
