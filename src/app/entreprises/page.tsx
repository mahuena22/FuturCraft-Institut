import { getCompanyOffers, getValidatedStudentTalents } from "@/lib/data-service";
import { CompanyPortal } from "@/components/CompanyPortal";
import Image from "next/image";
import { Briefcase, Building2, Users, ShieldCheck, Sparkles } from "lucide-react";

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
      {/* Hero Header */}
      <section className="relative bg-[var(--color-fc-deep)] text-white overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-banniere.jpeg"
            alt="FuturCraft Institut"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#051269]/90 via-[#051269]/85 to-[#051269]/95" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="absolute inset-0 bg-grid-dark opacity-15 pointer-events-none z-[1]" />
        <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none z-[1]" />
        <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent relative z-10" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center space-y-6">
          <div className="badge-brand mb-2 mx-auto w-fit text-blue-300 border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Écosystème Professionnel &amp; Talents
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            Espace Entreprises &amp;
            <span className="block text-gradient-brand mt-1">
              Recruteurs Partenaires
            </span>
          </h1>

          <p className="mt-4 text-blue-200/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Accédez directement au vivier de talents de FuturCraft Institut. Recrutez des profils opérationnels formés sur des projets réels ou rejoignez nos entreprises partenaires.
          </p>

          {/* Key metrics pills */}
          <div className="pt-4 flex flex-wrap justify-center gap-3">
            {[
              { icon: Users, text: "Vivier de talents certifiés" },
              { icon: Briefcase, text: "Dépôt d'offre 100% gratuit" },
              { icon: Building2, text: "Partenariats sur-mesure" },
              { icon: ShieldCheck, text: "Profils validés par l'Institut" },
            ].map(({ icon: Icon, text }) => (
              <span
                key={text}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border-white/10 text-xs sm:text-sm text-white font-medium"
              >
                <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                {text}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-fc-bg)] to-transparent pointer-events-none" />
      </section>

      {/* Main Content */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CompanyPortal initialOffers={offers} initialTalents={talents} />
      </section>
    </div>
  );
}
