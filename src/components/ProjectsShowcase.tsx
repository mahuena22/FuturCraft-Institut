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
                ? "bg-violet-600 text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
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
              className="bg-white rounded-3xl border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-2xl hover:border-violet-300 transition-all flex flex-col overflow-hidden group"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <Image
                  src={proj.coverImage}
                  alt={proj.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-950/80 text-white backdrop-blur-xs">
                    {proj.formationTitle}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-950 group-hover:text-violet-600 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs font-bold text-blue-600">{proj.tagline}</p>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {proj.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Stack Technologique :
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {techList.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200/60"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Team snippet and link */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const lead = team[0]?.name;
                      const avatar = lead ? memberAvatar(lead) : null;
                      return avatar ? (
                        <div className="w-7 h-7 rounded-full overflow-hidden relative bg-violet-100">
                          <Image src={avatar} alt={lead || ""} fill sizes="28px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-[10px]">
                          {team[0]?.name?.slice(0, 2) || "FC"}
                        </div>
                      );
                    })()}
                    <span className="font-semibold text-slate-700 text-[11px]">
                      {team[0]?.name || "Étudiant FuturCraft"}
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveModalProject(proj)}
                    className="text-xs font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1"
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
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start sm:items-center justify-center overflow-y-auto p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-violet-600 bg-violet-50 px-2.5 py-1 rounded">
                  {activeModalProject.formationTitle}
                </span>
                <h3 className="text-2xl font-black text-slate-950 mt-1">
                  {activeModalProject.title}
                </h3>
                <p className="text-xs text-slate-500">{activeModalProject.tagline}</p>
              </div>
              <button
                onClick={() => setActiveModalProject(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 relative">
              <Image
                src={activeModalProject.coverImage}
                alt={activeModalProject.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Description du projet :</span>
              <p className="text-slate-600 leading-relaxed">{activeModalProject.description}</p>
            </div>

            {/* Team members */}
            <div className="space-y-2 text-xs">
              <span className="font-bold text-slate-700 block">Équipe de conception :</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(JSON.parse(activeModalProject.teamMembers || "[]") as any[]).map((tm, idx) => {
                  const avatar = memberAvatar(tm.name);
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-150 flex items-center gap-2"
                    >
                      {avatar ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden relative bg-violet-100 shrink-0">
                          <Image src={avatar} alt={tm.name} fill sizes="32px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                          {tm.name.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <strong className="text-slate-900 block">{tm.name}</strong>
                        <span className="text-[10px] text-slate-500">{tm.role}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeModalProject.projectUrl && (
                  <a
                    href={activeModalProject.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 flex items-center gap-1.5 shadow-xs"
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
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5"
                  >
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Code GitHub</span>
                  </a>
                )}
              </div>

              <button
                onClick={() => setActiveModalProject(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700"
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
