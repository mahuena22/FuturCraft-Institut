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
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[var(--color-fc-bg)] px-4">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto w-full max-w-lg space-y-6 py-20 text-center">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-lg">
          <AlertTriangle className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
            Une erreur est survenue
          </p>
          <h1 className="font-display text-3xl font-black tracking-tight text-[var(--color-fc-black)] sm:text-4xl">
            Oups, quelque chose s&apos;est mal passé.
          </h1>
          <p className="text-base leading-7 text-[var(--color-fc-gray-mid)]">
            Un problème technique a interrompu l&apos;affichage de cette page. Réessayez ou revenez à l&apos;accueil.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-fc-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--color-fc-primary)]/20 transition-all hover:bg-[var(--color-fc-deep)]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réessayer</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-fc-gray-light)] bg-white px-6 py-3 text-sm font-bold text-[var(--color-fc-black)] shadow-sm transition-all hover:bg-[var(--color-fc-bg)]"
          >
            <Home className="h-4 w-4 text-[var(--color-fc-primary)]" />
            <span>Accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
