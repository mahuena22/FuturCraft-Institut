import { getFormations } from "@/lib/data-service";
import { FormationsExplorer } from "@/components/FormationsExplorer";
import { FormationsExplorerWrapper } from "@/components/FormationsExplorerWrapper";
import {
  GraduationCap,
  Phone,
  ArrowRight,
  Sparkles,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
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
            <div key={label} className="rounded-2xl border border-[var(--color-fc-gray-light)] bg-white p-4 shadow-sm sm:p-5">
              <Icon className="mb-4 h-5 w-5 text-[var(--color-fc-primary)]" />
              <p className="font-display text-sm font-bold text-[var(--color-fc-black)] sm:text-base">{label}</p>
              <p className="mt-1 text-xs text-[var(--color-fc-gray-mid)]">{sub}</p>
            </div>
          ))}
        </div>

        {/* Live Filterable Component */}
        <Suspense fallback={<div className="space-y-8"><div className="h-64 bg-[var(--color-fc-gray-light)]/30 rounded-2xl animate-pulse" /></div>}>
          <FormationsExplorerWrapper formations={formations} />
        </Suspense>

        {/* Bottom Banner — Full width */}
        <div className="relative overflow-hidden rounded-[2rem] bg-[var(--color-fc-deep)] p-px shadow-xl shadow-[var(--color-fc-deep)]/10">
          {/* Inner content */}
          <div className="relative rounded-[calc(1.5rem-1px)] bg-[var(--color-fc-deep)] px-8 py-12 sm:px-12 lg:px-16">
            <div className="absolute inset-0 bg-dots-dark opacity-20 pointer-events-none rounded-[calc(1.5rem-1px)]" />
            <div className="absolute right-8 top-8 w-48 h-48 rounded-full bg-[var(--color-fc-primary)]/10 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-fc-primary)]/20 border border-[var(--color-fc-primary)]/30 text-[var(--color-fc-deep)] text-xs font-bold">
                  <Sparkles className="w-3 h-3 text-[var(--color-fc-deep)]" />
                  Orientation personnalisée gratuite
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
                  Besoin d&apos;aide pour choisir ?
                </h3>
                <p className="text-sm text-[var(--color-fc-light)]/60 leading-7">
                  Nos conseillers pédagogiques vous aident à identifier la formation
                  la plus adaptée à votre profil et vos ambitions professionnelles.
                </p>
              </div>

              <div className="flex flex-col gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[var(--color-fc-bg)] text-[var(--color-fc-deep)] text-sm font-extrabold hover:bg-[var(--color-fc-light)]/30 transition-all hover:-translate-y-0.5 shadow-lg"
                >
                  <Phone className="w-4 h-4" />
                  Prendre rendez-vous
                </Link>
                <Link
                  href="/inscription"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[var(--color-fc-primary)] hover:bg-[var(--color-fc-deep)] text-[var(--color-fc-bg)] text-sm font-bold transition-all shadow-md"
                >
                  Candidater directement
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
