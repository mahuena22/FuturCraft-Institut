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
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Manifesto statement banner */}
      <div className="border-b border-slate-800/80 bg-gradient-to-r from-blue-950/60 via-slate-950 to-indigo-950/60 py-10 px-4">
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
              className="px-5 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <span>Rejoindre la cohorte 2026</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/espace-etudiant"
              className="px-5 py-3 rounded-xl text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all"
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
              <div className="h-9 w-auto rounded-xl bg-white border border-slate-700 flex items-center justify-center p-1.5">
                <Image
                  src="/images/Logo-crop.png"
                  alt="Logo FuturCraft Institut"
                  width={507}
                  height={340}
                  className="h-7 w-auto object-contain"
                />
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white">
                  FuturCraft<span className="text-blue-500">.</span>
                </span>
                <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                  Institut de Formation Numérique
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Institut de formation pratique aux métiers du numérique, axé sur la réalisation de projets concrets et l&apos;accompagnement des talents au Bénin et en Afrique de l&apos;Ouest.
            </p>

            {/* Campus details */}
            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Adresse :</strong> Godomey, Supermarché O Bénin, avant pk14, Abomey/Calavi, Bénin
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Ligne directe / WhatsApp : +229 43 32 78 32</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Standard inscriptions : +229 01 97 30 30 50</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>eentreprisebenin@gmail.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contact@futurcraftinstitut.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp : +229 43 32 78 32</span>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-500 block mb-2.5 font-medium">Suivez FuturCraft :</span>
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
                    className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500 hover:bg-blue-600/20 transition-all text-xs font-bold"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Payment security badges */}
            <div className="pt-2">
              <span className="text-[11px] text-slate-500 block mb-2 font-medium">Moyens de paiement acceptés :</span>
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-300">
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 flex items-center gap-1.5 font-semibold text-yellow-400">
                  <Smartphone className="w-3.5 h-3.5" /> MTN MoMo
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 flex items-center gap-1.5 font-semibold text-blue-400">
                  <Smartphone className="w-3.5 h-3.5" /> Moov Money
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" /> CB / Visa
                </span>
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  Caisse physique
                </span>
              </div>
            </div>
          </div>

          {/* Formations Col */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              Formations Phares
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <Link href="/formation/developpement-web-fullstack" className="hover:text-blue-400 transition-colors">
                  Développement Web Fullstack
                </Link>
              </li>
              <li>
                <Link href="/formation/developpement-intelligence-artificielle" className="hover:text-blue-400 transition-colors">
                  Développement en IA & ML
                </Link>
              </li>
              <li>
                <Link href="/formation/maitrise-outils-intelligence-artificielle" className="hover:text-blue-400 transition-colors">
                  Maîtrise des Outils IA (1 mois)
                </Link>
              </li>
              <li>
                <Link href="/formation/web-design-ui-ux" className="hover:text-blue-400 transition-colors">
                  Web Design (UI/UX)
                </Link>
              </li>
              <li>
                <Link href="/formation/pilotage-de-drone" className="hover:text-blue-400 transition-colors">
                  Pilotage Professionnel de Drone
                </Link>
              </li>
              <li>
                <Link href="/formation/graphisme-et-serigraphie" className="hover:text-blue-400 transition-colors">
                  Graphisme et Sérigraphie
                </Link>
              </li>
              <li>
                <Link href="/formation/marketing-digital" className="hover:text-blue-400 transition-colors">
                  Marketing Digital & Growth
                </Link>
              </li>
              <li>
                <Link href="/formation/photographie-cadrage-et-montage-video" className="hover:text-blue-400 transition-colors">
                  Audiovisuel & Montage Vidéo
                </Link>
              </li>
              <li>
                <Link href="/formations" className="text-blue-400 font-semibold hover:underline inline-flex items-center gap-1 mt-1">
                  Voir toutes les 12 formations <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Admissions & Écosystème */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              Admissions & Vie
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <Link href="/admissions" className="hover:text-blue-400 transition-colors">
                  Modalités & Tarifs en FCFA
                </Link>
              </li>
              <li>
                <Link href="/inscription" className="hover:text-blue-400 transition-colors">
                  Candidater en ligne
                </Link>
              </li>
              <li>
                <Link href="/vie-a-futurcraft" className="hover:text-blue-400 transition-colors">
                  Vie à FuturCraft & Événements
                </Link>
              </li>
              <li>
                <Link href="/projets-etudiants" className="hover:text-blue-400 transition-colors">
                  Galerie des Projets Étudiants
                </Link>
              </li>
              <li>
                <Link href="/entreprises" className="hover:text-blue-400 transition-colors">
                  Espace Recruteurs & Partenaires
                </Link>
              </li>
              <li>
                <Link href="/recu" className="hover:text-blue-400 transition-colors text-emerald-400 font-medium">
                  Vérifier l&apos;authenticité d&apos;un reçu
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="hover:text-blue-400 transition-colors">
                  Actualités & Blog Tech
                </Link>
              </li>
            </ul>
          </div>

          {/* Espace & Sécurité */}
          <div className="space-y-3 text-sm">
            <h4 className="font-semibold text-white uppercase tracking-wider text-xs border-b border-slate-800 pb-2">
              Plateformes Sécurisées
            </h4>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-semibold text-white block mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  Espace Étudiant
                </span>
                <p className="text-slate-400 text-[11px] mb-2">
                  Suivi des mensualités, téléchargement des reçus numériques et attestations.
                </p>
                <Link
                  href="/espace-etudiant"
                  className="text-blue-400 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Accéder à mon espace <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-semibold text-violet-300 block mb-1">
                  Espace Administration
                </span>
                <p className="text-slate-400 text-[11px] mb-2">
                  Gestion des inscriptions, encaissements, promotions et reçus.
                </p>
                <Link
                  href="/admin"
                  className="text-violet-400 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Console de gestion <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FuturCraft Institut. Tous droits réservés. Enregistré en République du Bénin.</p>
          <div className="flex items-center gap-6">
            <Link href="/institut" className="hover:text-slate-400">À propos de l&apos;Institut</Link>
            <Link href="/admissions" className="hover:text-slate-400">Conditions d&apos;inscription</Link>
            <Link href="/contact" className="hover:text-slate-400">Contact & Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
