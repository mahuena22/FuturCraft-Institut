import { NextRequest, NextResponse } from "next/server";
import { getBlogArticles, createBlogArticle } from "@/lib/data-service";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const rows = await getBlogArticles();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/articles error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const denied = await requireAuth();
  if (denied) return denied;
  try {
    const body = await req.json();
    const title = String(body.title || "").trim();
    const excerpt = String(body.excerpt || "").trim();
    const content = String(body.content || "").trim();
    const coverImage = String(body.coverImage || "").trim();
    const category = String(body.category || "").trim();

    if (!title || !excerpt || !content || !coverImage || !category) {
      return NextResponse.json({ error: "Titre, extrait, contenu, image de couverture et catégorie sont requis" }, { status: 400 });
    }

    const article = await createBlogArticle({
      title,
      excerpt,
      content,
      coverImage,
      category,
      slug: typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : undefined,
      author: typeof body.author === "string" && body.author.trim() ? body.author.trim() : undefined,
      readTime: typeof body.readTime === "string" && body.readTime.trim() ? body.readTime.trim() : undefined,
      publishedAt: typeof body.publishedAt === "string" && body.publishedAt.trim() ? body.publishedAt.trim() : undefined,
    });

    return NextResponse.json({ success: true, article }, { status: 201 });
  } catch (error) {
    console.error("POST /api/articles error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}