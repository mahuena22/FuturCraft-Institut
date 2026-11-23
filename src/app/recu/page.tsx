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
    <div className="flex min-h-[80vh] items-center justify-center bg-[var(--color-fc-bg)] px-4 py-16">
      <div className="w-full max-w-md rounded-[2rem] border border-[var(--color-fc-gray-light)] bg-white p-8 text-center sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]">
          <ShieldCheck className="h-8 w-8" />
        </div>

        <div className="mt-6 space-y-3">
          <span className="inline-flex rounded-full bg-[var(--color-fc-surface)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-fc-primary)]">Authentification</span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-fc-black)]">Vérifier un reçu</h1>
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            Saisissez le numéro de reçu (ex : REC-2025-01420) pour confirmer son authenticité.
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fc-gray-mid)]" />
            <input
              type="text"
              placeholder="ex: REC-2025-01420"
              value={receiptNumber}
              onChange={(e) => setReceiptNumber(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] py-3.5 pl-11 pr-4 text-sm font-mono font-bold uppercase text-[var(--color-fc-black)] outline-none transition-colors focus:border-[var(--color-fc-primary)]"
            />
          </div>
          <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-fc-deep)] py-3.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-fc-primary)]">
            Vérifier l&apos;authenticité <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
