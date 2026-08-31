import { getEvents } from "@/lib/data-service";
import Link from "next/link";
import Image from "next/image";
import {
  CalendarDays,
  Users,
  MapPin,
  ArrowRight,
  Camera,
  Trophy,
  Coffee,
  Code2,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Vie à FuturCraft | FuturCraft Institut Bénin",
  description:
    "Découvrez l'ambiance, les hackathons, ateliers pratiques, sorties de promotion et moments de vie sur les campus de FuturCraft Institut.",
};

export default async function ViePage() {
  const events = await getEvents();

  const lifeMoments = [
    {
      title: "Ateliers Code & Pizza",
      desc: "Des sessions nocturnes de coding collaboratif pour débugger en équipe dans une ambiance festive et stimulante.",
      image: "/images/pro2.jpg",
      tag: "Coding Night",
    },
    {
      title: "Sorties Terrain & Vol Drone",
      desc: "Pratique en plein air à Ouidah et Calavi pour cartographier des parcelles agricoles et capturer des plans cinématiques.",
      image: "/images/Excution-Ganvie.jpg",
      tag: "Pratique Terrain",
    },
    {
      title: "Masterclasses & Conférences Tech",
      desc: "Interventions régulières d'ingénieurs de la Silicon Valley, d'experts de Sèmè City et de fondateurs de startups béninoises.",
      image: "/images/projet-vano-baby.jpg",
      tag: "Masterclass",
    },
    {
      title: "Studio Design & Shootings Médias",
      desc: "Prise en main des boîtiers Sony, éclairages studio trois points et conception d'identités de marque.",
      image: "/images/Montage-Video.jpg",
      tag: "Atelier Créatif",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-16 lg:py-24 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-violet-400 bg-violet-950 px-3 py-1 rounded-full border border-violet-800">
            Immersion &amp; Communauté
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            La Vie à FuturCraft Institut
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Plus qu&apos;une école, une communauté passionnée. Découvrez l&apos;ambiance sur nos campus, les hackathons effervescents et les moments inoubliables.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Événements à venir */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                Agenda Officiel
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
                Événements &amp; Hackathons à Venir
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col"
              >
                <div className="relative aspect-[16/10] bg-slate-100">
                  <Image
                    src={ev.imageUrl}
                    alt={ev.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-600 text-white">
                      {ev.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-blue-600">
                        <CalendarDays className="w-3.5 h-3.5" /> {ev.date}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">{ev.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {ev.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {ev.location}
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

        {/* Moments de vie grid */}
        <section className="space-y-6 pt-6 border-t border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2.5 py-1 rounded">
              Magazine Campus
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 mt-1">
              Les Temps Forts de nos Promotions
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {lifeMoments.map((m, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all group"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                  <Image
                    src={m.image}
                    alt={m.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 text-slate-900 backdrop-blur-xs shadow-xs">
                      {m.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="p-8 sm:p-12 rounded-3xl bg-blue-50/70 border border-blue-100 text-center space-y-4">
          <h3 className="text-2xl font-black text-slate-950">Envie de vivre l&apos;expérience FuturCraft ?</h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
            Participez à la prochaine journée portes ouvertes ou postulez directement en ligne pour rejoindre la prochaine cohorte.
          </p>
          <div className="pt-2">
            <Link
              href="/inscription"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all"
            >
              <span>Rejoindre la promotion 2026</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
