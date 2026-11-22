"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[var(--color-fc-bg)] px-4">
      <div className="mx-auto w-full max-w-lg py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-fc-surface)] text-[var(--color-fc-primary)]">
          <AlertTriangle className="h-9 w-9" />
        </div>
        <p className="mt-8 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">Erreur</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[var(--color-fc-black)] sm:text-4xl">Quelque chose s&apos;est mal passé.</h1>
        <p className="mt-4 text-base leading-8 text-[var(--color-fc-gray-mid)]">Un problème technique a interrompu l&apos;affichage de cette page.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-fc-deep)] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--color-fc-primary)]">
            <RefreshCw className="h-4 w-4" /> Réessayer
          </button>
          <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-fc-gray-light)] bg-white px-6 py-3 text-sm font-bold text-[var(--color-fc-black)] transition-colors hover:border-[var(--color-fc-primary)]/30">
            <Home className="h-4 w-4 text-[var(--color-fc-primary)]" /> Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
