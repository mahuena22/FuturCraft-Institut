import Link from "next/link";
import {
  GraduationCap,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  BadgeCheck,
  Sparkles,
  Clock,
  MapPin,
  Star,
  ChevronRight,
} from "lucide-react";
import { getFormations } from "@/lib/data-service";
import { FAQAccordion } from "@/components/FAQAccordion";

export const revalidate = 3600;
export const metadata = {
  title: "Admissions & Tarifs | FuturCraft Institut Bénin",
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
      desc: "Remplissez le formulaire en quelques minutes et obtenez instantanément votre numéro de dossier unique.",
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
      q: "Quelles sont les conditions de diplôme pour intégrer FuturCraft ?",
      a: "La majorité de nos formations sont ouvertes à partir du niveau BEPC ou Baccalauréat. Pour la filière Intelligence Artificielle Avancée, un profil scientifique ou une appétence mathématique est recommandé.",
    },
    {
      q: "Peut-on payer la scolarité en plusieurs fois ?",
      a: "Absolument. Chaque cursus dispose d'un échéancier en 3 à 5 mensualités personnalisées. Le premier versement correspond aux frais d'inscription de 25 000 FCFA.",
    },
    {
      q: "Quels moyens de paiement sont acceptés au Bénin ?",
      a: "Nous acceptons MTN Mobile Money, Moov Money, les cartes bancaires Visa/Mastercard ainsi que les règlements en espèces à la caisse de notre campus de Godomey (Cotonou).",
    },
    {
      q: "Faut-il obligatoirement son propre ordinateur ?",
      a: "Un ordinateur personnel est fortement recommandé pour pratiquer chez vous. Cependant, nos laboratoires informatiques sont entièrement équipés et en libre accès pour nos étudiants inscrits.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR").format(price).replace(/\u202f/g, " ");

  return (
    <div className="min-h-screen bg-[var(--color-fc-bg)]">

      {/* Hero */}
      <section className="relative bg-[var(--color-fc-deep)] text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-dark opacity-15 pointer-events-none" />
        <div className="absolute right-0 top-0 w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[120px] pointer-events-none" />
        <div className="h-0.5 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-emerald-400/40 bg-emerald-500/10 text-emerald-200 text-xs font-bold mb-8 animate-fade-up">
            <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
            Admissions Ouvertes — Session 2026 · Inscriptions en cours
          </div>

          <h1 className="animate-fade-up delay-100 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight">
            Admissions &
            <span className="block text-gradient-brand mt-1">Modalités Financières</span>
          </h1>

          <p className="animate-fade-up delay-200 mt-6 text-blue-200/70 text-lg max-w-2xl mx-auto leading-8">
            Une formation d&apos;excellence accessible à tous, avec des tarifs
            transparents en FCFA et des facilités de paiement échelonné.
          </p>

          {/* Quick info pills */}
          <div className="animate-fade-up delay-300 mt-10 flex flex-wrap justify-center gap-3">
            {[
              { icon: Clock, text: "Inscription en 5 min" },
              { icon: MapPin, text: "Campus Godomey, Cotonou" },
              { icon: Smartphone, text: "Paiement MoMo accepté" },
              { icon: ShieldCheck, text: "Reçu numérique sécurisé" },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl glass border-white/10 text-sm text-white/70 font-medium">
                <Icon className="w-4 h-4 text-blue-300 shrink-0" />
                {text}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f8faff] to-transparent pointer-events-none" />
      </section>

      {/* ── 4 Steps ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="badge-brand mb-5 mx-auto w-fit">
            <Sparkles className="w-3 h-3" />
            Parcours d&apos;Admission
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-950">
            Comment rejoindre FuturCraft
            <span className="block text-gradient-brand">en 4 étapes ?</span>
          </h2>
          <p className="mt-4 text-slate-500 text-base leading-7">
            Un processus simple, rapide et entièrement digitalisé.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="relative p-7 rounded-3xl bg-white border border-slate-200 shadow-sm card-hover group hover:border-blue-200"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 right-0 translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-slate-200 to-slate-100 z-10" />
                )}

                {/* Step number */}
                <span className="font-display text-5xl font-black text-slate-100 group-hover:text-blue-100 transition-colors absolute top-5 right-5 leading-none pointer-events-none">
                  {st.num}
                </span>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${st.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Badge */}
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wide mb-3">
                  {st.highlight}
                </span>

                <h3 className="font-display text-lg font-bold text-slate-900 mb-2">{st.title}</h3>
                <p className="text-sm text-slate-500 leading-7">{st.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA under steps */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/inscription"
            className="btn-primary"
          >
            Démarrer mon inscription
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Pricing Table ── */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="badge-brand mb-5 mx-auto w-fit" style={{ background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', color: '#065f46', borderColor: 'rgba(16,185,129,0.2)' }}>
              <ShieldCheck className="w-3 h-3" />
              Transparence totale
            </div>
<h2 className="font-display text-3xl sm:text-4xl font-black text-[var(--color-fc-black)]">
              Grille Tarifaire Officielle
              <span className="block text-gradient-brand">Frais & Échéanciers</span>
            </h2>
            <p className="mt-4 text-slate-500 text-sm leading-7">
              Tous nos tarifs sont fermes, transparents et sans frais cachés.
              Paiement échelonné disponible pour chaque formation.
            </p>
          </div>

          {/* Table card */}
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[var(--color-fc-deep)] text-white">
                    <th className="py-4 px-5 font-semibold text-[11px] uppercase tracking-widest text-white/70">Formation</th>
                    <th className="py-4 px-5 font-semibold text-[11px] uppercase tracking-widest text-white/70">Filière</th>
                    <th className="py-4 px-5 font-semibold text-[11px] uppercase tracking-widest text-white/70">Durée</th>
                    <th className="py-4 px-5 font-semibold text-[11px] uppercase tracking-widest text-white/70">Dossier</th>
                    <th className="py-4 px-5 font-semibold text-[11px] uppercase tracking-widest text-white/70">Total (FCFA)</th>
                    <th className="py-4 px-5 font-semibold text-[11px] uppercase tracking-widest text-white/70">Facilité</th>
                    <th className="py-4 px-5 font-semibold text-[11px] uppercase tracking-widest text-white/70 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-fc-gray-light)]/50 pricing-table">
                  {formations.map((f, i) => (
                    <tr key={f.id} className="hover:bg-[var(--color-fc-primary)]/5 transition-colors group">
                      <td className="py-4 px-5 font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {f.title}
                      </td>
                      <td className="py-4 px-5">
                        <span className="px-2.5 py-1 rounded-lg bg-[var(--color-fc-gray-light)]/50 text-[var(--color-fc-gray-mid)] font-medium text-[11px]">
                          {f.category}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-600">{f.duration}</td>
                      <td className="py-4 px-5 text-slate-600 font-medium">
                        {formatPrice(f.registrationFee)} F
                      </td>
                      <td className="py-4 px-5">
                        <span className="font-black text-slate-950 text-sm">
                          {formatPrice(f.price)} FCFA
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-fc-cyan)]/10 text-[var(--color-fc-cyan)] font-bold text-[11px] border border-[var(--color-fc-cyan)]/20">
                          <CheckCircle2 className="w-3 h-3" />
                          {f.installmentsCount} tranches
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <Link
                          href={`/inscription?formationId=${f.id}`}
                          className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-[var(--color-fc-bg)] bg-[var(--color-fc-primary)] hover:bg-[var(--color-fc-deep)] transition-colors shadow-sm hover:shadow-md hover:shadow-[var(--color-fc-primary)]/20"
                        >
                          Candidater
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table footer */}
            <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex flex-wrap gap-3 text-xs text-slate-500">
<span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[var(--color-fc-cyan)]" />
                  MTN MoMo accepté
                </span>
                <span className="flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[var(--color-fc-cyan)]" />
                  Moov Money accepté
                </span>
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[var(--color-fc-gray-mid)]" />
                  Carte Visa/Mastercard
                </span>
              </div>
              <Link
                href="/inscription"
                className="text-xs font-bold text-[var(--color-fc-primary)] hover:text-[var(--color-fc-deep)] flex items-center gap-1"
              >
                S'inscrire maintenant <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="badge-brand mb-5 mx-auto w-fit">
            FAQ
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-slate-950">
            Questions Fréquentes
          </h2>
          <p className="mt-4 text-[var(--color-fc-gray-mid)] max-w-xl mx-auto text-sm leading-7">
            Tout ce que les futurs étudiants et parents souhaitent savoir
            avant de s&apos;inscrire à FuturCraft Institut.
          </p>
        </div>

        <div className="space-y-3">
          <FAQAccordion faqs={faqs} />
        </div>

        <div className="text-center mt-14 space-y-4">
          <p className="text-[var(--color-fc-gray-mid)] text-sm">Une question non listée ici ?</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--color-fc-gray-light)] text-sm font-semibold text-[var(--color-fc-gray-mid)] hover:bg-[var(--color-fc-gray-light)]/30 hover:border-[var(--color-fc-primary)] transition-all"
            >
              Contacter un conseiller
            </Link>
            <Link
              href="/inscription"
              className="btn-primary"
            >
              Démarrer mon inscription
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </section>
    </div>
  );
}
