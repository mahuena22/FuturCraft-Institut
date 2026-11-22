interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="page-intro">
      <div className="page-intro-inner">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="page-intro-copy">
            <p className="page-intro-eyebrow">{eyebrow}</p>
            <h1 className="page-intro-title">{title}</h1>
            <p className="page-intro-description">{description}</p>
          </div>
          <div aria-hidden="true" className="relative hidden min-h-44 items-end justify-end lg:flex">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full border border-white/10" />
            <div className="absolute right-8 top-8 h-32 w-32 rounded-full border border-[var(--color-fc-cyan)]/20" />
            <span className="relative font-display text-[8rem] font-black leading-[0.8] tracking-[-0.08em] text-white/[0.07]">
              FC
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
