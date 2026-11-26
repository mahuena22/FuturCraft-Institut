import Link from "next/link";
import { PageIntro } from "@/components/PageIntro";

export const revalidate = 3600;
export const metadata = {
  title: "Mentions légales | FuturCraft Institut Bénin",
  description:
    "Mentions légales de FuturCraft Institut : éditeur, hébergement, propriété intellectuelle et coordonnées officielles.",
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-[var(--color-fc-bg)]">
      <PageIntro
        eyebrow="Informations légales"
        title="Mentions légales"
        description="Informations officielles relatives à FuturCraft Institut et à l'édition du site."
      />
      <div className="page-container max-w-3xl space-y-8 py-12 sm:py-16">
        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Éditeur du site</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            FuturCraft Institut — centre de formation pratique aux métiers du numérique.<br />
            Siège : Godomey, Supermarché O Bénin, avant pk14, Abomey-Calavi, Bénin.<br />
            Téléphone : +229 43 32 78 32 / +229 01 97 30 30 50<br />
            Email : futurcraftinstitut@gmail.com
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Directeur de la publication</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            Gauthier I. ORE, Directeur des stages et emplois — FuturCraft Institut.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Hébergement</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.
            Les données applicatives sont stockées sur Neon (PostgreSQL serverless).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Propriété intellectuelle</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            L&apos;ensemble des contenus (textes, images, logos, graphismes, vidéos) présents sur ce site est protégé par le droit d&apos;auteur.
            Toute reproduction, représentation, modification ou adaptation, totale ou partielle, sans autorisation écrite préalable de FuturCraft Institut, est interdite.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-extrabold text-[var(--color-fc-black)]">Responsabilité</h2>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            FuturCraft Institut s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations diffusées sur ce site.
            Toutefois, des erreurs ou omissions peuvent survenir. L&apos;institut ne saurait être tenu responsable des dommages directs ou indirects résultant de l&apos;utilisation du site.
          </p>
        </section>

        <div className="pt-4">
          <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-fc-primary)] hover:underline">
            Nous contacter <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
