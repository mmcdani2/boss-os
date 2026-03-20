import type { ReimbursementRequest } from "./types";
import ReimbursementRequestCard from "./ReimbursementRequestCard";

type Props = {
  requests: ReimbursementRequest[];
  loading: boolean;
  onBack: () => void;
};

export default function ReimbursementRequestsPanel({
  requests,
  loading,
  onBack,
}: Props) {
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
