import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://futurcraft.bj"),
  title: {
    default: "FuturCraft Institut | Centre de formation aux métiers du numérique au Bénin",
    template: "%s | FuturCraft Institut",
  },
  description:
    "Construisez les compétences de demain : Développement Web Fullstack, Intelligence Artificielle, Web Design, Pilotage de Drone, Marketing Digital, Sérigraphie et Audiovisuel à Godomey, Supermarché O Bénin Avant pk14.",
  keywords: [
    "FuturCraft Institut",
    "Formation informatique Bénin",
    "Développement Web Cotonou",
    "Intelligence Artificielle Bénin",
    "Pilotage Drone Bénin",
    "UI/UX Design Cotonou",
    "École du numérique Afrique",
  ],
  openGraph: {
    type: "website",
    locale: "fr_BJ",
    url: "https://futurcraft.bj",
    siteName: "FuturCraft Institut",
    title: "FuturCraft Institut | Centre de formation aux métiers du numérique au Bénin",
    description:
      "Développement Web, Intelligence Artificielle, UI/UX Design, Drone, Marketing Digital & plus encore à Godomey, Supermarché O Bénin Avant pk14.",
  },
  twitter: {
    card: "summary_large_image",
    title: "FuturCraft Institut | Centre de formation aux métiers du numérique au Bénin",
    description:
      "Apprends. Crée. Innove. Transforme ton avenir — le campus numérique de référence au Bénin.",
  },
  applicationName: "FuturCraft Institut",
  category: "education",
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: "#125195",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body
        className={`${inter.variable} ${sora.variable} bg-slate-50/60 text-slate-900 antialiased min-h-screen flex flex-col selection:bg-blue-600 selection:text-white`}
      >
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          Aller au contenu principal
        </a>
        <Header />
        <main id="contenu" className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
