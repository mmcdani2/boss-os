"use client";

import type { ReportModuleItem } from "./types";

function formatModuleKeyLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function ReportsModulePanel({
  modules,
  selectedModuleKey,
  onSelectModule,
}: {
  modules: ReportModuleItem[];
  selectedModuleKey: string;
  onSelectModule: (moduleKey: string) => void;
}) {
  return (
    <section className="shrink-0 rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            Report Modules
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Choose Module</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            Select the report type you want to review for this division.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const active = selectedModuleKey === module.key;

          return (
            <button
              key={module.key}
              type="button"
              onClick={() => onSelectModule(module.key)}
              className={[
                "rounded-2xl border p-4 text-left transition",
                active
                  ? "border-orange-400/40 bg-orange-500/10"
                  : "border-white/10 bg-[#141414] hover:bg-white/[0.04]",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-white">{module.name}</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    {formatModuleKeyLabel(module.key)}
                  </div>
                </div>

                <span
                  className={[
                    "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                    active
                      ? "bg-orange-500/15 text-orange-300"
                      : "bg-white/10 text-white/60",
                  ].join(" ")}
                >
                  {active ? "Open" : "View"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
