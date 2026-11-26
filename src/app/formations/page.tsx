import { getFormations } from "@/lib/data-service";
import { FormationsExplorer } from "@/components/FormationsExplorer";
import { FormationsExplorerWrapper } from "@/components/FormationsExplorerWrapper";
import {
  GraduationCap,
  Phone,
  ArrowRight,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Compass } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Toutes les Formations | FuturCraft Institut Bénin",
  description:
    "Découvrez nos 12 formations professionnelles aux métiers du numérique : Développement Web, IA, UI/UX Design, Drone, Graphisme, Audiovisuel à Godomey, Supermarché O Bénin Avant pk14.",
};

export default async function FormationsPage() {
  const formations = await getFormations();

  const highlights = [
    { icon: BookOpen, label: `${formations.length}+ formations`, sub: "Catalogue complet" },
    { icon: Clock, label: "1 à 12 mois", sub: "Durées flexibles" },
    { icon: Users, label: "Cohortes limitées", sub: "Suivi personnalisé" },
    { icon: GraduationCap, label: "Diplômes certifiants", sub: "Reconnus partout" },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-fc-bg)]">

      <PageIntro
        eyebrow="Catalogue officiel · Admissions ouvertes"
        title="Des formations pour les métiers qui transforment le numérique."
        description="Du développement logiciel à l’intelligence artificielle, apprends en pratiquant sur des projets concrets, accompagné par des professionnels."
      />

      {/* ── Main Content ── */}
      <div className="page-container py-14 sm:py-20">

        <div className="mb-12 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {highlights.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="rounded-2xl border border-[var(--color-fc-gray-light)] bg-white p-5">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-display text-sm font-bold text-[var(--color-fc-black)] sm:text-base">{label}</p>
              <p className="mt-1 text-xs text-[var(--color-fc-gray-mid)]">{sub}</p>
            </div>
          ))}
        </div>

        {/* Live Filterable Component */}
        <Suspense fallback={<div className="space-y-8"><div className="h-64 bg-[var(--color-fc-gray-light)]/30 rounded-2xl animate-pulse" /></div>}>
          <FormationsExplorerWrapper formations={formations} />
        </Suspense>

        <div className="mt-16 overflow-hidden rounded-[2rem] bg-[var(--color-fc-deep)] px-8 py-12 sm:px-12 lg:px-16">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-cyan)]">
                <Compass className="h-3.5 w-3.5" /> Orientation personnalisée
              </p>
              <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                Besoin d&apos;aide pour choisir ?
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/65">
                Nos conseillers t&apos;aident à identifier la formation adaptée à ton profil, ton rythme et tes objectifs.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-[var(--color-fc-deep)] transition-colors hover:bg-[var(--color-fc-bg)]">
                <Phone className="h-4 w-4" /> Parler à un conseiller
              </Link>
              <Link href="/inscription" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-fc-cyan)] px-6 py-3.5 text-sm font-bold text-[#06122f] transition-colors hover:bg-white">
                Candidater <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
