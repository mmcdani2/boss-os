"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { apiFetch, apiJson } from "@/lib/api/client";
import DivisionModuleAssignmentsSection from "../_components/DivisionModuleAssignmentsSection";
import QuickEstimateSettingsSection from "../_components/QuickEstimateSettingsSection";
import type {
  DetailView,
  Division,
  DivisionModulePatchResponse,
  DivisionModuleRow,
  DivisionModulesDetailResponse,
  QuickEstimateCalculatorSettings,
  QuickEstimateSettingsPutResponse,
  QuickEstimateSettingsResponse,
} from "../_components/types";

const DEFAULT_LABOR_RATE = "40";
const DEFAULT_PRICING_TIERS = "35, 40, 50";

function parsePricingTierPercentInput(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item) && item > 0 && item < 100)
    .map((item) => item / 100);
}

export default function DivisionDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [division, setDivision] = useState<Division | null>(null);
  const [modules, setModules] = useState<DivisionModuleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState("");
  const [loadingQuickEstimateSettings, setLoadingQuickEstimateSettings] = useState(false);
  const [savingQuickEstimateSettings, setSavingQuickEstimateSettings] = useState(false);
  const [laborRateInput, setLaborRateInput] = useState(DEFAULT_LABOR_RATE);
  const [pricingTiersInput, setPricingTiersInput] = useState(DEFAULT_PRICING_TIERS);
  const [view, setView] = useState<DetailView>("overview");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const enabledModuleCount = useMemo(
    () => modules.filter((row) => row.isEnabled).length,
    [modules]
  );
  const disabledModuleCount = modules.length - enabledModuleCount;

  useEffect(() => {
    async function loadDivisionDetail() {
      if (!id) return;

      try {
        setLoading(true);
        setError("");
        setMessage("");

        const data = await apiJson<DivisionModulesDetailResponse>(`/api/divisions/${id}/modules`);
        setDivision(data.division ?? null);
        setModules(Array.isArray(data.modules) ? data.modules : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not reach API.");
      } finally {
        setLoading(false);
      }
    }

    void loadDivisionDetail();
  }, [id]);

  useEffect(() => {
    async function loadQuickEstimateSettings(divisionId: string) {
      try {
        setLoadingQuickEstimateSettings(true);

        const data = await apiJson<QuickEstimateSettingsResponse>(
          `/api/divisions/${divisionId}/quick-estimate-calculator-settings`
        );

        const settings = data.settings as QuickEstimateCalculatorSettings;
        setLaborRateInput(String(settings.laborRate));
        setPricingTiersInput(
          settings.pricingTiers.map((tier) => String(tier * 100)).join(", ")
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not reach API.");
      } finally {
        setLoadingQuickEstimateSettings(false);
      }
    }

    if (division?.id && division.key === "hvac") {
      void loadQuickEstimateSettings(division.id);
    }
  }, [division?.id, division?.key]);

  async function handleToggle(row: DivisionModuleRow) {
    if (!id) return;

    try {
      setSavingId(row.id);
      setError("");
      setMessage("");

      const response = await apiFetch(`/api/divisions/${id}/modules/${row.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          isEnabled: !row.isEnabled,
        }),
      });

      const data = (await response.json()) as DivisionModulePatchResponse & { error?: string };

      if (!response.ok) {
        setError(data?.error || "Failed to update module.");
        return;
      }

      setModules((prev) =>
        prev.map((item) =>
          item.id === row.id
            ? {
                ...item,
                isEnabled: data.divisionModule.isEnabled,
                updatedAt: data.divisionModule.updatedAt,
              }
            : item
        )
      );

      setMessage(`${row.module.name} ${!row.isEnabled ? "enabled" : "disabled"}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach API.");
    } finally {
      setSavingId("");
    }
  }

  async function handleSaveQuickEstimateSettings(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!division?.id) return;

    const laborRate = Number(laborRateInput.trim());
    const pricingTiers = parsePricingTierPercentInput(pricingTiersInput);

    if (!Number.isFinite(laborRate) || laborRate <= 0) {
      setError("Labor rate must be greater than 0.");
      setMessage("");
      return;
    }

    if (pricingTiers.length === 0) {
      setError("Enter at least one valid pricing tier percentage.");
      setMessage("");
      return;
    }

    try {
      setSavingQuickEstimateSettings(true);
      setError("");
      setMessage("");

      const response = await apiFetch(
        `/api/divisions/${division.id}/quick-estimate-calculator-settings`,
        {
          method: "PUT",
          body: JSON.stringify({
            laborRate,
            pricingTiers,
          }),
        }
      );

      const data = (await response.json()) as QuickEstimateSettingsPutResponse & { error?: string };

      if (!response.ok) {
        setError(data?.error || "Failed to save division settings.");
        return;
      }

      const settings = data.settings as QuickEstimateCalculatorSettings;
      setLaborRateInput(String(settings.laborRate));
      setPricingTiersInput(
        settings.pricingTiers.map((tier) => String(tier * 100)).join(", ")
      );
      setMessage("Division settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach API.");
    } finally {
      setSavingQuickEstimateSettings(false);
    }
  }

  function handleResetQuickEstimateForm() {
    setLaborRateInput(DEFAULT_LABOR_RATE);
    setPricingTiersInput(DEFAULT_PRICING_TIERS);
    setError("");
    setMessage("");
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6">
      <div className="shrink-0 flex flex-wrap gap-3">
        <Link
          href="/divisions"
          className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
        >
          Back to Divisions
        </Link>

        {!loading && division && view === "modules" ? (
          <button
            type="button"
            onClick={() => setView("overview")}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back to Division Detail
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="shrink-0 rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/70 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          Loading division details...
        </div>
      ) : null}

      {error ? (
        <div className="shrink-0 rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm font-medium text-red-200">
          {error}
        </div>
      ) : null}

      {message ? (
        <div className="shrink-0 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm font-medium text-emerald-200">
          {message}
        </div>
      ) : null}

      {!loading && !error && division ? (
        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pr-1">
            {view === "overview" ? (
              <div className="grid gap-6">
                <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(255,255,255,0.02))] px-7 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                  <div className="max-w-3xl">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
                      Division
                    </p>
                    <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-[2.2rem]">
                      {division.name}
                    </h1>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
                      Review this division and the BossOS modules currently mapped to it.
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
                  <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
                    Division
                  </div>
                  <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
                    {division.name}
                  </h2>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
                        Key
                      </div>
                      <div className="mt-2 text-base font-semibold text-white">
                        {division.key}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
                        Status
                      </div>
                      <div className="mt-2 text-base font-semibold text-white">
                        {division.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
                        Modules
                      </div>
                      <div className="mt-2 text-base font-semibold text-white">
                        {modules.length}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setView("modules")}
                  className="block w-full rounded-3xl border border-white/10 bg-[#141414] p-5 text-left shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
                    Module Access
                  </div>
                  <h3 className="mt-3 text-2xl font-black tracking-tight text-white">
                    Division modules
                  </h3>
                  <p className="mt-2 text-sm text-white/65 sm:text-base">
                    Open the module view to manage active and inactive modules for this division.
                  </p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
                        Total
                      </div>
                      <div className="mt-2 text-base font-semibold text-white">
                        {modules.length}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
                        Active
                      </div>
                      <div className="mt-2 text-base font-semibold text-emerald-300">
                        {enabledModuleCount}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
                        Inactive
                      </div>
                      <div className="mt-2 text-base font-semibold text-white">
                        {disabledModuleCount}
                      </div>
                    </div>
                  </div>
                </button>

                {division.key === "hvac" ? (
                  <QuickEstimateSettingsSection
                    loading={loadingQuickEstimateSettings}
                    saving={savingQuickEstimateSettings}
                    laborRateInput={laborRateInput}
                    pricingTiersInput={pricingTiersInput}
                    onChangeLaborRate={setLaborRateInput}
                    onChangePricingTiers={setPricingTiersInput}
                    onSubmit={handleSaveQuickEstimateSettings}
                    onReset={handleResetQuickEstimateForm}
                  />
                ) : null}
              </div>
            ) : (
              <DivisionModuleAssignmentsSection
                division={division}
                modules={modules}
                enabledModuleCount={enabledModuleCount}
                disabledModuleCount={disabledModuleCount}
                savingId={savingId}
                onToggle={handleToggle}
              />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
