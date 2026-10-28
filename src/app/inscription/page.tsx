import { Suspense } from "react";
import { getFormations } from "@/lib/data-service";
import { InscriptionWizard } from "@/components/InscriptionWizard";
import { ShieldCheck, Headphones, Hash } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Inscription en Ligne | FuturCraft Institut Bénin",
  description:
    "Candidature officielle en ligne : sélectionnez votre formation, remplissez vos informations et recevez votre matricule étudiant instantanément.",
};

export default async function InscriptionPage() {
  const formations = await getFormations();

  return (
    <div className="min-h-screen bg-[var(--color-fc-bg)]">
      <PageIntro
        eyebrow="Candidature · Session 2026"
        title="Votre prochain chapitre commence ici."
        description="Complétez votre dossier en quelques étapes depuis votre téléphone ou votre ordinateur. Notre équipe admissions vous accompagne."
      />
      <div className="page-container max-w-5xl space-y-10 py-12 sm:py-16">

        {/* Wizard wrapped in Suspense for useSearchParams */}
        <Suspense
          fallback={
            <div className="rounded-3xl border border-[var(--color-fc-gray-light)] bg-white p-12 text-center text-[var(--color-fc-gray-mid)]">
              Chargement du formulaire d&apos;inscription...
            </div>
          }
        >
          <InscriptionWizard formations={formations} />
        </Suspense>

        {/* Reassurance pills */}
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-4 pt-4 text-center sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--color-fc-gray-light)] bg-white p-5 shadow-sm">
            <ShieldCheck className="mx-auto mb-2 h-5 w-5 text-[var(--color-fc-primary)]" />
            <h4 className="text-xs font-bold text-[var(--color-fc-black)]">Données sécurisées</h4>
            <p className="text-[11px] leading-5 text-[var(--color-fc-gray-mid)]">Protection stricte et confidentialité de votre dossier</p>
          </div>
          <div className="rounded-2xl border border-[var(--color-fc-gray-light)] bg-white p-5 shadow-sm">
            <Hash className="mx-auto mb-2 h-5 w-5 text-[var(--color-fc-primary)]" />
            <h4 className="text-xs font-bold text-[var(--color-fc-black)]">Matricule instantané</h4>
            <p className="text-[11px] leading-5 text-[var(--color-fc-gray-mid)]">Attribution d&apos;un identifiant académique officiel dès validation</p>
          </div>
          <div className="rounded-2xl border border-[var(--color-fc-gray-light)] bg-white p-5 shadow-sm">
            <Headphones className="mx-auto mb-2 h-5 w-5 text-[var(--color-fc-primary)]" />
            <h4 className="text-xs font-bold text-[var(--color-fc-black)]">Assistance &amp; orientation</h4>
            <p className="text-[11px] leading-5 text-[var(--color-fc-gray-mid)]">Accompagnement de l&apos;équipe admissions par WhatsApp &amp; appel</p>
          </div>
        </div>
      </div>
    </div>
  );
}
