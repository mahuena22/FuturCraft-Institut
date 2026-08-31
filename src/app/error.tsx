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
    <div className="min-h-[70vh] bg-slate-50/60 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="relative max-w-lg w-full mx-auto text-center space-y-6 py-20">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-lg">
          <AlertTriangle className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-amber-600">
            Une erreur est survenue
          </p>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            Oups, quelque chose s&apos;est mal passé.
          </h1>
          <p className="text-slate-600 text-base">
            Un problème technique a interrompu l&apos;affichage de cette page. Réessayez ou revenez à l&apos;accueil.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-blue-600/25 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Réessayer</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-all"
          >
            <Home className="w-4 h-4 text-blue-600" />
            <span>Accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
