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
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[var(--color-fc-bg)] px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="relative w-full max-w-md space-y-6 rounded-3xl border border-[var(--color-fc-gray-light)] bg-white p-8 text-center shadow-xl shadow-[var(--color-fc-deep)]/5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-fc-primary)]/8 text-[var(--color-fc-primary)] shadow-inner">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="rounded-full border border-[var(--color-fc-primary)]/15 bg-[var(--color-fc-primary)]/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-fc-primary)]">
            Authentification Numérique
          </span>
          <h1 className="text-2xl font-black text-[var(--color-fc-black)]">Vérifier un reçu officiel</h1>
          <p className="text-sm leading-relaxed text-[var(--color-fc-gray-mid)]">
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
              className="w-full rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] py-3 pl-10 pr-4 text-sm font-mono font-bold uppercase text-[var(--color-fc-black)] focus:border-[var(--color-fc-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-fc-primary)]/15"
            />
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-fc-primary)] py-3 text-xs font-bold text-white shadow-md shadow-[var(--color-fc-primary)]/20 transition-all hover:bg-[var(--color-fc-deep)]"
          >
            <span>Vérifier l&apos;authenticité</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo links */}
        <div className="space-y-2 border-t border-[var(--color-fc-gray-light)] pt-4 text-xs text-[var(--color-fc-gray-mid)]">
          <span className="block text-[11px] font-semibold text-slate-400">Exemples de reçus valides :</span>
          <div className="flex justify-center gap-2 flex-wrap font-mono text-[11px]">
            <Link href="/recu/REC-2025-01420" className="font-semibold text-[var(--color-fc-primary)] hover:underline">
              REC-2025-01420
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/recu/REC-2025-01421" className="font-semibold text-[var(--color-fc-primary)] hover:underline">
              REC-2025-01421
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
