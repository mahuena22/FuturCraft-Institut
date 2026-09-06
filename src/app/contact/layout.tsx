import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Contactez-nous",
  description:
    "Contactez FuturCraft Institut : campus à Godomey (Supermarché O Bénin Avant pk14), téléphone, WhatsApp et formulaire de contact pour toute question sur nos formations au Bénin.",
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}