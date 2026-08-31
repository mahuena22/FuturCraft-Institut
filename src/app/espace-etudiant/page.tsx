import { Suspense } from "react";
import { getAllStudents, getStudentById } from "@/lib/data-service";
import { StudentPortal } from "@/components/StudentPortal";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Mon Espace Étudiant | FuturCraft Institut",
  description: "Portail étudiant : suivi des paiements, échéancier, reçus certifiés avec QR code, attestations et notifications.",
};

export default async function EspaceEtudiantPage(props: {
  searchParams: Promise<{ studentId?: string }>;
}) {
  const { studentId } = await props.searchParams;
  const allStudents = await getAllStudents();

  if (allStudents.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <p className="text-slate-500">Aucun étudiant enregistré pour le moment.</p>
      </div>
    );
  }

  // Find targeted student, or default to Onesim Tokpo (FC-2025-0142) or first student
  const targetId = studentId
    ? Number(studentId)
    : allStudents.find((s) => s.studentNumber === "FC-2025-0142")?.id || allStudents[0].id;

  const studentData = await getStudentById(targetId);

  if (!studentData) {
    redirect("/espace-etudiant");
  }

  const allStudentsList = allStudents.map((s) => ({
    id: s.id,
    studentNumber: s.studentNumber,
    name: `${s.firstName} ${s.lastName}`,
  }));

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-sm font-semibold text-slate-500">Chargement de votre espace étudiant...</div>
        </div>
      }
    >
      <StudentPortal initialData={studentData} allStudentsList={allStudentsList} />
    </Suspense>
  );
}
