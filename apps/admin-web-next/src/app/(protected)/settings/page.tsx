"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useCompany } from "@/app/providers/CompanyProvider";

export default function SettingsPage() {
  const {
    company,
    loading,
    error: companyError,
    saveCompanyName,
  } = useCompany();

  const [companyName, setCompanyName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (company) {
      setCompanyName(company.name);
    }
  }, [company]);

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextName = companyName.trim();

    if (!nextName) {
      setError("Company name is required.");
      setMessage("");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await saveCompanyName(nextName);
      setMessage("Company settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reach API.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-6">
      <div className="shrink-0 rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(249,115,22,0.08),rgba(255,255,255,0.02))] px-7 py-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
        <div className="max-w-3xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-orange-400/80">
            Workspace
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-[2.2rem]">
            Settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
            Company profile and system-level configuration for this BossOS workspace.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="shrink-0 rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 text-white/70 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
          Loading settings...
        </div>
      ) : null}

      {error || companyError ? (
        <div className="shrink-0 rounded-3xl border border-red-500/20 bg-red-500/10 p-5 text-sm font-medium text-red-200">
          {error || companyError}
        </div>
      ) : null}

      {message ? (
        <div className="shrink-0 rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm font-medium text-emerald-200">
          {message}
        </div>
      ) : null}

      {!loading && company ? (
        <div className="min-h-0 flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto pr-1">
            <div className="grid gap-6">
              <div className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
                <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
                  Product
                </div>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-white">
                  BossOS
                </h2>
                <p className="mt-2 text-sm text-white/65 sm:text-base">
                  Multi-division field operations platform.
                </p>
              </div>

              <form
                onSubmit={(e) => void handleSave(e)}
                className="rounded-3xl border border-white/10 bg-[#1a1a1a] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
              >
                <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
                  Company
                </div>

                <div className="mt-4 grid gap-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
                      Company Name
                    </label>
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="h-14 w-full rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
                      placeholder="Enter company name"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
                        Slug
                      </div>
                      <div className="mt-2 text-base font-semibold text-white">
                        {company.slug}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/45">
                        Status
                      </div>
                      <div className="mt-2 text-base font-semibold text-white">
                        {company.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="h-14 rounded-2xl bg-[#fbbf24] px-5 text-base font-black text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {saving ? "Saving..." : "Save Company Settings"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
