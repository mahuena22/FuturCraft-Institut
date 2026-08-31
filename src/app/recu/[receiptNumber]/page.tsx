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
}) {
  const { receiptNumber } = await props.params;
  const data = await getReceiptDetails(receiptNumber);

  if (!data) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-slate-50/50">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Reçu Introuvable</h1>
          <p className="text-xs text-slate-500">
            Le reçu avec le numéro <strong>{receiptNumber}</strong> n&apos;existe pas dans notre base de données officielle ou a été invalidé.
          </p>
          <div className="pt-2">
            <Link
              href="/recu"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white inline-flex items-center gap-1.5"
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
    <div className="min-h-screen bg-slate-50/70 py-12 px-4">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/recu"
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à la vérification</span>
          </Link>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Reçu Authentique &amp; Certifié</span>
          </span>
        </div>

        {/* The Official Certificate Card */}
        <div className="bg-white rounded-3xl border-2 border-emerald-500/30 p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle watermark background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
            <ShieldCheck className="w-96 h-96 text-emerald-900" />
          </div>

          {/* Certificate Header */}
          <div className="border-b border-slate-200 pb-5 flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                Certification de Paiement Officielle
              </span>
              <h2 className="text-2xl font-black text-slate-950 mt-1">FuturCraft Institut</h2>
              <p className="text-[11px] text-slate-500">
                Centre de formation aux métiers du numérique • République du Bénin
              </p>
            </div>

            <div className="text-right">
              <span className="font-mono font-black text-base text-blue-600 block">
                {receipt.receiptNumber}
              </span>
              <span className="text-[10px] text-slate-400">Émis le : {receipt.issuedAt}</span>
            </div>
          </div>

          {/* Student & Formation info */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px]">Étudiant titulaire :</span>
              <strong className="text-slate-900 text-sm block">
                {student?.firstName} {student?.lastName}
              </strong>
              <span className="text-slate-600 font-mono text-[11px]">
                Matricule : {student?.studentNumber}
              </span>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px]">Filière suivie :</span>
              <strong className="text-slate-900 text-xs block">{formation?.title}</strong>
              <span className="text-slate-500 text-[10px]">{formation?.campus}</span>
            </div>
          </div>

          {/* Financial summary box */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-2">
            <div className="flex justify-between items-center text-sm font-black text-emerald-950 pb-2 border-b border-emerald-200/80">
              <span>MONTANT ENCAISSÉ :</span>
              <span className="text-emerald-700 text-xl">
                {payment?.amount.toLocaleString("fr-FR")} FCFA
              </span>
            </div>
            <div className="flex justify-between text-slate-700 text-[11px]">
              <span>Moyen de versement :</span>
              <strong>{payment?.paymentMethod}</strong>
            </div>
            <div className="flex justify-between text-slate-700 text-[11px]">
              <span>Référence transactionnelle :</span>
              <span className="font-mono">{payment?.transactionRef}</span>
            </div>
            <div className="flex justify-between text-slate-700 text-[11px]">
              <span>Enregistré par :</span>
              <span>{payment?.recordedBy}</span>
            </div>
            <div className="flex justify-between text-slate-700 text-[11px]">
              <span>Statut comptable :</span>
              <span className="text-emerald-700 font-bold">VALIDE &amp; ENCAISSÉ EN BANQUE</span>
            </div>
          </div>

          {/* Security details and QR Code */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-200 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">
                Code de sécurité numérique :
              </span>
              <span className="font-mono font-bold text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {receipt.verificationCode}
              </span>
              <span className="text-[10px] text-emerald-600 block font-medium">
                ✓ Signature numérique infalsifiable
              </span>
            </div>

            <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
              <QrCode className="w-12 h-12 text-slate-900" />
            </div>
          </div>

          <div className="pt-2 text-center text-[10px] text-slate-400">
            Ce reçu certifié électronique fait foi pour toute démarche académique, professionnelle ou de demande de stage.
          </div>
        </div>
      </div>
    </div>
  );
}
