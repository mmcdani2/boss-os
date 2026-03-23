import type { ReportModuleItem } from "./types";

type Props = {
  modules: ReportModuleItem[];
  selectedModuleKey: string;
  onSelectModule: (moduleKey: string) => void;
};

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
}: Props) {
  return (
    <div className="grid gap-4">
      <div className="rounded-3xl border border-white/10 bg-[#141414] p-4 shadow-2xl">
        <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-400">
          Report Modules
        </div>
        <h2 className="mt-2 text-xl font-black tracking-tight text-white">
          Choose a module
        </h2>
        <p className="mt-1 text-sm text-white/60">
          Select the report type you want to review.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const active = selectedModuleKey === module.key;

          return (
            <button
              key={module.key}
              type="button"
              onClick={() => onSelectModule(module.key)}
              className={[
                "rounded-3xl border p-4 text-left shadow-2xl transition",
                active
                  ? "border-orange-400/60 bg-orange-400/10"
                  : "border-white/10 bg-[#1a1a1a] hover:border-white/20 hover:bg-white/[0.07]",
              ].join(" ")}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-lg font-black tracking-tight text-white">
                    {module.name}
                  </div>
                  <div className="mt-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white/45">
                    {formatModuleKeyLabel(module.key)}
                  </div>
                </div>

                <div
                  className={[
                    "shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]",
                    active
                      ? "bg-orange-400/20 text-orange-200"
                      : "bg-white/10 text-white/55",
                  ].join(" ")}
                >
                  {active ? "Open" : "View"}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}