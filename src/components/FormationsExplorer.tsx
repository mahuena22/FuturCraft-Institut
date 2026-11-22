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
import { FormationsGridSkeleton, FilterBarSkeleton } from "./FormationCardSkeleton";

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

interface FormationsExplorerProps {
  formations: Formation[];
  isLoading?: boolean;
}

export function FormationsExplorer({ formations, isLoading = false }: FormationsExplorerProps) {
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

  if (isLoading) {
    return (
      <div className="space-y-10">
        <FilterBarSkeleton />
        <FormationsGridSkeleton count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Category Filter Toolbar */}
      <div className="space-y-5 rounded-3xl border border-[var(--color-fc-gray-light)] bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Search bar */}
          <div className="relative w-full md:flex-1">
            <Search className="w-5 h-5 text-[var(--color-fc-gray-mid)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une formation (ex: React, Python, Drone, Sérigraphie, IA...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] py-3 pl-10 pr-4 text-sm transition-colors placeholder:text-[var(--color-fc-gray-mid)]/75 focus:border-[var(--color-fc-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-fc-primary)]/15"
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-7">
          {filtered.map((f) => {
            const competencies = JSON.parse(f.competencies || "[]") as string[];
            const tools = JSON.parse(f.tools || "[]") as string[];

            return (
              <div
                key={f.id}
                className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-fc-primary)]/25 hover:shadow-[0_24px_60px_-20px_rgba(7,22,61,0.15)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-fc-gray-light)]/40">
                  <Image
                    src={f.imageUrl}
                    alt={f.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute left-4 top-4 flex gap-2">
                    <span className="rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-fc-primary)] shadow-sm">
                      {f.category}
                    </span>
                    {f.isPopular && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-fc-deep)] px-3 py-1.5 text-[10px] font-bold text-white">
                        <Flame className="h-3 w-3" /> Populaire
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-3 text-xs font-semibold text-[var(--color-fc-gray-mid)]">
                    <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />{f.duration}</span>
                    <span className="h-1 w-1 rounded-full bg-[var(--color-fc-gray-light)]" />
                    <span className="inline-flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" />{f.level}</span>
                  </div>

                  <h3 className="mt-3 font-display text-xl font-bold leading-snug tracking-tight text-[var(--color-fc-black)] transition-colors group-hover:text-[var(--color-fc-primary)]">
                    {f.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--color-fc-gray-mid)]">
                    {f.shortDescription}
                  </p>

                  <div className="mt-5 space-y-2">
                    {competencies.slice(0, 2).map((comp, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-[var(--color-fc-gray-mid)]">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-fc-primary)]" />
                        <span className="line-clamp-1">{comp}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {tools.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="rounded-md bg-[var(--color-fc-bg)] px-2 py-1 text-[10px] font-medium text-[var(--color-fc-gray-mid)]">
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-fc-gray-mid)]">À partir de</p>
                      <p className="font-display text-lg font-extrabold text-[var(--color-fc-black)]">
                        {f.price.toLocaleString("fr-FR")} <span className="text-sm font-bold text-[var(--color-fc-gray-mid)]">FCFA</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/formation/${f.slug}`} className="rounded-xl border border-[var(--color-fc-gray-light)] px-4 py-2.5 text-xs font-bold text-[var(--color-fc-black)] transition-colors hover:border-[var(--color-fc-primary)]/30 hover:text-[var(--color-fc-primary)]">
                        Détails
                      </Link>
                      <Link href={`/inscription?formationId=${f.id}`} className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-fc-deep)] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[var(--color-fc-primary)]">
                        Candidater <ArrowRight className="h-3.5 w-3.5" />
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
