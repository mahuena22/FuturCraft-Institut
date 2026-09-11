"use client";

export function FormationCardSkeleton() {
  return (
    <div className="bg-[var(--color-fc-bg)] rounded-2xl border border-[var(--color-fc-gray-light)]/50 overflow-hidden flex flex-col animate-pulse">
      {/* Media placeholder */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-fc-gray-light)]/30">
        <div className="absolute inset-0 bg-[var(--color-fc-gray-light)]/50" />
      </div>

      {/* Content placeholder */}
      <div className="p-5 flex-1 flex flex-col space-y-3">
        <div className="h-4 w-3/4 bg-[var(--color-fc-gray-light)]/50 rounded" />
        <div className="h-3 w-full bg-[var(--color-fc-gray-light)]/50 rounded" />
        <div className="h-3 w-5/6 bg-[var(--color-fc-gray-light)]/50 rounded" />
        <div className="flex-1" />
        <div className="h-4 w-2/3 bg-[var(--color-fc-gray-light)]/50 rounded" />
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 bg-[var(--color-fc-gray-light)]/50 rounded-xl" />
          <div className="h-8 w-20 bg-[var(--color-fc-gray-light)]/50 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function FormationsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <FormationCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function FilterBarSkeleton() {
  return (
    <div className="bg-[var(--color-fc-bg)] p-4 sm:p-6 rounded-2xl border border-[var(--color-fc-gray-light)]/50 shadow-xs space-y-4 animate-pulse">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-1">
          <div className="w-full h-10 bg-[var(--color-fc-gray-light)]/30 rounded-xl" />
        </div>
        <div className="w-32 h-8 bg-[var(--color-fc-gray-light)]/30 rounded-lg" />
      </div>
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-24 h-8 bg-[var(--color-fc-gray-light)]/30 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function FormationDetailSkeleton() {
  return (
    <div className="bg-[var(--color-fc-bg)] min-h-screen animate-pulse">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-fc-deep)] text-white py-16 lg:py-24 border-b border-[var(--color-fc-primary)]/30">
        <div className="absolute inset-0 bg-[var(--color-fc-gray-light)]/20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <div className="h-6 w-32 bg-[var(--color-fc-gray-light)]/30 rounded-full" />
              <div className="h-6 w-40 bg-[var(--color-fc-gray-light)]/30 rounded-full" />
            </div>
            <div className="h-12 w-3/4 bg-[var(--color-fc-gray-light)]/30 rounded" />
            <div className="h-6 w-full bg-[var(--color-fc-gray-light)]/30 rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-20 bg-[var(--color-fc-gray-light)]/30 rounded-xl" />
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="h-12 w-48 bg-[var(--color-fc-gray-light)]/30 rounded-xl" />
              <div className="h-12 w-48 bg-[var(--color-fc-gray-light)]/30 rounded-xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-14">
            {Array.from({ length: 5 }).map((_, i) => (
              <section key={i} className="space-y-4">
                <div className="h-6 w-40 bg-[var(--color-fc-gray-light)]/30 rounded" />
                <div className="h-8 w-3/4 bg-[var(--color-fc-gray-light)]/30 rounded" />
                <div className="h-4 w-full bg-[var(--color-fc-gray-light)]/30 rounded" />
                <div className="h-4 w-5/6 bg-[var(--color-fc-gray-light)]/30 rounded" />
                {i === 1 && (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="h-28 bg-[var(--color-fc-gray-light)]/30 rounded-2xl" />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="h-80 bg-[var(--color-fc-gray-light)]/30 rounded-2xl" />
              <div className="h-60 bg-[var(--color-fc-gray-light)]/30 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}