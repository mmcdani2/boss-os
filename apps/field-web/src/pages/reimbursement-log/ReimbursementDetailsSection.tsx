import { CATEGORIES, PAYMENT_METHODS, type FormState } from "../../lib/reimbursement-form";

type Props = {
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
};

export default function ReimbursementDetailsSection({ form, update }: Props) {
  return (
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
  );
}
