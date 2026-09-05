import Image from "next/image";
import {
  Target,
  Eye,
  HeartHandshake,
  Users,
  MapPin,
  CheckCircle2,
  Award,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "L'Institut | FuturCraft Institut Bénin",
  description:
    "Histoire, mission, vision, valeurs et équipe dirigeante de FuturCraft Institut, centre d'excellence numérique fondé par Gauthier I. ORE au Bénin.",
};

export default function InstitutPage() {
  const values = [
    { title: "Innovation", desc: "Explorer les technologies d'avant-garde (IA générative, drones, frameworks modernes) avant tout le monde." },
    { title: "Créativité", desc: "Encourager la pensée originale, l'esprit d'initiative et l'art de concevoir des solutions africaines uniques." },
    { title: "Excellence", desc: "Viser les standards internationaux de qualité de code, de rigueur d'ingénierie et de rendu professionnel." },
    { title: "Pratique", desc: "80% de temps d'écran et de manipulation réelle. Aucun diplôme sans réalisation d'un projet fonctionnel." },
    { title: "Collaboration", desc: "Le travail d'équipe en méthode Agile comme en entreprise, avec mentorat bienveillant et esprit de corps." },
    { title: "Impact", desc: "Créer de la valeur concrète pour l'économie béninoise et le continent africain à travers la technologie." },
  ];

  const team = [
    {
      name: "Herman HOUNKPE",
      role: "Formateur en Développement Web & Technologies Fullstack",
      image: "/images/Herman.jpg",
      bio: "Forme les futurs développeurs à maîtriser le développement web et les technologies fullstack, du code à la mise en production.",
    },
    {
      name: "Yoan Melson DANSOU",
      role: "Directeur des stages et emplois",
      image: "/images/Yoan-DANSOU.jpg",
      bio: "Connecte les talents de FuturCraft aux entreprises et startups pour traduire les compétences acquises en opportunités professionnelles concrètes.",
    },
    {
      name: "Gauthier I. ORE",
      role: "Co-founder & Prompt engineer",
      image: "/images/Gauthier-ORE.jpg",
      bio: "Co-fondateur et expert en prompt engineering, il explore les usages avancés de l'IA générative pour former la prochaine génération.",
    },
    {
      name: "SEDAGONGJI Hugues Mahugnon",
      role: "Formateur en cadrage & montage",
      image: "/images/Mahugnon.jpg",
      bio: "Transmet les techniques de cadrage et de montage pour des productions multimédia et vidéos à la hauteur des standards professionnels.",
    },
    {
      name: "Merveil SUSUNI",
      role: "Développeur web",
      image: "/images/Merveil.jpg",
      bio: "Intervient sur les projets web concrets et accompagne les étudiants dans la maîtrise des technologies du développement d'applications.",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-slate-950 text-white py-16 lg:py-24 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-950/80 px-3 py-1 rounded-full border border-blue-800">
            L&apos;Institut d&apos;Excellence
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto">
            Bâtir la Prochaine Génération de Talents Numériques Africains
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            « Nous ne formons pas simplement des étudiants. Nous aidons une génération à construire, créer et transformer son avenir. »
          </p>
        </div>
      </section>

      {/* 21.1 HISTOIRE, MISSION, VISION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
              Notre Histoire
            </span>
            <h2 className="text-3xl font-extrabold text-slate-950 leading-tight">
              Une ambition née pour combler le fossé entre diplômes et compétences réelles
            </h2>
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                FuturCraft Institut est né d&apos;un constat lucide sur le marché de l&apos;emploi en Afrique de l&apos;Ouest : des milliers de diplômés sortent chaque année d&apos;écoles supérieures avec des connaissances théoriques dépassées, tandis que les entreprises et startups peinent désespérément à recruter des développeurs opérationnels, des designers UI/UX ou des spécialistes en intelligence artificielle.
              </p>
              <p>
                Sous l&apos;impulsion de Gauthier I. ORE et d&apos;une équipe d&apos;ingénieurs et pédagogues engagés, FuturCraft s&apos;est donné pour mission de proposer un modèle disruptif : 80% de pratique en atelier, immersion en conditions d&apos;entreprise réelles, et mentorat continu par des professionnels en activité.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-150 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Notre Mission</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Former des talents agiles, techniquement solides et dotés d&apos;un savoir-faire directement valorisable sur le marché local et mondial du numérique.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-violet-50/60 border border-violet-150 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Notre Vision</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Faire du Bénin le hub d&apos;ingénierie et de créativité numérique le plus dynamique d&apos;Afrique subsaharienne, capable d&apos;exporter des compétences d&apos;élite.
              </p>
            </div>
          </div>
        </div>

        {/* 21.2 NOS 6 VALEURS */}
        <div className="space-y-8 pt-8 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded">
              Notre ADN
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Les 6 Valeurs Cardinales de FuturCraft
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] space-y-2 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <h3 className="text-base font-bold text-slate-900">{v.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-6">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 21.3 NOTRE ÉQUIPE */}
        <div className="space-y-8 pt-8 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded">
              Direction &amp; Pédagogie
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              L&apos;Équipe FuturCraft Institut
            </h2>
            <p className="text-xs text-slate-500">
              Des professionnels engagés au quotidien pour la réussite de chaque promotion d&apos;étudiants.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((m, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 text-center group"
              >
                <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden border-2 border-slate-100 group-hover:border-blue-500 transition-colors relative">
                  <Image src={m.image} alt={m.name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{m.name}</h4>
                  <p className="text-[11px] text-blue-600 font-semibold">{m.role}</p>
                  <p className="text-[11px] text-slate-500 leading-relaxed pt-1">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 21.4 NOS CAMPUS AU BÉNIN */}
        <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6">
          <div className="max-w-2xl">
            <span className="text-xs uppercase font-bold text-blue-400">Infrastructures</span>
            <h3 className="text-2xl font-bold mt-1">Nos Campus au Bénin</h3>
            <p className="text-xs text-slate-300 mt-1">
              Des environnements immersifs, connectés à la fibre optique et équipés pour la pratique intensive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <h4 className="font-bold text-white text-sm">Campus FuturCraft Institut</h4>
              </div>
              <p className="text-slate-300">
                Godomey, Supermarché O Bénin, avant pk14, Cotonou, Bénin.
              </p>
              <p className="text-[11px] text-slate-400">
                • Salles informatiques climatisées • Studio audiovisuel • Lab drones &amp; IA
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <h4 className="font-bold text-white text-sm">Découvrez nos installations</h4>
              </div>
              <p className="text-slate-300">
                Un pôle unique entièrement dédié à la pratique : laboratoires connectés, ateliers créatifs et espaces de collaboration.
              </p>
              <p className="text-[11px] text-slate-400">
                • Ateliers pratiques • Espace co-working • Espace de vol extérieur drones
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
