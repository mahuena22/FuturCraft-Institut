import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--color-fc-gray-mid)]">
      <Link href="/" className="inline-flex items-center gap-1 hover:text-[var(--color-fc-primary)]">
        <Home className="h-3.5 w-3.5" />
        Accueil
      </Link>
      {items.map((item, idx) => (
        <span key={idx} className="inline-flex items-center gap-1.5">
          <ChevronRight className="h-3.5 w-3.5" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[var(--color-fc-primary)]">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-[var(--color-fc-black)]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
