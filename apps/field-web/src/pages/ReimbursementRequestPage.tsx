import { useState } from "react";
import FieldLayout from "../components/FieldLayout";
import { API_BASE, getStoredToken } from "../lib/auth";

const CATEGORIES = [
  { value: "materials", label: "Materials" },
  { value: "parts", label: "Parts" },
  { value: "fuel", label: "Fuel" },
  { value: "tools", label: "Tools" },
  { value: "meals", label: "Meals" },
  { value: "lodging", label: "Lodging" },
  { value: "misc", label: "Misc" },
];

const PAYMENT_METHODS = [
  { value: "personal-card", label: "Personal Card" },
  { value: "personal-cash", label: "Personal Cash" },
  { value: "other-personal-funds", label: "Other Personal Funds" },
];

type FormState = {
  amountSpent: string;
  purchaseDate: string;
  vendor: string;
  category: string;
  paymentMethod: string;
  purpose: string;
  tiedToJob: boolean;
  jobNumber: string;
  notes: string;
  receiptUploaded: boolean;
  urgentReimbursementNeeded: boolean;
};

function todayValue() {
  return new Date().toISOString().slice(0, 10);
}

function createInitialState(): FormState {
  return {
    amountSpent: "",
    purchaseDate: todayValue(),
    vendor: "",
    category: "",
    paymentMethod: "",
    purpose: "",
    tiedToJob: false,
    jobNumber: "",
    notes: "",
    receiptUploaded: false,
    urgentReimbursementNeeded: false,
  };
}

function cleanString(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export default function ReimbursementRequestPage() {
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
      const token = getStoredToken();

      const res = await fetch(`${API_BASE}/api/reimbursement-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          companyKey: "urban-mechanical",
          divisionKey: "hvac",
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

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Failed to submit reimbursement request.");
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
    <FieldLayout
      kicker="BossOS Field"
      title="Reimbursement Request"
      subtitle="Submit out-of-pocket field purchases for review and reimbursement."
    >
      <form onSubmit={handleSubmit} className="grid gap-5">
        <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-2xl">
          <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
            Purchase
          </div>

          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/80">Amount Spent</span>
              <input
                inputMode="decimal"
                value={form.amountSpent}
                onChange={(e) => update("amountSpent", e.target.value)}
                placeholder="0.00"
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/80">Purchase Date</span>
              <input
                type="date"
                value={form.purchaseDate}
                onChange={(e) => update("purchaseDate", e.target.value)}
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-base text-white outline-none transition focus:border-orange-400/60"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/80">Vendor / Store</span>
              <input
                value={form.vendor}
                onChange={(e) => update("vendor", e.target.value)}
                placeholder="Home Depot, gas station, supply house..."
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
              />
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-2xl">
          <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
            Details
          </div>

          <div className="mt-4 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/80">Category</span>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-base text-white outline-none transition focus:border-orange-400/60"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/80">Payment Method</span>
              <select
                value={form.paymentMethod}
                onChange={(e) => update("paymentMethod", e.target.value)}
                className="h-14 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-base text-white outline-none transition focus:border-orange-400/60"
              >
                <option value="">Select payment method</option>
                {PAYMENT_METHODS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/80">What Was It For?</span>
              <textarea
                value={form.purpose}
                onChange={(e) => update("purpose", e.target.value)}
                placeholder="Explain what was bought and why."
                rows={4}
                className="rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
              />
            </label>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-2xl">
          <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-orange-400">
            Job + Notes
          </div>

          <div className="mt-4 grid gap-4">
            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
              <input
                type="checkbox"
                checked={form.tiedToJob}
                onChange={(e) => update("tiedToJob", e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-semibold text-white/80">Tied to a Job?</span>
            </label>

            {form.tiedToJob ? (
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-white/80">Job Number</span>
                <input
                  value={form.jobNumber}
                  onChange={(e) => update("jobNumber", e.target.value)}
                  placeholder="Enter job number"
                  className="h-14 rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
                />
              </label>
            ) : null}

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-white/80">Additional Notes</span>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                placeholder="Anything accounting or management should know."
                rows={4}
                className="rounded-2xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-base text-white outline-none transition placeholder:text-white/30 focus:border-orange-400/60"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
              <input
                type="checkbox"
                checked={form.receiptUploaded}
                onChange={(e) => update("receiptUploaded", e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-semibold text-white/80">
                Receipt Uploaded?
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
              <input
                type="checkbox"
                checked={form.urgentReimbursementNeeded}
                onChange={(e) => update("urgentReimbursementNeeded", e.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm font-semibold text-white/80">
                Urgent reimbursement needed?
              </span>
            </label>
          </div>
        </div>

        {message ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200">
            {message}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-200">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="h-14 rounded-2xl bg-[#fbbf24] px-5 text-base font-black text-black transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Submitting..." : "Submit Reimbursement Request"}
        </button>
      </form>
    </FieldLayout>
  );
}
