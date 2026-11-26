import Image from "next/image";
import Link from "next/link";
import {
    ArrowRight,
    ArrowUpRight,
    BookOpen,
    Briefcase,
    Camera,
    Code2,
    Cpu,
    GraduationCap,
    Layers,
    MapPin,
    Palette,
    Pen,
    Quote,
    Sparkles,
    Target,
    TrendingUp,
    Users,
    Wind,
    Wrench,
} from "lucide-react";
import { getFormations, getOpenPromotionsByFormation } from "@/lib/data-service";
import { Reveal } from "@/components/Reveal";
import { StatCounter } from "@/components/StatCounter";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SectionHeading } from "@/components/SectionHeading";
import { formatTrainingPrice } from "@/lib/format-training-price";

const formatPrice = (price: number) =>
    new Intl.NumberFormat("fr-FR").format(price).replace(/\u202f/g, " ");

const partnerCompanies = [
    "Entreprises de Cotonou",
    "Startups tech locales",
    "Agences web et mobile",
    "Cabinets marketing digital",
    "Ateliers de sérigraphie",
    "Sociétés de maintenance informatique",
];

const testimonials = [
    {
        name: "Carmel DANGBEGNON",
        role: "Prompt Engineer",
        avatar: "/images/carmel.jpg",
        quote:
            "J'ai commencé sans rien connaître au code. Aujourd'hui je bosse sur des prompts et des workflows IA pour une boîte à Cotonou. Le plus dur, c'était les premières semaines, mais les mentors ne lâchent pas.",
    },
    {
        name: "Président DJANGOUN",
        role: "Entrepreneur digital",
        avatar: "/images/president.jpg",
        quote:
            "Ce qui m'a plu, c'est qu'on ne fait pas que de la théorie. On monte des projets, on se plante, on recommence. C'est ça qui prépare au vrai travail.",
    },
    {
        name: "Onesim Graça Ema-Ayé",
        role: "Développeur web",
        avatar: "/images/wiliam.jpg",
        quote:
            "Au début je pensais que le web c'était juste du HTML. J'ai découvert les APIs, les bases de données, le déploiement. Le stage de fin de formation m'a permis de décrocher un CDD.",
    },
    {
        name: "Pacome ASSOGBA",
        role: "Photographie et montage vidéo",
        avatar: "/images/houessinon.jpg",
        quote:
            "Les cours se font souvent le soir et le samedi, donc j'ai pu continuer à travailler en journée. Les formateurs sont disponibles sur WhatsApp, ça aide vraiment.",
    },
    {
        name: "Ange AKONDE",
        role: "Développeur web Full-stack",
        avatar: "/images/nicodem.jpg",
        quote:
            "Le projet de fin de cohorte, c'était un vrai site pour un client réel. Stressant, mais c'est ce qui m'a donné confiance pour les entretiens.",
    },
    {
        name: "Cédric Magloire AKOFODJI",
        role: "Consultant numérique",
        avatar: "/images/cedric.jpg",
        quote:
            "Je ne suis pas devenu expert en 6 mois, mais j'ai acquis des bases solides et un réseau. Les contacts avec les entreprises partenaires ont été utiles pour la suite.",
    },
    {
        name: "Léa AHOUANSE",
        role: "Étudiante",
        avatar: "/images/Lea-Ahouanse.jpg",
        quote:
            "Les cours sont exigeants et il faut être régulier. Ce n'est pas une promenade, mais on en sort avec quelque chose de concret dans les mains.",
    },
];

const instructors = [
    {
        name: "Prosper SOSSOU",
        role: "Développement Web",
    },
    {
        name: "Herman HOUNKPE",
        role: "Marketing Digital",
    },
    {
        name: "Gauthier DOSSOU",
        role: "Design Graphique",
    },
];

export default async function HomePage() {
    const formations = await getFormations();
    const featured = formations.filter((f) => f.isActive).slice(0, 3);
    const activeFormations = formations.filter((f) => f.isActive);
    const openPromos = await getOpenPromotionsByFormation();
    const domainIcons = [
        { label: "Développement Web Fullstack", short: "Web", href: "/formation/developpement-web-fullstack", icon: Code2 },
        { label: "IA & Machine Learning", short: "IA", href: "/formation/developpement-intelligence-artificielle", icon: Cpu },
        { label: "Web Design UI/UX", short: "Design", href: "/formation/web-design-ui-ux", icon: Palette },
        { label: "Pilotage de Drone", short: "Drone", href: "/formation/pilotage-de-drone", icon: Wind },
        { label: "Marketing Digital", short: "Marketing", href: "/formation/marketing-digital", icon: TrendingUp },
        { label: "Graphisme & Sérigraphie", short: "Graphisme", href: "/formation/graphisme-et-serigraphie", icon: Pen },
        { label: "Audiovisuel & Montage", short: "Audiovisuel", href: "/formation/photographie-cadrage-et-montage-video", icon: Camera },
        { label: "Outils d'IA", short: "Outils IA", href: "/formation/maitrise-outils-intelligence-artificielle", icon: Sparkles },
        { label: "Maintenance & Réseau", short: "Réseau", href: "/formation/maintenance-informatique-et-reseau", icon: Wrench },
        { label: "Copywriting", short: "Copy", href: "/formation/copywriting", icon: Pen },
        { label: "E-commerce", short: "E-com", href: "/formation/e-commerce", icon: Briefcase },
        { label: "Webmaster", short: "CMS", href: "/formation/webmaster", icon: Layers },
    ];

    return (
        <div className="overflow-hidden bg-[var(--color-fc-bg)]">
            {/* â”â‚¬â”â‚¬ HERO â”â‚¬â”â‚¬ */}
            <section className="relative isolate overflow-hidden bg-[#06122f] text-white">
                <Image
                    src="/images/hero-bg.jpg"
                    alt="Étudiants en formation numérique à FuturCraft"
                    fill
                    priority
                    sizes="100vw"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    className="object-cover object-center opacity-25"
                />
                <div className="absolute inset-0 bg-[#06122f]/80" />

                <div className="relative mx-auto grid min-h-[88vh] max-w-[84rem] items-center gap-12 px-4 pt-14 pb-24 sm:px-6 sm:pt-16 sm:pb-24 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:pt-20 lg:pb-28">
                    <div>
                        <h1 className="animate-fade-up font-display text-5xl font-extrabold leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-[5.25rem]">
                            Apprends un métier.
                            <span className="mt-1 block text-[var(--color-fc-cyan)]">
                                Construis ta place.
                            </span>
                        </h1>
                        <p className="animate-fade-up delay-200 mt-8 max-w-xl text-base leading-8 text-white/72 sm:text-lg">
                            Des formations pratiques en développement, IA, design, audiovisuel et métiers du digital. On apprend en faisant, avec des projets réels et un accompagnement de proximité.
                        </p>
                        <div className="animate-fade-up delay-300 mt-10 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href="/inscription"
                                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-fc-cyan)] px-7 py-4 text-sm font-extrabold text-[#06122f] shadow-[0_20px_40px_-12px_rgba(20,163,199,0.45)] transition-all hover:-translate-y-0.5 hover:bg-white"
                            >
                                Candidater maintenant
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/formations"
                                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10"
                            >
                                Explorer les formations
                                <ArrowUpRight className="h-4 w-4 text-[var(--color-fc-cyan)]" />
                            </Link>
                        </div>
                        <div className="animate-fade-up delay-400 mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-8 text-sm text-white/65">
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 text-[var(--color-fc-cyan)]"><BookOpen className="h-4 w-4" /></span>
                                <span><strong className="block text-white">12 formations</strong>métiers du numérique</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 text-[var(--color-fc-cyan)]"><Target className="h-4 w-4" /></span>
                                <span><strong className="block text-white">Pratique d&apos;abord</strong>projets & ateliers</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative hidden lg:block animate-fade-up delay-300">
                        <div className="absolute -inset-4 rounded-[2.5rem] border border-white/10" />
                        <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/5 shadow-2xl shadow-black/30 transition-transform duration-700 hover:scale-[1.01]">
                            <Image
                                src="/images/hero-bg.jpg"
                                alt="Atelier FuturCraft"
                                width={900}
                                height={1100}
                                className="h-[520px] w-full object-cover transition-transform duration-[1.2s] ease-out hover:scale-[1.03]"
                                priority
                            />
                            <div className="absolute inset-0 bg-[#06122f]/35" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <div className="rounded-2xl border border-white/15 bg-[#06122f]/80 p-5 backdrop-blur-md animate-fade-up delay-500">
                                    <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--color-fc-cyan)]">Prochaine étape</p>
                                    <p className="mt-2 font-display text-xl font-bold">Rejoins une cohorte et travaille sur un vrai projet.</p>
                                    <div className="mt-4 flex items-center gap-3 text-xs text-white/70">
                                        <span className="rounded-full bg-white/10 px-3 py-1">Godomey</span>
                                        <span className="rounded-full bg-white/10 px-3 py-1">Mentorat</span>
                                        <span className="rounded-full bg-white/10 px-3 py-1">Portfolio</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* â”â‚¬â”â‚¬ DOMAINES â”â‚¬â”â‚¬ */}
            <section className="mx-auto max-w-[84rem] px-4 pt-20 sm:px-6 lg:px-10">
                <div className="text-center">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--color-fc-cyan)]">Domaines</p>
                    <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--color-fc-black)] sm:text-3xl">Explore nos métiers du numérique</h2>
                </div>
                <div className="mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
                    {domainIcons.map(({ label, short, href, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            aria-label={label}
                            className="group relative flex flex-col items-center"
                        >
                            <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-[var(--color-fc-deep)] px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-1 group-hover:opacity-100 group-focus-visible:-translate-y-1 group-focus-visible:opacity-100">
                                {label}
                            </span>
                            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[var(--color-fc-gray-light)] bg-white p-3 text-[var(--color-fc-primary)] shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-[var(--color-fc-primary)]/30 group-hover:bg-[var(--color-fc-primary)] group-hover:text-white group-hover:shadow-[0_16px_30px_-12px_rgba(18,81,149,0.45)] group-focus-visible:-translate-y-1 group-focus-visible:border-[var(--color-fc-primary)]/30 group-focus-visible:bg-[var(--color-fc-primary)] group-hover:text-white sm:h-16 sm:w-16 sm:p-3.5">
                                <Icon className="h-full w-full" />
                            </span>
                            <span className="mt-2 text-[11px] font-semibold text-[var(--color-fc-gray-mid)] transition-colors group-hover:text-[var(--color-fc-primary)] group-focus-visible:text-[var(--color-fc-primary)]">
                                {short}
                            </span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* â”â‚¬â”â‚¬ PROOF BAR â”â‚¬â”â‚¬ */}
            <section className="relative z-10 mx-auto -mt-8 max-w-[84rem] px-4 sm:px-6 lg:px-10">
                <div className="grid gap-px overflow-hidden rounded-3xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-gray-light)] shadow-[0_20px_60px_-20px_rgba(7,22,61,0.15)] sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        { icon: GraduationCap, value: 12, suffix: "", label: "Formations pratiques", detail: "du web à l'IA" },
                        { icon: Users, value: 500, suffix: "+", label: "Apprenants accompagnés", detail: "tous profils" },
                        { icon: Briefcase, value: 20, suffix: "+", label: "Partenaires & entreprises", detail: "réseau local" },
                        { icon: MapPin, value: null, suffix: "", label: "Campus à Godomey", detail: "Abomey-Calavi, Bénin" },
                    ].map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <Reveal key={item.label} delay={index * 80} className="h-full">
                                <div className="group bg-white p-6 sm:p-7 h-full">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)] transition-transform duration-300 group-hover:scale-105">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-display text-2xl font-extrabold tracking-tight text-[var(--color-fc-black)]">
                                                {item.value !== null ? <StatCounter target={item.value} suffix={item.suffix} /> : "BJ"}
                                            </p>
                                            <p className="mt-0.5 text-sm font-semibold text-[var(--color-fc-black)]">{item.label}</p>
                                            <p className="text-xs text-[var(--color-fc-gray-mid)]">{item.detail}</p>
                                        </div>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </section>

            {/* â”â‚¬â”â‚¬ FORMATIONS â”â‚¬â”â‚¬ */}
            <section className="mx-auto max-w-[84rem] px-4 py-24 sm:px-6 lg:px-10 lg:py-28">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                    <SectionHeading
                        eyebrow="Formations"
                        title={<>Des compétences qui comptent <span className="text-[var(--color-fc-primary)]">sur le terrain.</span></>}
                        description="Choisis un parcours pratique, construis un portfolio et prépare-toi aux opportunités du numérique."
                        align="left"
                    />
                    <Link
                        href="/formations"
                        className="group inline-flex shrink-0 items-center gap-2 rounded-xl border border-[var(--color-fc-gray-light)] bg-white px-5 py-3 text-sm font-bold text-[var(--color-fc-black)] transition-all hover:border-[var(--color-fc-primary)]/30 hover:text-[var(--color-fc-primary)]"
                    >
                        Toutes les formations
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {featured.map((formation, index) => (
                        <Reveal key={formation.id} delay={(index % 3) * 90} className="h-full">
                            <Link
                                href={`/formation/${formation.slug}`}
                                className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-fc-primary)]/25 hover:shadow-[0_24px_60px_-20px_rgba(7,22,61,0.18)]"
                            >
                                <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-fc-gray-light)]/30">
                                    <Image
                                        src={formation.imageUrl}
                                        alt={formation.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                                    />
                                    <div className="absolute inset-0 bg-[#07163d]/20" />
                                    <div className="absolute left-4 top-4 flex gap-2">
                                        <span className="rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[var(--color-fc-primary)] shadow-sm backdrop-blur">
                                            {formation.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    <div className="flex items-center gap-3 text-xs font-semibold text-[var(--color-fc-gray-mid)]">
                                        <span>{formation.duration}</span>
                                        <span className="h-1 w-1 rounded-full bg-[var(--color-fc-gray-light)]" />
                                        <span>{formation.level || "Tous niveaux"}</span>
                                    </div>
                                    {openPromos[formation.id]?.[0] && (
                                        <p className="mt-3 inline-flex w-fit rounded-full bg-[var(--color-fc-cyan)]/10 px-3 py-1 text-[11px] font-bold text-[var(--color-fc-primary)]">
                                            Prochaine session : {openPromos[formation.id][0].startDate}
                                        </p>
                                    )}
                                    <h3 className="mt-3 font-display text-xl font-bold leading-snug tracking-tight text-[var(--color-fc-black)] group-hover:text-[var(--color-fc-primary)]">
                                        {formation.title}
                                    </h3>
                                    <p className="mt-3 line-clamp-2 text-sm leading-7 text-[var(--color-fc-gray-mid)]">
                                        {formation.shortDescription}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between pt-6">
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-fc-gray-mid)]">À partir de</p>
                                            <p className="font-display text-lg font-extrabold text-[var(--color-fc-black)]">{formatPrice(formation.price)} <span className="text-sm font-bold text-[var(--color-fc-gray-mid)]">FCFA</span></p>
                                        </div>
                                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-fc-gray-light)] text-[var(--color-fc-primary)] transition-all group-hover:border-[var(--color-fc-primary)] group-hover:bg-[var(--color-fc-primary)] group-hover:text-white">
                                            <ArrowUpRight className="h-4 w-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* â”â‚¬â”â‚¬ WHY / METHOD â”â‚¬â”â‚¬ */}
            <section className="border-y border-[var(--color-fc-gray-light)] bg-white">
                <div className="mx-auto grid max-w-[84rem] gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-28 lg:gap-16">
                    <div>
                        <SectionHeading
                            eyebrow="Notre approche"
                            title={<>Pas juste des cours. <span className="text-[var(--color-fc-primary)]">Une vraie pratique.</span></>}
                            description="On forme des personnes capables de produire, de s'adapter et de travailler en équipe. Chaque parcours est pensé pour te rapprocher du monde professionnel."
                            align="left"
                        />
                        <div className="mt-10 space-y-5">
                            {[
                                { icon: Target, title: "Projets concrets", text: "Tu travailles sur des cas réels, pas seulement des exercices théoriques." },
                                { icon: Users, title: "Mentors accessibles", text: "Des formateurs qui suivent ta progression et te challengent." },
                                { icon: Sparkles, title: "Portfolio & confiance", text: "Tu sors avec des réalisations à montrer et des réflexes professionnels." },
                            ].map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <Reveal key={item.title} delay={index * 100}>
                                        <div className="flex gap-4 rounded-2xl border border-transparent p-4 transition-all duration-300 hover:border-[var(--color-fc-gray-light)] hover:bg-[var(--color-fc-bg)] hover:translate-x-1">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]">
                                                <Icon className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-display text-lg font-bold text-[var(--color-fc-black)]">{item.title}</h3>
                                                <p className="mt-1 text-sm leading-7 text-[var(--color-fc-gray-mid)]">{item.text}</p>
                                            </div>
                                        </div>
                                    </Reveal>
                                );
                            })}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Reveal className="sm:col-span-2">
                                <div className="rounded-[1.75rem] bg-[var(--color-fc-deep)] p-7 text-white">
                                    <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-cyan)]">Le parcours FuturCraft</p>
                                    <div className="mt-6 grid gap-6 sm:grid-cols-3">
                                        {[
                                            { n: "01", t: "Apprendre", d: "Les bases solides, avec la bonne méthode." },
                                            { n: "02", t: "Pratiquer", d: "Des projets, des retours, des itérations." },
                                            { n: "03", t: "Lancer", d: "Portfolio, stage, emploi ou projet perso." },
                                        ].map((s, i) => (
                                            <div key={s.n} className="animate-fade-up" style={{ animationDelay: `${120 + i * 100}ms` }}>
                                                <span className="font-display text-3xl font-black text-[var(--color-fc-cyan)]">{s.n}</span>
                                                <h4 className="mt-2 font-display text-lg font-bold">{s.t}</h4>
                                                <p className="mt-1 text-sm leading-6 text-white/65">{s.d}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Reveal>
                            <Reveal delay={100}>
                                <div className="h-full rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-20px_rgba(7,22,61,0.12)]">
                                    <p className="font-display text-4xl font-extrabold tracking-tight text-[var(--color-fc-primary)]">80%</p>
                                    <p className="mt-2 text-sm font-semibold text-[var(--color-fc-black)]">de pratique</p>
                                    <p className="mt-1 text-sm leading-6 text-[var(--color-fc-gray-mid)]">Ateliers, exercices, projets et mises en situation.</p>
                                </div>
                            </Reveal>
                            <Reveal delay={180}>
                                <div className="h-full rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_-20px_rgba(7,22,61,0.12)]">
                                    <p className="font-display text-4xl font-extrabold tracking-tight text-[var(--color-fc-primary)]">1:1</p>
                                    <p className="mt-2 text-sm font-semibold text-[var(--color-fc-black)]">suivi mentor</p>
                                    <p className="mt-1 text-sm leading-6 text-[var(--color-fc-gray-mid)]">Un accompagnement humain, pas un parcours impersonnel.</p>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </div>
            </section>

            {/* â”â‚¬â”â‚¬ TESTIMONIALS â”â‚¬â”â‚¬ */}
            <section className="bg-[var(--color-fc-bg)] py-24 lg:py-28">
                <div className="mx-auto max-w-[84rem] px-4 sm:px-6 lg:px-10">
                    <SectionHeading
                        eyebrow="Témoignages"
                        title={<>Ils ont appris. <span className="text-[var(--color-fc-primary)]">Ils construisent.</span></>}
                        description="Des retours honnêtes d'apprenants qui ont suivi les formations FuturCraft."
                    />
                    <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {testimonials.slice(0, 6).map((item, index) => (
                            <Reveal key={item.name} delay={(index % 3) * 90} className="h-full">
                                <article className="group flex h-full flex-col rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(7,22,61,0.12)]">
                                    <Quote className="h-8 w-8 text-[var(--color-fc-cyan)]/30" />
                                    <p className="mt-4 flex-1 text-[15px] leading-7 text-[var(--color-fc-gray-mid)]">
                                        {item.quote}
                                    </p>
                                    <div className="mt-6 flex items-center gap-3 border-t border-[var(--color-fc-gray-light)] pt-5">
                                        {item.avatar && (
                                            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--color-fc-gray-light)]">
                                                <Image src={item.avatar} alt={item.name} fill sizes="48px" className="object-cover" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-display font-bold text-[var(--color-fc-black)]">{item.name}</p>
                                            <p className="text-xs text-[var(--color-fc-gray-mid)]">{item.role}</p>
                                        </div>
                                    </div>
                                </article>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* â”â‚¬â”â‚¬ PRICING OVERVIEW â”â‚¬â”â‚¬ */}
            <section className="border-y border-[var(--color-fc-gray-light)] bg-white py-24 lg:py-28">
                <div className="mx-auto max-w-[84rem] px-4 sm:px-6 lg:px-10">
                    <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                        <div>
                            <SectionHeading
                                eyebrow="Tarifs"
                                title={<>Un investissement clair, <span className="text-[var(--color-fc-primary)]">sans surprise.</span></>}
                                description="Des tarifs accessibles avec des possibilités de paiement échelonné. Contacte-nous pour trouver la formule adaptée à ta situation."
                                align="left"
                            />
                            <div className="mt-8 space-y-4">
                                <div className="flex items-start gap-3 text-sm text-[var(--color-fc-gray-mid)]">
                                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-fc-cyan)]/15 text-[var(--color-fc-primary)]"><ArrowRight className="h-3 w-3" /></span>
                                    Paiement échelonné possible
                                </div>
                                <div className="flex items-start gap-3 text-sm text-[var(--color-fc-gray-mid)]">
                                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-fc-cyan)]/15 text-[var(--color-fc-primary)]"><ArrowRight className="h-3 w-3" /></span>
                                    Frais d&apos;inscription : 25 000 FCFA
                                </div>
                                <div className="flex items-start gap-3 text-sm text-[var(--color-fc-gray-mid)]">
                                    <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--color-fc-cyan)]/15 text-[var(--color-fc-primary)]"><ArrowRight className="h-3 w-3" /></span>
                                    Accompagnement jusqu&apos;à la fin du parcours
                                </div>
                            </div>
                            <Link href="/admissions" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-fc-primary)] hover:text-[var(--color-fc-deep)]">
                                Voir les modalités d&apos;admission <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                        <Reveal>
                            <div className="overflow-hidden rounded-[1.75rem] border border-[var(--color-fc-gray-light)]">
                                <div className="grid grid-cols-[1fr_auto_auto] gap-4 bg-[var(--color-fc-bg)] px-5 py-4 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[var(--color-fc-gray-mid)] sm:px-6">
                                    <div>Formation</div>
                                    <div className="hidden sm:block">Durée</div>
                                    <div className="text-right">Tarif</div>
                                </div>
                                <div className="divide-y divide-[var(--color-fc-gray-light)]">
                                    {activeFormations.slice(0, 8).map((training) => (
                                        <Link
                                            key={training.id}
                                            href={`/formation/${training.slug}`}
                                            className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 transition-all duration-200 hover:bg-[var(--color-fc-bg)] hover:pl-6 sm:px-6 sm:hover:pl-7"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-[var(--color-fc-black)]">{training.title}</p>
                                                <p className="mt-0.5 text-xs text-[var(--color-fc-gray-mid)] sm:hidden">{training.duration}</p>
                                            </div>
                                            <div className="hidden text-sm text-[var(--color-fc-gray-mid)] sm:block">{training.duration}</div>
                                            <div className="text-right font-display text-sm font-bold text-[var(--color-fc-primary)] whitespace-nowrap">
                                                {formatTrainingPrice(training.price, training.duration)}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                {activeFormations.length > 8 && (
                                    <div className="border-t border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] px-5 py-4 sm:px-6">
                                        <Link href="/formations" className="text-sm font-bold text-[var(--color-fc-primary)] hover:underline">
                                            Voir les {activeFormations.length} formations →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* â”â‚¬â”â‚¬ CTA â”â‚¬â”â‚¬ */}
            <section className="px-4 py-24 sm:px-6 lg:px-10 lg:py-28">
                <div className="relative mx-auto max-w-[84rem] overflow-hidden rounded-[2.5rem] bg-[var(--color-fc-deep)] px-6 py-16 sm:px-12 lg:px-16 lg:py-20">
                    <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_auto]">
                        <div className="max-w-2xl">
                            <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[var(--color-fc-cyan)]">
                                Prêt à commencer ?
                            </p>
                            <h2 className="mt-5 font-display text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]">
                                Ta prochaine compétence commence ici.
                            </h2>
                            <p className="mt-5 max-w-xl text-base leading-8 text-white/68">
                                Rejoins une cohorte, apprends avec des mentors, et construis un projet dont tu seras fier. Les places sont limitées.
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href="/inscription"
                                    className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--color-fc-cyan)] px-7 py-4 text-sm font-extrabold text-[#06122f] transition-all hover:-translate-y-0.5 hover:bg-white"
                                >
                                    S&apos;inscrire maintenant
                                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-7 py-4 text-sm font-bold text-white transition-all hover:bg-white/10"
                                >
                                    Parler à un conseiller
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">Contact rapide</p>
                                <a href="tel:+22943327832" className="mt-3 block font-display text-2xl font-bold text-white hover:text-[var(--color-fc-cyan)]">+229 43 32 78 32</a>
                                <p className="mt-2 text-sm text-white/55">Godomey, Abomey-Calavi</p>
                                <div className="mt-5 border-t border-white/10 pt-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-fc-cyan)]">Recevoir la brochure</p>
                                    <div className="mt-3"><NewsletterForm /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

