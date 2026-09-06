import { Suspense } from "react";
import { getStudentById } from "@/lib/data-service";
import { getStudentSession } from "@/lib/student-auth";
import { StudentPortal } from "@/components/StudentPortal";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mon Espace Étudiant | FuturCraft Institut",
  description: "Portail étudiant : suivi des paiements, échéancier, reçus certifiés avec QR code, attestations et notifications.",
};

export default async function EspaceEtudiantPage() {
  const studentId = await getStudentSession();

  if (!studentId) {
    redirect("/espace-etudiant/connexion");
  }

  const studentData = await getStudentById(studentId);

  if (!studentData) {
    redirect("/espace-etudiant/connexion");
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-sm font-semibold text-slate-500">Chargement de votre espace étudiant...</div>
        </div>
      }
    >
      <StudentPortal initialData={studentData} />
    </Suspense>
  );
}