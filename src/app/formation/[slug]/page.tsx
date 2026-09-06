import { getFormationBySlug, getPromotions, getProjects } from "@/lib/data-service";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Clock,
  GraduationCap,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  HelpCircle,
  FolderGit2,
  Calendar,
  Layers,
  Wrench,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const formation = await getFormationBySlug(slug);
  if (!formation) return {};
  return {
    title: `${formation.title} — Formation`,
    description:
      formation.shortDescription ||
      `Formation ${formation.title} proposée par FuturCraft Institut à Godomey, Supermarché O Bénin Avant pk14 (Bénin).`,
  };
}

export default async function FormationDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const formation = await getFormationBySlug(slug);

  if (!formation) {
    notFound();
  }

  const promotions = await getPromotions(formation.id);
  const projects = await getProjects();
  const relatedProjects = projects.filter(
    (p) => p.formationTitle.toLowerCase().includes(formation.title.slice(0, 10).toLowerCase())
  );

  const modules = JSON.parse(formation.modules || "[]") as {
    moduleNumber: string;
    title: string;
    description: string;
    duration: string;
  }[];

  const competencies = JSON.parse(formation.competencies || "[]") as string[];
  const tools = JSON.parse(formation.tools || "[]") as string[];
  const jobs = JSON.parse(formation.jobs || "[]") as string[];

  // FAQ tailored for each formation
  const faqs = [
    {
      q: "Quels sont les prérequis pour intégrer cette formation ?",
      a: `Le niveau recommandé est ${formation.level}. La motivation, la rigueur et la régularité dans la pratique sont les critères d'admission les plus déterminants.`,
    },
    {
      q: "Comment s'organisent les paiements des frais de formation ?",
      a: `Les frais s'élèvent à ${formation.price.toLocaleString("fr-FR")} FCFA. Vous pouvez payer en plusieurs mensualités (jusqu'à ${formation.installmentsCount} fois) par MTN MoMo, Moov Money, carte bancaire ou directement à la caisse de nos campus.`,
    },
    {
      q: "Obtient-on une attestation ou certification reconnue ?",
      a: "Oui, à l'issue de la formation et après validation de la soutenance du projet devant jury professionnel, vous recevez le Certificat Professionnel de Compétences FuturCraft avec vérification numérique par QR Code.",
    },
    {
      q: "Les cours ont-ils lieu en présentiel ou en ligne ?",
      a: `Cette formation est dispensée en mode ${formation.mode} sur nos campus de ${formation.campus}. Les ateliers pratiques se font en laboratoire équipé.`,
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* 9.1 HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-16 lg:py-24 border-b border-slate-800">
        <div className="absolute inset-0 opacity-25 relative">
          <Image
            src={formation.imageUrl}
            alt={formation.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {formation.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-slate-200 border border-white/10">
                🇧🇯 {formation.campus}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              {formation.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              {formation.shortDescription}
            </p>

            {/* Quick meta bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
              <div>
                <span className="text-slate-400 block mb-0.5">Durée :</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-400" />
                  {formation.duration}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Niveau requis :</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  {formation.level}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Frais de scolarité :</span>
                <span className="font-bold text-emerald-400 text-sm">
                  {formation.price.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5">Modalité :</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-violet-400" />
                  {formation.mode}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={`/inscription?formationId=${formation.id}`}
                className="px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2 transform active:scale-95"
              >
                <span>Je candidate maintenant</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#programme"
                className="px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
              >
                Consulter le programme détaillé
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN TWO-COLUMN BODY */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main left content */}
          <div className="lg:col-span-8 space-y-14">
            {/* 9.2 PRÉSENTATION */}
            <section className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                Présentation détaillée
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                À propos de la formation
              </h2>
              <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line">
                {formation.fullDescription}
              </p>
            </section>

            {/* 9.3 CE QUE VOUS ALLEZ APPRENDRE (MODULES) */}
            <section id="programme" className="space-y-6 scroll-mt-24">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                    Curriculum Pédagogique
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                    Ce que vous allez apprendre
                  </h2>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {modules.length} modules structurés
                </span>
              </div>

              <div className="space-y-4">
                {modules.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-300 transition-all shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-blue-100/70 text-blue-800">
                        {m.moduleNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {m.duration}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{m.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{m.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 9.4 COMPÉTENCES ACQUISES */}
            <section className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
                Objectifs opérationnels
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                Compétences acquises
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {competencies.map((comp, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-150"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-800 font-medium">{comp}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 9.5 OUTILS UTILISÉS */}
            <section className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded">
                Environnement Technique
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                Outils &amp; Technologies maîtrisés
              </h2>
              <div className="flex flex-wrap gap-2.5 pt-2">
                {tools.map((t, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow-xs hover:border-violet-400 hover:text-violet-700 transition-colors"
                  >
                    <Wrench className="w-3.5 h-3.5 text-blue-600" />
                    {t}
                  </span>
                ))}
              </div>
            </section>

            {/* 9.6 DÉBOUCHÉS */}
            <section className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded">
                Opportunités de Carrière
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                Métiers accessibles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {jobs.map((j, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200 shadow-xs group hover:border-emerald-400 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                      {j}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* 9.7 PROJETS ÉTUDIANTS LIÉS */}
            {relatedProjects.length > 0 && (
              <section className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                  Réalisations concrètes
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                  Projets développés dans cette filière
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {relatedProjects.map((proj) => (
                    <div
                      key={proj.id}
                      className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs"
                    >
                      <div className="relative h-32 rounded-lg overflow-hidden bg-slate-100">
                        <Image
                          src={proj.coverImage}
                          alt={proj.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{proj.title}</h4>
                      <p className="text-xs text-slate-600 line-clamp-2">{proj.description}</p>
                      <Link
                        href="/projets-etudiants"
                        className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        Découvrir la fiche projet →
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 9.8 FAQ */}
            <section className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded">
                Questions Fréquentes
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
                Tout savoir sur cette formation
              </h2>
              <div className="space-y-3 pt-2">
                {faqs.map((faq, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-1.5"
                  >
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <HelpCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {faq.q}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed pl-5.5">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right sticky sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-6">
              {/* Enrollment Card */}
              <div className="bg-white rounded-2xl border-2 border-blue-600/30 p-6 shadow-xl space-y-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                    Candidature &amp; Inscription
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-slate-950">
                    {formation.price.toLocaleString("fr-FR")}{" "}
                    <span className="text-xs font-bold text-slate-500">FCFA</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Frais de dossier : {formation.registrationFee.toLocaleString("fr-FR")} FCFA + mensualités
                  </p>
                </div>

                {/* Next available promotions */}
                {promotions.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold text-slate-700 block">
                      Sessions disponibles :
                    </span>
                    {promotions.map((p) => (
                      <div
                        key={p.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-0.5"
                      >
                        <span className="font-bold text-slate-900 block">{p.name}</span>
                        <span className="text-[11px] text-slate-500">
                          Début : {p.startDate} • {p.campus}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Primary CTA */}
                <Link
                  href={`/inscription?formationId=${formation.id}`}
                  className="w-full py-3.5 rounded-xl text-center text-sm font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
                >
                  <span>Candidater à cette formation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Guarantees */}
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Paiement échelonné jusqu&apos;à {formation.installmentsCount} fois</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Accompagnement insertion professionnelle</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Attestation officielle &amp; Reçus certifiés</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Contact */}
              <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-5 space-y-2 text-xs">
                <span className="font-bold text-emerald-900 block text-sm">
                  Une question sur cette filière ?
                </span>
                <p className="text-emerald-700">
                  Échangez instantanément avec notre conseiller d&apos;orientation sur WhatsApp au <strong>+229 43 32 78 32</strong>.
                </p>
                <a
                  href="https://wa.me/22943327832"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block pt-1 font-bold text-emerald-800 hover:underline"
                >
                  Ouvrir WhatsApp →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 9.9 CTA FINAL */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950">
            Prêt à rejoindre la prochaine génération de professionnels ?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Les candidatures pour la session {formation.title} sont examinées par ordre d&apos;arrivée.
          </p>
          <div className="pt-2">
            <Link
              href={`/inscription?formationId=${formation.id}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all"
            >
              <span>Je candidate maintenant</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
