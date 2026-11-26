import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";
import { FAQAccordion } from "@/components/FAQAccordion";

export const revalidate = 3600;
export const metadata = {
  title: "FAQ | FuturCraft Institut Bénin",
  description:
    "Réponses aux questions fréquentes sur les formations, admissions, paiements, certifications et vie sur le campus.",
};

const faqs = [
  { q: "Quels sont les prérequis pour intégrer une formation ?", a: "La majorité de nos formations sont ouvertes à partir du niveau BEPC ou Baccalauréat. La motivation, la rigueur et la régularité dans la pratique sont les critères déterminants." },
  { q: "Peut-on payer la scolarité en plusieurs fois ?", a: "Oui. Chaque cursus dispose d'un échéancier en 3 à 5 mensualités. Le premier versement correspond aux frais d'inscription de 25 000 FCFA." },
  { q: "Quels moyens de paiement sont acceptés ?", a: "MTN Mobile Money, Moov Money, cartes bancaires Visa/Mastercard et règlements en espèces à la caisse du campus de Godomey." },
  { q: "Faut-il obligatoirement son propre ordinateur ?", a: "Un ordinateur personnel est recommandé pour pratiquer chez soi. Les ordinateurs du campus sont disponibles pour les étudiants inscrits." },
  { q: "Obtient-on une certification reconnue ?", a: "Oui. À l'issue de la formation et après validation du projet devant jury professionnel, vous recevez le Certificat Professionnel de Compétences FuturCraft avec vérification numérique par QR Code." },
  { q: "Les cours sont-ils en présentiel ou en ligne ?", a: "Les formations sont dispensées en présentiel sur le campus de Godomey. Certains ateliers et mentorats peuvent être complétés à distance." },
  { q: "Quelle est la taille des cohortes ?", a: "Les cohortes sont volontairement limitées pour garantir un accompagnement personnalisé et un suivi rapproché." },
  { q: "Comment vérifier l'authenticité d'un reçu ?", a: "Utilisez la page 'Vérifier un reçu' avec le numéro de reçu et le code de vérification fournis lors du paiement." },
  { q: "Peut-on visiter le campus avant de s'inscrire ?", a: "Oui, contactez-nous par WhatsApp ou téléphone pour planifier une visite guidée du campus de Godomey." },
  { q: "Les formations permettent-elles de trouver un emploi ?", a: "FuturCraft accompagne vers l'emploi et l'entrepreneuriat via des projets réels, un portfolio et un réseau d'entreprises partenaires. L'insertion dépend aussi de l'engagement de l'apprenant." },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[var(--color-fc-bg)]">
      <PageIntro
        eyebrow="Questions fréquentes"
        title="Tout ce que tu dois savoir avant de candidater."
        description="Les réponses aux questions les plus courantes sur les formations, admissions, paiements, certifications et la vie sur le campus."
      />
      <div className="page-container max-w-3xl py-14 sm:py-20">
        <FAQAccordion faqs={faqs} />
        <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-fc-gray-light)] bg-white px-6 py-3.5 text-sm font-semibold text-[var(--color-fc-black)] transition-colors hover:border-[var(--color-fc-primary)]/30 hover:text-[var(--color-fc-primary)]">
            Contacter un conseiller
          </Link>
          <Link href="/inscription" className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-fc-deep)] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-fc-primary)]">
            Démarrer ma candidature <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
