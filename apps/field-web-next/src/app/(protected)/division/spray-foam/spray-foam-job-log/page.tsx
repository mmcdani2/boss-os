"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import AreaMaterialLineCard from "@/features/spray-foam/components/AreaMaterialLineCard";
import JobHeaderSection from "@/features/spray-foam/components/JobHeaderSection";
import StatusMessage from "@/features/spray-foam/components/StatusMessage";
import SubmitButton from "@/features/spray-foam/components/SubmitButton";
import SuccessPrompt from "@/features/spray-foam/components/SuccessPrompt";
import TotalsSection from "@/features/spray-foam/components/TotalsSection";
import {
  buildNormalizedAreaLines,
  buildNormalizedMaterialLines,
  buildSprayFoamTotals,
  cleanString,
  createInitialState,
  emptyAreaLine,
  emptyMaterialLine,
  type AreaLine,
  type FormState,
  type MaterialLine,
} from "@/features/spray-foam/api";

export default function SprayFoamJobLogPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>(createInitialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);

  const totals = useMemo(() => buildSprayFoamTotals(form), [form]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateAreaLine(index: number, key: keyof AreaLine, value: string) {
    setForm((prev) => ({
      ...prev,
      areaLines: prev.areaLines.map((line, i) =>
        i === index ? { ...line, [key]: value } : line
      ),
    }));
  }

  function updateMaterialLine(
    index: number,
    key: keyof MaterialLine,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      materialLines: prev.materialLines.map((line, i) =>
        i === index ? { ...line, [key]: value } : line
      ),
    }));
  }

  function addAreaLine() {
    setForm((prev) => ({
      ...prev,
      areaLines: [...prev.areaLines, emptyAreaLine()],
      materialLines: [...prev.materialLines, emptyMaterialLine()],
    }));
  }

  function removeAreaLine(index: number) {
    setForm((prev) => {
      if (prev.areaLines.length === 1) {
        return prev;
      }

      return {
        ...prev,
        areaLines: prev.areaLines.filter((_, i) => i !== index),
        materialLines: prev.materialLines.filter((_, i) => i !== index),
      };
    });
  }

  function handleSubmitAnotherLog() {
    setForm(createInitialState());
    setMessage("");
    setError("");
    setShowSuccessPrompt(false);
  }

  function handleReturnToModules() {
    setShowSuccessPrompt(false);
    router.push("/division/spray-foam");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    setShowSuccessPrompt(false);

    const normalizedAreaLines = buildNormalizedAreaLines(form);

    if (normalizedAreaLines.length === 0) {
      setError("Add at least one area line.");
      setLoading(false);
      return;
    }

    const invalidAreaLine = normalizedAreaLines.find(
      (line) =>
        !line.areaName ||
        !line.applicationType ||
        !line.foamType ||
        !line.squareFeet ||
        !line.averageThicknessIn
    );

    if (invalidAreaLine) {
      setError(
        "Each area line needs area name, application type, foam type, square feet, and average thickness."
      );
      setLoading(false);
      return;
    }

    const normalizedMaterialLines = buildNormalizedMaterialLines(form);

    if (normalizedMaterialLines.length === 0) {
      setError("Add at least one material line.");
      setLoading(false);
      return;
    }

    const invalidMaterialLine = normalizedMaterialLines.find(
      (line) =>
        !line.manufacturer ||
        !line.lotNumber ||
        !line.setsUsed ||
        !line.theoreticalYieldPerSet
    );

    if (invalidMaterialLine) {
      setError(
        "Each material line needs manufacturer, lot number, sets used, and theoretical yield per set."
      );
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch("/api/spray-foam-logs", {
        method: "POST",
        body: JSON.stringify({
          companyKey: "urban-spray-foam",
          divisionKey: "spray-foam",
          jobDate: cleanString(form.jobDate),
          customerName: cleanString(form.customerName),
          jobNumber: cleanString(form.jobNumber),
          crewLead: cleanString(form.crewLead),
          helpersText: cleanString(form.helpersText),
          rigName: cleanString(form.rigName),
          timeOnJob: cleanString(form.timeOnJob),
          ambientTempF: form.ambientTempF.trim() || null,
          substrateTempF: form.substrateTempF.trim() || null,
          humidityPercent: form.humidityPercent.trim() || null,
          downtimeMinutes: form.downtimeMinutes.trim() || null,
          downtimeReason: cleanString(form.downtimeReason),
          otherNotes: cleanString(form.otherNotes),
          photosUploadedToHcp: form.photosUploadedToHcp,
          areaLines: normalizedAreaLines,
          materialLines: normalizedMaterialLines,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const nextError =
          typeof data === "object" && data && "error" in data
            ? String((data as { error?: string }).error || "Failed to submit spray foam job log.")
            : "Failed to submit spray foam job log.";
        setError(nextError);
        return;
      }

      setMessage("Spray foam job log submitted.");
      setShowSuccessPrompt(true);
    } catch {
      setError("Could not reach API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex h-full min-h-0 w-full flex-col gap-6">
        <div className="shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(255,255,255,0.02))] px-7 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
              BossOS Field
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-[2.2rem]">
              New Spray Foam Job Log
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
              Log one job, its sprayed areas, and the material usage tied to those areas.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <Link
            href="/division/spray-foam"
            className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            Back to Spray Foam Modules
          </Link>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          <form onSubmit={handleSubmit} className="grid gap-5">
            <JobHeaderSection form={form} updateField={updateField} />

            {form.areaLines.map((line, index) => (
              <AreaMaterialLineCard
                key={index}
                index={index}
                line={line}
                material={form.materialLines[index]}
                lineCount={form.areaLines.length}
                updateAreaLine={updateAreaLine}
                updateMaterialLine={updateMaterialLine}
                removeAreaLine={removeAreaLine}
              />
            ))}

            <button
              type="button"
              onClick={addAreaLine}
              className="h-14 rounded-2xl border border-white/10 bg-white/5 px-5 text-base font-black text-white transition hover:bg-white/10"
            >
              Add Another Area
            </button>

            <TotalsSection totals={totals} />
            <StatusMessage tone="success" message={message} />
            <StatusMessage tone="error" message={error} />
            <SubmitButton loading={loading} />
          </form>
        </div>
      </div>

      <SuccessPrompt
        open={showSuccessPrompt}
        onSubmitAnother={handleSubmitAnotherLog}
        onReturnToModules={handleReturnToModules}
      />
    </>
  );
}
