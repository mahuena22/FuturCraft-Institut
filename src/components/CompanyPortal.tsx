"use client";

import { useState } from "react";
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
  name: string;
  formation: string;
  skills: string[];
  status: string;
  campus: string;
  matricule: string;
  promotion?: string;
  photoUrl?: string;
  cvUrl?: string;
}

export function CompanyPortal({ initialOffers }: { initialOffers: OfferItem[] }) {
  const [activeTab, setActiveTab] = useState<"recruter" | "publier" | "partenariat">("recruter");
  const [skillSearch, setSkillSearch] = useState("");
  const [offers, setOffers] = useState<OfferItem[]>(initialOffers);

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

  // Mock available talents profile directory
  const talents: TalentItem[] = [
    {
      name: "Loïc Assogba",
      formation: "Développeur Web Full-Stack",
      skills: ["HTML", "CSS", "JavaScript", "React", "Node.js", "Bases de données"],
      status: "Recherche de stage",
      campus: "Cotonou, Bénin",
      matricule: "",
      promotion: "Promotion 2026",
      photoUrl: "/images/samuel.jpeg",
      cvUrl: "/cv/CV_ASSOGBA_K._Samuel_Jean-Loïc.pdf",
    },
    {
      name: "Ange AKONDE",
      formation: "Développeur Full-Stack",
      skills: ["React", "Next.js", "Node.js", "PostgreSQL", "TypeScript", "Tailwind CSS"],
      status: "Disponible immédiatement",
      campus: "Abomey-Calavi",
      matricule: "FC-2025-0106",
      cvUrl: "/cv/bigsixteen%20(1).pdf",
    },
    {
      name: "Onesim T.",
      formation: "Développement Web Fullstack",
      skills: ["React", "Next.js", "Node.js", "PostgreSQL", "Tailwind CSS", "TypeScript"],
      status: "En recherche de stage / CDI",
      campus: "Cotonou",
      matricule: "FC-2025-0142",
    },
    {
      name: "Amina S.",
      formation: "Web Design (UI/UX)",
      skills: ["Figma", "Design Systems", "Prototypage", "Mobile UI", "Wireframing"],
      status: "Disponible immédiatement",
      campus: "Porto-Novo / Cotonou",
      matricule: "FC-2025-0089",
    },
    {
      name: "Koffi M.",
      formation: "Pilotage Professionnel de Drone",
      skills: ["DJI Mavic 3", "Photogrammétrie", "Pix4D", "Cartographie", "ANAC Bénin"],
      status: "Disponible missions freelance & CDI",
      campus: "Godomey, Supermarché O Bénin Avant pk14",
      matricule: "FC-2025-0204",
    },
    {
      name: "Bérénice D.",
      formation: "Développement en Intelligence Artificielle",
      skills: ["Python", "PyTorch", "OpenCV", "LangChain", "LLMs & RAG", "Pandas"],
      status: "En recherche d'alternance / stage",
      campus: "Cotonou",
      matricule: "FC-2025-0310",
    },
  ];

  const filteredTalents = talents.filter((t) => {
    if (!skillSearch.trim()) return true;
    const q = skillSearch.toLowerCase();
    return (
      t.skills.some((s) => s.toLowerCase().includes(q)) ||
      t.formation.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q)
    );
  });

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
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold pb-1">
        <button
          onClick={() => setActiveTab("recruter")}
          className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "recruter"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Trouver un talent</span>
        </button>

        <button
          onClick={() => setActiveTab("publier")}
          className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "publier"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Déposer une offre ({offers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("partenariat")}
          className={`px-4 py-3 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "partenariat"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Handshake className="w-4 h-4" />
          <span>Devenir Entreprise Partenaire</span>
        </button>
      </div>

      {/* TAB 1: RECRUTER UN ÉTUDIANT */}
      {activeTab === "recruter" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par compétence (ex: React, Python, Drone, Figma, Node...)"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <span className="text-xs text-slate-500 font-semibold self-start sm:self-auto">
              {filteredTalents.length} profil(s) certifié(s)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredTalents.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {t.photoUrl && (
                      <Image
                        src={t.photoUrl}
                        alt={`Photo de ${t.name}`}
                        width={56}
                        height={56}
                        unoptimized
                        className="w-14 h-14 rounded-full object-cover border-2 border-blue-100"
                      />
                    )}
                    <div>
                    {(t.matricule || t.promotion) && (
                      <span className="text-[10px] font-mono text-slate-400 font-bold block">
                        {t.matricule || t.promotion}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-slate-900">{t.name}</h3>
                    <p className="text-xs text-blue-600 font-semibold">{t.formation}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {t.status}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Compétences validées :
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {t.skills.map((sk, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> {t.campus}
                  </span>
                  <a
                    href={t.cvUrl || "mailto:contact@futurcraftinstitut.com?subject=Demande de mise en relation profil FuturCraft"}
                    target={t.cvUrl ? "_blank" : undefined}
                    rel={t.cvUrl ? "noreferrer" : undefined}
                    download={t.cvUrl ? true : undefined}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    {t.cvUrl ? "Télécharger le CV →" : "Demander le CV complet →"}
                  </a>
                </div>
              </div>
            ))}
          </div>
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
