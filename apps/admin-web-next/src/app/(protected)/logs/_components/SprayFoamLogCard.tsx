"use client";

import Link from "next/link";
import type { SprayFoamLog } from "./types";

function formatFoamTypeLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function SprayFoamLogCard({ log }: { log: SprayFoamLog }) {
  const areaLines = log.areaLines ?? log.lines ?? [];
  const materialLines = log.materialLines ?? [];

  const totalBoardFeet = areaLines.reduce((sum, line) => {
    const value = line.boardFeet ? Number(line.boardFeet) : 0;
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  const totalSetsUsed = materialLines.reduce((sum, line) => {
    const value = line.setsUsed ? Number(line.setsUsed) : 0;
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  const theoreticalTotalYield = materialLines.reduce((sum, line) => {
    const value = line.theoreticalTotalYield ? Number(line.theoreticalTotalYield) : 0;
    return sum + (Number.isFinite(value) ? value : 0);
  }, 0);

  const overallYieldPercent =
    theoreticalTotalYield > 0
      ? ((totalBoardFeet / theoreticalTotalYield) * 100).toFixed(2)
      : "0.00";

  const setsByFoamType = materialLines.reduce<Record<string, number>>((acc, line) => {
    const foamType = line.foamType?.trim();
    const setsUsed = line.setsUsed ? Number(line.setsUsed) : 0;

    if (!foamType || !Number.isFinite(setsUsed)) {
      return acc;
    }

    acc[foamType] = (acc[foamType] || 0) + setsUsed;
    return acc;
  }, {});

  const foamTypeTotals = Object.entries(setsByFoamType).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return (
    <Link
      href={`/logs/${log.id}?type=spray-foam`}
      className="block rounded-2xl border border-white/10 bg-[#141414] p-4 transition hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="font-semibold text-white">{log.customerName || "No customer name"}</div>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-400/80">
            Spray Foam Job Log
          </div>
        </div>

        <div className="inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
          {areaLines.length} {areaLines.length === 1 ? "Area" : "Areas"}
        </div>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-white/65 sm:grid-cols-2 xl:grid-cols-4">
        <div><span className="font-semibold text-white/85">Job Date:</span> {log.jobDate || "N/A"}</div>
        <div><span className="font-semibold text-white/85">Job:</span> {log.jobNumber || "N/A"}</div>
        <div><span className="font-semibold text-white/85">Crew Lead:</span> {log.crewLead || log.techNameSnapshot}</div>
        <div><span className="font-semibold text-white/85">Rig:</span> {log.rigName || "N/A"}</div>
        <div><span className="font-semibold text-white/85">Board Feet:</span> {totalBoardFeet.toFixed(2)}</div>
        <div><span className="font-semibold text-white/85">Sets:</span> {totalSetsUsed.toFixed(2)}</div>
        <div><span className="font-semibold text-white/85">Yield %:</span> {overallYieldPercent}%</div>
      </div>

      {foamTypeTotals.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {foamTypeTotals.map(([foamType, totalSets]) => (
            <div
              key={foamType}
              className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-semibold text-white"
            >
              <span className="text-white/60">{formatFoamTypeLabel(foamType)}:</span>{" "}
              {totalSets.toFixed(2)}
            </div>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
