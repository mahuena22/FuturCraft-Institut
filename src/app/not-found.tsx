import Link from "next/link";
import { Compass, ArrowRight, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-[var(--color-fc-bg)] px-4">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="relative mx-auto w-full max-w-lg space-y-6 py-20 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--color-fc-deep)] text-white shadow-xl shadow-[var(--color-fc-deep)]/20">
          <Compass className="w-9 h-9" />
        </div>

        <div className="space-y-3">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--color-fc-primary)]">Erreur 404</p>
          <h1 className="font-display text-4xl font-black tracking-tight text-[var(--color-fc-black)] sm:text-5xl">
            Page introuvable
          </h1>
          <p className="text-base leading-7 text-[var(--color-fc-gray-mid)]">
            La page que vous cherchez n&apos;existe pas ou a été déplacée. Pas de panique, revenons sur le bon chemin.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-fc-primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--color-fc-primary)]/20 transition-all hover:bg-[var(--color-fc-deep)]"
          >
            <span>Retour à l&apos;accueil</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/formations"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-fc-gray-light)] bg-white px-6 py-3 text-sm font-bold text-[var(--color-fc-black)] shadow-sm transition-all hover:bg-[var(--color-fc-bg)]"
          >
            <Search className="h-4 w-4 text-[var(--color-fc-primary)]" />
            <span>Voir les formations</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
