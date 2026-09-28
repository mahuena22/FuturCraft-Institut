"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  Eye,
  EyeOff,
  Upload,
  Sparkles,
  ExternalLink,
  X,
} from "lucide-react";
import Image from "next/image";

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
  whatsapp?: string | null;
  city: string | null;
  status: string;
  professionalStatus?: string | null;
  skills?: string | null;
  avatarUrl?: string | null;
  cvUrl?: string | null;
  profileVisible: boolean;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  formationId: number;
  customFormation?: string | null;
  formationTitle?: string | null;
  validationNote?: string | null;
  validatedBy?: string | null;
  validatedAt?: string | Date | null;
  createdAt?: string | Date;
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
  tools?: string | null;
  competencies?: string | null;
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
  createdAt: string;
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
  const [admissions, setAdmissions] = useState<AdmissionItem[]>([]);

  const [currentRole, setCurrentRole] = useState<"super_admin" | "agent" | "financier">("super_admin");
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "validations"
    | "talents"
    | "etudiants"
    | "paiements"
    | "formations"
    | "articles"
    | "roles"
    | "partenariats"
    | "rappels"
  >("dashboard");

  const router = useRouter();
  const searchParams = useSearchParams();

  // Support direct navigation from /entreprises (?tab=talents&edit=ID)
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "talents") {
      setActiveTab("talents");
    }
    const editId = searchParams.get("edit");
    if (editId && students.length > 0) {
      const found = students.find((s) => s.id === Number(editId));
      if (found) {
        setActiveTab("talents");
        handleOpenEditStudent(found);
      }
    }
  }, [searchParams, students]);

  // Group all formations by category (matches /formations catalog)
  const formationsByCategory = useMemo(() => {
    const groups: Record<string, FormationItem[]> = {};
    formations.forEach((f) => {
      const cat = f.category || "Autres Formations";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(f);
    });
    return groups;
  }, [formations]);

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
  const [visibilityFilter, setVisibilityFilter] = useState<"all" | "visible" | "hidden">("all");

  // Filters & Search for Talents tab (defaults to "visible" to immediately show profiles displayed on /entreprises)
  const [searchTalent, setSearchTalent] = useState("");
  const [talentStatusFilter, setTalentStatusFilter] = useState("all");
  const [talentFormationFilter, setTalentFormationFilter] = useState("all");
  const [talentVisibilityFilter, setTalentVisibilityFilter] = useState<"all" | "visible" | "hidden">("visible");

  // Manual payment recording modal
  const [showManualPaymentModal, setShowManualPaymentModal] = useState(false);
  const [manualPayStudentId, setManualPayStudentId] = useState<number>(students[0]?.id || 1);
  const [manualPayAmount, setManualPayAmount] = useState<number>(50000);
  const [manualPayMethod, setManualPayMethod] = useState<string>("Caisse / Espèces");
  const [manualPayNotes, setManualPayNotes] = useState<string>("Règlement physique à la caisse du campus de Cotonou");
  const [isRecordingPayment, setIsRecordingPayment] = useState(false);

  // Student / Talent creation modal
  const [showNewStudentModal, setShowNewStudentModal] = useState(false);
  const [newStudentForm, setNewStudentForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "Cotonou",
    formationId: formationsList[0]?.id || 1,
    customFormation: formationsList[0]?.title || "Développement Web Fullstack",
    status: "actif",
    professionalStatus: "Disponible immédiatement",
    skills: [] as string[],
    newSkillInput: "",
    avatarUrl: "",
    cvUrl: "",
    profileVisible: true,
  });
  const [isCreatingStudent, setIsCreatingStudent] = useState(false);

  // Edit student / talent modal
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);
  const [editStudentForm, setEditStudentForm] = useState({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "Cotonou",
    formationId: 1,
    customFormation: "",
    status: "actif",
    professionalStatus: "Disponible immédiatement",
    skills: [] as string[],
    newSkillInput: "",
    avatarUrl: "",
    cvUrl: "",
    profileVisible: true,
  });
  const [isSavingStudent, setIsSavingStudent] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isUploadingCv, setIsUploadingCv] = useState(false);

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

  // Filter students
  const filteredStudents = students.filter((s) => {
    const query = searchStudent.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      s.firstName.toLowerCase().includes(query) ||
      s.lastName.toLowerCase().includes(query) ||
      s.studentNumber.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      s.phone.toLowerCase().includes(query) ||
      (s.skills && s.skills.toLowerCase().includes(query)) ||
      (s.professionalStatus && s.professionalStatus.toLowerCase().includes(query)) ||
      (s.formationTitle && s.formationTitle.toLowerCase().includes(query));

    const matchesStatus = statusFilter === "all" || s.status === statusFilter;
    const matchesFormation =
      formationFilter === "all" || s.formationId === Number(formationFilter);
    const matchesVisibility =
      visibilityFilter === "all" ||
      (visibilityFilter === "visible" ? s.profileVisible : !s.profileVisible);

    return matchesSearch && matchesStatus && matchesFormation && matchesVisibility;
  });

  // Filter talents specifically for the Vivier de Talents tab
  const filteredTalentsList = students.filter((s) => {
    const query = searchTalent.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      s.firstName.toLowerCase().includes(query) ||
      s.lastName.toLowerCase().includes(query) ||
      s.studentNumber.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      s.phone.toLowerCase().includes(query) ||
      (s.skills && s.skills.toLowerCase().includes(query)) ||
      (s.professionalStatus && s.professionalStatus.toLowerCase().includes(query)) ||
      (s.formationTitle && s.formationTitle.toLowerCase().includes(query));

    const matchesStatus =
      talentStatusFilter === "all" ||
      (s.professionalStatus && s.professionalStatus.toLowerCase().includes(talentStatusFilter.toLowerCase()));
    const matchesFormation =
      talentFormationFilter === "all" || s.formationId === Number(talentFormationFilter);
    const matchesVisibility =
      talentVisibilityFilter === "all" ||
      (talentVisibilityFilter === "visible" ? s.profileVisible : !s.profileVisible);

    return matchesSearch && matchesStatus && matchesFormation && matchesVisibility;
  });

  // Reload data helper
  const reloadData = async () => {
    try {
      const [resStats, resStudents, resPayments, resPartnerships, resPaymentRequests, resAdmissions, resFormations] = await Promise.all([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/students").then((r) => r.json()),
        fetch("/api/payments").then((r) => r.json()),
        fetch("/api/partnerships").then((r) => r.json()),
        fetch("/api/payment-requests").then((r) => r.json()),
        fetch("/api/admin/admissions").then((r) => r.json()),
        fetch("/api/formations").then((r) => r.json()).catch(() => null),
      ]);
      setStats(resStats);
      setStudents(resStudents);
      setPayments(resPayments);
      setPartnerships(resPartnerships);
      setPaymentRequests(resPaymentRequests);
      if (Array.isArray(resAdmissions)) setAdmissions(resAdmissions);
      if (Array.isArray(resFormations)) setFormations(resFormations);
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

  // Upload photo or CV file via /api/admin/upload
  const handleUploadFile = async (
    file: File,
    kind: "avatar" | "cv",
    target: "new" | "edit"
  ) => {
    const isPhoto = kind === "avatar";
    if (isPhoto) setIsUploadingPhoto(true);
    else setIsUploadingCv(true);

    try {
      const fd = new FormData();
      fd.append("kind", kind);
      fd.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de téléversement");

      if (target === "new") {
        setNewStudentForm((prev) => ({
          ...prev,
          ...(isPhoto ? { avatarUrl: data.url } : { cvUrl: data.url }),
        }));
      } else {
        setEditStudentForm((prev) => ({
          ...prev,
          ...(isPhoto ? { avatarUrl: data.url } : { cvUrl: data.url }),
        }));
      }
    } catch (err: any) {
      alert(err.message || "Erreur lors du téléversement du fichier");
    } finally {
      if (isPhoto) setIsUploadingPhoto(false);
      else setIsUploadingCv(false);
    }
  };

  // Create student / talent profile
  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentForm.firstName.trim() || !newStudentForm.lastName.trim() || !newStudentForm.phone.trim() || !newStudentForm.email.trim()) {
      alert("Veuillez renseigner le nom, le prénom, le numéro de téléphone et l'email.");
      return;
    }

    setIsCreatingStudent(true);
    try {
      const payload = {
        firstName: newStudentForm.firstName.trim(),
        lastName: newStudentForm.lastName.trim(),
        email: newStudentForm.email.trim(),
        phone: newStudentForm.phone.trim(),
        city: newStudentForm.city.trim() || "Cotonou",
        formationId: Number(newStudentForm.formationId),
        customFormation: newStudentForm.customFormation.trim() || undefined,
        status: newStudentForm.status,
        professionalStatus: newStudentForm.professionalStatus,
        skills: newStudentForm.skills,
        avatarUrl: newStudentForm.avatarUrl.trim() || undefined,
        cvUrl: newStudentForm.cvUrl.trim() || undefined,
        profileVisible: newStudentForm.profileVisible,
      };

      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur création profil étudiant");
      }

      await reloadData();
      setShowNewStudentModal(false);
      setNewStudentForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        city: "Cotonou",
        formationId: formations[0]?.id || 1,
        customFormation: formations[0]?.title || "Développement Web Fullstack",
        status: "actif",
        professionalStatus: "Disponible immédiatement",
        skills: [],
        newSkillInput: "",
        avatarUrl: "",
        cvUrl: "",
        profileVisible: true,
      });
      alert("Profil étudiant et talent créé avec succès !");
    } catch (err: any) {
      alert(err.message || "Erreur");
    } finally {
      setIsCreatingStudent(false);
    }
  };

  // Open edit modal for student
  const handleOpenEditStudent = (st: StudentItem) => {
    let parsedSkills: string[] = [];
    if (st.skills) {
      try {
        const parsed = JSON.parse(st.skills);
        if (Array.isArray(parsed)) parsedSkills = parsed.map(String).map((s) => s.trim()).filter(Boolean);
      } catch {
        parsedSkills = st.skills.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    setEditingStudent(st);
    setEditStudentForm({
      id: st.id,
      firstName: st.firstName,
      lastName: st.lastName,
      email: st.email,
      phone: st.phone,
      city: st.city || "Cotonou",
      formationId: st.formationId,
      customFormation: st.customFormation || st.formationTitle || "",
      status: st.status,
      professionalStatus: st.professionalStatus || (st.profileVisible ? "Disponible immédiatement" : "Recherche de stage"),
      skills: parsedSkills,
      newSkillInput: "",
      avatarUrl: st.avatarUrl || "",
      cvUrl: st.cvUrl || "",
      profileVisible: Boolean(st.profileVisible),
    });
  };

  // Save edit student
  const handleSaveEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    setIsSavingStudent(true);
    try {
      const payload = {
        firstName: editStudentForm.firstName.trim(),
        lastName: editStudentForm.lastName.trim(),
        email: editStudentForm.email.trim(),
        phone: editStudentForm.phone.trim(),
        city: editStudentForm.city.trim() || "Cotonou",
        formationId: Number(editStudentForm.formationId),
        customFormation: editStudentForm.customFormation.trim() || null,
        status: editStudentForm.status,
        professionalStatus: editStudentForm.professionalStatus,
        skills: editStudentForm.skills,
        avatarUrl: editStudentForm.avatarUrl.trim() || null,
        cvUrl: editStudentForm.cvUrl.trim() || null,
        profileVisible: editStudentForm.profileVisible,
      };

      const res = await fetch(`/api/students/${editingStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur mise à jour profil étudiant");
      }

      await reloadData();
      setEditingStudent(null);
      alert("Profil talent mis à jour avec succès ! Les modifications sont immédiatement synchronisées sur la page Entreprises.");
    } catch (err: any) {
      alert(err.message || "Erreur");
    } finally {
      setIsSavingStudent(false);
    }
  };

  // Toggle visibility on Entreprises page
  const handleToggleVisibility = async (st: StudentItem) => {
    const nextVal = !st.profileVisible;
    try {
      const res = await fetch(`/api/students/${st.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileVisible: nextVal }),
      });
      if (!res.ok) throw new Error("Erreur mise à jour visibilité");
      await reloadData();
    } catch (err: any) {
      alert(err.message || "Erreur");
    }
  };

  // Delete student
  const handleDeleteStudent = async (st: StudentItem) => {
    if (!window.confirm(`Supprimer définitivement le profil de l'étudiant ${st.firstName} ${st.lastName} (${st.studentNumber}) ?\nCette action est irréversible.`)) return;
    try {
      const res = await fetch(`/api/students/${st.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur suppression étudiant");
      await reloadData();
      alert("Profil étudiant supprimé.");
    } catch (err: any) {
      alert(err.message || "Erreur");
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
            onClick={() => setActiveTab("validations")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "validations"
                ? "border-violet-600 text-violet-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Validations</span>
            {pendingValidations > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black">
                {pendingValidations}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("talents")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "talents"
                ? "border-blue-600 text-blue-600 font-extrabold"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Vivier de Talents ({students.filter((s) => s.profileVisible).length})</span>
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
                  Dossiers en attente
                </span>
                <div className="text-3xl font-black text-amber-600">{pendingValidations}</div>
                <div className="flex items-center gap-2 text-xs pt-1">
                  <button
                    onClick={() => setActiveTab("validations")}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Valider les comptes →
                  </button>
                </div>
              </div>

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

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Talents en Ligne
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-3xl font-black text-blue-600">
                  {students.filter((s) => s.profileVisible).length}
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-slate-400">Sur {students.length} profils</span>
                  <button
                    onClick={() => setActiveTab("talents")}
                    className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                  >
                    Gérer les talents →
                  </button>
                </div>
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

                  <button
                    onClick={() => setActiveTab("talents")}
                    className="w-full p-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-bold flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-indigo-600" />
                      Vivier de talents ({students.filter((s) => s.profileVisible).length} en ligne)
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-indigo-400" />
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

        {/* 31. TAB VALIDATIONS D'ADMISSION */}
        {activeTab === "validations" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Validation des Comptes Étudiants</h2>
                <p className="text-xs text-slate-500">
                  Chaque nouvel étudiant doit être validé avant de pouvoir se connecter et apparaître sur la page Entreprises.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                  pendingValidations > 0 ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                }`}>
                  {pendingValidations > 0 ? `${pendingValidations} dossiers en attente` : "Aucun dossier en attente"}
                </span>
              </div>
            </div>

            {/* Pending validations */}
            {pendingValidations > 0 && (
              <div className="bg-white rounded-2xl border border-amber-200 overflow-hidden shadow-xs">
                <div className="bg-amber-50 px-5 py-3 border-b border-amber-200 flex items-center justify-between">
                  <span className="text-sm font-bold text-amber-800 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Dossiers en attente de validation
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Matricule</th>
                        <th className="py-3 px-4">Étudiant</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Formation</th>
                        <th className="py-3 px-4">Date d&apos;inscription</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {admissions.filter((a) => a.status === "preinscrit").map((a) => (
                        <tr key={a.id} className="hover:bg-amber-50/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-blue-600">{a.studentNumber}</td>
                          <td className="py-3 px-4">
                            <strong className="text-slate-900 block">{a.firstName} {a.lastName}</strong>
                            <span className="text-[10px] text-slate-400">{a.city || "Cotonou"}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            <div>{a.phone}</div>
                            <div className="text-[10px] text-slate-400">{a.email}</div>
                          </td>
                          <td className="py-3 px-4 text-slate-600">{a.formationTitle || "—"}</td>
                          <td className="py-3 px-4 text-slate-500 text-[10px]">
                            {a.createdAt ? new Date(a.createdAt).toLocaleDateString("fr-FR") : "—"}
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
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Dossiers traités récemment
                </span>
              </div>
              {admissions.filter((a) => a.status !== "preinscrit").length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-400">
                  Aucun dossier traité pour le moment.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Matricule</th>
                        <th className="py-3 px-4">Étudiant</th>
                        <th className="py-3 px-4">Formation</th>
                        <th className="py-3 px-4">Statut</th>
                        <th className="py-3 px-4">Note</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {admissions
                        .filter((a) => a.status !== "preinscrit")
                        .slice(0, 20)
                        .map((a) => (
                          <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="py-3 px-4 font-mono font-bold text-blue-600">{a.studentNumber}</td>
                            <td className="py-3 px-4">
                              <strong className="text-slate-900 block">{a.firstName} {a.lastName}</strong>
                              <span className="text-[10px] text-slate-400">{a.email}</span>
                            </td>
                            <td className="py-3 px-4 text-slate-600">{a.formationTitle || "—"}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  a.status === "inscrit" || a.status === "actif" || a.status === "termine"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : a.status === "rejete"
                                    ? "bg-rose-100 text-rose-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {a.status === "inscrit" && "Validé (inscrit)"}
                                {a.status === "actif" && "Actif"}
                                {a.status === "termine" && "Formation terminée"}
                                {a.status === "rejete" && "Rejeté"}
                                {!["inscrit", "actif", "termine", "rejete"].includes(a.status) && a.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500 italic max-w-[220px]">
                              {a.validationNote || "—"}
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

        {/* TAB VIVIER DE TALENTS & PROFILS ENTREPRISES */}
        {activeTab === "talents" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header + Add Talent button */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-600" /> Vivier de Talents Certifiés
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {students.filter((s) => s.profileVisible).length} profil(s) en ligne sur Entreprises
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Gestion des Talents &amp; Profils Entreprises
                </h2>
                <p className="text-xs text-slate-500 max-w-2xl">
                  Créez, modifiez et supprimez les profils étudiants valorisés auprès des recruteurs et entreprises partenaires.
                  Gérez leurs compétences, CV (PDF), photo d&apos;identité et statut de disponibilité en un clic.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/entreprises"
                  target="_blank"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Ouvrir la page Entreprises dans un nouvel onglet"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  <span>Voir la page Entreprises</span>
                </Link>

                <button
                  onClick={() => {
                    setNewStudentForm({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      city: "Cotonou",
                      formationId: formations[0]?.id || 1,
                      customFormation: formations[0]?.title || "Développement Web Fullstack",
                      status: "actif",
                      professionalStatus: "Disponible immédiatement",
                      skills: [],
                      newSkillInput: "",
                      avatarUrl: "",
                      cvUrl: "",
                      profileVisible: true,
                    });
                    setShowNewStudentModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-2 transition-all hover:shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Créer un Nouveau Talent</span>
                </button>
              </div>
            </div>

            {/* Quick KPI stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  En ligne sur Entreprises
                </span>
                <div className="text-2xl font-black text-emerald-600">
                  {students.filter((s) => s.profileVisible).length}
                </div>
                <span className="text-[11px] text-slate-400">Visibles par les recruteurs</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Disponible immédiatement
                </span>
                <div className="text-2xl font-black text-blue-600">
                  {
                    students.filter(
                      (s) =>
                        s.profileVisible &&
                        (s.professionalStatus || "").toLowerCase().includes("disponible")
                    ).length
                  }
                </div>
                <span className="text-[11px] text-slate-400">Prêts pour embauche directe</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Recherche d&apos;alternance
                </span>
                <div className="text-2xl font-black text-indigo-600">
                  {
                    students.filter(
                      (s) =>
                        s.profileVisible &&
                        (s.professionalStatus || "").toLowerCase().includes("alternance")
                    ).length
                  }
                </div>
                <span className="text-[11px] text-slate-400">Rythme école / entreprise</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Recherche de stage
                </span>
                <div className="text-2xl font-black text-amber-600">
                  {
                    students.filter(
                      (s) =>
                        s.profileVisible &&
                        (s.professionalStatus || "").toLowerCase().includes("stage")
                    ).length
                  }
                </div>
                <span className="text-[11px] text-slate-400">Stages pratiques 3 à 6 mois</span>
              </div>
            </div>

            {/* RECHERCHE & FILTRES RAPIDES TALENTS */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher par compétence (ex: React, Python, Drone, Figma), nom ou formation..."
                    value={searchTalent}
                    onChange={(e) => setSearchTalent(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={talentStatusFilter}
                    onChange={(e) => setTalentStatusFilter(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="all">Tous les statuts professionnels</option>
                    <option value="disponible">Disponible immédiatement</option>
                    <option value="alternance">Recherche d&apos;alternance</option>
                    <option value="stage">Recherche de stage</option>
                    <option value="diplômé">Diplômé / En poste</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={talentFormationFilter}
                    onChange={(e) => setTalentFormationFilter(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="all">Toutes les formations ({formations.length})</option>
                    {Object.entries(formationsByCategory).map(([cat, items]) => (
                      <optgroup key={cat} label={`📂 ${cat}`}>
                        {items.map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.title}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              {/* Visibility quick toggle filters */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 overflow-x-auto text-[11px] font-semibold text-slate-600">
                <span className="text-slate-400">Filtrer par visibilité :</span>
                <button
                  onClick={() => setTalentVisibilityFilter("visible")}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    talentVisibilityFilter === "visible"
                      ? "bg-emerald-600 text-white font-black shadow-xs ring-2 ring-emerald-300"
                      : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <Eye className="w-3.5 h-3.5" />
                  <span>En ligne sur Entreprises ({students.filter((s) => s.profileVisible).length})</span>
                </button>

                <button
                  onClick={() => setTalentVisibilityFilter("all")}
                  className={`px-3.5 py-1.5 rounded-xl transition-all ${
                    talentVisibilityFilter === "all"
                      ? "bg-slate-900 text-white font-bold shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Tous ({students.length})
                </button>

                <button
                  onClick={() => setTalentVisibilityFilter("hidden")}
                  className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                    talentVisibilityFilter === "hidden"
                      ? "bg-slate-800 text-white font-bold shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Masqués ({students.filter((s) => !s.profileVisible).length})</span>
                </button>
              </div>
            </div>

            {/* Talents Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Talent &amp; Photo</th>
                      <th className="py-3 px-4">Formation Suivie</th>
                      <th className="py-3 px-4">Disponibilité Recrutement</th>
                      <th className="py-3 px-4">Compétences validées</th>
                      <th className="py-3 px-4">CV</th>
                      <th className="py-3 px-4 text-center">Page Entreprises</th>
                      <th className="py-3 px-4 text-right">Actions (Modifier / Supprimer)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {filteredTalentsList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-10 text-center text-slate-400 space-y-2">
                          <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
                          <p className="font-bold text-slate-600">Aucun talent trouvé avec les critères actuels.</p>
                          <button
                            onClick={() => {
                              setSearchTalent("");
                              setTalentStatusFilter("all");
                              setTalentFormationFilter("all");
                              setTalentVisibilityFilter("all");
                            }}
                            className="text-xs text-blue-600 font-bold hover:underline"
                          >
                            Réinitialiser les filtres
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredTalentsList.map((st) => {
                        let parsedSkills: string[] = [];
                        if (st.skills) {
                          try {
                            const p = JSON.parse(st.skills);
                            if (Array.isArray(p))
                              parsedSkills = p.map(String).map((s) => s.trim()).filter(Boolean);
                          } catch {
                            parsedSkills = st.skills.split(",").map((s) => s.trim()).filter(Boolean);
                          }
                        }

                        const initials = `${st.firstName?.[0] || ""}${st.lastName?.[0] || ""}`.toUpperCase() || "FC";
                        const displayFormation =
                          st.formationTitle ||
                          formations.find((f) => f.id === st.formationId)?.title ||
                          "Formation générale";

                        return (
                          <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* Talent & Photo */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {st.avatarUrl ? (
                                  <Image
                                    src={st.avatarUrl}
                                    alt={`${st.firstName} ${st.lastName}`}
                                    width={44}
                                    height={44}
                                    unoptimized
                                    className="w-11 h-11 rounded-2xl object-cover border-2 border-blue-200 shrink-0 shadow-2xs"
                                  />
                                ) : (
                                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-black text-xs flex items-center justify-center shrink-0 border-2 border-blue-100 shadow-2xs">
                                    {initials}
                                  </div>
                                )}
                                <div>
                                  <strong className="text-slate-900 block font-bold text-sm">
                                    {st.firstName} {st.lastName}
                                  </strong>
                                  <span className="text-[10px] font-mono text-blue-600 font-bold block">
                                    {st.studentNumber}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {st.phone} • {st.email}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Formation */}
                            <td className="py-3 px-4">
                              <span className="font-semibold text-slate-800 block text-xs">
                                {displayFormation}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium">
                                Campus: {st.city || "Cotonou"}
                              </span>
                            </td>

                            {/* Disponibilité Recrutement */}
                            <td className="py-3 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold inline-flex items-center gap-1.5 border ${
                                  (st.professionalStatus || "").toLowerCase().includes("disponible")
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    : (st.professionalStatus || "").toLowerCase().includes("alternance")
                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                    : (st.professionalStatus || "").toLowerCase().includes("stage")
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-purple-50 text-purple-700 border-purple-200"
                                }`}
                              >
                                {(st.professionalStatus || "").toLowerCase().includes("disponible") && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                )}
                                {st.professionalStatus || "Disponible immédiatement"}
                              </span>
                            </td>

                            {/* Compétences validées */}
                            <td className="py-3 px-4">
                              {parsedSkills.length > 0 ? (
                                <div className="flex flex-wrap gap-1 max-w-[240px]">
                                  {parsedSkills.slice(0, 5).map((sk, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                                    >
                                      #{sk}
                                    </span>
                                  ))}
                                  {parsedSkills.length > 5 && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600">
                                      +{parsedSkills.length - 5}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">Compétences non renseignées</span>
                              )}
                            </td>

                            {/* CV */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              {st.cvUrl ? (
                                <a
                                  href={st.cvUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
                                  title="Consulter ou télécharger le CV (PDF)"
                                >
                                  <FileText className="w-3.5 h-3.5 text-red-600" />
                                  <span>CV PDF ↗</span>
                                </a>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">Aucun CV</span>
                              )}
                            </td>

                            {/* Page Entreprises Toggle */}
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <button
                                onClick={() => handleToggleVisibility(st)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold transition-all border ${
                                  st.profileVisible
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
                                    : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                                }`}
                                title={
                                  st.profileVisible
                                    ? "Visible sur /entreprises. Cliquer pour masquer."
                                    : "Masqué. Cliquer pour afficher sur /entreprises."
                                }
                              >
                                {st.profileVisible ? (
                                  <>
                                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>En ligne sur Entreprises</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                                    <span>Masqué</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Actions (Modifier / Supprimer) */}
                            <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleOpenEditStudent(st)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                                title="Modifier toutes les informations du profil"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                                <span>Modifier</span>
                              </button>

                              <button
                                onClick={() => handleDeleteStudent(st)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                                title="Supprimer définitivement ce talent"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Supprimer</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 26 & 30. TAB GESTION DES ÉTUDIANTS & TALENTS ENTREPRISES */}
        {activeTab === "etudiants" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header + Add Student button */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-600" /> Vivier de Talents &amp; Candidats
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {students.filter((s) => s.profileVisible).length} profil(s) en ligne sur Entreprises
                  </span>
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Répertoire des Candidats &amp; Profils Entreprises</h2>
                <p className="text-xs text-slate-500">
                  Créez et administrez les profils étudiants, compétences validées, CV, photos d&apos;identité et leur mise en avant auprès des recruteurs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/entreprises"
                  target="_blank"
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center gap-1.5 transition-colors shadow-2xs"
                  title="Ouvrir la page Entreprises dans un nouvel onglet"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                  <span>Voir la page Entreprises</span>
                </Link>

                <button
                  onClick={() => setShowNewStudentModal(true)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md flex items-center gap-2 transition-all hover:shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau profil étudiant / Talent</span>
                </button>
              </div>
            </div>

            {/* 30. RECHERCHE & FILTRES RAPIDES */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                <div className="sm:col-span-6 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, matricule, compétence (React, Figma...), email, tél..."
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-700"
                  >
                    <option value="all">Tous les statuts administratifs</option>
                    <option value="preinscrit">En attente de validation</option>
                    <option value="rejete">Rejetés</option>
                    <option value="inscrit">Inscrits (validés)</option>
                    <option value="actif">Étudiants actifs</option>
                    <option value="termine">Formation terminée</option>
                    <option value="alumni">Alumni</option>
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

              {/* Visibility quick toggle filters */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100 overflow-x-auto text-[11px] font-semibold text-slate-600">
                <span className="text-slate-400">Affichage Entreprises :</span>
                <button
                  onClick={() => setVisibilityFilter("all")}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    visibilityFilter === "all"
                      ? "bg-slate-900 text-white font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Tous ({students.length})
                </button>
                <button
                  onClick={() => setVisibilityFilter("visible")}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    visibilityFilter === "visible"
                      ? "bg-emerald-600 text-white font-bold shadow-xs"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>En ligne sur Entreprises ({students.filter((s) => s.profileVisible).length})</span>
                </button>
                <button
                  onClick={() => setVisibilityFilter("hidden")}
                  className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 ${
                    visibilityFilter === "hidden"
                      ? "bg-slate-700 text-white font-bold shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span>Masqués ({students.filter((s) => !s.profileVisible).length})</span>
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Étudiant &amp; Photo</th>
                      <th className="py-3 px-4">Formation</th>
                      <th className="py-3 px-4">Statut &amp; Disponibilité</th>
                      <th className="py-3 px-4">Compétences validées</th>
                      <th className="py-3 px-4">CV</th>
                      <th className="py-3 px-4 text-center">Page Entreprises</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-400">
                          Aucun étudiant trouvé avec les critères sélectionnés.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((st) => {
                        let parsedSkills: string[] = [];
                        if (st.skills) {
                          try {
                            const p = JSON.parse(st.skills);
                            if (Array.isArray(p)) parsedSkills = p.map(String).map((s) => s.trim()).filter(Boolean);
                          } catch {
                            parsedSkills = st.skills.split(",").map((s) => s.trim()).filter(Boolean);
                          }
                        }

                        const initials = `${st.firstName?.[0] || ""}${st.lastName?.[0] || ""}`.toUpperCase() || "FC";
                        const displayFormation = st.formationTitle || formations.find((f) => f.id === st.formationId)?.title || "Formation générale";

                        return (
                          <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                            {/* Étudiant & Photo */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {st.avatarUrl ? (
                                  <Image
                                    src={st.avatarUrl}
                                    alt={`${st.firstName} ${st.lastName}`}
                                    width={40}
                                    height={40}
                                    unoptimized
                                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-200 shrink-0"
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-xs flex items-center justify-center shrink-0 border-2 border-blue-200">
                                    {initials}
                                  </div>
                                )}
                                <div>
                                  <strong className="text-slate-900 block font-bold">
                                    {st.firstName} {st.lastName}
                                  </strong>
                                  <span className="text-[10px] font-mono text-blue-600 font-bold block">
                                    {st.studentNumber}
                                  </span>
                                  <span className="text-[10px] text-slate-400">
                                    {st.phone} • {st.city || "Cotonou"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Formation */}
                            <td className="py-3 px-4">
                              <span className="font-semibold text-slate-800 block text-xs">
                                {displayFormation}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {st.paidAmount.toLocaleString("fr-FR")} / {st.totalAmount.toLocaleString("fr-FR")} FCFA
                              </span>
                            </td>

                            {/* Statut & Disponibilité */}
                            <td className="py-3 px-4 space-y-1">
                              <div>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                                    st.status === "actif"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : st.status === "inscrit" || st.status === "termine" || st.status === "alumni"
                                      ? "bg-blue-100 text-blue-800"
                                      : st.status === "preinscrit"
                                      ? "bg-amber-100 text-amber-800"
                                      : st.status === "rejete"
                                      ? "bg-rose-100 text-rose-700"
                                      : "bg-slate-100 text-slate-600"
                                  }`}
                                >
                                  {st.status === "preinscrit" && "En attente validation"}
                                  {st.status === "actif" && "Actif"}
                                  {st.status === "inscrit" && "Validé (Inscrit)"}
                                  {st.status === "termine" && "Diplômé"}
                                  {st.status === "rejete" && "Rejeté"}
                                  {!["preinscrit", "actif", "inscrit", "termine", "rejete"].includes(st.status) && st.status}
                                </span>
                              </div>
                              {st.professionalStatus && (
                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-50 text-violet-700 border border-violet-200 block w-fit">
                                  {st.professionalStatus}
                                </span>
                              )}
                            </td>

                            {/* Compétences validées */}
                            <td className="py-3 px-4">
                              {parsedSkills.length > 0 ? (
                                <div className="flex flex-wrap gap-1 max-w-[220px]">
                                  {parsedSkills.slice(0, 4).map((sk, idx) => (
                                    <span
                                      key={idx}
                                      className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                                    >
                                      {sk}
                                    </span>
                                  ))}
                                  {parsedSkills.length > 4 && (
                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600">
                                      +{parsedSkills.length - 4}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">Non renseignées</span>
                              )}
                            </td>

                            {/* CV */}
                            <td className="py-3 px-4 whitespace-nowrap">
                              {st.cvUrl ? (
                                <a
                                  href={st.cvUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  download
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
                                  title="Consulter le CV (PDF)"
                                >
                                  <FileText className="w-3.5 h-3.5 text-red-600" />
                                  <span>CV PDF ↗</span>
                                </a>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">Aucun CV</span>
                              )}
                            </td>

                            {/* Page Entreprises Toggle */}
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <button
                                onClick={() => handleToggleVisibility(st)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold transition-all border ${
                                  st.profileVisible
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300"
                                    : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
                                }`}
                                title={st.profileVisible ? "Visible sur Entreprises. Cliquer pour masquer." : "Masqué. Cliquer pour afficher sur Entreprises."}
                              >
                                {st.profileVisible ? (
                                  <>
                                    <Eye className="w-3 h-3 text-emerald-600" />
                                    <span>En ligne</span>
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3 h-3 text-slate-400" />
                                    <span>Masqué</span>
                                  </>
                                )}
                              </button>
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                              <button
                                onClick={() => handleOpenEditStudent(st)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                title="Modifier toutes les informations du profil"
                              >
                                <Pencil className="w-3 h-3" />
                                <span>Modifier</span>
                              </button>

                              <button
                                onClick={() => {
                                  setSelectedStudentForStatus(st);
                                  setNewStatusValue(st.status);
                                }}
                                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Changer le statut administratif"
                              >
                                Statut
                              </button>

                              <button
                                onClick={() => handleDeleteStudent(st)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                title="Supprimer définitivement ce profil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
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

      {/* MODAL: CRÉER UN PROFIL ÉTUDIANT & TALENT ENTREPRISE */}
      {showNewStudentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Nouveau Profil Étudiant &amp; Talent
                  </h3>
                  <p className="text-xs text-slate-500">
                    Renseignez les compétences, photo et CV pour alimenter le vivier de la page Entreprises.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewStudentModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-5 text-xs">
              {/* SECTION 1: IDENTITÉ & CONTACT */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. Identité &amp; Coordonnées</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom de famille *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : DOSSOU"
                      value={newStudentForm.lastName}
                      onChange={(e) =>
                        setNewStudentForm((prev) => ({ ...prev, lastName: e.target.value.toUpperCase() }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Prénom(s) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex : Arnaud"
                      value={newStudentForm.firstName}
                      onChange={(e) =>
                        setNewStudentForm((prev) => ({ ...prev, firstName: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Téléphone *</label>
                    <input
                      type="text"
                      required
                      placeholder="+229 97 00 00 00"
                      value={newStudentForm.phone}
                      onChange={(e) =>
                        setNewStudentForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="etudiant@futurcraft.bj"
                      value={newStudentForm.email}
                      onChange={(e) =>
                        setNewStudentForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ville / Campus</label>
                    <input
                      type="text"
                      value={newStudentForm.city}
                      onChange={(e) =>
                        setNewStudentForm((prev) => ({ ...prev, city: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: FORMATION & STATUTS */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>2. Formation &amp; Statut Professionnel</span>
                </h4>

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <label className="block font-bold text-slate-800 text-xs">
                      Intitulé de la Formation suivie à FuturCraft *
                    </label>
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      ✍️ Saisie libre ou sélection catalogue
                    </span>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Ex : Développement Web Fullstack, Intelligence Artificielle & Robotique, Pilotage de Drone..."
                    value={newStudentForm.customFormation}
                    onChange={(e) =>
                      setNewStudentForm((prev) => ({ ...prev, customFormation: e.target.value }))
                    }
                    className="w-full p-2.5 rounded-xl border-2 border-blue-200 bg-white font-bold text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-2xs text-xs"
                  />

                  <div className="pt-1">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Ou sélectionner parmi nos {formations.length} formations du catalogue pour pré-remplir :
                    </label>
                    <select
                      value={newStudentForm.formationId}
                      onChange={(e) => {
                        const selId = Number(e.target.value);
                        const selFormation = formations.find((f) => f.id === selId);
                        setNewStudentForm((prev) => ({
                          ...prev,
                          formationId: selId,
                          customFormation: selFormation ? selFormation.title : prev.customFormation,
                        }));
                      }}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-white focus:bg-white transition-colors"
                    >
                      {Object.entries(formationsByCategory).map(([cat, items]) => (
                        <optgroup key={cat} label={`📂 ${cat} (${items.length})`}>
                          {items.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.title} — {f.duration} ({f.price.toLocaleString("fr-FR")} FCFA)
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Aperçu interactif du cursus sélectionné avec import de compétences */}
                  {(() => {
                    const selF = formations.find((f) => f.id === Number(newStudentForm.formationId));
                    if (!selF) return null;
                    let toolsList: string[] = [];
                    if (selF.tools) {
                      try {
                        const parsed = JSON.parse(selF.tools);
                        if (Array.isArray(parsed)) toolsList = parsed.map(String);
                      } catch {}
                    }
                    return (
                      <div className="mt-2 p-3 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white">
                              {selF.category}
                            </span>
                            <span className="font-bold text-slate-800 text-[11px]">{selF.title}</span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500">
                            Durée : <strong>{selF.duration}</strong> • {selF.campus}
                          </span>
                        </div>
                        {toolsList.length > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-blue-100">
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="text-[10px] font-bold text-slate-500">Compétences du cursus :</span>
                              {toolsList.slice(0, 6).map((t, idx) => (
                                <span key={idx} className="text-[10px] font-semibold text-blue-800 bg-white px-1.5 py-0.5 rounded border border-blue-200 shadow-2xs">
                                  {t}
                                </span>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const merged = Array.from(new Set([...newStudentForm.skills, ...toolsList]));
                                setNewStudentForm((prev) => ({ ...prev, skills: merged }));
                              }}
                              className="text-[10px] font-bold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-300 transition-colors shrink-0 shadow-2xs"
                              title="Ajouter automatiquement toutes les compétences de ce cursus"
                            >
                              + Importer ces compétences
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Statut administratif *</label>
                    <select
                      value={newStudentForm.status}
                      onChange={(e) =>
                        setNewStudentForm((prev) => ({ ...prev, status: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="actif">Étudiant Actif</option>
                      <option value="inscrit">Inscrit (Validé)</option>
                      <option value="termine">Formation terminée / Diplômé</option>
                      <option value="alumni">Alumni</option>
                      <option value="preinscrit">Préinscrit</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Disponibilité pour les Entreprises *</label>
                    <select
                      value={newStudentForm.professionalStatus}
                      onChange={(e) =>
                        setNewStudentForm((prev) => ({ ...prev, professionalStatus: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-blue-700"
                    >
                      <option value="Disponible immédiatement">Disponible immédiatement</option>
                      <option value="À la recherche d'un stage">À la recherche d&apos;un stage</option>
                      <option value="À la recherche d'une alternance">À la recherche d&apos;une alternance</option>
                      <option value="En poste / Freelance">En poste / Freelance</option>
                      <option value="En formation active">En formation active</option>
                      <option value="Diplômé disponible">Diplômé disponible</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: COMPÉTENCES DES ÉTUDIANTS */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>3. Compétences validées</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Ces compétences apparaîtront sur la fiche Entreprise
                  </span>
                </div>

                {/* Tag Input */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {newStudentForm.skills.length === 0 ? (
                      <span className="text-slate-400 italic text-[11px]">
                        Aucune compétence ajoutée. Choisissez parmi les suggestions ci-dessous ou tapez une compétence.
                      </span>
                    ) : (
                      newStudentForm.skills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-slate-800 border border-slate-300 shadow-2xs"
                        >
                          {sk}
                          <button
                            type="button"
                            onClick={() =>
                              setNewStudentForm((prev) => ({
                                ...prev,
                                skills: prev.skills.filter((_, i) => i !== idx),
                              }))
                            }
                            className="text-slate-400 hover:text-rose-600 ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ajouter une compétence personnalisée (ex: React, Docker, Figma, Python...)"
                      value={newStudentForm.newSkillInput}
                      onChange={(e) =>
                        setNewStudentForm((prev) => ({ ...prev, newSkillInput: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = newStudentForm.newSkillInput.trim();
                          if (val && !newStudentForm.skills.includes(val)) {
                            setNewStudentForm((prev) => ({
                              ...prev,
                              skills: [...prev.skills, val],
                              newSkillInput: "",
                            }));
                          }
                        }
                      }}
                      className="flex-1 p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = newStudentForm.newSkillInput.trim();
                        if (val && !newStudentForm.skills.includes(val)) {
                          setNewStudentForm((prev) => ({
                            ...prev,
                            skills: [...prev.skills, val],
                            newSkillInput: "",
                          }));
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shrink-0"
                    >
                      Ajouter
                    </button>
                  </div>

                  {/* Suggestions rapides */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">
                      Suggestions rapides (cliquez pour ajouter) :
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {[
                        "React",
                        "Next.js",
                        "TypeScript",
                        "Node.js",
                        "PostgreSQL",
                        "Tailwind CSS",
                        "Python",
                        "Figma",
                        "UI/UX Design",
                        "Docker",
                        "Git & GitHub",
                        "Télépilotage Drone",
                        "SEO & Ads",
                        "API REST",
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (!newStudentForm.skills.includes(tag)) {
                              setNewStudentForm((prev) => ({
                                ...prev,
                                skills: [...prev.skills, tag],
                              }));
                            }
                          }}
                          disabled={newStudentForm.skills.includes(tag)}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                            newStudentForm.skills.includes(tag)
                              ? "bg-slate-200 text-slate-400 border-slate-200 cursor-default"
                              : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50 cursor-pointer"
                          }`}
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: PHOTO D'IDENTITÉ & CV */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>4. Photo d&apos;identité &amp; CV (Documents)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Photo d'identité */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block font-bold text-slate-700">Photo d&apos;identité</label>
                    <div className="flex items-center gap-3">
                      {newStudentForm.avatarUrl ? (
                        <div className="relative group shrink-0">
                          <Image
                            src={newStudentForm.avatarUrl}
                            alt="Aperçu photo"
                            width={52}
                            height={52}
                            unoptimized
                            className="w-13 h-13 rounded-full object-cover border-2 border-blue-400 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setNewStudentForm((p) => ({ ...p, avatarUrl: "" }))}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-[10px] shadow"
                            title="Supprimer la photo"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="w-13 h-13 rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0 text-xs">
                          Photo
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingPhoto ? "Envoi..." : "Téléverser photo"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingPhoto}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleUploadFile(f, "avatar", "new");
                            }}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Ou collez l'URL d'une image..."
                          value={newStudentForm.avatarUrl}
                          onChange={(e) =>
                            setNewStudentForm((p) => ({ ...p, avatarUrl: e.target.value }))
                          }
                          className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CV de l'étudiant */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block font-bold text-slate-700">Curriculum Vitae (CV PDF)</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingCv ? "Envoi..." : "Téléverser CV (PDF)"}</span>
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            disabled={isUploadingCv}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleUploadFile(f, "cv", "new");
                            }}
                            className="hidden"
                          />
                        </label>
                        {newStudentForm.cvUrl && (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>PDF prêt</span>
                            <button
                              type="button"
                              onClick={() => setNewStudentForm((p) => ({ ...p, cvUrl: "" }))}
                              className="text-slate-400 hover:text-rose-600 ml-1 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Ou collez l'URL d'un CV en ligne (PDF / Drive)..."
                        value={newStudentForm.cvUrl}
                        onChange={(e) =>
                          setNewStudentForm((p) => ({ ...p, cvUrl: e.target.value }))
                        }
                        className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: VISIBILITÉ SUR LA PAGE ENTREPRISES */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">
                      Publier sur la page Entreprises (Recrutement)
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Ce profil sera immédiatement visible par les recruteurs avec ses compétences, son CV et sa photo.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={newStudentForm.profileVisible}
                    onChange={(e) =>
                      setNewStudentForm((p) => ({ ...p, profileVisible: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isCreatingStudent}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {isCreatingStudent
                      ? "Création et publication en cours..."
                      : "Créer et enregistrer le profil étudiant"}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewStudentModal(false)}
                  className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MODIFIER UN PROFIL ÉTUDIANT & TALENT */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-blue-600 text-white flex items-center justify-center shadow-md">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      Modifier le Profil de {editingStudent.firstName} {editingStudent.lastName}
                    </h3>
                    {editStudentForm.profileVisible ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        En ligne sur Entreprises
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                        Profil Masqué
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="font-mono text-blue-600 font-bold">Matricule : {editingStudent.studentNumber}</span>
                    <span>•</span>
                    <span>Modifications synchronisées avec la page Entreprises</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStudent} className="space-y-5 text-xs">
              {/* SECTION 1: IDENTITÉ & CONTACT */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  <span>1. Identité &amp; Coordonnées</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nom de famille *</label>
                    <input
                      type="text"
                      required
                      value={editStudentForm.lastName}
                      onChange={(e) =>
                        setEditStudentForm((prev) => ({ ...prev, lastName: e.target.value.toUpperCase() }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Prénom(s) *</label>
                    <input
                      type="text"
                      required
                      value={editStudentForm.firstName}
                      onChange={(e) =>
                        setEditStudentForm((prev) => ({ ...prev, firstName: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Téléphone *</label>
                    <input
                      type="text"
                      required
                      value={editStudentForm.phone}
                      onChange={(e) =>
                        setEditStudentForm((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={editStudentForm.email}
                      onChange={(e) =>
                        setEditStudentForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ville / Campus</label>
                    <input
                      type="text"
                      value={editStudentForm.city}
                      onChange={(e) =>
                        setEditStudentForm((prev) => ({ ...prev, city: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: FORMATION & STATUTS */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span>2. Formation &amp; Statut Professionnel</span>
                </h4>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-800 text-xs">
                      Intitulé de la Formation suivie à FuturCraft *
                    </label>
                    <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      ✍️ Saisie libre ou sélection catalogue
                    </span>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Ex : Développement Web Fullstack, Intelligence Artificielle & Robotique, Pilotage de Drone..."
                    value={editStudentForm.customFormation}
                    onChange={(e) =>
                      setEditStudentForm((prev) => ({ ...prev, customFormation: e.target.value }))
                    }
                    className="w-full p-2.5 rounded-xl border-2 border-blue-200 bg-white font-bold text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 shadow-2xs text-xs"
                  />

                  <div className="pt-1">
                    <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                      Ou sélectionner parmi nos {formations.length} formations du catalogue pour pré-remplir :
                    </label>
                    <select
                      value={editStudentForm.formationId}
                      onChange={(e) => {
                        const selId = Number(e.target.value);
                        const selFormation = formations.find((f) => f.id === selId);
                        setEditStudentForm((prev) => ({
                          ...prev,
                          formationId: selId,
                          customFormation: selFormation ? selFormation.title : prev.customFormation,
                        }));
                      }}
                      className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 hover:bg-white focus:bg-white transition-colors"
                    >
                      {Object.entries(formationsByCategory).map(([cat, items]) => (
                        <optgroup key={cat} label={`📂 ${cat} (${items.length})`}>
                          {items.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.title} — {f.duration} ({f.price.toLocaleString("fr-FR")} FCFA)
                            </option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {/* Aperçu interactif du cursus sélectionné avec import de compétences */}
                  {(() => {
                    const selF = formations.find((f) => f.id === Number(editStudentForm.formationId));
                    if (!selF) return null;
                    let toolsList: string[] = [];
                    if (selF.tools) {
                      try {
                        const parsed = JSON.parse(selF.tools);
                        if (Array.isArray(parsed)) toolsList = parsed.map(String);
                      } catch {}
                    }
                    return (
                      <div className="mt-2 p-3 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-2 text-xs">
                        <div className="flex flex-wrap items-center justify-between gap-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white">
                              {selF.category}
                            </span>
                            <span className="font-bold text-slate-800 text-[11px]">{selF.title}</span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500">
                            Durée : <strong>{selF.duration}</strong> • {selF.campus}
                          </span>
                        </div>
                        {toolsList.length > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-blue-100">
                            <div className="flex flex-wrap items-center gap-1">
                              <span className="text-[10px] font-bold text-slate-500">Compétences du cursus :</span>
                              {toolsList.slice(0, 6).map((t, idx) => (
                                <span key={idx} className="text-[10px] font-semibold text-blue-800 bg-white px-1.5 py-0.5 rounded border border-blue-200 shadow-2xs">
                                  {t}
                                </span>
                              ))}
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const merged = Array.from(new Set([...editStudentForm.skills, ...toolsList]));
                                setEditStudentForm((prev) => ({ ...prev, skills: merged }));
                              }}
                              className="text-[10px] font-bold text-blue-700 hover:text-blue-900 bg-white hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-300 transition-colors shrink-0 shadow-2xs"
                              title="Ajouter automatiquement toutes les compétences de ce cursus"
                            >
                              + Importer ces compétences
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Statut administratif *</label>
                    <select
                      value={editStudentForm.status}
                      onChange={(e) =>
                        setEditStudentForm((prev) => ({ ...prev, status: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="actif">Étudiant Actif</option>
                      <option value="inscrit">Inscrit (Validé)</option>
                      <option value="termine">Formation terminée / Diplômé</option>
                      <option value="alumni">Alumni</option>
                      <option value="preinscrit">Préinscrit</option>
                      <option value="rejete">Rejeté</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Disponibilité pour les Entreprises *</label>
                    <select
                      value={editStudentForm.professionalStatus}
                      onChange={(e) =>
                        setEditStudentForm((prev) => ({ ...prev, professionalStatus: e.target.value }))
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-semibold text-blue-700"
                    >
                      <option value="Disponible immédiatement">Disponible immédiatement</option>
                      <option value="À la recherche d'un stage">À la recherche d&apos;un stage</option>
                      <option value="À la recherche d'une alternance">À la recherche d&apos;une alternance</option>
                      <option value="En poste / Freelance">En poste / Freelance</option>
                      <option value="En formation active">En formation active</option>
                      <option value="Diplômé disponible">Diplômé disponible</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* SECTION 3: COMPÉTENCES */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>3. Compétences validées</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Affichées sur la fiche Entreprises
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                  <div className="flex flex-wrap gap-1.5">
                    {editStudentForm.skills.length === 0 ? (
                      <span className="text-slate-400 italic text-[11px]">
                        Aucune compétence renseignée.
                      </span>
                    ) : (
                      editStudentForm.skills.map((sk, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-slate-800 border border-slate-300 shadow-2xs"
                        >
                          {sk}
                          <button
                            type="button"
                            onClick={() =>
                              setEditStudentForm((prev) => ({
                                ...prev,
                                skills: prev.skills.filter((_, i) => i !== idx),
                              }))
                            }
                            className="text-slate-400 hover:text-rose-600 ml-0.5"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ajouter une compétence..."
                      value={editStudentForm.newSkillInput}
                      onChange={(e) =>
                        setEditStudentForm((prev) => ({ ...prev, newSkillInput: e.target.value }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const val = editStudentForm.newSkillInput.trim();
                          if (val && !editStudentForm.skills.includes(val)) {
                            setEditStudentForm((prev) => ({
                              ...prev,
                              skills: [...prev.skills, val],
                              newSkillInput: "",
                            }));
                          }
                        }
                      }}
                      className="flex-1 p-2 rounded-xl border border-slate-200 bg-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const val = editStudentForm.newSkillInput.trim();
                        if (val && !editStudentForm.skills.includes(val)) {
                          setEditStudentForm((prev) => ({
                            ...prev,
                            skills: [...prev.skills, val],
                            newSkillInput: "",
                          }));
                        }
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shrink-0"
                    >
                      Ajouter
                    </button>
                  </div>

                  {/* Suggestions rapides */}
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-400 block mb-1">
                      Suggestions rapides :
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {[
                        "React",
                        "Next.js",
                        "TypeScript",
                        "Node.js",
                        "PostgreSQL",
                        "Tailwind CSS",
                        "Python",
                        "Figma",
                        "UI/UX Design",
                        "Docker",
                        "Git & GitHub",
                        "Télépilotage Drone",
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (!editStudentForm.skills.includes(tag)) {
                              setEditStudentForm((prev) => ({
                                ...prev,
                                skills: [...prev.skills, tag],
                              }));
                            }
                          }}
                          disabled={editStudentForm.skills.includes(tag)}
                          className={`px-2 py-0.5 rounded text-[10px] font-medium border transition-colors ${
                            editStudentForm.skills.includes(tag)
                              ? "bg-slate-200 text-slate-400 border-slate-200 cursor-default"
                              : "bg-white text-blue-700 border-blue-200 hover:bg-blue-50 cursor-pointer"
                          }`}
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 4: PHOTO & CV */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>4. Photo d&apos;identité &amp; CV (Documents)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Photo */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block font-bold text-slate-700">Photo d&apos;identité</label>
                    <div className="flex items-center gap-3">
                      {editStudentForm.avatarUrl ? (
                        <div className="relative group shrink-0">
                          <Image
                            src={editStudentForm.avatarUrl}
                            alt="Photo"
                            width={52}
                            height={52}
                            unoptimized
                            className="w-13 h-13 rounded-full object-cover border-2 border-blue-400 shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => setEditStudentForm((p) => ({ ...p, avatarUrl: "" }))}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-[10px] shadow"
                            title="Supprimer la photo"
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <div className="w-13 h-13 rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 shrink-0 text-xs">
                          Photo
                        </div>
                      )}
                      <div className="flex-1 space-y-1">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingPhoto ? "Envoi..." : "Changer photo"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingPhoto}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleUploadFile(f, "avatar", "edit");
                            }}
                            className="hidden"
                          />
                        </label>
                        <input
                          type="text"
                          placeholder="Ou collez l'URL d'une image..."
                          value={editStudentForm.avatarUrl}
                          onChange={(e) =>
                            setEditStudentForm((p) => ({ ...p, avatarUrl: e.target.value }))
                          }
                          className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CV */}
                  <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <label className="block font-bold text-slate-700">Curriculum Vitae (PDF)</label>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingCv ? "Envoi..." : "Remplacer le CV (PDF)"}</span>
                          <input
                            type="file"
                            accept=".pdf,application/pdf"
                            disabled={isUploadingCv}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleUploadFile(f, "cv", "edit");
                            }}
                            className="hidden"
                          />
                        </label>
                        {editStudentForm.cvUrl && (
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>PDF actif</span>
                            <button
                              type="button"
                              onClick={() => setEditStudentForm((p) => ({ ...p, cvUrl: "" }))}
                              className="text-slate-400 hover:text-rose-600 ml-1 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="Ou collez l'URL d'un CV en ligne (PDF / Drive)..."
                        value={editStudentForm.cvUrl}
                        onChange={(e) =>
                          setEditStudentForm((p) => ({ ...p, cvUrl: e.target.value }))
                        }
                        className="w-full p-1.5 rounded-lg border border-slate-200 bg-white text-[11px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 5: VISIBILITÉ ENTREPRISES */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Eye className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">
                      Afficher ce profil sur la page Entreprises
                    </h5>
                    <p className="text-[11px] text-slate-500">
                      Rend le profil immédiatement consultable par les recruteurs et entreprises partenaires.
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={editStudentForm.profileVisible}
                    onChange={(e) =>
                      setEditStudentForm((p) => ({ ...p, profileVisible: e.target.checked }))
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  disabled={isSavingStudent}
                  className="flex-1 py-3 rounded-2xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
                >
                  {isSavingStudent ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Annuler
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
                <option value="preinscrit">Préinscrit (en attente de validation)</option>
                <option value="rejete">Rejeté</option>
                <option value="inscrit">Inscrit (validé)</option>
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

      {validationTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto ${
              validationAction === "validate" ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
            }`}>
              {validationAction === "validate" ? (
                <CheckCircle2 className="w-6 h-6" />
              ) : (
                <AlertTriangle className="w-6 h-6" />
              )}
            </div>
            <h3 className="text-base font-bold text-slate-900 text-center">
              {validationAction === "validate"
                ? `Valider ${validationTarget.firstName} ${validationTarget.lastName} ?`
                : `Rejeter le dossier de ${validationTarget.firstName} ${validationTarget.lastName} ?`}
            </h3>
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              {validationAction === "validate"
                ? "Le compte sera activé, une notification sera envoyée à l'étudiant et son profil apparaîtra sur la page Entreprises."
                : "Le compte restera fermé et l'étudiant sera notifié de la décision."}
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600">
                Note pour l&apos;étudiant {validationAction === "validate" ? "(optionnel)" : ""}
              </label>
              <textarea
                value={validationNote}
                onChange={(e) => setValidationNote(e.target.value)}
                rows={3}
                placeholder={validationAction === "reject" ? "Précisez la raison du rejet (ex : dossier incomplet)..." : "Ajoutez un message de bienvenue..."}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs"
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
