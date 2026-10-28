"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  GraduationCap,
  Briefcase,
  Layers,
  Menu,
  X,
  UserCheck,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronDown,
  Code2,
  Cpu,
  Palette,
  Camera,
  TrendingUp,
  Wind,
  Pen,
  Phone,
} from "lucide-react";

const formations = [
  { label: "Développement Web Fullstack", href: "/formation/developpement-web-fullstack", icon: Code2 },
  { label: "IA & Machine Learning", href: "/formation/developpement-intelligence-artificielle", icon: Cpu },
  { label: "Web Design UI/UX", href: "/formation/web-design-ui-ux", icon: Palette },
  { label: "Pilotage de Drone", href: "/formation/pilotage-de-drone", icon: Wind },
  { label: "Marketing Digital", href: "/formation/marketing-digital", icon: TrendingUp },
  { label: "Graphisme & Sérigraphie", href: "/formation/graphisme-et-serigraphie", icon: Pen },
  { label: "Audiovisuel & Montage", href: "/formation/photographie-cadrage-et-montage-video", icon: Camera },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formationsOpen, setFormationsOpen] = useState(false);

  // Detect scroll for header style change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    const t = setTimeout(() => {
      setMobileMenuOpen(false);
      setFormationsOpen(false);
    }, 0);
    return () => clearTimeout(t);
  }, [pathname]);

  const navLinks = [
    { label: "Formations", href: "/formations", icon: BookOpen, hasMega: true },
    { label: "Admissions", href: "/admissions", icon: GraduationCap },
    { label: "Vie à FuturCraft", href: "/vie-a-futurcraft", icon: CalendarDays },
    { label: "Projets", href: "/projets-etudiants", icon: Layers },
    { label: "Entreprises", href: "/entreprises", icon: Briefcase },
    { label: "L'Institut", href: "/institut", icon: Building2 },
    { label: "Contact", href: "/contact", icon: Phone },
  ];

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[var(--color-fc-bg)]/98 backdrop-blur-xl shadow-lg shadow-[var(--color-fc-deep)]/10 border-b border-[var(--color-fc-gray-light)]/70"
            : "bg-[var(--color-fc-bg)]/95 backdrop-blur-md border-b border-[var(--color-fc-gray-light)]/50"
        }`}
      >
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-[var(--color-fc-deep)] via-[var(--color-fc-primary)] to-[var(--color-fc-cyan)]" />

        <div className="hidden border-b border-[var(--color-fc-gray-light)] bg-[var(--color-fc-deep)] text-white md:block">
          <div className="mx-auto flex h-9 max-w-[84rem] items-center justify-between px-6 text-[11px] font-medium tracking-wide">
            <p className="text-white/75">Institut de formation aux métiers du numérique · Godomey, Bénin</p>
            <a href="tel:+22943327832" className="inline-flex items-center gap-2 text-white/85 transition-colors hover:text-[var(--color-fc-cyan)]">
              <Phone className="h-3.5 w-3.5 text-[var(--color-fc-cyan)]" />
              +229 43 32 78 32
            </a>
          </div>
        </div>

        <div className="mx-auto max-w-[84rem] px-4 sm:px-6">
          <div className="flex h-[76px] items-center justify-between gap-5">

            {/* ── Brand ── */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative flex h-10 w-auto items-center justify-center overflow-hidden rounded-xl border border-[var(--color-fc-gray-light)] bg-white px-2.5">
                <Image
                  src="/images/Logo-crop.png"
                  alt="Logo FuturCraft Institut"
                  width={507}
                  height={340}
                  className="h-8 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-[1.1rem] font-extrabold tracking-tight text-[var(--color-fc-black)] leading-none">
                  FuturCraft
                  <span className="text-[var(--color-fc-primary)]">.</span>
                </span>
                <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-[var(--color-fc-gray-mid)] mt-0.5">
                  Institut Numérique
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav ── */}
            <nav className="hidden xl:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const active = isActive(link.href);

                if (link.hasMega) {
                  return (
                    <div
                      id="formations-menu"
                      key={link.href}
                      className="relative"
                      onMouseEnter={() => setFormationsOpen(true)}
                      onMouseLeave={() => setFormationsOpen(false)}
                    >
                      <button
                        aria-expanded={formationsOpen}
                        aria-haspopup="true"
                        aria-controls="formations-menu"
                        type="button"
                        onClick={() => setFormationsOpen((open) => !open)}
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-[13px] font-semibold transition-all duration-200 ${
                          active
                            ? "text-[var(--color-fc-primary)] bg-[var(--color-fc-primary)]/8 font-semibold"
                            : "text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)] hover:bg-[var(--color-fc-gray-light)]/30"
                        }`}
                      >
                        {link.label}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${formationsOpen ? "rotate-180" : ""}`}
                        />
                      </button>

                      {/* Mega dropdown */}
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-80 transition-all duration-200 ${
                          formationsOpen
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 -translate-y-2 pointer-events-none"
                        }`}
                      >
                        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/12 border border-slate-200/80 overflow-hidden">
                          <div className="px-4 pt-4 pb-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Nos formations
                            </p>
                          </div>
                          <div className="p-2 space-y-0.5">
                            {formations.map(({ label, href, icon: Icon }) => (
<Link
                            key={href}
                            href={href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[var(--color-fc-primary)]/8 group/item transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-[var(--color-fc-primary)]/12 flex items-center justify-center shrink-0 group-hover/item:bg-[var(--color-fc-primary)] transition-colors">
                              <Icon className="w-4 h-4 text-[var(--color-fc-primary)] group-hover/item:text-white transition-colors" />
                            </div>
                            <span className="text-sm text-[var(--color-fc-gray-mid)] font-medium group-hover/item:text-[var(--color-fc-primary)] transition-colors">
                              {label}
                            </span>
                          </Link>
                            ))}
                          </div>
                          <div className="border-t border-[var(--color-fc-gray-light)] p-3">
                            <Link
                              href="/formations"
                              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-[var(--color-fc-primary)] text-white text-xs font-bold hover:bg-[var(--color-fc-deep)] transition-colors"
                            >
                              <span>Voir toutes les formations</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`rounded-xl px-3 py-2 text-[13px] font-semibold transition-all duration-200 ${
                        active
                          ? "text-[var(--color-fc-primary)] bg-[var(--color-fc-primary)]/8 font-semibold"
                          : "text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)] hover:bg-[var(--color-fc-gray-light)]/30"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
              })}
            </nav>

{/* ── Desktop Actions ── */}
            <div className="hidden sm:flex items-center gap-2.5">
              <Link
                href="/espace-etudiant"
                className="flex items-center gap-2 rounded-xl border border-[var(--color-fc-gray-light)] px-3 py-2 text-[13px] font-semibold text-[var(--color-fc-gray-mid)] transition-all duration-200 hover:border-[var(--color-fc-primary)]/25 hover:bg-[var(--color-fc-primary)]/5 hover:text-[var(--color-fc-primary)]"
              >
                <UserCheck className="w-4 h-4 text-[var(--color-fc-primary)]" />
                Mon Espace
              </Link>

              <Link
                href="/inscription"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-fc-primary)] px-4 py-2.5 text-[13px] font-bold text-white shadow-sm shadow-[var(--color-fc-primary)]/20 transition-all hover:-translate-y-0.5 hover:bg-[var(--color-fc-deep)]"
              >
                S&apos;inscrire
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
              </Link>
            </div>

            {/* ── Mobile toggle ── */}
            <div className="flex xl:hidden items-center gap-2">
              <Link
                href="/espace-etudiant"
                className="hidden items-center gap-1 rounded-lg border border-[var(--color-fc-primary)]/20 bg-[var(--color-fc-primary)]/8 px-3 py-1.5 text-xs font-semibold text-[var(--color-fc-primary)] sm:flex"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Espace
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)] hover:bg-[var(--color-fc-gray-light)]/30 transition-colors focus:outline-none"
                aria-label="Menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Drawer ── */}
        <div
          className={`xl:hidden transition-all duration-300 overflow-hidden ${
            mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-[var(--color-fc-bg)] border-t border-[var(--color-fc-gray-light)]/50 px-4 pt-3 pb-6 shadow-2xl shadow-[var(--color-fc-deep)]/10">
            <div className="space-y-0.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "text-[var(--color-fc-primary)] bg-[var(--color-fc-primary)]/8 font-semibold"
                      : "text-[var(--color-fc-gray-mid)] hover:bg-[var(--color-fc-gray-light)]/30"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 text-[var(--color-fc-primary)] shrink-0" />}
                  {link.label}
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--color-fc-primary)]" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 mt-3 border-t border-[var(--color-fc-gray-light)]/50 flex flex-col gap-2">
            <Link
              href="/espace-etudiant"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-[var(--color-fc-gray-mid)] bg-[var(--color-fc-gray-light)]/30 hover:bg-[var(--color-fc-gray-light)]/50 transition-colors"
            >
              <UserCheck className="w-4 h-4 text-[var(--color-fc-primary)]" />
              Accéder à Mon Espace Étudiant
            </Link>
            <Link
              href="/inscription"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-[var(--color-fc-primary)] shadow-md shadow-[var(--color-fc-primary)]/25 hover:bg-[var(--color-fc-deep)] transition-all"
            >
              Candidater maintenant
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-between text-xs text-[var(--color-fc-gray-mid)] pt-1 px-1">
              <Link href="/recu" onClick={() => setMobileMenuOpen(false)} className="hover:text-[var(--color-fc-primary)] transition-colors">
                Vérifier un reçu
              </Link>
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-[var(--color-fc-cyan)] font-semibold hover:text-[var(--color-fc-primary)] transition-colors">
                Administration
              </Link>
            </div>
          </div>
          </div>
        </div>
      </header>

      {/* Overlay for mega menu */}
      {formationsOpen && (
        <div className="fixed inset-0 z-40 bg-[var(--color-fc-black)]/5" />
      )}
    </>
  );
}
