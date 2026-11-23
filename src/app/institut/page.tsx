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
import { PageIntro } from "@/components/PageIntro";

export const revalidate = 3600;

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
      role: "Co-founder & Prompt engineer ",
      image: "/images/Yoan-DANSOU.jpg",
      bio: " Co-fondateur et expert en prompt engineering, il explore les usages avancés de l'IA générative pour former la prochaine génération.",
    },
    {
      name: "Gauthier I. ORE",
      role: "Directeur des stages et emplois  ",
      image: "/images/gauthier.jpg",
      bio: "Organise les stages et insertions professionnelles des étudiants de FuturCraft pour garantir leur transition réussie du monde de la formation vers celui de l'emploi.",
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
    <div className="min-h-screen bg-[var(--color-fc-bg)]">
      <PageIntro
        eyebrow="L'institut d'excellence"
        title="Bâtir la prochaine génération de talents numériques africains."
        description="Nous ne formons pas simplement des étudiants. Nous aidons une génération à construire, créer et transformer son avenir."
      />

      <section className="page-container py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-6 lg:col-span-6">
            <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
              Notre histoire
            </p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-fc-black)] sm:text-4xl">
              Former des talents utiles, pas seulement diplômés.
            </h2>
            <div className="space-y-4 text-base leading-8 text-[var(--color-fc-gray-mid)]">
              <p>
                FuturCraft Institut est né d&apos;un constat simple : beaucoup de jeunes apprennent la théorie, mais peu ont l&apos;occasion de pratiquer dans des conditions proches du réel.
              </p>
              <p>
                Notre réponse : des formations courtes, pratiques, encadrées par des professionnels, avec des projets concrets, du mentorat et un accompagnement vers l&apos;emploi ou l&apos;entrepreneuriat.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-6">
            <div className="rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]">
                <Target className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-[var(--color-fc-black)]">Notre mission</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-fc-gray-mid)]">
                Donner aux apprenants les compétences, la confiance et le portfolio pour créer de la valeur sur le marché du numérique.
              </p>
            </div>
            <div className="rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-white p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-[var(--color-fc-black)]">Notre vision</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--color-fc-gray-mid)]">
                Faire de FuturCraft une référence de la formation numérique pratique au Bénin et en Afrique de l&apos;Ouest.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-[var(--color-fc-gray-light)] pt-16 lg:mt-24 lg:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
              Nos valeurs
            </p>
            <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[var(--color-fc-black)] sm:text-4xl">
              Ce qui guide notre manière de former
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-white p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-[var(--color-fc-black)]">{v.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--color-fc-gray-mid)]">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-[var(--color-fc-gray-light)] pt-16 lg:mt-24 lg:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="inline-flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">
              L&apos;équipe
            </p>
            <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-[var(--color-fc-black)] sm:text-4xl">
              Des professionnels engagés pour ta progression
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {team.map((m) => (
              <article key={m.name} className="rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-white p-6 text-center">
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-2xl bg-[var(--color-fc-gray-light)]/40">
                  <Image src={m.image} alt={m.name} fill sizes="96px" className="object-cover" />
                </div>
                <h3 className="mt-5 font-display text-base font-bold text-[var(--color-fc-black)]">{m.name}</h3>
                <p className="mt-1 text-xs font-semibold text-[var(--color-fc-primary)]">{m.role}</p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-fc-gray-mid)]">{m.bio}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-20 overflow-hidden rounded-[2rem] bg-[var(--color-fc-deep)] px-8 py-12 text-white sm:px-12 lg:mt-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-cyan)]">Campus</p>
              <h3 className="mt-4 font-display text-3xl font-extrabold tracking-tight">Un espace conçu pour la pratique</h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
                À Godomey, les apprenants travaillent dans un environnement équipé pour apprendre vite, collaborer et produire des projets concrets.
              </p>
              <div className="mt-6 flex items-start gap-3 text-sm text-white/75">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-fc-cyan)]" />
                <span>Godomey, Supermarché O Bénin, avant pk14, Abomey-Calavi</span>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Salles informatiques équipées", "Studio audiovisuel", "Ateliers pratiques", "Accompagnement mentoré"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-medium text-white/85">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
