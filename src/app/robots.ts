import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/espace-etudiant"],
      },
    ],
    sitemap: "https://futurcraft.bj/sitemap.xml",
  };
}