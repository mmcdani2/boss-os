"use client";

import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api/client";
import { RecordsScroller, RecordsShell } from "./RecordsShell";
import ReimbursementRequestCard from "./ReimbursementRequestCard";
import type { ReimbursementRequest, ReimbursementRequestsResponse } from "./types";

export default function ReimbursementRequestsPanel({
  divisionKey,
  onBack,
}: {
  divisionKey: string;
  onBack: () => void;
}) {
  const [requests, setRequests] = useState<ReimbursementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams({ divisionKey });
        const data = await apiJson<ReimbursementRequestsResponse>(`/api/reimbursement-requests?${params.toString()}`);
        setRequests(Array.isArray(data.requests) ? data.requests : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not reach API.");
      } finally {
        setLoading(false);
      }
    }

    void loadRequests();
  }, [divisionKey]);

  return (
    <RecordsShell
      title="Reimbursement Requests"
      description="Review reimbursement requests for the selected division."
      onBack={onBack}
    >
      {error ? (
        <div className="shrink-0 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
          Loading reimbursement requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/60">
          No reimbursement requests found for this division.
        </div>
      ) : (
        <RecordsScroller>
          {requests.map((request) => (
            <ReimbursementRequestCard key={request.id} request={request} />
          ))}
        </RecordsScroller>
      )}
    </RecordsShell>
  );
}
