"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building,
  Briefcase,
  Search,
  CheckCircle2,
  Send,
  MapPin,
  Clock,
  ArrowRight,
  Handshake,
  GraduationCap,
  FileText,
  X,
  Pencil,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

interface OfferItem {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  offerType: string;
  title: string;
  location: string;
  description: string;
  skillsRequired: string;
  deadline: string | null;
  status: string;
}

interface TalentItem {
  id?: number;
  name: string;
  firstName?: string;
  lastName?: string;
  formation: string;
  skills: string[];
  status: string;
  campus: string;
  matricule: string;
  promotion?: string;
  photoUrl?: string;
  cvUrl?: string;
  email?: string;
  phone?: string;
}

export function CompanyPortal({
  initialOffers,
  initialTalents = [],
  isAdmin = false,
}: {
  initialOffers: OfferItem[];
  initialTalents?: TalentItem[];
  isAdmin?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"recruter" | "publier" | "partenariat">("recruter");
  const [skillSearch, setSkillSearch] = useState("");
  const [offers, setOffers] = useState<OfferItem[]>(initialOffers);
  const [talents, setTalents] = useState<TalentItem[]>(initialTalents);

  // Recruiter contact modal state
  const [contactTalent, setContactTalent] = useState<TalentItem | null>(null);
  const [contactForm, setContactForm] = useState({
    companyName: "",
    recruiterName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Form for posting an offer
  const [offerForm, setOfferForm] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    offerType: "stage",
    title: "",
    location: "Cotonou / Hybride",
    description: "",
    skillsRequired: "",
    deadline: "2026-12-31",
  });
  const [isPostingOffer, setIsPostingOffer] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);

  // Form for partnership
  const [partnerForm, setPartnerForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    partnershipType: "Stage & Recrutement prioritaire",
    message: "",
  });
  const [partnerSuccess, setPartnerSuccess] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return "FC";
    const parts = (name || "").trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || "FC";
    }
    return (name || "").slice(0, 2).toUpperCase() || "FC";
  };

  const getStatusBadge = (status?: string) => {
    const s = (status || "").toLowerCase();
    if (s.includes("disponible")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          {status || "Disponible"}
        </span>
      );
    }
    if (s.includes("alternance")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          {status || "Recherche d'alternance"}
        </span>
      );
    }
    if (s.includes("stage")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          {status || "Recherche de stage"}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
        <span className="w-2 h-2 rounded-full bg-purple-500" />
        {status || "Profil qualifié"}
      </span>
    );
  };

  const filteredTalents = (talents || []).filter((t) => {
    if (!skillSearch.trim()) return true;
    const q = skillSearch.toLowerCase();
    const skills = Array.isArray(t.skills) ? t.skills : [];
    return (
      skills.some((s) => (s || "").toLowerCase().includes(q)) ||
      (t.formation || "").toLowerCase().includes(q) ||
      (t.name || "").toLowerCase().includes(q) ||
      (t.status || "").toLowerCase().includes(q)
    );
  });

  const handleOpenContactTalent = (t: TalentItem) => {
    setContactTalent(t);
    setContactSuccess(false);
    setContactForm({
      companyName: "",
      recruiterName: "",
      email: "",
      phone: "",
      message: `Bonjour, nous sommes vivement intéressés par le profil de ${t.name} (${t.formation}) pour une opportunité au sein de notre entreprise.`,
    });
  };

  const handleSubmitContactTalent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactTalent) return;
    setIsSubmittingContact(true);
    try {
      const res = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: contactForm.companyName,
          contactName: contactForm.recruiterName,
          email: contactForm.email,
          phone: contactForm.phone,
          partnershipType: `Recrutement Talent: ${contactTalent.name} (${contactTalent.matricule || "Étudiant"})`,
          message: `${contactForm.message} \n\n[Candidat ciblé: ${contactTalent.name} - ${contactTalent.formation} - Email: ${contactTalent.email || "N/A"}]`,
        }),
      });
      if (res.ok) {
        setContactSuccess(true);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Erreur lors de la prise de contact.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de votre demande.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handlePostOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPostingOffer(true);
    try {
      const res = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerForm),
      });
      const data = await res.json();
      if (res.ok) {
        setOffers([data.offer, ...offers]);
        setOfferSuccess(true);
        setOfferForm({
          companyName: "",
          contactPerson: "",
          email: "",
          phone: "",
          offerType: "stage",
          title: "",
          location: "Cotonou / Hybride",
          description: "",
          skillsRequired: "",
          deadline: "2026-12-31",
        });
      }
    } finally {
      setIsPostingOffer(false);
    }
  };

  const [isSubmittingPartner, setIsSubmittingPartner] = useState(false);

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingPartner(true);
    try {
      const res = await fetch("/api/partnerships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(partnerForm),
      });
      const data = await res.json();
      if (res.ok) {
        setPartnerSuccess(true);
        setPartnerForm({
          companyName: "",
          contactName: "",
          email: "",
          phone: "",
          partnershipType: "Stage & Recrutement prioritaire",
          message: "",
        });
      } else {
        console.error("POST /api/partnerships error:", data.error);
      }
    } catch (error) {
      console.error("POST /api/partnerships error:", error);
    } finally {
      setIsSubmittingPartner(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs sm:text-sm font-bold pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab("recruter")}
          className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === "recruter"
              ? "border-[var(--color-fc-primary)] text-[var(--color-fc-primary)] font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Search className="w-4 h-4 text-blue-600" />
          <span>Trouver un talent ({talents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("publier")}
          className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === "publier"
              ? "border-[var(--color-fc-primary)] text-[var(--color-fc-primary)] font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Briefcase className="w-4 h-4 text-blue-600" />
          <span>Déposer une offre ({offers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("partenariat")}
          className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
            activeTab === "partenariat"
              ? "border-[var(--color-fc-primary)] text-[var(--color-fc-primary)] font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Handshake className="w-4 h-4 text-blue-600" />
          <span>Devenir Entreprise Partenaire</span>
        </button>
      </div>

      {/* TAB 1: RECRUTER UN ÉTUDIANT */}
      {activeTab === "recruter" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Admin Mode Alert & Quick Navigation */}
          {isAdmin && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-[#051269] via-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md border border-blue-400/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-300/30 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-black text-white flex items-center gap-2">
                    <span>Mode Administrateur Activé</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Gestion Directe
                    </span>
                  </h4>
                  <p className="text-[11px] text-blue-200/80">
                    Vous pouvez modifier chacun des profils talents ci-dessous ou en créer de nouveaux depuis la console d&apos;administration.
                  </p>
                </div>
              </div>
              <Link
                href="/admin?tab=talents"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-sm flex items-center gap-2 shrink-0 hover:shadow-md"
              >
                <span>Console Admin Vivier de Talents</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Search bar & Filter */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par compétence (ex: React, Python, Drone, Figma), nom ou formation..."
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500 outline-hidden"
              />
              {skillSearch && (
                <button
                  type="button"
                  onClick={() => setSkillSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
              <span className="text-xs text-slate-500 font-semibold">
                <strong>{filteredTalents.length}</strong> profil(s) certifié(s)
              </span>
              {skillSearch && (
                <button
                  type="button"
                  onClick={() => setSkillSearch("")}
                  className="text-xs text-blue-600 hover:underline font-bold"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>

          {/* Talents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTalents.length === 0 ? (
              <div className="col-span-full p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
                <Building className="w-10 h-10 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-800">Aucun profil ne correspond à votre recherche</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Essayez avec un autre mot-clé ou réinitialisez la recherche pour voir tous les profils certifiés de l&apos;Institut.
                </p>
                {skillSearch && (
                  <button
                    type="button"
                    onClick={() => setSkillSearch("")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                  >
                    Voir tous les profils
                  </button>
                )}
              </div>
            ) : (
              filteredTalents.map((t, idx) => (
                <div
                  key={t.id ?? idx}
                  className="group p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-5"
                >
                  {/* Header: Photo + Nom/Prénom + Formation + Statut */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      {t.photoUrl ? (
                        <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-blue-100 shadow-xs shrink-0">
                          <Image
                            src={t.photoUrl}
                            alt={`Photo de ${t.name}`}
                            fill
                            unoptimized
                            className="object-cover object-top"
                          />
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-black text-base flex items-center justify-center shrink-0 shadow-xs border-2 border-blue-100">
                          {getInitials(t.name)}
                        </div>
                      )}

                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                            {t.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                          <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                          <span className="line-clamp-1">{t.formation}</span>
                        </div>
                        {t.matricule && (
                          <span className="text-[10px] font-mono font-bold text-slate-400 block">
                            Matricule: {t.matricule}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      {getStatusBadge(t.status)}
                      {isAdmin && t.id && (
                        <Link
                          href={`/admin?tab=talents&edit=${t.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors shadow-2xs"
                          title="Modifier directement ce profil talent depuis l'espace Administrateur"
                        >
                          <Pencil className="w-3 h-3 text-blue-600" />
                          <span>Modifier (Admin)</span>
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Compétences tags */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Compétences validées</span>
                      <span className="text-[10px] text-slate-400 lowercase font-normal">(cliquer pour filtrer)</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {t.skills && t.skills.length > 0 ? (
                        t.skills.map((sk, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => setSkillSearch(sk)}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/60 transition-all cursor-pointer"
                            title={`Filtrer par compétence: ${sk}`}
                          >
                            #{sk}
                          </button>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">Compétences en cours de validation</span>
                      )}
                    </div>
                  </div>

                  {/* Footer: Campus + Actions (CV & Contact) */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {t.campus}
                    </span>

                    <div className="flex items-center gap-2">
                      {t.cvUrl ? (
                        <a
                          href={t.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
                          title="Consulter ou télécharger le CV (PDF)"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-600" />
                          <span>Voir le CV</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenContactTalent(t)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400" />
                          <span>Demander CV</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleOpenContactTalent(t)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[var(--color-fc-primary)] hover:opacity-90 shadow-xs transition-all"
                      >
                        <Send className="w-3 h-3" />
                        <span>Recruter</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recruiter Contact Modal */}
          {contactTalent && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md">
                      Mise en relation directe
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-2">
                      Recruter {contactTalent.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Formation : {contactTalent.formation}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setContactTalent(null)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {contactSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="text-base font-bold text-slate-900">Demande transmise avec succès !</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Notre pôle Insertion Professionnelle &amp; Relations Entreprises a bien reçu votre demande concernant <strong>{contactTalent.name}</strong>. Nous vous recontacterons très rapidement pour organiser l&apos;entretien.
                    </p>
                    <button
                      type="button"
                      onClick={() => setContactTalent(null)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                    >
                      Fermer
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitContactTalent} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Votre Entreprise *</label>
                        <input
                          type="text"
                          required
                          placeholder="Nom de l'entreprise"
                          value={contactForm.companyName}
                          onChange={(e) => setContactForm({ ...contactForm, companyName: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Votre Nom / DRH *</label>
                        <input
                          type="text"
                          required
                          placeholder="Prénom et Nom"
                          value={contactForm.recruiterName}
                          onChange={(e) => setContactForm({ ...contactForm, recruiterName: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Email professionnel *</label>
                        <input
                          type="email"
                          required
                          placeholder="recrutement@societe.com"
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Téléphone / WhatsApp *</label>
                        <input
                          type="text"
                          required
                          placeholder="+229 ..."
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Votre message / Opportunité</label>
                      <textarea
                        rows={3}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {contactTalent.cvUrl && (
                      <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between text-xs text-blue-900">
                        <span className="font-semibold flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-blue-600" />
                          CV du candidat disponible
                        </span>
                        <a
                          href={contactTalent.cvUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-blue-600 hover:underline"
                        >
                          Télécharger le PDF →
                        </a>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setContactTalent(null)}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingContact}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shadow-md transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmittingContact ? "Envoi en cours..." : "Transmettre l'invitation"}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PUBLIER UNE OFFRE */}
      {activeTab === "publier" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Form */}
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Publier une Offre Gratuite</h3>
                <p className="text-xs text-slate-500">
                  Votre offre sera diffusée auprès des promotions d&apos;étudiants et du réseau alumni.
                </p>
              </div>

              {offerSuccess && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Votre offre a été enregistrée et publiée avec succès !</span>
                </div>
              )}

              <form onSubmit={handlePostOffer} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom de l&apos;Entreprise *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Tech Solutions Bénin"
                      value={offerForm.companyName}
                      onChange={(e) => setOfferForm({ ...offerForm, companyName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Personne contact *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Sarah K."
                      value={offerForm.contactPerson}
                      onChange={(e) => setOfferForm({ ...offerForm, contactPerson: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email recruteur *</label>
                    <input
                      type="email"
                      required
                      placeholder="rh@entreprise.com"
                      value={offerForm.email}
                      onChange={(e) => setOfferForm({ ...offerForm, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Téléphone / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="+229 ..."
                      value={offerForm.phone}
                      onChange={(e) => setOfferForm({ ...offerForm, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Type d&apos;opportunité *</label>
                    <select
                      value={offerForm.offerType}
                      onChange={(e) => setOfferForm({ ...offerForm, offerType: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="stage">Stage professionnel (3 à 6 mois)</option>
                      <option value="emploi">Emploi (CDI / CDD)</option>
                      <option value="freelance">Mission Freelance</option>
                      <option value="alternance">Alternance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Intitulé du poste *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Développeur React / Next.js Junior"
                      value={offerForm.title}
                      onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Compétences attendues *</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: React, Git, Tailwind, sens du détail"
                    value={offerForm.skillsRequired}
                    onChange={(e) => setOfferForm({ ...offerForm, skillsRequired: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description du poste et missions</label>
                  <textarea
                    rows={3}
                    placeholder="Détaillez les projets sur lesquels l'étudiant interviendra..."
                    value={offerForm.description}
                    onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isPostingOffer}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isPostingOffer ? "Publication..." : "Publier l'offre d'embauche"}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* List of current published offers */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Offres Récemment Déposées</h3>
              <div className="space-y-3">
                {offers.map((off) => (
                  <div
                    key={off.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-600 text-[11px] uppercase tracking-wider">
                        {off.offerType}
                      </span>
                      <span className="text-[10px] text-slate-400">{off.location}</span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{off.title}</h4>
                    <p className="text-slate-500 text-[11px] line-clamp-2">{off.description}</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span>Entreprise : <strong>{off.companyName}</strong></span>
                      <span>Contact : {off.email}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DEVENIR PARTENAIRE */}
      {activeTab === "partenariat" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="max-w-2xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
                Alliance Stratégique
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mt-2">
                Devenir Entreprise Partenaire de FuturCraft
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Participez à la co-conception de programmes pédagogiques sur mesure, proposez des défis réels à nos hackathons et recrutez en priorité les meilleurs majors de promotion.
              </p>
            </div>

            {partnerSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Demande de partenariat transmise !</h4>
                <p className="text-xs text-slate-600">
                  Notre direction des relations entreprises vous contactera sous 48h ouvrées.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Raison sociale *</label>
                    <input
                      type="text"
                      required
                      placeholder="Nom de la société"
                      value={partnerForm.companyName}
                      onChange={(e) => setPartnerForm({ ...partnerForm, companyName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom du Dirigeant / DRH *</label>
                    <input
                      type="text"
                      required
                      placeholder="Prénom et Nom"
                      value={partnerForm.contactName}
                      onChange={(e) => setPartnerForm({ ...partnerForm, contactName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email professionnel *</label>
                    <input
                      type="email"
                      required
                      placeholder="contact@societe.com"
                      value={partnerForm.email}
                      onChange={(e) => setPartnerForm({ ...partnerForm, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Téléphone *</label>
                    <input
                      type="text"
                      required
                      placeholder="+229 ..."
                      value={partnerForm.phone}
                      onChange={(e) => setPartnerForm({ ...partnerForm, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Type de partenariat souhaité</label>
                  <select
                    value={partnerForm.partnershipType}
                    onChange={(e) => setPartnerForm({ ...partnerForm, partnershipType: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Stage & Recrutement prioritaire">Stage &amp; Recrutement prioritaire</option>
                    <option value="Sponsoring Hackathon & Projets">Sponsoring Hackathon &amp; Projets réels</option>
                    <option value="Formation continue des salariés">Formation continue des salariés sur mesure</option>
                    <option value="Don d'équipements technologiques">Don d&apos;équipements technologiques</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Message d&apos;accompagnement</label>
                  <textarea
                    rows={3}
                    placeholder="Présentez vos attentes..."
                    value={partnerForm.message}
                    onChange={(e) => setPartnerForm({ ...partnerForm, message: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingPartner}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed shadow-md transition-all"
                  >
                    {isSubmittingPartner
                      ? "Envoi en cours..."
                      : "Transmettre notre proposition de partenariat"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
