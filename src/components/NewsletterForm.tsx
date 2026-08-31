"use client";

import { useState, FormEvent } from "react";
import { Mail, CheckCircle2, Send } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }
    setError(null);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="max-w-md rounded-2xl bg-emerald-500/10 border border-emerald-400/30 px-5 py-4 flex items-start gap-3 text-left">
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-emerald-300">Merci !</p>
          <p className="text-xs text-slate-300 mt-0.5">
            La brochure des formations vous sera envoyée à <strong>{email}</strong>. Un conseiller peut aussi vous rappeler.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-1 mt-2 max-w-md flex flex-col sm:flex-row gap-3"
      noValidate
    >
      <div className="relative flex-1">
        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email"
          aria-label="Votre adresse email"
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-lg shadow-blue-600/25 transition-all shrink-0"
      >
        <Send className="w-4 h-4" />
        <span>Recevoir la brochure</span>
      </button>
      {error && <p className="text-xs text-rose-400 sm:absolute sm:-bottom-5">{error}</p>}
    </form>
  );
}
