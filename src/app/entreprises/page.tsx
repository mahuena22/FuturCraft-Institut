import { getCompanyOffers, getValidatedStudentTalents } from "@/lib/data-service";
import { CompanyPortal } from "@/components/CompanyPortal";
import { Building2, CheckCircle2 } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Espace Entreprises | FuturCraft Institut Bénin",
  description:
    "Recrutez nos étudiants formés aux technologies modernes, déposez des offres de stage ou d'emploi et rejoignez notre réseau d'entreprises partenaires.",
};

export default async function EntreprisesPage() {
  const [offers, talents] = await Promise.all([
    getCompanyOffers(),
    getValidatedStudentTalents(),
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-fc-bg)]">
      <PageIntro
        eyebrow="Écosystème professionnel & talents"
        title="Rencontrez les talents qui feront avancer vos projets."
        description="Accédez aux profils formés sur des cas réels, prêts à intégrer vos équipes techniques, créatives ou marketing."
      />
      <div className="page-container py-14 sm:py-20">
        {/* Interactive Company Component */}
        <CompanyPortal initialOffers={offers} initialTalents={talents} />
      </div>
    </div>
  );
}
