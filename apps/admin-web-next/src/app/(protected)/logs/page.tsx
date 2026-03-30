"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { apiJson } from "@/lib/api/client";

type Division = {
  id: string;
  companyId: string;
  key: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

type DivisionModuleRow = {
  id: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  module: {
    id: string;
    key: string;
    name: string;
    category: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
};

type ReportModuleItem = {
  key: string;
  name: string;
};

type RefrigerantLog = {
  id: string;
  customerName: string | null;
  refrigerantType: string;
  techNameSnapshot: string;
  jobNumber: string | null;
  city: string | null;
  state: string | null;
  poundsAdded: string | number | null;
  poundsRecovered: string | number | null;
};

type SprayFoamAreaLine = {
  id: string;
  jobLogId: string;
  lineNumber: number;
  areaDescription: string;
  jobType: string;
  foamType: string;
  squareFeet: string | null;
  thicknessInches: string | null;
  boardFeet: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

type SprayFoamMaterialLine = {
  id: string;
  jobLogId: string;
  areaLineId: string;
  lineNumber: number;
  foamType: string;
  manufacturer: string;
  lotNumber: string;
  setsUsed: string | null;
  theoreticalYieldPerSet: string | null;
  theoreticalTotalYield: string | null;
  actualYield: string | null;
  yieldPercent: string | null;
  createdAt: string;
  updatedAt: string;
};

type SprayFoamLog = {
  id: string;
  userId: string;
  companyKey: string;
  divisionKey: string | null;
  techNameSnapshot: string;
  customerName: string | null;
  jobNumber: string | null;
  jobDate: string | null;
  crewLead: string | null;
  helpersText: string | null;
  rigName: string | null;
  timeOnJob: string | null;
  ambientTempF: string | null;
  substrateTempF: string | null;
  humidityPercent: string | null;
  downtimeMinutes: number | null;
  downtimeReason: string | null;
  otherNotes: string | null;
  photosUploadedToHcp: boolean;
  notes: string | null;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  lines: SprayFoamAreaLine[];
  areaLines: SprayFoamAreaLine[];
  materialLines: SprayFoamMaterialLine[];
};

type ReimbursementRequest = {
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

type DivisionsResponse = {
  divisions?: Division[];
};

type DivisionModulesResponse = {
  modules?: DivisionModuleRow[];
};

type RefrigerantLogsResponse = {
  logs?: RefrigerantLog[];
};

type SprayFoamLogsResponse = {
  logs?: SprayFoamLog[];
};

type ReimbursementRequestsResponse = {
  requests?: ReimbursementRequest[];
};

function ReportsDivisionSelect({
  divisions,
  value,
  onChange,
}: {
  divisions: Division[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="shrink-0 rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            Division
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Choose Division</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Pick the division you want to review.
          </p>
        </div>

        <div className="w-full max-w-sm lg:w-[340px]">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-white outline-none transition focus:border-orange-400/60"
          >
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

function formatModuleKeyLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function ReportsModulePanel({
  modules,
  selectedModuleKey,
  onSelectModule,
}: {
  modules: ReportModuleItem[];
  selectedModuleKey: string;
  onSelectModule: (moduleKey: string) => void;
}) {
  return (
    <section className="shrink-0 rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            Report Modules
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">Choose Module</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
            Select the report type you want to review for this division.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const active = selectedModuleKey === module.key;

          return (
            <button
              key={module.key}
              type="button"
              onClick={() => onSelectModule(module.key)}
              className={[
                "rounded-2xl border p-4 text-left transition",
                active
                  ? "border-orange-400/40 bg-orange-500/10"
                  : "border-white/10 bg-[#141414] hover:bg-white/[0.04]",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-white">{module.name}</div>
                  <div className="mt-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                    {formatModuleKeyLabel(module.key)}
                  </div>
                </div>

                <span
                  className={[
                    "inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]",
                    active
                      ? "bg-orange-500/15 text-orange-300"
                      : "bg-white/10 text-white/60",
                  ].join(" ")}
                >
                  {active ? "Open" : "View"}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function RefrigerantLogCard({ log }: { log: RefrigerantLog }) {
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

function formatFoamTypeLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function SprayFoamLogCard({ log }: { log: SprayFoamLog }) {
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

function ReimbursementRequestCard({ request }: { request: ReimbursementRequest }) {
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

function RecordsScroller({ children }: { children: ReactNode }) {
  return (
    <div className="h-full overflow-y-auto pr-1">
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

function RecordsShell({
  title,
  description,
  onBack,
  children,
}: {
  title: string;
  description: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <section className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:p-6">
      <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            Records
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-white/60">{description}</p>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Back
        </button>
      </div>

      <div className="mt-6 min-h-0 flex-1 overflow-hidden">
        {children}
      </div>
    </section>
  );
}

function RefrigerantRecordsPanel({
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

function SprayFoamRecordsPanel({
  divisionKey,
  onBack,
}: {
  divisionKey: string;
  onBack: () => void;
}) {
  const [logs, setLogs] = useState<SprayFoamLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        setError("");
        const params = new URLSearchParams({ divisionKey });
        const data = await apiJson<SprayFoamLogsResponse>(`/api/spray-foam-logs/admin/all?${params.toString()}`);
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
      title="Spray Foam Job Logs"
      description="Review recent spray foam submissions for the selected division."
      onBack={onBack}
    >
      {error ? (
        <div className="shrink-0 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
          Loading spray foam job logs...
        </div>
      ) : logs.length === 0 ? (
        <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/60">
          No spray foam job logs found for this division.
        </div>
      ) : (
        <RecordsScroller>
          {logs.map((log) => (
            <SprayFoamLogCard key={log.id} log={log} />
          ))}
        </RecordsScroller>
      )}
    </RecordsShell>
  );
}

function ReimbursementRequestsPanel({
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

export default function LogsPage() {
  const [divisions, setDivisions] = useState<Division[]>([]);
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [selectedModuleKey, setSelectedModuleKey] = useState("");
  const [modules, setModules] = useState<DivisionModuleRow[]>([]);
  const [loadingDivisions, setLoadingDivisions] = useState(true);
  const [loadingModules, setLoadingModules] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDivisions() {
      try {
        setLoadingDivisions(true);
        setError("");
        const data = await apiJson<DivisionsResponse>("/api/divisions");

        const nextDivisions = Array.isArray(data.divisions)
          ? data.divisions.filter((division) => division.isActive)
          : [];

        setDivisions(nextDivisions);

        if (nextDivisions.length > 0) {
          const hvacDivision = nextDivisions.find((division) => division.key === "hvac");
          setSelectedDivisionId(hvacDivision?.id || nextDivisions[0].id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not reach API.");
      } finally {
        setLoadingDivisions(false);
      }
    }

    void loadDivisions();
  }, []);

  const selectedDivision = useMemo(
    () => divisions.find((division) => division.id === selectedDivisionId) || null,
    [divisions, selectedDivisionId]
  );

  useEffect(() => {
    async function loadDivisionModules() {
      if (!selectedDivisionId) {
        setModules([]);
        setSelectedModuleKey("");
        setLoadingModules(false);
        return;
      }

      try {
        setLoadingModules(true);
        setError("");
        const data = await apiJson<DivisionModulesResponse>(`/api/divisions/${selectedDivisionId}/modules`);
        const nextModules = Array.isArray(data.modules) ? data.modules : [];
        setModules(nextModules);
        setSelectedModuleKey("");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not reach API.");
      } finally {
        setLoadingModules(false);
      }
    }

    void loadDivisionModules();
  }, [selectedDivisionId]);

  const enabledModules = useMemo(
    () => modules.filter((row) => row.isEnabled && row.module.isActive),
    [modules]
  );

  const moduleItems = enabledModules.map((row) => ({
    key: row.module.key,
    name: row.module.name,
  }));

  const showingModulePicker = Boolean(selectedDivision && !selectedModuleKey);
  const showingRefrigerantRecords = selectedModuleKey === "refrigerant-log";
  const showingSprayFoamRecords = selectedModuleKey === "spray-foam-job-log";
  const showingReimbursementRequests = selectedModuleKey === "reimbursement-request";

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6">
      {error ? (
        <div className="shrink-0 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
          {error}
        </div>
      ) : null}

      <div className="shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(255,255,255,0.02))] px-7 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
              Reports
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-[2.2rem]">
              Logs
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
              Choose a division, choose a module, and review the records inside it.
            </p>
          </div>
        </div>
      </div>

      {!loadingDivisions ? (
        <ReportsDivisionSelect
          divisions={divisions}
          value={selectedDivisionId}
          onChange={setSelectedDivisionId}
        />
      ) : (
        <div className="shrink-0 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
          Loading divisions...
        </div>
      )}

      {!loadingDivisions && !error && selectedDivision ? (
        <div className="flex min-h-0 flex-1 flex-col">
          {loadingModules ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/70">
              Loading modules...
            </div>
          ) : null}

          {!loadingModules && enabledModules.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm text-white/60">
              No enabled report modules found for this division.
            </div>
          ) : null}

          {!loadingModules && enabledModules.length > 0 && showingModulePicker ? (
            <ReportsModulePanel
              modules={moduleItems}
              selectedModuleKey={selectedModuleKey}
              onSelectModule={setSelectedModuleKey}
            />
          ) : null}

          {showingRefrigerantRecords && selectedDivision.key ? (
            <RefrigerantRecordsPanel
              divisionKey={selectedDivision.key}
              onBack={() => setSelectedModuleKey("")}
            />
          ) : null}

          {showingSprayFoamRecords && selectedDivision.key ? (
            <SprayFoamRecordsPanel
              divisionKey={selectedDivision.key}
              onBack={() => setSelectedModuleKey("")}
            />
          ) : null}

          {showingReimbursementRequests && selectedDivision.key ? (
            <ReimbursementRequestsPanel
              divisionKey={selectedDivision.key}
              onBack={() => setSelectedModuleKey("")}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}