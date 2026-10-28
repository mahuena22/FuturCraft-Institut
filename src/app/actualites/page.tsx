import { getBlogArticles } from "@/lib/data-service";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";

export const revalidate = 3600;
export const metadata = {
  title: "Actualités & Blog Tech | FuturCraft Institut Bénin",
  description:
    "Suivez les dernières tendances numériques, les conseils d'orientation et les événements de FuturCraft Institut à Godomey, Supermarché O Bénin Avant pk14.",
};

export default async function ActualitesPage() {
  const articles = await getBlogArticles();

  return (
    <div className="min-h-screen bg-[var(--color-fc-bg)]">
      <PageIntro
        eyebrow="Insights & médias"
        title="Actualités & publications"
        description="Analyses du marché de la tech en Afrique, conseils pour réussir son insertion professionnelle et retours sur nos promotions."
      />
      <div className="page-container py-14 sm:py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {articles.map((art) => (
            <article
              key={art.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-[var(--color-fc-gray-light)] bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-[var(--color-fc-primary)]/30 hover:shadow-xl"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                <Image
                  src={art.coverImage}
                  alt={art.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span                   className="rounded-lg bg-white/95 px-2.5 py-1 text-[11px] font-bold text-[var(--color-fc-primary)] shadow-sm backdrop-blur-xs">
                    {art.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-[var(--color-fc-gray-mid)]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {art.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold leading-snug text-[var(--color-fc-black)] transition-colors group-hover:text-[var(--color-fc-primary)]">
                    {art.title}
                  </h3>

                  <p className="line-clamp-3 text-sm leading-relaxed text-[var(--color-fc-gray-mid)]">
                    {art.excerpt}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--color-fc-gray-light)] pt-4 text-xs text-[var(--color-fc-gray-mid)]">
                  <span className="text-[11px] font-semibold text-[var(--color-fc-black)]">{art.author}</span>
                  <Link
                    href={`/actualites/${art.slug}`}
                    className="flex items-center gap-1 font-bold text-[var(--color-fc-primary)] transition-transform group-hover:translate-x-0.5"
                  >
                    Lire l&apos;article →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
