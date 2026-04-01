import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FieldShellLayout from "../../../shell/FieldShellLayout";
import { apiFetch } from "../../../shared/api/client";

type LauncherModule = {
  id: string;
  key: string;
  name: string;
  category: string;
};

type LauncherDivision = {
  id: string;
  key: string;
  name: string;
  modules: LauncherModule[];
};

function moduleRoute(divisionKey: string, moduleKey: string) {
  switch (moduleKey) {
    case "quick-estimate-calculator":
      return divisionKey === "hvac" ? "/quick-estimate-calculator" : "";
    case "refrigerant-log":
      return divisionKey === "hvac" ? "/refrigerant-log" : "";
    case "reimbursement-request":
      return `/division/${divisionKey}/reimbursement-request`;
    case "spray-foam-job-log":
      return divisionKey === "spray-foam"
        ? "/division/spray-foam/spray-foam-job-log"
        : "";
    default:
      return "";
  }
}

function divisionDescription(key: string) {
  switch (key) {
    case "hvac":
      return "Live field tools for HVAC technicians.";
    case "spray-foam":
      return "Spray foam field tools and logs.";
    default:
      return "Division tools and field workflows.";
  }
}

function ModuleCard({
  to,
  eyebrow,
  title,
  description,
  disabled = false,
}: {
  to: string;
  eyebrow: string;
  title: string;
  description: string;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl opacity-70">
        <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
          {eyebrow}
        </div>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">
          {description}
        </p>
      </div>
    );
  }

  return (
    <Link
      to={to}
      className="block rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">
        {description}
      </p>
    </Link>
  );
}

export default function DivisionModulesPage() {
  const { divisionKey } = useParams();
  const [divisions, setDivisions] = useState<LauncherDivision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLauncher() {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch("/api/auth/launcher");
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data?.error || "Failed to load modules.");
          return;
        }

        setDivisions(Array.isArray(data.divisions) ? data.divisions : []);
      } catch {
        setError("Could not reach API.");
      } finally {
        setLoading(false);
      }
    }

    void loadLauncher();
  }, []);

  const division = useMemo(
    () => divisions.find((item) => item.key === divisionKey) || null,
    [divisions, divisionKey]
  );

  return (
    <FieldShellLayout
      kicker="BossOS Field"
      title={division ? `${division.name} Modules` : "Division Modules"}
      subtitle="Choose a field tool inside this division."
    >
      <div className="grid gap-6">
        <div>
          <Link
            to="/home"
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Back to Divisions
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/70 shadow-2xl">
            Loading modules...
          </div>
        ) : null}

        {error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm font-medium text-red-200">
            {error}
          </div>
        ) : null}

        {!loading && !error ? (
          <>
            {!division ? (
              <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/65 shadow-2xl">
                Division not found.
              </div>
            ) : (
              <>
                <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-2xl">
                  <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
                    {division.name}
                  </div>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
                    {division.name} Tools
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/65 sm:text-base">
                    {divisionDescription(division.key)}
                  </p>
                </div>

                {division.modules.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/65 shadow-2xl">
                    No active modules are available for this division yet.
                  </div>
                ) : (
                  division.modules.map((module) => {
                    const route = moduleRoute(division.key, module.key);

                    return (
                      <ModuleCard
                        key={module.id}
                        to={route || `/division/${division.key}`}
                        eyebrow={division.name}
                        title={module.name}
                        description={
                          route
                            ? "Open this field module now."
                            : "This module is enabled, but its field view is not live yet."
                        }
                        disabled={!route}
                      />
                    );
                  })
                )}

                {division.key === "hvac" ? (
                  <ModuleCard
                    to="/my-logs"
                    eyebrow="History"
                    title="My Logs"
                    description="Review your recent refrigerant submissions from the field."
                  />
                ) : null}
              </>
            )}
          </>
        ) : null}
      </div>
    </FieldShellLayout>
  );
}