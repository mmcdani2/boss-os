"use client";

import Link from "next/link";
import type { RefrigerantLog } from "./types";

export default function RefrigerantLogCard({ log }: { log: RefrigerantLog }) {
  return (
    <Link
      href={`/logs/${log.id}`}
      className="block rounded-2xl border border-white/10 bg-[#141414] p-4 transition hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-white">{log.customerName || "No customer name"}</div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-400/80">
            {log.refrigerantType}
          </div>
        </div>

        <span className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
          Refrigerant
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-white/65 sm:grid-cols-2 xl:grid-cols-5">
        <div><span className="font-semibold text-white/85">Tech:</span> {log.techNameSnapshot}</div>
        <div><span className="font-semibold text-white/85">Job:</span> {log.jobNumber || "N/A"}</div>
        <div><span className="font-semibold text-white/85">Location:</span> {log.city || "N/A"}{log.state ? ", " + log.state : ""}</div>
        <div><span className="font-semibold text-white/85">Added:</span> {log.poundsAdded ?? "0"}</div>
        <div><span className="font-semibold text-white/85">Recovered:</span> {log.poundsRecovered ?? "0"}</div>
      </div>
    </Link>
  );
}
