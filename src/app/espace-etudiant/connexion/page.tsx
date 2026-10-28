"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GraduationCap, ArrowLeft, ArrowRight, Lock, Hash, Smartphone } from "lucide-react";

export default function StudentLoginPage() {
  const router = useRouter();
  const [studentNumber, setStudentNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentNumber: studentNumber.trim(), phone: phone.trim() }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error || "Échec de la connexion");
        setLoading(false);
        return;
      }

      router.push("/espace-etudiant");
      router.refresh();
    } catch {
      setError("Erreur réseau, veuillez réessayer");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-[var(--color-fc-bg)] px-4 py-16">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-[var(--color-fc-deep)] px-8 py-8 text-white">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-lg shadow-black/20">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Espace Étudiant</h1>
            <p className="mt-1 text-sm text-white/70">
              Connectez-vous pour suivre vos paiements et accéder à vos reçus.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Matricule */}
            <div>
              <label htmlFor="studentNumber" className="mb-1.5 block text-xs font-bold text-[var(--color-fc-black)]">
                Matricule étudiant
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="studentNumber"
                  type="text"
                  placeholder="FC-2025-0001"
                  value={studentNumber}
                  onChange={(e) => setStudentNumber(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] py-3 pl-10 pr-4 text-sm font-mono font-bold transition-all placeholder:font-normal placeholder:text-slate-400 focus:border-[var(--color-fc-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-fc-primary)]/15"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="mb-1.5 block text-xs font-bold text-[var(--color-fc-black)]">
                Numéro de téléphone / WhatsApp
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="phone"
                  type="tel"
                  placeholder="+229 XX XX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] py-3 pl-10 pr-4 text-sm transition-all placeholder:text-slate-400 focus:border-[var(--color-fc-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-fc-primary)]/15"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs font-semibold text-rose-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !studentNumber.trim() || !phone.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-fc-primary)] py-3 text-sm font-bold text-white shadow-lg shadow-[var(--color-fc-primary)]/20 transition-all hover:bg-[var(--color-fc-deep)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>{loading ? "Connexion..." : "Se connecter"}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-[11px] text-[var(--color-fc-gray-mid)]">
          Matricule et téléphone fournis lors de votre préinscription.
        </p>

        <Link
          href="/"
          className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-[var(--color-fc-gray-mid)] transition-colors hover:text-[var(--color-fc-primary)]"
        >
          <ArrowLeft className="w-3 h-3" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}