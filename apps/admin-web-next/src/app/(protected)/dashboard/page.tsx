"use client";

import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api/client";

type DashboardStats = {
  totalLogs: number;
  logsToday: number;
  activeTechs: number;
};

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-5">
      <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/55 sm:text-[12px]">
        {label}
      </div>
      <div className={"mt-3 text-3xl font-black tracking-tight text-white sm:mt-4 sm:text-4xl " + (accent ?? "")}>
        {value}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const data = await apiJson<DashboardStats>("/api/refrigerant-logs/admin/stats/summary");
        setStats(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Could not reach API.";
        setError(message || "Could not reach API.");
      } finally {
        setLoading(false);
      }
    }

    void loadDashboard();
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6">
      <div className="shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(255,255,255,0.02))] px-7 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-[2.2rem]">
            Operations overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
            Quick view of refrigerant activity, technician usage, and today&apos;s field submissions.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="shrink-0 rounded-3xl border border-white/10 bg-[#1a1a1a] p-4 text-white/70 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-5">
          Loading dashboard...
        </div>
      ) : null}

      {error ? (
        <div className="shrink-0 rounded-3xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-200 sm:p-5">
          {error}
        </div>
      ) : null}

      {!loading && !error && stats ? (
        <div className="shrink-0 grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
          <StatCard label="Total Logs" value={stats.totalLogs} />
          <StatCard label="Logs Today" value={stats.logsToday} accent="text-orange-300" />
          <StatCard label="Active Techs" value={stats.activeTechs} />
        </div>
      ) : null}

      {!loading && !error ? (
        <div className="shrink-0 rounded-3xl border border-white/10 bg-[#1a1a1a] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-5">
          <div className="text-[11px] font-bold uppercase tracking-[0.24em] text-orange-400 sm:text-[12px]">
            Snapshot
          </div>
          <h2 className="mt-3 text-[1.75rem] font-black tracking-tight text-white sm:text-2xl">
            Operations at a glance
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
            This dashboard is intentionally simple right now. Next step is recent activity, log trend visibility, and direct drill-down into technician submissions.
          </p>
        </div>
      ) : null}
    </div>
  );
}
