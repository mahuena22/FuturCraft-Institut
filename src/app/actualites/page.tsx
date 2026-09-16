import { getBlogArticles } from "@/lib/data-service";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";

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
      {/* Hero Header */}
      <section className="relative bg-[var(--color-fc-deep)] text-white py-20 lg:py-28 overflow-hidden">
        {/* Background photo */}
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

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="badge-brand mb-2 mx-auto w-fit text-blue-300 border-blue-400/30">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Insights &amp; Médias
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-3xl mx-auto">
            Actualités &amp;
            <span className="block text-gradient-brand mt-1">
              Publications Tech
            </span>
          </h1>

          <p className="mt-4 text-blue-100/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Analyses du marché de la tech en Afrique, conseils pour réussir son insertion professionnelle et retours sur nos promotions.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-fc-bg)] to-transparent pointer-events-none" />
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
