"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api/client";

type RefrigerantLog = {
  id: string;
  customerName: string | null;
  refrigerantType: string;
  techNameSnapshot: string;
  jobNumber: string | null;
  city: string | null;
  state: string | null;
  poundsAdded: string | number | null;
  poundsRecovered: string | number | null;
  submittedAt?: string | null;
  createdAt?: string | null;
};

function formatSubmittedAt(value?: string | null) {
  if (!value) return "Unknown time";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown time";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getLogTime(log: RefrigerantLog) {
  const value = log.submittedAt ?? log.createdAt;
  if (!value) return 0;

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function LogCard({ log }: { log: RefrigerantLog }) {
  const submittedLabel = formatSubmittedAt(log.submittedAt ?? log.createdAt);

  return (
    <Link
      href={`/logs/${log.id}`}
      className="block rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl transition hover:border-orange-400/30 hover:bg-[#202020]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xl font-black tracking-tight text-white">
            {log.customerName || "No customer name"}
          </div>
          <div className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-orange-400">
            {log.refrigerantType}
          </div>
        </div>

        <div className="shrink-0 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
          View
        </div>
      </div>

      <div className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
        Submitted {submittedLabel}
      </div>

      <div className="mt-4 grid gap-2 text-sm text-white/65">
        <div>
          <span className="font-semibold text-white/85">Tech:</span>{" "}
          {log.techNameSnapshot}
        </div>
        <div>
          <span className="font-semibold text-white/85">Job:</span>{" "}
          {log.jobNumber || "N/A"}
        </div>
        <div>
          <span className="font-semibold text-white/85">Location:</span>{" "}
          {log.city || "N/A"}
          {log.state ? `, ${log.state}` : ""}
        </div>
        <div>
          <span className="font-semibold text-white/85">Added:</span>{" "}
          {log.poundsAdded ?? "0"}
          <span className="mx-2 text-white/30">|</span>
          <span className="font-semibold text-white/85">Recovered:</span>{" "}
          {log.poundsRecovered ?? "0"}
        </div>
      </div>
    </Link>
  );
}

export default function MyLogsPage() {
  const [logs, setLogs] = useState<RefrigerantLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch("/api/refrigerant-logs/mine");
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const nextError =
            typeof data === "object" && data && "error" in data
              ? String((data as { error?: string }).error || "Failed to load logs.")
              : "Failed to load logs.";
          setError(nextError);
          return;
        }

        const nextLogs = Array.isArray(data.logs) ? data.logs : [];
        nextLogs.sort((a: RefrigerantLog, b: RefrigerantLog) => getLogTime(b) - getLogTime(a));

        setLogs(nextLogs);
      } catch {
        setError("Could not reach API.");
      } finally {
        setLoading(false);
      }
    }

    void loadLogs();
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6">
      <div className="shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(255,255,255,0.02))] px-7 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            BossOS Field
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-[2.2rem]">
            My Refrigerant Logs
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
            Review your recent refrigerant submissions from the field.
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <Link
          href="/division/hvac"
          className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          Back to HVAC Modules
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-1">
          <div className="grid gap-4">
            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/70 shadow-2xl">
                Loading logs...
              </div>
            ) : null}

            {error ? (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm font-medium text-red-200">
                {error}
              </div>
            ) : null}

            {!loading && !error ? (
              <>
                {logs.length === 0 ? (
                  <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/65 shadow-2xl">
                    No refrigerant logs found.
                  </div>
                ) : (
                  logs.map((log) => <LogCard key={log.id} log={log} />)
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
