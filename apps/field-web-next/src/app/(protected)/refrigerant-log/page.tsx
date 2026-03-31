"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api/client";
import JobInfoSection from "@/features/refrigerant-log/components/JobInfoSection";
import RefrigerantInfoSection from "@/features/refrigerant-log/components/RefrigerantInfoSection";
import StatusMessage from "@/features/refrigerant-log/components/StatusMessage";
import SubmitButton from "@/features/refrigerant-log/components/SubmitButton";
import { initialState } from "@/features/refrigerant-log/components/RefrigerantLogFormFields";
import type { FormState } from "@/features/refrigerant-log/components/RefrigerantLogFormFields";

function cleanString(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export default function RefrigerantLogPage() {
  const [form, setForm] = useState<FormState>({
    ...initialState,
    companyKey: "urban-mechanical",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const refrigerantType = form.refrigerantType.trim();
    const poundsAdded = form.poundsAdded.trim();
    const poundsRecovered = form.poundsRecovered.trim();
    const state = form.state.trim().toUpperCase();

    if (!refrigerantType) {
      setError("Refrigerant type is required.");
      setLoading(false);
      return;
    }

    if (!poundsAdded && !poundsRecovered) {
      setError("Enter pounds added or pounds recovered.");
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch("/api/refrigerant-logs", {
        method: "POST",
        body: JSON.stringify({
          companyKey: "urban-mechanical",
          divisionKey: "hvac",
          customerName: cleanString(form.customerName),
          jobNumber: cleanString(form.jobNumber),
          city: cleanString(form.city),
          state: cleanString(state),
          equipmentType: cleanString(form.equipmentType),
          refrigerantType,
          poundsAdded: poundsAdded || null,
          poundsRecovered: poundsRecovered || null,
          leakSuspected: form.leakSuspected,
          notes: cleanString(form.notes),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const nextError =
          typeof data === "object" && data && "error" in data
            ? String((data as { error?: string }).error || "Failed to submit log.")
            : "Failed to submit log.";
        setError(nextError);
        return;
      }

      setMessage("Refrigerant log submitted.");
      setForm({
        ...initialState,
        companyKey: "urban-mechanical",
      });
    } catch {
      setError("Could not reach API.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6">
      <div className="shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(255,255,255,0.02))] px-7 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            BossOS Field
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-[2.2rem]">
            New Refrigerant Log
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
            Enter job details and submit HVAC refrigerant activity from the field.
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <Link
          href="/division/hvac"
          className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          Back to HVAC Modules
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <JobInfoSection form={form} update={update} />
          <RefrigerantInfoSection form={form} update={update} />
          <StatusMessage tone="success" message={message} />
          <StatusMessage tone="error" message={error} />
          <SubmitButton loading={loading} />
        </form>
      </div>
    </div>
  );
}
