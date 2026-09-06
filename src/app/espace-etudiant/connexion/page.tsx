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
    <div className="min-h-[80vh] bg-slate-50/60 flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-8 text-white">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg shadow-black/20 mb-4">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">Espace Étudiant</h1>
            <p className="text-blue-100 text-sm mt-1">
              Connectez-vous pour suivre vos paiements et accéder à vos reçus.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            {/* Matricule */}
            <div>
              <label htmlFor="studentNumber" className="block text-xs font-bold text-slate-700 mb-1.5">
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm font-mono font-bold placeholder:text-slate-300 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-bold text-slate-700 mb-1.5">
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

        <p className="text-center text-[11px] text-slate-400 mt-4">
          Matricule et téléphone fournis lors de votre préinscription.
        </p>

        <Link
          href="/"
          className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}