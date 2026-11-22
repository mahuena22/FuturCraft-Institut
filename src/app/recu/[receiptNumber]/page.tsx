import { getReceiptDetails } from "@/lib/data-service";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ShieldCheck,
  CheckCircle2,
  QrCode,
  Printer,
  ArrowLeft,
  Building,
  AlertTriangle,
} from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: {
  params: Promise<{ receiptNumber: string }>;
}): Promise<Metadata> {
  const { receiptNumber } = await props.params;
  return {
    title: `Vérification du reçu ${receiptNumber}`,
    description: "Vérification officielle d'un reçu de paiement émis par FuturCraft Institut — Cotonou, Bénin.",
  };
}

export default async function ReceiptVerificationPage(props: {
  params: Promise<{ receiptNumber: string }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { receiptNumber } = await props.params;
  const { code } = await props.searchParams;
  const data = await getReceiptDetails(receiptNumber, { verificationCode: code });

  if (!data) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[var(--color-fc-bg)] p-6">
        <div className="w-full max-w-md space-y-4 rounded-3xl border border-[var(--color-fc-gray-light)] bg-white p-8 text-center shadow-xl shadow-[var(--color-fc-deep)]/5">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-[var(--color-fc-black)]">Reçu introuvable</h1>
          <p className="text-sm leading-relaxed text-[var(--color-fc-gray-mid)]">
            Le reçu avec le numéro <strong>{receiptNumber}</strong> n&apos;existe pas dans notre base de données officielle ou a été invalidé.
          </p>
          <div className="pt-2">
            <Link
              href="/recu"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-fc-primary)] px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[var(--color-fc-deep)]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Faire une autre recherche</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { receipt, payment, student, formation } = data;

  return (
    <div className="min-h-screen bg-[var(--color-fc-bg)] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <Link
            href="/recu"
            className="flex items-center gap-1 text-xs font-bold text-[var(--color-fc-gray-mid)] transition-colors hover:text-[var(--color-fc-primary)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la vérification</span>
          </Link>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Reçu Authentique &amp; Certifié</span>
          </span>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-[var(--color-fc-gray-light)] bg-white p-6 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-[var(--color-fc-gray-light)] pb-6 sm:flex-row">
            <div>
              <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700">Certification de paiement officielle</span>
              <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--color-fc-black)]">FuturCraft Institut</h2>
              <p className="mt-1 text-xs text-[var(--color-fc-gray-mid)]">Centre de formation aux métiers du numérique • République du Bénin</p>
            </div>
            <div className="sm:text-right">
              <span className="block font-mono text-base font-black text-[var(--color-fc-primary)]">{receipt.receiptNumber}</span>
              <span className="text-[11px] text-[var(--color-fc-gray-mid)]">Émis le : {receipt.issuedAt}</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-fc-gray-mid)]">Étudiant titulaire</span>
              <strong className="mt-1 block text-base text-[var(--color-fc-black)]">{student?.firstName} {student?.lastName}</strong>
              <span className="font-mono text-xs text-[var(--color-fc-gray-mid)]">Matricule : {student?.studentNumber}</span>
            </div>
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--color-fc-gray-mid)]">Filière suivie</span>
              <strong className="mt-1 block text-sm text-[var(--color-fc-black)]">{formation?.title}</strong>
              <span className="text-xs text-[var(--color-fc-gray-mid)]">{formation?.campus}</span>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 text-sm">
            <div className="flex items-center justify-between border-b border-emerald-200/70 pb-3">
              <span className="font-bold text-emerald-950">Montant encaissé</span>
              <span className="font-display text-xl font-extrabold text-emerald-700">{payment?.amount.toLocaleString("fr-FR")} FCFA</span>
            </div>
            <div className="mt-3 space-y-2 text-xs text-[var(--color-fc-gray-mid)]">
              <div className="flex justify-between"><span>Moyen de versement</span><strong className="text-[var(--color-fc-black)]">{payment?.paymentMethod}</strong></div>
              <div className="flex justify-between"><span>Référence</span><span className="font-mono text-[var(--color-fc-black)]">{payment?.transactionRef}</span></div>
              <div className="flex justify-between"><span>Enregistré par</span><span className="text-[var(--color-fc-black)]">{payment?.recordedBy}</span></div>
              <div className="flex justify-between"><span>Statut comptable</span><span className="font-bold text-emerald-700">Validé et encaissé</span></div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-[var(--color-fc-gray-light)] pt-5">
            <div className="space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-fc-gray-mid)]">Code de sécurité numérique</span>
              <span className="inline-flex rounded-lg border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] px-2.5 py-1 font-mono text-xs font-bold text-[var(--color-fc-black)]">{receipt.verificationCode}</span>
              <span className="block text-[11px] font-medium text-emerald-600">✓ Signature numérique vérifiable</span>
            </div>
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)]">
              <QrCode className="h-10 w-10 text-[var(--color-fc-black)]" />
            </div>
          </div>
          <p className="mt-5 text-center text-[11px] leading-6 text-[var(--color-fc-gray-mid)]">Ce reçu électronique certifié fait foi pour toute démarche académique ou professionnelle.</p>
        </div>
      </div>
    </div>
  );
}
