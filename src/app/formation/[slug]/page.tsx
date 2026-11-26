import {
    getFormationBySlug,
    getPromotions,
    getProjects,
} from '@/lib/data-service';
import { getCampusImagesForSlug } from '@/lib/campus-images';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import {
    Clock,
    GraduationCap,
    MapPin,
    CheckCircle2,
    ArrowRight,
    Briefcase,
    HelpCircle,
    FolderGit2,
    Calendar,
    Layers,
    Wrench,
    ShieldCheck,
    ChevronDown,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await props.params;
    const formation = await getFormationBySlug(slug);
    if (!formation) return {};
    return {
        title: `${formation.title} — Formation`,
        description:
            formation.shortDescription ||
            `Formation ${formation.title} proposée par FuturCraft Institut à Godomey, Supermarché O Bénin Avant pk14 (Bénin).`,
        other: {
            'script:ld+json': JSON.stringify([
                {
                    '@context': 'https://schema.org',
                    '@type': 'Course',
                    name: formation.title,
                    description: formation.shortDescription,
                    provider: {
                        '@type': 'Organization',
                        name: 'FuturCraft Institut',
                        url: 'https://futurcraft.bj',
                        logo: 'https://futurcraft.bj/images/Logo-crop.png',
                        address: {
                            '@type': 'PostalAddress',
                            streetAddress: 'Supermarché O Bénin, avant pk14',
                            addressLocality: 'Godomey',
                            addressRegion: 'Cotonou',
                            addressCountry: 'BJ',
                        },
                        telephone: '+229 43 32 78 32',
                        email: 'contact@futurcraftinstitut.com',
                    },
                    offers: {
                        '@type': 'Offer',
                        price: formation.price,
                        priceCurrency: 'XOF',
                        availability: 'https://schema.org/InStock',
                    },
                    educationalCredentialAwarded:
                        'Certificat Professionnel de Compétences FuturCraft',
                    timeRequired: formation.duration,
                    educationalLevel: formation.level,
                    teaches: JSON.parse(formation.competencies || '[]'),
                },
                {
                    '@context': 'https://schema.org',
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        {
                            '@type': 'ListItem',
                            position: 1,
                            name: 'Accueil',
                            item: 'https://futurcraft.bj',
                        },
                        {
                            '@type': 'ListItem',
                            position: 2,
                            name: 'Formations',
                            item: 'https://futurcraft.bj/formations',
                        },
                        {
                            '@type': 'ListItem',
                            position: 3,
                            name: formation.title,
                            item: `https://futurcraft.bj/formation/${slug}`,
                        },
                    ],
                },
            ]),
        },
    };
}

export default async function FormationDetailPage(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await props.params;
    const formation = await getFormationBySlug(slug);

    if (!formation) {
        notFound();
    }

    const promotions = await getPromotions(formation.id);
    const projects = await getProjects();
    const relatedProjects = projects.filter((p) =>
        p.formationTitle
            .toLowerCase()
            .includes(formation.title.slice(0, 10).toLowerCase())
    );

    const modules = JSON.parse(formation.modules || '[]') as {
        moduleNumber: string;
        title: string;
        description: string;
        duration: string;
    }[];

    const competencies = JSON.parse(formation.competencies || '[]') as string[];
    const tools = JSON.parse(formation.tools || '[]') as string[];
    const jobs = JSON.parse(formation.jobs || '[]') as string[];

    const faqs = [
        { q: 'Quels sont les prérequis pour intégrer cette formation ?', a: `Le niveau recommandé est ${formation.level}. La motivation, la rigueur et la régularité dans la pratique sont les critères d'admission les plus déterminants.` },
        { q: "Comment s'organisent les paiements des frais de formation ?", a: `Les frais s'élèvent à ${formation.price.toLocaleString('fr-FR')} FCFA. Vous pouvez payer en plusieurs mensualités (jusqu'à ${formation.installmentsCount} fois) par MTN MoMo, Moov Money, carte bancaire ou directement à la caisse.` },
        { q: 'Obtient-on une attestation ou certification reconnue ?', a: "Oui, à l'issue de la formation et après validation de la soutenance du projet devant jury professionnel, vous recevez le Certificat Professionnel de Compétences FuturCraft avec vérification numérique par QR Code." },
        { q: 'Les cours ont-ils lieu en présentiel ou en ligne ?', a: `Cette formation est dispensée en mode ${formation.mode} sur nos campus de ${formation.campus}. Les ateliers pratiques se font en laboratoire équipé.` },
    ];
    
    const campusSpotlight = getCampusImagesForSlug(formation.slug);
const courseJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: formation.title,
        description: formation.shortDescription || formation.title,
        provider: { '@type': 'EducationalOrganization', name: 'FuturCraft Institut', url: 'https://futurcraft.bj' },
        offers: { '@type': 'Offer', price: formation.price, priceCurrency: 'XOF', availability: 'https://schema.org/InStock' },
        timeRequired: formation.duration,
        educationalLevel: formation.level,
        url: `https://futurcraft.bj/formation/${slug}`,
    };
    const faqJsonLd = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    };

    return (
        <div className="bg-[var(--color-fc-bg)] min-h-screen">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([courseJsonLd, faqJsonLd]) }} />
            {/* HERO */}
            <section className="relative isolate overflow-hidden bg-[var(--color-fc-deep)] text-white">
                <div className="absolute inset-0">
                    <Image
                        src={formation.imageUrl}
                        alt={formation.title}
                        fill
                        priority
                        sizes="100vw"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAn/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        className="object-cover object-center opacity-20"
                    />
                    <div className="absolute inset-0 bg-[#06122f]/75" />
                </div>

                <div className="relative mx-auto max-w-[84rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
                    <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-white/55">
                        <Link href="/" className="hover:text-white">Accueil</Link>
                        <span>/</span>
                        <Link href="/formations" className="hover:text-white">Formations</Link>
                        <span>/</span>
                        <span className="text-white/80">{formation.title}</span>
                    </nav>

                    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-end">
                        <div className="max-w-4xl">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-fc-cyan)]">
                                    {formation.category}
                                </span>
                                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/75">
                                    {formation.campus}
                                </span>
                            </div>

                            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.06] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                                {formation.title}
                            </h1>

                            <p className="mt-6 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
                                {formation.shortDescription}
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href={`/inscription?formationId=${formation.id}`}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-fc-cyan)] px-7 py-4 text-sm font-extrabold text-[#06122f] transition-colors hover:bg-white"
                                >
                                    Candidater à cette formation
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                                <a
                                    href="#programme"
                                    className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-7 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                                >
                                    Voir le programme
                                    <ChevronDown className="h-4 w-4" />
                                </a>
                            </div>
                        </div>

                        <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">En bref</p>
                            <div className="mt-5 space-y-4 text-sm">
                                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                                    <span className="text-white/60">Durée</span>
                                    <span className="font-semibold text-white">{formation.duration}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                                    <span className="text-white/60">Niveau</span>
                                    <span className="font-semibold text-white">{formation.level}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                                    <span className="text-white/60">Modalité</span>
                                    <span className="font-semibold text-white">{formation.mode}</span>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-white/60">Tarif</span>
                                    <span className="font-display text-lg font-extrabold text-[var(--color-fc-cyan)]">{formation.price.toLocaleString('fr-FR')} FCFA</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-[84rem] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
                    <div className="space-y-14 lg:col-span-8">
                        <section className="space-y-5">
                            <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
                                À propos
                            </p>
                            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-fc-black)] sm:text-4xl">
                                Une formation conçue pour la pratique.
                            </h2>
                            <p className="max-w-3xl text-base leading-8 text-[var(--color-fc-gray-mid)] whitespace-pre-line">
                                {formation.fullDescription}
                            </p>
                        </section>

                        <section id="programme" className="scroll-mt-24 space-y-6">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
                                        Programme
                                    </p>
                                    <h2 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[var(--color-fc-black)]">Ce que tu vas apprendre</h2>
                                </div>
                                <span className="text-sm font-semibold text-[var(--color-fc-gray-mid)]">{modules.length} modules</span>
                            </div>

                            <div className="space-y-3">
                                {modules.map((m, idx) => (
                                    <div key={idx} className="rounded-2xl border border-[var(--color-fc-gray-light)] bg-white p-5 transition-colors hover:border-[var(--color-fc-primary)]/25 sm:p-6">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="rounded-lg bg-[var(--color-fc-bg)] px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-[var(--color-fc-primary)]">
                                                {m.moduleNumber}
                                            </span>
                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-fc-gray-mid)]">
                                                <Clock className="h-3.5 w-3.5" /> {m.duration}
                                            </span>
                                        </div>
                                        <h3 className="mt-3 font-display text-lg font-bold text-[var(--color-fc-black)]">{m.title}</h3>
                                        <p className="mt-2 text-sm leading-7 text-[var(--color-fc-gray-mid)]">{m.description}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="grid gap-10 sm:grid-cols-2">
                            <div className="space-y-5">
                                <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
                                    Compétences
                                </p>
                                <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--color-fc-black)]">Ce que tu sauras faire</h2>
                                <div className="space-y-3">
                                    {competencies.map((comp, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-fc-primary)]" />
                                            <span className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">{comp}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-5">
                                <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
                                    Débouchés
                                </p>
                                <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--color-fc-black)]">Métiers accessibles</h2>
                                <div className="space-y-3">
                                    {jobs.map((j, idx) => (
                                        <div key={idx} className="flex items-center gap-3 rounded-xl border border-[var(--color-fc-gray-light)] bg-white px-4 py-3">
                                            <Briefcase className="h-4 w-4 shrink-0 text-[var(--color-fc-primary)]" />
                                            <span className="text-sm font-semibold text-[var(--color-fc-black)]">{j}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {campusSpotlight && (
                            <section className="space-y-6">
                                <div>
                                    <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">En immersion</p>
                                    <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--color-fc-black)] sm:text-3xl">{campusSpotlight.label} à FuturCraft</h2>
                                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-fc-gray-mid)]">Des images réelles de nos ateliers pour vous projeter dans l&apos;apprentissage pratique et l&apos;ambiance du campus.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                    {campusSpotlight.images.map((img, idx) => (
                                        <figure key={idx} className="group overflow-hidden rounded-2xl border border-[var(--color-fc-gray-light)] bg-white">
                                            <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-fc-gray-light)]/30">
                                                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                                            </div>
                                        </figure>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="space-y-5">
                            <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
                                Outils
                            </p>
                            <h2 className="font-display text-2xl font-extrabold tracking-tight text-[var(--color-fc-black)]">Outils & technologies</h2>
                            <div className="flex flex-wrap gap-2">
                                {tools.map((t, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-fc-gray-light)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-fc-gray-mid)]">
                                        <Wrench className="h-3.5 w-3.5 text-[var(--color-fc-primary)]" />
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {relatedProjects.length > 0 && (
                            <section className="space-y-6">
                                <div>
                                    <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
                                        Projets
                                    </p>
                                    <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--color-fc-black)]">Réalisations liées à cette filière</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                    {relatedProjects.map((proj) => (
                                        <article key={proj.id} className="overflow-hidden rounded-2xl border border-[var(--color-fc-gray-light)] bg-white">
                                            <div className="relative h-40 bg-[var(--color-fc-gray-light)]/30">
                                                <Image src={proj.coverImage} alt={proj.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                                            </div>
                                            <div className="p-5">
                                                <h4 className="font-display font-bold text-[var(--color-fc-black)]">{proj.title}</h4>
                                                <p className="mt-2 text-sm leading-7 text-[var(--color-fc-gray-mid)] line-clamp-2">{proj.description}</p>
                                                <Link href="/projets-etudiants" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[var(--color-fc-primary)] hover:underline">
                                                    Voir les projets <ArrowRight className="h-3.5 w-3.5" />
                                                </Link>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="space-y-6">
                            <div>
                                <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
                                    FAQ
                                </p>
                                <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--color-fc-black)]">Questions fréquentes</h2>
                            </div>
                            <div className="space-y-3">
                                {faqs.map((faq, idx) => (
                                    <details key={idx} className="group rounded-2xl border border-[var(--color-fc-gray-light)] bg-white p-5">
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[var(--color-fc-black)]">
                                            <span className="flex items-start gap-3"><HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-fc-primary)]" />{faq.q}</span>
                                            <ChevronDown className="h-4 w-4 shrink-0 text-[var(--color-fc-gray-mid)] transition-transform group-open:rotate-180" />
                                        </summary>
                                        <p className="mt-3 pl-7 text-sm leading-7 text-[var(--color-fc-gray-mid)]">{faq.a}</p>
                                    </details>
                                ))}
                            </div>
                        </section>
                    </div>

                    <aside className="lg:col-span-4">
                        <div className="sticky top-28 space-y-5">
                            <div className="rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-white p-6 shadow-sm sm:p-7">
                                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-fc-gray-mid)]">Inscription</p>
                                <div className="mt-3 font-display text-3xl font-extrabold tracking-tight text-[var(--color-fc-black)]">
                                    {formation.price.toLocaleString('fr-FR')} <span className="text-base font-bold text-[var(--color-fc-gray-mid)]">FCFA</span>
                                </div>
                                <p className="mt-1 text-sm text-[var(--color-fc-gray-mid)]">
                                    Frais de dossier : {formation.registrationFee.toLocaleString('fr-FR')} FCFA
                                </p>

                                {promotions.length > 0 && (
                                    <div className="mt-6 space-y-2 border-t border-[var(--color-fc-gray-light)] pt-5">
                                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-fc-gray-mid)]">Prochaines sessions</p>
                                        {promotions.map((p) => (
                                            <div key={p.id} className="rounded-xl bg-[var(--color-fc-bg)] px-4 py-3 text-sm">
                                                <p className="font-semibold text-[var(--color-fc-black)]">{p.name}</p>
                                                <p className="mt-0.5 text-xs text-[var(--color-fc-gray-mid)]">Début : {p.startDate} · {p.campus}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <Link
                                    href={`/inscription?formationId=${formation.id}`}
                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-fc-deep)] px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-fc-primary)]"
                                >
                                    Candidater <ArrowRight className="h-4 w-4" />
                                </Link>

                                <div className="mt-6 space-y-3 border-t border-[var(--color-fc-gray-light)] pt-5 text-sm text-[var(--color-fc-gray-mid)]">
                                    <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-fc-primary)]" /><span>Paiement échelonné jusqu&apos;à {formation.installmentsCount} fois</span></div>
                                    <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-fc-primary)]" /><span>Accompagnement projet et insertion</span></div>
                                    <div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-fc-primary)]" /><span>Attestation officielle vérifiable</span></div>
                                </div>
                            </div>

                            <div className="rounded-[1.75rem] border border-[var(--color-fc-primary)]/15 bg-[var(--color-fc-surface)] p-6">
                                <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--color-fc-primary)]">Besoin d&apos;infos ?</p>
                                <p className="mt-3 text-sm leading-7 text-[var(--color-fc-gray-mid)]">
                                    Échange avec un conseiller sur cette formation avant de candidater.
                                </p>
                                <a href="https://wa.me/22943327832" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[var(--color-fc-primary)] hover:underline">
                                    WhatsApp +229 43 32 78 32 <ArrowRight className="h-3.5 w-3.5" />
                                </a>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <section className="border-t border-[var(--color-fc-gray-light)] bg-white">
                <div className="mx-auto max-w-[84rem] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
                    <div className="flex flex-col items-start justify-between gap-8 rounded-[2rem] bg-[var(--color-fc-deep)] px-8 py-12 text-white sm:px-12 lg:flex-row lg:items-center">
                        <div className="max-w-2xl">
                            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-cyan)]">Prochaine cohorte</p>
                            <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Prêt à te lancer en {formation.title} ?</h2>
                            <p className="mt-3 text-sm leading-7 text-white/65">Les places sont limitées. Candidate maintenant ou échange avec un conseiller pour valider ton choix.</p>
                        </div>
                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <Link href={`/inscription?formationId=${formation.id}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-fc-cyan)] px-6 py-3.5 text-sm font-bold text-[#06122f] transition-colors hover:bg-white">
                                Candidater <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link href="/contact" className="inline-flex items-center justify-center rounded-xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10">
                                Parler à un conseiller
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
