interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function PageIntro({ eyebrow, title, description }: PageIntroProps) {
  return (
    <section className="page-intro">
      <div className="page-intro-inner">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
          <div className="page-intro-copy">
            <p className="page-intro-eyebrow">{eyebrow}</p>
            <h1 className="page-intro-title">{title}</h1>
            <p className="page-intro-description">{description}</p>
          </div>
          <div aria-hidden="true" className="relative hidden min-h-40 items-end justify-end overflow-hidden lg:flex">
            <span className="font-display text-[11rem] font-black leading-[0.72] tracking-[-0.1em] text-white/[0.08]">
              FC
            </span>
            <span className="absolute bottom-1 right-0 text-[10px] font-bold uppercase tracking-[0.18em] text-white/60">
              Institut numérique
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
