"use client";

import { useState } from "react";
import { useToast } from "@/components/Toast";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Smartphone,
} from "lucide-react";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { PageIntro } from "@/components/PageIntro";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Renseignement sur les formations",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");
      setSubmitted(true);
      showToast({
        type: "success",
        title: "Message envoyé !",
        message: `Merci ${form.name}, notre équipe a bien reçu votre demande et vous contactera très prochainement.`,
      });
    } catch (err: any) {
      showToast({
        type: "error",
        title: "Échec de l'envoi",
        message: err?.message || "Une erreur est survenue. Réessayez ou contactez-nous par WhatsApp.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-fc-bg)]">
      <PageIntro
        eyebrow="Échange direct & orientation"
        title="Parlons de votre prochain projet."
        description="Nos équipes pédagogiques et administratives sont à votre écoute pour vous guider vers le métier du numérique qui vous correspond."
      />
      <div className="page-container py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-white p-7 sm:p-8">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">Coordonnées</p>
              <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--color-fc-black)]">Parlons de ton projet</h2>

              <div className="mt-8 space-y-6 text-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]"><MapPin className="h-4 w-4" /></div>
                  <div>
                    <p className="font-semibold text-[var(--color-fc-black)]">Campus FuturCraft</p>
                    <p className="mt-1 leading-7 text-[var(--color-fc-gray-mid)]">Godomey, Supermarché O Bénin, avant pk14, Abomey-Calavi</p>
                    <a href="https://www.google.com/maps/search/?api=1&query=Godomey+Supermarche+O+Benin+pk14+Abomey-Calavi" target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-fc-primary)] hover:underline">
                      <MapPin className="h-3.5 w-3.5" /> Ouvrir dans Google Maps
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]"><Phone className="h-4 w-4" /></div>
                  <div>
                    <p className="font-semibold text-[var(--color-fc-black)]">Téléphone & WhatsApp</p>
                    <a href="tel:+22943327832" className="mt-1 block text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-primary)]">+229 43 32 78 32</a>
                    <a href="tel:+2290197303050" className="block text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-primary)]">+229 01 97 30 30 50</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]"><Mail className="h-4 w-4" /></div>
                  <div>
                    <p className="font-semibold text-[var(--color-fc-black)]">Email</p>
                    <a href="mailto:futurcraftinstitut@gmail.com" className="mt-1 block text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-primary)]">futurcraftinstitut@gmail.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]"><Clock className="h-4 w-4" /></div>
                  <div>
                    <p className="font-semibold text-[var(--color-fc-black)]">Horaires</p>
                    <p className="mt-1 leading-7 text-[var(--color-fc-gray-mid)]">Lun – Ven : 09h–13h / 19h–22h30<br />Samedi : 09h–14h</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-[var(--color-fc-gray-light)] pt-6">
                <WhatsAppButton defaultMessage="Bonjour, je souhaite des informations sur les formations FuturCraft" variant="default" />
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-[var(--color-fc-gray-light)] bg-white p-7 sm:p-10 lg:col-span-7">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[var(--color-fc-primary)]">Message</p>
            <h2 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-[var(--color-fc-black)]">Écris-nous</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-fc-gray-mid)]">
              Décris ton besoin, on te répond rapidement avec les informations utiles.
            </p>

            {submitted ? (
              <div className="mt-8 rounded-2xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-fc-primary)]/[0.08] text-[var(--color-fc-primary)]">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <h4 className="mt-5 font-display text-xl font-bold text-[var(--color-fc-black)]">Message envoyé</h4>
                <p className="mt-2 text-sm leading-7 text-[var(--color-fc-gray-mid)]">
                  Merci {form.name}, notre équipe te recontactera très vite.
                </p>
                <button onClick={() => setSubmitted(false)} className="mt-5 text-sm font-bold text-[var(--color-fc-primary)] hover:underline">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--color-fc-black)]">Nom complet *</span>
                    <input type="text" required placeholder="ex: Jean DOSSOU" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-fc-primary)]" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--color-fc-black)]">Email *</span>
                    <input type="email" required placeholder="vous@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-fc-primary)]" />
                  </label>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--color-fc-black)]">Téléphone *</span>
                    <input type="text" required placeholder="+229 ..." value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-fc-primary)]" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-[var(--color-fc-black)]">Objet *</span>
                    <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-fc-primary)]">
                      <option value="Renseignement sur les formations">Renseignement sur les formations</option>
                      <option value="Candidature & Inscription">Candidature & Inscription</option>
                      <option value="Modalités de paiement">Modalités de paiement</option>
                      <option value="Partenariat entreprise">Partenariat entreprise</option>
                      <option value="Autre demande">Autre demande</option>
                    </select>
                  </label>
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[var(--color-fc-black)]">Message *</span>
                  <textarea rows={5} required placeholder="Explique ton projet ou ta question..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="w-full rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)] px-4 py-3 text-sm outline-none transition-colors focus:border-[var(--color-fc-primary)]" />
                </label>
                <button type="submit" disabled={submitting} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-fc-deep)] px-6 py-3.5 text-sm font-bold text-white transition-colors hover:bg-[var(--color-fc-primary)] disabled:opacity-60 sm:w-auto">
                  {submitting ? "Envoi en cours..." : (<><Send className="h-4 w-4" /> Envoyer le message</>)}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
