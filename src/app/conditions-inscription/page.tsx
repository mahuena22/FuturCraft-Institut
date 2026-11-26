import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";

export const revalidate = 3600;
export const metadata = {
  title: "Conditions d'inscription | FuturCraft Institut Bénin",
  description:
    "Conditions d'admission, modalités de paiement, échéancier, validité des reçus et engagement des apprenants.",
};

export default function ConditionsInscriptionPage() {
  return (
    <div className="min-h-screen bg-[var(--color-fc-bg)]">
      <PageIntro
        eyebrow="Règlement & engagement"
        title="Conditions d'inscription"
        description="Cadre général applicable à la candidature, à l'admission et au suivi de la scolarité."
      />
      <div className="page-container max-w-3xl space-y-8 py-12 sm:py-16">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Admission</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            L&apos;admission est conditionnée par le dépôt d&apos;un dossier complet et le paiement des frais d&apos;inscription (25 000 FCFA),
            selon les modalités précisées sur la page Admissions. FuturCraft Institut se réserve le droit de refuser ou de reporter
            une candidature en cas de dossier incomplet ou de non-respect des prérequis.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Paiements & échéancier</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            La scolarité peut être réglée en plusieurs tranches selon la formation. Le premier versement correspond aux frais d&apos;inscription.
            Tout retard de paiement peut entraîner la suspension temporaire de l&apos;accès aux cours et supports pédagogiques.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Reçus & justificatifs</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            Chaque paiement validé donne lieu à la génération d&apos;un reçu numérique vérifiable via le numéro de reçu et le code de vérification.
            Il est recommandé de conserver ces éléments pour tout suivi administratif.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Engagement de l&apos;apprenant</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            L&apos;apprenant s&apos;engage à respecter le règlement intérieur, l&apos;assiduité, les délais de livraison des projets
            et les règles d&apos;usage des équipements du campus. Tout manquement grave peut entraîner une exclusion sans remboursement.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Annulation & report</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            Les demandes d&apos;annulation ou de report sont étudiées au cas par cas par l&apos;administration.
            Les frais d&apos;inscription déjà réglés ne sont en principe pas remboursables une fois la cohorte démarrée.
          </p>
        </section>

        <div className="pt-4">
          <Link href="/admissions" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-fc-primary)] hover:underline">
            Voir les admissions <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
