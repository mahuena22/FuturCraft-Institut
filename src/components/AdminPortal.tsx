"use client";

import { useState, useEffect } from "react";
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
  Handshake,
  FileText,
  Pencil,
  Trash2,
  DollarSign,
  Bell,
  Mail,
  AlertCircle,
  Download,
} from "lucide-react";

import { ReminderMonitor } from "./ReminderMonitor";

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

interface PaymentRequestItem {
  id: number;
  studentId: number;
  amount: number;
  method: string;
  phone: string;
  status: string;
  reference: string;
  createdAt: string;
  studentFirstName: string | null;
  studentLastName: string | null;
  studentNumber: string | null;
}

interface FormationItem {
  id: number;
  slug: string;
  title: string;
  category: string;
  duration: string;
  price: number;
  registrationFee: number;
  installmentsCount: number;
  campus: string;
  mode: string;
  isActive: boolean | null;
  isPopular: boolean | null;
}

interface PartnershipItem {
  id: number;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  partnershipType: string;
  message: string | null;
  status: string;
  createdAt: string;
}

interface ArticleItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  readTime: string;
  category: string;
  publishedAt: string;
}

export function AdminPortal({
  initialStats,
  initialStudents,
  initialPayments,
  formationsList,
  initialPartnerships,
  initialArticles,
}: {
  initialStats: AdminStats;
  initialStudents: StudentItem[];
  initialPayments: PaymentItem[];
  formationsList: FormationItem[];
  initialPartnerships: PartnershipItem[];
  initialArticles?: ArticleItem[];
}) {
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [students, setStudents] = useState<StudentItem[]>(initialStudents);
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [partnerships, setPartnerships] = useState<PartnershipItem[]>(initialPartnerships);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequestItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles || []);
  const [formations, setFormations] = useState<FormationItem[]>(formationsList);

  const [currentRole, setCurrentRole] = useState<"super_admin" | "agent" | "financier">("super_admin");
  const [activeTab, setActiveTab] = useState<"dashboard" | "etudiants" | "paiements" | "formations" | "articles" | "roles" | "partenariats" | "rappels">("dashboard");

  const router = useRouter();

  // Load online payment requests on mount
  useEffect(() => {
    let cancelled = false;
    fetch("/api/payment-requests")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setPaymentRequests(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

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

  // Formation edit modal
  const [editingFormation, setEditingFormation] = useState<FormationItem | null>(null);
  const [formationForm, setFormationForm] = useState({
    title: "",
    duration: "",
    price: 0,
    registrationFee: 0,
    installmentsCount: 3,
    campus: "",
    mode: "",
    isActive: true,
    isPopular: false,
  });
  const [isSavingFormation, setIsSavingFormation] = useState(false);

  // Article editor modal
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleItem | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "",
    readTime: "5 min de lecture",
    category: "",
    publishedAt: "",
  });

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
      const [resStats, resStudents, resPayments, resPartnerships, resPaymentRequests] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/students").then((r) => r.json()),
        fetch("/api/payments").then((r) => r.json()),
        fetch("/api/partnerships").then((r) => r.json()),
        fetch("/api/payment-requests").then((r) => r.json()),
      ]);
      setStats(resStats);
      setStudents(resStudents);
      setPayments(resPayments);
      setPartnerships(resPartnerships);
      setPaymentRequests(resPaymentRequests);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle payment request: confirm / reject
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(null);
  const handlePaymentRequestAction = async (id: number, action: "confirmer" | "rejeter") => {
    if (!window.confirm(action === "confirmer" ? "Confirmer ce paiement et générer le reçu officiel ?" : "Rejeter cette demande de paiement ?")) return;
    setProcessingRequestId(id);
    try {
      const res = await fetch(`/api/payment-requests/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        window.alert(data.error || "Erreur lors du traitement");
      }
      await reloadData();
    } catch (e) {
      console.error(e);
      window.alert("Erreur réseau lors du traitement");
    } finally {
      setProcessingRequestId(null);
    }
  };

  // Open formation edit modal
  const openFormationEditor = (f: FormationItem) => {
    setEditingFormation(f);
    setFormationForm({
      title: f.title,
      duration: f.duration,
      price: f.price,
      registrationFee: f.registrationFee,
      installmentsCount: f.installmentsCount,
      campus: f.campus,
      mode: f.mode,
      isActive: f.isActive !== null ? f.isActive : true,
      isPopular: f.isPopular !== null ? f.isPopular : false,
    });
  };

  // Save formation modifications
  const handleSaveFormation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFormation) return;
    setIsSavingFormation(true);
    try {
      const res = await fetch(`/api/formations/${editingFormation.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formationForm.title,
          duration: formationForm.duration,
          price: Number(formationForm.price),
          registrationFee: Number(formationForm.registrationFee),
          installmentsCount: Number(formationForm.installmentsCount),
          campus: formationForm.campus,
          mode: formationForm.mode,
          isActive: formationForm.isActive,
          isPopular: formationForm.isPopular,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erreur mise à jour");
      setFormations((prev) =>
        prev.map((f) => (f.slug === editingFormation.slug ? { ...f, ...data.formation } : f))
      );
      setEditingFormation(null);
      alert("Formation mise à jour avec succès !");
    } catch (err: any) {
      alert(err.message || "Erreur");
    } finally {
      setIsSavingFormation(false);
    }
  };

  // Open article editor (create or edit)
  const openArticleEditor = (article: ArticleItem | null) => {
    setEditingArticle(article);
    setArticleForm(
      article
        ? {
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            coverImage: article.coverImage,
            author: article.author,
            readTime: article.readTime,
            category: article.category,
            publishedAt: article.publishedAt,
          }
        : {
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            coverImage: "",
            author: "Équipe Pédagogique FuturCraft",
            readTime: "5 min de lecture",
            category: "",
            publishedAt: new Date().toISOString().slice(0, 10),
          }
    );
    setArticleModalOpen(true);
  };

  // Save article (create or update)
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingArticle ? `/api/articles/${editingArticle.slug}` : "/api/articles";
      const res = await fetch(url, {
        method: editingArticle ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: articleForm.title,
          slug: articleForm.slug,
          excerpt: articleForm.excerpt,
          content: articleForm.content,
          coverImage: articleForm.coverImage,
          author: articleForm.author,
          readTime: articleForm.readTime,
          category: articleForm.category,
          publishedAt: articleForm.publishedAt,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erreur enregistrement article");

      if (editingArticle) {
        setArticles((prev) =>
          prev.map((a) =>
            a.slug === editingArticle.slug ? { ...a, ...data.article } : a
          )
        );
      } else {
        setArticles((prev) => [data.article, ...prev]);
      }
      setArticleModalOpen(false);
      alert(editingArticle ? "Article mis à jour !" : "Article créé !");
    } catch (err: any) {
      alert(err.message || "Erreur");
    }
  };

  // Delete article
  const handleDeleteArticle = async (article: ArticleItem) => {
    if (!window.confirm(`Supprimer l'article « ${article.title} » ?`)) return;
    try {
      const res = await fetch(`/api/articles/${article.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression");
      setArticles((prev) => prev.filter((a) => a.slug !== article.slug));
      alert("Article supprimé.");
    } catch (err: any) {
      alert(err.message || "Erreur");
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

  // Update partnership request status
  const handlePartnerStatusChange = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/partnerships`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setPartnerships((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status } : p))
        );
      } else {
        await reloadData();
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
            <span>Formations &amp; Tarifs ({formations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("articles")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "articles"
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Blog &amp; Actualités ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("partenariats")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "partenariats"
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Handshake className="w-4 h-4" />
            <span>Demandes de Partenariat ({partnerships.length})</span>
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
            <span>Gestion des Rôles & Permissions</span>
          </button>

          <button
            onClick={() => setActiveTab("rappels")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "rappels"
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Suivi des Rappels</span>
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
                  {formations.map((f) => (
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

            {/* Online payment requests */}
            {(() => {
              const pending = paymentRequests.filter((r) => r.status === "en_attente");
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" />
                      Demandes de paiement en ligne
                      {pending.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[11px] font-bold">
                          {pending.length} en attente
                        </span>
                      )}
                    </h3>
                  </div>

                  {paymentRequests.length === 0 ? (
                    <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
                      Aucune demande de paiement en ligne pour le moment.
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                            <tr>
                              <th className="py-3 px-4">Référence</th>
                              <th className="py-3 px-4">Étudiant</th>
                              <th className="py-3 px-4">Montant</th>
                              <th className="py-3 px-4">Moyen</th>
                              <th className="py-3 px-4">N° Mobile Money</th>
                              <th className="py-3 px-4">Date</th>
                              <th className="py-3 px-4">Statut</th>
                              <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-150">
                            {paymentRequests.map((r) => (
                              <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                                <td className="py-3 px-4 font-mono font-bold text-blue-600">{r.reference}</td>
                                <td className="py-3 px-4 font-semibold text-slate-900">
                                  {r.studentFirstName} {r.studentLastName} ({r.studentNumber})
                                </td>
                                <td className="py-3 px-4 font-extrabold text-emerald-600">
                                  {r.amount.toLocaleString("fr-FR")} FCFA
                                </td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-[11px]">
                                    {r.method}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-mono text-slate-600">{r.phone}</td>
                                <td className="py-3 px-4 text-slate-400">{new Date(r.createdAt).toLocaleString("fr-FR")}</td>
                                <td className="py-3 px-4">
                                  {r.status === "en_attente" ? (
                                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold text-[11px]">
                                      En attente
                                    </span>
                                  ) : r.status === "valide" ? (
                                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[11px]">
                                      Validé
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[11px]">
                                      Rejeté
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  {r.status === "en_attente" ? (
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => handlePaymentRequestAction(r.id, "confirmer")}
                                        disabled={processingRequestId === r.id}
                                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        Confirmer
                                      </button>
                                      <button
                                        onClick={() => handlePaymentRequestAction(r.id, "rejeter")}
                                        disabled={processingRequestId === r.id}
                                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 disabled:opacity-50"
                                      >
                                        Rejeter
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[11px] text-slate-400">Traité</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

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
              {formations.map((f) => (
                <div
                  key={f.id}
                  className={`bg-white p-5 rounded-2xl border shadow-xs space-y-3 ${
                    f.isActive === null || f.isActive === undefined || f.isActive === true
                      ? "border-slate-200"
                      : "border-rose-200 bg-rose-50/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {f.category}
                    </span>
                    <span className="flex items-center gap-2">
                      {f.isPopular ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-100 text-violet-800">
                          Populaire
                        </span>
                      ) : null}
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          f.isActive === null || f.isActive === undefined || f.isActive === true
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {f.isActive === null || f.isActive === undefined || f.isActive === true ? "Actif" : "Inactif"}
                      </span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">{f.title}</h3>
                  <div className="text-xs text-slate-500">⏱️ {f.duration} — {f.mode || "Présentiel & Hybride"}</div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Frais totaux :</span>
                      <strong className="text-sm font-black text-slate-900">
                        {f.price.toLocaleString("fr-FR")} FCFA
                      </strong>
                      <span className="text-[10px] text-slate-400 block">
                        + {f.registrationFee.toLocaleString("fr-FR")} FCFA dossier
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/formation/${f.slug}`}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Voir page →
                      </Link>
                      <button
                        onClick={() => openFormationEditor(f)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Modifier
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB BLOG & ACTUALITÉS */}
        {activeTab === "articles" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Blog &amp; Actualités</h2>
                <p className="text-xs text-slate-500">
                  Rédigez, modifiez ou supprimez les articles publiés sur la page Actualités.
                </p>
              </div>
              <button
                onClick={() => openArticleEditor(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvel article</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Titre</th>
                      <th className="py-3 px-4">Catégorie</th>
                      <th className="py-3 px-4">Auteur</th>
                      <th className="py-3 px-4">Temps de lecture</th>
                      <th className="py-3 px-4">Publié le</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {articles.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          Aucun article publié pour le moment.
                        </td>
                      </tr>
                    )}
                    {articles.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/70 transition-colors align-top">
                        <td className="py-3 px-4 max-w-[320px]">
                          <strong className="text-slate-900 block truncate">{a.title}</strong>
                          <span className="text-[10px] text-slate-400 font-mono truncate block">
                            /actualites/{a.slug}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-violet-50 text-violet-700 font-bold text-[10px]">
                            {a.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{a.author}</td>
                        <td className="py-3 px-4 text-slate-500">{a.readTime}</td>
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">{a.publishedAt}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/actualites/${a.slug}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                            >
                              Voir
                            </Link>
                            <button
                              onClick={() => openArticleEditor(a)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(a)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Supprimer
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB PARTENARIATS */}
        {activeTab === "partenariats" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Demandes de Partenariat Entreprises</h2>
              <p className="text-xs text-slate-500">
                Propositions de partenariat reçues depuis l&apos;espace entreprises : stages, recrutement, coaching, certification.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Entreprise</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Type de partenariat</th>
                      <th className="py-3 px-4">Message</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {partnerships.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          Aucune demande de partenariat pour le moment.
                        </td>
                      </tr>
                    )}
                    {partnerships.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors align-top">
                        <td className="py-3 px-4">
                          <strong className="text-slate-900 block">{p.companyName}</strong>
                          <span className="text-[10px] text-slate-400">N° {p.id}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          <div className="font-semibold text-slate-900">{p.contactName}</div>
                          <div className="text-[11px]">{p.email}</div>
                          <div className="text-[11px]">{p.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-violet-50 text-violet-700 font-bold text-[10px]">
                            {p.partnershipType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 max-w-[260px]">
                          {p.message || <span className="text-slate-300">—</span>}
                        </td>
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                          {new Date(p.createdAt).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={p.status}
                            onChange={(e) => handlePartnerStatusChange(p.id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${
                              p.status === "nouveau"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : p.status === "contacte"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            <option value="nouveau">Nouveau</option>
                            <option value="contacte">Contactée</option>
                            <option value="cloture">Clôturée</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                  {formations.map((f) => (
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

      {/* MODAL: MODIFIER UNE FORMATION */}
      {editingFormation && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Modifier « {editingFormation.title} »</span>
              </h3>
              <button
                onClick={() => setEditingFormation(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveFormation} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Titre *</label>
                  <input
                    type="text"
                    required
                    value={formationForm.title}
                    onChange={(e) => setFormationForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Durée *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : 9 mois"
                    value={formationForm.duration}
                    onChange={(e) => setFormationForm((p) => ({ ...p, duration: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prix total (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formationForm.price}
                    onChange={(e) => setFormationForm((p) => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Frais dossier (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formationForm.registrationFee}
                    onChange={(e) =>
                      setFormationForm((p) => ({ ...p, registrationFee: Number(e.target.value) }))
                    }
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nb mensualités</label>
                  <input
                    type="number"
                    min={1}
                    value={formationForm.installmentsCount}
                    onChange={(e) =>
                      setFormationForm((p) => ({ ...p, installmentsCount: Number(e.target.value) }))
                    }
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mode</label>
                  <select
                    value={formationForm.mode}
                    onChange={(e) => setFormationForm((p) => ({ ...p, mode: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Présentiel & Hybride">Présentiel & Hybride</option>
                    <option value="En ligne">En ligne</option>
                    <option value="Présentiel">Présentiel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Campus</label>
                <input
                  type="text"
                  value={formationForm.campus}
                  onChange={(e) => setFormationForm((p) => ({ ...p, campus: e.target.value }))}
                  className="w-full p-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formationForm.isActive}
                    onChange={(e) => setFormationForm((p) => ({ ...p, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={formationForm.isPopular}
                    onChange={(e) => setFormationForm((p) => ({ ...p, isPopular: e.target.checked }))}
                    className="w-4 h-4 rounded border-slate-300"
                  />
                  Populaire
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={isSavingFormation}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  {isSavingFormation ? "Enregistrement…" : "Enregistrer les modifications"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingFormation(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CRÉER / MODIFIER UN ARTICLE */}
      {articleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>{editingArticle ? "Modifier l'article" : "Nouvel article de blog"}</span>
              </h3>
              <button
                onClick={() => setArticleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Titre *</label>
                  <input
                    type="text"
                    required
                    value={articleForm.title}
                    onChange={(e) => setArticleForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    placeholder="auto-généré depuis le titre si vide"
                    value={articleForm.slug}
                    onChange={(e) => setArticleForm((p) => ({ ...p, slug: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Catégorie *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : Événements"
                    value={articleForm.category}
                    onChange={(e) => setArticleForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Extrait court *</label>
                <textarea
                  required
                  rows={2}
                  value={articleForm.excerpt}
                  onChange={(e) => setArticleForm((p) => ({ ...p, excerpt: e.target.value }))}
                  className="w-full p-2 rounded-xl border border-slate-200 resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Contenu complet (HTML/markdown libre) *</label>
                <textarea
                  required
                  rows={6}
                  value={articleForm.content}
                  onChange={(e) => setArticleForm((p) => ({ ...p, content: e.target.value }))}
                  className="w-full p-2 rounded-xl border border-slate-200 resize-y font-mono text-[11px]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">URL image de couverture *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.pexels.com/..."
                  value={articleForm.coverImage}
                  onChange={(e) => setArticleForm((p) => ({ ...p, coverImage: e.target.value }))}
                  className="w-full p-2 rounded-xl border border-slate-200 font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Auteur</label>
                  <input
                    type="text"
                    value={articleForm.author}
                    onChange={(e) => setArticleForm((p) => ({ ...p, author: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Temps de lecture</label>
                  <input
                    type="text"
                    value={articleForm.readTime}
                    onChange={(e) => setArticleForm((p) => ({ ...p, readTime: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all"
                >
                  {editingArticle ? "Enregistrer les modifications" : "Publier l'article"}
                </button>
                <button
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
