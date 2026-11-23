import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion Étudiant | FuturCraft Institut",
  description: "Connectez-vous à votre espace étudiant FuturCraft pour suivre vos paiements, échéanciers et reçus.",
};

export default function ConnexionLayout({ children }: { children: React.ReactNode }) {
  return children;
}