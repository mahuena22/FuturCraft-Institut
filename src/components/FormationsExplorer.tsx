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
      <div className="bg-[var(--color-fc-bg)] p-4 sm:p-6 rounded-2xl border border-[var(--color-fc-gray-light)]/50 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search bar */}
          <div className="relative w-full md:flex-1">
            <Search className="w-5 h-5 text-[var(--color-fc-gray-mid)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une formation (ex: React, Python, Drone, Sérigraphie, IA...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-fc-gray-light)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-fc-primary)] focus:border-transparent bg-[var(--color-fc-gray-light)]/30"
            />
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto text-xs text-[var(--color-fc-gray-mid)] font-medium">
            <Filter className="w-4 h-4 text-[var(--color-fc-primary)]" />
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
                  ? "bg-[var(--color-fc-primary)] text-[var(--color-fc-bg)] shadow-xs"
                  : "bg-[var(--color-fc-gray-light)]/30 text-[var(--color-fc-gray-mid)] hover:bg-[var(--color-fc-gray-light)]/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-[var(--color-fc-bg)] rounded-2xl border border-[var(--color-fc-gray-light)]">
          <p className="text-base font-semibold text-[var(--color-fc-black)]">Aucune formation ne correspond à votre recherche.</p>
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("Tous");
            }}
            className="mt-3 text-sm text-[var(--color-fc-primary)] font-bold hover:underline"
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
                className="bg-[var(--color-fc-bg)] rounded-2xl border border-[var(--color-fc-gray-light)]/50 shadow-[0_2px_15px_-3px_rgba(5,18,105,0.05)] hover:shadow-xl hover:border-[var(--color-fc-primary)] transition-all flex flex-col overflow-hidden group"
              >
                {/* Media */}
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-fc-gray-light)]/30">
                  <Image
                    src={f.imageUrl}
                    alt={f.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--color-fc-bg)]/95 backdrop-blur-xs text-[var(--color-fc-primary)] shadow-xs border border-[var(--color-fc-gray-light)]/60">
                      {f.category}
                    </span>
                  </div>
                  {f.isPopular && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--color-fc-primary)] text-[var(--color-fc-bg)] shadow-xs flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Populaire
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold bg-[var(--color-fc-deep)]/75 backdrop-blur-xs px-3 py-1.5 rounded-lg">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[var(--color-fc-cyan)]" /> {f.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-[var(--color-fc-light)]" /> {f.level}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-[var(--color-fc-black)] group-hover:text-[var(--color-fc-primary)] transition-colors mb-2 leading-snug">
                    {f.title}
                  </h3>
                  <p className="text-xs text-[var(--color-fc-gray-mid)] line-clamp-2 mb-4 leading-relaxed">
                    {f.shortDescription}
                  </p>

                  {/* Badges campus and mode */}
                  <div className="flex items-center gap-2 text-[11px] text-[var(--color-fc-gray-mid)] mb-4">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[var(--color-fc-gray-mid)]" /> {f.campus}
                    </span>
                  </div>

                  {/* Competencies */}
                  <div className="space-y-1.5 mb-4 flex-1">
                    <span className="text-[10px] font-bold text-[var(--color-fc-gray-mid)] uppercase tracking-wider block">
                      Compétences acquises :
                    </span>
                    <div className="space-y-1">
                      {competencies.slice(0, 3).map((comp, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-[var(--color-fc-gray-mid)]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-fc-primary)] shrink-0 mt-0.5" />
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
                          className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--color-fc-gray-light)]/30 text-[var(--color-fc-gray-mid)]"
                        >
                          {t}
                        </span>
                      ))}
                      {tools.length > 4 && (
                        <span className="text-[10px] text-[var(--color-fc-gray-mid)] self-center">
                          +{tools.length - 4}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing footer */}
                  <div className="pt-4 border-t border-[var(--color-fc-gray-light)]/50 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-[var(--color-fc-gray-mid)] block font-medium">Coût global :</span>
                      <span className="text-base font-black text-[var(--color-fc-black)]">
                        {f.price.toLocaleString("fr-FR")} <span className="text-xs font-bold text-[var(--color-fc-gray-mid)]">FCFA</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Link
                        href={`/formation/${f.slug}`}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-[var(--color-fc-primary)] bg-[var(--color-fc-primary)]/8 hover:bg-[var(--color-fc-primary)]/15 border border-[var(--color-fc-primary)]/30 transition-colors"
                      >
                        Détails
                      </Link>
                      <Link
                        href={`/inscription?formationId=${f.id}`}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-[var(--color-fc-bg)] bg-[var(--color-fc-primary)] hover:bg-[var(--color-fc-deep)] shadow-xs transition-colors flex items-center gap-1"
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
