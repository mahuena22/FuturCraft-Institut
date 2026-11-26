import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";

export const revalidate = 3600;
export const metadata = {
  title: "Politique de confidentialité | FuturCraft Institut Bénin",
  description:
    "Politique de confidentialité et protection des données personnelles des candidats, étudiants et partenaires de FuturCraft Institut.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[var(--color-fc-bg)]">
      <PageIntro
        eyebrow="Protection des données"
        title="Politique de confidentialité"
        description="Comment FuturCraft Institut collecte, utilise et protège vos données personnelles."
      />
      <div className="page-container max-w-3xl space-y-8 py-12 sm:py-16">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Données collectées</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            Dans le cadre de la candidature, de l&apos;inscription et du suivi pédagogique, FuturCraft Institut collecte :
            nom et prénoms, coordonnées (téléphone, email), adresse, niveau d&apos;études, formation choisie,
            documents administratifs (photo, pièce d&apos;identité, CV), informations de paiement et données académiques.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Finalités du traitement</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            <li>Gestion des candidatures, inscriptions et matricules étudiants.</li>
            <li>Suivi pédagogique, évaluation et délivrance des attestations.</li>
            <li>Gestion des paiements, échéanciers et reçus.</li>
            <li>Communication institutionnelle et accompagnement (orientation, rappels).</li>
            <li>Amélioration de la qualité des formations et services.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Base légale et conservation</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            Le traitement repose sur le consentement de la personne concernée et/ou l&apos;exécution de la relation contractuelle de formation.
            Les données sont conservées pendant la durée de la formation et pour les besoins administratifs et légaux post-formation,
            puis archivées ou supprimées selon les obligations applicables.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Partage des données</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            Les données ne sont pas vendues. Elles peuvent être partagées avec les partenaires pédagogiques, entreprises partenaires
            (dans le cadre de stages/emplois) et prestataires techniques (hébergement, paiement) dans la limite nécessaire à la finalité.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Sécurité</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            FuturCraft Institut met en œuvre des mesures techniques et organisationnelles appropriées pour protéger les données
            contre l&apos;accès non autorisé, la perte ou la divulgation. L&apos;accès aux espaces étudiant et administration est sécurisé par authentification.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Vos droits</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;opposition et de suppression de vos données personnelles,
            dans les limites prévues par la réglementation applicable. Pour exercer ces droits, contactez-nous à futurcraftinstitut@gmail.com.
          </p>
        </section>

        <div className="pt-4">
          <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-fc-primary)] hover:underline">
            Nous contacter <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
