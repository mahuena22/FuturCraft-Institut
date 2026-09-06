import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Vérifier un reçu",
  description:
    "Vérification officielle d'un reçu de paiement émis par FuturCraft Institut à Cotonou, Bénin, via le numéro de reçu à 8 chiffres.",
  robots: { index: false, follow: false },
};

export default function RecuLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}