import { getBlogArticles } from "@/lib/data-service";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight } from "lucide-react";

export const revalidate = 3600;
export const metadata = {
  title: "Actualités & Blog Tech | FuturCraft Institut Bénin",
  description:
    "Suivez les dernières tendances numériques, les conseils d'orientation et les événements de FuturCraft Institut à Godomey, Supermarché O Bénin Avant pk14.",
};

export default async function ActualitesPage() {
  const articles = await getBlogArticles();

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Insights &amp; Médias
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Actualités &amp; Publications
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Analyses du marché de la tech en Afrique, conseils pour réussir son insertion professionnelle et retours sur nos promotions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col group"
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
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-white/95 backdrop-blur-xs text-blue-700 shadow-xs">
                    {art.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {art.publishedAt}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {art.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-700 text-[11px]">{art.author}</span>
                  <Link
                    href={`/actualites/${art.slug}`}
                    className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
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
