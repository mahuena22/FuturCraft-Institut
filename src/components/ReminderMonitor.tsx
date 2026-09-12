"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  Mail,
  Bell,
  RefreshCw,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Download,
} from "lucide-react";

interface OverdueSchedule {
  id: number;
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  title: string;
  amount: number;
  dueDate: string;
  formationTitle: string;
  daysOverdue: number;
}

interface ReminderStats {
  totalOverdue: number;
  remindersSent: number;
  emailsSent: number;
  notificationsCreated: number;
  totalOverdueAmount: number;
}

export function ReminderMonitor() {
  const [overdueSchedules, setOverdueSchedules] = useState<OverdueSchedule[]>([]);
  const [stats, setStats] = useState<ReminderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggerLoading, setTriggerLoading] = useState(false);
  const [lastRun, setLastRun] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOverdue = async () => {
    setLoading(true);
    setError(null);
    try {
      const statsRes = await fetch("/api/admin/reminders/stats");
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      const overdueRes = await fetch("/api/admin/reminders/overdue");
      if (overdueRes.ok) {
        const overdueData = await overdueRes.json();
        setOverdueSchedules(overdueData);
      }
    } catch (error) {
      setError("Erreur lors du chargement des données");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const triggerReminders = async (type: "overdue" | "upcoming") => {
    setTriggerLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cron/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, secret: process.env.NEXT_PUBLIC_CRON_SECRET || "" }),
      });

      if (!res.ok) throw new Error("Erreur lors du déclenchement");

      const result = await res.json();
      alert(`${result.remindersSent} rappels envoyés (${result.emailsSent} emails)`);
      setLastRun(new Date().toLocaleString("fr-FR"));
      fetchOverdue();
    } catch (error) {
      setError("Erreur lors du déclenchement: " + error);
    } finally {
      setTriggerLoading(false);
    }
  };

  const triggerUpcomingReminders = async () => {
    setTriggerLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cron/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "upcoming", secret: process.env.NEXT_PUBLIC_CRON_SECRET || "" }),
      });

      if (!res.ok) throw new Error("Erreur lors du déclenchement");

      const result = await res.json();
      alert(`${result.remindersSent} rappels envoyés (${result.emailsSent} emails)`);
      setLastRun(new Date().toLocaleString("fr-FR"));
      fetchOverdue();
    } catch (error) {
      setError("Erreur lors du déclenchement: " + error);
    } finally {
      setTriggerLoading(false);
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("fr-FR");
  const formatAmount = (amount: number) => amount.toLocaleString("fr-FR") + " FCFA";

  const getSeverityColor = (days: number) => {
    if (days > 30) return "text-red-600 bg-red-50 border-red-200";
    if (days > 15) return "text-orange-600 bg-orange-50 border-orange-200";
    if (days > 7) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-blue-600 bg-blue-50 border-blue-200";
  };

  const renderTbody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6} className="px-4 py-12 text-center text-[var(--color-fc-gray-mid)]">
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-[var(--color-fc-primary)] border-t-transparent rounded-full animate-spin" />
              <span>Chargement...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (overdueSchedules.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="px-4 py-12 text-center text-[var(--color-fc-gray-mid)]">
            <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-2" />
            <p className="font-medium">Aucune échéance en retard</p>
            <p className="text-sm">Tous les paiements sont à jour !</p>
          </td>
        </tr>
      );
    }

    return (
      overdueSchedules.map((schedule) => (
        <tr key={schedule.id} className="hover:bg-[var(--color-fc-gray-light)]/30">
          <td className="px-4 py-3">
            <div>
              <p className="font-medium text-[var(--color-fc-black)]">{schedule.firstName} {schedule.lastName}</p>
              <p className="text-xs text-[var(--color-fc-gray-mid)]">{schedule.studentNumber}</p>
            </div>
          </td>
          <td className="px-4 py-3">
            <p className="text-sm text-[var(--color-fc-gray-mid)]">{schedule.formationTitle}</p>
            <p className="text-xs text-[var(--color-fc-primary)] font-medium">{schedule.title}</p>
          </td>
          <td className="px-4 py-3 text-[var(--color-fc-gray-mid)] text-sm">
            {new Date(schedule.dueDate).toLocaleDateString("fr-FR")}
          </td>
          <td className="px-4 py-3 text-right font-bold text-[var(--color-fc-black)]">
            {schedule.amount.toLocaleString("fr-FR")} FCFA
          </td>
          <td className="px-4 py-3 text-center">
            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSeverityColor(schedule.daysOverdue)}`}>
              {schedule.daysOverdue > 0 ? `${schedule.daysOverdue}j` : "À venir"}
            </span>
          </td>
          <td className="px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-1">
              <a
                href={`mailto:${schedule.email}`}
                className="text-[var(--color-fc-primary)] hover:underline text-xs"
                title={schedule.email}
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/229${schedule.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-500 hover:text-green-600 text-xs"
                title={schedule.phone}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.52 3.48A11.914 11.914 0 0012 0C5.373 0 0 5.373 0 12c0 1.654.376 3.244 1.054 4.723L0 24l6.278-1.667c1.271.62 2.665.954 4.106.954 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </td>
        </tr>
      ))
    );
  };

  useEffect(() => {
    fetchOverdue();
    const interval = setInterval(fetchOverdue, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[var(--color-fc-black)]">Suivi des Rappels de Paiement</h2>
          <p className="text-[var(--color-fc-gray-mid)] text-sm mt-1">
            Suivi des échéances impayées et envoi automatique de rappels
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => triggerReminders("overdue")}
            disabled={triggerLoading}
            className="px-4 py-2 rounded-xl bg-[var(--color-fc-deep)] text-white text-sm font-bold shadow-lg shadow-[var(--color-fc-deep)]/25 transition-all hover:bg-[var(--color-fc-primary)] flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Rafraîchir
          </button>
          <button
            onClick={triggerUpcomingReminders}
            disabled={triggerLoading}
            className="px-4 py-2 rounded-xl bg-[var(--color-fc-primary)] text-[var(--color-fc-bg)] text-sm font-bold hover:bg-[var(--color-fc-deep)] transition-all flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            Rappels à venir (J-3)
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard icon={<AlertTriangle className="w-5 h-5 text-orange-500" />} label="Échéances en retard" value={stats?.totalOverdue || 0} color="text-orange-600" />
        <StatCard icon={<DollarSign className="w-5 h-5 text-red-500" />} label="Montant total en retard" value={stats?.totalOverdueAmount ? formatAmount(stats.totalOverdueAmount) : "0 FCFA"} color="text-red-600" />
        <StatCard icon={<Bell className="w-5 h-5 text-blue-500" />} label="Rappels envoyés" value={stats?.remindersSent || 0} color="text-blue-600" />
        <StatCard icon={<Mail className="w-5 h-5 text-green-500" />} label="Emails envoyés" value={stats?.emailsSent || 0} color="text-green-600" />
        <StatCard icon={<Bell className="w-5 h-5 text-purple-500" />} label="Notifications créées" value={stats?.notificationsCreated || 0} color="text-purple-600" />
      </div>

      <div className="flex items-center justify-between text-sm text-[var(--color-fc-gray-mid)]">
        <span>Dernière mise à jour: {lastRun || "Jamais"}</span>
        <button onClick={fetchOverdue} disabled={loading} className="text-xs text-[var(--color-fc-primary)] hover:underline flex items-center gap-1">
          <RefreshCw className="w-3 h-3" /> Actualiser
        </button>
      </div>

      <div className="rounded-2xl border border-[var(--color-fc-gray-light)] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[var(--color-fc-gray-light)]/50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-fc-gray-mid)]">Étudiant</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-fc-gray-mid)]">Formation</th>
              <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--color-fc-gray-mid)]">Échéance</th>
              <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-[var(--color-fc-gray-mid)]">Montant</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-[var(--color-fc-gray-mid)]">Retard</th>
              <th className="px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-[var(--color-fc-gray-mid)]">Contact</th>
            </tr>
          </thead>
<tbody className="divide-y divide-[var(--color-fc-gray-light)]">
            {renderTbody()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[var(--color-fc-gray-light)] p-5 shadow-xs">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${color.replace("text-", "bg-")}/10`}>{icon}</div>
        <div>
          <p className="text-xs text-[var(--color-fc-gray-mid)]">{label}</p>
          <p className={`font-black text-lg ${color}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}