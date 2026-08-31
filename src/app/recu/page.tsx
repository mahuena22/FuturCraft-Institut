"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Search, FileCheck, ArrowRight, QrCode } from "lucide-react";
import Link from "next/link";

export default function ReceiptSearchPage() {
  const [receiptNumber, setReceiptNumber] = useState("");
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiptNumber.trim()) return;
    router.push(`/recu/${receiptNumber.trim()}`);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16 px-4 bg-slate-50/50">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-xl space-y-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            Authentification Numérique
          </span>
          <h1 className="text-2xl font-black text-slate-950">Vérifier un Reçu Officiel</h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Saisissez le numéro de reçu figurant sur la quittance (ex : REC-2025-01420) pour vérifier son authenticité et son statut d&apos;encaissement.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ex: REC-2025-01420"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-mono font-bold text-slate-900 uppercase focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Vérifier l&apos;authenticité</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo links */}
        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500 space-y-2">
          <span className="block text-[11px] font-semibold text-slate-400">Exemples de reçus valides :</span>
          <div className="flex justify-center gap-2 flex-wrap font-mono text-[11px]">
            <Link href="/recu/REC-2025-01420" className="text-blue-600 hover:underline">
              REC-2025-01420
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/recu/REC-2025-01421" className="text-blue-600 hover:underline">
              REC-2025-01421
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
