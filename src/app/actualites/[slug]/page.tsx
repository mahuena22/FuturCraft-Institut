import { getBlogArticleBySlug, getBlogArticles } from "@/lib/data-service";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getBlogArticleBySlug(slug);
  if (!article) return {};
  return {
    title: `${article.title} — Blog FuturCraft`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [{ url: article.coverImage, width: 1200, height: 627 }],
    },
  };
}

export default async function ArticleDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const article = await getBlogArticleBySlug(slug);
  if (!article) notFound();

  const paragraphs = article.content.split("\n\n").filter(Boolean);

  return (
    <div className="bg-white min-h-screen py-12">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Back link */}
        <Link
          href="/actualites"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux actualités
        </Link>

        {/* Cover image */}
        <div className="aspect-[16/9] relative rounded-2xl overflow-hidden bg-slate-100">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
            {article.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {article.publishedAt}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
          <span>•</span>
          <span className="font-semibold text-slate-600">{article.author}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Body */}
        <div className="prose prose-slate max-w-none">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base sm:text-lg text-slate-700 leading-relaxed mb-6">
              {p}
            </p>
          ))}
        </div>

        {/* Share */}
        <div className="flex items-center gap-3 pt-6 border-t border-slate-200">
          <Share2 className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-400">Partager cet article</span>
        </div>

        {/* CTA inscription */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-center text-white space-y-4">
          <h3 className="text-xl font-bold">Envie de vous former avec nous ?</h3>
          <p className="text-blue-100 text-sm">
            Découvrez nos formations et lancez votre carrière dans la tech.
          </p>
          <Link
            href="/#formations"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-6 py-3 rounded-xl hover:bg-blue-50 transition-colors"
          >
            Voir nos formations
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </article>
    </div>
  );
}
