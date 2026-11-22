"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Code2,
  Users,
  Layers,
  CheckCircle2,
} from "lucide-react";

interface ProjectItem {
  id: number;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  coverImage: string;
  formationTitle: string;
  technologies: string;
  teamMembers: string;
  projectUrl: string | null;
  githubUrl: string | null;
  isFeatured: boolean | null;
}

export function ProjectsShowcase({ projects }: { projects: ProjectItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const avatarByTeamMember: Record<string, string> = {
    "Onesim Graça": "/images/Onesim-Graca.jpg",
  };

  const memberAvatar = (name: string) => avatarByTeamMember[name] || null;

  const categories = ["Tous", "Web & Cloud", "Intelligence Artificielle", "Drone & Vision", "Design & UX"];

  const filtered = projects.filter((p) => {
    if (selectedCategory === "Tous") return true;
    if (selectedCategory === "Web & Cloud") return p.formationTitle.includes("Web");
    if (selectedCategory === "Intelligence Artificielle") return p.formationTitle.includes("Intelligence");
    if (selectedCategory === "Drone & Vision") return p.formationTitle.includes("Drone");
    if (selectedCategory === "Design & UX") return p.formationTitle.includes("Design");
    return true;
  });

  if (projects.length === 0) {
    return (
      <div className="rounded-3xl border border-[var(--color-fc-gray-light)] bg-white px-6 py-16 text-center">
        <Layers className="mx-auto mb-4 h-10 w-10 text-[var(--color-fc-primary)]" />
        <h2 className="text-xl font-bold text-[var(--color-fc-black)]">Aucun projet publié pour le moment</h2>
        <p className="mt-2 text-sm text-[var(--color-fc-gray-mid)]">
          Les projets des étudiants validés par l’administration apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-[var(--color-fc-deep)] text-white"
                : "bg-white border border-[var(--color-fc-gray-light)] text-[var(--color-fc-gray-mid)] hover:bg-[var(--color-fc-bg)]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((proj) => {
          const techList = JSON.parse(proj.technologies || "[]") as string[];
          const team = JSON.parse(proj.teamMembers || "[]") as { name: string; role: string }[];

          return (
            <div
              key={proj.id}
              className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-white transition-all hover:border-[var(--color-fc-primary)]/25"
            >
              <div className="aspect-[16/10] overflow-hidden bg-[var(--color-fc-bg)] relative">
                <Image
                  src={proj.coverImage}
                  alt={proj.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--color-fc-deep)]/90 text-white backdrop-blur-xs">
                    {proj.formationTitle}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[var(--color-fc-black)] group-hover:text-[var(--color-fc-primary)] transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs font-bold text-[var(--color-fc-primary)]">{proj.tagline}</p>
                  <p className="text-xs text-[var(--color-fc-gray-mid)] leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[var(--color-fc-gray-mid)] block">
                    Stack Technologique :
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {techList.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-[var(--color-fc-bg)] text-[var(--color-fc-black)] border border-[var(--color-fc-gray-light)]/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Team snippet and link */}
                <div className="pt-4 border-t border-[var(--color-fc-gray-light)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const lead = team[0]?.name;
                      const avatar = lead ? memberAvatar(lead) : null;
                      return avatar ? (
                        <div className="w-7 h-7 rounded-full overflow-hidden relative bg-[var(--color-fc-surface)]">
                          <Image src={avatar} alt={lead || ""} fill sizes="28px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-[var(--color-fc-surface)] text-[var(--color-fc-primary)] font-bold flex items-center justify-center text-[10px]">
                          {team[0]?.name?.slice(0, 2) || "FC"}
                        </div>
                      );
                    })()}
                    <span className="font-semibold text-[var(--color-fc-black)] text-[11px]">
                      {team[0]?.name || "Étudiant FuturCraft"}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveModalProject(proj)}
                    className="flex items-center gap-1 text-xs font-bold text-[var(--color-fc-primary)] hover:underline"
                  >
                    <span>Détails</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      {activeModalProject && (
        <div className="fixed inset-0 z-50 bg-[var(--color-fc-deep)]/60 backdrop-blur-xs flex items-start sm:items-center justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-3xl border border-[var(--color-fc-gray-light)] max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="rounded-full bg-[var(--color-fc-surface)] px-2.5 py-1 text-xs font-bold text-[var(--color-fc-primary)]">
                  {activeModalProject.formationTitle}
                </span>
                <h3 className="text-2xl font-black text-[var(--color-fc-black)] mt-1">
                  {activeModalProject.title}
                </h3>
                <p className="text-xs text-[var(--color-fc-gray-mid)]">{activeModalProject.tagline}</p>
              </div>
              <button
                onClick={() => setActiveModalProject(null)}
                className="text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-gray-mid)] font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-[var(--color-fc-bg)] relative">
              <Image
                src={activeModalProject.coverImage}
                alt={activeModalProject.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-[var(--color-fc-black)] block">Description du projet :</span>
              <p className="text-[var(--color-fc-gray-mid)] leading-relaxed">{activeModalProject.description}</p>
            </div>

            {/* Team members */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-[var(--color-fc-black)] block">Équipe de conception :</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(JSON.parse(activeModalProject.teamMembers || "[]") as any[]).map((tm, idx) => {
                  const avatar = memberAvatar(tm.name);
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[var(--color-fc-bg)] border border-[var(--color-fc-gray-light)] flex items-center gap-2"
                    >
                      {avatar ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden relative bg-[var(--color-fc-surface)] shrink-0">
                          <Image src={avatar} alt={tm.name} fill sizes="32px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[var(--color-fc-surface)] text-[var(--color-fc-primary)] font-bold flex items-center justify-center text-[10px] shrink-0">
                          {tm.name.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <strong className="text-[var(--color-fc-black)] block">{tm.name}</strong>
                        <span className="text-[10px] text-[var(--color-fc-gray-mid)]">{tm.role}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--color-fc-gray-light)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeModalProject.projectUrl && (
                  <a
                    href={activeModalProject.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-fc-deep)] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[var(--color-fc-primary)]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Démo en ligne</span>
                  </a>
                )}
                {activeModalProject.githubUrl && (
                  <a
                    href={activeModalProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--color-fc-black)] bg-[var(--color-fc-bg)] hover:bg-[var(--color-fc-gray-light)] flex items-center gap-1.5"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Code GitHub</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => setActiveModalProject(null)}
                className="text-xs font-semibold text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)]"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
