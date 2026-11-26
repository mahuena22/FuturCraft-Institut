"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

const questions = [
  {
    q: "Quel type de travail t'attire le plus ?",
    options: [
      { label: "Créer des sites et applications", slug: "developpement-web-fullstack" },
      { label: "Travailler l'image, la vidéo, le design", slug: "photographie-cadrage-et-montage-video" },
      { label: "Comprendre et utiliser l'intelligence artificielle", slug: "developpement-intelligence-artificielle" },
      { label: "Gérer, vendre et communiquer en ligne", slug: "marketing-digital" },
    ],
  },
  {
    q: "Quel est ton niveau actuel ?",
    options: [
      { label: "Débutant complet", slug: null },
      { label: "Quelques bases", slug: null },
      { label: "Intermédiaire", slug: null },
      { label: "Avancé", slug: null },
    ],
  },
  {
    q: "Quel rythme te convient ?",
    options: [
      { label: "Soir et week-end (je travaille en journée)", slug: null },
      { label: "Temps plein intensif", slug: null },
      { label: "Flexible, à mon rythme", slug: null },
      { label: "Peu importe", slug: null },
    ],
  },
];

export function OrientationQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const current = questions[step];
  const recommendedSlug = answers[0] || null;

  const handleAnswer = (slug: string | null, label: string) => {
    const next = [...answers, slug ?? label];
    setAnswers(next);
    if (step < questions.length - 1) setStep(step + 1);
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
  };

  const done = answers.length === questions.length;

  return (
    <div className="rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-white p-7 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]">
          <Compass className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">Orientation</p>
          <h3 className="font-display text-lg font-bold text-[var(--color-fc-black)]">Quelle formation est faite pour toi ?</h3>
        </div>
      </div>

      {!done ? (
        <div className="mt-6">
          <p className="text-sm font-semibold text-[var(--color-fc-black)]">{current.q}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {current.options.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleAnswer(opt.slug, opt.label)}
                className="rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] px-4 py-3 text-left text-sm font-medium text-[var(--color-fc-black)] transition-colors hover:border-[var(--color-fc-primary)]/40 hover:bg-[var(--color-fc-primary)]/5"
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--color-fc-gray-mid)]">
            Étape {step + 1} sur {questions.length}
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <p className="text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            Ton profil suggère un parcours orienté{" "}
            <span className="font-semibold text-[var(--color-fc-black)]">
              {recommendedSlug === "developpement-web-fullstack"
                ? "développement web"
                : recommendedSlug === "photographie-cadrage-et-montage-video"
                ? "audiovisuel"
                : recommendedSlug === "developpement-intelligence-artificielle"
                ? "intelligence artificielle"
                : "marketing digital"}
            </span>
            . Un conseiller peut affiner ton choix.
          </p>
          <div className="flex flex-wrap gap-3">
            {recommendedSlug && (
              <Link
                href={`/formation/${recommendedSlug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-fc-deep)] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[var(--color-fc-primary)]"
              >
                Voir la formation <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-fc-gray-light)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-fc-black)] transition-colors hover:border-[var(--color-fc-primary)]/30 hover:text-[var(--color-fc-primary)]"
            >
              Parler à un conseiller
            </Link>
            <button
              type="button"
              onClick={reset}
              className="text-xs font-bold text-[var(--color-fc-primary)] hover:underline"
            >
              Recommencer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
