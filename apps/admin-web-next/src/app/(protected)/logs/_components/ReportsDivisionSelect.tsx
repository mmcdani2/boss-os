"use client";

import type { Division } from "./types";

export default function ReportsDivisionSelect({
  divisions,
  value,
  onChange,
}: {
  divisions: Division[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="shrink-0 rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            Division
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Choose Division</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Pick the division you want to review.
          </p>
        </div>

        <div className="w-full max-w-sm lg:w-[340px]">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-white outline-none transition focus:border-orange-400/60"
          >
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
