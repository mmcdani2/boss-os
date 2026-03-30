"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api/client";

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

function divisionDescription(key: string) {
  switch (key) {
    case "hvac":
      return "HVAC tools, logs, and field workflows.";
    case "spray-foam":
      return "Spray foam tools, logs, and future field workflows.";
    default:
      return "Division tools and field workflows.";
  }
}

function DivisionCard({
  to,
  eyebrow,
  title,
  description,
}: {
  to: string;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={to}
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

export default function HomePage() {
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
          const nextError =
            typeof data === "object" && data && "error" in data
              ? String((data as { error?: string }).error || "Failed to load divisions.")
              : "Failed to load divisions.";
          setError(nextError);
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

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6">
      <div className="shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(255,255,255,0.02))] px-7 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            BossOS Field
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-[2.2rem]">
            Divisions
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
            Choose a division first, then open the tools inside it.
          </p>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-1">
          <div className="grid gap-6">
            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/70 shadow-2xl">
                Loading divisions...
              </div>
            ) : null}

            {error ? (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm font-medium text-red-200">
                {error}
              </div>
            ) : null}

            {!loading && !error ? (
              <>
                {divisions.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/65 shadow-2xl">
                    No active divisions are available yet.
                  </div>
                ) : (
                  divisions.map((division) => (
                    <DivisionCard
                      key={division.id}
                      to={`/division/${division.key}`}
                      eyebrow="Division"
                      title={division.name}
                      description={divisionDescription(division.key)}
                    />
                  ))
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
