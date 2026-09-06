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
    <div className="min-h-screen bg-[var(--color-fc-bg)]">

      {/* ── Hero Header ── */}
      <section className="relative bg-gradient-to-b from-[var(--color-fc-deep)] via-[var(--color-fc-primary)]/30 to-[var(--color-fc-deep)] text-white overflow-hidden">
        <div className="absolute inset-0 bg-dots-dark opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-grid-dark opacity-10 pointer-events-none" />

        {/* Orbs */}
        <div className="absolute right-0 top-0 w-96 h-96 rounded-full bg-[var(--color-fc-primary)]/20 blur-[100px] pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-64 h-64 rounded-full bg-[var(--color-fc-cyan)]/15 blur-[80px] pointer-events-none" />

        {/* Top line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-[var(--color-fc-primary)]/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-[var(--color-fc-primary)]/30 bg-[var(--color-fc-primary)]/10 text-[var(--color-fc-light)] text-xs font-bold mb-8 animate-fade-up">
              <Layers className="w-3.5 h-3.5 text-[var(--color-fc-cyan)]" />
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
                  <div className="w-9 h-9 rounded-xl bg-[var(--color-fc-primary)]/20 flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-4.5 h-4.5 text-[var(--color-fc-cyan)]" />
                  </div>
                  <p className="font-display font-bold text-white text-sm">{label}</p>
                  <p className="text-blue-300/60 text-[11px] mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-fc-bg)] to-transparent pointer-events-none" />
      </section>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* Live Filterable Component */}
        <FormationsExplorer formations={formations} />

        {/* Bottom Banner — Full width */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-fc-deep)] via-[var(--color-fc-primary)] to-[var(--color-fc-cyan)] p-px shadow-2xl">
          {/* Inner content */}
          <div className="relative rounded-[calc(1.5rem-1px)] bg-[var(--color-fc-deep)] px-8 py-12 sm:px-12 lg:px-16">
            <div className="absolute inset-0 bg-dots-dark opacity-20 pointer-events-none rounded-[calc(1.5rem-1px)]" />
            <div className="absolute right-8 top-8 w-48 h-48 rounded-full bg-[var(--color-fc-primary)]/10 blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-fc-primary)]/20 border border-[var(--color-fc-primary)]/30 text-[var(--color-fc-cyan)] text-xs font-bold">
                  <Sparkles className="w-3 h-3 text-[var(--color-fc-cyan)]" />
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
