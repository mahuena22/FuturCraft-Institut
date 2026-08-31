import Link from "next/link";
import { Compass, ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-slate-50/60 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="relative max-w-lg w-full mx-auto text-center space-y-6 py-20">
        <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
          <Compass className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Erreur 404</p>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-950 tracking-tight">
            Page introuvable
          </h1>
          <p className="text-slate-600 text-base">
            La page que vous cherchez n&apos;existe pas ou a été déplacée. Pas de panique, revenons sur le bon chemin.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-blue-600/25 transition-all"
          >
            <span>Retour à l&apos;accueil</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/formations"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 shadow-xs transition-all"
          >
            <Search className="w-4 h-4 text-blue-600" />
            <span>Voir les formations</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
