import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { Inter, Sora } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/Toast";
import { Analytics } from "@/lib/analytics";
import { WhatsAppFloatButton } from "@/components/WhatsAppButton";

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
  other: {
    "script:ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "FuturCraft Institut",
      url: "https://futurcraft.bj",
      logo: "https://futurcraft.bj/images/Logo-crop.png",
      description:
        "Centre de formation aux métiers du numérique au Bénin : Développement Web, IA, Design, Drone, Marketing, Audiovisuel.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Supermarché O Bénin, avant pk14",
        addressLocality: "Godomey",
        addressRegion: "Cotonou",
        addressCountry: "BJ",
      },
      telephone: "+229 43 32 78 32",
      email: "contact@futurcraftinstitut.com",
      sameAs: [
        "https://facebook.com/futurcraftinstitut",
        "https://instagram.com/futurcraft_institut",
        "https://linkedin.com/company/futurcraft-institut",
        "https://tiktok.com/@futurcraft_institut",
      ],
    }),
  },
};

export const viewport = {
  themeColor: "#125195",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#125195" />
        <link rel="apple-touch-icon" href="/images/icon-192x192.png" />
        {gaId && (
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
        )}
        {gaId && (
          <Script
            id="ga-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `,
            }}
          />
        )}
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN && (
          <Script
            strategy="afterInteractive"
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN!}
            src="https://plausible.io/js/script.js"
            defer
          />
        )}
      </head>
      <body
        className={`${inter.variable} ${sora.variable} bg-[var(--color-fc-bg)] text-[var(--color-fc-black)] antialiased min-h-screen flex flex-col selection:bg-[var(--color-fc-primary)] selection:text-white`}
      >
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <ToastProvider>
          <a
            href="#contenu"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-3 focus-visible:left-3 focus-visible:z-[100] focus-visible:rounded-lg focus-visible:bg-[var(--color-fc-primary)] focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-bold focus-visible:text-white skip-link"
          >
            Aller au contenu principal
          </a>
          <Header />
          <main id="contenu" className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloatButton
            phoneNumber="22943327832"
            defaultMessage="Bonjour, je souhaite des informations sur les formations FuturCraft"
            showAfterScroll={200}
          />
        </ToastProvider>
        <Script
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
