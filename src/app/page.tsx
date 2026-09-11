import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    CheckCircle2,
    GraduationCap,
    MapPin,
    Play,
    Rocket,
    Users,
} from "lucide-react";
import { getFormations } from "@/lib/data-service";
import { Reveal } from "@/components/Reveal";
import { StatCounter } from "@/components/StatCounter";
import { NewsletterForm } from "@/components/NewsletterForm";

const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR").format(price).replace(/\u202f/g, " ");

const partnerCompanies = [
    "FuturCraft Institut et Programme Futur",
    "Startups tech béninoises",
    "Agences de développement web/mobile",
    "Cabinets marketing digital",
    "Imprimeries / ateliers de sérigraphie",
    "Sociétés de maintenance informatique à Cotonou",
    "Sociétés de maintenance informatique à Abomey-Calavi",
];

const testimonials = [
    {
        name: "Carmel DANGBEGNON",
        role: "Prompt Engineer",
        avatar: "/images/carmel.jpg",
        quote:
            "Grâce à FuturCraft Institut, j'ai ma sœur qui a pu acquérir des compétences concrètes et trouver un emploi rapidement. Les formateurs sont passionnés et toujours à l'écoute.",
    },
    {
        name: "Président DJANGOUN",
        role: "Entrepreneur digital / Étudiant",
        avatar: "/images/president.jpg",
        quote:
            "FuturCraft offre un cadre dynamique, une pédagogie axée sur la pratique et un accompagnement qui fait vraiment la différence dans le parcours des apprenants.",
    },
    {
        name: "William ZOMANHOUN",
        role: "Développeur web",
        avatar: "/images/wiliam.jpg",
        quote:
            "Les projets concrets m'ont permis de progresser rapidement et de prendre confiance. J'ai appris à travailler comme dans une véritable équipe produit.",
    },
    {
        name: "Carlos HOUESSINON",
        role: "Graphiste & UI/UX Designer",
        avatar: "/images/houessinon.jpg",
        quote:
            "Une formation accessible et exigeante, portée par des intervenants toujours disponibles. Chaque cours nous rapproche un peu plus du monde professionnel.",
    },
    {
        name: "Nicodème ATAKOUN",
        role: "Spécialiste Marketing digital",
        avatar: "/images/nicodem.jpg",
        quote:
            "J'ai trouvé à FuturCraft une communauté motivée et les outils nécessaires pour transformer mes idées en compétences et résultats concrets.",
    },
    {
        name: "Cédric Magloire AKOFODJI",
        role: "Consultant numérique",
        avatar: "/images/cedric.jpg",
        quote:
            "La force de l'institut est son approche par la pratique. On apprend, on teste et on construit avec des objectifs professionnels clairs dès le premier mois.",
    },
    {
        name: "Léa AHOUANSE",
        role: "Étudiante",
        avatar: "/images/Lea-Ahouanse.jpg",
        quote:
            "Une expérience immersive et encadrante. À FuturCraft, chaque module débouche sur une réalisation concrète qui renforce confiance et employabilité.",
    },
];

const trainingPricing = [
    { title: "Développement Web Fullstack", duration: "2 ans", price: "600.000 FCFA" },
    { title: "Développement en Intelligence Artificielle", duration: "2 ans", price: "600.000 FCFA" },
    { title: "Maîtrise des Outils IA", duration: "1 mois", price: "70.000 FCFA" },
    { title: "Web Design (UI/UX)", duration: "9 mois", price: "250.000 FCFA" },
    { title: "Graphisme et Sérigraphie", duration: "9 mois", price: "250.000 FCFA" },
    { title: "Marketing Digital & Growth", duration: "3 mois", price: "150.000 FCFA" },
    { title: "Maintenance Informatique et Réseau", duration: "6 mois", price: "250.000 FCFA" },
    { title: "Photographie, Cadrage et Montage Vidéo", duration: "1 an", price: "300.000 FCFA" },
    { title: "Copywriting & Storytelling Digital", duration: "2 mois", price: "150.000 FCFA" },
    { title: "E-commerce & Vente en Ligne", duration: "2 mois", price: "150.000 FCFA" },
    { title: "Pilotage Professionnel de Drone", duration: "1 mois", price: "100.000 FCFA" },
    { title: "Webmaster & Gestionnaire de Sites", duration: "1 an", price: "300.000 FCFA" },
];

const instructors = [
    {
        name: "Prosper SOSSOU",
        role: "Intervenant Référent en Développement Web & Technologies Fullstack",
    },
    {
        name: "Herman HOUNKPE",
        role: "Intervenant Spécialiste en Marketing Digital & Stratégie d'Acquisition",
    },
    {
        name: "Gauthier DOSSOU",
        role: "Intervenant en Design Graphique, Direction Artistique & Communication",
    },
];

export default async function HomePage() {
    const formations = await getFormations();

    return (
        <div className="overflow-hidden bg-[var(--color-fc-bg)]">
            <section className="relative isolate min-h-[720px] bg-[var(--color-fc-deep)] text-white">
                <Image
                    src="/images/hero-bg.jpg"
                    alt="Étudiants en formation numérique à FuturCraft"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center opacity-55"
                />
                <div className="absolute inset-0 bg-[var(--color-fc-deep)]/90" />
                <div className="absolute inset-0 bg-grid-dark opacity-30" />
                <div className="hero-orb hero-orb-one" />
                <div className="hero-orb hero-orb-two" />

                <div className="relative mx-auto flex min-h-[720px] max-w-7xl items-center px-4 py-24 sm:px-6 lg:px-8">
                    <div className="grid w-full items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
                        <div className="max-w-2xl">
                            <h1 className="animate-fade-up font-display text-4xl font-black leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
                                Ton avenir
                                <span className="block text-[var(--color-fc-cyan)]">
                                    se construit ici.
                                </span>
                            </h1>
                            <p className="animate-fade-up delay-200 mt-6 max-w-xl text-base leading-8 text-[var(--color-fc-light)]/80 sm:text-lg">
                                Forme-toi aux métiers les plus demandés du
                                numérique avec des projets concrets, des mentors
                                passionnés et une communauté qui avance avec
                                toi.
                            </p>
                            <div className="animate-fade-up delay-300 mt-9 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/inscription"
                                    className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-fc-bg)] px-6 py-3.5 text-sm font-extrabold text-[var(--color-fc-deep)] shadow-xl shadow-[var(--color-fc-primary)]/30 transition-all hover:-translate-y-1 hover:bg-[var(--color-fc-light)]/30"
                                >
                                    S&apos;inscrire
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href="/formations"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-fc-light)]/30 bg-transparent px-6 py-3.5 text-sm font-bold text-white transition-all hover:-translate-y-1 hover:bg-[var(--color-fc-light)]/10"
                                >
                                    <Play className="h-4 w-4 fill-current text-[var(--color-fc-cyan)]" />
                                    Découvrir les formations
                                </Link>
                            </div>
                            <div className="animate-fade-up delay-400 mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs font-semibold text-[var(--color-fc-light)]/70">
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-[var(--color-fc-primary)]" />
                                    Projets réels
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-[var(--color-fc-primary)]" />
                                    Certifications professionnelles
                                </span>
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-[var(--color-fc-primary)]" />
                                    Accompagnement emploi
                                </span>
                            </div>
                        </div>

                        <div className="relative hidden min-h-[430px] lg:block">
                            <div className="absolute right-2 top-4 h-80 w-80 rounded-full bg-[var(--color-fc-primary)]/20 blur-3xl" />
                            <div className="absolute right-10 top-16 h-[350px] w-[350px] rounded-[3rem] border border-[var(--color-fc-light)]/20 bg-[var(--color-fc-bg)]/10 shadow-2xl shadow-[var(--color-fc-deep)]/50 backdrop-blur-sm hero-card-tilt" />
                            <div className="absolute right-20 top-28 h-[350px] w-[350px] overflow-hidden rounded-[2.5rem] border border-[var(--color-fc-light)]/20 shadow-2xl shadow-[var(--color-fc-deep)]/50 hero-card-tilt">
                                <Image
                                    src="/images/hero-bg.jpg"
                                    alt=""
                                    fill
                                    sizes="350px"
                                    className="object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-[var(--color-fc-deep)]/90" />
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[var(--color-fc-light)]">
                                        <span className="h-2 w-2 rounded-full bg-[var(--color-fc-primary)] shadow-[0_0_12px_rgba(18,81,149,0.5)]" />
                                        Campus en mouvement
                                    </div>
                                    <p className="font-display text-2xl font-bold">
                                        Apprends. Crée. Innove.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--color-fc-bg)] to-transparent" />
            </section>

            <section className="relative z-10 mx-auto -mt-2 max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid overflow-hidden rounded-3xl border border-[var(--color-fc-gray-light)] bg-white shadow-xl shadow-[var(--color-fc-deep)]/10 sm:grid-cols-3">
                    {([
                        {
                            variant: "count" as const,
                            target: 12,
                            prefix: "",
                            suffix: "+",
                            label: "formations professionnalisantes",
                            icon: GraduationCap,
                        },
                        {
                            variant: "count" as const,
                            target: 500,
                            prefix: "",
                            suffix: "+",
                            label: "talents accompagnés",
                            icon: Users,
                        },
                        {
                            variant: "address" as const,
                            icon: MapPin,
                            label: "Godomey, Supermarché O Bénin Avant pk14",
                        },
                    ] as Array<
                        | { variant: "count"; target: number; prefix?: string; suffix?: string; label: string; icon: typeof MapPin }
                        | { variant: "address"; label: string; icon: typeof MapPin }
                    >).map((item) => {
                        const { icon: Icon, label } = item;
                        return (
                        <div
                            key={label}
                            className="flex items-center gap-4 border-b border-[var(--color-fc-gray-light)]/50 p-6 last:border-0 sm:border-b-0 sm:border-r sm:last:border-r-0">
                            <div className="rounded-2xl bg-[var(--color-fc-primary)]/10 p-3 text-[var(--color-fc-primary)]">
                                <Icon className="h-5 w-5" />
                            </div>
                            <div>
                                {item.variant === "address" ? (
                                    <p className="font-display text-lg font-black leading-tight text-[var(--color-fc-black)]">
                                        {label}
                                    </p>
                                ) : (
                                    <>
                                        <p className="font-display text-2xl font-black text-[var(--color-fc-black)]">
                                            <StatCounter target={item.target} prefix={item.prefix} suffix={item.suffix} activeAt />
                                        </p>
                                        <p className="text-xs font-medium text-[var(--color-fc-gray-mid)]">
                                            {label}
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                        );
                    })}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
                            Choisis ton terrain de jeu
                        </p>
                        <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-[var(--color-fc-black)] sm:text-4xl">
                            Des compétences qui ouvrent des portes
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--color-fc-gray-mid)]">
                            Un apprentissage pratique pour passer de l&apos;idée
                            à l&apos;impact, accompagné par des experts du
                            terrain.
                        </p>
                    </div>
<Link
                                href="/formations"
                                className="group inline-flex items-center gap-2 text-sm font-extrabold text-[var(--color-fc-primary)] hover:text-[var(--color-fc-deep)]"
                            >
                        Voir tout le catalogue
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>
                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {formations.slice(0, 3).map((formation, index) => (
                        <Reveal key={formation.id} delay={(index % 3) * 90} className="h-full">
<Link
                                    href={`/formation/${formation.slug}`}
                                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--color-fc-primary)] hover:shadow-xl"
                                >
                                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-fc-gray-light)]/30">
                                    <Image
                                        src={formation.imageUrl}
                                        alt={formation.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <span className="absolute left-4 top-4 rounded-lg bg-[var(--color-fc-bg)]/95 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[var(--color-fc-primary)] shadow-sm">
                                        {formation.category}
                                    </span>
                                    <span className="absolute bottom-4 right-4 rounded-lg bg-[var(--color-fc-deep)]/75 px-2.5 py-1 text-[11px] font-bold text-[var(--color-fc-bg)] backdrop-blur">
                                        {formation.duration}
                                    </span>
                                </div>
                                <div className="flex flex-1 flex-col p-5">
                                    <div className="mb-2 flex items-start justify-between gap-3">
                                        <h3 className="font-display text-lg font-bold leading-snug text-[var(--color-fc-black)] group-hover:text-[var(--color-fc-primary)]">
                                            {formation.title}
                                        </h3>
                                        <span className="text-xs font-black text-[var(--color-fc-primary)]">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <p className="line-clamp-2 text-xs leading-6 text-[var(--color-fc-gray-mid)]">
                                        {formation.shortDescription}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between border-t border-[var(--color-fc-gray-light)]/50 pt-4">
                                        <span className="text-xs font-bold text-[var(--color-fc-gray-mid)]">
                                            Dès {formatPrice(formation.price)} FCFA
                                        </span>
                                        <span className="inline-flex items-center text-xs font-extrabold text-[var(--color-fc-primary)]">
                                            Découvrir{" "}
                                            <ArrowRight className="ml-1 inline h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
                        Partenariats & réseau
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-[var(--color-fc-black)] sm:text-4xl">
                        Plus de 20+ entreprises partenaires
                    </h2>
                    <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[var(--color-fc-gray-mid)]">
                        Le centre affiche des collaborations solides pour les stages,
                        projets encadrés et recrutements de ses apprenants.
                    </p>
                </div>
                <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {partnerCompanies.map((company, index) => (
                        <Reveal key={company} delay={(index % 4) * 70} className="h-full">
                            <div className="h-full rounded-2xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] p-5 text-center text-sm font-semibold text-[var(--color-fc-gray-mid)] shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--color-fc-primary)] hover:shadow-lg">
                                {company}
                            </div>
                        </Reveal>
                    ))}
                </div>
                <div className="mt-6 rounded-2xl border border-[var(--color-fc-primary)]/30 bg-[var(--color-fc-primary)]/8 p-5 text-center text-sm text-[var(--color-fc-gray-mid)]">
                    <span className="font-bold text-[var(--color-fc-primary)]">FuturCraft Institut et Programme Futur</span> fait partie des programmes phares de notre écosystème de formation et d&apos;engagement numérique.
                </div>
            </section>

            <section className="bg-[var(--color-fc-gray-light)]/30 py-24">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
                            Témoignages
                        </p>
                        <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-[var(--color-fc-black)] sm:text-4xl">
                            Ce que nos apprenants racontent
                        </h2>
                    </div>
                    <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {testimonials.map((item, index) => (
                            <Reveal key={item.name} delay={(index % 3) * 90} className="h-full">
                                <article className="flex h-full flex-col rounded-3xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                                    <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)] italic">
                                        &ldquo;{item.quote}&rdquo;
                                    </p>
                                    <div className="mt-6 flex items-center gap-3 border-t border-[var(--color-fc-gray-light)]/50 pt-4">
                                        {item.avatar && (
                                            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border-2 border-[var(--color-fc-primary)]/20">
                                                <Image
                                                    src={item.avatar}
                                                    alt={item.name}
                                                    fill
                                                    sizes="44px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-[var(--color-fc-black)]">{item.name}</p>
                                            <p className="text-xs text-[var(--color-fc-gray-mid)]">{item.role}</p>
                                        </div>
                                    </div>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
                <div className="text-center">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
                        Tarifs & durée
                    </p>
                    <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-[var(--color-fc-black)] sm:text-4xl">
                        Formations et prix à l&apos;heure actuelle
                    </h2>
                </div>
                <div className="mt-10 overflow-hidden rounded-3xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] shadow-sm">
                    <div className="grid grid-cols-[2.2fr_1fr_1.1fr] border-b border-[var(--color-fc-gray-light)] bg-[var(--color-fc-gray-light)]/30 text-left text-xs font-black uppercase tracking-[0.16em] text-[var(--color-fc-gray-mid)]">
                        <div className="px-5 py-4">Formation</div>
                        <div className="px-5 py-4">Durée</div>
                        <div className="px-5 py-4">Tarif</div>
                    </div>
                    {trainingPricing.map((training) => (
                        <div
                            key={training.title}
                            className="grid grid-cols-[2.2fr_1fr_1.1fr] border-b border-[var(--color-fc-gray-light)] last:border-b-0 text-sm text-[var(--color-fc-gray-mid)]"
                        >
                            <div className="px-5 py-4 font-semibold">{training.title}</div>
                            <div className="px-5 py-4">{training.duration}</div>
                            <div className="px-5 py-4 font-bold text-[var(--color-fc-primary)]">{training.price}</div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="bg-[var(--color-fc-deep)] py-24 text-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-fc-cyan)]">
                            Équipe pédagogique
                        </p>
                        <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-white sm:text-4xl">
                            Des intervenants experts et engagés
                        </h2>
                    </div>
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {instructors.map((instructor, index) => (
                            <Reveal key={instructor.name} delay={(index % 3) * 90} className="h-full">
                                <div className="h-full rounded-3xl border border-[var(--color-fc-primary)]/30 bg-[var(--color-fc-deep)]/80 p-6 text-center shadow-lg shadow-[var(--color-fc-black)]/20 transition-all hover:-translate-y-1 hover:border-[var(--color-fc-cyan)]/50">
                                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-fc-primary)] to-[var(--color-fc-cyan)] text-xl font-black text-[var(--color-fc-bg)]">
                                        {instructor.name
                                            .split(" ")
                                            .map((part) => part[0])
                                            .slice(0, 2)
                                            .join("")}
                                    </div>
                                    <h3 className="text-lg font-bold text-white">{instructor.name}</h3>
                                    <p className="mt-3 text-sm leading-6 text-[var(--color-fc-light)]">{instructor.role}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-4 mb-24 overflow-hidden rounded-[2rem] bg-[var(--color-fc-deep)] sm:mx-6 lg:mx-auto lg:max-w-7xl">
                <div className="relative px-6 py-14 sm:px-12 lg:px-16">
                    <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-[var(--color-fc-primary)]/30 blur-3xl" />
                    <Rocket className="absolute right-12 top-12 h-24 w-24 rotate-12 text-[var(--color-fc-cyan)]/10" />
                    <div className="relative max-w-2xl">
                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--color-fc-cyan)]">
                            Prêt à passer à l&apos;action ?
                        </p>
                        <h2 className="mt-4 font-display text-3xl font-black text-white sm:text-4xl">
                            Ta prochaine version commence aujourd&apos;hui.
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-[var(--color-fc-light)]/70">
                            Les prochaines cohortes se remplissent vite. Réserve
                            ta place et construis un avenir dont tu seras fier.
                        </p>
                        <Link
                            href="/inscription"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[var(--color-fc-primary)] px-5 py-3 text-sm font-extrabold text-[var(--color-fc-bg)] shadow-lg shadow-[var(--color-fc-primary)]/25 transition-all hover:bg-[var(--color-fc-deep)]"
                        >
                            Rejoindre FuturCraft{" "}
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        <div className="mt-10 border-t border-white/10 pt-6">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-fc-cyan)]">
                                Ou recevoir la brochure
                            </p>
                            <div className="mt-3">
                                <NewsletterForm />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
