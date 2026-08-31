"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  ArrowRight,
  Filter,
  Flame,
} from "lucide-react";

interface Formation {
  id: number;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  duration: string;
  level: string;
  price: number;
  registrationFee: number;
  campus: string;
  mode: string;
  isPopular: boolean | null;
  competencies: string;
  tools: string;
  imageUrl: string;
}

export function FormationsExplorer({ formations }: { formations: Formation[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");

  const categories = useMemo(() => {
    const set = new Set(formations.map((f) => f.category));
    return ["Tous", ...Array.from(set)];
  }, [formations]);

  const filtered = useMemo(() => {
    return formations.filter((f) => {
      const matchCat = selectedCategory === "Tous" || f.category === selectedCategory;
      const matchSearch =
        search === "" ||
        f.title.toLowerCase().includes(search.toLowerCase()) ||
        f.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
        f.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [formations, selectedCategory, search]);

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Toolbar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search bar */}
          <div className="relative w-full md:flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une formation (ex: React, Python, Drone, Sérigraphie, IA...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-50/50"
            />
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-slate-500 font-medium">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>{filtered.length} formation(s) trouvée(s)</span>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <p className="text-base font-semibold text-slate-700">Aucune formation ne correspond à votre recherche.</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("Tous");
            }}
            className="mt-3 text-sm text-blue-600 font-bold hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((f) => {
            const competencies = JSON.parse(f.competencies || "[]") as string[];
            const tools = JSON.parse(f.tools || "[]") as string[];

            return (
              <div
                key={f.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-xl hover:border-blue-300 transition-all flex flex-col overflow-hidden group"
              >
                {/* Media */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={f.imageUrl}
                    alt={f.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 backdrop-blur-xs text-blue-700 shadow-xs border border-slate-200/60">
                      {f.category}
                    </span>
                  </div>
                  {f.isPopular && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-600 text-white shadow-xs flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Populaire
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold bg-slate-950/75 backdrop-blur-xs px-3 py-1.5 rounded-lg">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" /> {f.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-400" /> {f.level}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {f.shortDescription}
                  </p>

                  {/* Badges campus and mode */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" /> {f.campus}
                    </span>
                  </div>

                  {/* Competencies */}
                  <div className="space-y-1.5 mb-4 flex-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Compétences acquises :
                    </span>
                    <div className="space-y-1">
                      {competencies.slice(0, 3).map((comp, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{comp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tools preview */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {tools.slice(0, 4).map((t, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                      {tools.length > 4 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{tools.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing footer */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Coût global :</span>
                      <span className="text-base font-black text-slate-950">
                        {f.price.toLocaleString("fr-FR")} <span className="text-xs font-bold text-slate-500">FCFA</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/formation/${f.slug}`}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                      >
                        Détails
                      </Link>
                      <Link
                        href={`/inscription?formationId=${f.id}`}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1"
                      >
                        <span>Candidater</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
