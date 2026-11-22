import { getEvents } from '@/lib/data-service';
import Link from 'next/link';
import Image from 'next/image';
import {
    CalendarDays,
    Users,
    MapPin,
    ArrowRight,
    Camera,
    Trophy,
    Coffee,
    Code2,
} from 'lucide-react';
import { PageIntro } from '@/components/PageIntro';

export const revalidate = 3600;
export const metadata = {
    title: 'Vie à FuturCraft | FuturCraft Institut Bénin',
    description:
        "Découvrez l'ambiance, les hackathons, ateliers pratiques, sorties de promotion et moments de vie sur les campus de FuturCraft Institut.",
};

export default async function ViePage() {
    const events = await getEvents();

    const lifeMoments = [
        {
            title: 'Ateliers Code & Développement',
            desc: 'Des sessions nocturnes de coding collaboratif pour débugger en équipe dans une ambiance festive et stimulante.',
            image: '/images/CodingNight.jpg',
            tag: 'Coding Night',
        },
        {
            title: 'Sortie sur Ouidah',
            desc: "Pratique en plein air à Ouidah : les étudiants en Audiovisuel de FuturCraft Institut ont mis leurs compétences en pratique en capturant des plans cinématiques au cœur de la richesse culturelle de la ville. Une immersion sur le terrain pour travailler cadrage, lumière et mouvements de caméra, tout en racontant une histoire à travers l'image.",
            image: '/images/sortieSurOuidah.jpg',
            tag: 'Pratique Terrain',
        },
        {
            title: 'Du campus au terrain : place au professionnalisme !',
            desc: 'En immersion professionnelle. Les étudiants de FuturCraft Institut ont effectué une sortie professionnelle, vêtus de leur tenue professionnelle, pour découvrir les réalités du terrain et mettre en pratique les attitudes et compétences acquises en formation.',
            image: '/images/photoProfessionnelle.jpg',
            tag: 'Immersion professionnelle',
        },
        {
            title: 'Atelier en Maintenance Informatique',
            desc: "Pratique en maintenance informatique : les étudiants de FuturCraft Institut passent à l'action pour découvrir les techniques de diagnostic et d'entretien des équipements informatiques. Une immersion pratique pour développer leur autonomie et apprendre à résoudre concrètement les problèmes techniques.",
            image: '/images/maintenanceInformatique2.jpg',
            tag: 'Maintenance Informatique',
        },
    ];

    return (
        <div className="min-h-screen bg-[var(--color-fc-bg)]">
            <PageIntro
                eyebrow="Immersion & communauté"
                title="La vie sur le campus."
                description="Découvrez la vie du campus, les ateliers pratiques, les hackathons et les moments partagés qui font grandir chaque talent."
            />

            <div className="page-container space-y-16 py-14 sm:py-20">
                {/* Événements à venir */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-fc-primary)] bg-[var(--color-fc-primary)]/10 px-2.5 py-1 rounded">
                                Agenda Officiel
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-fc-black)] mt-1">
                                Événements &amp; Hackathons à Venir
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {events.map((ev) => (
                            <div
                                key={ev.id}
                                className="bg-white rounded-2xl border border-[var(--color-fc-gray-light)] overflow-hidden shadow-xs hover:shadow-xl hover:border-[var(--color-fc-primary)]/40 transition-all flex flex-col"
                            >
                                <div className="relative aspect-[16/10] bg-[var(--color-fc-gray-light)]">
                                    <Image
                                        src={ev.imageUrl}
                                        alt={ev.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[var(--color-fc-deep)] text-white">
                                            {ev.category}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-xs text-[var(--color-fc-gray-mid)]">
                                            <span className="flex items-center gap-1 font-semibold text-[var(--color-fc-primary)]">
                                                <CalendarDays className="w-3.5 h-3.5" />{' '}
                                                {ev.date}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-[var(--color-fc-black)] text-base leading-snug">
                                            {ev.title}
                                        </h3>
                                        <p className="text-xs text-[var(--color-fc-gray-mid)] leading-relaxed line-clamp-3">
                                            {ev.description}
                                        </p>
                                    </div>

                                    <div className="pt-3 border-t border-[var(--color-fc-gray-light)] flex items-center justify-between text-xs text-[var(--color-fc-gray-mid)]">
                                        <span className="flex items-center gap-1 text-[11px]">
                                            <MapPin className="w-3.5 h-3.5 text-[var(--color-fc-gray-mid)]" />{' '}
                                            {ev.location}
                                        </span>
                                        <span className="font-bold text-[var(--color-fc-black)]">
                                            {ev.attendeesCount} inscrits
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Moments de vie grid */}
                <section className="space-y-6 pt-6 border-t border-[var(--color-fc-gray-light)]">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-fc-primary)] bg-[var(--color-fc-primary)]/10 px-2.5 py-1 rounded">
                            Magazine Campus
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-fc-black)] mt-1">
                            Les Temps Forts de nos Promotions
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {lifeMoments.map((m, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl border border-[var(--color-fc-gray-light)] overflow-hidden shadow-xs hover:shadow-lg transition-all group"
                            >
                                <div className="aspect-[16/10] overflow-hidden bg-[var(--color-fc-gray-light)] relative">
                                    <Image
                                        src={m.image}
                                        alt={m.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 text-[var(--color-fc-black)] backdrop-blur-xs shadow-xs">
                                            {m.tag}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 space-y-2">
                                    <h3 className="text-lg font-bold text-[var(--color-fc-black)] group-hover:text-[var(--color-fc-primary)] transition-colors">
                                        {m.title}
                                    </h3>
                                    <p className="text-xs text-[var(--color-fc-gray-mid)] leading-relaxed">
                                        {m.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-[2rem] bg-[var(--color-fc-deep)] px-8 py-12 text-center text-white sm:px-12">
                    <h3 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">Envie de vivre l&apos;expérience FuturCraft ?</h3>
                    <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/65">
                        Participe à une journée portes ouvertes ou candidate directement pour rejoindre la prochaine cohorte.
                    </p>
                    <div className="mt-8">
                        <Link href="/inscription" className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-fc-cyan)] px-6 py-3.5 text-sm font-bold text-[#06122f] transition-colors hover:bg-white">
                            Rejoindre la promotion 2026 <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
