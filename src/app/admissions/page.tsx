import Link from 'next/link';
import {
    GraduationCap,
    CreditCard,
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    Smartphone,
    Sparkles,
    Clock,
    MapPin,
    Star,
    ChevronRight,
} from 'lucide-react';
import { getFormations } from '@/lib/data-service';
import { FAQAccordion } from '@/components/FAQAccordion';
import { PageIntro } from '@/components/PageIntro';

export const revalidate = 3600;
export const metadata = {
    title: 'Admissions & Tarifs | FuturCraft Institut Bénin',
    description:
        "Modalités d'admission, grille tarifaire transparente en FCFA, facilités de paiement échelonné en 3 à 5 fois et FAQ.",
};

export default async function AdmissionsPage() {
    const formations = await getFormations();

  const steps = [
    {
      num: "01",
      title: "Exploration & Choix",
      desc: "Découvrez notre catalogue de 12 formations. Contactez un conseiller si vous hésitez sur votre orientation.",
      icon: GraduationCap,
      color: "var(--color-fc-primary)",
      highlight: "Catalogue gratuit",
    },
    {
      num: "02",
      title: "Candidature en ligne",
      desc: "Remplissez le formulaire et récupérez votre numéro de dossier.",
      icon: CheckCircle2,
      color: "var(--color-fc-cyan)",
      highlight: "Réponse instantanée",
    },
    {
      num: "03",
      title: "Validation & Paiement",
      desc: "Réglez vos frais d'inscription (25 000 FCFA) par MoMo, Moov Money ou au guichet pour réserver votre place.",
      icon: CreditCard,
      color: "var(--color-fc-light)",
      highlight: "Paiement sécurisé",
    },
    {
      num: "04",
      title: "Accès & Rentrée",
      desc: "Téléchargez votre reçu certifié, votre attestation et intégrez le groupe de promotion pour démarrer.",
      icon: Star,
      color: "var(--color-fc-cyan)",
      highlight: "Accès immédiat",
    },
  ];

    const faqs = [
        {
            q: 'Quelles sont les conditions de diplôme pour intégrer FuturCraft ?',
            a: 'La majorité de nos formations sont ouvertes à partir du niveau BEPC ou Baccalauréat. Pour la filière Intelligence Artificielle Avancée, un profil scientifique ou une appétence mathématique est recommandé.',
        },
        {
            q: 'Peut-on payer la scolarité en plusieurs fois ?',
            a: "Oui. Chaque cursus dispose d'un échéancier en 3 à 5 mensualités. Le premier versement correspond aux frais d'inscription de 25 000 FCFA.",
        },
        {
            q: 'Quels moyens de paiement sont acceptés au Bénin ?',
            a: 'Nous acceptons MTN Mobile Money, Moov Money, les cartes bancaires Visa/Mastercard ainsi que les règlements en espèces à la caisse de notre campus de Godomey (Cotonou).',
        },
        {
            q: 'Faut-il obligatoirement son propre ordinateur ?',
            a: 'Un ordinateur personnel est recommandé pour pratiquer chez soi. Les ordinateurs du campus sont disponibles pour les étudiants inscrits.',
        },
    ];

    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
    };

    const formatPrice = (price: number) =>
        new Intl.NumberFormat('fr-FR').format(price).replace(/\u202f/g, ' ');

    return (
        <div className="min-h-screen bg-[var(--color-fc-bg)]">
            <PageIntro
                eyebrow="Admissions ouvertes · Session 2026"
                title="Un parcours clair pour donner vie à ton projet."
                description="Découvre les étapes d’admission, compare les tarifs en FCFA et choisis le mode de paiement qui te convient."
            />

            <div className="page-container -mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                {[
                    { icon: Clock, text: 'Inscription rapide' },
                    { icon: MapPin, text: 'Campus Godomey' },
                    { icon: Smartphone, text: 'Paiement mobile accepté' },
                    { icon: ShieldCheck, text: 'Reçu numérique sécurisé' },
                ].map(({ icon: Icon, text }) => (
                    <div key={text} className="relative z-10 flex min-h-20 items-center gap-3 rounded-2xl border border-[var(--color-fc-gray-light)] bg-white p-4 text-sm font-semibold text-[var(--color-fc-black)]">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]">
                            <Icon className="h-4 w-4" />
                        </div>
                        {text}
                    </div>
                ))}
            </div>

            <section className="page-container py-16 sm:py-20 lg:py-24">
                <div className="mx-auto mb-14 max-w-3xl text-center">
                    <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
                        Parcours d&apos;admission
                    </p>
                    <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[var(--color-fc-black)] sm:text-4xl">
                        Rejoindre FuturCraft en <span className="text-[var(--color-fc-primary)]">4 étapes simples</span>
                    </h2>
                    <p className="mt-4 text-base leading-8 text-[var(--color-fc-gray-mid)]">
                        Un parcours clair, de la découverte à la rentrée en cohorte.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                    {steps.map((st) => {
                        const Icon = st.icon;
                        return (
                            <div key={st.num} className="relative rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-white p-6 transition-colors hover:border-[var(--color-fc-primary)]/25">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <span className="font-display text-3xl font-extrabold text-[var(--color-fc-gray-light)]">{st.num}</span>
                                </div>
                                <p className="mt-5 inline-flex rounded-full bg-[var(--color-fc-bg)] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-fc-gray-mid)]">
                                    {st.highlight}
                                </p>
                                <h3 className="mt-3 font-display text-lg font-bold text-[var(--color-fc-black)]">{st.title}</h3>
                                <p className="mt-2 text-sm leading-7 text-[var(--color-fc-gray-mid)]">{st.desc}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 flex justify-center">
                    <Link href="/inscription" className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-fc-deep)] px-7 py-4 text-sm font-bold text-white transition-colors hover:bg-[var(--color-fc-primary)]">
                        Démarrer ma candidature
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </section>

            <section className="border-y border-[var(--color-fc-gray-light)] bg-white py-20 lg:py-24">
                <div className="mx-auto max-w-[84rem] px-4 sm:px-6 lg:px-10">
                    <div className="mx-auto mb-12 max-w-3xl text-center">
                        <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
                            Tarifs & facilités
                        </p>
                        <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[var(--color-fc-black)] sm:text-4xl">
                            Une grille tarifaire claire, <span className="text-[var(--color-fc-primary)]">sans surprise</span>
                        </h2>
                        <p className="mt-4 text-base leading-8 text-[var(--color-fc-gray-mid)]">
                            Tous les tarifs sont en FCFA. Le paiement échelonné est possible selon la formation.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-[1.75rem] border border-[var(--color-fc-gray-light)]">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[760px] text-left text-sm">
                                <thead>
                                    <tr className="bg-[var(--color-fc-deep)] text-white">
                                        <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">Formation</th>
                                        <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">Durée</th>
                                        <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">Dossier</th>
                                        <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">Total</th>
                                        <th className="px-5 py-4 text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">Facilité</th>
                                        <th className="px-5 py-4 text-right text-[11px] font-bold uppercase tracking-[0.16em] text-white/65">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--color-fc-gray-light)]">
                                    {formations.map((f) => (
                                        <tr key={f.id} className="transition-colors hover:bg-[var(--color-fc-bg)]">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-[var(--color-fc-black)]">{f.title}</p>
                                                <p className="mt-0.5 text-xs text-[var(--color-fc-gray-mid)]">{f.category}</p>
                                            </td>
                                            <td className="px-5 py-4 text-[var(--color-fc-gray-mid)]">{f.duration}</td>
                                            <td className="px-5 py-4 text-[var(--color-fc-gray-mid)]">{formatPrice(f.registrationFee)} F</td>
                                            <td className="px-5 py-4 font-display font-bold text-[var(--color-fc-black)]">{formatPrice(f.price)} FCFA</td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-fc-surface)] px-3 py-1 text-xs font-semibold text-[var(--color-fc-primary)]">
                                                    <CheckCircle2 className="h-3.5 w-3.5" /> {f.installmentsCount} tranches
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Link href={`/inscription?formationId=${f.id}`} className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-fc-deep)] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[var(--color-fc-primary)]">
                                                    Candidater <ChevronRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex flex-col gap-3 border-t border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] px-5 py-4 text-xs text-[var(--color-fc-gray-mid)] sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-wrap gap-4">
                                <span className="inline-flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5 text-[var(--color-fc-primary)]" /> MTN MoMo</span>
                                <span className="inline-flex items-center gap-1.5"><Smartphone className="h-3.5 w-3.5 text-[var(--color-fc-primary)]" /> Moov Money</span>
                                <span className="inline-flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-[var(--color-fc-primary)]" /> Carte bancaire</span>
                            </div>
                            <Link href="/inscription" className="font-bold text-[var(--color-fc-primary)] hover:underline">Démarrer ma candidature →</Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 lg:py-24">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-10">
                    <div className="mb-12 text-center">
                        <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
                            FAQ
                        </p>
                        <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[var(--color-fc-black)] sm:text-4xl">Questions fréquentes</h2>
                        <p className="mt-4 text-base leading-8 text-[var(--color-fc-gray-mid)]">
                            Les réponses aux questions les plus courantes avant l&apos;inscription.
                        </p>
                    </div>

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

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(faqJsonLd),
                    }}
                />
            </section>
        </div>
    );
}
