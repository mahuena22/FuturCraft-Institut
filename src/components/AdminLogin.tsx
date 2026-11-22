"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, KeyRound, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";

export function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || "Mot de passe incorrect");
        return;
      }
      router.refresh();
    } catch {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[var(--color-fc-bg)] px-4 py-16">
      <div className="pointer-events-none absolute inset-0 opacity-0" />
      <div className="relative w-full max-w-md">
        <div className="overflow-hidden rounded-[2rem] border border-[var(--color-fc-gray-light)] bg-white">
          <div className="bg-[var(--color-fc-deep)] px-8 py-8 text-white">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[var(--color-fc-cyan)]">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight">Console d&apos;administration</h1>
            <p className="mt-1 text-sm text-white/65">Espace sécurisé — accès réservé au personnel autorisé.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 p-8">
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-semibold text-[var(--color-fc-black)]">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-fc-gray-mid)]" />
                <input
                  id="admin-password"
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] py-3 pl-10 pr-11 text-sm text-[var(--color-fc-black)] outline-none transition-colors focus:border-[var(--color-fc-primary)]"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={show ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)]"
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-fc-deep)] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--color-fc-primary)] disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span>{loading ? "Vérification..." : "Se connecter"}</span>
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] text-[var(--color-fc-gray-mid)]">
          Connexion protégée par un accès sécurisé.
        </p>
      </div>
    </div>
  );
}
