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
  FolderGit2,
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
  profileVisible: boolean;
  validatedAt: Date | null;
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
  verificationCode: string | null;
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

interface StudentProjectItem {
  id: number;
  studentId: number | null;
  studentNumber: string | null;
  studentName: string | null;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  coverImage: string;
  formationTitle: string;
  technologies: string;
  teamMembers: string;
  projectUrl: string | null;
  githubUrl: string | null;
  isFeatured: boolean | null;
}

interface AdmissionItem {
  id: number;
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string | null;
  status: string;
  profileVisible: boolean;
  validationNote: string | null;
  validatedBy: string | null;
  formationTitle: string | null;
  verificationCode: string | null;
  createdAt: string;
}

export function AdminPortal({
  initialStats,
  initialStudents,
  initialPayments,
  formationsList,
  initialPartnerships,
  initialArticles,
  initialProjects,
}: {
  initialStats: AdminStats;
  initialStudents: StudentItem[];
  initialPayments: PaymentItem[];
  formationsList: FormationItem[];
  initialPartnerships: PartnershipItem[];
  initialArticles?: ArticleItem[];
  initialProjects: StudentProjectItem[];
}) {
  const [stats, setStats] = useState<AdminStats>(initialStats);
  const [students, setStudents] = useState<StudentItem[]>(initialStudents);
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [partnerships, setPartnerships] = useState<PartnershipItem[]>(initialPartnerships);
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequestItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles || []);
  const [projects, setProjects] = useState<StudentProjectItem[]>(initialProjects);
  const [formations, setFormations] = useState<FormationItem[]>(formationsList);
  const [admissions, setAdmissions] = useState<AdmissionItem[]>([]);

  const [currentRole, setCurrentRole] = useState<"super_admin" | "agent" | "financier">("super_admin");
  const [activeTab, setActiveTab] = useState<"dashboard" | "validations" | "etudiants" | "paiements" | "formations" | "articles" | "projects" | "roles" | "partenariats" | "rappels">("dashboard");

  const router = useRouter();

  // Load online payment requests on mount
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/api/payment-requests").then((r) => r.json()),
      fetch("/api/admin/admissions").then((r) => r.json()),
    ])
      .then(([reqData, admData]) => {
        if (!cancelled) {
          if (Array.isArray(reqData)) setPaymentRequests(reqData);
          if (Array.isArray(admData)) setAdmissions(admData);
        }
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
  const [manualPayMethod, setManualPayMethod] = useState<string>("Caisse / EspÃ¨ces");
  const [manualPayNotes, setManualPayNotes] = useState<string>("RÃ¨glement physique Ã  la caisse du campus de Cotonou");
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
    previousDiploma: "BaccalaurÃ©at",
  });
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);

  // Edit status modal
  const [selectedStudentForStatus, setSelectedStudentForStatus] = useState<StudentItem | null>(null);
  const [newStatusValue, setNewStatusValue] = useState("");

  // Admission (validation) modal
  const [validationTarget, setValidationTarget] = useState<AdmissionItem | null>(null);
  const [validationAction, setValidationAction] = useState<"validate" | "reject">("validate");
  const [validationNote, setValidationNote] = useState("");
  const [validationBusy, setValidationBusy] = useState(false);

  const pendingValidations = admissions.filter((a) => a.status === "preinscrit").length;

  const handleOpenValidation = (a: AdmissionItem, action: "validate" | "reject") => {
    setValidationTarget(a);
    setValidationAction(action);
    setValidationNote("");
    setValidationBusy(false);
  };

  const handleConfirmValidation = async () => {
    if (!validationTarget) return;
    setValidationBusy(true);
    try {
      const res = await fetch("/api/admin/admissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: validationTarget.id,
          action: validationAction,
          note: validationNote.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erreur lors de la validation");
      await reloadData();
      setValidationTarget(null);
      setValidationNote("");
    } catch (e: any) {
      console.error(e);
      window.alert(e.message || "Erreur lors de la validation");
    } finally {
      setValidationBusy(false);
    }
  };

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
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [projectForm, setProjectForm] = useState({
    studentId: "",
    title: "",
    tagline: "",
    description: "",
    coverImage: "",
    technologies: "",
    projectUrl: "",
    githubUrl: "",
  });
  const [isSavingProject, setIsSavingProject] = useState(false);
  const validatedStudents = students.filter(
    (student) =>
      student.profileVisible &&
      student.validatedAt &&
      ["inscrit", "actif", "termine", "alumni"].includes(student.status)
  );

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
      const [resStats, resStudents, resPayments, resPartnerships, resPaymentRequests, resAdmissions] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/students").then((r) => r.json()),
        fetch("/api/payments").then((r) => r.json()),
        fetch("/api/partnerships").then((r) => r.json()),
        fetch("/api/payment-requests").then((r) => r.json()),
        fetch("/api/admin/admissions").then((r) => r.json()),
      ]);
      setStats(resStats);
      setStudents(resStudents);
      setPayments(resPayments);
      setPartnerships(resPartnerships);
      setPaymentRequests(resPaymentRequests);
      if (Array.isArray(resAdmissions)) setAdmissions(resAdmissions);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle payment request: confirm / reject
  const [processingRequestId, setProcessingRequestId] = useState<number | null>(null);
  const handlePaymentRequestAction = async (id: number, action: "confirmer" | "rejeter") => {
    if (!window.confirm(action === "confirmer" ? "Confirmer ce paiement et gÃ©nÃ©rer le reÃ§u officiel ?" : "Rejeter cette demande de paiement ?")) return;
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
      window.alert("Erreur rÃ©seau lors du traitement");
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
      if (!res.ok) throw new Error(data.error || "Erreur mise Ã  jour");
      setFormations((prev) =>
        prev.map((f) => (f.slug === editingFormation.slug ? { ...f, ...data.formation } : f))
      );
      setEditingFormation(null);
      alert("Formation mise Ã  jour avec succÃ¨s !");
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
            author: "Ã‰quipe PÃ©dagogique FuturCraft",
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
      alert(editingArticle ? "Article mis Ã  jour !" : "Article crÃ©Ã© !");
    } catch (err: any) {
      alert(err.message || "Erreur");
    }
  };

  // Delete article
  const handleDeleteArticle = async (article: ArticleItem) => {
    if (!window.confirm(`Supprimer l'article Â« ${article.title} Â» ?`)) return;
    try {
      const res = await fetch(`/api/articles/${article.slug}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression");
      setArticles((prev) => prev.filter((a) => a.slug !== article.slug));
      alert("Article supprimÃ©.");
    } catch (err: any) {
      alert(err.message || "Erreur");
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProject(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectForm),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erreur lors de lâ€™enregistrement du projet");
      setProjects((current) => [data.project, ...current]);
      setProjectModalOpen(false);
      setProjectForm({
        studentId: "",
        title: "",
        tagline: "",
        description: "",
        coverImage: "",
        technologies: "",
        projectUrl: "",
        githubUrl: "",
      });
      alert("Projet ajoutÃ©. Il est visible sur le site car lâ€™Ã©tudiant est validÃ©.");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur lors de lâ€™enregistrement");
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleDeleteProject = async (project: StudentProjectItem) => {
    if (!window.confirm(`Supprimer le projet Â« ${project.title} Â» ?`)) return;
    try {
      const res = await fetch(`/api/admin/projects/${project.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Erreur lors de la suppression");
      setProjects((current) => current.filter((item) => item.id !== project.id));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur lors de la suppression");
    }
  };

  // Submit manual payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecordingPayment(true);

    try {
      const recordedByStaff =
        currentRole === "financier"
          ? "Sarah Menou (CaissiÃ¨re Centrale)"
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
      alert("Paiement enregistrÃ© et reÃ§u gÃ©nÃ©rÃ© avec succÃ¨s !");
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

      if (!res.ok) throw new Error("Erreur crÃ©ation Ã©tudiant");
      await reloadData();
      setShowNewStudentModal(false);
      alert("Nouvel Ã©tudiant crÃ©Ã© et matricule gÃ©nÃ©rÃ© avec succÃ¨s !");
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
    <div className="admin-portal min-h-screen bg-[var(--color-fc-bg)] py-8">
      <div className="page-container space-y-6">
        {/* Top bar with Role Switcher */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-[var(--color-fc-deep)] p-4 text-white shadow-lg sm:p-5 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-fc-primary)] text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                Console d&apos;Administration FuturCraft
                <span className="rounded border border-white/20 bg-white/10 px-2 py-0.5 text-xs font-normal text-[var(--color-fc-cyan)]">
                  v1.2
                </span>
              </h1>
              <p className="text-xs text-[var(--color-fc-gray-mid)]">
                Supervision des inscriptions, encaissements, cursus et dÃ©livrance des reÃ§us
              </p>
            </div>
          </div>

          {/* Role selector dropdown */}
          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-xl border border-white/15 text-xs">
            <span className="text-[var(--color-fc-gray-mid)] font-semibold px-2">RÃ´le actif :</span>
            <button
              onClick={() => setCurrentRole("super_admin")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                currentRole === "super_admin"
                  ? "bg-[var(--color-fc-primary)] text-white "
                  : "text-white/60 hover:text-white"
              }`}
            >
              Super Admin
            </button>
            <button
              onClick={() => setCurrentRole("financier")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                currentRole === "financier"
                  ? "bg-emerald-600 text-white "
                  : "text-white/60 hover:text-white"
              }`}
            >
              Caissier / Financier
            </button>
            <button
              onClick={() => setCurrentRole("agent")}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                currentRole === "agent"
                  ? "bg-[var(--color-fc-deep)] text-white "
                  : "text-white/60 hover:text-white"
              }`}
            >
              Agent Administratif
            </button>
          </div>

          <button
            onClick={handleLogout}
            title="Se dÃ©connecter"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-300 hover:text-white hover:bg-red-600/20 border border-white/15 hover:border-red-500/40 transition-all"
          >
            <LogOut className="w-4 h-4" />
            DÃ©connexion
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto rounded-2xl border border-[var(--color-fc-gray-light)] bg-white px-2 pb-1 text-xs font-bold shadow-sm scrollbar-none">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "dashboard"
                ? "border-[var(--color-fc-primary)] text-[var(--color-fc-primary)]"
                : "border-transparent text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)]"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Tableau de Bord &amp; Recouvrement</span>
          </button>

          <button
            onClick={() => setActiveTab("validations")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "validations"
                ? "border-[var(--color-fc-primary)] text-[var(--color-fc-primary)]"
                : "border-transparent text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)]"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Validations</span>
            {pendingValidations > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[var(--color-fc-surface)]0 text-white text-[10px] font-black">
                {pendingValidations}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("etudiants")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "etudiants"
                ? "border-[var(--color-fc-primary)] text-[var(--color-fc-primary)]"
                : "border-transparent text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)]"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gestion des Ã‰tudiants ({students.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("paiements")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "paiements"
                ? "border-[var(--color-fc-primary)] text-[var(--color-fc-primary)]"
                : "border-transparent text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)]"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Administration des Paiements ({payments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("formations")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "formations"
                ? "border-[var(--color-fc-primary)] text-[var(--color-fc-primary)]"
                : "border-transparent text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)]"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Formations &amp; Tarifs ({formations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("articles")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "articles"
                ? "border-[var(--color-fc-primary)] text-[var(--color-fc-primary)]"
                : "border-transparent text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)]"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Blog &amp; ActualitÃ©s ({articles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "projects"
                ? "border-[var(--color-fc-primary)] text-[var(--color-fc-primary)]"
                : "border-transparent text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)]"
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Projets Ã©tudiants ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("partenariats")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "partenariats"
                ? "border-[var(--color-fc-primary)] text-[var(--color-fc-primary)]"
                : "border-transparent text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)]"
            }`}
          >
            <Handshake className="w-4 h-4" />
            <span>Demandes de Partenariat ({partnerships.length})</span>
          </button>

<button
            onClick={() => setActiveTab("roles")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "roles"
                ? "border-[var(--color-fc-primary)] text-[var(--color-fc-primary)]"
                : "border-transparent text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)]"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Gestion des RÃ´les & Permissions</span>
          </button>

          <button
            onClick={() => setActiveTab("rappels")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "rappels"
                ? "border-[var(--color-fc-primary)] text-[var(--color-fc-primary)]"
                : "border-transparent text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)]"
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
              <div className="bg-white p-6 rounded-2xl border border-[var(--color-fc-gray-light)]  space-y-1">
                <span className="text-xs font-bold text-[var(--color-fc-gray-mid)] uppercase tracking-wider block">
                  Dossiers en attente
                </span>
                <div className="text-3xl font-black text-[var(--color-fc-primary)]">{pendingValidations}</div>
                <div className="flex items-center gap-2 text-xs pt-1">
                  <button
                    onClick={() => setActiveTab("validations")}
                    className="text-[var(--color-fc-primary)] font-bold hover:underline"
                  >
                    Valider les comptes â†’
                  </button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[var(--color-fc-gray-light)]  space-y-1">
                <span className="text-xs font-bold text-[var(--color-fc-gray-mid)] uppercase tracking-wider block">
                  Total Ã‰tudiants
                </span>
                <div className="text-3xl font-black text-[var(--color-fc-black)]">{stats.totalStudents}</div>
                <div className="flex items-center gap-2 text-xs pt-1">
                  <span className="text-emerald-600 font-bold">{stats.activeStudents} actifs</span>
                  <span className="text-white/60">â€¢</span>
                  <span className="text-[var(--color-fc-primary)] font-semibold">{stats.newInscriptions} prÃ©inscrits</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[var(--color-fc-gray-light)]  space-y-1">
                <span className="text-xs font-bold text-[var(--color-fc-gray-mid)] uppercase tracking-wider block">
                  Montant EncaissÃ© (FCFA)
                </span>
                <div className="text-3xl font-black text-emerald-600">
                  {stats.totalCollectedAmount.toLocaleString("fr-FR")}
                </div>
                <span className="text-xs text-[var(--color-fc-gray-mid)] block pt-1">
                  Taux de recouvrement : <strong>{stats.recoveryRate}%</strong>
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[var(--color-fc-gray-light)]  space-y-1">
                <span className="text-xs font-bold text-[var(--color-fc-gray-mid)] uppercase tracking-wider block">
                  Reste Ã  Percevoir
                </span>
                <div className="text-3xl font-black text-rose-600">
                  {stats.totalRemainingAmount.toLocaleString("fr-FR")}
                </div>
                <span className="text-xs text-[var(--color-fc-gray-mid)] block pt-1">
                  Sur <strong>{stats.totalExpectedAmount.toLocaleString("fr-FR")} FCFA</strong> prÃ©vus
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[var(--color-fc-gray-light)]  space-y-1">
                <span className="text-xs font-bold text-[var(--color-fc-gray-mid)] uppercase tracking-wider block">
                  Cursus Ouverts
                </span>
                <div className="text-3xl font-black text-[var(--color-fc-primary)]">{stats.formationsCount}</div>
                <span className="text-xs text-[var(--color-fc-gray-mid)] block pt-1">
                  Tous campus (Godomey, SupermarchÃ© O BÃ©nin Avant pk14)
                </span>
              </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Payments Table */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-[var(--color-fc-gray-light)] p-6  space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[var(--color-fc-black)]">Derniers Encaissements EnregistrÃ©s</h3>
                  <button
                    onClick={() => setActiveTab("paiements")}
                    className="text-xs font-bold text-[var(--color-fc-primary)] hover:underline"
                  >
                    Voir tous les encaissements â†’
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-[var(--color-fc-gray-light)] text-[var(--color-fc-gray-mid)] text-[11px] font-bold">
                      <tr>
                        <th className="py-2">ReÃ§u NÂ°</th>
                        <th className="py-2">Ã‰tudiant</th>
                        <th className="py-2">FiliÃ¨re</th>
                        <th className="py-2">Montant</th>
                        <th className="py-2">Mode</th>
                        <th className="py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-fc-gray-light)]">
                      {payments.slice(0, 5).map((p) => (
                        <tr key={p.id} className="hover:bg-[var(--color-fc-bg)]">
                          <td className="py-2.5 font-mono font-bold text-[var(--color-fc-primary)]">
                            <Link href={`/recu/${p.receiptNumber}?code=${encodeURIComponent(p.verificationCode || "")}`} target="_blank" className="hover:underline">
                              {p.receiptNumber}
                            </Link>
                          </td>
                          <td className="py-2.5 font-semibold text-[var(--color-fc-black)]">
                            {p.studentFirstName} {p.studentLastName}
                          </td>
                          <td className="py-2.5 text-[var(--color-fc-gray-mid)] truncate max-w-[150px]">
                            {p.formationTitle || "Formation"}
                          </td>
                          <td className="py-2.5 font-bold text-emerald-600">
                            {p.amount.toLocaleString("fr-FR")} FCFA
                          </td>
                          <td className="py-2.5 text-[var(--color-fc-gray-mid)]">{p.paymentMethod}</td>
                          <td className="py-2.5 text-[var(--color-fc-gray-mid)]">{p.paidAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action shortcuts */}
              <div className="lg:col-span-4 bg-white rounded-2xl border border-[var(--color-fc-gray-light)] p-6  space-y-4">
                <h3 className="text-base font-bold text-[var(--color-fc-black)]">OpÃ©rations Rapides</h3>
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
                    className="w-full p-3 rounded-xl bg-[var(--color-fc-surface)] hover:bg-blue-100 border border-[var(--color-fc-primary)]/20 text-blue-800 text-xs font-bold flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[var(--color-fc-primary)]" />
                      Inscrire un Ã©tudiant au guichet
                    </span>
                    <Plus className="w-4 h-4" />
                  </button>

                  <Link
                    href="/recu"
                    className="w-full p-3 rounded-xl bg-[var(--color-fc-bg)] hover:bg-[var(--color-fc-bg)] border border-[var(--color-fc-gray-light)] text-[var(--color-fc-black)] text-xs font-bold flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[var(--color-fc-gray-mid)]" />
                      VÃ©rifier l&apos;authenticitÃ© d&apos;un reÃ§u
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[var(--color-fc-gray-mid)]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 31. TAB VALIDATIONS D'ADMISSION */}
        {activeTab === "validations" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-fc-black)]">Validation des Comptes Ã‰tudiants</h2>
                <p className="text-xs text-[var(--color-fc-gray-mid)]">
                  Chaque nouvel Ã©tudiant doit Ãªtre validÃ© avant de pouvoir se connecter et apparaÃ®tre sur la page Entreprises.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  pendingValidations > 0 ? "bg-[var(--color-fc-surface)] text-[var(--color-fc-black)]" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {pendingValidations > 0 ? `${pendingValidations} dossiers en attente` : "Aucun dossier en attente"}
                </span>
              </div>
            </div>

            {/* Pending validations */}
            {pendingValidations > 0 && (
              <div className="bg-white rounded-2xl border border-[var(--color-fc-primary)]/20 overflow-hidden ">
                <div className="bg-[var(--color-fc-surface)] px-5 py-3 border-b border-[var(--color-fc-primary)]/20 flex items-center justify-between">
                  <span className="text-sm font-bold text-[var(--color-fc-black)] flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Dossiers en attente de validation
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--color-fc-bg)] border-b border-[var(--color-fc-gray-light)] text-[var(--color-fc-gray-mid)] font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Matricule</th>
                        <th className="py-3 px-4">Ã‰tudiant</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Formation</th>
                        <th className="py-3 px-4">Date d&apos;inscription</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-fc-gray-light)]">
                      {admissions.filter((a) => a.status === "preinscrit").map((a) => (
                        <tr key={a.id} className="hover:bg-[var(--color-fc-surface)] transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-[var(--color-fc-primary)]">{a.studentNumber}</td>
                          <td className="py-3 px-4">
                            <strong className="text-[var(--color-fc-black)] block">{a.firstName} {a.lastName}</strong>
                            <span className="text-[10px] text-[var(--color-fc-gray-mid)]">{a.city || "Cotonou"}</span>
                          </td>
                          <td className="py-3 px-4 text-[var(--color-fc-gray-mid)]">
                            <div>{a.phone}</div>
                            <div className="text-[10px] text-[var(--color-fc-gray-mid)]">{a.email}</div>
                          </td>
                          <td className="py-3 px-4 text-[var(--color-fc-gray-mid)]">{a.formationTitle || "â€”"}</td>
                          <td className="py-3 px-4 text-[var(--color-fc-gray-mid)] text-[10px]">
                            {a.createdAt ? new Date(a.createdAt).toLocaleDateString("fr-FR") : "â€”"}
                          </td>
                          <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenValidation(a, "validate")}
                              className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                            >
                              Valider
                            </button>
                            <button
                              onClick={() => handleOpenValidation(a, "reject")}
                              className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                            >
                              Rejeter
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Recent reviews (validated / rejected) */}
            <div className="bg-white rounded-2xl border border-[var(--color-fc-gray-light)] overflow-hidden ">
              <div className="px-5 py-3 border-b border-[var(--color-fc-gray-light)] flex items-center justify-between">
                <span className="text-sm font-bold text-[var(--color-fc-black)] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Dossiers traitÃ©s rÃ©cemment
                </span>
              </div>
              {admissions.filter((a) => a.status !== "preinscrit").length === 0 ? (
                <div className="p-8 text-center text-sm text-[var(--color-fc-gray-mid)]">
                  Aucun dossier traitÃ© pour le moment.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--color-fc-bg)] border-b border-[var(--color-fc-gray-light)] text-[var(--color-fc-gray-mid)] font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Matricule</th>
                        <th className="py-3 px-4">Ã‰tudiant</th>
                        <th className="py-3 px-4">Formation</th>
                        <th className="py-3 px-4">Statut</th>
                        <th className="py-3 px-4">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-fc-gray-light)]">
                      {admissions
                        .filter((a) => a.status !== "preinscrit")
                        .slice(0, 20)
                        .map((a) => (
                          <tr key={a.id} className="hover:bg-[var(--color-fc-bg)]/70 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-[var(--color-fc-primary)]">{a.studentNumber}</td>
                            <td className="py-3 px-4">
                              <strong className="text-[var(--color-fc-black)] block">{a.firstName} {a.lastName}</strong>
                              <span className="text-[10px] text-[var(--color-fc-gray-mid)]">{a.email}</span>
                            </td>
                            <td className="py-3 px-4 text-[var(--color-fc-gray-mid)]">{a.formationTitle || "â€”"}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  a.status === "inscrit" || a.status === "actif" || a.status === "termine"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : a.status === "rejete"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-[var(--color-fc-bg)] text-[var(--color-fc-gray-mid)]"
                                }`}
                              >
                                {a.status === "inscrit" && "ValidÃ© (inscrit)"}
                                {a.status === "actif" && "Actif"}
                                {a.status === "termine" && "Formation terminÃ©e"}
                                {a.status === "rejete" && "RejetÃ©"}
                                {!["inscrit", "actif", "termine", "rejete"].includes(a.status) && a.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-[var(--color-fc-gray-mid)] italic max-w-[220px]">
                              {a.validationNote || "â€”"}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 26 & 30. TAB GESTION DES Ã‰TUDIANTS */}
        {activeTab === "etudiants" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header + Add Student button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-fc-black)]">RÃ©pertoire des Candidats &amp; Ã‰tudiants</h2>
                <p className="text-xs text-[var(--color-fc-gray-mid)]">
                  Recherchez par nom, matricule, tÃ©lÃ©phone et gÃ©rez les statuts d&apos;admission.
                </p>
              </div>

              <button
                onClick={() => setShowNewStudentModal(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-fc-deep)] hover:bg-[var(--color-fc-primary)]  flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Inscrire un nouvel Ã©tudiant</span>
              </button>
            </div>

            {/* 30. RECHERCHE & FILTRES RAPIDES */}
            <div className="bg-white p-4 rounded-2xl border border-[var(--color-fc-gray-light)]  grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
              <div className="sm:col-span-6 relative">
                <Search className="w-4 h-4 text-[var(--color-fc-gray-mid)] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, matricule FC-..., email, tÃ©lÃ©phone..."
                  value={searchStudent}
                  onChange={(e) => setSearchStudent(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)]/50 text-xs"
                />
              </div>

              <div className="sm:col-span-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)] bg-white text-xs text-[var(--color-fc-black)]"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="preinscrit">En attente de validation</option>
                  <option value="rejete">RejetÃ©s</option>
                  <option value="inscrit">Inscrits (validÃ©s)</option>
                  <option value="actif">Ã‰tudiants actifs</option>
                  <option value="termine">Formation terminÃ©e</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <select
                  value={formationFilter}
                  onChange={(e) => setFormationFilter(e.target.value)}
                  className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)] bg-white text-xs text-[var(--color-fc-black)]"
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
            <div className="bg-white rounded-2xl border border-[var(--color-fc-gray-light)] overflow-hidden ">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--color-fc-bg)] border-b border-[var(--color-fc-gray-light)] text-[var(--color-fc-gray-mid)] font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Matricule</th>
                      <th className="py-3 px-4">Ã‰tudiant</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4">PayÃ© / Total</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-fc-gray-light)]">
                    {filteredStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-[var(--color-fc-bg)]/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[var(--color-fc-primary)]">
                          {st.studentNumber}
                        </td>
                        <td className="py-3 px-4">
                          <strong className="text-[var(--color-fc-black)] block">
                            {st.firstName} {st.lastName}
                          </strong>
                          <span className="text-[10px] text-[var(--color-fc-gray-mid)]">{st.city || "Cotonou"}</span>
                        </td>
                        <td className="py-3 px-4 text-[var(--color-fc-gray-mid)]">
                          <div>{st.phone}</div>
                          <div className="text-[10px] text-[var(--color-fc-gray-mid)]">{st.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              st.status === "actif"
                                ? "bg-emerald-100 text-emerald-800"
                                : st.status === "inscrit" || st.status === "termine" || st.status === "alumni"
                                ? "bg-emerald-100 text-emerald-700"
                                : st.status === "preinscrit"
                                ? "bg-[var(--color-fc-surface)] text-[var(--color-fc-black)]"
                                : st.status === "rejete"
                                ? "bg-rose-100 text-rose-700"
                                : "bg-[var(--color-fc-bg)] text-[var(--color-fc-gray-mid)]"
                            }`}
                          >
                            {st.status === "preinscrit" && "En attente de validation"}
                            {!["preinscrit"].includes(st.status) && st.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-[var(--color-fc-black)]">
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
                            className="text-xs font-bold text-[var(--color-fc-primary)] hover:underline"
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
                <h2 className="text-xl font-bold text-[var(--color-fc-black)]">Registre Comptable &amp; Encaissements</h2>
                <p className="text-xs text-[var(--color-fc-gray-mid)]">
                  Enregistrez les versements en espÃ¨ces Ã  la caisse ou validez les paiements Mobile Money.
                </p>
              </div>

              <button
                onClick={() => setShowManualPaymentModal(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700  flex items-center gap-2 self-start sm:self-auto"
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
                    <h3 className="text-sm font-bold text-[var(--color-fc-black)] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[var(--color-fc-primary)]" />
                      Demandes de paiement en ligne
                      {pending.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-[var(--color-fc-surface)] text-[var(--color-fc-primary)] text-[11px] font-bold">
                          {pending.length} en attente
                        </span>
                      )}
                    </h3>
                  </div>

                  {paymentRequests.length === 0 ? (
                    <div className="p-6 bg-white rounded-2xl border border-[var(--color-fc-gray-light)] text-center text-xs text-[var(--color-fc-gray-mid)]">
                      Aucune demande de paiement en ligne pour le moment.
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-[var(--color-fc-gray-light)] overflow-hidden ">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[var(--color-fc-bg)] border-b border-[var(--color-fc-gray-light)] text-[var(--color-fc-gray-mid)] font-bold uppercase tracking-wider text-[11px]">
                            <tr>
                              <th className="py-3 px-4">RÃ©fÃ©rence</th>
                              <th className="py-3 px-4">Ã‰tudiant</th>
                              <th className="py-3 px-4">Montant</th>
                              <th className="py-3 px-4">Moyen</th>
                              <th className="py-3 px-4">NÂ° Mobile Money</th>
                              <th className="py-3 px-4">Date</th>
                              <th className="py-3 px-4">Statut</th>
                              <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--color-fc-gray-light)]">
                            {paymentRequests.map((r) => (
                              <tr key={r.id} className="hover:bg-[var(--color-fc-bg)]/70 transition-colors">
                                <td className="py-3 px-4 font-mono font-bold text-[var(--color-fc-primary)]">{r.reference}</td>
                                <td className="py-3 px-4 font-semibold text-[var(--color-fc-black)]">
                                  {r.studentFirstName} {r.studentLastName} ({r.studentNumber})
                                </td>
                                <td className="py-3 px-4 font-extrabold text-emerald-600">
                                  {r.amount.toLocaleString("fr-FR")} FCFA
                                </td>
                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded bg-[var(--color-fc-bg)] text-[var(--color-fc-black)] font-medium text-[11px]">
                                    {r.method}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-mono text-[var(--color-fc-gray-mid)]">{r.phone}</td>
                                <td className="py-3 px-4 text-[var(--color-fc-gray-mid)]">{new Date(r.createdAt).toLocaleString("fr-FR")}</td>
                                <td className="py-3 px-4">
                                  {r.status === "en_attente" ? (
                                    <span className="px-2 py-0.5 rounded bg-[var(--color-fc-surface)] text-[var(--color-fc-primary)] font-bold text-[11px]">
                                      En attente
                                    </span>
                                  ) : r.status === "valide" ? (
                                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold text-[11px]">
                                      ValidÃ©
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[11px]">
                                      RejetÃ©
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
                                    <span className="text-[11px] text-[var(--color-fc-gray-mid)]">TraitÃ©</span>
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
            <div className="bg-white rounded-2xl border border-[var(--color-fc-gray-light)] overflow-hidden ">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--color-fc-bg)] border-b border-[var(--color-fc-gray-light)] text-[var(--color-fc-gray-mid)] font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">NÂ° ReÃ§u</th>
                      <th className="py-3 px-4">Ã‰tudiant</th>
                      <th className="py-3 px-4">Formation</th>
                      <th className="py-3 px-4">Montant</th>
                      <th className="py-3 px-4">Moyen de paiement</th>
                      <th className="py-3 px-4">EnregistrÃ© par</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-fc-gray-light)]">
                    {payments.map((p) => (
                      <tr key={p.id} className="hover:bg-[var(--color-fc-bg)]/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[var(--color-fc-primary)]">
                          {p.receiptNumber}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[var(--color-fc-black)]">
                          {p.studentFirstName} {p.studentLastName} ({p.studentNumber})
                        </td>
                        <td className="py-3 px-4 text-[var(--color-fc-gray-mid)]">{p.formationTitle}</td>
                        <td className="py-3 px-4 font-extrabold text-emerald-600 text-sm">
                          {p.amount.toLocaleString("fr-FR")} FCFA
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-[var(--color-fc-bg)] text-[var(--color-fc-black)] font-medium text-[11px]">
                            {p.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[var(--color-fc-gray-mid)] text-[11px]">{p.recordedBy}</td>
                        <td className="py-3 px-4 text-[var(--color-fc-gray-mid)]">{p.paidAt}</td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/recu/${p.receiptNumber}?code=${encodeURIComponent(p.verificationCode || "")}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-fc-primary)] hover:underline"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Voir reÃ§u</span>
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
              <h2 className="text-xl font-bold text-[var(--color-fc-black)]">Gestion des Formations &amp; Tarifs</h2>
              <p className="text-xs text-[var(--color-fc-gray-mid)]">
                Consultez les 12 cursus officiels, leurs prix en FCFA et les frais d&apos;inscription.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {formations.map((f) => (
                <div
                  key={f.id}
                  className={`bg-white p-5 rounded-2xl border  space-y-3 ${
                    f.isActive === null || f.isActive === undefined || f.isActive === true
                      ? "border-[var(--color-fc-gray-light)]"
                      : "border-rose-200 bg-rose-50/40"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="text-[10px] uppercase font-bold text-[var(--color-fc-primary)] bg-[var(--color-fc-surface)] px-2 py-0.5 rounded">
                      {f.category}
                    </span>
                    <span className="flex items-center gap-2">
                      {f.isPopular ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--color-fc-surface)] text-[var(--color-fc-primary)]">
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

                  <h3 className="text-base font-bold text-[var(--color-fc-black)] leading-snug">{f.title}</h3>
                  <div className="text-xs text-[var(--color-fc-gray-mid)]">â±ï¸ {f.duration} â€” {f.mode || "PrÃ©sentiel & Hybride"}</div>

                  <div className="pt-2 border-t border-[var(--color-fc-gray-light)] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[var(--color-fc-gray-mid)] block">Frais totaux :</span>
                      <strong className="text-sm font-black text-[var(--color-fc-black)]">
                        {f.price.toLocaleString("fr-FR")} FCFA
                      </strong>
                      <span className="text-[10px] text-[var(--color-fc-gray-mid)] block">
                        + {f.registrationFee.toLocaleString("fr-FR")} FCFA dossier
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/formation/${f.slug}`}
                        className="text-xs font-bold text-[var(--color-fc-primary)] hover:underline"
                      >
                        Voir page â†’
                      </Link>
                      <button
                        onClick={() => openFormationEditor(f)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-fc-black)] bg-[var(--color-fc-bg)] hover:bg-[var(--color-fc-gray-light)] px-2 py-1 rounded-lg transition-colors"
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

        {/* TAB BLOG & ACTUALITÃ‰S */}
        {activeTab === "articles" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-fc-black)]">Blog &amp; ActualitÃ©s</h2>
                <p className="text-xs text-[var(--color-fc-gray-mid)]">
                  RÃ©digez, modifiez ou supprimez les articles publiÃ©s sur la page ActualitÃ©s.
                </p>
              </div>
              <button
                onClick={() => openArticleEditor(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-fc-deep)] hover:bg-[var(--color-fc-primary)]  flex items-center gap-2 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Nouvel article</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-[var(--color-fc-gray-light)] overflow-hidden ">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--color-fc-bg)] border-b border-[var(--color-fc-gray-light)] text-[var(--color-fc-gray-mid)] font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Titre</th>
                      <th className="py-3 px-4">CatÃ©gorie</th>
                      <th className="py-3 px-4">Auteur</th>
                      <th className="py-3 px-4">Temps de lecture</th>
                      <th className="py-3 px-4">PubliÃ© le</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-fc-gray-light)]">
                    {articles.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[var(--color-fc-gray-mid)]">
                          Aucun article publiÃ© pour le moment.
                        </td>
                      </tr>
                    )}
                    {articles.map((a) => (
                      <tr key={a.id} className="hover:bg-[var(--color-fc-bg)]/70 transition-colors align-top">
                        <td className="py-3 px-4 max-w-[320px]">
                          <strong className="text-[var(--color-fc-black)] block truncate">{a.title}</strong>
                          <span className="text-[10px] text-[var(--color-fc-gray-mid)] font-mono truncate block">
                            /actualites/{a.slug}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-[var(--color-fc-surface)] text-[var(--color-fc-primary)] font-bold text-[10px]">
                            {a.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[var(--color-fc-gray-mid)]">{a.author}</td>
                        <td className="py-3 px-4 text-[var(--color-fc-gray-mid)]">{a.readTime}</td>
                        <td className="py-3 px-4 text-[var(--color-fc-gray-mid)] whitespace-nowrap">{a.publishedAt}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/actualites/${a.slug}`}
                              target="_blank"
                              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-fc-primary)] hover:underline"
                            >
                              Voir
                            </Link>
                            <button
                              onClick={() => openArticleEditor(a)}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[var(--color-fc-black)] bg-[var(--color-fc-bg)] hover:bg-[var(--color-fc-gray-light)] px-2 py-1 rounded-lg transition-colors"
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

        {/* TAB PROJETS Ã‰TUDIANTS */}
        {activeTab === "projects" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-[var(--color-fc-black)]">Projets des Ã©tudiants validÃ©s</h2>
                <p className="text-xs text-[var(--color-fc-gray-mid)]">
                  Seuls les Ã©tudiants confirmÃ©s par lâ€™administration peuvent Ãªtre associÃ©s Ã  un projet publiÃ©.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setProjectForm((current) => ({
                    ...current,
                    studentId: String(validatedStudents[0]?.id || ""),
                  }));
                  setProjectModalOpen(true);
                }}
                disabled={validatedStudents.length === 0}
                className="flex items-center gap-2 self-start rounded-xl bg-[var(--color-fc-deep)] px-5 py-2.5 text-xs font-bold text-white  hover:bg-[var(--color-fc-primary)] disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Nouveau projet</span>
              </button>
            </div>

            {validatedStudents.length === 0 && (
              <p className="rounded-xl border border-[var(--color-fc-primary)]/20 bg-[var(--color-fc-surface)] p-4 text-xs text-[var(--color-fc-black)]">
                Validez dâ€™abord un dossier Ã©tudiant pour pouvoir lui associer un projet.
              </p>
            )}

            <div className="overflow-hidden rounded-2xl border border-[var(--color-fc-gray-light)] bg-white ">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] text-[11px] font-bold uppercase tracking-wider text-[var(--color-fc-gray-mid)]">
                    <tr>
                      <th className="px-4 py-3">Projet</th>
                      <th className="px-4 py-3">Ã‰tudiant</th>
                      <th className="px-4 py-3">Formation</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-fc-gray-light)]">
                    {projects.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-[var(--color-fc-gray-mid)]">
                          Aucun projet publiÃ© pour le moment.
                        </td>
                      </tr>
                    )}
                    {projects.map((project) => (
                      <tr key={project.id} className="align-top hover:bg-[var(--color-fc-bg)]/70">
                        <td className="max-w-[320px] px-4 py-3">
                          <strong className="block truncate text-[var(--color-fc-black)]">{project.title}</strong>
                          <span className="block truncate text-[10px] text-[var(--color-fc-gray-mid)]">{project.tagline}</span>
                        </td>
                        <td className="px-4 py-3 text-[var(--color-fc-black)]">
                          {project.studentName || "Ã‰tudiant supprimÃ©"}
                          {project.studentNumber && (
                            <span className="mt-1 block font-mono text-[10px] text-[var(--color-fc-gray-mid)]">
                              {project.studentNumber}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[var(--color-fc-gray-mid)]">{project.formationTitle}</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(project)}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Supprimer
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

        {/* TAB PARTENARIATS */}
        {activeTab === "partenariats" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-[var(--color-fc-black)]">Demandes de Partenariat Entreprises</h2>
              <p className="text-xs text-[var(--color-fc-gray-mid)]">
                Propositions de partenariat reÃ§ues depuis l&apos;espace entreprises : stages, recrutement, coaching, certification.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[var(--color-fc-gray-light)] overflow-hidden ">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--color-fc-bg)] border-b border-[var(--color-fc-gray-light)] text-[var(--color-fc-gray-mid)] font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Entreprise</th>
                      <th className="py-3 px-4">Contact</th>
                      <th className="py-3 px-4">Type de partenariat</th>
                      <th className="py-3 px-4">Message</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-fc-gray-light)]">
                    {partnerships.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[var(--color-fc-gray-mid)]">
                          Aucune demande de partenariat pour le moment.
                        </td>
                      </tr>
                    )}
                    {partnerships.map((p) => (
                      <tr key={p.id} className="hover:bg-[var(--color-fc-bg)]/70 transition-colors align-top">
                        <td className="py-3 px-4">
                          <strong className="text-[var(--color-fc-black)] block">{p.companyName}</strong>
                          <span className="text-[10px] text-[var(--color-fc-gray-mid)]">NÂ° {p.id}</span>
                        </td>
                        <td className="py-3 px-4 text-[var(--color-fc-gray-mid)]">
                          <div className="font-semibold text-[var(--color-fc-black)]">{p.contactName}</div>
                          <div className="text-[11px]">{p.email}</div>
                          <div className="text-[11px]">{p.phone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-[var(--color-fc-surface)] text-[var(--color-fc-primary)] font-bold text-[10px]">
                            {p.partnershipType}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[var(--color-fc-gray-mid)] max-w-[260px]">
                          {p.message || <span className="text-white/60">â€”</span>}
                        </td>
                        <td className="py-3 px-4 text-[var(--color-fc-gray-mid)] whitespace-nowrap">
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
                                ? "bg-[var(--color-fc-surface)] text-[var(--color-fc-primary)] border-[var(--color-fc-primary)]/20"
                                : p.status === "contacte"
                                ? "bg-[var(--color-fc-surface)] text-blue-700 border-[var(--color-fc-primary)]/20"
                                : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          >
                            <option value="nouveau">Nouveau</option>
                            <option value="contacte">ContactÃ©e</option>
                            <option value="cloture">ClÃ´turÃ©e</option>
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

        {/* 28. TAB ROLES ET ACCÃˆS */}
        {activeTab === "roles" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-2xl border border-[var(--color-fc-gray-light)]  space-y-4">
              <h2 className="text-xl font-bold text-[var(--color-fc-black)]">Matrice des RÃ´les et Autorisations</h2>
              <p className="text-xs text-[var(--color-fc-gray-mid)]">
                Chaque profil administratif dispose de droits spÃ©cifiques pour garantir la sÃ©curitÃ© et la traÃ§abilitÃ© des opÃ©rations.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="space-y-3 rounded-2xl border border-[var(--color-fc-primary)]/15 bg-[var(--color-fc-primary)]/5 p-5">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-fc-primary)] text-xs font-bold text-white">
                      SA
                    </span>
                    <div>
                      <h4 className="font-bold text-[var(--color-fc-black)] text-sm">Super Administrateur</h4>
                      <span className="text-[10px] font-semibold text-[var(--color-fc-primary)]">Direction GÃ©nÃ©rale</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[var(--color-fc-black)]">
                    <li>âœ“ AccÃ¨s total Ã  la plateforme</li>
                    <li>âœ“ Gestion financiÃ¨re et audits</li>
                    <li>âœ“ Modification des formations et tarifs</li>
                    <li>âœ“ Gestion des accÃ¨s du personnel</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      CF
                    </span>
                    <div>
                      <h4 className="font-bold text-[var(--color-fc-black)] text-sm">Caissier / Financier</h4>
                      <span className="text-[10px] text-emerald-700 font-semibold">Service ComptabilitÃ©</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[var(--color-fc-black)]">
                    <li>âœ“ Enregistrement des paiements physiques</li>
                    <li>âœ“ GÃ©nÃ©ration immÃ©diate des reÃ§us certifiÃ©s</li>
                    <li>âœ“ Suivi des retards d&apos;Ã©chÃ©ances</li>
                    <li>âœ— Modification des programmes de cours</li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--color-fc-surface)]/60 border border-[var(--color-fc-primary)]/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[var(--color-fc-deep)] text-white flex items-center justify-center font-bold text-xs">
                      AG
                    </span>
                    <div>
                      <h4 className="font-bold text-[var(--color-fc-black)] text-sm">Agent Administratif</h4>
                      <span className="text-[10px] text-blue-700 font-semibold">Service ScolaritÃ©</span>
                    </div>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[var(--color-fc-black)]">
                    <li>âœ“ Enregistrement des candidats physiques</li>
                    <li>âœ“ Ã‰dition des attestations de scolaritÃ©</li>
                    <li>âœ“ Mise Ã  jour des coordonnÃ©es des Ã©tudiants</li>
                    <li>âœ— Modification des Ã©critures comptables</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ENREGISTRER UN PAIEMENT PHYSIQUE (CAISSE) */}
      {showManualPaymentModal && (
        <div className="fixed inset-0 z-50 bg-[var(--color-fc-deep)]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[var(--color-fc-gray-light)] max-w-md w-full p-6 sm:p-8  space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-fc-black)] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>Encaisser un versement Ã©tudiant</span>
              </h3>
              <button
                onClick={() => setShowManualPaymentModal(false)}
                className="text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-gray-mid)] font-bold"
              >
                âœ•
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[var(--color-fc-black)] mb-1">Ã‰tudiant concernÃ© *</label>
                <select
                  value={manualPayStudentId}
                  onChange={(e) => setManualPayStudentId(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[var(--color-fc-gray-light)] bg-white"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.firstName} {st.lastName} ({st.studentNumber}) â€” Reste: {st.remainingAmount} FCFA
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[var(--color-fc-black)] mb-1">Montant encaissÃ© (FCFA) *</label>
                <input
                  type="number"
                  value={manualPayAmount}
                  onChange={(e) => setManualPayAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[var(--color-fc-gray-light)] font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-[var(--color-fc-black)] mb-1">Mode de versement *</label>
                <select
                  value={manualPayMethod}
                  onChange={(e) => setManualPayMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[var(--color-fc-gray-light)] bg-white"
                >
                  <option value="Caisse / EspÃ¨ces">Caisse / EspÃ¨ces (Guichet)</option>
                  <option value="MTN Mobile Money">MTN Mobile Money (Direct marchand)</option>
                  <option value="Moov Money">Moov Money (Direct marchand)</option>
                  <option value="Virement Bancaire">Virement Bancaire / DÃ©pÃ´t guichet</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[var(--color-fc-black)] mb-1">Notes / RÃ©f reÃ§u physique</label>
                <input
                  type="text"
                  value={manualPayNotes}
                  onChange={(e) => setManualPayNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[var(--color-fc-gray-light)]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isRecordingPayment}
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all disabled:opacity-50"
                >
                  {isRecordingPayment ? "Enregistrement..." : "Valider l'encaissement et gÃ©nÃ©rer le reÃ§u"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOUVEL Ã‰TUDIANT MANUEL */}
      {showNewStudentModal && (
        <div className="fixed inset-0 z-50 bg-[var(--color-fc-deep)]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[var(--color-fc-gray-light)] max-w-lg w-full p-6 sm:p-8  space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-fc-black)] flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--color-fc-primary)]" />
                <span>Inscrire un Ã©tudiant au guichet physique</span>
              </h3>
              <button
                onClick={() => setShowNewStudentModal(false)}
                className="text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-gray-mid)] font-bold"
              >
                âœ•
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">Nom *</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.lastName}
                    onChange={(e) =>
                      setNewStudentForm((prev) => ({ ...prev, lastName: e.target.value.toUpperCase() }))
                    }
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">PrÃ©nom *</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.firstName}
                    onChange={(e) =>
                      setNewStudentForm((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">TÃ©lÃ©phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+229 ..."
                    value={newStudentForm.phone}
                    onChange={(e) =>
                      setNewStudentForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={newStudentForm.email}
                    onChange={(e) =>
                      setNewStudentForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--color-fc-black)] mb-1">Formation choisie *</label>
                <select
                  value={newStudentForm.formationId}
                  onChange={(e) =>
                    setNewStudentForm((prev) => ({ ...prev, formationId: Number(e.target.value) }))
                  }
                  className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)] bg-white"
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
                  className="w-full py-3 rounded-xl text-xs font-bold text-white bg-[var(--color-fc-deep)] hover:bg-[var(--color-fc-primary)] shadow-md transition-all disabled:opacity-50"
                >
                  {isCreatingStudent ? "CrÃ©ation en cours..." : "CrÃ©er le dossier et gÃ©nÃ©rer le matricule FC-2025-..."}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CHANGER LE STATUT D'UN Ã‰TUDIANT */}
      {selectedStudentForStatus && (
        <div className="fixed inset-0 z-50 bg-[var(--color-fc-deep)]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[var(--color-fc-gray-light)] max-w-sm w-full p-6  space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[var(--color-fc-black)]">
              Modifier le statut de {selectedStudentForStatus.firstName} {selectedStudentForStatus.lastName}
            </h3>

            <div className="space-y-2 text-xs">
              <label className="block font-semibold text-[var(--color-fc-gray-mid)]">Nouveau statut :</label>
              <select
                value={newStatusValue}
                onChange={(e) => setNewStatusValue(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[var(--color-fc-gray-light)] bg-white font-medium"
              >
                <option value="preinscrit">PrÃ©inscrit (en attente de validation)</option>
                <option value="rejete">RejetÃ©</option>
                <option value="inscrit">Inscrit (validÃ©)</option>
                <option value="actif">Ã‰tudiant actif</option>
                <option value="termine">Formation terminÃ©e</option>
                <option value="suspendu">Suspendu</option>
              </select>
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={handleUpdateStatus}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-[var(--color-fc-deep)] hover:bg-[var(--color-fc-primary)]"
              >
                Mettre Ã  jour
              </button>
              <button
                onClick={() => setSelectedStudentForStatus(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-fc-gray-mid)] bg-[var(--color-fc-bg)] hover:bg-[var(--color-fc-gray-light)]"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {validationTarget && (
        <div className="fixed inset-0 z-50 bg-[var(--color-fc-deep)]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[var(--color-fc-gray-light)] max-w-sm w-full p-6  space-y-4 animate-in zoom-in-95 duration-200">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
              validationAction === "validate" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
            }`}>
              {validationAction === "validate" ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>
            <h3 className="text-base font-bold text-[var(--color-fc-black)] text-center">
              {validationAction === "validate"
                ? `Valider ${validationTarget.firstName} ${validationTarget.lastName} ?`
                : `Rejeter le dossier de ${validationTarget.firstName} ${validationTarget.lastName} ?`}
            </h3>
            <p className="text-xs text-[var(--color-fc-gray-mid)] text-center leading-relaxed">
              {validationAction === "validate"
                ? "Le compte sera activÃ©, une notification sera envoyÃ©e Ã  l'Ã©tudiant et son profil apparaÃ®tra sur la page Entreprises."
                : "Le compte restera fermÃ© et l'Ã©tudiant sera notifiÃ© de la dÃ©cision."}
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[var(--color-fc-gray-mid)]">
                Note pour l&apos;Ã©tudiant {validationAction === "validate" ? "(optionnel)" : ""}
              </label>
              <textarea
                value={validationNote}
                onChange={(e) => setValidationNote(e.target.value)}
                rows={3}
                placeholder={validationAction === "reject" ? "PrÃ©cisez la raison du rejet (ex : dossier incomplet)..." : "Ajoutez un message de bienvenue..."}
                className="w-full p-2.5 rounded-xl border border-[var(--color-fc-gray-light)] bg-white text-xs"
              />
            </div>

            <div className="pt-1 flex gap-2">
              <button
                onClick={handleConfirmValidation}
                disabled={validationBusy}
                className={`flex-1 py-2 rounded-xl text-xs font-bold text-white disabled:opacity-50 ${
                  validationAction === "validate" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {validationBusy ? "Traitement..." : validationAction === "validate" ? "Valider le compte" : "Rejeter le dossier"}
              </button>
              <button
                onClick={() => setValidationTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--color-fc-gray-mid)] bg-[var(--color-fc-bg)] hover:bg-[var(--color-fc-gray-light)]"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MODIFIER UNE FORMATION */}
      {editingFormation && (
        <div className="fixed inset-0 z-50 bg-[var(--color-fc-deep)]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[var(--color-fc-gray-light)] max-w-lg w-full p-6 sm:p-8  space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-fc-black)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[var(--color-fc-primary)]" />
                <span>Modifier Â« {editingFormation.title} Â»</span>
              </h3>
              <button
                onClick={() => setEditingFormation(null)}
                className="text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-gray-mid)] font-bold"
              >
                âœ•
              </button>
            </div>

            <form onSubmit={handleSaveFormation} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">Titre *</label>
                  <input
                    type="text"
                    required
                    value={formationForm.title}
                    onChange={(e) => setFormationForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">DurÃ©e *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : 9 mois"
                    value={formationForm.duration}
                    onChange={(e) => setFormationForm((p) => ({ ...p, duration: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">Prix total (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formationForm.price}
                    onChange={(e) => setFormationForm((p) => ({ ...p, price: Number(e.target.value) }))}
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">Frais dossier (FCFA) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formationForm.registrationFee}
                    onChange={(e) =>
                      setFormationForm((p) => ({ ...p, registrationFee: Number(e.target.value) }))
                    }
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">Nb mensualitÃ©s</label>
                  <input
                    type="number"
                    min={1}
                    value={formationForm.installmentsCount}
                    onChange={(e) =>
                      setFormationForm((p) => ({ ...p, installmentsCount: Number(e.target.value) }))
                    }
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">Mode</label>
                  <select
                    value={formationForm.mode}
                    onChange={(e) => setFormationForm((p) => ({ ...p, mode: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)] bg-white"
                  >
                    <option value="PrÃ©sentiel & Hybride">PrÃ©sentiel & Hybride</option>
                    <option value="En ligne">En ligne</option>
                    <option value="PrÃ©sentiel">PrÃ©sentiel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[var(--color-fc-black)] mb-1">Campus</label>
                <input
                  type="text"
                  value={formationForm.campus}
                  onChange={(e) => setFormationForm((p) => ({ ...p, campus: e.target.value }))}
                  className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)]"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[var(--color-fc-black)]">
                  <input
                    type="checkbox"
                    checked={formationForm.isActive}
                    onChange={(e) => setFormationForm((p) => ({ ...p, isActive: e.target.checked }))}
                    className="w-4 h-4 rounded border-[var(--color-fc-gray-light)]"
                  />
                  Active
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[var(--color-fc-black)]">
                  <input
                    type="checkbox"
                    checked={formationForm.isPopular}
                    onChange={(e) => setFormationForm((p) => ({ ...p, isPopular: e.target.checked }))}
                    className="w-4 h-4 rounded border-[var(--color-fc-gray-light)]"
                  />
                  Populaire
                </label>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  disabled={isSavingFormation}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-fc-deep)] hover:bg-[var(--color-fc-primary)] disabled:opacity-50 transition-all"
                >
                  {isSavingFormation ? "Enregistrementâ€¦" : "Enregistrer les modifications"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingFormation(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--color-fc-gray-mid)] bg-[var(--color-fc-bg)] hover:bg-[var(--color-fc-gray-light)]"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NOUVEAU PROJET Ã‰TUDIANT */}
      {projectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-fc-deep)]/60 p-4 backdrop-blur-xs">
          <div className="max-h-[90vh] w-full max-w-2xl space-y-5 overflow-y-auto rounded-3xl border border-[var(--color-fc-gray-light)] bg-white p-6  sm:p-8">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-base font-bold text-[var(--color-fc-black)]">
                <FolderGit2 className="h-4 w-4 text-[var(--color-fc-primary)]" />
                Nouveau projet Ã©tudiant
              </h3>
              <button
                type="button"
                onClick={() => setProjectModalOpen(false)}
                className="font-bold text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-gray-mid)]"
                aria-label="Fermer"
              >
                âœ•
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-3 text-xs">
              <label className="block font-bold text-[var(--color-fc-black)]">
                Ã‰tudiant confirmÃ© *
                <select
                  required
                  value={projectForm.studentId}
                  onChange={(e) => setProjectForm((current) => ({ ...current, studentId: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[var(--color-fc-gray-light)] p-2"
                >
                  {validatedStudents.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.firstName} {student.lastName} â€” {student.studentNumber}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block font-bold text-[var(--color-fc-black)]">
                Titre du projet *
                <input
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm((current) => ({ ...current, title: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[var(--color-fc-gray-light)] p-2"
                />
              </label>

              <label className="block font-bold text-[var(--color-fc-black)]">
                RÃ©sumÃ© *
                <input
                  required
                  value={projectForm.tagline}
                  onChange={(e) => setProjectForm((current) => ({ ...current, tagline: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-[var(--color-fc-gray-light)] p-2"
                />
              </label>

              <label className="block font-bold text-[var(--color-fc-black)]">
                Description *
                <textarea
                  required
                  rows={4}
                  value={projectForm.description}
                  onChange={(e) => setProjectForm((current) => ({ ...current, description: e.target.value }))}
                  className="mt-1 w-full resize-y rounded-xl border border-[var(--color-fc-gray-light)] p-2"
                />
              </label>

              <label className="block font-bold text-[var(--color-fc-black)]">
                Image (URL HTTPS ou chemin /images/) *
                <input
                  required
                  value={projectForm.coverImage}
                  onChange={(e) => setProjectForm((current) => ({ ...current, coverImage: e.target.value }))}
                  placeholder="https://â€¦ ou /images/â€¦"
                  className="mt-1 w-full rounded-xl border border-[var(--color-fc-gray-light)] p-2 font-mono"
                />
              </label>

              <label className="block font-bold text-[var(--color-fc-black)]">
                Technologies (sÃ©parÃ©es par des virgules) *
                <input
                  required
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm((current) => ({ ...current, technologies: e.target.value }))}
                  placeholder="React, TypeScript, PostgreSQL"
                  className="mt-1 w-full rounded-xl border border-[var(--color-fc-gray-light)] p-2"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block font-bold text-[var(--color-fc-black)]">
                  Lien du projet
                  <input
                    type="url"
                    value={projectForm.projectUrl}
                    onChange={(e) => setProjectForm((current) => ({ ...current, projectUrl: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[var(--color-fc-gray-light)] p-2"
                  />
                </label>
                <label className="block font-bold text-[var(--color-fc-black)]">
                  Lien GitHub
                  <input
                    type="url"
                    value={projectForm.githubUrl}
                    onChange={(e) => setProjectForm((current) => ({ ...current, githubUrl: e.target.value }))}
                    className="mt-1 w-full rounded-xl border border-[var(--color-fc-gray-light)] p-2"
                  />
                </label>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isSavingProject || validatedStudents.length === 0}
                  className="flex-1 rounded-xl bg-[var(--color-fc-deep)] py-2.5 text-xs font-bold text-white transition-all hover:bg-[var(--color-fc-primary)] disabled:opacity-50"
                >
                  {isSavingProject ? "Enregistrementâ€¦" : "Publier le projet"}
                </button>
                <button
                  type="button"
                  onClick={() => setProjectModalOpen(false)}
                  className="rounded-xl bg-[var(--color-fc-bg)] px-4 py-2.5 text-xs font-semibold text-[var(--color-fc-gray-mid)] hover:bg-[var(--color-fc-gray-light)]"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CRÃ‰ER / MODIFIER UN ARTICLE */}
      {articleModalOpen && (
        <div className="fixed inset-0 z-50 bg-[var(--color-fc-deep)]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[var(--color-fc-gray-light)] max-w-2xl w-full p-6 sm:p-8  space-y-5 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--color-fc-black)] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--color-fc-primary)]" />
                <span>{editingArticle ? "Modifier l'article" : "Nouvel article de blog"}</span>
              </h3>
              <button
                onClick={() => setArticleModalOpen(false)}
                className="text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-gray-mid)] font-bold"
              >
                âœ•
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">Titre *</label>
                  <input
                    type="text"
                    required
                    value={articleForm.title}
                    onChange={(e) => setArticleForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">Slug (URL)</label>
                  <input
                    type="text"
                    placeholder="auto-gÃ©nÃ©rÃ© depuis le titre si vide"
                    value={articleForm.slug}
                    onChange={(e) => setArticleForm((p) => ({ ...p, slug: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)] font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">CatÃ©gorie *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex : Ã‰vÃ©nements"
                    value={articleForm.category}
                    onChange={(e) => setArticleForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[var(--color-fc-black)] mb-1">Extrait court *</label>
                <textarea
                  required
                  rows={2}
                  value={articleForm.excerpt}
                  onChange={(e) => setArticleForm((p) => ({ ...p, excerpt: e.target.value }))}
                  className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)] resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[var(--color-fc-black)] mb-1">Contenu complet (HTML/markdown libre) *</label>
                <textarea
                  required
                  rows={6}
                  value={articleForm.content}
                  onChange={(e) => setArticleForm((p) => ({ ...p, content: e.target.value }))}
                  className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)] resize-y font-mono text-[11px]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-[var(--color-fc-black)] mb-1">URL image de couverture *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.pexels.com/..."
                  value={articleForm.coverImage}
                  onChange={(e) => setArticleForm((p) => ({ ...p, coverImage: e.target.value }))}
                  className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)] font-mono text-[11px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">Auteur</label>
                  <input
                    type="text"
                    value={articleForm.author}
                    onChange={(e) => setArticleForm((p) => ({ ...p, author: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[var(--color-fc-black)] mb-1">Temps de lecture</label>
                  <input
                    type="text"
                    value={articleForm.readTime}
                    onChange={(e) => setArticleForm((p) => ({ ...p, readTime: e.target.value }))}
                    className="w-full p-2 rounded-xl border border-[var(--color-fc-gray-light)]"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-[var(--color-fc-deep)] hover:bg-[var(--color-fc-primary)] transition-all"
                >
                  {editingArticle ? "Enregistrer les modifications" : "Publier l'article"}
                </button>
                <button
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[var(--color-fc-gray-mid)] bg-[var(--color-fc-bg)] hover:bg-[var(--color-fc-gray-light)]"
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


