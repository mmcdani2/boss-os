"use client";

import { useEffect, useMemo, useState } from "react";
import { apiJson } from "@/lib/api/client";
import RefrigerantRecordsPanel from "./_components/RefrigerantRecordsPanel";
import ReimbursementRequestsPanel from "./_components/ReimbursementRequestsPanel";
import ReportsDivisionSelect from "./_components/ReportsDivisionSelect";
import ReportsModulePanel from "./_components/ReportsModulePanel";
import SprayFoamRecordsPanel from "./_components/SprayFoamRecordsPanel";
import type {
  Division,
  DivisionModuleRow,
  DivisionModulesResponse,
  DivisionsResponse,
} from "./_components/types";

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
