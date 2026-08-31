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
            ? "bg-white/98 backdrop-blur-xl shadow-lg shadow-blue-900/6 border-b border-slate-200/70"
            : "bg-white/95 backdrop-blur-md border-b border-slate-100"
        }`}
      >
        {/* Top accent bar */}
        <div className="h-0.5 bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* ── Brand ── */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative h-9 w-auto overflow-hidden rounded-lg bg-white flex items-center justify-center border border-slate-200 px-2">
                <Image
                  src="/images/Logo-crop.png"
                  alt="Logo FuturCraft Institut"
                  width={507}
                  height={340}
                  className="h-7 w-auto object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-[1.15rem] tracking-tight text-slate-900 leading-none">
                  FuturCraft
                  <span className="text-blue-600">.</span>
                </span>
                <span className="text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-400 mt-0.5">
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
                      key={link.href}
                      className="relative"
                      onMouseEnter={() => setFormationsOpen(true)}
                      onMouseLeave={() => setFormationsOpen(false)}
                    >
                      <button
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          active
                            ? "text-blue-600 bg-blue-50 font-semibold"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 group/item transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 group-hover/item:bg-blue-600 transition-colors">
                                  <Icon className="w-4 h-4 text-blue-600 group-hover/item:text-white transition-colors" />
                                </div>
                                <span className="text-sm text-slate-700 font-medium group-hover/item:text-blue-600 transition-colors">
                                  {label}
                                </span>
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-slate-100 p-3">
                            <Link
                              href="/formations"
                              className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
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
                    className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
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
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 transition-all duration-200"
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                Mon Espace
              </Link>

              <Link
                href="/inscription"
                className="relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white overflow-hidden group"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300" />
                <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative">S&apos;inscrire</span>
                <ArrowRight className="relative w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" />
              </Link>
            </div>

            {/* ── Mobile toggle ── */}
            <div className="flex xl:hidden items-center gap-2">
              <Link
                href="/espace-etudiant"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 flex items-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" />
                Espace
              </Link>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
                aria-label="Menu"
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
          <div className="bg-white border-t border-slate-100 px-4 pt-3 pb-6 shadow-2xl">
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
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {Icon && <Icon className="w-4 h-4 text-blue-500 shrink-0" />}
                    {link.label}
                    {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/espace-etudiant"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                Accéder à Mon Espace Étudiant
              </Link>
              <Link
                href="/inscription"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                Candidater maintenant
                <ArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 px-1">
                <Link href="/recu" onClick={() => setMobileMenuOpen(false)} className="hover:text-blue-600 transition-colors">
                  Vérifier un reçu
                </Link>
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-violet-600 font-semibold hover:text-violet-700 transition-colors">
                  Administration
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay for mega menu */}
      {formationsOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/5" />
      )}
    </>
  );
}
