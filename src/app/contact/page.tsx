"use client";

import { useState } from "react";
import Image from "next/image";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast({
      type: "success",
      title: "Message envoyé !",
      message: `Merci ${form.name}, notre équipe a bien reçu votre demande et vous contactera très prochainement.`,
    });
  };

  return (
    <div className="bg-[var(--color-fc-bg)] min-h-screen">
      {/* Hero Header */}
      <section className="relative bg-[var(--color-fc-deep)] text-white py-20 lg:py-28 overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/bg-banniere.jpeg"
            alt="FuturCraft Institut"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#051269]/90 via-[#051269]/85 to-[#051269]/95" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-300 bg-blue-900/60 px-3.5 py-1.5 rounded-full border border-blue-400/30">
            Échange Direct &amp; Orientation
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-3xl mx-auto">
            Contactez
            <span className="block text-gradient-brand mt-1">
              FuturCraft Institut
            </span>
          </h1>
          <p className="text-blue-100/80 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Nos équipes pédagogiques et administratives sont à votre écoute pour vous guider vers le métier du numérique qui vous correspond.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-fc-bg)] to-transparent pointer-events-none" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">

        {/* 2 Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Details & Campus */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[var(--color-fc-bg)] p-6 sm:p-8 rounded-3xl border border-[var(--color-fc-gray-light)] space-y-6">
              <h3 className="text-xl font-bold text-[var(--color-fc-black)]">Coordonnées Officielles</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-fc-primary)]/10 text-[var(--color-fc-primary)] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[var(--color-fc-black)] text-sm block">Campus FuturCraft Institut</strong>
                    <span className="text-[var(--color-fc-gray-mid)] leading-relaxed">
                      Godomey, Supermarché O Bénin, avant pk14, Cotonou, Bénin.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-fc-cyan)]/10 text-[var(--color-fc-cyan)] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[var(--color-fc-black)] text-sm block">Téléphone & WhatsApp</strong>
                    <span className="text-[var(--color-fc-gray-mid)] block">+229 43 32 78 32</span>
                    <span className="text-[var(--color-fc-gray-mid)] block">+229 01 97 30 30 50</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-fc-light)]/20 text-[var(--color-fc-light)] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[var(--color-fc-black)] text-sm block">Courrier Électronique</strong>
                    <span className="text-[var(--color-fc-gray-mid)] block">futurcraftinstitut@gmail.com</span>
                    <span className="text-[var(--color-fc-gray-mid)] block">entreprisebenin@gmail.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[var(--color-fc-primary)]/10 text-[var(--color-fc-primary)] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[var(--color-fc-black)] text-sm block">Horaires d&apos;Ouverture</strong>
                    <span className="text-[var(--color-fc-gray-mid)] block">Du Lundi au Vendredi : 09h00 — 13h00 / 19h00 — 22h30</span>
                    <span className="text-[var(--color-fc-gray-mid)] block">Samedi : 09h00 — 14h00</span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="pt-2">
                <WhatsAppButton
                  defaultMessage="Bonjour, je souhaite des informations sur les formations FuturCraft"
                  variant="default"
                />
              </div>
            </div>
          </div>

          {/* Right: Message Form */}
          <div className="lg:col-span-7 bg-[var(--color-fc-bg)] p-6 sm:p-10 rounded-3xl border border-[var(--color-fc-gray-light)] shadow-xs space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-[var(--color-fc-black)]">Envoyez-nous un Message</h3>
              <p className="text-xs text-[var(--color-fc-gray-mid)] mt-1">
                Remplissez ce formulaire et un conseiller pédagogique vous répondra sous 24h.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[var(--color-fc-cyan)]/10 border border-[var(--color-fc-cyan)]/20 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[var(--color-fc-cyan)] mx-auto" />
                <h4 className="text-lg font-bold text-[var(--color-fc-black)]">Message transmis avec succès !</h4>
                <p className="text-xs text-[var(--color-fc-gray-mid)] max-w-sm mx-auto">
                  Merci {form.name}, notre équipe a bien reçu votre demande et vous contactera très prochainement.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-[var(--color-fc-primary)] hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--color-fc-gray-mid)] mb-1">Votre Nom & Prénom *</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Jean DOSSOU"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--color-fc-gray-mid)] mb-1">Adresse Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="votre.email@gmail.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-[var(--color-fc-gray-mid)] mb-1">Numéro de Téléphone *</label>
                    <input
                      type="text"
                      required
                      placeholder="+229 ..."
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--color-fc-gray-mid)] mb-1">Objet de la demande *</label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)] bg-[var(--color-fc-bg)]"
                    >
                      <option value="Renseignement sur les formations">Renseignement sur les formations</option>
                      <option value="Candidature & Inscription">Candidature & Inscription</option>
                      <option value="Modalités de paiement">Modalités de paiement</option>
                      <option value="Partenariat entreprise">Partenariat entreprise</option>
                      <option value="Autre demande">Autre demande</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[var(--color-fc-gray-mid)] mb-1">Votre Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Expliquez-nous votre projet ou posez vos questions..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full p-3 rounded-xl border border-[var(--color-fc-gray-light)]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl text-xs font-bold text-[var(--color-fc-bg)] bg-[var(--color-fc-deep)] hover:bg-[var(--color-fc-primary)] shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Transmettre mon message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
