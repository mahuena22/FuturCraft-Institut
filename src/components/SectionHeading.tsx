import type { ReactNode } from "react";

interface SectionHeadingProps {
  eyebrow: string;
  eyebrowColor?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  dark?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className = "",
  dark = false,
}: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}>
      <p
        className={`text-[11px] font-extrabold uppercase tracking-[0.22em] ${
          dark ? "text-[var(--color-fc-cyan)]" : "text-[var(--color-fc-primary)]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-4 font-display text-3xl font-extrabold tracking-[-0.045em] text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1] ${
          dark ? "text-white" : "text-[var(--color-fc-black)]"
        }`}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            dark ? "text-white/72" : "text-[var(--color-fc-gray-mid)]"
          } ${center ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
