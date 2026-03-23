import { useEffect, useState } from "react";
import { API_BASE, getStoredToken } from "../../lib/auth";
import type { ReimbursementRequest } from "./types";
import ReimbursementRequestCard from "./ReimbursementRequestCard";

type Props = {
  divisionKey: string;
  onBack: () => void;
};

export default function ReimbursementRequestsPanel({
  divisionKey,
  onBack,
}: Props) {
  const [requests, setRequests] = useState<ReimbursementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRequests() {
      try {
        setLoading(true);
        setError("");

        const token = getStoredToken();
        const url = new URL(`${API_BASE}/api/reimbursement-requests`);
        url.searchParams.set("divisionKey", divisionKey);

        const res = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data?.error || "Failed to load reimbursement requests.");
          return;
        }

        setRequests(Array.isArray(data.requests) ? data.requests : []);
      } catch {
        setError("Could not reach API.");
      } finally {
        setLoading(false);
      }
    }

    void loadRequests();
  }, [divisionKey]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-2xl">
        <div>
          <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
            Records
          </div>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-white">
            Reimbursement Requests
          </h3>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Back to Modules
        </button>
      </div>

      {error ? (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm font-medium text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/70 shadow-2xl">
          Loading reimbursement requests...
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/65 shadow-2xl">
          No reimbursement requests found for this division.
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <ReimbursementRequestCard key={request.id} request={request} />
          ))}
        </div>
      )}
    </div>
  );
}