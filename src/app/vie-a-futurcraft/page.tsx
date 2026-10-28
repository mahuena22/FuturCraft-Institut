import { getEvents } from '@/lib/data-service';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react';

export const revalidate = 3600;
export const metadata = {
    title: 'Vie à FuturCraft | FuturCraft Institut Bénin',
    description:
        "Découvrez l'ambiance, les hackathons, ateliers pratiques, sorties de promotion et moments de vie sur les campus de FuturCraft Institut.",
};

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
        desc: 'En immersion professionnelle, les étudiants de FuturCraft Institut ont effectué une sortie professionnelle pour découvrir les réalités du terrain et mettre en pratique les attitudes et compétences acquises en formation.',
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

export default async function ViePage() {
    const events = await getEvents();

    return (
        <div className="min-h-screen bg-white">
            <section className="relative overflow-hidden bg-[var(--color-fc-deep)] py-20 text-white lg:py-28">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/bg-banniere.jpeg"
                        alt="FuturCraft Institut"
                        fill
                        priority
                        sizes="100vw"
                        className="object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#051269]/90 via-[#051269]/85 to-[#051269]/95" />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl space-y-4 px-4 text-center sm:px-6 lg:px-8">
                    <span className="rounded-full border border-blue-400/30 bg-blue-900/60 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-300">
                        Immersion &amp; Communauté
                    </span>
                    <h1 className="mx-auto max-w-4xl text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                        La Vie à
                        <span className="text-gradient-brand mt-1 block">
                            FuturCraft Institut
                        </span>
                    </h1>
                    <p className="mx-auto max-w-2xl text-base leading-relaxed text-blue-100/80 sm:text-lg">
                        Plus qu&apos;une école, une communauté passionnée.
                        Découvrez l&apos;ambiance sur nos campus, les hackathons
                        effervescents et les moments inoubliables.
                    </p>
                </div>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
            </section>

            <div className="mx-auto max-w-7xl space-y-16 px-4 py-16 sm:px-6 lg:px-8">
                <section className="space-y-6">
                    <div>
                        <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
                            Agenda Officiel
                        </span>
                        <h2 className="mt-1 text-2xl font-extrabold text-slate-950 sm:text-3xl">
                            Événements &amp; Hackathons à Venir
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        {events.map((ev) => (
                            <div
                                key={ev.id}
                                className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:border-blue-300 hover:shadow-xl"
                            >
                                <div className="relative aspect-[16/10] bg-slate-100">
                                    <Image
                                        src={ev.imageUrl}
                                        alt={ev.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover"
                                    />
                                    <div className="absolute left-3 top-3">
                                        <span className="rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-bold text-white">
                                            {ev.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-1 flex-col justify-between space-y-3 p-5">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span className="flex items-center gap-1 font-semibold text-blue-600">
                                                <CalendarDays className="h-3.5 w-3.5" />
                                                {ev.date}
                                            </span>
                                        </div>
                                        <h3 className="text-base font-bold leading-snug text-slate-900">
                                            {ev.title}
                                        </h3>
                                        <p className="line-clamp-3 text-xs leading-relaxed text-slate-600">
                                            {ev.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                                        <span className="flex items-center gap-1 text-[11px]">
                                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                                            {ev.location}
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {ev.attendeesCount} inscrits
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="space-y-6 border-t border-slate-200 pt-6">
                    <div>
                        <span className="rounded bg-violet-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-violet-600">
                            Magazine Campus
                        </span>
                        <h2 className="mt-1 text-2xl font-extrabold text-slate-950 sm:text-3xl">
                            Les Temps Forts de nos Promotions
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                        {lifeMoments.map((moment) => (
                            <article
                                key={moment.title}
                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs transition-all hover:shadow-lg"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                                    <Image
                                        src={moment.image}
                                        alt={moment.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute left-3 top-3">
                                        <span className="rounded-md bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow-xs backdrop-blur-xs">
                                            {moment.tag}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-2 p-6">
                                    <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600">
                                        {moment.title}
                                    </h3>
                                    <p className="text-xs leading-relaxed text-slate-600">
                                        {moment.desc}
                                    </p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="space-y-4 rounded-3xl border border-blue-100 bg-blue-50/70 p-8 text-center sm:p-12">
                    <h3 className="text-2xl font-black text-slate-950">
                        Envie de vivre l&apos;expérience FuturCraft ?
                    </h3>
                    <p className="mx-auto max-w-xl text-xs text-slate-600 sm:text-sm">
                        Participez à la prochaine journée portes ouvertes ou
                        postulez directement en ligne pour rejoindre la
                        prochaine cohorte.
                    </p>
                    <div className="pt-2">
                        <Link
                            href="/inscription"
                            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-md transition-all hover:bg-blue-700"
                        >
                            <span>Rejoindre la promotion 2026</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
