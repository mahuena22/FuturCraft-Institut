import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
  Smartphone,
  ExternalLink,
  Send,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[var(--color-fc-deep)] text-[var(--color-fc-gray-light)] border-t border-[var(--color-fc-primary)]/30">
      {/* Manifesto statement banner */}
      <div className="border-b border-[var(--color-fc-primary)]/30 bg-[var(--color-fc-primary)]/10 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase tracking-widest font-bold text-blue-400">
              Vision & Engagement
            </span>
            <p className="text-xl md:text-2xl font-medium text-white italic mt-1 leading-snug">
              « Nous ne formons pas simplement des étudiants. Nous aidons une génération à construire, créer et transformer son avenir. »
            </p>
            <span className="text-xs text-slate-400 mt-2 block">
              FuturCraft Institut — Bénin & International
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/inscription"
              className="px-5 py-3 rounded-xl text-sm font-bold text-[var(--color-fc-bg)] bg-[var(--color-fc-primary)] hover:bg-[var(--color-fc-deep)] shadow-lg shadow-[var(--color-fc-primary)]/30 transition-all flex items-center gap-2"
            >
              <span>Rejoindre la cohorte 2026</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/espace-etudiant"
              className="px-5 py-3 rounded-xl text-sm font-semibold text-[var(--color-fc-gray-light)] hover:text-[var(--color-fc-bg)] bg-[var(--color-fc-primary)]/10 hover:bg-[var(--color-fc-primary)]/20 border border-[var(--color-fc-primary)]/30 transition-all"
            >
              Espace Étudiant
            </Link>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-auto rounded-xl bg-[var(--color-fc-bg)] border border-[var(--color-fc-primary)]/30 flex items-center justify-center p-1.5">
                <Image
                  src="/images/Logo-crop.png"
                  alt="Logo FuturCraft Institut"
                  width={507}
                  height={340}
                  className="h-7 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-[var(--color-fc-bg)]">
                  FuturCraft<span className="text-[var(--color-fc-cyan)]">.</span>
                </span>
                <span className="block text-[11px] uppercase tracking-wider text-[var(--color-fc-gray-mid)] font-semibold">
                  Institut de Formation Numérique
                </span>
              </div>
            </div>

            <p className="text-sm text-[var(--color-fc-gray-mid)] leading-relaxed max-w-sm">
              Institut de formation pratique aux métiers du numérique, axé sur la réalisation de projets concrets et l&apos;accompagnement des talents au Bénin et en Afrique de l&apos;Ouest.
            </p>

            {/* Campus details */}
            <div className="space-y-2 pt-2 text-xs text-[var(--color-fc-gray-mid)]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[var(--color-fc-cyan)] shrink-0 mt-0.5" />
                <span>
                  <strong>Adresse :</strong> Godomey, Supermarché O Bénin, avant pk14, Abomey/Calavi, Bénin
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[var(--color-fc-cyan)] shrink-0" />
                <span>Ligne directe / WhatsApp : +229 43 32 78 32</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[var(--color-fc-cyan)] shrink-0" />
                <span>Standard inscriptions : +229 01 97 30 30 50</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--color-fc-cyan)] shrink-0" />
                <span>eentreprisebenin@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[var(--color-fc-cyan)] shrink-0" />
                <span>contact@futurcraftinstitut.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-[var(--color-fc-cyan)] shrink-0" />
                <span>WhatsApp : +229 43 32 78 32</span>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="pt-2">
              <span className="text-[11px] text-[var(--color-fc-gray-mid)] block mb-2.5 font-medium">Suivez FuturCraft :</span>
              <div className="flex items-center gap-2.5">
                {[
                  { name: "Facebook", label: "FB", url: "https://facebook.com/futurcraftinstitue" },
                  { name: "Instagram", label: "IG", url: "https://instagram.com/futurcraft_institut" },
                  { name: "LinkedIn", label: "IN", url: "https://linkedin.com/company/futurcraft-institut" },
                  { name: "TikTok", label: "TT", url: "https://tiktok.com/@futurcraft_institut" },
                ].map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Page ${social.name} de FuturCraft`}
                    className="w-9 h-9 rounded-xl bg-[var(--color-fc-primary)]/10 border border-[var(--color-fc-primary)]/30 flex items-center justify-center text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-bg)] hover:border-[var(--color-fc-primary)] hover:bg-[var(--color-fc-primary)]/30 transition-all text-xs font-bold"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Payment security badges */}
            <div className="pt-2">
              <span className="text-[11px] text-[var(--color-fc-gray-mid)] block mb-2 font-medium">Moyens de paiement acceptés :</span>
              <div className="flex items-center gap-2 flex-wrap text-xs text-[var(--color-fc-gray-light)]">
                <span className="px-2.5 py-1 rounded bg-[var(--color-fc-deep)] border border-[var(--color-fc-primary)]/30 flex items-center gap-1.5 font-semibold text-[var(--color-fc-cyan)]">
                  <Smartphone className="w-3.5 h-3.5" /> MTN MoMo
                </span>
                <span className="px-2.5 py-1 rounded bg-[var(--color-fc-deep)] border border-[var(--color-fc-primary)]/30 flex items-center gap-1.5 font-semibold text-[var(--color-fc-cyan)]">
                  <Smartphone className="w-3.5 h-3.5" /> Moov Money
                </span>
                <span className="px-2.5 py-1 rounded bg-[var(--color-fc-deep)] border border-[var(--color-fc-primary)]/30 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-[var(--color-fc-gray-mid)]" /> CB / Visa
                </span>
                <span className="px-2.5 py-1 rounded bg-[var(--color-fc-deep)] border border-[var(--color-fc-primary)]/30">
                  Caisse physique
                </span>
              </div>
            </div>
          </div>

          {/* Formations Col */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-[var(--color-fc-bg)] uppercase tracking-wider text-xs border-b border-[var(--color-fc-primary)]/30 pb-2">
              Formations Phares
            </h4>
            <ul className="space-y-2 text-[var(--color-fc-gray-mid)] text-xs">
              <li>
                <Link href="/formation/developpement-web-fullstack" className="hover:text-[var(--color-fc-cyan)] transition-colors">
                  Développement Web Fullstack
                </Link>
              </li>
              <li>
                <Link href="/formation/developpement-intelligence-artificielle" className="hover:text-[var(--color-fc-cyan)] transition-colors">
                  Développement en IA & ML
                </Link>
              </li>
              <li>
                <Link href="/formation/maitrise-outils-intelligence-artificielle" className="hover:text-[var(--color-fc-cyan)] transition-colors">
                  Maîtrise des Outils IA (1 mois)
                </Link>
              </li>
              <li>
                <Link href="/formation/web-design-ui-ux" className="hover:text-[var(--color-fc-cyan)] transition-colors">
                  Web Design (UI/UX)
                </Link>
              </li>
              <li>
                <Link href="/formation/pilotage-de-drone" className="hover:text-[var(--color-fc-cyan)] transition-colors">
                  Pilotage Professionnel de Drone
                </Link>
              </li>
              <li>
                <Link href="/formation/graphisme-et-serigraphie" className="hover:text-[var(--color-fc-cyan)] transition-colors">
                  Graphisme et Sérigraphie
                </Link>
              </li>
              <li>
                <Link href="/formation/marketing-digital" className="hover:text-[var(--color-fc-cyan)] transition-colors">
                  Marketing Digital & Growth
                </Link>
              </li>
              <li>
                <Link href="/formation/photographie-cadrage-et-montage-video" className="hover:text-[var(--color-fc-cyan)] transition-colors">
                  Audiovisuel & Montage Vidéo
                </Link>
              </li>
              <li>
                <Link href="/formations" className="text-[var(--color-fc-cyan)] font-semibold hover:underline inline-flex items-center gap-1 mt-1">
                  Voir toutes les 12 formations <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

{/* Admissions & Écosystème */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-[var(--color-fc-bg)] uppercase tracking-wider text-xs border-b border-[var(--color-fc-primary)]/30 pb-2">
              Admissions & Vie
            </h4>
            <ul className="space-y-2 text-[var(--color-fc-gray-mid)] text-xs">
              <li>
                <Link href="/admissions" className="hover:text-[var(--color-fc-cyan)] transition-colors">
                  Modalités & Tarifs en FCFA
                </Link>
              </li>
              <li>
                <Link href="/inscription" className="hover:text-[var(--color-fc-cyan)] transition-colors">
                  Candidater en ligne
                </Link>
              </li>
              <li>
                <Link href="/vie-a-futurcraft" className="hover:text-[var(--color-fc-cyan)] transition-colors">
                  Vie à FuturCraft & Événements
                </Link>
              </li>
              <li>
                <Link href="/projets-etudiants" className="hover:text-[var(--color-fc-cyan)] transition-colors">
                  Galerie des Projets Étudiants
                </Link>
              </li>
              <li>
                <Link href="/entreprises" className="hover:text-[var(--color-fc-cyan)] transition-colors">
                  Espace Recruteurs & Partenaires
                </Link>
              </li>
              <li>
                <Link href="/recu" className="hover:text-[var(--color-fc-cyan)] transition-colors text-[var(--color-fc-cyan)] font-medium">
                  Vérifier l'authenticité d'un reçu
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="hover:text-[var(--color-fc-cyan)] transition-colors">
                  Actualités & Blog Tech
                </Link>
              </li>
            </ul>
          </div>

          {/* Espace & Sécurité */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-[var(--color-fc-bg)] uppercase tracking-wider text-xs border-b border-[var(--color-fc-primary)]/30 pb-2">
              Plateformes Sécurisées
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[var(--color-fc-deep)] border border-[var(--color-fc-primary)]/30">
                <span className="font-semibold text-[var(--color-fc-bg)] block mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-fc-cyan)]" />
                  Espace Étudiant
                </span>
                <p className="text-[var(--color-fc-gray-mid)] text-[11px] mb-2">
                  Suivi des mensualités, téléchargement des reçus numériques et attestations.
                </p>
                <Link
                  href="/espace-etudiant"
                  className="text-[var(--color-fc-cyan)] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Accéder à mon espace <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-3 rounded-xl bg-[var(--color-fc-deep)] border border-[var(--color-fc-primary)]/30">
                <span className="font-semibold text-[var(--color-fc-cyan)] block mb-1">
                  Espace Administration
                </span>
                <p className="text-[var(--color-fc-gray-mid)] text-[11px] mb-2">
                  Gestion des inscriptions, encaissements, promotions et reçus.
                </p>
                <Link
                  href="/admin"
                  className="text-[var(--color-fc-cyan)] font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Console de gestion <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

{/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-fc-primary)]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-fc-gray-mid)]">
          <p>© {new Date().getFullYear()} FuturCraft Institut. Tous droits réservés. Enregistré en République du Bénin.</p>
          <div className="flex items-center gap-6">
            <Link href="/institut" className="hover:text-[var(--color-fc-cyan)]">À propos de l&apos;Institut</Link>
            <Link href="/admissions" className="hover:text-[var(--color-fc-cyan)]">Conditions d&apos;inscription</Link>
            <Link href="/contact" className="hover:text-[var(--color-fc-cyan)]">Contact & Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
