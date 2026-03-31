"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api/client";

type RefrigerantLogDetail = {
  id: string;
  customerName: string | null;
  techNameSnapshot: string;
  companyKey: string;
  jobNumber: string | null;
  city: string | null;
  state: string | null;
  equipmentType: string | null;
  refrigerantType: string;
  poundsAdded: string | number | null;
  poundsRecovered: string | number | null;
  leakSuspected: boolean;
  notes: string | null;
  submittedAt: string;
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  const display =
    value !== null && value !== undefined && value !== "" ? value : "N/A";

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
        {label}
      </div>
      <div className="mt-2 text-base font-semibold text-white">{display}</div>
    </div>
  );
}

export default function LogDetailPage() {
  const params = useParams<{ id: string }>();
  const id = typeof params?.id === "string" ? params.id : "";

  const [log, setLog] = useState<RefrigerantLogDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLog() {
      try {
        setLoading(true);
        setError("");

        const res = await apiFetch(`/api/refrigerant-logs/${id}`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const nextError =
            typeof data === "object" && data && "error" in data
              ? String((data as { error?: string }).error || "Failed to load log.")
              : "Failed to load log.";
          setError(nextError);
          return;
        }

        setLog(data.log ?? null);
      } catch {
        setError("Could not reach API.");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      void loadLog();
    }
  }, [id]);

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6">
      <div className="shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(255,255,255,0.02))] px-7 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            BossOS Field
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-[2.2rem]">
            Log Detail
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
            Review refrigerant submission details from the field.
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <Link
          href="/my-logs"
          className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          Back to My Logs
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto pr-1">
          <div className="grid gap-5">
            {loading ? (
              <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/70 shadow-2xl">
                Loading log...
              </div>
            ) : null}

            {error ? (
              <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm font-medium text-red-200">
                {error}
              </div>
            ) : null}

            {!loading && !error && log ? (
              <>
                <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl">
                  <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
                    Submission
                  </div>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
                    {log.customerName || "Unnamed customer"}
                  </h2>
                  <p className="mt-2 text-sm text-white/65 sm:text-base">
                    Refrigerant type:{" "}
                    <span className="font-semibold text-white">
                      {log.refrigerantType}
                    </span>
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <DetailRow label="Log ID" value={log.id} />
                  <DetailRow label="Tech" value={log.techNameSnapshot} />
                  <DetailRow label="Company" value={log.companyKey} />
                  <DetailRow label="Job Number" value={log.jobNumber} />
                  <DetailRow
                    label="Location"
                    value={`${log.city || "N/A"}${log.state ? `, ${log.state}` : ""}`}
                  />
                  <DetailRow label="Equipment Type" value={log.equipmentType} />
                  <DetailRow label="Pounds Added" value={log.poundsAdded} />
                  <DetailRow label="Pounds Recovered" value={log.poundsRecovered} />
                  <DetailRow
                    label="Leak Suspected"
                    value={log.leakSuspected ? "Yes" : "No"}
                  />
                  <DetailRow label="Submitted At" value={log.submittedAt} />
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-2xl">
                  <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
                    Notes
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-base text-white/80">
                    {log.notes || "No notes provided."}
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
