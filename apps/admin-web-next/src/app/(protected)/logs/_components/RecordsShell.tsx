"use client";

import { type ReactNode } from "react";

export function RecordsScroller({ children }: { children: ReactNode }) {
  return (
    <div className="h-full overflow-y-auto pr-1">
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

export function RecordsShell({
  title,
  description,
  onBack,
  children,
}: {
  title: string;
  description: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-6">
      <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            Records
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Back
        </button>
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-hidden">
        {children}
      </div>
    </section>
  );
}
