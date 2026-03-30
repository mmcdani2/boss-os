"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch, apiJson } from "@/lib/api/client";

type ReimbursementRequestDetail = {
  id: string;
  userId: string;
  companyKey: string;
  divisionKey: string | null;
  techNameSnapshot: string;
  amountSpent: string;
  purchaseDate: string;
  vendor: string;
  category: string;
  paymentMethod: string;
  purpose: string;
  tiedToJob: boolean;
  jobNumber: string | null;
  notes: string | null;
  receiptUploaded: boolean;
  urgentReimbursementNeeded: boolean;
  status: string;
  reimbursementDate: string | null;
  reviewedAt: string | null;
  reviewedByUserId: string | null;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
};

type ReimbursementRequestResponse = {
  request?: ReimbursementRequestDetail | null;
};

function formatCurrency(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : value;
}

function statusTone(status: string) {
  switch (status) {
    case "approved":
      return "bg-blue-500/15 text-blue-300";
    case "denied":
      return "bg-red-500/15 text-red-300";
    case "reimbursed":
      return "bg-emerald-500/15 text-emerald-300";
    default:
      return "bg-white/10 text-white/60";
  }
}

function formatDateTime(value: string | null) {
  if (!value) return "N/A";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString();
}

export default function ReimbursementRequestDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [request, setRequest] = useState<ReimbursementRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadRequest() {
      if (!id) return;

      try {
        setLoading(true);
        setError("");
        setMessage("");

        const data = await apiJson<ReimbursementRequestResponse>(`/api/reimbursement-requests/${id}`);
        setRequest(data.request ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not reach API.");
      } finally {
        setLoading(false);
      }
    }

    void loadRequest();
  }, [id]);

  async function updateStatus(status: string) {
    if (!request) return;

    try {
      setSavingStatus(status);
      setError("");
      setMessage("");

      const response = await apiFetch(`/api/reimbursement-requests/${request.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = (await response.json()) as ReimbursementRequestResponse;

      if (!response.ok) {
        setError("Failed to update reimbursement status.");
        return;
      }

      setRequest(data.request ?? null);
      setMessage(`Status updated to ${status}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach API.");
    } finally {
      setSavingStatus("");
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6 overflow-y-auto pr-1">
      <div className="shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(255,255,255,0.02))] px-7 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
              Reports
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-[2.2rem]">
              Reimbursement Request Detail
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
              Review the submission and update its processing status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => router.push("/logs")}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back to Logs
          </button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/70 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          Loading reimbursement request...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200">
          {message}
        </div>
      ) : null}

      {!loading && !error && request ? (
        <>
          <section className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
                  Submission
                </div>
                <h2 className="mt-3 text-2xl font-bold text-white">
                  {request.techNameSnapshot}
                </h2>
                <p className="mt-2 text-sm leading-6 text-white/60 sm:text-base">
                  {request.purchaseDate} at {request.vendor}
                </p>
              </div>

              <div
                className={[
                  "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]",
                  statusTone(request.status),
                ].join(" ")}
              >
                {request.status}
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Amount
                </div>
                <div className="mt-1 text-base font-semibold text-white">
                  {formatCurrency(request.amountSpent)}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Division
                </div>
                <div className="mt-1 text-base font-semibold text-white">
                  {request.divisionKey || "N/A"}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Category
                </div>
                <div className="mt-1 text-base font-semibold text-white">
                  {request.category}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Payment Method
                </div>
                <div className="mt-1 text-base font-semibold text-white">
                  {request.paymentMethod}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
              Request Details
            </div>

            <div className="mt-4 grid gap-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  What Was It For?
                </div>
                <div className="mt-1 text-base text-white">
                  {request.purpose}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    Tied to Job
                  </div>
                  <div className="mt-1 text-base text-white">
                    {request.tiedToJob ? "Yes" : "No"}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    Job Number
                  </div>
                  <div className="mt-1 text-base text-white">
                    {request.jobNumber || "N/A"}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    Receipt Uploaded
                  </div>
                  <div className="mt-1 text-base text-white">
                    {request.receiptUploaded ? "Yes" : "No"}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                    Urgent Reimbursement Needed
                  </div>
                  <div className="mt-1 text-base text-white">
                    {request.urgentReimbursementNeeded ? "Yes" : "No"}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Additional Notes
                </div>
                <div className="mt-1 text-base text-white">
                  {request.notes || "None"}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-6">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
              Workflow
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => void updateStatus("approved")}
                disabled={savingStatus.length > 0}
                className="h-12 rounded-2xl bg-blue-500/80 px-4 text-sm font-black text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingStatus === "approved" ? "Saving..." : "Approve"}
              </button>

              <button
                type="button"
                onClick={() => void updateStatus("denied")}
                disabled={savingStatus.length > 0}
                className="h-12 rounded-2xl bg-red-500/80 px-4 text-sm font-black text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingStatus === "denied" ? "Saving..." : "Deny"}
              </button>

              <button
                type="button"
                onClick={() => void updateStatus("reimbursed")}
                disabled={savingStatus.length > 0}
                className="h-12 rounded-2xl bg-emerald-500/80 px-4 text-sm font-black text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {savingStatus === "reimbursed" ? "Saving..." : "Mark Reimbursed"}
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Reviewed At
                </div>
                <div className="mt-1 text-base text-white">
                  {formatDateTime(request.reviewedAt)}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Reimbursement Date
                </div>
                <div className="mt-1 text-base text-white">
                  {formatDateTime(request.reimbursementDate)}
                </div>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}