"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  User,
  BookOpen,
  Users,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  FileText,
  Clock,
} from "lucide-react";
import { analytics } from "@/lib/analytics";

interface FormationOption {
  id: number;
  slug: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  price: number;
  registrationFee: number;
  campus: string;
  mode: string;
}

export function InscriptionWizard({ formations }: { formations: FormationOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedFormationId = searchParams.get("formationId");

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<{
    studentNumber: string;
    studentName: string;
    studentId: number;
    email: string;
    pendingValidation: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Choix formation
    formationId: preselectedFormationId ? Number(preselectedFormationId) : formations[0]?.id || 1,
    campus: "Godomey (Cotonou)",
    mode: "PrÃ©sentiel & Hybride",
    session: "Session Mars 2026",

    // Step 2: Informations personnelles
    firstName: "",
    lastName: "",
    gender: "M",
    birthDate: "",
    birthPlace: "",
    nationality: "BÃ©ninoise",
    residenceCountry: "BÃ©nin",
    city: "Cotonou",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",

    // Step 3: Informations acadÃ©miques
    previousDiploma: "BaccalaurÃ©at",
    studyLevel: "BAC",
    previousSchool: "",
    studyField: "",
    previousExperience: "",

    // Step 4: Parent / Responsable
    guardianName: "",
    guardianRelation: "PÃ¨re",
    guardianPhone: "",
    guardianEmail: "",

    // Step 5: Accord
    agreeTerms: false,
    agreePrivacy: false,
  });

  const selectedFormation = formations.find((f) => f.id === Number(formData.formationId)) || formations[0];

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const fieldCls = (field: string, base = "") =>
    `${base} w-full rounded-xl border px-4 py-3 text-sm transition-colors ${
      fieldErrors[field] ? "border-rose-400 bg-rose-50/40 focus:border-rose-400" : "border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] focus:border-[var(--color-fc-primary)]"
    } outline-none`;

  const renderFieldError = (field: string) =>
    fieldErrors[field] ? (
      <p className="text-[11px] font-semibold text-rose-500 mt-1">{fieldErrors[field]}</p>
    ) : null;

  const handleNext = () => {
    setErrorMsg("");
    setFieldErrors({});
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.formationId) {
        errs.formationId = "Veuillez sÃ©lectionner une formation.";
      }
    } else if (step === 2) {
      if (!formData.lastName.trim()) errs.lastName = "Le nom est obligatoire.";
      if (!formData.firstName.trim()) errs.firstName = "Le prÃ©nom est obligatoire.";
      if (!formData.city.trim()) errs.city = "La ville est obligatoire.";
      if (!formData.phone.trim()) {
        errs.phone = "Le tÃ©lÃ©phone est obligatoire.";
      } else if (formData.phone.replace(/\D/g, "").length < 8) {
        errs.phone = "NumÃ©ro invalide (8 chiffres minimum).";
      }
      if (!formData.whatsapp.trim()) {
        errs.whatsapp = "Le WhatsApp est obligatoire.";
      } else if (formData.whatsapp.replace(/\D/g, "").length < 8) {
        errs.whatsapp = "NumÃ©ro invalide (8 chiffres minimum).";
      }
      if (!formData.email.trim()) {
        errs.email = "L'email est obligatoire.";
      } else if (!/.+@.+\..+/.test(formData.email)) {
        errs.email = "Adresse email invalide.";
      }
    } else if (step === 3) {
      if (!formData.previousDiploma) errs.previousDiploma = "Veuillez sÃ©lectionner votre dernier diplÃ´me.";
      if (!formData.studyLevel) errs.studyLevel = "Veuillez sÃ©lectionner votre niveau d'Ã©tude.";
    }

    setFieldErrors(errs);
    if (Object.keys(errs).length > 0) {
      setErrorMsg("Veuillez corriger les champs signalÃ©s.");
      return;
    }

    if (step === 1) analytics.trackInscriptionStart(String(formData.formationId || ""));
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrorMsg("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => { analytics.trackInscriptionSubmit(String(formData.formationId || ""));
    setErrorMsg("");
    setFieldErrors({});
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      setFieldErrors({
        agreeTerms: formData.agreeTerms ? "" : "Veuillez accepter le rÃ¨glement pÃ©dagogique.",
        agreePrivacy: formData.agreePrivacy ? "" : "Veuillez accepter la politique de confidentialitÃ©.",
      });
      setErrorMsg("Veuillez accepter le rÃ¨glement et la politique de confidentialitÃ© pour valider votre inscription.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement");
      }

      setSuccessData({
        studentNumber: data.student.studentNumber,
        studentName: `${data.student.firstName} ${data.student.lastName}`,
        studentId: data.student.id,
        email: data.student.email,
        pendingValidation: Boolean(data.pendingValidation),
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyMatricule = () => {
    if (successData?.studentNumber) {
      navigator.clipboard.writeText(successData.studentNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // SUCCESS VIEW
  if (successData) {
    return (
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-[var(--color-fc-gray-light)] bg-white p-8 text-center sm:p-12">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]">
          <FileText className="h-8 w-8" />
        </div>

        <div className="mt-6 space-y-3">
          <span className="inline-flex rounded-full bg-[var(--color-fc-surface)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-fc-primary)]">
            PrÃ©inscription enregistrÃ©e
          </span>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-[var(--color-fc-black)]">
            Merci {successData.studentName}
          </h2>
          <p className="mx-auto max-w-md text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            Votre dossier pour <strong className="text-[var(--color-fc-black)]">{selectedFormation?.title}</strong> a bien Ã©tÃ© transmis Ã  l&apos;administration.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-[var(--color-fc-primary)]/15 bg-[var(--color-fc-surface)] p-5 text-left">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[var(--color-fc-primary)]" />
            <span className="text-sm font-bold text-[var(--color-fc-black)]">Compte en attente de validation</span>
          </div>
          <p className="mt-2 text-sm leading-7 text-[var(--color-fc-gray-mid)]">
            Un administrateur validera votre dossier. Vous serez notifiÃ© dÃ¨s l&apos;activation de votre compte.
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] p-5 text-left">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-fc-gray-mid)]">Matricule Ã©tudiant</span>
            <button onClick={copyMatricule} className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-fc-primary)] hover:underline">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "CopiÃ©" : "Copier"}
            </button>
          </div>
          <div className="mt-3 rounded-xl border border-[var(--color-fc-gray-light)] bg-white p-4 text-center font-mono text-2xl font-black tracking-widest text-[var(--color-fc-primary)]">
            {successData.studentNumber}
          </div>
          <p className="mt-3 text-center text-xs leading-6 text-[var(--color-fc-gray-mid)]">
            Conservez ce matricule pour accÃ©der Ã  votre espace Ã©tudiant aprÃ¨s validation.
          </p>
        </div>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-fc-deep)] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-fc-primary)]">
            Retour Ã  l&apos;accueil <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="mailto:info@futurcraft.bj" className="inline-flex items-center justify-center rounded-xl border border-[var(--color-fc-gray-light)] px-6 py-3.5 text-sm font-semibold text-[var(--color-fc-black)] transition-colors hover:border-[var(--color-fc-primary)]/30 hover:text-[var(--color-fc-primary)]">
            Contacter l&apos;administration
          </a>
        </div>
      </div>
    );
  }

  // WIZARD STEPS
  return (
    <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-[var(--color-fc-gray-light)] bg-white">
      <div className="border-b border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between text-xs font-bold text-[var(--color-fc-gray-mid)]">
          <span>Ã‰tape {step} sur 5</span>
          <span className="text-[var(--color-fc-primary)]">
            {step === 1 && "Choix du cursus"}
            {step === 2 && "Informations personnelles"}
            {step === 3 && "Parcours acadÃ©mique"}
            {step === 4 && "Responsable / Tuteur"}
            {step === 5 && "RÃ©capitulatif & validation"}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-fc-gray-light)]/60">
          <div className="h-full rounded-full bg-[var(--color-fc-primary)] transition-all duration-300" style={{ width: `${(step / 5) * 100}%` }} />
        </div>
        <div className="mt-4 hidden grid-cols-5 gap-2 text-center text-[11px] font-semibold text-[var(--color-fc-gray-mid)] sm:grid">
          {["Formation", "IdentitÃ©", "DiplÃ´mes", "Tuteur", "Confirmation"].map((label, i) => (
            <div key={label} className={step >= i + 1 ? "text-[var(--color-fc-primary)]" : ""}>{i + 1}. {label}</div>
          ))}
        </div>
      </div>

      {/* Form Content Area */}
      <div className="p-6 sm:p-10 space-y-6">
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* STEP 1: CHOIX FORMATION */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[var(--color-fc-black)]">Ã‰tape 1 â€” Choisissez votre formation</h2>
              <p className="text-xs text-[var(--color-fc-gray-mid)]">
                SÃ©lectionnez le cursus que vous souhaitez intÃ©grer Ã  FuturCraft Institut.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1.5">
                  Formation souhaitÃ©e *
                </label>
                <select
                  value={formData.formationId}
                  onChange={(e) => updateField("formationId", Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] bg-white text-sm font-medium text-[var(--color-fc-black)] focus:ring-2 focus:ring-[var(--color-fc-primary)]/15"
                >
                  {formations.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title} ({f.duration} â€” {f.price.toLocaleString("fr-FR")} FCFA)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1.5">Campus *</label>
                  <select
                    value={formData.campus}
                    onChange={(e) => updateField("campus", e.target.value)}
                    className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] bg-white text-sm text-[var(--color-fc-black)]"
                  >
                    <option value="Godomey (Cotonou)">Godomey (Cotonou)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1.5">Session / Promotion *</label>
                  <select
                    value={formData.session}
                    onChange={(e) => updateField("session", e.target.value)}
                    className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] bg-white text-sm text-[var(--color-fc-black)]"
                  >
                    <option value="Session Mars 2026">Session Mars 2026</option>
                    <option value="Session Mai 2026">Session Mai 2026</option>
                    <option value="Session Cohorte Ã‰tÃ© 2026">Session Cohorte Ã‰tÃ© 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1.5">Mode de formation *</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => updateField("mode", e.target.value)}
                    className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] bg-white text-sm text-[var(--color-fc-black)]"
                  >
                    <option value="PrÃ©sentiel & Hybride">PrÃ©sentiel & Hybride</option>
                    <option value="PrÃ©sentiel 100%">PrÃ©sentiel 100%</option>
                    <option value="Cours du soir / Weekend">Cours du soir / Weekend</option>
                  </select>
                </div>
              </div>

              {/* Summary card */}
              {selectedFormation && (
                <div className="p-5 rounded-2xl bg-[var(--color-fc-surface)] border border-[var(--color-fc-primary)]/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[var(--color-fc-primary)] uppercase tracking-wider">
                      RÃ©capitulatif de la filiÃ¨re
                    </span>
                    <span className="text-xs font-extrabold text-[var(--color-fc-black)]">
                      {selectedFormation.price.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <h4 className="font-bold text-[var(--color-fc-black)] text-sm">{selectedFormation.title}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-[var(--color-fc-gray-mid)] pt-1">
                    <div>
                      <span className="text-[var(--color-fc-gray-mid)] block">DurÃ©e :</span>
                      <strong className="text-[var(--color-fc-black)]">{selectedFormation.duration}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--color-fc-gray-mid)] block">Frais inscription :</span>
                      <strong className="text-[var(--color-fc-black)]">
                        {selectedFormation.registrationFee.toLocaleString("fr-FR")} FCFA
                      </strong>
                    </div>
                    <div>
                      <span className="text-[var(--color-fc-gray-mid)] block">Niveau :</span>
                      <strong className="text-[var(--color-fc-black)]">{selectedFormation.level}</strong>
                    </div>
                    <div>
                      <span className="text-[var(--color-fc-gray-mid)] block">Ã‰chÃ©ancier :</span>
                      <strong className="text-[var(--color-fc-black)]">MensualitÃ©s possibles</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: INFORMATIONS PERSONNELLES */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[var(--color-fc-black)]">Ã‰tape 2 â€” Informations personnelles</h2>
              <p className="text-xs text-[var(--color-fc-gray-mid)]">
                Vos coordonnÃ©es serviront Ã  crÃ©er votre profil Ã©tudiant et Ã©diter vos attestations officielles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">Nom *</label>
                <input
                  type="text"
                  placeholder="ex: TOKPO"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value.toUpperCase())}
                  className={fieldCls("lastName")}
                />
                {renderFieldError("lastName")}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">PrÃ©nom(s) *</label>
                <input
                  type="text"
                  placeholder="ex: Onesim"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className={fieldCls("firstName")}
                />
                {renderFieldError("firstName")}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">Sexe *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] bg-white text-sm"
                >
                  <option value="M">Masculin</option>
                  <option value="F">FÃ©minin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">Date de naissance</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => updateField("birthDate", e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">NationalitÃ©</label>
                <input
                  type="text"
                  placeholder="ex: BÃ©ninoise"
                  value={formData.nationality}
                  onChange={(e) => updateField("nationality", e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">Ville de rÃ©sidence *</label>
                <input
                  type="text"
                  placeholder="ex: Cotonou, Calavi, Porto-Novo, Parakou..."
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className={fieldCls("city")}
                />
                {renderFieldError("city")}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">TÃ©lÃ©phone d&apos;appel *</label>
                <input
                  type="tel"
                  placeholder="ex: +229 97 00 00 00"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className={fieldCls("phone")}
                />
                {renderFieldError("phone")}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">NumÃ©ro WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="ex: +229 97 00 00 00"
                  value={formData.whatsapp}
                  onChange={(e) => updateField("whatsapp", e.target.value)}
                  className={fieldCls("whatsapp")}
                />
                {renderFieldError("whatsapp")}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">Adresse email *</label>
                <input
                  type="email"
                  placeholder="ex: votre.nom@gmail.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className={fieldCls("email")}
                />
                {renderFieldError("email")}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INFORMATIONS ACADÃ‰MIQUES */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[var(--color-fc-black)]">Ã‰tape 3 â€” Parcours acadÃ©mique et scolaire</h2>
              <p className="text-xs text-[var(--color-fc-gray-mid)]">
                Ces Ã©lÃ©ments permettent aux formateurs d&apos;adapter la pÃ©dagogie Ã  votre profil.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">Dernier diplÃ´me obtenu *</label>
                <select
                  value={formData.previousDiploma}
                  onChange={(e) => updateField("previousDiploma", e.target.value)}
                  className={`${fieldCls("previousDiploma")} bg-white`}
                >
                  <option value="BEPC">BEPC</option>
                  <option value="BaccalaurÃ©at">BaccalaurÃ©at (BAC)</option>
                  <option value="Licence (BAC+3)">Licence (BAC+3)</option>
                  <option value="Master (BAC+5)">Master (BAC+5)</option>
                  <option value="Formation professionnelle">Formation professionnelle / CAP</option>
                  <option value="Autre">Autre diplÃ´me</option>
                </select>
                {renderFieldError("previousDiploma")}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">Niveau d&apos;Ã©tude actuel *</label>
                <select
                  value={formData.studyLevel}
                  onChange={(e) => updateField("studyLevel", e.target.value)}
                  className={`${fieldCls("studyLevel")} bg-white`}
                >
                  <option value="BEPC">Niveau BEPC</option>
                  <option value="Terminale">Niveau Terminale</option>
                  <option value="BAC">Bachelier</option>
                  <option value="BAC+1 / BAC+2">BAC+1 / BAC+2</option>
                  <option value="BAC+3 et plus">BAC+3 et plus</option>
                  <option value="Professionnel en reconversion">Professionnel en activitÃ© / Reconversion</option>
                </select>
                {renderFieldError("studyLevel")}
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">Dernier Ã©tablissement frÃ©quentÃ©</label>
                <input
                  type="text"
                  placeholder="ex: LycÃ©e BÃ©hanzin, UAC, etc."
                  value={formData.previousSchool}
                  onChange={(e) => updateField("previousSchool", e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">SÃ©rie ou Domaine d&apos;Ã©tude</label>
                <input
                  type="text"
                  placeholder="ex: SÃ©rie C / D / B, Lettres, Ã‰conomie..."
                  value={formData.studyField}
                  onChange={(e) => updateField("studyField", e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">
                  ExpÃ©rience prÃ©alable Ã©ventuelle (facultatif)
                </label>
                <textarea
                  rows={2}
                  placeholder="Avez-vous dÃ©jÃ  manipulÃ© des outils informatiques, fait des stages ou des projets personnels ?"
                  value={formData.previousExperience}
                  onChange={(e) => updateField("previousExperience", e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: RESPONSABLE / PARENT */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[var(--color-fc-black)]">Ã‰tape 4 â€” Contact du Responsable ou Tuteur</h2>
              <p className="text-xs text-[var(--color-fc-gray-mid)]">
                Personne Ã  contacter en cas d&apos;urgence ou pour le suivi administratif et financier.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">Nom et PrÃ©nom du Responsable</label>
                <input
                  type="text"
                  placeholder="ex: M. Paul TOKPO"
                  value={formData.guardianName}
                  onChange={(e) => updateField("guardianName", e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">Lien avec l&apos;Ã©tudiant</label>
                <select
                  value={formData.guardianRelation}
                  onChange={(e) => updateField("guardianRelation", e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] bg-white text-sm"
                >
                  <option value="PÃ¨re">PÃ¨re</option>
                  <option value="MÃ¨re">MÃ¨re</option>
                  <option value="Tuteur lÃ©gal">Tuteur lÃ©gal</option>
                  <option value="Conjoint">Conjoint(e)</option>
                  <option value="Autre">Autre proche</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">TÃ©lÃ©phone du Responsable</label>
                <input
                  type="tel"
                  placeholder="ex: +229 95 00 00 00"
                  value={formData.guardianPhone}
                  onChange={(e) => updateField("guardianPhone", e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--color-fc-black)] mb-1">Email du Responsable</label>
                <input
                  type="email"
                  placeholder="ex: parent@gmail.com"
                  value={formData.guardianEmail}
                  onChange={(e) => updateField("guardianEmail", e.target.value)}
                  className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: RÃ‰CAPITULATIF & VALIDATION */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[var(--color-fc-black)]">Ã‰tape 5 â€” RÃ©capitulatif et Confirmation</h2>
              <p className="text-xs text-[var(--color-fc-gray-mid)]">
                VÃ©rifiez attentivement vos informations avant de confirmer votre demande d&apos;inscription.
              </p>
            </div>

            {/* Recap grid */}
            <div className="p-5 rounded-2xl bg-[var(--color-fc-bg)] border border-[var(--color-fc-gray-light)] space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-[var(--color-fc-gray-light)]">
                <div>
                  <span className="text-[var(--color-fc-gray-mid)] block mb-0.5">Formation choisie :</span>
                  <span className="font-bold text-[var(--color-fc-black)] text-sm">{selectedFormation?.title}</span>
                  <span className="text-[var(--color-fc-gray-mid)] block text-[11px] mt-0.5">
                    {formData.campus} â€¢ {formData.session}
                  </span>
                </div>

                <div>
                  <span className="text-[var(--color-fc-gray-mid)] block mb-0.5">Frais de formation :</span>
                  <span className="font-bold text-[var(--color-fc-primary)] text-sm">
                    {selectedFormation?.price.toLocaleString("fr-FR")} FCFA
                  </span>
                  <span className="text-[var(--color-fc-gray-mid)] block text-[11px] mt-0.5">
                    Frais d&apos;inscription : {selectedFormation?.registrationFee.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-[var(--color-fc-gray-mid)] block">Nom &amp; PrÃ©nom :</span>
                  <span className="font-bold text-[var(--color-fc-black)]">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-[var(--color-fc-gray-mid)] block">TÃ©lÃ©phone :</span>
                  <span className="font-bold text-[var(--color-fc-black)]">{formData.phone}</span>
                </div>
                <div>
                  <span className="text-[var(--color-fc-gray-mid)] block">Email :</span>
                  <span className="font-bold text-[var(--color-fc-black)]">{formData.email}</span>
                </div>
                <div>
                  <span className="text-[var(--color-fc-gray-mid)] block">Ville :</span>
                  <span className="font-bold text-[var(--color-fc-black)]">{formData.city}</span>
                </div>
              </div>

              {formData.guardianName && (
                <div className="pt-2 border-t border-[var(--color-fc-gray-light)] flex items-center gap-4 text-[11px] text-[var(--color-fc-gray-mid)]">
                  <span>
                    Responsable : <strong>{formData.guardianName}</strong> ({formData.guardianRelation})
                  </span>
                  <span>TÃ©l : {formData.guardianPhone || "N/A"}</span>
                </div>
              )}
            </div>

            {/* Checkboxes terms */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 text-xs text-[var(--color-fc-black)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => updateField("agreeTerms", e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[var(--color-fc-primary)] rounded border-[var(--color-fc-gray-light)] focus:ring-[var(--color-fc-primary)]/15"
                />
                <span>
                  J&apos;atteste de l&apos;exactitude des renseignements fournis et j&apos;accepte les conditions d&apos;admission et le rÃ¨glement pÃ©dagogique de FuturCraft Institut.
                </span>
              </label>
              {fieldErrors.agreeTerms && (
                <p className="text-[11px] font-semibold text-rose-500 -mt-1">{fieldErrors.agreeTerms}</p>
              )}

              <label className="flex items-start gap-3 text-xs text-[var(--color-fc-black)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreePrivacy}
                  onChange={(e) => updateField("agreePrivacy", e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-[var(--color-fc-primary)] rounded border-[var(--color-fc-gray-light)] focus:ring-[var(--color-fc-primary)]/15"
                />
                <span>
                  J&apos;accepte la politique de confidentialitÃ© relative au traitement de mes donnÃ©es personnelles dans le cadre de ma scolaritÃ©.
                </span>
              </label>
              {fieldErrors.agreePrivacy && (
                <p className="text-[11px] font-semibold text-rose-500 -mt-1">{fieldErrors.agreePrivacy}</p>
              )}
            </div>
          </div>
        )}

        {/* Buttons navigation */}
        <div className="pt-6 border-t border-[var(--color-fc-gray-light)] flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-[var(--color-fc-black)] bg-[var(--color-fc-bg)] hover:bg-[var(--color-fc-gray-light)]/60 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>PrÃ©cÃ©dent</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-[var(--color-fc-deep)] hover:bg-[var(--color-fc-primary)] shadow-md  transition-all flex items-center gap-2"
            >
              <span>Suivant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-8 py-3.5 rounded-xl text-sm font-extrabold text-white bg-[var(--color-fc-primary)] hover:bg-[var(--color-fc-deep)] shadow-xl  transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  GÃ©nÃ©ration du dossier...
                </span>
              ) : (
                <>
                  <span>Confirmer ma demande d&apos;inscription</span>
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}





