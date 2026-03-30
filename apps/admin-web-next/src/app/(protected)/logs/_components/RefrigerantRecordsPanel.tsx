"use client";

import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api/client";
import { RecordsScroller, RecordsShell } from "./RecordsShell";
import RefrigerantLogCard from "./RefrigerantLogCard";
import type { RefrigerantLog, RefrigerantLogsResponse } from "./types";

export default function RefrigerantRecordsPanel({
  divisionKey,
  onBack,
}: {
  divisionKey: string;
  onBack: () => void;
}) {
  const [logs, setLogs] = useState<RefrigerantLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams({ divisionKey });
        const data = await apiJson<RefrigerantLogsResponse>(`/api/refrigerant-logs/admin/all?${params.toString()}`);
        setLogs(Array.isArray(data.logs) ? data.logs : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not reach API.");
      } finally {
        setLoading(false);
      }
    }

    void loadLogs();
  }, [divisionKey]);

  return (
    <RecordsShell
      title="Refrigerant Logs"
      description="Review recent refrigerant submissions for the selected division."
      onBack={onBack}
    >
      {error ? (
        <div className="shrink-0 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
          Loading refrigerant logs...
        </div>
      ) : logs.length === 0 ? (
        <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/60">
          No refrigerant logs found for this division.
        </div>
      ) : (
        <RecordsScroller>
          {logs.map((log) => (
            <RefrigerantLogCard key={log.id} log={log} />
          ))}
        </RecordsScroller>
      )}
    </RecordsShell>
  );
}
