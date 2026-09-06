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
} from "lucide-react";

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
  } | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Choix formation
    formationId: preselectedFormationId ? Number(preselectedFormationId) : formations[0]?.id || 1,
    campus: "Godomey (Cotonou)",
    mode: "Présentiel & Hybride",
    session: "Session Mars 2026",

    // Step 2: Informations personnelles
    firstName: "",
    lastName: "",
    gender: "M",
    birthDate: "",
    birthPlace: "",
    nationality: "Béninoise",
    residenceCountry: "Bénin",
    city: "Cotonou",
    address: "",
    phone: "",
    whatsapp: "",
    email: "",

    // Step 3: Informations académiques
    previousDiploma: "Baccalauréat",
    studyLevel: "BAC",
    previousSchool: "",
    studyField: "",
    previousExperience: "",

    // Step 4: Parent / Responsable
    guardianName: "",
    guardianRelation: "Père",
    guardianPhone: "",
    guardianEmail: "",

    // Step 5: Accord
    agreeTerms: false,
    agreePrivacy: false,
  });

  const selectedFormation = formations.find((f) => f.id === Number(formData.formationId)) || formations[0];

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setErrorMsg("");
    if (step === 1) {
      if (!formData.formationId) {
        setErrorMsg("Veuillez sélectionner une formation.");
        return;
      }
    } else if (step === 2) {
      if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.phone.trim() || !formData.email.trim()) {
        setErrorMsg("Veuillez renseigner les champs obligatoires (Nom, Prénom, Téléphone, Email).");
        return;
      }
      if (!formData.email.includes("@")) {
        setErrorMsg("Veuillez renseigner une adresse email valide.");
        return;
      }
    } else if (step === 3) {
      if (!formData.previousDiploma || !formData.studyLevel) {
        setErrorMsg("Veuillez préciser votre dernier diplôme et niveau d'étude.");
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setErrorMsg("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    if (!formData.agreeTerms || !formData.agreePrivacy) {
      setErrorMsg("Veuillez accepter le règlement et la politique de confidentialité pour valider votre inscription.");
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
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-2xl max-w-2xl mx-auto text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Candidature Enregistrée avec Succès
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Félicitations, {successData.studentName} !
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Votre dossier d&apos;inscription pour la formation <strong>{selectedFormation?.title}</strong> a été validé par notre système.
          </p>
        </div>

        {/* Unique Student Number Badge */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Votre Matricule Étudiant Unique :
            </span>
            <button
              onClick={copyMatricule}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copié !" : "Copier"}</span>
            </button>
          </div>
          <div className="text-2xl sm:text-3xl font-black tracking-widest text-blue-600 font-mono bg-white p-3 rounded-xl border border-slate-200 text-center">
            {successData.studentNumber}
          </div>
          <p className="text-[11px] text-slate-500 text-center">
            Conservez ce matricule. Il vous permet d&apos;accéder à votre espace étudiant et de régler vos mensualités.
          </p>
        </div>

        {/* Direct Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href={`/espace-etudiant?studentId=${successData.studentId}`}
            className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Accéder à Mon Espace Étudiant</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/"
            className="px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  // WIZARD STEPS
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-4xl mx-auto">
      {/* Progress Bar & Steps Tabs */}
      <div className="bg-slate-50/80 border-b border-slate-200 p-4 sm:p-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
          <span>Étape {step} sur 5</span>
          <span className="text-blue-600">
            {step === 1 && "1. Choix du cursus"}
            {step === 2 && "2. Informations personnelles"}
            {step === 3 && "3. Parcours académique"}
            {step === 4 && "4. Responsable / Tuteur"}
            {step === 5 && "5. Récapitulatif & Validation"}
          </span>
        </div>

        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Step icons bar */}
        <div className="hidden sm:grid grid-cols-5 gap-2 mt-4 text-[11px] font-semibold text-slate-500 text-center">
          <div className={step >= 1 ? "text-blue-600 font-bold" : ""}>1. Formation</div>
          <div className={step >= 2 ? "text-blue-600 font-bold" : ""}>2. Identité</div>
          <div className={step >= 3 ? "text-blue-600 font-bold" : ""}>3. Diplômes</div>
          <div className={step >= 4 ? "text-blue-600 font-bold" : ""}>4. Tuteur</div>
          <div className={step >= 5 ? "text-blue-600 font-bold" : ""}>5. Confirmation</div>
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
              <h2 className="text-xl font-bold text-slate-900">Étape 1 — Choisissez votre formation</h2>
              <p className="text-xs text-slate-500">
                Sélectionnez le cursus que vous souhaitez intégrer à FuturCraft Institut.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Formation souhaitée *
                </label>
                <select
                  value={formData.formationId}
                  onChange={(e) => updateField("formationId", Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 focus:ring-2 focus:ring-blue-500"
                >
                  {formations.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title} ({f.duration} — {f.price.toLocaleString("fr-FR")} FCFA)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Campus *</label>
                  <select
                    value={formData.campus}
                    onChange={(e) => updateField("campus", e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900"
                  >
                    <option value="Godomey (Cotonou)">Godomey (Cotonou)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Session / Promotion *</label>
                  <select
                    value={formData.session}
                    onChange={(e) => updateField("session", e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900"
                  >
                    <option value="Session Mars 2026">Session Mars 2026</option>
                    <option value="Session Mai 2026">Session Mai 2026</option>
                    <option value="Session Cohorte Été 2026">Session Cohorte Été 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Mode de formation *</label>
                  <select
                    value={formData.mode}
                    onChange={(e) => updateField("mode", e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-900"
                  >
                    <option value="Présentiel & Hybride">Présentiel & Hybride</option>
                    <option value="Présentiel 100%">Présentiel 100%</option>
                    <option value="Cours du soir / Weekend">Cours du soir / Weekend</option>
                  </select>
                </div>
              </div>

              {/* Summary card */}
              {selectedFormation && (
                <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                      Récapitulatif de la filière
                    </span>
                    <span className="text-xs font-extrabold text-blue-900">
                      {selectedFormation.price.toLocaleString("fr-FR")} FCFA
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedFormation.title}</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 pt-1">
                    <div>
                      <span className="text-slate-400 block">Durée :</span>
                      <strong className="text-slate-800">{selectedFormation.duration}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Frais inscription :</span>
                      <strong className="text-slate-800">
                        {selectedFormation.registrationFee.toLocaleString("fr-FR")} FCFA
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Niveau :</span>
                      <strong className="text-slate-800">{selectedFormation.level}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Échéancier :</span>
                      <strong className="text-slate-800">Mensualités possibles</strong>
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
              <h2 className="text-xl font-bold text-slate-900">Étape 2 — Informations personnelles</h2>
              <p className="text-xs text-slate-500">
                Vos coordonnées serviront à créer votre profil étudiant et éditer vos attestations officielles.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom *</label>
                <input
                  type="text"
                  placeholder="ex: TOKPO"
                  value={formData.lastName}
                  onChange={(e) => updateField("lastName", e.target.value.toUpperCase())}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Prénom(s) *</label>
                <input
                  type="text"
                  placeholder="ex: Onesim"
                  value={formData.firstName}
                  onChange={(e) => updateField("firstName", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sexe *</label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm"
                >
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Date de naissance</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => updateField("birthDate", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nationalité</label>
                <input
                  type="text"
                  placeholder="ex: Béninoise"
                  value={formData.nationality}
                  onChange={(e) => updateField("nationality", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ville de résidence *</label>
                <input
                  type="text"
                  placeholder="ex: Cotonou, Calavi, Porto-Novo, Parakou..."
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone d&apos;appel *</label>
                <input
                  type="tel"
                  placeholder="ex: +229 97 00 00 00"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Numéro WhatsApp *</label>
                <input
                  type="tel"
                  placeholder="ex: +229 97 00 00 00"
                  value={formData.whatsapp}
                  onChange={(e) => updateField("whatsapp", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Adresse email *</label>
                <input
                  type="email"
                  placeholder="ex: votre.nom@gmail.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: INFORMATIONS ACADÉMIQUES */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Étape 3 — Parcours académique et scolaire</h2>
              <p className="text-xs text-slate-500">
                Ces éléments permettent aux formateurs d&apos;adapter la pédagogie à votre profil.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dernier diplôme obtenu *</label>
                <select
                  value={formData.previousDiploma}
                  onChange={(e) => updateField("previousDiploma", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm"
                >
                  <option value="BEPC">BEPC</option>
                  <option value="Baccalauréat">Baccalauréat (BAC)</option>
                  <option value="Licence (BAC+3)">Licence (BAC+3)</option>
                  <option value="Master (BAC+5)">Master (BAC+5)</option>
                  <option value="Formation professionnelle">Formation professionnelle / CAP</option>
                  <option value="Autre">Autre diplôme</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Niveau d&apos;étude actuel *</label>
                <select
                  value={formData.studyLevel}
                  onChange={(e) => updateField("studyLevel", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm"
                >
                  <option value="BEPC">Niveau BEPC</option>
                  <option value="Terminale">Niveau Terminale</option>
                  <option value="BAC">Bachelier</option>
                  <option value="BAC+1 / BAC+2">BAC+1 / BAC+2</option>
                  <option value="BAC+3 et plus">BAC+3 et plus</option>
                  <option value="Professionnel en reconversion">Professionnel en activité / Reconversion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dernier établissement fréquenté</label>
                <input
                  type="text"
                  placeholder="ex: Lycée Béhanzin, UAC, etc."
                  value={formData.previousSchool}
                  onChange={(e) => updateField("previousSchool", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Série ou Domaine d&apos;étude</label>
                <input
                  type="text"
                  placeholder="ex: Série C / D / B, Lettres, Économie..."
                  value={formData.studyField}
                  onChange={(e) => updateField("studyField", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Expérience préalable éventuelle (facultatif)
                </label>
                <textarea
                  rows={2}
                  placeholder="Avez-vous déjà manipulé des outils informatiques, fait des stages ou des projets personnels ?"
                  value={formData.previousExperience}
                  onChange={(e) => updateField("previousExperience", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: RESPONSABLE / PARENT */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Étape 4 — Contact du Responsable ou Tuteur</h2>
              <p className="text-xs text-slate-500">
                Personne à contacter en cas d&apos;urgence ou pour le suivi administratif et financier.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nom et Prénom du Responsable</label>
                <input
                  type="text"
                  placeholder="ex: M. Paul TOKPO"
                  value={formData.guardianName}
                  onChange={(e) => updateField("guardianName", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lien avec l&apos;étudiant</label>
                <select
                  value={formData.guardianRelation}
                  onChange={(e) => updateField("guardianRelation", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-white text-sm"
                >
                  <option value="Père">Père</option>
                  <option value="Mère">Mère</option>
                  <option value="Tuteur légal">Tuteur légal</option>
                  <option value="Conjoint">Conjoint(e)</option>
                  <option value="Autre">Autre proche</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Téléphone du Responsable</label>
                <input
                  type="tel"
                  placeholder="ex: +229 95 00 00 00"
                  value={formData.guardianPhone}
                  onChange={(e) => updateField("guardianPhone", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email du Responsable</label>
                <input
                  type="email"
                  placeholder="ex: parent@gmail.com"
                  value={formData.guardianEmail}
                  onChange={(e) => updateField("guardianEmail", e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: RÉCAPITULATIF & VALIDATION */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900">Étape 5 — Récapitulatif et Confirmation</h2>
              <p className="text-xs text-slate-500">
                Vérifiez attentivement vos informations avant de confirmer votre demande d&apos;inscription.
              </p>
            </div>

            {/* Recap grid */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-400 block mb-0.5">Formation choisie :</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedFormation?.title}</span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    {formData.campus} • {formData.session}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block mb-0.5">Frais de formation :</span>
                  <span className="font-bold text-emerald-600 text-sm">
                    {selectedFormation?.price.toLocaleString("fr-FR")} FCFA
                  </span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">
                    Frais d&apos;inscription : {selectedFormation?.registrationFee.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-slate-400 block">Nom &amp; Prénom :</span>
                  <span className="font-bold text-slate-800">
                    {formData.firstName} {formData.lastName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Téléphone :</span>
                  <span className="font-bold text-slate-800">{formData.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Email :</span>
                  <span className="font-bold text-slate-800">{formData.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Ville :</span>
                  <span className="font-bold text-slate-800">{formData.city}</span>
                </div>
              </div>

              {formData.guardianName && (
                <div className="pt-2 border-t border-slate-200 flex items-center gap-4 text-[11px] text-slate-600">
                  <span>
                    Responsable : <strong>{formData.guardianName}</strong> ({formData.guardianRelation})
                  </span>
                  <span>Tél : {formData.guardianPhone || "N/A"}</span>
                </div>
              )}
            </div>

            {/* Checkboxes terms */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => updateField("agreeTerms", e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span>
                  J&apos;atteste de l&apos;exactitude des renseignements fournis et j&apos;accepte les conditions d&apos;admission et le règlement pédagogique de FuturCraft Institut.
                </span>
              </label>

              <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreePrivacy}
                  onChange={(e) => updateField("agreePrivacy", e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span>
                  J&apos;accepte la politique de confidentialité relative au traitement de mes données personnelles dans le cadre de ma scolarité.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Buttons navigation */}
        <div className="pt-6 border-t border-slate-150 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Précédent</span>
            </button>
          ) : (
            <div />
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
            >
              <span>Suivant</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-8 py-3.5 rounded-xl text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Génération du dossier...</span>
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
