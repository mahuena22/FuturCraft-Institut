import type { MetadataRoute } from "next";
import { getFormations, getBlogArticles } from "@/lib/data-service";

const BASE_URL = "https://futurcraft.bj";

const staticRoutes = [
  "",
  "/institut",
  "/formations",
  "/admissions",
  "/inscription",
  "/actualites",
  "/projets-etudiants",
  "/vie-a-futurcraft",
  "/entreprises",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const formations = await getFormations();
  const articles = await getBlogArticles();

  return [
    ...staticRoutes.map((route) => ({
      url: `${BASE_URL}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" || route === "/formations" ? 1 : 0.8,
    })),
    ...formations.map((f) => ({
      url: `${BASE_URL}/formation/${f.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...articles.map((a) => ({
      url: `${BASE_URL}/actualites/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}