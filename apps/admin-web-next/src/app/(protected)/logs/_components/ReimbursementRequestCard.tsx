"use client";

import Link from "next/link";
import type { ReimbursementRequest } from "./types";

function formatCurrency(value: string) {
  const amount = Number(value);
  return Number.isFinite(amount)
    ? amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
    : value;
}

function reimbursementStatusTone(status: string) {
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

export default function ReimbursementRequestCard({ request }: { request: ReimbursementRequest }) {
  return (
    <Link
      href={`/reimbursement-requests/${request.id}`}
      className="block rounded-2xl border border-white/10 bg-[#141414] p-4 transition hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-white">{request.techNameSnapshot}</div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-400/80">
            {request.vendor}
          </div>
        </div>

        <div
          className={[
            "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
            reimbursementStatusTone(request.status),
          ].join(" ")}
        >
          {request.status}
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-white/65 sm:grid-cols-2 xl:grid-cols-4">
        <div><span className="font-semibold text-white/85">Amount:</span> {formatCurrency(request.amountSpent)}</div>
        <div><span className="font-semibold text-white/85">Date:</span> {request.purchaseDate}</div>
        <div><span className="font-semibold text-white/85">Category:</span> {request.category}</div>
        <div><span className="font-semibold text-white/85">Job:</span> {request.jobNumber || "N/A"}</div>
        <div><span className="font-semibold text-white/85">Receipt:</span> {request.receiptUploaded ? "Yes" : "No"}</div>
        <div><span className="font-semibold text-white/85">Urgent:</span> {request.urgentReimbursementNeeded ? "Yes" : "No"}</div>
      </div>
    </Link>
  );
}
