"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  CreditCard,
  TrendingUp,
  Search,
  Plus,
  ShieldCheck,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Building,
  Briefcase,
  Layers,
  ArrowUpRight,
  ChevronDown,
  RefreshCw,
  QrCode,
  LogOut,
} from "lucide-react";

interface AdminStats {
  totalStudents: number;
  activeStudents: number;
  newInscriptions: number;
  totalExpectedAmount: number;
  totalCollectedAmount: number;
  totalRemainingAmount: number;
  recoveryRate: number;
  formationsCount: number;
}

interface StudentItem {
  id: number;
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string | null;
  status: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  formationId: number;
}

interface PaymentItem {
  id: number;
  receiptNumber: string;
  studentId: number;
  amount: number;
  paymentMethod: string;
  transactionRef: string;
  status: string;
  notes: string | null;
  recordedBy: string;
  paidAt: string;
  studentFirstName: string | null;
  studentLastName: string | null;
  studentNumber: string | null;
  formationTitle: string | null;
}

interface FormationItem {
  id: number;
  slug: string;
  title: string;
  category: string;
  duration: string;
  price: number;
  registrationFee: number;
  isActive: boolean | null;
}

export function AdminPortal({
  initialStats,
  initialStudents,
  initialPayments,
  formationsList,
}: {
  initialStats: AdminStats;
  initialStudents: StudentItem[];
  initialPayments: PaymentItem[];
  formationsList: FormationItem[];
}) {
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [students, setStudents] = useState<StudentItem[]>(initialStudents);
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);

  const [currentRole, setCurrentRole] = useState<"super_admin" | "agent" | "financier">("super_admin");
  const [activeTab, setActiveTab] = useState<"dashboard" | "etudiants" | "paiements" | "formations" | "roles">("dashboard");

  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/");
  };

  // Filters & Search for students
  const [searchStudent, setSearchStudent] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formationFilter, setFormationFilter] = useState("all");

  // Manual payment recording modal
  const [showManualPaymentModal, setShowManualPaymentModal] = useState(false);
  const [manualPayStudentId, setManualPayStudentId] = useState<number>(students[0]?.id || 1);
  const [manualPayAmount, setManualPayAmount] = useState<number>(50000);
  const [manualPayMethod, setManualPayMethod] = useState<string>("Caisse / Espèces");
  const [manualPayNotes, setManualPayNotes] = useState<string>("Règlement physique à la caisse du campus de Cotonou");
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);

  // Manual student creation modal
  const [showNewStudentModal, setShowNewStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "Cotonou",
    formationId: formationsList[0]?.id || 1,
    studyLevel: "BAC",
    previousDiploma: "Baccalauréat",
  });
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);

  // Edit status modal
  const [selectedStudentForStatus, setSelectedStudentForStatus] = useState<StudentItem | null>(null);
  const [newStatusValue, setNewStatusValue] = useState("");

  // Filter students
  const filteredStudents = students.filter((s) => {
    const query = searchStudent.toLowerCase();
    const matchesSearch =
      query === "" ||
      s.firstName.toLowerCase().includes(query) ||
      s.lastName.toLowerCase().includes(query) ||
      s.studentNumber.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      s.phone.toLowerCase().includes(query);

    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    const matchesFormation =
      formationFilter === "all" || s.formationId === Number(formationFilter);

    return matchesSearch && matchesStatus && matchesFormation;
  });

  // Reload data helper
  const reloadData = async () => {
    try {
      const [resStats, resStudents, resPayments] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/students").then((r) => r.json()),
        fetch("/api/payments").then((r) => r.json()),
      ]);
      setStats(resStats);
      setStudents(resStudents);
      setPayments(resPayments);
    } catch (e) {
      console.error(e);
    }
  };

  // Submit manual payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecordingPayment(true);

    try {
      const recordedByStaff =
        currentRole === "financier"
          ? "Sarah Menou (Caissière Centrale)"
          : currentRole === "agent"
          ? "Marcelle Agossou (Agent Administratif)"
          : "Gauthier I. ORE (Super Admin)";

      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: manualPayStudentId,
          amount: manualPayAmount,
          paymentMethod: manualPayMethod,
          recordedBy: recordedByStaff,
          notes: manualPayNotes,
        }),
      });

      if (!res.ok) throw new Error("Erreur enregistrement paiement");
      await reloadData();
      setShowManualPaymentModal(false);
      alert("Paiement enregistré et reçu généré avec succès !");
    } catch (err: any) {
      alert(err.message || "Erreur");
    } finally {
      setIsRecordingPayment(false);
    }
  };

  // Create manual student
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.firstName || !newStudentForm.lastName || !newStudentForm.phone || !newStudentForm.email) {
      alert("Veuillez renseigner tous les champs obligatoires.");
      return;
    }

    setIsCreatingStudent(true);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudentForm),
      });

      if (!res.ok) throw new Error("Erreur création étudiant");
      await reloadData();
      setShowNewStudentModal(false);
      alert("Nouvel étudiant créé et matricule généré avec succès !");
    } catch (err: any) {
      alert(err.message || "Erreur");
    } finally {
      setIsCreatingStudent(false);
    }
  };

  // Update student status
  const handleUpdateStatus = async () => {
    if (!selectedStudentForStatus || !newStatusValue) return;

    try {
      const res = await fetch(`/api/students/${selectedStudentForStatus.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatusValue }),
      });
      if (res.ok) {
        await reloadData();
        setSelectedStudentForStatus(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top bar with Role Switcher */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Console d&apos;Administration FuturCraft
                <span className="text-xs px-2 py-0.5 rounded bg-violet-500/30 text-violet-300 font-normal border border-violet-400/30">
                  v1.2
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Supervision des inscriptions, encaissements, cursus et délivrance des reçus
              </p>
            </div>
          </div>

          {/* Role selector dropdown */}
          <div className="flex items-center gap-2 bg-slate-800 p-1.5 rounded-xl border border-slate-700 text-xs">
            <span className="text-slate-400 font-semibold px-2">Rôle actif :</span>
            <button
              onClick={() => setCurrentRole("super_admin")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                currentRole === "super_admin"
                  ? "bg-violet-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Super Admin
            </button>
            <button
              onClick={() => setCurrentRole("financier")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                currentRole === "financier"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Caissier / Financier
            </button>
            <button
              onClick={() => setCurrentRole("agent")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                currentRole === "agent"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Agent Administratif
            </button>
          </div>

          <button
            onClick={handleLogout}
            title="Se déconnecter"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-300 hover:text-white hover:bg-red-600/20 border border-slate-700 hover:border-red-500/40 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold border-b border-slate-200">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "dashboard"
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Tableau de Bord &amp; Recouvrement</span>
          </button>

          <button
            onClick={() => setActiveTab("etudiants")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "etudiants"
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gestion des Étudiants ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("paiements")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "paiements"
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Administration des Paiements ({payments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("formations")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "formations"
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Formations &amp; Tarifs ({formationsList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("roles")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "roles"
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Gestion des Rôles &amp; Permissions</span>
          </button>
        </div>

        {/* 29. TAB DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Total Étudiants
                </span>
                <div className="text-3xl font-black text-slate-900">{stats.totalStudents}</div>
                <div className="flex items-center gap-2 text-xs pt-1">
                  <span className="text-emerald-600 font-bold">{stats.activeStudents} actifs</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-blue-600 font-semibold">{stats.newInscriptions} préinscrits</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Montant Encaissé (FCFA)
                </span>
                <div className="text-3xl font-black text-emerald-600">
                  {stats.totalCollectedAmount.toLocaleString("fr-FR")}
                </div>
                <span className="text-xs text-slate-500 block pt-1">
                  Taux de recouvrement : <strong>{stats.recoveryRate}%</strong>
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Reste à Percevoir
                </span>
                <div className="text-3xl font-black text-rose-600">
                  {stats.totalRemainingAmount.toLocaleString("fr-FR")}
                </div>
                <span className="text-xs text-slate-500 block pt-1">
                  Sur <strong>{stats.totalExpectedAmount.toLocaleString("fr-FR")} FCFA</strong> prévus
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Cursus Ouverts
                </span>
                <div className="text-3xl font-black text-violet-600">{stats.formationsCount}</div>
                <span className="text-xs text-slate-500 block pt-1">
                  Tous campus (Godomey, Supermarché O Bénin Avant pk14)
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Payments Table */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Derniers Encaissements Enregistrés</h3>
                  <button
                    onClick={() => setActiveTab("paiements")}
                    className="text-xs font-bold text-violet-600 hover:underline"
                  >
                    Voir tous les encaissements →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-200 text-slate-500 text-[11px] font-bold">
                      <tr>
                        <th className="py-2">Reçu N°</th>
                        <th className="py-2">Étudiant</th>
                        <th className="py-2">Filière</th>
                        <th className="py-2">Montant</th>
                        <th className="py-2">Mode</th>
                        <th className="py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payments.slice(0, 5).map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-2.5 font-mono font-bold text-blue-600">
                            <Link href={`/recu/${p.receiptNumber}`} target="_blank" className="hover:underline">
                              {p.receiptNumber}
                            </Link>
                          </td>
                          <td className="py-2.5 font-semibold text-slate-900">
                            {p.studentFirstName} {p.studentLastName}
                          </td>
                          <td className="py-2.5 text-slate-600 truncate max-w-[150px]">
                            {p.formationTitle || "Formation"}
                          </td>
                          <td className="py-2.5 font-bold text-emerald-600">
                            {p.amount.toLocaleString("fr-FR")} FCFA
                          </td>
                          <td className="py-2.5 text-slate-500">{p.paymentMethod}</td>
                          <td className="py-2.5 text-slate-400">{p.paidAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900">Opérations Rapides</h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setShowManualPaymentModal(true)}
                    className="w-full p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      Encaisser un paiement physique
                    </span>
                    <Plus className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowNewStudentModal(true)}
                    className="w-full p-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      Inscrire un étudiant au guichet
                    </span>
                    <Plus className="w-4 h-4" />
                  </button>

                  <Link
                    href="/recu"
                    className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-slate-600" />
                      Vérifier l&apos;authenticité d&apos;un reçu
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 26 & 30. TAB GESTION DES ÉTUDIANTS */}
        {activeTab === "etudiants" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header + Add Student button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Répertoire des Candidats &amp; Étudiants</h2>
                <p className="text-xs text-slate-500">
                  Recherchez par nom, matricule, téléphone et gérez les statuts d&apos;admission.
                </p>
              </div>

              <button
                onClick={() => setShowNewStudentModal(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Inscrire un nouvel étudiant</span>
              </button>
            </div>

            {/* 30. RECHERCHE & FILTRES RAPIDES */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, matricule FC-..., email, téléphone..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="actif">Étudiants actifs</option>
                  <option value="preinscrit">Préinscrits</option>
                  <option value="inscrit">Inscrits</option>
                  <option value="termine">Formation terminée</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={formationFilter}
                  onChange={(e) => setFormationFilter(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700"
                >
                  <option value="all">Toutes les formations</option>
                  {formationsList.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Matricule</th>
                      <th className="py-3 px-4">Étudiant</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4">Payé / Total</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-600">
                          {st.studentNumber}
                        </td>
                        <td className="py-3 px-4">
                          <strong className="text-slate-900 block">
                            {st.firstName} {st.lastName}
                          </strong>
                          <span className="text-[10px] text-slate-400">{st.city || "Cotonou"}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <div>{st.phone}</div>
                          <div className="text-[10px] text-slate-400">{st.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              st.status === "actif"
                                ? "bg-emerald-100 text-emerald-800"
                                : st.status === "preinscrit"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {st.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">
                            {st.paidAmount.toLocaleString("fr-FR")} / {st.totalAmount.toLocaleString("fr-FR")} FCFA
                          </div>
                          <div className="text-[10px] text-rose-600">
                            Reste : {st.remainingAmount.toLocaleString("fr-FR")} FCFA
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => {
                              setSelectedStudentForStatus(st);
                              setNewStatusValue(st.status);
                            }}
                            className="text-xs font-bold text-blue-600 hover:underline"
                          >
                            Changer statut
                          </button>
                          <Link
                            href={`/espace-etudiant?studentId=${st.id}`}
                            className="text-xs font-bold text-slate-600 hover:underline"
                          >
                            Voir espace →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 27. TAB ADMINISTRATION DES PAIEMENTS */}
        {activeTab === "paiements" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Registre Comptable &amp; Encaissements</h2>
                <p className="text-xs text-slate-500">
                  Enregistrez les versements en espèces à la caisse ou validez les paiements Mobile Money.
                </p>
              </div>

              <button
                onClick={() => setShowManualPaymentModal(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Enregistrer un versement (Caisse / MoMo)</span>
              </button>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">N° Reçu</th>
                      <th className="py-3 px-4">Étudiant</th>
                      <th className="py-3 px-4">Formation</th>
                      <th className="py-3 px-4">Montant</th>
                      <th className="py-3 px-4">Moyen de paiement</th>
                      <th className="py-3 px-4">Enregistré par</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-blue-600">
                          {p.receiptNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {p.studentFirstName} {p.studentLastName} ({p.studentNumber})
                        </td>
                        <td className="py-3 px-4 text-slate-600">{p.formationTitle}</td>
                        <td className="py-3 px-4 font-extrabold text-emerald-600 text-sm">
                          {p.amount.toLocaleString("fr-FR")} FCFA
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                            {p.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">{p.recordedBy}</td>
                        <td className="py-3 px-4 text-slate-400">{p.paidAt}</td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/recu/${p.receiptNumber}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Voir reçu</span>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 25. TAB FORMATIONS & TARIFS */}
        {activeTab === "formations" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Gestion des Formations &amp; Tarifs</h2>
              <p className="text-xs text-slate-500">
                Consultez les 12 cursus officiels, leurs prix en FCFA et les frais d&apos;inscription.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {formationsList.map((f) => (
                <div
                  key={f.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {f.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      Actif
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{f.title}</h3>
                  <div className="text-xs text-slate-500">⏱️ {f.duration}</div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Frais totaux :</span>
                      <strong className="text-sm font-black text-slate-900">
                        {f.price.toLocaleString("fr-FR")} FCFA
                      </strong>
                    </div>
                    <Link
                      href={`/formation/${f.slug}`}
                      className="text-xs font-bold text-blue-600 hover:underline"
                    >
                      Voir page →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 28. TAB ROLES ET ACCÈS */}
        {activeTab === "roles" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900">Matrice des Rôles et Autorisations</h2>
              <p className="text-xs text-slate-500">
                Chaque profil administratif dispose de droits spécifiques pour garantir la sécurité et la traçabilité des opérations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="p-5 rounded-2xl bg-violet-50/60 border border-violet-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-violet-600 text-white flex items-center justify-center font-bold text-xs">
                      SA
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Super Administrateur</h4>
                      <span className="text-[10px] text-violet-700 font-semibold">Direction Générale</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li>✓ Accès total à la plateforme</li>
                    <li>✓ Gestion financière et audits</li>
                    <li>✓ Modification des formations et tarifs</li>
                    <li>✓ Gestion des accès du personnel</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      CF
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Caissier / Financier</h4>
                      <span className="text-[10px] text-emerald-700 font-semibold">Service Comptabilité</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li>✓ Enregistrement des paiements physiques</li>
                    <li>✓ Génération immédiate des reçus certifiés</li>
                    <li>✓ Suivi des retards d&apos;échéances</li>
                    <li>✗ Modification des programmes de cours</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      AG
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Agent Administratif</h4>
                      <span className="text-[10px] text-blue-700 font-semibold">Service Scolarité</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li>✓ Enregistrement des candidats physiques</li>
                    <li>✓ Édition des attestations de scolarité</li>
                    <li>✓ Mise à jour des coordonnées des étudiants</li>
                    <li>✗ Modification des écritures comptables</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ENREGISTRER UN PAIEMENT PHYSIQUE (CAISSE) */}
      {showManualPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Encaisser un versement étudiant</span>
              </h3>
              <button
                onClick={() => setShowManualPaymentModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Étudiant concerné *</label>
                <select
                  value={manualPayStudentId}
                  onChange={(e) => setManualPayStudentId(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} ({st.studentNumber}) — Reste: {st.remainingAmount} FCFA
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Montant encaissé (FCFA) *</label>
                <input
                  type="number"
                  value={manualPayAmount}
                  onChange={(e) => setManualPayAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mode de versement *</label>
                <select
                  value={manualPayMethod}
                  onChange={(e) => setManualPayMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Caisse / Espèces">Caisse / Espèces (Guichet)</option>
                  <option value="MTN Mobile Money">MTN Mobile Money (Direct marchand)</option>
                  <option value="Moov Money">Moov Money (Direct marchand)</option>
                  <option value="Virement Bancaire">Virement Bancaire / Dépôt guichet</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Réf reçu physique</label>
                <input
                  type="text"
                  value={manualPayNotes}
                  onChange={(e) => setManualPayNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isRecordingPayment}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all disabled:opacity-50"
                >
                  {isRecordingPayment ? "Enregistrement..." : "Valider l'encaissement et générer le reçu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOUVEL ÉTUDIANT MANUEL */}
      {showNewStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>Inscrire un étudiant au guichet physique</span>
              </h3>
              <button
                onClick={() => setShowNewStudentModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.lastName}
                    onChange={(e) =>
                      setNewStudentForm((prev) => ({ ...prev, lastName: e.target.value.toUpperCase() }))
                    }
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.firstName}
                    onChange={(e) =>
                      setNewStudentForm((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+229 ..."
                    value={newStudentForm.phone}
                    onChange={(e) =>
                      setNewStudentForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newStudentForm.email}
                    onChange={(e) =>
                      setNewStudentForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Formation choisie *</label>
                <select
                  value={newStudentForm.formationId}
                  onChange={(e) =>
                    setNewStudentForm((prev) => ({ ...prev, formationId: Number(e.target.value) }))
                  }
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                >
                  {formationsList.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title} ({f.price.toLocaleString("fr-FR")} FCFA)
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isCreatingStudent}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
                >
                  {isCreatingStudent ? "Création en cours..." : "Créer le dossier et générer le matricule FC-2025-..."}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHANGER LE STATUT D'UN ÉTUDIANT */}
      {selectedStudentForStatus && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-slate-900">
              Modifier le statut de {selectedStudentForStatus.firstName} {selectedStudentForStatus.lastName}
            </h3>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-slate-600">Nouveau statut :</label>
              <select
                value={newStatusValue}
                onChange={(e) => setNewStatusValue(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
              >
                <option value="preinscrit">Préinscrit</option>
                <option value="en_attente">Inscription en attente</option>
                <option value="inscrit">Inscrit</option>
                <option value="actif">Étudiant actif</option>
                <option value="termine">Formation terminée</option>
                <option value="suspendu">Suspendu</option>
              </select>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={handleUpdateStatus}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700"
              >
                Mettre à jour
              </button>
              <button
                onClick={() => setSelectedStudentForStatus(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
