import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  eyebrowColor?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

const eyebrowPalette: Record<string, string> = {
  blue: "text-blue-600 bg-blue-50 border-blue-100",
  indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
  violet: "text-violet-600 bg-violet-50 border-violet-100",
  emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
  slate: "text-slate-600 bg-slate-100 border-slate-200",
};

export function SectionHeading({
  eyebrow,
  eyebrowColor = "blue",
  title,
  description,
  align = "center",
  className = "",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-3xl ${alignClass} space-y-3 ${className}`}>
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest ${eyebrowPalette[eyebrowColor]}`}
      >
        {eyebrow}
      </span>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">{title}</h2>
      {description ? (
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">{description}</p>
      ) : null}
    </div>
  );
}
