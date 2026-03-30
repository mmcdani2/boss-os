"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiJson } from "@/lib/api/client";
import type { Division, DivisionsResponse } from "./_components/types";

function DivisionCard({ division }: { division: Division }) {
  return (
    <Link
      href={`/divisions/${division.id}`}
      className="block rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition hover:border-white/20 hover:bg-white/[0.04]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xl font-black tracking-tight text-white">
            {division.name}
          </div>
          <div className="mt-1 text-sm font-semibold uppercase tracking-[0.18em] text-orange-400">
            {division.key}
          </div>
        </div>

        <div
          className={[
            "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]",
            division.isActive
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-white/10 text-white/55",
          ].join(" ")}
        >
          {division.isActive ? "Active" : "Inactive"}
        </div>
      </div>
    </Link>
  );
}

export default function DivisionsPage() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDivisions() {
      try {
        setLoading(true);
        setError("");
        const data = await apiJson<DivisionsResponse>("/api/divisions");
        setDivisions(Array.isArray(data.divisions) ? data.divisions : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not reach API.");
      } finally {
        setLoading(false);
      }
    }

    void loadDivisions();
  }, []);

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6">
      <div className="shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(255,255,255,0.02))] px-7 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            Organization
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-[2.2rem]">
            Divisions
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
            Review active divisions and drill into module access and division-level settings.
          </p>
        </div>
      </div>

      <div className="shrink-0 rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
          Directory
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">Active divisions</h2>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-1">
          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/70 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
              Loading divisions...
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm font-medium text-red-200">
              {error}
            </div>
          ) : divisions.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/65 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
              No divisions found.
            </div>
          ) : (
            <div className="grid gap-4">
              {divisions.map((division) => (
                <DivisionCard key={division.id} division={division} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
