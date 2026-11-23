import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#06122f] text-white">
      <div className="mx-auto max-w-[84rem] px-4 py-14 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="space-y-5 lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 items-center rounded-xl bg-white px-2.5">
                <Image src="/images/Logo-crop.png" alt="Logo FuturCraft Institut" width={507} height={340} className="h-7 w-auto object-contain" />
              </div>
              <span className="font-display text-2xl font-extrabold tracking-tight text-white">
                FuturCraft<span className="text-[var(--color-fc-cyan)]">.</span>
              </span>
            </Link>
            <p className="max-w-sm text-sm leading-7 text-white/60">
              Institut de formation pratique aux métiers du numérique à Abomey-Calavi.
            </p>
            <div className="space-y-2.5 text-sm text-white/65">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-fc-cyan)]" />
                <span>Godomey, avant pk14, Abomey-Calavi</span>
              </div>
              <a href="tel:+22943327832" className="flex items-center gap-3 transition-colors hover:text-white">
                <Phone className="h-4 w-4 shrink-0 text-[var(--color-fc-cyan)]" />
                +229 43 32 78 32
              </a>
              <a href="mailto:contact@futurcraftinstitut.com" className="flex items-center gap-3 transition-colors hover:text-white">
                <Mail className="h-4 w-4 shrink-0 text-[var(--color-fc-cyan)]" />
                contact@futurcraftinstitut.com
              </a>
            </div>
            <div className="flex items-center gap-2 pt-1">
              {[
                { name: "Facebook", Icon: FacebookIcon, url: "https://facebook.com/futurcraftinstitut" },
                { name: "Instagram", Icon: InstagramIcon, url: "https://instagram.com/futurcraft_institut" },
                { name: "LinkedIn", Icon: LinkedInIcon, url: "https://linkedin.com/company/futurcraft-institut" },
              ].map(({ name, Icon, url }) => (
                <a
                  key={name}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/60 transition-colors hover:border-[var(--color-fc-cyan)]/40 hover:text-[var(--color-fc-cyan)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/45">Formations</p>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li><Link href="/formations" className="transition-colors hover:text-[var(--color-fc-cyan)]">Toutes les formations</Link></li>
              <li><Link href="/formation/developpement-web-fullstack" className="transition-colors hover:text-[var(--color-fc-cyan)]">Développement Web</Link></li>
              <li><Link href="/formation/developpement-intelligence-artificielle" className="transition-colors hover:text-[var(--color-fc-cyan)]">Intelligence Artificielle</Link></li>
              <li><Link href="/formation/marketing-digital" className="transition-colors hover:text-[var(--color-fc-cyan)]">Marketing Digital</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/45">Institut</p>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li><Link href="/admissions" className="transition-colors hover:text-[var(--color-fc-cyan)]">Admissions</Link></li>
              <li><Link href="/institut" className="transition-colors hover:text-[var(--color-fc-cyan)]">À propos</Link></li>
              <li><Link href="/projets-etudiants" className="transition-colors hover:text-[var(--color-fc-cyan)]">Projets étudiants</Link></li>
              <li><Link href="/actualites" className="transition-colors hover:text-[var(--color-fc-cyan)]">Actualités</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/45">Accès rapide</p>
            <ul className="mt-4 space-y-3 text-sm text-white/65">
              <li><Link href="/inscription" className="transition-colors hover:text-[var(--color-fc-cyan)]">Candidater</Link></li>
              <li><Link href="/espace-etudiant" className="transition-colors hover:text-[var(--color-fc-cyan)]">Espace étudiant</Link></li>
              <li><Link href="/entreprises" className="transition-colors hover:text-[var(--color-fc-cyan)]">Entreprises</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-[var(--color-fc-cyan)]">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} FuturCraft Institut. Tous droits réservés.</p>
          <div className="flex items-center gap-5">
            <Link href="/recu" className="transition-colors hover:text-white/70">Vérifier un reçu</Link>
            <Link href="/admin" className="transition-colors hover:text-white/70">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
