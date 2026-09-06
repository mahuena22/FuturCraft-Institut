"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  CreditCard,
  FileText,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  Printer,
  Smartphone,
  ExternalLink,
  QrCode,
  ShieldCheck,
  Building,
  RefreshCw,
  LogOut,
  ChevronRight,
  Edit3,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

interface StudentData {
  student: {
    id: number;
    studentNumber: string;
    firstName: string;
    lastName: string;
    gender: string;
    birthDate: string | null;
    city: string | null;
    address: string | null;
    phone: string;
    whatsapp: string | null;
    email: string;
    avatarUrl: string | null;
    studyLevel: string | null;
    status: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    guardianName: string | null;
    guardianPhone: string | null;
  };
  formation: {
    id: number;
    title: string;
    slug: string;
    duration: string;
    campus: string;
    mode: string;
    price: number;
    modules: string;
  } | null;
  promotion: {
    id: number;
    name: string;
    startDate: string;
    campus: string;
  } | null;
  schedules: {
    id: number;
    title: string;
    amount: number;
    dueDate: string;
    status: string;
    paidAt: string | null;
    transactionRef: string | null;
  }[];
  payments: {
    id: number;
    receiptNumber: string;
    amount: number;
    paymentMethod: string;
    transactionRef: string;
    status: string;
    notes: string | null;
    paidAt: string;
  }[];
  receipts: {
    id: number;
    receiptNumber: string;
    paymentId: number;
    verificationCode: string;
    issuedAt: string;
  }[];
  notifications: {
    id: number;
    title: string;
    message: string;
    type: string;
    isRead: boolean | null;
    createdAt: string | Date;
  }[];
}

export function StudentPortal({
  initialData,
}: {
  initialData: StudentData;
}) {
  const [data, setData] = useState<StudentData>(initialData);
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "paiements" | "recus" | "formation" | "documents" | "notifications" | "profil"
  >("dashboard");

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(60000);
  const [paymentMethod, setPaymentMethod] = useState<string>("MTN Mobile Money");
  const [momoNumber, setMomoNumber] = useState<string>(data.student.phone || "+229 ");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<string | null>(null);

  // Receipt Modal State
  const [viewingReceipt, setViewingReceipt] = useState<{
    receiptNumber: string;
    amount: number;
    date: string;
    method: string;
    ref: string;
    verificationCode: string;
  } | null>(null);

  // Profile Edit State
  const [phoneEdit, setPhoneEdit] = useState(data.student.phone);
  const [cityEdit, setCityEdit] = useState(data.student.city || "");
  const [addressEdit, setAddressEdit] = useState(data.student.address || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Reload current student (authenticated session)
  const reloadStudent = async () => {
    try {
      const res = await fetch("/api/student-me");
      if (res.ok) {
        const updated = await res.json();
        setData(updated);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Logout
  const handleLogout = async () => {
    await fetch("/api/student-logout", { method: "POST" });
    window.location.href = "/espace-etudiant/connexion";
  };

  // Payment process simulation
  const handleExecutePayment = async () => {
    if (!paymentAmount || paymentAmount <= 0) return;
    setIsProcessingPayment(true);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: data.student.id,
          scheduleId: selectedScheduleId,
          amount: paymentAmount,
          paymentMethod,
          recordedBy: `En ligne (${paymentMethod} - ${momoNumber})`,
          notes: `Règlement échéance par l'étudiant`,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Erreur de paiement");

      await reloadStudent();
      setIsProcessingPayment(false);
      setPaymentSuccessReceipt(result.receipt.receiptNumber);
    } catch (err: any) {
      alert(err.message || "Erreur lors du paiement");
      setIsProcessingPayment(false);
    }
  };

  // Mark notif as read
  const handleMarkNotifRead = async (notifId: number) => {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationId: notifId }),
    });
    setData((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === notifId ? { ...n, isRead: true } : n
      ),
    }));
  };

  // Save profile edits
  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      const res = await fetch(`/api/student-me`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phoneEdit,
          city: cityEdit,
          address: addressEdit,
        }),
      });
      if (res.ok) {
setProfileSaveSuccess(true);
        setTimeout(() => setProfileSaveSuccess(false), 3000);
        await reloadStudent();
      }
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Financial calculations
  const total = data.student.totalAmount || 1;
  const paid = data.student.paidAmount || 0;
  const remaining = data.student.remainingAmount || 0;
  const progressPercent = Math.min(100, Math.round((paid / total) * 100));

  const unreadNotifsCount = data.notifications.filter((n) => !n.isRead).length;

  const nextPendingSchedule = data.schedules.find((s) => s.status === "en_attente");

  return (
    <div className="min-h-screen bg-slate-50/60 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Session bar */}
        <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-medium">
              Session authentifiée — <span className="font-bold text-slate-700">{data.student.firstName} {data.student.lastName}</span>
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Se déconnecter
          </button>
        </div>

        {/* Student Identity Card Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 border-blue-600 shadow-md shrink-0 relative">
                <Image
                  src={
                    data.student.avatarUrl ||
                    "/images/ange.jpg"
                  }
                  alt={data.student.firstName}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Bonjour {data.student.firstName} 👋
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {data.student.status === "actif"
                      ? "Étudiant actif"
                      : data.student.status === "preinscrit"
                      ? "Préinscrit"
                      : "Inscrit"}
                  </span>
                </div>

                <p className="text-sm font-semibold text-blue-600 mt-0.5">
                  {data.formation?.title || "Formation en cours"}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap">
                  <span className="font-mono font-bold text-slate-700">
                    Matricule : {data.student.studentNumber}
                  </span>
                  <span>•</span>
                  <span>{data.promotion?.name || "Session 2025"}</span>
                  <span>•</span>
                  <span>{data.formation?.campus || "Campus Cotonou"}</span>
                </div>
              </div>
            </div>

            {/* Quick action: Pay now button */}
            {remaining > 0 && (
              <button
                onClick={() => {
                  setSelectedScheduleId(nextPendingSchedule?.id || null);
                  setPaymentAmount(nextPendingSchedule?.amount || 50000);
                  setShowPaymentModal(true);
                }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <CreditCard className="w-4 h-4" />
                <span>Régler une mensualité</span>
              </button>
            )}
          </div>

          {/* Financial Progress Bar (spec: Payé : 240 000 FCFA — Reste : 60 000 FCFA (80%)) */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Progression des frais :</span>
                <span className="text-slate-900 font-extrabold">{progressPercent}%</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span>
                  Payé : <strong className="text-emerald-600">{paid.toLocaleString("fr-FR")} FCFA</strong>
                </span>
                <span className="text-slate-300">|</span>
                <span>
                  Reste à payer : <strong className="text-rose-600">{remaining.toLocaleString("fr-FR")} FCFA</strong>
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500">
                  Total : {total.toLocaleString("fr-FR")} FCFA
                </span>
              </div>
            </div>

            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
              <div
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold border-b border-slate-200">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "dashboard"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <User className="w-4 h-4" />
            <span>Tableau de bord</span>
          </button>

          <button
            onClick={() => setActiveTab("paiements")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "paiements"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Mes Paiements &amp; Échéances</span>
          </button>

          <button
            onClick={() => setActiveTab("recus")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "recus"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Mes Reçus Officiels ({data.receipts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("documents")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "documents"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Attestations &amp; Documents</span>
          </button>

          <button
            onClick={() => setActiveTab("formation")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "formation"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Ma Formation</span>
          </button>

          <button
            onClick={() => setActiveTab("notifications")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 relative ${
              activeTab === "notifications"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
            {unreadNotifsCount > 0 && (
              <span className="w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] flex items-center justify-center">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("profil")}
            className={`px-4 py-3 border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === "profil"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Mon Profil</span>
          </button>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* 3 Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Montant Déjà Réglé
                </span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600">
                  {paid.toLocaleString("fr-FR")} <span className="text-xs font-bold text-slate-500">FCFA</span>
                </div>
                <span className="text-xs text-slate-500 block">
                  {data.payments.length} versement(s) validé(s)
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Reste à Percevoir
                </span>
                <div className="text-2xl sm:text-3xl font-black text-rose-600">
                  {remaining.toLocaleString("fr-FR")} <span className="text-xs font-bold text-slate-500">FCFA</span>
                </div>
                <span className="text-xs text-slate-500 block">
                  {remaining === 0 ? "Formation 100% soldée !" : "Selon échéancier prévu"}
                </span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Prochaine Échéance
                </span>
                <div className="text-lg sm:text-xl font-bold text-slate-900">
                  {nextPendingSchedule ? nextPendingSchedule.dueDate : "Aucune échéance en attente"}
                </div>
                <span className="text-xs text-blue-600 font-semibold block">
                  {nextPendingSchedule
                    ? `${nextPendingSchedule.amount.toLocaleString("fr-FR")} FCFA à régler`
                    : "Situation à jour"}
                </span>
              </div>
            </div>

            {/* Recent Notifications & Quick Actions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Schedules Preview */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900">Situation de l&apos;Échéancier</h3>
                  <button
                    onClick={() => setActiveTab("paiements")}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Voir tout →
                  </button>
                </div>

                <div className="space-y-3">
                  {data.schedules.slice(0, 4).map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{s.title}</span>
                        <span className="text-slate-500 text-[11px]">Échéance : {s.dueDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-slate-900 block">
                          {s.amount.toLocaleString("fr-FR")} FCFA
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${
                            s.status === "paye"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {s.status === "paye" ? "Payé ✓" : "En attente"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications Card */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-blue-600" />
                    Dernières Notifications
                  </h3>
                  <button
                    onClick={() => setActiveTab("notifications")}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    Voir ({unreadNotifsCount})
                  </button>
                </div>

                <div className="space-y-3">
                  {data.notifications.slice(0, 3).map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 rounded-xl border text-xs space-y-1 ${
                        notif.isRead
                          ? "bg-white border-slate-200 text-slate-600"
                          : "bg-blue-50/60 border-blue-200 text-slate-900 font-medium"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{notif.title}</span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(notif.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{notif.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MES PAIEMENTS & ÉCHÉANCIER */}
        {activeTab === "paiements" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Échéancier Personnalisé de Formation</h2>
                <p className="text-xs text-slate-500">
                  Visualisez le calendrier complet de vos versements et effectuez vos règlements en ligne.
                </p>
              </div>

              {remaining > 0 && (
                <button
                  onClick={() => {
                    setSelectedScheduleId(nextPendingSchedule?.id || null);
                    setPaymentAmount(nextPendingSchedule?.amount || 50000);
                    setShowPaymentModal(true);
                  }}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 self-start sm:self-auto"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Payer une mensualité</span>
                </button>
              )}
            </div>

            {/* Schedules Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Échéance / Motif</th>
                      <th className="py-3 px-4">Montant</th>
                      <th className="py-3 px-4">Date Limite</th>
                      <th className="py-3 px-4">Statut</th>
                      <th className="py-3 px-4">Référence</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150">
                    {data.schedules.map((schedule) => (
                      <tr key={schedule.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{schedule.title}</td>
                        <td className="py-3.5 px-4 font-extrabold text-slate-900">
                          {schedule.amount.toLocaleString("fr-FR")} FCFA
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">{schedule.dueDate}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              schedule.status === "paye"
                                ? "bg-emerald-100 text-emerald-800"
                                : schedule.status === "en_retard"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {schedule.status === "paye"
                              ? "Payé ✓"
                              : schedule.status === "en_retard"
                              ? "En retard ⚠️"
                              : "En attente"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                          {schedule.transactionRef || "—"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {schedule.status === "paye" ? (
                            <button
                              onClick={() => {
                                const matchedReceipt = data.receipts[0];
                                if (matchedReceipt) {
                                  setViewingReceipt({
                                    receiptNumber: matchedReceipt.receiptNumber,
                                    amount: schedule.amount,
                                    date: schedule.paidAt || "2025-01-10",
                                    method: "Mobile Money",
                                    ref: schedule.transactionRef || "TRX-AUTO",
                                    verificationCode: matchedReceipt.verificationCode,
                                  });
                                }
                              }}
                              className="text-xs font-bold text-blue-600 hover:underline"
                            >
                              Reçu
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedScheduleId(schedule.id);
                                setPaymentAmount(schedule.amount);
                                setShowPaymentModal(true);
                              }}
                              className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
                            >
                              Régler
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payments History */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Historique des Versements Validés</h3>

              <div className="space-y-3">
                {data.payments.length === 0 ? (
                  <p className="text-xs text-slate-500 italic">Aucun versement enregistré pour le moment.</p>
                ) : (
                  data.payments.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 font-mono text-sm">
                            {p.receiptNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Validé ✓
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px]">
                          Mode : <strong>{p.paymentMethod}</strong> • Date : {p.paidAt} • Réf : {p.transactionRef}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-base font-black text-slate-900">
                          {p.amount.toLocaleString("fr-FR")} FCFA
                        </span>
                        <button
                          onClick={() => {
                            const rec = data.receipts.find((r) => r.paymentId === p.id) || data.receipts[0];
                            setViewingReceipt({
                              receiptNumber: p.receiptNumber,
                              amount: p.amount,
                              date: p.paidAt,
                              method: p.paymentMethod,
                              ref: p.transactionRef,
                              verificationCode: rec?.verificationCode || "FC-SEC-DEFAULT",
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-blue-600 bg-white border border-blue-200 hover:bg-blue-50 transition-colors flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Reçu</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MES REÇUS OFFICIELS */}
        {activeTab === "recus" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Reçus de Paiement Numériques Officiels</h2>
              <p className="text-xs text-slate-500">
                Chaque reçu dispose d&apos;un code de vérification unique et d&apos;un QR code scannable conforme aux normes administratives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.receipts.map((rec) => {
                const payment = data.payments.find((p) => p.id === rec.paymentId) || data.payments[0];
                return (
                  <div
                    key={rec.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                          Reçu Officiel FuturCraft
                        </span>
                        <h4 className="text-lg font-mono font-black text-slate-900">
                          {rec.receiptNumber}
                        </h4>
                        <span className="text-xs text-slate-500 block">Émis le : {rec.issuedAt}</span>
                      </div>

                      <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
                        <QrCode className="w-7 h-7 text-slate-700" />
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-150 text-xs space-y-1 font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Montant :</span>
                        <strong className="text-slate-900">
                          {payment ? payment.amount.toLocaleString("fr-FR") : "—"} FCFA
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Moyen :</span>
                        <span>{payment?.paymentMethod || "Mobile Money"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Code sécurité :</span>
                        <span className="text-blue-600 font-bold">{rec.verificationCode}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() =>
                          setViewingReceipt({
                            receiptNumber: rec.receiptNumber,
                            amount: payment ? payment.amount : 50000,
                            date: rec.issuedAt,
                            method: payment?.paymentMethod || "Mobile Money",
                            ref: payment?.transactionRef || "TRX-AUTO",
                            verificationCode: rec.verificationCode,
                          })
                        }
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Imprimer / PDF</span>
                      </button>

                      <Link
                        href={`/recu/${rec.receiptNumber}`}
                        target="_blank"
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Page publique</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: ATTESTATIONS & DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Documents Administratifs &amp; Scolarité</h2>
              <p className="text-xs text-slate-500">
                Téléchargez vos attestations officielles générées au format PDF certifié pour vos démarches.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Document 1: Attestation d'inscription */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Attestation d&apos;Inscription 2024-2025</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Document officiel certifiant votre inscription en formation professionnelle à FuturCraft Institut.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => window.print()}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger l&apos;Attestation Certifiée</span>
                  </button>
                </div>
              </div>

              {/* Document 2: Certificat de scolarité */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Règlement Intérieur &amp; Charte Pédagogique</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Guide de l&apos;étudiant, critères d&apos;évaluation, modalités de soutenance et charte du matériel informatique.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => alert("Le règlement intérieur est disponible auprès de la scolarité de FuturCraft.")}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Consulter le guide PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: MA FORMATION */}
        {activeTab === "formation" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-xl font-bold text-slate-900">{data.formation?.title}</h2>
              <div className="flex flex-wrap gap-4 text-xs text-slate-600">
                <span>⏱️ Durée : <strong>{data.formation?.duration}</strong></span>
                <span>📍 Campus : <strong>{data.formation?.campus}</strong></span>
                <span>🎓 Mode : <strong>{data.formation?.mode}</strong></span>
              </div>
            </div>

            {/* Modules details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">Progression du Curriculum</h3>
              <div className="space-y-3">
                {data.formation?.modules ? (
                  (JSON.parse(data.formation.modules) as any[]).map((m, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-blue-600">{m.moduleNumber}</span>
                        <span className="text-slate-500 font-medium">{m.duration}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm">{m.title}</h4>
                      <p className="text-slate-600 text-[11px] leading-relaxed">{m.description}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Modules disponibles au secrétariat.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: NOTIFICATIONS */}
        {activeTab === "notifications" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Centre de Notifications</h2>
                <p className="text-xs text-slate-500">Alertes sur vos paiements, événements et documents.</p>
              </div>

              {unreadNotifsCount > 0 && (
                <button
                  onClick={async () => {
                    await fetch("/api/notifications", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ markAllStudentId: data.student.id }),
                    });
                    setData((prev) => ({
                      ...prev,
                      notifications: prev.notifications.map((n) => ({ ...n, isRead: true })),
                    }));
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>

            <div className="space-y-3">
              {data.notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 text-xs ${
                    n.isRead
                      ? "bg-white border-slate-200"
                      : "bg-blue-50/70 border-blue-200 font-medium"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{n.title}</span>
                      {!n.isRead && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-600 text-white">
                          Nouveau
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-xs leading-relaxed">{n.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      {new Date(n.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkNotifRead(n.id)}
                      className="text-[11px] font-bold text-blue-600 hover:underline shrink-0"
                    >
                      Marquer lu
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: MON PROFIL */}
        {activeTab === "profil" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Coordonnées Étudiant</h2>
                <p className="text-xs text-slate-500">
                  Mettez à jour vos coordonnées directes pour recevoir les alertes SMS et WhatsApp.
                </p>
              </div>

              {profileSaveSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profil mis à jour avec succès !</span>
                </div>
              )}

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom complet (Verrouillé)</label>
                  <input
                    type="text"
                    disabled
                    value={`${data.student.firstName} ${data.student.lastName}`}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 font-semibold"
                  />
                  <span className="text-[10px] text-slate-400">
                    Modifiable uniquement par l&apos;administration avec pièce d&apos;identité.
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Matricule Étudiant</label>
                  <input
                    type="text"
                    disabled
                    value={data.student.studentNumber}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-blue-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone d&apos;appel *</label>
                  <input
                    type="text"
                    value={phoneEdit}
                    onChange={(e) => setPhoneEdit(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ville</label>
                  <input
                    type="text"
                    value={cityEdit}
                    onChange={(e) => setCityEdit(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Adresse ou Quartier</label>
                  <input
                    type="text"
                    value={addressEdit}
                    onChange={(e) => setAddressEdit(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-xs flex items-center gap-2"
                  >
                    {isSavingProfile ? <span>Enregistrement...</span> : <span>Enregistrer les modifications</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PAYMENT MODAL GATEWAY SIMULATOR */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>Régler une échéance en ligne</span>
              </h3>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setPaymentSuccessReceipt(null);
                }}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {paymentSuccessReceipt ? (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">Paiement Validé avec Succès !</h4>
                <p className="text-xs text-slate-600">
                  Votre reçu numérique N° <strong>{paymentSuccessReceipt}</strong> a été généré avec QR code sécurisé.
                </p>
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    href={`/recu/${paymentSuccessReceipt}`}
                    target="_blank"
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs"
                  >
                    Voir mon Reçu Officiel
                  </Link>
                  <button
                    onClick={() => {
                      setShowPaymentModal(false);
                      setPaymentSuccessReceipt(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* Method selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Moyen de paiement :</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("MTN Mobile Money")}
                      className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1 ${
                        paymentMethod === "MTN Mobile Money"
                          ? "border-yellow-400 bg-yellow-50 text-slate-900 ring-2 ring-yellow-400"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-yellow-600" />
                      <span>MTN MoMo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("Moov Money")}
                      className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1 ${
                        paymentMethod === "Moov Money"
                          ? "border-blue-500 bg-blue-50 text-slate-900 ring-2 ring-blue-500"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-blue-600" />
                      <span>Moov Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("Carte Bancaire")}
                      className={`p-3 rounded-xl border text-center font-bold flex flex-col items-center gap-1 ${
                        paymentMethod === "Carte Bancaire"
                          ? "border-violet-500 bg-violet-50 text-slate-900 ring-2 ring-violet-500"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-violet-600" />
                      <span>Carte Visa</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Numéro de débit / Compte Mobile Money *
                  </label>
                  <input
                    type="text"
                    value={momoNumber}
                    onChange={(e) => setMomoNumber(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm font-semibold"
                  />
                  <span className="text-[10px] text-slate-400">
                    Bénin : indicatif +229 (MTN Bénin ou Moov Bénin)
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Montant à régler (FCFA) *</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-900"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Frais de passerelle :</span>
                    <strong className="text-emerald-600">0 FCFA (Offerts par FuturCraft)</strong>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total débité :</span>
                    <span>{paymentAmount.toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    disabled={isProcessingPayment}
                    onClick={handleExecutePayment}
                    className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessingPayment ? (
                      <span>Validation de la transaction en cours...</span>
                    ) : (
                      <>
                        <span>Confirmer le paiement de {paymentAmount.toLocaleString("fr-FR")} FCFA</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OFFICIAL DIGITAL RECEIPT PREVIEW MODAL (Printable / Downloadable) */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-10 shadow-2xl space-y-6 my-8 animate-in zoom-in-95 duration-200 print:border-none print:shadow-none">
            {/* Action header */}
            <div className="flex items-center justify-between print:hidden">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                Reçu Numérique Certifié
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer</span>
                </button>
                <button
                  onClick={() => setViewingReceipt(null)}
                  className="text-slate-400 hover:text-slate-600 font-bold p-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Receipt Certificate Container */}
            <div className="border-2 border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 relative bg-white">
              {/* Seal watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <ShieldCheck className="w-80 h-80 text-blue-900" />
              </div>

              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-950">FUTURCRAFT INSTITUT</h2>
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Centre d&apos;Excellence aux Métiers du Numérique • Bénin
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Godomey, Cotonou • IFU : 3202511489201 • contact@futurcraftinstitut.com
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-black text-blue-600 block">
                    {viewingReceipt.receiptNumber}
                  </span>
                  <span className="text-[10px] text-slate-500 block">Date : {viewingReceipt.date}</span>
                </div>
              </div>

              {/* Student details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Étudiant bénéficiaire :</span>
                  <strong className="text-slate-900 text-sm block">
                    {data.student.firstName} {data.student.lastName}
                  </strong>
                  <span className="text-slate-600 text-[11px] font-mono">
                    Matricule : {data.student.studentNumber}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px]">Formation suivie :</span>
                  <strong className="text-slate-900 text-xs block">
                    {data.formation?.title || "Formation Professionnelle"}
                  </strong>
                  <span className="text-slate-500 text-[10px]">
                    {data.formation?.campus || "Campus Cotonou"}
                  </span>
                </div>
              </div>

              {/* Payment Details Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center text-sm font-black text-slate-950 pb-2 border-b border-slate-200">
                  <span>MONTANT TOTAL ENCAISSÉ :</span>
                  <span className="text-emerald-600 text-lg">
                    {viewingReceipt.amount.toLocaleString("fr-FR")} FCFA
                  </span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Mode de règlement :</span>
                  <strong>{viewingReceipt.method}</strong>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Référence de transaction :</span>
                  <span className="font-mono">{viewingReceipt.ref}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Statut légal :</span>
                  <strong className="text-emerald-700">PAYÉ &amp; ENCAISSÉ (SOLDE VALIDÉ)</strong>
                </div>
              </div>

              {/* QR Verification and Security code */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-200 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Code de vérification d&apos;authenticité :
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {viewingReceipt.verificationCode}
                  </span>
                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    Vérifiable sur : futurcraft.bj/recu/{viewingReceipt.receiptNumber}
                  </span>
                </div>

                <div className="w-16 h-16 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-center shrink-0">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
              </div>

              {/* Stamp and signature note */}
              <div className="pt-2 text-center text-[10px] text-slate-400">
                Document généré électroniquement sous mandat de la Direction Financière de FuturCraft Institut. Fait foi de quittance libératoire.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
