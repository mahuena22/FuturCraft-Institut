import { getBlogArticleBySlug, getBlogArticles } from "@/lib/data-service";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import { PageIntro } from "@/components/PageIntro";

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
    <div className="min-h-screen bg-[var(--color-fc-bg)]">
      <PageIntro eyebrow={article.category} title={article.title} description={article.excerpt} />
      <article className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6 sm:py-16">
        {/* Back link */}
        <Link
          href="/actualites"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-fc-primary)] transition-colors hover:text-[var(--color-fc-deep)]"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux actualités
        </Link>

        {/* Cover image */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-[var(--color-fc-gray-light)] shadow-lg">
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
        <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-fc-gray-mid)]">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" /> {article.publishedAt}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {article.readTime}
          </span>
          <span>•</span>
          <span className="font-semibold text-[var(--color-fc-black)]">{article.author}</span>
        </div>

        {/* Body */}
        <div className="prose prose-slate max-w-none">
          {paragraphs.map((p, i) => (
            <p key={i} className="mb-6 text-base leading-8 text-[var(--color-fc-black)]/80 sm:text-lg">
              {p}
            </p>
          ))}
        </div>

        {/* Share */}
        <div className="flex items-center gap-3 border-t border-[var(--color-fc-gray-light)] pt-6">
          <Share2 className="h-4 w-4 text-[var(--color-fc-gray-mid)]" />
          <span className="text-sm text-[var(--color-fc-gray-mid)]">Partager cet article</span>
        </div>

        {/* CTA inscription */}
        <div className="space-y-4 rounded-3xl bg-[var(--color-fc-deep)] p-8 text-center text-white">
          <h3 className="text-xl font-bold">Envie de vous former avec nous ?</h3>
          <p className="text-sm text-white/75">
            Découvrez nos formations et lancez votre carrière dans la tech.
          </p>
          <Link
            href="/#formations"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-fc-cyan)] px-6 py-3 font-bold text-[var(--color-fc-deep)] transition-colors hover:bg-white"
          >
            Voir nos formations
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Link>
        </div>
      </article>
    </div>
  );
}
