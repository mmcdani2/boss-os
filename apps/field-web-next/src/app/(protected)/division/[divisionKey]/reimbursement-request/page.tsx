"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiFetch } from "@/lib/api/client";
import JobNotesSection from "@/features/reimbursements/components/JobNotesSection";
import PurchaseSection from "@/features/reimbursements/components/PurchaseSection";
import ReimbursementDetailsSection from "@/features/reimbursements/components/ReimbursementDetailsSection";
import StatusMessage from "@/features/reimbursements/components/StatusMessage";
import SubmitButton from "@/features/reimbursements/components/SubmitButton";
import {
  cleanString,
  createInitialState,
  type FormState,
} from "@/features/reimbursements/api";

function getContext(divisionKey?: string) {
  if (divisionKey === "spray-foam") {
    return {
      companyKey: "urban-spray-foam",
      divisionKey: "spray-foam",
      returnPath: "/division/spray-foam",
      returnLabel: "Back to Spray Foam Modules",
    } as const;
  }

  return {
    companyKey: "urban-mechanical",
    divisionKey: "hvac",
    returnPath: "/division/hvac",
    returnLabel: "Back to HVAC Modules",
  } as const;
}

export default function ReimbursementRequestPage() {
  const params = useParams<{ divisionKey: string }>();
  const context = getContext(
    typeof params?.divisionKey === "string" ? params.divisionKey : undefined
  );

  const [form, setForm] = useState<FormState>(createInitialState());
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

    const amountSpent = form.amountSpent.trim();
    const vendor = form.vendor.trim();
    const category = form.category.trim();
    const paymentMethod = form.paymentMethod.trim();
    const purpose = form.purpose.trim();

    if (!amountSpent) {
      setError("Amount spent is required.");
      setLoading(false);
      return;
    }

    if (!form.purchaseDate) {
      setError("Purchase date is required.");
      setLoading(false);
      return;
    }

    if (!vendor) {
      setError("Vendor / Store is required.");
      setLoading(false);
      return;
    }

    if (!category) {
      setError("Category is required.");
      setLoading(false);
      return;
    }

    if (!paymentMethod) {
      setError("Payment method is required.");
      setLoading(false);
      return;
    }

    if (!purpose) {
      setError("What Was It For? is required.");
      setLoading(false);
      return;
    }

    try {
      const res = await apiFetch("/api/reimbursement-requests", {
        method: "POST",
        body: JSON.stringify({
          companyKey: context.companyKey,
          divisionKey: context.divisionKey,
          amountSpent,
          purchaseDate: form.purchaseDate,
          vendor,
          category,
          paymentMethod,
          purpose,
          tiedToJob: form.tiedToJob,
          jobNumber: form.tiedToJob ? cleanString(form.jobNumber) : null,
          notes: cleanString(form.notes),
          receiptUploaded: form.receiptUploaded,
          urgentReimbursementNeeded: form.urgentReimbursementNeeded,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const nextError =
          typeof data === "object" && data && "error" in data
            ? String((data as { error?: string }).error || "Failed to submit reimbursement request.")
            : "Failed to submit reimbursement request.";
        setError(nextError);
        return;
      }

      setMessage("Reimbursement request submitted.");
      setForm(createInitialState());
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
            Reimbursement Request
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60 sm:text-[15px]">
            Submit out-of-pocket field purchases for review and reimbursement.
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <Link
          href={context.returnPath}
          className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          {context.returnLabel}
        </Link>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <PurchaseSection form={form} update={update} />
          <ReimbursementDetailsSection form={form} update={update} />
          <JobNotesSection form={form} update={update} />
          <StatusMessage tone="success" message={message} />
          <StatusMessage tone="error" message={error} />
          <SubmitButton loading={loading} />
        </form>
      </div>
    </div>
  );
}
