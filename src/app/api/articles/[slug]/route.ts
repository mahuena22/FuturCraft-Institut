import { NextRequest, NextResponse } from "next/server";
import { getBlogArticleBySlug, updateBlogArticle, deleteBlogArticle } from "@/lib/data-service";
import { requireAuth } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const row = await getBlogArticleBySlug(slug);
    if (!row) {
      return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
    }
    return NextResponse.json(row);
  } catch (error) {
    console.error("GET /api/articles/[slug] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const { slug } = await params;
    const body = await req.json();

    const patch: Record<string, unknown> = {};
    if (typeof body.title === "string" && body.title.trim()) patch.title = body.title.trim();
    if (typeof body.excerpt === "string" && body.excerpt.trim()) patch.excerpt = body.excerpt.trim();
    if (typeof body.content === "string" && body.content.trim()) patch.content = body.content.trim();
    if (typeof body.coverImage === "string" && body.coverImage.trim()) patch.coverImage = body.coverImage.trim();
    if (typeof body.category === "string" && body.category.trim()) patch.category = body.category.trim();
    if (typeof body.author === "string" && body.author.trim()) patch.author = body.author.trim();
    if (typeof body.readTime === "string" && body.readTime.trim()) patch.readTime = body.readTime.trim();
    if (typeof body.publishedAt === "string" && body.publishedAt.trim()) patch.publishedAt = body.publishedAt.trim();
    if (typeof body.slug === "string" && body.slug.trim() && body.slug.trim() !== slug) {
      patch.newSlug = body.slug.trim();
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 });
    }

    const row = await updateBlogArticle(slug, patch);
    if (!row) {
      return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
    }
    return NextResponse.json({ success: true, article: row });
  } catch (error) {
    console.error("PATCH /api/articles/[slug] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const { slug } = await params;
    await deleteBlogArticle(slug);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/articles/[slug] error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}