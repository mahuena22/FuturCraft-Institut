import { getCompanyOffers } from "@/lib/data-service";
import { CompanyPortal } from "@/components/CompanyPortal";
import { Building2, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Espace Entreprises | FuturCraft Institut Bénin",
  description:
    "Recrutez nos étudiants formés aux technologies modernes, déposez des offres de stage ou d'emploi et rejoignez notre réseau d'entreprises partenaires.",
};

export default async function EntreprisesPage() {
  const offers = await getCompanyOffers();

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Écosystème Professionnel &amp; Talents
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Espace Entreprises &amp; Recruteurs
          </h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Accédez au vivier de talents de FuturCraft Institut : des profils formés sur des cas réels, prêts à intégrer vos équipes techniques, créatives ou marketing.
          </p>
        </div>

        {/* Interactive Company Component */}
        <CompanyPortal initialOffers={offers} />
      </div>
    </div>
  );
}
