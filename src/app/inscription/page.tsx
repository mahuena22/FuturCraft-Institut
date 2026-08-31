import { Suspense } from "react";
import { getFormations } from "@/lib/data-service";
import { InscriptionWizard } from "@/components/InscriptionWizard";
import { ClipboardList, ShieldCheck, Headphones, Hash } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Inscription en Ligne | FuturCraft Institut Bénin",
  description:
    "Candidature officielle en ligne : sélectionnez votre formation, remplissez vos informations et recevez votre matricule étudiant instantanément.",
};

export default async function InscriptionPage() {
  const formations = await getFormations();

  return (
    <div className="min-h-screen bg-slate-50/60 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Page Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold">
            <ClipboardList className="w-3.5 h-3.5" />
            <span>Processus d&apos;inscription 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Plateforme d&apos;Inscription en Ligne
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Inscrivez-vous en 5 étapes simples depuis votre smartphone ou ordinateur. Votre dossier sera immédiatement enregistré dans notre système académique.
          </p>
        </div>

        {/* Wizard wrapped in Suspense for useSearchParams */}
        <Suspense
          fallback={
            <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-200">
              Chargement du formulaire d&apos;inscription...
            </div>
          }
        >
          <InscriptionWizard formations={formations} />
        </Suspense>

        {/* Reassurance pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center max-w-3xl mx-auto pt-4">
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-blue-600 mx-auto mb-1.5" />
            <h4 className="font-bold text-xs text-slate-900">Données Sécurisées</h4>
            <p className="text-[11px] text-slate-500">Protection stricte et confidentialité de votre dossier</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <Hash className="w-5 h-5 text-indigo-600 mx-auto mb-1.5" />
            <h4 className="font-bold text-xs text-slate-900">Matricule Instantané</h4>
            <p className="text-[11px] text-slate-500">Attribution d&apos;un identifiant académique officiel dès validation</p>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
            <Headphones className="w-5 h-5 text-emerald-600 mx-auto mb-1.5" />
            <h4 className="font-bold text-xs text-slate-900">Assistance &amp; Orientation</h4>
            <p className="text-[11px] text-slate-500">Accompagnement de l&apos;équipe admissions par WhatsApp &amp; appel</p>
          </div>
        </div>
      </div>
    </div>
  );
}
