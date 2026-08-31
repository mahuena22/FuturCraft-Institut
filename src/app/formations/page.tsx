import { getFormations } from "@/lib/data-service";
import { FormationsExplorer } from "@/components/FormationsExplorer";
import {
  Layers,
  GraduationCap,
  Phone,
  ArrowRight,
  Sparkles,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";

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
    <div className="min-h-screen bg-[#f8faff]">

      {/* ── Hero Header ── */}
      <section className="relative bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-dots-dark opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-dark opacity-10 pointer-events-none" />

        {/* Orbs */}
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-blue-600/20 blur-[100px] pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-64 h-64 rounded-full bg-violet-600/15 blur-[80px] pointer-events-none" />

        {/* Top line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-200 text-xs font-bold mb-8 animate-fade-up">
              <Layers className="w-3.5 h-3.5 text-blue-300" />
              Catalogue Officiel 2026 — Admissions Ouvertes
            </div>

            <h1 className="animate-fade-up delay-100 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              <span className="text-white">Formations d&apos;avenir</span>
              <br />
              <span className="text-gradient-brand">aux métiers du numérique</span>
            </h1>

            <p className="animate-fade-up delay-200 text-blue-200/70 text-base sm:text-lg leading-relaxed mt-6 max-w-2xl mx-auto">
              De la maîtrise accélérée des outils IA en 1 mois aux filières complètes
              de développement logiciel. Pratique intensive, projets réels, diplômes certifiants.
            </p>

            {/* Highlights row */}
            <div className="animate-fade-up delay-300 mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {highlights.map(({ icon: Icon, label, sub }) => (
                <div key={label} className="glass rounded-2xl px-4 py-4 text-center hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-4.5 h-4.5 text-blue-300" />
                  </div>
                  <p className="font-display font-bold text-white text-sm">{label}</p>
                  <p className="text-blue-300/60 text-[11px] mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f8faff] to-transparent pointer-events-none" />
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Live Filterable Component */}
        <FormationsExplorer formations={formations} />

        {/* Bottom Banner — Full width */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-indigo-900 to-violet-900 p-px shadow-2xl">
          {/* Inner content */}
          <div className="relative rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 px-8 py-12 sm:px-12 lg:px-16">
            <div className="absolute inset-0 bg-dots-dark opacity-20 pointer-events-none rounded-[calc(1.5rem-1px)]" />
            <div className="absolute right-8 top-8 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  Orientation personnalisée gratuite
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
                  Besoin d&apos;aide pour choisir ?
                </h3>
                <p className="text-sm text-blue-200/60 leading-7">
                  Nos conseillers pédagogiques vous aident à identifier la formation
                  la plus adaptée à votre profil et vos ambitions professionnelles.
                </p>
              </div>

              <div className="flex flex-col gap-3 shrink-0">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white text-slate-900 text-sm font-extrabold hover:bg-blue-50 transition-all hover:-translate-y-0.5 shadow-lg"
                >
                  <Phone className="w-4 h-4" />
                  Prendre rendez-vous
                </Link>
                <Link
                  href="/inscription"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-md"
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
